import React,{useState} from 'react';


const Modal = ({display,setDisplay,setTokenA,setTokenB,selectToken}) => {

  // Handle Select Token Modal display
  const handleModalClose = () => {
    setDisplay(!display);
  }
  const handleTokenSelection = (event) => {
    const token = event.currentTarget;
    if(selectToken){
      setTokenB({
        symbol:token.children[1].innerHTML,
        image :token.children[0].src.slice(21,token.length)
      })
    } else {
      setTokenA({ 
        symbol:token.children[1].innerHTML,
        image :token.children[0].src.slice(21,token.length)
      })
    }
  }

  return (
    <>
    {display ? <div className="modal__wrapper">
      <div className="modal__container">
        <div className="modal__heading">Select a token</div>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="" onClick={handleModalClose}>
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
      <div className="modal__token-list">
        <div className="modal__token" onClick={handleTokenSelection}>
          <img className="modal__token-img" alt="ETH logo" src="/ethereum.png" style={{marginRight:'8px', width:'20px'}}/>
          <div className="modal__token-symbol">ETH</div>
        </div>
        <div className="modal__token" onClick={handleTokenSelection}>
          <img className="modal__token-img" alt="DAI logo" src="/dai.png" style={{marginRight:'8px', width:'20px'}}/>
          <div className="modal__token-symbol">DAI</div>
        </div>
        <div className="modal__token" onClick={handleTokenSelection}>
          <img className="modal__token-img" alt="DAI logo" src="/dai.png" style={{marginRight:'8px', width:'20px'}}/>
          <div className="modal__token-symbol">USDC</div>
        </div>
      </div>
    </div>  : ""}
    </>
    
  )
}

export default Modal;
