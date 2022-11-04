import classNames from "classnames";
import { ethers } from "ethers";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { HiExternalLink } from "react-icons/hi";
import styles from "../css/LongTermOrderCard.module.css";
import { LongSwapContext, ShortSwapContext } from "../providers";
import { bigToFloat, bigToStr, POOL_ID } from "../utils";
import { POOLS } from "../utils/pool";
import LongTermSwapCardDropdown from "../components/LongTermSwapCardDropdown";
import CircularProgressBar from "./alerts/CircularProgressBar";

const LongTermOrderCard = (props) => {
  const { cancelPool, withdrawPool } = props;
  const remainingTimeRef = useRef();

  const { swapAmount, currentBlock, loading } = useContext(ShortSwapContext);

  const { sliderValueInSec, tokenA, tokenB, orderLogsDecoded, latestBlock } =
    useContext(LongSwapContext);

  const initialValue = Math.ceil(sliderValueInSec);

  const [progress, setProgress] = React.useState(1);
  const [remainingTime, setRemainingTime] = React.useState(initialValue);

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

        // setConvertedTokenAmount((converted * rate).toFixed(2));
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

  // Status of Long Term Orders
  const checkStatus = (state, startBlock, expiryBlock) => {
    console.log("Blocks", startBlock, expiryBlock, latestBlock);
    if (state === "completed") {
      // setProgress(100);
      return { status: "Completed", progress: 100 };
    } else if (state === "cancelled") {
      // setProgress(100);
      // Progress Bar Color Set To Red === TODO
      return { status: "Cancelled", progress: 100 };
    } else if (latestBlock >= expiryBlock) {
      // setProgress(100);
      return { status: "Execution Completed", progress: 100 };
    } else {
      if (expiryBlock > currentBlock.number) {
        const timeRemaining = (expiryBlock - currentBlock.number) * 12;
        // const timeRemaining = (expiryBlock - latestBlock) * 12;

        // const timeRemaining =
        // (expiryBlock - provider.getBlock("latest").number) * 12;
        // setProgress((latestBlock - startBlock) / (expiryBlock - startBlock));
        let date = new Date(0);
        date.setSeconds(timeRemaining); // specify value for SECONDS here
        const timeString = date.toISOString().substring(11, 19);
        console.log(timeString);

        return {
          status: `Time Remaining: ${timeString}`,
          progress: (latestBlock - startBlock) / (expiryBlock - startBlock),
        };
      } else {
        return { status: "Execution Completed", progress: 100 };
      }
    }
  };

  useEffect(() => {}, [currentBlock]);

  // Mapping Data from EthLogs
  console.log("orderLogsDecoded", orderLogsDecoded);

  return orderLogsDecoded ? (
    <>
      {orderLogsDecoded.length === 0 ? (
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
          .map((it) => {
            const orderStatus = checkStatus(
              it.state,
              it.startBlock,
              it.expirationBlock
            );
            const stBlock = it.startBlock;
            let convertedAmount = ethers.constants.Zero;
            if (it.state === "completed" || it.state === "cancelled") {
              // Order Completed and Deleted
              convertedAmount = it.withdrawals.reduce((total, withdrawal) => {
                return total.add(withdrawal.proceeds);
              }, ethers.constants.Zero);

              // if (it.state === "cancelled") {
              //   console.log("Cancel Proceeds", it.cancelledProceeds);
              //   convertedAmount = convertedAmount.add(it.cancelledProceeds);
              // }
              // console.log("ConvertedAMT", convertedAmount);
            } else {
              // Order Still In Progress
              convertedAmount = it.convertedValue;
            }
            console.log("Converted Amount", convertedAmount.toString());
            // console.log("Withdrawals 0", it.withdrawals[0].proceeds.toNumber());
            // console.log("Withdrawals 1", it.withdrawals[1].proceeds.toNumber());
            // const sRate = ethers.utils.formatEther(it.salesRate);

            // console.log("Sales rate", sRate);
            const expBlock = it.expirationBlock;
            const amountOf = expBlock.sub(stBlock).mul(it.salesRate);
            // console.log("StartBlock", stBlock);
            // console.log("Exp BLock", expBlock);
            // console.log("latestBlock", latestBlock);
            // console.log("Amount of", amountOf)
            let soldToken;
            if (it.state === "cancelled") {
              soldToken = amountOf.sub(it.unsoldAmount);
            } else {
              soldToken =
                latestBlock > expBlock
                  ? amountOf
                  : latestBlock.sub(stBlock).mul(it.salesRate);
            }
            console.log("Sold Token", soldToken);

            const averagePrice =
              bigToFloat(convertedAmount, 18) / bigToFloat(soldToken, 18);
            console.log("Average Price", averagePrice);
            return (
              <div className={styles.container} key={it.transactionHash}>
                <div className={styles.topSection}>
                  <p className={styles.orderId} key={it.orderId.toNumber()}>
                    {it.orderId.toNumber()}
                  </p>

                  <HiExternalLink
                    className={styles.iconExternalLink}
                    onClick={() =>
                      window.open(
                        `https://goerli.etherscan.io/tx/${it.transactionHash}`,
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
                        src={POOLS[POOL_ID].tokens[it.sellTokenIndex].image}
                        alt={POOLS[POOL_ID].tokens[it.sellTokenIndex].symbol}
                      />
                      <p className={styles.tokenText}>
                        <span>
                          {bigToStr(soldToken, 18)}{" "}
                          {POOLS[POOL_ID].tokens[it.sellTokenIndex].symbol}
                        </span>
                        <span> of {bigToStr(amountOf, 18)}</span>
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
                        src={POOLS[POOL_ID].tokens[it.buyTokenIndex].image}
                        alt={POOLS[POOL_ID].tokens[it.buyTokenIndex].symbol}
                      />
                      <p
                        className={classNames(
                          styles.tokenText,
                          styles.greenText
                        )}
                      >
                        {bigToStr(convertedAmount, 18)}{" "}
                        {POOLS[POOL_ID].tokens[it.buyTokenIndex].symbol}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.timeRemaining} ref={remainingTimeRef}>
                      {orderStatus.status}
                    </p>
                    <div className={styles.progress}>
                      <div
                        style={{ width: `${orderStatus.progress}%` }}
                        className={classNames(
                          styles.activeProgress,

                          orderStatus.status === "Completed"
                            ? styles.greenProgress
                            : orderStatus.status === "Execution Completed"
                            ? styles.greenProgress
                            : orderStatus.status === "Cancelled"
                            ? styles.redProgress
                            : styles.activeProgress
                        )}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.extrasContainer}>
                    <div className={styles.fees}>{dummyOrder.fees} fees</div>
                    {soldToken != 0 && (
                      <div className={styles.averagePrice}>
                        {averagePrice.toFixed(4)} Average Price
                      </div>
                    )}
                  </div>

                  {it.hasPartialWithdrawals && (
                    <LongTermSwapCardDropdown withdrawals={it.withdrawals} />
                  )}

                  <div className={styles.buttonContainer}>
                    <button
                      className={classNames(
                        styles.button,
                        orderStatus.status !== "Completed"
                          ? styles.cancelButton
                          : styles.successButton
                      )}
                      disabled={
                        orderStatus.status === "Cancelled" ||
                        orderStatus.status === "Completed" ||
                        orderStatus.status === "Execution Completed"
                      }
                      onClick={() => {
                        cancelPool(it.orderId.toNumber());
                      }}
                    >
                      {orderStatus.status !== "Completed"
                        ? "Cancel"
                        : "Completed"}
                    </button>

                    {orderStatus.status !== "Cancelled" &&
                      orderStatus.status !== "Completed" && (
                        <button
                          className={classNames(
                            styles.button,
                            styles.withdrawButton
                          )}
                          onClick={() => {
                            withdrawPool(it.orderId.toNumber());
                          }}
                        >
                          Withdraw
                        </button>
                      )}
                  </div>
                </div>
              </div>
            );
          })
          .reverse()
      )}
    </>
  ) : (
    <CircularProgressBar></CircularProgressBar>
  );
};

export default LongTermOrderCard;
