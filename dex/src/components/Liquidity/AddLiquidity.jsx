import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import styles from "../../css/ShortSwap.module.css";
import lsStyles from "../../css/LongSwap.module.css";
import wStyles from "../../css/WithdrawLiquidity.module.css";

import PopupSettings from "../PopupSettings";
import Tabs from "../Tabs";
import LiquidityInput from "./LiquidityInput";
import { getTokensBalance } from "../../utils/getAmount";
import { ShortSwapContext } from "../../providers";
import AddLiquidityPreview from "./AddLiquidityPreview";

const AddLiquidity = ({ selectedTokenPair }) => {
  const { account, web3provider, isWalletConnected } =
    useContext(ShortSwapContext);
  const [showSettings, setShowSettings] = useState(false);
  const [balanceOfToken, setBalanceOfToken] = useState();
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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

  const handlePreviewClick = () => {
    setShowPreviewModal(true);
  };

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
            <Box className={lsStyles.mainBox}>
              <LiquidityInput
                tokenData={selectedTokenPair[0]}
                balances={balanceOfToken}
              />
              <LiquidityInput
                tokenData={selectedTokenPair[1]}
                balances={balanceOfToken}
              />
              <button className={wStyles.btn} onClick={handlePreviewClick}>
                {!isWalletConnected ? "Connect Wallet" : "Preview"}
              </button>
            </Box>
          </div>

          <AddLiquidityPreview
            showPreviewModal={showPreviewModal}
            setShowPreviewModal={setShowPreviewModal}
          />
        </div>
      </div>
    </>
  );
};

export default AddLiquidity;
