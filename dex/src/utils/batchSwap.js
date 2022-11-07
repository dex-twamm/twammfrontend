import { BalancerSDK } from "@balancer-labs/sdk";
import { ethers } from "ethers";
import { bigToStr, POOL_ID } from ".";
import { POOLS } from "./pool";

export async function runQueryBatchSwap(
  assetInAddress,
  assetOutAddress,
  swapAmount
) {
  let spotPrice,
    expectedSwapOut = 0;
  let errorMessage = "";
  const assetInIndex = POOLS[POOL_ID].tokens.findIndex(
    (object) => assetInAddress === object.address
  );
  const assetOutIndex = POOLS[POOL_ID].tokens.findIndex(
    (object) => assetOutAddress === object.address
  );

  console.log(
    "ShortSwap Address",
    assetInAddress,
    assetInIndex,
    assetOutIndex,
    swapAmount
  );
  try {
    const config = {
      network: 5,
      rpcUrl: `https://goerli.infura.io/v3/3c2a9ef715cf4789b9137212d45270e9`,
    };

    const balancer = new BalancerSDK(config);
    const swapType = 0;
    const swaps = [
      // First pool swap: 0.01ETH > USDC
      {
        poolId: POOL_ID,
        // MATIC
        assetInIndex: assetInIndex,
        // FAUCET
        assetOutIndex: assetOutIndex,
        amount: swapAmount,
        userData: "0x",
      },
    ];

    const assets = [
      POOLS[POOL_ID].tokens[0].address,
      POOLS[POOL_ID].tokens[1].address,
    ];
    // console.log("ShortSwap Assets", swapType, swaps, assets)
    const deltas = await balancer.swaps.queryBatchSwap({
      kind: swapType,
      swaps,
      assets,
    });
    console.log("ShortSwap Logs From Query Batch", deltas.toString());
    spotPrice = (deltas[assetOutIndex] / deltas[assetInIndex]) * -1;
    // convertedValue = (deltas[1] / deltas[0]) * spotPrice;
    // Take Decimals Into Account In ExpectedSwapAmount -- TODO
    expectedSwapOut = (deltas[assetOutIndex] * -1).toString();
    // return Math.abs(spotPrices);
  } catch (e) {
    errorMessage = e.match("BAL#304") && "Try Giving Lesser Amount";
    console.log(e);
  }
  console.log("ShortSwap Spot Price ", spotPrice, expectedSwapOut);
  return {
    spotPrice: Math.abs(spotPrice),
    expectedSwapOut: expectedSwapOut,
    errorMessage: errorMessage,
  };
}
