const valueLabel = (value, currentBlock) => {
  // TODO 
  console.log("cBlock", currentBlock);
  const blockTimesSkew = ((new Date() - new Date(currentBlock.timestamp * 1000)) / 1000).toFixed(0);
  console.log("Skew Time", blockTimesSkew)
  const targetDate = new Date();
  targetDate.setSeconds(targetDate.getSeconds() + Math.ceil(value) * 12 * 50 - (blockTimesSkew % 12))

  let executionTime = new Date(0);
  executionTime.setSeconds(targetDate - new Date()); // specify value for SECONDS here
  const timeString = executionTime.toISOString().substring(11, 19);
  const values = {
    executionTime: timeString,
    targetDate: `${targetDate.toLocaleDateString()} ${targetDate.toLocaleTimeString()}`
  };
  console.log("Time Diff", timeString)
  return values;

};

const calculateNumBlockIntervals = (sliderValue) => {
  return Math.pow(2, sliderValue);
};

export { valueLabel, calculateNumBlockIntervals };
