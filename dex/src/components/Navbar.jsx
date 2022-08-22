import React, { useContext } from "react";
import showDropdown from "../Helpers/showdropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { toHex } from "../utils";
import { ShortSwapContext } from "../providers";

const Navbar = ({
  walletBalance,
  walletAddress,
  accountStatus,
  connectWallet,
}) => {
  const { setError } = useContext(ShortSwapContext);
  const tabOptions = [
    {
      value: "Swap",
      path: "/",
    },
    {
      value: "Long Term Swap",
      path: "/longterm",
    },
    {
      value: "Add Liquidity",
      path: "/liquidity",
    },
  ];
  const tabList = tabOptions.map((option) => (
    <div className="tabButton">
      <a href={option.path}>{option.value}</a>
    </div>
  ));

  const options = [
    "About",
    "Help Center",
    "Request Feature",
    "Discord",
    "Language",
    "Dark Theme",
    "Docs",
    "Legal Privacy",
  ];
  const optionsList = options.map((option) => {
    return (
      <a className="options" href="">
        {option}
      </a>
    );
  });

  const networks = [
    { name: "Select Network", chainId: "0" },
    { name: "Ethereum", chainId: "1" },
    { name: "Goerli", chainId: "5" },
    { name: "Coming Soon", chainId: "0" },
  ];

  const networkList = networks.map((network) => {
    return (
      <>
        <option value={network.chainId}>{network.name}</option>
      </>
    );
  });

  const handleChangeId = async (e) => {
    const id = e.target.value;
    if (window.ethereum.networkVersion !== id) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: toHex(id) }],
        });
      } catch (err) {
        console.error(err);
        setError(err);
      }
    }
  };
  return (
    <div>
      <section id="header">
        <div className="row">
          <a href="/">
            <img className="logo" src="unicorn.png" alt="logo" width="20px" />
          </a>
          <div className="tab-container-center">{tabList}</div>
          <div className="tab-container-right">
            <div className="dropdown">
              {/* <div className={styles.dropdownItem}>
                <img src="./ethereum.png"></img>
              </div> */}
              <select
                placeholder="Select Network"
                id="networkType"
                className="currency"
                onChange={handleChangeId}
              >
                {networkList}
              </select>
            </div>

            <div className="wallet-balance">
              {accountStatus ? (
                <>
                  <button className="btn-wallet">{walletBalance}</button>
                  <button
                    className="btn-wallet"
                    style={{
                      backgroundColor: "rgb(244,248,250",
                      borderRadius: "14px",
                    }}
                  >
                    {walletAddress}
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-connect"
                  style={{
                    height: "fit-content",
                    width: "200%",
                    fontSize: "small",
                    margin: "0",
                  }}
                  onClick={connectWallet}
                >
                  Connect Wallet
                </button>
              )}
            </div>
            <div className="menu-option">
              <button className="menu-three-dot" onClick={showDropdown}>
                <FontAwesomeIcon icon={faEllipsis} />
              </button>
              <span className="menu-list" id="menu-dropdown">
                {optionsList}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Navbar;
