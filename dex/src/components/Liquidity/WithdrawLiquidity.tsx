import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Slider, Tooltip, Skeleton } from "@mui/material";

import iStyles from "../../css/Input.module.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMemo, useState, useEffect } from "react";
import styles from "../../css/ShortSwap.module.css";
import lsStyles from "../../css/LongSwap.module.css";
import wStyles from "../../css/WithdrawLiquidity.module.css";

import PopupSettings from "../PopupSettings";
import WithdrawLiquidityPreview from "./WithdrawLiquidityPreview";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PopupModal from "../alerts/PopupModal";
import classNames from "classnames";
import { useShortSwapContext } from "../../providers/context/ShortSwapProvider";
import { useNetworkContext } from "../../providers/context/NetworkProvider";
import { TokenType } from "../../utils/pool";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getPoolId, getPoolTokens } from "../../utils/poolUtils";
import WithdrawLiquiditySelect from "./WithdrawLiquiditySelect";
import {
  bigToStr,
  getProperFixedValue,
  validateSymbolKeyPressInInput,
} from "../../utils";
import { useLongSwapContext } from "../../providers/context/LongSwapProvider";
import { spotPrice } from "../../utils/getSpotPrice";
import CircularProgress from "@mui/material/CircularProgress";
import { withdrawPoolLiquidity } from "../../utils/withdrawPoolLiquidity";
import { BigNumber } from "ethers";
import { getPoolTokenBalances } from "../../utils/getTokensBalance";
import { priceImpact } from "../../utils/balancerMath";
import { getTokensUSDValue } from "../../utils/getTokensUSDValue";

const WithdrawLiquidity = () => {
  const {
    account,
    web3provider,
    isWalletConnected,
    setSpotPriceLoading,
    spotPriceLoading,
    deadline,
    loading,
    setSpotPrice,
    setExpectedSwapOut,
  } = useShortSwapContext();
  const { allowance } = useLongSwapContext();
  const { selectedNetwork } = useNetworkContext();

  const navigate = useNavigate();
  const location = useLocation();
  const { bptAmount } = location.state as { bptAmount: number };
  const [searchParams] = useSearchParams();

  const [balancerErrors, setBalancerErrors] = useState<{
    balError: string | undefined;
  }>({ balError: undefined });

  const [showSettings, setShowSettings] = useState(false);

  const [selectValue, setSelectValue] = useState(1);
  const [inputValue, setInputValue] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [sliderValue, setSliderValue] = useState(100);
  const [hasBalancerOrTransactionError, setHasBalancerOrTransactionError] =
    useState(true);
  const [singleTokenMaxLoading, setSingleTokenMaxLoading] = useState(false);
  const [tokenOutFromBptIn, setTokenOutFromBptIn] = useState([
    BigNumber.from(0),
    BigNumber.from(0),
  ]);

  const [tokenAValueOfBpt, setTokenAValueOfBpt] = useState(0);
  const [tokenBValueOfBpt, setTokenBValueOfBpt] = useState(0);
  const [dollarValueOfTokenA, setDollarValueOfTokenA] = useState(0);
  const [dollarValueOfTokenB, setDollarValueOfTokenB] = useState(0);
  const [tokenBalances, setTokenBalances] =
    useState<{ [key: string]: number }[]>();
  const [priceImpactValue, setPriceImpactValue] = useState(0);

  const idString = searchParams.get("id");

  if (!idString) throw new Error("Error! Could not get id from url");
  const poolIdNumber = parseFloat(idString);

  const currentNetwork = useMemo(() => {
    return {
      ...selectedNetwork,
      poolId: poolIdNumber,
    };
  }, [poolIdNumber, selectedNetwork]);

  const tokens = getPoolTokens(currentNetwork);
  const tokenA = tokens?.[0];
  const tokenB = tokens?.[1];
  const selectedTokenPair = [tokenA, tokenB];

  const handlePreviewClick = () => {
    setShowPreviewModal(true);
  };

  useEffect(() => {
    let interval1: ReturnType<typeof setTimeout>;
    let interval2: ReturnType<typeof setTimeout>;
    // Do not fetch prices if not enough allowance.
    if (parseFloat(allowance) > inputValue) {
      // Wait for 0.5 second before fetching price.
      interval1 = setTimeout(() => {
        spotPrice(
          inputValue,
          setSpotPriceLoading,
          tokenA?.address,
          tokenB?.address,
          web3provider,
          account,
          deadline,
          setBalancerErrors,
          setSpotPrice,
          setExpectedSwapOut,
          currentNetwork
        );
      }, 500);
      // Update price every 12 seconds.
      interval2 = setTimeout(() => {
        spotPrice(
          inputValue,
          setSpotPriceLoading,
          tokenA?.address,
          tokenB?.address,
          web3provider,
          account,
          deadline,
          setBalancerErrors,
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
      setBalancerErrors({ balError: undefined });
    };
  }, [
    inputValue,
    tokenA,
    tokenB,
    allowance,
    setSpotPriceLoading,
    web3provider,
    account,
    deadline,
    setSpotPrice,
    setExpectedSwapOut,
    currentNetwork,
  ]);

  useEffect(() => {
    balancerErrors?.balError !== undefined
      ? setHasBalancerOrTransactionError(true)
      : setHasBalancerOrTransactionError(false);
  }, [balancerErrors]);

  useEffect(() => {
    const withdrawLiquidityCallStatic = async () => {
      setSingleTokenMaxLoading(true);
      const poolId = getPoolId(currentNetwork);
      const bptAmountInBig = BigNumber.from(bptAmount.toString());

      const result = await withdrawPoolLiquidity(
        poolId,
        [tokenA?.address, tokenB?.address],
        bptAmountInBig,
        account,
        web3provider,
        currentNetwork,
        true
      );

      setTokenOutFromBptIn(result["amountsOut"]);
      setSingleTokenMaxLoading(false);
    };
    withdrawLiquidityCallStatic();
  }, [
    account,
    bptAmount,
    currentNetwork,
    selectValue,
    tokenA,
    tokenB,
    web3provider,
  ]);

  useEffect(() => {
    if (tokenOutFromBptIn && selectValue === 1) {
      setTokenAValueOfBpt(
        (sliderValue / 100) *
          parseFloat(bigToStr(tokenOutFromBptIn[0], tokenA.decimals))
      );

      setTokenBValueOfBpt(
        (sliderValue / 100) *
          parseFloat(bigToStr(tokenOutFromBptIn[1], tokenB.decimals))
      );
    }
  }, [
    selectValue,
    sliderValue,
    tokenA.decimals,
    tokenB.decimals,
    tokenOutFromBptIn,
  ]);

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

  useEffect(() => {
    const inputAmounts = [
      (sliderValue / 100) * parseFloat(tokenOutFromBptIn[0].toString()),
      (sliderValue / 100) * parseFloat(tokenOutFromBptIn[1].toString()),
    ];
    if (tokenBalances) {
      const currentBalances = [
        Object.values(tokenBalances[0])[0],
        Object.values(tokenBalances[1])[0],
      ];
      const impactValue = priceImpact(inputAmounts, currentBalances);
      if (impactValue && impactValue < 0.01) setPriceImpactValue(0.01);
      else setPriceImpactValue(impactValue);
    }
  }, [sliderValue, tokenBalances, tokenOutFromBptIn]);

  useEffect(() => {
    setInputValue(0);
  }, [selectValue]);

  const getTokenAUSDValueMemoized = useMemo(async () => {
    const usdRate = await getTokensUSDValue(tokenA.id);
    return usdRate;
  }, [tokenA.id]);

  const getTokenBUSDValueMemoized = useMemo(async () => {
    const usdRate = await getTokensUSDValue(tokenB.id);
    return usdRate;
  }, [tokenB.id]);

  useEffect(() => {
    const getTokenDollarValue = async () => {
      if (tokenOutFromBptIn) {
        if (selectValue === 1) {
          const tokenAUsdRate = await getTokenAUSDValueMemoized;
          setDollarValueOfTokenA(tokenAUsdRate * tokenAValueOfBpt);

          const tokenBUsdRate = await getTokenBUSDValueMemoized;
          setDollarValueOfTokenB(tokenBUsdRate * tokenAValueOfBpt);
        } else {
          if (selectValue === 2) {
            const tokenAUsdRate = await getTokenAUSDValueMemoized;
            setDollarValueOfTokenA(tokenAUsdRate * inputValue);
          } else if (selectValue === 3) {
            const tokenBUsdRate = await getTokenBUSDValueMemoized;
            setDollarValueOfTokenB(tokenBUsdRate * inputValue);
          }
        }
      }
    };
    getTokenDollarValue();
  }, [
    tokenA,
    tokenB,
    tokenOutFromBptIn,
    selectValue,
    inputValue,
    tokenAValueOfBpt,
    getTokenAUSDValueMemoized,
    getTokenBUSDValueMemoized,
  ]);

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
                <p className={styles.textLink}>Withdraw from Pool</p>
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
            {selectValue === 1 ? (
              <Box className={lsStyles.mainBox}>
                <div className={wStyles.selectTokenSection}>
                  <div className={wStyles.tokensAndAmt}>
                    <WithdrawLiquiditySelect
                      selectedTokenPair={selectedTokenPair}
                      selectValue={selectValue}
                      setSelectValue={setSelectValue}
                    />
                    <p className={wStyles.amount}>
                      ${(dollarValueOfTokenA + dollarValueOfTokenB).toFixed(2)}
                    </p>
                  </div>
                  <div className={wStyles.sliderPart}>
                    <div className={wStyles.proportional}>
                      <p>Proportional withdrawal</p>
                      <p>{sliderValue}%</p>
                    </div>
                    <Slider
                      value={sliderValue}
                      min={0}
                      step={1}
                      max={100}
                      sx={{
                        height: 8,
                        width: 1,
                        color: "#6D64A5",
                      }}
                      onChange={(e) =>
                        setSliderValue(
                          parseFloat((e.target as HTMLInputElement).value)
                        )
                      }
                      aria-labelledby="non-linear-slider"
                    />
                  </div>
                </div>
                <div className={wStyles.tokensList}>
                  {selectedTokenPair.map((el: TokenType, idx: number) => (
                    <div className={wStyles.items} key={idx}>
                      <div className={wStyles.tokenInfo}>
                        <img src={el?.logo} alt="" height={30} width={30} />
                        <p>{el?.symbol} 50%</p>
                      </div>
                      <div className={wStyles.amt}>
                        <p>
                          {idx === 0
                            ? getProperFixedValue(tokenAValueOfBpt)
                            : getProperFixedValue(tokenBValueOfBpt)}
                        </p>
                        <span>
                          $
                          {idx === 0
                            ? dollarValueOfTokenA.toFixed(2)
                            : dollarValueOfTokenB.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={wStyles.priceImpact}>
                  <div className={wStyles.impact}>
                    <p>Price Impact</p>
                  </div>
                  <div className={wStyles.number}>
                    <p>
                      {priceImpactValue === 0.01
                        ? "<.01"
                        : getProperFixedValue(priceImpactValue)}
                      %
                      <Tooltip
                        arrow
                        placement="top"
                        title="Withdrawing custom amounts causes the internal prices of the pool to change, as if you were swapping tokens. The higher the price impact the more you'll spend in swap fees"
                      >
                        <InfoOutlinedIcon fontSize="small" />
                      </Tooltip>
                    </p>
                  </div>
                </div>
                <button
                  className={classNames(
                    wStyles.btn,
                    wStyles.btnConnect,
                    wStyles.btnBtn
                  )}
                  onClick={handlePreviewClick}
                >
                  {!isWalletConnected ? "Connect Wallet" : "Preview"}
                </button>
              </Box>
            ) : (
              <Box className={lsStyles.mainBox}>
                <div className={wStyles.selectTokenSection}>
                  <div className={wStyles.tokensAndAmt}>
                    <WithdrawLiquiditySelect
                      selectedTokenPair={selectedTokenPair}
                      selectValue={selectValue}
                      setSelectValue={setSelectValue}
                    />

                    <input
                      className={iStyles.textField}
                      type="number"
                      placeholder="0.0"
                      value={inputValue ?? ""}
                      onChange={(e) =>
                        setInputValue(parseFloat(e.target.value))
                      }
                      onKeyDown={(e) => validateSymbolKeyPressInInput(e)}
                      min={0}
                      style={{ textAlign: "right" }}
                    />
                  </div>
                  <p className={wStyles.singleText}>
                    Single token max:{" "}
                    {singleTokenMaxLoading ? (
                      <Skeleton width={"70px"} />
                    ) : selectValue === 2 ? (
                      bigToStr(tokenOutFromBptIn[0], tokenA.decimals)
                    ) : selectValue === 3 ? (
                      bigToStr(tokenOutFromBptIn[1], tokenA.decimals)
                    ) : (
                      0
                    )}{" "}
                    {!singleTokenMaxLoading && (
                      <span
                        className={wStyles.maxInput}
                        onClick={() => {
                          setInputValue(
                            selectValue === 2
                              ? +bigToStr(tokenOutFromBptIn[0], tokenA.decimals)
                              : +bigToStr(tokenOutFromBptIn[1], tokenA.decimals)
                          );
                        }}
                      >
                        Max
                      </span>
                    )}
                  </p>
                  {balancerErrors?.balError && (
                    <span className={wStyles.errorText}>
                      {balancerErrors?.balError}
                    </span>
                  )}
                </div>

                <div className={wStyles.priceImpact}>
                  <div className={wStyles.impact}>
                    <p>Price Impact</p>
                  </div>
                  <div className={wStyles.number}>
                    <p>
                      {priceImpactValue === 0.01
                        ? "<.01"
                        : getProperFixedValue(priceImpactValue)}
                      %
                      <Tooltip
                        arrow
                        placement="top"
                        title="Withdrawing custom amounts causes the internal prices of the pool to change, as if you were swapping tokens. The higher the price impact the more you'll spend in swap fees"
                      >
                        <InfoOutlinedIcon fontSize="small" />
                      </Tooltip>
                    </p>
                  </div>
                </div>
                <button
                  className={classNames(
                    wStyles.btn,
                    wStyles.btnConnect,
                    wStyles.btnBtn
                  )}
                  onClick={handlePreviewClick}
                  disabled={
                    !inputValue || hasBalancerOrTransactionError || loading
                  }
                >
                  {!inputValue ? (
                    "Enter an Amount"
                  ) : spotPriceLoading ? (
                    <CircularProgress sx={{ color: "white" }} size={30} />
                  ) : (
                    "Preview"
                  )}
                </button>
              </Box>
            )}
          </div>

          <WithdrawLiquidityPreview
            showPreviewModal={showPreviewModal}
            setShowPreviewModal={setShowPreviewModal}
            bptAmountIn={bptAmount}
            currentNetwork={currentNetwork}
            tokens={selectValue === 2 ? tokenA : tokenB}
            selectValue={selectValue}
            inputValue={inputValue}
            priceImpactValue={priceImpactValue}
            dollarValueOfToken={
              selectValue === 1
                ? dollarValueOfTokenA + dollarValueOfTokenB
                : selectValue === 2
                ? dollarValueOfTokenA
                : dollarValueOfTokenB
            }
          />
        </div>
        <PopupModal />
      </div>
    </>
  );
};

export default WithdrawLiquidity;
