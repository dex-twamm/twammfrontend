import { BigNumber, ethers } from "ethers";
import { Decimal } from "decimal.js";

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

export const bigToStr = (bigNum, decimalPlaces) => {
  return parseFloat(ethers.utils.formatUnits(bigNum, decimalPlaces)).toFixed(4);
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

export const POOL_ID =
  "0x20c0b25ace39df183b9ccbbd1d575764544aeb190002000000000000000001f8";

export const MATIC_TOKEN_ADDRESS = "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae";
export const FAUCET_TOKEN_ADDRESS =
  "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc";
// export const OWNER_ADDRESS = "0x51Ac1DB1A27Ec7CD51a21523a935b26ad53DBEb7";

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
