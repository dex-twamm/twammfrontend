import { useEffect } from "react";
import { createContext, useState } from "react";
import { NETWORKS } from "../../utils/networks";

const UIContext = createContext(null);

const UIProvider = ({ children }) => {
  const [selectedNetwork, setSelectedNetwork] = useState();
  const [nId, setNetId] = useState();

  useEffect(() => {
    window.ethereum?.request({ method: "net_version" }).then((net_version) => {
      const initialNetwork = NETWORKS.find((nw) => nw.chainId === net_version);
      setNetId(net_version);
      setSelectedNetwork({
        network: initialNetwork?.name,
        logo: initialNetwork?.logo,
        chainId: initialNetwork?.chainId,
      });
      // localStorage.setItem("network_name", initialNetwork?.name);
      // localStorage.setItem("network_logo", initialNetwork?.logo);
      // localStorage.setItem("chainId", initialNetwork?.chainId);
    });
  }, []);

  return (
    <UIContext.Provider
      value={{
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
