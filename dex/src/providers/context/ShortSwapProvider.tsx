import { createContext, useContext, useState } from "react";

interface ShortSwapProviderProps {
  children: React.ReactNode;
}

const useShortSwapState = () => {
  const [swapAmount, setSwapAmount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [tokenBalances, setTokenBalances] = useState<
    { [key: string]: number }[]
  >([]);
  const [transactionHash, setTransactionHash] = useState("");
  const [selectToken, setSelectToken] = useState("");
  const [ethBalance, setEthBalance] = useState(0);
  const [account, setAccount] = useState("");
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [expectedSwapOut, setExpectedSwapOut] = useState(0);
  const [tolerance, setTolerance] = useState(0.5);
  const [deadline, setDeadline] = useState(30);
  const [formErrors, setFormErrors] = useState<{
    balError: string | undefined;
  }>({ balError: undefined });
  const [web3provider, setweb3provider] = useState<any>();
  const [currentBlock, setCurrentBlock] = useState<any>();
  const [spotPrice, setSpotPrice] = useState(0);
  const [LPTokenBalance, setLPTokenBalance] = useState(0);
  const [balance, setBalance] = useState(0);
  const [spotPriceLoading, setSpotPriceLoading] = useState(false);
  const [allowTwammErrorMessage, setAllowTwammErrorMessage] =
    useState<string>("");

  return {
    swapAmount,
    setSwapAmount,
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
    account,
    setAccount,
    isWalletConnected,
    setWalletConnected,
    expectedSwapOut,
    setExpectedSwapOut,
    tolerance,
    setTolerance,
    deadline,
    setDeadline,
    formErrors,
    setFormErrors,
    web3provider,
    setweb3provider,
    currentBlock,
    setCurrentBlock,
    spotPrice,
    setSpotPrice,
    LPTokenBalance,
    setLPTokenBalance,
    balance,
    setBalance,
    spotPriceLoading,
    setSpotPriceLoading,
    allowTwammErrorMessage,
    setAllowTwammErrorMessage,
  };
};

type ShortSwapContextValue = ReturnType<typeof useShortSwapState>;

const ShortSwapProvider: React.FC<ShortSwapProviderProps> = ({ children }) => {
  const swapState = useShortSwapState();
  return (
    <ShortSwapContext.Provider value={swapState}>
      {children}
    </ShortSwapContext.Provider>
  );
};

const ShortSwapContext = createContext<ShortSwapContextValue | null>(null);

export const useShortSwapContext = () => {
  const context = useContext(ShortSwapContext);
  if (!context) {
    throw new Error(
      "useShortSwapContext must be used inside ShortSwapProvider!"
    );
  }
  return context;
};

export { ShortSwapProvider };
