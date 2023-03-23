import { Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import iStyles from "../../css/Input.module.css";
import { useLongSwapContext } from "../../providers/context/LongSwapProvider";
import { useShortSwapContext } from "../../providers/context/ShortSwapProvider";
import { spotPrice } from "../../utils/getSpotPrice";

const LiquidityInput = ({
  tokenData,
  balances,
  tokenInputAmount,
  setTokenInputAmount,
  input,
  tokenA,
  tokenB,
  currentNetwork,
  hasProportional,
  setHasBalancerOrTransactionError,
}) => {
  const [balance, setBalance] = useState();
  const [balancerErrors, setBalancerErrors] = useState();

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
    setBalance(tokenBalance?.[0]?.[tokenData?.address]);
  }, [balances]);

  const handleInputChange = (e) => {
    setTokenInputAmount(e.target.value);
  };

  useEffect(() => {
    let interval1, interval2;
    // Do not fetch prices if not enough allowance.
    if (parseFloat(allowance) > tokenInputAmount) {
      // Wait for 0.5 second before fetching price.
      interval1 = setTimeout(() => {
        spotPrice(
          tokenInputAmount,
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
          tokenInputAmount,
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
      setBalancerErrors();
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
      setTransactionHash(undefined);
    };
  }, [setTransactionHash]);

  return (
    <div className={iStyles.textInput}>
      <div className={iStyles.inputSelectContainer}>
        <input
          className={iStyles.textField}
          min={0}
          placeholder="0.0"
          value={input}
          onChange={handleInputChange}
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
          <span className={iStyles.maxInput}>proportional suggestion</span>
        )}
        {balancerErrors?.balError && (
          <span className={iStyles.errorText}>{balancerErrors?.balError}</span>
        )}
        {!isWalletConnected ? (
          "Balance: N/A"
        ) : balance ? (
          <p className={iStyles.balanceText}>
            Balance: {parseFloat(balance).toFixed(2)}{" "}
            <span
              className={iStyles.maxInput}
              onClick={() => {
                setTokenInputAmount(parseFloat(balance).toFixed(2));
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
