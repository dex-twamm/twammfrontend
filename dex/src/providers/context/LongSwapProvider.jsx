import { useState, createContext } from "react";

export const LongSwapProvider = ({ children }) => {
  const [sliderValue, setSliderValue] = useState(1);

  const [sliderValueUnit, setSliderValueUnit] = useState("Min");

  return (
    <LongSwapContext.Provider
      value={{
        sliderValue,
        setSliderValue,
        sliderValueUnit,
        setSliderValueUnit,
      }}
    >
      {children}
    </LongSwapContext.Provider>
  );
};

export const LongSwapContext = createContext(null);
