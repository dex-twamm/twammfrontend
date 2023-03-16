import { SelectedNetworkType } from "../providers/context/NetworkProvider";
import { timeDeltaString } from "../utils";
import { getPoolBlockInterval } from "../utils/poolUtils";

interface ValueLabelReturnType {
  executionTime: string;
  targetDate: string;
}

const valueLabel = (
  value: number,
  currentBlock: any,
  currentNetwork: SelectedNetworkType
): ValueLabelReturnType => {
  const blockInterval = getPoolBlockInterval(currentNetwork);

  let currentBlockNumber: number = currentBlock?.number || 0;

  if (!blockInterval)
    throw new Error("Could not find block interval in current network!");

  const numBlocks: number =
    Math.ceil(value) * blockInterval +
    (currentBlockNumber % blockInterval
      ? blockInterval - (currentBlockNumber % blockInterval)
      : 0);

  let targetDate: Date;
  if (currentBlock?.timestamp) {
    targetDate = new Date(currentBlock.timestamp * 1000);
  } else {
    targetDate = new Date();
  }

  targetDate.setSeconds(targetDate.getSeconds() + numBlocks * 12);

  const timeString: string = timeDeltaString(
    (targetDate.getTime() - new Date().getTime()) / 1000
  );

  const values: ValueLabelReturnType = {
    executionTime: timeString,
    targetDate: `${targetDate.toLocaleString()}`,
  };
  return values;
};

const calculateNumBlockIntervals = (sliderValue: number): number => {
  return Math.floor(Math.pow(2, sliderValue));
};

export { valueLabel, calculateNumBlockIntervals };
