import React from "react";
import { NavLink } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { AiFillBank } from "react-icons/ai";
import { MdFeedback } from "react-icons/md";
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

function certificateDownload(token, unique_id) {
  const url = `https://dreambigportal.com/public/api/certificate_download.php?JEcYWcmNeh=${token}&user_course_id=${unique_id}`;
  return url;
}

const getStatusClass = (status) => {
  switch (status) {
    case "In Progress":
      return "inprogress";
    case "Completed":
      return "completed";
    case "Payment not Started":
    case "Closed":
      return "completed";
    default:
      return "other";
  }
};

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

  return enabled;
};

const isEnable = (masterCourseEnrollmentSourceId, masterLearnerTypeId) => {
  return (
    masterCourseEnrollmentSourceId !== 3 &&
    ![2, 3].includes(masterLearnerTypeId)
  );
};

const isCompleteForActions = (
  master_certificate_id,
  master_learner_type_id
) => {
  return (
    master_certificate_id !== 3 &&
    master_learner_type_id !== 3 &&
    master_certificate_id === 7
  );
};

function CourseCard({ course, progress }) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
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
      console.error("Missing token or course ID for certificate download.");
      return;
    }

    try {
      const url = certificateDownload(token, unique_id);
      const a = document.createElement("a");
      a.href = url;
      a.download = "";
      a.click();
      a.remove();
    } catch (error) {
      console.error("Certificate download failed:", error);
    }
  };

  const startDate = formattedDate(course.start_date);
  const endDate = formattedDate(course.end_date);
  const status = course.master_certificate_name;

  const isCompleted = isCompleteForActions(
    course.master_certificate_id,
    course.master_learner_type_id
  );

  const isCourseEnabled = isEnable(
    course.master_course_enrollment_source_id,
    course.master_learner_type_id
  );

  let paymentButtonVariant = "";
  if (isCourseEnabled) {
    paymentButtonVariant = "green";
  } else {
    paymentButtonVariant = "blue";
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
          {progressPercent === 100  ? (
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
                isCompleted || status === "Closed"
                  ? "var(--color-green)"
                  : "var(--color-blue)",
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
            to=""
            state={{ user_course_id: course.id }}
            disabled={!isCompleted}
          />
          <ActionButton
            icon={LuGraduationCap}
            label="Certificate"
            to=""
            onClick={isCompleted ? handleDownloadCertificates : undefined}
            state={{ user_course_id: course.id }}
            disabled={!isCompleted}
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

export default CourseCard;
