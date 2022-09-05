import React, { useState } from "react";
import Swap from "../components/Swap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import styles from "../css/ShortSwap.module.css";
import PopupSettings from "../components/PopupSettings";
import PopupModal from "../components/alerts/PopupModal";

const ShortSwap = ({ tokenSymbol, tokenImage, connectWallet, buttonText }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.mainBody}>
          <div className={styles.swap}>
            <div className={styles.swapOptions}>
              <a className={styles.textLink} href="/">
                Swap
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
            tokenSymbol={tokenSymbol}
            tokenImage={tokenImage}
            connectWallet={connectWallet}
            buttonText={buttonText}
          />
        </div>
      </div>
    </>
  );
};

export default ShortSwap;
