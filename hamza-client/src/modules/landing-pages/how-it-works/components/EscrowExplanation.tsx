'use client';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import {
    ShoppingCart,
    Package,
    CheckCircle,
    DollarSign,
    ArrowRight,
    ArrowDown,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface EscrowExplanationProps {
    selectedLanguage: string;
}

const escrowSteps = [
    {
        id: 1,
        title: 'Order Placed',
        description:
            'Buyer places order and funds are locked in smart contract',
        icon: ShoppingCart,
    },
    {
        id: 2,
        title: 'Seller Ships',
        description: 'Seller confirms shipment and provides tracking',
        icon: Package,
    },
    {
        id: 3,
        title: 'Buyer Receives',
        description: 'Buyer confirms receipt and quality of product',
        icon: CheckCircle,
    },
    {
        id: 4,
        title: 'Funds Released',
        description: 'Smart contract automatically releases payment to seller',
        icon: DollarSign,
    },
];

export default function EscrowExplanation({
    selectedLanguage,
}: EscrowExplanationProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const stepVariants = {
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

    const featureVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section
            id="escrow"
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
                {/* Overline */}
                <div className="text-gray-500 text-xs sm:text-sm font-light tracking-[0.2em] uppercase mb-4 sm:mb-6">
                    Security Framework
                </div>

                {/* Primary heading - Mobile-optimized */}
                <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-light text-white mb-6 sm:mb-8 tracking-tight leading-[1.1] px-2">
                    What is{' '}
                    <span className="text-purple-400 font-medium">Escrow</span>?
                </h2>

                {/* Subtitle - Mobile-optimized */}
                <div className="max-w-4xl mx-auto px-2">
                    <p className="text-base sm:text-lg lg:text-2xl font-light leading-relaxed text-gray-300 tracking-wide">
                        Escrow is a secure financial arrangement where a third
                        party holds and regulates payment of funds required for
                        two parties involved in a given transaction.
                    </p>
                </div>

                {/* Visual separator */}
                <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-6 sm:mt-8"></div>
            </motion.div>

            {/* Process Flow Section */}
            <div className="mb-20 sm:mb-24 lg:mb-40">
                <motion.div
                    className="text-center mb-12 sm:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{
                        duration: 0.6,
                        delay: 0.2,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                >
                    {/* Section subheading */}
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-3 sm:mb-4 tracking-wide">
                        How Escrow Works
                    </h3>
                    <div className="text-gray-400 text-sm sm:text-base font-light tracking-wide">
                        Four simple steps to secure transactions
                    </div>
                </motion.div>

                {/* Desktop Flow - Hidden on mobile/tablet */}
                <div className="hidden lg:block">
                    <motion.div
                        className="flex items-center justify-between max-w-5xl mx-auto mb-16"
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                    >
                        {escrowSteps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                className="flex items-center"
                                variants={stepVariants}
                            >
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        className="w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-400/20 to-purple-500/20 flex items-center justify-center text-3xl mb-8"
                                        whileHover={{
                                            scale: 1.1,
                                            background:
                                                'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.4))',
                                        }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 400,
                                            damping: 17,
                                        }}
                                    >
                                        <step.icon className="h-14 w-14 text-purple-400" />
                                    </motion.div>

                                    <div className="text-center max-w-44 space-y-4">
                                        {/* Step number */}
                                        <div className="text-purple-400 text-sm font-medium tracking-[0.1em] uppercase">
                                            Step {step.id}
                                        </div>

                                        {/* Step title */}
                                        <h4 className="font-medium text-lg mb-3 text-white leading-tight tracking-wide">
                                            {step.title}
                                        </h4>

                                        {/* Visual separator */}
                                        <div className="w-8 h-px bg-gray-700 mx-auto"></div>

                                        {/* Description */}
                                        <p className="text-sm text-gray-400 leading-relaxed tracking-wide">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {index < escrowSteps.length - 1 && (
                                    <motion.div
                                        className="flex items-center mx-8 min-w-20"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={
                                            isInView
                                                ? { opacity: 1, x: 0 }
                                                : { opacity: 0, x: -10 }
                                        }
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.4 + index * 0.1,
                                        }}
                                    >
                                        <motion.div
                                            animate={{ x: [0, 8, 0] }}
                                            transition={{
                                                duration: 2.5,
                                                repeat: Number.POSITIVE_INFINITY,
                                                ease: 'easeInOut',
                                            }}
                                        >
                                            <ArrowRight className="h-6 w-6 text-gray-600" />
                                        </motion.div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Mobile & Tablet Flow */}
                <motion.div
                    className="lg:hidden space-y-6 sm:space-y-8 mb-12 sm:mb-16"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    {escrowSteps.map((step, index) => (
                        <motion.div key={step.id} variants={stepVariants}>
                            <motion.div
                                className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-purple-400/5 border border-purple-400/20"
                                whileHover={{
                                    scale: 1.02,
                                    backgroundColor: 'rgba(168, 85, 247, 0.08)',
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30,
                                }}
                            >
                                <motion.div
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-400/20 to-purple-500/20 flex items-center justify-center flex-shrink-0"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 17,
                                    }}
                                >
                                    <step.icon className="h-8 w-8 sm:h-10 sm:w-10 text-purple-400" />
                                </motion.div>

                                <div className="flex-1 space-y-1 sm:space-y-2">
                                    <div className="text-purple-400 text-xs sm:text-sm font-medium tracking-[0.1em] uppercase">
                                        Step {step.id}
                                    </div>
                                    <h4 className="font-medium text-lg sm:text-xl leading-tight tracking-wide">
                                        {step.title}
                                    </h4>
                                    <div className="w-8 sm:w-12 h-px bg-gray-700"></div>
                                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed tracking-wide pr-2">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>

                            {index < escrowSteps.length - 1 && (
                                <motion.div
                                    className="flex justify-center my-4 sm:my-6"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={
                                        isInView
                                            ? { opacity: 1, y: 0 }
                                            : { opacity: 0, y: -10 }
                                    }
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.3 + index * 0.1,
                                    }}
                                >
                                    <motion.div
                                        animate={{ y: [0, 8, 0] }}
                                        transition={{
                                            duration: 2.5,
                                            repeat: Number.POSITIVE_INFINITY,
                                            ease: 'easeInOut',
                                        }}
                                    >
                                        <ArrowDown className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                                    </motion.div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Smart Contract Security Section - Mobile-optimized */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{
                    duration: 0.8,
                    delay: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
            >
                <Card className="bg-black border-purple-400/30 rounded-2xl sm:rounded-3xl hover:border-purple-400/50 transition-colors duration-500">
                    <CardContent className="p-8 sm:p-10 lg:p-16">
                        {/* Section header - Mobile-optimized */}
                        <motion.div
                            className="text-center mb-12 sm:mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 20 }
                            }
                            transition={{
                                duration: 0.6,
                                delay: 0.8,
                                ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                        >
                            <div className="flex items-center justify-center mb-4 sm:mb-6">
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{
                                        duration: 0.6,
                                        ease: 'easeInOut',
                                    }}
                                    className="inline-block"
                                >
                                    <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-purple-400" />
                                </motion.div>
                            </div>

                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-4 sm:mb-6 tracking-wide">
                                Smart Contract Security
                            </h3>

                            <div className="max-w-3xl mx-auto px-2">
                                <p className="text-white text-base sm:text-lg lg:text-xl font-light leading-relaxed tracking-wide">
                                    Our escrow system is powered by audited
                                    smart contracts that ensure complete
                                    transparency and eliminate the need for
                                    trust between parties.
                                </p>
                            </div>

                            <div className="w-12 sm:w-16 h-px bg-purple-400 mx-auto mt-4 sm:mt-6"></div>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
                            {/* Security Features - Mobile-optimized */}
                            <motion.div
                                className="space-y-6 sm:space-y-8"
                                variants={containerVariants}
                                initial="hidden"
                                animate={isInView ? 'visible' : 'hidden'}
                            >
                                <div className="space-y-2">
                                    <h4 className="text-lg sm:text-xl lg:text-2xl font-medium text-white tracking-wide">
                                        Security Features
                                    </h4>
                                    <div className="w-8 sm:w-12 h-px bg-purple-400"></div>
                                </div>

                                <ul className="space-y-4 sm:space-y-6">
                                    {[
                                        'Multi-signature wallet protection',
                                        'Automated dispute resolution',
                                        'Immutable transaction records',
                                        'Time-locked fund release',
                                    ].map((feature, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-start space-x-3 sm:space-x-4"
                                            variants={featureVariants}
                                            whileHover={{ x: 8 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 30,
                                            }}
                                        >
                                            <motion.div
                                                className="mt-1 flex-shrink-0"
                                                whileHover={{
                                                    scale: 1.2,
                                                    rotate: 360,
                                                }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 400,
                                                    damping: 17,
                                                }}
                                            >
                                                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                                            </motion.div>
                                            <span className="text-white text-sm sm:text-base lg:text-lg font-light leading-relaxed tracking-wide">
                                                {feature}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* Dispute Resolution - Mobile-optimized */}
                            <motion.div
                                className="space-y-6 sm:space-y-8"
                                variants={containerVariants}
                                initial="hidden"
                                animate={isInView ? 'visible' : 'hidden'}
                            >
                                <div className="space-y-2">
                                    <h4 className="text-lg sm:text-xl lg:text-2xl font-medium text-white tracking-wide">
                                        Dispute Resolution
                                    </h4>
                                    <div className="w-8 sm:w-12 h-px bg-green-400"></div>
                                </div>

                                <ul className="space-y-4 sm:space-y-6">
                                    {[
                                        'Decentralized arbitration network',
                                        'Evidence-based resolution system',
                                        'Fair fee redistribution',
                                        'Community-driven governance',
                                    ].map((feature, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-start space-x-3 sm:space-x-4"
                                            variants={featureVariants}
                                            whileHover={{ x: 8 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 30,
                                            }}
                                        >
                                            <motion.div
                                                className="mt-1 flex-shrink-0"
                                                whileHover={{
                                                    scale: 1.2,
                                                    rotate: 360,
                                                }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 400,
                                                    damping: 17,
                                                }}
                                            >
                                                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                                            </motion.div>
                                            <span className="text-white text-sm sm:text-base lg:text-lg font-light leading-relaxed tracking-wide">
                                                {feature}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </section>
    );
}
