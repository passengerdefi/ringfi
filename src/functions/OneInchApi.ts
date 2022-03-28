 
import { BigNumber, ethers } from "ethers"; 
 import { BASE_TOKEN } from "../appconfig";


export async function getTokenPriceInbnb(tokenAddress: string,
  amount: BigNumber) {

  const APIURL = "https://api.1inch.io/v4.0/56/quote?fromTokenAddress=" + BASE_TOKEN + "&toTokenAddress=" + tokenAddress + "&amount=" + amount;
  const res = await fetch(APIURL);
  const data = await res.json();

  const value = BigNumber.from(data.toTokenAmount);

  const value1 = ethers.utils.formatEther(value);

  console.log(value1);

  return value1;
}


  
export const getTokenPriceInRaven = async (
    tokenAddress: string,
    amount:BigNumber
  ) => { 

     const APIURL = "https://api.1inch.io/v4.0/56/quote?fromTokenAddress=" +tokenAddress+"&toTokenAddress="+BASE_TOKEN+"&amount="+amount;
    const res = await fetch(APIURL);
    const data = await res.json();
  
    const value = BigNumber.from(data.toTokenAmount);
  
    const value1 = ethers.utils.formatEther(value);
  
    console.log(value1);
  
    return value1;
  };

