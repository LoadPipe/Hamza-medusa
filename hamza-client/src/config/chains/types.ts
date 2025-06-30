
export type TokenPrecision = {
    display: number;
    db: number;
    native: number;
}

export type TokenConfig = {
    contract_address: string;
    precision: TokenPrecision;
}

export type ChainTokens = {
    usdc: TokenConfig;
    usdt: TokenConfig;
    eth: TokenConfig;
}

export type ChainMetadata = {
    name: string;
    displayName: string;
    isTestnet: boolean;
    logo?: any;
    bridgeUrl?: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: {
        default: string;
        fallback?: string[];
    };
    blockExplorer: {
        name: string;
        url: string;
    };
}

export type ChainConfig = {
    chainId: number;
    metadata: ChainMetadata;
    tokens: ChainTokens;
    wagmiChain?: any;
}

export type ChainsConfig = {
    [chainId: number]: ChainConfig;
}
