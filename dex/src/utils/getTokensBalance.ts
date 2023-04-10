import { BigNumber, Contract, ethers, Signer, providers } from "ethers";
import { ERC20_TOKEN_CONTRACT_ABI } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { getPoolId, getPoolTokenAddresses, getPoolTokens } from "./poolUtils";
import { getExchangeContract } from "./getContracts";
import { TokenType } from "./pool";
// To Retrieve Token Balances

type MyArrayOfObjects = { [key: string]: number };

export const getTokensBalance = async (
  signer: Signer | providers.Provider,
  walletAddress: string,
  currentNetwork: SelectedNetworkType
): Promise<MyArrayOfObjects[]> => {
  const tokens = getPoolTokens(currentNetwork);
  var tokenAddress: string[] = getPoolTokenAddresses(currentNetwork);

  const newBalance: MyArrayOfObjects[] = [];
  for (let index = 0; index < tokenAddress?.length; index++) {
    const address: string = tokenAddress[index];
    const tokenBalance: BigNumber = await balanceContract(address);

    const readableBalance: number = parseFloat(
      ethers.utils.formatUnits(tokenBalance, tokens[index].decimals)
    );
    newBalance.push({ [address]: readableBalance });
  }

  async function balanceContract(address: string): Promise<BigNumber> {
    const ERC20Contract: Contract = new Contract(
      address,
      ERC20_TOKEN_CONTRACT_ABI,
      signer
    );
    const tokenBalance: BigNumber = await ERC20Contract.balanceOf(
      walletAddress
    );
    return tokenBalance;
  }

  return newBalance.map((item) => item);
};

export const getPoolTokenBalances = async (
  signer: Signer | providers.Provider,
  poolTokensConfig: Array<TokenType>,
  currentNetwork: SelectedNetworkType
) => {
  const vaultContract = getExchangeContract(currentNetwork, signer);
  const poolId = getPoolId({
    ...currentNetwork,
    poolId: currentNetwork.poolId,
  });

  const poolTokenBalances: Array<Array<string | number>> =
    await vaultContract.getPoolTokens(poolId);

  return [
    {
      [poolTokenBalances[0][0].toString()]: parseFloat(
        ethers.utils.formatUnits(
          poolTokenBalances[1][0],
          poolTokensConfig[0].decimals
        )
      ),
    },
    {
      [poolTokenBalances[0][1].toString()]: parseFloat(
        ethers.utils.formatUnits(
          poolTokenBalances[1][1],
          poolTokensConfig[1].decimals
        )
      ),
    },
  ];
};
