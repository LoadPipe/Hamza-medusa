export const liteSwitchAbi = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "securityContext",
                "type": "address",
                "internalType": "contract ISecurityContext"
            },
            {
                "name": "vault",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "receive",
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "ADMIN_ROLE",
        "inputs": [

        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "APPROVER_ROLE",
        "inputs": [

        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "DAO_ROLE",
        "inputs": [

        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "PAUSER_ROLE",
        "inputs": [

        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "REFUNDER_ROLE",
        "inputs": [

        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "SYSTEM_ROLE",
        "inputs": [

        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "UPGRADER_ROLE",
        "inputs": [

        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "placeMultiPayments",
        "inputs": [
            {
                "name": "multiPayments",
                "type": "tuple[]",
                "internalType": "struct MultiPaymentInput[]",
                "components": [
                    {
                        "name": "currency",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "payments",
                        "type": "tuple[]",
                        "internalType": "struct PaymentInput[]",
                        "components": [
                            {
                                "name": "id",
                                "type": "uint256",
                                "internalType": "uint256"
                            },
                            {
                                "name": "orderId",
                                "type": "string",
                                "internalType": "string"
                            },
                            {
                                "name": "receiver",
                                "type": "address",
                                "internalType": "address"
                            },
                            {
                                "name": "payer",
                                "type": "address",
                                "internalType": "address"
                            },
                            {
                                "name": "amount",
                                "type": "uint256",
                                "internalType": "uint256"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "immediateSweep",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "outputs": [

        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "securityContext",
        "inputs": [

        ],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract ISecurityContext"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "setSecurityContext",
        "inputs": [
            {
                "name": "_securityContext",
                "type": "address",
                "internalType": "contract ISecurityContext"
            }
        ],
        "outputs": [

        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setVaultAddress",
        "inputs": [
            {
                "name": "_vaultAddress",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [

        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "sweep",
        "inputs": [
            {
                "name": "tokenAddressOrZero",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [

        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "vaultAddress",
        "inputs": [

        ],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "PaymentReceived",
        "inputs": [
            {
                "name": "orderId",
                "type": "string",
                "indexed": true,
                "internalType": "string"
            },
            {
                "name": "to",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "from",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "currency",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PaymentSweepFailed",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "currency",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PaymentSwept",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "currency",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "SecurityContextSet",
        "inputs": [
            {
                "name": "caller",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "securityContext",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "VaultAddressChanged",
        "inputs": [
            {
                "name": "newAddress",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "changedBy",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "UnauthorizedAccess",
        "inputs": [
            {
                "name": "roleId",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "addr",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "ZeroAddressArgument",
        "inputs": [

        ]
    }
];
