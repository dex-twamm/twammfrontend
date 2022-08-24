import { Alert, Collapse } from "@mui/material";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { ShortSwapContext } from "../providers";

const PopupModal = (props) => {
  const { errorDisplay } = props;
  const { error } = useContext(ShortSwapContext);
  const [open, setOpen] = useState(true);

  console.log("Error Displayed", error);
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const AlertStyle = {
    margin: "5px",
  };
  return (
    errorDisplay && (
      <>
        <div style={AlertStyle}>
          <Collapse in={open}>
            <Alert
              severity="error"
              onClose={() => {
                setOpen(false);
              }}
            >
              {error}
            </Alert>
          </Collapse>
        </div>
      </>
    )
  );
};

export default PopupModal;
