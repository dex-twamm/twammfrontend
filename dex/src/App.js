
import { ethers, providers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import {
	AddLiquidity,
	LiquidityPools,
	RemoveLiquidity,
} from './components/Liquidity';
import Navbar from './components/Navbar';
import { calculateNumBlockIntervals } from './methods/longSwapMethod';
import LongSwap from './pages/LongSwap';
import ShortSwap from './pages/ShortSwap';
import { LongSwapContext, ShortSwapContext, UIContext } from './providers';
import {
	FAUCET_TOKEN_ADDRESS, POOL_ID, truncateAddress,
} from './utils';
import { cancelLTO, exitPool, getPoolBalance, joinPool, withdrawLTO } from './utils/addLiquidity';
import { runQueryBatchSwap } from './utils/batchSwap';
import { getLPTokensBalance } from './utils/getAmount';
import { getEthLogs } from './utils/get_ethLogs';
import { getLastVirtualOrderBlock, getLongTermOrder, placeLongTermOrder } from './utils/longSwap';
import { POOLS } from './utils/pool';
import { web3Modal } from './utils/providerOptions';
import { swapTokens } from './utils/swap';

function App() {
	const [provider, setProvider] = useState();
	const [balance, setBalance] = useState();
	const [nonce, setNonce] = useState();
	const [isPlacedLongTermOrder, setIsPlacedLongTermOrder] = useState(false);
	const [showRemoveLiquidity, setShowRemoveLiquidity] = useState(false);
	const [showAddLiquidity, setShowAddLiquidity] = useState(false);
	const { setShowDropdown } = useContext(UIContext);
	const [showSettings, setShowSettings] = useState(false);

	const {
		srcAddress,
		destAddress,
		swapAmount,
		setError,
		setLoading,
		setSuccess,
		setTokenBalances,
		setTransactionHash,
		ethBalance,
		setPoolCash,
		poolCash,
		account,
		setAccount,
		isWallletConnceted, setFormErrors,
		setWalletConnected, setExpectedSwapOut,
		web3provider, setweb3provider, setCurrentBlock, currentBlock,
		tolerance, deadline
	} = useContext(ShortSwapContext);
	const { setOrderLogsDecoded, setLatestBlock, sliderValueInSec } = useContext(LongSwapContext);

	// console.log("Settings Input", deadline, tolerance);
	console.log("Current Block", currentBlock)
	//  Connect Wallet 
	const connectWallet = async () => {
		try {
			await getProvider();
			console.log('Wallet Connected Info', isWallletConnceted);
		} catch (err) {
			console.error(err);
			setError('Wallet Connection Rejected');
		}
	};

	//  Get Provider
	const getProvider = async (needSigner = false) => {
		setLoading(true);
		try {
			const provider = await web3Modal.connect();
			const web3Provider = new providers.Web3Provider(provider);
			const accounts = await web3Provider.listAccounts();
			// console.log('accounts', accounts);
			localStorage.setItem('account', accounts);

			setweb3provider(web3Provider);
			setProvider(provider);
			console.log("WEb 3 Provider", await web3Provider.getBlock("latest"));
			// TODO - Update Every Transaction After 12 Seconds
			setCurrentBlock(await web3Provider.getBlock("latest"));
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

	// const disconnect = async () => {
	//   try {
	//     await web3Modal.clearCachedProvider();
	//     setAccount("");
	//     setNetworkId("");
	//     setLoading(false);
	//   } catch (e) {
	//     console.log(e);
	//   }
	// };

	//  Swap Token
	const _swapTokens = async () => {
		const walletBalanceWei = ethers.utils.parseUnits(ethBalance, 'ether');
		const pCash = ethers.utils.parseUnits(poolCash, 'ether')
		const swapAmountWei = ethers.utils.parseUnits(swapAmount, 'ether');

		// swapAmountWei.lte(walletBalanceWei && poolCash)
		// 	? console.log('True')
		// 	: console.log('False');
		if (swapAmountWei.lte(walletBalanceWei && pCash)) {
			try {
				const signer = await getProvider(true);
				// console.log(signer);
				const assetIn = srcAddress;
				const assetOut = destAddress;
				const walletAddress = account;
				// Call the swapTokens function from the `utils` folder
				await swapTokens(
					signer,
					swapAmountWei,
					assetIn,
					assetOut,
					walletAddress,
					tolerance,
					deadline,


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
			}
		} else {
			setLoading(false);
			setError('Insufficient Balance');
		}
	};

	// TODO Dynamically Set tokenInIndex and tokenOutIndex  
	//  Long Term Swap
	const _placeLongTermOrders = async () => {
		const swapAmountWei = ethers.utils.parseUnits(swapAmount, 'ether');
		// console.log('swapAmountWei', swapAmountWei);
		try {
			const tokenInIndex = POOLS[POOL_ID].tokens.findIndex(object =>
				srcAddress === object.address
			);
			const tokenOutIndex = POOLS[POOL_ID].tokens.findIndex(object =>
				destAddress === object.address
			);
			const amountIn = swapAmountWei;
			// console.log('amountIn', amountIn);
			const numberOfBlockIntervals = Math.ceil(sliderValueInSec);
			console.log("Intervals", numberOfBlockIntervals);
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
			).then((res) => { setTransactionHash(res) }).finally(setLoading(false));
			setIsPlacedLongTermOrder(true);
		} catch (err) {
			console.error(err);
			setLoading(false);
			setError('Transaction Cancelled');
		}
	};
	//   Calling Swap
	async function ShortSwapButtonClick() {
		try {

			if (!isWallletConnceted) {
				await connectWallet();
				const signer = await getProvider(true);
				await getEthLogs(signer);
			} else {
				await _swapTokens();
			}
		} catch (err) {
			console.error(err);
		}
	}

	//  Calling LongTermSwap
	async function LongSwapButtonClick() {
		if (!isWallletConnceted) {
			await connectWallet();
			const signer = await getProvider(true);
			await getEthLogs(signer);
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
		setLoading(true)
		try {
			const bptAmountIn = ethers.utils.parseUnits('0.001', 'ether');
			const walletAddress = account;
			const signer = await getProvider(true);
			if (!isWallletConnceted) {
				await connectWallet();
			}
			await exitPool(walletAddress, signer, bptAmountIn);
			setLoading(false)
		} catch (e) {
			console.log(e);
			setLoading(false)

		}
	};

	// cancelLTO
	const _cancelLTO = async (orderId) => {
		setLoading(true)
		try {
			const walletAddress = account;
			const signer = await getProvider(true);
			if (!isWallletConnceted) {
				await connectWallet();
			}
			await cancelLTO(walletAddress, signer, orderId);
			setLoading(false)
		} catch (e) {
			console.log(e);
			setLoading(false)

		}
	};
	//  WithdrawLTO
	const _withdrawLTO = async (orderId) => {
		console.log("Order Id", orderId);
		setLoading(true)
		try {
			const walletAddress = account;
			const signer = await getProvider(true);
			if (!isWallletConnceted) {
				await connectWallet();
			}
			await withdrawLTO(walletAddress, signer, orderId);
			setLoading(false)
		} catch (e) {
			console.log(e);
			setLoading(false)

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

	//Spot Prices 
	const spotPrices = async () => {
		const swapAmountWei = ethers.utils.parseUnits(swapAmount, 'ether');
		const assetIn = srcAddress;
		const assetOut = destAddress;
		const error = {};
		const batchPrice = await runQueryBatchSwap(assetIn, assetOut, swapAmountWei).then((res) => {
			console.log("Response From Query Batch Swap", res.errorMessage);
			// setEquivalentAmount(res.expectedSwapOut);
			setFormErrors(error.balError = res.errorMessage);
			setExpectedSwapOut(res.expectedSwapOut);
		});
		return batchPrice;
	}
	// useEffect(() => {
	// 	spotPrices();
	// }, [swapAmount, srcAddress, destAddress])
	// Getting Each Token Balances
	const tokenBalance = async account => {
		// setLoading(true);
		try {
			const provider = await getProvider(true);
			const tokenAddress = FAUCET_TOKEN_ADDRESS;
			const walletAddress = account;
			await getLastVirtualOrderBlock(provider).then(res => {
				console.log("Latest Block", res);
				setLatestBlock(res)
			});
			const signer = await getProvider(true);

			await getEthLogs(signer, walletAddress).then(res => {
				console.log("=== Order Keys === ", res.keys())
				console.log("=== Order Values === ", res.values())
				const resArray = Array.from(res.values());
				console.log("=== Order Logs === ", resArray)
				setOrderLogsDecoded(resArray);

			});
			await getLPTokensBalance(provider, account).then(res => {
				setTokenBalances(res);
				// console.log("Response From Token Balance Then Block", res)
			});
			await getPoolBalance(provider, tokenAddress).then(res => {
				setPoolCash(res);
				console.log('===GET POOL BALANCE====', res);
			});
			setLoading(false);
		} catch (e) {
			console.log(e);
			setLoading(false);
		}
	};

	useEffect(() => {
		const account = localStorage.getItem('account');
		const balance = localStorage.getItem('balance');
		if (account && balance) {
			setAccount(account);
			setWalletConnected(true);
			setBalance(balance);
		}
		tokenBalance(account);
	}, [swapAmount]);

	useEffect(() => {
		document.body.onclick = () => {
			setShowDropdown(false);
			setShowSettings(false);
		};
	});

	let liquidityMarkup = (
		<LiquidityPools
			showRemoveLiquidity={setShowRemoveLiquidity}
			showAddLiquidity={setShowAddLiquidity}
		/>
	);

	if (showAddLiquidity) {
		liquidityMarkup = (
			<AddLiquidity
				connect={_joinPool}
				showAddLiquidity={setShowAddLiquidity}
			/>
		);
	} else if (showRemoveLiquidity)
		liquidityMarkup = (
			<RemoveLiquidity showRemoveLiquidity={setShowRemoveLiquidity} />
		);

	// Condition of Liquidity existing
	// if(liquidityExists) liquidityMarkup = <LiquidityPools/>

	return (
		<div>
			<Navbar
				tokenName={data.token.name}
				tokenImage={data.token.image}
				walletBalance={data.wallet.balance}
				walletAddress={data.wallet.address}
				accountStatus={isWallletConnceted ? true : false}
				connectWallet={ShortSwapButtonClick}
			// disConnectWallet={disconnect}
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
							showSettings={showSettings}
							setShowSettings={setShowSettings}
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
							showSettings={showSettings}
							setShowSettings={setShowSettings}
							cancelPool={_cancelLTO}
							withdrawPool={_withdrawLTO}
						/>
					}
				/>
				<Route path='/liquidity' element={liquidityMarkup} />
			</Routes>
		</div>
	);
}

export default App;
