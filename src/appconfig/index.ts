 

export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/olympus-graph";
export const EPOCH_INTERVAL = 2200;



export enum APPFEATURES{
  SWAP,
  STAKEANDSWAP,
  DASHBOARD,
}


// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 13.14;

export const TOKEN_DECIMALS = 9;
const PARTNER = "codejacks";
const SLIPPAGE = 1;  
export const APPTYPE : APPFEATURES = APPFEATURES.SWAP; 
export const BASE_TOKEN="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; 
export const REACT_APP_SUPPORTED_CHAINID=56;

 
export enum SupportedChainId {
  BSC = 56,
  MATIC = 137,
  AVAX = 43114,
}


export enum NetworkId {
 // MAINNET = 1,
 // TESTNET_RINKEBY = 4, 

  POLYGON = 137,
  POLYGON_TESTNET = 80001,

  FANTOM = 250,
  FANTOM_TESTNET = 4002,

  AVALANCHE_FUJI_TESTNET = 43113,
  AVALANCHE_MAINNET = 43114,

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
/*
export const ADD_NETWORK_PARAMS: {
  [chainId in ChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com'],
  },
  [ChainId.MATIC]: {
    chainId: '0x89',
    chainName: 'Polygon',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon.dmm.exchange/v1/mainnet/geth?appId=prod-dmm'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  [ChainId.BSCMAINNET]: {
    chainId: '0x38',
    chainName: 'BSC',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc.dmm.exchange/v1/mainnet/geth?appId=prod-dmm-interface'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  [ChainId.AVAXMAINNET]: {
    chainId: '0xA86A',
    chainName: 'Avalanche',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://avalanche.dmm.exchange/v1/mainnet/geth?appId=prod-dmm'],
    blockExplorerUrls: ['https://snowtrace.io'],
  },
  [ChainId.FANTOM]: {
    chainId: '0xFA',
    chainName: 'FANTOM',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ftm.tools'],
    blockExplorerUrls: ['https://ftmscan.com'],
  },
  [ChainId.CRONOS]: {
    chainId: '0x19',
    chainName: 'Cronos',
    nativeCurrency: {
      name: 'CRO',
      symbol: 'CRO',
      decimals: 18,
    },
    rpcUrls: ['https://evm-cronos.crypto.org'],
    blockExplorerUrls: ['https://cronos.crypto.org/explorer'],
  },

  [ChainId.ARBITRUM]: {
    chainId: '0xa4b1',
    chainName: 'Arbitrum',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  [ChainId.BTTC]: {
    chainId: '0xc7',
    chainName: 'BitTorrent',
    nativeCurrency: {
      name: 'BTT',
      symbol: 'BTT',
      decimals: 18,
    },
    rpcUrls: ['https://bttc.dev.kyberengineering.io'],
    blockExplorerUrls: ['https://bttcscan.com'],
  },
  [ChainId.VELAS]: {
    chainId: '0x6a',
    chainName: 'Velas',
    nativeCurrency: {
      name: 'VLX',
      symbol: 'VLX',
      decimals: 18,
    },
    rpcUrls: ['https://evmexplorer.velas.com/rpc'],
    blockExplorerUrls: ['https://evmexplorer.velas.com/'],
  },
}
*/

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
  4: {
    chainName: "Rinkeby Testnet",
    chainId: 4,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [""],
    blockExplorerUrls: ["https://rinkeby.etherscan.io/#/"], 
  }, 
  43113: {
    chainName: "Avalanche Fuji Testnet",
    chainId: 43113,
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
    },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc/"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/#/"], 
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
  
};


export interface Config {
  BSC_RPC_URL: string;
  POLYGON_RPC_URL: string;
  AVAX_RPC_URL: string;
  PANCAKE_ROUTER: string;
  QUICK_SWAP_ROUTER: string;
  TRADER_JOE_ROUTER: string;
  PANCAKE_CODE_HASH: string;
  QUICK_SWAP_CODE_HASH: string;
  TRADER_JOE_CODE_HASH: string;
  PUBLIC_URL: string;
}

const config: Config = {
  BSC_RPC_URL: process.env.REACT_APP_BSC_RPC_URL as string,
  POLYGON_RPC_URL: process.env.POLYGON_RPC_URL as string,
  AVAX_RPC_URL: process.env.REACT_APP_AVAX_RPC_URL as string,
  PANCAKE_ROUTER: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  QUICK_SWAP_ROUTER: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
  TRADER_JOE_ROUTER: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
  PANCAKE_CODE_HASH:
    "0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5",
  QUICK_SWAP_CODE_HASH:
    "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
  TRADER_JOE_CODE_HASH:
    "0x0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91",
  PUBLIC_URL: process.env.PUBLIC_URL + "/" || "/",
};
 

const erc = parseInt(process.env.REACT_APP_ERC_CHAIN || "1", 10);
const bep = parseInt(process.env.REACT_APP_BEP_CHAIN || "56", 10);
const polygon = parseInt(process.env.REACT_APP_POLYGON_CHAIN || "137", 10);
const avax = parseInt(process.env.REACT_APP_AVAX_RPC_URL || "43114", 10);

const chain = {
  erc: isNaN(erc) ? 1 : erc,
  bep: isNaN(bep) ? 56 : bep,
  polygon: isNaN(polygon) ? 137 : polygon,
  avax: isNaN(avax) ? 43114 : avax,
};
 
 

export const ROUTERS: { [chainId: number]: string } = {
  [SupportedChainId.BSC]: config.PANCAKE_ROUTER,
  [SupportedChainId.MATIC]: config.QUICK_SWAP_ROUTER,
  [SupportedChainId.AVAX]: config.TRADER_JOE_ROUTER,
};



export { config,chain };