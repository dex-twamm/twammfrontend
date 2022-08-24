import React from "react";
import Swap from "../components/Swap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import PopupSettings from "../components/PopupSettings";
import classNames from "classnames";
import styles from "../css/ShortSwap.module.css";
import { createTheme, ThemeProvider } from "@mui/system";
import { orange } from "@mui/material/colors";

const valueLabel = (value) => {
  const sliderUnits = ["Min", "Hours", "Days", "Week"];
  let unitIndex = 0;
  let scaledValue = value;
  while (scaledValue >= 60 && unitIndex < sliderUnits.length - 1) {
    unitIndex += 1;
    scaledValue /= 60;
  }
  return `${scaledValue} ${sliderUnits[unitIndex]}`;
};

const calculateValue = (value) => {
  return 2 ** value;
};
const LongSwap = ({ tokenSymbol, tokenImage, connectWallet, buttonText }) => {
  const [value, setValue] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const handleChange = (e, newValue) => {
    if (typeof newValue === "number") {
      setValue(newValue);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.mainBody}>
        <div className={styles.swap}>
          <div className={styles.swapOptions}>
            <a className={styles.textLink} href="/">
              Long Term Swap
            </a>
            <FontAwesomeIcon
              className={styles.settingsIcon}
              icon={faGear}
              onClick={() => setShowSettings(!showSettings)}
            />
          </div>

          {showSettings && <PopupSettings />}
        </div>
        <Swap tokenSymbol={tokenSymbol} tokenImage={tokenImage} />

        <div className="range-select">
          <Box sx={{ width: 250 }}>
            <Typography id="non-linear-slider" gutterBottom>
              Time: {valueLabel(calculateValue(value))}
            </Typography>
            <Slider
              value={value}
              min={1}
              step={2}
              max={12}
              sx={{
                height: 15,
                width: 450,
                color: "secondary.main",
              }}
              scale={calculateValue}
              getAriaValueText={valueLabel}
              valueLabelFormat={valueLabel}
              onChange={handleChange}
              valueLabelDisplay="auto"
              aria-labelledby="non-linear-slider"
            />
          </Box>
        </div>
        <button
          className={classNames(styles.btn, styles.btnConnect)}
          onClick={connectWallet}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default LongSwap;
