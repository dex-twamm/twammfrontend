import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { POOLS } from "./pool";

export const getCurrentNetwork = (currentNetwork: SelectedNetworkType) => {
  return currentNetwork?.network ?? "Ethereum";
};

export const getAllPool = (currentNetwork: SelectedNetworkType) => {
  if (currentNetwork)
    return Object.values(POOLS?.[getCurrentNetwork(currentNetwork)]);
};

export const getPoolId = (currentNetwork: SelectedNetworkType) => {
  if (currentNetwork)
    return Object.keys(POOLS[getCurrentNetwork(currentNetwork)])?.[
      currentNetwork?.poolId
    ];
};

export const getPoolConfig = (currentNetwork: SelectedNetworkType) => {
  let poolConfig;
  if (currentNetwork)
    poolConfig = Object.values(POOLS?.[getCurrentNetwork(currentNetwork)])?.[
      currentNetwork?.poolId
    ];

  if (!poolConfig) {
    throw new Error(
      "Failed to retrieve pool configuration for selected network"
    );
  }

  return poolConfig;
};

export const getPoolTokens = (currentNetwork: SelectedNetworkType) => {
  return getPoolConfig(currentNetwork)?.tokens;
};

export const getPoolTokenSymbol = (currentNetwork: SelectedNetworkType) => {
  if (currentNetwork) {
    const symbols = [
      getPoolTokens(currentNetwork)?.[0]?.symbol,
      getPoolTokens(currentNetwork)?.[1]?.symbol,
    ];

    return symbols;
  }
};

export const getPoolFees = (currentNetwork: SelectedNetworkType) => {
  return getPoolConfig(currentNetwork)?.fees;
};

export const getPoolContractAddress = (currentNetwork: SelectedNetworkType) => {
  return getPoolConfig(currentNetwork)?.address;
};

export const getPoolLtoContractAddress = (
  currentNetwork: SelectedNetworkType
) => {
  return getPoolConfig(currentNetwork)?.LTOContract;
};

export const getPoolTokenAddresses = (currentNetwork: SelectedNetworkType) => {
  return getPoolTokens(currentNetwork)?.map((item) => item.address);
};

export const getPoolBlockInterval = (currentNetwork: SelectedNetworkType) => {
  return getPoolConfig(currentNetwork)?.blockInterval;
};

export const getPoolLength = (currentNetwork: SelectedNetworkType) => {
  return getAllPool(currentNetwork)?.length ?? 0;
};
