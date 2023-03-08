import { POOLS } from "./pool";

interface currentNetworkType {
  network: string;
  poolId: number;
}

export const getCurrentNetwork = (currentNetwork: currentNetworkType) => {
  return currentNetwork?.network ?? "Ethereum";
};

export const getAllPool = (currentNetwork: currentNetworkType) => {
  if (currentNetwork)
    return Object.values(POOLS?.[getCurrentNetwork(currentNetwork)]);
};

export const getPoolId = (currentNetwork: currentNetworkType) => {
  if (currentNetwork)
    return Object.keys(POOLS[getCurrentNetwork(currentNetwork)])?.[
      currentNetwork?.poolId
    ];
};

export const getPoolConfig = (currentNetwork: currentNetworkType) => {
  if (currentNetwork)
    return Object.values(POOLS?.[getCurrentNetwork(currentNetwork)])?.[
      currentNetwork?.poolId
    ];
};

export const getPoolTokens = (currentNetwork: currentNetworkType) => {
  return getPoolConfig(currentNetwork)?.tokens;
};

export const getPoolTokenSymbol = (currentNetwork: currentNetworkType) => {
  if (currentNetwork) {
    const symbols = [
      getPoolTokens(currentNetwork)?.[0]?.symbol,
      getPoolTokens(currentNetwork)?.[1]?.symbol,
    ];

    return symbols;
  }
};

export const getPoolFees = (currentNetwork: currentNetworkType) => {
  return getPoolConfig(currentNetwork)?.fees;
};

export const getPoolContractAddress = (currentNetwork: currentNetworkType) => {
  return getPoolConfig(currentNetwork)?.address;
};

export const getPoolLtoContractAddress = (
  currentNetwork: currentNetworkType
) => {
  return getPoolConfig(currentNetwork)?.LTOContract;
};

export const getPoolTokenAddresses = (currentNetwork: currentNetworkType) => {
  return getPoolTokens(currentNetwork)?.map((item) => item.address);
};

export const getPoolBlockInterval = (currentNetwork: currentNetworkType) => {
  return getPoolConfig(currentNetwork)?.blockInterval;
};
