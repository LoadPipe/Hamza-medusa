'use client';

import { useState, useEffect, useRef } from 'react';
import { AdditionalSelector } from './AdditionalSelector';
import { chains } from '../data';
import {
    Home,
    Store,
    Newspaper,
    HelpCircle,
    Info,
    ShoppingBag,
    Users,
    Menu,
    Search,
    ShoppingCart,
} from 'lucide-react';
import WalletConnect from './WalletConnect';
import { cn } from '@modules/landing-pages/how-it-works/lib/utils';

interface NavBarProps {
    onSelectChain: (chain: string) => void;
    onSelectCurrency: (currency: string) => void;
    onSelectLanguage: (language: string) => void;
    onSelectShipping: (shipping: string) => void;
    selectedChain: string;
    selectedCurrency: string;
    selectedLanguage: string;
    selectedShipping: string;
    translate: (key: string, lang?: string) => string;
}

const NAV_ITEM_HEIGHT = 'h-10'; // Consistent height for all nav items
const NAV_ITEM_BASE = 'flex items-center justify-center bg-black rounded-full';

export default function NavBar({
    onSelectChain,
    onSelectCurrency,
    onSelectLanguage,
    onSelectShipping,
    selectedChain,
    selectedCurrency,
    selectedLanguage,
    selectedShipping,
    translate,
}: NavBarProps) {
    const [openSelector, setOpenSelector] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectorOpen = (selector: string) => {
        setOpenSelector((prev) => (prev === selector ? null : selector));
    };

    const menuItems = [
        { icon: Home, text: 'Home', href: '/' },
        { icon: Store, text: 'Shop', href: '/shop' },
        { icon: Newspaper, text: 'Blog', href: '/blog' },
        { icon: Info, text: 'About Us', href: '/about' },
        { icon: HelpCircle, text: 'Help Center', href: '/help' },
        { icon: Store, text: 'Request a Product', href: '/request-product' },
        { icon: ShoppingBag, text: 'Sell on Hamza', href: '/sell' },
        { icon: Users, text: 'Be an affiliate', href: '/affiliate' },
    ];

    return (
        <nav className="relative">
            <div className="absolute inset-x-0 top-0 h-[150%] pointer-events-none">
                <div className="h-full bg-gradient-to-b from-black to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/100 to-black/0"></div>
            </div>
            <div className="relative z-10 max-w-[1200px] mx-auto px-4">
                <div className="flex items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 mr-2 sm:mr-4 lg:mr-8">
                        <svg
                            width="80"
                            height="30"
                            viewBox="0 0 173 71"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M45.7503 43.175C46.2211 40.98 46.3825 38.8137 45.5179 36.7829C42.8248 30.4615 34.4271 31.5191 29.5931 34.2022C26.1849 36.0944 23.2416 39.014 21.0682 42.2681C18.8355 45.6111 17.2084 49.4331 13.9719 51.9566C13.5648 52.2744 13.0939 52.5607 12.5817 52.5501C11.8177 52.5335 11.2018 51.8315 11.0138 51.0767C10.8257 50.322 10.9694 49.5295 11.1204 48.7672C14.2621 32.9427 20.8579 17.8399 30.2949 4.86118C30.8708 4.06875 31.4734 3.24921 31.6659 2.28202C32.3766 -1.28693 27.969 0.200006 26.2589 0.984904C23.7272 2.14643 21.5612 4.13805 19.6365 6.1357C10.5652 15.553 5.91182 28.4096 2.18677 41.0403C0.758039 45.8853 -0.584815 50.9607 0.265018 55.9458C1.11337 60.9309 4.79252 65.7804 9.74347 66.2489C14.2843 66.6798 18.418 63.4182 21.0933 59.6594C23.7687 55.9006 25.5231 51.5031 28.4131 47.913C28.7433 47.5018 29.1238 47.0799 29.6316 46.9579C30.4045 46.7726 31.1862 47.3812 31.5016 48.124C31.8169 48.8667 31.7858 49.7043 31.7755 50.5133C31.7325 54.0807 32.2226 57.7115 33.7002 60.946C35.9995 65.9777 40.7402 69.7787 46.0849 70.877C46.8963 71.0442 47.8349 71.121 48.4612 70.5696C49.6397 69.5346 48.6463 67.6244 47.752 66.3273C44.3009 61.3256 43.0187 54.831 44.3024 48.8606C44.7051 46.9895 45.3417 45.0717 45.7488 43.1735L45.7503 43.175Z"
                                fill="#00ff00"
                            />
                            <path
                                d="M67 44.255V26.3465C67 25.9145 67.3526 25.564 67.7874 25.564H72.6251C73.0598 25.564 73.4124 25.9145 73.4124 26.3465V31.6115C73.4124 32.0436 73.7651 32.394 74.1998 32.394H78.0424C78.4772 32.394 78.8298 32.0436 78.8298 31.6115V26.3465C78.8298 25.9145 79.1824 25.564 79.6172 25.564H84.4549C84.8896 25.564 85.2423 25.9145 85.2423 26.3465V44.255C85.2423 44.6871 84.8896 45.0375 84.4549 45.0375H79.6172C79.1824 45.0375 78.8298 44.6871 78.8298 44.255V39.2396C78.8298 38.8076 78.4772 38.4572 78.0424 38.4572H74.1998C73.7651 38.4572 73.4124 38.8076 73.4124 39.2396V44.255C73.4124 44.6871 73.0598 45.0375 72.6251 45.0375H67.7874C67.3526 45.0375 67 44.6871 67 44.255Z"
                                fill="white"
                            />
                            <path
                                d="M105.61 45.0375H100.919V43.9754C99.7165 44.9487 98.114 45.436 96.1094 45.436C93.3923 45.436 91.1219 44.4627 89.2067 42.5148C87.3361 40.567 86.4014 38.2219 86.4014 35.5216C86.4014 32.8213 87.3807 30.3874 89.296 28.4852C91.256 26.5373 93.6157 25.564 96.3763 25.564C99.1369 25.564 101.542 26.5373 103.458 28.4852C105.418 30.3886 106.397 32.7337 106.397 35.5216V44.255C106.397 44.6871 106.044 45.0375 105.61 45.0375ZM96.3763 31.0523C93.9272 31.0523 91.9226 33.0433 91.9226 35.5228C91.9226 38.0023 93.926 39.9489 96.3763 39.9489C98.8265 39.9489 100.83 37.9579 100.83 35.5228C100.83 33.0877 98.87 31.0523 96.3763 31.0523Z"
                                fill="white"
                            />
                            <path
                                d="M124.967 33.9734V44.255C124.967 44.6871 124.615 45.0375 124.18 45.0375H120.055C119.62 45.0375 119.267 44.6871 119.267 44.255V33.9734C119.267 31.8936 118.421 30.8314 116.684 30.8314C114.948 30.8314 114.056 32.0268 114.056 33.9734V44.255C114.056 44.6871 113.704 45.0375 113.269 45.0375H109.144C108.709 45.0375 108.356 44.6871 108.356 44.255V33.9734C108.356 31.3175 109.158 29.2377 110.761 27.7771C112.365 26.3165 114.323 25.564 116.684 25.564C118.866 25.564 120.648 26.1833 122.117 27.423C123.587 26.1833 125.413 25.564 127.595 25.564C129.955 25.564 131.915 26.3165 133.474 27.7771C135.077 29.2377 135.878 31.3175 135.878 33.9734V44.255C135.878 44.6871 135.525 45.0375 135.091 45.0375H130.965C130.531 45.0375 130.178 44.6871 130.178 44.255V33.9734C130.178 31.8936 129.332 30.8314 127.595 30.8314C125.858 30.8314 124.967 31.9824 124.967 33.9734Z"
                                fill="white"
                            />
                            <path
                                d="M138.535 25.9626H149.2C151.09 25.9626 152.676 27.4664 152.666 29.3446C152.661 30.2219 152.35 31.0128 151.731 31.7605L145.87 38.4765C145.428 38.9829 145.79 39.7714 146.464 39.7714H151.7C152.135 39.7714 152.487 40.1219 152.487 40.5539V44.2563C152.487 44.6884 152.135 45.0388 151.7 45.0388H140.508C138.504 45.0388 137.078 43.5783 137.078 41.5872C137.078 40.7903 137.39 39.9934 138.058 39.241L143.883 32.5238C144.323 32.0161 143.96 31.23 143.286 31.23H138.532C138.097 31.23 137.745 30.8796 137.745 30.4475V26.7451C137.745 26.313 138.097 25.9626 138.532 25.9626H138.535Z"
                                fill="white"
                            />
                            <path
                                d="M172.097 45.0375H167.407V43.9754C166.204 44.9487 164.601 45.436 162.597 45.436C159.88 45.436 157.609 44.4627 155.694 42.5148C153.823 40.567 152.889 38.2219 152.889 35.5216C152.889 32.8213 153.868 30.3874 155.783 28.4852C157.743 26.5373 160.103 25.564 162.864 25.564C165.624 25.564 168.03 26.5373 169.945 28.4852C171.905 30.3886 172.884 32.7337 172.884 35.5216V44.255C172.884 44.6871 172.532 45.0375 172.097 45.0375ZM162.864 31.0523C160.415 31.0523 158.41 33.0433 158.41 35.5228C158.41 38.0023 160.413 39.9489 162.864 39.9489C165.314 39.9489 167.317 37.9579 167.317 35.5228C167.317 33.0877 165.357 31.0523 162.864 31.0523Z"
                                fill="white"
                            />
                        </svg>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-2 sm:mx-4">
                        <div
                            className={cn(
                                NAV_ITEM_BASE,
                                NAV_ITEM_HEIGHT,
                                'relative w-full'
                            )}
                        >
                            <input
                                type="text"
                                placeholder={translate(
                                    'Search...',
                                    selectedLanguage
                                )}
                                className="w-full h-full bg-gray-900 text-white rounded-full px-6 pl-12 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Right Side Items */}
                    <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
                        <div className="hidden sm:block"></div>
                        <div className="hidden sm:block">
                            <AdditionalSelector
                                onOpen={() => handleSelectorOpen('additional')}
                                isOtherOpen={openSelector === 'chain'}
                                onSelectCurrency={onSelectCurrency}
                                onSelectLanguage={onSelectLanguage}
                                onSelectShipping={onSelectShipping}
                                translate={translate}
                                selectedCurrency={selectedCurrency}
                                selectedLanguage={selectedLanguage}
                                selectedShipping={selectedShipping}
                            />
                        </div>
                        <div className={NAV_ITEM_HEIGHT}>
                            <WalletConnect
                                translate={translate}
                                selectedLanguage={selectedLanguage}
                            />
                        </div>
                        <div className="relative order-last sm:order-none">
                            <button
                                ref={buttonRef}
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className={cn(
                                    NAV_ITEM_BASE,
                                    NAV_ITEM_HEIGHT,
                                    'w-10'
                                )}
                            >
                                <Menu className="h-5 w-5 text-white" />
                            </button>
                            {isMobileMenuOpen && (
                                <div
                                    ref={menuRef}
                                    className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-end"
                                >
                                    <div className="bg-black w-64 h-full overflow-y-auto border-l border-gray-800">
                                        <div className="p-4">
                                            <div className="mb-4">
                                                <AdditionalSelector
                                                    onOpen={() => {}}
                                                    isOtherOpen={false}
                                                    onSelectCurrency={
                                                        onSelectCurrency
                                                    }
                                                    onSelectLanguage={
                                                        onSelectLanguage
                                                    }
                                                    onSelectShipping={
                                                        onSelectShipping
                                                    }
                                                    translate={translate}
                                                    selectedCurrency={
                                                        selectedCurrency
                                                    }
                                                    selectedLanguage={
                                                        selectedLanguage
                                                    }
                                                    selectedShipping={
                                                        selectedShipping
                                                    }
                                                />
                                            </div>
                                            {menuItems.map(
                                                ({
                                                    icon: Icon,
                                                    text,
                                                    href,
                                                }) => (
                                                    <a
                                                        key={text}
                                                        href={href}
                                                        className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-gray-800"
                                                    >
                                                        <Icon className="h-5 w-5" />
                                                        <span className="text-sm">
                                                            {translate(
                                                                text,
                                                                selectedLanguage
                                                            )}
                                                        </span>
                                                    </a>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            className={cn(
                                NAV_ITEM_BASE,
                                NAV_ITEM_HEIGHT,
                                'w-10'
                            )}
                        >
                            <ShoppingCart className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
