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



  const abiCoder = ethers.utils.defaultAbiCoder;
  const eventDecoded = [];
  for (let i = 0; i < eventsWith.length; i++) {
    const logs = abiCoder.decode(["uint256", "uint256", "uint256"], eventsWith[i].data);
    eventDecoded.push(logs);
    console.log("=== ETH Logs Decoded ===", logs)
  }



  return eventsWith;





}

