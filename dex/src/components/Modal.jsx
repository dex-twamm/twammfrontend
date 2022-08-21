import React, { useState } from "react";
import { useContext } from "react";
import { ShortSwapContext } from "../providers";
import { FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS } from "../utils";
import styles from "../css/Modal.module.css";

const Modal = ({ display, setDisplay, selectToken, setTokenA, setTokenB }) => {
  // useContext To Retrieve The Source and Destination Address of The Token
  const { setSrcAddress } = useContext(ShortSwapContext);
  const { setDestAddress } = useContext(ShortSwapContext);

  // Object For Token Details
  const tokenDetails = [
    {
      symbol: "Faucet",
      image: "/ethereum.png",
      address: MATIC_TOKEN_ADDRESS,
    },
    {
      symbol: "Matic",
      image: "/dai.png",
      address: FAUCET_TOKEN_ADDRESS,
    },
  ];

  // Handle Modal Close
  const handleModalClose = () => {
    setDisplay(!display);
  };

  // Handle Select Token Modal display
  const handleTokenSelection = (event) => {
    console.log("TokenSelected", selectToken);
    const token = event.currentTarget;
    console.log("Modal:Handle", token.children[2].innerHTML);
    if (selectToken === "1") {
      setSrcAddress(token.children[2].innerHTML);
      setTokenA({
        symbol: token.children[1].innerHTML,
        image: token.children[0].src.slice(21, token.length),
      });
    } else if (selectToken === "2") {
      setDestAddress(token.children[2].innerHTML);
      setTokenB({
        symbol: token.children[1].innerHTML,
        image: token.children[0].src.slice(21, token.length),
      });
    }
  };

  // Mapping The Token Details Objects
  const tokenList = tokenDetails.map((token) => {
    return (
      <div
        className={styles.modalToken}
        key={token.symbol}
        onClick={handleTokenSelection}
      >
        <img
          className={styles.modalTokenImg}
          alt="ETH logo"
          src={token.image}
          style={{ marginRight: "8px", width: "20px" }}
        />
        <div className={styles.modalTokenSymbol} onClick={handleModalClose}>
          {token.symbol}
        </div>
        <p style={{ display: "none" }}>{token.address}</p>
      </div>
    );
  });

  return (
    display && (
      <div className={styles.modalWrapper}>
        <div className={styles.container}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeading}>Select a token</div>
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
              className=""
              onClick={handleModalClose}
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <div className={styles.modalTokenList}>{tokenList}</div>
        </div>
      </div>
    )
  );
};

export default Modal;
