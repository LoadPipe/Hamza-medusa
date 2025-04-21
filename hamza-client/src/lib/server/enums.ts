export enum EscrowStatus {
    IN_ESCROW = 'in_escrow',
    BUYER_RELEASED = 'buyer_released',
    SELLER_RELEASED = 'seller_released',
    RELEASED = 'released',
    REFUNDED = 'refunded',
    FAILED = 'failed',
}

export enum EscrowStatusString {
    in_escrow = 'In Escrow',
    buyer_released = 'Buyer Released',
    seller_released = 'Seller Released',
    released = 'Released',
    refunded = 'Refunded',
    failed = 'Failed',
}
