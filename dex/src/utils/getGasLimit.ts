import { GAS_OVERAGE_FACTOR } from "../constants";
import { Contract } from "ethers";

export const getGasLimit = async (
  contract: Contract,
  data: any,
  method: string
): Promise<number> => {
  const gasEstimate = await contract.estimateGas[method](...data);
  return Math.floor(gasEstimate.toNumber() * GAS_OVERAGE_FACTOR);
};
