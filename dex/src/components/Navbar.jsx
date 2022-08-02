import React from 'react';
import showDropdown from '../Helpers/showdropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <div>
      <section id="header">
        <div className="row">
          <a href="index.html"><img className="logo" src="unicorn.png" alt="logo" width='20px'/></a>
          <div className = "tab-container-center">
            <div className="tabButton"><a href="/">Swap</a></div>
            <div className="tabButton"><a href="/longterm">Long Term Swap</a></div>
            <div className="tabButton"><a href="/liquidity">Add Liquidity</a></div>
          </div>
          <div className="tab-container-right">
            <div className="dropdown">
              <div className="currency">
                <img className="tokenImage" src="ethereum.png" style={{marginRight: '0.5rem'}}/>
                <div className="token-name">Rinkeby</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sc-w04zhs-16 lfEMTx"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <div className="dropdown-content">
                <a href="#">Link 1</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
              </div>
            </div>
            <div className = "wallet-balance">
              <button className="btn-wallet">0.69 rETH</button>
              <button className="btn-wallet">0x51bc...xc</button>
            </div> 
            <div className="menu-option">
              <button className="menu-three-dot" onClick={showDropdown}>
                <FontAwesomeIcon icon={faEllipsis}/>
              </button>
              <span className="menu-list" id="menu-dropdown">
                <a className="options" href="">About</a>
                <a className="options" href="">Help Center</a>
                <a className="options" href="">Request Feature</a>
                <a className="options" href="">Discord</a>
                <a className="options" href="">Language</a>
                <a className="options" href="">Dark Theme</a>
                <a className="options" href="">Docs</a>
                <a className="options" href="">Legal Privacy</a>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Navbar;
