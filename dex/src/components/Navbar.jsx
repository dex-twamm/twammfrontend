import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';
import styles from '../css/Navbar.module.css';
// import showDropdown from '../Helpers/showdropdown';
import { ShortSwapContext, UIContext } from '../providers';
import { toHex } from '../utils';

const Navbar = props => {
	const { showDropdown, setShowDropdown } = useContext(UIContext);
	console.log('Prabin dropdown', showDropdown);

	const location = useLocation();
	const currentPath = location.pathname;

	const {
		walletBalance,
		walletAddress,
		accountStatus,
		connectWallet,
		disConnectWallet,
	} = props;
	const { setError, setLoading } = useContext(ShortSwapContext);
	const [netId, setNetId] = useState('');

	// selector select and option value
	const networks = [
		{ name: 'Ethereum', chainId: '1', logo: '/ethereum.png' },
		{ name: 'Goerli', chainId: '5', logo: '/dai.png' },
		{ name: 'Coming Soon', chainId: '0', logo: '/ethereum.png' },
	];

	const nId = window.ethereum.networkVersion;
	const initialNetwork = networks.filter(id => id.chainId === nId);

	const [selectedNetwork, setSelectedNetwork] = useState({
		network: 'Select a Network',
		logo: '/ethereum.png',
		chainId: nId,
	});

	const coin_name = localStorage.getItem('coin_name');
	const coin_logo = localStorage.getItem('coin_logo');

	useEffect(() => {
		setSelectedNetwork(prevState => ({
			...prevState,
			network: coin_name ? coin_name : initialNetwork[0]?.name,
			logo: coin_logo ? coin_logo : initialNetwork[0].logo,
		}));
	}, [coin_name]);

	const handleSelect = async (networkName, logo, chainId) => {
		localStorage.setItem('coin_name', networkName);
		localStorage.setItem('coin_logo', logo);

		const id = chainId;
		// console.log(chainId);
		setSelectedNetwork({
			network: networkName,
			logo: logo,
			chainId: chainId,
		});
		if (window.ethereum.networkVersion !== id) {
			setLoading(true);
			try {
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: toHex(id) }],
				});

				setLoading(false);
				window.location.reload();
			} catch (err) {
				console.error(err);
				setLoading(false);
				setError('Failed To Switch Network');
			}
		}
	};

	const tabOptions = [
		{
			value: 'Swap',
			path: '/',
		},
		{
			value: 'Long Term Swap',
			path: '/longterm',
		},
		{
			value: 'Add Liquidity',
			path: '/liquidity',
		},
	];

	const tabList = tabOptions.map((option, index) => (
		<Link to={option.path} key={index}>
			<div
				key={index}
				className={classNames(
					styles.tabButton,
					currentPath === option.path && styles.activeTab
				)}
			>
				{option.value}
			</div>
		</Link>
	));

	const options = [
		'About',
		'Help Center',
		'Request Feature',
		'Discord',
		'Language',
		'Dark Theme',
		'Docs',
		'Legal Privacy',
	];
	const optionsList = options.map((option, index) => {
		return (
			<Link key={index} className={styles.options} to='/'>
				{option}
			</Link>
		);
	});

	const networkList = networks.map((network, index) => {
		return (
			<p
				key={index}
				className={styles.networkName}
				value={network.chainId}
				onClick={() =>
					handleSelect(network.name, network.logo, network.chainId)
				}
			>
				{network.name}
			</p>
		);
	});

	return (
		<header className={styles.header} id='header'>
			<div className={styles.row}>
				<div className={styles.tabContainerLeft}>
					<Link to='/'>
						<img
							className={styles.logo}
							src='unicorn.png'
							alt='logo'
							width='20px'
						/>
					</Link>
					<div className={styles.tabContainerCenter}>{tabList}</div>
				</div>
				<div className={styles.tabContainerRight}>
					<div className={styles.dropdown}>
						<div className={styles.container}>
							<div
								id='networkType'
								className={styles.dropdownContainer}
							>
								<img
									src={selectedNetwork.logo}
									className={styles.logo}
									alt='Ethereum'
								/>
								<span>{selectedNetwork.network}</span>
								<RiArrowDropDownLine
									className={styles.dropdownIcon}
								/>
							</div>

							<div className={styles.currency}>
								<div className={styles.list}>
									<p>Select a network</p>
									<div className={styles.networkList}>
										{networkList}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className={styles.walletBalance}>
						{accountStatus ? (
							<>
								<button
									className={classNames(
										styles.btnWallet,
										styles.leftRadius
									)}
								>
									{walletBalance}
								</button>
								<button
									className={classNames(
										styles.btnWallet,
										styles.rightRadius
									)}
									onClick={disConnectWallet}
								>
									{walletAddress}
								</button>
							</>
						) : (
							<button
								className={classNames(
									styles.btn,
									styles.btnConnect
								)}
								onClick={connectWallet}
							>
								Connect Wallet
							</button>
						)}
					</div>
					<div className={styles.menuOption}>
						<button
							className={styles.menuThreeDot}
							// onClick={showDropdown}
							onClick={() => setShowDropdown(state => !state)}
						>
							<FontAwesomeIcon icon={faEllipsis} />
						</button>
						<span
							className={classNames(
								styles.menuList,
								showDropdown && styles.show
							)}
							id='menu-dropdown'
						>
							{optionsList}
						</span>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
