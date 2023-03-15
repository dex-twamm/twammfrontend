import React from "react";
import styles from "../../css/LiquidityPool.module.css";
import { useContext } from "react";
import { LongSwapContext } from "../../providers";
import Tabs from "../Tabs";
import {
  getPoolFees,
  getPoolId,
  getPoolTokenSymbol,
} from "../../utils/poolUtils";
import { UIContext } from "../../providers/context/UIProvider";
import { Avatar, Box, Skeleton } from "@mui/material";
import { useShortSwapContext } from "../../providers/context/ShortSwapProvider";

const LiquidityPools = () => {
  const { LPTokenBalance, loading, isWalletConnected } = useShortSwapContext();
  const { tokenA, tokenB } = useContext(LongSwapContext);
  const { selectedNetwork } = useContext(UIContext);

  return (
    <Box className={styles.rootBox}>
      <Tabs />
      <Box
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
                        src={tokenA?.logo}
                      />
                      <Avatar
                        className={styles.styledAvatarTwo}
                        sizes="small"
                        alt="Faucet"
                        src={tokenB?.logo}
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
      </Box>{" "}
    </Box>
  );
};
export default LiquidityPools;
