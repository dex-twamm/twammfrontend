import React from "react";
import { Box, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import AdjustIcon from "@mui/icons-material/Adjust";

import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import { ShortSwapContext } from "../providers";
import { truncateAddress } from "../utils";
import { UIContext } from "../providers/context/UIProvider";
import { disconnect } from "../utils/disconnectWallet";
import { getBlockExplorerAddressUrl } from "../utils/networkUtils";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LaunchIcon from "@mui/icons-material/Launch";

import styles from "../css/DisconnectWalletOption.module.css";

const DisconnectWalletOption = ({ showDisconnect, setShowDisconnect }) => {
  const { account, setAccount, setWalletConnected, setBalance } =
    useContext(ShortSwapContext);
  const handleClose = () => setShowDisconnect(false);
  const { selectedNetwork } = useContext(UIContext);

  const handleDisconnectWallet = () => {
    disconnect(setAccount, setWalletConnected, setBalance);
    setShowDisconnect(false);
  };

  return (
    <Box className={styles.containerBox}>
      <Modal
        open={showDisconnect}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className={styles.contentBox}
          sx={{ minWidth: { xs: "95%", sm: 500, md: 425 } }}
        >
          <Box className={styles.headerBox}>
            <span className={styles.headerTypography}>Account</span>
            <Button onClick={handleClose}>
              <CloseIcon fontSize="large" sx={{ color: "#f50057" }} />
            </Button>
          </Box>

          <Box className={styles.infoBox}>
            <Box className={styles.infoTopBox}>
              <span
                className={styles.connectionInfoTypography}
                id="modal-modal-title"
              >
                Wallet Connected
              </span>

              <Button
                className={styles.disconnectButton}
                onClick={handleDisconnectWallet}
                size="small"
                disableFocusRipple
                sx={{
                  p: { md: "0px 9px", sm: "0px 9px", xs: "0px 15px" },
                  fontSize: { sm: "16px", xs: "14px" },
                }}
                variant="outlined"
              >
                Disconnect
              </Button>
            </Box>

            <Box className={styles.infoMiddleBox}>
              <AdjustIcon
                sx={{ color: "blue", mr: 1, fontSize: 30, fontWeight: 800 }}
              />
              {account ? (
                <span className={styles.addressTypography}>
                  {truncateAddress(account)}
                </span>
              ) : (
                <span className={styles.dotTypography}>....</span>
              )}
            </Box>

            <Box className={styles.infoBottomBox}>
              {" "}
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(account);
                }}
                style={{ textTransform: "none" }}
              >
                <span className={styles.copyAddressTypography}>
                  <ContentCopyIcon
                    className={styles.copyIcon}
                    fontSize="large"
                  />
                  Copy Address
                </span>{" "}
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    `${getBlockExplorerAddressUrl(
                      selectedNetwork?.network
                    )}${account}`,
                    "_blank"
                  )
                }
                style={{ textTransform: "none" }}
              >
                <span className={styles.viewTypography}>
                  <LaunchIcon className={styles.viewIcon} fontSize="medium" />
                  View on Explorer
                </span>
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export { DisconnectWalletOption };
