import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { POPUP_MESSAGE } from "../constants";
import styles from "../css/Navbar.module.css";
import { ShortSwapContext, UIContext } from "../providers";
import { toHex, truncateAddress } from "../utils";
import { connectWallet } from "../utils/connetWallet";
import { DisconnectWalletOption } from "./DisconnectWalletOption";
import NavOptionDropdwon from "./navbarDropdown/NavOptionDropdwon";
import { NETWORKS } from "../utils/networks";
import { getTokenLogo } from "../utils/api";

const Navbar = () => {
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { selectedNetwork, setSelectedNetwork } = useContext(UIContext);

  const {
    setError,
    isWalletConnected,
    setweb3provider,
    setCurrentBlock,
    setBalance,
    setAccount,
    account,
    balance,
    setWalletConnected,
  } = useContext(ShortSwapContext);

  const handleSelect = async (chainId) => {
    const id = chainId;
    if (isWalletConnected) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: toHex(id) }],
        });
        window.location.reload();
      } catch (err) {
        console.error(err);
        setError(POPUP_MESSAGE.networkSwitchFailed);
      }
    }
  };

  const networkList = NETWORKS.map((network, index) => {
    return (
      <p
        key={index}
        className={styles.networkName}
        value={network.chainId}
        onClick={() => handleSelect(network.chainId)}
      >
        {network.name}
      </p>
    );
  });

  const handleDisconnect = () => {
    account && setShowDisconnect(true);
  };

  const walletConnect = async () => {
    await connectWallet(
      setweb3provider,
      setCurrentBlock,
      setBalance,
      setAccount,
      setWalletConnected,
      setSelectedNetwork
    );
  };

  useEffect(() => {
    document.body.onclick = () => {
      setShowDropdown(false);
    };
  });

  const networkId = selectedNetwork?.id;

  useEffect(() => {
    const getLogo = async () => {
      const logo = await getTokenLogo(networkId);
      setSelectedNetwork({
        ...selectedNetwork,
        logo: logo,
      });
    };
    getLogo();
  }, [networkId, setSelectedNetwork]);

  return (
    <header className={styles.header} id="header">
      {showDisconnect && (
        <DisconnectWalletOption
          setShowDisconnect={setShowDisconnect}
          showDisconnect={showDisconnect}
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
          <p className={styles.longSwap}>Longswap</p>
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
            {isWalletConnected ? (
              <>
                <button
                  className={classNames(styles.btnWallet, styles.leftRadius)}
                >
                  {balance}
                </button>
                <button
                  onClick={handleDisconnect}
                  className={classNames(styles.btnWallet, styles.rightRadius)}
                >
                  {truncateAddress(account)}
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
          {/* Not used currently */}
          {/* <div
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
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
