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
import {
  Fetcher as FetcherSpirit,
  Token as TokenSpirit,
} from "@traderjoe-xyz/sdk";
import { Fetcher, Route, Token } from "@traderjoe-xyz/sdk";
import {
  pegTokenAddress,
  pegTokenD,
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

export const poolStatistics = async (
  provider: any,
  address: any,
  stakingTokenAddress: any,
  depositTokenName: string,
  earnTokenName: string,
  poolContractAddress: any
) => {
  const TOMB = new ethers.Contract(stakingTokenAddress, ierc20Abi, provider);

  const poolContract = new ethers.Contract(
    poolContractAddress,
    staking,
    provider
  );

  const depositTokenPrice = await getTokenPriceInDollars(
    stakingTokenAddress
  );

  console.log(depositTokenPrice);

  const stakeInPool = await TOMB.balanceOf(poolContractAddress);

  const TVL =
    Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, 18));

  const stat =
    earnTokenName === "SUBZERO"
      ? await getTombStat(TOMB, provider)
      : await getShareStat(TOMB, provider);

  const tokenPerSecond = await getTokenPerSecond(
    earnTokenName,
    poolContract,
    depositTokenName
  );

  console.log("0x0240cc28ce98e3");
  console.log(tokenPerSecond);

  const tokenPerHour = tokenPerSecond.mul(60).mul(60);
  const totalRewardPricePerYear =
    Number(stat.priceInDollars) *
    Number(getDisplayBalance(tokenPerHour.mul(24).mul(365)));
  const totalRewardPricePerDay =
    Number(stat.priceInDollars) *
    Number(getDisplayBalance(tokenPerHour.mul(24)));
  const totalStakingTokenInPool =
    Number(depositTokenPrice) *
    Number(getDisplayBalance(stakeInPool, TOMB.decimal, 8));
  const dailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;
  const yearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;

  console.log(tokenPerSecond);
  console.log(stakeInPool);
  console.log(TVL);

  console.log(tokenPerSecond);
  console.log(stakeInPool);
  console.log(TVL);

  return {
    dailyAPR: dailyAPR.toFixed(2).toString(),
    yearlyAPR: yearlyAPR.toFixed(2).toString(),
    TVL: TVL.toFixed(2).toString(),
  };
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

export const getTokenPerSecond = async (
  earnTokenName: string,
  poolContract: ethers.Contract,
  depositTokenName: string
) => {
  const rewardPerSecond = await poolContract.tSharePerSecond();

  return rewardPerSecond.mul(20000).div(45000);
};

export const getTombStat = async (
  tokenContract: ethers.Contract,
  provider: any
) => {
  const TOMB = new ERC20(tokenContract.address, provider, "SUBZERO", 18);

  const supply = await TOMB.totalSupply();

  const tombRewardPoolSupply = await TOMB.balanceOf(
    contracts.TombFtmRewardPool.address
  );
  const tombRewardPoolSupply2 = await TOMB.balanceOf(
    contracts.TombFtmLpTombRewardPool.address
  );
  const tombRewardPoolSupplyOld = await TOMB.balanceOf(
    contracts.TombFtmLpTombRewardPoolOld.address
  );
  const tombCirculatingSupply = supply
    .sub(tombRewardPoolSupply)
    .sub(tombRewardPoolSupply2)
    .sub(tombRewardPoolSupplyOld);

  const priceInFTM = await getTokenPriceFromPancakeswap(TOMB, provider);

  const priceOfOneFTM = await getWFTMPriceFromPancakeswap(provider);
  const priceOfTombInDollars = (
    Number(priceInFTM) * Number(priceOfOneFTM)
  ).toFixed(2);

  return {
    tokenInFtm: priceInFTM,
    priceInDollars: priceOfTombInDollars,
    totalSupply: getDisplayBalance(supply, TOMB.decimal, 0),
    circulatingSupply: getDisplayBalance(
      tombCirculatingSupply,
      TOMB.decimal,
      0
    ),
  };
};

export const getShareStat = async (TOMB: ethers.Contract, provider: any) => {
  const ZShare = new ERC20(contracts.tShare.address, provider, "ZShare", 18);

  const supply = await ZShare.totalSupply();

  const priceInFTM = await getTokenPriceFromPancakeswap(ZShare, provider);
  const tombRewardPoolSupply = await ZShare.balanceOf(
    contracts.SubzeroTombLPZShareRewardPool.address
  );
  const tShareCirculatingSupply = supply.sub(tombRewardPoolSupply);
  const priceOfOneFTM = await getWFTMPriceFromPancakeswap(provider);
  const priceOfSharesInDollars = (
    Number(priceInFTM) * Number(priceOfOneFTM)
  ).toFixed(2);

  return {
    tokenInFtm: priceInFTM,
    priceInDollars: priceOfSharesInDollars,
    totalSupply: getDisplayBalance(supply, ZShare.decimal, 0),
    circulatingSupply: getDisplayBalance(
      tShareCirculatingSupply,
      ZShare.decimal,
      0
    ),
  };
};

export const getTokenPriceFromPancakeswap = async (
  tokenContract: ERC20,
  provider: any
) => {
  const wftm = new Token(
    REACT_APP_SUPPORTED_CHAINID,
    pegTokenAddress,
    pegTokenD
  );

  const token = new Token(
    REACT_APP_SUPPORTED_CHAINID,
    tokenContract.address,
    18,
    tokenContract.symbol
  );

  try {
    const wftmToToken = await Fetcher.fetchPairData(wftm, token, provider);
    const priceInBUSD = new Route([wftmToToken], token);

    return priceInBUSD.midPrice.toFixed(4);
  } catch (err) {
    console.error(
      `Failed to fetch token price of ${tokenContract.symbol}: ${err}`
    );
  }
};

export const getWFTMPriceFromPancakeswap = async (provider: any) => {
  const WFTM = new ERC20(
    "0xb84527d59b6ecb96f433029ecc890d4492c5dce1",
    provider,
    "TOMB",
    18
  );

  const FUSDT = new ERC20(
    "0x5c49b268c9841AFF1Cc3B0a418ff5c3442eE3F3b",
    provider,
    "MAI",
    18
  );

  try {
    const fusdt_wftm_lp_pair = "0xC5b7529f047c5dE306E8D571643551C1c6C36210";
    let ftm_amount_BN = await WFTM.balanceOf(fusdt_wftm_lp_pair);
    let ftm_amount = Number(getFullDisplayBalance(ftm_amount_BN, WFTM.decimal));
    let fusdt_amount_BN = await FUSDT.balanceOf(fusdt_wftm_lp_pair);
    let fusdt_amount = Number(
      getFullDisplayBalance(fusdt_amount_BN, FUSDT.decimal)
    );
    return (fusdt_amount / ftm_amount).toString();
  } catch (err) {
    console.error(`Failed to fetch token price of WTOMB: ${err}`);
  }
};
