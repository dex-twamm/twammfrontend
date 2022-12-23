import { timeDeltaString } from "../utils";
import { getPoolBlockInterval } from "../utils/poolUtils";

const valueLabel = (value, currentBlock, currentNetwork) => {
  const blockInterval = getPoolBlockInterval(currentNetwork);

  let currentBlockNumber = currentBlock?.number || 0;
  const numBlocks =
    Math.ceil(value) * blockInterval +
    (currentBlockNumber % blockInterval
      ? blockInterval - (currentBlockNumber % blockInterval)
      : 0);

  console.log(
    "numBlocks",
    numBlocks,
    currentBlockNumber,
    150 - (currentBlockNumber % 150)
  );

  let targetDate;
  if (currentBlock?.timestamp) {
    targetDate = new Date(currentBlock.timestamp * 1000);
  } else {
    targetDate = new Date();
  }
  targetDate.setSeconds(targetDate.getSeconds() + numBlocks * 12);

  const timeString = timeDeltaString((targetDate - new Date()) / 1000);

  const values = {
    executionTime: timeString,
    targetDate: `${targetDate.toLocaleString()}`,
  };
  console.log("targetDate values", values);
  return values;
};

const calculateNumBlockIntervals = (sliderValue) => {
  return Math.floor(Math.pow(2, sliderValue));
};

export { valueLabel, calculateNumBlockIntervals };
