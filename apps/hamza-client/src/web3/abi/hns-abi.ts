export const hnsAbi = [
    {
        inputs: [
            { internalType: 'address', name: '_addr', type: 'address' },
            { internalType: 'uint256', name: '_coinType', type: 'uint256' },
        ],
        name: 'getName',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_addr', type: 'address' },
            { internalType: 'string', name: '_key', type: 'string' },
            { internalType: 'uint256', name: '_coinType', type: 'uint256' },
        ],
        name: 'getText',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
];
