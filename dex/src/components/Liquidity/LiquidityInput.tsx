import { Skeleton } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import iStyles from "../../css/Input.module.css";
import { useLongSwapContext } from "../../providers/context/LongSwapProvider";
import { SelectedNetworkType } from "../../providers/context/NetworkProvider";
import { useShortSwapContext } from "../../providers/context/ShortSwapProvider";
import { getInputLimit, validateSymbolKeyPressInInput } from "../../utils";
import { spotPrice } from "../../utils/getSpotPrice";
import { TokenType } from "../../utils/pool";

interface PropTypes {
  tokenData: TokenType;
  balances: { [key: string]: number }[] | undefined;
  tokenInputAmount: string;
  setTokenInputAmount: Dispatch<SetStateAction<string>>;
  calculateProportionalSuggestion: any;
  input: string;
  tokenA: TokenType;
  tokenB: TokenType;
  currentNetwork: SelectedNetworkType;
  hasProportional: boolean;
  setHasBalancerOrTransactionError: Dispatch<SetStateAction<boolean>>;
}

const LiquidityInput = ({
  tokenData,
  balances,
  tokenInputAmount,
  setTokenInputAmount,
  calculateProportionalSuggestion,
  input,
  tokenA,
  tokenB,
  currentNetwork,
  hasProportional,
  setHasBalancerOrTransactionError,
}: PropTypes) => {
  const [balance, setBalance] = useState(0);
  const [balancerErrors, setBalancerErrors] = useState<{
    balError: string | undefined;
  }>({ balError: undefined });

  const {
    account,
    web3provider,
    isWalletConnected,
    setSpotPriceLoading,
    deadline,
    setTransactionHash,
    setSpotPrice,
    setExpectedSwapOut,
  } = useShortSwapContext();
  const { allowance } = useLongSwapContext();

  useEffect(() => {
    const tokenBalance = balances?.filter((item) => {
      return item[tokenData?.address];
    });

    if (tokenBalance) setBalance(tokenBalance?.[0]?.[tokenData?.address]);
  }, [balances, tokenData?.address]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenInputAmount(getInputLimit(e.target.value));
  };

  useEffect(() => {
    let interval1: ReturnType<typeof setTimeout>;
    let interval2: ReturnType<typeof setTimeout>;
    // Do not fetch prices if not enough allowance.
    const inputAmount = parseFloat(tokenInputAmount);
    if (parseFloat(allowance) > inputAmount) {
      // Wait for 0.5 second before fetching price.
      interval1 = setTimeout(() => {
        spotPrice(
          inputAmount,
          setSpotPriceLoading,
          tokenA?.address,
          tokenB?.address,
          web3provider,
          account,
          deadline,
          setBalancerErrors,
          setSpotPrice,
          setExpectedSwapOut,
          currentNetwork
        );
      }, 500);
      // Update price every 12 seconds.
      interval2 = setTimeout(() => {
        spotPrice(
          inputAmount,
          setSpotPriceLoading,
          tokenA?.address,
          tokenB?.address,
          web3provider,
          account,
          deadline,
          setBalancerErrors,
          setSpotPrice,
          setExpectedSwapOut,
          currentNetwork
        );
      }, 12000);
    }
    return () => {
      clearTimeout(interval1);
      clearTimeout(interval2);
      setExpectedSwapOut(0);
      setSpotPrice(0);
      setBalancerErrors({ balError: undefined });
    };
  }, [tokenInputAmount, tokenA, tokenB, allowance]);

  useEffect(() => {
    balancerErrors?.balError !== undefined
      ? setHasBalancerOrTransactionError(true)
      : setHasBalancerOrTransactionError(false);
  }, [balancerErrors]);

  useEffect(() => {
    return () => {
      setBalancerErrors({ balError: undefined });
      setTransactionHash("");
    };
  }, [setTransactionHash]);

  return (
    <div className={iStyles.textInput}>
      <div className={iStyles.inputSelectContainer}>
        <input
          className={iStyles.textField}
          type="number"
          min={0}
          placeholder="0.0"
          value={input ?? ""}
          onChange={handleInputChange}
          onKeyDown={(e) => validateSymbolKeyPressInInput(e)}
        />
        <div>
          <span className={iStyles.spnCurrency}>
            <div className={iStyles.currency}>
              <img
                className={iStyles.tokenImage}
                src={tokenData?.logo}
                alt="tokenImage"
              />

              <p className={iStyles.tokenContainer}>{tokenData?.symbol}</p>
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
              ></svg>
            </div>
          </span>
        </div>
      </div>
      <div
        className={
          hasProportional || balancerErrors?.balError
            ? iStyles.liqBalance
            : iStyles.balance
        }
      >
        {hasProportional && (
          <span
            className={iStyles.maxInput}
            onClick={calculateProportionalSuggestion}
          >
            proportional suggestion
          </span>
        )}
        {balancerErrors?.balError && (
          <span className={iStyles.errorText}>{balancerErrors?.balError}</span>
        )}
        {!isWalletConnected ? (
          "Balance: N/A"
        ) : balance ? (
          <p className={iStyles.balanceText}>
            Balance: {balance.toFixed(2)}{" "}
            <span
              className={iStyles.maxInput}
              onClick={() => {
                setTokenInputAmount(balance.toFixed(2));
              }}
            >
              Max
            </span>
          </p>
        ) : (
          <Skeleton width={60} />
        )}
      </div>
    </div>
  );
};

export default LiquidityInput;
