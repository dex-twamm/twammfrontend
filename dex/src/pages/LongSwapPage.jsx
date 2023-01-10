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
import { connectWalletAndGetEthLogs } from "../utils/connetWallet";

import { UIContext } from "../providers/context/UIProvider";
import LongSwap from "../components/LongSwap";
import { verifyLongSwap } from "../utils/verifyLongSwap";
import { getAllPool } from "../utils/poolUtils";
import { MenuItem, Select } from "@mui/material";

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

  const { selectedNetwork, setSelectedNetwork, poolNumber, setPoolNumber } =
    useContext(UIContext);

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
        allowance,
        poolNumber
      );
    }, 500);

    return () => {
      clearTimeout(verifyLongSwapInterval);
    };
  }, [swapAmount, tokenB, tokenA, numberOfBlockIntervals, poolNumber]);

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
          selectedNetwork?.network,
          poolNumber
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
          selectedNetwork?.network,
          poolNumber
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
                Long Term Swap
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
