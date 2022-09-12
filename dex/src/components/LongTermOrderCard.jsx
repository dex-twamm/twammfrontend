import classNames from "classnames";
import { ethers } from "ethers";
import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { HiExternalLink } from "react-icons/hi";
import styles from "../css/LongTermOrderCard.module.css";
import { LongSwapContext, ShortSwapContext } from "../providers";

const LongTermOrderCard = () => {
  const remainingTimeRef = React.useRef();

  const { swapAmount } = React.useContext(ShortSwapContext);

  const { sliderValueInSec, tokenA, tokenB, orderLogs, orderLogsDecoded } =
    React.useContext(LongSwapContext);

  const initialValue = Math.ceil(sliderValueInSec);

  const [progress, setProgress] = React.useState(1);
  const [remainingTime, setRemainingTime] = React.useState(initialValue);
  const [remainingToken, setRemainingToken] = React.useState("");
  const [convertedTokenAmount, setConvertedTokenAmount] = React.useState(0);
  const [orderLogsId, setOrderId] = useState("");
  const [salesRate, setSalesRate] = useState("");
  const [expirationBlock, setExpirationBlock] = useState("");
  const [startBlock, setStartBlock] = useState("");

  let value = Math.ceil(sliderValueInSec);

  const rate = 67.789; // What is the rate of conversion from one token to another?
  React.useEffect(() => {
    const interval = setInterval(() => {
      value = value - 1;
      let percent = (value * 100) / initialValue;
      let remainingPercent = 100 - percent;

      if (progress != 100) {
        setProgress(remainingPercent);
        setRemainingTime(value);

        const converted = swapAmount - (percent * swapAmount) / 100;
        // setRemainingToken((swapAmount - converted).toFixed(2));

        setConvertedTokenAmount((converted * rate).toFixed(2));
      } else {
        setProgress(100);
      }
    }, 1000);

    setTimeout(function () {
      clearInterval(interval);
    }, initialValue * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [sliderValueInSec, swapAmount]);

  const dummyOrder = {
    orderId: "001abc",
    transactionLink: "https://somelink.com",
    amount: swapAmount,
    fees: "0.5%",
    averagePrice: "0.3 ETH",
  };

  async function getData() {
    await orderLogs.map((item) => {
      const stBlock = ethers.utils.formatEther(item.blockNumber);
      setStartBlock(stBlock);
    });
    await orderLogsDecoded.map((item) => {
      const sRate = ethers.utils.formatEther(item.salesRate._hex);
      setSalesRate(sRate);
      // console.log("=== Sales Rate ===", sRate);
      const expBlock = ethers.utils.formatEther(item.expirationBlock._hex);
      setExpirationBlock(expBlock);
      // console.log("=== Expired At Block ===", expBlock);
      const remainigToken = (expBlock - startBlock) * salesRate;
      console.log("=== Remainig Token ===", remainigToken);
      setRemainingToken(remainigToken);
    });
  }

  // Decoded Order Logs
  useEffect(() => {
    getData();
  }, [orderLogsDecoded]);

  return orderLogs
    .map((item, index) => {
      let orderId;
      orderLogsDecoded.map((item, idx) => {
        return index == idx && (orderId = item.orderId._hex);
      });

      return (
        <div className={styles.container} key={item.transactionHash}>
          <div className={styles.topSection}>
            <p className={styles.orderId} key={orderId}>
              {orderId}
            </p>

            <HiExternalLink
              className={styles.iconExternalLink}
              onClick={() =>
                window.open(
                  `https://goerli.etherscan.io/tx/${item.transactionHash}`,
                  "_blank"
                )
              }
            />
          </div>
          <div className={styles.bottomSection}>
            <div className={styles.tokenContainer}>
              <div className={styles.tokenWrapper}>
                <img
                  className={styles.tokenIcon}
                  src={tokenA.image}
                  alt={tokenA.symbol}
                />
                <p className={styles.tokenText}>
                  <span>
                    {remainingToken} {tokenA.symbol}
                  </span>
                  <span>
                    of {swapAmount} {tokenA.symbol}
                  </span>
                </p>
              </div>
              <div className={styles.arrow}>
                <svg
                  width="95"
                  height="8"
                  viewBox="0 0 95 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M94.3536 4.35355C94.5488 4.15829 94.5488 3.84171 94.3536 3.64645L91.1716 0.464466C90.9763 0.269204 90.6597 0.269204 90.4645 0.464466C90.2692 0.659728 90.2692 0.976311 90.4645 1.17157L93.2929 4L90.4645 6.82843C90.2692 7.02369 90.2692 7.34027 90.4645 7.53553C90.6597 7.7308 90.9763 7.7308 91.1716 7.53553L94.3536 4.35355ZM0 4.5H94V3.5H0V4.5Z"
                    fill="#ABABAB"
                  />
                </svg>
              </div>
              <div>
                <img
                  className={styles.tokenIcon}
                  src={tokenB.image}
                  alt={tokenB.symbol}
                />
                <p className={classNames(styles.tokenText, styles.greenText)}>
                  {convertedTokenAmount} {tokenB.symbol}
                </p>
              </div>
            </div>

            <div>
              <p className={styles.timeRemaining} ref={remainingTimeRef}>
                {remainingTime != 0
                  ? `${remainingTime} seconds remaining...`
                  : "Completed.."}
              </p>
              <div className={styles.progress}>
                <div
                  style={{ width: `${progress}%` }}
                  className={classNames(
                    styles.activeProgress,
                    remainingTime == 0 && styles.greenProgress
                  )}
                ></div>
              </div>
            </div>

            <div className={styles.extrasContainer}>
              <div className={styles.fees}>{dummyOrder.fees} fees</div>
              <div className={styles.averagePrice}>
                {dummyOrder.averagePrice} Average Price
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <button
                className={classNames(
                  styles.button,
                  remainingTime !== 0
                    ? styles.cancelButton
                    : styles.successButton
                )}
              >
                {remainingTime !== 0 ? "Cancel" : "Completed"}
              </button>

              {remainingTime !== 0 && (
                <button
                  className={classNames(styles.button, styles.withdrawButton)}
                >
                  Withdraw
                </button>
              )}
            </div>
          </div>
        </div>
      );
    })
    .reverse();
};

export default LongTermOrderCard;
