'use client';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@modules/landing-pages/how-it-works/components/ui/accordion';
import {
    Card,
    CardContent,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { Users, Target, Lightbulb, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface AboutUsAccordionProps {
    selectedLanguage: string;
}

const accordionItems = [
    {
        value: 'mission',
        trigger: 'Our Mission',
        icon: Target,
        content:
            'To democratize global commerce by creating a decentralized marketplace that empowers individuals and businesses to trade directly, securely, and transparently without traditional intermediaries.',
    },
    {
        value: 'vision',
        trigger: 'Our Vision',
        icon: Lightbulb,
        content:
            "To become the world's leading decentralized e-commerce platform, fostering a global economy where trust is built through technology, not institutions, and where every participant has equal access to opportunities.",
    },
    {
        value: 'team',
        trigger: 'Our Team',
        icon: Users,
        content:
            'We are a diverse team of blockchain developers, e-commerce experts, and visionaries united by our passion for decentralization. Our combined expertise spans smart contract development, user experience design, and marketplace operations.',
    },
    {
        value: 'technology',
        trigger: 'Our Technology',
        icon: Rocket,
        content:
            'Built on cutting-edge blockchain technology, Hamza leverages smart contracts, IPFS for decentralized storage, and advanced cryptographic protocols to ensure security, transparency, and scalability for global commerce.',
    },
];

export default function AboutUsAccordion({
    selectedLanguage,
}: AboutUsAccordionProps) {
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
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section
            id="about-us"
            className="max-w-[1200px] mx-auto px-4 relative z-10"
            ref={ref}
        >
            {/* Typography Hierarchy - Section Header with Green Theme */}
            <motion.div
                className="text-center mb-24 lg:mb-32"
                initial={{ opacity: 0, y: 30 }}
                animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                {/* Overline */}
                <div className="text-gray-500 text-sm font-light tracking-[0.2em] uppercase mb-6">
                    Our Foundation
                </div>

                {/* Primary heading */}
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-8 tracking-tight leading-[1.1]">
                    Why{' '}
                    <span className="text-green-400 font-medium">Hamza</span>?
                </h2>

                {/* Subtitle */}
                <div className="max-w-3xl mx-auto">
                    <p className="text-xl lg:text-2xl font-light leading-relaxed text-gray-300 tracking-wide">
                        Learn more about the team and vision behind Hamza's
                        revolutionary approach to decentralized commerce.
                    </p>
                </div>

                {/* Visual separator */}
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto mt-8"></div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-20 lg:gap-24 items-start">
                {/* Left Side - Accordions with Enhanced Typography */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full space-y-8"
                    >
                        {accordionItems.map((item, index) => (
                            <motion.div
                                key={item.value}
                                variants={itemVariants}
                            >
                                <AccordionItem
                                    value={item.value}
                                    className="border border-gray-800 rounded-3xl bg-black/50 backdrop-blur-sm px-10 py-4 data-[state=open]:border-green-400/50 hover:border-green-400/30 transition-colors duration-300"
                                >
                                    <AccordionTrigger className="hover:no-underline text-xl lg:text-2xl text-white hover:text-green-400 py-10 transition-colors duration-300">
                                        <motion.div
                                            className="flex items-center space-x-6"
                                            whileHover={{ x: 8 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 30,
                                            }}
                                        >
                                            <motion.div
                                                className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-green-500/20 rounded-2xl flex items-center justify-center"
                                                whileHover={{
                                                    scale: 1.1,
                                                    background:
                                                        'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.4))',
                                                }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 400,
                                                    damping: 17,
                                                }}
                                            >
                                                <motion.div
                                                    whileHover={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 0.6,
                                                        ease: 'easeInOut',
                                                    }}
                                                >
                                                    <item.icon className="h-8 w-8 text-green-400" />
                                                </motion.div>
                                            </motion.div>

                                            <div className="text-left">
                                                <span className="font-light tracking-wide">
                                                    {item.trigger}
                                                </span>
                                            </div>
                                        </motion.div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-white pb-10 leading-relaxed text-base lg:text-lg font-light tracking-wide">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.4,
                                                ease: 'easeOut',
                                            }}
                                            className="pl-22"
                                        >
                                            {item.content}
                                        </motion.div>
                                    </AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>
                </motion.div>

                {/* Right Side - About Text & Stats with Enhanced Typography */}
                <motion.div
                    className="space-y-12"
                    initial={{ opacity: 0, x: 50 }}
                    animate={
                        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
                    }
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                >
                    <motion.div
                        whileHover={{ y: -8 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                        }}
                    >
                        <Card className="bg-black border-green-400/30 rounded-3xl hover:border-green-400/50 transition-colors duration-500">
                            <CardContent className="p-12 lg:p-16">
                                {/* Section header */}
                                <motion.div
                                    className="mb-10"
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
                                    <h3 className="text-2xl lg:text-3xl font-light text-white mb-4 tracking-wide">
                                        Why Hamza?
                                    </h3>
                                    <div className="w-16 h-px bg-green-400"></div>
                                </motion.div>

                                {/* Content with proper typography */}
                                <motion.div
                                    className="space-y-8 text-white leading-relaxed text-base lg:text-lg font-light tracking-wide"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate={isInView ? 'visible' : 'hidden'}
                                >
                                    <motion.p
                                        variants={itemVariants}
                                        className="leading-[1.7]"
                                    >
                                        Traditional e-commerce platforms have
                                        dominated the market for decades, taking
                                        substantial fees and controlling every
                                        aspect of online trade. We believe it's
                                        time for a change.
                                    </motion.p>
                                    <motion.p
                                        variants={itemVariants}
                                        className="leading-[1.7]"
                                    >
                                        Hamza represents a paradigm shift
                                        towards true peer-to-peer commerce,
                                        where blockchain technology eliminates
                                        the need for centralized intermediaries
                                        while ensuring security and trust
                                        through smart contracts.
                                    </motion.p>
                                    <motion.p
                                        variants={itemVariants}
                                        className="leading-[1.7]"
                                    >
                                        Our platform empowers both buyers and
                                        sellers with lower fees, faster
                                        settlements, and complete transparency
                                        in every transaction.
                                    </motion.p>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
