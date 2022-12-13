import { ethers } from "ethers";
import { POPUP_MESSAGE } from "../constants";
import { getEthLogs } from "./get_ethLogs";
import { placeLongTermOrder } from "./longSwap";
import { POOLS } from "./pool";

export const _placeLongTermOrders = async (
  swapAmount,
  srcAddress,
  destAddress,
  numberOfBlockIntervals,
  web3provider,
  account,
  setTransactionHash,
  setLoading,
  setIsPlacedLongTermOrder,
  setOrderLogsDecoded,
  setError,
  currentNetwork
) => {
  const poolConfig = Object.values(POOLS[currentNetwork])[0];

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
    const blockIntervals = Math.ceil(numberOfBlockIntervals);

    const signer = web3provider.getSigner();

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
    await getEthLogs(signer, walletAddress, currentNetwork).then((res) => {
      const resArray = Array.from(res.values());
      setOrderLogsDecoded(resArray);
    });
  } catch (err) {
    console.error(err);
    setLoading(false);
    setError(POPUP_MESSAGE.transactionCancelled);
  }
};
