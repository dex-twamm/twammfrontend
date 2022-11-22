import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useContext, useState } from "react";
import LongTermOrderCard from "../components/LongTermOrderCard";
import PopupSettings from "../components/PopupSettings";
import Swap from "../components/Swap";
import lsStyles from "../css/LongSwap.module.css";
import styles from "../css/ShortSwap.module.css";
import { LongSwapContext, ShortSwapContext } from "../providers";
import Tabs from "../components/Tabs";
import PopupModal from "../components/alerts/PopupModal";
import { getProvider } from "../utils/getProvider";
import { getEthLogs } from "../utils/get_ethLogs";
import { _placeLongTermOrders } from "../utils/placeLongTermOrder";
import { WebContext } from "../providers/context/WebProvider";
import { connectWallet } from "../utils/connetWallet";
import { useNetwork } from "../providers/context/UIProvider";

const LongSwap = (props) => {
  const {
    tokenSymbol,
    tokenImage,
    buttonText,
    cancelPool,
    withdrawPool,
    isPlacedLongTermOrder,
    setIsPlacedLongTermOrder,
    spotPriceLoading,
  } = props;

  const [showSettings, setShowSettings] = useState(false);

  const {
    orderLogsDecoded,
    message,
    setMessage,
    numberOfBlockIntervals,
    setOrderLogsDecoded,
  } = useContext(LongSwapContext);

  const {
    isWalletConnected,
    setweb3provider,
    setCurrentBlock,
    setBalance,
    setAccount,
    setWalletConnected,
    swapAmount,
    srcAddress,
    destAddress,
    account,
    setTransactionHash,
    setLoading,
    setError,
  } = useContext(ShortSwapContext);

  const { provider, setProvider } = useContext(WebContext);

  const currentNetwork = useNetwork();

  const ethLogsCount = orderLogsDecoded
    ? Object.keys(orderLogsDecoded).length
    : 0;

  const cardListCount = ethLogsCount;

  console.log("Logs Count", ethLogsCount, cardListCount);

  console.log("Is long term order placed", isPlacedLongTermOrder);

  async function LongSwapButtonClick() {
    console.log("Wallet", isWalletConnected);
    if (!isWalletConnected) {
      await connectWallet(
        setweb3provider,
        setCurrentBlock,
        setBalance,
        setAccount,
        setWalletConnected
      );
      const signer = await getProvider(
        true,
        setweb3provider,
        setCurrentBlock,
        setBalance,
        setAccount,
        setWalletConnected
      );
      await getEthLogs(signer);
    } else {
      await _placeLongTermOrders(
        swapAmount,
        srcAddress,
        destAddress,
        numberOfBlockIntervals,
        setweb3provider,
        setCurrentBlock,
        setBalance,
        setAccount,
        setWalletConnected,
        account,
        setTransactionHash,
        setLoading,
        setIsPlacedLongTermOrder,
        setOrderLogsDecoded,
        setError,
        provider,
        currentNetwork?.network
      );
    }
  }

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
          <Swap
            swapType="long"
            tokenSymbol={tokenSymbol}
            tokenImage={tokenImage}
            connectWallet={LongSwapButtonClick}
            buttonText={buttonText}
            spotPriceLoading={spotPriceLoading}
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

export default LongSwap;
