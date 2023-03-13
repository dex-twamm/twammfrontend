import { useEffect, Dispatch, SetStateAction } from "react";
import { createContext, useState } from "react";
import { NETWORKS } from "../../utils/networks";
import ethLogo from "../../images/ethereum.svg";

interface SelectedNetworkType {
  network: string;
  logo: string;
  chainId: string;
  poolId: number;
}

interface UIContextType {
  selectedNetwork: SelectedNetworkType;
  setSelectedNetwork: Dispatch<SetStateAction<SelectedNetworkType>>;
}

interface UIProviderProps {
  children: React.ReactNode;
}

const UIContext = createContext<UIContextType | null>(null);

const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
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

  return (
    <UIContext.Provider
      value={{
        selectedNetwork,
        setSelectedNetwork,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export { UIProvider, UIContext };
