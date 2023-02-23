import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Box, CircularProgress, Tooltip } from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
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
import { approveMaxAllowance, getAllowance } from "../../utils/getApproval";

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
    setTransactionHash,
    setAllowance,
    setAllowTwammErrorMessage,
  } = useContext(ShortSwapContext);

  const { allowance } = useContext(LongSwapContext);
  const { selectedNetwork } = useContext(UIContext);

  const [showSettings, setShowSettings] = useState(false);
  const [balanceOfToken, setBalanceOfToken] = useState();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [inputAmount, setInputAmount] = useState();
  const [dollarValueOfInputAmount, setDollarValueOfInputAmount] = useState(0.0);
  const [hasBalancerOrTransactionError, setHasBalancerOrTransactionError] =
    useState(true);

  const currentNetwork = useMemo(() => {
    return {
      ...selectedNetwork,
      poolId: selectedTokenPair[2],
    };
  }, [selectedNetwork, selectedTokenPair]);

  useEffect(() => {
    const getTokenBalance = async () => {
      const tokenBalance = await getTokensBalance(
        web3provider?.getSigner(),
        account,
        currentNetwork
      );
      setBalanceOfToken(tokenBalance);
    };
    getTokenBalance();
  }, [account, web3provider, selectedTokenPair, currentNetwork]);

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
          currentNetwork
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
          currentNetwork
        );
      }, 12000);
    }
    return () => {
      clearTimeout(interval1);
      clearTimeout(interval2);
      setExpectedSwapOut(0);
      setSpotPrice(0);
      setFormErrors({ balError: undefined });
    };
  }, [inputAmount, tokenA, tokenB, allowance, selectedNetwork]);

  const handleApproveButton = async () => {
    try {
      const approval = await approveMaxAllowance(
        web3provider,
        tokenA?.address,
        selectedNetwork
      );
      setTransactionHash(approval.hash);

      await getAllowance(
        web3provider?.getSigner(),
        account,
        tokenA?.address,
        selectedNetwork
      ).then((res) => {
        setAllowance(bigToStr(res));
      });
    } catch (e) {
      console.log(e);
      setAllowTwammErrorMessage(e?.message);
    }
  };

  useEffect(() => {
    formErrors.balError !== undefined
      ? setHasBalancerOrTransactionError(true)
      : setHasBalancerOrTransactionError(false);
  }, [formErrors]);

  useEffect(() => {
    return () => {
      setFormErrors({ balError: undefined });
      setTransactionHash(undefined);
    };
  }, [setFormErrors, setTransactionHash]);

  useEffect(() => {
    const getInputAmountValueInDollar = async () => {
      const id = tokenA?.symbol.toLowerCase();
      const tokenData = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}`
      );
      console.log("tokenData from API", tokenData);
      const currentPricePerToken =
        tokenData?.data?.market_data?.current_price?.usd;

      setDollarValueOfInputAmount(
        (currentPricePerToken * inputAmount).toFixed(2)
      );
    };

    getInputAmountValueInDollar();
  }, [inputAmount, tokenA]);

  console.log("allowance", allowance);

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
              {inputAmount && parseFloat(allowance) <= inputAmount && tokenA ? (
                <button
                  className={classNames(
                    wStyles.btn,
                    wStyles.btnConnect,
                    wStyles.btnBtn
                  )}
                  onClick={() => {
                    handleApproveButton();
                  }}
                  disabled={
                    hasBalancerOrTransactionError ||
                    inputAmount == 0 ||
                    inputAmount > tokenA?.balance
                  }
                >
                  {`Allow TWAMM Protocol to use your ${
                    tokenA.symbol ?? tokenB.symbol
                  }`}
                </button>
              ) : (
                <></>
              )}
              {isWalletConnected && allowance ? (
                <button
                  className={classNames(
                    wStyles.btn,
                    wStyles.btnConnect,
                    wStyles.btnBtn
                  )}
                  onClick={handlePreviewClick}
                  disabled={
                    !inputAmount ||
                    hasBalancerOrTransactionError ||
                    spotPriceLoading ||
                    parseFloat(allowance) <= inputAmount
                      ? true
                      : false
                  }
                >
                  {!inputAmount ? (
                    "Enter an Amount"
                  ) : spotPriceLoading ? (
                    <CircularProgress sx={{ color: "white" }} size={30} />
                  ) : (
                    "Preview"
                  )}
                </button>
              ) : !isWalletConnected ? (
                <button className={classNames(wStyles.btn, wStyles.btnConnect)}>
                  Connect Wallet
                </button>
              ) : (
                <button className={classNames(styles.btn, styles.btnConnect)}>
                  <CircularProgress sx={{ color: "white" }} size={30} />
                </button>
              )}
            </Box>
          </div>

          <AddLiquidityPreview
            amountsIn={[inputAmount, expectedSwapOut]}
            showPreviewModal={showPreviewModal}
            setShowPreviewModal={setShowPreviewModal}
            dollarValueOfInputAmount={dollarValueOfInputAmount}
            selectedTokenPair={selectedTokenPair}
            currentNetwork={currentNetwork}
          />
        </div>
        <PopupModal />
      </div>
    </>
  );
};

export default AddLiquidity;
