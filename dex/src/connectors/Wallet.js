// import { web3Modal } from "./ProviderOptions";
// import { ethers } from "ethers";
// export const connectWallet = async () => {
//   try {
//     const provider = await web3Modal.connect();
//     const library = new ethers.providers.Web3Provider(provider);
//     const accounts = await library.listAccounts();
//     console.log(accounts);
//     console.log(library);
//     return library;
//   } catch (error) {
//     console.log(error);
//   }
// };

// // export const getBalance = async () => {
// //   try {
    // const addressWallet = await library.provider.selectedAddress;
    // const walletBalance = await library.getBalance(addressWallet);
    // const ethBalance = ethers.utils.formatEther(walletBalance);
    // const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
// //     return humanFriendlyBalance;
// //   } catch (error) {
// //     console.log(error);
// //   }
// // };
