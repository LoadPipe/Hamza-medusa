'use client';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

interface WhatIsHamzaProps {
    selectedLanguage: string;
}

export default function WhatIsHamza({ selectedLanguage }: WhatIsHamzaProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const comparisonData = [
        {
            feature: 'Transaction Fees',
            traditional: {
                text: '10-15% platform fees',
                emoji: '💸',
                negative: true,
            },
            hamza: { text: '2-3% minimal fees', emoji: '💰', negative: false },
        },
        {
            feature: 'Payment Processing',
            traditional: {
                text: '3-7 business days',
                emoji: '⏳',
                negative: true,
            },
            hamza: {
                text: 'Instant settlements',
                emoji: '⚡',
                negative: false,
            },
        },
        {
            feature: 'Payment Methods',
            traditional: {
                text: 'Credit cards only',
                emoji: '💳',
                negative: true,
            },
            hamza: {
                text: 'Multiple cryptocurrencies',
                emoji: '🪙',
                negative: false,
            },
        },
        {
            feature: 'Dispute Resolution',
            traditional: {
                text: 'Opaque process',
                emoji: '❓',
                negative: true,
            },
            hamza: {
                text: 'Transparent smart contracts',
                emoji: '🔍',
                negative: false,
            },
        },
        {
            feature: 'Data Control',
            traditional: {
                text: 'Platform owns your data',
                emoji: '🕵️',
                negative: true,
            },
            hamza: {
                text: 'You control your data',
                emoji: '🔐',
                negative: false,
            },
        },
        {
            feature: 'Global Access',
            traditional: {
                text: 'Geographic restrictions',
                emoji: '🚫',
                negative: true,
            },
            hamza: {
                text: 'Worldwide accessibility',
                emoji: '🌍',
                negative: false,
            },
        },
    ];

    return (
        <section
            id="what-is-hamza"
            className="max-w-[1200px] mx-auto px-4 relative z-10"
            ref={ref}
        >
            {/* Typography Hierarchy - Section Header with Purple Theme */}
            <motion.div
                className="text-center mb-16 sm:mb-20 lg:mb-32"
                initial={{ opacity: 0, y: 30 }}
                animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                {/* Overline with proper tracking */}
                <div className="text-gray-500 text-xs sm:text-sm font-light tracking-[0.2em] uppercase mb-4 sm:mb-6">
                    Platform Overview
                </div>

                {/* Primary heading with mobile-optimized scale */}
                <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-light text-white mb-6 sm:mb-8 tracking-tight leading-[1.1] px-2">
                    What is{' '}
                    <span className="text-purple-400 font-medium">Hamza</span>?
                </h2>

                {/* Subtitle with mobile-optimized text size */}
                <div className="max-w-4xl mx-auto px-2">
                    <p className="text-base sm:text-lg lg:text-2xl font-light leading-relaxed text-gray-300 tracking-wide">
                        Hamza is a revolutionary decentralized e-commerce
                        platform that eliminates traditional intermediaries,
                        enabling direct, secure, and transparent transactions
                        between buyers and sellers worldwide using blockchain
                        technology.
                    </p>
                </div>

                {/* Visual separator */}
                <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-6 sm:mt-8"></div>
            </motion.div>

            {/* Main Content - Mobile-optimized spacing */}
            <div className="space-y-20 sm:space-y-24 lg:space-y-40">
                {/* Smart Contract Infographic - Mobile-optimized */}
                <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                    }
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                >
                    <motion.div
                        className="bg-[#08090b] backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-800 max-w-3xl w-full overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                        }}
                    >
                        <div className="space-y-8 sm:space-y-12">
                            {/* Section header */}
                            <motion.div
                                className="text-center pt-8 sm:pt-12 lg:pt-20 px-8 sm:px-12 lg:px-20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={
                                    isInView
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 20 }
                                }
                                transition={{
                                    duration: 0.6,
                                    delay: 0.5,
                                    ease: 'easeOut',
                                }}
                            >
                                <h3 className="text-lg sm:text-2xl lg:text-3xl font-light text-white mb-4 sm:mb-6 tracking-wide px-2">
                                    Direct Connection Through Smart Contracts
                                </h3>
                                <div className="w-12 sm:w-16 h-px bg-purple-400 mx-auto"></div>
                            </motion.div>

                            {/* Smart Contract Infographic Image - Full width, touching sides */}
                            <motion.div
                                className="w-full"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={
                                    isInView
                                        ? { opacity: 1, scale: 1 }
                                        : { opacity: 0, scale: 0.9 }
                                }
                                transition={{
                                    duration: 0.8,
                                    delay: 0.7,
                                    ease: 'easeOut',
                                }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Image
                                    src="/smart-contract-infographic.png"
                                    alt="Smart Contract connecting Buyer and Seller"
                                    width={800}
                                    height={500}
                                    className="w-full h-auto object-cover"
                                />
                            </motion.div>

                            {/* Description */}
                            <motion.div
                                className="text-center pb-8 sm:pb-12 lg:pb-20 px-8 sm:px-12 lg:px-20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={
                                    isInView
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 20 }
                                }
                                transition={{
                                    duration: 0.6,
                                    delay: 0.9,
                                    ease: 'easeOut',
                                }}
                            >
                                <p className="text-sm sm:text-base lg:text-lg text-gray-300 font-light tracking-wide leading-relaxed max-w-2xl mx-auto px-2">
                                    Smart contracts eliminate the need for
                                    traditional intermediaries, enabling direct,
                                    secure, and automated transactions between
                                    buyers and sellers.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Desktop Comparison Table - Hidden on mobile */}
                <motion.div
                    className="hidden sm:flex justify-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                    }
                    transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                >
                    <div className="max-w-5xl w-full">
                        {/* Typography-focused header */}
                        <div className="text-center mb-12 sm:mb-20">
                            {/* Overline */}
                            <div className="text-gray-500 text-xs sm:text-sm font-light tracking-[0.2em] uppercase mb-4 sm:mb-6">
                                Platform Comparison
                            </div>

                            {/* Main heading */}
                            <h3 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-white mb-6 sm:mb-8 tracking-tight leading-[1.1] px-2">
                                Traditional E-commerce
                                <span className="block sm:inline sm:mx-4 lg:mx-8 text-gray-600 font-thin text-lg sm:text-2xl lg:text-3xl my-2 sm:my-0">
                                    vs.
                                </span>
                                <span className="text-purple-400 font-medium">
                                    Hamza
                                </span>
                            </h3>

                            {/* Visual separator */}
                            <div className="w-20 sm:w-32 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"></div>
                        </div>

                        <Card className="bg-black/50 backdrop-blur-sm border-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden">
                            <CardContent className="p-0">
                                {/* Desktop table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[600px] sm:min-w-0">
                                        {/* Header */}
                                        <thead>
                                            <tr className="border-b border-gray-800/50">
                                                <th className="text-left p-6 sm:p-8 lg:p-10 w-1/3">
                                                    <div className="space-y-2 sm:space-y-3">
                                                        <div className="text-gray-300 font-medium text-base sm:text-xl lg:text-2xl tracking-wide">
                                                            Feature
                                                        </div>
                                                        <div className="w-8 sm:w-12 h-px bg-gray-700"></div>
                                                        <div className="text-gray-500 text-xs sm:text-sm font-light tracking-[0.1em] uppercase">
                                                            Comparison
                                                        </div>
                                                    </div>
                                                </th>
                                                <th className="text-center p-6 sm:p-8 lg:p-10 w-1/3">
                                                    <div className="space-y-2 sm:space-y-3">
                                                        <div className="text-red-400 font-medium text-base sm:text-xl lg:text-2xl tracking-wide">
                                                            Traditional
                                                        </div>
                                                        <div className="w-12 sm:w-16 h-px bg-red-400/50 mx-auto"></div>
                                                        <div className="text-gray-500 text-xs sm:text-sm font-light tracking-[0.1em] uppercase">
                                                            Legacy Systems
                                                        </div>
                                                    </div>
                                                </th>
                                                <th className="text-center p-6 sm:p-8 lg:p-10 w-1/3">
                                                    <div className="space-y-2 sm:space-y-3">
                                                        <div className="text-purple-400 font-medium text-base sm:text-xl lg:text-2xl tracking-wide">
                                                            Hamza
                                                        </div>
                                                        <div className="w-12 sm:w-16 h-px bg-purple-400 mx-auto"></div>
                                                        <div className="text-gray-500 text-xs sm:text-sm font-light tracking-[0.1em] uppercase">
                                                            Blockchain-Powered
                                                        </div>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {comparisonData.map(
                                                (row, index) => (
                                                    <motion.tr
                                                        key={index}
                                                        className="border-b border-gray-800/30 last:border-b-0 group"
                                                        initial={{
                                                            opacity: 0,
                                                            y: 20,
                                                        }}
                                                        animate={
                                                            isInView
                                                                ? {
                                                                      opacity: 1,
                                                                      y: 0,
                                                                  }
                                                                : {
                                                                      opacity: 0,
                                                                      y: 20,
                                                                  }
                                                        }
                                                        transition={{
                                                            duration: 0.5,
                                                            delay:
                                                                0.7 +
                                                                index * 0.1,
                                                            ease: 'easeOut',
                                                        }}
                                                        whileHover={{
                                                            backgroundColor:
                                                                'rgba(255, 255, 255, 0.02)',
                                                        }}
                                                    >
                                                        {/* Feature column */}
                                                        <td className="p-6 sm:p-8 lg:p-10 align-top">
                                                            <div className="space-y-2 sm:space-y-3">
                                                                <div className="text-white font-medium text-sm sm:text-lg lg:text-xl leading-tight tracking-wide">
                                                                    {
                                                                        row.feature
                                                                    }
                                                                </div>
                                                                <div className="w-8 sm:w-12 h-px bg-gray-700 group-hover:bg-purple-400/50 transition-colors duration-300"></div>
                                                                <div className="text-gray-500 text-xs sm:text-sm font-light tracking-wide">
                                                                    Key
                                                                    Difference
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Traditional column */}
                                                        <td className="p-6 sm:p-8 lg:p-10 text-center align-top">
                                                            <div className="space-y-3 sm:space-y-6">
                                                                <motion.div
                                                                    className="text-2xl sm:text-4xl lg:text-5xl"
                                                                    whileHover={{
                                                                        scale: 1.2,
                                                                        rotate: -5,
                                                                    }}
                                                                    transition={{
                                                                        type: 'spring',
                                                                        stiffness: 400,
                                                                        damping: 17,
                                                                    }}
                                                                >
                                                                    {
                                                                        row
                                                                            .traditional
                                                                            .emoji
                                                                    }
                                                                </motion.div>
                                                                <div className="space-y-2 sm:space-y-3">
                                                                    <div className="text-gray-300 text-xs sm:text-base lg:text-lg leading-relaxed max-w-32 sm:max-w-48 mx-auto font-light tracking-wide">
                                                                        {
                                                                            row
                                                                                .traditional
                                                                                .text
                                                                        }
                                                                    </div>
                                                                    <motion.div
                                                                        className="flex justify-center"
                                                                        whileHover={{
                                                                            scale: 1.1,
                                                                        }}
                                                                        transition={{
                                                                            type: 'spring',
                                                                            stiffness: 400,
                                                                            damping: 17,
                                                                        }}
                                                                    >
                                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                                                                            <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                                                                        </div>
                                                                    </motion.div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Hamza column */}
                                                        <td className="p-6 sm:p-8 lg:p-10 text-center align-top">
                                                            <div className="space-y-3 sm:space-y-6">
                                                                <motion.div
                                                                    className="text-2xl sm:text-4xl lg:text-5xl"
                                                                    whileHover={{
                                                                        scale: 1.2,
                                                                        rotate: 5,
                                                                    }}
                                                                    transition={{
                                                                        type: 'spring',
                                                                        stiffness: 400,
                                                                        damping: 17,
                                                                    }}
                                                                >
                                                                    {
                                                                        row
                                                                            .hamza
                                                                            .emoji
                                                                    }
                                                                </motion.div>
                                                                <div className="space-y-2 sm:space-y-3">
                                                                    <div className="text-gray-300 text-xs sm:text-base lg:text-lg leading-relaxed max-w-32 sm:max-w-48 mx-auto font-light tracking-wide">
                                                                        {
                                                                            row
                                                                                .hamza
                                                                                .text
                                                                        }
                                                                    </div>
                                                                    <motion.div
                                                                        className="flex justify-center"
                                                                        whileHover={{
                                                                            scale: 1.1,
                                                                        }}
                                                                        transition={{
                                                                            type: 'spring',
                                                                            stiffness: 400,
                                                                            damping: 17,
                                                                        }}
                                                                    >
                                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                                                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                                                                        </div>
                                                                    </motion.div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Enhanced footer */}
                                <motion.div
                                    className="bg-gradient-to-r from-purple-400/5 to-purple-500/10 p-6 sm:p-12 text-center border-t border-gray-800/50"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={
                                        isInView
                                            ? { opacity: 1, y: 0 }
                                            : { opacity: 0, y: 20 }
                                    }
                                    transition={{
                                        duration: 0.6,
                                        delay: 1.2,
                                        ease: 'easeOut',
                                    }}
                                >
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="text-white text-base sm:text-lg lg:text-xl font-medium tracking-wide px-2">
                                            Experience the difference with
                                            blockchain-powered commerce
                                        </div>
                                        <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-purple-400 to-purple-500 mx-auto"></div>
                                        <div className="text-gray-400 text-sm sm:text-base font-light tracking-wide px-2">
                                            Join the decentralized revolution
                                            today
                                        </div>
                                    </div>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                {/* Mobile Comparison Cards - Only visible on mobile */}
                <motion.div
                    className="block sm:hidden"
                    initial={{ opacity: 0, y: 50 }}
                    animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                    }
                    transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                >
                    <div className="max-w-md mx-auto">
                        {/* Mobile header */}
                        <div className="text-center mb-8">
                            <div className="text-gray-500 text-xs font-light tracking-[0.2em] uppercase mb-3">
                                Platform Comparison
                            </div>
                            <h3 className="text-xl font-light text-white mb-4 tracking-tight leading-[1.1]">
                                Traditional E-commerce
                                <span className="block text-gray-600 font-thin text-base my-1">
                                    vs.
                                </span>
                                <span className="text-purple-400 font-medium">
                                    Hamza
                                </span>
                            </h3>
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"></div>
                        </div>

                        {/* Mobile comparison cards */}
                        <div className="space-y-4">
                            {comparisonData.map((row, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={
                                        isInView
                                            ? { opacity: 1, y: 0 }
                                            : { opacity: 0, y: 20 }
                                    }
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.7 + index * 0.1,
                                        ease: 'easeOut',
                                    }}
                                >
                                    {/* Feature name */}
                                    <div className="text-center mb-4">
                                        <h4 className="text-white font-medium text-base tracking-wide">
                                            {row.feature}
                                        </h4>
                                        <div className="w-8 h-px bg-gray-700 mx-auto mt-2"></div>
                                    </div>

                                    {/* Comparison grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Traditional column */}
                                        <div className="text-center space-y-3 p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                                            <div className="text-red-400 text-xs font-medium tracking-[0.1em] uppercase">
                                                Traditional
                                            </div>
                                            <div className="text-2xl">
                                                {row.traditional.emoji}
                                            </div>
                                            <div className="text-gray-300 text-xs leading-relaxed font-light">
                                                {row.traditional.text}
                                            </div>
                                            <div className="flex justify-center">
                                                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                                                    <X className="h-3 w-3 text-red-400" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hamza column */}
                                        <div className="text-center space-y-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                                            <div className="text-purple-400 text-xs font-medium tracking-[0.1em] uppercase">
                                                Hamza
                                            </div>
                                            <div className="text-2xl">
                                                {row.hamza.emoji}
                                            </div>
                                            <div className="text-gray-300 text-xs leading-relaxed font-light">
                                                {row.hamza.text}
                                            </div>
                                            <div className="flex justify-center">
                                                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                                    <Check className="h-3 w-3 text-purple-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mobile footer */}
                        <motion.div
                            className="bg-gradient-to-r from-purple-400/5 to-purple-500/10 p-6 text-center border border-gray-800/50 rounded-xl mt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 20 }
                            }
                            transition={{
                                duration: 0.6,
                                delay: 1.2,
                                ease: 'easeOut',
                            }}
                        >
                            <div className="space-y-2">
                                <div className="text-white text-sm font-medium tracking-wide">
                                    Experience the difference with
                                    blockchain-powered commerce
                                </div>
                                <div className="w-12 h-px bg-gradient-to-r from-purple-400 to-purple-500 mx-auto"></div>
                                <div className="text-gray-400 text-xs font-light tracking-wide">
                                    Join the decentralized revolution today
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
