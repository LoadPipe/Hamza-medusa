'use client';

import arbLogo from '@/images/chains/arbitrum-arb-logo.png';
import ethLogo from '@/images/chains/ethereum-eth-logo.png';
import optimismLogo from '@/images/chains/optimism-ethereum-op-logo.png';
import polygonLogo from '@/images/chains/polygon-matic-logo.png';
import baseLogo from '@/images/chains/base-logo-in-blue.png';

export const chainMap: {
    [key: string]: { id: number; logo: any; linkUrl: string };
} = {
    Sepolia: {
        id: 11155111,
        logo: ethLogo,
        linkUrl: '',
    },
    'OP Mainnet': {
        id: 10,
        logo: optimismLogo,
        linkUrl:
            'https://coinmarketcap.com/academy/article/how-to-bridge-to-optimism',
    },
    Base: {
        id: 8453,
        logo: baseLogo,
        linkUrl:
            'https://coinmarketcap.com/academy/article/how-to-bridge-to-base-mainnet',
    },
    'Arbitrum One': {
        id: 42151,
        logo: arbLogo,
        linkUrl:
            'https://coinmarketcap.com/academy/article/how-to-bridge-to-arbitrum',
    },
    Polygon: {
        id: 137,
        logo: polygonLogo,
        linkUrl: '',
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
