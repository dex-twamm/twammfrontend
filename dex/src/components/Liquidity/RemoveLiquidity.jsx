import { faArrowLeft, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Slider } from "@mui/material";
import classNames from "classnames";
import { useState } from "react";
import styles from "../../css/RemoveLiquidity.module.css";

const RemoveLiquidity = ({ showRemoveLiquidity }) => {
  const [rangeValue, setRangeValue] = useState(0);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  const clickHandler = () => {
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
          <span className={styles.headingTitle}>Remove Liquidity</span>
          <FontAwesomeIcon className={styles.icon} icon={faGear} />
        </div>

        <div className={styles.tokenRangeContainer}>
          <div className={styles.token}>
            <div className={styles.tokenImages}>
              <img
                className={styles.tokenImage}
                src="https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png"
                alt="#"
                width={20}
              />
              <img
                className={styles.tokenImage}
                src="https://seeklogo.com/images/U/uniswap-uni-logo-7B6173C76E-seeklogo.com.png"
                alt="#"
                width={20}
              />
            </div>
            <span>UNI/ETH</span>
          </div>
          <div className={styles.range}>
            <div className={styles.status}></div>
            In Range
          </div>
        </div>

        <div className={styles.amountContainer}>
          <h4 className={styles.amount}>Amount</h4>
          <div className={styles.percentages}>
            <div className={styles.percentageRange}>{rangeValue + "%"}</div>
            <div className={styles.percentageBtns}>
              <button
                onClick={() => setRangeValue(25)}
                className={styles.percentage}
              >
                25%
              </button>
              <button
                onClick={() => setRangeValue(50)}
                className={styles.percentage}
              >
                50%
              </button>
              <button
                onClick={() => setRangeValue(75)}
                className={styles.percentage}
              >
                75%
              </button>
              <button
                onClick={() => setRangeValue(100)}
                className={styles.percentage}
              >
                Max
              </button>
            </div>
          </div>
          <div style={{ paddingLeft: "0px" }}>
            <Slider
              value={rangeValue}
              min={0}
              step={1}
              max={100}
              sx={{
                height: 15,
                width: 1,
                color: "#ffaac9",
              }}
              onChange={(e) => setRangeValue(e.target.value)}
              aria-labelledby="non-linear-slider"
            />
          </div>
        </div>

        <div className={styles.pooled}>
          <div className={styles.pooledToken}>
            <div>Pooled UNI</div>
            <div className={styles.pooledTokenIcon}>
              0.12437
              <img
                src="https://seeklogo.com/images/U/uniswap-uni-logo-7B6173C76E-seeklogo.com.png"
                alt="#"
                width={18}
              />
            </div>
          </div>
          <div className={styles.pooledToken}>
            <div>Pooled ETH</div>
            <div className={styles.pooledTokenIcon}>
              0.99951
              <img
                src="https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png"
                alt="#"
                width={18}
              />
            </div>
          </div>
        </div>

        <div className={styles.collect}>
          <span className={styles.collectTitle}>Collect as WETH</span>
          <button
            onClick={() => setButtonEnabled((state) => !state)}
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

        <button
          disabled={rangeValue === 0}
          onClick={clickHandler}
          className={styles.removeBtn}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export { RemoveLiquidity };
