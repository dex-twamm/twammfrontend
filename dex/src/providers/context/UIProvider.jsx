import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { NETWORKS } from "../../utils/networks";

const UIContext = createContext(null);

export const useNetwork = () => {
  const { selectedNetwork } = useContext(UIContext);
  return selectedNetwork;
};

const UIProvider = ({ children }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState();

  useEffect(() => {
    window.ethereum.request({ method: "net_version" }).then((net_version) => {
      const initialNetwork = NETWORKS.find((nw) => nw.chainId === net_version);

      setSelectedNetwork({
        network: initialNetwork?.name,
        logo: initialNetwork?.logo,
        chainId: initialNetwork?.chainId,
      });
    });
  }, []);

  if (!selectedNetwork) return null;
  return (
    <UIContext.Provider
      value={{
        showDropdown,
        setShowDropdown,
        selectedNetwork,
        setSelectedNetwork,
        // nId,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export { UIProvider, UIContext };

//how to get promise result from a constant having value of promises?
