import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import MainLayout from "./mainlayout"; 

import Home from "../pages/Home";
import Certificate from "../pages/Certificate";
import Payment from "../pages/payment";
import Profile from "../pages/profile";
import Contact from "../pages/contact";
import Deliverable from "../pages/deliverable";
import Login from "../pages/login";
import About from "../pages/privacy";
import ProtectedRoutes from "./proctedrouter"; 


export default function MyApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const [formData, setFormData] = useState({});

 
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("userProfileData");
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    
    }
  }, []);

  const handleProfileSave = (updatedData) => {
    setFormData(updatedData);
    try {
      localStorage.setItem("userProfileData", JSON.stringify(updatedData));
     
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
    
    }
  };

  return (
    <> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<About />} />

        
        <Route element={<ProtectedRoutes />}>
          <Route
            element={
              <MainLayout
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={closeSidebar}
                formData={formData}
              />
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/Certificates" element={<Certificate />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/deliverable" element={<Deliverable />} />
            <Route
              path="/profile"
              element={
                <Profile initialData={formData} onSave={handleProfileSave} />
              }
            />
            <Route path="/Contact-Us" element={<Contact />} />
            <Route path="*" element={<div>404 not found</div>} />
          </Route>
        </Route>
      </Routes>

     
    
    </>
  );
}