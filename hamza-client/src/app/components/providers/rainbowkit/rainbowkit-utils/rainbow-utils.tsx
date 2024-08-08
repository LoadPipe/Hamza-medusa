import React, { useEffect, useState } from 'react';
import {
    getDefaultWallets,
    darkTheme,
    connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
    injectedWallet,
    rainbowWallet,
    coinbaseWallet,
    metaMaskWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
    configureChains,
    createConfig,
    useAccount,
    useWalletClient,
} from 'wagmi';
import {
    mainnet,
    optimismSepolia,
    optimism,
    sepolia,
    linea,
    lineaTestnet,
    goerli,
} from 'wagmi/chains';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import {
    Box,
    Flex,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Text,
} from '@chakra-ui/react';
// import sepoliaImage from '../../../../../../public/images/sepolia/sepolia.webp';

const WALLETCONNECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';

export const darkThemeConfig = darkTheme({
    accentColor: '#94D42A',
    accentColorForeground: 'white',
    borderRadius: 'large',
    fontStack: 'system',
    overlayBlur: 'small',
});

// TODO: Later can use this logic for custom Chain logos
// // Extend the Sepolia chain configuration
// const customSepolia = {
//     ...sepolia,
//     iconUrl: sepoliaImage.src, // Use the correct property for the image URL
//     // lets make the background transparent
//     iconBackground: 'transparent', // Set your desired background color
// };

// export { customSepolia };

export const { chains, publicClient, webSocketPublicClient } = configureChains(
    [sepolia, mainnet, optimismSepolia, optimism, linea, lineaTestnet, goerli],
    [
        alchemyProvider({
            apiKey: ALCHEMY_API_KEY,
        }),
        jsonRpcProvider({
            rpc: () => {
                return {
                    http: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
                };
            },
        }),
        publicProvider(),
    ]
);

export function getAllowedChainsFromConfig() {
    console.log('RAINBOW: getAllowedChainsFromConfig');
    let chains = process.env.NEXT_PUBLIC_ALLOWED_BLOCKCHAINS;
    if (!chains?.length) chains = '10'; ///default to mainnet

    const split: any[] = chains.split(',');
    split.forEach((v, i) => (split[i] = parseInt(v.trim())));
    console.log('RAINBOW: allowed blockchains: ', split);
    return split;
}

export async function getChainId(walletClient: any) {

    for (let n = 0; n < 3; n++) {
        try {
            const chainId = walletClient.getChainId();
            if (chainId)
                return chainId;
        }
        catch (e: any) {
            console.error('RAINBOW: Error fetching chain ID:', e);
        }
    }

    return null;
}

type Props = {
    enabled: boolean;
};

// Add NEXT_PUBLIC_ALLOWED_BLOCKCHAINS = 11155111 to env
export const SwitchNetwork = ({ enabled }: Props) => {
    console.log('RAINBOW: SwitchNetwork');
    // Modal Hook
    const [openModal, setOpenModal] = useState(false);
    const [preferredChainName, setPreferredChainName] = useState('');
    //sometimes not detecting environment correctly
    const [preferredChainID, setPreferredChainID] = useState(getAllowedChainsFromConfig()[0]);

    // Wagmi Hooks
    const { data: walletClient, isError } = useWalletClient();

    const { error, isLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork();

    const voidFunction = () => { };

    //TODO: move this to a chain config or something
    const getChainName = (chainId: number) => {
        console.log('RAINBOW: getChainName', chainId);
        switch (chainId) {
            case 10:
                return 'Optimism';
            case 11155111:
                // Sepolia
                return 'Sepolia';
            case 11155420:
                //  Op-Sepolia
                return 'Op-Sepolia';
            case 1:
                //  Eth Main
                return 'Ethereum Mainnet';
            default:
                //  Sepolia
                return 'Unknown';
        }
    };

    const setSwitchNetwork = () => {
        console.log('RAINBOW: setSwitchNetwork');
        let allowed = getAllowedChainsFromConfig()[0];
        setPreferredChainID(allowed);
        setPreferredChainName(getChainName(allowed));
    };

    useEffect(() => {
        setSwitchNetwork();
    }, []);

    useEffect(() => {
        const fetchChainId = async () => {
            setSwitchNetwork();
            console.log('RAINBOW: fetchChainId');
            if (walletClient && enabled) {
                try {
                    const chainId = await getChainId(walletClient);
                    console.log(
                        `RAINBOW: connected chain id is ${chainId}, preferred chain is ${preferredChainID}`
                    );

                    if (chainId === preferredChainID) {
                        setOpenModal(false);
                    } else {
                        setOpenModal(true);
                    }
                } catch (error) {
                    console.error('RAINBOW: Error fetching chain ID:', error);
                }
            }
        };
        fetchChainId();
    }, [walletClient]);

    return (
        <Modal isOpen={openModal} onClose={() => { }} isCentered>
            <ModalOverlay />
            <ModalContent
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'16px'}
                backgroundColor={'#121212'}
                border={'1px'}
                borderColor={'white'}
            >
                <ModalBody width={'100%'} py="1.5rem">
                    <Flex
                        flexDirection={'column'}
                        gap={'16px'}
                        alignItems={'center'}
                    >
                        <Text
                            fontSize={'2rem'}
                            color={'white'}
                            fontWeight={300}
                        >
                            Unsupported Network
                        </Text>
                        <Text color={'white'}>
                            Hamza currently only supports {preferredChainName}.
                            Switch to {preferredChainName} to continue using
                            Hamza
                        </Text>
                        <Button
                            backgroundColor={'primary.indigo.900'}
                            color={'white'}
                            height={'38px'}
                            borderRadius={'full'}
                            width="100%"
                            disabled={!switchNetwork || isLoading}
                            _hover={{
                                backgroundColor: 'primary.indigo.800',
                                transition: 'background-color 0.3s ease-in-out',
                            }}
                            _focus={{
                                boxShadow: 'none',
                                outline: 'none',
                            }}
                            onClick={() =>
                                switchNetwork
                                    ? switchNetwork(preferredChainID)
                                    : voidFunction()
                            }
                        >
                            Switch to {preferredChainName}
                        </Button>
                    </Flex>
                    {/* {error && <p>Error: {error.message}</p>}
                    {isLoading && pendingChainId && (
                        <p>Switching to chain ID {pendingChainId}...</p>
                    )} */}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
// const { connectors } = getDefaultWallets({
//     appName: 'op_sep',
//     projectId: WALLETCONNECT_ID,
//     chains,
// });

const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [
            rainbowWallet({ projectId: WALLETCONNECT_ID, chains }),
            // coinbaseWallet({ appName: WALLETCONNECT_ID, chains }),
            metaMaskWallet({
                projectId: WALLETCONNECT_ID,
                chains,
            }),
            walletConnectWallet({ projectId: WALLETCONNECT_ID, chains }),
        ],
    },
]);

// Config in v1.x.wagmi Client in 2.x.wagmi?
export const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
});
