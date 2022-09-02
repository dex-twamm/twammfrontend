import React from "react";
import Swap from "../components/Swap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import PopupSettings from "../components/PopupSettings";
import styles from "../css/ShortSwap.module.css";
import LongTermOrderCard from "../components/LongTermOrderCard";
import lsStyles from "../css/LongSwap.module.css";

const LongSwap = (props) => {
  const {
    tokenSymbol,
    tokenImage,
    connectWallet,
    buttonText,
    isPlacedLongTermOrder,
  } = props;

  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.mainBody}>
        <div className={styles.swap}>
          <div className={styles.swapOptions}>
            <a className={styles.textLink} href="/">
              Long Term Swap
            </a>
            <FontAwesomeIcon
              className={styles.settingsIcon}
              icon={faGear}
              onClick={() => setShowSettings(!showSettings)}
            />
          </div>

          {showSettings && <PopupSettings />}
        </div>
        <Swap
          swapType="long"
          tokenSymbol={tokenSymbol}
          tokenImage={tokenImage}
          connectWallet={connectWallet}
          buttonText={buttonText}
        />
      </div>

      {/* {isPlacedLongTermOrder && ( */}
      <div className={lsStyles.ordersWrapper}>
        <h4 className={lsStyles.longTermText}>Your Long Term Orders</h4>
        <div className={styles.scroller}>
          <div className={lsStyles.longTermOrderCard}>
            <LongTermOrderCard />
            <LongTermOrderCard />
            <LongTermOrderCard />
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default LongSwap;
