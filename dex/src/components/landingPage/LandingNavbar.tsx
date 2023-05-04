import styles from "../../css/LandingPage.module.css";
import logo from "../../images/logo.png";

const LandingNavbar = () => {
  const handleDocsClick = () => {
    window.open("https://docs.longswap.xyz/", "_blank");
  };
  return (
    <div className={styles.navContainer}>
      <div className={styles.logoAndImage}>
        <img className={styles.logo} src={logo} alt="logo" width="20px" />
        <p className={styles.longSwap}>Longswap</p>
      </div>
      <div className={styles.docAndCommunity}>
        <p className={styles.docs} onClick={handleDocsClick}>
          Docs
        </p>
        <button className={styles.community}>Join the community</button>
      </div>
    </div>
  );
};

export default LandingNavbar;
