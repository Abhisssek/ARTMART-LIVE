import React, { useRef } from "react";
import emailjs from "emailjs-com";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ContactPage.css"; // Import the external CSS
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../footer/Footer";

export const Contact = () => {
  const form = useRef();
 const [buttonLoading, setButtonLoading] = React.useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setButtonLoading(true);
    emailjs
      .sendForm(
        "service_p1rlaj9",
        "template_ubxfzzg",
        form.current,
        "AynbLDLuC0qlx0_uy"
      )
      .then(
        (result) => {
          toast.success("Email sent successfully!");
          setButtonLoading(false);
          form.current.reset();
        },
        (error) => {
          toast.error("Failed to send email. Try again!");
        }
      );
  };

  return (
    <>
    <Navbar />
    <div className="contact-container">
      <div className="contact-box">
        <h2 className="contact-title">Contact Us</h2>
        <form ref={form} onSubmit={sendEmail} className="contact-form">
          <div>
            <label className="contact-label">Name</label>
            <input
              type="text"
              name="name"
              required
              className="contact-input"
            />
          </div>
          <div>
            <label className="contact-label">Email</label>
            <input
              type="email"
              name="email"
              required
              className="contact-input"
            />
          </div>
          <div>
            <label className="contact-label">Message</label>
            <textarea
              name="title"
              rows="4"
              required
              className="contact-textarea"
            ></textarea>
          </div>
          <button type="submit" className="contact-button" disabled={buttonLoading}>
            {buttonLoading ? <span className="loader"></span> : "Submit"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" />
    </div>
    <Footer />
    </>
  );
};
