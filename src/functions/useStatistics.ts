import { useAddress, useWeb3Context } from "../hooks/web3Context";
import { abi as ierc20Abi } from "../abi/ERC20.json"; 
import { BigNumber, ethers } from "ethers"; 
import contracts from "../abi/deployments.mainnet.json";
import { BigNumber as bn} from 'bignumber.js'


import {
  getBalance,
  getDisplayBalance,
  getFullDisplayBalance,
} from "../utils/formatBalance"; 
 
import ERC20 from "../types/ERC20";
import { parseEther, parseUnits } from "ethers/lib/utils";
import Parse from 'parse';
import { getBestTradeRoute } from "elloswap-sdk";
 
import {  REACT_APP_SUPPORTED_CHAINID,  TOKEN, WETH9,APP_ID } from "../appconfig";


export const getSwaps =async(payValue: any)=>{
       
  const swapParameters = await getBestTradeRoute(REACT_APP_SUPPORTED_CHAINID, WETH9.address, TOKEN.address, new bn(payValue) );

  return swapParameters;
}


export const getSwapPrice =async(earnTokenAdd: string,payValue: any)=>{
       
  const swapParameters = await getBestTradeRoute(REACT_APP_SUPPORTED_CHAINID, WETH9.address, earnTokenAdd, new bn(payValue) );

  return swapParameters;
}




export const getTokenPerSecond = async (
  earnTokenName: string,
  poolContract: ethers.Contract,
  depositTokenName: string
) => {
  const rewardPerSecond = await poolContract.tSharePerSecond();

  return rewardPerSecond.mul(20000).div(45000);
};


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

export const poolStatistics = async (
  provider: any,
  address: any,
  stakingTokenAddress: any,
  depositTokenName: string,
  earnTokenName: string,
  poolContractAddress: any
) => {
  const bombToken = new ethers.Contract(stakingTokenAddress, ierc20Abi, provider);
  const xbombToken = new ethers.Contract(poolContractAddress, contracts.xBOMB.abi, provider);
 

  const xbombExchange = await getXbombExchange(xbombToken);
  const xbombPercent = await xbombExchange;
  const xbombPercentTotal = (Number(xbombPercent) / 1000000000000000000) * 100 - 100;

  const depositTokenPrice = await getDepositTokenPriceInDollars(bombToken.symbol, bombToken);

  const stakeInPool = await bombToken.balanceOf(xbombToken.address);

  const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, bombToken.decimal));
  const startDate = new Date('January 24, 2022');
  const nowDate = new Date(Date.now());
  const difference = nowDate.getTime() - startDate.getTime();
  const days = difference / 60 / 60 / 24 / 1000;
  const aprPerDay = xbombPercentTotal / days;


  const dailyAPR = aprPerDay;
    const yearlyAPR = aprPerDay * 365;

    return {
      dailyAPR: dailyAPR.toFixed(2).toString(),
      yearlyAPR: yearlyAPR.toFixed(2).toString(),
      TVL: TVL.toFixed(2).toString(),
    };
};
 

export const updateBackendForStats = async(apr:string,tvl:string)=> {


   const queryAppConfig: Parse.Query = new Parse.Query('PoolConfig');
  queryAppConfig.equalTo('appId', APP_ID);

  const object: Parse.Object[] = await queryAppConfig.find();

    const json =object[0].toJSON();
    const PoolConfig: Parse.Object  = object[0];
    const saveObject :Parse.Object = PoolConfig.clone();

    saveObject.set(json);  
    saveObject.set('stakingAPY',Number(apr));
    saveObject.set('stakingTvl',Number(tvl));

    saveObject.save(); 
  
}



const getXbombExchange = async(xbombToken: ethers.Contract)=> {
  const XbombExchange = await xbombToken.getExchangeRate();

  const xBombPerBomb = parseFloat(XbombExchange) / 1000000000000000000;
  const xBombRate = xBombPerBomb.toString();
  return parseUnits(xBombRate, 18);
}

const getDepositTokenPriceInDollars= async(symbol: any, bombToken: ethers.Contract)=> {

    let tokenPrice;
 
    tokenPrice = await  getTokenPriceFrom1Inch(bombToken);

   return tokenPrice;
}

const  getWBNBPriceFromPancakeswap = async()=> {

  const usdtAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';
  const wbnbAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';

  const APIURL = "https://api.1inch.io/v4.0/56/quote?fromTokenAddress=" + wbnbAddress + "&toTokenAddress=" + usdtAddress + "&amount=" + parseEther("1.0");
  const res = await fetch(APIURL);
  const data = await res.json();

  const value = BigNumber.from(data.toTokenAmount);

  const value1 = ethers.utils.formatEther(value);

  console.log(value1);

  return value1;
   
}


const  getTokenPriceFrom1Inch = async(bombToken: ethers.Contract)=> {

  const usdtAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';
  const wbnbAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';

  const APIURL = "https://api.1inch.io/v4.0/56/quote?fromTokenAddress=" + bombToken.address  + "&toTokenAddress=" + usdtAddress+ "&amount=" + parseEther("1.0");
  const res = await fetch(APIURL);
  const data = await res.json();

  const value = BigNumber.from(data.toTokenAmount);

  const value1 = ethers.utils.formatEther(value);

  console.log(value1);

  return value1;
   
}