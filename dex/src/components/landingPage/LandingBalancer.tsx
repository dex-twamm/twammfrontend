import styles from "../../css/LandingPage.module.css";
import balancerImg from "../../images/balancerImg.png";

const LandingBalancer = () => {
  return (
    <div className={styles.balancerSection}>
      <h5>Supported by</h5>
      <img src={balancerImg} alt="img" />
      <p className={styles.balancerText}>
        Balancer is the epitome of technical excellence and innovation in the
        DeFi space.
      </p>
      <div className={styles.balancerFeatures}>
        <p className={styles.feature}>More secure</p>
        <p className={styles.feature}>edge cases handled</p>
        <p className={styles.featureP}>improved gas efficiency</p>
      </div>
    </div>
  );
};

export default LandingBalancer;
