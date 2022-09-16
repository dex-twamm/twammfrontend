import { BalancerSDK } from "@balancer-labs/sdk";
import { ethers } from "ethers";
import { bigToStr, POOL_ID } from ".";

export async function runQueryBatchSwap(assetIn, assetOut, swapAmount) {
    let spotPrice, expectedSwapOut = 0;
    let errorMessage = "";
    try {
        const config = {
            network: 5,
            rpcUrl: `https://goerli.infura.io/v3/3c2a9ef715cf4789b9137212d45270e9`,
        };

        const balancer = new BalancerSDK(config);
        const swapType = 1;
        const swaps = [
            // First pool swap: 0.01ETH > USDC
            {
                poolId: POOL_ID,
                // MATIC
                assetInIndex: 1,
                // FAUCET
                assetOutIndex: 0,
                amount: swapAmount,
                userData: "0x",
            },
        ];

        const assets = [
            assetIn, assetOut
        ];

        const deltas = await balancer.swaps.queryBatchSwap({
            kind: swapType,
            swaps,
            assets,
        });
        console.log("Logs From Query Batch", deltas.toString());
        spotPrice = deltas[1] / deltas[0];
        // Take Decimals Into Account In ExpectedSwapAmount -- TODO
        expectedSwapOut = (deltas[1]).toString();
        // return Math.abs(spotPrices);
    } catch (e) {
        errorMessage = e.match("BAL#509") ? "Try Giving Lesser Amount" : "Unknown Error"
        console.log(e);
    }
    return { 'spotPrice': Math.abs(spotPrice), 'expectedSwapOut': expectedSwapOut, 'errorMessage': errorMessage }
}


