import { useEffect } from "react";
import {
  Alert,
  Box,
  Slider,
  Typography,
  CircularProgress,
} from "@mui/material";
import classNames from "classnames";
import React, { useContext, useState } from "react";
import lsStyles from "../css/LongSwap.module.css";
import styles from "../css/AddLiquidity.module.css";

import {
  calculateNumBlockIntervals,
  valueLabel,
} from "../methods/longSwapMethod";
import { LongSwapContext } from "../providers";
import { ShortSwapContext } from "../providers/context/ShortSwapProvider";
import Input from "./Input";
import { FiChevronDown } from "react-icons/fi";

import { approveMaxAllowance } from "../utils/getApproval";
import { UIContext } from "../providers/context/UIProvider";

const LongSwap = (props) => {
  const {
    connectWallet,
    buttonText,
    longSwapVerifyLoading,
    setIsPlacedLongTermOrder,
  } = props;

  const [display, setDisplay] = useState(false);
  const [value, setValue] = useState(0.0);
  const [executionTime, setExecutionTIme] = useState("");
  const [disableAllowBtn, setDisableAllowBtn] = useState(true);

  const {
    swapAmount,
    setSwapAmount,
    selectToken,
    setSelectToken,
    setExpectedSwapOut,
    error,
    currentBlock,
    srcAddress,
    setTransactionHash,
    isWalletConnected,
    web3provider,
  } = useContext(ShortSwapContext);

  const {
    tokenA,
    tokenB,
    setTokenA,
    setTokenB,
    setTargetDate,
    targetDate,
    setNumberOfBlockIntervals,
    numberOfBlockIntervals,
    allowance,
    setLongSwapFormErrors,
    longSwapFormErrors,
  } = useContext(LongSwapContext);

  const { selectedNetwork } = useContext(UIContext);

  const handleDisplay = (event) => {
    setSelectToken(event.currentTarget.id);
    setDisplay(!display);
    setExpectedSwapOut(0.0);
  };

  useEffect(() => {
    return () => {
      setExpectedSwapOut(undefined);
    };
  }, [setExpectedSwapOut]);

  useEffect(() => {
    if (tokenA?.symbol === tokenB?.symbol)
      setTokenB({
        symbol: "Select Token",
        logo: "",
        balance: "",
        tokenIsSet: false,
      });
  }, [tokenA, tokenB, setTokenB]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleClick = () => {
    buttonText === "Swap" && setLongSwapFormErrors(validate(swapAmount));
    connectWallet();
  };

  const handleApproveButton = async () => {
    try {
      const approval = await approveMaxAllowance(
        web3provider,
        srcAddress,
        selectedNetwork?.network
      );
      setTransactionHash(approval.hash);
    } catch (e) {
      console.log(e);
    }
  };

  const validate = (values) => {
    const valueInt = parseFloat(values);
    const errors = {};
    if (!valueInt > 0) {
      errors.swapAmount = "Swap Amount Is Required";
    }

    return errors;
  };

  const handleChange = (e, newValue) => {
    if (typeof newValue === "number") {
      setValue(newValue);
      setNumberOfBlockIntervals(calculateNumBlockIntervals(newValue));
      setTargetDate(
        valueLabel(calculateNumBlockIntervals(newValue), currentBlock)
          .targetDate
      );
      setExecutionTIme(
        valueLabel(calculateNumBlockIntervals(newValue), currentBlock)
          .executionTime
      );
    }
  };

  useEffect(() => {
    longSwapFormErrors?.balError !== undefined
      ? setDisableAllowBtn(true)
      : setDisableAllowBtn(false);
  }, [longSwapFormErrors]);

  useEffect(() => {
    if (error === "Transaction Error" || error === "Transaction Cancelled") {
      setDisableAllowBtn(false);
    }
  }, [error, setDisableAllowBtn]);

  useEffect(() => {
    return () => {
      setLongSwapFormErrors({ balError: undefined });
    };
  }, [setLongSwapFormErrors]);

  useEffect(() => {
    return () => {
      setTargetDate("");
      setExecutionTIme("");
      setTransactionHash(undefined);
      setIsPlacedLongTermOrder && setIsPlacedLongTermOrder();
    };
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div
          style={{
            width: "96%",
            height: "2px",
            background: "#f0f0f0",
            display: "flex",
            justifyContent: "center",
            margin: "auto",
            marginBottom: "0px",
          }}
        />

        <Box
          padding={"6px 8px"}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            boxSizing: "border-box",
          }}
        >
          <Box
            className={styles.mainContent}
            style={{ marginTop: "0px", paddingTop: "0px" }}
          >
            <div
              className={`unselectable ${styles.selectPairContainer}`}
              style={{ marginTop: "6px" }}
            >
              <p className={styles.mainHeader} style={{ color: "#333333" }}>
                Select Pair
              </p>
              <div className={styles.pairContainer}>
                <div
                  onClick={() => {
                    setDisplay(true);
                    setSelectToken("1");
                  }}
                  className={styles.select}
                >
                  <div className={styles.currencyWrap}>
                    <img
                      className={styles.cryptoImage}
                      src={tokenA?.logo}
                      alt="Ethereum"
                    />
                    <p className={styles.tokenSymbol}>{tokenA?.symbol}</p>
                  </div>
                  <FiChevronDown className={styles.dropDownIcon} />
                </div>

                <div
                  onClick={() => {
                    setDisplay(true);
                    setSelectToken("2");
                  }}
                  className={styles.select}
                >
                  <div className={styles.currencyWrap}>
                    {tokenB?.logo !== "" && (
                      <img
                        className={styles.cryptoImage}
                        src={tokenB?.logo}
                        alt="Ethereum"
                      />
                    )}
                    <p className={styles.tokenSymbol}>
                      <span
                        style={{
                          paddingLeft: `${tokenB?.tokenIsSet ? "0px" : "10px"}`,
                        }}
                      >
                        {tokenB?.symbol}
                      </span>
                    </p>
                  </div>
                  <FiChevronDown className={styles.dropDownIcon} />
                </div>
              </div>
            </div>
          </Box>

          <Input
            id={1}
            input={swapAmount ? swapAmount : ""}
            placeholder="0.0"
            onChange={(e) => {
              setSwapAmount(e.target.value);
            }}
            imgSrc={tokenA?.logo}
            symbol={tokenA?.symbol}
            handleDisplay={handleDisplay}
            selectToken={selectToken}
            display={display}
            setDisplay={setDisplay}
            setTokenA={setTokenA}
            setTokenB={setTokenB}
          />

          {longSwapFormErrors?.balError && (
            <div className={styles.errorAlert}>
              <Alert severity="error" sx={{ borderRadius: "16px" }}>
                {longSwapFormErrors?.balError}
              </Alert>
            </div>
          )}

          <div className={lsStyles.rangeSelect}>
            <Box
              sx={{
                margin: "0 auto",
              }}
            >
              <Typography
                component={"span"}
                fontWeight={600}
                id="non-linear-slider"
                gutterBottom
              >
                <Box
                  sx={{
                    float: "right",
                    display: "flex",
                    fontSize: "15px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontFamily: "Open Sans",
                  }}
                >
                  {`${targetDate} `.substring(0, 17)}
                </Box>

                <Box
                  sx={{
                    fontSize: "15px",
                    paddingLeft: "10px",
                    fontFamily: "Open Sans",
                  }}
                >
                  {executionTime}
                </Box>
                <Box
                  sx={{
                    float: "left",
                    display: "flex",
                    fontFamily: "Open Sans",
                    fontWeight: "600",
                    fontSize: "16px",
                    lineHeight: "22px",
                    color: "#000000",
                  }}
                >
                  Execution Time
                </Box>
                <Box
                  sx={{
                    float: "right",
                    display: "flex",
                    fontFamily: "Open Sans",
                    fontWeight: "600",
                    fontSize: "16px",
                    lineHeight: "22px",
                    color: "#000000",
                    paddingRight: "2px",
                  }}
                >
                  Order Completion Date
                </Box>
              </Typography>
              <Slider
                value={value}
                min={0}
                step={0.1}
                max={13}
                sx={{
                  height: 15,
                  width: 1,
                  color: "#6D64A5",
                }}
                onChange={handleChange}
                aria-labelledby="non-linear-slider"
              />
              {swapAmount &&
              tokenA.tokenIsSet &&
              tokenB.tokenIsSet &&
              !executionTime ? (
                <p style={{ fontSize: "12px", marginBottom: "0px" }}>
                  execution time is required.
                </p>
              ) : null}
            </Box>
          </div>

          {swapAmount &&
          parseFloat(allowance) <= swapAmount &&
          tokenA.tokenIsSet &&
          tokenB.tokenIsSet ? (
            <button
              className={classNames(styles.btn, styles.btnConnect)}
              style={{
                background: "#554994",
                borderRadius: "17px",
                color: "white",
              }}
              onClick={() => {
                handleApproveButton();
              }}
              disabled={disableAllowBtn || executionTime === ""}
            >
              {`Allow TWAMM Protocol to use your ${
                tokenA.symbol ?? tokenB.symbol
              }`}
            </button>
          ) : (
            <></>
          )}
          {isWalletConnected ? (
            <button
              className={classNames(styles.btn, styles.btnConnect)}
              style={{
                background: "#554994",
                borderRadius: "17px",
                color: "white",
              }}
              onClick={handleClick}
              disabled={
                !tokenA.tokenIsSet ||
                !tokenB.tokenIsSet ||
                !swapAmount ||
                !numberOfBlockIntervals ||
                disableAllowBtn ||
                longSwapVerifyLoading ||
                parseFloat(allowance) <= swapAmount
                  ? true
                  : false
              }
            >
              {!tokenA.tokenIsSet || !tokenB.tokenIsSet ? (
                "Select a Token"
              ) : !swapAmount ? (
                "Enter an Amount"
              ) : longSwapVerifyLoading ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : (
                buttonText
              )}
            </button>
          ) : (
            <button
              className={classNames(styles.btn, styles.btnConnect)}
              onClick={handleClick}
            >
              Connect Wallet
            </button>
          )}
        </Box>
      </form>
    </>
  );
};

export default LongSwap;
