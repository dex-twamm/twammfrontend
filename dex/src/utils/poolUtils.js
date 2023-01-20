import { POOLS } from "./pool";

export const getCurrentNetwork = (currentNetwork) => {
  return currentNetwork?.network ?? "Ethereum";
};

export const getAllPool = (currentNetwork) => {
  if (currentNetwork)
    return Object.values(POOLS?.[getCurrentNetwork(currentNetwork)]);
};

export const getPoolId = (currentNetwork) => {
  if (currentNetwork)
    return Object.keys(POOLS[getCurrentNetwork(currentNetwork)])?.[
      currentNetwork?.poolId
    ];
};

export const getPoolConfig = (currentNetwork) => {
  if (currentNetwork);
  return Object.values(POOLS?.[getCurrentNetwork(currentNetwork)])?.[
    currentNetwork?.poolId
  ];
};

export const getPoolTokens = (currentNetwork) => {
  return getPoolConfig(currentNetwork, currentNetwork?.poolId)?.tokens;
};

export const getPoolTokenSymbol = (currentNetwork) => {
  if (currentNetwork) {
    const symbols = [
      getPoolTokens(currentNetwork, currentNetwork?.poolId)?.[0]?.symbol,
      getPoolTokens(currentNetwork, currentNetwork?.poolId)?.[1]?.symbol,
    ];

    return symbols;
  }
};

export const getPoolFees = (currentNetwork) => {
  return getPoolConfig(currentNetwork, currentNetwork?.poolId)?.fees;
};

export const getPoolContractAddress = (currentNetwork) => {
  return getPoolConfig(currentNetwork, currentNetwork?.poolId)?.address;
};

export const getPoolLtoContractAddress = (currentNetwork) => {
  return getPoolConfig(currentNetwork, currentNetwork?.poolId)?.LTOContract;
};

export const getPoolTokenAddresses = (currentNetwork) => {
  return getPoolTokens(currentNetwork, currentNetwork?.poolId).map(
    (item) => item.address
  );
};

export const getPoolBlockInterval = (currentNetwork) => {
  return getPoolConfig(currentNetwork, currentNetwork?.poolId)?.blockInterval;
};
