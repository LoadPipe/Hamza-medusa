export const switchAbi = [
    {
        inputs: [
            {
                internalType: 'contract IMasterSwitch',
                name: 'masterSwitch',
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
                name: 'bucketIndex',
                type: 'uint256',
            },
        ],
        name: 'InvalidBucketState',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'InvalidOrderId',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
            {
                internalType: 'uint8',
                name: 'state',
                type: 'uint8',
            },
        ],
        name: 'InvalidOrderState',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'InvalidPaymentOperation',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'InvalidRefundAmount',
        type: 'error',
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
                internalType: 'uint256',
                name: 'amount1',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount2',
                type: 'uint256',
            },
        ],
        name: 'PaymentAmountMismatch',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'PaymentFailed',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'expected',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'actual',
                type: 'address',
            },
        ],
        name: 'ReceiverMismatch',
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
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Paused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'payer',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'receiver',
                type: 'address',
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
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'PaymentPlaced',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'refundAmount',
                type: 'uint256',
            },
        ],
        name: 'PaymentRefunded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'success',
                type: 'bool',
            },
        ],
        name: 'PaymentSent',
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
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Unpaused',
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
        inputs: [],
        name: 'UPGRADER_ROLE',
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
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'approvePayments',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: 'receivers',
                type: 'address[]',
            },
        ],
        name: 'approvePaymentsBatch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'freezePending',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: 'receivers',
                type: 'address[]',
            },
        ],
        name: 'freezePendingBatch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'getAmountToPayOut',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
            {
                internalType: 'uint8',
                name: 'state',
                type: 'uint8',
            },
        ],
        name: 'getBucketCountWithState',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'getBuckets',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'total',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint8',
                        name: 'state',
                        type: 'uint8',
                    },
                    {
                        components: [
                            {
                                internalType: 'uint256',
                                name: 'id',
                                type: 'uint256',
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
                            {
                                internalType: 'uint256',
                                name: 'refundAmount',
                                type: 'uint256',
                            },
                        ],
                        internalType: 'struct PaymentBook.Payment[]',
                        name: 'payments',
                        type: 'tuple[]',
                    },
                ],
                internalType: 'struct PaymentBook.PaymentBucket[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'getPaymentById',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'id',
                        type: 'uint256',
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
                    {
                        internalType: 'uint256',
                        name: 'refundAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint8',
                        name: 'state',
                        type: 'uint8',
                    },
                ],
                internalType: 'struct PaymentBook.PaymentWithState',
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
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
            {
                internalType: 'uint8',
                name: 'state',
                type: 'uint8',
            },
        ],
        name: 'getTotalInState',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'masterSwitch',
        outputs: [
            {
                internalType: 'contract IMasterSwitch',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'pause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'paused',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'paymentExists',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
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
                        internalType: 'uint256',
                        name: 'id',
                        type: 'uint256',
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
        name: 'placeMultiPayments',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'id',
                        type: 'uint256',
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
                internalType: 'struct PaymentInput',
                name: 'payment',
                type: 'tuple',
            },
        ],
        name: 'placePayment',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'placePayment2',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'processPayments',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: 'receivers',
                type: 'address[]',
            },
        ],
        name: 'processPaymentsBatch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'pullPayment',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'pushPayment',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
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
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'reviewPayment',
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
        inputs: [],
        name: 'tokenAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [],
        name: 'unpause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

export const masterAbi = [
    {
        inputs: [
            {
                internalType: 'contract ISecurityContext',
                name: 'securityContext',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'vault',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_feeBps',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
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
                indexed: false,
                internalType: 'uint256',
                name: 'newValue',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'changedBy',
                type: 'address',
            },
        ],
        name: 'FeeBpsChanged',
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
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'newAddress',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'changedBy',
                type: 'address',
            },
        ],
        name: 'VaultAddressChanged',
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
        inputs: [],
        name: 'UPGRADER_ROLE',
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
        name: 'feeBps',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
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
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'currency',
                        type: 'address',
                    },
                    {
                        components: [
                            {
                                internalType: 'uint256',
                                name: 'id',
                                type: 'uint256',
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
                internalType: 'uint256',
                name: '_feeBps',
                type: 'uint256',
            },
        ],
        name: 'setFeeBps',
        outputs: [],
        stateMutability: 'nonpayable',
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
        inputs: [
            {
                internalType: 'address',
                name: '_vaultAddress',
                type: 'address',
            },
        ],
        name: 'setVaultAddress',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'vaultAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
