// src/header.jsx

import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./header.css"; 
import { useProfile } from "../components/utils/ProfileContext.jsx";
import { CircularProgress, Box } from "@mui/material";
import logo from "../assets/caddcentre.svg"; 

function Header({ isSidebarCollapsed }) {
  const navigate = useNavigate();
  const {  formData,profilePicture, progressValue, isLoading, error } = useProfile();
  
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  useEffect(() => {
    if (!isLoading && formData && Object.keys(formData).length > 0 && !isInitialLoadComplete) {
      setIsInitialLoadComplete(true);
    }
  }, [isLoading, formData, isInitialLoadComplete]);


  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // FIX: Check for multiple possible keys for userName
  const userName = formData?.first_name || formData?.name || "Guest"; 
  const userNumber = formData?.contact_no || "";
  const displayPicture = profilePicture || "default-profile.png"; 
  const displayProgress = progressValue || 0;
  
  // --- Loading State ---
  if (!isInitialLoadComplete && isLoading) {
    return (
      // Apply conditional class to root
      <div className={`header-root ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {isSidebarCollapsed && (
           <img src={logo} alt="Logo" className="header-logo" />
        )}
        <div className="profile-icon">
          <p className="header-user-name">Loading...</p>
          <div className="circular-progress-container" style={{ height: '65px', width: '50px' }}>
             <CircularProgress size={30} thickness={4} sx={{color: '#ccc'}} />
          </div>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error && !isInitialLoadComplete) {
    return (
      <div className={`header-root ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {isSidebarCollapsed && (
           <img src={logo} alt="Logo" className="header-logo" />
        )}
        <div className="profile-icon">
          <p className="header-user-name">Error</p>
        </div>
      </div>
    );
  }

  // This is the complete profile icon block
  const ProfileIconBlock = (
    <div className="profile-icon">
      <p className="header-user-name">{userName}</p> 
      <div className="circular-progress-container">
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate" value={100} size={50} thickness={3}
            sx={{ color: '#e0e0e0' }}
          />
          <CircularProgress
            variant="determinate" value={displayProgress} size={50} thickness={3}
            sx={{ color: '#4CAF50', position: 'absolute', left: 0 }}
          />
          <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={displayPicture} alt="profile" className="header-profile-img-inside" />
          </Box>
        </Box>
        <span className="circular-progress-label">{`${Math.round(displayProgress)}%`}</span>
      </div>

      {/* Dropdown Menu */}
      <div className="profile-dropdown">
        <div className="dropdown-header">
          <img src={displayPicture} alt="profile" className="dropdown-profile-img" />
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
  );


  return (
    // Add conditional class to the root element
    <div className={`header-root ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      
      {/* 1. Logo (appears only when sidebar is collapsed) */}
      {isSidebarCollapsed && (
        <img src={logo} alt="CADD Centre Logo" className="header-logo" />
      )}

      {/* 2. Profile Icon (always rendered) */}
      {ProfileIconBlock}
    </div>
  );
}

export default Header;