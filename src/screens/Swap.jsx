import {
    Box,
    Card,
    Text,
    useMantineTheme,
    Title,
    Group,
    Button,
    Badge,
    Image,
    LoadingOverlay,
    Input,
    Divider,
    ActionIcon,
    Grid,
} from "@mantine/core"; import { useAppSelector } from "../hooks";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Settings } from "tabler-icons-react";
import { useAddress } from "../hooks/web3Context";
import { ethers } from "ethers";
import avaxLogo from '../assets/tokens/AVAX.svg'
import subzLogo from '../assets/tokens/sub.svg'
import {getTokenPriceInAvax ,getTokenPriceInSz} from '../functions/OneInchApi';
import {tokenBalance } from '../functions/Getstatistics'; 
import { BASE_TOKEN,NETWORKS,REACT_APP_SUPPORTED_CHAINID } from "../appconfig";
 import { useModals } from '@mantine/modals';
 import { useWeb3Context } from "../hooks"; 
 import { Reactor } from "../reactors/Reactor"; 
import BigNumber from "bignumber.js"; 
 

export default function Swap(props) {


    const modals = useModals();
    const { provider,  address, connected, connect, chainID } = useWeb3Context();
 
      const subzero ="0xC23a0C962C61281F450c282A2EEBbA080Ceeedc7" 
    const [loading, setLoading] = useState(false);
    const [subzPrice, setSubzPrice] = useState(0);
    const [useravaxBalance, setUseravaxBalance] = useState(0);
    const [szBalance, setSzBalance] = useState(0);
    const [payValue,setPayValue]=useState(0)
    const [buyValue,setBuyValue]= useState(0);
     
 
    const isAppLoading = useAppSelector(state => {
        return state.app && state.app.loading;
    });

    const baseCurrency = useAppSelector(state => {
        return state.app && state.app.baseCurrency;
    });

    const stakingInfo = useAppSelector(state => {
        return state.app && state.app.stakingInfo;
    });
 


    const swapToken = async(payValue)=>{ 

        const amount =1000000000000000000n;

 


    }

 


    const tokenValueAvax = async(token,amount)=>{

        const prizeEstimate = await getTokenPriceInAvax(token,ethers.utils.parseUnits(amount));
        return prizeEstimate;
    }

    const tokenValueSz= async(token,amount)=>{

        const prizeEstimate = await getTokenPriceInSz(token,ethers.utils.parseUnits(amount));
        return prizeEstimate;
    }

/*
setSwapparametersPay'
buyValye' is not defi
setSwapparametersBuy'*/
    const setSwapparametersPay = (value)=>{ 
        setPayValue(value);

        if(value && value>0) tokenValueAvax(subzero,value).then((price)=>setBuyValue(Number(price).toFixed(4)));
        else{setBuyValue(0);}
        const buyValuechanged = value*subzPrice; 
        console.log(buyValuechanged);

    }

    const setSwapparametersBuy = (value)=>{

        setBuyValue(value);

        if(value && value>0) tokenValueSz(subzero,value).then((price)=>setPayValue(Number(price).toFixed(4)));
        else{setPayValue(0);} 


    }

    const stats = async() => {

         const amount =1000000000000000000n;
        if(address ){

              

            
            const subzPrice = await getTokenPriceInAvax(subzero,amount); 
           // console.log(subzPrice);
            setSubzPrice(Number(subzPrice).toFixed(4));


            const useravaxBalance =  await provider.getBalance(address)
            setUseravaxBalance(Number(ethers.utils.formatEther(useravaxBalance)).toFixed(4));

            const szBalance =  await tokenBalance(provider,address,subzero)
            setSzBalance(Number(ethers.utils.formatEther(szBalance)).toFixed(4));

        }
     

    }

    useEffect(() => {
        if (address) {
           
            stats();
        }

    }, []);

    return (
        <Box>
            <Card
                shadow="lg"
                radius="md"
                style={{ marginTop: 10, backgroundColor: "#303250" }}
            >
                <Group position="center" style={{ marginBottom: 5 }}>
                    <Title order={5} align={"center"} style={{ color: '#969bd5' }}>
                        Swap Avax for Subzero
                    </Title>
                </Group>


                <Grid columns={16}  style={{ marginTop: 20 }}>
                    <Grid.Col span={16}>
                        <Group position="apart">
                            <Text style={{ color: '#969bd5', fontSize: "10" }}>
                                From</Text>

                            <Text style={{ color: '#969bd5', fontSize: "10" }}>
                                Balance:  {useravaxBalance && useravaxBalance}</Text>

                        </Group>
                        <Input
                            placeholder="0.0"
                            variant="filled"
                            size="lg"
                            styles={{ input: { width: "100%", boxSizing: "border-box" } }}
                            style={{ marginBottom: 15 }}
                            value={payValue} 
                            onChange={(event) =>
                                setSwapparametersPay(event.currentTarget.value)
                              }

                            rightSectionWidth={120}
                            rightSection={
                                <Group position="right">
                                   
                                    <Image
                                        style={{ height: 32, width: 32 }}
                                        src={avaxLogo}
                                        alt="Token image" />

                                    <Title order={5} style={{ color: '#969bd5' }}>
                                        AVAX</Title>

                                </Group>
                            }

                        />
                    </Grid.Col>
                </Grid>
                <Grid columns={16}>
                    <Grid.Col span={16}>
                        <Group position="apart">
                            <Text style={{ color: '#969bd5', fontSize: "10" }}>
                                To</Text>

                            <Text style={{ color: '#969bd5', fontSize: "10" }}>
                                Balance: {szBalance && szBalance}</Text>

                        </Group>
                        <Input
                            placeholder="0.0"
                            variant="filled"
                            size="lg"
                            styles={{ input: { width: "100%", boxSizing: "border-box" } }}
                            style={{ marginBottom: 15 }}
                             value={buyValue} 
                            onChange={(event) =>
                                setSwapparametersBuy(event.currentTarget.value)
                              }
                            rightSectionWidth={120} 
                            rightSection={
                                <Group position="right">
                                    <Image
                                        style={{ height: 32, width: 32 }}
                                        src={subzLogo}
                                        alt="Token image"
                                    />
                                    <Title order={5} style={{ color: '#969bd5' }}>
                                        Subzero</Title>

                                </Group>
                            }

                        />
                    </Grid.Col>

                </Grid>

                 
                <Group position="apart"  style={{ marginTop: 20 }}>
                    <Text style={{ color: '#969bd5'  }}>
                        Price</Text>

                    <Text style={{ color: '#969bd5'  }}>
                        {subzPrice && subzPrice} SUBZERO per AVAX</Text>

                </Group>

                <Group position="center">
                    <Button
                        variant="gradient"
                        fullWidth
                        gradient={{ from: "indigo", to: "violet" }}
                        style={{ marginTop: 20 }}
                        size="md"
                        radius="md"
                        onClick={() => {
                            swapToken(payValue);
                          }}
                    >
                        Swap
                    </Button>
                </Group> 

               





            </Card>



        </Box>
    );
}
