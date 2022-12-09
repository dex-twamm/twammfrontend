import React, { useContext, useEffect, useRef, useState } from "react";
import { HiExternalLink } from "react-icons/hi";
import styles from "../css/LongTermOrderCard.module.css";
import { UIContext } from "../providers/context/UIProvider";
import { bigToFloat, bigToStr } from "../utils";
import classNames from "classnames";
import { POOLS } from "../utils/pool";

import LongTermSwapCardDropdown from "./LongTermSwapCardDropdown";
import { _withdrawLTO } from "../utils/_withdrawLto";
import { _cancelLTO } from "../utils/_cancelLto";
import { LongSwapContext, ShortSwapContext } from "../providers";
import { WebContext } from "../providers/context/WebProvider";
import { ethers } from "ethers";

const LongTermOrderSingleCard = ({ it }) => {
  const {
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
    latestBlock,
    disableActionBtn,
    setDisableActionBtn,
    setOrderLogsDecoded,
    setMessage,
  } = useContext(LongSwapContext);
  const { selectedNetwork, setSelectedNetwork, nId } = useContext(UIContext);

  const { provider } = useContext(WebContext);

  const [orderStatus, setOrderStatus] = useState();
  const [newTime, setNewTime] = useState(
    (it.expirationBlock - currentBlock.number) * 12
  );

  const poolConfig = Object.values(
    POOLS[selectedNetwork?.network ?? "Goerli"]
  )[0];
  const tokenIn = poolConfig.tokens[it.sellTokenIndex];
  const tokenOut = poolConfig.tokens[it.buyTokenIndex];

  const remainingTimeRef = useRef();
  let convertedAmount = ethers.constants.Zero;
  if (it.state === "completed" || it.state === "cancelled") {
    // Order Completed and Deleted
    convertedAmount = it.withdrawals.reduce((total, withdrawal) => {
      return total.add(withdrawal.proceeds);
    }, ethers.constants.Zero);
  } else {
    // Order Still In Progress
    let withdrawals = it.withdrawals.reduce((total, withdrawal) => {
      return total.add(withdrawal.proceeds);
    }, ethers.constants.Zero);

    convertedAmount = it.convertedValue.add(withdrawals);
  }

  const stBlock = it.startBlock;
  const expBlock = it.expirationBlock;
  const amountOf = expBlock?.sub(stBlock)?.mul(it?.salesRate);

  let soldToken;
  if (it.state === "cancelled") {
    soldToken = amountOf?.sub(it?.unsoldAmount);
  } else {
    soldToken =
      latestBlock > expBlock
        ? amountOf
        : latestBlock?.sub(stBlock)?.mul(it.salesRate);
  }

  const averagePrice =
    bigToFloat(convertedAmount, tokenOut.decimals) /
    bigToFloat(soldToken, tokenIn.decimals);

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
      setTransactionHash,
      selectedNetwork?.network,
      setSelectedNetwork,
      nId
    );
  };

  const handleWithDraw = (orderId, orderHash) => {
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
      setTransactionHash,
      selectedNetwork?.network,
      setSelectedNetwork,
      nId
    );
  };

  useEffect(() => {
    if (it?.state === "completed") {
      setOrderStatus({ status: "Completed", progress: 100 });
    } else if (it?.state === "cancelled") {
      setOrderStatus({ status: "Cancelled", progress: 100 });
    } else if (latestBlock >= it.expirationBlock) {
      setOrderStatus({ status: "Execution Completed", progress: 100 });
    } else {
      if (it.expirationBlock > currentBlock.number) {
        // const timeRemaining = (it.expirationBlock - currentBlock.number) * 12;
        let date = new Date(0);
        date.setSeconds(newTime); // specify value for SECONDS here
        const timeString = date.toISOString().substring(11, 16);
        setOrderStatus({
          status: `Time Remaining: ${timeString}`,
          progress:
            ((latestBlock - it?.startBlock) * 100) /
            (it?.expirationBlock - it?.startBlock),
        });
      } else {
        setOrderStatus({ status: "Execution Completed", progress: 100 });
      }
    }
  }, [it, newTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (newTime && newTime > 0) {
        setNewTime(newTime - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [newTime]);

  return (
    <>
      <div className={styles.container} key={it.transactionHash}>
        <div className={styles.topSection}>
          <p className={styles.orderId} key={it?.orderId?.toNumber()}>
            {it?.orderId?.toNumber()}
          </p>

          <HiExternalLink
            className={styles.iconExternalLink}
            onClick={() =>
              window.open(
                `${poolConfig?.transactionUrl}${it.transactionHash}`,
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
                src={tokenIn.logo}
                alt={tokenIn.symbol}
              />
              <p className={styles.tokenText}>
                <span>
                  {bigToStr(soldToken, tokenIn.decimals)} {tokenIn.symbol} of
                </span>
                <span> {bigToStr(amountOf, tokenIn.decimals)}</span>
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
                src={tokenOut.logo}
                alt={tokenOut.symbol}
              />
              <p className={classNames(styles.tokenText, styles.greenText)}>
                {bigToStr(convertedAmount, tokenOut.decimals)} {tokenOut.symbol}
              </p>
            </div>
          </div>

          <div>
            <p className={styles.timeRemaining} ref={remainingTimeRef}>
              {orderStatus?.status}
            </p>
            <div className={styles.progress}>
              <div
                style={{ width: `${orderStatus?.progress}%` }}
                className={classNames(
                  styles.activeProgress,

                  orderStatus?.status === "Completed"
                    ? styles.greenProgress
                    : orderStatus?.status === "Execution Completed"
                    ? styles.greenProgress
                    : orderStatus?.status === "Cancelled"
                    ? styles.redProgress
                    : styles.activeProgress
                )}
              ></div>
            </div>
          </div>

          <div className={styles.extrasContainer}>
            <div className={styles.fees}>{poolConfig?.fees} fees</div>
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
                orderStatus?.status !== "Completed"
                  ? styles.cancelButton
                  : styles.successButton
              )}
              disabled={
                orderStatus?.status === "Cancelled" ||
                orderStatus?.status === "Completed" ||
                orderStatus?.status === "Execution Completed" ||
                disableActionBtn
              }
              onClick={() => {
                handleCancel(it?.orderId?.toNumber(), it?.transactionHash);
              }}
            >
              {orderStatus?.status === "Completed"
                ? "Completed"
                : orderStatus?.status === "Cancelled"
                ? "Cancelled"
                : "Cancel"}
            </button>
            {orderStatus?.status !== "Cancelled" &&
              orderStatus?.status !== "Completed" && (
                <button
                  className={classNames(styles.button, styles.withdrawButton)}
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
    </>
  );
};

export default LongTermOrderSingleCard;
