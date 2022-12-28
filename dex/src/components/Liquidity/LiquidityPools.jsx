import React from "react";
import "../../css/LiquidityPools.css";
import { useContext } from "react";
import { ShortSwapContext } from "../../providers";
import CircularProgressBar from "../alerts/CircularProgressBar";
import Tabs from "../Tabs";
import { getPoolFees, getPoolId, getPoolTokens } from "../../utils/poolUtils";
import { UIContext } from "../../providers/context/UIProvider";
import {
  ContainerBox,
  ContentBox,
  HeadingBox,
  InsideContentBox,
  PoolTypography,
  RootBox,
  StyledBoxOne,
  StyledBoxTwo,
  StyledBoxThree,
  StyledBoxFour,
  StyledTypography,
  StyledBoxFive,
  StyledAvatarOne,
  StyledAvatarTwo,
  TokensTypography,
  FeeTypography,
  BalanceInfoBox,
  BalanceInfoTypography,
  BalanceTypography,
  ButtonsBox,
  RemoveLiquidityButton,
  AddLiquidityButton,
} from "./LiquidityPoolsStyles";

const LiquidityPools = () => {
  const { LPTokenBalance, loading, isWalletConnected } =
    useContext(ShortSwapContext);
  const { selectedNetwork } = useContext(UIContext);

  return (
    <RootBox>
      <Tabs />
      {!isWalletConnected ? (
        <ContainerBox>
          <StyledTypography>
            Connect your wallet to view your Pools.
          </StyledTypography>
        </ContainerBox>
      ) : !loading ? (
        <>
          {" "}
          <HeadingBox
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
            <PoolTypography>Pools</PoolTypography>
          </HeadingBox>
          <ContentBox
            sx={{
              flexDirection: { xs: "row-reverse", sm: "row" },
              justifyContent: { xs: "flex-end", sm: "flex-end" },
            }}
          >
            <InsideContentBox>
              <StyledBoxOne>
                <StyledBoxTwo>
                  <StyledBoxThree>
                    <StyledBoxFour>
                      <StyledBoxFive>
                        <StyledAvatarOne alt="Testv4" src="Testv4.jpeg" />
                        <StyledAvatarTwo
                          sizes="small"
                          alt="Faucet"
                          src="ethereum.png"
                        />
                      </StyledBoxFive>
                      <TokensTypography sx={{ fontSize: { xs: 16 } }}>
                        {`${
                          getPoolTokens(selectedNetwork?.network)?.[0].symbol
                        } / ${
                          getPoolTokens(selectedNetwork?.network)?.[1].symbol
                        }`}
                      </TokensTypography>
                      <FeeTypography>
                        {getPoolFees(selectedNetwork?.network)}
                      </FeeTypography>
                    </StyledBoxFour>
                  </StyledBoxThree>
                </StyledBoxTwo>
                <BalanceInfoBox>
                  <BalanceInfoTypography>
                    Your LP Token Balance:{" "}
                    <BalanceTypography>{LPTokenBalance}</BalanceTypography>
                  </BalanceInfoTypography>
                </BalanceInfoBox>

                <ButtonsBox
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
                    <RemoveLiquidityButton>
                      Remove Liquidity
                    </RemoveLiquidityButton>
                  )}
                  <AddLiquidityButton
                    onClick={() =>
                      window.open(
                        `https://app.balancer.fi/#/pool/${getPoolId(
                          selectedNetwork?.network
                        )}/invest`,
                        "_blank"
                      )
                    }
                    style={{}}
                  >
                    Add Liquidity
                  </AddLiquidityButton>
                </ButtonsBox>
              </StyledBoxOne>
            </InsideContentBox>
          </ContentBox>{" "}
        </>
      ) : (
        <CircularProgressBar
          margin={"20%"}
          label={"Please Wait"}
        ></CircularProgressBar>
      )}
    </RootBox>
  );
};
export { LiquidityPools };
