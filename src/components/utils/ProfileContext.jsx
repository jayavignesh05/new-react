import React, { createContext, useState, useEffect, useMemo, useContext, useCallback } from "react";
import axios from "axios";
import { calculateProfileCompletion } from "./calculations"; 

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [formData, setFormData] = useState(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setError("Authentication details not found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const [profileViewRes, profilePicRes, statusRes] = await Promise.all([
        axios.post("https://dev.api-v1.dreambigportal.in/api/my_profile2", {
          token,
          user_id: Number(userId),
          required: "my_profile_view",
        }),
        axios.post("https://dev.api-v1.dreambigportal.in/api/my_profile2", {
          required: "my_profile_picture",
          token,
          user_id: Number(userId),
        }),
        // SUGGESTION: Fetch statuses at the same time for efficiency
        axios.post("https://dev.api-v1.dreambigportal.in/api/master", {
          source: "get_master_user_current_status",
          token,
        }),
      ]);

      setProfilePicture(profilePicRes.data.data.picture || "");

      if (profileViewRes.data && profileViewRes.data.status === 200) {
        const userData = profileViewRes.data.data;
        const formatApiDate = (dateString) =>
          dateString ? new Date(dateString).toISOString().split("T")[0] : "";
        
        // LOGIC TO FIX "status" field:
        const allStatuses = statusRes.data.data || [];
        const userStatusId = userData.user_current_status_user_current_status_user_idTousers?.[0]?.master_status_id;
        const statusName = allStatuses.find((s) => s.id === userStatusId)?.name || "";

        const userCourse = userData.user_courses_user_courses_user_idTousers?.[0] || {};
        
        // SUGGESTION: Check your API response for work experience data
        // For example: const userExperience = userData.user_experiences?.[0] || {};

        const initialFormData = {
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            master_gender_id: userData.master_gender_id || "",
            date_of_birth: formatApiDate(userData.date_of_birth),
            linkedin_url: userData.linkedin_url || "",
            email_id: userData.email_id || "",
            contact_no: userData.contact_no || "",
            master_country: userData.master_countries?.id || "",
            master_state: userData.master_states?.id || "",
            address: userData.address || "",
            door_no: userData.door_no || "",
            street: userData.street || "",
            area: userData.area || "",
            city: userData.city || "",
            pincode: userData.pincode || "",
            status: statusName, // CORRECTED: Use the matched status name
            institute: userCourse.firm_name || "",
            degree: userCourse.degree_name || "",
            institute_location: userCourse.location || "",
            graduation_date: formatApiDate(userCourse.graduation_date),
            // TODO: Populate these from your work experience object from the API
            company_name: "", 
            designation: "",
            company_location: "",
            joining_date: "",
            current_experience: "",
            total_experience: "",
        };
        setFormData(initialFormData);
        localStorage.setItem("userName", initialFormData.first_name);
        localStorage.setItem("contact_no", initialFormData.contact_no);
      } else {
        setError(profileViewRes.data.message || "Failed to fetch profile data.");
      }
    } catch (err) { // CRITICAL FIX: Changed from catch {} to catch (err)
      console.error("Failed to fetch profile data:", err); // Log the actual error for debugging
      setError("An error occurred. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const progressValue = useMemo(() => {
    if (!formData) return 0;
    return calculateProfileCompletion(formData);
  }, [formData]);

  const value = {
    formData,
    setFormData,
    profilePicture,
    progressValue,
    isLoading,
    error,
    refreshProfileData: fetchProfileData,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};