import { Modal, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import styles from "../../css/AddLiquidityPreview.module.css";
import ethLogo from "../../images/ethereumIcon.png";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { LongSwapContext, ShortSwapContext } from "../../providers";
import { _addPoolLiquidity } from "../../utils/_addPoolLiquidity";

const AddLiquidityPreview = ({
  showPreviewModal,
  setShowPreviewModal,
  amountsIn,
  dollarValueOfInputAmount,
  tokenA,
}) => {
  // const { selectedNetwork } = useContext(UIContext);
  const selectedNetwork = { network: "Goerli", poolId: 2 };
  const { web3provider, account, setTransactionHash, setLoading, setError } =
    useContext(ShortSwapContext);

  const { setMessage } = useContext(LongSwapContext);

  const handleClose = () => {
    setShowPreviewModal(false);
  };

  const handleAddLiquidity = async () => {
    try {
      await _addPoolLiquidity(
        account,
        web3provider,
        selectedNetwork,
        amountsIn,
        setTransactionHash,
        setMessage,
        setLoading,
        setError
      );
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
          <p className={styles.modalTitle}>Add Liquidity Preview</p>
          <div className={styles.tokenAndLogo}>
            <p className={styles.amount}>
              {amountsIn[0]} {tokenA?.name}
            </p>
            <div className={styles.logo}>
              <img src={tokenA?.logo} alt="logo" width="40px" height="40px" />
            </div>
          </div>
          <div className={styles.summary}>
            <p className={styles.title}>Summary</p>
            <div className={styles.content}>
              <div className={styles.item}>
                <p className={styles.total}>Total</p>
                <p className={styles.data}>
                  ${dollarValueOfInputAmount}
                  {"  "}
                  <span>
                    <Tooltip
                      arrow
                      placement="top"
                      title="The total value in USD you'll be adding into this pool."
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </Tooltip>
                  </span>
                </p>
              </div>
              <div className={styles.item}>
                <p className={styles.total}>Price impact</p>
                <p className={styles.data}>
                  0.04%{"  "}
                  <span>
                    <Tooltip
                      arrow
                      placement="top"
                      title="Price impact from adding liquidity results when the value of each token added is not proportional to the weights of the pool. Adding non-proportional amounts cause the internal prices of the pool to change, as if you were swapping tokens. The higher the price impact, the worse price you'll get to enter your position."
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </Tooltip>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <button className={styles.btn} onClick={handleAddLiquidity}>
            Add Liquidity{" "}
          </button>
        </Box>
      </Modal>
    </>
  );
};

export default AddLiquidityPreview;
