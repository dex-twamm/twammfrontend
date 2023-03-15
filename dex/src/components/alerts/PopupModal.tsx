import { Alert, Backdrop, Button } from "@mui/material";
import { useEffect } from "react";
import { POPUP_MESSAGE } from "../../constants";
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
    setAllowTwammErrorMessage,
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
    setMessage("");
    setAllowTwammErrorMessage("");
  };

  const handleTransactonClose = () => {
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
            onClose={handleTransactonClose}
          >
            View Your Tx Progress
          </Alert>
        )}
        {message && (
          <Backdrop open={message !== "" ? true : false}>
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
                  handleAlertClose();
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
