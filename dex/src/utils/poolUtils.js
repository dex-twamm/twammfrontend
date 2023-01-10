import { POOLS } from "./pool";

export const getAllPool = (currentNetwork = "Goerli") => {
  return Object.values(POOLS?.[currentNetwork]);
};

export const getPoolId = (currentNetwork = "Goerli", poolNumber) => {
  return Object.keys(POOLS[currentNetwork])?.[poolNumber];
};

export const getPoolConfig = (currentNetwork = "Goerli", poolNumber) => {
  return Object.values(POOLS?.[currentNetwork])?.[poolNumber];
};

export const getPoolTokens = (currentNetwork = "Goerli", poolNumber) => {
  return getPoolConfig(currentNetwork, poolNumber)?.tokens;
};

export const getPoolTokenSymbol = (currentNetwork = "Goerli", poolNumber) => {
  const symbols = [
    getPoolTokens(currentNetwork, poolNumber)?.[0]?.symbol,
    getPoolTokens(currentNetwork, poolNumber)?.[1]?.symbol,
  ];

  return symbols;
};

export const getPoolFees = (currentNetwork = "Goerli", poolNumber) => {
  return getPoolConfig(currentNetwork, poolNumber)?.fees;
};

export const getPoolContractAddress = (
  currentNetwork = "Goerli",
  poolNumber
) => {
  return getPoolConfig(currentNetwork, poolNumber)?.address;
};

export const getPoolLtoContractAddress = (
  currentNetwork = "Goerli",
  poolNumber
) => {
  return getPoolConfig(currentNetwork, poolNumber)?.LTOContract;
};

export const getPoolTokenAddresses = (
  currentNetwork = "Goerli",
  poolNumber
) => {
  return getPoolTokens(currentNetwork, poolNumber).map((item) => item.address);
};

export const getPoolBlockInterval = (currentNetwork = "Goerli", poolNumber) => {
  return getPoolConfig(currentNetwork, poolNumber)?.blockInterval;
};
