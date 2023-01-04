import { GAS_OVERAGE_FACTOR } from "../constants";

export const getGasLimit = async (exchangeContract, data, method) => {
  const gasEstimate = await exchangeContract.estimateGas[method](...data);
  return Math.floor(gasEstimate.toNumber() * GAS_OVERAGE_FACTOR);
};
