import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

const CircularProgressBar = ({ margin, label }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        position: "relative",
        marginTop: margin,
      }}
    >
      <Box sx={{ color: "text.primary", fontSize: 20, fontWeight: "medium" }}>
        {label}
      </Box>
      <CircularProgress />
    </Box>
  );
};

export default CircularProgressBar;
