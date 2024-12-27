export const escrowMulticallAbi = [
    {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'contractAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'currency',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes32',
                        name: 'id',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'address',
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'payer',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct PaymentInput[]',
                name: 'payments',
                type: 'tuple[]',
            },
        ],
        name: 'multipay',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        stateMutability: 'payable',
        type: 'receive',
    },
];
