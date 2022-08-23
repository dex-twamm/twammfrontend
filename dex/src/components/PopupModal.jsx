import { useContext } from "react";
import { useState } from "react";
import { ShortSwapContext } from "../providers";

const PopupModal = (props) => {
  const { errorDisplay } = props;
  const { error } = useContext(ShortSwapContext);
  console.log(error.code);
  const errors = [
    {
      errorCode: "4001",
      message: "User Rejected",
    },
  ];
  return (
    errorDisplay && (
      <>
        <div className="overlay"></div>
        <div className="error-modal">
          {errors.map((res) => {
            if (error.code === res.errorCode) {
              <p>{res.message}</p>;
            }
          })}
        </div>
      </>
    )
  );
};

export default PopupModal;
