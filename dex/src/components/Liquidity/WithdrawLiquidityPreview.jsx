import { Modal, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import styles from "../../css/AddLiquidityPreview.module.css";
import ethLogo from "../../images/ethereumIcon.png";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const WithdrawLiquidityPreview = ({
  showPreviewModal,
  setShowPreviewModal,
}) => {
  const handleClose = () => {
    setShowPreviewModal(false);
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
          <div className={styles.tokenAndLogo}>
            <p className={styles.amount}>0.001 ETH</p>
            <div className={styles.logo}>
              <img src={ethLogo} alt="logo" width="40px" height="40px" />
            </div>
          </div>
          <div className={styles.summary}>
            <p className={styles.title}>Summary</p>
            <div className={styles.content}>
              <div className={styles.item}>
                <p className={styles.total}>Total</p>
                <p className={styles.data}>
                  $0.0{"  "}
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
                  0.04%{"  "}
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
          <button
            className={styles.btn}
            // onClick={handlePreviewClick}
          >
            Withdraw Liquidity{" "}
          </button>
        </Box>
      </Modal>
    </>
  );
};

export default WithdrawLiquidityPreview;
