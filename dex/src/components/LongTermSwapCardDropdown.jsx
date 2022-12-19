import { Box, IconButton, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import LaunchIcon from "@mui/icons-material/Launch";
import CircleIcon from "@mui/icons-material/Circle";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { FiChevronDown } from "react-icons/fi";
import { bigToStr } from "../utils";
import { UIContext } from "../providers";
import { getBlockExplorerTransactionUrl } from "../utils/networkUtils";

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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              borderRadius: "24px",
              minHeight: "100px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "space-between",
                width: "95%",
                p: { xs: "5px 2px", sm: "10px 14px" },
                border: "2px solid #f1f1f1",
                borderRadius: "24px",
                gap: "5px",
                m: "16px 0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                  color: "#333333",
                  fontFamily: "Open Sans",
                  gap: { xs: "0px", sm: "5px" },
                  padding: "4px",
                }}
              >
                <Typography
                  onClick={handleClose}
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    color: "#333333",
                    fontSize: "18px",
                    fontFamily: "Open Sans",
                    fontWeight: 600,
                  }}
                >
                  Withdrawals
                </Typography>

                {open ? (
                  <KeyboardArrowUpOutlinedIcon
                    sx={{
                      fontSize: "24px",
                      color: "#333333",
                      cursor: "pointer",
                      mr: "10px",
                    }}
                    onClick={handleClose}
                  />
                ) : (
                  <FiChevronDown
                    fontSize={"24px"}
                    style={{
                      color: "#333333",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                    onClick={handleClose}
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
                        key={transactionHash}
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: {
                            xs: "flex-start",
                            sm: "flex-start",
                            md: "flex-start",
                          },
                          justifyContent: "center",
                          padding: "5px",
                          paddingLeft: "0px",
                          marginLeft: "0px",
                        }}
                      >
                        <CircleIcon
                          fontSize="small"
                          sx={{
                            color: "#808080",
                            fontSize: "12px",
                            ml: { xs: "5px", sm: 0, md: 0 },
                            mt: { xs: "7px", sm: "7px", md: "7px" },
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: { xs: "flex-start", sm: "center" },
                            marginLeft: "10px",
                            color: "#333333",
                            width: "90%",
                          }}
                        >
                          <Typography
                            sx={{
                              display: "flex",
                              alignItems: {
                                xs: "flex-start",
                                sm: "flex-start",
                              },
                              fontFamily: "Open Sans",
                              fontSize: { xs: "14px", sm: "16px" },
                              color: "#333333",
                              width: "100%",
                              ml: { xs: "5px", sm: "0px" },
                            }}
                          >
                            {`Token withdrawal of ${withdrawnAmount} `}
                            <IconButton onClick={handleClick}>
                              <LaunchIcon
                                fontSize="medium"
                                sx={{
                                  display: { xs: "inline-block" },
                                  boxSizing: "border-box",
                                  fontSize: "15px",
                                  cursor: "pointer",
                                }}
                              ></LaunchIcon>
                            </IconButton>
                          </Typography>
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
