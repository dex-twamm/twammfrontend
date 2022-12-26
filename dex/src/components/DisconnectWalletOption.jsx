// Sagar
// import { Modal } from '@mui/material';
import React, { useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import AdjustIcon from "@mui/icons-material/Adjust";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Link } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import CloseIcon from "@mui/icons-material/Close";
import { height } from "@mui/system";
import { useContext } from "react";
import { ShortSwapContext } from "../providers";
import { truncateAddress } from "../utils";
import { HiExternalLink } from "react-icons/hi";
import styles from "../css/LongTermOrderCard.module.css";
import { POOLS, POOL_ID } from "../utils/pool";
import { UIContext } from "../providers/context/UIProvider";

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
  // minHeight:350,
  bgcolor: "#F7F8FA",
  boxShadow: 24,
  borderRadius: 4,
  pt: 2,
  // bgcolor:'red',
  // boxSizing:'border-box'
};

const DisconnectWalletOption = ({
  setOpen,
  open,
  disconnectWallet,
  change,
}) => {
  const { account } = useContext(ShortSwapContext);
  // const [open, setOpen] = useState(true);

  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { selectedNetwork } = useContext(UIContext);
  const wallet = localStorage.getItem("walletConnection");

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
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
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
                onClick={disconnectWallet}
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

              {/* <Button
                onClick={change}
                size="small"
                sx={{
                  p: { md: "0px 9px", sm: "0px 9px", xs: "0px 10px" },
                  color: "#f50057",
                  textTransform: "capitalize",
                  border: "1px solid #f50057",
                  borderRadius: "10px",
                  fontSize: { xs: "14px", sm: "16px" },
                  ":hover": { border: "1px solid #f50057" },
                }}
                variant="outlined"
              >
                Change
              </Button> */}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <img
                src={
                  wallet.includes("metamask")
                    ? "/MetaMask.png"
                    : wallet.includes("coinbase")
                    ? "/Coinbase.png"
                    : null
                }
                alt=""
                height="30"
                width="30"
                style={{ marginRight: "5px" }}
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
                    `${
                      Object.values(POOLS?.[selectedNetwork?.network])?.[0]
                        ?.ethersScanUrl
                    }${account}`,
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
          {/* <Box
            sx={{
              background: "#DCDCDC",
              width: "100%",
              height: 60,
              display: "flex",
              fontFamily: "Open Sans",
              justifyContent: "center",
              mt: 0,
              alignItems: "center",
              borderRadius: "0px 0px 16px 16px",
            }}
          >
            <Typography sx={{ fontFamily: "Open Sans" }}>
              {" "}
              Your transactions will appear here...
            </Typography>
          </Box> */}
        </Box>
      </Modal>
    </Box>
  );
};

export { DisconnectWalletOption };
