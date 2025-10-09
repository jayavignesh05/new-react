import React, { useState, useEffect, useRef } from "react";
import { GoPeople } from "react-icons/go";
import { BsCalendarDate, BsPerson, BsPersonVcard } from "react-icons/bs";
import { LuBuilding2, LuPencil, LuSave, LuX } from "react-icons/lu";
import {
  MdOutlineEmail,
  MdOutlineLocationOn,
  MdOutlineContactMail,
} from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { PiSuitcaseSimple, PiGraduationCapLight } from "react-icons/pi";
import { ImSpinner2 } from "react-icons/im"; // ADDED: Import the spinner icon
import "./Profile.css";
import Loading from "../components/loading";
import Snackbar from "../components/snackbar";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";

// ===================================================================
// 1. SECTION COMPONENTS
// ===================================================================

const PersonalDetails = ({
  formData,
  isEditing,
  isSaving,
  genderOptions,
  handleChange,
  handleEditClick,
  handleCancelClick,
  dateInputRef,
}) => {
  return (
    <div className="profile-form-content">
      <div className="profile-form-header">
        <div className="header-with-icon">
          <BsPersonVcard size={18} className="section-icon" />
          <h3>Personal Details</h3>
        </div>
        <div className="button-group">
          {isEditing ? (
            <>
              {/* CHANGED: Replaced "Saving..." text with a spinner icon */}
              <button type="submit" className="save-btn" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <ImSpinner2 className="spinner" size={16} /> Saving...
                  </>
                ) : (
                  <>
                    <LuSave size={16} /> Save
                  </>
                )}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelClick}
                disabled={isSaving}
              >
                <LuX size={16} />
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              className="edit-btn"
              onClick={handleEditClick}
            >
              <LuPencil size={16} /> Edit
            </button>
          )}
        </div>
      </div>
      <div className="profile-form">
        <div className="forms">
          <div className="input-with-icon">
            <BsPerson size={16} />
            <input
              type="text"
              placeholder="First Name"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              readOnly={!isEditing}
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
              readOnly={!isEditing}
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
              disabled={!isEditing}
            >
              <option value="" disabled>
                Select Gender
              </option>
              {genderOptions.map((gender) => (
                <option key={gender.id} value={gender.id}>
                  {gender.name}
                </option>
              ))}
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
              readOnly={!isEditing}
              ref={dateInputRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CommunicationDetails = ({
  formData,
  isEditing,
  isSaving,
  countriesList,
  statesList,
  handleChange,
  handleEditClick,
  handleCancelClick,
}) => {
  return (
    <div className="profile-form-content">
      <div className="profile-form-header">
        <div className="header-with-icon">
          <MdOutlineContactMail size={18} className="section-icon" />
          <h3>Communication Details</h3>
        </div>
        <div className="button-group">
          {isEditing ? (
            <>
               {/* CHANGED: Replaced "Saving..." text with a spinner icon */}
              <button type="submit" className="save-btn" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <ImSpinner2 className="spinner" size={16} /> Saving...
                  </>
                ) : (
                  <>
                    <LuSave size={16} /> Save
                  </>
                )}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelClick}
                disabled={isSaving}
              >
                <LuX size={16} />
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              className="edit-btn"
              onClick={handleEditClick}
            >
              <LuPencil size={16} />
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="profile-form">
        <div className="forms">
          <div className="input-with-icon">
            <MdOutlineEmail />
            <input
              type="email"
              placeholder="Email ID"
              name="email_id"
              value={formData.email_id || ""}
              onChange={handleChange}
              readOnly={!isEditing}
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
              readOnly={!isEditing}
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
              disabled={!isEditing}
            >
              <option value="" disabled>
                Select Country
              </option>
              {countriesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
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
              disabled={!isEditing || !formData.master_country}
            >
              <option value="" disabled>
                Select State
              </option>
              {statesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
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
            readOnly={!isEditing}
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
              readOnly={!isEditing}
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
              readOnly={!isEditing}
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
              readOnly={!isEditing}
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
              readOnly={!isEditing}
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
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CareerDetails = ({
  formData,
  isEditing,
  isSaving,
  statusOptions,
  handleChange,
  handleEditClick,
  handleCancelClick,
}) => {
  return (
    <div className="profile-form-content">
      <div className="profile-form-header">
        <div className="header-with-icon">
          <PiSuitcaseSimple size={18} className="section-icon" />
          <h3>Career Details</h3>
        </div>
        <div className="button-group">
          {isEditing ? (
            <>
              {/* CHANGED: Replaced "Saving..." text with a spinner icon */}
              <button type="submit" className="save-btn" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <ImSpinner2 className="spinner" size={16} /> Saving...
                  </>
                ) : (
                  <>
                    <LuSave size={16} /> Save
                  </>
                )}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelClick}
                disabled={isSaving}
              >
                <LuX size={16} />
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              className="edit-btn"
              onClick={handleEditClick}
            >
              <LuPencil size={16} /> Edit
            </button>
          )}
        </div>
      </div>
      <div className="profile-form">
        <div className="forms">
          <div className="input-with-icon">
            <PiSuitcaseSimple />
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="" disabled>
                Select Your Current Status
              </option>
              {statusOptions.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
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
              readOnly={!isEditing}
            />
          </div>
        </div>
        <div className="forms">
          <div className="input-with-icon">
            <PiGraduationCapLight />
            <input
              type="text"
              placeholder="Degree"
              name="degree"
              value={formData.degree || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================================================================
// 2. MAIN PROFILE COMPONENT (The container)
// ===================================================================
function Profile() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    master_gender__id: "",
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

  const [editingSections, setEditingSections] = useState({
    personal: false,
    communication: false,
    career: false,
  });

  const [originalFormData, setOriginalFormData] = useState(null);
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setprofile] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const dateInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    async function loadPageData() {
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
        const [profileViewRes, profilePicRes, statusRes, genderRes] =
          await Promise.all([
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
            axios.post("https://dev.api-v1.dreambigportal.in/api/master", {
              source: "get_master_user_current_status",
              token,
            }),
            axios.post("https://dev.api-v1.dreambigportal.in/api/my_profile", {
              required: "gender_list",
              token,
            }),
          ]);
        const fetchedStatusOptions = statusRes.data.data || [];
        setprofile(profilePicRes.data.data.picture || "");
        setStatusOptions(fetchedStatusOptions);
        setGenderOptions(genderRes.data.data || []);
        setCountriesList(profileViewRes.data.countries_list || []);
        setStatesList(profileViewRes.data.state_list || []);
        if (profileViewRes.data && profileViewRes.data.status === 200) {
          const userData = profileViewRes.data.data;
          const formattedDob = userData.date_of_birth
            ? new Date(userData.date_of_birth).toISOString().split("T")[0]
            : "";
          const userStatusId =
            userData.user_current_status_user_current_status_user_idTousers?.[0]
              ?.master_status_id;
          const statusName =
            fetchedStatusOptions.find((s) => s.id === userStatusId)?.name || "";
          const userCourse =
            userData.user_courses_user_courses_user_idTousers?.[0] || {};
          const initialFormData = {
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            master_gender_id: userData.master_gender_id || "",
            date_of_birth: formattedDob,
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
            status: statusName,
            institute: userCourse.firm_name || "",
            degree: userCourse.degree_name || "",
          };
          setFormData(initialFormData);
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
    }
    loadPageData();
  }, []);

  const showSnackbar = (message, type) =>
    setSnackbar({ open: true, message, type });
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleEditClick = (e, section) => {
    e.preventDefault();
    setOriginalFormData(formData);
    setEditingSections((prev) => ({ ...prev, [section]: true }));
  };
  const handleCancelClick = (e) => {
    e.preventDefault();
    setFormData(originalFormData);
    setEditingSections({
      personal: false,
      communication: false,
      career: false,
    });
    setOriginalFormData(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    localStorage.setItem("userName", formData.first_name);

    const selectedStatus = statusOptions.find(
      (option) => option.name === formData.status
    );
    const masterStatusId = selectedStatus ? selectedStatus.id : null;

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
          mobile_no: formData.contact_no,
          master_state: formData.master_state,
          master_country: formData.master_country,
          date_of_birth: formData.date_of_birth
            ? new Date(formData.date_of_birth).toISOString()
            : null,
          address: formData.address,
          area: formData.area,
          door_no: formData.door_no,
          street: formData.street,
          city: formData.city,
          pincode: formData.pincode,
          master_status_id: masterStatusId,
          firm_name: formData.institute,
          degree_name: formData.degree,
        }
      );
      if (saveResponse.data.status === 200) {
        showSnackbar("Profile updated successfully!", "success");
        setEditingSections({
          personal: false,
          communication: false,
          career: false,
        });
        setOriginalFormData(null);
      } else {
        showSnackbar(
          "Failed to update profile: " + saveResponse.data.message,
          "error"
        );
      }
    } catch {
      showSnackbar(
        "An error occurred while saving. Please try again.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-wrapper">
            <img src={profile} alt="profile" className="avatar-img" />
            <label htmlFor="profilePictureInput" className="edit-icon">
              <LuPencil size={14} />
            </label>
            <input
              type="file"
              id="profilePictureInput"
              style={{ display: "none" }}
              accept="image/*"
            />
          </div>
          <div className="profile-info">
            <h2 className="profile-name">
              {formData.first_name} {formData.last_name}
            </h2>
            <div className="progress-container">
              <div className="progress-bar-wrapper">
                <LinearProgress
                  variant="determinate"
                  value={10}
                  className="custom-linear-progress"
                />
              </div>
              <span className="progress-percentage">10%</span>
            </div>
          </div>
        </div>
      </div>
      <form className="profile-form-container" onSubmit={handleSave}>
        <PersonalDetails
          formData={formData}
          isEditing={editingSections.personal}
          isSaving={isSaving}
          genderOptions={genderOptions}
          handleChange={handleChange}
          handleEditClick={(e) => handleEditClick(e, "personal")}
          handleCancelClick={handleCancelClick}
          dateInputRef={dateInputRef}
        />
        <CommunicationDetails
          formData={formData}
          isEditing={editingSections.communication}
          isSaving={isSaving}
          countriesList={countriesList}
          statesList={statesList}
          handleChange={handleChange}
          handleEditClick={(e) => handleEditClick(e, "communication")}
          handleCancelClick={handleCancelClick}
        />
        <CareerDetails
          formData={formData}
          isEditing={editingSections.career}
          isSaving={isSaving}
          statusOptions={statusOptions}
          handleChange={handleChange}
          handleEditClick={(e) => handleEditClick(e, "career")}
          handleCancelClick={handleCancelClick}
        />
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
