import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, CircularProgress, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useMemo, useState } from "react";
import styles from "../../css/ShortSwap.module.css";
import lsStyles from "../../css/LongSwap.module.css";
import wStyles from "../../css/WithdrawLiquidity.module.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import PopupSettings from "../PopupSettings";
import LiquidityInput from "./LiquidityInput";
import {
  getTokensBalance,
  getPoolTokenBalances,
} from "../../utils/getTokensBalance";
import AddLiquidityPreview from "./AddLiquidityPreview";
import { bigToStr, getProperFixedValue } from "../../utils";
import classNames from "classnames";
import PopupModal from "../alerts/PopupModal";
import { approveMaxAllowance, getAllowance } from "../../utils/getApproval";
import { useShortSwapContext } from "../../providers/context/ShortSwapProvider";
import { useLongSwapContext } from "../../providers/context/LongSwapProvider";
import { useNetworkContext } from "../../providers/context/NetworkProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getSpotPrice,
  priceImpact,
  getProportionalAmount,
} from "../../utils/balancerMath";
import { getPoolTokens } from "../../utils/poolUtils";
import { getTokensUSDValue } from "../../utils/getTokensUSDValue";

const AddLiquidity = () => {
  const {
    account,
    web3provider,
    isWalletConnected,
    spotPriceLoading,
    loading,
    setTransactionHash,
    setAllowTwamErrorMessage,
  } = useShortSwapContext();

  const { allowance, setAllowance } = useLongSwapContext();
  const { selectedNetwork } = useNetworkContext();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [balanceOfToken, setBalanceOfToken] = useState<
    {
      [key: string]: number;
    }[]
  >();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [tokenAInputAmount, setTokenAInputAmount] = useState(0);
  const [tokenBInputAmount, setTokenBInputAmount] = useState(0);
  const [dollarValueOfInputAmount, setDollarValueOfInputAmount] = useState(0.0);
  const [hasBalancerOrTransactionError, setHasBalancerOrTransactionError] =
    useState(true);
  const [maxText, setMaxText] = useState("Max");
  const [priceImpactValue, setPriceImpactValue] = useState(0);
  const [tokenBalances, setTokenBalances] =
    useState<{ [key: string]: number }[]>();

  const [hasProportionalInputA, setHasProportionalInputA] = useState(false);
  const [hasProportionalInputB, setHasProportionalInputB] = useState(false);

  const [searchParams] = useSearchParams();
  const idString = searchParams.get("id");

  if (!idString) throw new Error("Error! Could not get id from url");

  const poolIdNumber = parseFloat(idString);

  const currentNetwork = useMemo(() => {
    return {
      ...selectedNetwork,
      poolId: poolIdNumber,
    };
  }, [poolIdNumber, selectedNetwork]);

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
  }, [account, web3provider, currentNetwork]);

  const handlePreviewClick = () => {
    setShowPreviewModal(true);
  };

  const tokenA = getPoolTokens(currentNetwork)?.[0];
  const tokenB = getPoolTokens(currentNetwork)?.[1];

  const balanceA: any = tokenBalances?.filter(
    (item) => item[tokenA?.address]
  )[0]?.[tokenA?.address];

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
      setAllowTwamErrorMessage("Error!");
    }
  };

  const getTokenAUsdValueMemoized = useMemo(async () => {
    const usdRate = await getTokensUSDValue(tokenA.id);
    return usdRate;
  }, [tokenA.id]);

  const getTokenBUsdValueMemoized = useMemo(async () => {
    const usdRate = await getTokensUSDValue(tokenB.id);
    return usdRate;
  }, [tokenB.id]);

  useEffect(() => {
    const getInputAmountValueInDollar = async () => {
      if (tokenAInputAmount && !tokenBInputAmount) {
        const tokenAUsdRate = await getTokenAUsdValueMemoized;
        setDollarValueOfInputAmount(
          parseFloat((tokenAUsdRate * tokenAInputAmount).toFixed(2))
        );
      } else if (tokenBInputAmount && !tokenAInputAmount) {
        const tokenBUsdRate = await getTokenBUsdValueMemoized;
        setDollarValueOfInputAmount(
          parseFloat((tokenBUsdRate * tokenBInputAmount).toFixed(2))
        );
      } else if (tokenAInputAmount && tokenBInputAmount) {
        const tokenAUsdRate = await getTokenAUsdValueMemoized;
        const tokenBUsdRate = await getTokenBUsdValueMemoized;
        setDollarValueOfInputAmount(
          parseFloat(
            (
              tokenAUsdRate * tokenAInputAmount +
              tokenBUsdRate * tokenBInputAmount
            ).toFixed(2)
          )
        );
      } else {
        setDollarValueOfInputAmount(0);
      }
    };

    getInputAmountValueInDollar();
  }, [
    getTokenAUsdValueMemoized,
    getTokenBUsdValueMemoized,
    tokenA?.id,
    tokenAInputAmount,
    tokenB?.id,
    tokenBInputAmount,
  ]);

  const getIndividualTokenBalance = (tokenAddress: string) => {
    const token = balanceOfToken?.find(
      (t) => Object.keys(t)[0] === tokenAddress
    );
    return token ? +token[tokenAddress].toFixed(2) : 0;
  };

  useEffect(() => {
    setMaxText("Max");
  }, [tokenAInputAmount, tokenBInputAmount]);

  useEffect(() => {
    if (tokenAInputAmount === 0 && tokenBInputAmount === 0) {
      setHasProportionalInputA(false);
      setHasProportionalInputB(false);
    } else {
      if (tokenAInputAmount > 0 && tokenBInputAmount > 0) {
        setHasProportionalInputA(false);
        setHasProportionalInputB(false);
      } else if (tokenAInputAmount > 0) {
        setHasProportionalInputA(false);
        setHasProportionalInputB(true);
      } else if (tokenBInputAmount > 0) {
        setHasProportionalInputA(true);
        setHasProportionalInputB(false);
      }
    }
  }, [tokenAInputAmount, tokenBInputAmount, maxText]);

  useEffect(() => {
    const getTokensBalances = async () => {
      const tokenBalances = await getPoolTokenBalances(
        web3provider?.getSigner(),
        getPoolTokens(currentNetwork),
        currentNetwork
      );
      setTokenBalances(tokenBalances);
    };
    getTokensBalances();
  }, [account, currentNetwork, web3provider]);

  const calculateProportionalSuggestion = async () => {
    if (hasProportionalInputB && tokenBalances) {
      const balances = [
        Object.values(tokenBalances[0])[0],
        Object.values(tokenBalances[1])[0],
      ];

      const spotPrice = getSpotPrice(balances);
      const proportionalValue = getProportionalAmount(
        tokenAInputAmount,
        0,
        spotPrice
      );
      setTokenBInputAmount(getProperFixedValue(proportionalValue));
    }

    if (hasProportionalInputA && tokenBalances) {
      const balances = [
        Object.values(tokenBalances[1])[0],
        Object.values(tokenBalances[0])[0],
      ];

      const spotPriceValue = getSpotPrice(balances);

      const proportionalValue = getProportionalAmount(
        tokenBInputAmount,
        1,
        spotPriceValue
      );
      setTokenAInputAmount(parseFloat(proportionalValue.toString()));
    }
  };

  useEffect(() => {
    const inputAmounts =
      !tokenAInputAmount && !tokenBInputAmount
        ? [0, 0]
        : tokenAInputAmount && !tokenBInputAmount
        ? [tokenAInputAmount, 0]
        : !tokenAInputAmount && tokenBInputAmount
        ? [0, tokenBInputAmount]
        : [tokenAInputAmount, tokenBInputAmount];

    if (tokenBalances) {
      const currentBalances = [
        Object.values(tokenBalances[0])[0],
        Object.values(tokenBalances[1])[0],
      ];
      const impactValue = priceImpact(inputAmounts, currentBalances);
      if (impactValue && impactValue < 0.01) setPriceImpactValue(0.01);
      else setPriceImpactValue(impactValue);
    }
  }, [tokenAInputAmount, tokenBInputAmount, tokenBalances]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.mainBody}>
          <div className={styles.swap}>
            <div className={styles.swapOptions}>
              <div className={styles.titleAndBack}>
                <ArrowBackIcon
                  className={wStyles.backIcon}
                  onClick={() => navigate("/liquidity")}
                />
                <p className={styles.textLink}>Add Liquidity</p>
              </div>
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
          <div className={styles.form}>
            <div className={lsStyles.main} />
            <Box className={lsStyles.mainBox}>
              <LiquidityInput
                tokenData={tokenA}
                balances={balanceOfToken}
                tokenInputAmount={tokenAInputAmount}
                setTokenInputAmount={setTokenAInputAmount}
                calculateProportionalSuggestion={
                  calculateProportionalSuggestion
                }
                input={tokenAInputAmount >= 0 ? tokenAInputAmount : undefined}
                tokenA={tokenA}
                tokenB={tokenB}
                currentNetwork={currentNetwork}
                hasProportional={hasProportionalInputA}
                setHasBalancerOrTransactionError={
                  setHasBalancerOrTransactionError
                }
              />
              <LiquidityInput
                tokenData={tokenB}
                balances={balanceOfToken}
                tokenInputAmount={tokenBInputAmount}
                setTokenInputAmount={setTokenBInputAmount}
                calculateProportionalSuggestion={
                  calculateProportionalSuggestion
                }
                input={tokenBInputAmount >= 0 ? tokenBInputAmount : undefined}
                tokenA={tokenB}
                tokenB={tokenA}
                currentNetwork={currentNetwork}
                hasProportional={hasProportionalInputB}
                setHasBalancerOrTransactionError={
                  setHasBalancerOrTransactionError
                }
              />
              <div className={wStyles.totalAndImpact}>
                <div className={wStyles.total}>
                  <div className={wStyles.text}>
                    <p>Total</p>
                  </div>
                  <div className={wStyles.value}>
                    <p>
                      {dollarValueOfInputAmount
                        ? `$${dollarValueOfInputAmount}`
                        : `$0.0`}
                    </p>
                    <span
                      className={wStyles.maxInput}
                      onClick={() => {
                        setTokenAInputAmount(
                          getIndividualTokenBalance(tokenA?.address)
                        );
                        setTokenBInputAmount(
                          getIndividualTokenBalance(tokenB?.address)
                        );
                        setMaxText("Maxed");
                        setHasProportionalInputA(false);
                        setHasProportionalInputB(false);
                      }}
                      style={{
                        cursor: maxText === "Max" ? "pointer" : "unset",
                      }}
                    >
                      {maxText}
                    </span>
                  </div>
                </div>
                <div className={wStyles.impactPrice}>
                  <div className={wStyles.text}>
                    <p>Price Impact</p>
                  </div>
                  <div className={wStyles.value}>
                    <p>
                      {priceImpactValue === 0.01
                        ? "<.01"
                        : getProperFixedValue(priceImpactValue)}
                      %
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
              {tokenAInputAmount &&
              parseFloat(allowance) < tokenAInputAmount &&
              tokenA ? (
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
                    tokenAInputAmount == 0 ||
                    tokenAInputAmount > balanceA
                  }
                >
                  {`Allow LongSwap Protocol to use your ${
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
                    (!tokenAInputAmount && !tokenBInputAmount) ||
                    loading ||
                    hasBalancerOrTransactionError ||
                    spotPriceLoading ||
                    parseFloat(allowance) < tokenAInputAmount
                  }
                >
                  {!tokenAInputAmount && !tokenBInputAmount ? (
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
            amountsIn={[tokenAInputAmount, tokenBInputAmount]}
            showPreviewModal={showPreviewModal}
            setShowPreviewModal={setShowPreviewModal}
            dollarValueOfInputAmount={dollarValueOfInputAmount}
            selectedTokenPair={[tokenA, tokenB]}
            currentNetwork={currentNetwork}
            priceImpactValue={priceImpactValue}
          />
        </div>
        <PopupModal />
      </div>
    </>
  );
};

export default AddLiquidity;
