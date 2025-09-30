import "./home.css";
import { AiFillBank, AiFillFileText } from "react-icons/ai";
import { LuGraduationCap } from "react-icons/lu";
import { MdFeedback } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import Loading from "../components/loading";

import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

function Home() {
  const slide = sessionStorage.getItem("activeSlide");
  const [loading, setLoading] = useState(true);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function formattedDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${monthNames[monthIndex]}-${year}`;
  }

  const [dashboardData, setDashboardData] = useState([]);

  async function apiCall() {
     setLoading(true);
    const token = localStorage.getItem("authToken");
try{
    const response = await axios.post(
      "https://dev.api-v1.dreambigportal.in/api/my_courses",
      {
        token: token,
        required: "my_courses_view",
      }
    );
      setLoading(false);

    setDashboardData(response.data.data);
      } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    apiCall();
  }, []);
if (loading) {
    return (<Loading/>);
  }
  return (
    <div className="home-container">
      <div className="title">
        <h1>My Courses</h1>
      </div>
      <Swiper
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
        style={{
          "--swiper-navigation-color": "red",
          "--swiper-navigation-top-offset": "52%",
          "--swiper-navigation-sides-offset": "5px",
          "--swiper-navigation-size": " 30px",
        }}
        initialSlide={slide}
        onSlideChange={(swiper) => {
          sessionStorage.setItem("activeSlide", swiper.activeIndex);
        }}
      >
        {dashboardData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="card">
              <div className="card-head">
                <div className="head-content">
                  {item.course_criteria_title_name}
                </div>
                <div className="head-time">
                  <h6>{item.duration} Hrs</h6>
                </div>
              </div>
              <div className="card-content">
                <div className="status">
                  {item.master_certificate_name === "In Progress" ? (
                    <p style={{ background: "#A4EEFF", color: " #03658F" }}>
                      {item.master_certificate_name}
                    </p>
                  ) : item.master_certificate_name === "Completed" ? (
                    <p style={{ background: "#A4FFA7", color: " #087A06" }}>
                      {item.master_certificate_name}
                    </p>
                  ) : (
                    <p style={{ background: "#FFA4A6", color: " #8F0303" }}>
                      {item.master_certificate_name}
                    </p>
                  )}
                </div>
                <div className="date">
                  <div>
                    <p> START</p>
                    <span>{formattedDate(item.created_at)}</span>
                  </div>
                  <div>
                    <p> ENROLLED</p>
  
                   <span>{formattedDate(item.created_at)}</span>
                  </div>
                  <div>
                    <p> END</p>
                    <span state={{completdate:item.end_date}}> {formattedDate(item.created_at)} </span>
                  </div>
                </div>
                <div className="progress">
                  <p> PROGRESS</p>
                  <p> 40%</p>
                </div>
                <div>
                  <div className="progress-bar"></div>
                </div>
                <div className="courses-details">
                  <NavLink className="items" to={`/payment`} state={{ user_course_id: item.id,courses:item.course_criteria_title_name }} >
                    <div className="icons">
                      <AiFillBank size={40} color="white" />
                    </div>
                    payment
                  </NavLink>

                  <div className="arrow-wrapper">
                    <BsArrowRight className="arrows" />
                    <div className="arrow-empty"></div>
                  </div>

                  {item.start_date !== ("") ? (
                    <NavLink className="items" to={`/deliverable`} state={{ user_course_id: item.id}} >
                      <div className="icons">
                        <AiFillFileText size={40} color="white" />
                      </div>
                      deliverable
                    </NavLink>
                  ) : (
                    <NavLink className="items" style={{ color: "#55555580" }}>
                      <div
                        className="icons"
                        style={{ background: "#e6394778" }}
                      >
                        <AiFillFileText size={40} color="white" />
                      </div>
                      deliverable
                    </NavLink>
                  )}

                  <div className="arrow-wrapper">
                    <BsArrowRight className="arrows" />
                    <div className="arrow-empty"></div>
                  </div>
                
                    <NavLink className="items" style={{ color: "#55555580" }}>
                      <div
                        className="icons"
                        style={{ background: "#e6394778" }}
                      >
                        <MdFeedback size={40} color="white" />
                      </div>
                      feedback
                    </NavLink>
                 

                  <div className="arrow-wrapper">
                    <BsArrowRight
                      className="arrows"
                      style={{ color: "#e6394778" }}
                    />
                    <div className="arrow-empty"></div>
                  </div>

                  <NavLink className="items" style={{ color: "#55555580" }}>
                    <div className="icons" style={{ background: "#e6394778" }}>
                      <LuGraduationCap size={40} color="white" />
                    </div>
                    certificate
                  </NavLink>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
export default Home;
