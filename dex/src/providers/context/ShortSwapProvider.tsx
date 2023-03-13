import { providers } from "ethers";
import { createContext, Dispatch, SetStateAction, useState } from "react";

interface ShortSwapProviderProps {
  children: React.ReactNode;
}

interface ShortSwapContextValue {
  swapAmount: number;
  setSwapAmount: Dispatch<SetStateAction<number>>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  success: string;
  setSuccess: Dispatch<SetStateAction<string>>;
  tokenBalances: { [key: string]: number }[];
  setTokenBalances: Dispatch<SetStateAction<{ [key: string]: number }[]>>;
  transactionHash: string;
  setTransactionHash: Dispatch<SetStateAction<string>>;
  selectToken: string;
  setSelectToken: Dispatch<SetStateAction<string>>;
  ethBalance: number;
  setEthBalance: Dispatch<SetStateAction<number>>;
  account: string;
  setAccount: Dispatch<SetStateAction<string>>;
  isWalletConnected: boolean;
  setWalletConnected: Dispatch<SetStateAction<boolean>>;
  expectedSwapOut: number;
  setExpectedSwapOut: Dispatch<SetStateAction<number>>;
  tolerance: number;
  setTolerance: Dispatch<SetStateAction<number>>;
  deadline: number;
  setDeadline: Dispatch<SetStateAction<number>>;
  formErrors: {
    balError: string | undefined;
  };
  setFormErrors: Dispatch<
    SetStateAction<{
      balError: string | undefined;
    }>
  >;
  web3provider?: providers.Web3Provider | undefined;
  setweb3provider?: Dispatch<
    SetStateAction<providers.Web3Provider | undefined>
  >;
  currentBlock: any;
  setCurrentBlock: Dispatch<SetStateAction<any>>;
  spotPrice: number;
  setSpotPrice: Dispatch<SetStateAction<number>>;
  LPTokenBalance: number | undefined;
  setLPTokenBalance: Dispatch<SetStateAction<number | undefined>>;
  balance: number | undefined;
  setBalance: Dispatch<SetStateAction<number | undefined>>;
  spotPriceLoading: boolean;
  setSpotPriceLoading: Dispatch<SetStateAction<boolean>>;
  allowTwammErrorMessage: string;
  setAllowTwammErrorMessage: Dispatch<SetStateAction<string>>;
}

const ShortSwapProvider: React.FC<ShortSwapProviderProps> = ({ children }) => {
  const [swapAmount, setSwapAmount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [tokenBalances, setTokenBalances] = useState<
    { [key: string]: number }[]
  >([]);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [selectToken, setSelectToken] = useState<string>("");
  const [ethBalance, setEthBalance] = useState<number>(0);
  const [account, setAccount] = useState<string>("");
  const [isWalletConnected, setWalletConnected] = useState<boolean>(false);
  const [expectedSwapOut, setExpectedSwapOut] = useState<number>(0);
  const [tolerance, setTolerance] = useState<number>(0.5);
  const [deadline, setDeadline] = useState<number>(30);
  const [formErrors, setFormErrors] = useState<{
    balError: string | undefined;
  }>({ balError: undefined });
  const [web3provider, setweb3provider] = useState<providers.Web3Provider>();
  const [currentBlock, setCurrentBlock] = useState<any>();
  const [spotPrice, setSpotPrice] = useState<number>(0);
  const [LPTokenBalance, setLPTokenBalance] = useState<number>();
  const [balance, setBalance] = useState<number>();
  const [spotPriceLoading, setSpotPriceLoading] = useState<boolean>(false);
  const [allowTwammErrorMessage, setAllowTwammErrorMessage] =
    useState<string>("");

  return (
    <ShortSwapContext.Provider
      value={{
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
      }}
    >
      {children}
    </ShortSwapContext.Provider>
  );
};

const ShortSwapContext = createContext<ShortSwapContextValue | null>(null);
export { ShortSwapProvider, ShortSwapContext };
