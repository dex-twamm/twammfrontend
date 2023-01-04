import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
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

const ShortSwap = () => {
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
    account,
    setTransactionHash,
    setLoading,
    setError,
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
  const { allowance, tokenA, tokenB } = useContext(LongSwapContext);

  useEffect(() => {
    let interval1, interval2;
    // Do not fetch prices if not enough allowance.
    if (parseFloat(allowance) > swapAmount) {
      // Wait for 0.5 second before fetching price.
      interval1 = setTimeout(() => {
        spotPrice(
          swapAmount,
          setSpotPriceLoading,
          tokenA?.address,
          tokenB?.address,
          web3provider,
          account,
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
          tokenA?.address,
          tokenB?.address,
          web3provider,
          account,
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
  }, [swapAmount, tokenB, tokenA, allowance]);

  const [showSettings, setShowSettings] = useState(false);

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
          tokenA?.address,
          tokenB?.address,
          account,
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
            handleSwapAction={ShortSwapButtonClick}
            spotPriceLoading={spotPriceLoading}
          />
        </div>
        <PopupModal />
      </div>
    </>
  );
};

export default ShortSwap;
