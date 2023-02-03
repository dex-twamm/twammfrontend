import React from "react";
import styles from "../../css/LiquidityPoolList.module.css";
import Tabs from "../Tabs";
import TokenIcon from "@mui/icons-material/Token";
import {
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getPoolTokens } from "../../utils/poolUtils";
import { Box } from "@mui/system";

const tableColumns = [
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
  {
    id: "volume",
    label: "Volume(24h)",
    minWidth: 20,
    align: "left",
  },
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
  const networks = [
    {
      network: "Goerli",
      poolId: 0,
    },
    {
      network: "Goerli",
      poolId: 1,
    },
    {
      network: "Ethereum",
      poolId: 0,
    },
  ];
  const tableData = [
    getPoolTokens(networks[0]),
    getPoolTokens(networks[1]),
    getPoolTokens(networks[2]),
  ];

  return (
    <>
      <Box className={styles.rootBox}>
        <Tabs />
        <Box className={styles.tableBox}>
          <TableContainer>
            <Table className={styles.poolTable}>
              <TableHead>
                <TableRow>
                  {tableColumns?.map((column, idx) => (
                    <TableCell
                      key={idx}
                      align={column.align}
                      className={styles.tableColumnCell}
                    >
                      <span className={styles.tableColumnLabel}>
                        {column?.label}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData?.map((item, index) => {
                  return (
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
                              <p>$245,667,690</p>
                            </TableCell>
                          );
                        }
                        if (column.id === "volume") {
                          return (
                            <TableCell key={idx}>
                              <p>$33,725,975</p>
                            </TableCell>
                          );
                        }
                        if (column.id === "apr") {
                          return (
                            <TableCell key={idx}>
                              <p className={styles.apr}>1.28% - 2.19%</p>
                            </TableCell>
                          );
                        }
                        if (column.id === "action") {
                          return (
                            <TableCell key={idx} align={column.align}>
                              <Box className={styles.buttonBox}>
                                <Button className={styles.addLiquidityButton}>
                                  Add Liquidity
                                </Button>
                                <Button
                                  className={styles.removeLiquidityButton}
                                >
                                  Remove Liquidity
                                </Button>
                              </Box>
                            </TableCell>
                          );
                        }
                        return <TableCell key={idx} />;
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default LiquidityPoolLists;
