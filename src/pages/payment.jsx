import { NavLink, useLocation } from "react-router-dom";
import "./payment.css";
import { MdKeyboardBackspace } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";

function Payment() {
  const location = useLocation();
  const couresname = location.state?.courses;
  const [paymentdata, setPaymentData] = useState([]);
  const [paymentstatus, setpaymentstatus] = useState({});
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

  async function apiCall() {
    const token = localStorage.getItem("authToken");
    const courseId = location.state?.user_course_id;

    const response = await axios.post(
      "https://dev.api-v1.dreambigportal.in/api/student_course_payments",
      {
        token: token,
        user_course_id: courseId,
        required: "my_courses_view",
      }
    );
    if (response.data && response.data.status === 200 && response.data.data) {
      // The API returns a single object that contains the history
      setpaymentstatus(response.data);
      setPaymentData(response.data.data);
    } else {
      console.log(
        response.data.message ||
          "Could not find payment details for this course."
      );
    }
  }
  console.log();

  useEffect(() => {
    apiCall();
  }, []);

  return (
    <div>
      <div className="main-container">
        <div className="content">
          <div>
            <NavLink className="back-button" to="/dashboard">
              <MdKeyboardBackspace /> Back to My Courses
            </NavLink>
          </div>
          {paymentdata.length > 0 ? (
            paymentdata.map((payment, index) => (
              <div key={index}>
                <div className="text">
                  <h1>Payment status</h1>
                  <p>Check your payment status below.</p>
                </div>

                <div className="status-container">
                  <h3>{couresname}</h3>
                  <div className="amount-status">
                    <div>
                      <p>{payment.paid_amount}</p>
                    </div>
                    <div>
                      {paymentstatus.pending_amount === 0 ? (
                        <span className="status-badge">paid</span>
                      ) : (
                        <button className="pay-now">due</button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="history">
                  <p>Payment History</p>
                  <div className="payment-history">
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Course Name</th>
                          <th>Invoice ID</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td data-label="Date">
                            {" "}
                            {formattedDate(payment.paid_at)}
                          </td>
                          <td data-label="Course Name">{couresname}</td>
                          <td data-label="Invoice ID">{payment.receipt_no}</td>
                          <td data-label="Amount">{payment.paid_amount}</td>
                          <td data-label="Status">
                            <span className="status-paid">paid</span>
                          </td>
                          <td data-label="Action">
                            <button className="invoice-btn">Invoice</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>no data found</div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Payment;
