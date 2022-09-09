import { Contract, ethers } from "ethers";
import { TWAMM_POOL_ABI } from "../constants";

export async function ethLogs(signer) {

  const exchangeContract = new Contract(
    '0x40e1fB58aBbd319dB35964eA73e148919Ed0Ae51',
    TWAMM_POOL_ABI,
    signer
  );

  let filter = exchangeContract.filters.LongTermOrderPlaced(null, null, null, null, '0x536ee2273ba6f1c91362fa9fccb4166450fcb7d3');

  let eventsWith = await exchangeContract.queryFilter(filter);
  console.log("=====ETH LOGS=====", eventsWith);

  const abiCoder = ethers.utils.defaultAbiCoder;
  const logs = abiCoder.decode(["uint256", "uint256", "uint256"], eventsWith[0].data);
  console.log("=====ETH LOGS DECODE=====", logs);
  //   let abi = [
  //     {
  //       "anonymous": false,
  //       "inputs": [
  //         {
  //           "indexed": false,
  //           "internalType": "uint256",
  //           "name": "orderId",
  //           "type": "uint256"
  //         },
  //         {
  //           "indexed": true,
  //           "internalType": "uint256",
  //           "name": "buyTokenIndex",
  //           "type": "uint256"
  //         },
  //         {
  //           "indexed": true,
  //           "internalType": "uint256",
  //           "name": "sellTokenIndex",
  //           "type": "uint256"
  //         },
  //         {
  //           "indexed": false,
  //           "internalType": "uint256",
  //           "name": "saleRate",
  //           "type": "uint256"
  //         },
  //         {
  //           "indexed": true,
  //           "internalType": "address",
  //           "name": "owner",
  //           "type": "address"
  //         },
  //         {
  //           "indexed": false,
  //           "internalType": "uint256",
  //           "name": "expirationBlock",
  //           "type": "uint256"
  //         }
  //       ],
  //       "name": "LongTermOrderPlaced",
  //       "type": "event"
  //     },
  // ];

  // let iface = new ethers.utils.Interface(abi)
  //     eventsWith.forEach((log) => {
  //         console.log(iface.parseLog(log));
  //     });


}

