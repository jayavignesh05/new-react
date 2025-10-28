// src/pages/Feedback.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useLocation, NavLink } from "react-router-dom";
import Loading from "../components/loading";
import { MdKeyboardBackspace } from "react-icons/md";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import "./feedback.css";

// Base API configuration (Used for both calls)
const API_URL = "https://api-v5.dreambigportal.in/pub/public_api";
const MASTER_APP_ID = 5;
const USER_ROLE_ID = 2; // Assuming the role ID is 2 from your payload example

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

// Helper to safely parse and map answers/options
const parseOptions = (optionsList, question) => {
    if (!question.master_course_feedback_answer_ids || !optionsList.length) {
        return [];
    }
    const requiredIds = question.master_course_feedback_answer_ids
        .split(",")
        .map((id) => parseInt(id.trim()));
    return optionsList.filter((opt) => requiredIds.includes(opt.id));
};

// ===================================================================
// COMPONENTS
// ===================================================================

// Component for displaying a single radio button question (Type 1)
// --- MODIFIED to accept questionNumber ---
const RadioQuestion = ({ question, options, value, onChange, questionNumber }) => {
    const questionOptions = parseOptions(options, question);
    const displayText = `${questionNumber}. ${question.name}`;

    return (
        <div className="feedback-question-item">
            <label className="question-text">{displayText}</label>
            <div className="answer-options-group">
                {questionOptions.map((option) => (
                    <div key={option.id} className="answer-option">
                        <input
                            type="radio"
                            id={`q${question.id}_opt${option.id}`}
                            name={`q_${question.id}`}
                            value={option.id}
                            checked={value === String(option.id)}
                            onChange={() => onChange(question.id, option.id)}
                        />
                        <label htmlFor={`q${question.id}_opt${option.id}`}>
                            {option.name}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Component for displaying a text area question (Type 2)
// --- MODIFIED to accept questionNumber ---
const CommentQuestion = ({ question, value, onChange, questionNumber }) => (
    <div className="feedback-question-item">
        <label className="question-text">{`${questionNumber}. ${question.name}`}</label>
        <input
            type="text"
            className="feedback-textarea"
            placeholder="ENTER YOUR COMMENTS HERE"
            value={value}
            onChange={(e) => onChange(question.id, e.target.value)}
        />
    </div>
);

// Component for star rating question (Type 3)
// --- MODIFIED to accept questionNumber ---
const RatingQuestion = ({ question, value, onChange, questionNumber }) => {
    const maxStars = 5; 
    const ratingValue = parseInt(value) || 0;

    return (
        <div className="feedback-question-item">
            <label className="question-text">{`${questionNumber}. ${question.name}`}</label>
            <div className="star-rating-group">
                {[...Array(maxStars)].map((_, i) => {
                    const starValue = i + 1;
                    const Icon = starValue <= ratingValue ? AiFillStar : AiOutlineStar;
                    return (
                        <Icon
                            key={i}
                            size={28}
                            onClick={() => onChange(question.id, starValue)}
                            style={{
                                cursor: "pointer",
                                color: starValue <= ratingValue ? "#ffc107" : "#e4e5e9",
                                transition: "color 0.2s",
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

// ===================================================================
// MAIN FEEDBACK COMPONENT
// ===================================================================
function Feedback() {
    const location = useLocation();
    const user_course_id = location.state?.user_course_id;
    const courseTitle = location.state?.coure_title || "Course Feedback";

    const [questions, setQuestions] = useState([]);
    const [options, setOptions] = useState([]);
    const [answers, setAnswers] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    const groupedQuestions = useMemo(() => {
        const groups = { radio: [], comment: [], rating: [] };
        questions.forEach((q) => {
            if (q.master_question_type_id === 1) {
                groups.radio.push(q);
            } else if (q.master_question_type_id === 2) {
                groups.comment.push(q);
            } else if (q.master_question_type_id === 3) {
                groups.rating.push(q);
            }
        });
        return groups;
    }, [questions]);

    // --- API Call to Fetch Questions and Options (Remains the same) ---
    const fetchFeedbackData = useCallback(async () => {
        if (!token || !userId || !user_course_id) {
            setError("Missing user details or course ID.");
            setLoading(false);
            return;
        }

        try {
            const [questionsRes, optionsRes] = await Promise.all([
                axios.post(API_URL, {
                    token: token,
                    source: "show_feedback",
                    master_app_id: MASTER_APP_ID,
                    user_course_id: user_course_id,
                }),
                axios.post(API_URL, {
                    token: token,
                    source: "show_feedback_options",
                    master_app_id: MASTER_APP_ID,
                    user_course_id: user_course_id,
                }),
            ]);

            if (
                questionsRes.data?.status === 200 &&
                optionsRes.data?.status === 200
            ) {
                setQuestions(questionsRes.data.data || []);
                setOptions(optionsRes.data.data || []);
            } else {
                setError("Failed to load feedback questions.");
            }
        } catch (err) {
            console.error("Feedback fetch error:", err);
            setError("Network error while loading form.");
        } finally {
            setLoading(false);
        }
    }, [token, userId, user_course_id]);

    useEffect(() => {
        fetchFeedbackData();
    }, [fetchFeedbackData]);

    // --- Handle Answer Change (Remains the same) ---
    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: String(value),
        }));
    };

    // --- Handle Form Submission (Remains the same) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const requiredQuestions = questions.filter(
            (q) => q.master_question_type_id !== 2
        );
        const isFormValid = requiredQuestions.every(
            (q) => answers[q.id] !== undefined && answers[q.id].trim() !== ""
        );

        if (!isFormValid) {
            setError("Please answer all required questions.");
            setIsSubmitting(false);
            return;
        }

        console.log("Submitting Answers:", answers);

        try {
            // Simulate API Submission (REPLACE THIS WITH ACTUAL SUBMISSION API CALL)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setSubmitSuccess(true);
        } catch {
            setError("Submission Failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render Logic (Remains the same) ---
    if (loading) return <Loading />;
    if (error && !submitSuccess)
        return (
            <div className="feedback-page-container">
                <p className="error-message">{error}</p>
                <button onClick={fetchFeedbackData} className="btn-retry">
                    Retry Load
                </button>
            </div>
        );
    if (submitSuccess)
        return (
            <div className="feedback-page-container success-message">
                <h2>Thank You!</h2>
                <p>Your feedback has been submitted successfully.</p>
                <NavLink to="/dashboard" className="btn-back">
                    Go back to My Courses
                </NavLink>
            </div>
        );

    // --- Render Questions ---
    let questionCounter = 0; // Initialize a counter for continuous numbering

    return (
        <div className="feedback-page-container">
            <form onSubmit={handleSubmit} className="feedback-form">
                <NavLink to="/dashboard" className="back-button">
                    <MdKeyboardBackspace size={24} /> Back to My Courses
                </NavLink>
                <h1 className="form-title">{courseTitle}</h1>

                <div className="question-section">
                    {/* Radio Questions */}
                    {groupedQuestions.radio.map((q) => (
                        <RadioQuestion
                            key={q.id}
                            question={q}
                            options={options}
                            value={answers[q.id]}
                            onChange={handleAnswerChange}
                            questionNumber={++questionCounter} // Increment and use counter
                        />
                    ))}

                    {/* Rating Questions */}
                    {groupedQuestions.rating.map((q) => (
                        <RatingQuestion
                            key={q.id}
                            question={q}
                            options={options}
                            value={answers[q.id]}
                            onChange={handleAnswerChange}
                            questionNumber={++questionCounter} // Increment and use counter
                        />
                    ))}

                    {/* Comment/Text Questions */}
                    {groupedQuestions.comment.map((q) => (
                        <CommentQuestion
                            key={q.id}
                            question={q}
                            value={answers[q.id]}
                            onChange={handleAnswerChange}
                            questionNumber={++questionCounter} // Increment and use counter
                        />
                    ))}
                </div>
                <div className="submit-section">
                    <button type="submit" disabled={isSubmitting} className="btn-submit">
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
                {error && <p className="form-error-message">{error}</p>}
            </form>
        </div>
    );
}

export default Feedback;