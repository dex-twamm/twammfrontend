import React from "react";
import styles from "../../css/LiquidityPool.module.css";
import { useContext } from "react";
import { ShortSwapContext } from "../../providers";
import CircularProgressBar from "../alerts/CircularProgressBar";
import Tabs from "../Tabs";
import { getPoolFees, getPoolId, getPoolTokens } from "../../utils/poolUtils";
import { UIContext } from "../../providers/context/UIProvider";
import { Avatar, Box, Typography } from "@mui/material";
import ethLogo from "../../images/ethereum.svg";
import maticLogo from "../../images/Testv4.svg";

const LiquidityPools = () => {
  const { LPTokenBalance, loading, isWalletConnected } =
    useContext(ShortSwapContext);
  const { selectedNetwork } = useContext(UIContext);

  return (
    <Box className={styles.rootBox}>
      <Tabs />
      {!isWalletConnected ? (
        <Box className={styles.containerBox}>
          <Typography className={styles.styledTypography}>
            Connect your wallet to view your Pools.
          </Typography>
        </Box>
      ) : !loading ? (
        <>
          {" "}
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
            <Typography className={styles.poolTypography}>Pools</Typography>
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
                        </Box>
                        <span
                          className={styles.tokensTypography}
                          style={{ fontSize: { xs: 16 } }}
                        >
                          {`${
                            getPoolTokens(selectedNetwork?.network)?.[0].symbol
                          } / ${
                            getPoolTokens(selectedNetwork?.network)?.[1].symbol
                          }`}
                        </span>
                      </Box>
                      <div className={styles.feeTypography}>
                        {getPoolFees(selectedNetwork?.network)}
                      </div>
                    </Box>
                  </Box>
                </Box>
                <Box className={styles.balanceInfoBox}>
                  <Typography className={styles.balanceInfoTypography}>
                    Your LP Token Balance:{" "}
                    <Typography className={styles.balanceTypography}>
                      {LPTokenBalance}
                    </Typography>
                  </Typography>
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
                  {LPTokenBalance != 0 && (
                    <button className={styles.removeLiquidityButton}>
                      Remove Liquidity
                    </button>
                  )}
                  <button
                    className={styles.addLiquidityButton}
                    onClick={() =>
                      window.open(
                        `https://app.balancer.fi/#/pool/${getPoolId(
                          selectedNetwork?.network
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
        </>
      ) : (
        <CircularProgressBar
          margin={"20%"}
          label={"Please Wait"}
        ></CircularProgressBar>
      )}
    </Box>
  );
};
export { LiquidityPools };
