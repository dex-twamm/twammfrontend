import { Avatar, Button, TableCell, TableRow } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useMemo } from "react";
import styles from "../../css/LiquidityPoolList.module.css";
import { useNetworkContext } from "../../providers/context/NetworkProvider";
import { useShortSwapContext } from "../../providers/context/ShortSwapProvider";
import { getPoolContract } from "../../utils/getContracts";

const LiquidityPoolListTableRow = ({
  tableColumns,
  item,
  index,
  setIsAddLiquidity,
  setSelectedTokenPair,
  setIsWithdrawLiquidity,
  setBptAmountIn,
  bptAmountIn,
}) => {
  const { web3provider, account } = useShortSwapContext();
  const { selectedNetwork } = useNetworkContext();

  const handleAddLiquidity = (item, index) => {
    setIsAddLiquidity(true);
    setSelectedTokenPair([...item, index]);
  };

  const handleWithdrawLiquidity = (item, index) => {
    setIsWithdrawLiquidity(true);
    setSelectedTokenPair([...item, index]);
  };

  const currentNetwork = useMemo(() => {
    return {
      ...selectedNetwork,
      poolId: index,
    };
  }, [index, selectedNetwork]);

  useEffect(() => {
    const getPoolTokenData = async () => {
      const signer = web3provider?.getSigner();
      const poolContract = getPoolContract(currentNetwork, signer);
      const balance = await poolContract.balanceOf(account);
      setBptAmountIn(parseFloat(balance.toString()));
    };
    getPoolTokenData();
  }, [web3provider, account, setBptAmountIn, currentNetwork]);

  console.log(
    "bptAmountIn-->",
    "poolId :",
    currentNetwork?.poolId,
    "-->",
    bptAmountIn,
    "--->"
  );

  return (
    <>
      <TableRow key={index} className={styles.dataRow}>
        {tableColumns?.map((column, idx) => {
          if (column.id === "tokens") {
            return (
              <TableCell key={idx}>
                <Box className={styles.styledBoxFive}>
                  <Avatar
                    className={styles.styledAvatarOne}
                    alt="Testv4"
                    src={item[0]?.logo}
                  />
                  <Avatar
                    className={styles.styledAvatarTwo}
                    sizes="small"
                    alt="Faucet"
                    src={item[1]?.logo}
                  />
                </Box>
              </TableCell>
            );
          }
          if (column.id === "composition") {
            return (
              <TableCell key={idx}>
                <Box className={styles.symbolBox}>
                  <p>
                    {item[0]?.symbol} <span>50%</span>
                  </p>
                  <p>
                    {item[1]?.symbol} <span>50%</span>
                  </p>
                </Box>
              </TableCell>
            );
          }
          if (column.id === "pool_value") {
            return (
              <TableCell key={idx}>
                <p> -- </p>
              </TableCell>
            );
          }
          if (column.id === "volume") {
            return (
              <TableCell key={idx}>
                <p> -- </p>
              </TableCell>
            );
          }
          if (column.id === "apr") {
            return (
              <TableCell key={idx}>
                <p className={styles.apr}> -- </p>
              </TableCell>
            );
          }
          if (column.id === "action") {
            return (
              <TableCell key={idx} align={column.align}>
                <Box className={styles.buttonBox}>
                  <Button
                    className={styles.addLiquidityButton}
                    onClick={() => handleAddLiquidity(item, index)}
                  >
                    Add {bptAmountIn}
                  </Button>
                  {bptAmountIn > 0 ? (
                    <Button
                      className={styles.removeLiquidityButton}
                      onClick={() => handleWithdrawLiquidity(item, index)}
                    >
                      Remove
                    </Button>
                  ) : (
                    <></>
                  )}
                </Box>
              </TableCell>
            );
          }
          return <TableCell key={idx} />;
        })}
      </TableRow>
    </>
  );
};

export default LiquidityPoolListTableRow;
