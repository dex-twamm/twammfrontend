import { BigNumber } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";

import { getPoolConfig } from "../../utils/poolUtils";

import { useNetworkContext } from "./NetworkProvider";
import { TokenType } from "../../utils/pool";

interface LongSwapProviderProps {
  children: React.ReactNode;
}

export interface TokenState extends TokenType {
  balance: number;
  tokenIsSet: boolean;
}

const useLongSwapState = () => {
  const [sliderValue, setSliderValue] = useState(1);
  const [orderLogsDecoded, setOrderLogsDecoded] = useState<any>([]);
  const [lastVirtualOrderBlock, setLastVirtualOrderBlock] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [numberOfBlockIntervals, setNumberOfBlockIntervals] = useState(0);
  const [targetDate, setTargetDate] = useState("");
  const [allowance, setAllowance] = useState("");
  const [message, setMessage] = useState("");
  const [disableActionBtn, setDisableActionBtn] = useState(false);
  const [orderLogsLoading, setOrderLogsLoading] = useState(false);
  const [longSwapFormErrors, setLongSwapFormErrors] = useState<{
    balError: string | undefined;
  }>({ balError: undefined });
  const [longSwapVerifyLoading, setLongSwapVerifyLoading] = useState(false);
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

  const { selectedNetwork } = useNetworkContext();
  useEffect(() => {
    const poolConfig = getPoolConfig(selectedNetwork);
    if (!poolConfig) {
      throw new Error("Pool not found for the selected network!");
    }
    setTokenA({
      ...poolConfig?.tokens[0],
      balance: 0,
      tokenIsSet: poolConfig?.tokens[0].address ? true : false,
    });

    setTokenB({
      ...poolConfig?.tokens[1],
      balance: 0,
      tokenIsSet: poolConfig?.tokens[1].address ? true : false,
    });
  }, [selectedNetwork]);

  return {
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
  };
};

type LongSwapContextValue = ReturnType<typeof useLongSwapState>;

const LongSwapProvider: React.FC<LongSwapProviderProps> = ({ children }) => {
  const swapState = useLongSwapState();
  return (
    <LongSwapContext.Provider value={swapState}>
      {children}
    </LongSwapContext.Provider>
  );
};

const LongSwapContext = createContext<LongSwapContextValue | null>(null);

export const useLongSwapContext = () => {
  const context = useContext(LongSwapContext);
  if (!context) {
    throw new Error("useLongSwapContext must be used inside LongSwapProvider!");
  }
  return context;
};

export { LongSwapProvider };
