import { GAS_OVERAGE_FACTOR } from "../constants";

export const getGasLimit = async (exchangeContract, swapData, method) => {
  const gasEstimate = await exchangeContract.estimateGas[method](...swapData);
  return Math.floor(gasEstimate.toNumber() * GAS_OVERAGE_FACTOR);
};
