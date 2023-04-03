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
import { bigToStr, validateSymbolKeyPressInInput } from "../../utils";
import { useLongSwapContext } from "../../providers/context/LongSwapProvider";
import { spotPrice } from "../../utils/getSpotPrice";
import CircularProgress from "@mui/material/CircularProgress";
import { withdrawPoolLiquidity } from "../../utils/withdrawPoolLiquidity";
import { BigNumber } from "ethers";

const WithdrawLiquidity = () => {
  const {
    account,
    web3provider,
    isWalletConnected,
    setSpotPriceLoading,
    spotPriceLoading,
    deadline,
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
  const idString = searchParams.get("id");

  if (!idString) throw new Error("Error! Could not get id from url");
  const poolIdNumber = parseFloat(idString);

  const currentNetwork = useMemo(() => {
    return {
      ...selectedNetwork,
      poolId: poolIdNumber,
    };
  }, [poolIdNumber, selectedNetwork]);

  const tokenA = getPoolTokens(currentNetwork)?.[0];
  const tokenB = getPoolTokens(currentNetwork)?.[1];
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
  }, [inputValue, tokenA, tokenB, allowance]);

  useEffect(() => {
    balancerErrors?.balError !== undefined
      ? setHasBalancerOrTransactionError(true)
      : setHasBalancerOrTransactionError(false);
  }, [balancerErrors]);

  useEffect(() => {
    const withdrawLiquidityCallStatic = async () => {
      setSingleTokenMaxLoading(true);
      const poolId = getPoolId(currentNetwork);

      const result = await withdrawPoolLiquidity(
        poolId,
        [tokenA?.address, tokenB?.address],
        bptAmount,
        account,
        web3provider,
        currentNetwork,
        true
      );

      setTokenOutFromBptIn(result["amountsOut"]);
      setSingleTokenMaxLoading(false);
    };
    if (selectValue === 2 || selectValue === 3) {
      withdrawLiquidityCallStatic();
    }
  }, [selectValue]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.mainBody}>
          <div className={styles.swap}>
            <div className={styles.swapOptions}>
              <p className={styles.textLink}>Withdraw from Pool</p>
              <div className={styles.poolAndIcon}>
                <ArrowBackIcon
                  className={wStyles.backIcon}
                  onClick={() => navigate("/liquidity")}
                />
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
            {selectValue === 1 ? (
              <Box className={lsStyles.mainBox}>
                <div className={wStyles.selectTokenSection}>
                  <div className={wStyles.tokensAndAmt}>
                    <WithdrawLiquiditySelect
                      selectedTokenPair={selectedTokenPair}
                      selectValue={selectValue}
                      setSelectValue={setSelectValue}
                    />
                    <p className={wStyles.amount}>$0.00</p>
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
                        <p>0.05</p>
                        <span>$0.00</span>
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
                      0.00%
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
                      0.00%
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
                  disabled={!inputValue || hasBalancerOrTransactionError}
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
          />
        </div>
        <PopupModal />
      </div>
    </>
  );
};

export default WithdrawLiquidity;
