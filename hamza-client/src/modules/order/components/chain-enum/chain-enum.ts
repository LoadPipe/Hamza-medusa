enum ChainNames {
    Sepolia = 11155111,
    OpSepolia = 11155420,
    Amoy = 80002,
    Mainnet = 1,
    Optimism = 10,
    Base = 8453,
    Polygon = 137,
    Arbitrum = 42161,
}

export const chainIdToName = (id: number): string => {
    // Validate that id is a number
    if (typeof id !== 'number' || isNaN(id)) {
        console.warn(`Invalid chain ID: ${id}`);
        return 'Unknown Chain'; // Fallback name for invalid input
    }

    // Find the chain name or return a default value
    const chainName = Object.entries(ChainNames).find(([, value]) => value === id)?.[0];
    if (!chainName) {
        console.warn(`Chain ID not found: ${id}`);
        return 'Unknown Chain'; // Fallback name for unknown chain ID
    }

    return chainName;
};
