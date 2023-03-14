import { BigNumber, Contract, ethers } from "ethers";
import { bigToStr } from ".";

import { ERC20_TOKEN_CONTRACT_ABI, TWAMM_POOL_ABI } from "../constants";
import { SelectedNetworkType } from "../providers/context/UIProvider";
import { PoolType } from "./pool";
import {
  getPoolContractAddress,
  getPoolConfig,
  getPoolTokenAddresses,
} from "./poolUtils";
// To Retrieve Token Balances

type MyArrayOfObjects = { [key: string]: number };

export const getTokensBalance = async (
  signer: any,
  walletAddress: string,
  currentNetwork: SelectedNetworkType
): Promise<MyArrayOfObjects[]> => {
  const poolConfig: PoolType = getPoolConfig(currentNetwork)!;
  var tokenAddress: string[] = getPoolTokenAddresses(currentNetwork)!;

  const newBalance: MyArrayOfObjects[] = [];
  for (let index = 0; index < tokenAddress?.length; index++) {
    const address: string = tokenAddress[index];
    const balances: BigNumber = await balanceContract(address);

    const readableBalance: number = parseFloat(
      ethers.utils.formatUnits(balances, poolConfig?.tokens[index].decimals)
    );
    newBalance.push({ [address]: readableBalance });
  }
  async function balanceContract(address: string): Promise<BigNumber> {
    const ERC20Contract: Contract = new Contract(
      address,
      ERC20_TOKEN_CONTRACT_ABI,
      signer
    );
    const balanceOfTokens: BigNumber = await ERC20Contract.balanceOf(
      walletAddress
    );
    return balanceOfTokens;
  }

  return newBalance.map((item) => item);
};

export const getLPTokensBalance = async (
  signer: any,
  walletAddress: string,
  currentNetwork: SelectedNetworkType
): Promise<number> => {
  const poolContract: Contract = new Contract(
    getPoolContractAddress(currentNetwork)!,
    TWAMM_POOL_ABI,
    signer
  );

  const balanceOfLPTokens: BigNumber = await poolContract.balanceOf(
    walletAddress
  );
  const readableBalance: any = bigToStr(balanceOfLPTokens);
  return readableBalance;
};
