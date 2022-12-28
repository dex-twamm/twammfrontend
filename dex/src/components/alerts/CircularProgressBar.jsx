import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { styled } from "@mui/system";

export const RootBox = styled(Box)((props) => ({
  textAlign: "center",
  position: "relative",
  marginTop: props.margin,
}));

export const LabelBox = styled(Box)({
  color: "text.primary",
  fontSize: 20,
  fontWeight: "medium",
});

const CircularProgressBar = ({ margin, label, loading }) => {
  return (
    <RootBox margin={margin}>
      <LabelBox>{label}</LabelBox>
      <CircularProgress disableShrink={loading} />
    </RootBox>
  );
};

export default CircularProgressBar;
