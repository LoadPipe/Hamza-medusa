'use client';

import React from 'react';
import WishlistIcon from './icon/wishlist-icon';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Image from 'next/image';
import { useWishlistMutations } from '@/zustand/wishlist/mutations/wishlist-mutations';
import useWishlistStore from '@/zustand/wishlist/wishlist-store';

type WishlistProps = { item: any };

const WishlistItem = (props: WishlistProps) => {
    const { removeWishlistItemMutation } = useWishlistMutations();
    const { removeWishlistProduct } = useWishlistStore((state) => ({
        removeWishlistProduct: state.removeWishlistProduct,
    }));
    const toggleWishlist = async () => {
        console.log('item.product', props.item);
        removeWishlistItemMutation.mutate(props.item);
    };
    // TODO: Add ternary operator if item is null
    return (
        <div className="flex mb-6 last:mb-0">
            <div className="bg-ui rounded-md overflow-hidden mr-4 max-w-1/4">
                <Image
                    className="h-auto w-full object-cover"
                    src={props.item?.thumbnail}
                    width="300"
                    height="200"
                    alt={props.item?.title}
                />
            </div>
            <div className="flex text-sm flex-grow py-2 justify-between space-x-8">
                <LocalizedClientLink
                    href={`/products/${props.item?.handle}`}
                    className="w-full"
                >
                    <div className="flex flex-col justify-between w-full hover:text-green-400">
                        <div className="flex flex-col">
                            <p className="font-semibold mb-4">
                                {props.item?.title}
                            </p>
                        </div>
                    </div>
                </LocalizedClientLink>

                <div className="flex flex-col justify-between">
                    <div className="flex justify-end w-full">
                        <button onClick={() => toggleWishlist()}>
                            <WishlistIcon fill={true} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistItem;
