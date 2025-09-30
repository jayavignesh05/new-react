import React, { useState, useEffect, useRef } from "react";
import { GoPeople } from "react-icons/go";
import { BsCalendarDate, BsPerson } from "react-icons/bs";
import { LuBuilding2, LuPencil } from "react-icons/lu";
import { MdOutlineEmail, MdOutlineLocationOn } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { PiSuitcaseSimple, PiGraduationCapLight } from "react-icons/pi";
import "./Profile.css";
import Loading from "../components/loading";
import Snackbar from "../components/snackbar";
import axios from "axios";

function Profile() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    master_gender_id: "",
    date_of_birth: "",
    email_id: "",
    contact_no: "",
    master_country: "",
    master_state: "",
    address: "",
    door_no: "",
    street: "",
    area: "",
    city: "",
    pincode: "",
    status: "",
    institute: "",
    degree: "",
  });
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setprofile] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);
  const dateInputRef = useRef(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });

  const showSnackbar = (message, type) => {
    setSnackbar({ open: true, message, type });
  };

  async function fetchInitialApiData() {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setError("Authentication details not found. Please log in.");
      return;
    }

    try {
      const profileResponse = await axios.post(
        "https://dev.api-v1.dreambigportal.in/api/my_profile2",
        {
          required: "my_profile_picture",
          token: token,
          user_id: Number(userId),
        }
      );
      setprofile(profileResponse.data.data.picture || "");

      const statusRes = await axios.post(
        "https://dev.api-v1.dreambigportal.in/api/master",
        {
          source: "get_master_user_current_status",
          token: token,
        }
      );
      setStatusOptions(statusRes.data.data || []);
    } catch (apiError) {
      console.error("Initial API Data Error:", apiError);
      setError("Failed to fetch initial data.");
    }
  }

  const fetchProfileData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setError("User authentication details not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://dev.api-v1.dreambigportal.in/api/my_profile2",
        {
          token: token,
          user_id: Number(userId),
          required: "my_profile_view",
        }
      );

      if (response.data && response.data.status === 200) {
        const userData = response.data.data;
        localStorage.setItem("contact_no", userData.contact_no || "");

        const formattedDob = userData.date_of_birth
          ? new Date(userData.date_of_birth).toISOString().split("T")[0]
          : "";

        const userStatusId =
          userData.user_current_status_user_current_status_user_idTousers?.[0]
            ?.master_status_id;
        const statusName =
          statusOptions.find((s) => s.id === userStatusId)?.name || "";

        const userCourse =
          userData.user_courses_user_courses_user_idTousers?.[0] || {};

        setFormData({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          master_gender_id: userData.master_gender_id || "",
          date_of_birth: formattedDob,
          email_id: userData.email_id || "",
          contact_no: userData.contact_no || "",
          master_country: userData.master_countries.id || "",
          master_state: userData.master_states.id || "",
          address: userData.address || "",
          door_no: userData.door_no || "",
          street: userData.street || "",
          area: userData.area || "",
          city: userData.city || "",
          pincode: userData.pincode || "",
          status: statusName,
          institute: userCourse.firm_name || "",
          degree: userCourse.degree_name || "",
        });

        setCountriesList(response.data.countries_list || []);
        setStatesList(response.data.state_list || []);
      } else {
        setError(response.data.message || "Failed to fetch profile data.");
      }
    } catch (apiError) {
      setError(
        "An error occurred. Please check your connection and try again."
      );
      console.error("API Error:", apiError);
    } finally {
      setIsLoading(false);
    }
  }, [statusOptions]);

  useEffect(() => {
    fetchInitialApiData();
  }, []);

  useEffect(() => {
    if (statusOptions.length > 0) {
      fetchProfileData();
    }
  }, [statusOptions, fetchProfileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    localStorage.setItem("userName", formData.first_name);

    try {
      const saveResponse = await axios.post(
        "https://dev.api-v1.dreambigportal.in/api/my_profile",
        {
          required: "my_profile_update",
          token: token,
          user_id: Number(userId),
          first_name: formData.first_name,
          last_name: formData.last_name,
          master_gender_id: Number(formData.master_gender_id),
          email_id: formData.email_id,
          country_code: "+91",
          mobile_no: "9566880979",
          master_state: formData.master_state,
          master_country: formData.master_country,
          date_of_birth: "2015-12-01T00:00:00.000Z",
          address: formData.address,
          area: formData.area,
          door_no: formData.door_no,
          street: formData.street,
          city: formData.city,
          pincode: formData.pincode,
        }
      );
      if (saveResponse.data.status === 200) {
        showSnackbar("Profile updated successfully!", "success");
        fetchProfileData();
      } else {
        showSnackbar(
          "Failed to update profile: " + saveResponse.data.message,
          "error"
        );
      }
    } catch (saveError) {
      console.error("Save API Error:", saveError);
      showSnackbar(
        "An error occurred while saving. Please try again.",
        "error"
      );
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>
      <p className="profile-subtitle">
        View And Manage Your Personal Details And Account Settings.
      </p>

      <div className="profile-avatar">
        <img src={profile} alt="profile" className="avatar-img" />

        <input
          type="file"
          id="profilePictureInput"
          style={{ display: "none" }}
          accept="image/*"
        />

        <label htmlFor="profilePictureInput" className="edit-icon">
          <LuPencil />
        </label>
      </div>

      <form className="profile-form" onSubmit={handleSave}>
        <div className="forms">
          <div className="input-with-icon">
            <BsPerson size={16} />
            <input
              type="text"
              placeholder="First Name"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="input-with-icon">
            <BsPerson />
            <input
              type="text"
              placeholder="Last Name"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="forms">
          <div className="input-with-icon">
            <GoPeople />
            <select
              name="master_gender_id"
              value={formData.master_gender_id || ""}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value={1}>Male</option>
              <option value={2}>Female</option>
            </select>
          </div>
          <div
            className="input-with-icon"
            onClick={() => dateInputRef.current?.showPicker()}
          >
            <BsCalendarDate />
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth || ""}
              onChange={handleChange}
              ref={dateInputRef}
            />
          </div>
        </div>
        <div className="forms">
          <div className="input-with-icon">
            <MdOutlineEmail />
            <input
              type="email"
              placeholder="Email ID"
              name="email_id"
              value={formData.email_id || ""}
              onChange={handleChange}
            />
          </div>
          <div className="input-with-icon">
            <IoCallOutline />
            <input
              type="text"
              placeholder="Contact Number"
              name="contact_no"
              value={formData.contact_no || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="forms">
          <div className="input-with-icon">
            <MdOutlineLocationOn />
            <select
              name="master_country"
              value={formData.master_country || ""}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Country
              </option>
              {countriesList.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-with-icon">
            <LuBuilding2 />
            <select
              name="master_state"
              value={formData.master_state || ""}
              onChange={handleChange}
              disabled={!formData.master_country}
            >
              <option value="" disabled>
                Select State
              </option>
              {statesList.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="input-with-icon full-width">
          <MdOutlineLocationOn />
          <textarea
            className="full-width-textarea"
            placeholder="Address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="forms">
          <div className="input-with-icon">
            <MdOutlineLocationOn />
            <input
              type="text"
              placeholder="Door No"
              name="door_no"
              value={formData.door_no || ""}
              onChange={handleChange}
            />
          </div>
          <div className="input-with-icon">
            <MdOutlineLocationOn />
            <input
              type="text"
              placeholder="Street"
              name="street"
              value={formData.street || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="forms">
          <div className="input-with-icon">
            <LuBuilding2 />
            <input
              type="text"
              placeholder="Area"
              name="area"
              value={formData.area || ""}
              onChange={handleChange}
            />
          </div>
          <div className="input-with-icon">
            <LuBuilding2 />
            <input
              type="text"
              placeholder="City"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="forms">
          <div className="input-with-icon">
            <MdOutlineLocationOn />
            <input
              type="text"
              placeholder="Pin Code"
              name="pincode"
              value={formData.pincode || ""}
              onChange={handleChange}
            />
          </div>
          <div className="input-with-icon">
            <PiSuitcaseSimple />
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Your Current Status
              </option>
              {statusOptions.map((statusItem) => (
                <option key={statusItem.id} value={statusItem.name}>
                  {statusItem.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="forms">
          <div className="input-with-icon">
            <LuBuilding2 />
            <input
              type="text"
              placeholder="Institute"
              name="institute"
              value={formData.institute || ""}
              onChange={handleChange}
            />
          </div>
          <div className="input-with-icon">
            <PiGraduationCapLight />
            <input
              type="text"
              placeholder="Degree"
              name="degree"
              value={formData.degree || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <button className="save-btn" type="submit">
            Save Changes
          </button>
        </div>
      </form>

      {snackbar.open && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      )}
    </div>
  );
}

export default Profile;
