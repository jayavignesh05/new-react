import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/caddcentre.svg";
import { VscHome } from "react-icons/vsc";
import { LuGraduationCap } from "react-icons/lu";
import { BsPerson, BsTelephone, BsSuitcaseLg } from "react-icons/bs";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";
import "./sidebar.css";
import axios from "axios";
import { useEffect, useState } from "react";

const getIcons = (name) => {
  if (name === "My Courses") {
    return <VscHome size={24} />;
  } else if (name === "My Certificates") {
    return <LuGraduationCap size={24} />;
  } else if (name === "My Profile") {
    return <BsPerson size={24} />;
  } else if (name === "Contact Us") {
    return <BsTelephone size={24} />;
  } else if (name === "Privacy Policy") {
    return <MdOutlinePrivacyTip size={24} />;
  } else if (name === "Jobs") {
    return <BsSuitcaseLg size={24} />;
  }
};

// Accept isCollapsed and toggleCollapse props
function Sidebar({ onLinkClick, isCollapsed, toggleCollapse }) {
  const [appVersion, setAppVersion] = useState([]);
  const location = useLocation();

  async function apiCall() {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        "https://api-v1.dreambigportal.in/api/current_app_version",
        {
          token: token,
          source: "master_app_modules",
          master_app_package_name: "lms.caddcentre.com",
        }
      );
      if (response.data?.data?.[0]?.master_app_modules) {
        setAppVersion(response.data.data[0].master_app_modules);
      }
    } catch (error) {
      console.error("Sidebar API call failed:", error);
    }
  }

  useEffect(() => {
    apiCall();
  }, []);

  return (
    <>
      <div className="top-left">
        {isCollapsed ? (
          <button className="sidebar-toggle-btn" onClick={toggleCollapse}>
            <FiMenu size={24} />
          </button>
        ) : (
          <img src={logo} alt="CADD Centre Logo" height={70} />
        )}
        <FaXmark onClick={onLinkClick} className="close-btn" />
      </div>
      <div className="bottom-left">
        <ul>
          {appVersion
            .filter((item) => item.menu_module_name.toLowerCase() !== "jobs")
            .map((item, index) => (
              <li key={index}>
                <NavLink
                  className={({ isActive }) => {
                    let finalIsActive = isActive;
                    if (item.route === "dashboard") {
                      const isDashboardHome = (location.pathname === "/");
                      const isCourseDetailsPage = location.pathname.startsWith('/course-details');
                      if (!finalIsActive) {
                        finalIsActive = isDashboardHome || isCourseDetailsPage;
                      }
                    }
                    return `sidebar-link ${ finalIsActive ? 'active' : '' }`;
                  }}
                  to={`/${item.route}`}
                  onClick={onLinkClick}
                  title={isCollapsed ? item.menu_module_name : undefined}
                >
                  {getIcons(item.menu_module_name)}
                  <span>{item.menu_module_name}</span>
                </NavLink>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;