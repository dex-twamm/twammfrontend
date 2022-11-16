import { ethers } from "ethers";
import { getProvider } from "./getProvider";
import { getEthLogs } from "./get_ethLogs";
import { placeLongTermOrder } from "./longSwap";
import { POOLS, POOL_ID } from "./pool";

export const _placeLongTermOrders = async (
  swapAmount,
  srcAddress,
  destAddress,
  numberOfBlockIntervals,
  setweb3provider,
  setCurrentBlock,
  setBalance,
  setAccount,
  setWalletConnected,
  account,
  setTransactionHash,
  setLoading,
  setIsPlacedLongTermOrder,
  setOrderLogsDecoded,
  setError,
  provider
) => {
  const swapAmountWei = ethers.utils.parseUnits(swapAmount, "ether");
  // console.log('swapAmountWei', swapAmountWei);
  try {
    const tokenInIndex = POOLS[POOL_ID].tokens.findIndex(
      (object) => srcAddress === object.address
    );
    const tokenOutIndex = POOLS[POOL_ID].tokens.findIndex(
      (object) => destAddress === object.address
    );
    const amountIn = swapAmountWei;
    // console.log('amountIn', amountIn);
    const blockIntervals = Math.ceil(numberOfBlockIntervals);
    console.log("Intervals", numberOfBlockIntervals);
    const signer = await getProvider(
      true,
      setweb3provider,
      setCurrentBlock,
      setBalance,
      setAccount,
      setWalletConnected
    );

    const walletAddress = account;
    // Call the PlaceLongTermOrders function from the `utils` folder*
    await placeLongTermOrder(
      tokenInIndex,
      tokenOutIndex,
      amountIn,
      blockIntervals,
      signer,
      walletAddress,
      setTransactionHash
    )
      .then((res) => {
        setTransactionHash(res);
      })
      .finally(setLoading(false));
    setIsPlacedLongTermOrder(true);
    await getEthLogs(provider, walletAddress).then((res) => {
      const resArray = Array.from(res.values());
      setOrderLogsDecoded(resArray);
    });
  } catch (err) {
    console.error(err);
    setLoading(false);
    setError("Transaction Cancelled");
  }
};
