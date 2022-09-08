// Prabin
import { faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useState } from 'react';

import styles from '../../css/RemoveLiquidity.module.css';

const RemoveLiquidity = ({ showRemoveLiquidity }) => {
	const [rangeValue, setRangeValue] = useState(0);
	const [buttonEnabled, setButtonEnabled] = useState(false);

	const clickHandler = () => {
		// Remove liquidity logic here
		showRemoveLiquidity(false);
	};

	return (
		<div className={styles.container}>
			<div className={styles.mainBody}>
				<div className={styles.heading}>
					<FontAwesomeIcon
						onClick={() => showRemoveLiquidity(false)}
						className={styles.icon}
						icon={faArrowLeft}
					/>
					<span>Remove Liquidity</span>
					<FontAwesomeIcon className={styles.icon} icon={faGear} />
				</div>

				<div className={styles.tokenRangeContainer}>
					<div className={styles.token}>
						<div className={styles.tokenImages}>
							<img
								className={styles.tokenImage}
								src='https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png'
								alt='#'
								width={24}
							/>
							<img
								className={styles.tokenImage}
								src='https://seeklogo.com/images/U/uniswap-uni-logo-7B6173C76E-seeklogo.com.png'
								alt='#'
								width={24}
							/>
						</div>
						<span>UNI/ETH</span>
					</div>
					<div className={styles.range}>
						<div className={styles.status}></div>
						In range
					</div>
				</div>

				<div className={styles.amountContainer}>
					<h4 className={styles.amount}>Amount</h4>
					<div className={styles.percentages}>
						<span className={styles.percentageRange}>
							{rangeValue}%
						</span>
						<div className={styles.percentageBtns}>
							<span
								onClick={() => setRangeValue(25)}
								className={styles.percentage}
							>
								25%
							</span>
							<span
								onClick={() => setRangeValue(50)}
								className={styles.percentage}
							>
								50%
							</span>
							<span
								onClick={() => setRangeValue(75)}
								className={styles.percentage}
							>
								75%
							</span>
							<span
								onClick={() => setRangeValue(100)}
								className={styles.percentage}
							>
								Max
							</span>
						</div>
					</div>
					<input
						className={styles.inputRange}
						type='range'
						max={100}
						min={0}
						value={rangeValue}
						onChange={e => setRangeValue(e.target.value)}
					/>
				</div>

				<div className={styles.pooled}>
					<div className={styles.pooledToken}>
						<div>Pooled UNI:</div>
						<div className={styles.pooledTokenIcon}>
							0.12437
							<img
								src='https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png'
								alt='#'
								width={18}
							/>
						</div>
					</div>
					<div className={styles.pooledToken}>
						<div>Pooled ETH:</div>
						<div className={styles.pooledTokenIcon}>
							0.99951
							<img
								src='https://seeklogo.com/images/U/uniswap-uni-logo-7B6173C76E-seeklogo.com.png'
								alt='#'
								width={18}
							/>
						</div>
					</div>
				</div>

				<div className={styles.collect}>
					<span>Collect as WETH</span>
					<button
						onClick={() => setButtonEnabled(state => !state)}
						className={styles.collectBtn}
					>
						<div
							className={classNames(
								styles.circle,
								buttonEnabled && styles.true
							)}
						></div>
					</button>
				</div>

				<button onClick={clickHandler} className={styles.removeBtn}>
					Remove
				</button>
			</div>
		</div>
	);
};

export { RemoveLiquidity };
