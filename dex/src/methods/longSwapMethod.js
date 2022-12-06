import { timeDeltaString } from "../utils";

const valueLabel = (value, currentBlock) => {
  const numBlocks =
    Math.ceil(value) * 150 +
    (currentBlock.number % 150 ? 150 - (currentBlock.number % 150) : 0);

  console.log(
    "numBlocks",
    numBlocks,
    currentBlock,
    150 - (currentBlock.number % 150)
  );

  const targetDate = new Date(currentBlock.timestamp * 1000);
  targetDate.setSeconds(targetDate.getSeconds() + numBlocks * 12);

  const timeString = timeDeltaString((targetDate - new Date()) / 1000);

  const values = {
    executionTime: timeString,
    targetDate: `${targetDate.toLocaleString()}`,
  };
  console.log("targetDate", targetDate, timeString);
  return values;
};

const calculateNumBlockIntervals = (sliderValue) => {
  return Math.floor(Math.pow(2, sliderValue));
};

export { valueLabel, calculateNumBlockIntervals };
