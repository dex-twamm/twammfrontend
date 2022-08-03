import React,{useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const Swap = ({tokenSymbol, tokenImage}) => {
  
  // Handling Primary and Secondary Tokens
  const [primary, setPrimary] = useState('')
  const handlePrimary = (e) => {
    setPrimary(e.target.value)
  }

  const [secondary, setSecondary] = useState('')
  const handleSecondary = (e) => {
    setSecondary(e.target.value)
  }

  return (
    
    <div className='main-body'>
      <div className="swap">
        <div className="swapOptions">
          <a className="textLink" href="/">Swap</a>
          <FontAwesomeIcon icon={faGear} />
        </div>
      </div>
      <div className="textInput">
        <input className="textField" type="text" placeholder="0.0" value={primary} onChange={handlePrimary}/>
        <button className= "btn currency-select">
          <span className="spn-currency">
            <div className="currecy">
               <img className="tokenImage" src={tokenImage} style={{marginRight: '0.5rem'}} alt="token-image"/>
               <span className="token-container">{tokenSymbol}</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sc-w04zhs-16 lfEMTx"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </span>
        </button>
      </div>
      <FontAwesomeIcon className="iconDown" icon={faArrowDown} />
      <div className="textOutput">
        <input className="textField" type="text"  placeholder="0.0" value={secondary} onChange={handleSecondary}/>
        <button className = "btn token-select">
          <span className="spn-select-token">
            <div className="">  
              <span className="select-container">Select a token</span>
            </div>
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" className="sc-33m4yg-8 jsUfgJ"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg>
          </span>
        </button>
      </div>
      <button className="btn btn-connect">Connect Wallet</button>
    </div>
  )
}

export default Swap;

