import React from "react";
import {
  AddLiquidity,
  LiquidityPools,
  RemoveLiquidity,
} from "../components/Liquidity";

const LiquidityPage = ({
  showAddLiquidity,
  setShowAddLiquidity,
  showRemoveLiquidity,
  setShowRemoveLiquidity,
}) => {
  let liquidityMarkup = (
    <LiquidityPools
      showRemoveLiquidity={setShowRemoveLiquidity}
      showAddLiquidity={setShowAddLiquidity}
    />
  );

  if (showAddLiquidity) {
    liquidityMarkup = <AddLiquidity showAddLiquidity={setShowAddLiquidity} />;
  } else if (showRemoveLiquidity)
    liquidityMarkup = (
      <RemoveLiquidity showRemoveLiquidity={setShowRemoveLiquidity} />
    );

  return <div>{liquidityMarkup}</div>;
};

export default LiquidityPage;
