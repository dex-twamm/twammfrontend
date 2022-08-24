import React, { useContext, useState } from "react";
import showDropdown from "../Helpers/showdropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { toHex } from "../utils";
import { ShortSwapContext } from "../providers";
import styles from "../css/Navbar.module.css";
import classNames from "classnames";
import { RiArrowDropDownLine } from "react-icons/ri";

const Navbar = ({
  walletBalance,
  walletAddress,
  accountStatus,
  connectWallet,
}) => {
  const [selectedText, setSelectedText] = useState("Select network");
  const handleSelect = (e) => setSelectedText(e.target.innerText);

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
    <div key={index} className={styles.tabButton}>
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
      <a key={index} className={styles.options} href="">
        {option}
      </a>
    );
  });

  const networks = [
    // { name: "Select Network", chainId: "0" },
    { name: "Ethereum", chainId: "1" },
    { name: "Goerli", chainId: "5" },
    { name: "Coming Soon", chainId: "0" },
  ];

  const handleChangeId = (e) => {
    const network = e.currentTarget;
    const id = network.children[1].innerHTML;
    console.log("Chain ID", id);
    if (window.ethereum.networkVersion !== id) {
      try {
        window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: toHex(id) }],
        });
      } catch (err) {
        console.error(err);
        setError("Network Error");
      }
    }
  };

  const networkList = networks.map((network, index) => {
    return (
      <div onClick={handleChangeId}>
        <p
          key={index}
          className={styles.networkName}
          value={network.chainId}
          onClick={handleSelect}
        >
          {network.name}
        </p>
        <p style={{ display: "none" }}>{network.chainId}</p>
      </div>
    );
  });
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
                  src="/ethereum.png"
                  className={styles.logo}
                  alt="Etherium"
                />
                <span>{selectedText}</span>
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
                <button className={styles.btnWallet}>{walletBalance}</button>
                <button
                  className={styles.btnWallet}
                  style={{
                    backgroundColor: "rgb(244,248,250)",
                    borderRadius: "14px",
                  }}
                >
                  {walletAddress}
                </button>
              </>
            ) : (
              <button
                className={classNames(styles.btn, styles.btnConnect)}
                style={{
                  height: "fit-content",
                  // width: "200%",
                  fontSize: "small",
                  margin: "0",
                }}
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
