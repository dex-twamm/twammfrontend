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
import { bigToStr, getInversedValue, getProperFixedValue } from "../utils";
import { approveMaxAllowance, getAllowance } from "../utils/getApproval";

import { UIContext } from "../providers/context/UIProvider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import { getPoolFees } from "../utils/poolUtils";

const Swap = (props) => {
  const { handleSwapAction, spotPriceLoading } = props;

  const [display, setDisplay] = useState(false);
  const [hasBalancerOrTransactionError, setHasBalancerOrTransactionError] =
    useState(true);

  const [tokenRateSwitch, setTokenRateSwitch] = useState(false);
  const [showPriceValues, setShowPriceValues] = useState(false);

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

  const handlePriceDropdown = () => {
    setShowPriceValues((prev) => !prev);
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
      setExpectedSwapOut(0);
      setSpotPrice(0);
    };
  }, [
    setFormErrors,
    setTransactionHash,
    setExpectedSwapOut,
    setSpotPrice,
    tokenA,
    tokenB,
  ]);

  useEffect(() => {
    setShowPriceValues(false);
  }, [swapAmount]);

  useEffect(() => {
    if (!swapAmount) {
      setFormErrors({ balError: undefined });
      setSpotPrice();
      setExpectedSwapOut(0);
      setShowPriceValues(false);
    }
  }, [swapAmount, setFormErrors, setSpotPrice, setExpectedSwapOut]);

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
                className={
                  (tokenRateSwitch && styles.swapunit, styles.spotPriceBox)
                }
              >
                {!formErrors.balError ? (
                  <Box className={styles.spotBox}>
                    <div className={styles.spotContentBox}>
                      {spotPriceLoading ? (
                        <p
                          className={lsStyles.spotPrice}
                          style={{
                            padding: { xs: "0px", sm: "8px 0px" },
                          }}
                        >
                          <Skeleton width={"450px"} />
                        </p>
                      ) : spotPrice === 0 || !spotPrice ? (
                        <p></p>
                      ) : (
                        <p
                          className={lsStyles.spotPrice}
                          style={{
                            padding: { xs: "0px", sm: "8px 0px" },
                          }}
                        >
                          <span className={styles.spotValue}>
                            {!tokenRateSwitch && (
                              <>
                                {` 1 ${tokenA.symbol} = ${"  "}`}
                                <label
                                  style={{
                                    marginLeft: "4px",
                                  }}
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
                                  style={{
                                    marginLeft: "4px",
                                  }}
                                >
                                  {spotPriceLoading ? (
                                    <Skeleton width={"100px"} />
                                  ) : (
                                    ` ${getInversedValue(spotPrice)} ${
                                      tokenA.symbol
                                    }`
                                  )}
                                </label>
                              </>
                            )}
                            <ChangeCircleOutlinedIcon
                              onClick={handleTokenRateSwitch}
                              sx={{
                                marginLeft: { xs: "3px", sm: "10px" },
                                cursor: "pointer",
                              }}
                            />
                          </span>
                          <div className={styles.priceDropdown}>
                            <span>Fees: {getPoolFees(selectedNetwork)}</span>
                            <ExpandMoreIcon
                              sx={{
                                cursor: "pointer",
                              }}
                              onClick={handlePriceDropdown}
                            />
                          </div>
                        </p>
                      )}
                    </div>
                  </Box>
                ) : null}
              </Box>
            </>
          )}
          {showPriceValues && !formErrors.balError && (
            <div className={styles.priceValueBox}>
              <div className={styles.priceValueItem}>
                <p>Expected Outcome:</p>
                <p>
                  {spotPriceLoading ? (
                    <Skeleton width={"100px"} />
                  ) : (
                    `${bigToStr(
                      BigNumber.from(expectedSwapOut),
                      tokenB.decimals
                    )} ${tokenB.symbol}`
                  )}
                </p>
              </div>
              <div className={styles.priceValueItem}>
                <p>Fees:</p>
                <p>
                  {" "}
                  {spotPriceLoading ? (
                    <Skeleton width={"100px"} />
                  ) : (
                    getPoolFees(selectedNetwork)
                  )}
                </p>
              </div>
            </div>
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
