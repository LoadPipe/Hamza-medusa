import arbLogo from '@/images/chains/arbitrum-arb-logo.png';
import ethLogo from '@/images/chains/ethereum-eth-logo.png';
import optimismLogo from '@/images/chains/optimism-ethereum-op-logo.png';
import polygonLogo from '@/images/chains/polygon-matic-logo.png';
import baseLogo from '@/images/chains/base-logo-in-blue.png';
import bscLogo from '@/images/chains/bnb-logo.png';

enum ChainNames {
    Mainnet = 1,
    Optimism = 10,
    Polygon = 137,
    Base = 8453,
    Arbitrum = 42161,
    Amoy = 80002,
    Sepolia = 11155111,
    OpSepolia = 11155420,
    BaseSepolia = 84532,
    ScrollSepolia = 534351,
}

export const chainIdToName = (id: number): string => {
    if (typeof id !== 'number' || isNaN(id)) {
        console.warn(`Invalid chain ID: ${id}`);
        return 'Unknown Chain';
    }

    return (
        Object.entries(ChainNames).find(([, value]) => value === id)?.[0] ||
        'Unknown Chain'
    );
};

// Map chain IDs to their logos
export const getChainLogo = (id: number): string => {
    const logos: Record<number, string> = {
        1: ethLogo.src, // Ethereum Mainnet
        10: optimismLogo.src, // Optimism
        137: polygonLogo.src, // Polygon
        8453: baseLogo.src, // Base
        42161: arbLogo.src, // Arbitrum
        11155111: ethLogo.src, // Sepolia (fallback to Ethereum)
        11155420: optimismLogo.src, // OpSepolia (OP LOGO...)
        80002: polygonLogo.src, // Amoy (fallback to Polygon)
        84532: baseLogo.src, //Base Sepolia
        534351: ethLogo.src, //Scroll Sepolia
    };

    return logos[id] || ethLogo.src; // Default to Ethereum logo
};
