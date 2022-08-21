import React, { useState } from 'react';
import Swap from '../components/Swap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import styles from "../css/ShortSwap.module.css";
import classnames from "classnames"

const ShortSwap = ({tokenSymbol,tokenImage,connectWallet, buttonText}) => {
  return (
    <div className={styles.container}>
      <div className={styles.mainBody}>
      <div className={styles.swap}>
        <div className={styles.swapOptions}>
          <a className={styles.textLink} href="/">Swap</a>
          <FontAwesomeIcon icon={faGear} />
        </div>
      </div>
      <Swap tokenSymbol={tokenSymbol} tokenImage={tokenImage} />
      <button className={classnames(styles.btn, styles.btnConnect)} onClick={connectWallet}>
        {buttonText}
      </button>
    </div>
    </div>
  )
}

export default ShortSwap;
