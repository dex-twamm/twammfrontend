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
import { bigToStr } from "../utils";
import { approveMaxAllowance } from "../utils/getApproval";
import { UIContext } from "../providers/context/UIProvider";

const Swap = (props) => {
  const { handleSwapAction, spotPriceLoading } = props;

  const [display, setDisplay] = useState(false);

  const [open, setOpen] = useState(false);
  const [disableAllowBtn, setDisableAllowBtn] = useState(true);

  const handleClose = () => setOpen((state) => !state);

  const {
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
  } = useContext(ShortSwapContext);

  const { tokenA, tokenB, setTokenA, setTokenB, allowance } =
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

  const handleClick = () => {
    isWalletConnected && setFormErrors(validate(swapAmount));
    handleSwapAction();
  };

  const handleApproveButton = async () => {
    try {
      const approval = await approveMaxAllowance(
        web3provider,
        tokenA?.address,
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

  useEffect(() => {
    formErrors.balError !== undefined
      ? setDisableAllowBtn(true)
      : setDisableAllowBtn(false);
  }, [formErrors]);

  useEffect(() => {
    if (error === "Transaction Error" || error === "Transaction Cancelled") {
      setDisableAllowBtn(false);
    }
  }, [error, setDisableAllowBtn]);

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
                className={(open && styles.swapunit, styles.spotPriceBox)}
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
                        onClick={handleClose}
                      >
                        {" "}
                        {` 1 ${tokenA.symbol} = ${" "}`}
                        {"  "}
                        <label>
                          {" "}
                          {spotPriceLoading ? (
                            <Skeleton width={"100px"} />
                          ) : (
                            ` ${spotPrice?.toFixed(4)} ${tokenB.symbol}`
                          )}
                        </label>
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

          {parseFloat(allowance) <= swapAmount &&
          swapAmount &&
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
              disabled={disableAllowBtn}
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
                disableAllowBtn ||
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

export default Swap;
