'use client';
import { CreditCard } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface AcceptedCryptoProps {
    selectedLanguage: string;
}

const cryptos = [
    { name: 'Bitcoin', symbol: 'BTC', icon: '/icons/bitcoin.svg' },
    { name: 'Ethereum', symbol: 'ETH', icon: '/icons/ethereum.svg' },
    { name: 'USDT', symbol: 'USDT', icon: '/icons/tether.svg' },
    { name: 'USDC', symbol: 'USDC', icon: '/icons/usdc.svg' },
];

export default function AcceptedCrypto({
    selectedLanguage,
}: AcceptedCryptoProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section
            id="crypto"
            className="mt-12 sm:mt-16 max-w-[1200px] mx-auto px-4 relative z-10"
            ref={ref}
        >
            {/* Typography Hierarchy - Section Header with Green Theme */}
            <motion.div
                className="text-center mb-16 sm:mb-20 lg:mb-24"
                initial={{ opacity: 0, y: 30 }}
                animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                {/* Overline */}
                <div className="text-gray-500 text-xs sm:text-sm font-light tracking-[0.2em] uppercase mb-4 sm:mb-6">
                    Payment Methods
                </div>

                {/* Primary heading - Mobile-optimized */}
                <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-light text-white mb-6 sm:mb-8 tracking-tight leading-[1.1] px-2">
                    We Accept a Wide Range of{' '}
                    <span className="text-green-400 font-medium">
                        Cryptocurrencies
                    </span>
                </h2>

                {/* Visual separator */}
                <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto"></div>
            </motion.div>

            {/* Crypto Grid - Mobile-optimized */}
            <motion.div
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-12 mb-12 sm:mb-16"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
            >
                {cryptos.map((crypto, index) => (
                    <motion.div
                        key={crypto.symbol}
                        className="bg-black/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden p-6 sm:p-8 lg:p-12 text-center group cursor-pointer border border-gray-800/50 hover:border-green-400/30"
                        variants={itemVariants}
                        whileHover={{
                            scale: 1.05,
                            y: -12,
                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
                            borderColor: 'rgba(34, 197, 94, 0.5)',
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 17,
                        }}
                    >
                        {/* Icon - REMOVED HOVER ANIMATIONS 
            <div className="mb-6 sm:mb-8 mx-auto w-fit">
              {crypto.icon === CreditCard ? (
                <CreditCard className="h-12 w-12 sm:h-16 sm:w-16 text-green-400" />
              ) : (
                <Image
                  src={crypto.icon || "/placeholder.svg"}
                  alt={`${crypto.name} logo`}
                  width={64}
                  height={64}
                  className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24"
                />
              )}
            </div>*/}

                        {/* Typography - Mobile-optimized */}
                        <div className="space-y-2 sm:space-y-3">
                            <motion.h3
                                className="text-lg sm:text-xl lg:text-2xl font-medium text-white group-hover:text-green-400 transition-colors duration-300 leading-tight tracking-wide"
                                initial={{ opacity: 0 }}
                                animate={
                                    isInView ? { opacity: 1 } : { opacity: 0 }
                                }
                                transition={{
                                    duration: 0.5,
                                    delay: 0.5 + index * 0.1,
                                }}
                            >
                                {crypto.name}
                            </motion.h3>

                            {/* Visual separator */}
                            <div className="w-6 sm:w-8 h-px bg-gray-700 group-hover:bg-green-400 transition-colors duration-300 mx-auto"></div>

                            <motion.p
                                className="text-gray-400 text-sm sm:text-base lg:text-lg font-light tracking-[0.1em] uppercase"
                                initial={{ opacity: 0 }}
                                animate={
                                    isInView ? { opacity: 1 } : { opacity: 0 }
                                }
                                transition={{
                                    duration: 0.5,
                                    delay: 0.6 + index * 0.1,
                                }}
                            >
                                {crypto.symbol}
                            </motion.p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Footer text - REMOVED 3 DOTS */}
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{
                    duration: 0.6,
                    delay: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
            >
                <p className="text-gray-400 text-base sm:text-lg lg:text-xl font-light leading-relaxed tracking-wide max-w-2xl mx-auto px-2">
                    More cryptocurrencies are being added continuously. Stay
                    tuned for updates!
                </p>
            </motion.div>
        </section>
    );
}
