import React, { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import { BiBook } from "react-icons/bi";
import "./deliverable.css";
import { MdArrowDropDown } from "react-icons/md";
import axios from "axios";

function Deliverable() {
  const location = useLocation();

  const [activeIndex, setActiveIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState(null);
  const id = location.state?.user_course_id;
  const [deliverabledata, setdeliverabledata] = useState([]);

  const apiCall = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        "https://api-v1.dreambigportal.in/api/my_courses",
        {
          token: token,
          required: "my_course_deliverables_list",
          user_course_id: id,
        }
      );
      if (response.data && response.data.status === 200) {
        setdeliverabledata(
          response.data.data.course_title_code_concept_levels || []
        );
      } else {
        console.log(
          response.data.message ||
            "Could not find payment details for this course."
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    apiCall();
  }, []);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleEbookClick = (item) => {
    setIsModalOpen(true);
    setSelectedEbook(item);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEbook(null);
  };

  return (
    <>
      <div className="main-container">
        <div className="content">
          <NavLink className="back-link" to="/dashboard">
            <MdKeyboardBackspace style={{ marginRight: "6px" }} /> Back to My
            Courses
          </NavLink>

          <div className="text" style={{ margin: "2rem 0" }}>
            <h1>Deliverable</h1>
            <p>Download your course materials below.</p>
          </div>

          {deliverabledata.map((level, index) => (
            <div className="course-card" key={level.id}>
              <div
                onClick={() => handleToggle(index)}
                className="course-header"
              >
                <div>
                  <div className="course-title">
                    <span>
                      {
                        level.user_course_payment_deliverables[0]
                          .course_concept_name
                      }{" "}
                      -{" "}
                      {
                        level.user_course_payment_deliverables[0]
                          .course_level_name
                      }
                    </span>
                    <span
                      className={`chevron ${
                        activeIndex === index ? "open" : ""
                      }`}
                    >
                      <MdArrowDropDown size={24} />
                    </span>
                  </div>
                  <div
                    className={`course-content ${
                      activeIndex === index ? "open" : ""
                    }`}
                  >
                    {level.user_course_payment_deliverables.map((item) => (
                      <button
                        className="ebook-btn"
                        key={item.id}
                        onClick={() => handleEbookClick(item)}
                      >
                        <BiBook size={30} />
                        <span>{item.course_deliverable_name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedEbook && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEbook.course_concept_name}</h2>
              <button className="close-button" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="content-body">
                <p>{selectedEbook.course_deliverable_name}</p>
                <button>view</button>
              </div>

              {selectedEbook.content && (
                <div className="content-body">
                  <p>{selectedEbook.course_concept_name}</p>
                  <button>view</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Deliverable;
