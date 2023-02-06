import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import React, { useState } from "react";
import styles from "../../css/ShortSwap.module.css";
import lsStyles from "../../css/LongSwap.module.css";
import bStyles from "../../css/AddLiquidity.module.css";

import PopupSettings from "../PopupSettings";
import Tabs from "../Tabs";
import classNames from "classnames";
import LiquidityInput from "./LiquidityInput";

const AddLiquidity = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <Tabs />
        <div className={styles.mainBody}>
          <div className={styles.swap}>
            <div className={styles.swapOptions}>
              <p className={styles.textLink}>Add Liquidity</p>
              <div className={styles.poolAndIcon}>
                <FontAwesomeIcon
                  className={styles.settingsIcon}
                  icon={faGear}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(!showSettings);
                  }}
                />
              </div>
            </div>
            {showSettings && <PopupSettings />}
          </div>
          <div className={styles.form}>
            <div className={lsStyles.main} />
            <Box className={lsStyles.mainBox}>
              <LiquidityInput />
              <LiquidityInput />
              <button
                className={classNames(bStyles.btn, bStyles.btnConnect)}
                // onClick={handleClick}
              >
                Add Liquidity
              </button>
            </Box>
          </div>
        </div>
        {/* <PopupModal /> */}
      </div>
    </>
  );
};

export default AddLiquidity;
