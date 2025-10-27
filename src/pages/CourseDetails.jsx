import React, { useState, useEffect } from "react";
import { useLocation, useParams, NavLink } from "react-router-dom";
import Loading from "../components/loading";
import "./home.css";
import { MdKeyboardBackspace } from "react-icons/md";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { LuBook } from "react-icons/lu";

const getEnabledAddons = (course) => {
  const enabled = {
    syllabus: false,
    ebook: false,
    video: false,
    lab: false,
    quiz: false,
    interview: false,
    links: false,
  };
  if (!course?.deliverables) return enabled;
  course.deliverables.forEach((d) => {
    if (
      d.addons?.some(
        (a) =>
          a.name === "Expert Video Session" || a.name === "FTR - Session Videos"
      )
    )
      enabled.video = true;
    if (
      d.user_course_payment_deliverables?.some(
        (i) => i.course_deliverable_type_name === "E-Learning Guide"
      )
    )
      enabled.ebook = true;
  });
  return enabled;
};

const getEbookDetails = (course) => {
  const groupedDetails = {};
  if (!course?.deliverables) return groupedDetails;
  course.deliverables.forEach((deliverable) => {
    if (deliverable.user_course_payment_deliverables) {
      deliverable.user_course_payment_deliverables.forEach((item) => {
        if (item.course_deliverable_type_name === "E-Learning Guide") {
          const conceptName = item.course_concept_name || "N/A";
          const levelName = item.course_level_name || "N/A";
          const deliverableName =
            item.course_deliverable_name || "Unnamed E-Book";
          const groupKey = `${conceptName} - ${levelName}`;
          if (!groupedDetails[groupKey]) {
            groupedDetails[groupKey] = [];
          }
          groupedDetails[groupKey].push(deliverableName);
        }
      });
    }
  });
  return groupedDetails;
};

const addonDisplayNames = {
  syllabus: "Syllabus",
  ebook: "E-Book",
  video: "Videos",
  lab: "Lab Exercises",
  quiz: "Quiz",
  interview: "Interview Questions",
  links: "Reference Links",
};

function CourseDetails() {
  const location = useLocation();
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [enabledAddonsList, setEnabledAddonsList] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [ebookGroups, setEbookGroups] = useState({});
  const [openAccordionKey, setOpenAccordionKey] = useState(null);
  const [selectedEbook, setSelectedEbook] = useState(null);

  useEffect(() => {
    if (location.state?.courseData) {
      const data = location.state.courseData;
      setCourseData(data);
      const addonsStatus = getEnabledAddons(data);
      const enabledList = Object.entries(addonsStatus)
        .filter(([, value]) => value === true)
        .map(([key]) => key);
      setEnabledAddonsList(enabledList);
      const details = getEbookDetails(data);
      setEbookGroups(details);
      const clickedAddon = location.state.activeAddon;
      let initialTab = "";
      if (clickedAddon && enabledList.includes(clickedAddon)) {
        initialTab = clickedAddon;
      } else if (enabledList.length > 0) {
        initialTab = enabledList[0];
      }
      setActiveTab(initialTab);
      if (initialTab === "ebook" && Object.keys(details).length > 0) {
        setOpenAccordionKey(Object.keys(details)[0]);
      }
      setLoadingInitial(false);
    } else {
      console.warn("Course data not found in state...");
      setLoadingInitial(false);
    }
  }, [location.state, id]);

  const toggleAccordion = (key) => {
    setOpenAccordionKey(openAccordionKey === key ? null : key);
  };
  const handleEbookSelect = (groupKey, ebookName) => {
    setSelectedEbook({ groupKey, name: ebookName });
  };

  if (loadingInitial) {
    return <Loading />;
  }
  if (!courseData) {
    return (
      <div className="my-courses-page">
        {" "}
        Error: Course data could not be loaded.{" "}
      </div>
    );
  }

  const hasEbookGroups = Object.keys(ebookGroups).length > 0;

  return (
    <div className="my-courses-page">
      <NavLink to="/dashboard" className="course-detail-back-link">
        <MdKeyboardBackspace size={24} />
        <h2>{courseData.course_criteria_title_name}</h2>
      </NavLink>

      {enabledAddonsList.length > 0 ? (
        <>
          <nav className="course-tabs-nav" style={{ marginTop: "20px" }}>
            {enabledAddonsList.map((addonKey) => (
              <button
                key={addonKey}
                onClick={() => {
                  setActiveTab(addonKey);
                  if (
                    addonKey === "ebook" &&
                    hasEbookGroups &&
                    !openAccordionKey
                  ) {
                    setOpenAccordionKey(Object.keys(ebookGroups)[0]);
                  }
                  setSelectedEbook(null);
                }}
                className={`tab-in-button ${
                  activeTab === addonKey ? "active" : ""
                }`}
              >
                {addonDisplayNames[addonKey] || addonKey}
              </button>
            ))}
          </nav>

          <div
            className="tab-content"
            style={{
              marginTop: "20px",
              background: "white",
              borderRadius: "10px",
              minHeight: "300px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            {activeTab === "ebook" && (
              <div className="ebook-tab-container">
                {/* Left Column: Accordion List */}
                <div className="ebook-accordion-column">
                  {hasEbookGroups ? (
                    Object.entries(ebookGroups).map(
                      ([groupKey, deliverableNames]) => {
                        const isOpen = openAccordionKey === groupKey;
                        return (
                          <div
                            key={groupKey}
                            className="accordion-item"
                            style={{
                              marginBottom: "0",
                              borderBottom: "1px solid #eee",
                              overflow: "hidden",
                            }}
                          >
                            <button
                              className="accordion-header"
                              onClick={() => toggleAccordion(groupKey)}
                              style={{
                                background: "none",
                                border: "none",
                                width: "100%",
                                textAlign: "left",
                                padding: "15px 10px",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "1em",
                                fontWeight: "600",
                              }}
                            >
                              <span
                                style={{
                                  color: isOpen
                                    ? "#3b82f6"
                                    : "var(--text-primary)",
                                  width: "90%",
                                }}
                              >
                                {" "}
                                {groupKey}{" "}
                              </span>
                              <span
                                className={`accordion-chevron ${
                                  isOpen ? "open" : ""
                                }`}
                              >
                                {" "}
                                <BsChevronDown />{" "}
                              </span>
                            </button>
                            <div
                              className={`accordion-content ${
                                isOpen ? "open" : ""
                              }`}
                            >
                              <div style={{ padding: "0px 10px 15px 25px" }}>
                                {deliverableNames.map((name, nameIndex) => {
                                  const isSelected =
                                    selectedEbook?.name === name &&
                                    selectedEbook?.groupKey === groupKey;
                                  return (
                                    <button
                                      key={nameIndex}
                                      onClick={() =>
                                        handleEbookSelect(groupKey, name)
                                      }
                                      className={`ebook-name-button ${
                                        isSelected ? "selected" : ""
                                      }`}
                                      style={{
                                        background: "none",
                                        border: "none",
                                        padding: "5px 0",
                                        margin: "0 0 4px 0",
                                        color: isSelected
                                          ? "#3b82f6"
                                          : "var(--text-secondary)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        width: "100%",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      <LuBook size={16} /> {name}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <p
                      style={{
                        padding: "20px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {" "}
                      No E-book details found.{" "}
                    </p>
                  )}
                </div>

                {/* Right Column: Content Display Area */}
                <div className="ebook-content-column">
                  {selectedEbook ? (
                    <div>
                      <h3>{selectedEbook.name}</h3>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.9em",
                        }}
                      >
                        {" "}
                        From: {selectedEbook.groupKey}{" "}
                      </p>
                      <hr style={{ margin: "15px 0", borderColor: "#eee" }} />
                      <p>Content for "{selectedEbook.name}" would load here.</p>
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        color: "var(--text-secondary)",
                        paddingTop: "50px",
                      }}
                    >
                      {" "}
                      Select to open E-Book{" "}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "video" && (
              <div>
                {" "}
                <h2>Videos Section</h2> <p>Video content goes here...</p>{" "}
              </div>
            )}
            {activeTab && !["ebook", "video"].includes(activeTab) && (
              <div>
                {" "}
                <h2>{addonDisplayNames[activeTab]} Section</h2>{" "}
                <p>Content for {addonDisplayNames[activeTab]}...</p>{" "}
              </div>
            )}
          </div>
        </>
      ) : (
        <p style={{ marginTop: "20px", color: "var(--text-secondary)" }}>
          {" "}
          No specific addons available for this course.{" "}
        </p>
      )}
    </div>
  );
}

export default CourseDetails;
