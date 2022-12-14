import { POOLS } from "./pool";

export const getPoolId = (currentNetwork = "Goerli") => {
  return Object.keys(POOLS[currentNetwork])?.[0];
};

export const getPoolConfig = (currentNetwork = "Goerli") => {
  return Object.values(POOLS?.[currentNetwork])?.[0];
};

export const getPoolTokens = (currentNetwork = "Goerli") => {
  return Object.values(POOLS?.[currentNetwork])?.[0]?.tokens;
};

export const getPoolFees = (currentNetwork = "Goerli") => {
  return Object.values(POOLS?.[currentNetwork])?.[0]?.fees;
};

export const getPoolContractAddress = (currentNetwork = "Goerli") => {
  return Object.values(POOLS?.[currentNetwork])?.[0]?.address;
};

export const getPoolLtoContractAddress = (currentNetwork = "Goerli") => {
  return Object.values(POOLS?.[currentNetwork])?.[0]?.LTOContract;
};

export const getPoolTokenAddresses = (currentNetwork = "Goerli") => {
  return getPoolTokens(currentNetwork).map((item) => item.address);
};
