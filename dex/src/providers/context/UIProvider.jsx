import { createContext, useContext, useState } from "react";
import ethLogo from "../../images/ethereum.svg";
import { NETWORKS } from "../../utils/networks";

const UIContext = createContext(null);

export const useNetwork = () => {
  const { selectedNetwork } = useContext(UIContext);
  return selectedNetwork;
};

const UIProvider = ({ children }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  window.ethereum?.enable();
  const nId = window.ethereum?.networkVersion;
  console.log("window.ethereum", nId, window.ethereum);

  const initialNetwork = NETWORKS.find((nw) => nw.chainId === nId);

  const [selectedNetwork, setSelectedNetwork] = useState({
    network: initialNetwork.name,
    logo: initialNetwork.logo,
    chainId: initialNetwork.chainId,
  });
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
