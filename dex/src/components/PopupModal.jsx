import { Alert, Backdrop, CircularProgress } from "@mui/material";
import e from "cors";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { ShortSwapContext } from "../providers";

const PopupModal = () => {
  const { error, setError, success, setSuccess, loading, setLoading } =
    useContext(ShortSwapContext);

  // Timeout For Backdrop
  useEffect(() => {
    let timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setLoading("");
    setError("");
    setSuccess("");
  };

  const AlertStyle = {
    margin: "5px",
  };
  return (
    <>
      <div style={AlertStyle}>
        {error && (
          <Backdrop open={error ? true : false} onClose={handleClose}>
            <Alert severity="error" onClose={handleClose}>
              {error}
            </Alert>
          </Backdrop>
        )}
        {loading && (
          <Backdrop open={loading ? true : false} onClose={handleClose}>
            <CircularProgress />
          </Backdrop>
        )}
        {success && (
          <Backdrop open={success ? true : false} onClose={handleClose}>
            <Alert severity="success" onClose={handleClose}>
              {success}
            </Alert>
          </Backdrop>
        )}
      </div>
    </>
  );
};

export default PopupModal;
