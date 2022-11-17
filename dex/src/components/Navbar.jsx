import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@mui/material";
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link, Navigate, useLocation } from "react-router-dom";
import { POPUP_MESSAGE } from "../constants";
import styles from "../css/Navbar.module.css";
import { LongSwapContext, ShortSwapContext, UIContext } from "../providers";
import { FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS, toHex } from "../utils";
import { DisconnectWalletOption } from "./DisconnectWalletOption";
import NavOptionDropdwon from "./navbarDropdown/NavOptionDropdwon";

const Navbar = (props) => {
  const { showDropdown, setShowDropdown } = useContext(UIContext);
  const { setTokenA, setTokenB } = useContext(LongSwapContext);

  const location = useLocation();

  const {
    walletBalance,
    walletAddress,
    accountStatus,
    connectWallet,
    disconnectWallet,
    change,
    showDisconnect,
    setShowDisconnect,
  } = props;
  const { error, setError, setLoading, setSwapAmount, isWalletConnected } =
    useContext(ShortSwapContext);
  // const [netId, setNetId] = useState("");
  // const [isOpen, setOpen] = useState(false);
  console.log("Wallet Status", isWalletConnected);
  // const [showDisconnect, setShowDisconnect] = useState(false);
  const networks = [
    { name: "Ethereum", chainId: "1", logo: "/ethereum.png" },
    { name: "Goerli", chainId: "5", logo: "/Testv4.jpeg" },
    { name: "Coming Soon", chainId: "0", logo: "/ethereum.png" },
  ];

  const nId = window.ethereum?.networkVersion;
  console.log("nId--->", nId);
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
    // localStorage.setItem("coin_name", networkName);
    // localStorage.setItem("coin_logo", logo);
    // console.log(chainId);

    console.log("chainId", chainId);
    const id = chainId;
    if (isWalletConnected) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: toHex(id) }],
        });
        setSelectedNetwork({
          network: networkName,
          logo: logo,
          chainId: chainId,
        });

        localStorage.setItem("coin_name", networkName);
        localStorage.setItem("coin_logo", logo);

        window.location.reload();
      } catch (err) {
        console.error(err);
        setError(POPUP_MESSAGE.networkSwitchFailed);
      }
    }
  };

  console.log("Selected network-->", selectedNetwork);

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
          change={change}
          disconnectWallet={disconnectWallet}
          open={showDisconnect}
        />
      )}
      <div className={styles.row}>
        <div className={styles.tabContainerLeft}>
          <Link to="/">
            <img
              className={styles.logo}
              src="logo.png"
              alt="logo"
              width="20px"
            />
          </Link>
          <p
            className={styles.longswap}
            style={{
              fontFamily: "Futura",
              fontWeight: "700",
              fontSize: "18px",
              lineHeight: "24px",
              letterSpacing: "0.4px",

              color: "#554994",
            }}
          >
            Longswap
          </p>
        </div>
        <div className={styles.tabContainerRight}>
          <div className={styles.dropdown}>
            <div className={styles.container}>
              <div id="networkType" className={styles.dropdownContainer}>
                <img
                  src={selectedNetwork.logo}
                  className={styles.networkIcon}
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
              <FontAwesomeIcon
                style={{
                  background: "transparent",
                }}
                icon={faEllipsis}
              />
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
