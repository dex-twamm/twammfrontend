import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { styled } from "@mui/system";

interface PropTypes {
  margin?: string;
  label?: string;
  loading?: boolean;
}

interface RootBoxProps {
  margin?: string;
}

export const RootBox = styled(Box)((props: RootBoxProps) => ({
  textAlign: "center",
  position: "relative",
  marginTop: props.margin,
}));

export const LabelBox = styled(Box)({
  color: "text.primary",
  fontSize: 20,
  fontWeight: "medium",
});

const CircularProgressBar = ({ margin, label, loading }: PropTypes) => {
  return (
    <RootBox margin={margin}>
      <LabelBox>{label}</LabelBox>
      <CircularProgress disableShrink={loading} />
    </RootBox>
  );
};

export default CircularProgressBar;
