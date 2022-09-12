import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import LongTermOrderCard from '../components/LongTermOrderCard';
import PopupSettings from '../components/PopupSettings';
import Swap from '../components/Swap';
import lsStyles from '../css/LongSwap.module.css';
import styles from '../css/ShortSwap.module.css';

const LongSwap = props => {
	const {
		tokenSymbol,
		tokenImage,
		connectWallet,
		buttonText,
		isPlacedLongTermOrder,
		showSettings,
		setShowSettings,
	} = props;

	const longTermOrderCardList = Array(3).fill(<LongTermOrderCard />);
	const cardListCount = longTermOrderCardList.length;

	return (
		<div className={styles.container}>
			<div className={styles.mainBody}>
				<div className={styles.swap}>
					<div className={styles.swapOptions}>
						<a className={styles.textLink} href='/'>
							Long Term Swap
						</a>
						<FontAwesomeIcon
							className={styles.settingsIcon}
							icon={faGear}
							onClick={e => {
								e.stopPropagation();
								setShowSettings(!showSettings);
							}}
						/>
					</div>

					{showSettings && <PopupSettings />}
				</div>
				<Swap
					swapType='long'
					tokenSymbol={tokenSymbol}
					tokenImage={tokenImage}
					connectWallet={connectWallet}
					buttonText={buttonText}
				/>
			</div>

			{/* {isPlacedLongTermOrder && ( */}
			<div className={lsStyles.ordersWrapper}>
				<h4 className={lsStyles.longTermText}>Your Long Term Orders</h4>
				<div className={styles.scroller}>
					<div
						className={classNames(
							lsStyles.longTermOrderCard,
							cardListCount > 2 && lsStyles.scrollable
						)}
					>
						{longTermOrderCardList}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LongSwap;
