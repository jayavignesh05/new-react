import "./Certificate.css";
import { GoPeople, GoCalendar } from "react-icons/go";
import { FiDownload } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import { GiAchievement } from "react-icons/gi";
import logo from "../assets/certificate.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; 
import Loading from "../components/loading";

function Certificates() {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const completdate = location.state?.end_date;

  function certificateDownload(token, unique_id) {
    const url = `https://dreambigportal.com/public/api/certificate_download.php?JEcYWcmNeh=${token}&user_course_id=${unique_id}`;
    const ur = window.open(url, "_blank");
    return ur;
  }
  const handleDownloadCertificates = async (unique_id) => {
    console.log(unique_id);
    try {
      const url = certificateDownload(token, unique_id);
      const a = document.createElement("a");
      a.href = url;
      a.download = "";
      a.click();
    } catch (error) {
      console.log(error);
    }
  };
  async function apiCall() {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://dev.api-v1.dreambigportal.in/api/get_course_completed_students",
        {
          master_app_id: "5",
          source: "get_course_completed_students",
          token: token,
          user_id: Number(userId),
        }
      );
      setLoading(false);
      setCertificates(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    apiCall();
  }, []);

  if (loading) {
    return (<Loading/>);
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
              <span>March 2024</span>
            </div>
            <div className="card-icon">
              <GiAchievement />
            </div>
          </div>
        </div>
        {certificates.map((item, index) => (
          <div className="certificates-list">
            <div className="certificate-item" key={index}>
              <div className="certificate-image">
                <img src={logo} alt="certificate" height={90} width={120} />
              </div>
              <div className="certificate-details">
                <h3>{item.course_criteria_title_name}</h3>
                <div className="dates">
                  <span>
                    Completed: <strong>{completdate}</strong>
                  </span>

                  <span>
                    Issued: <strong>123</strong>
                  </span>
                </div>
              </div>
              <div className="download-button-container">
                <button
                  className="download-button"
                  onClick={() => handleDownloadCertificates(item.unique_id)}
                >
                  <FiDownload /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Certificates;
