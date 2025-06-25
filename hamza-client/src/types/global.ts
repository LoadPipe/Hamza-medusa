import {
    Cart,
    ProductCategory,
    ProductVariant,
    Region,
} from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { ProductCollection } from '@medusajs/product';

export type FeaturedProduct = {
    id: string;
    title: string;
    handle: string;
    thumbnail?: string;
};

export type ProductPreviewType = {
    id: string;
    title: string;
    handle: string | null;
    thumbnail: string | null;
    created_at?: Date;
    prices?: { currency_code: string; amount: number }[];
    isFeatured?: boolean;
};

export type ProductCollectionWithPreviews = Omit<
    ProductCollection,
    'products'
> & {
    products: ProductPreviewType[];
};

export type InfiniteProductPage = {
    response: {
        products: PricedProduct[];
        count: number;
    };
};

export type ProductVariantInfo = Pick<ProductVariant, 'prices'>;

export type RegionInfo = Pick<
    Region,
    'currency_code' | 'tax_code' | 'tax_rate'
>;

export type CartWithCheckoutStep = Omit<
    Cart,
    'beforeInsert' | 'beforeUpdate' | 'afterUpdateOrLoad'
> & {
    checkout_step: 'address' | 'review' | 'payment';
};

export type ProductCategoryWithChildren = Omit<
    ProductCategory,
    'category_children'
> & {
    category_children: ProductCategory[];
    category_parent?: ProductCategory;
};

// Products Card
export interface ProductPrice {
    currency_code: string;
    amount: number;
}

export interface ProductVariants {
    id: string;
    prices: ProductPrice[];
    inventory_quantity: number;
    allow_backorder: boolean;
}

export interface ProductReview {
    rating: number;
}

export interface Product {
    id: string;
    handle: string;
    title: string;
    thumbnail: string;
    variants: ProductVariants[];
    reviews: ProductReview[];
    is_giftcard: boolean;
    discountValue?: string;
    origin_country: string;
    store_id: string;
    countryCode?: string;
}

export interface DiscountValidationResult {
    valid: boolean;
    message?: string;
    usage_limit: number | null;
    usage_count: number;
    code: string;
}

export type Store = {
    id: string;
    name: string;
    handle: string;
    icon: string;
    created_at: string;
    is_verified?: boolean;
    review_count?: number;
    avg_rating?: number;
};

export type FeaturedStoresResponse = {
    stores: Store[];
};
export interface LatestProductsResponse {
    products: Product[];
    count: number;
}
