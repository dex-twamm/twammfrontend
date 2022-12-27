import { Skeleton } from "@mui/material";
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import styles from "../css/Modal.module.css";
import { LongSwapContext, ShortSwapContext, UIContext } from "../providers";
import { getPoolTokens } from "../utils/poolUtils";

const Modal = ({
  display,
  setDisplay,
  setTokenA,
  setTokenB,
  tokenBalances,
}) => {
  // useContext To Retrieve The Source and Destination Address of The Token
  const { isWalletConnected, selectToken, setEthBalance } =
    useContext(ShortSwapContext);

  const { tokenA, tokenB } = useContext(LongSwapContext);
  const [tokenDetails, setTokenDetails] = useState();

  const { selectedNetwork } = useContext(UIContext);

  useEffect(() => {
    const tokenDetail = getPoolTokens(selectedNetwork?.network);
    setTokenDetails(tokenDetail);
  }, []);

  // Handle Modal Close
  const handleModalClose = () => {
    setDisplay(!display);
  };

  // Handle Select Token Modal display
  const handleTokenSelection = (token) => {
    const chosenToken = tokenDetails?.find((x) => x.symbol === token.symbol);

    let balances = tokenBalances.map((obj) => ({
      address: Object.keys(obj)[0],
      balance: parseFloat(Object.values(obj)[0]).toFixed(2),
    }));

    const chosenTokenBalance = balances.find(
      (x) => x.address === chosenToken.address
    ).balance;
    if (selectToken === "1") {
      //set tokenFrom
      setEthBalance(chosenTokenBalance);
      if (chosenToken.symbol === tokenB.symbol) {
        setTokenB({
          ...tokenA,
          tokenIsSet: true,
        });
      }
      setTokenA({
        ...chosenToken,
        balance: chosenTokenBalance,
        tokenIsSet: true,
      });
    } else if (selectToken === "2") {
      if (chosenToken.symbol === tokenA.symbol) {
        return <></>;
      } else
        setTokenB({
          ...chosenToken,
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
          {!isWalletConnected ? (
            "N/A"
          ) : balance ? (
            parseFloat(balance?.[0]?.[token?.address]).toFixed(2)
          ) : (
            <Skeleton width={100} />
          )}
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
    tokensList = tokensDetail?.map((token) => {
      if (token.name === tokenA.symbol) {
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
    tokensList = tokensDetail?.map((token) => {
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
