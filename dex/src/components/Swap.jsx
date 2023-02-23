import { useEffect } from "react";
import { Alert, Box, CircularProgress, Skeleton } from "@mui/material";
import classNames from "classnames";
import React, { useContext, useState } from "react";
import styles from "../css/AddLiquidity.module.css";
import lsStyles from "../css/LongSwap.module.css";

import { LongSwapContext } from "../providers";
import { ShortSwapContext } from "../providers/context/ShortSwapProvider";
import Input from "./Input";

import { BigNumber } from "ethers";
import { bigToStr, getProperFixedValue } from "../utils";
import { approveMaxAllowance, getAllowance } from "../utils/getApproval";

import { UIContext } from "../providers/context/UIProvider";

const Swap = (props) => {
  const { handleSwapAction, spotPriceLoading } = props;

  const [display, setDisplay] = useState(false);
  const [hasBalancerOrTransactionError, setHasBalancerOrTransactionError] =
    useState(true);

  const [tokenRateSwitch, setTokenRateSwitch] = useState(false);

  const {
    account,
    swapAmount,
    setSwapAmount,
    selectToken,
    setSelectToken,
    expectedSwapOut,
    setExpectedSwapOut,
    formErrors,
    setFormErrors,
    error,
    setSpotPrice,
    spotPrice,
    setTransactionHash,
    isWalletConnected,
    setAllowTwammErrorMessage,
  } = useContext(ShortSwapContext);

  const { tokenA, tokenB, setTokenA, setTokenB, allowance, setAllowance } =
    useContext(LongSwapContext);

  const { web3provider } = useContext(ShortSwapContext);
  const { selectedNetwork } = useContext(UIContext);

  const handleDisplay = (event) => {
    setSelectToken(event.currentTarget.id);
    setDisplay(!display);
    setSpotPrice(0);
  };

  useEffect(() => {
    return () => {
      setExpectedSwapOut();
      setSpotPrice();
    };
  }, []);

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

  const handleTokenRateSwitch = () => {
    setTokenRateSwitch((state) => !state);
  };

  const handleClick = () => {
    isWalletConnected && setFormErrors(validate(swapAmount));
    handleSwapAction();
  };

  const handleApproveButton = async () => {
    try {
      const approval = await approveMaxAllowance(
        web3provider,
        tokenA?.address,
        selectedNetwork
      );
      setTransactionHash(approval.hash);

      await getAllowance(
        web3provider?.getSigner(),
        account,
        tokenA?.address,
        selectedNetwork
      ).then((res) => {
        setAllowance(bigToStr(res));
      });
    } catch (e) {
      console.log(e);
      setAllowTwammErrorMessage(e?.message);
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

  useEffect(() => {
    formErrors.balError !== undefined
      ? setHasBalancerOrTransactionError(true)
      : setHasBalancerOrTransactionError(false);
  }, [formErrors]);

  useEffect(() => {
    if (error === "Transaction Error" || error === "Transaction Cancelled") {
      setHasBalancerOrTransactionError(false);
    }
  }, [error, setHasBalancerOrTransactionError]);

  useEffect(() => {
    return () => {
      setFormErrors({ balError: undefined });
      setTransactionHash(undefined);
    };
  }, [setFormErrors, setTransactionHash]);

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={lsStyles.main} />
        <Box className={lsStyles.mainBox}>
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
          <Input
            id={2}
            input={
              expectedSwapOut
                ? bigToStr(BigNumber.from(expectedSwapOut), tokenB.decimals)
                : ""
            }
            placeholder=""
            imgSrc={tokenB?.logo}
            symbol={tokenB?.symbol}
            onChange={(e) => e.target.value}
            handleDisplay={handleDisplay}
            selectToken={selectToken}
            display={display}
            setDisplay={setDisplay}
            setTokenA={setTokenA}
            setTokenB={setTokenB}
          />

          {formErrors.balError && (
            <div className={styles.errorAlert}>
              <Alert severity="error" sx={{ borderRadius: "16px" }}>
                {formErrors.balError}
              </Alert>
            </div>
          )}
          {swapAmount !== 0 && tokenB?.tokenIsSet && (
            <>
              <Box
                sx={{
                  padding: { xs: "0px 4px", sm: "4px 8px" },
                }}
                className={
                  (tokenRateSwitch && styles.swapunit, styles.spotPriceBox)
                }
              >
                {!formErrors.balError ? (
                  <Box
                    className={styles.spotBox}
                    sx={{
                      alignItems: {
                        xs: "flex-start ",
                        sm: "center",
                        md: "center",
                      },
                      width: {
                        xs: "70%",
                        sm: "fit-content",
                        md: "fit-content",
                      },

                      gap: { xs: "2px", sm: "4px" },
                    }}
                  >
                    {spotPriceLoading ? (
                      <Skeleton width={"100px"} />
                    ) : spotPrice === 0 || !spotPrice ? (
                      <p></p>
                    ) : (
                      <p
                        className={lsStyles.spotPrice}
                        style={{
                          padding: { xs: "0px", sm: "8px 0px" },
                        }}
                        onClick={handleTokenRateSwitch}
                      >
                        {!tokenRateSwitch && (
                          <>
                            {` 1 ${tokenA.symbol} = ${"  "}`}
                            <label
                              style={{ marginLeft: "4px", cursor: "pointer" }}
                            >
                              {spotPriceLoading ? (
                                <Skeleton width={"100px"} />
                              ) : (
                                ` ${getProperFixedValue(spotPrice)} ${
                                  tokenB.symbol
                                }`
                              )}
                            </label>
                          </>
                        )}
                        {tokenRateSwitch && (
                          <>
                            {` 1 ${tokenB.symbol} = ${"  "}`}
                            <label
                              style={{ marginLeft: "4px", cursor: "pointer" }}
                            >
                              {spotPriceLoading ? (
                                <Skeleton width={"100px"} />
                              ) : (
                                ` ${getProperFixedValue(1 / spotPrice)} ${
                                  tokenA.symbol
                                }`
                              )}
                            </label>
                          </>
                        )}
                      </p>
                    )}
                  </Box>
                ) : null}
                <Box
                  className={lsStyles.extraBox}
                  sx={{
                    gap: { xs: "0px", sm: "5px" },
                  }}
                ></Box>
              </Box>
            </>
          )}

          {swapAmount &&
          parseFloat(allowance) <= swapAmount &&
          tokenA.tokenIsSet &&
          tokenB.tokenIsSet ? (
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
              {`Allow TWAMM Protocol to use your ${
                tokenA.symbol ?? tokenB.symbol
              }`}
            </button>
          ) : (
            <></>
          )}
          {isWalletConnected && allowance ? (
            <button
              className={classNames(
                styles.btn,
                styles.btnConnect,
                styles.btnBtn
              )}
              onClick={handleClick}
              disabled={
                !tokenA.tokenIsSet ||
                !tokenB.tokenIsSet ||
                !swapAmount ||
                hasBalancerOrTransactionError ||
                spotPriceLoading ||
                parseFloat(allowance) <= swapAmount
                  ? true
                  : false
              }
            >
              {!tokenA.tokenIsSet || !tokenB.tokenIsSet ? (
                "Select a Token"
              ) : !swapAmount ? (
                "Enter an Amount"
              ) : spotPriceLoading ? (
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
            <button className={classNames(styles.btn, styles.btnConnect)}>
              <CircularProgress sx={{ color: "white" }} />
            </button>
          )}
        </Box>
      </form>
    </>
  );
};

export default Swap;
