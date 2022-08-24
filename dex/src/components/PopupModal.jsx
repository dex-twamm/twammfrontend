import { Alert, Backdrop, CircularProgress } from "@mui/material";
import e from "cors";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { ShortSwapContext } from "../providers";

const PopupModal = (props) => {
  // const { errorDisplay } = props;
  const { error, setError, success, setSuccess, loading } =
    useContext(ShortSwapContext);
  useEffect(() => {
    let timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
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
        {error && (
          <Backdrop open={error}>
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          </Backdrop>
        )}
        {loading && (
          <Backdrop open={loading}>
            <CircularProgress />
          </Backdrop>
        )}
        {success && (
          <Backdrop open={success}>
            <Alert severity="success" onClose={() => setSuccess("")}>
              {success}
            </Alert>
          </Backdrop>
        )}
      </div>
    </>
  );
};

export default PopupModal;
