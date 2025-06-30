import { CHAINS_CONFIG } from './chain-config';
import { ChainConfig } from './types';

/**
 * Get all supported chain IDs
 */
export const getSupportedChainIds = (includeTestnets: boolean = true): number[] => {
    return Object.keys(CHAINS_CONFIG)
        .map(Number)
        .filter(chainId => {
            if (!includeTestnets) {
                return !CHAINS_CONFIG[chainId]?.metadata.isTestnet;
            }
            return true;
        });
};

/**
 * Get chain configuration by ID
 */
export const getChainConfig = (chainId: number): ChainConfig | undefined => {
    return CHAINS_CONFIG[chainId];
};

/**
 * Generate chainMap for chain-select module (replaces manual chainMap)
 */
export const generateChainMap = () => {
    const chainMap: {
        [key: string]: { id: number; logo: any; linkUrl: string; title: string };
    } = {};

    Object.values(CHAINS_CONFIG).forEach(config => {
        chainMap[config.metadata.displayName] = {
            id: config.chainId,
            logo: config.metadata.logo,
            linkUrl: config.metadata.bridgeUrl || '',
            title: config.metadata.displayName,
        };
    });

    return chainMap;
};

/**
 * Generate ChainNames enum object (replaces manual enum)
 */
export const generateChainNames = () => {
    const chainNames: { [key: string]: number } = {};

    Object.values(CHAINS_CONFIG).forEach(config => {
        const enumKey = config.metadata.displayName
            .replace(/\s+/g, '')
            .replace(/[^a-zA-Z0-9]/g, '');

        chainNames[enumKey] = config.chainId;
    });

    return chainNames;
};

/**
 * Get chain logo by ID (replaces getChainLogo function)
 */
export const getChainLogo = (chainId: number): string => {
    const config = CHAINS_CONFIG[chainId];
    return config?.metadata.logo?.src || CHAINS_CONFIG[1]?.metadata.logo?.src || '';
};

/**
 * Get chain name by ID (replaces chainIdToName function)
 */
export const chainIdToName = (chainId: number): string => {
    if (typeof chainId !== 'number' || isNaN(chainId)) {
        console.warn(`Invalid chain ID: ${chainId}`);
        return 'Unknown Chain';
    }

    const config = CHAINS_CONFIG[chainId];
    return config?.metadata.displayName || 'Unknown Chain';
};

/**
 * Currency utility functions (replaces currency.config.ts)
 */
export const getCurrencyAddress = (currencyId: string, chainId: number = 1): string => {
    if (currencyId === 'btc') return '';

    const config = CHAINS_CONFIG[chainId];
    if (!config) return '';

    const token = config.tokens[currencyId as keyof typeof config.tokens];
    return token?.contract_address || '';
};

export const getCurrencyPrecision = (currencyId: string, chainId: number = 1) => {
    if (currencyId === 'btc') return { display: 8, db: 8, native: 8 };

    const config = CHAINS_CONFIG[chainId];
    if (!config) return { display: 2, db: 2, native: 2 };

    const token = config.tokens[currencyId as keyof typeof config.tokens];
    return token?.precision || { display: 2, db: 2, native: 2 };
};

/**
 * Generate Wagmi chain configuration (replaces manual chainConfig in rainbow-utils)
 */
export const generateWagmiChainConfig = () => {
    const wagmiConfig: { [key: string]: any } = {};

    Object.values(CHAINS_CONFIG).forEach(config => {
        if (config.wagmiChain) {
            wagmiConfig[config.metadata.name] = config.wagmiChain;
            wagmiConfig[config.chainId] = config.wagmiChain;
        }
    });

    return wagmiConfig;
};

/**
 * Get allowed chains from environment and filter by configuration
 */
export const getAllowedChains = (): any[] => {
    const allowedChainIds = (process.env.NEXT_PUBLIC_ALLOWED_BLOCKCHAINS ?? '').split(',');
    const wagmiConfig = generateWagmiChainConfig();

    if (allowedChainIds.length === 0 || allowedChainIds[0] === '') {
        // Default to sepolia if no chains specified
        return [wagmiConfig[11155111]].filter(Boolean);
    }

    return allowedChainIds
        .map(chainId => wagmiConfig[parseInt(chainId.trim())])
        .filter(Boolean);
};

/**
 * Generate all chain select options for dropdowns
 */
export const generateChainSelectOptions = (includeTestnets: boolean = true) => {
    return getSupportedChainIds(includeTestnets).map(chainId => {
        const config = CHAINS_CONFIG[chainId];
        if (!config) return null;

        return {
            chainId,
            name: config.metadata.name,
            displayName: config.metadata.displayName,
            logo: config.metadata.logo,
            isTestnet: config.metadata.isTestnet,
            bridgeUrl: config.metadata.bridgeUrl,
        };
    }).filter(Boolean);
};

/**
 * Chain helper functions for existing code compatibility
 */
export const getChainIdFromName = (networkName: string): number | null => {
    const chainMap = generateChainMap();
    return chainMap[networkName]?.id ?? null;
};

export const getChainLogoFromName = (networkName: string): any => {
    const chainMap = generateChainMap();
    return chainMap[networkName]?.logo;
};

export const getChainInfoLinkUrlFromName = (networkName: string): string => {
    const chainMap = generateChainMap();
    return chainMap[networkName]?.linkUrl ?? '';
};

export const getChainTitleFromName = (networkName: string): string => {
    const chainMap = generateChainMap();
    return chainMap[networkName]?.title ?? '';
};

export const getChainNameFromId = (chainId: number): string | null => {
    const config = CHAINS_CONFIG[chainId];
    return config?.metadata.displayName || null;
};

export const isChainNameInChainMap = (networkName?: string): boolean => {
    if (!networkName) return false;
    const chainMap = generateChainMap();
    return chainMap[networkName] !== undefined;
};