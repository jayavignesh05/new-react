import "./contact.css";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";

function Contact() {
  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Get in Touch</h1>
        <p>
          We're here to help. Contact us by phone, email, or use the form below.
        </p>
      </header>

      <section className="contact-info-section">
        <div className="contact-info-card">
          <div className="card-icon">
            <IoCallOutline/>
          </div>
          <div className="card-text">
            <h3>Phone</h3>
            <p>+91 98765 43210</p>
          </div>
        </div>
        <div className="contact-info-card">
          <div className="card-icon">
            <MdOutlineEmail/>
          </div>
          <div className="card-text">
            <h3>Email</h3>
            <p>support@caddcentre.com</p>
          </div>
        </div>
      </section>

      <section className="message-form-section">
        <h2>Send Us a Message</h2>
        <form>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="How can we help you?"
            ></textarea>
          </div>
          <button type="submit" onClick={(e)=>e.preventDefault()} className="form-submit-btn">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}

export default Contact;