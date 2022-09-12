import { Contract, ethers } from "ethers";
import { TWAMM_POOL_ABI } from "../constants";

export async function getEthLogs(signer) {

  const exchangeContract = new Contract(
    '0x40e1fB58aBbd319dB35964eA73e148919Ed0Ae51',
    TWAMM_POOL_ABI,
    signer
  );

  let filter = exchangeContract.filters.LongTermOrderPlaced(null, null, null, null, '0x536ee2273ba6f1c91362fa9fccb4166450fcb7d3');

  let eventsWith = await exchangeContract.queryFilter(filter);
  console.log("=====ETH LOGS=====", eventsWith);

  console.log("==== Amount In ====", ethers.utils.formatUnits(eventsWith[0].topics[1], "ether"))
  console.log("==== Amount Out ====", ethers.utils.formatUnits(eventsWith[0].topics[2], "ether"))



  const abiCoder = ethers.utils.defaultAbiCoder;
  const eventDecoded = [];
  console.log("==== Event Decoded  ==== ", typeof eventDecoded);
  for (let i = 0; i < eventsWith.length; i++) {
    const logs = abiCoder.decode(["uint256", "uint256", "uint256"], eventsWith[i].data);
    eventDecoded.push({
      'orderId': logs[0],
      'salesRate': logs[1],
      'expirationBlock': logs[2],

    });
    console.log("=== ETH Logs Decoded ===", logs)
  }

  // console.log("=== ETH Logs Decoded ===", eventDecoded.map((item) => item))


  return ({ eventsWith, eventDecoded });





}

