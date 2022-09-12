import { createContext, useState } from "react";

export const ShortSwapProvider = ({ children }) => {
  const [swapAmount, setSwapAmount] = useState(0);
  const [srcAddress, setSrcAddress] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [equivalentAmount, setEquivalentAmount] = useState("");
  const [networkId, setNetworkId] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState();
  const [tokenBalances, setTokenBalances] = useState("");
  const [transactionHash, setTransactionHash] = useState();
  const [selectToken, setSelectToken] = useState("");
  const [ethBalance, setEthBalance] = useState("");
  const [poolCash, setPoolCash] = useState("");

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
        setLoading,
        loading,
        success,
        setSuccess,
        tokenBalances,
        setTokenBalances,
        transactionHash,
        setTransactionHash,
        selectToken,
        setSelectToken,
        ethBalance,
        setEthBalance,
        poolCash,
        setPoolCash,
      }}
    >
      {children}
    </ShortSwapContext.Provider>
  );
};

export const ShortSwapContext = createContext(null);
