import React from "react";
import {
  AddLiquidity,
  LiquidityPools,
  RemoveLiquidity,
} from "../components/Liquidity";

const LiquidityPage = ({
  setShowRemoveLiquidity,
  showRemoveLiquidity,
  setShowAddLiquidity,
  showAddLiquidity,
}) => {
  let liquidityMarkup = (
    <LiquidityPools
      showRemoveLiquidity={setShowRemoveLiquidity}
      showAddLiquidity={setShowAddLiquidity}
    />
  );

  if (showAddLiquidity) {
    liquidityMarkup = (
      <AddLiquidity
        // connect={_joinPool}
        showAddLiquidity={setShowAddLiquidity}
      />
    );
  } else if (showRemoveLiquidity)
    liquidityMarkup = (
      <RemoveLiquidity showRemoveLiquidity={setShowRemoveLiquidity} />
    );
  return <>{liquidityMarkup}</>;
};

export default LiquidityPage;
