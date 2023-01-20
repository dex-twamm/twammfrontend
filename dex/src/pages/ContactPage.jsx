import { faMessage } from "@fortawesome/free-solid-svg-icons";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "../css/Contact.module.css";

const ContactPage = () => {
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
        <div className={styles.rightSection}>
          <input
            className={styles.textInput}
            type="text"
            placeholder="Your Name"
          />
          <input
            className={styles.textInput}
            type="email"
            placeholder="Your Email*"
          />
          <input
            className={styles.textInput}
            type="number"
            placeholder="Your Phone"
          />
          <textarea
            className={styles.textAreaInput}
            rows="5"
            placeholder="Your Message*"
          ></textarea>
          <button className={styles.sendButton}>Send Message</button>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
