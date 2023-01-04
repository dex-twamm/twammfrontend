import { Alert, Backdrop, Button } from "@mui/material";
import { useEffect } from "react";
import { useContext } from "react";
import { POPUP_MESSAGE } from "../../constants";
import { LongSwapContext, ShortSwapContext } from "../../providers";
import { UIContext } from "../../providers/context/UIProvider";
import { getBlockExplorerTransactionUrl } from "../../utils/networkUtils";

const PopupModal = () => {
  const {
    error,
    setError,
    success,
    setSuccess,
    transactionHash,
    setTransactionHash,
  } = useContext(ShortSwapContext);

  const { message, setMessage } = useContext(LongSwapContext);

  const { selectedNetwork } = useContext(UIContext);

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
    setMessage("");
  };

  const handleTransactonClose = () => {
    setTransactionHash("");
  };

  const handleButtonClick = () => {
    window.open(
      `${getBlockExplorerTransactionUrl(
        selectedNetwork?.network
      )}${transactionHash}`
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
            <Alert
              severity="success"
              onClose={() => {
                handleClose();
              }}
            >
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

        {message && (
          <Backdrop
            open={
              typeof message !== "undefined" || message !== "" ? true : false
            }
            onClose={handleClose}
          >
            <Alert
              severity={
                message === POPUP_MESSAGE.ltoCancelFailed ||
                message === POPUP_MESSAGE.ltoWithdrawFailed ||
                message === POPUP_MESSAGE.ltoPlaceFailed
                  ? "error"
                  : "success"
              }
              onClose={() => {
                if (
                  message === POPUP_MESSAGE.ltoCancelSuccess ||
                  message === POPUP_MESSAGE.ltoWithdrawn ||
                  message === POPUP_MESSAGE.ltoPlaced
                ) {
                  handleClose();
                  window.location.reload();
                } else {
                  handleClose();
                }
              }}
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
