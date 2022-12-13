import { faArrowLeft, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "../../css/AddLiquidity.module.css";
import { LongSwapContext, ShortSwapContext } from "../../providers";
import { UIContext } from "../../providers/context/UIProvider";
import { getPoolTokens } from "../../utils/poolUtils";
import { _joinPool } from "../../utils/_joinPool";
import Input from "../Input";
import Modal from "../Modal";

const AddLiquidity = (props) => {
  const { showAddLiquidity } = props;
  const [display, setDisplay] = useState(false);
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
    account,
    setweb3provider,
    setCurrentBlock,
    setBalance,
    setAccount,
    setWalletConnected,
    isWalletConnected,
  } = useContext(ShortSwapContext);
  const { selectedNetwork, setSelectedNetwork } = useContext(UIContext);

  useEffect(() => {
    if (tokenA.symbol === tokenB.symbol)
      setTokenB({
        symbol: "Select Token",
        logo: "",
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

  const tokenDetails = getPoolTokens(selectedNetwork?.network);

  console.log("Prabin", tokenA, tokenB);

  const handleDisplay = (event) => {
    console.log("Current Target Id", event.currentTarget.id);
    setSelectToken(event.currentTarget.id);
    setDisplay(!display);
  };

  const handleJoinPool = () => {
    _joinPool(
      account,
      setweb3provider,
      setCurrentBlock,
      setBalance,
      setAccount,
      setWalletConnected,
      isWalletConnected,
      selectedNetwork?.network,
      setSelectedNetwork
    );
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
                    src={tokenA.logo}
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
                  {tokenB.logo !== "" && (
                    <img
                      className={styles.cryptoImage}
                      src={tokenB.logo}
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
                imgSrc={tokenA.logo}
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
                imgSrc={tokenB.logo}
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
                onClick={handleJoinPool}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AddLiquidity };
