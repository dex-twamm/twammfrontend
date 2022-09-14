import { Contract, ethers } from "ethers";
import { TWAMM_POOL_ABI } from "../constants";

export async function getEthLogs(signer, walletAddress) {

  const exchangeContract = new Contract(
    '0x40e1fB58aBbd319dB35964eA73e148919Ed0Ae51',
    TWAMM_POOL_ABI,
    signer
  );

  const placedFilter = exchangeContract.filters.LongTermOrderPlaced(null, null, null, null, walletAddress);
  const cancelFilter = exchangeContract.filters.LongTermOrderCancelled(null, null, null, null, walletAddress);
  const withdrawnFilter = exchangeContract.filters.LongTermOrderWithdrawn(null, null, null, null, walletAddress);


  const eventsPlaced = await exchangeContract.queryFilter(placedFilter);
  console.log("=====Placed LOGS=====", eventsPlaced);

  const eventsCancelled = await exchangeContract.queryFilter(cancelFilter);
  console.log("==== Cancelled Logs ====", eventsCancelled);


  const eventsWithdrawn = await exchangeContract.queryFilter(withdrawnFilter);
  console.log("==== Withdrawn Logs ====", eventsWithdrawn);



  // console.log("==== Amount In ====", ethers.utils.formatUnits(eventsPlaced[0].topics[1], "ether"))
  // console.log("==== Amount Out ====", ethers.utils.formatUnits(eventsPlaced[0].topics[2], "ether"))

  const abiCoder = ethers.utils.defaultAbiCoder;
  const eventDecoded = [];
  // console.log("==== Event Decoded  ==== ", typeof eventDecoded);
  for (let i = 0; i < eventsPlaced.length; i++) {
    const logs = abiCoder.decode(["uint256", "uint256", "uint256"], eventsPlaced[i].data);
    eventDecoded.push({
      'orderId': logs[0],
      'salesRate': logs[1],
      'expirationBlock': logs[2],
      'transactionHash': eventsPlaced[i].transactionHash,
      'startBlock': eventsPlaced[i].blockNumber,

    });
    // console.log("=== ETH Logs Decoded ===", eventsPlaced)
  }

  console.log("=== ETH Logs Decoded ===", eventDecoded)


  return (eventDecoded);





}

