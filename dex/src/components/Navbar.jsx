import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useContext, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { POPUP_MESSAGE } from "../constants";
import styles from "../css/Navbar.module.css";
import { ShortSwapContext, UIContext } from "../providers";
import { toHex } from "../utils";
import { connectWallet } from "../utils/connetWallet";
import { DisconnectWalletOption } from "./DisconnectWalletOption";
import NavOptionDropdwon from "./navbarDropdown/NavOptionDropdwon";
import { NETWORKS } from "../utils/networks";

const Navbar = (props) => {
  const {
    showDropdown,
    setShowDropdown,
    selectedNetwork,
    setSelectedNetwork,
    nId,
  } = useContext(UIContext);

  const {
    walletBalance,
    walletAddress,
    accountStatus,
    disconnectWallet,
    change,
    showDisconnect,
    setShowDisconnect,
  } = props;
  const {
    setError,
    isWalletConnected,
    setweb3provider,
    setCurrentBlock,
    setBalance,
    setAccount,
    setWalletConnected,
  } = useContext(ShortSwapContext);

  console.log("Wallet Status", isWalletConnected);
  console.log("nId--->", nId);

  let initialNetwork = {};

  if(typeof nId === 'undefined' || nId === 'undefined') {
    console.log("nId undefined", NETWORKS[1]);
    initialNetwork = NETWORKS[1];
  } else {
    console.log("nId found", nId);
    initialNetwork = NETWORKS.find((id) => id.chainId === nId);
  }
  
  console.log("initialNetwork", initialNetwork);

  console.log(
    "network from storage",
    localStorage.getItem("network_name"),
    localStorage.getItem("chainId")
  );

  useEffect(() => {
    if (
      !localStorage.getItem("network_name") ||
      localStorage.getItem("network_name") === "undefined"
    ) {
      console.log("localStorage", "network_name", initialNetwork?.name);
      localStorage.setItem("network_name", initialNetwork?.name);
      localStorage.setItem("network_logo", initialNetwork?.logo);
      localStorage.setItem("chainId", initialNetwork?.chainId);
    } else if (localStorage.getItem("chainId") === nId) {
      const network = NETWORKS.find((nw) => nw.chainId === nId);
      console.log("localStorage", "network_name", network);
      localStorage.setItem("network_name", network?.name);
      localStorage.setItem("network_logo", network?.logo);
      localStorage.setItem("chainId", network?.chainId);
    }
  }, [initialNetwork]);

  const network_name = localStorage.getItem("network_name");
  const network_logo = localStorage.getItem("network_logo");
  const network_id = localStorage.getItem("chainId");

  console.log("Selected network---->", selectedNetwork);

  useEffect(() => {
    console.log("network_name", network_name, initialNetwork);
    if (typeof network_name !== "undefined" && network_name !== "undefined") {
      setSelectedNetwork({
        network: network_name,
        logo: network_logo,
        chainId: network_id,
      });
    } else {
      setSelectedNetwork({
        network: initialNetwork?.[0]?.name,
        logo: initialNetwork?.[0]?.logo,
        chainId: initialNetwork?.[0]?.chainId,
      });
    }
    console.log(selectedNetwork);
  }, [network_name]);

  const handleSelect = async (networkName, logo, chainId) => {
    // localStorage.setItem("network_name", networkName);
    // localStorage.setItem("network_logo", logo);
    // console.log(chainId);

    console.log("handleSelect chainId", networkName, logo, chainId);
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
        console.log("localStorage", "network_name", networkName);
        localStorage.setItem("network_name", networkName);
        localStorage.setItem("network_logo", logo);
        localStorage.setItem("chainId", id);

        window.location.reload();
      } catch (err) {
        console.error(err);
        setError(POPUP_MESSAGE.networkSwitchFailed);
      }
    }
  };

  console.log("Selected network-->", selectedNetwork);

  const networkList = NETWORKS.map((network, index) => {
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

  const walletConnect = async () => {
    await connectWallet(
      setweb3provider,
      setCurrentBlock,
      setBalance,
      setAccount,
      setWalletConnected,
      setSelectedNetwork,
      nId
    );
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
          {isWalletConnected && (
            <div className={styles.dropdown}>
              <div className={styles.container}>
                <div id="networkType" className={styles.dropdownContainer}>
                  <img
                    src={selectedNetwork?.logo}
                    className={styles.networkIcon}
                    alt=""
                  />
                  <span>{selectedNetwork?.network}</span>
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
          )}

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
                onClick={walletConnect}
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
