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
import { getTokenPriceInAvax, getTokenPriceInSz } from '../functions/OneInchApi';
import { tokenBalance } from '../functions/Getstatistics';
import { BASE_TOKEN, NETWORKS, REACT_APP_SUPPORTED_CHAINID } from "../appconfig";
import { useModals } from '@mantine/modals';
import { useWeb3Context } from "../hooks";
import { Reactor } from "../reactors/Reactor";
import BigNumber from "bignumber.js";

import weth from "../abi/weth.json";
import JoeRouter from "../abi/IJoeRouter02.json";
import { ROUTERS } from "../appconfig";
import ERC20 from "../functions/ERC20";
import { MaxUint256 } from "@uniswap/sdk-core";
import {
    Fetcher as FetcherSpirit,
    Token as TokenSpirit, WAVAX
} from "@traderjoe-xyz/sdk";
import { Fetcher, Route, Token, Trade, TokenAmount, TradeType, Percent } from "@traderjoe-xyz/sdk";
import { useNotifications } from "@mantine/notifications";


const SUBZERO = new Token(
    REACT_APP_SUPPORTED_CHAINID,
    '0xC23a0C962C61281F450c282A2EEBbA080Ceeedc7',
    18
);

export default function Swap(props) {


    const modals = useModals();
    const { address, connected, connect, chainID } = useWeb3Context();

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const notifications = useNotifications();




    const subzero = "0xC23a0C962C61281F450c282A2EEBbA080Ceeedc7"
    const [loading, setLoading] = useState(false);
    const [subzPrice, setSubzPrice] = useState(0);
    const [useravaxBalance, setUseravaxBalance] = useState(0);
    const [szBalance, setSzBalance] = useState(0);
    const [payValue, setPayValue] = useState(0)
    const [buyValue, setBuyValue] = useState(0);

    const [allowanceIn, setAllowanceIn] = useState(false);
    const [allowanceOut, setAllowanceOut] = useState(false);
    const [swapEnabled, setSwapEnabled] = useState(false);


    const isAppLoading = useAppSelector(state => {
        return state.app && state.app.loading;
    });

    const baseCurrency = useAppSelector(state => {
        return state.app && state.app.baseCurrency;
    });

    const stakingInfo = useAppSelector(state => {
        return state.app && state.app.stakingInfo;
    });



    const swapToken = async (payValue) => {

        const pair = await Fetcher.fetchPairData(SUBZERO, WAVAX[SUBZERO.chainId], provider);

        const route = new Route([pair], WAVAX[SUBZERO.chainId]);

        const amountIn = "1000000000000000000"; // 1 WETH

        const trade = new Trade(
            route,
            new TokenAmount(WAVAX[SUBZERO.chainId], amountIn),
            TradeType.EXACT_INPUT
        );


        const slippageTolerance = new Percent("50", "10000"); // 50 bips, or 0.50%

        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
        const path = [WAVAX[SUBZERO.chainId].address, SUBZERO.address];
        const to = ""; // should be a checksummed recipient address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
        const value = trade.inputAmount.raw; // // needs to be converted to e.g. hex


        const router = new ethers.Contract(
            ROUTERS[REACT_APP_SUPPORTED_CHAINID],
            JoeRouter,
            signer
        );


        const amountpayValue = ethers.utils.parseUnits(payValue.toString(), 'ether');
        console.log('Buying tokens');
        try {

            const buyTx = await router.swapExactAVAXForTokens(
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




    const tokenValueAvax = async (token, amount) => {

        const prizeEstimate = await getTokenPriceInAvax(token, ethers.utils.parseUnits(amount));
        return prizeEstimate;
    }

    const tokenValueSz = async (token, amount) => {

        const prizeEstimate = await getTokenPriceInSz(token, ethers.utils.parseUnits(amount));
        return prizeEstimate;
    }

    /*
    setSwapparametersPay'
    buyValye' is not defi
    setSwapparametersBuy'*/
    const setSwapparametersPay = (value) => {
        setPayValue(value);

        if (value && value > 0) tokenValueAvax(subzero, value).then((price) => setBuyValue(Number(price).toFixed(4)));
        else { setBuyValue(0); setSwapEnabled(false); return; }
        const buyValuechanged = value * subzPrice;
        console.log(buyValuechanged);
        setSwapEnabled(true); return;
    }

    const setSwapparametersBuy = (value) => {

        setBuyValue(value);

        if (value && value > 0) tokenValueSz(subzero, value).then((price) => setPayValue(Number(price).toFixed(4)));
        else { setPayValue(0); setSwapEnabled(false); return; }
        setSwapEnabled(true); return;


    }


    const ApproveSZ = async () => {

        const SUBZEROCONTRACT = new ERC20(SUBZERO.address, signer, 'SUBZERO', 18);

        try {
            await SUBZEROCONTRACT.approve(ROUTERS[REACT_APP_SUPPORTED_CHAINID], '100000000000000000000000');
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

        const wavax = new ethers.Contract(
            WAVAX[SUBZERO.chainId].address,
            weth,
            signer
        );
        try {
            await wavax.approve(ROUTERS[REACT_APP_SUPPORTED_CHAINID], '1000000000000000000000');
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


    const isWavaxApproved = async () => {

        const wavax = new ethers.Contract(
            WAVAX[SUBZERO.chainId].address,
            weth,
            signer
        );
        const allowance2 = await wavax.allowance(address, ROUTERS[REACT_APP_SUPPORTED_CHAINID]);

        console.log(allowance2);

        if (allowance2.lte(0)) {

            return false;

        }

        return true;

    }


    const isSZApproved = async () => {

        const SUBZEROCONTRACT = new ERC20(SUBZERO.address, signer, 'SUBZERO', 18);

        const allowance = await SUBZEROCONTRACT.allowance(address, ROUTERS[REACT_APP_SUPPORTED_CHAINID]);
        console.log(allowance);
        if (allowance.lte(0)) {
            return false;
        }
        return true;


    }

    const stats = async () => {

        const amount = 1000000000000000000n;
        if (address) {


            const subzPrice = await getTokenPriceInAvax(subzero, amount);
            // console.log(subzPrice);
            setSubzPrice(Number(subzPrice).toFixed(4));


            const useravaxBalance = await provider.getBalance(address)
            setUseravaxBalance(Number(ethers.utils.formatEther(useravaxBalance)).toFixed(4));

            const szBalance = await tokenBalance(provider, address, subzero)
            setSzBalance(Number(ethers.utils.formatEther(szBalance)).toFixed(4));


            const inAllowance = await isWavaxApproved();

            setAllowanceIn(inAllowance);


            const outAllowance = await isSZApproved();

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
                        Swap Avax for Subzero
                    </Title>
                </Group>


                <Grid columns={16} style={{ marginTop: 20 }}>
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


                <Group position="apart" style={{ marginTop: 20 }}>
                    <Text style={{ color: '#969bd5' }}>
                        Price</Text>

                    <Text style={{ color: '#969bd5' }}>
                        {subzPrice && subzPrice} SUBZERO per AVAX</Text>

                </Group>
                {useravaxBalance && useravaxBalance > 0 &&
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
                                Approve Avax
                            </Button>

                        ) : (
                            <Button variant="gradient"
                                gradient={{ from: "indigo", to: "violet" }}
                                style={{ marginTop: 20, width: "47%", color: "gray" }}
                                size="xs"
                                radius="md" disabled> Approve Avax</Button>
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

                {useravaxBalance == 0 &&
                    <Group position="center" style={{ marginTop: 20 }}>
                        <Badge size="lg" variant="gradient" gradient={{ from: 'orange', to: 'red' }}>Insufficient Avax Balance</Badge>
                    </Group>
                }

            </Card>
        </Box>
    );
}
