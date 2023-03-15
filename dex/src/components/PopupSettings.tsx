import classNames from "classnames";
import React, { useContext } from "react";
import styles from "../css/PopupSettings.module.css";
import { useShortSwapContext } from "../providers/context/ShortSwapProvider";

interface PropTypes {
  swapType?: string;
}

const PopupSettings = ({ swapType }: PropTypes) => {
  const { tolerance, setTolerance, deadline, setDeadline } =
    useShortSwapContext();

  return (
    <span
      onClick={(e) => e.stopPropagation()}
      className={styles.settingsContainer}
      style={{ background: "white" }}
    >
      {!swapType && (
        <h4 className={styles.settingsTitle}>Transaction Settings</h4>
      )}
      <div className={styles.settings}>
        {!swapType && (
          <div className={styles.slippage}>
            <p>Slippage tolerance ?</p>
            <div className={styles.slippageTolerance}>
              <button
                className={classNames(
                  styles.btn,
                  tolerance === 0.5 && styles.active
                )}
                onClick={() => setTolerance(0.5)}
              >
                0.5
              </button>
              <button
                className={classNames(
                  styles.btn,
                  tolerance === 1 && styles.active
                )}
                onClick={() => setTolerance(1)}
              >
                1
              </button>
              <button
                className={classNames(
                  styles.btn,
                  tolerance === 2 && styles.active
                )}
                onClick={() => setTolerance(2)}
              >
                2
              </button>
            </div>
          </div>
        )}
        <div className={styles.slippage}>
          <p>Transaction deadline ?</p>
          <div className={styles.transactionDeadline}>
            <div className={styles.inputContainer}>
              <input
                type="number"
                placeholder="30"
                value={deadline ? deadline : 0}
                onChange={(e) => {
                  setDeadline(parseFloat(e.target.value));
                }}
              />
            </div>
            <p>minutes</p>
          </div>
        </div>
      </div>
    </span>
  );
};

export default PopupSettings;
