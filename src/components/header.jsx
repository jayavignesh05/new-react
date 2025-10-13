import { Link, useNavigate } from "react-router-dom";
import "./header.css";
// We must use the ProfileContext to get the progress value and picture
import { useProfile } from "../components/utils/ProfileContext";
import { CircularProgress, Box } from "@mui/material";

function Header() {
  const navigate = useNavigate();

  // Get ALL data from the context. This replaces any local apiCall()
  const { formData, profilePicture, progressValue } = useProfile();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const userName = formData?.first_name || "Guest";
  const userNumber = formData?.contact_no || "";

  return (
    <div className="header-root">
      <div className="profile-icon">
        {/* We keep the username next to the avatar */}
        <p className="header-user-name">{userName}</p>

        {/* This is your new structure, now with correct data and classes */}
        <div className="circular-progress-container">
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            {/* Gray background track */}
            <CircularProgress 
              variant="determinate" 
              value={100} 
              size={50} 
              thickness={3} 
              sx={{ color: '#e0e0e0' }}
            />
            {/* Green progress bar */}
            <CircularProgress 
              variant="determinate" 
              value={progressValue || 0} 
              size={50} 
              thickness={3} 
              sx={{ color: '#4CAF50', position: 'absolute', left: 0 }}
            />
            {/* Box to center the profile image */}
            <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={profilePicture} alt="profile" className="header-profile-img-inside" />
            </Box>
          </Box>
          {/* The percentage label, styled to look like a badge */}
          <span className="circular-progress-label">{`${Math.round(progressValue || 0)}%`}</span>
        </div>
        
        {/* The dropdown menu remains the same */}
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <img src={profilePicture} alt="profile" className="dropdown-profile-img" />
            <div className="dropdown-user-info">
              <p className="user-name">{userName}</p>
              <p className="user-detail">{userNumber}</p>
            </div>
          </div>
          <hr className="dropdown-divider" />
          <Link to="/profile" className="dropdown-link">Edit Profile</Link>
          <button onClick={handleLogout} className="logout-link">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Header;