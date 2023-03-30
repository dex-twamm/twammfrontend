import styles from "../../css/LandingPage.module.css";

const LandingThesis = () => {
  return (
    <div className={styles.thesisSection}>
      <h5>Thesis</h5>
      <p className={styles.info}>
        Built for DAOs, Crypto Treasuries and anyone who wants to execute big
        swap orders on DEFI efficiently.
      </p>
      <div className={styles.details}>
        <div className={styles.item}>
          <div className={styles.topic}>For DAOs</div>
          <div className={styles.content}>
            Efficient treasury management and token swaps
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.topic}>Algorithmic Stable coins</div>
          <div className={styles.content}>
            Maintain buy /Sell pressure on the token by executing swaps
            algorithmically.
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.topic}>Whales/Aspirational whales</div>
          <div className={styles.content}>
            Dollar cost averaging for executing orders of any size.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingThesis;
