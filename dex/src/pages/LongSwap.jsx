import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useContext, useState } from "react";
import LongTermOrderCard from "../components/LongTermOrderCard";
import PopupSettings from "../components/PopupSettings";
import Swap from "../components/Swap";
import lsStyles from "../css/LongSwap.module.css";
import styles from "../css/ShortSwap.module.css";
import { LongSwapContext } from "../providers";

const LongSwap = (props) => {
  const {
    tokenSymbol,
    tokenImage,
    connectWallet,
    buttonText,
    isPlacedLongTermOrder,
  } = props;

  const [showSettings, setShowSettings] = useState(false);
  const { orderLogs } = useContext(LongSwapContext);
  const ethLogsCount = orderLogs.length;
  const cardListCount = ethLogsCount;

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
    </div>
  );
};

export default LongSwap;
