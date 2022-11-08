import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PopupModal from "../components/alerts/PopupModal";
import PopupSettings from "../components/PopupSettings";
import Swap from "../components/Swap";
import Tabs from "../components/Tabs";
import styles from "../css/ShortSwap.module.css";

const ShortSwap = ({
  tokenSymbol,
  tokenImage,
  connectWallet,
  buttonText,
  showSettings,
  setShowSettings,
  spotPriceLoading,
}) => {
  //   const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <Tabs />

        <div className={styles.mainBody}>
          <div className={styles.swap}>
            <div className={styles.swapOptions}>
              <a className={styles.textLink} href="/">
                Swap
              </a>
              <FontAwesomeIcon
                className={styles.settingsIcon}
                icon={faGear}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }}
              />
            </div>
            {showSettings && <PopupSettings />}
          </div>
          <Swap
            tokenSymbol={tokenSymbol}
            tokenImage={tokenImage}
            connectWallet={connectWallet}
            buttonText={buttonText}
            spotPriceLoading={spotPriceLoading}
          />
        </div>
      </div>
    </>
  );
};

export default ShortSwap;
