'use client';
import { Button } from '@modules/landing-pages/how-it-works/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface CallToActionProps {
    selectedLanguage: string;
}

export default function CallToAction({ selectedLanguage }: CallToActionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section
            className="max-w-[900px] mx-auto px-4 relative z-10 pb-20"
            ref={ref}
        >
            <motion.div
                className="relative bg-black/80 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 sm:p-12 lg:p-20 text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <div className="space-y-8 sm:space-y-10 lg:space-y-12">
                    {/* Typography Hierarchy - Clean and Simple */}
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        transition={{
                            duration: 0.6,
                            delay: 0.2,
                            ease: 'easeOut',
                        }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-light text-white leading-tight tracking-tight">
                            Start Trading{' '}
                            <span className="bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
                                Decentralized
                            </span>{' '}
                            Today
                        </h2>

                        <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed font-light max-w-2xl mx-auto">
                            Join the world's first truly decentralized
                            marketplace. No middlemen, just direct peer-to-peer
                            commerce.
                        </p>
                    </motion.div>

                    {/* CTA Button - Simple and Clean */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        transition={{
                            duration: 0.6,
                            delay: 0.4,
                            ease: 'easeOut',
                        }}
                    >
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black px-8 py-4 text-lg sm:px-10 sm:py-5 sm:text-xl lg:px-12 lg:py-6 font-medium rounded-full transition-all duration-300"
                            asChild
                        >
                            <a
                                href="http://hamza.market/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Launch Marketplace
                                <ArrowRight className="ml-3 h-6 w-6" />
                            </a>
                        </Button>
                    </motion.div>

                    {/* Simple Feature List */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-gray-400"
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        transition={{
                            duration: 0.6,
                            delay: 0.6,
                            ease: 'easeOut',
                        }}
                    >
                        <span className="text-xs sm:text-sm">
                            No signup required
                        </span>
                        <div className="hidden sm:block w-px h-4 bg-gray-700"></div>
                        <span className="text-xs sm:text-sm">
                            Start trading in seconds
                        </span>
                        <div className="hidden sm:block w-px h-4 bg-gray-700"></div>
                        <span className="text-xs sm:text-sm">
                            Completely decentralized
                        </span>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
