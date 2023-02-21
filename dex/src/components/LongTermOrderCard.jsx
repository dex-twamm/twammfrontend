import React, { useContext } from "react";
import { LongSwapContext, ShortSwapContext } from "../providers";
import CircularProgressBar from "./alerts/CircularProgressBar";
import LongTermOrderSingleCard from "./LongTermOrderSingleCard";
import styles from "../css/LongTermOrderCard.module.css";

const LongTermOrderCard = () => {
  const { isWalletConnected } = useContext(ShortSwapContext);
  const { orderLogsDecoded, orderLogsLoading } = useContext(LongSwapContext);

  return !isWalletConnected ? (
    <>
      <p className={styles.ptext}>Connet wallet to view placed orders </p>
    </>
  ) : orderLogsLoading ? (
    <CircularProgressBar></CircularProgressBar>
  ) : (
    <>
      {orderLogsDecoded?.length === 0 ? (
        <p className={styles.ptext}>
          No long term orders placed for this address{" "}
        </p>
      ) : (
        orderLogsDecoded
          .map((orderLog, index) => {
            return (
              <div key={index}>
                <LongTermOrderSingleCard orderLog={orderLog} />
              </div>
            );
          })
          .reverse()
      )}
    </>
  );
};

export default LongTermOrderCard;
