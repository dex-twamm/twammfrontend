import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Box, MenuItem, Select, Slider, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMemo, useState } from "react";
import styles from "../../css/ShortSwap.module.css";
import lsStyles from "../../css/LongSwap.module.css";
import wStyles from "../../css/WithdrawLiquidity.module.css";

import PopupSettings from "../PopupSettings";
import Tabs from "../Tabs";
import WithdrawLiquidityPreview from "./WithdrawLiquidityPreview";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PopupModal from "../alerts/PopupModal";
import classNames from "classnames";
import { useShortSwapContext } from "../../providers/context/ShortSwapProvider";
import { useNetworkContext } from "../../providers/context/NetworkProvider";
import { TokenType } from "../../utils/pool";
import { useNavigate } from "react-router-dom";

interface PropTypes {
  selectedTokenPair: any;
  bptAmountIn: number;
}

const WithdrawLiquidity = ({ selectedTokenPair, bptAmountIn }: PropTypes) => {
  const { isWalletConnected } = useShortSwapContext();
  const { selectedNetwork } = useNetworkContext();
  const navigate = useNavigate();

  const [showSettings, setShowSettings] = useState(false);

  const [selectValue, setSelectValue] = useState(1);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [sliderValue, setSliderValue] = useState(100);

  const currentNetwork = useMemo(() => {
    return {
      ...selectedNetwork,
      poolId: selectedTokenPair[2],
    };
  }, [selectedNetwork, selectedTokenPair]);

  const handlePreviewClick = () => {
    setShowPreviewModal(true);
  };

  return (
    <>
      <div className={styles.container}>
        <Tabs />
        <div className={styles.mainBody}>
          <div className={styles.swap}>
            <div className={styles.swapOptions}>
              <p className={styles.textLink}>Withdraw from Pool</p>
              <div className={styles.poolAndIcon}>
                <ArrowBackIcon
                  className={wStyles.backIcon}
                  onClick={() => navigate("/liquidity")}
                />
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
              <div className={wStyles.selectTokenSection}>
                <div className={wStyles.tokensAndAmt}>
                  <Select
                    className={wStyles.selectBox}
                    inputProps={{ "aria-label": "Without label" }}
                    value={selectValue}
                    onChange={(e) => {
                      setSelectValue(+e.target.value);
                    }}
                    variant="outlined"
                    sx={{
                      outline: "none",
                    }}
                  >
                    <MenuItem value={1}>
                      <div className={wStyles.menuItems}>
                        <Box className={wStyles.styledBoxFive}>
                          <Avatar
                            className={wStyles.styledAvatarOne}
                            alt="Testv4"
                            src={selectedTokenPair[0].logo}
                            sx={{ width: "28px", height: "28px" }}
                          />
                          <Avatar
                            className={wStyles.styledAvatarTwo}
                            sx={{ width: "28px", height: "28px" }}
                            alt="Faucet"
                            src={selectedTokenPair[1].logo}
                          />
                        </Box>
                        <span className={wStyles.optionText}>All tokens</span>
                      </div>
                    </MenuItem>
                    {selectedTokenPair
                      ?.slice(0, selectedTokenPair.length - 1)
                      .map((itm: TokenType, index: number) => (
                        <MenuItem value={index + 2} key={index}>
                          <div className={wStyles.menuItems}>
                            <img
                              src={itm?.logo}
                              alt=""
                              height={30}
                              width={30}
                            />
                            <span className={wStyles.optionText}>
                              {itm?.name}
                            </span>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  <p className={wStyles.amount}>$0.00</p>
                </div>
                <div className={wStyles.sliderPart}>
                  <div className={wStyles.proportional}>
                    <p>Proportional withdrawal</p>
                    <p>{sliderValue}%</p>
                  </div>
                  <Slider
                    value={sliderValue}
                    min={0}
                    step={1}
                    max={100}
                    sx={{
                      height: 8,
                      width: 1,
                      color: "#6D64A5",
                    }}
                    onChange={(e) =>
                      setSliderValue(
                        parseFloat((e.target as HTMLInputElement).value)
                      )
                    }
                    aria-labelledby="non-linear-slider"
                  />
                </div>
              </div>
              <div className={wStyles.tokensList}>
                {selectedTokenPair
                  .slice(0, selectedTokenPair.length - 1)
                  ?.map((el: TokenType, idx: number) => (
                    <div className={wStyles.items} key={idx}>
                      <div className={wStyles.tokenInfo}>
                        <img src={el?.logo} alt="" height={30} width={30} />
                        <p>{el?.symbol} 50%</p>
                      </div>
                      <div className={wStyles.amt}>
                        <p>0.05</p>
                        <span>$0.00</span>
                      </div>
                    </div>
                  ))}
              </div>
              <div className={wStyles.priceImpact}>
                <div className={wStyles.impact}>
                  <p>Price Impact</p>
                </div>
                <div className={wStyles.number}>
                  <p>
                    0.00%
                    <Tooltip
                      arrow
                      placement="top"
                      title="Withdrawing custom amounts causes the internal prices of the pool to change, as if you were swapping tokens. The higher the price impact the more you'll spend in swap fees"
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </Tooltip>
                  </p>
                </div>
              </div>
              <button
                className={classNames(
                  wStyles.btn,
                  wStyles.btnConnect,
                  wStyles.btnBtn
                )}
                onClick={handlePreviewClick}
              >
                {!isWalletConnected ? "Connect Wallet" : "Preview"}
              </button>
            </Box>
          </div>

          <WithdrawLiquidityPreview
            showPreviewModal={showPreviewModal}
            setShowPreviewModal={setShowPreviewModal}
            bptAmountIn={bptAmountIn}
            currentNetwork={currentNetwork}
          />
        </div>
        <PopupModal />
      </div>
    </>
  );
};

export default WithdrawLiquidity;
