const chainConfig: any = {
    //Sepolia
    11155111: {
        chain_name: 'sepolia',
        usdc: {
            contract_address: '0x822585D682B973e4b1B47C0311f162b29586DD02', //'0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
            precision: {
                display: 2,
                db: 2,
                native: 12,
            },
        },
        usdt: {
            contract_address: '0xbe9fe9b717c888a2b2ca0a6caa639afe369249c5',
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
    //Optimism Testnet
    11155420: {
        chain_name: 'op-sepolia',
        usdc: {
            contract_address: '0x45B24160Da2cA92673B6CAf4dFD11f60aDac73E3',
            precision: {
                display: 2,
                db: 2,
                native: 12,
            },
        },
        usdt: {
            contract_address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
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
    //Polygon Amoy testnet
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
    //ETH mainnet
    1: {
        chain_name: 'mainnet',
        usdc: {
            contract_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            precision: {
                display: 2,
                db: 2,
                native: 6,
            },
        },
        usdt: {
            contract_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
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
    //Optimism
    10: {
        chain_name: 'optimism',
        usdc: {
            contract_address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
            precision: {
                display: 2,
                db: 2,
                native: 6,
            },
        },
        usdt: {
            contract_address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
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
    //BSC
    56: {
        chain_name: 'binance smartchain',
        usdc: {
            contract_address: '0x8965349fb649a33a30cbfda057d8ec2c48abe2a2',
            precision: {
                display: 2,
                db: 2,
                native: 18,
            },
        },
        usdt: {
            contract_address: '0x2B90E061a517dB2BbD7E39Ef7F733Fd234B494CA',
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
    //Polygon
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
    //Polygon zkEVM
    1101: {
        chain_name: 'polygon zkEVM',
        usdc: {
            contract_address: '0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035',
            precision: {
                display: 2,
                db: 2,
                native: 6,
            },
        },
        usdt: {
            contract_address: '0x1e4a5963abfd975d8c9021ce480b42188849d41d',
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
    //Mantle
    5000: {
        chain_name: 'mantle',
        usdc: {
            contract_address: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
            precision: {
                display: 2,
                db: 2,
                native: 6,
            },
        },
        usdt: {
            contract_address: '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE',
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
    //Base
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
    //Base Sepolia
    84532: {
        chain_name: 'base sepolia',
        usdc: {
            contract_address: '0x5deac602762362fe5f135fa5904351916053cf70',
            precision: {
                db: 2,
                native: 6,
                display: 2,
            },
        },
        usdt: {
            contract_address: '0x8d9cb8f3191Fd685e2C14D2AC3Fb2b16D44EAfc3',
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
    //Arbitrum
    42161: {
        chain_name: 'polygon',
        usdc: {
            contract_address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
            precision: {
                db: 2,
                native: 6,
                display: 2,
            },
        },
        usdt: {
            contract_address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
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
    //Scroll
    534352: {
        chain_name: 'scroll',
        usdc: {
            contract_address: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
            precision: {
                display: 2,
                db: 2,
                native: 6,
            },
        },
        usdt: {
            contract_address: '0xf55bec9cafdbe8730f096aa55dad6d22d44099df',
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
    //Scroll Sepolia
    534351: {
        chain_name: 'scroll sepolia',
        usdc: {
            contract_address: '0xacbc1ec300bbea9a9fd0a661cd717d8519c5fca5',
            precision: {
                display: 2,
                db: 2,
                native: 6,
            },
        },
        usdt: {
            contract_address: '0x28cb409154beb695d5e9ffa85da8f1564aa3cd76',
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
