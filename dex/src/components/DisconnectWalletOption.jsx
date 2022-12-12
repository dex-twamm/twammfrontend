import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import AdjustIcon from "@mui/icons-material/Adjust";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LaunchIcon from "@mui/icons-material/Launch";
import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import { ShortSwapContext } from "../providers";
import { truncateAddress } from "../utils";
import { getPoolEthersScanUrl } from "../utils/poolUtils";
import { UIContext } from "../providers/context/UIProvider";
import { disconnect } from "../utils/disconnectWallet";

const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "flex-start",
  fontSize: "1.2vmax",
  fontWeight: 200,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: { xs: "95%", sm: 500, md: 425 },
  bgcolor: "#F7F8FA",
  boxShadow: 24,
  borderRadius: 4,
  pt: 2,
};

const DisconnectWalletOption = ({ setOpen, open, setShowDisconnect }) => {
  const { account, setAccount, setWalletConnected, setBalance } =
    useContext(ShortSwapContext);
  const handleClose = () => setOpen(false);
  const { selectedNetwork } = useContext(UIContext);

  const handleDisconnectWallet = () => {
    disconnect(setShowDisconnect, setAccount, setWalletConnected, setBalance);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        background: "white",
        borderRadius: 4,
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                color: "#333333",
                fontWeight: 500,
                fontSize: "22px",
                ml: 2,
              }}
            >
              Account
            </Typography>
            <Button onClick={handleClose}>
              <CloseIcon fontSize="large" sx={{ color: "#f50057" }} />
            </Button>
          </Box>

          <Box
            sx={{
              width: "95%",
              height: "25%",
              margin: "auto",
              p: 2,
              boxSizing: "border-box",
              border: "1px solid  #808080",
              borderRadius: "15px",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  width: "50%",
                  fontWeight: 300,
                  fontSize: "16px",
                  fontFamily: "Open Sans",
                  color: "#333333",
                  mr: "5px",
                }}
                id="modal-modal-title"
              >
                Wallet Connected
              </Typography>

              <Button
                onClick={handleDisconnectWallet}
                size="small"
                disableFocusRipple
                sx={{
                  p: { md: "0px 9px", sm: "0px 9px", xs: "0px 15px" },
                  mr: "10px",
                  color: "#f50057",
                  textTransform: "capitalize",
                  borderRadius: "12px",
                  border: "1px solid #f50057",
                  fontSize: { sm: "16px", xs: "14px" },
                  ":hover": { border: "1px solid #f50057" },
                }}
                variant="outlined"
              >
                Disconnect
              </Button>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <AdjustIcon
                sx={{ color: "blue", mr: 1, fontSize: 30, fontWeight: 800 }}
              />
              {account ? (
                <span
                  style={{
                    mr: 1,
                    fontSize: "18px",
                    fontWeight: 600,
                    width: 200,
                    color: "black",
                    overflow: "hidden",
                  }}
                >
                  {truncateAddress(account)}
                </span>
              ) : (
                <span
                  style={{
                    mr: 1,
                    fontSize: 30,
                    fontWeight: 600,
                    color: "#333333",
                  }}
                >
                  ....
                </span>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 2,
                justifyContent: "space-between",
              }}
            >
              {" "}
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(account);
                }}
                style={{ textTransform: "none" }}
              >
                <Typography
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#f50057",
                    fontWeight: 400,
                    marginRight: "16px",
                    fontSize: "16px",
                  }}
                >
                  <ContentCopyIcon
                    fontSize="samll"
                    sx={{
                      mr: "4px",
                      color: "#f50057",
                      fontWeight: 400,
                      fontSize: "14px",
                    }}
                  />
                  Copy Address
                </Typography>{" "}
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    `${getPoolEthersScanUrl(
                      selectedNetwork?.network
                    )}${account}`,
                    "_blank"
                  )
                }
                style={{ textTransform: "none" }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "grey",
                    fontWeight: "bold",
                    fontSize: "16px",
                    fontFamily: "Open Sans",
                  }}
                >
                  <LaunchIcon
                    fontSize="medium"
                    sx={{ color: "#808080", mr: 1, fontSize: "14px" }}
                  />
                  View on Explorer
                </Typography>
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export { DisconnectWalletOption };
