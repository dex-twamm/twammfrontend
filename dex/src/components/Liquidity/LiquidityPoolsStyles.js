import { styled } from "@mui/system";
import { Box, Button, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";

export const RootBox = styled(Box)({
  width: "fit-content",
  padding: "8px",
  borderRadius: "20px",
  dispay: "flex",
  justifyContent: "center",
  margin: "auto",
  fontFamily: "Open Sans",
});

export const ContainerBox = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});

export const StyledTypography = styled(Typography)({
  fontSize: "22px",
  color: "#333333",
  fontWeight: "600",
});

export const HeadingBox = styled(Box)({
  display: "flex",
  padding: "24px 0",
});

export const PoolTypography = styled(Typography)({
  fontSize: "22px",
  fontFamily: "Open Sans",
  color: "#333333",
  fontWeight: "600",
});

export const ContentBox = styled(Box)({
  display: "flex",
  alignItems: "center",
});

export const InsideContentBox = styled(Box)({
  bgcolor: " white",
  width: "100%",
  padding: "8px",
  borderRadius: "20px",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%), rgba(255, 255, 255, 0.3)",
  backdropFilter: "blur(2px)",

  border: "1px solid white",
});

export const StyledBoxOne = styled(Box)({
  marginTop: "5px",
  //   width: { sm: "60%", xs: "100%", md: "70%" },
});

export const StyledBoxTwo = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  boxSizing: "border-box",
  padding: "4px",
  minWidth: "100%",
  height: "auto",
});

export const StyledBoxThree = styled(Box)({
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  alignItems: "center",
  height: "2%",
  paddingBottom: "20px",
});

export const StyledBoxFour = styled(Box)({
  display: "flex",
  columnGap: "20px",
  alignItems: "center",
  margin: "14px",
});

export const StyledBoxFive = styled(Box)({
  display: "flex",
  alignItems: "center",
});

export const StyledAvatarOne = styled(Avatar)({
  background: "blue",
  height: "40px",
  width: "40px",
});

export const StyledAvatarTwo = styled(Avatar)({
  left: "-10px",
  background: "green",
  height: "40px",
  width: "40px",
});

export const TokensTypography = styled(Typography)({
  marginRight: "4px",
  fontWeight: 500,
  color: "#333333",
  fontFamily: "Open Sans",
});

export const FeeTypography = styled(Typography)({
  padding: "8px 24px",
  border: "1px solid #fdeaf1",
  color: "red",
  fontFamily: "Open Sans",
  fontWeight: 500,
  background: "#EE4D3745",
  borderRadius: "17px",
});

export const BalanceInfoBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  margin: "8px",
  width: "fit-content",
  paddingBottom: "20px",
});

export const BalanceInfoTypography = styled(Typography)({
  fontWeight: 500,
  display: "inline",
  color: "grey",
  fontFamily: "Open Sans",
});

export const BalanceTypography = styled(Typography)({
  fontWeight: 400,
  display: "inline",
  color: "#333333",
  fontFamily: "Open Sans",
});

export const ButtonsBox = styled(Box)({
  margin: "8px",
  display: "flex",
  flexDirection: "column-reverse",
  rowGap: "10px",
  alignItems: "center",
});

export const RemoveLiquidityButton = styled(Button)({
  fontFamily: "Open Sans",
  padding: "12px 100px",
  outline: "none",
  color: "white",
  fontWeight: "400",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  backgroundColor: "#FF6969",
  borderRadius: "17px",
  width: "100%",
});

export const AddLiquidityButton = styled(Button)({
  fontFamily: "Open Sans",
  padding: "12px 100px",
  outline: "none",
  color: "white",
  fontWeight: "400",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  backgroundColor: "#554994",
  borderRadius: "17px",
  width: "100%",
});
