import { providers } from "ethers";

export const getEthereumFromWindow = () => {
  const ethereum = window.ethereum;

  return ethereum as providers.ExternalProvider | undefined;
};
