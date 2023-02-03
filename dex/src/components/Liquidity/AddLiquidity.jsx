import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import React, { useState } from "react";
import styles from "../../css/ShortSwap.module.css";
import lsStyles from "../../css/LongSwap.module.css";

import PopupSettings from "../PopupSettings";
import Tabs from "../Tabs";

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
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={lsStyles.main} />
            <Box className={lsStyles.mainBox}>
              <Input
                id={1}
                input={swapAmount ? swapAmount : ""}
                placeholder="0.0"
                onChange={(e) => {
                  setSwapAmount(e.target.value);
                }}
                imgSrc={tokenA?.logo}
                symbol={tokenA?.symbol}
                handleDisplay={handleDisplay}
                selectToken={selectToken}
                display={display}
                setDisplay={setDisplay}
                setTokenA={setTokenA}
                setTokenB={setTokenB}
              />
              <Input
                id={2}
                input={
                  expectedSwapOut
                    ? bigToStr(BigNumber.from(expectedSwapOut), tokenB.decimals)
                    : ""
                }
                placeholder=""
                imgSrc={tokenB?.logo}
                symbol={tokenB?.symbol}
                onChange={(e) => e.target.value}
                handleDisplay={handleDisplay}
                selectToken={selectToken}
                display={display}
                setDisplay={setDisplay}
                setTokenA={setTokenA}
                setTokenB={setTokenB}
              />
            </Box>
          </form>
        </div>
        {/* <PopupModal /> */}
      </div>
    </>
  );
};

export default AddLiquidity;
