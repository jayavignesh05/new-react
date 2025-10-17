import { useState, useEffect, useRef, useCallback } from "react";
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
                readOnly
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

const CurrentStatusDetails = ({
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
          <h3>Current Status</h3>
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
            <label htmlFor="master_user_current_status_id">
              Your Current Status
            </label>
            <div className="input-with-icon">
              <PiSuitcaseSimple />
              <select
                id="master_user_current_status_id"
                name="master_user_current_status_id"
                value={formData.master_user_current_status_id || ""}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="" disabled>
                  Select Your Current Status
                </option>
                {statusOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EducationDetails = ({
  formData,
  isEditing,
  isSaving,
  institutesList,
  degreesList,
  handleChange,
  handleEditClick,
  handleCancelClick,
}) => {
  return (
    <div className="profile-form-content">
      <div className="profile-form-header">
        <div className="header-with-icon">
          <PiGraduationCapLight size={18} className="section-icon" />
          <h3>Education Background</h3>
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
            <label htmlFor="institute">Institute</label>
            <div className="input-with-icon">
              <LuBuilding2 />
              <input
                type="text"
                id="institute"
                name="institute"
                list="institutes-list"
                value={formData.institute || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder="Select or type an institute"
              />
              <datalist id="institutes-list">
                {institutesList.map((inst) => (
                  <option key={inst.id} value={inst.text.trim()} />
                ))}
              </datalist>
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
                list="degrees-list"
                value={formData.degree || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder="Select or type a degree"
              />
              <datalist id="degrees-list">
                {degreesList.map((deg) => (
                  <option key={deg.id} value={deg.text.trim()} />
                ))}
              </datalist>
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
      </div>
    </div>
  );
};

const ProfessionalFormModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  companiesList,
  designationsList,
}) => {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          master_organization_name: initialData.master_organization_name || "",
          master_designation_name: initialData.master_designation_name || "",
          location: initialData.location || "",
          start_date: initialData.start_date
            ? initialData.start_date.split("T")[0]
            : "",
          end_date: initialData.end_date
            ? initialData.end_date.split("T")[0]
            : "",
        });
      } else {
        setFormData({
          master_organization_name: "",
          master_designation_name: "",
          location: "",
          start_date: "",
          end_date: "",
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            {initialData
              ? "Edit Professional Detail"
              : "Add Professional Detail"}
          </h3>
          <button onClick={onClose} className="modal-close-btn">
            <LuX size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="forms">
            <div className="input-field">
              <label htmlFor="master_organization_name">Company Name</label>
              <div className="input-with-icon">
                <LuBuilding2 />
                <input
                  type="text"
                  id="master_organization_name"
                  name="master_organization_name"
                  list="companies-list"
                  value={formData.master_organization_name || ""}
                  onChange={handleChange}
                  placeholder="Select or type a company"
                />
                <datalist id="companies-list">
                  {companiesList.map((company) => (
                    <option key={company.id} value={company.text.trim()} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="input-field">
              <label htmlFor="master_designation_name">Designation</label>
              <div className="input-with-icon">
                <PiSuitcaseSimple />
                <input
                  type="text"
                  id="master_designation_name"
                  name="master_designation_name"
                  list="designations-list"
                  value={formData.master_designation_name || ""}
                  onChange={handleChange}
                  placeholder="Select or type a designation"
                />
                <datalist id="designations-list">
                  {designationsList.map((designation) => (
                    <option
                      key={designation.id}
                      value={designation.text.trim()}
                    />
                  ))}
                </datalist>
              </div>
            </div>
          </div>
          <div className="forms">
            <div className="input-field">
              <label htmlFor="location">Company Location</label>
              <div className="input-with-icon">
                <MdOutlineLocationOn />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="input-field">
              <label htmlFor="start_date">Joining Date</label>
              <div className="input-with-icon">
                <BsCalendarDate />
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="forms">
            <div className="input-field">
              <label htmlFor="end_date">
                Relieving Date (leave empty if current)
              </label>
              <div className="input-with-icon">
                <BsCalendarDate />
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel" disabled={isSaving}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn-save" disabled={isSaving}>
            {isSaving ? (
              <>
                <ImSpinner2 className="spinner" size={16} /> Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfessionalDetails = ({ professionalHistory, onAdd, onEdit }) => {
  const formatDateToYYYYMMDD = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculateExperienceInMonths = (start, end) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    let totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    totalMonths -= startDate.getMonth();
    totalMonths += endDate.getMonth();
    if (endDate.getDate() < startDate.getDate()) {
      totalMonths--;
    }
    return totalMonths <= 0 ? 0 : totalMonths;
  };

  return (
    <div className="profile-form-content">
      <div className="profile-form-header">
        <div className="header-with-icon">
          <LuBuilding2 size={18} className="section-icon" />
          <h3>Professional Background</h3>
        </div>
        <button type="button" onClick={onAdd} className="btn-add-new">
          Add New
        </button>
      </div>
      <div className="profile-form">
        {professionalHistory.length > 0 ? (
          professionalHistory.map((job, index) => {
            const formattedStartDate = formatDateToYYYYMMDD(job.start_date);
            const formattedEndDate = formatDateToYYYYMMDD(job.end_date);
            const experienceInMonths = calculateExperienceInMonths(
              job.start_date,
              job.end_date
            );

            return (
              <div key={job.user_profession_id} className="professional-entry">
                <div className="job-header">
                  <h4 className="job-title">
                    {job.master_designation_name} -{" "}
                    {job.master_organization_name}
                  </h4>
                  <button
                    type="button"
                    onClick={() => onEdit(job)}
                    className="edit-job-btn"
                  >
                    <LuPencil size={14} />
                  </button>
                </div>
                <div className="job-details">
                  {experienceInMonths > 0 && (
                    <p className="Total-exp">
                      Total Experience: {Math.floor(experienceInMonths / 12)}{" "}
                      years, {experienceInMonths % 12} months
                    </p>
                  )}
                  {formattedStartDate && (
                    <p className="joining-date">
                      Joining Date: {formattedStartDate}
                    </p>
                  )}
                  {formattedEndDate && (
                    <p className="end-date">
                      Relieving Date: {formattedEndDate}
                    </p>
                  )}
                </div>
                {index < professionalHistory.length - 1 && (
                  <hr className="entry-divider" />
                )}
              </div>
            );
          })
        ) : (
          <p>No professional background information available.</p>
        )}
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
    status: false,
    education: false,
  });
  const [originalFormData, setOriginalFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [isProfessionalModalOpen, setIsProfessionalModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [institutesList, setInstitutesList] = useState([]);
  const [degreesList, setDegreesList] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [designationsList, setDesignationsList] = useState([]);
  const [professionalHistory, setProfessionalHistory] = useState([]);
  const dateInputRef = useRef(null);

  const showSnackbar = useCallback((message, type) => {
    setSnackbar({ open: true, message, type });
  }, []);

  const fetchProfileData = useCallback(async () => {
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
        axios.post("https://dev.api-v1.dreambigportal.in/api/my_profile2", {
          token,
          user_id: Number(userId),
          required: "my_profile_view",
        }),
        axios.post("https://dev.api-v1.dreambigportal.in/pub/public_api", {
          source: "get_profile",
          user_id: Number(userId),
          token,
        }),
        axios.post("https://dev.api-v1.dreambigportal.in/api/master", {
          source: "get_master_user_current_status",
          token,
        }),
        axios.post("https://dev.api-v1.dreambigportal.in/api/my_profile", {
          required: "gender_list",
          token,
        }),
        axios.post("https://dev.api-v1.dreambigportal.in/pub/public_api", {
          source: "load_career_data",
          type: 1,
          org_type: 1,
          current_company_code: "91BS001",
          user_id: Number(userId),
          SearchParam: "",
          token,
        }),
        axios.post("https://dev.api-v1.dreambigportal.in/pub/public_api", {
          source: "load_career_data",
          type: 3,
          current_company_code: "91BS001",
          user_id: Number(userId),
          SearchParam: "",
          token,
        }),
        axios.post("https://dev.api-v1.dreambigportal.in/pub/public_api", {
          source: "load_career_data",
          type: 1,
          org_type: 2,
          current_company_code: "91BS001",
          user_id: Number(userId),
          SearchParam: "",
          token,
        }),
        axios.post("https://dev.api-v1.dreambigportal.in/pub/public_api", {
          source: "load_career_data",
          type: 2,
          current_company_code: "91BS001",
          user_id: Number(userId),
          SearchParam: "",
          token,
        }),
      ]);

      setCountriesList(profileViewRes?.data?.countries_list || []);
      setStatesList(profileViewRes?.data?.state_list || []);
      setStatusOptions(statusRes?.data?.data || []);
      setGenderOptions(genderRes?.data?.data || []);
      setInstitutesList(institutesRes?.data?.data || []);
      setDegreesList(degreesRes?.data?.data || []);
      if (companiesRes?.data?.data)
        setCompaniesList(
          companiesRes.data.data.filter((c) => c.text && c.text.trim() !== "-")
        );
      if (designationsRes?.data?.data)
        setDesignationsList(
          designationsRes.data.data.filter(
            (d) => d.text && d.text.trim() !== "-"
          )
        );

      const profileData = profileViewRes?.data?.data;
      const initialFormData = {};
      if (profileData) {
        Object.assign(initialFormData, {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          master_gender_id: profileData.master_gender_id,
          linkedin_url: profileData.linkedin_url,
          date_of_birth: profileData.date_of_birth
            ? profileData.date_of_birth.split("T")[0]
            : null,
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
        const currentStatusArray =
          profileData.user_current_status_user_current_status_user_idTousers;
        if (currentStatusArray?.length > 0) {
          initialFormData.master_user_current_status_id =
            currentStatusArray[0].master_user_current_status_id;
        }
      }

      const careerData = careerHistoryRes?.data?.data;
      if (careerData) {
        if (careerData.user_academics?.length > 0) {
          const latestAcademic = [...careerData.user_academics].sort(
            (a, b) => new Date(b.end_date) - new Date(a.end_date)
          )[0];
          Object.assign(initialFormData, {
            user_academic_id: latestAcademic.user_academic_id,
            institute: latestAcademic.master_organization_name,
            degree: latestAcademic.master_education_degree_name,
            institute_location: latestAcademic.location,
            graduation_date: latestAcademic.end_date
              ? latestAcademic.end_date.split("T")[0]
              : null,
          });
        }
        if (careerData.user_professions?.length > 0) {
          const sortedProfessions = [...careerData.user_professions].sort(
            (a, b) => new Date(b.start_date) - new Date(a.start_date)
          );
          setProfessionalHistory(sortedProfessions);
        } else {
          setProfessionalHistory([]);
        }
      }
      setFormData(initialFormData);
    } catch (e) {
      console.error("Failed to load initial data", e);
      showSnackbar("Failed to load profile data.", "error");
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditClick = (e, section) => {
    e.preventDefault();
    setOriginalFormData({ ...formData });
    setEditingSections({
      personal: false,
      communication: false,
      status: false,
      education: false,
      [section]: true,
    });
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    if (originalFormData) {
      setFormData(originalFormData);
    }
    setEditingSections({
      personal: false,
      communication: false,
      status: false,
      education: false,
    });
    setOriginalFormData(null);
  };

  const handleAddProfessional = () => {
    setEditingJob(null);
    setIsProfessionalModalOpen(true);
  };

  const handleEditProfessional = (job) => {
    setEditingJob(job);
    setIsProfessionalModalOpen(true);
  };

  const handleSavePersonalAndCommunication = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetchProfileData();
      refreshProfileData();
    } catch (err) {
      console.error("Error saving personal and communication details:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetchProfileData();
    } catch (err) {
      console.error("Error saving status:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEducation = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetchProfileData();
    } catch {
      console.error("Error saving education details");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfessional = async (modalFormData) => {
    const token = localStorage.getItem("authToken");
    const userId = Number(localStorage.getItem("userId"));
    const company = companiesList.find(
      (c) => c.text.trim() === modalFormData.master_organization_name?.trim()
    );
    const designation = designationsList.find(
      (d) => d.text.trim() === modalFormData.master_designation_name?.trim()
    );

    const professionData = {
      user_id: userId,
      master_organization_id: company
        ? company.id
        : modalFormData.master_organization_name,
      master_designation_id: designation
        ? designation.id
        : modalFormData.master_designation_name,
      start_date: modalFormData.start_date,
      end_date: modalFormData.end_date || null,
      location: modalFormData.location,
    };
    if (editingJob) {
      professionData.user_profession_id = editingJob.user_profession_id;
    }

    const payload = {
      source: "set_profile",
      user_professions: [professionData],
      user_id: userId,
      token,
    };

    try {
      const res = await axios.post(
        "https://dev.api-v1.dreambigportal.in/pub/public_api",
        payload
      );
      if (res.data.status === 200) {
        showSnackbar(
          `Professional details ${
            editingJob ? "updated" : "added"
          } successfully!`,
          "success"
        );
        setIsProfessionalModalOpen(false);
        setEditingJob(null);
        await fetchProfileData();
      } else {
        showSnackbar(`Failed to save details: ${res.data.message}`, "error");
      }
    } catch (err) {
      console.error("Professional Save Error:", err);
      showSnackbar(
        "An error occurred while saving. Please try again.",
        "error"
      );
    }
  };

  if (isLoading || Object.keys(formData).length === 0) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-container">
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
            <h2 className="profile-name">{`${formData.first_name || ""} ${
              formData.last_name || ""
            }`}</h2>
            <div className="progress-container">
              <div className="progress-bar-wrapper">
                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  className="custom-linear-progress"
                />
              </div>
              <span className="progress-percentage">{`${progressValue}%`}</span>
            </div>
          </div>
        </div>
      </div>

      <form
        className="profile-form-container"
        onSubmit={handleSavePersonalAndCommunication}
      >
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

      <form className="profile-form-container" onSubmit={handleSaveStatus}>
        <CurrentStatusDetails
          formData={formData}
          isEditing={editingSections.status}
          isSaving={isSaving}
          statusOptions={statusOptions}
          handleChange={handleChange}
          handleEditClick={(e) => handleEditClick(e, "status")}
          handleCancelClick={handleCancelClick}
        />
      </form>

      <form className="profile-form-container" onSubmit={handleSaveEducation}>
        <EducationDetails
          formData={formData}
          isEditing={editingSections.education}
          isSaving={isSaving}
          institutesList={institutesList}
          degreesList={degreesList}
          handleChange={handleChange}
          handleEditClick={(e) => handleEditClick(e, "education")}
          handleCancelClick={handleCancelClick}
        />
      </form>

      <div className="profile-form-container">
        <ProfessionalDetails
          professionalHistory={professionalHistory}
          onAdd={handleAddProfessional}
          onEdit={handleEditProfessional}
        />
      </div>

      <ProfessionalFormModal
        isOpen={isProfessionalModalOpen}
        onClose={() => {
          setIsProfessionalModalOpen(false);
          setEditingJob(null);
        }}
        onSave={handleSaveProfessional}
        initialData={editingJob}
        companiesList={companiesList}
        designationsList={designationsList}
      />

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
