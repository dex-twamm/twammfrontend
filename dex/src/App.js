import { BigNumber, ethers, providers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import PopupModal from './components/alerts/PopupModal';
import {
	AddLiquidity,
	LiquidityPools,
	RemoveLiquidity,
} from './components/Liquidity';
import Navbar from './components/Navbar';
import LongSwap from './pages/LongSwap';
import ShortSwap from './pages/ShortSwap';
import { ShortSwapContext } from './providers';
import {
	FAUCET_TOKEN_ADDRESS,
	MATIC_TOKEN_ADDRESS,
	toHex,
	truncateAddress,
} from './utils';
import { exitPool, joinPool } from './utils/addLiquidity';
import { getEtherBalance, getLPTokensBalance } from './utils/getAmount';
import { ethLogs } from './utils/get_ethLogs';
import { placeLongTermOrder } from './utils/longSwap';
import { web3Modal } from './utils/providerOptions';
import { swapTokens } from './utils/swap';

function App() {
	const [provider, setProvider] = useState();
	const [web3provider, setweb3provider] = useState();
	const [account, setAccount] = useState();
	const [balance, setBalance] = useState();
	const [ethBalance, setEthBalance] = useState();
	const [nonce, setNonce] = useState();
	const [isWallletConnceted, setWalletConnected] = useState(false);
	const [isPlacedLongTermOrder, setIsPlacedLongTermOrder] = useState(false);
	const [removeLiquidityOpen, setRemoveLiquidityOpen] = useState(true);

	const {
		srcAddress,
		destAddress,
		swapAmount,
		error,
		setError,
		loading,
		setLoading,
		setSuccess,
		equivalentAmount,
		tokenBalances,
		setTokenBalances,
		setTransactionHash,
		transactionHash,
	} = useContext(ShortSwapContext);

	console.log(tokenBalances);
	console.log('txHash From App.js', transactionHash);
	const connectWallet = async () => {
		try {
			await getProvider();
			console.log('Wallet Connected Info', isWallletConnceted);
		} catch (err) {
			console.error(err);
			setError('Wallet Connection Rejected');
		}
	};

	const getProvider = async (needSigner = false) => {
		setLoading(true);
		try {
			const provider = await web3Modal.connect();
			const web3Provider = new providers.Web3Provider(provider);
			const accounts = await web3Provider.listAccounts();
			console.log('accounts', accounts);
			localStorage.setItem('account', accounts);

			setweb3provider(web3Provider);
			setProvider(provider);

			const walletBalance = await web3Provider.getBalance(accounts[0]);
			const ethBalance = ethers.utils.formatEther(walletBalance);
			const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);

			localStorage.setItem('balance', humanFriendlyBalance);

			setBalance(humanFriendlyBalance);

			if (accounts) setAccount(accounts[0]);
			if (needSigner) return web3Provider.getSigner();
			if (provider) setWalletConnected(true);

			setSuccess('Wallet Connected');
			setLoading(false);
			return web3Provider;
		} catch (err) {
			setLoading(false);
			setError('Wallet Connection Rejected');
		}
	};

	const disconnect = async () => {
		setEthBalance('');
		setAccount('');
		await web3Modal.clearCachedProvider();
	};

	// const getAmounts = async () => {
	//   const provider = await connectWallet();
	//   const signer = await connectWallet();
	//   const address = await signer.getAddress();
	//   // get the amount of eth in the user's account
	//   const _ethBalance = await getEtherBalance(provider, address);
	//   setEthBalance(_ethBalance);
	// };

	//  Swap Token
	const _swapTokens = async () => {
		setLoading(true);
		const walletBalanceWei = ethers.utils.parseUnits(balance, 'ether');
		console.log('walletBalanceWei', walletBalanceWei);
		const swapAmountWei = ethers.utils.parseUnits(swapAmount, 'ether');
		console.log('swapAmountWei', swapAmountWei);
		walletBalanceWei > swapAmountWei
			? console.log(true)
			: console.log(false);
		try {
			console.log('swapAmountWei', swapAmountWei);
			const signer = await getProvider(true);
			console.log(signer);
			const assetIn = srcAddress;
			const assetOut = destAddress;
			const walletAddress = account;
			// Call the swapTokens function from the `utils` folder
			await swapTokens(
				signer,
				swapAmountWei,
				assetIn,
				assetOut,
				walletAddress
			)
				.then(res => setTransactionHash(res))
				.catch(err => {
					console.error(err);
					setError('Transaction Error');
				});
			setLoading(false);
		} catch (err) {
			console.error(err);
			setLoading(false);
			setError('Transaction Cancelled');

			// setSwapAmount("");
		}
	};

	const _placeLongTermOrders = async () => {
		const swapAmountWei = ethers.utils.parseUnits(swapAmount, 'ether');
		console.log('swapAmountWei', swapAmountWei);
		try {
			const tokenInIndex = '0';
			const tokenOutIndex = '1';
			const amountIn = swapAmountWei;
			console.log('amountIn', amountIn);
			const numberOfBlockIntervals = '3';
			const signer = await getProvider(true);
			const walletAddress = account;
			// Call the PlaceLongTermOrders function from the `utils` folder*
			await placeLongTermOrder(
				tokenInIndex,
				tokenOutIndex,
				amountIn,
				numberOfBlockIntervals,
				signer,
				walletAddress
			);
			setIsPlacedLongTermOrder(true);
		} catch (err) {
			console.error(err);
			setLoading(false);
			setError('Transaction Cancelled');
		}
	};

	async function ShortSwapButtonClick() {
		try {
			const signer = await getProvider(true);
			await ethLogs(signer);
			if (!isWallletConnceted) {
				await connectWallet();
			} else {
				await _swapTokens();
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function LongSwapButtonClick() {
		if (!isWallletConnceted) {
			await connectWallet();
		} else {
			await _placeLongTermOrders();
		}
	}

	//  JoinPool
	const _joinPool = async () => {
		try {
			const walletAddress = account;
			const signer = await getProvider(true);
			if (!isWallletConnceted) {
				await connectWallet();
			}
			await joinPool(walletAddress, signer);
		} catch (e) {
			console.log(e);
		}
	};

	//  ExitPool
	const _exitPool = async () => {
		try {
			const bptAmountIn = ethers.utils.parseUnits('0.001', 'ether');
			const walletAddress = account;
			const signer = await getProvider(true);
			if (!isWallletConnceted) {
				await connectWallet();
			}
			await exitPool(walletAddress, signer, bptAmountIn);
		} catch (e) {
			console.log(e);
		}
	};

	const data = {
		token: {
			name: 'Ethereum',
			symbol: 'ETH',
			image: '/ethereum.png',
		},
		wallet: {
			address:
				account === null ? 'Wallet Address' : truncateAddress(account),
			balance: account === null ? 'Wallet Balance' : balance,
		},
	};
	const tokenBalance = async () => {
		setLoading(true);
		try {
			const provider = await getProvider(true);
			// getLPTokensBalance(provider);
			setTokenBalances(await getLPTokensBalance(provider));
			setLoading(false);
		} catch (e) {
			console.log(e);
			setLoading(false);
		}
	};
	useEffect(() => {
		tokenBalance();
		const account = localStorage.getItem('account');
		const balance = localStorage.getItem('balance');
		if (account && balance) {
			setAccount(account);
			setWalletConnected(true);
			setBalance(balance);
		}
	}, []);

	let liquidityMarkup = <AddLiquidity connect={_joinPool} />;

	if (removeLiquidityOpen)
		liquidityMarkup = (
			<RemoveLiquidity openModal={setRemoveLiquidityOpen} />
		);

	return (
		<>
			<Navbar
				tokenName={data.token.name}
				tokenImage={data.token.image}
				walletBalance={data.wallet.balance}
				walletAddress={data.wallet.address}
				accountStatus={isWallletConnceted ? true : false}
				connectWallet={ShortSwapButtonClick}
			/>

			<Routes>
				<Route
					path='/'
					element={
						<ShortSwap
							tokenSymbol={data.token.symbol}
							tokenImage={data.token.image}
							connectWallet={ShortSwapButtonClick}
							buttonText={
								!isWallletConnceted ? 'Connect Wallet' : 'Swap'
							}
						/>
					}
				/>

				<Route
					path='/longterm'
					element={
						<LongSwap
							tokenSymbol={data.token.symbol}
							tokenImage={data.token.image}
							buttonText={
								!isWallletConnceted ? 'Connect Wallet' : 'Swap'
							}
							connectWallet={LongSwapButtonClick}
							isPlacedLongTermOrder={isPlacedLongTermOrder}
						/>
					}
				/>

				{/* Replace _exitPool with _joinPool When Needed To Join Pool */}
				<Route path='/liquidity' element={liquidityMarkup} />
			</Routes>
		</>
	);
}

export default App;
