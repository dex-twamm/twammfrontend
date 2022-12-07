import { getProvider } from "./getProvider";
import { NETWORKS } from "./networks";

export const connectWallet = async (
  setweb3provider,
  setCurrentBlock,
  setBalance,
  setAccount,
  setWalletConnected,
  setSelectedNetwork,
  nId
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

    const initialNetwork = NETWORKS.find((nw) => nw.chainId === nId);
    setSelectedNetwork({
      network: initialNetwork?.name,
      logo: initialNetwork?.logo,
      chainId: initialNetwork?.chainId,
    });
  } catch (err) {
    console.error(err);
  }
};
