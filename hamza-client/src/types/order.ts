export interface OrderItem {
    id: string;
    unit_price: number;
    quantity: number;
    variant_id?: string;
    title?: string;
    currency_code?: string;
    variant?: {
        product?: {
            handle?: string;
        };
    };
}

export interface ShippingMethod {
    price?: number;
}

export interface Payment {
    amount?: number;
    blockchain_data?: {
        payment_chain_id?: string;
        chain_id?: string;
    };
}

export interface OrderNote {
    id: string;
    note: string;
    updated_at: string;
}

export interface Order {
    id: string;
    items: OrderItem[];
    shipping_methods: ShippingMethod[];
    payments: Payment[];
    notes?: OrderNote[];
    store: {
        name: string;
        icon?: string;
    };
    shipping_address: {
        country_code: string;
    };
    payment_status?: string;
    fulfillment_status?: string;
    status?: string;
    escrow_status?: string;
    created_at?: string;
    updated_at?: string;
    history?: any[];
}
