// Sagar
import { Box, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/LiquidityPools.css";

// import { POOL_ID } from "../../utils";
import { POOLS } from "../../utils/pool";
import { useContext } from "react";
import { ShortSwapContext } from "../../providers";

import CircularProgressBar from "../alerts/CircularProgressBar";
import Tabs from "../Tabs";
import {
  getpoolBalancerUrl,
  getPoolFees,
  getPoolTokens,
} from "../../utils/poolUtils";
import { UIContext } from "../../providers/context/UIProvider";

const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  fontSize: "16px",
  fontWeight: 200,
  top: { md: "31%", xs: "35%", sm: "29.5%", lg: "31%" },
  left: { md: "66%", xs: "65%", sm: "57%", lg: "66%" },
  transform: "translate(-50%, -50%)",
  width: 200,
  height: "180px",
  bgcolor: "#F7F8FA ",
  boxShadow: 24,
  borderRadius: "12px",
  p: 2,
  bgcolor: "white",
};

//   const label = { inputProps: { 'aria-label': 'Switch demo' } };

const LiquidityPools = ({ showAddLiquidity, showRemoveLiquidity }) => {
  const { LPTokenBalance, loading, isWalletConnected } =
    useContext(ShortSwapContext);
  const { selectedNetwork } = useContext(UIContext);

  //   const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  //   const handleOpen = () => setOpen(true);
  //   const handleClose = () => setOpen(false);

  console.log("Loading", loading);

  const handleMoreOption = () => {
    navigate("/");
  };

  const poolTokens = getPoolTokens(selectedNetwork?.network);

  console.log("LP Token balance", LPTokenBalance, POOLS);
  return (
    <Box
      sx={{
        // width: { sm: "100%", xs: "100%", md: "800px" },
        width: "fit-content",
        p: "8px",
        borderRadius: "20px",
        dispay: "flex",
        justifyContent: "center",
        margin: "auto",
        // mt: "24px",
        fontFamily: "Open Sans",
        // border:'1px solid red',
      }}
    >
      <Tabs />
      {!isWalletConnected ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography
            sx={{
              fontSize: "22px",
              fontFamily: "Open Sans",
              color: "#333333",
              fontWeight: "600",
            }}
          >
            Connect your wallet to view your Pools.
          </Typography>
        </Box>
      ) : !loading ? (
        <>
          {" "}
          <Box
            sx={{
              display: "flex",
              alignItems: {
                xs: "flex-start",
                sm: "center",
                md: "center",
                lg: "center",
              },
              justifyContent: {
                xs: "center",
                sm: "space-between",
                md: "space-between",
              },
              flexDirection: { xs: "column", sm: "row", md: "row" },
              padding: "24px 0",
            }}
          >
            <Typography
              sx={{
                fontSize: "22px",
                fontFamily: "Open Sans",
                color: "#333333",
                fontWeight: "600",
              }}
            >
              Pools
            </Typography>
          </Box>
          <Box
            // key={index}
            sx={{
              //   width: { sm: "100%", xs: "50%", md: "60%" },
              display: "flex",
              flexDirection: { xs: "row-reverse", sm: "row" },
              justifyContent: { xs: "flex-end", sm: "flex-end" },
              alignItems: "center",
            }}
          >
            {/* <Button
							  onClick={handleOpen}
							  sx={{
								  // backgroundColor:'#e94393',
								  background:'white',
								  margin:'5px',
								  borderRadius:'12px',
								  height:'35px',
								  fontFamily:'Open Sans',
								  fontSize:'18px',
								  fontWeight:'500',
								  border:'none',
								  outline:'none',
								  padding:{xs:'6px 8%',sm:'6px 8px',md:'6px 8px',lg:'6px 8px'},
								  color:'black',
								  display:'flex',
								  alignItems:'center',
								  justifyContent:'center',
								  cursor:'pointer',
								  textTransform:'capitalize'
								  // width:'content-fit',
	  
	  
							  }}
						  >
							  More  <KeyboardArrowDownIcon size='large' sx={{ml:"1px",}}/>
						  </Button> */}

            {/* <Button
							  onClick={() => showAddLiquidity(true)}
							  sx={{
								  backgroundColor:'#d50066',
								  borderRadius:'12px',
								  fontFamily:'Open Sans',
								  fontSize:'18px',
								  height:'35px',
								  width:{xs:'90%',sm:'auto',md:'auto'},
								  fontWeight:'500',
								  border:'none',
								  outline:'none',
								  padding:{xs:'6px 10%',sm:'6px 8px',md:'6px 8px',},
								  color:'white',
								  display:'flex',
								  textTransform:'capitalize',
								  alignItems:'center',
								  cursor:'pointer',
								  margin:{md:'5px',sm:'5px',xs:'5px 5px 5px 0px'},
								  ':hover':{background:'#e94393',color:'white'}
	  
							  }}
						  >
						  <AddIcon sx={{mr:'2px'}} />	New Position
						  </Button>
	  
					  
						  <Modal
							  open={open}
							  onClose={handleClose}
							  aria-labelledby='modal-modal-title'
							  aria-describedby='modal-modal-description'
						  >
							  <Box sx={style}>
								  <Box
									  onClick={handleMoreOption}
									  sx={{
										  display: 'flex',
										  justifyContent: 'space-between',
										  cursor: 'pointer',
										  fontWeight: 200,
										  fontFamily:'Open Sans',
										  bgcolor:'white',
										  color: '#565A69'
										  
									  }}
								  >
									  <p  style={{fontFamily:'Open Sans',color: '#565A69',fontSize:'18px'}}>Create a pool</p>
									  <AddCircleOutlineIcon
										  sx={{ cursor: 'pointer' }}
										  fontSize='large'
									  />
								  </Box>
								  <Box
									  onClick={handleMoreOption}
									  sx={{
										  display: 'flex',
										  justifyContent: 'space-between',
										  cursor: 'pointer',
										  fontWeight: 200,
										  fontFamily:'Open Sans',
										  color: '#565A69',
									  }}
								  >
									  <p  style={{fontFamily:'Open Sans',color:'#565A69',fontSize:'18px'}}>Migrate</p>
									  <KeyboardDoubleArrowRightIcon
										  sx={{ cursor: 'pointer' }}
										  fontSize='large'
									  />
								  </Box>
								  <Box
									  onClick={handleMoreOption}
									  sx={{
										  display: 'flex',
										  justifyContent: 'space-between',
										  cursor: 'pointer',
										  fontWeight: 200,
										  fontFamily:'Open Sans',
										  color: '#565A69'
									  }}
								  >
									  <p style={{fontFamily:'Open Sans',color: '#565A69',fontSize:'18px'}}>V2 liquidity</p>
									  <LayersIcon
										  sx={{ cursor: 'pointer' }}
										  fontSize='large'
									  />
								  </Box>
								  <Box
									  onClick={handleMoreOption}
									  sx={{
										  display: 'flex',
										  justifyContent: 'space-between',
										  cursor: 'pointer',
										  fontFamily:'Open Sans',
										  color: '#565A69'
	  
									  }}
								  >
									  <p  style={{fontFamily:'Open Sans',color: '#565A69',fontSize:'18px'}}>Learn</p>
									  <ImportContactsOutlinedIcon
										  sx={{ cursor: 'pointer', bgcolor: 'white', color:'grey'}}
										  fontSize='large'
										  
	  
									  />
								  </Box>
							  </Box>
						  </Modal> */}

            <Box
              sx={{
                bgcolor: " white",
                // opacity: items == 0 && 0.5,
                width: "100%",
                p: "8px",
                borderRadius: "20px",
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%), rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(2px)",

                border: "1px solid white",
              }}
            >
              {/* <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pr: "10px",
                  pl: "10px",
                }}
              > */}
              {/* <Typography
                  style={{
                    fontWeight: 400,
                    color: "#333333",
                    fontSize: { xs: "10px", sm: "14px" },
                    fontFamily: "Open Sans",
                  }}
                >
                  Your positions (1)
                </Typography> */}
              {/* <Box sx={{ display: "flex", alignItems: "center", pl: "10px" }}> */}
              {/* <Typography
					style={{
					  fontWeight: 400,
					  color: "#333333",
					  fontSize: { xs: "10px", sm: "14px" },
					  fontFamily: "Open Sans",
					  marginRight: "10px",
					}}
				  >
					Show closed positions
				  </Typography> */}
              {/* <Switch size='large' defaultChecked />
               */}
              {/* <button
					onClick={() => setButtonEnabled((state) => !state)}
					className={styles.collectBtn}
					style={{ height: "5%" }}
				  >
					<div
					  className={classNames(
						styles.circle,
						buttonEnabled && styles.true
					  )}
					></div>
				  </button> */}
              {/* </Box> */}
              {/* </Box> */}
              <Box
                style={{
                  marginTop: "5px",
                  // border: "2px solid #f0f0f0",
                  // borderRadius: "15px",
                  width: { sm: "60%", xs: "100%", md: "70%" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    boxSizing: "border-box",
                    p: 1,
                    minWidth: "100%",
                    height: "auto",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                      height: "2%",
                      // background: "white",
                      paddingBottom: "20px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "20px",
                        alignItems: "center",

                        m: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            background: "blue",
                            height: "40px",
                            width: "40px",
                          }}
                          alt="Testv4"
                          src="Testv4.jpeg"
                        />
                        <Avatar
                          sizes="small"
                          sx={{
                            left: "-10px",
                            // top: 4,
                            background: "green",
                            height: "40px",
                            width: "40px",
                          }}
                          alt="Faucet"
                          src="ethereum.png"
                        />
                      </Box>
                      <Typography
                        sx={{
                          mr: 1,
                          fontWeight: 500,
                          color: "#333333",
                          fontSize: { xs: 16 },
                          fontFamily: "Open Sans",
                        }}
                      >
                        {`${
                          Object.values(POOLS?.[selectedNetwork?.network])?.[0]
                            .tokens[0].symbol
                        } / ${
                          Object.values(POOLS?.[selectedNetwork?.network])?.[0]
                            .tokens[1].symbol
                        }`}
                      </Typography>
                      <span
                        style={{
                          padding: "8px 24px",
                          // width: '45px',
                          border: "1px solid #fdeaf1",
                          // borderRadius: "7px",
                          // background: "#fdeaf1",
                          color: "red",
                          fontFamily: "Open Sans",
                          fontWeight: 500,

                          background: "#EE4D3745",
                          // opacity: "0.2",
                          borderRadius: "17px",
                        }}
                      >
                        {getPoolFees(selectedNetwork?.network)}%
                      </span>
                    </Box>

                    {/* <Box
					  sx={{
						display: "flex",
						alignItems: "center",
						borderRadius: "10px",
						boxSizing: "border-box",
						p: 1,
						border: "none",
						bgcolor: " #f0f0f0",
						border: "2px solid grey",
						width: "110px",
					  }}
					>
					  <div
						style={{
						  height: "12px",
						  width: "12px",
						  marginRight: "9%",
						  borderRadius: "100%",
						  backgroundColor: "green",
						}}
					  ></div>
					  <p
						style={{
						  display: "flex",
						  color: "#333333",
						  height: 1,
						  alignItems: "center",
						  fontFamily: "Open Sans",
						}}
					  >
						{" "}
						In range{" "}
					  </p>
					</Box> */}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    m: 1,
                    width: "fit-content",
                    paddingBottom: "20px",
                  }}
                >
                  <Typography
                    style={{
                      fontWeight: 500,
                      color: "grey",
                      fontFamily: "Open Sans",
                    }}
                  >
                    Your LP Token Balance:{" "}
                    <span
                      style={{
                        fontWeight: 400,
                        color: "#333333",
                        fontFamily: "Open Sans",
                      }}
                    >
                      {LPTokenBalance}
                    </span>
                  </Typography>

                  {/* <Box
					sx={{
					  display: "flex",
					  alignItems: "center",
					  justifyContent: "center",
					  color: "#333333",
					  mr: { xs: "19px" },
					}}
				  >
					<ArrowBackIcon
					  fontSize="small"
					  sx={{ mr: 0, ml: { xs: 3, sm: 4 }, color: "#333333" }}
					/>{" "}
					<ArrowForwardIcon
					  fontSize="small"
					  sx={{ ml: -1, mr: 1, color: "#333333" }}
					/>
				  </Box> */}

                  {/* <Typography
					style={{
					  fontWeight: 500,
					  color: "grey",
					  fontFamily: "Open Sans",
					}}
				  >
					Max:{" "}
					<span
					  style={{
						fontWeight: 400,
						color: "#333333",
						fontFamily: "Open Sans",
					  }}
					>
					  ∞ UNI per ETH
					</span>
				  </Typography> */}
                </Box>

                <Box
                  sx={{
                    m: 1,
                    paddingRight: { xs: "10px", sm: "10px" },
                    display: "flex",
                    flexDirection: "column-reverse",
                    rowGap: "10px",
                    justifyContent: {
                      xs: "space-between",
                      sm: "flex-end",
                      md: "flex-end",
                    },
                    // width: { xs: "100%", sm: "100%" },
                    // height: "40px",
                    alignItems: "center",
                  }}
                >
                  {LPTokenBalance != 0 && (
                    <button
                      style={{
                        fontFamily: "Open Sans",
                        padding: "15px 100px",
                        outline: "none",
                        color: "white",
                        fontWeight: "100",
                        border: "none",
                        fontSize: "18px",
                        cursor: "pointer",
                        backgroundColor: "#FF6969",
                        borderRadius: "17px",
                        width: "100%",
                      }}
                    >
                      Remove Liquidity
                    </button>
                  )}
                  <button
                    onClick={() =>
                      window.open(
                        `${getpoolBalancerUrl(selectedNetwork?.network)}`,
                        "_blank"
                      )
                    }
                    style={{
                      fontFamily: "Open Sans",
                      padding: "15px 100px",
                      outline: "none",
                      color: "white",
                      fontWeight: "100",
                      border: "none",
                      fontSize: "18px",
                      cursor: "pointer",
                      backgroundColor: "#554994",
                      borderRadius: "17px",
                      width: "100%",
                    }}
                  >
                    Add Liquidity
                  </button>
                </Box>
              </Box>
            </Box>
          </Box>{" "}
        </>
      ) : (
        <CircularProgressBar
          margin={"20%"}
          label={"Please Wait"}
        ></CircularProgressBar>
      )}
    </Box>
  );
};
export { LiquidityPools };
