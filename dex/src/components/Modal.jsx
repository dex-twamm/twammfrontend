import React, { useState } from "react";
import { useContext } from "react";
import { ShortSwapContext } from "../providers";
import { FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS } from "../utils";
import styles from "../css/Modal.module.css";

const Modal = ({ display, setDisplay, setTokenA, setTokenB, tokenDetails }) => {
  // useContext To Retrieve The Source and Destination Address of The Token
  const { setSrcAddress, setDestAddress, selectToken, setEthBalance } =
    useContext(ShortSwapContext);

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
      setEthBalance(parseFloat(token.children[3].innerHTML).toFixed(2));
      setSrcAddress(token.children[2].innerHTML);
      setTokenA({
        symbol: token.children[1].innerHTML,
        image: token.children[0].src.slice(21, token.length),
        balance: token.children[3].innerHTML,
      });
    } else if (selectToken === "2") {
      setDestAddress(token.children[2].innerHTML);
      setTokenB({
        symbol: token.children[1].innerHTML,
        image: token.children[0].src.slice(21, token.length),
        balance: token.children[3].innerHTML,
      });
    }
    handleModalClose();
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
          style={{ width: "25px" }}
        />
        <p>{token.name}</p>
        <p className={styles.tokenAddress} style={{ display: "none" }}>
          {token.address}
        </p>
        <p className={styles.comingSoon}>
          {parseFloat(token.balance).toFixed(2)}
        </p>
        {token.type === "coming_soon" && (
          <div className={styles.comingSoon}>
            <span>coming soon...</span>
          </div>
        )}
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
