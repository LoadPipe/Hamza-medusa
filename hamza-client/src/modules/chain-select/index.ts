'use client';

import arbLogo from '@/images/chains/arbitrum-arb-logo.png';
import ethLogo from '@/images/chains/ethereum-eth-logo.png';
import optimismLogo from '@/images/chains/optimism-ethereum-op-logo.png';
import polygonLogo from '@/images/chains/polygon-matic-logo.png';
import baseLogo from '@/images/chains/base-logo-in-blue.png';
import bscLogo from '@/images/chains/bnb-logo.png';

export const chainMap: {
    [key: string]: { id: number; logo: any; linkUrl: string; title: string };
} = {
    Sepolia: {
        id: 11155111,
        logo: ethLogo,
        linkUrl: '',
        title: 'Sepolia',
    },
    'OP Mainnet': {
        id: 10,
        logo: optimismLogo,
        linkUrl:
            'https://coinmarketcap.com/academy/article/how-to-bridge-to-optimism',
        title: 'Optimism',
    },
    'BNB Smart Chain': {
        id: 56,
        logo: bscLogo,
        linkUrl: 'https://www.bnbchain.org/en/bnb-chain-bridge',
        title: 'BNB Smart Chain',
    },
    Polygon: {
        id: 137,
        logo: polygonLogo,
        linkUrl:
            'https://coinmarketcap.com/academy/article/how-to-bridge-to-polygon',
        title: 'Polygon',
    },
    Base: {
        id: 8453,
        logo: baseLogo,
        linkUrl:
            'https://coinmarketcap.com/academy/article/how-to-bridge-to-base-mainnet',
        title: 'Base',
    },
    'Base Sepolia': {
        id: 84532,
        logo: baseLogo,
        linkUrl:
            'https://coinmarketcap.com/academy/article/how-to-bridge-to-base-mainnet',
        title: 'Base Sepolia',
    },
    'Scroll Sepolia': {
        id: 534351,
        logo: ethLogo,
        linkUrl: '',
        title: 'Scroll Sepolia',
    },
    'Arbitrum One': {
        id: 42151,
        logo: arbLogo,
        linkUrl:
            'https://coinmarketcap.com/academy/article/how-to-bridge-to-arbitrum',
        title: 'Arbitrum',
    },
};

/**
 * Returns the chain ID for a given network name.
 */
export const getChainIdFromName = (networkName: string): number | null => {
    return chainMap[networkName]?.id ?? null;
};

/**
 * Returns the chain logo for a given network name.
 */
export const getChainLogoFromName = (networkName: string): any => {
    return chainMap[networkName]?.logo;
};

/**
 * Returns the informational link url for a given network name.
 */
export const getChainInfoLinkUrlFromName = (networkName: string): string => {
    return chainMap[networkName]?.linkUrl ?? '';
};

/**
 * Returns the title for a given network name.
 */
export const getChainTitleFromName = (networkName: string): string => {
    return chainMap[networkName]?.title ?? '';
};

/**
 * Returns the chain name for a given chain ID.
 */
export const getChainNameFromId = (chainId: number): string | null => {
    return (
        Object.keys(chainMap).find((key) => chainMap[key].id === chainId) ??
        null
    );
};

/**
 * check networkName is in chainMap
 */
export const isChainNameInChainMap = (networkName?: string): boolean => {
    return networkName ? chainMap[networkName] !== undefined : false;
};
