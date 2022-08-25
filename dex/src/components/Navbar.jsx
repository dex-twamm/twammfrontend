import React, { useContext, useState } from "react";
import showDropdown from "../Helpers/showdropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { toHex } from "../utils";
import { ShortSwapContext } from "../providers";
import styles from "../css/Navbar.module.css";
import classNames from "classnames";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";

const Navbar = (props) => {

  const location = useLocation()
  const currentPath = location.pathname;
  

  const { walletBalance, walletAddress, accountStatus, connectWallet } = props;

  const [selectedNetwork, setSelectedNetwork] = useState({
    network: "Select Network",
    logo: "/ethereum.png",
  });

  const handleSelect = (networkName, logo) =>
    setSelectedNetwork({
      network: networkName,
      logo: logo,
  });

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

  const tabList = tabOptions.map((option, index) => (
    <div key={index}
      className={classNames(styles.tabButton, currentPath === option.path && styles.activeTab)}
    >
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
  const optionsList = options.map((option, index) => {
    return (
      <a key={index} className={styles.options} href="/">
        {option}
      </a>
    );
  });

  const networks = [
    { name: "Ethereum", chainId: "1", logo: "/ethereum.png" },
    { name: "Goerli", chainId: "5", logo: "/dai.png" },
    { name: "Coming Soon", chainId: "0", logo: "/ethereum.png" },
  ];

  const networkList = networks.map((network, index) => {
    return (
      <p
        key={index}
        className={styles.networkName}
        value={network.chainId}
        onClick={() => handleSelect(network.name, network.logo)}
      >
        {network.name}
      </p>
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
    <header className={styles.header} id="header">
      <div className={styles.row}>
        <div className={styles.tabContainerLeft}>
          <a href="/">
            <img
              className={styles.logo}
              src="unicorn.png"
              alt="logo"
              width="20px"
            />
          </a>
          <div className={styles.tabContainerCenter}>{tabList}</div>
        </div>
        <div className={styles.tabContainerRight}>
          <div className={styles.dropdown}>
            <div className={styles.container}>
              <div id="networkType" className={styles.dropdownContainer}>
                <img
                  src={selectedNetwork.logo}
                  className={styles.logo}
                  alt="Etherium"
                />
                <span>{selectedNetwork.network}</span>
                <RiArrowDropDownLine className={styles.dropdownIcon} />
              </div>

              <div className={styles.currency}>
                <div className={styles.list}>
                  <p>Select a network</p>
                  <div className={styles.networkList}>{networkList}</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.walletBalance}>
            {accountStatus ? (
              <>
                <button className={classNames(styles.btnWallet, styles.leftRadius)}>{walletBalance}</button>
                <button className={classNames(styles.btnWallet, styles.rightRadius)}>
                  {walletAddress}
                </button>
              </>
            ) : (
              <button
                className={classNames(styles.btn, styles.btnConnect)}
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )}
          </div>
          <div className={styles.menuOption}>
            <button className={styles.menuThreeDot} onClick={showDropdown}>
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            <span className={styles.menuList} id="menu-dropdown">
              {optionsList}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
