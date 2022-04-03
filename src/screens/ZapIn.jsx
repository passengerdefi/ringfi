import { useEffect, useState } from "react";
import {
    Box,
    Card,
    Text,
    useMantineTheme,
    Title,
    Group,
    Button,
    InputWrapper,
    Image,
    LoadingOverlay,
    Input,
    Paper,
    Select,
    Grid,
} from "@mantine/core";
import { useAppSelector, useWeb3Context } from "../hooks";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown } from 'tabler-icons-react';

import { Settings } from "tabler-icons-react";
import { abi as ierc20Abi } from "../abi/ERC20.json";
import { ethers } from "ethers";
import {
    userAllowance,
    tokenBalance,
    poolStatistics,
    updateBackendForStats
} from "../functions/useStatistics";
import { inputTokens } from '../appconfig/bombconfig'
import { ArrowDownCircle } from "tabler-icons-react";
import { changeApproval } from "../functions/AppStakerInterface";
import { zapInToken } from "../functions/ZapInterface";

import { isPendingTxn, txnButtonText } from "../reducers/PendingTxnsSlice";
import { useNotifications } from "@mantine/notifications";
import staking from "../abi/deployments.mainnet.json";
import {
    getBalance,
    getDisplayBalance,
    getFullDisplayBalance,
} from "../utils/formatBalance";
import { bscPools } from "../appconfig/bsc_pools";
import { beefyUniV2ZapABI, erc20ABI } from '../appconfig/abi';
import { addressBook } from 'bombfarm-addressbook';
import { bscZaps } from "../appconfig/bsc_zaps";
import { MINSLIPPAGE } from "../appconfig";


export default function ZapIn() {
    const { provider, address} = useWeb3Context();
    const signer = provider.getSigner();
    const dispatch = useDispatch();
    const notifications = useNotifications();
    const {
        bsc: bscAddressBook,
      } = addressBook; 
    const [loading, setLoading] = useState(false); 
    const [stakingTokenName, setStakingTokenName] = useState('');
    const [stakingTokenAddress, setStakingTokenAddress] = useState(''); 
    const [poolContractAddress, setPoolContractAddress] = useState(''); 
    const [userTokenBalance, setUserTokenBalance] = useState(''); 
    const [approved, setApproved] = useState(false);

    const [depositvalue, setDepositvalue] = useState(""); 
 

    const [lpAllowance,setLpAllowance]=useState(0);
    const [bombAllowance,setBombAllowance]=useState(0);
    const [btcbAllowance,setBtcbAllowance]=useState(0);


    const [usersLPBalance,setUsersLPBalance]=useState("");
    const [usersBombBalance,setUsersBombBalance]=useState("");
    const [usersBTCBBalance,setUsersBTCBBalance]=useState("");

    const [balanceDisplay,setBalanceDisplay]=useState("");
    const [selectedTokenName,setSelectedTokenName]=useState("");


    const zapContract = new ethers.Contract(bscZaps.zapAddress,beefyUniV2ZapABI,signer);

    const pendingTransactions = useSelector((state) => {
        return state.pendingTransactions;
    }); 

    const onSeekApproval = async () => {
        const {token,pool} = selectTokens();

        console.log(token);
        console.log(pool);
        
        dispatch(
            changeApproval({ token, pool, provider, address, notifications })
        );
    };

    const selectTokens =() =>{

        let token,pool;
        switch(selectedTokenName){ 

            case inputTokens[0] : 
                    token =bscPools[0].tokenAddress;
                    pool = bscPools[0].earnContractAddress;
                 break;
            case inputTokens[1] : 
                  token =bscAddressBook.tokens.BOMB.address;
                  pool = bscZaps.zapAddress;
                 break;
            case inputTokens[2] : 
                    token =bscAddressBook.tokens.BTCB.address;
                    pool = bscZaps.zapAddress;
                 break; 
        }

        return {token,pool}
    }
    const onZapToken = async (amount) => {
        const {token} = selectTokens();
        const zapvalue = ethers.utils.parseEther(amount.toString());
    

        const  {swapAmountIn,swapAmountOut,TokenOut} = await zapContract.estimateSwap(bscPools[0].earnedTokenAddress, token, zapvalue);

        const swapAmountOutMin = swapAmountOut.toNumber()*(1-MINSLIPPAGE/100);
        const vaultAddress =  bscPools[0].earnedTokenAddress
        console.log(
            'beefIn(vaultAddress, swapAmountOutMin, tokenAddress, tokenAmount)',
            vaultAddress,
            swapAmountOut,
            token,
            zapvalue
          );



        dispatch(
            zapInToken({  vaultAddress,
                swapAmountOutMin,
                token,
                zapvalue, provider, address, notifications })
        );
    };


    const setMaxValue =() =>{
        switch(selectedTokenName){ 
            case inputTokens[0] : 
                 setDepositvalue(Number(ethers.utils.formatEther(usersLPBalance)).toFixed(18));
                 break;
            case inputTokens[1] : 
                setDepositvalue(Number(ethers.utils.formatEther(usersBombBalance)).toFixed(18));
                 break;
            case inputTokens[2] : 
                setDepositvalue(Number(ethers.utils.formatEther(usersBTCBBalance)).toFixed(18)); 
                 break;
        } 

    }

    const setSelectedTokenNameWithBalance = (value) => { 
        setSelectedTokenName(value); 
        switch(value){ 
            case inputTokens[0] : 
                 setBalanceDisplay(Number(ethers.utils.formatEther(usersLPBalance)).toFixed(4));
                 if(lpAllowance.lte(0)) setApproved(false); else setApproved(true);
                 break;
            case inputTokens[1] : 
                 setBalanceDisplay(Number(ethers.utils.formatEther(usersBombBalance)).toFixed(4));
                 if(bombAllowance.lte(0)) setApproved(false); else setApproved(true);
                 break;
            case inputTokens[2] : 
                 setBalanceDisplay(Number(ethers.utils.formatEther(usersBTCBBalance)).toFixed(4)); 
                 if(btcbAllowance.lte(0)) setApproved(false); else setApproved(true);
                 break;
        } 
    }





    const initZapScreen = async () => { 

        const LPPool = new ethers.Contract(bscPools[0].tokenAddress,erc20ABI,signer);
        const BOMB = new ethers.Contract(bscAddressBook.tokens.BOMB.address,erc20ABI,signer);
        const BTCB = new ethers.Contract(bscAddressBook.tokens.BTCB.address,erc20ABI,signer); 
 
        const usersLPBalance = await LPPool.balanceOf(address);
        const usersBombBalance = await BOMB.balanceOf(address);
        const usersBTCBBalance = await BTCB.balanceOf(address); 



        const lpAllowance = await LPPool.allowance(address,bscPools[0].earnContractAddress);
        const bombAllowance = await BOMB.allowance(address,bscZaps.zapAddress);
        const btcbAllowance = await BTCB.allowance(address,bscZaps.zapAddress); 




        setLpAllowance(lpAllowance);
        setBombAllowance(bombAllowance);
        setBtcbAllowance(btcbAllowance);
        


        setUsersLPBalance(usersLPBalance)
        setUsersBombBalance(usersBombBalance)
        setUsersBTCBBalance(usersBTCBBalance)

        setBalanceDisplay(Number(ethers.utils.formatEther(usersLPBalance)).toFixed(4));
        setSelectedTokenName(inputTokens[0]); 

        if(lpAllowance.gt(0))setApproved(true);

        setLoading(false);
    };

    useEffect(() => {
         initZapScreen();
    }, []);

    return (
        <Box>
            <div style={{ position: "relative" }}>
                <LoadingOverlay visible={loading} style={{ zIndex: +10 }} />

                <Card shadow="lg" style={{ marginTop: 10, backgroundColor: "#282942" }}>
                    <Group position="left" style={{ marginBottom: 5 }}>
                        <Title order={4} align={"center"} style={{ color: '#969bd5' }}>
                            Zap In to Pool {inputTokens[0]}
                        </Title>
                    </Group>
                    <InputWrapper
                        id="input-demo"
                        style={{ marginTop: 10, color: '#969bd5' }}
                        styles={{
                            label: { color: '#969bd5' },
                        }}
                        required
                        label="Select your Token to Zap"
                    > 
                        <Select 
                            placeholder="Pick one"
                            rightSection={<ChevronDown size={18} />}
                            defaultValue={inputTokens[0]}
                            onChange={setSelectedTokenNameWithBalance} 
                            rightSectionWidth={30}
                            styles={{ rightSection: { pointerEvents: 'none' } }}
                            nothingFound="No options"
                            data={inputTokens}
                        /> 
                    </InputWrapper>

                    <Paper
                        shadow="xl"
                        radius="md"
                        p="xs"
                        withBorder
                        style={{ marginTop: 10, backgroundColor: "#303250", border: 0 }}
                    >
                        <Title order={6} style={{ marginBottom: 10, color: '#969bd5' }}>
                            Balance : {balanceDisplay} {selectedTokenName}
                        </Title>

                        <Grid columns={24}>
                            <Grid.Col span={16}>
                                <Input
                                    placeholder="0.0"
                                    variant="filled"
                                    styles={{ input: { width: "100%", boxSizing: "border-box" } }}
                                    style={{ marginBottom: 15 }}
                                    value={depositvalue}
                                    rightSectionWidth={70}
                                    onChange={(event) =>
                                        setDepositvalue(event.currentTarget.value)
                                    }
                                    rightSection={
                                        <Button
                                            variant="default"
                                            gradient={{ from: "indigo", to: "violet" }}
                                            size="xs"
                                            compact
                                            radius="xs"
                                            onClick={setMaxValue}
                                        >
                                            MAX
                                        </Button>
                                    }
                                />
                            </Grid.Col>
                            <Grid.Col span={8}>
                                {!approved && (
                                    <Button
                                        variant="gradient"
                                        gradient={{ from: "orange", to: "red" }}
                                        size="xs"
                                        radius="md"
                                        fullWidth
                                        loading={isPendingTxn(
                                            pendingTransactions,
                                            "approve_deposit"
                                        )}
                                        onClick={() => {
                                            onSeekApproval(stakingTokenAddress, poolContractAddress);
                                        }}
                                    >
                                        {txnButtonText(
                                            pendingTransactions,
                                            "approve_deposit",
                                            "Approve"
                                        )}
                                    </Button>
                                )}
                                {approved && (
                                    <Button
                                        variant="gradient"
                                        gradient={{ from: "indigo", to: "violet" }}
                                        size="xs"
                                        radius="md"
                                        fullWidth
                                        onClick={() => {onZapToken(depositvalue)}}
                                    >
                                        {" "}
                                        Zap In
                                    </Button>
                                )}{" "}
                            </Grid.Col>
                        </Grid>
                    </Paper>
                    
                </Card>
            </div>

        </Box>
    );
}