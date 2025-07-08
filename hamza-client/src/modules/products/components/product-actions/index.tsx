'use client';

import { Region } from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { Button } from '@medusajs/ui';
import { isEqual } from 'lodash';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useIntersection } from '@lib/hooks/use-in-view';
import { addToCart } from '@modules/cart/actions';
import Divider from '@modules/common/components/divider';
import OptionSelect from '@modules/products/components/option-select';
import ProductBuyButton from '../buttons/product-buy-button';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import MobileActions from './components/mobile-actions';
import ProductPrice from '../product-price';
import useWishlistStore from '@/zustand/wishlist/wishlist-store';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { getInventoryCount, getStore } from '@/lib/server';

type ProductActionsProps = {
    product: PricedProduct;
    region: Region;
};

export type PriceType = {
    calculated_price: string;
    original_price?: string;
    price_type?: 'sale' | 'default';
    percentage_diff?: string;
};

export default function ProductActions({
    product,
    region,
}: ProductActionsProps): JSX.Element {
    const [options, setOptions] = useState<Record<string, string>>({});
    const [isAdding, setIsAdding] = useState(false);
    const [buyNowLoader, setBuyNowLoader] = useState(false);
    const [inventoryCount, setInventoryCount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    let countryCode = useParams().countryCode as string;
    if (process.env.NEXT_PUBLIC_FORCE_COUNTRY)
        countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY;
    const { whitelist_config, authData } = useCustomerAuthStore();
    const [isWhitelisted, setIsWhitelisted] = useState(false);

    const variants = product.variants;
    const variant_id = variants[0].id;
    // console.log('Variant id is', variant_id);

    const { isCustomerAuthenticated } = useWishlistStore();

    useEffect(() => {
        if (!variant_id) return;

        const fetchInventoryCount = async () => {
            setLoading(true);
            try {
                const response = await getInventoryCount(variant_id);
                console.log('Response is', JSON.stringify(response));
                setInventoryCount(response.variant);
            } catch (error) {
                console.error('Error fetching inventory count:', error);
                setError('Failed to fetch inventory count');
            }
            setLoading(false);
        };

        fetchInventoryCount();
    }, [variant_id]);
    // initialize the option state
    useEffect(() => {
        const optionObj: Record<string, string> = {};

        for (const option of product.options || []) {
            Object.assign(optionObj, { [option.id]: undefined });
        }

        setOptions(optionObj);
    }, [product]);

    // memoized record of the product's variants
    const variantRecord = useMemo(() => {
        const map: Record<string, Record<string, string>> = {};

        for (const variant of variants) {
            if (!variant.options || !variant.id) continue;

            const temp: Record<string, string> = {};

            for (const option of variant.options) {
                temp[option.option_id] = option.value;
            }

            map[variant.id] = temp;
        }

        return map;
    }, [variants]);

    // memoized function to check if the current options are a valid variant
    const variant = useMemo(() => {
        let variantId: string | undefined = undefined;

        for (const key of Object.keys(variantRecord)) {
            if (isEqual(variantRecord[key], options)) {
                variantId = key;
            }
        }

        return variants.find((v) => v.id === variantId);
    }, [options, variantRecord, variants]);

    // if product only has one variant, then select it
    useEffect(() => {
        if (variants.length === 1 && variants[0]?.id) {
            setOptions(variantRecord[variants[0]?.id]);
        }
    }, [variants, variantRecord]);

    // update the options when a variant is selected
    const updateOptions = (update: Record<string, string>) => {
        setOptions({ ...options, ...update });
    };

    // check if the selected variant is in stock
    const inStock = useMemo(() => {
        if (variant && !variant.inventory_quantity) {
            return false;
        }

        if (variant && variant.allow_backorder === false) {
            return true;
        }
    }, [variant]);

    const actionsRef = useRef<HTMLDivElement>(null);

    const inView = useIntersection(actionsRef, '0px');

    // add the selected variant to the cart
    const handleAddToCart = async () => {
        if (!variant?.id) return;
        setIsAdding(true);
        await addToCart({
            variantId: variant.id,
            quantity: 1,
            countryCode: countryCode,
        });
        setIsAdding(false);
    };

    //TODO: is this used, and why is eth hard-coded?
    //Add to card and buy now
    //FYI: If user clicks buy now and then navigates back to the product preview and clicks again it will increase quanitity again
    const handleBuyNow = async () => {
        if (!variant?.id) return;
        setBuyNowLoader(true);
        await addToCart({
            variantId: variant.id,
            quantity: 1,
            countryCode: countryCode,
        });
        setBuyNowLoader(false);
    };

    const whitelistedProductHandler = async () => {
        //TODO: MOVE TO INDEX.TS
        let data = await getStore(product.id ?? '');
        console.log(data);

        if (data.status == true) {
            const whitelistedProduct =
                whitelist_config.is_whitelisted &&
                whitelist_config.whitelisted_stores.includes(data.data)
                    ? true
                    : false;

            setIsWhitelisted(whitelistedProduct);
            console.log('white listed product ', whitelistedProduct);
        }
        return;
    };

    useEffect(() => {
        if (
            authData.status == 'authenticated' &&
            product.variants[0].allow_backorder
        ) {
            whitelistedProductHandler();
        }
    }, [authData.status]);

    return (
        <>
            <div
                className="flex flex-col gap-y-2 bg-black text-white"
                ref={actionsRef}
            >
                <div>
                    {product.variants.length > 1 && (
                        <div className="flex flex-col gap-y-4">
                            {(product.options || []).map((option) => {
                                return (
                                    <div key={option.id}>
                                        <OptionSelect
                                            option={option}
                                            current={options[option.id]}
                                            updateOption={updateOptions}
                                            title={option.title}
                                        />
                                    </div>
                                );
                            })}
                            <Divider />
                        </div>
                    )}
                </div>
                <ProductPrice
                    product={product}
                    variant={variant}
                    region={region}
                />
                <Button
                    variant="secondary"
                    className="w-full h-10 "
                    disabled={!inStock || !variant}
                >
                    {loading
                        ? 'Loading...'
                        : `Inventory Count: ${inventoryCount !== null ? inventoryCount : '0'}`}
                </Button>

                <Button
                    onClick={handleAddToCart}
                    disabled={(!inStock || !variant) && !isWhitelisted}
                    variant="primary"
                    className="w-full h-10 text-white"
                    isLoading={isAdding}
                >
                    {!variant
                        ? 'Select variant'
                        : !inStock && isWhitelisted
                          ? 'Add to Cart'
                          : inStock
                            ? 'Add to Cart'
                            : 'Out of Stock'}
                </Button>
                {!inStock && isWhitelisted && (
                    <span className="text-xs">
                        You can add it as you are whitelisted customer
                    </span>
                )}
                {/* TODO: wishlist-dropdown add ternary for fill IF item already in wishlist-dropdown maybe we can have a variant ternary for 'Remove from Wishlist' || 'Add to Wishlist'    */}
                {/* {isCustomerAuthenticated && (
                    <Button
                        className="w-full h-10 text-white"
                        variant="primary"
                        onClick={toggleWishlist}
                    >
                        <WishlistIcon
                            fill={
                                wishlist.products.find(
                                    (a) => a.id == product.id
                                )
                                    ? true
                                    : false
                            }
                            props={{
                                className: 'wishlist-dropdown-icon',
                                'aria-label': 'wishlist',
                            }}
                        />
                        {wishlist.products.find((a) => a.id == product.id)
                            ? 'Remove from Wishlist'
                            : 'Add to Wishlist'}
                    </Button>
                )} */}
                <LocalizedClientLink href="/checkout?step=address">
                    <ProductBuyButton
                        styles={'w-full h-10 text-white buy-now-button'}
                        handleBuyNow={handleBuyNow}
                        loader={buyNowLoader}
                        outOfStock={!inStock || !variant}
                        isWhitelisted={isWhitelisted}
                    />
                </LocalizedClientLink>
                <MobileActions
                    product={product}
                    variant={variant}
                    region={region}
                    options={options}
                    updateOptions={updateOptions}
                    inStock={inStock}
                    handleAddToCart={handleAddToCart}
                    isAdding={isAdding}
                    show={!inView}
                />
            </div>
        </>
    );
}
