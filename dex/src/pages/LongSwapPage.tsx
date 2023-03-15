import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import LongTermOrderCard from "../components/LongTermOrderCard";
import PopupSettings from "../components/PopupSettings";
import lsStyles from "../css/LongSwap.module.css";
import styles from "../css/ShortSwap.module.css";
import { LongSwapContext } from "../providers";
import Tabs from "../components/Tabs";
import PopupModal from "../components/alerts/PopupModal";
import { _placeLongTermOrders } from "../utils/placeLongTermOrder";
import { connectWallet } from "../utils/connetWallet";

import { UIContext } from "../providers/context/UIProvider";
import LongSwap from "../components/LongSwap";
import { verifyLongSwap } from "../utils/verifyLongSwap";
import { getAllPool } from "../utils/poolUtils";
import { MenuItem, Select } from "@mui/material";
import { getEthLogs } from "../utils/get_ethLogs";
import { useShortSwapContext } from "../providers/context/ShortSwapProvider";

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
  } = useContext(LongSwapContext)!;

  const {
    isWalletConnected,
    web3provider,
    swapAmount,
    setSwapAmount,
    account,
    setTransactionHash,
    setLoading,
    setError,
    setweb3provider,
    setCurrentBlock,
    setBalance,
    setAccount,
    setWalletConnected,
  } = useShortSwapContext();

  const [showSettings, setShowSettings] = useState<boolean>(false);

  const { selectedNetwork, setSelectedNetwork } = useContext(UIContext)!;

  const ethLogsCount = orderLogsDecoded
    ? Object.keys(orderLogsDecoded).length
    : 0;

  const cardListCount = ethLogsCount;

  useEffect(() => {
    let verifyLongSwapInterval: any;

    // Wait for 0.5 second before fetching price.

    verifyLongSwapInterval = setTimeout(() => {
      verifyLongSwap(
        swapAmount,
        setLongSwapVerifyLoading,
        tokenA?.address!,
        tokenB?.address!,
        web3provider,
        account,
        setLongSwapFormErrors,
        selectedNetwork,
        numberOfBlockIntervals,
        allowance
      );
    }, 500);

    return () => {
      clearTimeout(verifyLongSwapInterval);
    };
  }, [swapAmount, tokenB, tokenA, numberOfBlockIntervals, selectedNetwork]);

  async function LongSwapButtonClick() {
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
        await _placeLongTermOrders(
          swapAmount,
          tokenA?.address!,
          tokenB?.address!,
          numberOfBlockIntervals,
          web3provider,
          account,
          setTransactionHash,
          setLoading,
          setMessage,
          setOrderLogsDecoded,
          setError,
          selectedNetwork
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
              <p className={styles.textLink}>Long Term Swap</p>
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
