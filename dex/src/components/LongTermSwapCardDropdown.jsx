import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import LaunchIcon from "@mui/icons-material/Launch";
import CircleIcon from "@mui/icons-material/Circle";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { FiChevronDown } from "react-icons/fi";
import { bigToStr } from "../utils";
import { POOLS, POOL_ID } from "../utils/pool";

const LongTermSwapCardDropdown = (props) => {
  const [open, setOpen] = useState(false);

  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen((state) => !state);

  const { withdrawals } = props;

  return (
    <>
      <div>
        <Box
          id="basic-menu"
          onClose={handleClose}
          MenuListProps={{
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
              // p:'10px',
              borderRadius: "24px",
              minHeight: "100px",
              // border:'1px solid red'
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
                    // justifyContent: "center",
                    color: "#333333",
                    fontSize: "18px",
                    fontFamily: "Open Sans",
                    fontWeight: 600,
                  }}
                >
                  Withdrawals
                </Typography>
                {/* <span style={{color:'#333333',opacity:0.7,background:'#f7f8fa',borderRadius:'10px' ,padding:'4px 6px'}}>$1.23</span> */}

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
                        `${
                          Object.values(
                            POOLS[localStorage.getItem("coin_name")]
                          )[0]?.transactionUrl
                        }${transactionHash}`
                      );
                    };
                    return (
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: {
                            xs: "flex-start",
                            sm: "flex-start",
                            md: "flex-start",
                          },
                          justifyContent: "center",
                          // border:'1px solid red',
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

                    // {
                    //   /* //---------------------------------------------------- */
                    // }

                    // <Box
                    //   sx={{
                    //     width: "100%",
                    //     display: "flex",
                    //     alignItems: {
                    //       xs: "flex-start",
                    //       sm: "flex-start",
                    //       md: "flex-start",
                    //     },
                    //     justifyContent: "center",
                    //     // border:'1px solid red',
                    //     padding: "5px",
                    //     paddingLeft: "0px",
                    //     marginLeft: "0px",
                    //   }}
                    // >
                    //   <CircleIcon
                    //     fontSize="small"
                    //     sx={{
                    //       color: "#808080",
                    //       fontSize: "12px",
                    //       ml: { xs: "5px", sm: 0, md: 0 },
                    //       mt: { xs: "7px", sm: "7px", md: "7px" },
                    //     }}
                    //   />
                    //   <Box
                    //     sx={{
                    //       display: "flex",
                    //       alignItems: { xs: "flex-start", sm: "center" },
                    //       marginLeft: "10px",
                    //       color: "#333333",
                    //       width: "90%",
                    //     }}
                    //   >
                    //     <Typography
                    //       sx={{
                    //         display: "flex",
                    //         alignItems: { xs: "flex-start", sm: "flex-start" },
                    //         fontFamily: "Open Sans",
                    //         fontSize: { xs: "16px", sm: "18px" },
                    //         color: "#333333",
                    //         width: "100%",
                    //         ml: { xs: "5px", sm: "0px" },
                    //       }}
                    //     >
                    //       {`Withdrawal of 0.1 Token at 12:15 `}
                    //       <LaunchIcon
                    //         fontSize="medium"
                    //         sx={{
                    //           display: { xs: "inline-block" },
                    //           boxSizing: "border-box",
                    //           ml: { xs: "20px", sm: "10px" },
                    //           mr: 1,
                    //           fontSize: "18px",
                    //           cursor: "pointer",
                    //           mt: { xs: "6px", sm: "6px", md: "6px" },
                    //         }}
                    //       />
                    //     </Typography>
                    //   </Box>
                    // </Box>;
                  })}
                </>
              )}
            </Box>

            {/* <Box sx={{display:'flex',flexDirection:'column',gap:'8px'}}>
                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <Typography>Expected Output</Typography>
                    <Typography><span>{`3262.56 ${tokenB.symbol}`}</span></Typography>
                </Box>
                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <Typography>Price Impact</Typography>
                    <Typography>-0.01%</Typography>
                </Box>
                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <Typography>Minimum received after slippage (0.50%)</Typography>
                    <Typography><span>{`3262.56 ${tokenB.symbol}`}</span></Typography>
                </Box>
                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <Typography>Network Fee</Typography>
                    <Typography>~ $3.42</Typography>
                </Box>
            </Box> */}
          </Box>
        </Box>
      </div>
    </>
  );
};

export default LongTermSwapCardDropdown;
