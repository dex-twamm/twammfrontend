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
import { bigToStr, getInputLimit } from "../utils";

import {
  calculateNumBlockIntervals,
  valueLabel,
} from "../methods/longSwapMethod";
import { LongSwapContext } from "../providers";
import { ShortSwapContext } from "../providers/context/ShortSwapProvider";
import Input from "./Input";
import { FiChevronDown } from "react-icons/fi";

import { approveMaxAllowance, getAllowance } from "../utils/getApproval";

import { UIContext } from "../providers/context/UIProvider";

interface PropTypes {
  handleLongSwapAction: any;
  longSwapVerifyLoading: boolean;
}

const LongSwap = (props: PropTypes) => {
  const { handleLongSwapAction, longSwapVerifyLoading } = props;

  const [display, setDisplay] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0.0);
  const [executionTime, setExecutionTIme] = useState<string>("");
  const [hasBalancerOrTransactionError, setHasBalancerOrTransactionError] =
    useState<boolean>(true);

  const {
    account,
    swapAmount,
    setSwapAmount,
    selectToken,
    setSelectToken,
    setExpectedSwapOut,
    error,
    currentBlock,
    setTransactionHash,
    isWalletConnected,
    web3provider,
    setAllowTwammErrorMessage,
  } = useContext(ShortSwapContext)!;

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
    setAllowance,
    setLongSwapFormErrors,
    longSwapFormErrors,
    setMessage,
  } = useContext(LongSwapContext)!;

  const { selectedNetwork } = useContext(UIContext)!;

  const handleDisplay = (event: React.MouseEvent<HTMLElement>) => {
    setSelectToken(event.currentTarget.id);
    setDisplay(!display);
    setExpectedSwapOut(0.0);
  };

  useEffect(() => {
    return () => {
      setExpectedSwapOut(0);
    };
  }, [setExpectedSwapOut]);

  useEffect(() => {
    if (tokenA?.symbol === tokenB?.symbol)
      setTokenB({
        symbol: "Select Token",
        logo: "",
        balance: 0,
        tokenIsSet: false,
        name: "",
        decimals: 0,
        address: "",
      });
  }, [tokenA, tokenB, setTokenB]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    isWalletConnected && setLongSwapFormErrors(validate(swapAmount.toString()));
    handleLongSwapAction();
  };

  const handleApproveButton = async () => {
    try {
      const approval = await approveMaxAllowance(
        web3provider!,
        tokenA?.address!,
        selectedNetwork
      );
      setTransactionHash(approval.hash);

      await getAllowance(
        web3provider?.getSigner(),
        account,
        tokenA?.address!,
        selectedNetwork
      ).then((res) => {
        setAllowance(bigToStr(res, tokenA?.decimals).toString());
      });
    } catch (e) {
      setAllowTwammErrorMessage("Error!");
    }
  };

  const validate = (values: string) => {
    const valueInt = parseFloat(values);
    const errors = { balError: "" };
    if (valueInt <= 0) {
      errors.balError = "Swap Amount Is Required";
    }

    return errors;
  };

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setValue(newValue as number);
      setNumberOfBlockIntervals(calculateNumBlockIntervals(newValue));
      const { targetDate, executionTime } = valueLabel(
        calculateNumBlockIntervals(newValue as number),
        currentBlock,
        selectedNetwork
      );

      setTargetDate(targetDate);
      setExecutionTIme(executionTime);
    }
  };

  useEffect(() => {
    longSwapFormErrors?.balError !== undefined
      ? setHasBalancerOrTransactionError(true)
      : setHasBalancerOrTransactionError(false);
  }, [longSwapFormErrors]);

  useEffect(() => {
    if (error === "Transaction Error" || error === "Transaction Cancelled") {
      setHasBalancerOrTransactionError(false);
    }
  }, [error, setHasBalancerOrTransactionError]);

  useEffect(() => {
    return () => {
      setLongSwapFormErrors({ balError: undefined });
    };
  }, [setLongSwapFormErrors]);

  useEffect(() => {
    return () => {
      setTargetDate("");
      setExecutionTIme("");
      setTransactionHash("");
      setMessage("");
    };
  }, []);

  useEffect(() => {
    if (!swapAmount) {
      setLongSwapFormErrors({ balError: undefined });
    }
  }, [swapAmount, setLongSwapFormErrors]);

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={lsStyles.main} />
        <Box className={lsStyles.mainBox}>
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
            input={swapAmount ? swapAmount : 0}
            placeholder="0.0"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSwapAmount(getInputLimit(e.target.value));
            }}
            imgSrc={tokenA?.logo}
            symbol={tokenA?.symbol}
            handleDisplay={handleDisplay}
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
            <Box className={lsStyles.rangeSelectBox}>
              <Typography
                component={"span"}
                fontWeight={600}
                id="non-linear-slider"
                gutterBottom
              >
                <Box className={lsStyles.dateBox}>
                  {`${targetDate} `.substring(0, 17)}
                </Box>

                <Box className={lsStyles.timeBox}>{executionTime}</Box>
                <Box className={lsStyles.executionTime}>Execution Time</Box>
                <Box className={lsStyles.completionDate}>
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
              tokenA?.tokenIsSet &&
              tokenB?.tokenIsSet &&
              !executionTime ? (
                <p style={{ fontSize: "12px", marginBottom: "0px" }}>
                  execution time is required.
                </p>
              ) : null}
            </Box>
          </div>

          {swapAmount &&
          swapAmount <= tokenA?.balance! &&
          parseFloat(allowance) < swapAmount &&
          tokenA?.tokenIsSet &&
          tokenB?.tokenIsSet ? (
            <button
              className={classNames(
                styles.btn,
                styles.btnConnect,
                styles.btnBtn
              )}
              onClick={() => {
                handleApproveButton();
              }}
              disabled={
                hasBalancerOrTransactionError ||
                swapAmount == 0 ||
                swapAmount > tokenA?.balance
              }
            >
              {`Allow LongSwap Protocol to use your ${
                tokenA?.symbol ?? tokenB?.symbol
              }`}
            </button>
          ) : (
            <></>
          )}
          {isWalletConnected ? (
            <button
              className={classNames(
                styles.btn,
                styles.btnConnect,
                styles.btnBtn
              )}
              onClick={handleClick}
              disabled={
                !tokenA?.tokenIsSet ||
                !tokenB?.tokenIsSet ||
                !swapAmount ||
                !numberOfBlockIntervals ||
                hasBalancerOrTransactionError ||
                longSwapVerifyLoading ||
                parseFloat(allowance) < swapAmount
              }
            >
              {!tokenA?.tokenIsSet || !tokenB?.tokenIsSet ? (
                "Select a Token"
              ) : !swapAmount ? (
                "Enter an Amount"
              ) : longSwapVerifyLoading ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : (
                "Swap"
              )}
            </button>
          ) : !isWalletConnected ? (
            <button
              className={classNames(styles.btn, styles.btnConnect)}
              onClick={handleClick}
            >
              Connect Wallet
            </button>
          ) : (
            //this is for the small time interval while allowance is loading.
            <button className={classNames(styles.btn, styles.btnConnect)}>
              <CircularProgress sx={{ color: "white" }} />
            </button>
          )}
        </Box>
      </form>
    </>
  );
};

export default LongSwap;
