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
            address: '0xF472c864DBC867D1439f1d45F3C9a1108Ab8b0a7',
        },
        dao: {
            address: '0x8bA35513C3F5ac659907D222e3DaB38b20f8F52A',
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
            address: '0xF472c864DBC867D1439f1d45F3C9a1108Ab8b0a7',
        },
        dao: {
            address: '0x8bA35513C3F5ac659907D222e3DaB38b20f8F52A',
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
            address: '0xF472c864DBC867D1439f1d45F3C9a1108Ab8b0a7',
        },
        dao: {
            address: '0x20823791a73f283d20B1cde299E738D5783499d8',
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
            address: '0xF472c864DBC867D1439f1d45F3C9a1108Ab8b0a7',
        },
        dao: {
            address: '0x214bef460Fda073a328aD02371C48E69Bd13442B',
        },
        hns: {
            address: '0xDDa56f06D80f3D8E3E35159701A63753f39c3BCB',
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
