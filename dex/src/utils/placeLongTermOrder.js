import { ethers } from "ethers";
import { POPUP_MESSAGE } from "../constants";
import { getEthLogs } from "./get_ethLogs";
import { placeLongTermOrder } from "./longSwap";
import { getPoolConfig } from "./poolUtils";

export const _placeLongTermOrders = async (
  swapAmount,
  tokenA,
  tokenB,
  numberOfBlockIntervals,
  web3provider,
  account,
  setTransactionHash,
  setLoading,
  setMessage,
  setOrderLogsDecoded,
  setError,
  currentNetwork
) => {
  const poolConfig = getPoolConfig(currentNetwork);

  try {
    const tokenInIndex = poolConfig.tokens.findIndex(
      (object) => tokenA === object.address
    );
    const tokenOutIndex = poolConfig.tokens.findIndex(
      (object) => tokenB === object.address
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
      currentNetwork
    )
      .then((res) => {
        setTransactionHash(res.hash);
        const placeLtoTxResult = async (res) => {
          const result = await res.wait();
          return result;
        };
        placeLtoTxResult(res).then(async (response) => {
          if (response.status === 1) {
            await getEthLogs(signer, walletAddress, currentNetwork).then(
              (res) => {
                const resArray = Array.from(res.values());
                setOrderLogsDecoded(resArray);
              }
            );
            setMessage(POPUP_MESSAGE.ltoPlaced);
          } else setMessage(POPUP_MESSAGE.ltoPlaceFailed);
        });
      })
      .catch((err) => {
        console.error(err);
        setMessage(POPUP_MESSAGE.ltoPlaceFailed);
      })
      .finally(setLoading(false));
  } catch (err) {
    console.error(err);
    setLoading(false);
    setError(POPUP_MESSAGE.transactionCancelled);
  }
};
