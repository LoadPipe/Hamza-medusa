const chainConfig: any = {
    11155111: {
        chain_name: 'sepolia',
        usdc: {
            contract_address: '0x822585D682B973e4b1B47C0311f162b29586DD02', //'0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
            precision: {
                db: 2,
                native: 12,
                display: 2,
            },
        },
        usdt: {
            contract_address: '0xbe9fe9b717c888a2b2ca0a6caa639afe369249c5',
            precision: {
                db: 2,
                native: 6,
                display: 2,
            },
        },
        eth: {
            contract_address: '0x0000000000000000000000000000000000000000',
            precision: {
                db: 8,
                native: 18,
                display: 6,
            },
        },
    },
    11155420: {
        chain_name: 'op-sepolia',
        usdc: {
            contract_address: '0x45B24160Da2cA92673B6CAf4dFD11f60aDac73E3',
            precision: {
                db: 2,
                native: 12,
                display: 2,
            },
        },
        usdt: {
            contract_address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
            precision: {
                db: 2,
                native: 6,
                display: 2,
            },
        },
        eth: {
            contract_address: '0x0000000000000000000000000000000000000000',
            precision: {
                db: 8,
                native: 18,
                display: 6,
            },
        },
    },
    80002: {
        chain_name: 'amoy',
        usdc: {
            contract_address: '0xA4b440AAA9A7bd454d775D3f38194D59A8ADCC45',
            precision: {
                display: 2,
                db: 2,
                native: 12,
            },
        },
        usdt: {
            contract_address: '0x6718F8c7686B4C1a756cf5028d3b66b74E432596',
            precision: {
                display: 2,
                db: 2,
                native: 6,
            },
        },
        eth: {
            contract_address: '0x0000000000000000000000000000000000000000',
            precision: {
                display: 5,
                db: 8,
                native: 18,
            },
        },
    },
    1: {
        chain_name: 'mainnet',
        usdc: {
            contract_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            precision: {
                db: 2,
                native: 6,
                display: 2,
            },
        },
        usdt: {
            contract_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            precision: {
                db: 2,
                native: 6,
                display: 2,
            },
        },
        eth: {
            contract_address: '0x0000000000000000000000000000000000000000',
            precision: {
                db: 8,
                native: 18,
                display: 6,
            },
        },
    },
    10: {
        chain_name: 'optimism',
        usdc: {
            contract_address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
            precision: {
                db: 2,
                native: 6,
                display: 2,
            },
        },
        usdt: {
            contract_address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
            precision: {
                db: 2,
                native: 6,
                display: 2,
            },
        },
        eth: {
            contract_address: '0x0000000000000000000000000000000000000000',
            precision: {
                db: 8,
                native: 18,
                display: 6,
            },
        },
    },
    8453: {
        chain_name: 'base',
        usdc: {
            contract_address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
            precision: {
                db: 2,
                native: 6,
                display: 2,
            },
        },
        usdt: {
            contract_address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
            precision: {
                db: 2,
                native: 6,
                display: 2,
            },
        },
        eth: {
            contract_address: '0x0000000000000000000000000000000000000000',
            precision: {
                db: 8,
                native: 18,
                display: 6,
            },
        },
    },
    137: {
        chain_name: 'polygon',
        usdc: {
            contract_address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
            precision: {
                db: 2,
                native: 6,
                display: 2,
            },
        },
        usdt: {
            contract_address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
            precision: {
                db: 2,
                native: 6,
                display: 2,
            },
        },
        eth: {
            contract_address: '0x0000000000000000000000000000000000000000',
            precision: {
                db: 8,
                native: 18,
                display: 6,
            },
        },
    },
};

const getCurrencyAddress = (currencyId: string, chainId: number = 1) =>
    chainConfig[chainId]
        ? chainConfig[chainId][currencyId]?.contract_address ?? ''
        : '';

const getCurrencyPrecision = (currencyId: string, chainId: number = 1) =>
    chainConfig[chainId]
        ? chainConfig[chainId][currencyId]?.precision
        : undefined;

export { getCurrencyAddress, getCurrencyPrecision };
