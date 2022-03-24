import React from "react";
import Decimal from "decimal.js";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
import { bsc, injected } from "./connectorsPromises";
import { formatEther } from "@ethersproject/units";
import { BigNumber, ethers } from "ethers";
import { chain, config, localStorageKey } from "../../appconfig";
import {
  addChainAvax,
  addChainBSC,
  addChainMatic,
  getMetamaskChain,
  isMetamask,
} from "../../utils/metamask";
import { wait } from "../../utils/wait";
import usePrev from "../../hooks/usePrev";

export type WalletStatus = "connected" | "connecting" | "disconnected";

export interface WalletContextValue {
  name: string;
  account: string | null | undefined;
  address: string | null | undefined;
  balance: string;
  chainId: number;
  reset: () => void;
  connect: (connectorName: string, chain: number) => Promise<void>;
  error: any;
  status: WalletStatus;
  library: Web3Provider | undefined;
  provider: Web3Provider | undefined; 
  providerError: Error | undefined;
  ether: Web3Provider | JsonRpcProvider | undefined;
  rawBalance?: BigNumber;
  etherSymbol: string;
}

export const WalletContext = React.createContext<WalletContextValue>({} as any);

export const setupNetwork = async (chainId: number) => {
  const provider = (window as any).ethereum;
  if (provider && isMetamask()) {
    try {
      switch (chainId) {
        case chain.bep: {
          await addChainBSC();
          return true;
        }
        case chain.polygon: {
          await addChainMatic();
          return true;
        }
        case chain.avax: {
          await addChainAvax();
          return true;
        }
      }
      return false;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    }
  } else {
    // eslint-disable-next-line no-console
    console.error(
      `Can't setup the network id ${chainId} on metamask because window.ethereum is undefined`
    );
    return false;
  }
};

function WalletProvider(props: { children?: React.ReactNode }) {
  const { children } = props;


  const [balance, setBalance] = React.useState("");

  const [etherSymbol, setEtherSymbol] = React.useState("");

  const [rawBalance, setRawBalance] = React.useState<BigNumber | undefined>(
    undefined
  );

  const [name, setName] = React.useState("");

  const [error, setError] = React.useState<any>(null);

  const [status, setStatus] = React.useState<WalletStatus>("disconnected");

  const [provider, setProvider] = React.useState<
    Web3Provider | JsonRpcProvider | undefined
  >();

  const context = useWeb3React<Web3Provider>();

  const prevStatus = usePrev(status);

  const {
    chainId = chain.bep,
    connector,
    deactivate,
    activate,
    library,
    error: providerError,
    account, 
  } = context;

  React.useEffect(() => {
    switch (chainId) {
      case chain.bep: {
        setEtherSymbol("BNB");
        break;
      }
      case chain.polygon: {
        setEtherSymbol("MATIC");
        break;
      }
      case chain.avax: {
        setEtherSymbol("AVAX");
        break;
      }
      default: {
        setEtherSymbol("ETH");
      }
    }
  }, [chainId]);

  React.useEffect(() => {
    if (account && library) {
      library?.getBalance(account).then((balance) => {
        const decimalNumber = new Decimal(formatEther(balance));
        setBalance(decimalNumber.toFixed(2));
        setRawBalance(balance);
      });
      setProvider(new ethers.providers.Web3Provider(library.provider));
    } else {
      setBalance("");
      setRawBalance(undefined);
      setProvider(undefined);

      switch (chainId) {
        case chain.bep: {
          setProvider(new JsonRpcProvider(config.BSC_RPC_URL, chain.bep));
          break;
        }
        case chain.polygon: {
          setProvider(
            new JsonRpcProvider(config.POLYGON_RPC_URL, chain.polygon)
          );
          break;
        }
        case chain.avax: {
          setProvider(new JsonRpcProvider(config.AVAX_RPC_URL, chain.avax));
          break;
        }
      }
    }
  }, [account, chainId, library]);

  const reset = React.useCallback(() => {
    if (connector && (connector as any).close) {
      (connector as any).close();
    }
    deactivate();
    setStatus("disconnected");
    setError("");
    setName("");
  }, [connector, deactivate]);

  const connect = React.useCallback(
    async (connectorName: string, chainId: number) => {
      try {
        reset();
        setStatus("connecting");
        let connector;
        switch (connectorName) {
          case "bsc": {
            // when the app first load, BSC wallet haven't loaded so better wait a bit
            await wait(500);
            connector = await bsc(chainId);
            break;
          }
          default:
            connector = await injected(chainId);
        }
        await activate(connector, undefined, true);

        setName(connectorName || "injected");
        setStatus("connected");

        localStorage.setItem(
          localStorageKey.lastWallet,
          connectorName || "injected"
        );
        localStorage.setItem(localStorageKey.lastChainId, chainId.toString());
      } catch (e) {
        if (e instanceof UnsupportedChainIdError) {
          if (chainId !== chain.erc) {
            const hasSetup = await setupNetwork(chainId);
            await wait(1000);
            if (hasSetup && getMetamaskChain() === chainId) {
              try {
                setStatus("connecting");
                await connect(connectorName, chainId);
                setStatus("connected");
                setName("injected");
                setError(undefined);
                return;
              } catch (e) {
                setName("");
                setError(e);
                setStatus("disconnected");
                return;
              }
            }
          } else {
           
          }
        }
        setName("");
        setError(e);
        setStatus("disconnected");
      }
    },
    [activate, reset, ]
  );

  React.useEffect(() => {
    if (status === "disconnected" && prevStatus === "connected") {
      localStorage.removeItem(localStorageKey.lastWallet);
      localStorage.removeItem(localStorageKey.lastChainId);
    }
  }, [status, prevStatus]);

  React.useEffect(() => {
    let cb: ReturnType<typeof setInterval>;

    if (account && library) {
      cb = setInterval(() => {
        library?.getBalance(account).then((balance) => {
          const decimalNumber = new Decimal(formatEther(balance));
          setBalance(decimalNumber.toFixed(2));
          setRawBalance(balance);
        });
      }, 10000);
    } else {
      setBalance("");
      setRawBalance(undefined);
    }

    return () => {
      if (cb) {
        clearInterval(cb);
      }
    };
  }, [account, library]);


  React.useEffect(() => {
    const lastWallet = localStorage.getItem(localStorageKey.lastWallet);
    if (
      !account &&
      status === "disconnected" &&
      prevStatus === undefined &&
      lastWallet
    ) {
      try {
        const lastChainId = parseInt(
          localStorage.getItem(localStorageKey.lastChainId) || ""
        );

        localStorage.removeItem(localStorageKey.lastWallet);

        connect(lastWallet, lastChainId).catch(() => {
          localStorage.removeItem(localStorageKey.lastWallet);
          localStorage.removeItem(localStorageKey.lastChainId);
        });
      } catch (e) {
        localStorage.removeItem(localStorageKey.lastWallet);
        localStorage.removeItem(localStorageKey.lastChainId);
      }
    }
  }, [connect, account, status, prevStatus, chainId]);

  return (
    <WalletContext.Provider
      value={{
        rawBalance,
        name,
        account,
        address:account,
        chainId: chainId || chain.bep,
        reset,
        connect,
        balance,
        error,
        status,
        library,
        provider:library,
        providerError,
        ether: provider,
        etherSymbol,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export default WalletProvider;
