import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    sepolia,
    optimism,
    base,
    polygon,
    polygonAmoy,
    arbitrum,
    bsc,
} from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
    appName: 'My RainbowKit App', //TODO: change these defaults
    projectId: 'YOUR_PROJECT_ID',
    chains: [sepolia, polygonAmoy],
    ssr: true, // If your dApp uses server side rendering (SSR)
});
