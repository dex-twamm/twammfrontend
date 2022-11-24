import { Backdrop, Skeleton } from "@mui/material";
import classnames from "classnames";
import { useContext, useEffect } from "react";
import styles from "../css/Input.module.css";
import { LongSwapContext, ShortSwapContext, UIContext } from "../providers";
import { useNetwork } from "../providers/context/UIProvider";
import { POOLS } from "../utils/pool";
import Modal from "./Modal";

const Input = (props) => {
  const {
    id,
    onChange,
    input,
    imgSrc,
    symbol,
    handleDisplay,
    display,
    setDisplay,
    setTokenA,
    setTokenB,
    swapType,
    placeholder,
  } = props;
  const {
    tokenBalances,
    selectToken,
    setEthBalance,
    setSrcAddress,
    isWalletConnected,
  } = useContext(ShortSwapContext);
  const { tokenA, tokenB } = useContext(LongSwapContext);
  const currentNetwork = useNetwork();

  const {
    selectedNetwork,
    setSelectedNetwork,
  } = useContext(UIContext);

  console.log("swap token", tokenA, tokenB);
  // console.log("Select Token Input.js", selectToken);
  // console.log("TOKEN A", tokenA);
  // console.log("====TOKEN BALANCES===", tokenBalances);
  // const tokenDetails = [
  //   {
  //     name: "Faucet",
  //     symbol: "ETH",
  //     image: "ethereum.png",
  //     address: Object.values(POOLS?.[currentNetwork?.network])?.[0].tokens[1].address,
  //     balance: tokenBalances[0] ?? 0,
  //   },
  //   {
  //     name: "Matic",
  //     symbol: "DAI",
  //     image: "/Testv4.jpeg",
  //     address: Object.values(POOLS?.[currentNetwork?.network])?.[0].tokens[0].address,
  //     balance: tokenBalances[1] ?? 0,
  //   },
  //   {
  //     type: "coming_soon",
  //     name: "Test Token",
  //     symbol: "CST",
  //     image: "/Testv4.jpeg",
  //   },
  // ];

  let networkName = currentNetwork?.network;
  if (
    networkName === undefined ||
    networkName === "undefined" ||
    networkName === "Select a Network"
  ) {
    networkName = "Ethereum";
  }
  const tokenDetails = Object.values(POOLS?.[networkName])?.[0].tokens;

  useEffect(() => {
    const address = tokenDetails[0]?.address;
    console.log("tokenA", tokenA);

    const balance =
      tokenBalances && tokenBalances?.filter((item) => item[address]);

    setTokenA({
      ...tokenA,
      symbol: tokenDetails[0]?.symbol,
      image: tokenDetails[0]?.logo,
      balance: balance?.[0]?.[address],
      tokenIsSet: true,
    });
    setEthBalance(balance?.[0]?.[address]);
    setSrcAddress(address);
  }, [setTokenA, tokenBalances, setEthBalance, setSrcAddress, setSelectedNetwork]);

  return (
    <>
      <div className={styles.textInput}>
        <div className={styles.inputSelectContainer}>
          <input
            className={styles.textField}
            min={0}
            placeholder={placeholder}
            value={input}
            onChange={onChange}
          />
          {/* {!selectToken ? (
						<button
							className={classnames(
								styles.btn,
								styles.tokenSelect
							)}
							onClick={handleDisplay}
							id={id}
							disabled={swapType === 'long'}
						>
							<span className={styles.spnSelectToken}>
								<div>
									<span className={styles.selectContainer}>
										Select a token
									</span>
								</div>
								<svg
									width='12'
									height='7'
									viewBox='0 0 12 7'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
									className='sc-33m4yg-8 jsUfgJ'
								>
									<path
										d='M0.97168 1L6.20532 6L11.439 1'
										stroke='#FFFFFF'
									></path>
								</svg>
							</span>
						</button>
					) : (
						<button
							className={classnames(
								styles.btn,
								styles.currencySelect
							)}
													onClick={ swapType !=='long' && handleDisplay}

							id={id}
						>
							<span className={styles.spnCurrency}>
								<div className={styles.currency}>
									{id === 2 && !tokenB.tokenIsSet ? (
										<></>
									) : (
										<img
											className={styles.tokenImage}
											src={imgSrc}
											alt='tokenImage'
										/>
									)}
									<p className={styles.tokenContainer}>
										{symbol}
									</p>
								{
									swapType !== 'long' && (
										<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='sc-w04zhs-16 lfEMTx'
									>
										<polyline points='6 9 12 15 18 9'></polyline>
									</svg>
									)
								}
								</div>
							</span>
						</button>
                    )} */}
          <button
            className={classnames(styles.btn, styles.currencySelect)}
            onClick={handleDisplay}
            id={id}
          >
            <span className={styles.spnCurrency}>
              <div className={styles.currency}>
                {id === 2 && !tokenB.tokenIsSet ? (
                  <></>
                ) : (
                  <img
                    className={styles.tokenImage}
                    src={imgSrc}
                    alt="tokenImage"
                  />
                )}
                <p className={styles.tokenContainer}>{symbol}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sc-w04zhs-16 lfEMTx"
                  style={{ color: "#333333" }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </span>
          </button>
        </div>
        <div className={styles.balance}>
          Balance :{" "}
          {!isWalletConnected ? (
            "N/A"
          ) : tokenBalances ? (
            id === 1 ? (
              parseFloat(tokenA?.balance)?.toFixed(4)
            ) : (
              parseFloat(tokenB?.balance)?.toFixed(2)
            )
          ) : (
            <Skeleton width={60} />
          )}
        </div>
      </div>

      {display && (
        <Modal
          display={display}
          setDisplay={setDisplay}
          selectToken={selectToken}
          setTokenA={setTokenA}
          setTokenB={setTokenB}
          tokenDetails={tokenDetails}
          tokenBalances={tokenBalances}
        />
      )}
    </>
  );
};

export default Input;
