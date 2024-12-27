'use client';

import LocalizedClientLink from '@modules/common/components/localized-client-link';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';

import useWishlistStore from '@/zustand/wishlist/wishlist-store';
import { Popover, Transition } from '@headlessui/react';
import { WishlistType } from '@/zustand/wishlist/types/wishlist-types';
import Image from 'next/image';
import { Button } from '@medusajs/ui';
import Thumbnail from '@modules/products/components/thumbnail';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { FaRegHeart } from 'react-icons/fa';

interface WishlistPopoverItemProps {
    item?: WishlistType;
}

interface PopoverButtonProps {
    active: boolean;
}

// TODO: Should we move this components to modules/wishlist/ similar to where cart-dropdown is???
const WishlistDropdown: React.FC<WishlistPopoverItemProps> = () => {
    const { authData } = useCustomerAuthStore();
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));
    const totalItems =
        wishlist?.products?.reduce((acc: any, item: any) => {
            return acc + 1;
        }, 0) || 0;
    const itemRef = useRef<number>(totalItems || 0);
    const pathname = usePathname();

    useEffect(() => {
        if (itemRef.current !== totalItems && !pathname.includes('/wishlist')) {
            //timedOpen();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalItems, itemRef.current]);

    // console.log('Wishlist popover', wishlist);

    const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
        undefined
    );
    const [wishlistDropdownOpen, setWishlistDropdownOpen] = useState(false);

    const open = () => setWishlistDropdownOpen(true);
    const close = () => setWishlistDropdownOpen(false);

    const timedOpen = () => {
        open();

        const timer = setTimeout(close, 5000);

        setActiveTimer(timer);
    };

    const openAndCancel = () => {
        if (activeTimer) {
            clearTimeout(activeTimer);
        }

        open();
    };

    useEffect(() => {
        return () => {
            if (activeTimer) {
                clearTimeout(activeTimer);
            }
        };
    }, [activeTimer]);

    return (
        <>
            {authData.status == 'authenticated' && (
                <div
                    className="relative inline-block text-left mr-2"
                    onMouseEnter={openAndCancel}
                    onMouseLeave={close}
                >
                    <Popover className="relative h-full bg-black text-white">
                        <Popover.Button className="h-full">
                            <LocalizedClientLink
                                className="hover:text-ui-fg-base"
                                href="/wishlist"
                            >{`Wishlist (${totalItems})`}</LocalizedClientLink>
                        </Popover.Button>

                        <Transition
                            show={wishlistDropdownOpen}
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel
                                static
                                className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-black border-x border-b border-gray-200 w-[420px] text-ui-fg-base"
                            >
                                <div className="p-4 flex items-center justify-center text-white">
                                    <h3 className="text-large-semi">
                                        Wishlist
                                    </h3>
                                </div>
                                {wishlist && wishlist.products?.length ? (
                                    <>
                                        <>
                                            {wishlist.products?.map(
                                                (product: any) => (
                                                    <div
                                                        className="py-2 first:pt-0 text-white"
                                                        key={product.id}
                                                    >
                                                        <Popover.Button>
                                                            {({}) =>
                                                                product ? ( // Check if the product exists
                                                                    <LocalizedClientLink
                                                                        href={`/products/${product.handle}`}
                                                                        className="font-normal"
                                                                    >
                                                                        <div className="flex hover:bg-gray-100">
                                                                            <div className="overflow-hidden rounded-md mr-4">
                                                                                <Image
                                                                                    className="w-16 h-auto"
                                                                                    src={
                                                                                        product.thumbnail
                                                                                    }
                                                                                    alt={
                                                                                        product.title
                                                                                    }
                                                                                    width="300"
                                                                                    height="200"
                                                                                />
                                                                            </div>
                                                                            <div className="flex items-center">
                                                                                <div>
                                                                                    <p className="font-medium text-sm">
                                                                                        {
                                                                                            product.title
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </LocalizedClientLink>
                                                                ) : (
                                                                    <div className="text-sm text-gray-500">
                                                                        Product
                                                                        details
                                                                        unavailable.
                                                                    </div>
                                                                )
                                                            }
                                                        </Popover.Button>
                                                    </div>
                                                )
                                            )}
                                            <div className="flex flex-col mt-4">
                                                <LocalizedClientLink href="/wishlist">
                                                    <>
                                                        <button className="text-white py-2 text-sm w-full border px-3 py-1.5 rounded hover:text-black hover:bg-gray-100">
                                                            View Wish List
                                                        </button>
                                                    </>
                                                </LocalizedClientLink>
                                            </div>
                                        </>
                                    </>
                                ) : (
                                    <div>
                                        <div className="flex py-16 flex-col gap-y-4 items-center justify-center text-white">
                                            <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
                                                <span>0</span>
                                            </div>
                                            <span>Your Wishlist is empty.</span>
                                            <div>
                                                <LocalizedClientLink href="/shop">
                                                    <>
                                                        <span className="sr-only">
                                                            Go to all products
                                                            page
                                                        </span>
                                                        <Button onClick={close}>
                                                            Explore products
                                                        </Button>
                                                    </>
                                                </LocalizedClientLink>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                </div>
            )}
        </>
    );
};

export default WishlistDropdown;
