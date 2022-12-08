import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { NETWORKS } from "../../utils/networks";

const UIContext = createContext(null);

export const useNetwork = () => {
  const { selectedNetwork } = useContext(UIContext);
  if (selectedNetwork) return selectedNetwork;
};

const UIProvider = ({ children }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState();
  const [nId, setNetId] = useState();

  useEffect(() => {
    window.ethereum.request({ method: "net_version" }).then((net_version) => {
      const initialNetwork = NETWORKS.find((nw) => nw.chainId === net_version);
      setNetId(net_version);
      setSelectedNetwork({
        network: initialNetwork?.name,
        logo: initialNetwork?.logo,
        chainId: initialNetwork?.chainId,
      });
    });
  }, []);

  console.log("Current selected network", selectedNetwork);

  if (!selectedNetwork) return null;
  return (
    <UIContext.Provider
      value={{
        showDropdown,
        setShowDropdown,
        selectedNetwork,
        setSelectedNetwork,
        nId,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export { UIProvider, UIContext };
