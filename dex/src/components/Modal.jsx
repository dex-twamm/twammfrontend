import React, { useState } from "react";
import { FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS } from "../utils";

const Modal = ({ display, setDisplay, setTokenA, setTokenB, selectToken }) => {
  const tokenDetails = [
    {
      symbol: "MATIC",
      image: "/ethereum.png",
      address: { MATIC_TOKEN_ADDRESS },
    },
    {
      symbol: "FAUCET",
      image:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
      address: { FAUCET_TOKEN_ADDRESS },
    },
  ];
  // Handle Select Token Modal display
  const handleModalClose = () => {
    setDisplay(!display);
  };
  const handleTokenSelection = (event) => {
    const token = event.currentTarget;
    console.log("Modal:Handle", token.children[2].innerHTML);
    if(selectToken === "2") {
      setTokenB({
        address: token.children[2].innerHTML,
        symbol: token.children[1].innerHTML,
        image: token.children[0].src.slice(21, token.length),
      });

    } else if(selectToken === "1") {
      setTokenA({
        address: token.children[2].innerHTML,
        symbol: token.children[1].innerHTML,
        image: token.children[0].src.slice(21, token.length),
      });
    }
  };

  return (
    <>
      {display ? (
        <div className="modal__wrapper">
          <div className="modal__container">
            <div className="modal__heading">Select a token</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className=""
              onClick={handleModalClose}
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <div className="modal__token-list">
            <div className="modal__token" onClick={handleTokenSelection}>
              <img
                className="modal__token-img"
                alt="ETH logo"
                src="/ethereum.png"
                style={{ marginRight: "8px", width: "20px" }}
              />
              <div className="modal__token-symbol" onClick={handleModalClose}>Faucet</div>
              <p style={{ display: "none" }}>{FAUCET_TOKEN_ADDRESS}</p>
            </div>
            <div className="modal__token" onClick={handleTokenSelection}>
              <img
                className="modal__token-img"
                alt="DAI logo"
                src="/dai.png"
                style={{ marginRight: "8px", width: "20px" }}
              />
              <div className="modal__token-symbol" onClick={handleModalClose} id="token2">Matic</div>
              <p style={{ display: "none" }}>{MATIC_TOKEN_ADDRESS}</p>
            </div>
            {/* <div className="modal__token" onClick={handleTokenSelection}>
          <img className="modal__token-img" alt="DAI logo" src="/dai.png" style={{marginRight:'8px', width:'20px'}}/>
          <div className="modal__token-symbol">USDC</div>
          <p style={{display: "none"}}>USDC Address</p>
        </div> */}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Modal;