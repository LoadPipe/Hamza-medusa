import { Metadata } from 'next';
import { Box } from '@chakra-ui/react';

export const metadata: Metadata = {
    title: 'How it Works | Hamza',
    description: 'What Hamza is and how to use it.',
    keywords: 'Hamza',
    openGraph: {
        title: 'How it Works | Hamza',
        description: 'What Hamza is and how to use it.',
        type: 'website',
    },
};

type Params = {
    params: {
        countryCode: string;
    };
};

export default async function HowItWorksPage({ params }: Params) {
    return (
        <Box
            style={{
                background:
                    'linear-gradient(to bottom, #020202 0%, #1a1a1a 100%)',
                minHeight: '100vh',
            }}
        >
            <div className="min-h-screen bg-black text-white">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
                    <div className="relative z-10">
                        <div className="space-y-32 lg:space-y-48">
                            <section className="relative min-h-screen flex items-center justify-center px-4">
                                <div
                                    className="absolute inset-0 opacity-10"
                                    style={{ opacity: 0 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-transparent to-purple-500/20"></div>
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundImage: `
                                        radial-gradient(circle at 25% 25%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
                                        radial-gradient(circle at 75% 75%, rgba(128, 0, 128, 0.1) 0%, transparent 50%)
                                        `,
                                        }}
                                    ></div>
                                </div>
                                <div className="hidden sm:block max-w-[1200px] mx-auto text-center relative z-10 w-full">
                                    <div>
                                        <div
                                            className="space-y-6 sm:space-y-8"
                                            style={{
                                                opacity: 0,
                                                transform: 'translateY(30px)',
                                            }}
                                        >
                                            <div
                                                className="text-gray-400 text-xs sm:text-sm font-light tracking-[0.2em] uppercase mb-6 sm:mb-8"
                                                style={{
                                                    opacity: 0,
                                                    transform:
                                                        'translateY(20px)',
                                                }}
                                            >
                                                The Future of Commerce
                                            </div>
                                            <h1 className="space-y-2 sm:space-y-4 lg:space-y-6">
                                                <div
                                                    className="text-4xl sm:text-6xl lg:text-8xl xl:text-9xl font-extralight leading-[0.9] tracking-tight"
                                                    style={{
                                                        opacity: 0,
                                                        transform:
                                                            'translateY(20px)',
                                                    }}
                                                >
                                                    <span className="bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
                                                        Decentralized
                                                    </span>
                                                </div>

                                                <div
                                                    className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-light leading-[0.9] tracking-tight text-white"
                                                    style={{
                                                        opacity: 0,
                                                        transform:
                                                            'translateY(20px)',
                                                    }}
                                                >
                                                    E-Commerce
                                                </div>

                                                <div
                                                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-12 pt-2 sm:pt-4"
                                                    style={{
                                                        opacity: 0,
                                                        transform:
                                                            'translateY(20px)',
                                                    }}
                                                >
                                                    <span className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-light text-white tracking-tight">
                                                        Reimagined
                                                    </span>

                                                    {/* 
                                                    <div
                                                        className="flex items-center gap-4 sm:gap-6 lg:gap-8"
                                                        style={{
                                                            opacity: 0,
                                                            transform:
                                                                'translateX(20px)',
                                                        }}
                                                    >
                                                        {[
                                                            {
                                                                alt: 'Bitcoin logo',
                                                                src: '/icons/bitcoin.svg',
                                                            },
                                                            {
                                                                alt: 'Ethereum logo',
                                                                src: '/icons/ethereum.svg',
                                                            },
                                                            {
                                                                alt: 'USDT logo',
                                                                src: '/icons/tether.svg',
                                                            },
                                                            {
                                                                alt: 'USDC logo',
                                                                src: '/icons/usdc.svg',
                                                            },
                                                        ].map(
                                                            ({ alt, src }) => (
                                                                <div
                                                                    key={alt}
                                                                    style={{
                                                                        opacity: 0,
                                                                        transform:
                                                                            'scale(0.8)',
                                                                    }}
                                                                >
                                                                    <img
                                                                        alt={
                                                                            alt
                                                                        }
                                                                        loading="lazy"
                                                                        width="40"
                                                                        height="40"
                                                                        decoding="async"
                                                                        className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 opacity-80"
                                                                        style={{
                                                                            color: 'transparent',
                                                                        }}
                                                                        src={
                                                                            src
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                    */}
                                                </div>
                                            </h1>
                                            <div
                                                className="pt-6 sm:pt-8 lg:pt-12"
                                                style={{
                                                    opacity: 0,
                                                    transform:
                                                        'translateY(20px)',
                                                }}
                                            >
                                                <p className="text-lg sm:text-xl lg:text-3xl font-light leading-relaxed text-gray-300 max-w-4xl mx-auto tracking-wide px-4">
                                                    The world&apos;s first truly
                                                    decentralized marketplace
                                                    where buyers and sellers
                                                    trade directly, securely,
                                                    and transparently on the
                                                    blockchain.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="pt-12 lg:pt-20 flex justify-center"
                                    style={{
                                        opacity: 0,
                                        transform: 'translateY(20px)',
                                    }}
                                >
                                    <button className="group flex flex-col items-center space-y-4 sm:space-y-6 text-gray-400 hover:text-green-400 transition-colors duration-500">
                                        <div className="text-center space-y-2">
                                            <div className="text-xs sm:text-sm font-medium tracking-[0.15em] uppercase">
                                                Learn More
                                            </div>
                                            <div className="w-12 sm:w-16 h-px bg-gray-600 group-hover:bg-green-400 transition-colors duration-500 mx-auto"></div>
                                        </div>

                                        <div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-arrow-down h-5 w-5 sm:h-6 sm:w-6"
                                            >
                                                <path d="M12 5v14"></path>
                                                <path d="m19 12-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    );
}
