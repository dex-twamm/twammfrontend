const valueLabel = (value) => {
  const sliderUnits = ["Min", "Hours", "Days", "Week", "Month"];
  let unitIndex = 0;
  let scaledValue = value;

  if (scaledValue >= 1440 && unitIndex < sliderUnits.length - 1) {
    unitIndex = 2;
    scaledValue /= 1440;
  } else if (scaledValue >= 300 && unitIndex < sliderUnits.length - 1) {
    unitIndex = 1;
    scaledValue /= 300;
  } else if (scaledValue >= 60 && unitIndex < sliderUnits.length - 1) {
    scaledValue /= 60;
  }
  const currentDate = new Date();
  currentDate.setSeconds(scaledValue);

  const values = {
    scaledValue: scaledValue.toFixed(0),
    sliderUnits: sliderUnits[unitIndex],
    date: currentDate.toDateString(),
  };
  return values;
  // sliderUnits: sliderUnits[unitIndex],}
  // return sliderUnits[unitIndex];
  // scaledValue.toFixed(0);
  //   `${scaledValue.toFixed(0)} ${
  //   sliderUnits[unitIndex]
  // }`;
  // scaledValue: scaledValue.toFixed(0),
  // sliderUnits: sliderUnits[unitIndex],

  // Block Interval Calculation 
  //  Incoming Input as Seconds/ 12(Block Time) / Block
  // const calculateValue = (value) => {
  //   return log(value * blockInterval * blockTime);
  // };
};

const calculateValue = (value) => {
  // position will be between 0 and 100
  const blockTime = 12;
  const blockInterval = 2;
  const calculateValue = (Math.log(Math.pow(10, value)) / blockTime / blockInterval);
  return calculateValue;
};

export { valueLabel, calculateValue };
