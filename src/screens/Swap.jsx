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
import bnbLogo from '../assets/tokens/bnb.png'
import ravenLogo from '../assets/tokens/bomb1.png'
import { getTokenPriceInbnb, getTokenPriceInRaven } from '../functions/OneInchApi';
import { tokenBalance } from '../functions/Getstatistics';
import { BASE_TOKEN,   REACT_APP_SUPPORTED_CHAINID } from "../appconfig";
import { useModals } from '@mantine/modals';
import { useWeb3Context } from "../hooks";
import { Reactor } from "../reactors/Reactor";
import BigNumber from "bignumber.js";

import weth from "../abi/weth.json";
import SwapRouterAbi from "../abi/IUniswapV2Router02.json";
import { ROUTERS } from "../appconfig";
import ERC20 from "../functions/ERC20";
 import { Token } from "@uniswap/sdk-core";
 import { useNotifications } from "@mantine/notifications"; 



const RAVEN = new Token(
    REACT_APP_SUPPORTED_CHAINID,
    '0x4154a93ef4dB1e0C3fbb22bda0E36249453E319e',
    18
);

 const WETH9 = new Token(
     REACT_APP_SUPPORTED_CHAINID,
     '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
     18
 )

export default function Swap(props) {


    const modals = useModals();
    const { address } = useWeb3Context();

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const notifications = useNotifications();




     const [loading, setLoading] = useState(false);
    const [ravenPrice, setravenPrice] = useState(0);
    const [userbnbBalance, setUserbnbBalance] = useState(0);
    const [ravenBalance, setRavenBalance] = useState(0);
    const [payValue, setPayValue] = useState(0)
    const [buyValue, setBuyValue] = useState(0);

    const [allowanceIn, setAllowanceIn] = useState(false);
    const [allowanceOut, setAllowanceOut] = useState(false);
    const [swapEnabled, setSwapEnabled] = useState(false);
 

    const swapToken = async (payValue) => {

     
 
         const path = [WETH9.address, RAVEN.address];
   

        const router = new ethers.Contract(
            ROUTERS[REACT_APP_SUPPORTED_CHAINID],
            SwapRouterAbi.abi,
            signer
        );


        const amountpayValue = ethers.utils.parseUnits(payValue.toString(), 'ether');
        console.log('Buying tokens');
        try {

            const buyTx = await router.swapExactETHForTokens(
                0,
                path,
                address,
                Date.now() + 1000 * 60,
                { from: address, value: amountpayValue, gasLimit: 251234 }
            );

            console.log('Waiting for receipt');

            const id = notifications.showNotification({
                loading: true,
                title: 'Waiting for receipt',
                message: 'Waiting for receipt, you cannot close this yet',
                autoClose: false,
                disallowClose: true,
            });



            try {

                const buyReceipt = await buyTx.wait();

                if (buyReceipt.transactionHash) {

                    notifications.clean();
                    const id = notifications.showNotification({
                        color: 'lime',
                        title: 'Transaction receipt',
                        message: 'Recieved Transaction ' + buyReceipt.transactionHash,
                    });

                    await stats();

                }


            } catch (err) {

                notifications.showNotification({
                    color: 'red',
                    title: 'Error.',
                    message: err.message,
                })

            }



        } catch (err) {

            notifications.showNotification({
                color: 'red',
                title: 'Error.',
                message: err.message,
            })


        }





    }




    const tokenValuebnb = async (token, amount) => {

        const prizeEstimate = await getTokenPriceInbnb(token, ethers.utils.parseUnits(amount));
        return prizeEstimate;
    }

    const tokenValueRaven = async (token, amount) => {

        const prizeEstimate = await getTokenPriceInRaven(token, ethers.utils.parseUnits(amount));
        return prizeEstimate;
    }

    /*
    setSwapparametersPay'
    buyValye' is not defi
    setSwapparametersBuy'*/
    const setSwapparametersPay = (value) => {
        setPayValue(value);

        if (value && value > 0) tokenValuebnb(RAVEN.address, value).then((price) => setBuyValue(Number(price).toFixed(4)));
        else { setBuyValue(0); setSwapEnabled(false); return; }
        const buyValuechanged = value * ravenPrice;
        console.log(buyValuechanged);
        setSwapEnabled(true); return;
    }

    const setSwapparametersBuy = (value) => {

        setBuyValue(value);

        if (value && value > 0) tokenValueRaven(RAVEN.address, value).then((price) => setPayValue(Number(price).toFixed(4)));
        else { setPayValue(0); setSwapEnabled(false); return; }
        setSwapEnabled(true); return;


    }


    const ApproveSZ = async () => {

        const RAVENCONTRACT = new ERC20(RAVEN.address, signer, 'RAVEN', 18);

        try {
            await RAVENCONTRACT.approve(ROUTERS[REACT_APP_SUPPORTED_CHAINID], '100000000000000000000000');
        } catch (err) {

            console.log(err.message)

            notifications.showNotification({
                color: 'red',
                title: 'Error.',
                message: err.message,
            })


            return;
        }

        setAllowanceOut(true);


    }

    const ApproveAwax = async () => {

        const WETH9C = new ethers.Contract(
            WETH9.address,
            weth,
            signer
        );
        try {
            await WETH9C.approve(ROUTERS[REACT_APP_SUPPORTED_CHAINID], '1000000000000000000000');
        } catch (err) {

            console.log(err.message)

            notifications.showNotification({
                color: 'red',
                title: 'Error.',
                message: err.message,
            })


            return;
        }

        setAllowanceIn(true);

    }


    const isWETH9Approved = async () => {

        const WETH9C = new ethers.Contract(
            WETH9.address,
            weth,
            signer
        );
        const allowance2 = await WETH9C.allowance(address, ROUTERS[REACT_APP_SUPPORTED_CHAINID]);

        console.log(allowance2);

        if (allowance2.lte(0)) {

            return false;

        }

        return true;

    }


    const isRavenApproved = async () => {

        const RAVENCONTRACT = new ERC20(RAVEN.address, signer, 'RAVEN', 18);

        const allowance = await RAVENCONTRACT.allowance(address, ROUTERS[REACT_APP_SUPPORTED_CHAINID]);
        console.log(allowance);
        if (allowance.lte(0)) {
            return false;
        }
        return true;


    }

    const stats = async () => {

        const amount = 1000000000000000000n;
        if (address) {


            const ravenPrice = await getTokenPriceInbnb(RAVEN.address, amount);
            // console.log(ravenPrice);
            setravenPrice(Number(ravenPrice).toFixed(4));


            const userbnbBalance = await provider.getBalance(address)
            setUserbnbBalance(Number(ethers.utils.formatEther(userbnbBalance)).toFixed(4));

            const rBalance = await tokenBalance(provider, address, RAVEN.address)
            setRavenBalance(Number(ethers.utils.formatEther(rBalance)).toFixed(4));


            const inAllowance = await isWETH9Approved();

            setAllowanceIn(inAllowance);


            const outAllowance = await isRavenApproved();

            setAllowanceOut(outAllowance);




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
                        Swap BNB for RAVEN
                    </Title>
                </Group>


                <Grid columns={16} style={{ marginTop: 20 }}>
                    <Grid.Col span={16}>
                        <Group position="apart">
                            <Text style={{ color: '#969bd5', fontSize: "10" }}>
                                From</Text>

                            <Text style={{ color: '#969bd5', fontSize: "10" }}>
                                Balance:  {userbnbBalance && userbnbBalance}</Text>

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
                                        src={bnbLogo}
                                        alt="Token image" />

                                    <Title order={5} style={{ color: '#969bd5' }}>
                                    BNB</Title>

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
                                Balance: {ravenBalance && ravenBalance}</Text>

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
                                        src={ravenLogo}
                                        alt="Token image"
                                    />
                                    <Title order={5} style={{ color: '#969bd5' }}>
                                    RAVEN</Title>

                                </Group>
                            }

                        />
                    </Grid.Col>

                </Grid>


                <Group position="apart" style={{ marginTop: 20 }}>
                    <Text style={{ color: '#969bd5' }}>
                        Price</Text>

                    <Text style={{ color: '#969bd5' }}>
                        {ravenPrice && ravenPrice} RAVEN per BNB</Text>

                </Group>
                {userbnbBalance && userbnbBalance > 0 &&
                    <Group position="apart">
                        {!allowanceIn ? (
                            <Button
                                variant="gradient"
                                gradient={{ from: "indigo", to: "violet" }}
                                style={{ marginTop: 20, width: "47%" }}
                                size="xs"
                                radius="md"
                                onClick={() => {
                                    ApproveAwax();
                                }}
                            >
                                Approve BNB
                            </Button>

                        ) : (
                            <Button variant="gradient"
                                gradient={{ from: "indigo", to: "violet" }}
                                style={{ marginTop: 20, width: "47%", color: "gray" }}
                                size="xs"
                                radius="md" disabled> Approve BNB</Button>
                        )}
                        {!allowanceOut ? (
                            <Button
                                variant="gradient"
                                gradient={{ from: "indigo", to: "violet" }}
                                style={{ marginTop: 20, width: "47%" }}
                                size="xs"
                                radius="md"
                                onClick={() => {
                                    ApproveSZ();
                                }}
                            >
                                Approve Token
                            </Button>

                        ) : (
                            <Button
                                variant="gradient"
                                gradient={{ from: "indigo", to: "violet" }}
                                style={{ marginTop: 20, width: "47%", color: !swapEnabled ? 'gray' : 'white' }}
                                size="xs"
                                disabled={!swapEnabled}
                                radius="md"
                                onClick={() => {
                                    swapToken(payValue);
                                }}
                            >
                                Swap
                            </Button>
                        )}


                    </Group>
                }

                {userbnbBalance === 0 &&
                    <Group position="center" style={{ marginTop: 20 }}>
                        <Badge size="lg" variant="gradient" gradient={{ from: 'orange', to: 'red' }}>Insufficient BNB Balance</Badge>
                    </Group>
                }

            </Card>
        </Box>
    );
}
