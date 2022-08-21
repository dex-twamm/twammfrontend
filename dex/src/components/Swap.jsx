import React, { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import { useContext } from "react";
import { ShortSwapContext } from "../providers/context/ShortSwapProvider";
import Input from "./Input";
import styles from "../css/Swap.module.css";

const Swap = () => {
  // Handle Select Token Modal display
  const [display, setDisplay] = useState(false);
  const [selectToken, setSelectToken] = useState("0");
  // useContext To Get swapAmount From InputField
  const { inputValue, setInputValue, swapAmount, setSwapAmount } =
    useContext(ShortSwapContext);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };
  const handleDisplay = (event) => {
    console.log("Current Target Id", event.currentTarget.id);
    setSelectToken(event.currentTarget.id);
    display ? setDisplay(false) : setDisplay(true);
  };

  // Set Default Token A & Token B
  const [tokenA, setTokenA] = useState({
    symbol: "Faucet",
    image: "/ethereum.png",
    // address:"Token A Adress"
  });

  const [tokenB, setTokenB] = useState({
    symbol: "Matic",
    image:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    // address : "Token B Adress",
  });

  // Prevents Re-rendering the Form
  const handleSubmit = (e) => {
    e.preventDefault();
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
          input={inputValue}
          onChange={handleInputChange}
          imgSrc={tokenB.image}
          symbol={tokenB.symbol}
          handleDisplay={handleDisplay}
          selectToken={selectToken}
          display={display}
          setDisplay={setDisplay}
          setTokenA={setTokenA}
          setTokenB={setTokenB}
        />
      </form>
    </Fragment>
  );
};

export default Swap;
