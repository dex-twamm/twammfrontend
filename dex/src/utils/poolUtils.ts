import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { POOLS, PoolType, TOKENS } from "./pool";

export const getCurrentNetwork = (currentNetwork: SelectedNetworkType) => {
  return currentNetwork?.network ?? "Ethereum";
};

export const getAllPool = (currentNetwork: SelectedNetworkType): PoolType[] => {
  let allPoolOfSelectedNetwork: PoolType[] | null = null;

  if (currentNetwork)
    allPoolOfSelectedNetwork = Object.values(
      POOLS?.[getCurrentNetwork(currentNetwork)]
    );

  if (!allPoolOfSelectedNetwork)
    throw new Error("Failed to retrieve all pool for selected network");

  return allPoolOfSelectedNetwork;
};

export const getPoolId = (currentNetwork: SelectedNetworkType): string => {
  let poolId: string | null = null;
  if (currentNetwork)
    poolId = Object.keys(POOLS[getCurrentNetwork(currentNetwork)])?.[
      currentNetwork?.poolId
    ];

  if (!poolId)
    throw new Error("Failed to retrieve pool id for selected network");

  return poolId;
};

export const getPoolConfig = (
  currentNetwork: SelectedNetworkType
): PoolType => {
  let poolConfig: PoolType | null = null;
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

export const getPoolTokenSymbol = (
  currentNetwork: SelectedNetworkType
): string[] => {
  let symbols: string[] | null = null;
  if (currentNetwork)
    symbols = [
      getPoolTokens(currentNetwork)?.[0]?.symbol,
      getPoolTokens(currentNetwork)?.[1]?.symbol,
    ];

  if (!symbols)
    throw new Error(
      "Symbols not found in the pool configuration of selected network."
    );

  return symbols;
};

export const getShortSwapPoolFee = (currentNetwork: SelectedNetworkType) => {
  return getPoolConfig(currentNetwork)?.shortSwapFee;
};

export const getLongSwapPoolFee = (currentNetwork: SelectedNetworkType) => {
  return getPoolConfig(currentNetwork)?.longSwapFee;
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

export const getTokenAddress = (
  currentNetwork: SelectedNetworkType,
  tokenSymbol: string
) => {
  return TOKENS[getCurrentNetwork(currentNetwork)][tokenSymbol];
};
