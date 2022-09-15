import { BigNumber, Contract, ethers, utils } from "ethers";
import { LONGTERM_ABI, VAULT_CONTRACT_ABI, VAULT_CONTRACT_ADDRESS } from "../constants";
import { POOL_ID, FAUCET_TOKEN_ADDRESS, MATIC_TOKEN_ADDRESS, OWNER_ADDRESS, MAX_UINT256, LONGTERM_CONTRACT } from ".";

export async function placeLongTermOrder(
    tokenInIndex, tokenOutIndex,
    amountIn, numberOfBlockIntervals, signer, walletAddress) {

    let txHash;

    const exchangeContract = new Contract(
        VAULT_CONTRACT_ADDRESS,
        VAULT_CONTRACT_ABI,
        signer
    );
    const abiCoder = ethers.utils.defaultAbiCoder;
    const encodedRequest = abiCoder.encode(
        ['uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
        [4, tokenInIndex, tokenOutIndex, amountIn, BigNumber.from(numberOfBlockIntervals)]
    );
    const placeLtoTx = await exchangeContract.joinPool(
        POOL_ID,
        walletAddress,
        walletAddress,
        {
            assets: [MATIC_TOKEN_ADDRESS, FAUCET_TOKEN_ADDRESS],
            maxAmountsIn: [MAX_UINT256, MAX_UINT256],
            fromInternalBalance: false,
            userData: encodedRequest,
        },
        {
            gasLimit: 2000000
        }

    )
    console.log("===LongTerm Placed====", placeLtoTx)
    txHash = placeLtoTx.hash;

    console.log("====Swap Results After Placed=====", await placeLtoTx.wait())
    console.log(txHash);
    return txHash;


}

export async function getLongTermOrder(signer, orderId) {
    const contract = new Contract(
        LONGTERM_CONTRACT,
        LONGTERM_ABI,
        signer
    );
    const getOrderDetails = await contract.getLongTermOrder(
        orderId
    )
    const orderDetails = await getOrderDetails;
    console.log("==== ORDER DETAILS=====", orderDetails);
    return orderDetails;
}

export async function getLastVirtualOrderBlock(signer) {
    const contract = new Contract(
        LONGTERM_CONTRACT,
        LONGTERM_ABI,
        signer
    );

    const longterm = await contract.longTermOrders();
    const latestBlock = (longterm.lastVirtualOrderBlock)

    console.log("====GET Long Term DETAILS=====", (longterm.lastVirtualOrderBlock.toNumber()));
    return (latestBlock);
}