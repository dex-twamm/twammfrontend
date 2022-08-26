import { ethers } from "ethers";
import { validate } from "json-schema";
import { toHex } from ".";

export async function ethLogs() {

    const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/3c2a9ef715cf4789b9137212d45270e9");
    const fromBlock = toHex(1)
    const toBlock = toHex(2)
    const filterId = await provider.getLogs(
        {
            "jsonrpc": "2.0",
            "id": 0,
            "method": "eth_getLogs",
            "params": [
                {
                    "fromBlock": "",
                    "toBlock": "",
                    "address": "0x16110DAFbCBEeCdb29ac69210EbffCb526893fda",
                    "topics": [
                        "0x049cb9f702614451e12929b92b408d8132fb92a057f8994fd518e38f567218ad",
                        "0x0000000000000000000000000000000000000000000000000000000000000000",
                        "0x0000000000000000000000000000000000000000000000000000000000000001",
                        "0x000000000000000000000000dd88db355d6beb64813fd3b29b73a246daed6fc8"
                    ]
                }
            ]
        }
    )
    console.log(filterId)

}