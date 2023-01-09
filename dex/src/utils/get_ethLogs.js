import { Contract, ethers } from "ethers";
import { TWAMM_POOL_ABI } from "../constants";
import { getLongTermOrder } from "./longSwap";
import { getPoolContractAddress } from "./poolUtils";

export async function getEthLogs(
  signer,
  walletAddress,
  currentNetwork,
  poolNumber
) {
  const poolContract = new Contract(
    getPoolContractAddress(currentNetwork, poolNumber),
    TWAMM_POOL_ABI,
    signer
  );

  const placedFilter = poolContract.filters.LongTermOrderPlaced(
    null,
    null,
    null,
    null,
    walletAddress
  );
  const cancelFilter = poolContract.filters.LongTermOrderCancelled(
    null,
    null,
    null,
    null,
    walletAddress
  );
  const withdrawnFilter = poolContract.filters.LongTermOrderWithdrawn(
    null,
    null,
    null,
    null,
    walletAddress
  );

  const eventsPlaced = await poolContract.queryFilter(placedFilter);

  const eventsCancelled = await poolContract.queryFilter(cancelFilter);

  const eventsWithdrawn = await poolContract.queryFilter(withdrawnFilter);

  const abiCoder = ethers.utils.defaultAbiCoder;
  const placedEventsDecoded = new Map();
  for (let i = 0; i < eventsPlaced.length; i++) {
    const log = abiCoder.decode(
      ["uint256", "uint256", "uint256"],
      eventsPlaced[i].data
    );
    const orderDetails = await getLongTermOrder(
      signer,
      log[0],
      currentNetwork,
      poolNumber
    );
    placedEventsDecoded.set(log[0].toNumber(), {
      orderId: log[0],
      salesRate: log[1],
      expirationBlock: log[2],
      transactionHash: eventsPlaced[i].transactionHash,
      startBlock: eventsPlaced[i].blockNumber,
      convertedValue: orderDetails[6],
      sellTokenIndex: Number(eventsPlaced[i].topics[2]),
      buyTokenIndex: Number(eventsPlaced[i].topics[1]),
      withdrawals: [],
      hasPartialWithdrawals: false,
      cancelledProceeds: 0,
      state: "inProgress",
    });
  }

  for (let i = 0; i < eventsWithdrawn.length; i++) {
    const log = abiCoder.decode(
      ["uint256", "uint256", "uint256", "uint256", "bool"],
      eventsWithdrawn[i].data
    );
    let orderObject = placedEventsDecoded.get(log[0].toNumber());
    orderObject.withdrawals.push({
      blockNumber: eventsWithdrawn[i].blockNumber,
      isPartialWithdrawal: log[4],
      proceeds: log[3],
      transactionHash: eventsWithdrawn[i].transactionHash,
    });
    orderObject.hasPartialWithdrawals =
      orderObject.hasPartialWithdrawals || log[4];
    if (!log[4]) {
      orderObject.state = "completed";
    }
  }

  for (let i = 0; i < eventsCancelled.length; i++) {
    const log = abiCoder.decode(
      ["uint256", "uint256", "uint256", "uint256", "uint256"],
      eventsCancelled[i].data
    );
    let orderObject = placedEventsDecoded.get(log[0].toNumber());
    orderObject.unsoldAmount = log[4];
    orderObject.convertedValue = log[3];
    orderObject.state = "cancelled";
    orderObject.withdrawals.push({
      blockNumber: eventsCancelled[i].blockNumber,
      isPartialWithdrawal: false,
      proceeds: log[3],
      transactionHash: eventsCancelled[i].transactionHash,
    });
  }

  return placedEventsDecoded;
}
