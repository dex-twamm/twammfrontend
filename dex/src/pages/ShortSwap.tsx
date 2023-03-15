import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuItem, Select } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import PopupModal from "../components/alerts/PopupModal";
import PopupSettings from "../components/PopupSettings";
import Swap from "../components/Swap";
import Tabs from "../components/Tabs";
import styles from "../css/ShortSwap.module.css";
import { useLongSwapContext } from "../providers/context/LongSwapProvider";
import { useShortSwapContext } from "../providers/context/ShortSwapProvider";
import { UIContext } from "../providers/context/UIProvider";
import { connectWallet } from "../utils/connetWallet";
import { spotPrice } from "../utils/getSpotPrice";
import { getEthLogs } from "../utils/get_ethLogs";
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
    setSuccess,
    setFormErrors,
    setSpotPrice,
    setExpectedSwapOut,
    spotPriceLoading,
    setSpotPriceLoading,
  } = useShortSwapContext();
  const { selectedNetwork, setSelectedNetwork } = useContext(UIContext)!;
  const { allowance, tokenA, tokenB } = useLongSwapContext();

  useEffect(() => {
    let interval1: any, interval2: any;
    // Do not fetch prices if not enough allowance.
    if (parseFloat(allowance) > swapAmount) {
      // Wait for 0.5 second before fetching price.
      interval1 = setTimeout(() => {
        spotPrice(
          swapAmount,
          setSpotPriceLoading,
          tokenA?.address!,
          tokenB?.address!,
          web3provider,
          account,
          deadline,
          setFormErrors,
          setSpotPrice,
          setExpectedSwapOut,
          selectedNetwork
        );
      }, 500);
      // Update price every 12 seconds.
      interval2 = setTimeout(() => {
        spotPrice(
          swapAmount,
          setSpotPriceLoading,
          tokenA?.address!,
          tokenB?.address!,
          web3provider,
          account,
          deadline,
          setFormErrors,
          setSpotPrice,
          setExpectedSwapOut,
          selectedNetwork
        );
      }, 12000);
    }
    return () => {
      clearTimeout(interval1);
      clearTimeout(interval2);
    };
  }, [swapAmount, tokenB, tokenA, allowance, selectedNetwork]);

  const [showSettings, setShowSettings] = useState(false);

  async function ShortSwapButtonClick() {
    try {
      if (!isWalletConnected) {
        await connectWallet().then((res) => {
          const {
            account,
            balance,
            currentBlock,
            selectedNetwork,
            web3Provider,
          } = res;
          setweb3provider(web3Provider);
          setCurrentBlock(currentBlock);
          setBalance(balance);
          setAccount(account);
          setWalletConnected(true);
          setSelectedNetwork(selectedNetwork);
        });
        await getEthLogs(web3provider, account, selectedNetwork);
      } else {
        await _swapTokens(
          ethBalance,
          swapAmount,
          web3provider,
          tokenA?.address!,
          tokenB?.address!,
          account,
          deadline,
          setTransactionHash,
          setSuccess,
          setError,
          setLoading,
          selectedNetwork
        );

        setSwapAmount(0);
        setExpectedSwapOut(0);
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

  const handlePoolChange = (e: any) => {
    setSelectedNetwork({ ...selectedNetwork, poolId: e.target.value });
    localStorage.setItem("poolId", e.target.value);
  };

  return (
    <>
      <div className={styles.container}>
        <Tabs />

        <div className={styles.mainBody}>
          <div className={styles.swap}>
            <div className={styles.swapOptions}>
              <p className={styles.textLink}>Swap</p>
              <div className={styles.poolAndIcon}>
                {getAllPool(selectedNetwork)?.length! > 1 && (
                  <Select
                    className={styles.poolBox}
                    inputProps={{ "aria-label": "Without label" }}
                    value={selectedNetwork?.poolId}
                    onChange={handlePoolChange}
                    variant="outlined"
                    sx={{ outline: "none" }}
                  >
                    {getAllPool(selectedNetwork)?.map((el, idx) => {
                      return (
                        <MenuItem key={idx} value={idx}>
                          {el.poolName}
                        </MenuItem>
                      );
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
