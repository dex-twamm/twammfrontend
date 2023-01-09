import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuItem, Select } from "@mui/material";
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
import { getAllPool } from "../utils/poolUtils";
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
  const { selectedNetwork, setSelectedNetwork, poolNumber, setPoolNumber } =
    useContext(UIContext);
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
          selectedNetwork?.network,
          poolNumber
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
          selectedNetwork?.network,
          poolNumber
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
          selectedNetwork?.network,
          poolNumber
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
          selectedNetwork?.network,
          poolNumber
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

  const handlePoolChange = (e) => {
    setPoolNumber(e.target.value);
  };

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
              <div className={styles.poolAndIcon}>
                {getAllPool(selectedNetwork?.network).length > 1 && (
                  <Select
                    className={styles.poolBox}
                    inputProps={{ "aria-label": "Without label" }}
                    value={poolNumber}
                    onChange={handlePoolChange}
                    variant="outlined"
                    sx={{ outline: "none" }}
                  >
                    {getAllPool(selectedNetwork?.network)?.map((el, idx) => {
                      return <MenuItem value={idx}>Pool {idx}</MenuItem>;
                    })}
                  </Select>
                )}
                <FontAwesomeIcon
                  className={styles.settingsIcon}
                  icon={faGear}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(!showSettings);
                  }}
                />
              </div>
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
