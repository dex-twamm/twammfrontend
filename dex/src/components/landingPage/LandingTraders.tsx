import styles from "../../css/LandingPage.module.css";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const LandingTraders = () => {
  return (
    <div className={styles.tradersSection}>
      <h5>for traders</h5>
      <h1>time weighted average market maker</h1>
      <p className={styles.timeInfo}>
        LongSwap is a Time-weighted AMM that efficiently executes large orders
        on a given timeframe across blocks.
      </p>
      <div className={styles.cards}>
        <div className={styles.cardItem}>
          <p className={styles.cardTopic}>Saves GAS</p>
          <p className={styles.cardDetail}>
            LongSwap is a Time-weighted AMM that efficiently executes large
            orders on a given timeframe across blocks.
          </p>
          <span className={styles.learnMore}>
            Learn more{" "}
            <KeyboardArrowRightIcon
              fontSize="large"
              sx={{ marginLeft: "15px" }}
            />
          </span>
        </div>
        <div className={styles.cardItem}>
          <p className={styles.cardTopic}>Protect against MeV</p>
          <p className={styles.cardDetail}>
            LongSwap is a Time-weighted AMM that efficiently executes large
            orders on a given timeframe across blocks.
          </p>
          <span className={styles.learnMore}>
            Learn more{" "}
            <KeyboardArrowRightIcon
              fontSize="large"
              sx={{ marginLeft: "15px" }}
            />
          </span>
        </div>
        <div className={styles.cardItem}>
          <p className={styles.cardTopic}>Averaging</p>
          <p className={styles.cardDetail}>
            LongSwap is a Time-weighted AMM that efficiently executes large
            orders on a given timeframe across blocks.
          </p>
          <span className={styles.learnMore}>
            Learn more{" "}
            <KeyboardArrowRightIcon
              fontSize="large"
              sx={{ marginLeft: "15px" }}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default LandingTraders;
