import { createContext, useContext, useEffect, useState } from "react";

import { getPoolConfig } from "../../utils/poolUtils";

import { UIContext } from "./UIProvider";

export const LongSwapProvider = ({ children }) => {
  const [sliderValue, setSliderValue] = useState(1);
  const [orderLogsDecoded, setOrderLogsDecoded] = useState([]);
  const [lastVirtualOrderBlock, setLastVirtualOrderBlock] = useState("");
  const [numberOfBlockIntervals, setNumberOfBlockIntervals] = useState(0);
  const [targetDate, setTargetDate] = useState("");
  const [allowance, setAllowance] = useState("");
  const [message, setMessage] = useState("");
  const [disableActionBtn, setDisableActionBtn] = useState(false);
  const [orderLogsLoading, setOrderLogsLoading] = useState(false);
  const [longSwapFormErrors, setLongSwapFormErrors] = useState();
  const [longSwapVerifyLoading, setLongSwapVerifyLoading] = useState(false);
  const [tokenA, setTokenA] = useState();
  const [tokenB, setTokenB] = useState();

  const { selectedNetwork, poolNumber } = useContext(UIContext);

  useEffect(() => {
    const poolConfig = getPoolConfig(selectedNetwork?.network, poolNumber);
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

export const LongSwapContext = createContext(null);
