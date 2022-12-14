import { POOLS } from "./pool";

export const getNetworkPoolId = (currentNetwork = "Goerli") => {
  return Object.keys(POOLS[currentNetwork])?.[0];
};

export const getPoolConfig = (currentNetwork = "Goerli") => {
  return Object.values(POOLS?.[currentNetwork])?.[0];
};

export const getPoolEthersScanUrl = (currentNetwork = "Goerli") => {
  return Object.values(POOLS?.[currentNetwork])?.[0]?.ethersScanUrl;
};

export const getPoolTransactionUrl = (currentNetwork = "Goerli") => {
  return Object.values(POOLS?.[currentNetwork])?.[0]?.transactionUrl;
};

export const getPoolTokens = (currentNetwork = "Goerli") => {
  return Object.values(POOLS?.[currentNetwork])?.[0]?.tokens;
};

export const getPoolFees = (currentNetwork = "Goerli") => {
  return Object.values(POOLS?.[currentNetwork])?.[0]?.fees;
};

export const getPoolBalancerUrl = (currentNetwork = "Goerli") => {
  return Object.values(POOLS?.[currentNetwork])?.[0]?.balancerPoolUrl;
};

export const getPoolVaultContractAddress = (currentNetwork = "Goerli") => {
  return Object.values(POOLS?.[currentNetwork])?.[0]?.VAULT_CONTRACT_ADDRESS;
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
