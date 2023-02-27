import TwitterIcon from "@mui/icons-material/Twitter";
import React, { useState } from "react";
import styles from "../css/Contact.module.css";
import axios from "axios";
import { Alert, Backdrop } from "@mui/material";

const ContactPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let emailValid = true;
    let commentValid = true;

    if (!email) {
      setEmailError("Email is required!");
      emailValid = false;
    } else if (!isEmail(email)) {
      setEmailError("Invalid email format!");
      emailValid = false;
    } else {
      setEmailError("");
    }

    if (!message) {
      setMessageError("Message is required!");
      commentValid = false;
    } else {
      setMessageError("");
    }
    if (emailValid && commentValid) {
      const formData = {
        name: name,
        email: email,
        testing: message,
      };
      sendEmail(formData);
    }
  };

  const sendEmail = (formData) => {
    axios
      .post(
        "https://docs.google.com/forms/d/e/1FAIpQLScnt72kXvBZt5GSRfHw7-ZL6KO8avuP4FgRM_uj3MTnRMiQ4Q/formResponse",
        formData
      )
      .then((res) => {
        if (res.status === 200) {
          setIsSubmitted(true);
        }
      })
      .catch((error) => {
        console.log("hello", error);
      });
  };

  const isEmail = (email) => {
    var regexEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexEmail.test(String(email).toLowerCase());
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          {/* <h5 className={styles.h5Text}>Contact Us</h5> */}
          <h1 className={styles.h1Text}>Get In Touch With Us</h1>
          {/* <p className={styles.para}>
            We value your feedback and inquiries, and we want to hear from you.
            If you have any questions, comments, or concerns, please feel free
            to use this page to get in touch with our team.
          </p> 
          <p className={styles.para}>
            We are committed to addressing your needs promptly and
            professionally. Whether you want to reach out for possible
            integration and partnership, have a question about our product, need
            help with an order, or simply want to provide feedback, we are here
            to assist you.
          </p>
          <p className={styles.para}>
            To contact us, please fill out the contact form on this page with
            your name, email address, and a brief message describing your
            inquiry. We will get back to you.
          </p>
          <p className={styles.para}>
            We appreciate your interest in what we are building and look forward
            to hearing from you!
          </p> */}
          <div className={styles.mediums}>
            {/* <div className={styles.details}>
              <div className={styles.icon}>
                <EmailIcon />{" "}
              </div>
              <div className={styles.contents}>
                <p className={styles.item}>Email Address</p>
                <p className={styles.info}>codesherpa.xs@gmail.com</p>
              </div>
            </div> */}
            <div className={styles.details}>
              <div className={styles.icon}>
                <TwitterIcon />
              </div>
              <div className={styles.contents}>
                <p className={styles.item}>Twitter</p>
                <p className={styles.info}>https://twitter.com/financexs</p>
              </div>
            </div>
            {/* <div className={styles.details}>
              <div className={styles.icon}>
                <FontAwesomeIcon icon={faMessage} />
              </div>
              <div className={styles.contents}>
                <p className={styles.item}>Discord</p>
                <p className={styles.info}>https://discord.com/channels/@me</p>
              </div>
            </div> */}
          </div>
        </div>

        <iframe
          id="google-form"
          title="contact-us"
          src="https://docs.google.com/forms/d/e/1FAIpQLScnt72kXvBZt5GSRfHw7-ZL6KO8avuP4FgRM_uj3MTnRMiQ4Q/viewform?embedded=true"
          className={styles.rightSection}
          width="640"
          height="645"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        >
          Loading…
        </iframe>

        {/* <form className={styles.rightSection} onSubmit={handleSubmit}>
          <input
            className={styles.textInput}
            type="text"
            placeholder="Your Name"
            onChange={(e) => setName(e.target.value)}
          />
          <div>
            <input
              name="email"
              className={styles.textInput}
              type="email"
              placeholder="Your Email *"
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {emailError}
              </span>
            )}
          </div>

          <div className="">
            <textarea
              name="message"
              className={styles.textAreaInput}
              rows="5"
              placeholder="Your Message *"
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            {messageError && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {messageError}
              </span>
            )}
          </div>

          <button className={styles.sendButton} type="submit">
            Send Message
          </button>
        </form> */}
      </div>
      <Backdrop open={isSubmitted} onClose={() => setIsSubmitted(false)}>
        <Alert
          severity="success"
          onClose={() => {
            setIsSubmitted(false);
          }}
        >
          Your feedback has been submitted.
        </Alert>
      </Backdrop>
    </>
  );
};

export default ContactPage;
