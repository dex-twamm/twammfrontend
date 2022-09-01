import React from "react";
import styles from "../css/LongTermOrderCard.module.css";
import { HiExternalLink } from "react-icons/hi";
import { CgArrowLongRight } from "react-icons/cg";
import classNames from "classnames";
import { LongSwapContext } from "../providers";

const LongTermOrderCard = () => {
  const [progress, setProgress] = React.useState(40);
  const { sliderValue } = React.useContext(LongSwapContext);

  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log(Math.ceil(Date.now() / 1000));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const dummyOrder = {
    orderId: "001abc",
    transactionLink: "https://somelink.com",
    amount: 100,
    fees: "3%",
    averagePrice: "0.3 ETH",
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <p className={styles.orderId}>{dummyOrder.orderId}</p>
        <HiExternalLink
          className={styles.iconExternalLink}
          onClick={() => window.open(dummyOrder.transactionLink, "_blank")}
        />
      </div>
      <div className={styles.bottomSection}>
        <div className={styles.tokenContainer}>
          <div>
            <img
              className={styles.tokenIcon}
              src="/ethereum.png"
              alt="ethereum"
            />
            <p className={styles.tokenText}>
              <span>40 ETH</span> <span>of {dummyOrder.amount} ETH</span>
            </p>
          </div>
          <div className={styles.arrow}>
            <svg
              width="95"
              height="8"
              viewBox="0 0 95 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M94.3536 4.35355C94.5488 4.15829 94.5488 3.84171 94.3536 3.64645L91.1716 0.464466C90.9763 0.269204 90.6597 0.269204 90.4645 0.464466C90.2692 0.659728 90.2692 0.976311 90.4645 1.17157L93.2929 4L90.4645 6.82843C90.2692 7.02369 90.2692 7.34027 90.4645 7.53553C90.6597 7.7308 90.9763 7.7308 91.1716 7.53553L94.3536 4.35355ZM0 4.5H94V3.5H0V4.5Z"
                fill="#ABABAB"
              />
            </svg>
          </div>
          <div>
            <img className={styles.tokenIcon} src="/dai.png" alt="dai" />
            <p className={classNames(styles.tokenText, styles.greenText)}>
              3201.2 GOER
            </p>
          </div>
        </div>

        <div>
          <p className={styles.timeRemaining}>2 minutes remaining...</p>
          <div className={styles.progress}>
            <div
              style={{ width: `${progress}%` }}
              className={styles.activeProgress}
            ></div>
          </div>
        </div>

        <div className={styles.extrasContainer}>
          <div className={styles.fees}>{dummyOrder.fees} fees</div>
          <div className={styles.averagePrice}>
            {dummyOrder.averagePrice} Average Price
          </div>
        </div>

        <button className={styles.cancelButton}>Cancel</button>
      </div>
    </div>
  );
};

export default LongTermOrderCard;
