import { useState, useEffect, useRef } from "react";
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
import { ImSpinner2 } from "react-icons/im";
import "./Profile.css";
import Loading from "../components/loading";
import Snackbar from "../components/snackbar";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
// IMPORT the context hook.
import { useProfile } from "../components/utils/ProfileContext"; 


// ===================================================================
// BUTTON COMPONENT
// ===================================================================
const SlideButtonGroup = ({
  isEditing,
  isSaving,
  onEditClick,
  onCancelClick,
}) => {
  const containerClasses = `slide-button-group ${
    isEditing ? "is-editing" : ""
  }`;

  return (
    <div className={containerClasses}>
      <button
        type="submit"
        className="slide-btn slide-save-btn"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <ImSpinner2 className="spinner" size={16} />
            &nbsp;Saving...
          </>
        ) : (
          <>
            <LuSave size={16} />
            &nbsp;Save
          </>
        )}
      </button>

      <button
        type="button"
        className={
          isEditing ? "slide-btn slide-cancel-btn" : "slide-btn slide-edit-btn"
        }
        onClick={isEditing ? onCancelClick : onEditClick}
        disabled={isSaving}
      >
        {isEditing ? (
          <>
            <LuX size={16} />
            &nbsp;Cancel
          </>
        ) : (
          <>
            <LuPencil size={16} />
            &nbsp;Edit
          </>
        )}
      </button>
    </div>
  );
};

// ===================================================================
// SECTION COMPONENTS
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
        <SlideButtonGroup
          isEditing={isEditing}
          isSaving={isSaving}
          onEditClick={handleEditClick}
          onCancelClick={handleCancelClick}
        />
      </div>
      <div className="profile-form">
        <div className="forms">
          <div className="input-field">
            <label htmlFor="first_name">First Name</label>
            <div className="input-with-icon">
              <BsPerson size={16} />
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="last_name">Last Name</label>
            <div className="input-with-icon">
              <BsPerson />
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
        <div className="forms">
          <div className="input-field">
            <label htmlFor="master_gender_id">Gender</label>
            <div className="input-with-icon">
              <GoPeople />
              <select
                id="master_gender_id"
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
          </div>
          <div className="input-field">
            <label htmlFor="date_of_birth">Date of Birth</label>
            <div
              className="input-with-icon"
              onClick={() => dateInputRef.current?.showPicker()}
            >
              <BsCalendarDate />
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                ref={dateInputRef}
              />
            </div>
          </div>
        </div>
        <div className="forms">
          <div className="input-field ">
            <label htmlFor="linkedin_url">LinkedIn Profile URL</label>
            <div className="input-with-icon">
              <BsPerson size={16} />
              <input
                type="text"
                id="linkedin_url"
                name="linkedin_url"
                value={formData.linkedin_url || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
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
        <SlideButtonGroup
          isEditing={isEditing}
          isSaving={isSaving}
          onEditClick={handleEditClick}
          onCancelClick={handleCancelClick}
        />
      </div>
      <div className="profile-form">
        <div className="forms">
          <div className="input-field">
            <label htmlFor="email_id">Email ID</label>
            <div className="input-with-icon">
              <MdOutlineEmail />
              <input
                type="email"
                id="email_id"
                name="email_id"
                value={formData.email_id || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="contact_no">Contact Number</label>
            <div className="input-with-icon">
              <IoCallOutline />
              <input
                type="text"
                id="contact_no"
                name="contact_no"
                value={formData.contact_no || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
        <div className="forms">
          <div className="input-field">
            <label htmlFor="master_country">Country</label>
            <div className="input-with-icon">
              <MdOutlineLocationOn />
              <select
                id="master_country"
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
          </div>
          <div className="input-field">
            <label htmlFor="master_state">State</label>
            <div className="input-with-icon">
              <LuBuilding2 />
              <select
                id="master_state"
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
        </div>
        <div className="input-field ">
          <label htmlFor="address">Address</label>
          <div className="input-with-icon full-width">
            <MdOutlineLocationOn />
            <textarea
              id="address"
              className="full-width-textarea"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            ></textarea>
          </div>
        </div>
        <div className="forms">
          <div className="input-field">
            <label htmlFor="door_no">Door No</label>
            <div className="input-with-icon">
              <MdOutlineLocationOn />
              <input
                type="text"
                id="door_no"
                name="door_no"
                value={formData.door_no || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="street">Street</label>
            <div className="input-with-icon">
              <MdOutlineLocationOn />
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
        <div className="forms">
          <div className="input-field">
            <label htmlFor="area">Area</label>
            <div className="input-with-icon">
              <LuBuilding2 />
              <input
                type="text"
                id="area"
                name="area"
                value={formData.area || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="city">City</label>
            <div className="input-with-icon">
              <LuBuilding2 />
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
        <div className="forms">
          <div className="input-field">
            <label htmlFor="pincode">Pin Code</label>
            <div className="input-with-icon">
              <MdOutlineLocationOn />
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
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
        <SlideButtonGroup
          isEditing={isEditing}
          isSaving={isSaving}
          onEditClick={handleEditClick}
          onCancelClick={handleCancelClick}
        />
      </div>
      <div className="profile-form">
        <div className="forms">
          <div className="input-field">
            <label htmlFor="status">Current Status</label>
            <div className="input-with-icon">
              <PiSuitcaseSimple />
              <select
                id="status"
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
        </div>
        <p className="career-section-title">education background</p>
        <div className="forms">
          <div className="input-field">
            <label htmlFor="institute">Institute</label>
            <div className="input-with-icon">
              <LuBuilding2 />
              <input
                type="text"
                id="institute"
                name="institute"
                value={formData.institute || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="degree">Degree</label>
            <div className="input-with-icon">
              <PiGraduationCapLight />
              <input
                type="text"
                id="degree"
                name="degree"
                value={formData.degree || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
        <div className="forms">
          <div className="input-field">
            <label htmlFor="institute_location">Institute Location</label>
            <div className="input-with-icon">
              <MdOutlineLocationOn />
              <input
                type="text"
                id="institute_location"
                name="institute_location"
                value={formData.institute_location || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="graduation_date">Graduation Date</label>
            <div className="input-with-icon">
              <PiGraduationCapLight />
              <input
                type="date"
                id="graduation_date"
                name="graduation_date"
                value={formData.graduation_date || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
        <p className="career-section-title">professional background</p>
        <div className="forms">
          <div className="input-field">
            <label htmlFor="company_name">Company Name</label>
            <div className="input-with-icon">
              <PiGraduationCapLight />
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="designation">Designation</label>
            <div className="input-with-icon">
              <PiGraduationCapLight />
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
        <div className="forms">
          <div className="input-field">
            <label htmlFor="company_location">Company Location</label>
            <div className="input-with-icon">
              <MdOutlineLocationOn />
              <input
                type="text"
                id="company_location"
                name="company_location"
                value={formData.company_location || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="joining_date">Joining Date</label>
            <div className="input-with-icon">
              <PiGraduationCapLight />
              <input
                type="date"
                id="joining_date"
                name="joining_date"
                value={formData.joining_date || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
        <div className="forms">
          <div className="input-field">
            <label htmlFor="current_experience">Current Experience</label>
            <div className="input-with-icon">
              <PiGraduationCapLight />
              <input
                type="text"
                id="current_experience"
                name="current_experience"
                value={formData.current_experience || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="total_experience">Total Experience</label>
            <div className="input-with-icon">
              <PiGraduationCapLight />
              <input
                type="text"
                id="total_experience"
                name="total_experience"
                value={formData.total_experience || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// ===================================================================
// MAIN PROFILE COMPONENT (Refactored to use Context)
// ===================================================================
function Profile() {
  // Get all shared data from the context.
  const {
    formData: contextFormData,
    setFormData: setContextFormData,
    profilePicture,
    progressValue,
    isLoading,
    error,
    refreshProfileData,
  } = useProfile();

  // Keep local state only for things this component controls (editing, saving, UI).
  const [formData, setFormData] = useState(contextFormData); // Local copy for editing
  const [editingSections, setEditingSections] = useState({
    personal: false,
    communication: false,
    career: false,
  });
  const [originalFormData, setOriginalFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });

  // State for dropdown options (can still be fetched here as they are specific to the form)
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const dateInputRef = useRef(null);

  // Sync local form data when the global context data loads or changes.
  useEffect(() => {
    setFormData(contextFormData);
  }, [contextFormData]);

  // This useEffect can remain to load data specific to the form's dropdowns.
  useEffect(() => {
    async function loadDropdowns() {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      try {
        const [statusRes, genderRes, profileViewRes] = await Promise.all([
          axios.post("https://dev.api-v1.dreambigportal.in/api/master", { source: "get_master_user_current_status", token }),
          axios.post("https://dev.api-v1.dreambigportal.in/api/my_profile", { required: "gender_list", token }),
          axios.post("https://dev.api-v1.dreambigportal.in/api/my_profile2", { token, user_id: Number(localStorage.getItem("userId")), required: "my_profile_view" }),
        ]);
        setStatusOptions(statusRes.data.data || []);
        setGenderOptions(genderRes.data.data || []);
        setCountriesList(profileViewRes.data.countries_list || []);
        setStatesList(profileViewRes.data.state_list || []);
      } catch (e) {
        console.error("Failed to load dropdown options", e);
      }
    }
    loadDropdowns();
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
          linkedin_url: formData.linkedin_url,
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
        
        // After successful save, update the context and tell it to refetch.
        setContextFormData(formData); // Update context immediately for a fast UI response
        refreshProfileData(); // Tell context to get the latest data from the server
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

  if (isLoading || !formData) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-container">
      <svg className="gooey-svg-filter">
        <defs>
          <filter id="gooey">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-wrapper">
            <img src={profilePicture} alt="profile" className="avatar-img" />
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
                  value={progressValue} /* Using value from context */
                  className="custom-linear-progress"
                />
              </div>
              <span className="progress-percentage">
                {" "}
                {`${progressValue}%`}
              </span>
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