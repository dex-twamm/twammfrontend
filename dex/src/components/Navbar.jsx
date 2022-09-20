import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link, Navigate, useLocation } from "react-router-dom";
import styles from "../css/Navbar.module.css";
import { LongSwapContext, ShortSwapContext, UIContext } from "../providers";
import { FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS, toHex } from "../utils";
import { DisconnectWalletOption } from "./DisconnectWalletOption";
import NavOptionDropdwon from "./navbarDropdown/NavOptionDropdwon";

const Navbar = (props) => {
  const { showDropdown, setShowDropdown } = useContext(UIContext);
  const { setTokenA, setTokenB } = useContext(LongSwapContext);

  const location = useLocation();
  const currentPath = location.pathname;

  const {
    walletBalance,
    walletAddress,
    accountStatus,
    connectWallet,
    disconnectWallet,
  } = props;
  const { setError, setLoading, setSwapAmount } = useContext(ShortSwapContext);
  // const [netId, setNetId] = useState("");
  // const [isOpen, setOpen] = useState(false);

  const [showDisconnect, setShowDisconnect] = useState(false);
  const networks = [
    { name: "Ethereum", chainId: "1", logo: "/ethereum.png" },
    { name: "Goerli", chainId: "5", logo: "/Testv4.jpeg" },
    { name: "Coming Soon", chainId: "0", logo: "/ethereum.png" },
  ];

  const nId = window.ethereum?.networkVersion;
  const initialNetwork = networks.filter((id) => id.chainId === nId);

  const [selectedNetwork, setSelectedNetwork] = useState({
    network: "Select a Network",
    logo: "/ethereum.png",
    chainId: nId,
  });

  const coin_name = localStorage.getItem("coin_name");
  const coin_logo = localStorage.getItem("coin_logo");

  useEffect(() => {
    setSelectedNetwork((prevState) => ({
      ...prevState,
      network: coin_name ? coin_name : initialNetwork[0]?.name,
      logo: coin_logo ? coin_logo : initialNetwork[0]?.logo,
    }));
  }, [coin_name]);

  const handleSelect = async (networkName, logo, chainId) => {
    localStorage.setItem("coin_name", networkName);
    localStorage.setItem("coin_logo", logo);

    // console.log(chainId);
    setSelectedNetwork({
      network: networkName,
      logo: logo,
      chainId: chainId,
    });
    console.log(chainId);
    const id = chainId;
    if (window.ethereum.networkVersion !== id) {
      setLoading(true);
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: toHex(id) }],
        });
        setLoading(false);
        window.location.reload();
      } catch (err) {
        console.error(err);
        setLoading(false);
        setError("Failed To Switch Network");
      }
    }
  };

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

  const onNavLinkClick = () => {
    setSwapAmount("");
    setTokenA({
      symbol: "Faucet",
      image: "/ethereum.png",
      address: FAUCET_TOKEN_ADDRESS,
      balance: 0,
      tokenIsSet: true,
    });
    setTokenB({
      symbol: "Select Token",
      image: "",
      address: MATIC_TOKEN_ADDRESS,
      balance: 0,
      tokenIsSet: false,
    });
  };

  const tabList = tabOptions.map((option, index) => (
    <Link to={option.path} key={index}>
      <div
        onClick={onNavLinkClick}
        key={index}
        className={classNames(
          styles.tabButton,
          currentPath === option.path && styles.activeTab
        )}
      >
        {option.value}
      </div>
    </Link>
  ));

  const networkList = networks.map((network, index) => {
    return (
      <p
        key={index}
        className={styles.networkName}
        value={network.chainId}
        onClick={() =>
          handleSelect(network.name, network.logo, network.chainId)
        }
      >
        {network.name}
      </p>
    );
  });

  const handleDisconnect = () => {
    walletAddress && setShowDisconnect(true);
  };

  return (
    <header className={styles.header} id="header">
      {showDisconnect && (
        <DisconnectWalletOption
          setOpen={setShowDisconnect}
          disconnectWallet={disconnectWallet}
          open={showDisconnect}
        />
      )}
      <div className={styles.row}>
        <div className={styles.tabContainerLeft}>
          <Link to="/">
            <img
              className={styles.logo}
              src="unicorn.png"
              alt="logo"
              width="20px"
            />
          </Link>
          <div className={styles.tabContainerCenter}>{tabList}</div>
        </div>
        <div className={styles.tabContainerRight}>
          <div className={styles.dropdown}>
            <div className={styles.container}>
              <div id="networkType" className={styles.dropdownContainer}>
                <img
                  src={selectedNetwork.logo}
                  className={styles.logo}
                  alt="Ethereum"
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
                <button
                  className={classNames(styles.btnWallet, styles.leftRadius)}
                >
                  {walletBalance}
                </button>
                <button
                  onClick={handleDisconnect}
                  className={classNames(styles.btnWallet, styles.rightRadius)}
                >
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
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles.menuOption}
          >
            <button
              className={styles.menuThreeDot}
              onClick={() => setShowDropdown((state) => !state)}
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </button>

            {showDropdown && (
              <span
                className={classNames(
                  styles.menuList,
                  showDropdown && styles.show
                )}
                id="menu-dropdown"
              >
                {<NavOptionDropdwon />}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
