import React from 'react';
import Swap from '../components/Swap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear,faArrowDown } from '@fortawesome/free-solid-svg-icons';


const LongSwap = ({ tokenSymbol,tokenImage,connectWallet, buttonText}) => {
      
   
  return (
    <div className='main-body'>
      <div className="swap">
        <div className="swapOptions">
          <a className="textLink" href="/">Long Term Swap</a>
          <FontAwesomeIcon icon={faGear} />
        </div>
      </div>
      <Swap tokenSymbol={tokenSymbol} tokenImage={tokenImage}/>
      <div className="range-select">
        <input type="range" value="0"/>
      </div>
        <button className="btn btn-connect" onClick= {connectWallet}>{buttonText}</button>:
        <div className="label-history">
        <p>Your LongTerm Orders</p>
        <FontAwesomeIcon icon={faArrowDown} />
      </div>
      <div className="history-details">
        <p>Connect To Wallet To Load Your List</p>
      </div>
    </div>
  )
}

export default LongSwap;
