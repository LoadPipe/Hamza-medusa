import React, { useEffect, useState } from 'react';
import { darkTheme, connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
    rainbowWallet,
    metaMaskWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WalletConnectButton } from '@/components/providers/rainbowkit/connect-button/connect-button';
import { configureChains, createConfig, useWalletClient } from 'wagmi';
import {
    mainnet,
    optimism,
    sepolia,
    polygon,
    arbitrum,
    base,
    scroll,
    mantle,
    bsc,
    baseSepolia,
    scrollSepolia,
    avalanche,
} from 'wagmi/chains';
import { useNetwork, useSwitchNetwork, Chain } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import {
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Text,
} from '@chakra-ui/react';
// import sepoliaImage from '../../../../../../public/images/sepolia/sepolia.webp';

const WALLETCONNECT_ID =
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';

export const darkThemeConfig = darkTheme({
    accentColor: '#94D42A',
    accentColorForeground: 'white',
    borderRadius: 'large',
    fontStack: 'system',
    overlayBlur: 'small',
});

const EXTRA_LOGGING = false;

//import Polygon testnet
const amoy: Chain = {
    id: 80002,
    name: 'Polygon Amoy',
    network: 'Polygon Amoy',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc-amoy.polygon.technology'],
        },
        public: { http: ['https://rpc-amoy.polygon.technology/'] },
    },
    blockExplorers: {
        default: {
            name: 'PolygonScan',
            url: 'https://amoy.polygonscan.com',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 3127388,
        },
    },
    testnet: true,
};

let wagmiChains: Chain[] = [];

const allowedChains = (process.env.NEXT_PUBLIC_ALLOWED_BLOCKCHAINS ?? '').split(
    ','
);

const chainConfig = {
    mainnet,
    1: mainnet,
    optimism,
    10: optimism,
    bsc,
    56: bsc,
    polygon,
    137: polygon,
    base,
    8453: base,
    arbitrum,
    42161: arbitrum,
    amoy,
    80002: amoy,
    sepolia,
    11155111: sepolia,
    baseSepolia,
    84532: baseSepolia,
    scrollSepolia,
    534351: scrollSepolia,
    avalanche,
    43114: avalanche,
};

if (allowedChains.length === 0) {
    allowedChains.push('sepolia');
} else {
    wagmiChains = allowedChains.map(
        (c) => chainConfig[c as keyof typeof chainConfig]
    );
}

export const { chains, publicClient, webSocketPublicClient } = configureChains(
    wagmiChains,
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
    if (EXTRA_LOGGING) console.log('RB: getAllowedChainsFromConfig');
    let chains = process.env.NEXT_PUBLIC_ALLOWED_BLOCKCHAINS;
    if (!chains?.length) chains = '10'; ///default to mainnet

    const split: any[] = chains.split(',');
    split.forEach((v, i) => (split[i] = parseInt(v.trim())));
    if (EXTRA_LOGGING) console.log('RB: allowed blockchains: ', split);
    if (!split.length) split.push(10);
    return split;
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

async function tryAndRetry(
    input: any,
    action: (arg: any) => any,
    message: string,
    maxTries: number = 3,
    delayMs: number = 100
): Promise<any> {
    for (let n = 0; n < maxTries; n++) {
        console.log(`${message} attempt number ${n + 1}...`);
        try {
            const output = await action(input);
            if (output) {
                console.log(`${message} succeeded, returning ${output}`);
                return output;
            }

            if (delayMs) {
                await delay(delayMs);
            }
        } catch (e: any) {
            console.error('RB: Error fetching chain ID:', e);
        }
    }

    console.log(`${message} max retries exceeded`);
    return null;
}

export async function getChainId(walletClient: any) {
    return await tryAndRetry(
        walletClient,
        async (wc) => {
            return await wc.getChainId();
        },
        'getChainId'
    );
}

type Props = {
    enabled: boolean;
};

//TODO: this should be obsolete
export function getBlockchainNetworkName(chainId: number | string) {
    if (EXTRA_LOGGING) console.log('RB: getBlockchainNetworkName', chainId);

    //ensure number
    try {
        chainId = chainId ? parseInt(chainId.toString()) : 10;
    } catch {}

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
}

/**
 * The SwitchNetwork component is designed to ensure that the user's wallet is connected to the correct blockchain network.
 * If the user's current network does not match the preferred network settings, the component prompts them to switch.
 * This is crucial for interacting with contracts that are network-specific.
 * As of September 18, 2024, this component is not in use
 * @Author: Garo Nazarian
 *
 * Features:
 * - Checks the current network ID against the allowed configurations.
 * - Prompts the user to switch if they are on an unsupported network.
 * - Utilizes a modal to enforce network compliance before allowing further interaction.
 * - Retries fetching the network ID a configurable number of times in case of errors.
 *
 * Usage:
 * Should be placed in parts of the application where network-specific interactions occur, ensuring compliance before any transaction.
 */
export const SwitchNetwork = ({ enabled }: Props) => {
    if (EXTRA_LOGGING) console.log('RB: SwitchNetwork');
    // Modal Hook
    const [openModal, setOpenModal] = useState(false);
    const [preferredChainName, setPreferredChainName] = useState('');
    const [preferredChainID, setPreferredChainID] = useState(
        getAllowedChainsFromConfig()[0]
    );

    const { data: walletClient, isError } = useWalletClient();

    const { chain } = useNetwork();
    if (EXTRA_LOGGING) console.log('CHAIN:', chain);

    const { error, isLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork();

    console.log('pendingChainID;', pendingChainId);

    const voidFunction = () => {};

    const setSwitchNetwork = () => {
        if (EXTRA_LOGGING) console.log('RB: setSwitchNetwork');
        let allowed = getAllowedChainsFromConfig()[0];
        setPreferredChainID(allowed);
        setPreferredChainName(getBlockchainNetworkName(allowed));
    };

    useEffect(() => {
        setSwitchNetwork();
    }, []);

    useEffect(() => {
        const fetchChainId = async () => {
            setSwitchNetwork();
            if (EXTRA_LOGGING) console.log('RB: fetchChainId');
            if (walletClient && enabled) {
                try {
                    if (EXTRA_LOGGING) console.log('RB: calling getChainId');
                    const chainId =
                        chain?.id ?? (await getChainId(walletClient));
                    if (EXTRA_LOGGING)
                        console.log(
                            `RB: connected chain id is ${chainId}, preferred chain is ${preferredChainID}`
                        );

                    if (chainId === preferredChainID) {
                        setOpenModal(false);
                    } else {
                        setOpenModal(true);
                    }
                } catch (error) {
                    console.error('RB: Error fetching chain ID:', error);
                }
            }
        };
        fetchChainId();
    }, [walletClient]);

    return (
        <Modal isOpen={enabled} onClose={() => {}} isCentered>
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
                            Not Logged In
                        </Text>
                        <Text color={'white'}>
                            Please connect your wallet to continue using Hamza.
                        </Text>
                        {/*<Button*/}
                        {/*    backgroundColor={'primary.indigo.900'}*/}
                        {/*    color={'white'}*/}
                        {/*    height={'38px'}*/}
                        {/*    borderRadius={'full'}*/}
                        {/*    width="100%"*/}
                        {/*    disabled={!switchNetwork || isLoading}*/}
                        {/*    _hover={{*/}
                        {/*        backgroundColor: 'primary.indigo.800',*/}
                        {/*        transition: 'background-color 0.3s ease-in-out',*/}
                        {/*    }}*/}
                        {/*    _focus={{*/}
                        {/*        boxShadow: 'none',*/}
                        {/*        outline: 'none',*/}
                        {/*    }}*/}
                        {/*    onClick={() =>*/}
                        {/*        switchNetwork*/}
                        {/*            ? switchNetwork(preferredChainID)*/}
                        {/*            : voidFunction()*/}
                        {/*    }*/}
                        {/*>*/}
                        {/*    Switch to {preferredChainName}*/}
                        {/*</Button>*/}
                        <WalletConnectButton />
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
