import { useEffect } from "react";
import { Alert, Box, CircularProgress, Skeleton } from "@mui/material";
import classNames from "classnames";
import React, { useState } from "react";
import styles from "../css/AddLiquidity.module.css";
import lsStyles from "../css/LongSwap.module.css";
import { useShortSwapContext } from "../providers/context/ShortSwapProvider";
import Input from "./Input";
import { BigNumber } from "ethers";
import {
  bigToFloat,
  bigToStr,
  getInputLimit,
  getInversedValue,
  getProperFixedValue,
} from "../utils";
import { approveMaxAllowance, getAllowance } from "../utils/getApproval";
import { useNetworkContext } from "../providers/context/NetworkProvider";
import { useLongSwapContext } from "../providers/context/LongSwapProvider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import { getShortSwapPoolFee } from "../utils/poolUtils";

interface PropTypes {
  handleSwapAction: any;
  spotPriceLoading: boolean;
}

const Swap = (props: PropTypes) => {
  const { handleSwapAction, spotPriceLoading } = props;

  const [display, setDisplay] = useState<boolean>(false);
  const [hasBalancerOrTransactionError, setHasBalancerOrTransactionError] =
    useState<boolean>(true);

  const [tokenRateSwitch, setTokenRateSwitch] = useState(false);
  const [showPriceValues, setShowPriceValues] = useState(false);

  const {
    account,
    swapAmount,
    setSwapAmount,
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
    setAllowTwamErrorMessage,
    web3provider,
  } = useShortSwapContext();

  const { tokenA, tokenB, setTokenA, setTokenB, allowance, setAllowance } =
    useLongSwapContext();

  const { selectedNetwork } = useNetworkContext();

  const handleDisplay = (event: React.MouseEvent<HTMLElement>) => {
    setSelectToken(event.currentTarget.id);
    setDisplay(!display);
    setSpotPrice(0);
    setExpectedSwapOut(0);
  };

  useEffect(() => {
    return () => {
      setExpectedSwapOut(0);
      setSpotPrice(0);
    };
  }, []);

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

  const handleTokenRateSwitch = () => {
    setTokenRateSwitch((state) => !state);
  };

  const handleClick = () => {
    isWalletConnected && setFormErrors(validate(swapAmount.toString()));
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
        setAllowance(bigToStr(res, tokenA?.decimals).toString());
      });
    } catch (e) {
      console.log(e);
      setAllowTwamErrorMessage("Error!");
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
      setTransactionHash("");
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
      setSpotPrice(0);
      setExpectedSwapOut(0);
      setShowPriceValues(false);
    }
  }, [swapAmount, setFormErrors, setSpotPrice, setExpectedSwapOut]);

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={lsStyles.main} />
        <Box className={lsStyles.mainBox}>
          <Input
            id={1}
            input={swapAmount >= 0 ? swapAmount : undefined}
            placeholder="0.0"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSwapAmount(parseFloat(getInputLimit(e.target.value)));
            }}
            imgSrc={tokenA?.logo}
            symbol={tokenA?.symbol}
            handleDisplay={handleDisplay}
            display={display}
            setDisplay={setDisplay}
            setTokenA={setTokenA}
            setTokenB={setTokenB}
          />
          <Input
            id={2}
            input={
              expectedSwapOut
                ? bigToFloat(
                    BigNumber.from(expectedSwapOut.toString()),
                    tokenB.decimals
                  )
                : undefined
            }
            placeholder=""
            imgSrc={tokenB?.logo}
            symbol={tokenB?.symbol}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              e.target.value
            }
            handleDisplay={handleDisplay}
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
                  (tokenRateSwitch && styles.swapUnit, styles.spotPriceBox)
                }
              >
                {!formErrors.balError ? (
                  <Box className={styles.spotBox}>
                    <div className={styles.spotContentBox}>
                      {spotPriceLoading ? (
                        <p className={lsStyles.spotPrice}>
                          <Skeleton width={"450px"} />
                        </p>
                      ) : spotPrice === 0 || !spotPrice ? (
                        <p></p>
                      ) : (
                        <div className={lsStyles.spotPrice}>
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
                            <span>
                              Fees: {getShortSwapPoolFee(selectedNetwork)}
                            </span>
                            <ExpandMoreIcon
                              sx={{
                                cursor: "pointer",
                              }}
                              onClick={handlePriceDropdown}
                            />
                          </div>
                        </div>
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
                    `${bigToFloat(
                      BigNumber.from(expectedSwapOut.toString()),
                      tokenB.decimals
                    )}
                   ${tokenB.symbol}`
                  )}
                </p>
              </div>
              <div className={styles.priceValueItem}>
                <p>Fees included:</p>
                <p>
                  {" "}
                  {spotPriceLoading ? (
                    <Skeleton width={"100px"} />
                  ) : (
                    getShortSwapPoolFee(selectedNetwork)
                  )}
                </p>
              </div>
            </div>
          )}
          {swapAmount &&
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
                !tokenA?.tokenIsSet ||
                !tokenB?.tokenIsSet ||
                !swapAmount ||
                hasBalancerOrTransactionError ||
                spotPriceLoading ||
                parseFloat(allowance) < swapAmount
                  ? true
                  : false
              }
            >
              {!tokenA?.tokenIsSet || !tokenB?.tokenIsSet ? (
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
