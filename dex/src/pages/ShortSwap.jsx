import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect } from "react";
import PopupModal from "../components/alerts/PopupModal";
import PopupSettings from "../components/PopupSettings";
import Swap from "../components/Swap";
import Tabs from "../components/Tabs";
import styles from "../css/ShortSwap.module.css";
import { ShortSwapContext } from "../providers";
import { UIContext } from "../providers/context/UIProvider";
import { connectWallet } from "../utils/connetWallet";
import { spotPrice } from "../utils/getSpotPrice";
import { getEthLogs } from "../utils/get_ethLogs";
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

  useEffect(() => {
    // Wait for 0.5 second before fetching price.
    const interval1 = setTimeout(() => {
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
    const interval2 = setTimeout(() => {
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
    return () => {
      clearTimeout(interval1);
      clearTimeout(interval2);
    };
  }, [swapAmount, destAddress, srcAddress]);

  async function ShortSwapButtonClick() {
    try {
      if (!isWalletConnected) {
        await connectWallet(
          setweb3provider,
          setCurrentBlock,
          setBalance,
          setAccount,
          setWalletConnected,
          setSelectedNetwork
        );
        await getEthLogs(web3provider.getSigner(), account, selectedNetwork?.network);
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
