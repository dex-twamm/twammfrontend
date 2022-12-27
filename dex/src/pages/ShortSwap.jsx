import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect } from "react";
import PopupModal from "../components/alerts/PopupModal";
import PopupSettings from "../components/PopupSettings";
import Swap from "../components/Swap";
import Tabs from "../components/Tabs";
import styles from "../css/ShortSwap.module.css";
import { LongSwapContext, ShortSwapContext } from "../providers";
import { UIContext } from "../providers/context/UIProvider";
import { connectWalletAndGetEthLogs } from "../utils/connetWallet";
import { spotPrice } from "../utils/getSpotPrice";
import { _swapTokens } from "../utils/shortSwap";

const ShortSwap = ({
  tokenSymbol,
  tokenImage,
  buttonText,
  showSettings,
  setShowSettings,
  message,
  setMessage,
}) => {
  const {
    isWalletConnected,
    setweb3provider,
    web3provider,
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
    expectedSwapOut,
    tolerance,
    deadline,
    ethBalance,
    poolCash,
    setSuccess,
    setFormErrors,
    setSpotPrice,
    setExpectedSwapOut,
    spotPriceLoading,
    setSpotPriceLoading,
  } = useContext(ShortSwapContext);
  const { selectedNetwork, setSelectedNetwork } = useContext(UIContext);
  const { allowance } = useContext(LongSwapContext);

  useEffect(() => {
    let interval1, interval2;
    // Do not fetch prices if not enough allowance.
    if (parseFloat(allowance) > swapAmount) {
      // Wait for 0.5 second before fetching price.
      interval1 = setTimeout(() => {
        spotPrice(
          swapAmount,
          setSpotPriceLoading,
          srcAddress,
          destAddress,
          web3provider,
          account,
          expectedSwapOut,
          tolerance,
          deadline,
          setFormErrors,
          setSpotPrice,
          setExpectedSwapOut,
          selectedNetwork?.network
        );
      }, 500);
      // Update price every 12 seconds.
      interval2 = setTimeout(() => {
        spotPrice(
          swapAmount,
          setSpotPriceLoading,
          srcAddress,
          destAddress,
          web3provider,
          account,
          expectedSwapOut,
          tolerance,
          deadline,
          setFormErrors,
          setSpotPrice,
          setExpectedSwapOut,
          selectedNetwork?.network
        );
      }, 12000);
    }
    return () => {
      clearTimeout(interval1);
      clearTimeout(interval2);
    };
  }, [swapAmount, destAddress, srcAddress, allowance]);

  async function ShortSwapButtonClick() {
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
        await _swapTokens(
          ethBalance,
          poolCash,
          swapAmount,
          web3provider,
          srcAddress,
          destAddress,
          account,
          expectedSwapOut,
          tolerance,
          deadline,
          setTransactionHash,
          setSuccess,
          setError,
          setLoading,
          selectedNetwork?.network
        );

        setSwapAmount(0);
        setExpectedSwapOut(0.0);
      }
    } catch (err) {
      console.error(err);
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
                Swap
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
            {showSettings && <PopupSettings />}
          </div>
          <Swap
            tokenSymbol={tokenSymbol}
            tokenImage={tokenImage}
            handleButtonClick={ShortSwapButtonClick}
            buttonText={buttonText}
            spotPriceLoading={spotPriceLoading}
          />
        </div>
        <PopupModal message={message} setMessage={setMessage}></PopupModal>
      </div>
    </>
  );
};

export default ShortSwap;
