import styles from "../../css/LandingPage.module.css";
import gradient from "../../images/gradient.png";
import cube from "../../images/cube.png";

const LandingTechnology = () => {
  return (
    <div className={styles.technologySection}>
      <h5>Technology</h5>
      <h1>Under the hood</h1>
      <p className={styles.paraOne}>
        The technology behind LS accepts multiple swap orders in the pool to be
        converted over blocks.
      </p>
      <p className={styles.paraTwo}>
        Overtime Arbitrageurs balances out the pool and in process runs the
        orders (they take advantage of arbitrage opportunity and optimize for
        GAS overtime while converting, without impacting individual orders) Once
        individual orders are successfully completed, you place another order to
        withdraw funds.
      </p>
      <div className={styles.techImages}>
        <img className={styles.gradient} src={gradient} alt="img" />
        <img className={styles.cube} src={cube} alt="img" />
      </div>
    </div>
  );
};

export default LandingTechnology;
