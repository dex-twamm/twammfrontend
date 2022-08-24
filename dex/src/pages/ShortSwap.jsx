import React, { useState } from "react";
import Swap from "../components/Swap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import styles from "../css/ShortSwap.module.css";
import classnames from "classnames";
import { ShortSwapContext } from "../providers";
import { useContext } from "react";
import PopupModal from "../components/PopupModal";
import PopupSettings from "../components/PopupSettings";

const ShortSwap = ({ tokenSymbol, tokenImage, connectWallet, buttonText }) => {
  const { error } = useContext(ShortSwapContext);

  const [showSettings, setShowSettings] = useState(false);

  return (
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
        <Swap tokenSymbol={tokenSymbol} tokenImage={tokenImage} />
        <button
          className={classnames(styles.btn, styles.btnConnect)}
          onClick={connectWallet}
        >
          {buttonText}
        </button>
        <PopupModal></PopupModal>
      </div>
    </div>
  );
};

export default ShortSwap;
