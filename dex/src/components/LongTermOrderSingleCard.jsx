import React, { useContext, useEffect, useRef, useState } from "react";
import { HiExternalLink } from "react-icons/hi";
import styles from "../css/LongTermOrderCard.module.css";
import { UIContext } from "../providers/context/UIProvider";
import { bigToFloat, bigToStr, getProperFixedValue } from "../utils";
import classNames from "classnames";
import LongTermSwapCardDropdown from "./LongTermSwapCardDropdown";
import { _withdrawLTO } from "../utils/_withdrawLto";
import { _cancelLTO } from "../utils/_cancelLto";
import { LongSwapContext, ShortSwapContext } from "../providers";
import { ethers } from "ethers";
import { getPoolConfig } from "../utils/poolUtils";
import { getBlockExplorerTransactionUrl } from "../utils/networkUtils";

const LongTermOrderSingleCard = ({ orderLog }) => {
  const {
    currentBlock,
    isWalletConnected,
    setLoading,
    account,
    web3provider,
    setweb3provider,
    setCurrentBlock,
    setBalance,
    setAccount,
    setWalletConnected,
    setTransactionHash,
  } = useContext(ShortSwapContext);

  const {
    lastVirtualOrderBlock,
    disableActionBtn,
    setDisableActionBtn,
    setOrderLogsDecoded,
    setMessage,
  } = useContext(LongSwapContext);
  const { selectedNetwork, setSelectedNetwork } = useContext(UIContext);

  const orderStatusCompleted = "Completed";
  const orderStatusCancelled = "Cancelled";
  const orderStatusExecuted = "Execution Completed";
  const orderExecutionTimeRemaining = "Time Remaining";

  const [orderStatus, setOrderStatus] = useState();
  const [newTime, setNewTime] = useState(
    (orderLog.expirationBlock - currentBlock.number) * 12
  );

  const [orderStartTime, setOrderStartTime] = useState();
  const [orderCompletionTime, setOrderCompletionTime] = useState();

  const poolConfig = getPoolConfig(selectedNetwork);

  const tokenIn = poolConfig.tokens[orderLog.sellTokenIndex];
  const tokenOut = poolConfig.tokens[orderLog.buyTokenIndex];

  const remainingTimeRef = useRef();

  let convertedAmount = ethers.constants.Zero;
  if (orderLog.state === "completed" || orderLog.state === "cancelled") {
    // Order Completed and Deleted
    convertedAmount = orderLog.withdrawals.reduce((total, withdrawal) => {
      return total.add(withdrawal.proceeds);
    }, ethers.constants.Zero);
  } else {
    // Order Still In Progress
    let withdrawals = orderLog.withdrawals.reduce((total, withdrawal) => {
      return total.add(withdrawal.proceeds);
    }, ethers.constants.Zero);

    convertedAmount = orderLog.convertedValue.add(withdrawals);
  }

  const stBlock = orderLog.startBlock;
  const expBlock = orderLog.expirationBlock;
  const amountOf = expBlock?.sub(stBlock)?.mul(orderLog?.salesRate);

  let soldToken;
  if (orderLog.state === "cancelled") {
    soldToken = amountOf?.sub(orderLog?.unsoldAmount);
  } else {
    soldToken =
      lastVirtualOrderBlock > expBlock
        ? amountOf
        : lastVirtualOrderBlock?.sub(stBlock)?.mul(orderLog.salesRate);
  }

  const averagePrice =
    bigToFloat(convertedAmount, tokenOut.decimals) /
    bigToFloat(soldToken, tokenIn.decimals);

  const handleCancel = (orderId) => {
    _cancelLTO(
      orderId,
      setLoading,
      setDisableActionBtn,
      account,
      web3provider,
      setweb3provider,
      setCurrentBlock,
      setBalance,
      setAccount,
      setWalletConnected,
      isWalletConnected,
      setOrderLogsDecoded,
      setMessage,
      setTransactionHash,
      selectedNetwork,
      setSelectedNetwork
    );
  };

  const handleWithDraw = (orderId) => {
    _withdrawLTO(
      orderId,
      setLoading,
      setDisableActionBtn,
      account,
      web3provider,
      setweb3provider,
      setCurrentBlock,
      setBalance,
      setAccount,
      setWalletConnected,
      isWalletConnected,
      setOrderLogsDecoded,
      setMessage,
      setTransactionHash,
      selectedNetwork,
      setSelectedNetwork
    );
  };

  useEffect(() => {
    if (orderLog?.state === "completed") {
      setOrderStatus({ status: orderStatusCompleted, progress: 100 });
    } else if (orderLog?.state === "cancelled") {
      setOrderStatus({ status: orderStatusCancelled, progress: 100 });
    } else if (lastVirtualOrderBlock >= orderLog.expirationBlock) {
      setOrderStatus({ status: orderStatusExecuted, progress: 100 });
    } else {
      if (orderLog.expirationBlock > currentBlock.number) {
        let date = new Date(0);
        date.setSeconds(newTime); // specify value for SECONDS here
        const timeString = date.toISOString().substring(11, 16);
        setOrderStatus({
          status: `${orderExecutionTimeRemaining}: ${timeString}`,
          progress:
            ((lastVirtualOrderBlock - orderLog?.startBlock) * 100) /
            (orderLog?.expirationBlock - orderLog?.startBlock),
        });
      } else {
        setOrderStatus({ status: orderStatusExecuted, progress: 100 });
      }
    }
  }, [orderLog, currentBlock, lastVirtualOrderBlock, newTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (newTime && newTime > 0) {
        setNewTime(newTime - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [newTime]);

  const isExecuteTimeCompleted = () => {
    if (orderStatus?.status.includes(orderExecutionTimeRemaining)) return false;
    else return true;
  };

  const getTimeWithoutSecs = (time) => {
    return time.substring(0, 17);
  };

  useEffect(() => {
    const getTime = async () => {
      const startTime = await web3provider.getBlock(stBlock);
      setOrderStartTime(
        getTimeWithoutSecs(
          new Date(startTime?.timestamp * 1000).toLocaleString()
        )
      );

      if (isExecuteTimeCompleted()) {
        const completionTime = await web3provider.getBlock(
          parseFloat(expBlock.toString())
        );
        setOrderCompletionTime(
          getTimeWithoutSecs(
            new Date(completionTime?.timestamp * 1000).toLocaleString()
          )
        );
      }
    };
    getTime();
  }, [expBlock, stBlock, web3provider, orderStatus]);

  return (
    <>
      <div className={styles.container} key={orderLog.transactionHash}>
        <div className={styles.topSection}>
          <p className={styles.orderId} key={orderLog?.orderId?.toNumber()}>
            {orderLog?.orderId?.toNumber()}
          </p>

          <HiExternalLink
            className={styles.iconExternalLink}
            onClick={() =>
              window.open(
                `${getBlockExplorerTransactionUrl(selectedNetwork)}${
                  orderLog.transactionHash
                }`,
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
            <p
              className={
                orderStatus?.status === orderStatusCancelled
                  ? styles.cancelled
                  : styles.timeRemaining
              }
              ref={remainingTimeRef}
            >
              {orderStatus?.status}
            </p>
            <div className={styles.progress}>
              <div
                style={{ width: `${orderStatus?.progress}%` }}
                className={classNames(
                  styles.activeProgress,
                  orderStatus?.status === orderStatusCompleted
                    ? styles.greenProgress
                    : orderStatus?.status === orderStatusExecuted
                    ? styles.greenProgress
                    : orderStatus?.status === orderStatusCancelled
                    ? styles.redProgress
                    : styles.activeProgress
                )}
              ></div>
            </div>
          </div>

          <div
            className={
              bigToFloat(soldToken) === 0 || !isExecuteTimeCompleted()
                ? styles.extrasContainerOne
                : styles.extrasContainer
            }
          >
            <div className={styles.feesAndPrice}>
              <div className={styles.fees}>Fees: {poolConfig?.fees}</div>
              {bigToFloat(soldToken) !== 0 && (
                <div className={styles.averagePrice}>
                  Average Price: {getProperFixedValue(averagePrice)}
                </div>
              )}
            </div>
            <div className={styles.times}>
              <div className={styles.fees}>Initiated On: {orderStartTime}</div>
              {isExecuteTimeCompleted() && (
                <div className={styles.fees}>
                  Completed On: {orderCompletionTime}
                </div>
              )}
            </div>
          </div>

          {orderLog.withdrawals.length > 0 && (
            <LongTermSwapCardDropdown
              item={orderLog}
              tokenIn={tokenIn}
              tokenOut={tokenOut}
            />
          )}

          <div className={styles.buttonContainer}>
            <button
              className={classNames(
                styles.button,
                orderStatus?.status !== orderStatusCompleted
                  ? styles.cancelButton
                  : styles.successButton
              )}
              disabled={
                orderStatus?.status === orderStatusCancelled ||
                orderStatus?.status === orderStatusCompleted ||
                orderStatus?.status === orderStatusExecuted ||
                disableActionBtn
              }
              onClick={() => {
                handleCancel(orderLog?.orderId?.toNumber());
              }}
            >
              {orderStatus?.status === orderStatusCompleted
                ? orderStatusCompleted
                : orderStatus?.status === orderStatusCancelled
                ? orderStatusCancelled
                : "Cancel"}
            </button>
            {orderStatus?.status !== orderStatusCancelled &&
              orderStatus?.status !== orderStatusCompleted && (
                <button
                  className={classNames(styles.button, styles.withdrawButton)}
                  onClick={() => {
                    handleWithDraw(orderLog?.orderId?.toNumber());
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
