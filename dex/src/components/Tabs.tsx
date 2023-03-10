import React from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import styles from "../css/Navbar.module.css";

interface TabOptionsTypes {
  value: string;
  path: string;
}
const tabOptions: TabOptionsTypes[] = [
  {
    value: "Swap",
    path: "/shortswap",
  },
  {
    value: "Long Term Swap",
    path: "/",
  },
  // {
  //   value: "Add Liquidity",
  //   path: "/liquidity",
  // },
];

const Tabs: React.FC = () => {
  const location = useLocation();
  const currentPath: string = location.pathname;

  const tabList = tabOptions.map((option, index) => (
    <Link to={option.path} key={index}>
      <div
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
