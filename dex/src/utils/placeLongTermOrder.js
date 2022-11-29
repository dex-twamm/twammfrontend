import { ethers } from "ethers";
import { POPUP_MESSAGE } from "../constants";
import { getProvider } from "./getProvider";
import { getEthLogs } from "./get_ethLogs";
import { placeLongTermOrder } from "./longSwap";
import { POOLS } from "./pool";
import { getPoolNetworkValues } from "./poolUtils";

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
  provider,
  currentNetwork = "Goerli"
) => {
  const poolConfig = getPoolNetworkValues(currentNetwork);

  try {
    const tokenInIndex = poolConfig.tokens.findIndex(
      (object) => srcAddress === object.address
    );
    const tokenOutIndex = poolConfig.tokens.findIndex(
      (object) => destAddress === object.address
    );
    const amountIn = ethers.utils.parseUnits(
      swapAmount,
      poolConfig.tokens[tokenInIndex].decimals
    );
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
      setTransactionHash,
      currentNetwork
    )
      .then((res) => {
        setTransactionHash(res);
        setIsPlacedLongTermOrder(true);
      })
      .catch((err) => {
        console.log(err);
        setIsPlacedLongTermOrder(false);
      })
      .finally(setLoading(false));
    await getEthLogs(provider, walletAddress).then((res) => {
      const resArray = Array.from(res.values());
      setOrderLogsDecoded(resArray);
    });
  } catch (err) {
    console.error(err);
    setLoading(false);
    setError(POPUP_MESSAGE.transactionCancelled);
  }
};
