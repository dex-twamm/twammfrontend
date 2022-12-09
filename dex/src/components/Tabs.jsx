import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import styles from "../css/Navbar.module.css";
import { LongSwapContext, ShortSwapContext } from "../providers";
import { getPoolConfig } from "../utils/poolUtils";
import { UIContext } from "../providers/context/UIProvider";

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
  const { selectedNetwork } = useContext(UIContext);

  const { tokenA, setTokenA, tokenB, setTokenB } = useContext(LongSwapContext);
  const { setSwapAmount } = useContext(ShortSwapContext);
  const onNavLinkClick = () => {
    const poolConfig = getPoolConfig(selectedNetwork?.network);
    setSwapAmount("");
    if (!tokenA.tokenIsSet) {
      setTokenA({
        ...poolConfig?.tokens[0],
        balance: 0,
        tokenIsSet: true,
      });
    }
    if (!tokenB.tokenIsSet) {
      setTokenB({
        ...poolConfig?.tokens[1],
        balance: 0,
        tokenIsSet: true,
      });
    }
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
