import { Link, NavLink, useNavigate } from "react-router-dom";
import "./header.css";
import axios from "axios";
import { useEffect, useState } from "react";

function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const usernumber=localStorage.getItem("contact_no")
  const handleLogut = () => {
    localStorage.clear();
    navigate("/login");
  };
  const [profile, setprofile] = useState([]);

  async function apiCall() {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    const profileResponse = await axios.post(
      "https://dev.api-v1.dreambigportal.in/api/my_profile2",
      {
        required: "my_profile_picture",
        token: token,
        user_id: Number(userId),
      }
    );
    setprofile(profileResponse.data.data.picture);
  }
  useEffect(() => {
    apiCall();
  }, []);

  

  return (
    <div>
      <div className="profile-icon">
        <p>{userName || "Guest User"}</p>
        <img src={profile} alt="profile" className="header-profile-img" />
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <img src={profile} alt="profile" className="dropdown-profile-img" />
            <div className="dropdown-user-info">
              <p className="user-name">{userName || "Guest User"}</p>
              <p className="user-detail">
                {usernumber}
              </p>
            </div>
          </div>

          <hr className="dropdown-divider" />

          <Link to="/profile" className="dropdown-link">
            Edit Profile
          </Link>
          <button onClick={handleLogut} className="logout-link">
            logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
