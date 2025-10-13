import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { calculateProfileCompletion } from "./calculations";

// 1. Create the context
const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [formData, setFormData] = useState(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to memoize the fetch function
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
      // Fetch profile view data and profile picture data concurrently
      const [profileViewRes, profilePicRes] = await Promise.all([
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
      ]);

      setProfilePicture(profilePicRes.data.data.picture || "");

      if (profileViewRes.data && profileViewRes.data.status === 200) {
        const userData = profileViewRes.data.data;
        const formatApiDate = (dateString) =>
          dateString ? new Date(dateString).toISOString().split("T")[0] : "";

        // Replicating the full initial form data structure from your Profile component
        const userCourse =
          userData.user_courses_user_courses_user_idTousers?.[0] || {};
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
          status: "", // You might need to fetch and match this separately
          institute: userCourse.firm_name || "",
          degree: userCourse.degree_name || "",
          institute_location: userCourse.location || "",
          graduation_date: formatApiDate(userCourse.graduation_date),
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
        setError(
          profileViewRes.data.message || "Failed to fetch profile data."
        );
      }
    } catch {
      setError(
        "An error occurred. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data when the provider mounts
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Calculate progress value whenever formData changes
  const progressValue = useMemo(() => {
    if (!formData) return 0;
    return calculateProfileCompletion(formData);
  }, [formData]);

  // The value that will be available to all consumer components
  const value = {
    formData,
    setFormData,
    profilePicture,
    progressValue,
    isLoading,
    error,
    refreshProfileData: fetchProfileData, // Expose a function to allow refetching
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
