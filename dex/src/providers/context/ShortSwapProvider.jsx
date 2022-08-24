import { useState } from "react";
import { createContext } from "react";

export const ShortSwapProvider = ({ children }) => {
  const [swapAmount, setSwapAmount] = useState("");
  const [srcAddress, setSrcAddress] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [equivalentAmount, setEquivalentAmount] = useState("");
  const [networkId, setNetworkId] = useState();
  const [error, setError] = useState("");

  return (
    <ShortSwapContext.Provider
      value={{
        swapAmount,
        setSwapAmount,
        equivalentAmount,
        setEquivalentAmount,
        srcAddress,
        setSrcAddress,
        destAddress,
        setDestAddress,
        networkId,
        setNetworkId,
        error,
        setError,
      }}
    >
      {children}
    </ShortSwapContext.Provider>
  );
};

export const ShortSwapContext = createContext(null);
