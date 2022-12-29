import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LaunchIcon from "@mui/icons-material/Launch";

export const ContainerBox = styled(Box)({
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  background: "white",
  borderRadius: 4,
});

export const ContentBox = styled(Box)({
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "flex-start",
  fontSize: "1.2vmax",
  fontWeight: "200",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#F7F8FA",
  borderRadius: "16px",
  paddingTop: "10px",
});

export const HeaderBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
});

export const HeaderTypography = styled(Typography)({
  color: "#333333",
  fontWeight: 500,
  fontSize: "22px",
  marginLeft: "16px",
});

export const InfoBox = styled(Box)({
  width: "95%",
  height: "25%",
  margin: "auto",
  padding: "16px",
  boxSizing: "border-box",
  border: "1px solid  #808080",
  borderRadius: "15px",
  marginBottom: "10px",
  marginTop: "10px",
});

export const InfoTopBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const ConnectionInfoTypography = styled(Typography)({
  width: "50%",
  fontWeight: 500,
  fontSize: "16px",
  fontFamily: "Open Sans",
  color: "#333333",
  marginRight: "5px",
});

export const DisconnectButton = styled(Button)({
  marginRight: "10px",
  color: "#f50057",
  textTransform: "capitalize",
  borderRadius: "12px",
  border: "1px solid #f50057",
  "&:hover": {
    border: "1px solid #f50057",
  },
});

export const InfoMiddleBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginTop: 2,
});

export const AddressTypography = styled(Typography)({
  marginRight: "8px",
  fontSize: "18px",
  fontWeight: 600,
  width: 200,
  color: "black",
  overflow: "hidden",
});

export const DotTypography = styled(Typography)({
  marginRight: "8px",
  fontSize: 30,
  fontWeight: 600,
  color: "#333333",
});

export const InfoBottomBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginTop: "16px",
  justifyContent: "space-between",
});

export const CopyAddressTypography = styled(Typography)({
  display: "flex",
  alignItems: "center",
  color: "#f50057",
  fontWeight: 400,
  marginRight: "16px",
  fontSize: "16px",
});

export const CopyIcon = styled(ContentCopyIcon)({
  marginRight: "4px",
  color: "#f50057",
  fontWeight: 400,
  fontSize: "14px",
});

export const ViewTypography = styled(Typography)({
  display: "flex",
  alignItems: "center",
  fontWeight: "bold",
  fontSize: "16px",
  fontFamily: "Open Sans",
});

export const ViewIcon = styled(LaunchIcon)({
  color: "#808080",
  marginRight: "8px",
  fontSize: "14px",
});
