import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import styles from "../../css/ShortSwap.module.css";
import lsStyles from "../../css/LongSwap.module.css";
import bStyles from "../../css/AddLiquidity.module.css";

import PopupSettings from "../PopupSettings";
import Tabs from "../Tabs";
import classNames from "classnames";
import LiquidityInput from "./LiquidityInput";
import { getTokensBalance } from "../../utils/getAmount";
import { ShortSwapContext } from "../../providers";

const AddLiquidity = ({ selectedTokenPair }) => {
  const { account, web3provider } = useContext(ShortSwapContext);
  const [showSettings, setShowSettings] = useState(false);
  const [balanceOfToken, setBalanceOfToken] = useState();

  useEffect(() => {
    const selectedNetwork = {
      network: selectedTokenPair[0]?.network,
      poolId: selectedTokenPair[0]?.poolId,
    };
    const getTokenBalance = async () => {
      const tokenBalance = await getTokensBalance(
        web3provider?.getSigner(),
        account,
        selectedNetwork
      );
      setBalanceOfToken(tokenBalance);
    };
    getTokenBalance();
  }, [account, web3provider, selectedTokenPair]);

  return (
    <>
      <div className={styles.container}>
        <Tabs />
        <div className={styles.mainBody}>
          <div className={styles.swap}>
            <div className={styles.swapOptions}>
              <p className={styles.textLink}>Add Liquidity</p>
              <div className={styles.poolAndIcon}>
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
          <div className={styles.form}>
            <div className={lsStyles.main} />
            {/* {balanceOfToken && ( */}
            <Box className={lsStyles.mainBox}>
              <LiquidityInput
                tokenData={selectedTokenPair[0]}
                balances={balanceOfToken}
              />
              <LiquidityInput
                tokenData={selectedTokenPair[1]}
                balances={balanceOfToken}
              />
              <button
                className={classNames(bStyles.btn, bStyles.btnConnect)}
                // onClick={handleClick}
              >
                Add Liquidity
              </button>
            </Box>
            {/* )} */}
          </div>
        </div>
        {/* <PopupModal /> */}
      </div>
    </>
  );
};

export default AddLiquidity;
