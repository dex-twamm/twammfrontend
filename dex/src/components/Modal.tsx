import { Skeleton } from "@mui/material";
import classNames from "classnames";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import styles from "../css/Modal.module.css";
import { UIContext } from "../providers";
import { getPoolTokens } from "../utils/poolUtils";

import { getAllowance } from "../utils/getApproval";
import {
  TokenState,
  useLongSwapContext,
} from "../providers/context/LongSwapProvider";
import { TokenType } from "../utils/pool";
import { useShortSwapContext } from "../providers/context/ShortSwapProvider";

interface PropTypes {
  display: boolean;
  setDisplay: Dispatch<SetStateAction<boolean>>;
  setTokenA: Dispatch<SetStateAction<TokenState>>;
  setTokenB: Dispatch<SetStateAction<TokenState>>;
  tokenBalances: any;
}

const Modal = ({
  display,
  setDisplay,
  setTokenA,
  setTokenB,
  tokenBalances,
}: PropTypes) => {
  // useContext To Retrieve The Source and Destination Address of The Token

  const {
    isWalletConnected,
    selectToken,
    setEthBalance,
    setFormErrors,
    swapAmount,
    account,
    web3provider,
  } = useShortSwapContext();

  const { tokenA, tokenB } = useLongSwapContext();

  const { selectedNetwork } = useContext(UIContext)!;

  const [tokenDetails, setTokenDetails] = useState<TokenType[] | undefined>();

  useEffect(() => {
    const tokenDetail = getPoolTokens(selectedNetwork);
    setTokenDetails(tokenDetail);
  }, [selectedNetwork]);

  // Handle Modal Close
  const handleModalClose = () => {
    setDisplay(!display);
  };

  // Handle Select Token Modal display
  const handleTokenSelection = (token: TokenType) => {
    const chosenToken: TokenType = tokenDetails?.find(
      (x) => x.symbol === token.symbol
    )!;
    let balances: { [address: string]: number }[] = tokenBalances.map(
      (obj: { [address: string]: number }) => ({
        address: Object.keys(obj)[0],
        balance: +Object.values(obj)[0].toFixed(2),
      })
    );

    const chosenTokenBalance = balances.find(
      (x) => x?.address.toString() === chosenToken?.address.toString()
    )?.balance;

    if (selectToken === "1") {
      //set tokenFrom
      setEthBalance(chosenTokenBalance!);
      if (chosenToken.symbol === tokenA.symbol) {
        return <></>;
      } else if (chosenToken.symbol === tokenB.symbol) {
        setTokenB({
          ...tokenA,
          tokenIsSet: true,
        });
      }
      setTokenA({
        ...chosenToken,
        balance: chosenTokenBalance!,
        tokenIsSet: true,
      });
    } else if (selectToken === "2") {
      if (chosenToken.symbol === tokenA.symbol) {
        return <></>;
      } else
        setTokenB({
          ...chosenToken,
          balance: chosenTokenBalance!,
          tokenIsSet: true,
        });
    }
    handleModalClose();
  };

  useEffect(() => {
    setFormErrors({ balError: undefined });
    if (swapAmount && swapAmount !== 0)
      getAllowance(
        web3provider?.getSigner(),
        account,
        tokenA?.address,
        selectedNetwork
      );
  }, [tokenA, setFormErrors]);

  let tokensList;
  let tokensDetail = tokenDetails;
  const getMarkup = (token: TokenType) => {
    const balance =
      tokenBalances &&
      tokenBalances?.filter(
        (item: { [address: string]: number }) => item[token.address]
      );

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

  return display ? (
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
  ) : (
    <></>
  );
};

export default Modal;
