import { useEffect } from "react";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Box, Slider, Typography } from "@mui/material";
import classNames from "classnames";
import React, { useContext, useState } from "react";
import lsStyles from "../css/LongSwap.module.css";
import styles from "../css/Swap.module.css";
import { calculateValue, valueLabel } from "../methods/longSwapMethod";
import { LongSwapContext } from "../providers";
import { ShortSwapContext } from "../providers/context/ShortSwapProvider";
import PopupModal from "./alerts/PopupModal";
import Input from "./Input";

const Swap = (props) => {
  const { connectWallet, buttonText, swapType } = props;

  const [display, setDisplay] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [value, setValue] = useState(0.0);

  const {
    equivalentAmount,
    setEquivalentAmount,
    swapAmount,
    setSwapAmount,
    selectToken,
    setSelectToken,
    setLoading,
  } = useContext(ShortSwapContext);

  const {
    sliderValue,
    setSliderValue,
    sliderValueUnit,
    setSliderValueUnit,
    setSliderValueInSec,
    tokenA,
    tokenB,
    setTokenA,
    setTokenB,
    setSliderDate,
    sliderDate,
  } = useContext(LongSwapContext);

  const handleDisplay = (event) => {
    console.log("Current Target Id", event.currentTarget.id);
    setSelectToken(event.currentTarget.id);
    setDisplay(!display);
  };

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
      setSliderValueInSec(calculateValue(newValue));
      setSliderValue(valueLabel(calculateValue(newValue)).scaledValue);
      setSliderValueUnit(valueLabel(calculateValue(newValue)).sliderUnits);
      setSliderDate(valueLabel(calculateValue(newValue)).date);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          id={1}
          input={swapAmount ? swapAmount : ""}
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
        />

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
        )}
        <FontAwesomeIcon className={styles.iconDown} icon={faArrowDown} />
        <Input
          id={2}
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

        {swapType === "long" && (
          <div className={lsStyles.rangeSelect}>
            <Box sx={{ width: "90%", margin: "0 auto" }}>
              <Typography fontWeight={600} id="non-linear-slider" gutterBottom>
                <Box sx={{ width: "90%", flexDirection: "row" }}>
                  {" "}
                  Time: {`${sliderValue} ${sliderValueUnit}`}
                </Box>
                <Box sx={{}}>Date: {`${sliderDate} `}</Box>
              </Typography>
              <Slider
                value={value}
                min={1}
                step={2}
                max={100}
                sx={{
                  height: 15,
                  width: 1,
                  color: "#ffaac9",
                }}
                // scale={calculateValue}
                // getAriaValueText={valueLabel}
                // valueLabelFormat={valueLabel}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="non-linear-slider"
              />
            </Box>
          </div>
        )}

        <button
          className={classNames(styles.btn, styles.btnConnect)}
          onClick={handleClick}
          disabled={
            !tokenA.tokenIsSet || !tokenB.tokenIsSet || !swapAmount
              ? true
              : false
          }
        >
          {!tokenA.tokenIsSet || !tokenB.tokenIsSet
            ? "Select a Token"
            : !swapAmount
            ? "Enter an Amount"
            : buttonText}
        </button>
      </form>
      <PopupModal></PopupModal>
    </>
  );
};

export default Swap;
