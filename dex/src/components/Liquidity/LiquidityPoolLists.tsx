import styles from "../../css/LiquidityPoolList.module.css";
import Tabs from "../Tabs";
import TokenIcon from "@mui/icons-material/Token";
import { getPoolTokens, getPoolLength } from "../../utils/poolUtils";
import { Box } from "@mui/system";
import AddLiquidity from "./AddLiquidity";
import WithdrawLiquidity from "./WithdrawLiquidity";
import LiquidityPoolListTableRow from "./LiquidityPoolListTableRow";
import { useNetworkContext } from "../../providers/context/NetworkProvider";
import { useLocation } from "react-router-dom";
export interface TableColumnsTypes {
  id: string;
  label: string | JSX.Element;
}

const tableColumns: TableColumnsTypes[] = [
  {
    id: "tokens",
    label: <TokenIcon sx={{ paddingTop: "5px" }} />,
  },
  {
    id: "composition",
    label: "Composition",
  },
  {
    id: "pool_value",
    label: "Pool value (Apr)",
  },
  {
    id: "liquidity",
    label: "Liquidity",
  },
  {
    id: "action",
    label: "Action",
  },
];

const LiquidityPoolLists = () => {
  const { selectedNetwork } = useNetworkContext();
  const location = useLocation();

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
      {location.pathname === "/liquidity/add-liquidity" ? (
        <AddLiquidity />
      ) : location.pathname === "/liquidity/remove-liquidity" ? (
        <WithdrawLiquidity />
      ) : (
        <Box className={styles.rootBox}>
          <Tabs />
          <Box className={styles.tableBox}>
            <table className={styles.poolTable}>
              <thead className={styles.tableHead}>
                <tr>
                  {tableColumns?.map(
                    (column: TableColumnsTypes, idx: number) => (
                      <th key={idx} className={styles.tableColumnCell}>
                        <span className={styles.tableColumnLabel}>
                          {column?.label}
                        </span>
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {getTableData()?.map((item, index) => {
                  return (
                    <LiquidityPoolListTableRow
                      key={index}
                      tableColumns={tableColumns}
                      item={item}
                      index={index}
                    />
                  );
                })}
              </tbody>
            </table>
          </Box>
        </Box>
      )}
    </>
  );
};

export default LiquidityPoolLists;
