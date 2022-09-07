// Sagar
import React, {useState} from 'react';
import '../../css/LiquidityPools.css'
import { Box, Button, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import LayersIcon from '@mui/icons-material/Layers';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const style = {
	position: 'absolute',
	display:'flex',
	flexDirection:'column',
	justifyContent:'space-between',
	fontSize:'1.2vmax',
	fontWeight:200,
	top: '79%',
	left: {md:'63%',xs:'60%'},
	transform: 'translate(-50%, -50%)',
	width: 300,
	height:"180px",
	bgcolor:'#F7F8FA',
	boxShadow: 24,
	borderRadius:4,
	p: 2,
  };

//   const label = { inputProps: { 'aria-label': 'Switch demo' } };


const LiquidityPools = () => {
	const [open, setOpen] = useState(false);

	const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMoreOption = () =>{
	navigate('/')
	

  }
	return ( 
	<Box sx={{p:{xs:'14px',sm:'40px',}, bgcolor:'white',minWidth:{sm:'50%', xs:'100%',md:'50%'}, mt:3, mb:4, minHeight:300, borderRadius:4}}>
		<Box sx={{display:'flex', justifyContent:'space-between',alignItems:'center' }}>
			<Typography sx={{fontSize:'2.5vmax'}}>Pools</Typography>
			<Box sx={{position:'relative', width:{sm:'80%',xs:'80%', md:'70%'},display:'flex', justifyContent:{sm:'flex-end'},  flexDirection:{xs:'row-reverse', sm:'row'},alignItems:'center', 
			}}>
				<Button  onClick={handleOpen} disableRipple endIcon={< KeyboardArrowDownIcon size='large' />} variant='contained' sx={{bgcolor:'#f50057', color:'#fff',borderRadius:4, ":hover":{bgcolor:'#f50057'}}}>More</Button>
				<Button size='medium'  disableRipple startIcon={<AddIcon />} variant="contained" sx={{bgcolor:"#f50057", ml:{sm:0.5}, mr:{xs:0.5},borderRadius:4,  ":hover":{bgcolor:'#f50057'}}}>New Position</Button>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
					>
					<Box sx={style}>
						
						<Box onClick={handleMoreOption} sx={{display:'flex', justifyContent:'space-between',cursor:'pointer',fontWeight:200}}>
							<p>Create a pool</p>
							<AddCircleOutlineIcon sx={{cursor:'pointer'}} fontSize='large' />
						</Box>
						<Box onClick={handleMoreOption} sx={{display:'flex', justifyContent:'space-between',cursor:'pointer',fontWeight:200}}>
							<p >Migrate</p>
							<KeyboardDoubleArrowRightIcon sx={{cursor:'pointer'}} fontSize='large' />
						</Box>
						<Box onClick={handleMoreOption} sx={{display:'flex', justifyContent:'space-between',cursor:'pointer',fontWeight:200}}>
							<p>V2 liquidity</p>
							<LayersIcon sx={{cursor:'pointer'}} fontSize='large' />
						</Box>
						<Box onClick={handleMoreOption} sx={{display:'flex', justifyContent:'space-between',cursor:'pointer'}}>
							<p>Learn</p>
							<ImportContactsOutlinedIcon sx={{cursor:'pointer',bgcolor:'white'}} fontSize='large' />
						</Box>
					</Box>
     	 		</Modal>
			</Box>
		
		</Box>
		<Box sx={{mt:3}}>
			<Box sx={{display:'flex', justifyContent:'space-between',alignItems:'center'}}>
				<Typography style={{fontWeight:400,color:'black',fontSize:{xs:'10px',sm:'14px'}}}>Your positions (1)</Typography>
				<Box sx={{display:'flex', alignItems:'center'}}>
					<Typography style={{fontWeight:400,color:'black',fontSize:{xs:'10px',sm:'14px'}}}>Show closed positions</Typography>
					<Switch   size='medium' defaultChecked />
				</Box>
			</Box>
			<Box style={{ border:'2px solid #f0f0f0' ,borderRadius:'15px',width:{sm:'60%',xs:'100%', md:'70%'}}}>
				<Box sx={{ display:'flex',justifyContent:'space-between',flexDirection:'column',boxSizing:'border-box',p:1 ,minWidth:'100%',height:'auto',}} >  
					<Box sx={{display:'flex',width:'100%',justifyContent:'space-between',alignItems:'center',height:'2%', background:'white'}}>

						<Box sx={{display:'flex',justifyContent:'space-between', alignItems:'center',width:{sx:'55%',sm:'50%',md:'25%'},m:1, }}>

						
				
								<Box sx={{display:'flex'}}>
									<Avatar  sx={{background:'blue', height:25, width:25}}  alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
									<Avatar sizes='small' sx={{left:-12,top:4, background:'green', height:25, width:25}} alt="Travis Howard" src="/static/images/avatar/2.jpg" />
								</Box>
								<Typography sx={{mr:1,fontWeight:500,color:'black',fontSize:{xs:16}}}>UNI/ETH</Typography>
								<span style={{padding:3,width:'45px',border:'1px solid #f50057',borderRadius:'7px',background:'#f50057',color:'white'}}>0.3%</span>
											

							
						</Box> 
						
						
						

						
						<Box  sx={{display:'flex',alignItems:'center',borderRadius:'10px',boxSizing:'border-box',p:1,border:'none',bgcolor:' #f0f0f0',border:'2px solid blue',height:'100%',width:"100px"}}>
						
							<div style={{ height:'12px',width:'12px' ,marginRight:'9%',borderRadius:'100%',backgroundColor:'green'}}></div><p style={{display:'flex',color:'black',height:1,alignItems:'center'}}> In range </p>
						</Box>


					</Box>

					
				</Box>
					<Box sx={{display:'flex', alignItems:'center',m:1}}>
							<Typography style={{fontWeight:500,color:'grey'}}>Min: <span style={{fontWeight:400,color:'black'}} >0 UNI per ETH</span></Typography>
							<ArrowBackIcon fontSize='small' sx={{mr:0, ml:1}} /> < ArrowForwardIcon fontSize='small'  sx={{ml:-1,mr:1}}  />
							<Typography style={{fontWeight:500,color:'grey'}} >Max: <span style={{fontWeight:400,color:'black'}} >∞ UNI per ETH</span></Typography>

					</Box>
				
				<Box sx={{m:1, paddingRight:{xs:'10px', sm:'10px'}, display:'flex',justifyContent:{xs:'space-between',sm:'flex-end',  md:'flex-end'},width:{xs:'100%',sm:'100%' } }}>
							<Button  disableRipple  variant='outlined' sx={{ border:'1px solid #f50057',bgcolor:'#fff',color:'#f50057',borderRadius:4, ":hover":{bgcolor:'#fff',border:'1px solid #fff'}}}>Remove Liquidity</Button>
							<Button size='medium'  disableRipple  variant="contained" sx={{bgcolor:"#f50057", ml:{sm:1,xs:2}, mr:{xs:1},borderRadius:4,  ":hover":{bgcolor:'#f50057'}}}>Add Liquidity</Button>
				</Box>
					
			</Box>
		</Box>
		
	</Box>
	);
};

export { LiquidityPools };
