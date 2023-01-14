import { Skeleton } from "@mui/material";
import classnames from "classnames";
import { useContext, useEffect } from "react";
import styles from "../css/Input.module.css";
import { LongSwapContext, ShortSwapContext, UIContext } from "../providers";
import Modal from "./Modal";

const Input = (props) => {
  const {
    id,
    onChange,
    input,
    imgSrc,
    symbol,
    handleDisplay,
    display,
    setDisplay,
    setTokenA,
    setTokenB,
    placeholder,
  } = props;
  const {
    tokenBalances,
    selectToken,
    setEthBalance,
    isWalletConnected,
    setSwapAmount,
  } = useContext(ShortSwapContext);
  const { tokenA, tokenB } = useContext(LongSwapContext);

  const { setSelectedNetwork } = useContext(UIContext);

  useEffect(() => {
    const balanceA =
      tokenBalances && tokenBalances?.filter((item) => item[tokenA?.address]);
    const balanceB =
      tokenBalances && tokenBalances?.filter((item) => item[tokenB?.address]);

    setTokenA({
      ...tokenA,
      balance: balanceA?.[0]?.[tokenA?.address],
    });
    setTokenB({
      ...tokenB,
      balance: balanceB?.[0]?.[tokenB?.address],
    });
    // TODO: Rename this to TokenInBalance.
    setEthBalance(balanceA?.[0]?.[tokenA?.address]);

    return () => {
      setSwapAmount();
    };
  }, [setTokenA, setTokenB, tokenBalances, setSelectedNetwork]);

  return (
    <>
      <div className={styles.textInput}>
        <div className={styles.inputSelectContainer}>
          <input
            className={styles.textField}
            min={0}
            placeholder={placeholder}
            value={input}
            onChange={onChange}
          />
          {}
          <button
            className={classnames(styles.btn, styles.currencySelect)}
            onClick={handleDisplay}
            id={id}
          >
            <span className={styles.spnCurrency}>
              <div className={styles.currency}>
                {id === 2 && !tokenB?.logo ? (
                  <></>
                ) : (
                  <img
                    className={styles.tokenImage}
                    src={imgSrc}
                    alt="tokenImage"
                  />
                )}
                <p className={styles.tokenContainer}>{symbol}</p>
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
                  style={{ color: "#333333" }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </span>
          </button>
        </div>
        <div className={styles.balance}>
          Balance:
          {!isWalletConnected ? (
            "N/A"
          ) : tokenBalances ? (
            id === 1 ? (
              <p className={styles.balanceText}>
                {parseFloat(tokenA?.balance)?.toFixed(2)}{" "}
                <span
                  className={styles.maxInput}
                  onClick={() => {
                    setSwapAmount(parseFloat(tokenA?.balance)?.toFixed(2));
                  }}
                >
                  Max
                </span>
              </p>
            ) : (
              <p className={styles.balanceText}>
                {parseFloat(tokenB?.balance)?.toFixed(2)}
              </p>
            )
          ) : (
            <Skeleton width={60} />
          )}
        </div>
      </div>

      {display && (
        <Modal
          display={display}
          setDisplay={setDisplay}
          selectToken={selectToken}
          setTokenA={setTokenA}
          setTokenB={setTokenB}
          tokenBalances={tokenBalances}
        />
      )}
    </>
  );
};

export default Input;
