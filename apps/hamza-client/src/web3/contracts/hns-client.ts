import { ethers } from 'ethers';
import { hnsAbi } from '@/web3/abi/hns-abi';
import { getContractAddress } from '@/contracts.config';

export class HnsClient {
    contractAddress: `0x${string}`;
    client: ethers.Contract;
    provider: ethers.Provider;
    tokens: { [id: string]: ethers.Contract } = {};

    constructor(chainId: number) {
        this.contractAddress = getContractAddress('hns', chainId);
        this.provider = new ethers.JsonRpcProvider(
            process.env.NEXT_PUBLIC_MAINNET_OP || `https://mainnet.optimism.io`
        );

        this.client = new ethers.Contract(
            this.contractAddress,
            hnsAbi,
            this.provider
        );
    }

    async getNameAndAvatar(
        address: string,
        coinType: number = 614
    ): Promise<{ name: string | null; avatar: string | null }> {
        try {
            const name = await this.client.getName(address, BigInt(coinType));
            const avatar = await this.client.getText(
                address,
                'avatar',
                BigInt(coinType)
            );
            return { name, avatar };
        } catch (error) {
            console.error('Error fetching name or avatar:', error);
            return { name: null, avatar: null };
        }
    }
}
