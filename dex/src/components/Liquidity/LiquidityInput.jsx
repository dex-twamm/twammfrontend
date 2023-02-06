import React from "react";
import iStyles from "../../css/Input.module.css";
import maticLogo from "../../images/maticIcon.png";

const LiquidityInput = () => {
  return (
    <div className={iStyles.textInput}>
      <div className={iStyles.inputSelectContainer}>
        <input
          className={iStyles.textField}
          min={0}
          placeholder="0.0"
          // value={input}
          // onChange={onChange}
        />
        <div>
          <span className={iStyles.spnCurrency}>
            <div className={iStyles.currency}>
              <img
                className={iStyles.tokenImage}
                src={maticLogo}
                alt="tokenImage"
              />

              <p className={iStyles.tokenContainer}>hello</p>
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
        <p className={iStyles.balanceText}>0.0</p>
      </div>
    </div>
  );
};

export default LiquidityInput;
