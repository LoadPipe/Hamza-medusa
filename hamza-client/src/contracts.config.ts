interface Currency {
    contract_address: string;
    precision: number;
}

/*
Mainnet eth:0x20823791a73f283d20B1cde299E738D5783499d8
Optimism: 0x214bef460Fda073a328aD02371C48E69Bd13442B'
*/

const chainConfig: any = {
    11155111: {
        chain_name: 'sepolia',
        master_switch: {
            address: '0x74b7284836F753101bD683C3843e95813b381f18',
        },
        massmarket_payment: {
            address: '0x3d9DbbD22E4903274171ED3e94F674Bb52bCF015',
        },
        lite_switch: {
            address: '0x671C78C756d67F972AE254B92174818148A8B405'
        },
        dao: {
            address: '0x8bA35513C3F5ac659907D222e3DaB38b20f8F52A'
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
        },
        dao: {
            address: '0x8bA35513C3F5ac659907D222e3DaB38b20f8F52A'
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
        },
        dao: {
            address: '0x20823791a73f283d20B1cde299E738D5783499d8'
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
        },
        dao: {
            address: '0x214bef460Fda073a328aD02371C48E69Bd13442B'
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
