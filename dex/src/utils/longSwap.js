import { Contract, ethers, utils } from "ethers";
import { VAULT_CONTRACT_ABI, VAULT_CONTRACT_ADDRESS } from "../constants";
import { POOL_ID, FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS, OWNER_ADDRESS, MAX_UINT256 } from ".";

export async function placeLongTermOrder(
    tokenInIndex, tokenOutIndex,
    amountIn, numberOfBlockIntervals, signer) {

    const exchangeContract = new Contract(
        VAULT_CONTRACT_ADDRESS,
        VAULT_CONTRACT_ABI,
        signer
    );
    const abiEncode = ethers.utils.defaultAbiCoder;
    const encodedRequest = abiEncode.encode(
        ['uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
        [4, tokenInIndex, tokenOutIndex, amountIn, numberOfBlockIntervals]
    );
    const placeLtoTx = await exchangeContract.joinPool(
        POOL_ID,
        OWNER_ADDRESS,
        OWNER_ADDRESS,
        {
            assets: [MATIC_TOKEN_ADDRESS, FAUCET_TOKEN_ADDRESS],
            maxAmountsIn: [MAX_UINT256, MAX_UINT256],
            fromInternalBalance: false,
            userData: encodedRequest,
        },
        {
            gasLimit: 500000,
        }
    )
    const placeLtoResult = await placeLtoTx.wait();
    console.log(placeLtoResult);
}