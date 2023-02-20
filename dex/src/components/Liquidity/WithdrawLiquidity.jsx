import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Box, MenuItem, Select, Slider, Tooltip } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import styles from "../../css/ShortSwap.module.css";
import lsStyles from "../../css/LongSwap.module.css";
import wStyles from "../../css/WithdrawLiquidity.module.css";

import PopupSettings from "../PopupSettings";
import Tabs from "../Tabs";
import { getTokensBalance } from "../../utils/getAmount";
import { ShortSwapContext } from "../../providers";
import WithdrawLiquidityPreview from "./WithdrawLiquidityPreview";
import maticLogo from "../../images/maticIcon.png";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PopupModal from "../alerts/PopupModal";
import classNames from "classnames";

const WithdrawLiquidity = ({ selectedTokenPair, bptAmountIn }) => {
  const { account, web3provider, isWalletConnected } =
    useContext(ShortSwapContext);
  const [showSettings, setShowSettings] = useState(false);
  const [balanceOfToken, setBalanceOfToken] = useState();
  const [selectValue, setSelectValue] = useState(1);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [sliderValue, setSliderValue] = useState(100);

  useEffect(() => {
    const selectedNetwork = {
      network: selectedTokenPair[0]?.network,
      poolId: selectedTokenPair[0]?.poolId,
    };
    const getTokenBalance = async () => {
      const tokenBalance = await getTokensBalance(
        web3provider?.getSigner(),
        account,
        selectedNetwork
      );
      setBalanceOfToken(tokenBalance);
    };
    getTokenBalance();
  }, [account, web3provider, selectedTokenPair]);

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
                      setSelectValue(e.target.value);
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
                    {selectedTokenPair?.map((itm, index) => (
                      <MenuItem value={index + 2}>
                        <div className={wStyles.menuItems}>
                          <img src={itm?.logo} alt="" height={30} width={30} />
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
                    <p>Proportional withdrawl</p>
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
                    onChange={(e) => setSliderValue(e.target.value)}
                    aria-labelledby="non-linear-slider"
                  />
                </div>
              </div>
              <div className={wStyles.tokensList}>
                {selectedTokenPair?.map((el, idx) => (
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
            selectedTokenPair={selectedTokenPair}
          />
        </div>
        <PopupModal />
      </div>
    </>
  );
};

export default WithdrawLiquidity;
