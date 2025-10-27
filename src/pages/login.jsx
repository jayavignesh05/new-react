import { useState, useEffect, useRef, useMemo } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import caddcentreLogo from "../assets/caddcentre.svg";
import axios from "axios";
import "./Login.css";

function Login() {
  const [activeTab, setActiveTab] = useState("mobile");
  const [mobileNo, setMobileNo] = useState("");
  const [emailId, setEmailId] = useState("");
  const navigate = useNavigate();
  const [isInputValid, setIsInputValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const otpInputRefs = useRef([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const mobileRegex = useMemo(() => /^[6-9]\d{9}$/, []);
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
 

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    setErrorMsg("");
    if (activeTab === "mobile") {
      setIsInputValid(mobileRegex.test(mobileNo));
    } else {
      setIsInputValid(emailRegex.test(emailId));
    }
  }, [activeTab, mobileNo, emailId, mobileRegex, emailRegex]);

 

  const handleGetOtp = async () => {
    if (!isInputValid) {
      setErrorMsg("Please enter a valid mobile number or email address.");
      return;
    }
    setIsLoading(true);

    const response = await axios.post(
      "https://dreambigportal.com/public/api/otp.php",
      {
        user_id: mobileNo ? mobileNo : emailId,
        package_name: "lms.caddcentre.com",
      }
    );
    if (response.status === 200) {
      setShowOtpInput(true);
      setCountdown(11);
      setErrorMsg("");
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setErrorMsg("Failed to send OTP. Please try again.");
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleGetOtp();
    }
  };

  const handleResendOtp = () => {
    setErrorMsg("OTP has been resent!");
    setCountdown(11);
  };

  const handleClear = () => {
    setMobileNo("");
    setEmailId("");
    setOtp(new Array(4).fill(""));
    setShowOtpInput(false);
    setCountdown(0);
    setErrorMsg("");
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value) || isVerifying) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);


    if (element.value && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
    if (otp.join("").length >= 3) {

      const finalOtp = newOtp.join("");
      handleOtpSubmit(finalOtp);
    }
  };

  const handleOtpSubmit = async (finalOtp) => {
    const enteredOtp = finalOtp || otp.join("");
  
    if (enteredOtp.length < 4) {
      if (!finalOtp) {
        setErrorMsg("Please enter the complete 4-digit OTP.");
      }
      return;
    }

    setIsVerifying(true);
    setErrorMsg("");

    try {
      const response = await axios.post(
        "https://api-v1.dreambigportal.in/api/login",
        {
          source: "login",
          user_id: mobileNo ? mobileNo : emailId,
          package_name: "lms.caddcentre.com",
          password: enteredOtp,
          token: null,
        }
      );

      if (
        response.data &&
        response.data.status === 200 &&
        response.data.data.token
      ) {
        const token = response.data.data.token;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", response.data.data.id);
        localStorage.setItem("userName", response.data.data.first_name);
        localStorage.setItem(
          "profile_picture",
          response.data.data.profile_picture
        );

        navigate("/dashboard");
      } else {
        setErrorMsg(response.data.message || "Invalid OTP. Please try again.");
        setOtp(new Array(4).fill(""));
        otpInputRefs.current[0].focus();
      }
    } catch {
      setErrorMsg("An error occurred. Please try again later.");
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src={caddcentreLogo} alt="Logo" />
        </div>
        <div className="tab-switcher">
          <button
            className={`tab-button ${activeTab === "mobile" ? "active" : ""}`}
            onClick={() => setActiveTab("mobile")}
          >
            MOBILE NO
          </button>
          <button
            className={`tab-button ${activeTab === "email" ? "active" : ""}`}
            onClick={() => setActiveTab("email")}
          >
            EMAIL ID
          </button>
        </div>
        <div className="login-form">
          {activeTab === "mobile" ? (
            <div className="input-group">
              <label htmlFor="mobileNo">Mobile No</label>
              <div className="mobile-input-container">
                <span className="country-code">
                  <img
                    src="https://flagcdn.com/in.svg"
                    alt="India Flag"
                    className="flag-icon"
                  />{" "}
                  +91
                </span>
                <input
                  type="tel"
                  id="mobileNo"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  onKeyDown={handleEnter}
                  maxLength="10"
                  disabled={showOtpInput}
                />
              </div>
            </div>
          ) : (
            <div className="input-group">
              <label htmlFor="emailId">Email ID</label>
              <input
                type="email"
                id="emailId"
                placeholder="Enter your email address"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                disabled={showOtpInput}
              />
            </div>
          )}
          {errorMsg && (
            <div
              className="error-message"
              style={{ color: "red", marginBottom: "10px" }}
            >
              {errorMsg}
            </div>
          )}
          {showOtpInput && (
            <div className="otp-section">
              <div className="otp-input-container">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    pattern="\d*"
                    className="otp-input"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    disabled={isVerifying}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="button-group">
            {showOtpInput ? (
              <>
                <button
                  className="otp-button verify-otp-button"
                  onClick={() => handleOtpSubmit()}
                  disabled={isVerifying || otp.join("").length < 4}
                >
                  {isVerifying ? <div className="spinner"></div> : "VERIFY OTP"}
                </button>
                <button
                  className="resend-button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `RESEND OTP IN ${countdown}S` : "RESEND OTP"}
                </button>
              </>
            ) : (
              <>
                <button
                  className="otp-button get-otp-button"
                  onClick={handleGetOtp}
                  disabled={!isInputValid}
                >
                  {isLoading ? "loading..." : "GET OTP"}
                </button>
                <button className="clear-button" onClick={handleClear}>
                  CLEAR
                </button>
              </>
            )}
          </div>
        </div>
        <Link to="/privacy" className="privacy-link">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}

export default Login;
