import { Modal, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import styles from "../../css/AddLiquidityPreview.module.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { _withdrawPoolLiquidity } from "../../utils/_withdrawPoolLiquidity";
import { useShortSwapContext } from "../../providers/context/ShortSwapProvider";
import { useLongSwapContext } from "../../providers/context/LongSwapProvider";
import { SelectedNetworkType } from "../../providers/context/NetworkProvider";
import { Dispatch, SetStateAction } from "react";
import { TokenType } from "../../utils/pool";
import { getPoolTokens } from "../../utils/poolUtils";
import { BigNumber, ethers } from "ethers";
import { getProperFixedValue } from "../../utils";

interface PropTypes {
  showPreviewModal: boolean;
  setShowPreviewModal: Dispatch<SetStateAction<boolean>>;
  bptAmountIn: number;
  currentNetwork: SelectedNetworkType;
  tokens: TokenType;
  selectValue: number;
  inputValue: number;
  priceImpactValue: number;
  tokenValueOfBpt: number[];
  dollarValueOfToken: number;
}
const WithdrawLiquidityPreview = ({
  showPreviewModal,
  setShowPreviewModal,
  bptAmountIn,
  currentNetwork,
  tokens,
  selectValue,
  inputValue,
  priceImpactValue,
  tokenValueOfBpt,
  dollarValueOfToken,
}: PropTypes) => {
  const { web3provider, account, setTransactionHash, setLoading, setError } =
    useShortSwapContext();

  const { setMessage } = useLongSwapContext();
  const poolTokens = getPoolTokens(currentNetwork);

  const handleClose = () => {
    setShowPreviewModal(false);
  };

  console.log("bptAmountIsadasdn", bptAmountIn);

  const handleRemoveLiquidity = async () => {
    try {
      if (selectValue === 1) {
        const bptAmountInBig = BigNumber.from(bptAmountIn.toString());
        await _withdrawPoolLiquidity(
          account,
          web3provider,
          currentNetwork,
          bptAmountInBig,
          setTransactionHash,
          setMessage,
          setLoading,
          setError,
          setShowPreviewModal
        );
      } else {
        const bptAmountInBig = ethers.utils.parseUnits(
          inputValue.toString(),
          tokens.decimals
        );
        await _withdrawPoolLiquidity(
          account,
          web3provider,
          currentNetwork,
          bptAmountInBig,
          setTransactionHash,
          setMessage,
          setLoading,
          setError,
          setShowPreviewModal
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal
        open={showPreviewModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.boxStyle}>
          <p className={styles.modalTitle}>Withdraw Liquidity Preview</p>
          {selectValue !== 1 ? (
            <div className={styles.tokenAndLogo}>
              <p className={styles.amount}>
                {inputValue} {tokens?.symbol}
              </p>
              <div className={styles.logo}>
                <img src={tokens.logo} alt="logo" width="30px" height="30px" />
              </div>
            </div>
          ) : (
            <>
              <div className={styles.tokenAndLogo}>
                <p className={styles.amount}>
                  {getProperFixedValue(tokenValueOfBpt[0])}{" "}
                  {poolTokens[0].symbol}
                </p>
                <div className={styles.logo}>
                  <img
                    src={poolTokens[0].logo}
                    alt="logo"
                    width="30px"
                    height="30px"
                  />
                </div>
              </div>
              <div className={styles.tokenAndLogo}>
                <p className={styles.amount}>
                  {getProperFixedValue(tokenValueOfBpt[1])}{" "}
                  {poolTokens[1].symbol}
                </p>
                <div className={styles.logo}>
                  <img
                    src={poolTokens[1].logo}
                    alt="logo"
                    width="30px"
                    height="30px"
                  />
                </div>
              </div>
            </>
          )}
          <div className={styles.summary}>
            <p className={styles.title}>Summary</p>
            <div className={styles.content}>
              <div className={styles.item}>
                <p className={styles.total}>Total</p>
                <p className={styles.data}>
                  ${dollarValueOfToken.toFixed(2)}
                  {"  "}
                  <span>
                    <Tooltip
                      arrow
                      placement="top"
                      title="The total value in USD you'll be withdrawing from this pool."
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </Tooltip>
                  </span>
                </p>
              </div>
              <div className={styles.item}>
                <p className={styles.total}>Price impact</p>
                <p className={styles.data}>
                  {priceImpactValue === 0.01
                    ? "<.01"
                    : getProperFixedValue(priceImpactValue)}
                  %
                  <span>
                    <Tooltip
                      arrow
                      placement="top"
                      title="Price impact from removing liquidity results when the value of each token removed is not proportional to the weights of the pool. Removing non-proportional amounts causes the internal prices of the pool to change, as if you were swapping tokens. The higher the price impact, the worse price you'll get for exiting your position."
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </Tooltip>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <button className={styles.btn} onClick={handleRemoveLiquidity}>
            Withdraw Liquidity{" "}
          </button>
        </Box>
      </Modal>
    </>
  );
};

export default WithdrawLiquidityPreview;
