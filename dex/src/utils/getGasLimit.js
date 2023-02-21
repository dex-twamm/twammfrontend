import { GAS_OVERAGE_FACTOR } from "../constants";

export const getGasLimit = async (contract, data, method) => {
  const gasEstimate = await contract.estimateGas[method](...data);
  return Math.floor(gasEstimate.toNumber() * GAS_OVERAGE_FACTOR);
};
