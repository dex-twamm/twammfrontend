import { ethers } from "ethers";
import React from "react";

export const truncateAddress = (address) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export const toHex = (num) => {
  const val = Number(num);
  return "0x" + val.toString(16);

};


export const MAX_UINT256 = ethers.constants.MaxUint256;
export const ZERO = ethers.constants.Zero;

export const POOL_ID =
  "0x40e1fb58abbd319db35964ea73e148919ed0ae5100020000000000000000010a";

export const MATIC_TOKEN_ADDRESS = "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae";
export const FAUCET_TOKEN_ADDRESS = "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc";
export const OWNER_ADDRESS = "0x51Ac1DB1A27Ec7CD51a21523a935b26ad53DBEb7";