import React from "react";
import styles from "../css/LongTermOrderCard.module.css";
import { HiExternalLink } from "react-icons/hi";

const LongTermOrderCard = () => {
  const [progress, setProgress] = React.useState(40);

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.orderId}>
          <p>OrdID</p>
        </div>
        <div className={styles.transactionLink}>
          <p>Tx</p>
          <HiExternalLink
            className={styles.icon}
            onClick={() =>
              window.open(
                "https://app.uniswap.org/#/swap?chain=mainnet",
                "_blank"
              )
            }
          />
        </div>
      </div>

      <div className={styles.progressWrapper}>
        <div className={styles.tokenContainer}>
          <p className={styles.token}>$</p>
          <p>40$ of</p>
          <p>100$</p>
        </div>
        <div className={styles.progressContainer}>
          <p className={styles.progressText}>In Progress</p>
          <div className={styles.progress}>
            <div
              style={{ width: `${progress}%` }}
              className={styles.activeProgress}
            />
          </div>
          <p className={styles.timeRemaining}>2 hours remaining</p>
        </div>
        <div className={styles.tokenContainer}>
          <p className={styles.token}>₹</p>
          <p>₹3201.2</p>
        </div>
      </div>

      <div className={styles.middleSection}>
        <div className={styles.fees}>
          <span>2%</span>
          <span>fees</span>
        </div>

        <div className={styles.averagePrice}>
          <span>$1/₹80</span>
          <span>average price</span>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.cancelButton}>Cancel</button>
      </div>
    </div>
  );
};

export default LongTermOrderCard;
