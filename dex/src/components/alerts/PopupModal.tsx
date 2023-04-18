import { Alert, Backdrop, Button } from "@mui/material";
import { useEffect } from "react";
import { useLongSwapContext } from "../../providers/context/LongSwapProvider";
import { useShortSwapContext } from "../../providers/context/ShortSwapProvider";
import { useNetworkContext } from "../../providers/context/NetworkProvider";
import { getBlockExplorerTransactionUrl } from "../../utils/networkUtils";

const PopupModal: React.FC = () => {
  const {
    error,
    setError,
    success,
    setSuccess,
    transactionHash,
    setTransactionHash,
    setAllowTwamErrorMessage,
  } = useShortSwapContext();

  const { message, setMessage } = useLongSwapContext();

  const { selectedNetwork } = useNetworkContext();

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

  const handleAlertClose = () => {
    handleClose();
    window.location.reload();
  };

  const handleClose = () => {
    setError("");
    setSuccess("");
    setTransactionHash("");
    setMessage({ status: "", message: "" });
    setAllowTwamErrorMessage("");
  };

  const handleTransactionClose = () => {
    setTransactionHash("");
  };

  const handleButtonClick = () => {
    window.open(
      `${getBlockExplorerTransactionUrl(selectedNetwork)}${transactionHash}`
    );
  };

  const buttonAction = <Button onClick={handleButtonClick}>View</Button>;

  const AlertStyle = {
    margin: "5px",
    background: "rgba(255, 255, 255, 0.5)",
  };

  return (
    <>
      <div style={AlertStyle}>
        {error && (
          <Backdrop open={error ? true : false}>
            <Alert severity="error" onClose={handleClose}>
              {error}
            </Alert>
          </Backdrop>
        )}

        {success && (
          <Backdrop open={success ? true : false} component="div">
            <Alert severity="success" onClose={handleAlertClose}>
              {success}
            </Alert>
          </Backdrop>
        )}
        {transactionHash && (
          <Alert
            variant="outlined"
            severity="info"
            action={buttonAction}
            onClose={handleTransactionClose}
          >
            View Your Tx Progress
          </Alert>
        )}
        {message.message && (
          <Backdrop open={message.message !== "" ? true : false}>
            <Alert
              severity={
                message.status && message.status === "failed"
                  ? "error"
                  : "success"
              }
              onClose={() => {
                if (message.status === "success") {
                  handleAlertClose();
                } else {
                  handleClose();
                }
              }}
            >
              {message.message}
            </Alert>
          </Backdrop>
        )}
      </div>
    </>
  );
};

export default PopupModal;
