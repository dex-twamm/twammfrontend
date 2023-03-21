import React from "react";
import CircularProgressBar from "./alerts/CircularProgressBar";
import LongTermOrderSingleCard from "./LongTermOrderSingleCard";
import styles from "../css/LongTermOrderCard.module.css";
import { useShortSwapContext } from "../providers/context/ShortSwapProvider";
import { useLongSwapContext } from "../providers/context/LongSwapProvider";

const LongTermOrderCard = () => {
  const { isWalletConnected } = useShortSwapContext();
  const { orderLogsDecoded, orderLogsLoading } = useLongSwapContext();

  return !isWalletConnected ? (
    <>
      <p className={styles.pText}>Connect wallet to view placed orders </p>
    </>
  ) : orderLogsLoading ? (
    <CircularProgressBar></CircularProgressBar>
  ) : (
    <>
      {orderLogsDecoded?.length === 0 ? (
        <p className={styles.pText}>
          No long term orders placed for this address{" "}
        </p>
      ) : (
        orderLogsDecoded
          .map((orderLog: any, index: number) => {
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
