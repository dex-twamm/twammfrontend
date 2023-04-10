import { Avatar, Button, TableCell, TableRow } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../css/LiquidityPoolList.module.css";
import { useNetworkContext } from "../../providers/context/NetworkProvider";
import { useShortSwapContext } from "../../providers/context/ShortSwapProvider";
import { getPoolContract } from "../../utils/getContracts";
import { TokenType } from "../../utils/pool";
import { getPoolId } from "../../utils/poolUtils";
import { TableColumnsTypes } from "./LiquidityPoolLists";

interface PropTypes {
  tableColumns: TableColumnsTypes[];
  item: TokenType[];
  index: number;
}

const LiquidityPoolListTableRow = ({
  tableColumns,
  item,
  index,
}: PropTypes) => {
  const { web3provider, account } = useShortSwapContext();
  const { selectedNetwork } = useNetworkContext();
  const navigate = useNavigate();
  const [bptAmountIn, setBptAmountIn] = useState(0);

  const handleAddLiquidity = (index: number) => {
    const poolId = getPoolId({ ...selectedNetwork, poolId: index });
    navigate(`/liquidity/add-liquidity?pool=${poolId}&id=${index}`);
  };

  const handleWithdrawLiquidity = (index: number) => {
    const poolId = getPoolId({ ...selectedNetwork, poolId: index });
    navigate(`/liquidity/remove-liquidity?pool=${poolId}&id=${index}`, {
      state: { bptAmount: bptAmountIn },
    });
  };

  useEffect(() => {
    const currentNetwork = {
      ...selectedNetwork,
      poolId: index,
    };
    const getPoolTokenData = async () => {
      const signer = web3provider?.getSigner();
      const poolContract = getPoolContract(currentNetwork, signer);
      const balance = await poolContract.balanceOf(account);
      setBptAmountIn(parseFloat(balance.toString()));
    };
    getPoolTokenData();
  }, [web3provider, account, setBptAmountIn, selectedNetwork, index]);

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
                    onClick={() => {
                      handleAddLiquidity(index);
                    }}
                  >
                    Add {bptAmountIn}
                  </Button>
                  {bptAmountIn > 0 ? (
                    <Button
                      className={styles.removeLiquidityButton}
                      onClick={() => {
                        handleWithdrawLiquidity(index);
                      }}
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
