import { BalancerSDK } from "@balancer-labs/sdk";
import { POOL_ID } from ".";

export async function runQueryBatchSwap(assetIn, assetOut, swapAmount) {
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
    const spotPrices = deltas[1] / deltas[0];
    return Math.abs(spotPrices);
}


