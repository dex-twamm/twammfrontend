import { timeDeltaString } from "../utils";

const valueLabel = (value, currentBlock) => {
  // TODO 
  console.log("cBlock", currentBlock);
  const blockTimesSkew = ((new Date() - new Date(currentBlock.timestamp * 1000)) / 1000).toFixed(0);
  console.log("Skew Time", blockTimesSkew)
  const numBlocks = Math.ceil(value) * 50 + (currentBlock.number % 50 ? (50 - (currentBlock.number % 50)) : 0);

  console.log("numBlocks", numBlocks, currentBlock, (50 - (currentBlock.number % 50)));


  const targetDate = new Date();
  targetDate.setSeconds(targetDate.getSeconds() + Math.ceil(value) * 12 * 50 - (blockTimesSkew % 12))

  // console.log("targetDate", targetDate - new Date());

  const timeString = timeDeltaString((targetDate - new Date()) / 1000);

  const values = {
    executionTime: timeString,
    targetDate: `${targetDate.toLocaleDateString()} ${targetDate.toLocaleTimeString()}`
  };
  // console.log("Time Diff", timeString)
  return values;

};

const calculateNumBlockIntervals = (sliderValue) => {
  return Math.pow(2, sliderValue);
};

export { valueLabel, calculateNumBlockIntervals };
