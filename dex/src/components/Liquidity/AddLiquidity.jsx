import { faArrowLeft, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Tabs } from "@mui/material";
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "../../css/AddLiquidity.module.css";
import { LongSwapContext, ShortSwapContext } from "../../providers";
import { POOLS, POOL_ID } from "../../utils/pool";
import { DisconnectWalletOption } from "../DisconnectWalletOption";
import FeeTierOptions from "../FeeTierOptions";
import Input from "../Input";
import Modal from "../Modal";
import { LiquidityPools } from "./LiquidityPools";

const AddLiquidity = (props) => {
  const { connect, showAddLiquidity } = props;
  const [display, setDisplay] = useState(false);
  const [primaryToken, setPrimaryToken] = useState("");
  const [secondaryToken, setSecondaryToken] = useState();
  const [showSettings, setShowSettings] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [buttonText, setButtonText] = useState("Connect Wallet");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const { tokenA, tokenB, setTokenA, setTokenB } = useContext(LongSwapContext);

  const {
    selectToken,
    setSelectToken,
    swapAmount,
    setSwapAmount,
    tokenBalances,
  } = useContext(ShortSwapContext);

  const handleToggle = () => setDisplay(!display);

  useEffect(() => {
    if (tokenA.symbol === tokenB.symbol)
      setTokenB({
        symbol: "Select Token",
        image: "",
        balance: "",
        tokenIsSet: false,
      });
  }, [tokenA, tokenB, setTokenB]);

  useEffect(() => {
    console.log("Prabin Swap", typeof Number(swapAmount), swapAmount);
    if (tokenB.tokenIsSet && Number(swapAmount) !== 0) {
      setButtonText("Add Liquidity");
      setButtonDisabled(false);
    }
    if (tokenB.tokenIsSet && Number(swapAmount) === 0) {
      setButtonText("Enter a Value");
      setButtonDisabled(true);
    }
    if (!tokenB.tokenIsSet) {
      setButtonText("Select a Token");
      setButtonDisabled(true);
    }
  }, [tokenB, buttonText, setButtonText, swapAmount]);

  // const tokenDetails = [
  //   {
  //     name: "Faucet",
  //     symbol: "ETH",
  //     image: "/ethereum.png",
  //     address: "",
  //     balance: tokenBalances[0],
  //   },
  //   {
  //     name: "Matic",
  //     symbol: "DAI",
  //     image: "/Testv4.jpeg",
  //     address: "",
  //     balance: tokenBalances[1],
  //   },
  //   {
  //     type: "coming_soon",
  //     name: "Test Token",
  //     symbol: "CST",
  //     image: "/Testv4.jpeg",
  //   },
  // ];
  const tokenDetails = POOLS[POOL_ID]?.tokens;

  console.log("Prabin", tokenA, tokenB);

  const handleDisplay = (event) => {
    console.log("Current Target Id", event.currentTarget.id);
    setSelectToken(event.currentTarget.id);
    setDisplay(!display);
  };

  return (
    <div className={styles.container}>
      {showModal && (
        <Modal
          display={showModal}
          setDisplay={setShowModal}
          setTokenA={setTokenA}
          setTokenB={setTokenB}
          tokenDetails={tokenDetails}
        />
      )}
      <div className={styles.mainBody}>
        <div className={`unselectable ${styles.topBar}`}>
          <FontAwesomeIcon
            onClick={() => showAddLiquidity(false)}
            className={styles.icon}
            icon={faArrowLeft}
          />
          <p className={styles.topHeader}>Add Liquidity</p>
          <div className={styles.rightTopBar}>
            <div className={styles.currencyName}>ETH</div>
            <FontAwesomeIcon
              className={`${styles.icon} ${styles.settingsIcon}`}
              icon={faGear}
              onClick={() => setShowSettings(!showSettings)}
            />
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={`unselectable ${styles.selectPairContainer}`}>
            <p className={styles.mainHeader}>Select Pair</p>
            <div className={styles.pairContainer}>
              <div
                onClick={() => {
                  setShowModal(true);
                  setSelectToken("1");
                }}
                className={styles.select}
              >
                <div className={styles.currencyWrap}>
                  <img
                    className={styles.cryptoImage}
                    src={tokenA.image}
                    alt="Ethereum"
                  />
                  <p className={styles.tokenSymbol}>{tokenA.symbol}</p>
                </div>
                <FiChevronDown className={styles.dropDownIcon} />
              </div>

              <div
                onClick={() => {
                  setShowModal(true);
                  setSelectToken("2");
                }}
                className={styles.select}
              >
                <div className={styles.currencyWrap}>
                  {tokenB.image !== "" && (
                    <img
                      className={styles.cryptoImage}
                      src={tokenB.image}
                      alt="Ethereum"
                    />
                  )}
                  <p className={styles.tokenSymbol}>
                    <span
                      style={{
                        paddingLeft: `${tokenB.tokenIsSet ? "0px" : "10px"}`,
                      }}
                    >
                      {tokenB.symbol}
                    </span>
                  </p>
                </div>
                <FiChevronDown className={styles.dropDownIcon} />
              </div>
            </div>
          </div>

          <div className={`unselectable ${styles.FeeTierContainer}`}>
            <div className={styles.leftContent}>
              <p>0.3% fee tier</p>
              <div className={styles.feeSelect}>86% select</div>
            </div>

            <div className={styles.editButton}>Edit</div>
          </div>

          <div className={styles.depositAmountContainer}>
            <p className={`${styles.mainHeaderAmount} ${styles.mainHeader}`}>
              Deposit Amounts
            </p>
            <div className={styles.inputsWrap}>
              <Input
                id={1}
                input={swapAmount ? swapAmount : ""}
                onChange={(e) => {
                  setSwapAmount(e.target.value);
                }}
                imgSrc={tokenA.image}
                symbol={tokenA.symbol}
                handleDisplay={handleDisplay}
                selectToken={selectToken}
                display={display}
                setDisplay={setDisplay}
                setTokenA={setTokenA}
                setTokenB={setTokenB}
              />
              <Input
                id={2}
                imgSrc={tokenB.image}
                symbol={tokenB.symbol}
                handleDisplay={handleDisplay}
                selectToken={selectToken}
                display={display}
                setDisplay={setDisplay}
                setTokenA={setTokenA}
                setTokenB={setTokenB}
              />
              <button
                className={classNames(styles.btn, styles.btnConnect)}
                disabled={buttonDisabled}
                onClick={connect}
              >
                {/* {buttonText} */}
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    // <div className="add-liquidity">
    //   <div className="container-liquidity">
    //     <main className="liquidity">
    //       <div className="top-heading">
    //         <div className="heading-title" style={{ padding: "1rem 1rem 0px" }}>
    //           <a flex="1" className="arrow-back" href="/addLiquidity.html">
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               width="24"
    //               height="24"
    //               viewBox="0 0 24 24"
    //               fill="none"
    //               stroke="#565A69"
    //               strokeWidth="2"
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               className="sc-iwajx4-3 nbMDA"
    //             >
    //               <line x1="19" y1="12" x2="5" y2="12"></line>
    //               <polyline points="12 19 5 12 12 5"></polyline>
    //             </svg>
    //           </a>
    //           <div
    //             className="title"
    //             style={{ flex: "5 1 0%", margin: "auto", textAlign: "start" }}
    //           >
    //             Add Liquidity
    //           </div>
    //           <div className="switch-crypto" style={{ marginRight: "0.5rem" }}>
    //             <div
    //               className="crypto-items"
    //               style={{ width: "fit-content", minWidth: "fit-content" }}
    //             >
    //               <div className="crypto-status">
    //                 <button className="btn-wallet">ETH</button>
    //                 <button className="btn-wallet">ACH</button>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="settings-icon">
    //             <button id="open-settings" className="settings-button">
    //               <FontAwesomeIcon icon={faGear} />
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="pool-container">
    //         <div className="pool-body">
    //           <div className="select-pair">
    //             <div className="pair">
    //               <div className="pair-title">
    //                 <div className="title">Select Pair</div>
    //               </div>
    //               <div className="select-options">
    //                 <div id="tokena">
    //                   <div className="token">
    //                     <div
    //                       className="token-input"
    //                       style={{ padding: "0px", borderRadius: "8px" }}
    //                     >
    //                       <button className="token-input-select">
    //                         <span className="options">
    //                           <div className="currency-label">
    //                             <img
    //                               className="imgCurrency"
    //                               alt="ETH Logo"
    //                               src="/ethereum.png"
    //                               style={{ height: "20px", width: "20px" }}
    //                             />
    //                             <span className="currency-label">ETH</span>
    //                             <svg
    //                               width="12"
    //                               height="7"
    //                               viewBox="0 0 12 7"
    //                               fill="none"
    //                               xmlns="http://www.w3.org/2000/svg"
    //                               className="sc-33m4yg-8 kgnnlF"
    //                             >
    //                               <path
    //                                 d="M0.97168 1L6.20532 6L11.439 1"
    //                                 stroke="#AEAEAE"
    //                               ></path>
    //                             </svg>
    //                           </div>
    //                         </span>
    //                       </button>
    //                     </div>
    //                   </div>
    //                 </div>
    //                 <div style={{ width: "12px" }}></div>
    //                 <div id="tokena">
    //                   <div className="token">
    //                     <div
    //                       className="token-input"
    //                       style={{ padding: "0px", borderRadius: "8px" }}
    //                     >
    //                       <button className="token-input-select">
    //                         <span className="options">
    //                           <div className="currency-label">
    //                             <img
    //                               className="imgCurrency"
    //                               alt="ETH Logo"
    //                               src="/ethereum.png"
    //                               style={{ height: "20px", width: "20px" }}
    //                             />
    //                             <span className="currency-label">ETH</span>
    //                             <svg
    //                               width="12"
    //                               height="7"
    //                               viewBox="0 0 12 7"
    //                               fill="none"
    //                               xmlns="http://www.w3.org/2000/svg"
    //                               className="sc-33m4yg-8 kgnnlF"
    //                             >
    //                               <path
    //                                 d="M0.97168 1L6.20532 6L11.439 1"
    //                                 stroke="#AEAEAE"
    //                               ></path>
    //                             </svg>
    //                           </div>
    //                         </span>
    //                       </button>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //               <div className="fee-tier">
    //                 <div className="container-fee">
    //                   <div className="select-fee-tier">
    //                     <div className="options">
    //                       <div className="add-liquidity-fee">
    //                         <div className="title">0.3% fee tier</div>
    //                         <div
    //                           className="selected-fee-percentage subtitle"
    //                           style={{ width: "fit-content", marginTop: "8px" }}
    //                         >
    //                           <div className="percentage-container">
    //                             <div className="percentage-label">
    //                               86% Select
    //                             </div>
    //                           </div>
    //                         </div>
    //                       </div>
    //                       <button
    //                         width="auto"
    //                         className="hide-show"
    //                         onClick={handleToggle}
    //                         id="show/hide"
    //                       >
    //                         Edit
    //                       </button>
    //                     </div>
    //                   </div>
    //                   {display ? <FeeTierOptions /> : null}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="separator hz"></div>
    //         <div className="deposit-amounts">
    //           <div className="container-deposits">
    //             <div className="deposits title">Deposits Amounts</div>
    //             <div
    //               id="add-liquidity-input-tokena"
    //               className="add-token-input"
    //             >
    //               <div className="add-token-field">
    //                 <div className="inputField">
    //                   <input
    //                     className="sc-1x3stf0-0 chxufg sc-33m4yg-11 jLdqNm token-amount-input"
    //                     inputMode="decimal"
    //                     autoComplete="off"
    //                     autoCorrect="off"
    //                     type="text"
    //                     pattern="^[0-9]*[.,]?[0-9]*$"
    //                     placeholder="0.0"
    //                     minLength="1"
    //                     maxLength="79"
    //                     spellCheck="false"
    //                     value=""
    //                     onChange={(event) =>
    //                       setPrimaryToken(event.target.value)
    //                     }
    //                   />
    //                   <button className="btn add-token">
    //                     <span className="logo-label">
    //                       <img
    //                         className="imgCurrency"
    //                         alt="ETH Logo"
    //                         src="/ethereum.png"
    //                         style={{ height: "20px", width: "20px" }}
    //                       />
    //                       <span className="currency-label">ETH</span>
    //                     </span>
    //                   </button>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="separator hz"></div>
    //           <div id="add-liquidity-input-tokena" className="add-token-input">
    //             <div className="add-token-field">
    //               <div className="inputField">
    //                 <input
    //                   className="sc-1x3stf0-0 chxufg sc-33m4yg-11 jLdqNm token-amount-input"
    //                   inputMode="decimal"
    //                   autoComplete="off"
    //                   autoCorrect="off"
    //                   type="text"
    //                   pattern="^[0-9]*[.,]?[0-9]*$"
    //                   placeholder="0.0"
    //                   minLength="1"
    //                   maxLength="79"
    //                   spellCheck="false"
    //                   value=""
    //                   onChange={(event) =>
    //                     setSecondaryToken(event.target.value)
    //                   }
    //                 />
    //                 <button className="btn add-token">
    //                   <span className="logo-label">
    //                     <img
    //                       className="imgCurrency"
    //                       alt="ETH Logo"
    //                       src="/ethereum.png"
    //                       style={{ height: "20px", width: "20px" }}
    //                     />
    //                     <span className="currency-label">ETH</span>
    //                   </span>
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="separator hz">
    //           <button className="btn btn-connect">Connect Wallet</button>
    //         </div>
    //       </div>
    //     </main>
    //   </div>
    // </div>
  );
};

export { AddLiquidity };
