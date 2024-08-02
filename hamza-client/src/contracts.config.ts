interface Currency {
    contract_address: string;
    precision: number;
}

const chainConfig: any = {
    11155111: {
        chain_name: 'sepolia',
        master_switch: {
            //address: '0x0Ac64d6d09bB3B7ab6999f9BE3b9f017220fb1e9',
            address: '0x74b7284836F753101bD683C3843e95813b381f18',
        },
        massmarket_payment: {
            address: '0x3d9DbbD22E4903274171ED3e94F674Bb52bCF015',
        },
        lite_switch: {
            address: '0x671C78C756d67F972AE254B92174818148A8B405'
        }
    },
    11155420: {
        chain_name: 'op-sepolia',
        master_switch: {
            address: '0x4B36e6130b4931DCc5A64c4bca366790aAA068d1',
        },
        massmarket_payment: {
            address: '0x0',
        },
        lite_switch: {
            address: '0x0'
        }
    },
    1: {
        chain_name: 'mainnet',
        master_switch: {
            address: '',
        },
        massmarket_payment: {
            address: '0x0',
        },
        lite_switch: {
            address: '0x0'
        }
    },
    10: {
        chain_name: 'optimism',
        master_switch: {
            address: '',
        },
        massmarket_payment: {
            address: '0x0',
        },
        lite_switch: {
            address: '0xa8866FF28D26cdf312e5C902e8BFDbCf663a36ce'
        }
    },
};

const getContractAddress = (contractId: string, chainId: number = 1) =>
    chainConfig[chainId]
        ? chainConfig[chainId][contractId]?.address ?? ''
        : '';

const getMasterSwitchAddress = (chainId: number = 1) =>
    chainConfig[chainId]
        ? chainConfig[chainId]?.master_switch?.address
        : undefined;

const getMassmarketPaymentAddress = (chainId: number = 1) =>
    chainConfig[chainId]
        ? chainConfig[chainId]?.massmarket_payment?.address
        : undefined;

export { getContractAddress, getMasterSwitchAddress, getMassmarketPaymentAddress };
