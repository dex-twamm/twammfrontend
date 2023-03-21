import { Contract, ethers } from "ethers";
import { TWAMM_POOL_ABI } from "../constants";
import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import {
  ORDER_LOG_STATE_CANCELLED,
  ORDER_LOG_STATE_COMPLETED,
  ORDER_LOG_STATE_INPROGRESS,
} from "./constants";
import { getLongTermOrder } from "./longSwap";
import { getPoolContractAddress } from "./poolUtils";

type SignerOrProvider = ConstructorParameters<typeof Contract>[2];

export async function getEthLogs(
  signer: SignerOrProvider,
  walletAddress: string,
  currentNetwork: SelectedNetworkType
) {
  //q:get type of third argument of contract constructor
  const poolContract = new Contract(
    getPoolContractAddress(currentNetwork),
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
      ["uint256", "uint256", "uint256", "uint256", "uint256"],
      eventsPlaced[i].data
    );
    const orderDetails = await getLongTermOrder(signer, log[0], currentNetwork);
    placedEventsDecoded.set(log[0].toNumber(), {
      orderId: log[0],
      salesRate: log[3],
      expirationBlock: log[4],
      transactionHash: eventsPlaced[i].transactionHash,
      startBlock: eventsPlaced[i].blockNumber,
      convertedValue: orderDetails[6],
      sellTokenIndex: log[2],
      buyTokenIndex: log[1],
      withdrawals: [],
      hasPartialWithdrawals: false,
      cancelledProceeds: 0,
      state: ORDER_LOG_STATE_INPROGRESS,
    });
  }

  for (let i = 0; i < eventsWithdrawn.length; i++) {
    const log = abiCoder.decode(
      [
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "bool",
      ],
      eventsWithdrawn[i].data
    );
    let orderObject = placedEventsDecoded.get(log[0].toNumber());
    orderObject.withdrawals.push({
      blockNumber: eventsWithdrawn[i].blockNumber,
      isPartialWithdrawal: log[6],
      proceeds: log[5],
      transactionHash: eventsWithdrawn[i].transactionHash,
    });
    orderObject.hasPartialWithdrawals =
      orderObject.hasPartialWithdrawals || log[6];
    if (!log[6]) {
      orderObject.state = ORDER_LOG_STATE_COMPLETED;
    }
  }

  for (let i = 0; i < eventsCancelled.length; i++) {
    const log = abiCoder.decode(
      [
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
      ],
      eventsCancelled[i].data
    );
    let orderObject = placedEventsDecoded.get(log[0].toNumber());
    orderObject.unsoldAmount = log[6];
    orderObject.convertedValue = log[5];
    orderObject.state = ORDER_LOG_STATE_CANCELLED;
    orderObject.withdrawals.push({
      blockNumber: eventsCancelled[i].blockNumber,
      isPartialWithdrawal: false,
      proceeds: log[5],
      transactionHash: eventsCancelled[i].transactionHash,
    });
  }
  return placedEventsDecoded;
}
