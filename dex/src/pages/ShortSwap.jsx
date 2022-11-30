import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect } from "react";
import PopupModal from "../components/alerts/PopupModal";
import PopupSettings from "../components/PopupSettings";
import Swap from "../components/Swap";
import Tabs from "../components/Tabs";
import styles from "../css/ShortSwap.module.css";
import { ShortSwapContext } from "../providers";
import { useNetwork } from "../providers/context/UIProvider";
import { WebContext } from "../providers/context/WebProvider";
import { connectWallet } from "../utils/connetWallet";
import { getProvider } from "../utils/getProvider";
import { spotPrice } from "../utils/getSpotPrice";
import { getEthLogs } from "../utils/get_ethLogs";
import { POOLS } from "../utils/pool";
import { _swapTokens } from "../utils/shortSwap";

const ShortSwap = ({
  tokenSymbol,
  tokenImage,
  // connectWallet,
  buttonText,
  showSettings,
  setShowSettings,
  spotPriceLoading,
  message,
  setMessage,
  setSpotPriceLoading,
}) => {
  //   const [showSettings, setShowSettings] = useState(false);

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
    expectedSwapOut,
    tolerance,
    deadline,
    ethBalance,
    poolCash,
    setSuccess,
    setFormErrors,
    setSpotPrice,
    setExpectedSwapOut,
  } = useContext(ShortSwapContext);

  const { provider, setProvider } = useContext(WebContext);

  const currentNetwork = useNetwork();

  // console.log(
  //   "Current network currentNetwork",
  //   Object.values(POOLS[currentNetwork.network])[0]
  // );

  useEffect(() => {
    // console.log("ajsdhkasd----", swapAmount, destAddress, srcAddress);
    // Wait for 0.5 second before fetching price.
    const interval1 = setTimeout(() => {
      spotPrice(
        swapAmount,
        setSpotPriceLoading,
        srcAddress,
        destAddress,
        setweb3provider,
        setCurrentBlock,
        setBalance,
        setAccount,
        setWalletConnected,
        account,
        expectedSwapOut,
        tolerance,
        deadline,
        setFormErrors,
        setSpotPrice,
        setExpectedSwapOut,
        currentNetwork?.network
      );
    }, 500);
    // Update price every 12 seconds.
    const interval2 = setTimeout(() => {
      spotPrice(
        swapAmount,
        setSpotPriceLoading,
        srcAddress,
        destAddress,
        setweb3provider,
        setCurrentBlock,
        setBalance,
        setAccount,
        setWalletConnected,
        account,
        expectedSwapOut,
        tolerance,
        deadline,
        setFormErrors,
        setSpotPrice,
        setExpectedSwapOut,
        currentNetwork?.network
      );
    }, 12000);
    return () => {
      clearTimeout(interval1);
      clearTimeout(interval2);
    };
  }, [swapAmount, destAddress, srcAddress]);

  console.log("iswalletashkasjdhsakd", isWalletConnected);

  async function ShortSwapButtonClick() {
    try {
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
        await _swapTokens(
          ethBalance,
          poolCash,
          swapAmount,
          setweb3provider,
          setCurrentBlock,
          setBalance,
          setAccount,
          setWalletConnected,
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
          currentNetwork?.network
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
            connectWallet={ShortSwapButtonClick}
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
