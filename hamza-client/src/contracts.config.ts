interface Currency {
    contract_address: string;
    precision: number;
}

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
            //address: '0x08EdF664EB5617d7eCf4F1ec74Ee49d9e99Fbd5f'
            address: '0x1fFc6ba4FcdfC3Ca72a53c2b64db3807B4A5aec8',
        },
        escrow_multicall: {
            address: '0xeE54D440927b94015325D79CD7CB51A5212d99a9',
        },
    },
    80002: {
        chain_name: 'amoy',
        master_switch: {
            address: '0x0',
        },
        massmarket_payment: {
            address: '0x0',
        },
        lite_switch: {
            //address: '0x08EdF664EB5617d7eCf4F1ec74Ee49d9e99Fbd5f'
            address: '0x0',
        },
        escrow_multicall: {
            address: '0xa8866FF28D26cdf312e5C902e8BFDbCf663a36ce',
        },
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
            address: '0x0',
        },
        escrow_multicall: {
            address: '0xeE54D440927b94015325D79CD7CB51A5212d99a9',
        },
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
            address: '0x0',
        },
        escrow_multicall: {
            address: '0xeE54D440927b94015325D79CD7CB51A5212d99a9',
        },
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
            //address: '0x5b691FFdc872eC40d63fe34f471e3Edb16dAE154'
            address: '0x49E5231A3aE4c4272257b87b944415CFD113D2c3',
        },
        escrow_multicall: {
            address: '0xdFc33612146333D809eD1a4ee7A79B9C776B86b4',
        },
        hns: {
            address: '0xDDa56f06D80f3D8E3E35159701A63753f39c3BCB',
        },
    },
    8453: {
        chain_name: 'base',
        master_switch: {
            address: '0x0',
        },
        massmarket_payment: {
            address: '0x0',
        },
        lite_switch: {
            //address: '0x08EdF664EB5617d7eCf4F1ec74Ee49d9e99Fbd5f'
            address: '0x0',
        },
        escrow_multicall: {
            address: '0x801c4C568DBfB540De91e6DD95b31d252765F7F8',
        },
    },
    137: {
        chain_name: 'polygon',
        master_switch: {
            address: '0x0',
        },
        massmarket_payment: {
            address: '0x0',
        },
        lite_switch: {
            //address: '0x08EdF664EB5617d7eCf4F1ec74Ee49d9e99Fbd5f'
            address: '0x0',
        },
        escrow_multicall: {
            address: '0xC4FaeAD225C62e5488dfE2dDD098A205c2f38759',
        },
    },
    42161: {
        chain_name: 'arbitrum',
        master_switch: {
            address: '0x0',
        },
        massmarket_payment: {
            address: '0x0',
        },
        lite_switch: {
            //address: '0x08EdF664EB5617d7eCf4F1ec74Ee49d9e99Fbd5f'
            address: '0x0',
        },
        escrow_multicall: {
            address: '0xaAa8a4393e72292043978a2EAa5A7061DfA3b413',
        },
    },
};

const getContractAddress = (contractId: string, chainId: number = 1) =>
    chainConfig[chainId] ? chainConfig[chainId][contractId]?.address ?? '' : '';

const getMasterSwitchAddress = (chainId: number = 1) =>
    chainConfig[chainId]
        ? chainConfig[chainId]?.master_switch?.address
        : undefined;

const getMassmarketPaymentAddress = (chainId: number = 1) =>
    chainConfig[chainId]
        ? chainConfig[chainId]?.massmarket_payment?.address
        : undefined;

export {
    getContractAddress,
    getMasterSwitchAddress,
    getMassmarketPaymentAddress,
};
