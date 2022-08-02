import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const LongTermSwap = () => {
  return (
    <div className='main-body'>
      <div className="swap">
        <div className="swapOptions">
          <a className="textLink" href="#">Swap</a>
          <FontAwesomeIcon icon={faGear} />
        </div>
      </div>
      <div className="textInput">
        <input className="textField" type="number" placeholder="0.0"/>
        <button className= "btn currency-select">
          <span className="spn-currency">
            <div className="currecy">
               <img className="tokenImage" src="ethereum.png" style={{marginRight: '0.5rem'}} alt="token-image"/>
               <span className="token-container">ETH</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sc-w04zhs-16 lfEMTx"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </span>
        </button>
      </div>
      <div className="iconDown">
        <FontAwesomeIcon icon={faArrowDown} />
      </div>
      <div className="textOutput">
        <input className="textField" type="number"  placeholder="0.0"/>
        <button className = "btn token-select">
          <span className="spn-select-token">
            <div className="">
               <span className="select-container">Select a token</span>
            </div>
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" className="sc-33m4yg-8 jsUfgJ"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg>
          </span>
        </button>
      </div>
      <div className="range-select">
        <input type="range" value="0"/>
      </div>
      <button className="btn btn-connect">Connect Wallet</button>
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

export default LongTermSwap;

