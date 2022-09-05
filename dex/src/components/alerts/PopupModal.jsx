import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Snackbar,
  SnackbarContent,
} from "@mui/material";
import { Stack } from "@mui/system";
import e from "cors";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { ShortSwapContext } from "../../providers";

const PopupModal = () => {
  const {
    error,
    setError,
    success,
    setSuccess,
    loading,
    setLoading,
    transactionHash,
    setTransactionHash,
  } = useContext(ShortSwapContext);

  // Timeout For Backdrop
  useEffect(() => {
    let timer = setTimeout(() => {
      setError("");
      setSuccess("");
      setTransactionHash("");
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setLoading("");
    setError("");
    setSuccess("");
    setTransactionHash("");
  };
  const handleButtonClick = () => {
    window.open(`https://goerli.etherscan.io/tx/${transactionHash}`);
  };

  const buttonAction = <button onClick={handleButtonClick}>View</button>;

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
      <div>
        {transactionHash && (
          <Stack spacing={2} sx={{ maxWidth: 600 }}>
            <SnackbarContent
              message="Your Tx Details"
              open={transactionHash ? true : false}
              onClose={handleClose}
              action={buttonAction}
            ></SnackbarContent>
          </Stack>
        )}
      </div>
    </>
  );
};

export default PopupModal;
