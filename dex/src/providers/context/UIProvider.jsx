import { createContext, useState } from "react";

const UIContext = createContext(null);

const UIProvider = ({ children }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const nId = window.ethereum?.networkVersion;

  const [selectedNetwork, setSelectedNetwork] = useState({
    network: "Select a Network",
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
