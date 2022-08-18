import React, { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import { useContext } from "react";
import { ShortSwapContext } from "../providers/context/ShortSwapProvider";
import TokenListFetching from "../Helpers/TokenListFetching";

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
        <div className="textInput">
          <input
            className="textField"
            type="text"
            placeholder="0.0"
            value={swapAmount}
            onChange={(e) => setSwapAmount(e.target.value)}
          />
          <button
            className="btn currency-select"
            onClick={handleDisplay}
            value={srcAddress}
            id="1"
            onChange={(e) => setSrcAddress(e.target.value)}
          >
            <span className="spn-currency">
              <div className="currency">
                <img
                  className="tokenImage"
                  src={tokenA.image}
                  style={{ marginRight: "0.5rem" }}
                  alt="token-image"
                />
                <span className="token-container">{tokenA.symbol}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sc-w04zhs-16 lfEMTx"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </span>
          </button>
        </div>
        <FontAwesomeIcon className="iconDown" icon={faArrowDown} />
        <div className="textOutput">
          <input
            className="textField"
            type="text"
            placeholder="0.0"
            value={secondary}
            onChange={handleSecondary}
          />

          <button
            className="btn currency-select"
            onClick={handleDisplay}
            value={destAddress}
            id="2"
            onChange={(e) => setDestAddress(e.target.value)}
          >
            <span className="spn-currency">
              <div className="currency">
                <img
                  className="tokenImage"
                  src={tokenB.image}
                  style={{ marginRight: "0.5rem" }}
                  alt="token-image"
                />
                <span className="token-container">{tokenB.symbol}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sc-w04zhs-16 lfEMTx"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </span>
          </button>
        </div>
      </form>
      {display ? (
        <Modal
          display={display}
          setDisplay={setDisplay}
          setTokenA={setTokenA}
          setTokenB={setTokenB}
          selectToken={selectToken}
        />
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default Swap;
