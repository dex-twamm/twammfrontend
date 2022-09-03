import { Contract } from "ethers";
import { TWAMM_POOL_ABI } from "../constants";

export async function ethLogs(signer) {

  const exchangeContract = new Contract(
    '0x40e1fB58aBbd319dB35964eA73e148919Ed0Ae51',
    TWAMM_POOL_ABI,
    signer
  );

  let filter = exchangeContract.filters.LongTermOrderPlaced(null, null, null, null, '0x536ee2273ba6f1c91362fa9fccb4166450fcb7d3');

  let eventsWith = await exchangeContract.queryFilter(filter);
  console.log(eventsWith);

}