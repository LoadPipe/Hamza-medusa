'use client';
import React, { Suspense } from 'react';
import useWishlistStore from '@/zustand/wishlist/wishlist-store';
import WishListPopover from '@/components/wishlist-dropdown';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

const Wish = () => {
    const { isCustomerAuthenticated } = useWishlistStore();

    if (!isCustomerAuthenticated) return null;

    return (
        <Suspense
            fallback={
                <LocalizedClientLink
                    className="hover:text-ui-fg-base font-sora"
                    href="/wishlist"
                >
                    Wishlist
                </LocalizedClientLink>
            }
        >
            <WishListPopover />
        </Suspense>
    );
};

export default Wish;
