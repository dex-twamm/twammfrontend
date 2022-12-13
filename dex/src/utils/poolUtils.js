import { POOLS } from "./pool";

export const getNetworkPoolId = (currentNetwork = "Goerli") => {
  const poolId = Object.keys(POOLS[currentNetwork])?.[0];
  return poolId;
};

export const getPoolConfig = (currentNetwork = "Goerli") => {
  console.log("Current network from spotpreice", currentNetwork);
  const poolData = Object.values(POOLS?.[currentNetwork])?.[0];
  return poolData;
};

export const getPoolEthersScanUrl = (currentNetwork = "Goerli") => {
  const poolData = Object.values(POOLS?.[currentNetwork])?.[0];
  return poolData?.ethersScanUrl;
};

export const getPoolTransactionUrl = (currentNetwork = "Goerli") => {
  const poolData = Object.values(POOLS?.[currentNetwork])?.[0];
  return poolData?.transactionUrl;
};

export const getPoolTokens = (currentNetwork = "Goerli") => {
  const poolData = Object.values(POOLS?.[currentNetwork])?.[0];
  return poolData?.tokens;
};

export const getPoolFees = (currentNetwork = "Goerli") => {
  const poolData = Object.values(POOLS?.[currentNetwork])?.[0];
  return poolData?.fees;
};

export const getpoolBalancerUrl = (currentNetwork = "Goerli") => {
  const poolData = Object.values(POOLS?.[currentNetwork])?.[0];
  return poolData?.balancerPoolUrl;
};

export const getpoolVaultContractAddress = (currentNetwork = "Goerli") => {
  const poolData = Object.values(POOLS?.[currentNetwork])?.[0];
  return poolData?.VAULT_CONTRACT_ADDRESS;
};

export const getpoolAddress = (currentNetwork = "Goerli") => {
  const poolData = Object.values(POOLS?.[currentNetwork])?.[0];
  return poolData?.address;
};

export const getpoolLtoContract = (currentNetwork = "Goerli") => {
  const poolData = Object.values(POOLS?.[currentNetwork])?.[0];
  return poolData?.LTOContract;
};

export const getPoolTokenAddresses = (currentNetwork = "Goerli") => {
  const poolData = Object.values(POOLS?.[currentNetwork])?.[0];
  const addresses = [poolData?.TOKEN_ONE_ADDRESS, poolData?.TOKEN_TWO_ADDRESS];
  return addresses;
};
