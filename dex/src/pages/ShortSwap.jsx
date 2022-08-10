import React, { useState } from 'react';
import Swap from '../components/Swap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

const ShortSwap = ({tokenSymbol,tokenImage,connectWallet, buttonText}) => {
  const [primary, setPrimary] = useState();
  const primaryAmount = (data) => {
    setPrimary(primary);
    console.log("primary", data);
  };
  return (
    <div className='main-body'>
      <div className="swap">
        <div className="swapOptions">
          <a className="textLink" href="/">Swap</a>
          <FontAwesomeIcon icon={faGear} />
        </div>
      </div>
      <Swap tokenSymbol={tokenSymbol} tokenImage={tokenImage} onChange = {primaryAmount}/>
      <button className="btn btn-connect" onClick={connectWallet}>{buttonText}</button>
    </div>
  )
}

export default ShortSwap;
