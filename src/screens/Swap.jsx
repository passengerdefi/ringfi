import { Box, Card, Text, useMantineTheme, Title,Group ,Badge} from '@mantine/core';
import { useAppSelector } from "../hooks";

export default function Swap(props) {

    const theme = useMantineTheme();


    const isAppLoading = useAppSelector(state => {
        return state.app && state.app.loading;
    });

    const baseCurrency = useAppSelector(state => {
        return state.app && state.app.baseCurrency;
    });

    const stakingInfo = useAppSelector(state => {
        return state.app && state.app.stakingInfo;
    });

    const swaptokenList = () => {


    }

    return (
        <Box >
            <Card shadow="lg" radius="lg">
                <Title order={2}>Swap</Title>

                <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
                    <Text weight={500}>Norway Fjord Adventures</Text>
                    <Badge variant="gradient" gradient={{ from: 'grape', to: 'pink', deg: 35 }}>Grape pink</Badge>
                </Group>

                <Text>
                    Use it to create cards, dropdowns, modals and other components that require background
                    with shadow
                </Text>
            </Card>


        </Box>
    );
}
