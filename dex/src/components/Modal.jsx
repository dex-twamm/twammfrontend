import React, { useState } from "react";
import { useContext } from "react";
import { ShortSwapContext } from "../providers";
import { FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS } from "../utils";
import styles from "../css/Modal.module.css";

const Modal = ({ display, setDisplay, selectToken, setTokenA, setTokenB }) => {
  // useContext To Retrieve The Source and Destination Address of The Token
  const { setSrcAddress, setDestAddress } = useContext(ShortSwapContext);

  // Object For Token Details
  const tokenDetails = [
    {
      name: "Faucet",
      symbol: "ETH",
      image: "/ethereum.png",
      address: FAUCET_TOKEN_ADDRESS,
      balance: 0.52,
    },
    {
      name: "Matic",
      symbol: "DAI",
      image: "/dai.png",
      address: MATIC_TOKEN_ADDRESS,
      balance: 4.3,
    },
    {
      type: "coming_soon",
      name: "Test Token",
      symbol: "CST",
      image: "/dai.png",
      // address: MATIC_TOKEN_ADDRESS,
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
        <p style={{ display: "none" }}>{token.name}</p>
        <div className={styles.modalTokenSymbol}>
          <div>
            <p className={styles.tokenName}>{token.name}</p>
            <p className={styles.tokenSymbol}>{token.symbol}</p>
          </div>
          <p>{token.balance}</p>
        </div>
        {/* <p className={styles.tokenAddress}>{token.address}</p> */}

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
          {/* <div>
            <button className={styles.btnManageToken}>Manage Token List</button>
          </div> */}

          {/* coming soon */}
        </div>
      </div>
    )
  );
};

export default Modal;
