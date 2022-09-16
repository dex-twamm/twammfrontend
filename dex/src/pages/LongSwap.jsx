import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useContext, useState } from "react";
import LongTermOrderCard from "../components/LongTermOrderCard";
import LongTermSwapCardDropdown from "../components/LongTermSwapCardDropdown";
import PopupSettings from "../components/PopupSettings";
import Swap from "../components/Swap";
import lsStyles from "../css/LongSwap.module.css";
import styles from "../css/ShortSwap.module.css";
import { LongSwapContext } from "../providers";

const LongSwap = (props) => {
  const {
    tokenSymbol,
    tokenImage,
    connectWallet,
    buttonText,
    cancelPool,
    withdrawPool,
  } = props;

  const [showSettings, setShowSettings] = useState(false);
  const { orderLogsDecoded,tokenB } = useContext(LongSwapContext);
  const ethLogsCount = orderLogsDecoded
    ? Object.keys(orderLogsDecoded).length
    : 0;
  const cardListCount = ethLogsCount;
  console.log("Logs Count", ethLogsCount, cardListCount);

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

          {/* {showSettings && <PopupSettings />} */}
        </div>
        <Swap
          swapType="long"
          tokenSymbol={tokenSymbol}
          tokenImage={tokenImage}
          connectWallet={connectWallet}
          buttonText={buttonText}
        />
      </div>
      {/* {isPlacedLongTermOrder && ( */}
      <div className={lsStyles.ordersWrapper}>
        <h4 className={lsStyles.longTermText}>Your Long Term Orders</h4>
        <div className={styles.scroller}>
          <div
            className={classNames(
              lsStyles.longTermOrderCard,
              cardListCount > 2 && lsStyles.scrollable
            )}
          >
            <LongTermOrderCard
              cancelPool={cancelPool}
              withdrawPool={withdrawPool}
            ></LongTermOrderCard>

              <div style={{with:'100%',height:'80px',paddingTop:'30px'}}>
                <LongTermSwapCardDropdown open={true} tokenB={tokenB}/>
              

              </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongSwap;
