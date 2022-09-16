import { Box, Button, Typography } from '@mui/material'
import React,{useState} from 'react'
import LaunchIcon from '@mui/icons-material/Launch';
import CircleIcon from '@mui/icons-material/Circle';




const LongTermSwapCardDropdown = (props) => {

	// const [open, setOpen] = useState(false);



    // const handleOpen = () => setOpen(true);
	// const handleClose = () => setOpen(state => !state);

    const {tokenB, open,handleClose} = props;


  


  return (
    <>
        <div>
   
      {open && <Box
        id="basic-menu"
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Box sx={{display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center',
                    width:'100%',
                    // p:'10px',
                    borderRadius:'24px',
                    minHeight:'100px',
                      // border:'1px solid red'
                    }}>

          <Box 
            sx={{
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'space-between',
                width:'95%',
                p:{xs:'5px 2px',sm:'10px 14px'},
                border:'2px solid #f1f1f1',
                borderRadius:'24px',
                gap:'5px'

            }}>


                <div
                    style={{
                        width:'100%',
                        display:'flex',
                        alignItems:'center',
                        // justifyContent:{xs:'center',sm:'none'},
                        // border:'1px solid red',
                        padding:'5px',
                        paddingLeft:'0px',
                        marginLeft:'0px'
                        }}>

                <CircleIcon fontSize='small' sx={{color:'#808080',fontSize:'12px'}}/>
                <Box sx={{display:'flex',alignItems:'center',marginLeft:'10px',color:'#333333',width:'90%'}}>
                    <Typography sx={{display:'flex',alignItems:'center',fontFamily:'Open Sans',fontSize:{xs:'16px',sm:'18px'},color:'#333333',width:'100%',ml:{xs:"5px",sm:'0px'}}}>{`Withdrawal of 0.1 ${tokenB.symbol} at 12:15 `}
                    <LaunchIcon fontSize='medium' sx={{display:{xs:'inline-block',},boxSizing:'border-box', ml:{xs:'20px',sm:'10px'} ,mr:1,fontSize:"18px",cursor:'pointer'}} />
                    
                    </Typography> 


                </Box>
                </div>



{/* //---------------------------------------------------- */}

<div
                    style={{
                        width:'100%',
                        display:'flex',
                        alignItems:'center',
                        // justifyContent:{xs:'center',sm:'none'},
                        // border:'1px solid red',
                        padding:'5px',
                        paddingLeft:'0px',
                        marginLeft:'0px'
                        }}>

                <CircleIcon fontSize='small' sx={{color:'#808080',fontSize:'12px'}}/>
                <Box sx={{display:'flex',alignItems:'center',marginLeft:'10px',color:'#333333',width:'90%'}}>
                    <Typography sx={{display:'flex',alignItems:'center',fontFamily:'Open Sans',fontSize:{xs:'16px',sm:'18px'},color:'#333333',width:'100%',ml:{xs:"5px",sm:'0px'}}}>{`Withdrawal of 0.1 ${tokenB.symbol} at 12:15 `}
                    <LaunchIcon fontSize='medium' sx={{display:{xs:'inline-block',},boxSizing:'border-box', ml:{xs:'20px',sm:'10px'} ,mr:1,fontSize:"18px",cursor:'pointer'}} />
                    
                    </Typography> 


                </Box>
                </div>

                
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
      </Box>}
    </div>
    </>
  )
}

export default LongTermSwapCardDropdown