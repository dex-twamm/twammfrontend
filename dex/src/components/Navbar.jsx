import React from 'react';
import showDropdown from '../Helpers/showdropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({tokenImage, tokenName, walletBalance, walletAddress, accountStatus,connectWallet, handleNetwork, switchNetwork}) => {

  const tabOptions = [
    {
      value:'Swap',
      path:'/'
    },
    {
      value:'Long Term Swap',
      path:'/longterm'
    },
    {
      value:'Add Liquidity',
      path:'/liquidity'
    }
  ]
  const tabList = tabOptions.map((option)=>
  (
    <div className="tabButton"><a href={option.path}>{option.value}</a></div>
  ))

  const options = ['About', 'Help Center','Request Feature','Discord','Language','Dark Theme','Docs','Legal Privacy'];
  const optionsList = options.map((option)=>{
    return (
      <a className="options" href="">{option}</a>
    )
  })

  return (
    <div>
      <section id="header">
        <div className="row">
          <a href="/"><img className="logo" src="unicorn.png" alt="logo" width='20px'/></a>
          <div className = "tab-container-center">
            {tabList}
          </div>
          <div className="tab-container-right">
            <div className="dropdown" >
              <select id="networkType" className='currency' onChange={switchNetwork}>
        
                <option id='default' disabled>Select Network</option>
                <option  value="1" >
                  <span>
                <img className="tokenImage" src={tokenImage} style={{marginRight: '0.5rem'}}/>
                <div className="token-name">{tokenName}</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sc-w04zhs-16 lfEMTx"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
                </option>
                  <option value="5">Goerli</option>
              <option value="Soon">Coming Soon</option>
                </select>
              
              </div>

            <div className = "wallet-balance">
              {accountStatus ? (
              <>
              <button className="btn-wallet">{walletBalance}</button>
              <button className="btn-wallet" style={{backgroundColor:"rgb(244,248,250",borderRadius:"14px"}}>{walletAddress}</button>
              </>) 
              :(<button className="btn btn-connect" style={{height:'fit-content', width:"200%", fontSize:"small", margin:'0'}} onClick={connectWallet}>Connect Wallet</button>) }
            
             
            </div> 
            <div className="menu-option">
              <button className="menu-three-dot" onClick={showDropdown}>
                <FontAwesomeIcon icon={faEllipsis}/>
              </button>
              <span className="menu-list" id="menu-dropdown">
                {optionsList}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Navbar;
