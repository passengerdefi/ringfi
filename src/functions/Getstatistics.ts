import { useAddress, useWeb3Context } from "../hooks/web3Context";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import staking from "../abi/staking.json"; 
import { BigNumber, ethers } from "ethers"; 
import contracts from "../abi/subzero_deployments.json";
 

import {
  getBalance,
  getDisplayBalance,
  getFullDisplayBalance,
} from "../utils/formatBalance"; 
import { Fetcher, Route, Token } from "@traderjoe-xyz/sdk";
import { 
  REACT_APP_SUPPORTED_CHAINID,
} from "../appconfig";
import ERC20 from "./ERC20";

export const tokenBalance = async (
  provider: any,
  address: any,
  stakingTokenAddress: any
) => {
  const tokenContract = new ethers.Contract(
    stakingTokenAddress,
    ierc20Abi,
    provider
  );
  const userBalance = await tokenContract.balanceOf(address);
  return userBalance;
};




export const userAllowance = async (
  provider: any,
  address: any,
  stakingTokenAddress: any,
  poolContractAddress: any
) => {
  const tokenContract = new ethers.Contract(
    stakingTokenAddress,
    ierc20Abi,
    provider
  );
  const userAllowance = await tokenContract.allowance(
    address,
    poolContractAddress
  );
  return userAllowance;
};
 
export const getTokenPriceInDollars = async (
  stakingTokenAddress: string
) => {
  const APIURL = "https://api.traderjoexyz.com/priceusd/" + stakingTokenAddress;
  const res = await fetch(APIURL);
  const data = await res.json();

  const value = BigNumber.from(data.toString());

  const value1 = ethers.utils.formatEther(value);

  console.log(value1);

  return value1;
};


export const getTokenPriceInAvax = async (
  stakingTokenAddress: string
) => {
  const APIURL = "https://api.traderjoexyz.com/priceavax/" + stakingTokenAddress;
  const res = await fetch(APIURL);
  const data = await res.json();

  const value = BigNumber.from(data.toString());

  const value1 = ethers.utils.formatEther(value);

  console.log(value1);

  return value1;
};
 