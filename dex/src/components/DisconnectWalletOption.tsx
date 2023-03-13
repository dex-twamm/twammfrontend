import React, { Dispatch, SetStateAction } from "react";
import { Box, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import { ShortSwapContext } from "../providers";
import { truncateAddress } from "../utils";
import { UIContext } from "../providers/context/UIProvider";
import { disconnect } from "../utils/disconnectWallet";
import { getBlockExplorerAddressUrl } from "../utils/networkUtils";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LaunchIcon from "@mui/icons-material/Launch";

import metaMaskLogo from "../images/metamask.svg";
import coinbaseLogo from "../images/coinbase.svg";

import styles from "../css/DisconnectWalletOption.module.css";

interface PropTypes {
  showDisconnect: boolean;
  setShowDisconnect: Dispatch<SetStateAction<boolean>>;
}

const DisconnectWalletOption = ({
  showDisconnect,
  setShowDisconnect,
}: PropTypes) => {
  const { account, setAccount, setWalletConnected, setBalance } =
    useContext(ShortSwapContext)!;
  const handleClose = () => setShowDisconnect(false);
  const { selectedNetwork } = useContext(UIContext)!;

  const handleDisconnectWallet = () => {
    disconnect(setAccount, setWalletConnected, setBalance);
    setShowDisconnect(false);
  };
  const getConnectedWalletIcon = () => {
    const wallet = localStorage.getItem("walletConnection");
    if (wallet?.includes("metamask")) return metaMaskLogo;
    else if (wallet?.includes("coinbase")) return coinbaseLogo;
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

            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <img
                src={getConnectedWalletIcon()}
                alt=""
                height="30"
                width="30"
                style={{ marginRight: "5px" }}
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
                    `${getBlockExplorerAddressUrl(selectedNetwork)}${account}`,
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
