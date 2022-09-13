import classNames from 'classnames';
import React, { useState } from 'react';
import styles from '../css/PopupSettings.module.css';

const PopupSettings = () => {
	const [tolerance, setTolerance] = useState(0.5);

	return (
		<span
			onClick={e => e.stopPropagation()}
			className={styles.settingsContainer}
			style={{background:'white'}}
		>
			<h4 className={styles.settingsTitle}>Transaction Settings</h4>
			<div className={styles.settings}>
				<div className={styles.slippage}>
					<p>Slippage tolerance ?</p>
					<div className={styles.slippageTolerance}>
						<button
							className={classNames(
								styles.btn,
								tolerance === 0.5 && styles.active
							)}
							onClick={() => setTolerance(0.5)}
						>
							0.5
						</button>
						<button
							className={classNames(
								styles.btn,
								tolerance === 1 && styles.active
							)}
							onClick={() => setTolerance(1)}
						>
							1
						</button>
						<button
							className={classNames(
								styles.btn,
								tolerance === 2 && styles.active
							)}
							onClick={() => setTolerance(2)}
						>
							2
						</button>

						{/* <div className={styles.inputContainer}>
              <input
                className={styles.inputSlippageTolerance}
                type="number"
                placeholder="0.10"
                defaultValue={0.1}
              />
              <p>%</p>
            </div> */}
					</div>
				</div>
				<div className={styles.slippage}>
					<p>Transaction deadline ?</p>
					<div className={styles.transactionDeadline}>
						<div className={styles.inputContainer}>
							<input
								type='number'
								placeholder='30'
								defaultValue={30}
							/>
						</div>
						<p>minutes</p>
					</div>
				</div>
			</div>
		</span>
	);
};

export default PopupSettings;
