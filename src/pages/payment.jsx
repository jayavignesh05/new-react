import { NavLink, useLocation } from "react-router-dom";
import "./payment.css"; // Make sure you have this CSS file
import { MdKeyboardBackspace } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/loading"; // Assuming you have a Loading component

function Payment() {
  const location = useLocation();
  const couresname = location.state?.courses;
  const courseId = location.state?.user_course_id; // Get courseId from state

  const [paymentData, setPaymentData] = useState([]); // For the history table (paid_detail array)
  const [paymentStatus, setPaymentStatus] = useState({}); // For overall status (total_amount, pending_amount)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  function formattedDate(dateString) {
    if (!dateString) return "--";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "--";
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear().toString().slice(-2);
      return `${day}/${monthIndex}/${year}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return "--";
    }
  }

  // --- API CALL ---
  async function apiCall() {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");

    if (!courseId) {
      console.error("User Course ID not found in location state.");
      setError("Course ID missing. Cannot fetch payment details.");
      setLoading(false);
      return;
    }
    if (!token) {
        console.error("Auth token not found.");
        setError("Authentication token missing. Please log in again.");
        setLoading(false);
        return;
    }

    try {
      const response = await axios.post(
        "https://api-v5.dreambigportal.in/pub/public_api",
        {
          source: "student_course_payments",
          token: token,
          user_course_id: courseId,
        }
      );

      if (response.data && response.data.status === 200 && response.data.data) {
        setPaymentStatus(response.data.data);
        setPaymentData(response.data.data.paid_detail || []);
      } else {
        console.error("API Error:", response.data.message || "Unknown API error");
        setError(response.data.message || "Could not fetch payment details.");
        setPaymentData([]);
        setPaymentStatus({});
      }
    } catch (err) {
      console.error("Axios Error fetching payment data:", err);
      setError("An error occurred while fetching payment details. Please try again.");
      setPaymentData([]);
      setPaymentStatus({});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (courseId) {
      apiCall();
    } else {
      setError("Course ID is missing.");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  if (loading) {
    return <Loading />;
  }

   if (error) {
     return (
       <div className="main-container">
         <div className="content">
             <NavLink className="back-button" to="/dashboard">
               <MdKeyboardBackspace /> Back to My Courses
             </NavLink>
             <div className="text">
                 <h1>Payment Status Error</h1>
                 <p style={{ color: 'red' }}>{error}</p>
             </div>
         </div>
       </div>
     );
   }

  const hasHistory = paymentData.length > 0;

  // --- START: Updated JSX Return Section ---
  return (
    <div>
      <div className="main-container">
        <div className="content">
          <div>
            <NavLink className="back-button" to="/dashboard">
              <MdKeyboardBackspace /> Back to My Courses
            </NavLink>
          </div>

          {/* --- Overall Status Section --- */}
          <div className="text">
            <h1>Payment status</h1>
            <p>Check your payment status below.</p>
          </div>
          <div className="status-container">
            <h3>{couresname || "Course Name"}</h3>
            <div className="amount-status">
              <div>
                {/* --- CHANGE 1: Display Pending Amount --- */}
                <p>
                  Pending : ₹{Number(paymentStatus.pending_amount || 0).toLocaleString('en-IN')}
                </p>
                
              
              </div>
              <div>
                {/* --- CHANGE 2: Show Pay Now button or Paid badge --- */}
                {Number(paymentStatus.pending_amount) === 0 ? (
                  <span className="status-badge paid">Paid</span>
                ) : (
                  // Assuming you have a CSS class "pay-now-button"
                  <button className="pay-now-button">Pay Now</button>
                )}
              </div>
            </div>
          </div>

          {/* --- Payment History Section (No changes here) --- */}
          {hasHistory ? (
            <div className="history">
              <p>Payment History</p>
              <div className="payment-history">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Course Name</th>
                      <th>Invoice ID</th>
                      <th>Amount Paid</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentData.map((payment, index) => (
                      <tr key={payment.cart_id || index}>
                        <td data-label="Date">
                          {formattedDate(payment.paid_at)}
                        </td>
                        <td data-label="Course Name">{couresname || "N/A"}</td>
                        <td data-label="Invoice ID">{payment.receipt_no || "--"}</td>
                        <td data-label="Amount Paid">₹{payment.paid_amount || 0}</td>
                        <td data-label="Status">
                          <span className="status-paid">Paid</span>
                        </td>
                        <td data-label="Action">
                          <button className="invoice-btn">Invoice</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="history">
              <p>Payment History</p>
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#888'}}>No payment history found for this course.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  // --- END: Updated JSX Return Section ---
}
export default Payment;