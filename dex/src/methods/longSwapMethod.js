import { timeDeltaString } from "../utils";

const valueLabel = (value, currentBlock) => {
  let currentBlockNumber = currentBlock?.number || 0;
  const numBlocks =
    Math.ceil(value) * 150 +
    (currentBlockNumber % 150 ? 150 - (currentBlockNumber % 150) : 0);

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
  return values;
};

const calculateNumBlockIntervals = (sliderValue) => {
  return Math.floor(Math.pow(2, sliderValue));
};

export { valueLabel, calculateNumBlockIntervals };
