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

  const values = {
    scaledValue: scaledValue.toFixed(0),
    sliderUnits: sliderUnits[unitIndex],
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
  const minp = 0;
  const maxp = 100;
  const minV = Math.log(60);
  const maxV = Math.log(43200);
  var scale = (maxV - minV) / (maxp - minp);
  return Math.exp(minV + scale * (value - minp));
};

export { valueLabel, calculateValue };
