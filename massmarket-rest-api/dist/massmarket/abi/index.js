"use strict";
// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: Unlicense
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreReg = exports.addresses = void 0;
/*
import addresses from './deploymentAddresses.json'; // assert { type: "json" };
export { addresses };
import Payments from './abi/Payments.json'; // assert { type: 'json' };
export { Payments };
import RelayReg from './abi/RelayReg.json'; // assert { type: 'json' };
export { RelayReg };
import StoreReg from './abi/StoreReg.json'; // assert { type: 'json' };
export { StoreReg };
import ERC20 from './abi/ERC20.json'; // assert { type: 'json' };
export { ERC20 };
*/
exports.addresses = {
    Eddies: '0xd8ea4e5b02eAe4DC786CD3CFA065b98D8178Db2E',
    Payments: '0x0DcA1518DB5A058F29EBfDab76739faf8Fb4544c',
    RelayReg: '0x8BD144122aC7C4f272E3EC758B61D8FFd7E6190A',
    StoreReg: '0xD80f5bBa25DE8A85FeE691df7265CE8823d6A557',
};
exports.StoreReg = [
    {
        type: 'constructor',
        inputs: [
            {
                name: 'r',
                type: 'address',
                internalType: 'contract RelayReg',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'PERM_addPermission',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'PERM_addRelay',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'PERM_publishInviteVerifier',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'PERM_registerUser',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'PERM_removePermission',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'PERM_removeRelay',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'PERM_removeUser',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'PERM_replaceRelay',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'PERM_updateRootHash',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: '_getTokenMessageHash',
        inputs: [
            {
                name: 'user',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        name: 'addPermission',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'user',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'perm',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'addRelay',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'relayId',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'allPermissionsGuard',
        inputs: [
            {
                name: 'id',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'perms',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'approve',
        inputs: [
            {
                name: 'account',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'id',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        name: 'balanceOf',
        inputs: [
            {
                name: 'owner',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: 'result',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getAllPermissions',
        inputs: [
            {
                name: 'id',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'user',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getAllRelays',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256[]',
                internalType: 'uint256[]',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getApproved',
        inputs: [
            {
                name: 'id',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: 'result',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getRelayCount',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'hasEnoughPermissions',
        inputs: [
            {
                name: 'id',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'user',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'perms',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'hasPermission',
        inputs: [
            {
                name: 'id',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'user',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'perm',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'isApprovedForAll',
        inputs: [
            {
                name: 'owner',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'operator',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: 'result',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'mint',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'owner',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'name',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'string',
                internalType: 'string',
            },
        ],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        name: 'nonce',
        inputs: [
            {
                name: 'storeid',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint64',
                internalType: 'uint64',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'ownerOf',
        inputs: [
            {
                name: 'id',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: 'result',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'permissionGuard',
        inputs: [
            {
                name: 'id',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'perm',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
        outputs: [],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'permsToBitmap',
        inputs: [
            {
                name: 'perms',
                type: 'uint8[]',
                internalType: 'uint8[]',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        name: 'publishInviteVerifier',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'verifier',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'redeemInvite',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'v',
                type: 'uint8',
                internalType: 'uint8',
            },
            {
                name: 'r',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: 's',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: 'user',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'registerUser',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'user',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'perms',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'relayReg',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'contract RelayReg',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'relays',
        inputs: [
            {
                name: 'storeid',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'removePermission',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'user',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'perm',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'removeRelay',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'idx',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'removeUser',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'user',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'replaceRelay',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'idx',
                type: 'uint8',
                internalType: 'uint8',
            },
            {
                name: 'relayId',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'rootHashes',
        inputs: [
            {
                name: 'storeid',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'safeTransferFrom',
        inputs: [
            {
                name: 'from',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'to',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'id',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        name: 'safeTransferFrom',
        inputs: [
            {
                name: 'from',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'to',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'id',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'data',
                type: 'bytes',
                internalType: 'bytes',
            },
        ],
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        name: 'setApprovalForAll',
        inputs: [
            {
                name: 'operator',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'isApproved',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'supportsInterface',
        inputs: [
            {
                name: 'interfaceId',
                type: 'bytes4',
                internalType: 'bytes4',
            },
        ],
        outputs: [
            {
                name: 'result',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'symbol',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'string',
                internalType: 'string',
            },
        ],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        name: 'tokenURI',
        inputs: [
            {
                name: 'id',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'string',
                internalType: 'string',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'transferFrom',
        inputs: [
            {
                name: 'from',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'to',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'id',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        name: 'updateRootHash',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'hash',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: '_nonce',
                type: 'uint64',
                internalType: 'uint64',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'event',
        name: 'Approval',
        inputs: [
            {
                name: 'owner',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'account',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'id',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'ApprovalForAll',
        inputs: [
            {
                name: 'owner',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'operator',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'isApproved',
                type: 'bool',
                indexed: false,
                internalType: 'bool',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'PermissionAdded',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'user',
                type: 'address',
                indexed: false,
                internalType: 'address',
            },
            {
                name: 'permission',
                type: 'uint8',
                indexed: false,
                internalType: 'uint8',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'PermissionRemoved',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'user',
                type: 'address',
                indexed: false,
                internalType: 'address',
            },
            {
                name: 'permission',
                type: 'uint8',
                indexed: false,
                internalType: 'uint8',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'Transfer',
        inputs: [
            {
                name: 'from',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'to',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'id',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'UserAdded',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'user',
                type: 'address',
                indexed: false,
                internalType: 'address',
            },
            {
                name: 'permissions',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'UserRemoved',
        inputs: [
            {
                name: 'storeId',
                type: 'uint256',
                indexed: true,
                internalType: 'uint256',
            },
            {
                name: 'users',
                type: 'address',
                indexed: false,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'error',
        name: 'AccountBalanceOverflow',
        inputs: [],
    },
    {
        type: 'error',
        name: 'BalanceQueryForZeroAddress',
        inputs: [],
    },
    {
        type: 'error',
        name: 'InvalidNonce',
        inputs: [
            {
                name: 'cur',
                type: 'uint64',
                internalType: 'uint64',
            },
            {
                name: '_nonce',
                type: 'uint64',
                internalType: 'uint64',
            },
        ],
    },
    {
        type: 'error',
        name: 'NoVerifier',
        inputs: [],
    },
    {
        type: 'error',
        name: 'NotAuthorized',
        inputs: [
            {
                name: 'permision',
                type: 'uint8',
                internalType: 'uint8',
            },
        ],
    },
    {
        type: 'error',
        name: 'NotOwnerNorApproved',
        inputs: [],
    },
    {
        type: 'error',
        name: 'TokenAlreadyExists',
        inputs: [],
    },
    {
        type: 'error',
        name: 'TokenDoesNotExist',
        inputs: [],
    },
    {
        type: 'error',
        name: 'TransferFromIncorrectOwner',
        inputs: [],
    },
    {
        type: 'error',
        name: 'TransferToNonERC721ReceiverImplementer',
        inputs: [],
    },
    {
        type: 'error',
        name: 'TransferToZeroAddress',
        inputs: [],
    },
];
//# sourceMappingURL=index.js.map