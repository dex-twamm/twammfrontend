import styles from "../../css/LandingPage.module.css";
import discord from "../../images/discord.svg";
import twitter from "../../images/twitter.svg";
// import facebook from "../../images/facebook.svg";

const LandingFooter = () => {
  const handleSocialMedia = (socialMedia: string) => {
    if (socialMedia === "twitter") {
      window.open("https://twitter.com/FinanceXS", "_blank");
    } else {
      window.open("https://discord.gg/N2rbZwCNhq", "_blank");
    }
  };
  return (
    <div className={styles.footerSection}>
      <div className={styles.leftSec}>
        <p>
          All rights reserved. Built on <span>Balancer</span>
        </p>
      </div>
      <div className={styles.rightSec}>
        <p>Connect with us:</p>
        <div className={styles.socialMedia}>
          <img
            className={styles.discord}
            onClick={() => handleSocialMedia("discord")}
            src={discord}
            alt="img"
          />
          <img
            className={styles.twitter}
            onClick={() => handleSocialMedia("twitter")}
            src={twitter}
            alt="img"
          />
          {/* <img className={styles.faceBook} src={facebook} alt="img" /> */}
        </div>
      </div>
    </div>
  );
};

export default LandingFooter;
