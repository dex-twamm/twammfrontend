import { useState, createContext } from "react";

export const LongSwapProvider = ({ children }) => {
  const [sliderValue, setSliderValue] = useState(1);

  const [sliderValueInSec, setSliderValueInSec] = useState(60);

  const [sliderValueUnit, setSliderValueUnit] = useState("Min");

  return (
    <LongSwapContext.Provider
      value={{
        sliderValue,
        setSliderValue,
        sliderValueUnit,
        setSliderValueUnit,
        sliderValueInSec,
        setSliderValueInSec,
      }}
    >
      {children}
    </LongSwapContext.Provider>
  );
};

export const LongSwapContext = createContext(null);
