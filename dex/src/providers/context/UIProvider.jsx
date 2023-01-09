import { useEffect } from "react";
import { createContext, useState } from "react";
import { NETWORKS } from "../../utils/networks";

const UIContext = createContext(null);

const UIProvider = ({ children }) => {
  const [selectedNetwork, setSelectedNetwork] = useState();
  const [nId, setNetId] = useState();
  const [poolNumber, setPoolNumber] = useState(0);

  useEffect(() => {
    window.ethereum?.request({ method: "net_version" }).then((net_version) => {
      const initialNetwork = NETWORKS.find((nw) => nw.chainId === net_version);
      setNetId(net_version);
      setSelectedNetwork({
        network: initialNetwork?.name,
        logo: initialNetwork?.logo,
        chainId: initialNetwork?.chainId,
      });
    });
  }, []);

  return (
    <UIContext.Provider
      value={{
        selectedNetwork,
        setSelectedNetwork,
        nId,
        poolNumber,
        setPoolNumber,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export { UIProvider, UIContext };
