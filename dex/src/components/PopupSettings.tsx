import classNames from "classnames";
import styles from "../css/PopupSettings.module.css";
import { useShortSwapContext } from "../providers/context/ShortSwapProvider";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface PropTypes {
  swapType?: string;
}

const PopupSettings = ({ swapType }: PropTypes) => {
  const { tolerance, setTolerance, deadline, setDeadline } =
    useShortSwapContext();

  const [transactionType, setTransactionType] = useState("Legacy");

  const location = useLocation();

  return (
    <span
      onClick={(e) => e.stopPropagation()}
      className={styles.settingsContainer}
      style={{ background: "white" }}
    >
      {!swapType && <h4>Transaction Settings</h4>}
      <div className={styles.settings}>
        {!swapType && (
          <div className={styles.slippage}>
            <p className={styles.settingTitles}>
              Slippage tolerance{" "}
              <Tooltip
                arrow
                placement="top"
                title="Market conditions may change between the time your order is submitted and the time it gets executed on Ethereum. Slippage tolerance is the maximum change in price you are willing to accept. This protects you from front-running bots and miner extractable value (MEV)."
              >
                <InfoOutlinedIcon fontSize="small" />
              </Tooltip>
            </p>
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

        {location.pathname === "/liquidity/add-liquidity" ||
        location.pathname === "/liquidity/remove-liquidity" ? (
          <div className={styles.slippage}>
            <p className={styles.settingTitles}>
              Transaction Type{" "}
              <Tooltip
                arrow
                placement="top"
                title="Most users will want EIP-1559 Transactions, but there are some instances that may require a Legacy Transaction. For example, some Ledger users have had issues using MetaMask with EIP-1559 Transactions."
              >
                <InfoOutlinedIcon fontSize="small" />
              </Tooltip>
            </p>
            <div
              className={classNames(
                styles.slippageTolerance,
                styles.transactionType
              )}
            >
              <button
                className={classNames(
                  styles.btn,
                  transactionType === "Legacy" && styles.active
                )}
                onClick={() => setTransactionType("Legacy")}
              >
                Legacy
              </button>
              <button
                className={classNames(
                  styles.btn,
                  transactionType === "EPI1559" && styles.active
                )}
                onClick={() => setTransactionType("EPI1559")}
              >
                EPI1559
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.slippage}>
            <p className={styles.settingTitles}>Transaction deadline</p>
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
        )}
      </div>
    </span>
  );
};

export default PopupSettings;
