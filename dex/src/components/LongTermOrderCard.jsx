import React, { useContext } from "react";
import { useEffect } from "react";
import { LongSwapContext, ShortSwapContext } from "../providers";
import CircularProgressBar from "./alerts/CircularProgressBar";
import LongTermOrderSingleCard from "./LongTermOrderSingleCard";

const LongTermOrderCard = () => {
  const { swapAmount, currentBlock, isWalletConnected } =
    useContext(ShortSwapContext);

  const {
    sliderValueInSec,

    orderLogsDecoded,

    orderLogsLoading,
  } = useContext(LongSwapContext);

  // const initialValue = Math.ceil(sliderValueInSec);

  // // const [progress, setProgress] = React.useState(1);
  // // const [remainingTime, setRemainingTime] = React.useState(initialValue);

  // // let value = Math.ceil(sliderValueInSec);

  // // // const rate = 67.789; // What is the rate of conversion from one token to another?
  // // // React.useEffect(() => {
  // // //   const interval = setInterval(() => {
  // // //     value = value - 1;
  // // //     let percent = (value * 100) / initialValue;
  // // //     let remainingPercent = 100 - percent;

  // // //     if (progress != 100) {
  // // //       setProgress(remainingPercent);
  // // //       setRemainingTime(value);

  // // //       const converted = swapAmount - (percent * swapAmount) / 100;
  // // //       // setRemainingToken((swapAmount - converted).toFixed(2));

  // // //       // setConvertedTokenAmount((converted * rate).toFixed(2));
  // // //     } else {
  // // //       setProgress(100);
  // // //     }
  // // //   }, 1000);

  // // //   setTimeout(function () {
  // // //     clearInterval(interval);
  // // //   }, initialValue * 1000);

  // // //   return () => {
  // // //     clearInterval(interval);
  // // //   };
  // // // }, [sliderValueInSec, swapAmount]);

  // // // useEffect(() => {}, [currentBlock]);

  console.log("Sjasdhaksdahsjkasd", sliderValueInSec, swapAmount);

  // Mapping Data from EthLogs
  console.log("orderLogsDecoded", orderLogsLoading);

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
