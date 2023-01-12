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

const LongTermSwapCardDropdown = (props) => {
  const { withdrawals } = props;
  const { selectedNetwork } = useContext(UIContext);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen((state) => !state);

  return (
    <>
      <div>
        <Box
          id="basic-menu"
          onClose={handleClose}
          menulistprops={{
            "aria-labelledby": "basic-button",
          }}
        >
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
                  Withdrawals
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
                  {withdrawals.map((items) => {
                    const withdrawnAmount = bigToStr(items.proceeds, 18);
                    const transactionHash = items.transactionHash;
                    const handleClick = () => {
                      window.open(
                        `${getBlockExplorerTransactionUrl(
                          selectedNetwork?.network
                        )}${transactionHash}`
                      );
                    };
                    return (
                      <Box
                        className={styles.withdrawlBox}
                        key={transactionHash}
                      >
                        <CircleIcon
                          fontSize="small"
                          sx={{
                            color: "#808080",
                            fontSize: "12px",
                          }}
                        />
                        <Box className={styles.infoBox}>
                          <span className={styles.infoSpan}>
                            {`Token withdrawal of ${withdrawnAmount} `}
                            <IconButton onClick={handleClick}>
                              <LaunchIcon
                                fontSize="medium"
                                className={styles.launchIconStyle}
                              ></LaunchIcon>
                            </IconButton>
                          </span>
                        </Box>
                      </Box>
                    );
                  })}
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
