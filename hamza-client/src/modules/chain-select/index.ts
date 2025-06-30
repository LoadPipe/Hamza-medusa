'use client';

import {
    chainMap,
    getChainIdFromName,
    getChainLogoFromName,
    getChainInfoLinkUrlFromName,
    getChainTitleFromName,
    getChainNameFromId,
    isChainNameInChainMap,
} from '@/config/chains';

// Everything is generated from the centralized configuration
// Export the generated chainMap (replaces manual chainMap)
export { chainMap };

// Export utility functions (now powered by centralized config)
export {
    getChainIdFromName,
    getChainLogoFromName,
    getChainInfoLinkUrlFromName,
    getChainTitleFromName,
    getChainNameFromId,
    isChainNameInChainMap,
};