// src/pages/Certificates.jsx

import "./Certificate.css";
import { FiDownload } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import { GiAchievement } from "react-icons/gi";
import logo from "../assets/certificate.png";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";

import Loading from "../components/loading";

function Certificates() {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- HELPER: Date Formatting Function ---
  const formattedDate = (dateString) => {
    if (!dateString) return "--";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "--";
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      // Log the parsing error for debugging and return fallback
      console.error("formattedDate parse error:", err);
      return "--";
    }
  };

  function certificateDownload(token, unique_id) {
    const url = `https://dreambigportal.com/public/api/certificate_download.php?JEcYWcmNeh=${token}&user_course_id=${unique_id}`;
    return url;
  }

  const handleDownloadCertificates = async (unique_id) => {
    if (!token) {
      console.error("Authentication token missing.");
      return;
    }
    try {
      const url = certificateDownload(token, unique_id);
      const a = document.createElement("a");
      a.href = url;
      a.download = ""; // Prompts download
      a.click();
      a.remove(); // Clean up the element
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  async function apiCall() {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api-v1.dreambigportal.in/api/get_course_completed_students",
        {
          master_app_id: "5",
          source: "get_course_completed_students",
          token: token,
          user_id: Number(userId),
        }
      );
      setCertificates(response.data.data || []);
    } catch (error) {
      console.error("API call failed:", error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    apiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- LOGIC: Find the end date of the latest completed course (Last Achievement) ---
  const lastAchievementDate = useMemo(() => {
    if (!certificates || certificates.length === 0) {
      return "--";
    }

    const sortedCertificates = [...certificates].sort((a, b) => {
      // Prioritize the actual approved date for achievement tracking
      const dateA = new Date(
        a.certificate_approved_at || a.end_date || a.created_at
      );
      const dateB = new Date(
        b.certificate_approved_at || b.end_date || b.created_at
      );
      // Sort Descending (Newest date first)
      return dateB.getTime() - dateA.getTime();
    });

    const latestCourse = sortedCertificates[0];
    // Use the latest approved date for the summary card
    return formattedDate(
      latestCourse.certificate_approved_at ||
        latestCourse.end_date ||
        latestCourse.created_at
    );
  }, [certificates]);
  // --- END LOGIC ---

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="main-certificates">
      <div className="certificates-container">
        <div className="certificates-header">
          <h1>Certificates</h1>
          <p>Download And Share Your Course Completion Certificates</p>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-content">
              <h2>Total Certificates</h2>
              <span>{certificates.length}</span>
            </div>
            <div className="card-icon">
              <FaGraduationCap />
            </div>
          </div>
          <div className="summary-card">
            <div className="card-content">
              <h2>Last Achievement</h2>
              <span>{lastAchievementDate}</span>
            </div>
            <div className="card-icon">
              <GiAchievement />
            </div>
          </div>
        </div>

        {/* --- LIST RENDERING --- */}
        {certificates.map((item, index) => (
          // Key fix applied here
          <div
            className="certificates-list"
            key={item.user_course_id || item.id || index}
          >
            <div className="certificate-item">
              <div className="certificate-image">
                <img src={logo} alt="certificate" height={90} width={120} />
              </div>
              <div className="certificate-details">
                <h3>{item.course_criteria_title_name}</h3>
                <div className="dates">
                  <span>
                    Issued:{" "}
                    <strong>
                      {formattedDate(
                        item.certificate_approved_at || item.end_date
                      )}
                    </strong>
                  </span>
                </div>
              </div>
              <div className="download-button-container">
                <button
                  className="download-button"
                  onClick={() =>
                    handleDownloadCertificates(item.user_course_id || item.id)
                  }
                >
                  <FiDownload /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* --- END LIST RENDERING --- */}
      </div>
    </div>
  );
}

export default Certificates;
