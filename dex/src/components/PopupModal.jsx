import { Alert, Collapse } from "@mui/material";
import e from "cors";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { ShortSwapContext } from "../providers";

const PopupModal = (props) => {
  // const { errorDisplay } = props;
  const { error, setError } = useContext(ShortSwapContext);
  useEffect(() => {
    let timer = setTimeout(() => {
      setError("");
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const AlertStyle = {
    margin: "5px",
  };
  return (
    <>
      <div style={AlertStyle}>
        <Collapse in={error !== ""}>
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        </Collapse>
      </div>
    </>
  );
};

export default PopupModal;
