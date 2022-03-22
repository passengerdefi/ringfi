import React, { useEffect, useState, useCallback, useRef } from "react"; 
  import { Button, Center, Container, Title } from '@mantine/core';
import { SegmentedControl } from '@mantine/core';
import Header from './components/Header/Header'; 
import { useLocation} from "react-router-dom";
import { useDispatch } from "react-redux";
import { shouldTriggerSafetyCheck } from "./handlers"; 
import { info } from "./reducers/MessagesSlice"; 
import { useAddress, useWeb3Context } from "./hooks/web3Context";
import { initializeNetwork, switchNetwork } from "./reducers/NetworkSlice";
import { useAppSelector } from "./hooks";
import { loadAppDetails } from "./reducers/AppSlice";
import { EnvHelper } from "./reactors/Environment";
import LoadingSplash from "./components/Loading/LoadingSplash"; 
import { initializeParse } from "@parse/react"; 

import { REACT_APP_PARSE_APPLICATION_ID, REACT_APP_PARSE_LIVE_QUERY_URL, REACT_APP_PARSE_JAVASCRIPT_KEY } from "./appconfig" 
import Stake from "./screens/Stake";
import Swap from "./screens/Swap"; 

// Your Parse initialization configuration goes here
const PARSE_LIVE_QUERY_URL: string = (REACT_APP_PARSE_LIVE_QUERY_URL as string);
const PARSE_APPLICATION_ID: string = (REACT_APP_PARSE_APPLICATION_ID as string);
const PARSE_JAVASCRIPT_KEY: string = (REACT_APP_PARSE_JAVASCRIPT_KEY as string); 

 
initializeParse(
  PARSE_LIVE_QUERY_URL,
  PARSE_APPLICATION_ID,
  PARSE_JAVASCRIPT_KEY
);
 
console.log("Parse Initialized with parameter -",REACT_APP_PARSE_APPLICATION_ID, REACT_APP_PARSE_LIVE_QUERY_URL, REACT_APP_PARSE_JAVASCRIPT_KEY);

function App() {

  const [action, setAction] = useState("stake");
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPath = location.pathname + location.search + location.hash;
  const { connect, hasCachedProvider, provider, connected, chainChanged } = useWeb3Context();
  const address = useAddress();

  const [walletChecked, setWalletChecked] = useState(false);
  const networkId = useAppSelector(state => state.network.networkId);
  const isAppLoading = useAppSelector(state => state.app.loading);
  
  async function loadDetails(whichDetails: string) {
    
    // Unhandled Rejection (Error): call revert exception (method="balanceOf(address)", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.4.0)
    // it's because the initial provider loaded always starts with networkID=1. This causes
    // address lookup on the wrong chain which then throws the error. To properly resolve this,
    // we shouldn't be initializing to networkID=1 in web3Context without first listening for the
    // network. To actually test rinkeby, change setnetworkID equal to 4 before testing.
    let loadProvider = provider;

    if (connected) {
      if (whichDetails === "app") {
        loadApp(loadProvider);
      }

      if (whichDetails === "network") {
        initNetwork(loadProvider);
      } 
    }
  }

  const initNetwork = useCallback(
    loadProvider => {
      dispatch(initializeNetwork({ provider: loadProvider }));
    },
    [networkId],
  );

  const loadApp = useCallback(
    loadProvider => {
      dispatch(loadAppDetails({ networkID: networkId, provider: loadProvider }));
    },
    [networkId],
  );

   // The next 3 useEffects handle initializing API Loads AFTER wallet is checked
  //
  // this useEffect checks Wallet Connection & then sets State for reload...
  // ... we don't try to fire Api Calls on initial load because web3Context is not set yet
  // ... if we don't wait we'll ALWAYS fire API calls via JsonRpc because provider has not
  // ... been reloaded within App.
  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true); 
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
      dispatch(info("Connect your wallet."));
    }
    if (shouldTriggerSafetyCheck()) {
      dispatch(info("Safety Check: Always verify you're on app.passengerdapp.io"));
    }
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked) {
      loadDetails("network").then(() => {
        if (networkId !== -1) {
           loadDetails("app");
        }
      });
    }
  }, [walletChecked, chainChanged, networkId]);

  // this useEffect picks up any time a user Connects via the button
  useEffect(() => {
    // don't load ANY details until wallet is Connected
    if (connected) {
      if (networkId != EnvHelper.getRunChainId()) {
        dispatch(switchNetwork({ provider: provider, networkId: EnvHelper.getRunChainId() }));
      } else {
        loadDetails("account");
      }
    }
  }, [connected]);


  
  return ( 
    <Container>  
      {isAppLoading && <LoadingSplash />}
      {!isAppLoading &&
      <>
      <Header/>
      <SegmentedControl fullWidth color="blue"   transitionDuration={1000}
          name="action"
          defaultValue="stake"
          style={{ margin: 16, backgroundColor:"#303250" }}
          onChange={(val: React.SetStateAction<string>) => setAction(val)}
          data={[
            {
              label: (
                <Center> 
                 <Title order={6} align={"center"}>Swap</Title>
                </Center>
              ), 
              value: "swap", 
            },
            {
              label: (
                <Center> 
                 <Title order={6} align={"center"}>Stake</Title>
                </Center>
              ),
              value: "stake", 
            }
          ]} 
          styles={{ 
            active: {  background:'linear-gradient(92deg,rgb(66, 109, 255) 0%,rgb(142, 65, 255) 99%);' }, 
          }} 
        />   
     <Container style={{ marginTop: "15px"}}>
        {action === 'swap' ? <Swap /> : action === 'stake' && <Stake />}
    </Container>  
    </>}
  </Container>
  );
}

export default App; 

