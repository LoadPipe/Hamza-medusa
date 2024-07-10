import { headers } from 'next/headers';
import { Suspense, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { listRegions } from '@lib/data';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import CartButton from '@modules/layout/components/cart-button';
import WishListPopover from '@/components/wishlist-dropdown';
import SideMenu from '@modules/layout/components/side-menu';
import Image from 'next/image';
import logo from '../../../../../public/nav/hamza_logo.png';
import { WalletConnectButton } from '@/components/providers/rainbowkit/connect-button/connect-button';
import SearchModal from '@modules/search/templates/search-modal';
import SearchModalWrapper from '@modules/search/templates/search-wrapper';
import dynamic from 'next/dynamic';

const Wish = dynamic(() => import('../../../../store/wishlist/wish'), {
    ssr: false, // This will prevent the component from rendering on the server side
});

export default async function Nav() {
    const regions = await listRegions().then((regions) => regions);

    return (
        <div className="sticky top-0 inset-x-0 z-50 group">
            <header className="relative h-16 mx-auto border-b duration-200 bg-white dark:bg-black border-ui-border-base">
                <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
                    <div className="flex items-center h-full">
                        <LocalizedClientLink
                            href="/"
                            className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
                        >
                            {/*<Image*/}
                            {/*    src={logo}*/}
                            {/*    width={50.41}*/}
                            {/*    height={57.27}*/}
                            {/*    alt="Hamza Logo"*/}
                            {/*/>*/}
                        </LocalizedClientLink>
                    </div>
                    <div className="flex-1 basis-0 h-full flex items-center">
                        <div className="font-sora h-full">
                            <SideMenu regions={regions} />
                        </div>
                    </div>

                    {/*Add ETH CURRENCY*/}

                    <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
                        <div className="hidden small:flex items-center gap-x-6 h-full">
                            {process.env.FEATURE_SEARCH_ENABLED && (
                                <SearchModalWrapper />
                            )}
                        </div>
                        <Wish />
                        <Suspense
                            fallback={
                                <LocalizedClientLink
                                    className="hover:text-ui-fg-base font-sora"
                                    href="/cart"
                                >
                                    <span
                                        style={{
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Cart (0)
                                    </span>
                                </LocalizedClientLink>
                            }
                        >
                            <CartButton />
                            <WalletConnectButton />

                            <a
                                href="https://twitter.com/intent/tweet?text=Hello%20world"
                                target="_blank"
                            >
                                <button
                                    type="button"
                                    data-twe-ripple-init
                                    data-twe-ripple-color="light"
                                    className="mb-2 inline-block rounded bg-black px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                                >
                                    <span className="[&>svg]:h-4 [&>svg]:w-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 512 512"
                                        >
                                            <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                                        </svg>
                                    </span>
                                </button>
                            </a>
                        </Suspense>
                    </div>
                </nav>
            </header>
        </div>
    );
}
