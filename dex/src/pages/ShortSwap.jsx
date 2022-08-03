import React from 'react';
import Swap from '../components/Swap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
const ShortSwap = ({tokenSymbol,tokenImage}) => {
  return (
    <div className='main-body'>
      <div className="swap">
        <div className="swapOptions">
          <a className="textLink" href="/">Swap</a>
          <FontAwesomeIcon icon={faGear} />
        </div>
      </div>
      <Swap tokenSymbol={tokenSymbol} tokenImage={tokenImage}/>
      <button className="btn btn-connect">Connect Wallet</button>
    </div>
  )
}

export default ShortSwap;
