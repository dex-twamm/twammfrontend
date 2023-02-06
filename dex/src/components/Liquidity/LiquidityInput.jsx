import { Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import iStyles from "../../css/Input.module.css";

const LiquidityInput = ({ tokenData, balances }) => {
  const [input, setInput] = useState();
  const [balance, setBalance] = useState();

  useEffect(() => {
    const tokenBalance = balances?.filter((item) => {
      return item[tokenData?.address];
    });
    setBalance(tokenBalance?.[0]?.[tokenData?.address]);
  }, [balances]);

  console.log("balance", balance);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className={iStyles.textInput}>
      <div className={iStyles.inputSelectContainer}>
        <input
          className={iStyles.textField}
          min={0}
          placeholder="0.0"
          value={input ? input : ""}
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
      <div className={iStyles.balance}>
        Balance:
        {balance ? (
          <p className={iStyles.balanceText}>
            {parseFloat(balance).toFixed(2)}
          </p>
        ) : (
          <Skeleton width={60} />
        )}
      </div>
    </div>
  );
};

export default LiquidityInput;
