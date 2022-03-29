import { REACT_APP_SUPPORTED_CHAINID } from ".";
import { Token } from "@uniswap/sdk-core";

export const BOMB = new Token(
    REACT_APP_SUPPORTED_CHAINID,
    '0x522348779DCb2911539e76A1042aA922F9C47Ee3',
    18
);
export const WETH9 = new Token(
    REACT_APP_SUPPORTED_CHAINID,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18
);
