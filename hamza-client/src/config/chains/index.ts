import { generateChainMap, generateChainNames } from './utils';

// Export types
export type {
    TokenPrecision,
    TokenConfig,
    ChainTokens,
    ChainMetadata,
    ChainConfig,
    ChainsConfig,
} from './types';

// Export main configuration
export { CHAINS_CONFIG } from './chain-config';

// Export utility functions
export {
    getSupportedChainIds,
    getChainConfig,
    generateChainMap,
    generateChainNames,
    getChainLogo,
    chainIdToName,
    getCurrencyAddress,
    getCurrencyPrecision,
    generateWagmiChainConfig,
    getAllowedChains,
    generateChainSelectOptions,
    getChainIdFromName,
    getChainLogoFromName,
    getChainInfoLinkUrlFromName,
    getChainTitleFromName,
    getChainNameFromId,
    isChainNameInChainMap,
} from './utils';

// Convenience exports for backward compatibility
export const chainMap = generateChainMap();
export const ChainNames = generateChainNames();