import { timeDeltaString } from "../utils";

const valueLabel = (value, currentBlock) => {
  // TODO
  const blockTimesSkew = (
    (new Date() - new Date(currentBlock.timestamp * 1000)) /
    1000
  ).toFixed(0);
  const numBlocks =
    Math.ceil(value) * 50 +
    (currentBlock.number % 50 ? 50 - (currentBlock.number % 50) : 0);

  const targetDate = new Date();
  targetDate.setSeconds(
    targetDate.getSeconds() + Math.ceil(value) * 12 * 50 - (blockTimesSkew % 12)
  );

  const timeString = timeDeltaString((targetDate - new Date()) / 1000);

  const values = {
    executionTime: timeString,
    targetDate: `${targetDate.toLocaleDateString()} ${targetDate.toLocaleTimeString()}`,
  };
  return values;
};

const calculateNumBlockIntervals = (sliderValue) => {
  return Math.pow(2, sliderValue);
};

export { valueLabel, calculateNumBlockIntervals };
