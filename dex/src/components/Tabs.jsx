import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import styles from "../css/Navbar.module.css";
import { LongSwapContext, ShortSwapContext } from "../providers";
import { FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS } from "../utils";
import { POOLS, POOL_ID } from "../utils/pool";
import { useNetwork } from "../providers/context/UIProvider";

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
  const currentNetwork = useNetwork();

  const { setTokenA, setTokenB } = useContext(LongSwapContext);
  const { setSwapAmount } = useContext(ShortSwapContext);
  const onNavLinkClick = () => {
    const poolConfig = Object.values(POOLS?.[currentNetwork?.network])?.[0];
    setSwapAmount("");
    setTokenA({
      symbol: poolConfig?.tokens[1].symbol,
      image: poolConfig?.tokens[1].logo,
      address: poolConfig?.tokens[1].address,
      balance: 0,
      tokenIsSet: true,
    });
    setTokenB({
      symbol: "Select Token",
      image: poolConfig?.tokens[0].logo,
      address: poolConfig?.tokens[0].address,
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
