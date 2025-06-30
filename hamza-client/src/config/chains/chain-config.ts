import arbLogo from '@/images/chains/arbitrum-arb-logo.png';
import ethLogo from '@/images/chains/ethereum-eth-logo.png';
import optimismLogo from '@/images/chains/optimism-ethereum-op-logo.png';
import polygonLogo from '@/images/chains/polygon-matic-logo.png';
import baseLogo from '@/images/chains/base-logo-in-blue.png';
import bscLogo from '@/images/chains/bnb-logo.png';
import avalancheLogo from '@/images/chains/avalanche.png';
import scrollLogo from '@/images/chains/ethereum-eth-logo.png';
import mantleLogo from '@/images/chains/ethereum-eth-logo.png';
import zkevmLogo from '@/images/chains/polygon-matic-logo.png';

// Import wagmi chains
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
    scrollSepolia,
    avalanche,
} from 'wagmi/chains';
import { ChainsConfig } from './types';

// Custom testnet chain definitions
const amoy = {
    id: 80002,
    name: 'Polygon Amoy',
    network: 'Polygon Amoy',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://rpc-amoy.polygon.technology'] },
        public: { http: ['https://rpc-amoy.polygon.technology/'] },
    },
    blockExplorers: {
        default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 3127388,
        },
    },
    testnet: true,
};

const opSepolia = {
    id: 11155420,
    name: 'OP Sepolia',
    network: 'OP Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://sepolia.optimism.io'] },
        public: { http: ['https://sepolia.optimism.io'] },
    },
    blockExplorers: {
        default: { name: 'OP Sepolia Explorer', url: 'https://sepolia-optimism.etherscan.io' },
    },
    testnet: true,
};

export const CHAINS_CONFIG: ChainsConfig = {
    // Ethereum Mainnet
    1: {
        chainId: 1,
        metadata: {
            name: 'mainnet',
            displayName: 'Ethereum',
            isTestnet: false,
            logo: ethLogo,
            nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://ethereum-rpc.publicnode.com',
                fallback: [
                    'https://ethereum.publicnode.com',
                    'https://rpc.ankr.com/eth'
                ],
            },
            blockExplorer: {
                name: 'Etherscan',
                url: 'https://etherscan.io',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                precision: { display: 2, db: 2, native: 6 },
            },
            usdt: {
                contract_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
                precision: { display: 2, db: 2, native: 6 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 5, db: 8, native: 18 },
            },
        },
        wagmiChain: mainnet,
    },

    // Optimism
    10: {
        chainId: 10,
        metadata: {
            name: 'optimism',
            displayName: 'Optimism',
            isTestnet: false,
            logo: optimismLogo,
            bridgeUrl: 'https://coinmarketcap.com/academy/article/how-to-bridge-to-optimism',
            nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://mainnet.optimism.io',
                fallback: [
                    'https://optimism.publicnode.com',
                    'https://rpc.ankr.com/optimism'
                ],
            },
            blockExplorer: {
                name: 'Optimistic Etherscan',
                url: 'https://optimistic.etherscan.io',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
                precision: { display: 2, db: 2, native: 6 },
            },
            usdt: {
                contract_address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
                precision: { display: 2, db: 2, native: 6 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 5, db: 8, native: 18 },
            },
        },
        wagmiChain: optimism,
    },

    // BSC
    56: {
        chainId: 56,
        metadata: {
            name: 'binance smartchain',
            displayName: 'BNB Smart Chain',
            isTestnet: false,
            logo: bscLogo,
            bridgeUrl: 'https://www.bnbchain.org/en/bnb-chain-bridge',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://bsc-dataseed.binance.org',
                fallback: [
                    'https://bsc.publicnode.com',
                    'https://rpc.ankr.com/bsc'
                ],
            },
            blockExplorer: {
                name: 'BscScan',
                url: 'https://bscscan.com',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0x8965349fb649a33a30cbfda057d8ec2c48abe2a2',
                precision: { display: 2, db: 2, native: 18 },
            },
            usdt: {
                contract_address: '0x2B90E061a517dB2BbD7E39Ef7F733Fd234B494CA',
                precision: { display: 2, db: 2, native: 6 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 5, db: 8, native: 18 },
            },
        },
        wagmiChain: bsc,
    },

    // Polygon
    137: {
        chainId: 137,
        metadata: {
            name: 'polygon',
            displayName: 'Polygon',
            isTestnet: false,
            logo: polygonLogo,
            bridgeUrl: 'https://coinmarketcap.com/academy/article/how-to-bridge-to-polygon',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://polygon-rpc.com',
                fallback: [
                    'https://polygon.publicnode.com',
                    'https://rpc.ankr.com/polygon'
                ],
            },
            blockExplorer: {
                name: 'PolygonScan',
                url: 'https://polygonscan.com',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
                precision: { display: 2, db: 2, native: 6 },
            },
            usdt: {
                contract_address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                precision: { display: 2, db: 2, native: 6 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 6, db: 8, native: 18 },
            },
        },
        wagmiChain: polygon,
    },

    // Polygon zkEVM
    1101: {
        chainId: 1101,
        metadata: {
            name: 'polygon zkEVM',
            displayName: 'Polygon zkEVM',
            isTestnet: false,
            logo: zkevmLogo,
            nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://zkevm-rpc.com',
                fallback: ['https://rpc.ankr.com/polygon_zkevm'],
            },
            blockExplorer: {
                name: 'PolygonScan zkEVM',
                url: 'https://zkevm.polygonscan.com',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035',
                precision: { display: 2, db: 2, native: 6 },
            },
            usdt: {
                contract_address: '0x1e4a5963abfd975d8c9021ce480b42188849d41d',
                precision: { display: 2, db: 2, native: 6 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 5, db: 8, native: 18 },
            },
        },
        wagmiChain: null,
    },

    // Mantle
    5000: {
        chainId: 5000,
        metadata: {
            name: 'mantle',
            displayName: 'Mantle',
            isTestnet: false,
            logo: mantleLogo,
            nativeCurrency: {
                name: 'MNT',
                symbol: 'MNT',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://1rpc.io/mantle',
                fallback: ['https://mantle.publicnode.com'],
            },
            blockExplorer: {
                name: 'Mantle Explorer',
                url: 'https://explorer.mantle.xyz',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
                precision: { display: 2, db: 2, native: 6 },
            },
            usdt: {
                contract_address: '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE',
                precision: { display: 2, db: 2, native: 6 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 5, db: 8, native: 18 },
            },
        },
        wagmiChain: mantle,
    },

    // Base
    8453: {
        chainId: 8453,
        metadata: {
            name: 'base',
            displayName: 'Base',
            isTestnet: false,
            logo: baseLogo,
            bridgeUrl: 'https://coinmarketcap.com/academy/article/how-to-bridge-to-base-mainnet',
            nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://mainnet.base.org',
                fallback: [
                    'https://base.publicnode.com',
                    'https://rpc.ankr.com/base'
                ],
            },
            blockExplorer: {
                name: 'BaseScan',
                url: 'https://basescan.org',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
                precision: { display: 2, db: 2, native: 6 },
            },
            usdt: {
                contract_address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
                precision: { display: 2, db: 2, native: 6 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 6, db: 8, native: 18 },
            },
        },
        wagmiChain: base,
    },

    // Arbitrum
    42161: {
        chainId: 42161,
        metadata: {
            name: 'arbitrum',
            displayName: 'Arbitrum One',
            isTestnet: false,
            logo: arbLogo,
            bridgeUrl: 'https://coinmarketcap.com/academy/article/how-to-bridge-to-arbitrum',
            nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://arb1.arbitrum.io/rpc',
                fallback: [
                    'https://arbitrum.publicnode.com',
                    'https://rpc.ankr.com/arbitrum'
                ],
            },
            blockExplorer: {
                name: 'Arbiscan',
                url: 'https://arbiscan.io',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
                precision: { display: 2, db: 2, native: 6 },
            },
            usdt: {
                contract_address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
                precision: { display: 2, db: 2, native: 6 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 6, db: 8, native: 18 },
            },
        },
        wagmiChain: arbitrum,
    },

    // Scroll
    534352: {
        chainId: 534352,
        metadata: {
            name: 'scroll',
            displayName: 'Scroll',
            isTestnet: false,
            logo: scrollLogo,
            nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://rpc.scroll.io/',
                fallback: ['https://scroll.publicnode.com'],
            },
            blockExplorer: {
                name: 'Scrollscan',
                url: 'https://scrollscan.com',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
                precision: { display: 2, db: 2, native: 6 },
            },
            usdt: {
                contract_address: '0xf55bec9cafdbe8730f096aa55dad6d22d44099df',
                precision: { display: 2, db: 2, native: 6 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 5, db: 8, native: 18 },
            },
        },
        wagmiChain: scroll,
    },

    // Avalanche
    43114: {
        chainId: 43114,
        metadata: {
            name: 'avalanche',
            displayName: 'Avalanche',
            isTestnet: false,
            logo: avalancheLogo,
            bridgeUrl: 'https://coinmarketcap.com/academy/article/how-to-bridge-to-avalanche',
            nativeCurrency: {
                name: 'AVAX',
                symbol: 'AVAX',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://api.avax.network/ext/bc/C/rpc',
                fallback: [
                    'https://avalanche-rpc.publicnode.com',
                    'https://rpc.ankr.com/avalanche'
                ],
            },
            blockExplorer: {
                name: 'Snowtrace',
                url: 'https://snowtrace.io',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
                precision: { display: 2, db: 2, native: 6 },
            },
            usdt: {
                contract_address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
                precision: { display: 2, db: 2, native: 6 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 5, db: 8, native: 18 },
            },
        },
        wagmiChain: avalanche,
    },

    // === TESTNETS ===

    // Sepolia
    11155111: {
        chainId: 11155111,
        metadata: {
            name: 'sepolia',
            displayName: 'Sepolia',
            isTestnet: true,
            logo: ethLogo,
            nativeCurrency: {
                name: 'Sepolia Ether',
                symbol: 'ETH',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://ethereum-sepolia-rpc.publicnode.com',
                fallback: ['https://rpc.sepolia.org'],
            },
            blockExplorer: {
                name: 'Sepolia Etherscan',
                url: 'https://sepolia.etherscan.io',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0x822585D682B973e4b1B47C0311f162b29586DD02',
                precision: { display: 2, db: 2, native: 12 },
            },
            usdt: {
                contract_address: '0xbe9fe9b717c888a2b2ca0a6caa639afe369249c5',
                precision: { display: 2, db: 2, native: 6 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 5, db: 8, native: 18 },
            },
        },
        wagmiChain: sepolia,
    },

    //Scroll Sepolia
    534351: {
        chainId: 534351,
        metadata: {
            name: 'scroll sepolia',
            displayName: 'Scroll Sepolia',
            isTestnet: true,
            logo: scrollLogo,
            nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://sepolia-rpc.scroll.io',
                fallback: [
                    'https://scroll-sepolia-rpc.publicnode.com',
                    'https://rpc.ankr.com/scroll_sepolia_testnet',
                    'https://scroll-sepolia.chainstacklabs.com'
                ],
            },
            blockExplorer: {
                name: 'Scrollscan',
                url: 'https://sepolia.scrollscan.com',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
                precision: { display: 2, db: 2, native: 6 },
            },
            usdt: {
                contract_address: '0xf55bec9cafdbe8730f096aa55dad6d22d44099df',
                precision: { display: 2, db: 2, native: 6 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 5, db: 8, native: 18 },
            },
        },
        wagmiChain: scrollSepolia,
    },

    // OP Sepolia
    11155420: {
        chainId: 11155420,
        metadata: {
            name: 'op-sepolia',
            displayName: 'OP Sepolia',
            isTestnet: true,
            logo: optimismLogo,
            nativeCurrency: {
                name: 'Sepolia Ether',
                symbol: 'ETH',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://sepolia.optimism.io',
                fallback: [],
            },
            blockExplorer: {
                name: 'OP Sepolia Explorer',
                url: 'https://sepolia-optimism.etherscan.io',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0x45B24160Da2cA92673B6CAf4dFD11f60aDac73E3',
                precision: { display: 2, db: 2, native: 12 },
            },
            usdt: {
                contract_address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
                precision: { display: 2, db: 2, native: 6 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 5, db: 8, native: 18 },
            },
        },
        wagmiChain: opSepolia,
    },

    // Polygon Amoy
    80002: {
        chainId: 80002,
        metadata: {
            name: 'amoy',
            displayName: 'Polygon Amoy',
            isTestnet: true,
            logo: polygonLogo,
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://rpc-amoy.polygon.technology',
                fallback: [],
            },
            blockExplorer: {
                name: 'Polygon Amoy Explorer',
                url: 'https://amoy.polygonscan.com',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0xA4b440AAA9A7bd454d775D3f38194D59A8ADCC45',
                precision: { display: 2, db: 2, native: 12 },
            },
            usdt: {
                contract_address: '0x6718F8c7686B4C1a756cf5028d3b66b74E432596',
                precision: { display: 2, db: 2, native: 6 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 5, db: 8, native: 18 },
            },
        },
        wagmiChain: amoy,
    },

    // Base Sepolia
    84532: {
        chainId: 84532,
        metadata: {
            name: 'base-sepolia',
            displayName: 'Base Sepolia',
            isTestnet: true,
            logo: baseLogo,
            bridgeUrl: 'https://coinmarketcap.com/academy/article/how-to-bridge-to-base-mainnet',
            nativeCurrency: {
                name: 'Sepolia Ether',
                symbol: 'ETH',
                decimals: 18,
            },
            rpcUrls: {
                default: 'https://sepolia.base.org',
                fallback: [],
            },
            blockExplorer: {
                name: 'Base Sepolia Explorer',
                url: 'https://sepolia-explorer.base.org',
            },
        },
        tokens: {
            usdc: {
                contract_address: '0xD06c3b9Ee65245cE34089E8a55F0312500512455',
                precision: { display: 2, db: 2, native: 4 },
            },
            usdt: {
                contract_address: '0x0baD6a5a59F3ca21Fb3b053d0a083F9DB37c1c1d',
                precision: { display: 2, db: 2, native: 18 },
            },
            eth: {
                contract_address: '0x0000000000000000000000000000000000000000',
                precision: { display: 6, db: 8, native: 18 },
            },
        },
    },
};