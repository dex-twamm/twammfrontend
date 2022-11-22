import { ethers } from "ethers";
import { POPUP_MESSAGE } from "../constants";
import { getProvider } from "./getProvider";
import { swapTokens } from "./swap";

export const _swapTokens = async (
  ethBalance,
  poolCash,
  swapAmount,
  setweb3provider,
  setCurrentBlock,
  setBalance,
  setAccount,
  setWalletConnected,
  srcAddress,
  destAddress,
  account,
  expectedSwapOut,
  tolerance,
  deadline,
  setTransactionHash,
  setMessage,
  setError,
  setLoading,
  currentNetwork = "Goerli"
) => {
  const walletBalanceWei = ethers.utils.parseUnits(ethBalance, "ether");
  const pCash = ethers.utils.parseUnits(poolCash, "ether");
  const swapAmountWei = ethers.utils.parseUnits(swapAmount, "ether");
  // console.log("Deadline", deadline);

  // swapAmountWei.lte(walletBalanceWei && poolCash)
  // 	? console.log('True')
  // 	: console.log('False');

  console.log(
    "walletBalanceWeisdasd",
    walletBalanceWei.toString(),
    pCash.toString(),
    swapAmountWei.toString()
  );
  if (swapAmountWei.lte(walletBalanceWei)) {
    try {
      const signer = await getProvider(
        true,
        setweb3provider,
        setCurrentBlock,
        setBalance,
        setAccount,
        setWalletConnected
      );
      // console.log(signer);
      const assetIn = srcAddress;
      const assetOut = destAddress;
      const walletAddress = account;

      console.log("hkhaskhaskjdasd", currentNetwork);
      // Call the swapTokens function from the `utils` folder
      await swapTokens(
        signer,
        swapAmountWei,
        assetIn,
        assetOut,
        walletAddress,
        expectedSwapOut,
        tolerance,
        deadline,
        currentNetwork
      )
        .then((res) => {
          console.log("Responseeeee----->", res);
          setTransactionHash(res.hash);
          const swapResult = async (res) => {
            const result = await res.wait();
            return result;
          };
          swapResult(res).then((response) => {
            console.log("Responseeeeeee", response);
            if (response.status === 1)
              setMessage(POPUP_MESSAGE.shortSwapSuccess);
          });
        })
        .catch((err) => {
          console.error(err);
          setError(POPUP_MESSAGE.error);
        });
      setLoading(false);
    } catch (err) {
      console.error("errrrrrr", err);
      setLoading(false);
      setError(POPUP_MESSAGE.transactionCancelled);
    }
  } else {
    setLoading(false);
    setError(POPUP_MESSAGE.insufficientBalance);
  }
};
