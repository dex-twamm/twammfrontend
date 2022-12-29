import React from "react";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import AdjustIcon from "@mui/icons-material/Adjust";

import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import { ShortSwapContext } from "../providers";
import { truncateAddress } from "../utils";
import { UIContext } from "../providers/context/UIProvider";
import { disconnect } from "../utils/disconnectWallet";
import { getBlockExplorerAddressUrl } from "../utils/networkUtils";
import {
  ContainerBox,
  ContentBox,
  HeaderBox,
  HeaderTypography,
  InfoBox,
  InfoTopBox,
  ConnectionInfoTypography,
  DisconnectButton,
  InfoMiddleBox,
  AddressTypography,
  DotTypography,
  InfoBottomBox,
  CopyAddressTypography,
  CopyIcon,
  ViewTypography,
  ViewIcon,
} from "./DisconnectWalletOptionStyles";

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
    <ContainerBox>
      <Modal
        open={showDisconnect}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ContentBox sx={{ minWidth: { xs: "95%", sm: 500, md: 425 } }}>
          <HeaderBox>
            <HeaderTypography>Account</HeaderTypography>
            <Button onClick={handleClose}>
              <CloseIcon fontSize="large" sx={{ color: "#f50057" }} />
            </Button>
          </HeaderBox>

          <InfoBox>
            <InfoTopBox>
              <ConnectionInfoTypography id="modal-modal-title">
                Wallet Connected
              </ConnectionInfoTypography>

              <DisconnectButton
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
              </DisconnectButton>
            </InfoTopBox>

            <InfoMiddleBox>
              <AdjustIcon
                sx={{ color: "blue", mr: 1, fontSize: 30, fontWeight: 800 }}
              />
              {account ? (
                <AddressTypography>
                  {truncateAddress(account)}
                </AddressTypography>
              ) : (
                <DotTypography>....</DotTypography>
              )}
            </InfoMiddleBox>

            <InfoBottomBox>
              {" "}
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(account);
                }}
                style={{ textTransform: "none" }}
              >
                <CopyAddressTypography>
                  <CopyIcon fontSize="large" />
                  Copy Address
                </CopyAddressTypography>{" "}
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
                <ViewTypography>
                  <ViewIcon fontSize="medium" />
                  View on Explorer
                </ViewTypography>
              </Button>
            </InfoBottomBox>
          </InfoBox>
        </ContentBox>
      </Modal>
    </ContainerBox>
  );
};

export { DisconnectWalletOption };
