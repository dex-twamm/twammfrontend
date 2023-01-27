import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getTokenLogo } from "../../utils/api";

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

  const { selectedNetwork } = useContext(UIContext);
  useEffect(() => {
    const poolConfig = getPoolConfig(selectedNetwork);
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

  const tokenAId = tokenA?.name?.toLowerCase();
  const tokenBId = tokenB?.name?.toLowerCase();

  useEffect(() => {
    const getTokenALogo = async () => {
      const logo = await getTokenLogo(tokenAId);
      setTokenA({ ...tokenA, logo: logo });
    };
    const getTokenBLogo = async () => {
      const logo = await getTokenLogo(tokenBId);
      setTokenB({ ...tokenB, logo: logo });
    };
    if (tokenAId) getTokenALogo();
    if (tokenBId) getTokenBLogo();
  }, [tokenAId, tokenBId]);

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
