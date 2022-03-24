import { useAddress, useWeb3Context } from "../hooks/web3Context";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import staking from "../abi/staking.json";

import { IERC20 } from "../typechain";
import { BigNumber, ethers } from "ethers";
import { BNToEther, toBN } from "../handlers";

import contracts from "../abi/subzero_deployments.json";
import { BASE_TOKEN } from "../appconfig";


export const getTokenPriceInAvax = async (
    tokenAddress: string,
    amount:BigNumber
  ) => { 

     const APIURL = "https://api.1inch.io/v4.0/43114/quote?fromTokenAddress=" + BASE_TOKEN+"&toTokenAddress="+tokenAddress+"&amount="+amount;
    const res = await fetch(APIURL);
    const data = await res.json();
  
    const value = BigNumber.from(data.toTokenAmount);
  
    const value1 = ethers.utils.formatEther(value);
  
    console.log(value1);
  
    return value1;
  };


  
export const getTokenPriceInSz = async (
    tokenAddress: string,
    amount:BigNumber
  ) => { 

     const APIURL = "https://api.1inch.io/v4.0/43114/quote?fromTokenAddress=" +tokenAddress+"&toTokenAddress="+BASE_TOKEN+"&amount="+amount;
    const res = await fetch(APIURL);
    const data = await res.json();
  
    const value = BigNumber.from(data.toTokenAmount);
  
    const value1 = ethers.utils.formatEther(value);
  
    console.log(value1);
  
    return value1;
  };

