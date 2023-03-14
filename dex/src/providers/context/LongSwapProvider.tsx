import { BigNumber } from "ethers";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { getPoolConfig } from "../../utils/poolUtils";

import { UIContext } from "./UIProvider";
import { TokenType } from "../../utils/pool";

interface LongSwapProviderProps {
  children: React.ReactNode;
}

export interface TokenState extends TokenType {
  balance: number;
  tokenIsSet: boolean;
}

interface LongSwapContextValue {
  sliderValue: number;
  setSliderValue: Dispatch<SetStateAction<number>>;
  tokenA: TokenState;
  setTokenA: Dispatch<SetStateAction<TokenState>>;
  tokenB: TokenState;
  setTokenB: Dispatch<SetStateAction<TokenState>>;
  targetDate: string | undefined;
  setTargetDate: Dispatch<SetStateAction<string | undefined>>;
  orderLogsDecoded: any;
  setOrderLogsDecoded: Dispatch<SetStateAction<any>>;
  lastVirtualOrderBlock: BigNumber | undefined;
  setLastVirtualOrderBlock: Dispatch<SetStateAction<BigNumber | undefined>>;
  numberOfBlockIntervals: number;
  setNumberOfBlockIntervals: Dispatch<SetStateAction<number>>;
  allowance: string;
  setAllowance: Dispatch<SetStateAction<string>>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  disableActionBtn: boolean;
  setDisableActionBtn: Dispatch<SetStateAction<boolean>>;
  orderLogsLoading: boolean;
  setOrderLogsLoading: Dispatch<SetStateAction<boolean>>;
  longSwapFormErrors: {
    balError: string | undefined;
  };
  setLongSwapFormErrors: Dispatch<
    SetStateAction<{
      balError: string | undefined;
    }>
  >;
  longSwapVerifyLoading: boolean;
  setLongSwapVerifyLoading: Dispatch<SetStateAction<boolean>>;
}

const LongSwapProvider: React.FC<LongSwapProviderProps> = ({ children }) => {
  const [sliderValue, setSliderValue] = useState<number>(1);
  const [orderLogsDecoded, setOrderLogsDecoded] = useState<any>([]);
  const [lastVirtualOrderBlock, setLastVirtualOrderBlock] =
    useState<BigNumber>();
  const [numberOfBlockIntervals, setNumberOfBlockIntervals] =
    useState<number>(0);
  const [targetDate, setTargetDate] = useState<string>();
  const [allowance, setAllowance] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [disableActionBtn, setDisableActionBtn] = useState<boolean>(false);
  const [orderLogsLoading, setOrderLogsLoading] = useState<boolean>(false);
  const [longSwapFormErrors, setLongSwapFormErrors] = useState<{
    balError: string | undefined;
  }>({ balError: undefined });
  const [longSwapVerifyLoading, setLongSwapVerifyLoading] =
    useState<boolean>(false);
  const [tokenA, setTokenA] = useState<TokenState>({
    symbol: "",
    name: "",
    decimals: 0,
    address: "",
    logo: "",
    balance: 0,
    tokenIsSet: false,
  });
  const [tokenB, setTokenB] = useState<TokenState>({
    symbol: "",
    name: "",
    decimals: 0,
    address: "",
    logo: "",
    balance: 0,
    tokenIsSet: false,
  });

  const { selectedNetwork } = useContext(UIContext)!;
  useEffect(() => {
    const poolConfig = getPoolConfig(selectedNetwork);
    setTokenA({
      ...poolConfig?.tokens[0]!,
      balance: 0,
      tokenIsSet: poolConfig?.tokens[0].address ? true : false,
    });

    setTokenB({
      ...poolConfig?.tokens[1]!,
      balance: 0,
      tokenIsSet: poolConfig?.tokens[1].address ? true : false,
    });
  }, [selectedNetwork]);

  return (
    <LongSwapContext.Provider
      value={{
        sliderValue,
        setSliderValue,
        tokenA,
        setTokenA,
        tokenB,
        setTokenB,
        targetDate,
        setTargetDate,
        orderLogsDecoded,
        setOrderLogsDecoded,
        lastVirtualOrderBlock,
        setLastVirtualOrderBlock,
        numberOfBlockIntervals,
        setNumberOfBlockIntervals,
        allowance,
        setAllowance,
        message,
        setMessage,
        disableActionBtn,
        setDisableActionBtn,
        orderLogsLoading,
        setOrderLogsLoading,
        longSwapFormErrors,
        setLongSwapFormErrors,
        longSwapVerifyLoading,
        setLongSwapVerifyLoading,
      }}
    >
      {children}
    </LongSwapContext.Provider>
  );
};

const LongSwapContext = createContext<LongSwapContextValue | null>(null);
export { LongSwapContext, LongSwapProvider };
