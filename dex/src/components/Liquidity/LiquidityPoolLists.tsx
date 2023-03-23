import React, { useState } from "react";
import styles from "../../css/LiquidityPoolList.module.css";
import Tabs from "../Tabs";
import TokenIcon from "@mui/icons-material/Token";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getPoolTokens, getPoolLength } from "../../utils/poolUtils";
import { Box } from "@mui/system";
import AddLiquidity from "./AddLiquidity";
import WithdrawLiquidity from "./WithdrawLiquidity";
import LiquidityPoolListTableRow from "./LiquidityPoolListTableRow";
import { useNetworkContext } from "../../providers/context/NetworkProvider";

interface TableColumnsTypes {
  id: string;
  label: string | JSX.Element;
  minWidth?: number;
  align?: "inherit" | "left" | "center" | "right" | "justify";
}

const tableColumns: TableColumnsTypes[] = [
  {
    id: "tokens",
    label: <TokenIcon sx={{ paddingTop: "5px" }} />,
    minWidth: 100,
    align: "center",
  },
  {
    id: "composition",
    label: "Composition",
    minWidth: 150,
  },
  {
    id: "pool_value",
    label: "Pool value",
    minWidth: 150,
    align: "left",
  },
  // {
  //   id: "volume",
  //   label: "Volume(24h)",
  //   minWidth: 20,
  //   align: "left",
  // },
  {
    id: "apr",
    label: "APR",
    minWidth: 100,
    align: "center",
  },
  {
    id: "action",
    label: "Action",
    align: "center",
  },
];

const LiquidityPoolLists = () => {
  const { selectedNetwork } = useNetworkContext();

  const [selectedTokenPair, setSelectedTokenPair] = useState();
  const [isAddLiquidity, setIsAddLiquidity] = useState(false);
  const [isWithdrawLiquidity, setIsWithdrawLiquidity] = useState(false);
  const [bptAmountIn, setBptAmountIn] = useState();

  const getTableData = () => {
    const poolLength = getPoolLength(selectedNetwork);
    let tableData = [];
    for (let i = 0; i < poolLength; i++) {
      const networkData = { ...selectedNetwork, poolId: i };
      tableData.push(getPoolTokens(networkData));
    }
    return tableData;
  };

  return (
    <>
      {isAddLiquidity ? (
        <AddLiquidity selectedTokenPair={selectedTokenPair} />
      ) : isWithdrawLiquidity ? (
        <WithdrawLiquidity
          selectedTokenPair={selectedTokenPair}
          bptAmountIn={bptAmountIn}
        />
      ) : (
        <Box className={styles.rootBox}>
          <Tabs />
          <Box className={styles.tableBox}>
            <TableContainer>
              <Table className={styles.poolTable}>
                <TableHead>
                  <TableRow>
                    {tableColumns?.map(
                      (column: TableColumnsTypes, idx: number) => (
                        <TableCell
                          key={idx}
                          align={column.align ?? undefined}
                          className={styles.tableColumnCell}
                        >
                          <span className={styles.tableColumnLabel}>
                            {column?.label}
                          </span>
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getTableData()?.map((item, index) => {
                    return (
                      <LiquidityPoolListTableRow
                        tableColumns={tableColumns}
                        item={item}
                        index={index}
                        setIsAddLiquidity={setIsAddLiquidity}
                        setSelectedTokenPair={setSelectedTokenPair}
                        setIsWithdrawLiquidity={setIsWithdrawLiquidity}
                        setBptAmountIn={setBptAmountIn}
                        bptAmountIn={bptAmountIn}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}
    </>
  );
};

export default LiquidityPoolLists;
