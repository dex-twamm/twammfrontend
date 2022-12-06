import { BigNumber, Contract, ethers } from "ethers";
import { MAX_UINT256 } from ".";
import { POPUP_MESSAGE, VAULT_CONTRACT_ABI } from "../constants";
import { getProvider } from "./getProvider";
import { POOLS } from "./pool";

export const verifyLongSwap = async (
  swapAmount,
  setLongSwapVerifyLoading,
  srcAddress,
  destAddress,
  setweb3provider,
  setCurrentBlock,
  setBalance,
  setAccount,
  setWalletConnected,
  account,
  setLongSwapFormErrors,
  currentNetwork,
  numberOfBlockIntervals
) => {
  if (swapAmount && numberOfBlockIntervals) {
    setLongSwapVerifyLoading(true);

    const poolConfig = Object.values(POOLS[currentNetwork])[0];

    const errors = {};

    const signer = await getProvider(
      true,
      setweb3provider,
      setCurrentBlock,
      setBalance,
      setAccount,
      setWalletConnected
    );
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
      await getLongSwapEstimatedConvertedToken(
        tokenInIndex,
        tokenOutIndex,
        amountIn,
        numberOfBlockIntervals,
        signer,
        walletAddress,
        (currentNetwork = "Goerli")
      ).then((res) => {
        console.log("Response From Query Batch Swap", res);
        errors.balError = undefined;
        setLongSwapFormErrors(errors ?? "");
        setLongSwapVerifyLoading(false);
      });
    } catch (e) {
      setLongSwapVerifyLoading(false);
      console.log("errororrrrrrrr", typeof e, { ...e });
      if (e.reason) {
        if (e.reason.match("BAL#304")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#304"],
          });
        }
        if (e.reason.match("BAL#347")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#347"],
          });
        }
        if (e.reason.match("BAL#346")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#346"],
          });
        }
        if (e.reason.match("BAL#510")) {
          setLongSwapFormErrors({
            balError: POPUP_MESSAGE["BAL#510"],
          });
        }
        if (e.reason === "underflow") {
          setLongSwapFormErrors({ balError: "Underflow" });
        }
        if (
          e.reason.match("ERC20: transfer amount exceeds allowance") ||
          e.reason.match("allowance")
        ) {
          setLongSwapVerifyLoading(false);
          errors.balError = undefined;
          setLongSwapFormErrors(errors ?? "");
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

export const getLongSwapEstimatedConvertedToken = async (
  tokenInIndex,
  tokenOutIndex,
  amountIn,
  numberOfBlockIntervals,
  signer,
  walletAddress,
  currentNetwork
) => {
  let txHash;

  console.log("Amount in value", amountIn, numberOfBlockIntervals);
  const exchangeContract = new Contract(
    Object.values(POOLS[currentNetwork])[0].VAULT_CONTRACT_ADDRESS,
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

  console.log(
    "aksldalsjdlsjdieuhalsdlas",
    Object.keys(POOLS[currentNetwork])[0],
    walletAddress,
    walletAddress,
    {
      assets: [
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_ONE_ADDRESS,
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_TWO_ADDRESS,
      ],
      maxAmountsIn: [MAX_UINT256, MAX_UINT256],
      fromInternalBalance: false,
      userData: encodedRequest,
    }
  );

  const gasEstimate = await exchangeContract.estimateGas.joinPool(
    Object.keys(POOLS[currentNetwork])[0],
    walletAddress,
    walletAddress,
    {
      assets: [
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_ONE_ADDRESS,
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_TWO_ADDRESS,
      ],
      maxAmountsIn: [MAX_UINT256, MAX_UINT256],
      fromInternalBalance: false,
      userData: encodedRequest,
    }
  );

  console.log("gas estimate price", gasEstimate);

  const placeLtoTx = await exchangeContract.callStatic.joinPool(
    Object.keys(POOLS[currentNetwork])[0],
    walletAddress,
    walletAddress,
    {
      assets: [
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_ONE_ADDRESS,
        Object.values(POOLS?.[currentNetwork])?.[0]?.TOKEN_TWO_ADDRESS,
      ],
      maxAmountsIn: [MAX_UINT256, MAX_UINT256],
      fromInternalBalance: false,
      userData: encodedRequest,
    },
    {
      gasLimit: Math.floor(gasEstimate.toNumber() * 1.2),
    }
  );
  console.log("===LongTerm Placed====", placeLtoTx);
  // txHash = placeLtoTx;
  // setTransactionHash(placeLtoTx.hash);

  // console.log("====Swap Results After Placed=====", await placeLtoTx.wait());
  // console.log(txHash);
  return placeLtoTx;
};
