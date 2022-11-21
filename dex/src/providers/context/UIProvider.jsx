import { createContext, useContext, useState } from "react";

const UIContext = createContext(null);

export const useNetwork = () => {
  const { selectedNetwork } = useContext(UIContext);
  return selectedNetwork;
};

const UIProvider = ({ children }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const nId = window.ethereum?.networkVersion;

  const [selectedNetwork, setSelectedNetwork] = useState({
    network: "Goerli",
    logo: "",
    chainId: nId,
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
