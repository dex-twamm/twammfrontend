import React, { useEffect, useState } from "react";
import styles from "../../css/LiquidityPool.module.css";
import { useContext } from "react";
import { LongSwapContext, ShortSwapContext } from "../../providers";
import Tabs from "../Tabs";
import {
  getPoolFees,
  getPoolId,
  getPoolTokenSymbol,
} from "../../utils/poolUtils";
import { UIContext } from "../../providers/context/UIProvider";
import { Avatar, Box, Button, Skeleton } from "@mui/material";
import ethLogo from "../../images/ethereum.svg";
import maticLogo from "../../images/Testv4.svg";
import Input from "../Input";
import classNames from "classnames";
import lsStyles from "../../css/LongSwap.module.css";
import bstyles from "../../css/AddLiquidity.module.css";
import { getLiquidityInfo, joinPool } from "../../utils/checkLiquidity";
import { spotPrice } from "../../utils/getSpotPrice";
import { BigNumber } from "ethers";
import { bigToStr } from "../../utils";

const LiquidityPools = () => {
  // const { LPTokenBalance, loading, isWalletConnected } =
  //   useContext(ShortSwapContext);
  // const { selectedNetwork } = useContext(UIContext);

  const [display, setDisplay] = useState(false);

  const {
    selectToken,
    setSelectToken,
    account,
    setSpotPriceLoading,
    deadline,
    setFormErrors,
    setSpotPrice,
    setExpectedSwapOut,
    expectedSwapOut,
  } = useContext(ShortSwapContext);

  const { tokenA, tokenB, setTokenA, setTokenB } = useContext(LongSwapContext);

  const { web3provider } = useContext(ShortSwapContext);
  const { selectedNetwork } = useContext(UIContext);

  const [tokenAAmountForPool, setTokenAAmountForPool] = useState();
  const [tokenBAmountForPool, setTokenBAmountForPool] = useState();

  const handleDisplay = (event) => {
    setSelectToken(event.currentTarget.id);
    setDisplay(!display);
  };

  useEffect(() => {
    const interval1 = setTimeout(() => {
      spotPrice(
        tokenAAmountForPool,
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
    return () => {
      clearTimeout(interval1);
    };
  }, [tokenAAmountForPool, tokenB, tokenA, selectedNetwork]);

  const handleAddLiquidity = async () => {
    const amountsIn = [tokenAAmountForPool, expectedSwapOut];
    await getLiquidityInfo(
      selectedNetwork,
      web3provider,
      account,
      amountsIn
    ).then((res) => console.log(res));
  };

  return (
    <Box className={styles.rootBox}>
      <Tabs />
      {/* <Box
        className={styles.headingBox}
        sx={{
          alignItems: {
            xs: "flex-start",
            sm: "center",
            md: "center",
            lg: "center",
          },
          justifyContent: {
            xs: "center",
            sm: "space-between",
            md: "space-between",
          },
          flexDirection: { xs: "column", sm: "row", md: "row" },
        }}
      >
        <span className={styles.poolTypography}>Pools</span>
      </Box>
      <Box
        className={styles.contentBox}
        sx={{
          flexDirection: { xs: "row-reverse", sm: "row" },
          justifyContent: { xs: "flex-end", sm: "flex-end" },
        }}
      >
        <Box className={styles.insideContentBox}>
          <Box className={styles.styledBoxOne}>
            <Box className={styles.styledBoxTwo}>
              <Box className={styles.styledBoxThree}>
                <Box className={styles.styledBoxFour}>
                  <Box className={styles.logoAndName}>
                    <Box className={styles.styledBoxFive}>
                      <Avatar
                        className={styles.styledAvatarOne}
                        alt="Testv4"
                        src={maticLogo}
                      />
                      <Avatar
                        className={styles.styledAvatarTwo}
                        sizes="small"
                        alt="Faucet"
                        src={ethLogo}
                      />
                      <span
                        className={styles.tokensTypography}
                        sx={{ fontSize: { xs: 16 } }}
                      >
                        {`${getPoolTokenSymbol(selectedNetwork)?.[0]} / ${
                          getPoolTokenSymbol(selectedNetwork)?.[1]
                        }`}
                      </span>
                    </Box>
                  </Box>
                  <span className={styles.feeTypography}>
                    {getPoolFees(selectedNetwork)}
                  </span>
                </Box>
              </Box>
            </Box>
            <Box className={styles.balanceInfoBox}>
              <p className={styles.balanceInfoTypography}>
                Your LP Token Balance:{" "}
                {isWalletConnected ? (
                  <span className={styles.balanceTypography}>
                    {!loading ? LPTokenBalance : <Skeleton width={"100px"} />}
                  </span>
                ) : (
                  <span className={styles.balanceTypography}>
                    {isWalletConnected
                      ? LPTokenBalance
                      : "Connect your Wallet!"}
                  </span>
                )}
              </p>
            </Box>

            <Box
              className={styles.buttonsBox}
              sx={{
                paddingRight: { xs: "10px", sm: "10px" },
                justifyContent: {
                  xs: "space-between",
                  sm: "flex-end",
                  md: "flex-end",
                },
              }}
            >
              {LPTokenBalance !== 0 && (
                <button className={styles.removeLiquidityButton}>
                  Remove Liquidity
                </button>
              )}
              <button
                className={styles.addLiquidityButton}
                onClick={() =>
                  window.open(
                    `https://app.balancer.fi/#/pool/${getPoolId(
                      selectedNetwork
                    )}/invest`,
                    "_blank"
                  )
                }
              >
                Add Liquidity
              </button>
            </Box>
          </Box>
        </Box>
      </Box>{" "} */}
      <Box className={lsStyles.mainBox}>
        <Input
          id={1}
          input={tokenAAmountForPool ? tokenAAmountForPool : ""}
          placeholder="0.0"
          onChange={(e) => {
            setTokenAAmountForPool(e.target.value);
          }}
          imgSrc={tokenA?.logo}
          symbol={tokenA?.symbol}
          handleDisplay={handleDisplay}
          selectToken={selectToken}
          display={display}
          setDisplay={setDisplay}
          setTokenA={setTokenA}
          setTokenB={setTokenB}
        />
        <Input
          id={2}
          input={
            expectedSwapOut
              ? bigToStr(BigNumber.from(expectedSwapOut), tokenB.decimals)
              : ""
          }
          placeholder=""
          imgSrc={tokenB?.logo}
          symbol={tokenB?.symbol}
          onChange={(e) => setTokenBAmountForPool(e.target.value)}
          handleDisplay={handleDisplay}
          selectToken={selectToken}
          display={display}
          setDisplay={setDisplay}
          setTokenA={setTokenA}
          setTokenB={setTokenB}
        />
        <button
          className={classNames(bstyles.btn, bstyles.btnConnect)}
          onClick={handleAddLiquidity}
        >
          Add Liquidity
        </button>
      </Box>
    </Box>
  );
};
export { LiquidityPools };
