import { BigNumber } from "ethers";
import { createContext, useState } from "react";

export const ShortSwapProvider = ({ children }) => {
  const [swapAmount, setSwapAmount] = useState(0);
  const [srcAddress, setSrcAddress] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [equivalentAmount, setEquivalentAmount] = useState("");
  const [networkId, setNetworkId] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState();
  const [tokenBalances, setTokenBalances] = useState(0);
  const [transactionHash, setTransactionHash] = useState();
  const [selectToken, setSelectToken] = useState("");
  const [ethBalance, setEthBalance] = useState("");
  const [poolCash, setPoolCash] = useState("");
  const [account, setAccount] = useState("");
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [orderId, setOrderId] = useState();
  const [expectedSwapOut, setExpectedSwapOut] = useState(0);
  const [tolerance, setTolerance] = useState(0.5);
  const [deadline, setDeadline] = useState(30);
  const [formErrors, setFormErrors] = useState({});
  const [web3provider, setweb3provider] = useState();
  const [currentBlock, setCurrentBlock] = useState();
  const [spotPrice, setSpotPrice] = useState(0);
  const [LPTokenBalance, setLPTokenBalance] = useState([]);
  // const [provider, setProvider] = useState("");
  const [balance, setBalance] = useState();

  return (
    <ShortSwapContext.Provider
      value={{
        swapAmount,
        setSwapAmount,
        equivalentAmount,
        setEquivalentAmount,
        srcAddress,
        setSrcAddress,
        destAddress,
        setDestAddress,
        networkId,
        setNetworkId,
        error,
        setError,
        setLoading,
        loading,
        success,
        setSuccess,
        tokenBalances,
        setTokenBalances,
        transactionHash,
        setTransactionHash,
        selectToken,
        setSelectToken,
        ethBalance,
        setEthBalance,
        poolCash,
        setPoolCash,
        account,
        setAccount,
        isWalletConnected,
        setWalletConnected,
        orderId,
        setOrderId,
        expectedSwapOut,
        setExpectedSwapOut,
        tolerance,
        setTolerance,
        deadline,
        setDeadline,
        formErrors,
        setFormErrors,
        web3provider,
        setweb3provider,
        currentBlock,
        setCurrentBlock,
        spotPrice,
        setSpotPrice,
        LPTokenBalance,
        setLPTokenBalance,
        balance,
        setBalance,
      }}
    >
      {children}
    </ShortSwapContext.Provider>
  );
};

export const ShortSwapContext = createContext(null);
