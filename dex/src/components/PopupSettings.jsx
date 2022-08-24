import React from 'react';
import styles from "../css/PopupSettings.module.css";

const PopupSettings = () => {
  return (
    <span className={styles.settingsContainer}>
      <h4 className={styles.settingsTitle}>Transaction Settings</h4>
      <div className={styles.settings}>
        <div className={styles.slippage}>
          <p>Slippage tolerance ?</p>
          <div className={styles.slippageTolerance}>
            <button className={styles.btnAuto}>Auto</button>
            <div className={styles.inputContainer}>
              <input className={styles.inputSlippageTolerance} type="number" placeholder="0.10" defaultValue={0.10} />
              <p>%</p>
            </div>
          </div>
        </div>
        <div className={styles.slippage}>
          <p>Transaction deadline ?</p>
          <div className={styles.transactionDeadline}>
            <div className={styles.inputContainer}>
              <input type="number" placeholder="30" defaultValue={30}/>
            </div>
            <p>minutes</p>
          </div>
        </div>
      </div>
    </span>
  )
}

export default PopupSettings