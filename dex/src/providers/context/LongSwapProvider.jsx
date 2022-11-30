import { createContext, useContext, useState } from "react";
// import {
//   FAUCET_TOKEN_ADDRESS,
//   MATIC_TOKEN_ADDRESS,
//   POOL_ID,
// } from "../../utils";
import { POOLS } from "../../utils/pool";
import { ShortSwapContext } from "./ShortSwapProvider";
import ethLogo from "../../images/ethereum.png";
import { useNetwork } from "./UIProvider";
import { getPoolNetworkValues } from "../../utils/poolUtils";

export const LongSwapProvider = ({ children }) => {
  const [sliderValue, setSliderValue] = useState(1);

  const [orderLogsDecoded, setOrderLogsDecoded] = useState([]);
  const [latestBlock, setLatestBlock] = useState("");
  const [numberOfBlockIntervals, setNumberOfBlockIntervals] = useState(1);
  const [targetDate, setTargetDate] = useState("");
  const [allowance, setAllowance] = useState("");
  const [message, setMessage] = useState("");
  const [disableActionBtn, setDisableActionBtn] = useState(false);
  const [orderLogsLoading, setOrderLogsLoading] = useState(false);
  const [longSwapFormErrors, setLongSwapFormErrors] = useState();
  const [longSwapVerifyLoading, setLongSwapVerifyLoading] = useState(false);
  const { tokenBalances } = useContext(ShortSwapContext);
  const currentNetwork = useNetwork();

  let networkName = currentNetwork?.network;
  if (
    !networkName ||
    networkName === "undefined" ||
    networkName === "Select a Network"
  ) {
    networkName = "Ethereum";
  }
  console.log("networkName", networkName);
  const poolConfig = getPoolNetworkValues(networkName);
  const [tokenA, setTokenA] = useState({
    ...poolConfig?.tokens[0],
    balance: 0,
    tokenIsSet: poolConfig?.tokens[0].address ? true : false,
  });

  const [tokenB, setTokenB] = useState({
    ...poolConfig?.tokens[1],
    balance: 0,
    tokenIsSet: poolConfig?.tokens[1].address ? true : false,
  });

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
        latestBlock,
        setLatestBlock,
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
