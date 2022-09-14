import { createContext, useContext, useState } from "react";
import { FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS } from "../../utils";
import { ShortSwapContext } from "./ShortSwapProvider";

export const LongSwapProvider = ({ children }) => {
  const [sliderValue, setSliderValue] = useState(1);

  const [sliderValueInSec, setSliderValueInSec] = useState(60);

  const [sliderValueUnit, setSliderValueUnit] = useState("Min");
  const [orderLogsDecoded, setOrderLogsDecoded] = useState();
  const [latestBlock, setLatestBlock] = useState("");

  const [sliderDate, setSliderDate] = useState("");
  const { tokenBalances } = useContext(ShortSwapContext);

  console.log("Token Balances ", tokenBalances);
  const [tokenA, setTokenA] = useState({
    symbol: "Faucet",
    image: "/ethereum.png",
    address: FAUCET_TOKEN_ADDRESS,
    balance: 0,
    tokenIsSet: false,
  });

  const [tokenB, setTokenB] = useState({
    symbol: "Select Token",
    image: "",
    address: MATIC_TOKEN_ADDRESS,
    balance: 0,
    tokenIsSet: false,
  });

  return (
    <LongSwapContext.Provider
      value={{
        sliderValue,
        setSliderValue,
        sliderValueUnit,
        setSliderValueUnit,
        sliderValueInSec,
        setSliderValueInSec,
        tokenA,
        setTokenA,
        tokenB,
        setTokenB,
        sliderDate,
        setSliderDate,
        orderLogsDecoded,
        setOrderLogsDecoded,
        latestBlock,
        setLatestBlock,
      }}
    >
      {children}
    </LongSwapContext.Provider>
  );
};

export const LongSwapContext = createContext(null);
