import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import LongTermOrderCard from "../components/LongTermOrderCard";
import PopupSettings from "../components/PopupSettings";
import lsStyles from "../css/LongSwap.module.css";
import styles from "../css/ShortSwap.module.css";
import { LongSwapContext, ShortSwapContext } from "../providers";
import Tabs from "../components/Tabs";
import PopupModal from "../components/alerts/PopupModal";
import { _placeLongTermOrders } from "../utils/placeLongTermOrder";
import { connectWallet } from "../utils/connetWallet";
import { connectWalletAndGetEthLogs } from "../utils/connetWallet";

import { UIContext } from "../providers/context/UIProvider";
import LongSwap from "../components/LongSwap";
import { verifyLongSwap } from "../utils/verifyLongSwap";

const LongSwapPage = () => {
  const {
    orderLogsDecoded,
    numberOfBlockIntervals,
    setOrderLogsDecoded,
    setLongSwapFormErrors,
    longSwapVerifyLoading,
    setLongSwapVerifyLoading,
    setMessage,
    tokenA,
    tokenB,
    allowance,
  } = useContext(LongSwapContext);

  const {
    isWalletConnected,
    web3provider,
    setweb3provider,
    setCurrentBlock,
    setBalance,
    setAccount,
    setWalletConnected,
    swapAmount,
    setSwapAmount,
    account,
    setTransactionHash,
    setLoading,
    setError,
  } = useContext(ShortSwapContext);

  const [showSettings, setShowSettings] = useState(false);

  const { selectedNetwork, setSelectedNetwork } = useContext(UIContext);

  const ethLogsCount = orderLogsDecoded
    ? Object.keys(orderLogsDecoded).length
    : 0;

  const cardListCount = ethLogsCount;

  useEffect(() => {
    let verifyLongSwapInterval;

    // Wait for 0.5 second before fetching price.

    verifyLongSwapInterval = setTimeout(() => {
      verifyLongSwap(
        swapAmount,
        setLongSwapVerifyLoading,
        tokenA?.address,
        tokenB?.address,
        web3provider,
        account,
        setLongSwapFormErrors,
        selectedNetwork?.network,
        numberOfBlockIntervals,
        allowance
      );
    }, 500);

    return () => {
      clearTimeout(verifyLongSwapInterval);
    };
  }, [swapAmount, tokenB, tokenA, numberOfBlockIntervals]);

  async function LongSwapButtonClick() {
    try {
      if (!isWalletConnected) {
        await connectWalletAndGetEthLogs(
          setweb3provider,
          setCurrentBlock,
          setBalance,
          setAccount,
          setWalletConnected,
          setSelectedNetwork,
          web3provider,
          account,
          selectedNetwork?.network
        );
      } else {
        console.log(web3provider, web3provider.getSigner());
        await _placeLongTermOrders(
          swapAmount,
          tokenA?.address,
          tokenB?.address,
          numberOfBlockIntervals,
          web3provider,
          account,
          setTransactionHash,
          setLoading,
          setMessage,
          setOrderLogsDecoded,
          setError,
          selectedNetwork?.network
        );
        setSwapAmount(0);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    document.body.onclick = () => {
      setShowSettings(false);
    };
  });

  return (
    <>
      <div className={styles.container}>
        <Tabs />
        <div className={styles.mainBody}>
          <div className={styles.swap}>
            <div className={styles.swapOptions}>
              <a className={styles.textLink} href="/">
                Long Term Swap
              </a>
              <FontAwesomeIcon
                className={styles.settingsIcon}
                icon={faGear}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }}
              />
            </div>

            {showSettings && <PopupSettings swapType="long" />}
          </div>
          <LongSwap
            handleLongSwapAction={LongSwapButtonClick}
            longSwapVerifyLoading={longSwapVerifyLoading}
          />
        </div>
        <PopupModal />

        <div className={lsStyles.ordersWrapper}>
          <h4 className={lsStyles.longTermText}>Your Long Term Orders</h4>
          <div className={styles.scroller}>
            <div
              className={classNames(
                lsStyles.longTermOrderCard,
                cardListCount > 2 && lsStyles.scrollable
              )}
            >
              <LongTermOrderCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LongSwapPage;
