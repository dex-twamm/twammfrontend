// Sagar
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import LayersIcon from '@mui/icons-material/Layers';
import { Box, Button, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/LiquidityPools.css';
import styles from '../../css/RemoveLiquidity.module.css';
import classNames from 'classnames';




const style = {
	position: 'absolute',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	fontSize: '16px',
	fontWeight: 200,
	top:{md:'31%',xs:'35%',sm:'29.5%',lg:'31%'},
	left: { md: '66%', xs: '65%',sm:'57%',lg:'66%' },
	transform: 'translate(-50%, -50%)',
	width: 200,
	height: '180px',
	bgcolor: '#F7F8FA ',
	boxShadow: 24,
	borderRadius:'12px',
	p: 2,
	bgcolor:'white'
};

//   const label = { inputProps: { 'aria-label': 'Switch demo' } };

const LiquidityPools = ({ showAddLiquidity, showRemoveLiquidity }) => {
	const [open, setOpen] = useState(false);
	const [buttonEnabled, setButtonEnabled] = useState(false);

	const navigate = useNavigate();

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleMoreOption = () => {
		navigate('/');
	};
	return (
		<Box
			sx={{
				width: { sm:'90%', xs: '100%', md: '800px' },
				p:'8px',
				borderRadius:'20px',
				dispay:'flex',
				justifyContent:'center',
				margin:'auto',
				mt:'24px',
				fontFamily:'Open Sans',
				// border:'1px solid red',
				
			}}
		>
			<Box
				sx={{
		
					display: 'flex',
					alignItems:{ xs:'flex-start',sm:'center',md:'center',lg:'center'} ,
					justifyContent:{xs:'center',sm:'space-between',md:'space-between'},
					flexDirection:{xs:'column',sm:'row',md:'row'},

					
				}}
			>
				<Typography sx={{ fontSize:"30px",fontFamily:'Open Sans',color:'#333333', }}>Pools</Typography>
				<Box
					sx={{
						width: { sm: '60%', xs:'100%', md: '60%' },
						display: 'flex',
						flexDirection: { xs: 'row-reverse', sm: 'row' },
						justifyContent: { xs:'flex-end',sm: 'flex-end' },
						alignItems: 'center',
					}}
				>
					<Button
						onClick={handleOpen}
						sx={{
							// backgroundColor:'#e94393',
							background:'white',
							margin:'5px',
							borderRadius:'12px',
							height:'35px',
							fontFamily:'Open Sans',
							fontSize:'18px',
							fontWeight:'100',
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
					</Button>
				
					<Button
						onClick={() => showAddLiquidity(true)}
						sx={{
							backgroundColor:'#e94393',
							borderRadius:'12px',
							fontFamily:'Open Sans',
							fontSize:'18px',
							height:'35px',
							width:{xs:'90%',sm:'auto',md:'auto'},
							fontWeight:'100',
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
					</Modal>
				</Box>
			</Box>
			<Box sx={{ mt:'20px', bgcolor:'white',width:'auto',p:'8px',borderRadius:'20px'}}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						pr:'10px',
						pl:'10px'
					}}
				>
					<Typography
						style={{
							fontWeight: 400,
							color: '#333333',
							fontSize: { xs: '10px', sm: '14px' },
							fontFamily:'Open Sans',
						}}
					>
						Your positions (1)
					</Typography>
					<Box sx={{ display: 'flex', alignItems: 'center',pl:'10px', }}>
						<Typography
							style={{
								fontWeight: 400,
								color: '#333333',
								fontSize: { xs: '10px', sm: '14px' },
								fontFamily:'Open Sans',
								marginRight:'10px'

							}}
						>
							Show closed positions
						</Typography>
						{/* <Switch size='large' defaultChecked />
						 */}
							<button
						onClick={() => setButtonEnabled(state => !state)}
						className={styles.collectBtn}
						style={{height:'5%'}}

					>
						<div
							className={classNames(
								styles.circle,
								buttonEnabled && styles.true
							)}
						></div>
					</button>

					</Box>
				</Box>
				<Box
					style={{
						marginTop:'5px',
						border: '2px solid #f0f0f0',
						borderRadius: '15px',
						width: { sm: '60%', xs: '100%', md: '70%' },
					}}
				>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							flexDirection: 'column',
							boxSizing: 'border-box',
							p: 1,
							minWidth: '100%',
							height: 'auto',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								width: '100%',
								justifyContent: 'space-between',
								alignItems: 'center',
								height: '2%',
								background: 'white',
							}}
						>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									m: 1,
								}}
							>
								<Box sx={{ display: 'flex',alignItems:'center' }}>
									<Avatar
										sx={{
											background: 'blue',
											height: '20px',
											width:'20px',
										}}
										alt='Remy Sharp'
										src='/static/images/avatar/1.jpg'
									/>
									<Avatar
										sizes='small'
										sx={{
											left:'-10px',
											// top: 4,
											background: 'green',
											height: '20px',
											width: '20px',
										}}
										alt='Travis Howard'
										src='/static/images/avatar/2.jpg'
									/>
								</Box>
								<Typography
									sx={{
										mr: 1,
										fontWeight: 500,
										color: '#333333',
										fontSize: { xs: 16 },
										fontFamily:'Open Sans',
									}}
								>
									UNI/ETH
								</Typography>
								<span
									style={{
										padding: 3,
										width: '45px',
										border: '1px solid #e94393',
										borderRadius: '7px',
										background: '#e94393',
										color: 'white',
										fontFamily:'Open Sans',
									}}
								>
									0.3%
								</span>
							</Box>

							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									borderRadius: '10px',
									boxSizing: 'border-box',
									p: 1,
									border: 'none',
									bgcolor: ' #f0f0f0',
									border: '2px solid grey',
									width: '110px',
								}}
							>
								<div
									style={{
										height: '12px',
										width: '12px',
										marginRight: '9%',
										borderRadius: '100%',
										backgroundColor: 'green',
									}}
								></div>
								<p
									style={{
										display: 'flex',
										color: '#333333',
										height: 1,
										alignItems: 'center',
										fontFamily:'Open Sans'
										
									}}
								>
									{' '}
									In range{' '}
								</p>
							</Box>
						</Box>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', m:1 ,width:'fit-content',}}>
						<Typography style={{ fontWeight: 500, color: 'grey',fontFamily:'Open Sans', }}>
							Min:{' '}
							<span style={{ fontWeight: 400, color: '#333333',fontFamily:'Open Sans', }}>
								0 UNI per ETH
							</span>
						</Typography>
						<ArrowBackIcon fontSize='small' sx={{ mr: 0, ml: 1,color:'#333333' }} />{' '}
						<ArrowForwardIcon
							fontSize='small'
							sx={{ ml: -1, mr: 1,color:'#333333' }}
						/>
						<Typography style={{ fontWeight: 500, color: 'grey',fontFamily:'Open Sans', }}>
							Max:{' '}
							<span style={{ fontWeight: 400, color: '#333333',fontFamily:'Open Sans', }}>
								∞ UNI per ETH
							</span>
						</Typography>
					</Box>

					<Box
						sx={{
							m: 1,
							paddingRight: { xs: '10px', sm: '10px' },
							display: 'flex',
							justifyContent: {
								xs: 'space-between',
								sm: 'flex-end',
								md: 'flex-end',
							},
							width: { xs: '100%', sm: '100%' },
							height:'40px',
							alignItems:'center'
						}}
					>
					

						<button
							onClick={() => showRemoveLiquidity(true)}
							style={{
								border: '1px solid #e94393',
								backgroundColor: '#fff',
								color: '#e94393',
								borderRadius:'12px',
								padding:'4px 6px',
								boxSizing:'border-box',
								cursor:'pointer',
								height:'35px',
								fontWeight:500,
								fontFamily:'Open Sans',
								
							}}
						>
							Remove Liquidity
						</button>
						<button
							
							style={{
								backgroundColor: '#e94393',
								borderRadius:'12px',
								fontFamily:'Open Sans',
								 padding:'6px 8px',
								height:'35px',
								 outline:'none',
								 margin:'5px',
								color:'white',
								fontWeight:'100',
								padding:'6px 8px',
								border:'none',
								fontWeight:500,
								marginLeft:'10px'


							}}
						>
							Add Liquidity
						</button>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export { LiquidityPools };
