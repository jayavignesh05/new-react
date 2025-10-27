import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/loading";
import CourseCard from "../components/CourseCard";
import "./home.css";

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
    } catch (error) {
      console.log(error);
      setDashboardData([]); // Set to empty array on error
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