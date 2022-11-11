import { Alert, Backdrop, Button, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useContext } from "react";
import { ShortSwapContext } from "../../providers";

const PopupModal = ({
  isPlacedLongTermOrder,
  setIsPlacedLongTermOrder,
  message,
  setMessage,
}) => {
  const {
    error,
    setError,
    success,
    setSuccess,
    transactionHash,
    setTransactionHash,
  } = useContext(ShortSwapContext);

  // Timeout For Backdrop
  useEffect(() => {
    let timer = setTimeout(() => {
      setError("");
      setSuccess("");
      setTransactionHash("");
    }, 15000);

    return () => {
      clearTimeout(timer);
    };
  });

  const handleClose = () => {
    setError("");
    setSuccess("");
    // setTransactionHash("");
    setIsPlacedLongTermOrder && setIsPlacedLongTermOrder(false);
    setMessage("");
  };

  const handleTransactonClose = () => {
    setTransactionHash("");
  };

  const handleButtonClick = () => {
    window.open(`https://goerli.etherscan.io/tx/${transactionHash}`);
  };

  const buttonAction = <Button onClick={handleButtonClick}>View</Button>;

  console.log("<---Transaction hash--->", transactionHash);

  console.log("successs", message ? true : false, message);

  const AlertStyle = {
    margin: "5px",
    background: "rgba(255, 255, 255, 0.5)",
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
        {/* {loading && (
          <Backdrop open={loading ? true : false} onClose={handleClose}>
            <CircularProgress />
          </Backdrop>
        )} */}
        {success && (
          <Backdrop open={success ? true : false} onClose={handleClose}>
            <Alert severity="success" onClose={handleClose}>
              {success}
            </Alert>
          </Backdrop>
        )}
        {transactionHash && (
          <Alert
            variant="outlined"
            severity="info"
            action={buttonAction}
            onClose={handleTransactonClose}
          >
            View Your Tx Progress
          </Alert>
        )}
        {isPlacedLongTermOrder && (
          <Backdrop
            open={isPlacedLongTermOrder ? true : false}
            onClose={handleClose}
          >
            <Alert severity="success" onClose={handleClose}>
              LTO Placed!
            </Alert>
          </Backdrop>
        )}
        {message && (
          <Backdrop
            open={
              typeof message !== "undefined" || message !== "" ? true : false
            }
            onClose={handleClose}
          >
            <Alert
              severity={
                message === "Cancel Failed !" || message === "Withdraw Failed !"
                  ? "error"
                  : "success"
              }
              onClose={handleClose}
            >
              {message}
            </Alert>
          </Backdrop>
        )}
      </div>
    </>
  );
};

export default PopupModal;
