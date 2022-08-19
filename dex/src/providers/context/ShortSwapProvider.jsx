import { useState } from "react";
import { createContext } from "react";

export const ShortSwapContext = createContext(null);

export const ShortSwapProvider = ({ children }) => {
  const [swapAmount, setSwapAmount] = useState("");
  const [srcAddress, setSrcAddress] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [equivalentAmount, setEquivalentAmount] = useState("");

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
      }}
    >
      {children}
    </ShortSwapContext.Provider>
  );
};
