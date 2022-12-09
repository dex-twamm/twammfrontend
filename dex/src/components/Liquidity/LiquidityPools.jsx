import { Box, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React from "react";
import "../../css/LiquidityPools.css";

import { useContext } from "react";
import { ShortSwapContext } from "../../providers";

import CircularProgressBar from "../alerts/CircularProgressBar";
import Tabs from "../Tabs";
import {
  getpoolBalancerUrl,
  getPoolFees,
  getPoolTokens,
} from "../../utils/poolUtils";
import { UIContext } from "../../providers/context/UIProvider";

const LiquidityPools = () => {
  const { LPTokenBalance, loading, isWalletConnected } =
    useContext(ShortSwapContext);
  const { selectedNetwork } = useContext(UIContext);

  return (
    <Box
      sx={{
        width: "fit-content",
        p: "8px",
        borderRadius: "20px",
        dispay: "flex",
        justifyContent: "center",
        margin: "auto",
        fontFamily: "Open Sans",
      }}
    >
      <Tabs />
      {!isWalletConnected ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography
            sx={{
              fontSize: "22px",
              color: "#333333",
              fontWeight: "600",
            }}
          >
            Connect your wallet to view your Pools.
          </Typography>
        </Box>
      ) : !loading ? (
        <>
          {" "}
          <Box
            sx={{
              display: "flex",
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
              padding: "24px 0",
            }}
          >
            <Typography
              sx={{
                fontSize: "22px",
                fontFamily: "Open Sans",
                color: "#333333",
                fontWeight: "600",
              }}
            >
              Pools
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row-reverse", sm: "row" },
              justifyContent: { xs: "flex-end", sm: "flex-end" },
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                bgcolor: " white",
                width: "100%",
                p: "8px",
                borderRadius: "20px",
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%), rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(2px)",

                border: "1px solid white",
              }}
            >
              <Box
                style={{
                  marginTop: "5px",
                  width: { sm: "60%", xs: "100%", md: "70%" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    boxSizing: "border-box",
                    p: 1,
                    minWidth: "100%",
                    height: "auto",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                      height: "2%",
                      paddingBottom: "20px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "20px",
                        alignItems: "center",

                        m: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            background: "blue",
                            height: "40px",
                            width: "40px",
                          }}
                          alt="Testv4"
                          src="Testv4.jpeg"
                        />
                        <Avatar
                          sizes="small"
                          sx={{
                            left: "-10px",
                            background: "green",
                            height: "40px",
                            width: "40px",
                          }}
                          alt="Faucet"
                          src="ethereum.png"
                        />
                      </Box>
                      <Typography
                        sx={{
                          mr: 1,
                          fontWeight: 500,
                          color: "#333333",
                          fontSize: { xs: 16 },
                          fontFamily: "Open Sans",
                        }}
                      >
                        {`${
                          getPoolTokens(selectedNetwork?.network)?.[0].symbol
                        } / ${
                          getPoolTokens(selectedNetwork?.network)?.[1].symbol
                        }`}
                      </Typography>
                      <span
                        style={{
                          padding: "8px 24px",
                          border: "1px solid #fdeaf1",
                          color: "red",
                          fontFamily: "Open Sans",
                          fontWeight: 500,
                          background: "#EE4D3745",
                          borderRadius: "17px",
                        }}
                      >
                        {getPoolFees(selectedNetwork?.network)}%
                      </span>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    m: 1,
                    width: "fit-content",
                    paddingBottom: "20px",
                  }}
                >
                  <Typography
                    style={{
                      fontWeight: 500,
                      color: "grey",
                      fontFamily: "Open Sans",
                    }}
                  >
                    Your LP Token Balance:{" "}
                    <span
                      style={{
                        fontWeight: 400,
                        color: "#333333",
                        fontFamily: "Open Sans",
                      }}
                    >
                      {LPTokenBalance}
                    </span>
                  </Typography>
                </Box>

                <Box
                  sx={{
                    m: 1,
                    paddingRight: { xs: "10px", sm: "10px" },
                    display: "flex",
                    flexDirection: "column-reverse",
                    rowGap: "10px",
                    justifyContent: {
                      xs: "space-between",
                      sm: "flex-end",
                      md: "flex-end",
                    },
                    alignItems: "center",
                  }}
                >
                  {LPTokenBalance != 0 && (
                    <button
                      style={{
                        fontFamily: "Open Sans",
                        padding: "15px 100px",
                        outline: "none",
                        color: "white",
                        fontWeight: "100",
                        border: "none",
                        fontSize: "18px",
                        cursor: "pointer",
                        backgroundColor: "#FF6969",
                        borderRadius: "17px",
                        width: "100%",
                      }}
                    >
                      Remove Liquidity
                    </button>
                  )}
                  <button
                    onClick={() =>
                      window.open(
                        `${getpoolBalancerUrl(selectedNetwork?.network)}`,
                        "_blank"
                      )
                    }
                    style={{
                      fontFamily: "Open Sans",
                      padding: "15px 100px",
                      outline: "none",
                      color: "white",
                      fontWeight: "100",
                      border: "none",
                      fontSize: "18px",
                      cursor: "pointer",
                      backgroundColor: "#554994",
                      borderRadius: "17px",
                      width: "100%",
                    }}
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
