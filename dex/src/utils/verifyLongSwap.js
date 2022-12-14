import { BigNumber, Contract, ethers } from "ethers";
import { MAX_UINT256 } from ".";
import { POPUP_MESSAGE, VAULT_CONTRACT_ABI } from "../constants";
import {
  getPoolId,
  getPoolConfig,
  getPoolTokenAddresses,
  getPoolVaultContractAddress,
} from "./poolUtils";

export const verifyLongSwapTxn = async (
  tokenInIndex,
  tokenOutIndex,
  amountIn,
  numberOfBlockIntervals,
  signer,
  walletAddress,
  currentNetwork
) => {
  const vaultContract = new Contract(
    getPoolVaultContractAddress(currentNetwork),
    VAULT_CONTRACT_ABI,
    signer
  );
  const abiCoder = ethers.utils.defaultAbiCoder;
  const encodedRequest = abiCoder.encode(
    ["uint256", "uint256", "uint256", "uint256", "uint256"],
    [
      4,
      tokenInIndex,
      tokenOutIndex,
      amountIn,
      BigNumber.from(numberOfBlockIntervals),
    ]
  );

  const swapData = [
    getPoolId(currentNetwork),
    walletAddress,
    walletAddress,
    {
      assets: getPoolTokenAddresses(currentNetwork),
      maxAmountsIn: [MAX_UINT256, MAX_UINT256],
      fromInternalBalance: false,
      userData: encodedRequest,
    },
  ];

  const gasEstimate = await vaultContract.estimateGas.joinPool(...swapData);

  const placeLtoTx = await vaultContract.callStatic.joinPool(...swapData, {
    gasLimit: Math.floor(gasEstimate.toNumber() * 1.2),
  });
  console.log("===LongTerm Placed====", placeLtoTx);
  return placeLtoTx;
};

export const verifyLongSwap = async (
  swapAmount,
  setLongSwapVerifyLoading,
  srcAddress,
  destAddress,
  web3provider,
  account,
  setLongSwapFormErrors,
  currentNetwork,
  numberOfBlockIntervals
) => {
  if (swapAmount && numberOfBlockIntervals) {
    setLongSwapVerifyLoading(true);

    const poolConfig = getPoolConfig(currentNetwork);

    const errors = {};

    const signer = web3provider.getSigner();
    const walletAddress = account;

    try {
      const tokenInIndex = poolConfig.tokens.findIndex(
        (object) => srcAddress === object.address
      );
      const tokenOutIndex = poolConfig.tokens.findIndex(
        (object) => destAddress === object.address
      );
      const amountIn = ethers.utils.parseUnits(
        swapAmount,
        poolConfig.tokens[tokenInIndex].decimals
      );
      await verifyLongSwapTxn(
        tokenInIndex,
        tokenOutIndex,
        amountIn,
        numberOfBlockIntervals,
        signer,
        walletAddress,
        currentNetwork
      ).then((res) => {
        errors.balError = undefined;
        setLongSwapFormErrors(errors ?? "");
        setLongSwapVerifyLoading(false);
      });
    } catch (e) {
      setLongSwapVerifyLoading(false);
      if (e.reason) {
        if (e.reason.match("BAL#304")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#304"],
          });
        } else if (e.reason.match("BAL#347")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#347"],
          });
        } else if (e.reason.match("BAL#346")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#346"],
          });
        } else if (e.reason.match("BAL#510")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#510"],
          });
        } else if (e.reason.match("underflow")) {
          setLongSwapFormErrors({ balError: "Underflow" });
        } else if (
          e.reason.match("ERC20: transfer amount exceeds allowance") ||
          e.reason.match("allowance")
        ) {
          setLongSwapVerifyLoading(false);
          errors.balError = undefined;
          setLongSwapFormErrors(errors ?? "");
        } else {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE.unknown,
          });
        }
      } else {
        setLongSwapFormErrors({
          balError: POPUP_MESSAGE.unknown,
        });
      }
      setLongSwapVerifyLoading(false);
    }
  }
};
