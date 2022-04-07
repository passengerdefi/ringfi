import { useEffect, useState } from "react";
import {
    Box,
    Card,
    Image, Text, Badge, useMantineTheme,
    Group,
    Button,
    InputWrapper,
    Title,
    Input,
    Paper,
    Select,
    Grid,
} from "@mantine/core";
import { useWeb3Context } from "../hooks";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown } from 'tabler-icons-react';
import { tokenBalance, getSwaps } from '../functions/useStatistics';
import srcLogo from '../assets/tokens/bnb.png'
import destLogo from '../assets/tokens/RING.svg'
import { REACT_APP_SUPPORTED_CHAINID, TOKEN, WETH9, PEG, MINSLIPPAGE, SWAPFEES, FEEWALLET } from "../appconfig";
import ERC20 from "../types/ERC20";
import { useNotifications } from "@mantine/notifications";
import { getData, getRouterAddress } from 'elloswap-sdk'
import { BigNumber } from 'bignumber.js'
import { Contract } from '@ethersproject/contracts'
import { ethers } from "ethers";


export default function Dash() {

    const amount = new BigNumber("1000000000000000000");
    const { provider, address } = useWeb3Context();
    const signer = provider.getSigner();
    const dispatch = useDispatch();
    const theme = useMantineTheme();
    const DESTCONTRACT = new ERC20(TOKEN.address, signer, TOKEN.name, TOKEN.decimals);
    const [destPrice, setDestPrice] = useState(0);


    const secondaryColor = theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[7];


    const stats = async () => {


        if (address) {
            const swapParameters = await getSwaps(amount);
            const amountOutUsd = new BigNumber(swapParameters.data.amountOutUsd);
            const outputAmount = new BigNumber(swapParameters.data.outputAmount);
            const priceInUsd = amountOutUsd.multipliedBy(amount).dividedBy(outputAmount).dividedBy(1e13);
            setDestPrice(priceInUsd.toFixed(4));



        }

    }





    useEffect(() => {
        if (address) {

            stats();
        }

    }, [address]);




    return (
        <Box>
            <div style={{ position: "relative" }}> 
                <Group spacing="xs" grow>
                    <Card shadow="lg"
                        radius="md"
                        style={{ marginTop: 10, backgroundColor: "#303250" }} >
                        <Group style={{ marginTop: theme.spacing.sm, justifyContent: "center" }}>
                        <Title order={5} align={"center"} style={{ color: '#969bd5' }}>Price</Title>
                        </Group>
                        <Group style={{ marginTop: theme.spacing.sm, justifyContent: "center" }}>

                           <Text style={{ color: '#969bd5', fontSize: "10" }}> 
                                $ {destPrice && destPrice}
                            </Text>
                        </Group> 
                    </Card> 
                </Group>

            </div>

        </Box>)


}