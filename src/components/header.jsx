import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import { useProfile } from "../components/utils/ProfileContext.jsx";
import { CircularProgress, Box } from "@mui/material";

function Header() {
  const navigate = useNavigate();

  // Get ALL data from the context, including isLoading and error
  const { formData, profilePicture, progressValue, isLoading, error } = useProfile();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ==================================================================
  // THE FIX: Check for loading and error states at the TOP of the component.
  // This is called an "early return" pattern.
  // ==================================================================

  // If data is still being fetched, return a simple placeholder.
  if (isLoading) {
    return (
      <div className="header-root">
        <div className="profile-icon">
          <p className="header-user-name">Loading...</p>
          <div className="circular-progress-container" style={{ height: '65px' }}>
            {/* You can show a spinner here if you want */}
          </div>
        </div>
      </div>
    );
  }

  // If there was an error, show an error message.
  if (error) {
    return (
      <div className="header-root">
        <div className="profile-icon">
          <p className="header-user-name">Error</p>
        </div>
      </div>
    );
  }

  // This code below will ONLY run if isLoading is false and there is no error.
  const userName = formData?.first_name || "Guest";
  const userNumber = formData?.contact_no || "";

  return (
    <div className="header-root">
      <div className="profile-icon">
        <p className="header-user-name">{userName}</p>

        <div className="circular-progress-container">
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress 
              variant="determinate" 
              value={100} 
              size={50} 
              thickness={3} 
              sx={{ color: '#e0e0e0' }}
            />
            <CircularProgress 
              variant="determinate" 
              value={progressValue || 0} 
              size={50} 
              thickness={3} 
              sx={{ color: '#4CAF50', position: 'absolute', left: 0 }}
            />
            <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={profilePicture} alt="profile" className="header-profile-img-inside" />
            </Box>
          </Box>
          <span className="circular-progress-label">{`${Math.round(progressValue || 0)}%`}</span>
        </div>
        
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