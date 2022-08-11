import React, { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";

const Swap = (props) => {
  // Handle Select Token Modal display
  const [display, setDisplay] = useState(false);
  const [selectToken, setSelectToken] = useState(false);
  const handleDisplay = (event) => {
    console.log(event.currentTarget.className.includes("token"));
    setSelectToken(event.currentTarget.className.includes("token"));
    display ? setDisplay(false) : setDisplay(true);
  };

  // Set Default Token A & Token B
  const [tokenA, setTokenA] = useState({
    symbol: "ETH",
    image: "/ethereum.png",
  });

  const [tokenB, setTokenB] = useState({
    symbol: "DAI",
    image: "/dai.png",
  });

  // Handling Primary and Secondary Tokens
  const [primary, setPrimary] = useState("");
  const handlePrimary = (e) => {
    setPrimary(e.target.value);
  };
  const [secondary, setSecondary] = useState("");
  const handleSecondary = (e) => {
    setSecondary(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    props.onChange(primary);
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <div className="textInput">
          <input
            className="textField"
            type="text"
            placeholder="0.0"
            value={primary}
            onChange={handlePrimary}
          />
          <button className="btn currency-select" onClick={handleDisplay}>
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

          {!selectToken ? (
            <button className="btn token-select" onClick={handleDisplay}>
              <span className="spn-select-token">
                <div className="">
                  <span className="select-container">Select a token</span>
                </div>
                <svg
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sc-33m4yg-8 jsUfgJ"
                >
                  <path
                    d="M0.97168 1L6.20532 6L11.439 1"
                    stroke="#AEAEAE"
                  ></path>
                </svg>
              </span>
            </button>
          ) : (
            <button className="btn currency-select" onClick={handleDisplay}>
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
          )}
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
