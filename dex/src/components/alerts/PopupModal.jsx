import { Alert, Backdrop, Button, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useContext } from "react";
import { ShortSwapContext } from "../../providers";

const PopupModal = ({ isPlacedLongTermOrder, setIsPlacedLongTermOrder }) => {
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
    setTransactionHash("");
    setIsPlacedLongTermOrder(false);
  };
  const handleButtonClick = () => {
    window.open(`https://goerli.etherscan.io/tx/${transactionHash}`);
  };

  const buttonAction = <Button onClick={handleButtonClick}>View</Button>;

  console.log("<---Transaction hash--->", transactionHash);

  console.log("successs", success);

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
            onClose={handleClose}
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
              Transaction success!
            </Alert>
          </Backdrop>
        )}
      </div>
    </>
  );
};

export default PopupModal;
