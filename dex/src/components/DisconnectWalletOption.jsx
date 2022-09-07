

// Sagar
// import { Modal } from '@mui/material';
import React,{useState} from 'react';
import { Box, Button, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import AdjustIcon from '@mui/icons-material/Adjust';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {Link} from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import CloseIcon from '@mui/icons-material/Close';
import { height } from '@mui/system';


const style = {
	position: 'absolute',
	display:'flex',
	flexDirection:'column',
	justifyContent:'space-evenly',
	alignItems:'flex-start',
	fontSize:'1.2vmax',
	fontWeight:200,
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	minWidth:{xs:'95%',sm:600,},
	minHeight:350,
	bgcolor:'#F7F8FA',
	boxShadow: 24,
	borderRadius:4,
	pt: 2,
	// mr: '5px',
	// ml:'5px'
	// border:'2px solid red',
  };

const DisconnectWalletOption = ({setOpen,open}) => {
	// const [open, setOpen] = useState(true);

	// const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	
  


	return(
		
		<Box sx={{display:'flex', justifyContent:'space-evenly',alignItems:'center',background:'white',borderRadius:4 ,minWidth:50,}}>
			{/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
	  	open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
		<Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center', width:'100%'}}>
		<Typography sx={{color:'black',fontWeight:400,fontSize:'22px',ml:2}}>Account</Typography>
		<Button  onClick={handleClose}><CloseIcon sx={{color:'#f50057'}} /></Button>
		</Box>

          
         <Box sx={{width:'95%',height:'25%',margin:'auto',p:2,boxSizing:'border-box',border:'1px solid  #808080',borderRadius:'15px',}}>
		 
			 
			<Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
			
			<Typography sx={{width:'50%',fontWeight:300,fontSize:'14px'}} id="modal-modal-title" variant="h6" component="h2">
            Connect with Coinbase wallet
          </Typography>

			<Button size='small' disableFocusRipple sx={{pl:'8px',pr:'8px',mr:2,color:'#f50057',borderRadius:'10px',border:'1px solid #f50057',fontSize:{xs:'12px',sm:'14px'}, ":hover":{border:'1px solid #f50057'}}} variant='outlined'>Disconnect</Button>
			
			<Button size='small' sx={{pl:'8px',pr:'8px', color:'#f50057',border:'1px solid #f50057',borderRadius:'10px', fontSize:{xs:'12px',sm:'14px'},":hover":{border:'1px solid #f50057'}}} variant='outlined'>Change</Button>
			</Box>

			<Box sx={{display:'flex',alignItems:'center',mt:2}} >
				 <AdjustIcon sx={{color:'blue',mr:1,fontSize:30,fontWeight:800}} />
				 <span style={{mr:1,fontSize:22,fontWeight:600,width:208,overflow:'hidden'}}>0x2Fhfhejy7487hjfiu48uej9845uf</span>
				 <span style={{mr:1,fontSize:30,fontWeight:600}}>....</span>
				

			</Box>

			<Box sx={{display:'flex',alignItems:'center',mt:2,}}>

				<ContentCopyIcon fontSize='samll' sx={{mr:'5px',color:'#f50057',fontWeight:400,fontSize:{xs:'22px',sm:20}}} />
				<Link to='/'>  <Typography style={{color:'#f50057',fontWeight:400,marginRight:'10px',fontSize:{xs:'35px',sm:20},}}>Copy Address</Typography> </Link>
				<LaunchIcon fontSize='medium' sx={{color:'#808080', ml:4,fontSize:{xs:'22px',sm:20}}} />
				<Typography style={{color:'grey',fontWeight:'bold',marginLeft:'5px',fontSize:{xs:'30px',sm:20}}}> View on Explorer</Typography>

			</Box>

		 
		 </Box>
		 <Box sx={{background:'#DCDCDC',width:'100%',height:60,display:'flex',justifyContent:'center',mt:2,alignItems:'center',borderRadius:'0px 0px 16px 16px'}}>
		 <Typography> Your transactions will appear here...</Typography>

		 </Box>

		 
        </Box>
		
      </Modal>
				
		</Box>
		
		
	);
};

export { DisconnectWalletOption };