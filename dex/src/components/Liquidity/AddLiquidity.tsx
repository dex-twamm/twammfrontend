import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, CircularProgress, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
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
import {
  SelectedNetworkType,
  useNetworkContext,
} from "../../providers/context/NetworkProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getSpotPrice,
  getPriceImpact,
  getProportionalAmount,
} from "../../utils/balancerMath";
import { getPoolTokens } from "../../utils/poolUtils";
import { getTokensUSDValue } from "../../utils/getTokensUSDValue";
import { TokenType } from "../../utils/pool";

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
  const [tokenAInputAmount, setTokenAInputAmount] = useState("");
  const [tokenBInputAmount, setTokenBInputAmount] = useState("");
  const [dollarValueOfInputAmount, setDollarValueOfInputAmount] = useState(0.0);
  const [hasBalancerOrTransactionError, setHasBalancerOrTransactionError] =
    useState(true);
  const [maxText, setMaxText] = useState("Max");
  const [priceImpact, setPriceImpact] = useState(0);
  const [poolTokenBalances, setPoolTokenBalances] = useState<number[]>();

  const [hasProportionalSuggestion, setHasProportionalSuggestion] =
    useState("");

  const [searchParams] = useSearchParams();
  const idString = searchParams.get("id");

  if (!idString) throw new Error("Error! Could not get id from url");

  const poolIdNumber = parseFloat(idString);

  const getPriceImpactValueString = (priceImpact: number) => {
    return priceImpact === 0.01
      ? "<.01%"
      : getProperFixedValue(priceImpact) + "%";
  };

  const currentNetwork: SelectedNetworkType = useMemo(() => {
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
    if (web3provider?.getSigner()) getTokenBalance();
  }, [account, web3provider, currentNetwork]);

  const handlePreviewClick = () => {
    setShowPreviewModal(true);
  };

  const tokenA: TokenType = getPoolTokens(currentNetwork)?.[0];
  const tokenB: TokenType = getPoolTokens(currentNetwork)?.[1];

  const balanceA: number = poolTokenBalances ? poolTokenBalances[0] : 0;

  const handleApproveButton = async () => {
    if (web3provider?.getSigner())
      try {
        const approval = await approveMaxAllowance(
          web3provider.getSigner(),
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
      let tokenAAmount = parseFloat(tokenAInputAmount);
      let tokenBAmount = parseFloat(tokenBInputAmount);
      let tokenAUsdRate = 0;
      let tokenBUsdRate = 0;

      if (tokenAAmount && !tokenBAmount) {
        tokenAUsdRate = await getTokenAUsdValueMemoized;
        setDollarValueOfInputAmount(
          parseFloat((tokenAUsdRate * tokenAAmount).toFixed(2))
        );
      } else if (tokenBAmount && !tokenAAmount) {
        tokenBUsdRate = await getTokenBUsdValueMemoized;
        setDollarValueOfInputAmount(
          parseFloat((tokenBUsdRate * tokenBAmount).toFixed(2))
        );
      } else if (tokenAAmount && tokenBAmount) {
        tokenAUsdRate = await getTokenAUsdValueMemoized;
        tokenBUsdRate = await getTokenBUsdValueMemoized;
        setDollarValueOfInputAmount(
          parseFloat(
            (
              tokenAUsdRate * tokenAAmount +
              tokenBUsdRate * tokenBAmount
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
    const tokenAAmount = parseFloat(tokenAInputAmount);
    const tokenBAmount = parseFloat(tokenBInputAmount);
    if (!tokenAAmount && !tokenBAmount) {
      setHasProportionalSuggestion("");
    } else {
      if (tokenAAmount > 0 && tokenBAmount > 0) {
        setHasProportionalSuggestion("");
      } else if (tokenAAmount > 0) {
        setHasProportionalSuggestion("inputB");
      } else if (tokenBAmount > 0) {
        setHasProportionalSuggestion("inputA");
      }
    }
  }, [tokenAInputAmount, tokenBInputAmount, maxText]);

  useEffect(() => {
    const getTokensBalances = async () => {
      const poolTokenBalances = await getPoolTokenBalances(
        web3provider?.getSigner(),
        getPoolTokens(currentNetwork),
        currentNetwork
      );
      setPoolTokenBalances(poolTokenBalances);
    };
    if (web3provider?.getSigner()) getTokensBalances();
  }, [account, currentNetwork, web3provider]);

  const calculateProportionalSuggestion = (
    amount: string,
    tokenIndex: number,
    setAmountDispatcher: Dispatch<SetStateAction<string>>
  ) => {
    if (!poolTokenBalances) return;

    const spotPrice = getSpotPrice(poolTokenBalances);

    const proportionalValue = getProportionalAmount(
      parseFloat(amount),
      tokenIndex,
      spotPrice
    );

    setAmountDispatcher(getProperFixedValue(proportionalValue).toString());
  };

  const getParsedInputAmounts = (
    tokenAInputAmount: string,
    tokenBInputAmount: string
  ) => {
    let tokenAAmount = parseFloat(tokenAInputAmount);
    let tokenBAmount = parseFloat(tokenBInputAmount);

    if (!tokenAAmount) {
      tokenAAmount = 0;
    }

    if (!tokenBAmount) {
      tokenBAmount = 0;
    }

    return [tokenAAmount, tokenBAmount];
  };

  useEffect(() => {
    const inputAmounts = getParsedInputAmounts(
      tokenAInputAmount,
      tokenBInputAmount
    );

    if (poolTokenBalances) {
      const currentBalances = [poolTokenBalances[0], poolTokenBalances[1]];
      const impactValue = getPriceImpact(inputAmounts, currentBalances);

      if (impactValue && impactValue < 0.01) setPriceImpact(0.01);
      else setPriceImpact(impactValue);
    }
  }, [tokenAInputAmount, tokenBInputAmount, poolTokenBalances]);

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
                calculateProportionalSuggestion={() =>
                  calculateProportionalSuggestion(
                    tokenBInputAmount,
                    1,
                    setTokenAInputAmount
                  )
                }
                input={tokenAInputAmount}
                tokenA={tokenA}
                tokenB={tokenB}
                currentNetwork={currentNetwork}
                hasProportional={hasProportionalSuggestion}
                setHasBalancerOrTransactionError={
                  setHasBalancerOrTransactionError
                }
                inputIndex={1}
              />
              <LiquidityInput
                tokenData={tokenB}
                balances={balanceOfToken}
                tokenInputAmount={tokenBInputAmount}
                setTokenInputAmount={setTokenBInputAmount}
                calculateProportionalSuggestion={() =>
                  calculateProportionalSuggestion(
                    tokenAInputAmount,
                    0,
                    setTokenBInputAmount
                  )
                }
                input={tokenBInputAmount}
                tokenA={tokenB}
                tokenB={tokenA}
                currentNetwork={currentNetwork}
                hasProportional={hasProportionalSuggestion}
                setHasBalancerOrTransactionError={
                  setHasBalancerOrTransactionError
                }
                inputIndex={2}
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
                          getIndividualTokenBalance(tokenA?.address).toString()
                        );
                        setTokenBInputAmount(
                          getIndividualTokenBalance(tokenB?.address).toString()
                        );
                        setMaxText("Maxed");
                        setHasProportionalSuggestion("");
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
                      {getPriceImpactValueString(priceImpact)}
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
              {parseFloat(tokenAInputAmount) &&
              parseFloat(allowance) < parseFloat(tokenAInputAmount) &&
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
                    parseFloat(tokenAInputAmount) === 0 ||
                    parseFloat(tokenAInputAmount) > balanceA
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
                    (!parseFloat(tokenAInputAmount) &&
                      !parseFloat(tokenBInputAmount)) ||
                    loading ||
                    hasBalancerOrTransactionError ||
                    spotPriceLoading ||
                    parseFloat(allowance) < parseFloat(tokenAInputAmount)
                  }
                >
                  {!parseFloat(tokenAInputAmount) &&
                  !parseFloat(tokenBInputAmount) ? (
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
            amountsIn={[
              isNaN(parseFloat(tokenAInputAmount))
                ? 0
                : parseFloat(tokenAInputAmount),
              isNaN(parseFloat(tokenBInputAmount))
                ? 0
                : parseFloat(tokenBInputAmount),
            ]}
            showPreviewModal={showPreviewModal}
            setShowPreviewModal={setShowPreviewModal}
            dollarValueOfInputAmount={dollarValueOfInputAmount}
            selectedTokenPair={[tokenA, tokenB]}
            currentNetwork={currentNetwork}
            priceImpact={priceImpact}
          />
        </div>
      </div>
    </>
  );
};

export default AddLiquidity;
