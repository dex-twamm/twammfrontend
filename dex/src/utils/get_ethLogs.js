import { Contract, ethers } from "ethers";
import { TWAMM_POOL_ABI } from "../constants";
import { getLongTermOrder } from "./longSwap";

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
  const placedEventsDecoded = new Map();
  // console.log("==== Event Decoded  ==== ", typeof eventDecoded);
  for (let i = 0; i < eventsPlaced.length; i++) {
    const log = abiCoder.decode(["uint256", "uint256", "uint256"], eventsPlaced[i].data);
    console.log("Log 0", log[0]);
    const orderDetails = await getLongTermOrder(signer, log[0])
    placedEventsDecoded.set(log[0].toNumber(), {
      'orderId': log[0],
      'salesRate': log[1],
      'expirationBlock': log[2],
      'transactionHash': eventsPlaced[i].transactionHash,
      'startBlock': eventsPlaced[i].blockNumber,
      'convertedValue': orderDetails[6],
      'sellTokenIndex': orderDetails[4],
      'buyTokenIndex': orderDetails[5],
      'withdrawals': []
    });
    // console.log("=== ETH Logs Decoded ===", eventsPlaced)
  }
  console.log("=== ETH Logs Decoded ===", placedEventsDecoded);


  for (let i = 0; i < eventsWithdrawn.length; i++) {
    const log = abiCoder.decode(["uint256", "uint256", "uint256", "uint256", "bool"], eventsWithdrawn[i].data);
    console.log("Log Withdrawn", log);
    let orderObject = placedEventsDecoded.get(log[0].toNumber());
    console.log("Order Object", orderObject);
    orderObject.withdrawals.push({
      'blockNumber': eventsWithdrawn[i].blockNumber,
      'isPartialWithdrawal': log[4],
      'proceeds': log[3]
    })
    console.log("=== ETH Logs Withdrawn ===", eventsWithdrawn)
  }

  for (let i = 0; i < eventsCancelled.length; i++) {
    const log = abiCoder.decode(["uint256", "uint256", "uint256", "uint256", "uint256"], eventsCancelled[i].data);
    console.log("Log Withdrawn", log);
    let orderObject = placedEventsDecoded.get(log[0].toNumber());
    console.log("Order Object", orderObject);
    orderObject.unsoldAmount = log[4]
    orderObject.cancelledProceeds = log[3]
    console.log("=== ETH Logs Withdrawn ===", eventsCancelled)
  }

  // console.log("=== WithDr Logs Decoded ===", placedEventsDecoded)



  return (placedEventsDecoded);





}

