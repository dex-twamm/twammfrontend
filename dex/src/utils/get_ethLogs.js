import { Contract, ethers } from "ethers";
import { TWAMM_POOL_ABI } from "../constants";
import { getLongTermOrder } from "./longSwap";

export async function getEthLogs(signer, walletAddress) {

  const exchangeContract = new Contract(
    '0x20c0b25ace39df183b9ccbbd1d575764544aeb19',
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
      'sellTokenIndex': Number(eventsPlaced[i].topics[2]),
      'buyTokenIndex': Number(eventsPlaced[i].topics[1]),
      'withdrawals': [],
      'hasPartialWithdrawals': false,
      'cancelledProceeds': 0,
      'state': 'inProgress'
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
      'proceeds': log[3],
      'transactionHash': eventsWithdrawn[i].transactionHash,
    })
    orderObject.hasPartialWithdrawals = orderObject.hasPartialWithdrawals || log[4];
    if (!log[4]) {
      orderObject.state = 'completed';
    }
    console.log("=== ETH Logs Withdrawn ===", eventsWithdrawn)
  }

  for (let i = 0; i < eventsCancelled.length; i++) {
    const log = abiCoder.decode(["uint256", "uint256", "uint256", "uint256", "uint256"], eventsCancelled[i].data);
    console.log("Log Cancelled", log);
    let orderObject = placedEventsDecoded.get(log[0].toNumber());
    console.log("Order Object", orderObject);
    orderObject.unsoldAmount = log[4];
    orderObject.convertedValue = log[3];
    orderObject.state = 'cancelled';
    orderObject.withdrawals.push({
      'blockNumber': eventsCancelled[i].blockNumber,
      'isPartialWithdrawal': false,
      'proceeds': log[3],
      'transactionHash': eventsCancelled[i].transactionHash,
    })
    console.log("=== ETH Logs Cancelled ===", eventsCancelled)
  }

  // console.log("=== WithDr Logs Decoded ===", placedEventsDecoded)



  return (placedEventsDecoded);





}

