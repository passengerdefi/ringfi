
import { Token } from "@uniswap/sdk-core";

import { bscPools } from './bsc_pools'
export const APP_ID: number = 5601;
export const APP_REST_KEY: string = "f0rhgO7LRqLgkPPvcxT6FCL53hSGYjnlBWuWkSFfrZHVYoLN8UmKCuiQQPkDbltn";
export const REACT_APP_PARSE_APPLICATION_ID: string = "7fQoav9Cet578x3JRzGyc3846jzs2C2Sj3GieCGR"
export const REACT_APP_PARSE_JAVASCRIPT_KEY: string = "kVOoz1N9FYSenWzK1wpY2CtJZuD0BJmxaavp32Ue"
export const REACT_APP_PARSE_LIVE_QUERY_URL: string = "https://parseapi.back4app.com"

export const REACT_APP_SUPPORTED_CHAINID = 56;



export enum NetworkId {
  MAINNET = 1,
  // TESTNET_RINKEBY = 4, 

  POLYGON = 137,
  //POLYGON_TESTNET = 80001,

  FANTOM = 250,
  // FANTOM_TESTNET = 4002,

  AVALANCHE_FUJI_TESTNET = 43113,
  // AVALANCHE_MAINNET = 43114,

  BSCMAINNET = 56,
  
  Localhost = 1337,
}


interface IAddresses {
  [key: number]: { [key: string]: string };
}

/**
 * Network details required to add a network to a user's wallet, as defined in EIP-3085 (https://eips.ethereum.org/EIPS/eip-3085)
 */

interface INativeCurrency {
  name: string;
  symbol: string;
  decimals?: number;
}

interface INetwork {
  chainName: string;
  chainId: number;
  nativeCurrency: INativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export declare enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  MATIC = 137,
  MUMBAI = 80001,
  BSCTESTNET = 97,
  BSCMAINNET = 56,
  AVAXTESTNET = 43113,
  AVAXMAINNET = 43114,
  FANTOM = 250,
  CRONOSTESTNET = 338,
  CRONOS = 25,
  ARBITRUM = 42161,
  ARBITRUM_TESTNET = 421611,
  BTTC = 199,
  VELAS = 106
} 

export const NETWORKS: { [key: number]: INetwork } = {
  1: {
    chainName: "Ethereum",
    chainId: 1,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [""],
    blockExplorerUrls: ["https://etherscan.com/#/"],
  },
  43114: {
    chainName: "Avalanche",
    chainId: 43114,
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc/"],
    blockExplorerUrls: ["https://snowtrace.io/#/"],
  },
  137: {
    chainName: "Polygon",
    chainId: 137,
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
    },
    rpcUrls: ["https://polygon-mainnet.infura.io/v3/1030b8cbec174e90a95d512d970c2a0e"],
    blockExplorerUrls: ["https://polygonscan.com/#/"],
  },
  56: {
    chainId: 56,
    chainName: 'BSC',
    nativeCurrency: {
      name: 'BSC Mainnet',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com'],
  },

  250: {
    chainId: 250,
    chainName: 'Fantom',
    nativeCurrency: {
      name: 'Fantom Mainnet',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ftm.tools/'],
    blockExplorerUrls: ['https://ftmscan.com'],
  },

};



export const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
export const WMATIC = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
export const WBNB = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
export const WAVAX = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'
export const WFTM = '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'
export const WCRO = '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23'


export const TOKEN = new Token(
  REACT_APP_SUPPORTED_CHAINID,
  '0x021988d2c89b1A9Ff56641b2F247942358FF05c9',
  18,
  'RING',
  'RING'
);
export const WETH9 = new Token(
  REACT_APP_SUPPORTED_CHAINID,
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  18,
  'WBNB',
  'WBNB'
);

export const PEG = new Token(
  REACT_APP_SUPPORTED_CHAINID,
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  18,
  'BNB',
  'BNB'
);


export const SWAP_SRC = PEG.address;
export const SWAP_DEST = TOKEN.address;
export const MINSLIPPAGE = 10;
export const SWAPFEES = 0;
export const FEEWALLET = '0x9d8E02bF06C33403FaaFB357588AA30A1131E6A8';




