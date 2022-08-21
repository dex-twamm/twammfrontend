import Modal from "./Modal";
import styles from "../css/Input.module.css";
import classnames from "classnames";

const Input = (props) => {
  const {
    id,
    onChange,
    input,
    imgSrc,
    symbol,
    handleDisplay,
    selectToken,
    display,
    setDisplay,
    setTokenA,
    setTokenB,
  } = props;

  return (
    <>
      <div className={styles.textInput}>
        <div className={styles.inputSelectContainer}>
          <input
            className={styles.textField}
            type="text"
            placeholder="0.0"
            value={input}
            onChange={onChange}
          />
          {!selectToken ? (
            <button
              className={classnames(styles.btn, styles.tokenSelect)}
              onClick={handleDisplay}
            >
              <span className={styles.spnSelectToken}>
                <div>
                  <span className={styles.selectContainer}>Select a token</span>
                </div>
                <svg
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sc-33m4yg-8 jsUfgJ"
                >
                  <path
                    d="M0.97168 1L6.20532 6L11.439 1"
                    stroke="#FFFFFF"
                  ></path>
                </svg>
              </span>
            </button>
          ) : (
            <button
              className={classnames(styles.btn, styles.currencySelect)}
              onClick={handleDisplay}
              id={id}
            >
              <span className={styles.spnCurrency}>
                <div className={styles.currency}>
                  <img
                    className={styles.tokenImage}
                    src={imgSrc}
                    alt="token-image"
                  />
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
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </span>
            </button>
          )}
        </div>
        <div className={styles.balance}></div>
      </div>

      {display && (
        <Modal
          display={display}
          setDisplay={setDisplay}
          selectToken={selectToken}
          setTokenA={setTokenA}
          setTokenB={setTokenB}
        />
      )}
    </>
  );
};

export default Input;
