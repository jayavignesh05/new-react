import React, { createContext, useState, useEffect, useMemo, useContext, useCallback } from "react";
import axios from "axios";
import { calculateProfileCompletion } from "./calculations"; 
import { useLocation } from "react-router-dom";
const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [formData, setFormData] = useState(null);
  const [profilePicture, setProfilePicture] = useState("");
  // State to hold all dropdown options
  const [dropdownData, setDropdownData] = useState({
    countries: [], states: [], statuses: [], genders: [],
    institutes: [], degrees: [], companies: [], designations: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // This function is now the central place to fetch ALL profile data
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
      // Fetching all data in parallel for best performance
      const [
        profileViewRes,
        careerHistoryRes,
        profilePicRes,
        statusRes,
        genderRes,
        institutesRes,
        degreesRes,
        companiesRes,
        designationsRes
      ] = await Promise.all([
        // Personal and communication details
        axios.post("https://api-v1.dreambigportal.in/api/my_profile2", { token, user_id: Number(userId), required: "my_profile_view" }),
        // Academic and professional history
        axios.post("https://api-v5.dreambigportal.in/pub/public_api", { source: "get_profile", user_id: Number(userId), token }),
        // Profile picture
        axios.post("https://api-v5.dreambigportal.in/api/my_profile2", { required: "my_profile_picture", token, user_id: Number(userId) }),
        // Dropdown options start here
        axios.post("https://api-v1.dreambigportal.in/api/master", { source: "get_master_user_current_status", token }),
        axios.post("https://api-v1.dreambigportal.in/api/my_profile", { required: "gender_list", token }),
        axios.post("https://api-v1.dreambigportal.in/pub/public_api", { source: "load_career_data", type: 1, org_type: 1, current_company_code: "91BS001", user_id: Number(userId), token }),
        axios.post("https://api-v1.dreambigportal.in/pub/public_api", { source: "load_career_data", type: 3, current_company_code: "91BS001", user_id: Number(userId), token }),
        axios.post("https://api-v1.dreambigportal.in/pub/public_api", { source: "load_career_data", type: 1, org_type: 2, current_company_code: "91BS001", user_id: Number(userId), token }),
        axios.post("https://api-v1.dreambigportal.in/pub/public_api", { source: "load_career_data", type: 2, current_company_code: "91BS001", user_id: Number(userId), token }),
      ]);

      setProfilePicture(profilePicRes?.data?.data?.picture || "");

      // Storing all dropdown data in state
      setDropdownData({
        countries: profileViewRes?.data?.countries_list || [],
        states: profileViewRes?.data?.state_list || [],
        statuses: statusRes?.data?.data || [],
        genders: genderRes?.data?.data || [],
        institutes: institutesRes?.data?.data || [],
        degrees: degreesRes?.data?.data || [],
        companies: (companiesRes?.data?.data || []).filter(c => c.text && c.text.trim() !== "-"),
        designations: (designationsRes?.data?.data || []).filter(d => d.text && d.text.trim() !== "-"),
      });

      // Combining all API responses into a single formData object
      const initialFormData = {};
      const profileData = profileViewRes?.data?.data;
      if (profileData) {
        Object.assign(initialFormData, {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          master_gender_id: profileData.master_gender_id,
          linkedin_url: profileData.linkedin_url,
          date_of_birth: profileData.date_of_birth?.split('T')[0],
          email_id: profileData.email_id,
          contact_no: profileData.contact_no,
          master_country: profileData.master_country_id,
          master_state: profileData.master_state_id,
          address: profileData.address,
          street: profileData.street,
          area: profileData.area,
          city: profileData.city,
          pincode: profileData.pincode,
          door_no: profileData.door_no,
        });
      }

      const careerData = careerHistoryRes?.data?.data;
      if (careerData) {
        if (careerData.user_academics?.length > 0) {
          const latest = [...careerData.user_academics].sort((a, b) => new Date(b.end_date) - new Date(a.end_date))[0];
          Object.assign(initialFormData, {
            institute: latest.master_organization_name,
            degree: latest.master_education_degree_name,
            graduation_date: latest.end_date?.split('T')[0],
          });
        }
        if (careerData.user_professions?.length > 0) {
          const latest = [...careerData.user_professions].sort((a, b) => new Date(b.end_date) - new Date(a.end_date))[0];
          Object.assign(initialFormData, {
            company_name: latest.master_organization_name,
            designation: latest.master_designation_name,
            joining_date: latest.start_date?.split('T')[0],
          });
        }
        if (careerData.total_experience_in_months) {
          const years = Math.floor(careerData.total_experience_in_months / 12);
          const months = careerData.total_experience_in_months % 12;
          initialFormData.total_experience = `${years} years, ${months} months`;
        }
      }
      
      setFormData(initialFormData);
      localStorage.setItem("userName", initialFormData.first_name || '');
      
    } catch (err) {
      console.error("Failed to fetch profile data in context:", err);
      setError("An error occurred while loading profile data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData,location]);

  const progressValue = useMemo(() => {
    if (!formData) return 0;
    return calculateProfileCompletion(formData);
  }, [formData]);

  // The value provided to all consumer components
  const value = {
    formData,
    profilePicture,
    progressValue,
    dropdownData, // Providing dropdown data through context
    isLoading,
    error,
    refreshProfileData: fetchProfileData, // To allow components to trigger a refresh
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};