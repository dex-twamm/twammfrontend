import React, { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { ShortSwapContext } from "../providers/context/ShortSwapProvider";
import Input from "./Input";
import styles from "../css/Swap.module.css";
import { FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS } from "../utils";
import { useEffect } from "react";
import classNames from "classnames";
import { Alert, Backdrop } from "@mui/material";

const Swap = (props) => {
  const { connectWallet, buttonText } = props;

  const [display, setDisplay] = useState(false);
  const [selectToken, setSelectToken] = useState("0");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

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
  return (
    <Fragment>
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

        {formErrors.swapAmount && (
          <Backdrop open={formErrors.swapAmount}>
            <Alert severity="error" onClose={() => setFormErrors({})}>
              {formErrors.swapAmount}
            </Alert>
          </Backdrop>
        )}

        <button
          className={classNames(styles.btn, styles.btnConnect)}
          onClick={connectWallet}
        >
          {buttonText}
        </button>
      </form>
    </Fragment>
  );
};

export default Swap;
