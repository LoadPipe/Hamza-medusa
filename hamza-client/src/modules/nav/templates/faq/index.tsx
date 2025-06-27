'use client';

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Container,
    Text,
} from '@chakra-ui/react';
import React from 'react';

const faqData = [
    {
        question: 'What payment methods do you accept?',
        answer: 'We exclusively accept cryptocurrency payments in Bitcoin (BTC), Ethereum (ETH), USDC, and USDT. Currently we allow payment on the following blockchains: Bitcoin mainnet, Optimism, Base, Polygon, and Arbitrum... but we`re adding new ones all the time. To make a purchase, you will need to connect a cryptocurrency wallet like MetaMask or another compatible wallet.',
    },
    {
        question: 'How long does shipping take?',
        answer: 'Domestic shipping usually takes 3-5 business days. International shipping times vary depending on the destination, but typically range from 7-14 business days. Please be sure to read each individual seller`s shipping policy on their product pages, as shipping prices and times may vary from seller to seller and product to product',
    },
    {
        question: 'Do you offer international shipping?',
        answer: 'Yes, we ship to most countries worldwide, but it depends on the seller and the product. Please proceed to checkout to see if we ship to your location and to calculate the shipping costs.',
    },
    {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for most items. The items must be in their original condition, unused, and with all tags attached. Please visit our returns page for more detailed information.',
    },
    {
        question: 'How do I request a refund?',
        answer: 'To request a refund, please contact our customer support team with your order number and the reason for the refund. We will guide you through the process.',
    },
    {
        question: 'Do I need an account to place an order?',
        answer: 'You do not need to create a traditional account with an email and password. Instead, you will connect your crypto wallet, such as MetaMask, to place an order. Your wallet acts as your account.',
    },
    {
        question: 'How can I contact customer support?',
        answer: 'You can contact our support team 24/7 by clicking the chat button located on the right side of the page. We are always here to help with any questions you may have.',
    },
];

const Faq = () => {
    return (
        <Container
            maxW="1268px"
            px={{ base: '4', md: '6' }}
            py={{ base: '4', md: '8' }}
        >
            <Box textAlign="center" mb={{ base: '10', md: '40px' }}>
                <Text
                    as="h1"
                    fontFamily="'Sora', sans-serif"
                    fontWeight="700"
                    fontSize={{ base: '32px', md: '40px' }}
                    lineHeight={{ base: '42px', md: '50px' }}
                    color="white"
                >
                    FAQ
                </Text>
                <Text
                    fontFamily="'Inter', sans-serif"
                    color="white"
                    mt="8px"
                    maxW="923px"
                    mx="auto"
                    fontSize={{ base: '14px', md: '16px' }}
                    lineHeight="19px"
                >
                    Find answers to the most common questions about our
                    services, how we work, and how you can get in touch with us.
                </Text>
            </Box>

            <Accordion allowMultiple borderTop="1px solid #C2C2C2">
                {faqData.map((item, index) => (
                    <AccordionItem
                        key={index}
                        borderBottom="1px solid #C2C2C2"
                        borderTop="none"
                    >
                        <h2>
                            <AccordionButton
                                py="24px"
                                px="14px"
                                _hover={{ bg: 'transparent' }}
                            >
                                <Box
                                    as="span"
                                    flex="1"
                                    textAlign="left"
                                    fontFamily="'Sora', sans-serif"
                                    fontWeight="400"
                                    fontSize="16px"
                                    color="white"
                                >
                                    {item.question}
                                </Box>
                                <AccordionIcon color="white" />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel
                            pb={6}
                            px="14px"
                            color="gray.300"
                            fontFamily="'Inter', sans-serif"
                        >
                            {item.answer}
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </Container>
    );
};

export default Faq;
