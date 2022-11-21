import { getProvider } from "./getProvider";

export const connectWallet = async (
  setweb3provider,
  setCurrentBlock,
  setBalance,
  setAccount,
  setWalletConnected
) => {
  try {
    await getProvider(
      false,
      setweb3provider,
      setCurrentBlock,
      setBalance,
      setAccount,
      setWalletConnected
    );
    window.location.reload();
    // console.log("Wallet Connected Info", isWalletConnected);

    // setSuccess("Wallet Connected");
    // tokenBalance(account);
  } catch (err) {
    console.error(err);
    // setError('Wallet Connection Rejected');
  }
};
