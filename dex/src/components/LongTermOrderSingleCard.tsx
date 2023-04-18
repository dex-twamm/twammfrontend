import { useEffect, useRef, useState } from "react";
import { BigNumber } from "ethers";
import { HiExternalLink } from "react-icons/hi";
import styles from "../css/LongTermOrderCard.module.css";
import {
  bigToFloat,
  bigToStr,
  getInverseValue,
  getProperFixedValue,
} from "../utils";
import classNames from "classnames";
import LongTermSwapCardDropdown from "./LongTermSwapCardDropdown";
import { _withdrawLTO } from "../utils/_withdrawLto";
import { _cancelLTO } from "../utils/_cancelLto";
import { ethers } from "ethers";
import { getLongSwapPoolFee, getPoolTokens } from "../utils/poolUtils";
import { getBlockExplorerTransactionUrl } from "../utils/networkUtils";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import { withdrawLTO } from "../utils/manageLtoOrders";
import {
  ORDER_EXECUTION_TIME_REMAINING,
  ORDER_LOG_STATE_CANCELLED,
  ORDER_LOG_STATE_COMPLETED,
  ORDER_LOG_STATE_INPROGRESS,
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_COMPLETED,
  ORDER_STATUS_EXECUTED,
} from "../utils/constants";
import { formatToReadableTime } from "../utils/timeUtils";
import { TokenType } from "../utils/pool";
import { useShortSwapContext } from "../providers/context/ShortSwapProvider";
import { useLongSwapContext } from "../providers/context/LongSwapProvider";
import { useNetworkContext } from "../providers/context/NetworkProvider";

interface PropTypes {
  orderLog: any;
}

const LongTermOrderSingleCard = ({ orderLog }: PropTypes) => {
  const {
    currentBlock,
    setCurrentBlock,
    setLoading,
    account,
    web3provider,
    setTransactionHash,
  } = useShortSwapContext();

  const {
    lastVirtualOrderBlock,
    disableActionBtn,
    setDisableActionBtn,
    setOrderLogsDecoded,
    setMessage,
  } = useLongSwapContext();
  const { selectedNetwork } = useNetworkContext();

  const [orderStatus, setOrderStatus] = useState<{
    status: string;
    progress: number;
  }>();
  const [newTime, setNewTime] = useState(
    (orderLog.expirationBlock - currentBlock.number) * 12
  );

  const [orderStartTime, setOrderStartTime] = useState("");
  const [orderCompletionTime, setOrderCompletionTime] = useState("");
  const [averagePrice, setAveragePrice] = useState(0.0);
  const [switchAvgPrice, setSwitchAvgPrice] = useState(false);
  const [switchedAveragePrice, setSwitchedAveragePrice] = useState(0);
  const [expectedWithdrawalValue, setExpectedWithdrawalValue] = useState(0);
  const [soldToken, setSoldToken] = useState<BigNumber>(BigNumber.from(0));

  const tokens = getPoolTokens(selectedNetwork);

  const tokenIn: TokenType = tokens[orderLog.sellTokenIndex];
  const tokenOut: TokenType = tokens[orderLog.buyTokenIndex];

  const remainingTimeRef = useRef<HTMLParagraphElement>(null);

  const stBlock = orderLog.startBlock;
  const expBlock = orderLog.expirationBlock;
  const amountOf = expBlock?.sub(stBlock)?.mul(orderLog?.salesRate);

  const convertedAmount = orderLog.withdrawals.reduce(
    (total: BigNumber, withdrawal: any) => {
      return total.add(withdrawal.proceeds);
    },
    ethers.constants.Zero
  );

  const tokenWithdrawals =
    bigToFloat(convertedAmount, tokenOut.decimals) +
    parseFloat(expectedWithdrawalValue.toString());

  useEffect(() => {
    if (orderLog.state === ORDER_LOG_STATE_CANCELLED) {
      setSoldToken(amountOf?.sub(orderLog?.unsoldAmount));
    } else if (orderLog.state === ORDER_LOG_STATE_INPROGRESS) {
      setSoldToken(
        currentBlock.number > expBlock
          ? amountOf
          : orderLog.salesRate?.mul(currentBlock.number - stBlock)
      );
    } else {
      setSoldToken(
        lastVirtualOrderBlock > expBlock
          ? amountOf
          : lastVirtualOrderBlock?.sub(stBlock)?.mul(orderLog.salesRate)
      );
    }
  }, [orderLog, lastVirtualOrderBlock, currentBlock.number, expBlock, stBlock]);

  useEffect(() => {
    setAveragePrice(
      getProperFixedValue(
        tokenWithdrawals / bigToFloat(soldToken, tokenIn.decimals)
      )
    );
  }, [tokenWithdrawals, soldToken, tokenIn]);

  const handleCancel = (orderId: number) => {
    _cancelLTO(
      orderId,
      setLoading,
      setDisableActionBtn,
      account,
      web3provider,
      setOrderLogsDecoded,
      setMessage,
      setTransactionHash,
      selectedNetwork
    );
  };

  const handleWithDraw = (orderId: number) => {
    _withdrawLTO(
      orderId,
      setLoading,
      setDisableActionBtn,
      account,
      web3provider,
      setOrderLogsDecoded,
      setMessage,
      setTransactionHash,
      selectedNetwork
    );
  };

  useEffect(() => {
    if (orderLog?.state === ORDER_LOG_STATE_COMPLETED) {
      setOrderStatus({ status: ORDER_STATUS_COMPLETED, progress: 100 });
    } else if (orderLog?.state === ORDER_LOG_STATE_CANCELLED) {
      setOrderStatus({ status: ORDER_STATUS_CANCELLED, progress: 100 });
    } else if (lastVirtualOrderBlock >= orderLog.expirationBlock) {
      setOrderStatus({ status: ORDER_STATUS_EXECUTED, progress: 100 });
    } else {
      if (orderLog.expirationBlock > currentBlock.number) {
        let date = new Date(0);
        date.setSeconds(newTime); // specify value for SECONDS here
        const timeString = date.toISOString().substring(11, 16);
        setOrderStatus({
          status: `${ORDER_EXECUTION_TIME_REMAINING}: ${timeString}`,
          progress:
            ((parseFloat(lastVirtualOrderBlock.toString()) -
              orderLog?.startBlock) *
              100) /
            (orderLog?.expirationBlock - orderLog?.startBlock),
        });
      } else {
        setOrderStatus({ status: ORDER_STATUS_EXECUTED, progress: 100 });
      }
    }
  }, [orderLog, currentBlock, lastVirtualOrderBlock, newTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (newTime && newTime > 0) {
        setNewTime(newTime - 60);
      }
    }, 1000 * 60);
    return () => clearInterval(timer);
  }, [newTime]);

  const isExecuteTimeCompleted = () => {
    if (orderStatus?.status.includes(ORDER_EXECUTION_TIME_REMAINING))
      return false;
    else return true;
  };

  const handleAveragePriceClick = () => {
    setSwitchAvgPrice((prev) => !prev);
    const avgPrice = parseFloat(averagePrice.toString());
    setSwitchedAveragePrice(+getInverseValue(avgPrice));
  };

  useEffect(() => {
    const getTime = async () => {
      const startTime = await web3provider.getBlock(stBlock);
      setOrderStartTime(formatToReadableTime(startTime?.timestamp));
      if (isExecuteTimeCompleted()) {
        const blockNumberForTimestamp =
          orderLog.state === ORDER_LOG_STATE_CANCELLED
            ? orderLog.withdrawals[orderLog.withdrawals.length - 1]?.blockNumber
            : expBlock.toString();

        const completionTime = await web3provider.getBlock(
          parseFloat(blockNumberForTimestamp)
        );
        setOrderCompletionTime(formatToReadableTime(completionTime?.timestamp));
      }
    };
    getTime();
  }, [expBlock, stBlock, web3provider, orderStatus]);

  useEffect(() => {
    const getExpectedWithdrawalValue = async () => {
      const signer = web3provider?.getSigner();
      const result = await withdrawLTO(
        account,
        signer,
        orderLog?.orderId?.toNumber(),
        selectedNetwork,
        true
      );

      const expectedWithdrawResult = bigToFloat(
        result["amountsOut"][orderLog.buyTokenIndex],
        tokenOut?.decimals
      );
      setExpectedWithdrawalValue(+getProperFixedValue(expectedWithdrawResult));
    };

    if (orderLog?.state === ORDER_LOG_STATE_INPROGRESS)
      getExpectedWithdrawalValue();
  }, [currentBlock]);

  useEffect(() => {
    const getCurrentBlock = async () => {
      const currentBlock = await web3provider.getBlock("latest");
      setCurrentBlock(currentBlock);
    };
    getCurrentBlock();
  }, [newTime, setCurrentBlock, web3provider]);

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
                {getProperFixedValue(tokenWithdrawals)} {tokenOut.symbol}
              </p>
            </div>
          </div>

          <div>
            <p
              className={
                orderStatus?.status === ORDER_STATUS_CANCELLED
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
                  orderStatus?.status === ORDER_STATUS_COMPLETED
                    ? styles.greenProgress
                    : orderStatus?.status === ORDER_STATUS_EXECUTED
                    ? styles.greenProgress
                    : orderStatus?.status === ORDER_STATUS_CANCELLED
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
              <div className={styles.fees}>
                Fees: {getLongSwapPoolFee(selectedNetwork)}
              </div>
              {bigToFloat(soldToken) !== 0 && (
                <div
                  className={styles.averagePrice}
                  onClick={handleAveragePriceClick}
                >
                  {!switchAvgPrice
                    ? ` Average Price: 1 ${tokenIn.symbol} =
                    ${getProperFixedValue(+averagePrice)}
                    ${tokenOut.symbol}`
                    : ` Average Price: 1 ${tokenOut.symbol} =
                    ${switchedAveragePrice}
                    ${tokenIn.symbol}`}
                  <ChangeCircleOutlinedIcon
                    fontSize="small"
                    sx={{ marginLeft: "10px" }}
                  />
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
                orderStatus?.status !== ORDER_STATUS_COMPLETED
                  ? styles.cancelButton
                  : styles.successButton
              )}
              disabled={
                orderStatus?.status === ORDER_STATUS_CANCELLED ||
                orderStatus?.status === ORDER_STATUS_COMPLETED ||
                orderStatus?.status === ORDER_STATUS_EXECUTED ||
                disableActionBtn
              }
              onClick={() => {
                handleCancel(orderLog?.orderId?.toNumber());
              }}
            >
              {orderStatus?.status === ORDER_STATUS_COMPLETED
                ? ORDER_STATUS_COMPLETED
                : orderStatus?.status === ORDER_STATUS_CANCELLED
                ? ORDER_STATUS_CANCELLED
                : "Cancel"}
            </button>
            {orderStatus?.status !== ORDER_STATUS_CANCELLED &&
              orderStatus?.status !== ORDER_STATUS_COMPLETED && (
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
