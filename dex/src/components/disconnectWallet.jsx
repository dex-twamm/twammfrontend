import React, { useState } from "react";
const DisconnectWallet = (props) => {
  const { setDisplay, display } = props;
  // Handle Modal Close
  const handleModalClose = () => {
    setDisplay(!display);
  };
  return <>{display && <p>Hello</p>}</>;
};

export default DisconnectWallet;
