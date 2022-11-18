import { createContext, useContext, useState } from "react";
// import {
//   FAUCET_TOKEN_ADDRESS,
//   MATIC_TOKEN_ADDRESS,
//   POOL_ID,
// } from "../../utils";
import { POOLS, POOL_ID } from "../../utils/pool";
import { ShortSwapContext } from "./ShortSwapProvider";

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
  const { tokenBalances } = useContext(ShortSwapContext);

  console.log("Token Balances ", tokenBalances);
  const [tokenA, setTokenA] = useState({
    symbol: "Faucet",
    image: "/ethereum.png",
    address: Object?.values(
      POOLS?.[localStorage.getItem("coin_name") ?? "Goerli"]
    )?.[0].tokens[1].address,
    balance: 0,
    tokenIsSet: false,
  });

  const [tokenB, setTokenB] = useState({
    symbol: "Select Token",
    image: "/ethereum.png",
    address: Object?.values(
      POOLS?.[localStorage.getItem("coin_name") ?? "Goerli"]
    )?.[0].tokens[0].address,
    balance: 0,
    tokenIsSet: false,
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
      }}
    >
      {children}
    </LongSwapContext.Provider>
  );
};

export const LongSwapContext = createContext(null);
