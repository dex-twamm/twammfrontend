import { useEffect, useContext, createContext, useState } from "react";
import { NETWORKS } from "../../utils/networks";
import ethLogo from "../../images/ethereum.svg";

export interface SelectedNetworkType {
  network: string;
  logo: string;
  chainId: string;
  poolId: number;
}

interface NetworkProviderProps {
  children: React.ReactNode;
}

const useNetworkState = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<SelectedNetworkType>({
    network: "Ethereum",
    logo: ethLogo,
    chainId: "1",
    poolId: 0,
  });

  useEffect(() => {
    const { ethereum }: any = window;
    ethereum?.request({ method: "net_version" }).then((net_version: any) => {
      const initialNetwork = NETWORKS.find((nw) => nw.chainId === net_version)!;

      setSelectedNetwork({
        network: initialNetwork?.name,
        logo: initialNetwork?.logo,
        chainId: initialNetwork?.chainId,
        poolId: localStorage.getItem("poolId")
          ? parseFloat(localStorage.getItem("poolId")!)
          : 0,
      });
    });
  }, []);
  return {
    selectedNetwork,
    setSelectedNetwork,
  };
};

type NetworkStateValue = ReturnType<typeof useNetworkState>;

const NetworkStateProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const networkState = useNetworkState();
  return (
    <NetworkContext.Provider value={networkState}>
      {children}
    </NetworkContext.Provider>
  );
};

const NetworkContext = createContext<NetworkStateValue | null>(null);

export const useNetworkContext = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetworkContext must be used inside LongSwapProvider!");
  }
  return context;
};

export { NetworkStateProvider };
