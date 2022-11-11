import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import styles from "../css/Navbar.module.css";
import { LongSwapContext, ShortSwapContext } from "../providers";
import { FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS } from "../utils";
import { POOLS, POOL_ID } from "../utils/pool";

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

const Tabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const { setTokenA, setTokenB } = useContext(LongSwapContext);
  const { setSwapAmount } = useContext(ShortSwapContext);
  const onNavLinkClick = () => {
    setSwapAmount("");
    setTokenA({
      symbol: "Faucet",
      image: "/ethereum.png",
      address: POOLS[POOL_ID]?.TOKEN_TWO_ADDRESS,
      balance: 0,
      tokenIsSet: true,
    });
    setTokenB({
      symbol: "Select Token",
      image: "/Testv4.jpeg",
      address: POOLS[POOL_ID]?.TOKEN_ONE_ADDRESS,
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
