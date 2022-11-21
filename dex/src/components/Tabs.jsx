import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import styles from "../css/Navbar.module.css";
import { LongSwapContext, ShortSwapContext } from "../providers";
import { POOLS, POOL_ID } from "../utils/pool";

import Testv4 from "../images/Testv4.jpeg";
import Ethereum from "../images/ethereum.png";

const tabOptions = [
  {
    value: "Swap",
    path: "/shortswap",
  },
  {
    value: "Long Term Swap",
    path: "/",
  },
  {
    value: "Add Liquidity",
    path: "/liquidity",
  },
];

const Tabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const { setTokenA, setTokenB } = useContext(LongSwapContext);
  const { setSwapAmount } = useContext(ShortSwapContext);
  const onNavLinkClick = () => {
    setSwapAmount("");
    setTokenA({
      symbol: "Faucet",
      image: Ethereum,
      address: Object.values(POOLS?.[localStorage.getItem("coin_name")])?.[0]
        ?.TOKEN_TWO_ADDRESS,
      balance: 0,
      tokenIsSet: true,
    });
    setTokenB({
      symbol: "Select Token",
      image: Testv4,
      address: Object.values(POOLS?.[localStorage.getItem("coin_name")])?.[0]
        ?.TOKEN_ONE_ADDRESS,
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

  return <div className={styles.tabContainerCenter}>{tabList}</div>;
};

export default Tabs;
