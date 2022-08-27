const valueLabel = (value) => {
  const sliderUnits = ["Min", "Hours", "Days", "Week", "Month"];
  let unitIndex = 0;
  let scaledValue = value;

  if (scaledValue > 43200 && unitIndex < sliderUnits.length - 1) {
    unitIndex = 4;
    scaledValue /= 43200;
  }
  if (scaledValue >= 10080 && unitIndex < sliderUnits.length - 1) {
    unitIndex = 3;
    scaledValue /= 10080;
  } else if (scaledValue >= 1440 && unitIndex < sliderUnits.length - 1) {
    unitIndex = 2;
    scaledValue /= 1440;
  } else if (scaledValue >= 300 && unitIndex < sliderUnits.length - 1) {
    unitIndex = 1;
    scaledValue /= 300;
  } else if (scaledValue >= 60 && unitIndex < sliderUnits.length - 1) {
    scaledValue /= 60;
  }
  return `${scaledValue.toFixed(0)} ${sliderUnits[unitIndex]}`;
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
