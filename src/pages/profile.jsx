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
  institutesList,
  degreesList,
  companiesList,
  designationsList,
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
              <select
                id="institute"
                name="institute"
                value={formData.institute || ""}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="" disabled>Select Institute</option>
                {institutesList.map((inst) => (
                  <option key={inst.id} value={inst.text}>{inst.text.trim()}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="degree">Degree</label>
            <div className="input-with-icon">
              <PiGraduationCapLight />
              <select
                id="degree"
                name="degree"
                value={formData.degree || ""}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="" disabled>Select Degree</option>
                {degreesList.map((deg) => (
                  <option key={deg.id} value={deg.text}>{deg.text.trim()}</option>
                ))}
              </select>
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
              <BsCalendarDate />
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
              <LuBuilding2 />
              <select
                id="company_name"
                name="company_name"
                value={formData.company_name || ""}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="" disabled>Select Company</option>
                {companiesList.map((company) => (
                  <option key={company.id} value={company.text}>{company.text.trim()}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="designation">Designation</label>
            <div className="input-with-icon">
              <PiSuitcaseSimple />
              <select
                id="designation"
                name="designation"
                value={formData.designation || ""}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="" disabled>Select Designation</option>
                {designationsList.map((designation) => (
                  <option key={designation.id} value={designation.text}>{designation.text.trim()}</option>
                ))}
              </select>
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
              <BsCalendarDate />
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
              <PiSuitcaseSimple />
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
              <PiSuitcaseSimple />
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
// MAIN PROFILE COMPONENT
// ===================================================================
function Profile() {
  const {
    profilePicture,
    progressValue,
    isLoading,
    error,
    refreshProfileData,
  } = useProfile();

  const [formData, setFormData] = useState({});
  const [editingSections, setEditingSections] = useState({
    personal: false,
    communication: false,
    career: false,
  });
  const [originalFormData, setOriginalFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "" });

  // States for all dropdown options
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [institutesList, setInstitutesList] = useState([]);
  const [degreesList, setDegreesList] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [designationsList, setDesignationsList] = useState([]);
  
  const dateInputRef = useRef(null);

  useEffect(() => {
    async function loadInitialData() {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      if (!token) return;

      try {
        const [
          profileViewRes,
          careerHistoryRes,
          statusRes,
          genderRes,
          institutesRes,
          degreesRes,
          companiesRes,
          designationsRes,
        ] = await Promise.all([
          axios.post("https://dev.api-v1.dreambigportal.in/api/my_profile2", { token, user_id: Number(userId), required: "my_profile_view" }),
          axios.post("https://dev.api-v1.dreambigportal.in/pub/public_api", { source: "get_profile", user_id: Number(userId), token }),
          axios.post("https://dev.api-v1.dreambigportal.in/api/master", { source: "get_master_user_current_status", token }),
          axios.post("https://dev.api-v1.dreambigportal.in/api/my_profile", { required: "gender_list", token }),
          axios.post("https://dev.api-v1.dreambigportal.in/pub/public_api", { source: "load_career_data", type: 1, org_type: 1, current_company_code: "91BS001", user_id: Number(userId), SearchParam: "", token }),
          axios.post("https://dev.api-v1.dreambigportal.in/pub/public_api", { source: "load_career_data", type: 3, current_company_code: "91BS001", user_id: Number(userId), SearchParam: "", token }),
          axios.post("https://dev.api-v1.dreambigportal.in/pub/public_api", { source: "load_career_data", type: 1, org_type: 2, current_company_code: "91BS001", user_id: Number(userId), SearchParam: "", token }),
          axios.post("https://dev.api-v1.dreambigportal.in/pub/public_api", { source: "load_career_data", type: 2, current_company_code: "91BS001", user_id: Number(userId), SearchParam: "", token }),
        ]);

        const allStatusOptions = statusRes?.data?.data || [];
        setCountriesList(profileViewRes?.data?.countries_list || []);
        setStatesList(profileViewRes?.data?.state_list || []);
        setStatusOptions(allStatusOptions);
        setGenderOptions(genderRes?.data?.data || []);
        setInstitutesList(institutesRes?.data?.data || []);
        setDegreesList(degreesRes?.data?.data || []);

        if (companiesRes?.data?.data) {
          setCompaniesList(companiesRes.data.data.filter(c => c.text && c.text.trim() !== "-"));
        }
        if (designationsRes?.data?.data) {
          setDesignationsList(designationsRes.data.data.filter(d => d.text && d.text.trim() !== "-"));
        }

        const profileData = profileViewRes?.data?.data;
        const initialFormData = {};

        if (profileData) {
          initialFormData.first_name = profileData.first_name;
          initialFormData.last_name = profileData.last_name;
          // ... and so on for all personal/communication fields
          initialFormData.master_gender_id = profileData.master_gender_id;
          initialFormData.linkedin_url = profileData.linkedin_url;
          if (profileData.date_of_birth) initialFormData.date_of_birth = profileData.date_of_birth.split('T')[0];
          initialFormData.email_id = profileData.email_id;
          initialFormData.contact_no = profileData.contact_no;
          initialFormData.master_country = profileData.master_country_id;
          initialFormData.master_state = profileData.master_state_id;
          initialFormData.address = profileData.address;
          initialFormData.street = profileData.street;
          initialFormData.area = profileData.area;
          initialFormData.city = profileData.city;
          initialFormData.pincode = profileData.pincode;
          initialFormData.door_no = profileData.door_no;
        }

        const careerData = careerHistoryRes?.data?.data;
        if (careerData) {
          if (careerData.user_academics && careerData.user_academics.length > 0) {
            const sortedAcademics = [...careerData.user_academics].sort((a, b) => new Date(b.end_date) - new Date(a.end_date));
            const latestAcademic = sortedAcademics[0];
            
            initialFormData.user_academic_id = latestAcademic.user_academic_id;
            initialFormData.institute = latestAcademic.master_organization_name;
            initialFormData.degree = latestAcademic.master_education_degree_name;
            initialFormData.institute_location = latestAcademic.location;
            if (latestAcademic.end_date) initialFormData.graduation_date = latestAcademic.end_date.split('T')[0];
          }

          if (careerData.user_professions && careerData.user_professions.length > 0) {
            const sortedProfessions = [...careerData.user_professions].sort((a, b) => new Date(b.end_date) - new Date(a.end_date));
            const latestProfession = sortedProfessions[0];

            // UPDATED: Storing the ID for editing
            initialFormData.user_profession_id = latestProfession.user_profession_id; 
            initialFormData.company_name = latestProfession.master_organization_name;
            initialFormData.designation = latestProfession.master_designation_name;
            initialFormData.company_location = latestProfession.location;
            if (latestProfession.start_date) initialFormData.joining_date = latestProfession.start_date.split('T')[0];
          }

          if(careerData.total_experience_in_months) {
            const years = Math.floor(careerData.total_experience_in_months / 12);
            const months = careerData.total_experience_in_months % 12;
            initialFormData.total_experience = `${years} years, ${months} months`;
          }
        }
        
        setFormData(initialFormData);

      } catch (e) {
        console.error("Failed to load initial data", e);
        showSnackbar("Failed to load profile data.", "error");
      }
    }
    loadInitialData();
  }, [refreshProfileData]);

  const showSnackbar = (message, type) => setSnackbar({ open: true, message, type });
  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditClick = (e, section) => {
    e.preventDefault();
    setOriginalFormData({ ...formData });
    setEditingSections((prev) => ({ ...prev, [section]: true }));
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    setFormData(originalFormData);
    setEditingSections({ personal: false, communication: false, career: false });
    setOriginalFormData(null);
  };

  const handleSavePersonalAndCommunication = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    const payload = {
      required: "my_profile_update",
      token,
      user_id: Number(userId),
      first_name: formData.first_name,
      last_name: formData.last_name,
      master_gender_id: Number(formData.master_gender_id),
      linkedin_url: formData.linkedin_url,
      date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString() : null,
      email_id: formData.email_id,
      country_code: "+91",
      mobile_no: formData.contact_no,
      master_state: formData.master_state,
      master_country: formData.master_country,
      address: formData.address,
      area: formData.area,
      door_no: formData.door_no,
      street: formData.street,
      city: formData.city,
      pincode: formData.pincode,
    };

    try {
      const saveResponse = await axios.post("https://dev.api-v1.dreambigportal.in/api/my_profile", payload);
      if (saveResponse.data.status === 200) {
        showSnackbar("Profile updated successfully!", "success");
        setEditingSections({ personal: false, communication: false, career: false });
        setOriginalFormData(null);
        refreshProfileData();
      } else {
        showSnackbar(`Failed to update profile: ${saveResponse.data.message}`, "error");
      }
    } catch (err) {
      console.error("Save Error:", err);
      showSnackbar("An error occurred while saving. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // --- UPDATED: This function now saves BOTH academic and professional details ---
  const handleSaveCareer = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem("authToken");
    const userId = Number(localStorage.getItem("userId"));

    const payload = {
        source: "set_profile",
        user_id: userId,
        token: token,
    };

    // Conditionally add academic data if present
    if (formData.institute || formData.degree) {
        const academicPayload = {
            user_id: userId,
            master_organization_id: formData.institute,
            master_education_degree_id: formData.degree,
            end_date: formData.graduation_date,
            location: formData.institute_location,
        };
        if (formData.user_academic_id) {
            academicPayload.user_academic_id = formData.user_academic_id;
        }
        payload.user_academics = [academicPayload];
    }

    // Conditionally add professional data if present
    if (formData.company_name || formData.designation) {
        const professionalPayload = {
            user_id: userId,
            master_organization_id: formData.company_name,
            master_designation_id: formData.designation,
            location: formData.company_location,
            start_date: formData.joining_date,
        };
        if (formData.user_profession_id) {
            professionalPayload.user_profession_id = formData.user_profession_id;
        }
        payload.user_professions = [professionalPayload];
    }
    
    // Check if there is anything to save
    if (!payload.user_academics && !payload.user_professions) {
        showSnackbar("No career details to save.", "info");
        setIsSaving(false);
        return; 
    }

    try {
        const saveResponse = await axios.post("https://dev.api-v1.dreambigportal.in/pub/public_api", payload);
        if (saveResponse.data.status === 200) {
            showSnackbar("Career details updated successfully!", "success");
            setEditingSections({ personal: false, communication: false, career: false });
            setOriginalFormData(null);
            refreshProfileData();
        } else {
            showSnackbar(`Failed to update career details: ${saveResponse.data.message}`, "error");
        }
    } catch (err) {
        console.error("Career Save Error:", err);
        showSnackbar("An error occurred while saving career details. Please try again.", "error");
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading || Object.keys(formData).length === 0) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-container">
      <svg className="gooey-svg-filter" style={{ display: 'none' }}>
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
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
            <input type="file" id="profilePictureInput" style={{ display: "none" }} accept="image/*" />
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{`${formData.first_name || ''} ${formData.last_name || ''}`}</h2>
            <div className="progress-container">
              <div className="progress-bar-wrapper">
                <LinearProgress variant="determinate" value={progressValue} className="custom-linear-progress" />
              </div>
              <span className="progress-percentage">{`${progressValue}%`}</span>
            </div>
          </div>
        </div>
      </div>
      
      <form className="profile-form-container" onSubmit={handleSavePersonalAndCommunication}>
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
      </form>
      
      <form className="profile-form-container" onSubmit={handleSaveCareer}>
        <CareerDetails
          formData={formData}
          isEditing={editingSections.career}
          isSaving={isSaving}
          statusOptions={statusOptions}
          institutesList={institutesList}
          degreesList={degreesList}
          companiesList={companiesList}
          designationsList={designationsList}
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