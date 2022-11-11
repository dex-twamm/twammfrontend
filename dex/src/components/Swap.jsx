import { useEffect } from "react";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Alert,
  Box,
  Slider,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import classNames from "classnames";
import React, { useContext, useState } from "react";
import lsStyles from "../css/LongSwap.module.css";
import style from "../css/Swap.module.css";
import styles from "../css/AddLiquidity.module.css";

import {
  calculateNumBlockIntervals,
  valueLabel,
} from "../methods/longSwapMethod";
import { LongSwapContext } from "../providers";
import { ShortSwapContext } from "../providers/context/ShortSwapProvider";
import PopupModal from "./alerts/PopupModal";
import Input from "./Input";
import { FiChevronDown } from "react-icons/fi";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { BigNumber } from "ethers";
import { bigToStr } from "../utils";
import { getApproval } from "../utils/getApproval";
import { WebContext } from "../providers/context/WebProvider";

const Swap = (props) => {
  const {
    connectWallet,
    buttonText,
    swapType,
    spotPriceLoading,
    setIsPlacedLongTermOrder,
  } = props;

  const [display, setDisplay] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [value, setValue] = useState(0.0);
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [executionTime, setExecutionTIme] = useState("");
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
    currentBlock,
    setSpotPrice,
    spotPrice,
    srcAddress,
    setTransactionHash,
    transactionHash,
    isWalletConnected,
  } = useContext(ShortSwapContext);

  const {
    tokenA,
    tokenB,
    setTokenA,
    setTokenB,
    setTargetDate,
    targetDate,
    setNumberOfBlockIntervals,
    allowance,
  } = useContext(LongSwapContext);

  const { provider } = useContext(WebContext);

  // console.log("Provider", provider);
  // console.log("SC", srcAddress);
  // console.log("Form Errors", formErrors);
  console.log("SwapAmount", swapAmount, allowance, srcAddress);
  const handleDisplay = (event) => {
    console.log("Current Target Id", event.currentTarget.id);
    setSelectToken(event.currentTarget.id);
    setDisplay(!display);
    setSpotPrice(0);
    setExpectedSwapOut(0.0);
  };

  useEffect(() => {
    return () => {
      setExpectedSwapOut(undefined);
    };
  }, [setExpectedSwapOut]);

  useEffect(() => {
    if (tokenA.symbol === tokenB.symbol)
      setTokenB({
        symbol: "Select Token",
        image: "",
        balance: "",
        tokenIsSet: false,
      });
  }, [tokenA, tokenB, setTokenB]);

  // const [tokenA, setTokenA] = useState({
  //   symbol: "Faucet",
  //   image: "/ethereum.png",
  //   address: FAUCET_TOKEN_ADDRESS,
  // });

  // const [tokenB, setTokenB] = useState({
  //   symbol: "Matic",
  //   image:
  //     "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
  //   address: MATIC_TOKEN_ADDRESS,
  // });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
  };

  const handleClick = () => {
    buttonText === "Swap" && setFormErrors(validate(swapAmount));
    connectWallet();
  };

  const handleApproveButton = async () => {
    try {
      const approval = await getApproval(provider, srcAddress);
      console.log("Approval---->", approval);
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

  console.log("Allowance Swap-->", allowance, swapAmount);

  useEffect(() => {
    typeof formErrors.balError === "undefined" ||
    formErrors.balError === null ||
    formErrors.balError === "Try Giving Lesser Amount"
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
    };
  }, [setFormErrors]);

  console.log("Disable Allow Button--->", disableAllowBtn, formErrors);

  console.log(
    "allowance <= swapAmount--->",
    parseFloat(allowance),
    "<=",
    typeof swapAmount,
    allowance <= swapAmount,
    tokenA.tokenIsSet,
    tokenB.tokenIsSet
  );

  useEffect(() => {
    return () => {
      setTargetDate("");
      setExecutionTIme("");
      setTransactionHash(undefined);
      setIsPlacedLongTermOrder && setIsPlacedLongTermOrder(false);
    };
  }, []);

  console.log("Spot price loading", spotPriceLoading);

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
          {swapType === "long" && (
            <>
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
                        // setShowModal(true);
                        setDisplay(true);
                        setSelectToken("1");
                      }}
                      className={styles.select}
                    >
                      <div className={styles.currencyWrap}>
                        <img
                          className={styles.cryptoImage}
                          src={tokenA.image}
                          alt="Ethereum"
                        />
                        <p className={styles.tokenSymbol}>{tokenA.symbol}</p>
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
                        {tokenB.image !== "" && (
                          <img
                            className={styles.cryptoImage}
                            src={tokenB.image}
                            alt="Ethereum"
                          />
                        )}
                        <p className={styles.tokenSymbol}>
                          <span
                            style={{
                              paddingLeft: `${
                                tokenB.tokenIsSet ? "0px" : "10px"
                              }`,
                            }}
                          >
                            {tokenB.symbol}
                          </span>
                        </p>
                      </div>
                      <FiChevronDown className={styles.dropDownIcon} />
                    </div>
                  </div>
                </div>
              </Box>
            </>
          )}
          <Input
            id={1}
            input={swapAmount ? swapAmount : ""}
            placeholder="0.0"
            onChange={(e) => {
              setSwapAmount(e.target.value);
            }}
            imgSrc={tokenA.image}
            symbol={tokenA.symbol}
            handleDisplay={handleDisplay}
            selectToken={selectToken}
            display={display}
            setDisplay={setDisplay}
            setTokenA={setTokenA}
            setTokenB={setTokenB}
            swapType={swapType}
          />
          {/* 
          {formErrors.swapAmount && (
            <div className={styles.errorAlert}>
              <Alert
                severity="error"
                sx={{ borderRadius: "16px" }}
                onClose={() => setFormErrors({})}
              >
                {formErrors.swapAmount}
              </Alert>
            </div>
          )} */}
          {swapType !== "long" && (
            <>
              <FontAwesomeIcon
                style={{ zIndex: "1", cursor: "pointer" }}
                className={style.iconDown}
                icon={faArrowDown}
              />
              <Input
                id={2}
                input={
                  expectedSwapOut
                    ? bigToStr(BigNumber.from(expectedSwapOut), 18)
                    : ""
                }
                placeholder=""
                imgSrc={tokenB.image}
                symbol={tokenB.symbol}
                onChange={(e) => e.target.value}
                handleDisplay={handleDisplay}
                selectToken={selectToken}
                display={display}
                setDisplay={setDisplay}
                setTokenA={setTokenA}
                setTokenB={setTokenB}
              />
            </>
          )}
          {formErrors.balError && (
            <div className={styles.errorAlert}>
              <Alert severity="error" sx={{ borderRadius: "16px" }}>
                {formErrors.balError}
              </Alert>
            </div>
          )}

          {swapType === "long" && (
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
                    {`${targetDate} `}
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
                    Order Completetion Date
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
          )}

          {/* swapAmount !== 0 && tokenB.tokenIsSet &&  */}
          {swapAmount !== 0 && tokenB.tokenIsSet && swapType !== "long" && (
            <>
              <Box
                sx={{
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: { xs: "0px 4px", sm: "4px 8px" },
                }}
                className={open && styles.swapunit}

                // onClick={handleClose}
              >
                <Box
                  sx={{
                    display: "flex",
                    // flexDirection:{xs:'column',sm:'row'},
                    alignItems: {
                      xs: "flex-start ",
                      sm: "center",
                      md: "center",
                    },
                    // justifyContent:{xs:'center',sm:'space-between'},
                    // width:'fit-content',
                    width: { xs: "70%", sm: "fit-content", md: "fit-content" },

                    boxSizing: "border-box",
                    fontFamily: "Open Sans",
                    gap: { xs: "2px", sm: "4px" },
                  }}
                >
                  <InfoOutlinedIcon
                    sx={{
                      color: "#808080",
                      cursor: "pointer",
                      fontSize: "20px",
                      display: { xs: "none", sm: "block" },
                    }}
                  />
                  <p
                    style={{
                      cursor: "pointer",
                      boxSizing: "border-box",
                      padding: { xs: "0px", sm: "8px 0px" },
                      color: "black",
                      fontFamily: "Open Sans",
                      fontSize: "16px",
                      fontWeight: 500,
                      display: "flex",
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
                    {/* <span style={{ color: "#333333", opacity: 0.7 }}>
                      {" "}
                      ($123)
                    </span> */}
                  </p>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    boxSizing: "border-box",
                    color: "#333333",
                    fontFamily: "Open Sans",
                    gap: { xs: "0px", sm: "5px" },
                    padding: "4px",
                  }}
                >
                  {/* <span
                    style={{
                      color: "#333333",
                      opacity: 0.7,
                      background: "#f7f8fa",
                      borderRadius: "10px",
                      padding: "4px 6px",
                    }}
                  >
                    $1.23
                  </span> */}

                  {/* {open ? (
                    <KeyboardArrowUpOutlinedIcon
                      sx={{
                        fontSize: "24px",
                        color: "#333333",
                        cursor: "pointer",
                      }}
                      onClick={handleClose}
                    />
                  ) : (
                    <FiChevronDown
                      fontSize={"24px"}
                      style={{ color: "#333333", cursor: "pointer" }}
                      onClick={handleClose}
                    />
                  )} */}
                  {/* {spotPriceLoading && <CircularProgress size={15} />} */}
                </Box>
              </Box>

              {/* <LongTermSwapCardDropdown open={open} handleClose={handleClose} tokenB={tokenB}/> */}
            </>
          )}

          {parseFloat(allowance) <= swapAmount &&
          swapAmount &&
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
              disabled={
                disableAllowBtn || (swapType === "long" && executionTime === "")
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
                (swapType === "long" && executionTime === "") ||
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

export default Swap;
