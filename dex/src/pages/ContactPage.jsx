import { faMessage } from "@fortawesome/free-solid-svg-icons";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  const [isSubmitted, setisSubmitted] = useState(false);

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
          setisSubmitted(true);
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
          <h5 className={styles.h5Text}>Contact Us</h5>
          <h1 className={styles.h1Text}>Get In Touch With Us</h1>
          <p className={styles.para}>
            Welcome to our contact us page. We value your feedback and are here
            to assist you with any questions or concerns you may have regarding
            our platform for long-term and short-term token swapping, and
            liquidity pools. Our team of experts is committed to providing
            excellent customer service and ensuring that your experience with us
            is as smooth and satisfactory as possible. Please do not hesitate to
            reach out to us with any inquiries or suggestions. We look forward
            to hearing from you.
          </p>
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
        <form className={styles.rightSection} onSubmit={handleSubmit}>
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
        </form>
      </div>
      <Backdrop open={isSubmitted} onClose={() => setisSubmitted(false)}>
        <Alert
          severity="success"
          onClose={() => {
            setisSubmitted(false);
          }}
        >
          Your feedback has been submitted.
        </Alert>
      </Backdrop>
    </>
  );
};

export default ContactPage;
