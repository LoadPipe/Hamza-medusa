export const escrowAbi = [
    {
        inputs: [
            {
                internalType: 'contract ISecurityContext',
                name: 'securityContext',
                type: 'address',
            },
            {
                internalType: 'contract ISystemSettings',
                name: 'settings_',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'x',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'y',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'denominator',
                type: 'uint256',
            },
        ],
        name: 'PRBMath__MulDivOverflow',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'roleId',
                type: 'bytes32',
            },
            {
                internalType: 'address',
                name: 'addr',
                type: 'address',
            },
        ],
        name: 'UnauthorizedAccess',
        type: 'error',
    },
    {
        inputs: [],
        name: 'ZeroAddressArgument',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'paymentId',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'fee',
                type: 'uint256',
            },
        ],
        name: 'EscrowReleased',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'paymentId',
                type: 'bytes32',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'currency',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'PaymentReceived',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'paymentId',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'currency',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'PaymentTransferFailed',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'paymentId',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'currency',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'PaymentTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'paymentId',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'assentingAddress',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint8',
                name: 'assentType',
                type: 'uint8',
            },
        ],
        name: 'ReleaseAssentGiven',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'caller',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'securityContext',
                type: 'address',
            },
        ],
        name: 'SecurityContextSet',
        type: 'event',
    },
    {
        inputs: [],
        name: 'ADMIN_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'APPROVER_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'ARBITER_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'DAO_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'PAUSER_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'REFUNDER_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'SYSTEM_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'paymentId',
                type: 'bytes32',
            },
        ],
        name: 'getPayment',
        outputs: [
            {
                components: [
                    {
                        internalType: 'bytes32',
                        name: 'id',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'address',
                        name: 'payer',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amountRefunded',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bool',
                        name: 'payerReleased',
                        type: 'bool',
                    },
                    {
                        internalType: 'bool',
                        name: 'receiverReleased',
                        type: 'bool',
                    },
                    {
                        internalType: 'bool',
                        name: 'released',
                        type: 'bool',
                    },
                    {
                        internalType: 'address',
                        name: 'currency',
                        type: 'address',
                    },
                ],
                internalType: 'struct Payment',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'currency',
                        type: 'address',
                    },
                    {
                        components: [
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
                internalType: 'struct MultiPaymentInput[]',
                name: 'multiPayments',
                type: 'tuple[]',
            },
        ],
        name: 'placeMultiPayments',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'paymentId',
                type: 'bytes32',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'refundPayment',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'paymentId',
                type: 'bytes32',
            },
        ],
        name: 'releaseEscrow',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'securityContext',
        outputs: [
            {
                internalType: 'contract ISecurityContext',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'contract ISecurityContext',
                name: '_securityContext',
                type: 'address',
            },
        ],
        name: 'setSecurityContext',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        stateMutability: 'payable',
        type: 'receive',
    },
];
