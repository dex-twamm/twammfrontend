import { Avatar, Button, TableCell, TableRow } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useMemo } from "react";
import styles from "../../css/LiquidityPoolList.module.css";
import { ShortSwapContext, UIContext } from "../../providers";
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
  const { web3provider, account } = useContext(ShortSwapContext);
  const { selectedNetwork } = useContext(UIContext);

  const handleAddLiquidity = (item) => {
    setIsAddLiquidity(true);
    setSelectedTokenPair([...item, index]);
  };

  const handleWithdrawLiquidity = () => {
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
  }, [web3provider, item, account, setBptAmountIn, currentNetwork]);

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
                    onClick={() => handleAddLiquidity(item)}
                  >
                    Add
                  </Button>
                  {bptAmountIn ? (
                    <Button
                      className={styles.removeLiquidityButton}
                      onClick={() => handleWithdrawLiquidity(item)}
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
