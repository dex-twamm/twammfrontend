import React from "react";
import Swap from "../components/Swap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import PopupSettings from "../components/PopupSettings";
import styles from "../css/ShortSwap.module.css";
import lsStyles from "../css/LongSwap.module.css";

const valueLabel = (value) => {
  const sliderUnits = ["Min", "Hours", "Days", "Week", "Month"];
  let unitIndex = 0;
  let scaledValue = value;

  if (scaledValue > 43200 && unitIndex < sliderUnits.length - 1) {
    unitIndex = 4;
    scaledValue /= 43200;
  }
  if (scaledValue >= 10080 && unitIndex < sliderUnits.length - 1) {
    unitIndex = 3;
    scaledValue /= 10080;
  } else if (scaledValue >= 1440 && unitIndex < sliderUnits.length - 1) {
    unitIndex = 2;
    scaledValue /= 1440;
  } else if (scaledValue >= 300 && unitIndex < sliderUnits.length - 1) {
    unitIndex = 1;
    scaledValue /= 300;
  } else if (scaledValue >= 60 && unitIndex < sliderUnits.length - 1) {
    scaledValue /= 60;
  }
  return `${scaledValue.toFixed(0)} ${sliderUnits[unitIndex]}`;
};

//   while (scaledValue >= 60 && unitIndex < sliderUnits.length - 1) {
//     unitIndex += 1;
//     scaledValue /= 60;
//   }
//   return `${scaledValue.toFixed(1)} ${sliderUnits[unitIndex]}`;
// };

const calculateValue = (value) => {
  // position will be between 0 and 100
  const minp = 0;
  const maxp = 100;
  const minV = Math.log(60);
  const maxV = Math.log(43200);
  var scale = (maxV - minV) / (maxp - minp);
  return Math.exp(minV + scale * (value - minp));
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
        <Swap
          tokenSymbol={tokenSymbol}
          tokenImage={tokenImage}
          connectWallet={connectWallet}
          buttonText={buttonText}
        />
        <div className={lsStyles.rangeSelect}>
          <Box sx={{ width: "90%", margin: "0 auto" }}>
            <Typography fontWeight={600} id="non-linear-slider" gutterBottom>
              Time: {valueLabel(calculateValue(value))}
            </Typography>
            <Slider
              value={value}
              min={1}
              step={2}
              max={100}
              sx={{
                height: 15,
                width: 1,
                color: "#ffaac9",
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
      </div>
    </div>
  );
};

export default LongSwap;
