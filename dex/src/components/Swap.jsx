import React, { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import { useContext } from "react";
import { ShortSwapContext } from "../providers/context/ShortSwapProvider";
import InputField from "./InputField";

const Swap = () => {
  // Handle Select Token Modal display
  const [display, setDisplay] = useState(false);
  const [selectToken, setSelectToken] = useState("0");
  // useContext To Get swapAmount From InputField
  const { swapAmount, setSwapAmount } = useContext(ShortSwapContext);
  const { srcAddress, setSrcAddress } = useContext(ShortSwapContext);
  const { destAddress, setDestAddress } = useContext(ShortSwapContext);

  const handleDisplay = (event) => {
    console.log(event.currentTarget.id);
    // console.log(tokenA.address);

    setSelectToken(event.currentTarget.id);
    setDestAddress(tokenB.address);
    setSrcAddress(tokenA.address);
    // console.log(tokenB.address);
    display ? setDisplay(false) : setDisplay(true);
  };
  // const CMC_TOKEN_LIST = TokenListFetching();
  // console.log(CMC_TOKEN_LIST);

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

  // Handling Primary and Secondary Tokens
  const [primary, setPrimary] = useState("");
  // const handlePrimary = (e) => {
  //   console.log(`Swap: e.target.value:`,e.target.value)
  //   setSwapAmount(e.target.value);
  // };
  const [secondary, setSecondary] = useState("");
  const handleSecondary = (e) => {
    setSecondary(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // props.onChange(swapAmount);
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <InputField id={1}/>
        <FontAwesomeIcon className="iconDown" icon={faArrowDown} />
        <InputField id={2}/>
      
      </form>
    </Fragment>
  );
};

export default Swap;
