import React, { useContext } from "react";
import { LongSwapContext, ShortSwapContext } from "../providers";
import CircularProgressBar from "./alerts/CircularProgressBar";
import LongTermOrderSingleCard from "./LongTermOrderSingleCard";

const LongTermOrderCard = () => {
  const { isWalletConnected } = useContext(ShortSwapContext);
  const { orderLogsDecoded, orderLogsLoading } = useContext(LongSwapContext);

  return !isWalletConnected ? (
    <>
      <p
        style={{
          fontFamily: "Open Sans",
          marginBottom: "0px",
          fontSize: "14px",
          padding: "0 5px",
        }}
      >
        Connet wallet to view placed orders{" "}
      </p>
    </>
  ) : orderLogsLoading ? (
    <CircularProgressBar></CircularProgressBar>
  ) : (
    <>
      {orderLogsDecoded?.length === 0 ? (
        <p
          style={{
            fontFamily: "Open Sans",
            marginBottom: "0px",
            fontSize: "14px",
            padding: "0 5px",
          }}
        >
          No long term orders placed for this address{" "}
        </p>
      ) : (
        orderLogsDecoded
          .map((it, index) => {
            return (
              <div key={index}>
                <LongTermOrderSingleCard it={it} />
              </div>
            );
          })
          .reverse()
      )}
    </>
  );
};

export default LongTermOrderCard;
