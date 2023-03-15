import { Skeleton } from "@mui/material";
import classnames from "classnames";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import styles from "../css/Input.module.css";
import { UIContext } from "../providers";
import {
  TokenState,
  useLongSwapContext,
} from "../providers/context/LongSwapProvider";
import { useShortSwapContext } from "../providers/context/ShortSwapProvider";
import Modal from "./Modal";

interface PropTypes {
  id: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  input: number | undefined;
  imgSrc?: string;
  symbol?: string;
  handleDisplay: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  display: boolean;
  setDisplay: Dispatch<SetStateAction<boolean>>;
  setTokenA: Dispatch<SetStateAction<TokenState>>;
  setTokenB: Dispatch<SetStateAction<TokenState>>;
  placeholder: string;
}

const Input = (props: PropTypes) => {
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

  const { tokenBalances, setEthBalance, isWalletConnected, setSwapAmount } =
    useShortSwapContext();
  const { tokenA, tokenB } = useLongSwapContext();

  const { setSelectedNetwork } = useContext(UIContext)!;

  useEffect(() => {
    if (tokenA) {
      const balanceA =
        tokenBalances && tokenBalances?.filter((item) => item[tokenA?.address]);
      setTokenA({
        ...tokenA,
        balance: balanceA?.[0]?.[tokenA?.address],
      });

      setEthBalance(balanceA?.[0]?.[tokenA?.address]);
    }
    if (tokenB) {
      const balanceB =
        tokenBalances && tokenBalances?.filter((item) => item[tokenB?.address]);

      setTokenB({
        ...tokenB,
        balance: balanceB?.[0]?.[tokenB?.address],
      });
    }
    // TODO: Rename this to TokenInBalance.
    return () => {
      setSwapAmount(0);
    };
  }, [setTokenA, setTokenB, tokenBalances, setSelectedNetwork]);

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    const keyPressed = event.key;
    if (
      keyPressed === "-" ||
      keyPressed === "+" ||
      keyPressed === "e" ||
      keyPressed === "E"
    ) {
      event.preventDefault();
    }
  }

  return (
    <>
      <div className={styles.textInput}>
        <div className={styles.inputSelectContainer}>
          <input
            className={styles.textField}
            type="number"
            min={0}
            placeholder={placeholder}
            value={input ?? ""}
            onChange={onChange}
            onKeyDown={handleKeyPress}
          />
          {}
          <button
            className={classnames(styles.btn, styles.currencySelect)}
            onClick={handleDisplay}
            id={id.toString()}
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
                {tokenA?.balance?.toFixed(2) ?? "N/A"}{" "}
                <span
                  className={styles.maxInput}
                  onClick={() => {
                    setSwapAmount(tokenA?.balance ?? 0);
                  }}
                >
                  Max
                </span>
              </p>
            ) : (
              <p className={styles.balanceText}>
                {tokenB?.balance?.toFixed(2) ?? "N/A"}
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
          setTokenA={setTokenA}
          setTokenB={setTokenB}
          tokenBalances={tokenBalances}
        />
      )}
    </>
  );
};

export default Input;
