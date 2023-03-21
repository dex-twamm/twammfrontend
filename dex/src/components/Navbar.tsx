import classNames from "classnames";
import { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { POPUP_MESSAGE } from "../constants";
import styles from "../css/Navbar.module.css";
import { toHex, truncateAddress } from "../utils";
import { connectWallet } from "../utils/connectWallet";
import { DisconnectWalletOption } from "./DisconnectWalletOption";
import { NETWORKS } from "../utils/networks";
import logo from "../images/logo.png";
import { getEthereumFromWindow } from "../utils/ethereum";
import { useShortSwapContext } from "../providers/context/ShortSwapProvider";
import { useNetworkContext } from "../providers/context/NetworkProvider";

const Navbar = () => {
  const [showDisconnect, setShowDisconnect] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const location = useLocation();

  const { selectedNetwork, setSelectedNetwork } = useNetworkContext();

  const {
    setError,
    isWalletConnected,
    setWeb3provider,
    setCurrentBlock,
    setBalance,
    setAccount,
    account,
    balance,
    setWalletConnected,
  } = useShortSwapContext();

  const handleSelect = async (chainId: string) => {
    const defaultPoolId = 0;
    localStorage.setItem("poolId", defaultPoolId.toString());
    const id = chainId;
    if (isWalletConnected) {
      try {
        const ethereum = getEthereumFromWindow();
        await ethereum?.request?.({
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
    connectWallet().then((res) => {
      const { account, balance, currentBlock, selectedNetwork, web3Provider } =
        res;
      setWeb3provider(web3Provider);
      setCurrentBlock(currentBlock);
      setBalance(balance);
      setAccount(account);
      setWalletConnected(true);
      setSelectedNetwork(selectedNetwork);
    });
  };

  useEffect(() => {
    document.body.onclick = () => {
      setShowDropdown(false);
    };
  });

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
            <img className={styles.logo} src={logo} alt="logo" width="20px" />
            <p className={styles.longSwap}>Longswap</p>
          </Link>
        </div>
        {location.pathname !== "/contact" && (
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
                  {<NavOptionDropdown />}
                </span>
              )} 
            </div> */}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
