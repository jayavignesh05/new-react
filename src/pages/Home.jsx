import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { AiFillBank } from "react-icons/ai";
import { MdFeedback } from "react-icons/md";
import Loading from "../components/loading"; 
import { useSnackbar } from "../components/SnackbarProvider";
import "./home.css";

// Icons
import {
  LuGraduationCap,
  LuClipboardCheck,
  LuBook,
  LuVideo,
  LuFlaskConical,
  LuFileQuestion,
  LuUsers,
  LuLink,
  LuPlus,
} from "react-icons/lu";

// ===================================
// === HELPER FUNCTIONS (Non-Component) ===
// ===================================

const calculateCourseProgress = (startDateString, endDateString, status) => {
  if (status === "Completed") return 100;
  if (!startDateString || !endDateString) return 0;

  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  const today = new Date();

  if (today < startDate) return 0;
  if (today >= endDate) return 100;

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedTime = today.getTime() - startDate.getTime();

  if (totalDuration === 0) return 100;

  const progress = (elapsedTime / totalDuration) * 100;
  return Math.max(0, Math.min(progress, 100));
};

function certificateDownload(token, unique_id) {
  const url = `https://dreambigportal.com/public/api/certificate_download.php?JEcYWcmNeh=${token}&user_course_id=${unique_id}`;
  return url;
}

const getStatusClass = (status) => {
  switch (status) {
    case "In Progress":
      return "inprogress";
    case "Completed":
    case "Payment not Started":
    case "Closed":
      return "completed";
    default:
      return "other";
  }
};

const getEnabledAddons = (course) => {
  const enabled = {
    syllabus: false,
    ebook: false,
    video: false,
    lab: false,
    quiz: false,
    interview: false,
    links: false,
    more: false,
  };

  if (!course.deliverables || !Array.isArray(course.deliverables)) {
    return enabled;
  }

  course.deliverables.forEach((deliverable) => {
    if (deliverable.addons && Array.isArray(deliverable.addons)) {
      deliverable.addons.forEach((addon) => {
        if (
          addon.name === "Expert Video Session" ||
          addon.name === "FTR - Session Videos"
        ) {
          enabled.video = true;
        }
      });
    }

    if (
      deliverable.user_course_payment_deliverables &&
      Array.isArray(deliverable.user_course_payment_deliverables)
    ) {
      deliverable.user_course_payment_deliverables.forEach((item) => {
        if (item.course_deliverable_type_name === "E-Learning Guide") {
          enabled.ebook = true;
        }
      });
    }
  });

  // Assuming syllabus is enabled if there are any deliverables
  if (course.deliverables && course.deliverables.length > 0) {
      enabled.syllabus = false;
  }

  return enabled;
};

const isCompleteForCourse = (master_certificate_id, pending_amount) => {
  return master_certificate_id !== 3 || pending_amount === 0;
};

const isEnable = (master_course_enrollment_source_id, master_learner_type_id) => {
  return (
    master_course_enrollment_source_id !== 3 &&
    ![2, 3].includes(master_learner_type_id)
  );
};

const isCompleteForActions = (
  master_certificate_id,
  master_learner_type_id
) => {
  return (
    master_certificate_id !== 3 &&
    master_learner_type_id !== 3 &&
    master_certificate_id === 7 // Assuming 7 enables certificate download
  );
};

const getFeedbackStatus = (master_certificate_id, course_id, course_title) => {
  // 5: Completed (Enabled for feedback), 7: Feedback Submitted
  const isCompleted =
    master_certificate_id === 5 || master_certificate_id === 7;
  const isSubmitted = master_certificate_id === 7;
  const isEnabled = master_certificate_id === 5;

  const state = {
    id: course_id,
    coure_title: course_title,
  };

  const reasons = [];

  if (isSubmitted) {
    reasons.push({
      message: "You have already submitted the feedback",
      type: "success",
    });
  } else if (!isCompleted) {
    reasons.push({
      message: "Course not Completed yet",
      type: "error",
    });
  }

  return { isSubmitted, isEnabled, state, reasons };
};

// ===================================
// === COMPONENTS ===
// ===================================

/**
 * Reusable button for course actions (Payment, Feedback, Certificate).
 */
const ActionButton = ({
  icon,
  label,
  to,
  state,
  disabled = false,
  variant = "",
  onClick = null,
}) => {
  const IconComponent = icon;

  const className = `action-button ${disabled ? "disabled" : ""} ${
    variant ? `action-button--${variant}` : ""
  }`;

  const content = (
    <>
      <IconComponent size={18} />
      <span>{label}</span>
    </>
  );

  if (disabled) {
    return <div className={className}>{content}</div>;
  }

  if (onClick) {
    return (
      <NavLink onClick={onClick} className={className}>
        {content}
      </NavLink>
    );
  }

  return (
    <NavLink to={to} state={state} className={className}>
      {content}
    </NavLink>
  );
};

/**
 * Reusable button for resource links (Syllabus, E-book, etc.).
 */
const IconLink = ({ icon, label, to, state, disabled = false }) => {
  const IconComponent = icon;
  const className = `icon-link ${disabled ? "disabled" : ""}`;
  const content = (
    <div className="icon-link-content">
      <div className="icon-link-box">
        <IconComponent size={24} />
      </div>
      <span className="icon-link-label">{label}</span>
    </div>
  );

  if (disabled) {
    return <div className={className}>{content}</div>;
  }

  return (
    <NavLink to={to} state={state} className={className}>
      {content}
    </NavLink>
  );
};

/**
 * Displays an individual course with progress, status, and action buttons.
 */
function CourseCard({ course, progress }) {
  const { showSnackbar } = useSnackbar();

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const formattedDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const handleDownloadCertificates = () => {
    const token = localStorage.getItem("authToken");
    const unique_id = course.id;

    if (!token || !unique_id) {
      showSnackbar("Error: Missing login token or course ID.", "error");
      return;
    }

    try {
      const url = certificateDownload(token, unique_id);
      const a = document.createElement("a");
      a.href = url;
      a.download = "";
      a.click();
      a.remove();
    } catch {
      showSnackbar("Certificate download failed.", "error");
    }
  };

  const handleFeedbackClick = (e) => {
    const { isEnabled, isSubmitted, reasons } = getFeedbackStatus(
      course.master_certificate_id,
      course.id,
      course?.course_criteria_title_name
    );

    if (isEnabled && !isSubmitted) {
      return;
    }

    if (e && e.preventDefault) {
      e.preventDefault(); // Stop NavLink from routing
    }

    if (reasons.length > 0) {
      showSnackbar(reasons[0].message, reasons[0].type);
    }
  };

  const startDate = formattedDate(course.start_date);
  const endDate = formattedDate(course.end_date);
  const status = course.master_certificate_name;

  const isCertificateCompleted = isCompleteForActions(
    course.master_certificate_id,
    course.master_learner_type_id
  );
  const isCourseComplete = isCompleteForCourse(
    course.master_certificate_id,
    course.pending_amount
  );
  const isCourseEnabled = isEnable(
    course.master_course_enrollment_source_id,
    course.master_learner_type_id
  );

  const feedbackStatus = getFeedbackStatus(
    course.master_certificate_id,
    course.id,
    course?.course_criteria_title_name
  );

  const isFeedbackDisabled =
    !feedbackStatus.isEnabled && !feedbackStatus.isSubmitted;

  // Determine Payment Button Variant
  let paymentButtonVariant = "";
  if (isCourseEnabled && isCourseComplete) {
    paymentButtonVariant = "green";
  } else if (isCourseEnabled) {
    paymentButtonVariant = "blue";
  }

  // Determine Feedback Button Variant
  let feedbackButtonVariant = "";
  if (feedbackStatus.isSubmitted) {
    feedbackButtonVariant = "green";
  } else if (feedbackStatus.isEnabled) {
    feedbackButtonVariant = "blue";
  }

  const progressPercent = Math.round(progress);
  const addons = getEnabledAddons(course);
  const hasEnabledAddons = Object.values(addons).some(
    (isEnabled) => isEnabled === true
  );

  const headerContent = (
    <div className="card-header">
      <div className="card-header-top">
        <h3 className="card-title">{course.course_criteria_title_name}</h3>
        <span className={`status-badge ${getStatusClass(status)}`}>
          {status}
        </span>
      </div>
      <div className="card-info">
        <div>
          <span>Duration</span> {course.duration} Hrs
        </div>
        <div>
          <span>Dates</span> {startDate} - {endDate}
        </div>
      </div>
    </div>
  );

  return (
    <div className="course-cards">
      {hasEnabledAddons ? (
        <NavLink
          to={`/course-details/${course.id}`}
          state={{ courseData: course }}
          className="card-header-link"
        >
          {headerContent}
        </NavLink>
      ) : (
        <div className="card-header-link">{headerContent}</div>
      )}

      <div className="progress-section">
        <div className="progress-text">
          {progressPercent === 100 ? (
            <span className="label congrats">
              Congratulations! You've finished the course
            </span>
          ) : (
            <span className="label">Progress</span>
          )}
          <span className="percentage">{progressPercent}%</span>
        </div>
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 13,
            borderRadius: 5,
            backgroundColor: "#f1f1f1",
            "& .MuiLinearProgress-bar": {
              backgroundColor:
                progressPercent === 100 || status === "Closed"
                  ? "var(--color-green, #28a745)"
                  : "#1976d2",
            },
          }}
        />
      </div>

      <div className="action-buttons-container">
        <div className="action-buttons-flex">
          <ActionButton
            icon={AiFillBank}
            label="Payment"
            to="/payment"
            state={{
              user_course_id: course.id,
              courses: course.course_criteria_title_name,
            }}
            variant={paymentButtonVariant}
            disabled={!isCourseEnabled}
          />
          <ActionButton
            icon={MdFeedback}
            label="Feedback"
            to="/feedback"
            state={{ user_course_id: course.id, coure_title: course?.course_criteria_title_name }}
            variant={feedbackButtonVariant}
            onClick={
              !feedbackStatus.isEnabled || feedbackStatus.isSubmitted
                ? handleFeedbackClick
                : undefined
            }
            disabled={isFeedbackDisabled}
          />
          <ActionButton
            icon={LuGraduationCap}
            label="Certificate"
            to=""
            onClick={
              isCertificateCompleted ? handleDownloadCertificates : undefined
            }
            state={{ user_course_id: course.id }}
            variant={paymentButtonVariant}
            disabled={!isCertificateCompleted}
          />
        </div>
      </div>

      <div className="icon-links-grid">
        <IconLink
          icon={LuClipboardCheck}
          label="Syllabus"
          to={`/course-details/${course.id}`}
          state={{ courseData: course, defaultTab: "syllabus" }}
          disabled={!addons.syllabus}
        />
        <IconLink
          icon={LuBook}
          label="e-book"
          to={`/course-details/${course.id}`}
          state={{ courseData: course, defaultTab: "ebook" }}
          disabled={!addons.ebook}
        />
        <IconLink
          icon={LuVideo}
          label="Videos"
          to={`/course-details/${course.id}`}
          state={{ courseData: course, defaultTab: "video" }}
          disabled={!addons.video}
        />
        <IconLink
          icon={LuFlaskConical}
          label="Lab Exercises"
          to={`/course-details/${course.id}`}
          state={{ courseData: course, defaultTab: "lab" }}
          disabled={!addons.lab}
        />
        <IconLink
          icon={LuFileQuestion}
          label="Quiz"
          to={`/course-details/${course.id}`}
          state={{ courseData: course, defaultTab: "quiz" }}
          disabled={!addons.quiz}
        />
        <IconLink
          icon={LuUsers}
          label="Interview"
          to={`/course-details/${course.id}`}
          state={{ courseData: course, defaultTab: "interview" }}
          disabled={!addons.interview}
        />
        <IconLink
          icon={LuLink}
          label="Ref. Links"
          to={`/course-details/${course.id}`}
          state={{ courseData: course, defaultTab: "links" }}
          disabled={!addons.links}
        />
        <IconLink
          icon={LuPlus}
          label="View More"
          to="#"
          disabled={!addons.more}
        />
      </div>
    </div>
  );
}

/**
 * Navigation tabs for filtering courses.
 */
const CourseTabs = ({ activeTab, onTabClick, counts }) => {
  const tabs = [
    { id: "all", label: "All Courses", count: counts.all },
    { id: "inprogress", label: "In Progress", count: counts.inprogress },
    { id: "completed", label: "Completed", count: counts.completed },
  ];

  return (
    <nav className="course-tabs-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={`tab-in-button ${activeTab === tab.id ? "active" : ""}`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </nav>
  );
};

/**
 * Main component to fetch and display the course dashboard.
 */
function Home() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  async function apiCall() {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        "https://api-v5.dreambigportal.in/pub/public_api",
        {
          source: "my_course_details",
          master_role_id: 2,
          token: token,
        }
      );
      setDashboardData(response.data.data.courses || []);
    } catch {
      setDashboardData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    apiCall();
  }, []);

  const filteredCourses = dashboardData.filter((course) => {
    const status = course.master_certificate_name;
    if (activeTab === "all") return true;
    if (activeTab === "inprogress") return status === "In Progress";
    if (activeTab === "completed") return status === "Completed" || status === "Closed";
    return false;
  });

  const tabCounts = {
    all: dashboardData.length,
    inprogress: dashboardData.filter(
      (c) => c.master_certificate_name === "In Progress"
    ).length,
    completed: dashboardData.filter(
      (c) => c.master_certificate_name === "Completed" || c.master_certificate_name === "Closed"
    ).length,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="my-courses-page">
      <CourseTabs
        activeTab={activeTab}
        onTabClick={setActiveTab}
        counts={tabCounts}
      />

      <div className="course-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((item) => {
            const progressPercent = calculateCourseProgress(
              item.start_date,
              item.end_date,
              item.master_certificate_name
            );

            return (
              <CourseCard
                key={item.id}
                course={item}
                progress={progressPercent}
              />
            );
          })
        ) : (
          <div className="no-courses-found">
            <h3>No courses found</h3>
            <p>There are no courses to display in this section.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;