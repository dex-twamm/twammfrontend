import { BigNumber, ethers } from "ethers";
import { Decimal } from "decimal.js";
import { MAX_INPUT_LENGTH } from "./constants";

export const truncateAddress = (address) => {
  if (!address) return "No Account";
  const chars = 4;
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );
  if (!match) return address;
  return `${address.substring(0, chars + 2)}...${address.substring(
    42 - chars
  )}`;
};

export const toHex = (num) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};

//This function returns the few number after trailing of zeroes in decimals
export const getProperFixedValue = (num) => {
  let number = parseFloat(num);
  let str = num?.toString();
  let decimalIndex = str.indexOf(".");
  if (decimalIndex === -1) return number?.toFixed(4);
  let trailingZeroes = str.slice(decimalIndex).replace(/[1-9]/g, "").length;
  return number?.toFixed(trailingZeroes > 2 ? trailingZeroes : 2);
};

export const bigToStr = (bigNum, decimalPlaces) => {
  return getProperFixedValue(
    parseFloat(ethers.utils.formatUnits(bigNum, decimalPlaces))
  );
};

export const bigToFloat = (bigNum, decimalPlaces) => {
  return parseFloat(ethers.utils.formatUnits(bigNum, decimalPlaces));
};

// Exporting fp
export const SCALING_FACTOR = 1e18;
export const decimal = (x) => new Decimal(x.toString());
export const bn = (x) => {
  if (BigNumber.isBigNumber(x)) return x;
  const stringified = parseScientific(x.toString());
  const integer = stringified.split(".")[0];
  return BigNumber.from(integer);
};
export const toFp = (x) => decimal(x).mul(SCALING_FACTOR);
export const fp = (x) => bn(toFp(x));

function parseScientific(num) {
  // If the number is not in scientific notation return it as it is
  if (!/\d+\.?\d*e[+-]*\d+/i.test(num)) return num;

  // Remove the sign
  const numberSign = Math.sign(Number(num));
  num = Math.abs(Number(num)).toString();

  // Parse into coefficient and exponent
  const [coefficient, exponent] = num.toLowerCase().split("e");
  let zeros = Math.abs(Number(exponent));
  const exponentSign = Math.sign(Number(exponent));
  const [integer, decimals] = (
    coefficient.indexOf(".") !== -1 ? coefficient : `${coefficient}.`
  ).split(".");

  if (exponentSign === -1) {
    zeros -= integer.length;
    num =
      zeros < 0
        ? integer.slice(0, zeros) + "." + integer.slice(zeros) + decimals
        : "0." + "0".repeat(zeros) + integer + decimals;
  } else {
    if (decimals) zeros -= decimals.length;
    num =
      zeros < 0
        ? integer + decimals.slice(0, zeros) + "." + decimals.slice(zeros)
        : integer + decimals + "0".repeat(zeros);
  }

  return numberSign < 0 ? "-" + num : num;
}

export const MAX_UINT256 = ethers.constants.MaxUint256;
export const ZERO = ethers.constants.Zero;

export const LONGTERM_CONTRACT = "0xC392dF9Ee383d6Bce110757FdE7762f0372f6A5D";

export const timeDeltaString = (seconds) => {
  const hhmm = new Date(1000 * seconds).toISOString().substring(11, 16);
  const days = parseInt(seconds / 86400);
  if (seconds > 86400) {
    return `${days}d ${hhmm}`;
  } else {
    return hhmm;
  }
};

export const getInversedValue = (value) => {
  return getProperFixedValue(1 / value);
};

export const getInputLimit = (value) => {
  return value.slice(0, MAX_INPUT_LENGTH);
};
