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
import { UIContext } from "../providers/context/UIProvider";
import LongSwap from "../components/LongSwap";
import { verifyLongSwap } from "../utils/verifyLongSwap";

const LongSwapPage = (props) => {
  const {
    tokenSymbol,
    tokenImage,
    buttonText,
    cancelPool,
    withdrawPool,
    isPlacedLongTermOrder,
    setIsPlacedLongTermOrder,
  } = props;

  const [showSettings, setShowSettings] = useState(false);

  const {
    orderLogsDecoded,
    message,
    setMessage,
    numberOfBlockIntervals,
    setOrderLogsDecoded,
    setLongSwapFormErrors,
    longSwapVerifyLoading,
    setLongSwapVerifyLoading,
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
    srcAddress,
    destAddress,
    account,
    setTransactionHash,
    setLoading,
    setError,
  } = useContext(ShortSwapContext);

  const { selectedNetwork, setSelectedNetwork } = useContext(UIContext);

  const ethLogsCount = orderLogsDecoded
    ? Object.keys(orderLogsDecoded).length
    : 0;

  const cardListCount = ethLogsCount;

  console.log("Logs Count", ethLogsCount, cardListCount);

  console.log("Is long term order placed", isPlacedLongTermOrder);

  useEffect(() => {
    console.log(
      "Long Swap ----",
      selectedNetwork?.network,
      swapAmount,
      destAddress,
      srcAddress
    );
    let verifyLongSwapInterval;
    // Wait for 0.5 second before fetching price.
    if (parseFloat(allowance) > swapAmount) {
      verifyLongSwapInterval = setTimeout(() => {
        verifyLongSwap(
          swapAmount,
          setLongSwapVerifyLoading,
          srcAddress,
          destAddress,
          web3provider,
          account,
          setLongSwapFormErrors,
          selectedNetwork?.network,
          numberOfBlockIntervals
        );
      }, 500);
    }
    return () => {
      clearTimeout(verifyLongSwapInterval);
    };
  }, [swapAmount, destAddress, srcAddress, numberOfBlockIntervals]);

  async function LongSwapButtonClick() {
    console.log("Wallet", isWalletConnected);
    const performGetEthLogs = true;
    try {
      if (!isWalletConnected) {
        await connectWallet(
          setweb3provider,
          setCurrentBlock,
          setBalance,
          setAccount,
          setWalletConnected,
          setSelectedNetwork,
          web3provider,
          account,
          selectedNetwork?.network,
          performGetEthLogs
        );
      } else {
        console.log(web3provider, web3provider.getSigner());
        await _placeLongTermOrders(
          swapAmount,
          srcAddress,
          destAddress,
          numberOfBlockIntervals,
          web3provider,
          account,
          setTransactionHash,
          setLoading,
          setIsPlacedLongTermOrder,
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

  // useEffect(() => {
  //   if (swapAmount && swapAmount > tokenA.balance) {
  //     setFormErrors({ balError: "Invalid AMt" });
  //   }
  //   return () => {
  //     setFormErrors("");
  //   };
  // }, [swapAmount, tokenA, setFormErrors]);

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
                onClick={() => setShowSettings(!showSettings)}
              />
            </div>

            {showSettings && <PopupSettings swapType="long" />}
          </div>
          <LongSwap
            swapType="long"
            tokenSymbol={tokenSymbol}
            tokenImage={tokenImage}
            connectWallet={LongSwapButtonClick}
            buttonText={buttonText}
            longSwapVerifyLoading={longSwapVerifyLoading}
            setIsPlacedLongTermOrder={setIsPlacedLongTermOrder}
          />
        </div>
        <PopupModal
          isPlacedLongTermOrder={isPlacedLongTermOrder}
          setIsPlacedLongTermOrder={setIsPlacedLongTermOrder}
          message={message}
          setMessage={setMessage}
        ></PopupModal>

        <div className={lsStyles.ordersWrapper}>
          <h4 className={lsStyles.longTermText}>Your Long Term Orders</h4>
          <div className={styles.scroller}>
            <div
              className={classNames(
                lsStyles.longTermOrderCard,
                cardListCount > 2 && lsStyles.scrollable
              )}
            >
              <LongTermOrderCard
                cancelPool={cancelPool}
                withdrawPool={withdrawPool}
              ></LongTermOrderCard>

              {/* <div style={{ with: "100%", height:"auto" }}>
              <LongTermSwapCardDropdown tokenB={tokenB} />
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LongSwapPage;
