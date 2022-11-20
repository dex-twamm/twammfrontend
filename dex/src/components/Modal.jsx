import { Backdrop, Skeleton } from "@mui/material";
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import styles from "../css/Modal.module.css";
import { LongSwapContext, ShortSwapContext } from "../providers";

const Modal = ({
  display,
  setDisplay,
  setTokenA,
  setTokenB,
  tokenDetails,
  tokenBalances,
}) => {
  // useContext To Retrieve The Source and Destination Address of The Token
  const { setSrcAddress, setDestAddress, selectToken, setEthBalance } =
    useContext(ShortSwapContext);

  const { tokenA, tokenB } = useContext(LongSwapContext);

  // Handle Modal Close
  const handleModalClose = () => {
    setDisplay(!display);
  };

  // Handle Select Token Modal display
  const handleTokenSelection = (token) => {
    console.log("TokenSelected Prabin", selectToken);
    const chosenToken = tokenDetails.find(x => x.symbol === token.symbol);

    let balances = tokenBalances.map((obj) => ({
      address: Object.keys(obj)[0],
      balance: parseFloat(Object.values(obj)[0]).toFixed(2),
    }));

    const chosenTokenBalance = 
      (balances.find(x => x.address === chosenToken.address)).balance;
    if (selectToken === "1") { //set tokenFrom
      setEthBalance(chosenTokenBalance);
      setSrcAddress(chosenToken.address);
      if (chosenToken.symbol === tokenB.symbol) {
        setTokenB({
          symbol: tokenA.symbol,
          image: tokenA.image,
          balance: tokenA.balance,
          tokenIsSet: true,
        });
      }
      setTokenA({
        symbol: chosenToken.symbol,
        image: chosenToken.logo,
        balance: chosenTokenBalance,
        tokenIsSet: true,
      });
    } else if (selectToken === "2") { //setTokenTo
      setDestAddress(chosenToken.address);
      setTokenB({
        symbol: chosenToken.symbol,
        image: chosenToken.logo,
        balance: chosenTokenBalance,
        tokenIsSet: true,
      });
    }
    handleModalClose();
  };

  let tokensList;
  let tokensDetail = tokenDetails;
  const getMarkup = (token) => {
    const balance =
      tokenBalances && tokenBalances?.filter((item) => item[token.address]);


    return (
      <>
        <img
          className={styles.modalTokenImg}
          alt="ETH logo"
          src={token.logo}
          style={{ width: "25px" }}
        />
        <p>{token.name}</p>
        <p className={styles.tokenAddress} style={{ display: "none" }}>
          {token.address}
        </p>
        <p className={styles.comingSoon}>
          {balance ? (
            parseFloat(balance?.[0]?.[token?.address]).toFixed(2)
          ) : (
            <Skeleton width={100} />
          )}
          {/* {parseFloat(token.balance).toFixed(2)} */}
        </p>
        {token.type === "coming_soon" && (
          <div className={styles.comingSoon}>
            <span>coming soon...</span>
          </div>
        )}
      </>
    );
  };
  if (selectToken === "2") {
    // tokensDetail = tokenDetails.filter(
    //     token => token.name !== tokenA.symbol
    // );

    tokensList = tokensDetail.map((token) => {
      if (token.name === tokenA.symbol) {
        console.log("Here");
        return (
          <div
            className={classNames(styles.modalToken, styles.modalTokenDisabled)}
            key={token.symbol}
          >
            {getMarkup(token)}
          </div>
        );
      }
      return (
        <div
          className={styles.modalToken}
          key={token.symbol}
          onClick={() => handleTokenSelection(token)}
        >
          {getMarkup(token)}
        </div>
      );
    });
  } else {
    tokensList = tokensDetail.map((token) => {
      return (
        <div
          className={styles.modalToken}
          key={token.symbol}
          onClick={() => handleTokenSelection(token)}
        >
          {getMarkup(token)}
        </div>
      );
    });
  }

  return (
    display && (
      <div
        onClick={() => {
          setDisplay(false);
        }}
        className={styles.modalWrapper}
      >
        <div onClick={(e) => e.stopPropagation()} className={styles.container}>
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
          <div className={styles.modalTokenList}>{tokensList}</div>
        </div>
      </div>
    )
  );
};

export default Modal;
