import { NavLink } from "react-router-dom";
import logo from "../assets/caddcentre.svg";
import { VscHome } from "react-icons/vsc";
import { LuGraduationCap } from "react-icons/lu";
import { BsPerson, BsTelephone } from "react-icons/bs";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import "./side.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { BsSuitcaseLg } from "react-icons/bs";
import { useLocation } from "react-router-dom";

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

function Lsidebar({ onLinkClick }) {
  const [appVersion, setAppVersion] = useState([]);
  const location = useLocation();

  async function apiCall() {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
      "https://dev.api-v1.dreambigportal.in/api/current_app_version",
      {
         token: token,
        source: "master_app_modules",
        master_app_package_name: "dev.lms.dreambigportal.com",
      }
    );

    setAppVersion(response.data.data[0].master_app_modules);
  }

  useEffect(() => {
    apiCall();
  }, []);

  

  return (
    <div>
      <div className="top-left">
        <img src={logo} alt="CADD Centre Logo" height={70} />
        <FaXmark onClick={onLinkClick} className="close-btn" />
      </div>
      <div className="bottom-left">
        <ul>
          {appVersion.filter((item)=>item.menu_module_name.toLowerCase() !== 'jobs').map((item, index) => (
            <li key={index}>
              <NavLink
                className="sidebar-link"
                style={
                  location.pathname === `/${item.route}`|| location.pathname ==="/" && item.route ==="dashboard"
                    ? { fontWeight: "500", background: "#ff000079",color:"white" }
                    : {}
                }
                to={`/${item.route}`}
                onClick={onLinkClick}
              >
                {getIcons(item.menu_module_name)}
                {item.menu_module_name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Lsidebar;
