import classNames from "classnames";
import { ethers } from "ethers";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { HiExternalLink } from "react-icons/hi";
import styles from "../css/LongTermOrderCard.module.css";
import { LongSwapContext, ShortSwapContext } from "../providers";
import { bigToFloat, bigToStr } from "../utils";
import { POOLS, POOL_ID } from "../utils/pool";
import LongTermSwapCardDropdown from "../components/LongTermSwapCardDropdown";
import CircularProgressBar from "./alerts/CircularProgressBar";
import { _cancelLTO } from "../utils/_cancelLto";
import { WebContext } from "../providers/context/WebProvider";
import { _withdrawLTO } from "../utils/_withdrawLto";

const LongTermOrderCard = (props) => {
  // const { cancelPool, withdrawPool } = props;
  const remainingTimeRef = useRef();

  const {
    swapAmount,
    currentBlock,
    isWalletConnected,
    setLoading,
    account,
    setweb3provider,
    setCurrentBlock,
    setBalance,
    setAccount,
    setWalletConnected,
    setTransactionHash,
  } = useContext(ShortSwapContext);

  const {
    sliderValueInSec,
    tokenA,
    tokenB,
    orderLogsDecoded,
    latestBlock,
    disableActionBtn,
    orderLogsLoading,
    setDisableActionBtn,
    setOrderLogsDecoded,
    setMessage,
  } = useContext(LongSwapContext);

  const { provider } = useContext(WebContext);

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
        const timeString = date.toISOString().substring(11, 16);
        console.log(timeString);

        return {
          status: `Time Remaining: ${timeString}`,
          progress: (latestBlock - startBlock) * 100 / (expiryBlock - startBlock),
        };
      } else {
        return { status: "Execution Completed", progress: 100 };
      }
    }
  };

  useEffect(() => {}, [currentBlock]);

  // Mapping Data from EthLogs
  console.log("orderLogsDecoded", orderLogsLoading);

  const handleCancel = (orderId, orderHash) => {
    _cancelLTO(
      orderId,
      orderHash,
      setLoading,
      setDisableActionBtn,
      account,
      setweb3provider,
      setCurrentBlock,
      setBalance,
      setAccount,
      setWalletConnected,
      isWalletConnected,
      setOrderLogsDecoded,
      setMessage,
      provider,
      setTransactionHash
    );
  };

  const handleWithDraw = (orderId, orderHash) => {
    console.log("Order hash", orderHash);
    _withdrawLTO(
      orderId,
      orderHash,
      setLoading,
      setDisableActionBtn,
      account,
      setweb3provider,
      setCurrentBlock,
      setBalance,
      setAccount,
      setWalletConnected,
      isWalletConnected,
      setOrderLogsDecoded,
      setMessage,
      provider,
      setTransactionHash
    );
  };

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
          .map((it) => {
            console.log("ITTTTTTT--->O", orderLogsDecoded);
            console.log("ITTTTTTT", it);
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
              let withdrawals = it.withdrawals.reduce((total, withdrawal) => {
                return total.add(withdrawal.proceeds);
              }, ethers.constants.Zero);
              console.log("InProgress", withdrawals.toString(), it.convertedValue.toString());
              convertedAmount = it.convertedValue.add(withdrawals);
            }
            //console.log("Converted Amount", convertedAmount?.toString());
            // console.log("Withdrawals 0", it.withdrawals[0].proceeds.toNumber());
            // console.log("Withdrawals 1", it.withdrawals[1].proceeds.toNumber());
            // const sRate = ethers.utils.formatEther(it.salesRate);

            //console.log("Sales rate", it.salesRate?.toNumber());
            const expBlock = it.expirationBlock;
            const amountOf = expBlock?.sub(stBlock)?.mul(it?.salesRate);
            //console.log("StartBlock", stBlock);
            //console.log("Exp BLock", expBlock?.toNumber());
            //console.log("latestBlock", latestBlock);
            //console.log("Amount of", amountOf.toString());
            let soldToken;
            if (it.state === "cancelled") {
              soldToken = amountOf?.sub(it?.unsoldAmount);
            } else {
              soldToken =
                latestBlock > expBlock
                  ? amountOf
                  : latestBlock?.sub(stBlock)?.mul(it.salesRate);
            }
            //console.log("Sold Token", soldToken?.toString());

            const averagePrice =
              bigToFloat(convertedAmount, 18) / bigToFloat(soldToken, 18);
            console.log("Average Price", averagePrice);
            return (
              <div className={styles.container} key={it.transactionHash}>
                <div className={styles.topSection}>
                  <p className={styles.orderId} key={it?.orderId?.toNumber()}>
                    {it?.orderId?.toNumber()}
                  </p>

                  <HiExternalLink
                    className={styles.iconExternalLink}
                    onClick={() =>
                      window.open(
                        `${
                          Object.values(
                            POOLS[localStorage.getItem("coin_name")]
                          )[0]?.transactionUrl
                        }${it.transactionHash}`,
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
                        src={
                          Object.values(
                            POOLS[localStorage.getItem("coin_name")]
                          )[0].tokens[it.sellTokenIndex].image
                        }
                        alt={
                          Object.values(
                            POOLS[localStorage.getItem("coin_name")]
                          )[0].tokens[it.sellTokenIndex].symbol
                        }
                      />
                      <p className={styles.tokenText}>
                        <span>
                          {bigToStr(soldToken, 18)}{" "}
                          {
                            Object.values(
                              POOLS[localStorage.getItem("coin_name")]
                            )[0].tokens[it.sellTokenIndex].symbol
                          }{" "}
                          of
                        </span>
                        <span> {bigToStr(amountOf, 18)}</span>
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
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <img
                        className={styles.tokenIcon}
                        src={
                          Object.values(
                            POOLS[localStorage.getItem("coin_name")]
                          )[0].tokens[it.buyTokenIndex].image
                        }
                        alt={
                          Object.values(
                            POOLS[localStorage.getItem("coin_name")]
                          )[0].tokens[it.buyTokenIndex].symbol
                        }
                      />
                      <p
                        className={classNames(
                          styles.tokenText,
                          styles.greenText
                        )}
                      >
                        {bigToStr(convertedAmount, 18)}{" "}
                        {
                          Object.values(
                            POOLS[localStorage.getItem("coin_name")]
                          )[0].tokens[it.buyTokenIndex].symbol
                        }
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
                    <div className={styles.fees}>
                      {
                        Object.values(
                          POOLS[localStorage.getItem("coin_name")]
                        )[0]?.fees
                      }{" "}
                      fees
                    </div>
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
                        orderStatus.status === "Execution Completed" ||
                        disableActionBtn
                      }
                      onClick={() => {
                        handleCancel(
                          it?.orderId?.toNumber(),
                          it?.transactionHash
                        );
                        // cancelPool(it?.orderId?.toNumber());
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
                            handleWithDraw(
                              it?.orderId?.toNumber(),
                              it?.transactionHash
                            );
                          }}
                          disabled={disableActionBtn}
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
  );
};

export default LongTermOrderCard;
