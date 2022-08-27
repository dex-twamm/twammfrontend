import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { ShortSwapContext } from "../providers/context/ShortSwapProvider";
import Input from "./Input";
import styles from "../css/Swap.module.css";
import { FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS } from "../utils";
import classNames from "classnames";
import { Alert, Box, Slider, Typography } from "@mui/material";
import PopupModal from "./PopupModal";
import lsStyles from "../css/LongSwap.module.css";
import { valueLabel, calculateValue } from "../methods/longSwapMethod";

const Swap = (props) => {
  const { connectWallet, buttonText, swapType } = props;

  const [display, setDisplay] = useState(false);
  const [selectToken, setSelectToken] = useState("0");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [value, setValue] = useState(0);

  const { equivalentAmount, setEquivalentAmount, swapAmount, setSwapAmount } =
    useContext(ShortSwapContext);

  const handleDisplay = (event) => {
    console.log("Current Target Id", event.currentTarget.id);
    setSelectToken(event.currentTarget.id);
    display ? setDisplay(false) : setDisplay(true);
  };

  const [tokenA, setTokenA] = useState({
    symbol: "Faucet",
    image: "/ethereum.png",
    address: FAUCET_TOKEN_ADDRESS,
  });

  const [tokenB, setTokenB] = useState({
    symbol: "Matic",
    image:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    address: MATIC_TOKEN_ADDRESS,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(swapAmount));
    setIsSubmit(true);
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(swapAmount);
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    if (!values.swapAmount) {
      errors.swapAmount = "Swap Amount Is Required";
    }
    return errors;
  };

  const handleChange = (e, newValue) => {
    if (typeof newValue === "number") {
      setValue(newValue);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id={1}
        input={swapAmount !== "" ? swapAmount : ""}
        onChange={(e) => setSwapAmount(e.target.value)}
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
        input={equivalentAmount}
        onChange={(e) => setEquivalentAmount(e.target.value)}
        imgSrc={tokenB.image}
        symbol={tokenB.symbol}
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
              Time:
              {valueLabel(calculateValue(value))}
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
              scale={calculateValue}
              getAriaValueText={valueLabel}
              valueLabelFormat={valueLabel}
              onChange={handleChange}
              valueLabelDisplay="auto"
              aria-labelledby="non-linear-slider"
            />
          </Box>
        </div>
      )}

      <button
        className={classNames(styles.btn, styles.btnConnect)}
        onClick={connectWallet}
      >
        {buttonText}
      </button>

      <PopupModal></PopupModal>
    </form>
  );
};

export default Swap;
