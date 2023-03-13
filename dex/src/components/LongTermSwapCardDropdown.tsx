import { Box, IconButton } from "@mui/material";
import React, { useContext, useState } from "react";
import LaunchIcon from "@mui/icons-material/Launch";
import CircleIcon from "@mui/icons-material/Circle";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { FiChevronDown } from "react-icons/fi";
import { bigToStr } from "../utils";
import { UIContext } from "../providers";
import { getBlockExplorerTransactionUrl } from "../utils/networkUtils";
import styles from "../css/LongTermSwapCardDropDown.module.css";
import { TokenType } from "../utils/pool";

interface PropTypes {
  item: any;
  tokenIn: TokenType;
  tokenOut: TokenType;
}

const LongTermSwapCardDropdown = (props: PropTypes) => {
  const { item, tokenIn, tokenOut } = props;
  const { selectedNetwork } = useContext(UIContext)!;
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => setOpen((state) => !state);

  const handleExplorer = (transactionHash: string) => {
    window.open(
      `${getBlockExplorerTransactionUrl(selectedNetwork)}${transactionHash}`
    );
  };

  return (
    <>
      <div>
        <Box id="basic-menu" component="div">
          <Box className={styles.mainBox}>
            <Box
              className={styles.contentBox}
              sx={{
                p: { xs: "5px 2px", sm: "10px 14px" },
              }}
            >
              <Box
                className={styles.insideContentBox}
                sx={{
                  gap: { xs: "0px", sm: "5px" },
                }}
              >
                <span
                  className={styles.withdraw}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                >
                  Withdrawals {item?.unsoldAmount && "and Cancellation"}
                </span>

                {open ? (
                  <KeyboardArrowUpOutlinedIcon
                    className={styles.arrowIconStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose();
                    }}
                  />
                ) : (
                  <FiChevronDown
                    fontSize={"24px"}
                    className={styles.chevronStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose();
                    }}
                  />
                )}
              </Box>

              {open && (
                <>
                  {item?.withdrawals.map((items: any) => (
                    <Box
                      className={styles.withdrawlBox}
                      key={items?.transactionHash}
                    >
                      <CircleIcon
                        fontSize="small"
                        sx={{
                          color: "#808080",
                          fontSize: "8px",
                        }}
                      />
                      <Box className={styles.infoBox}>
                        <span className={styles.infoSpan}>
                          {`Converted token withdrawal of ${bigToStr(
                            items.proceeds,
                            tokenOut.decimals
                          )} ${tokenOut.symbol}`}
                          <IconButton
                            onClick={() =>
                              handleExplorer(items.transactionHash)
                            }
                          >
                            <LaunchIcon
                              fontSize="small"
                              className={styles.launchIconStyle}
                            ></LaunchIcon>
                          </IconButton>
                        </span>
                      </Box>
                    </Box>
                  ))}
                  {item?.unsoldAmount && (
                    <Box
                      className={styles.withdrawlBox}
                      key={item?.transactionHash}
                    >
                      <CircleIcon
                        fontSize="small"
                        sx={{
                          color: "#808080",
                          fontSize: "8px",
                        }}
                      />
                      <Box className={styles.infoBox}>
                        <span className={styles.infoSpan}>
                          {`Unconverted token withdrawal of ${bigToStr(
                            item.unsoldAmount,
                            tokenIn.decimals
                          )} ${tokenIn.symbol}`}
                          <IconButton
                            onClick={() =>
                              handleExplorer(
                                item?.withdrawals[item?.withdrawals.length - 1]
                                  ?.transactionHash
                              )
                            }
                          >
                            <LaunchIcon
                              fontSize="small"
                              className={styles.launchIconStyle}
                            ></LaunchIcon>
                          </IconButton>
                        </span>
                      </Box>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default LongTermSwapCardDropdown;
