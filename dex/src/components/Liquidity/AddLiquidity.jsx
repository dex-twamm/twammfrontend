import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Box, CircularProgress, Tooltip } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import styles from "../../css/ShortSwap.module.css";
import lsStyles from "../../css/LongSwap.module.css";
import wStyles from "../../css/WithdrawLiquidity.module.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import PopupSettings from "../PopupSettings";
import Tabs from "../Tabs";
import LiquidityInput from "./LiquidityInput";
import { getTokensBalance } from "../../utils/getAmount";
import { LongSwapContext, ShortSwapContext, UIContext } from "../../providers";
import AddLiquidityPreview from "./AddLiquidityPreview";
import { spotPrice } from "../../utils/getSpotPrice";
import { bigToStr } from "../../utils";
import { BigNumber } from "ethers";
import classNames from "classnames";
import PopupModal from "../alerts/PopupModal";
import axios from "axios";

const AddLiquidity = ({ selectedTokenPair }) => {
  const {
    account,
    web3provider,
    isWalletConnected,
    spotPriceLoading,
    setSpotPriceLoading,
    deadline,
    formErrors,
    setFormErrors,
    setSpotPrice,
    expectedSwapOut,
    setExpectedSwapOut,
  } = useContext(ShortSwapContext);

  const { allowance } = useContext(LongSwapContext);
  const { selectedNetwork } = useContext(UIContext);

  const [showSettings, setShowSettings] = useState(false);
  const [balanceOfToken, setBalanceOfToken] = useState();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [inputAmount, setInputAmount] = useState();
  const [dollarValueOfInputAmount, setDollarValueOfInputAmount] = useState(0.0);

  useEffect(() => {
    const currentNetwork = {
      network: selectedTokenPair[0]?.network,
      poolId: selectedTokenPair[0]?.poolId,
    };
    const getTokenBalance = async () => {
      const tokenBalance = await getTokensBalance(
        web3provider?.getSigner(),
        account,
        currentNetwork
      );
      setBalanceOfToken(tokenBalance);
    };
    getTokenBalance();
  }, [account, web3provider, selectedTokenPair]);

  const handlePreviewClick = () => {
    setShowPreviewModal(true);
  };

  const tokenA = selectedTokenPair[0];
  const tokenB = selectedTokenPair[1];

  useEffect(() => {
    let interval1, interval2;
    // Do not fetch prices if not enough allowance.
    if (parseFloat(allowance) > inputAmount) {
      // Wait for 0.5 second before fetching price.
      interval1 = setTimeout(() => {
        spotPrice(
          inputAmount,
          setSpotPriceLoading,
          tokenA?.address,
          tokenB?.address,
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
          inputAmount,
          setSpotPriceLoading,
          tokenA?.address,
          tokenB?.address,
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
  }, [inputAmount, tokenA, tokenB, allowance, selectedNetwork]);

  useEffect(() => {
    const getInputAmountValueInDollar = async () => {
      const id = tokenA?.symbol.toLowerCase();
      const tokenData = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}`
      );
      console.log("tokenData", tokenData);
      const currentPricePerToken =
        tokenData?.data?.market_data?.current_price?.usd;

      setDollarValueOfInputAmount(
        (currentPricePerToken * inputAmount).toFixed(2)
      );
    };

    getInputAmountValueInDollar();
  }, [inputAmount]);

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
                tokenData={tokenA}
                balances={balanceOfToken}
                setInputAmount={setInputAmount}
                input={inputAmount ? inputAmount : ""}
                id={1}
              />
              <LiquidityInput
                tokenData={tokenB}
                balances={balanceOfToken}
                input={
                  expectedSwapOut
                    ? bigToStr(
                        BigNumber.from(expectedSwapOut),
                        tokenB?.decimals
                      )
                    : ""
                }
                id={2}
              />
              {formErrors.balError && (
                <div className={styles.errorAlert}>
                  <Alert severity="error" sx={{ borderRadius: "16px" }}>
                    {formErrors.balError}
                  </Alert>
                </div>
              )}
              <div className={wStyles.totalAndImpact}>
                <div className={wStyles.total}>
                  <div className={wStyles.text}>
                    <p>Total</p>
                  </div>
                  <div className={wStyles.value}>
                    <p>
                      {inputAmount ? `$${dollarValueOfInputAmount}` : `$0.0`}
                    </p>
                  </div>
                </div>
                <div className={wStyles.impactPrice}>
                  <div className={wStyles.text}>
                    <p>Price Impact</p>
                  </div>
                  <div className={wStyles.value}>
                    <p>
                      0.00%
                      <Tooltip
                        arrow
                        placement="top"
                        title="Adding custom amounts causes the internal prices of the pool to change, as if you were swapping tokens. The higher the price impact the more you'll spend in swap fees."
                      >
                        <InfoOutlinedIcon fontSize="small" />
                      </Tooltip>
                    </p>
                  </div>
                </div>
              </div>
              <button
                className={classNames(
                  wStyles.btn,
                  wStyles.btnConnect,
                  wStyles.btnBtn
                )}
                onClick={handlePreviewClick}
                disabled={!inputAmount || spotPriceLoading}
              >
                {!isWalletConnected ? (
                  "Connect Wallet"
                ) : spotPriceLoading ? (
                  <CircularProgress sx={{ color: "white" }} size={30} />
                ) : (
                  "Preview"
                )}
              </button>
            </Box>
          </div>

          <AddLiquidityPreview
            amountsIn={[inputAmount, expectedSwapOut]}
            showPreviewModal={showPreviewModal}
            setShowPreviewModal={setShowPreviewModal}
            dollarValueOfInputAmount={dollarValueOfInputAmount}
            tokenA={tokenA}
          />
        </div>
        <PopupModal />
      </div>
    </>
  );
};

export default AddLiquidity;
