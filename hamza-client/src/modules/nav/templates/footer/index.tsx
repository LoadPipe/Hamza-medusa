import { clx } from '@medusajs/ui';
import { Flex, Container, Text, Box, Divider, Tooltip } from '@chakra-ui/react';
import { getCategoriesList, getCollectionsList } from '@/lib/server';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { FaDiscord, FaTelegram, FaYoutube } from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';
import Reputation from '@modules/home/components/reputation';
//import HamzaLogo from '../../../../../public/images/logo/logo_green.svg';
//import HamzaTitle from '../../../../../public/images/logo/hamza-title.svg';
import HamzaLogo from '../../../../../public/images/logo/hamza-beta.png';
import React from 'react';
import { FaTwitter } from 'react-icons/fa6';

export default async function Footer() {
    return (
        <Flex
            width="full"
            bgColor={'black'}
            py={{ base: '2rem', md: '4rem' }}
            justifyContent={'center'}
            className="footer"
        >
            <Flex
                maxWidth={'1280px'}
                px="1rem"
                flexDirection={'column'}
                width={'100%'}
            >
                {/* links */}
                <Flex
                    mb="2rem"
                    justifyContent={'center'}
                    display={{ base: 'flex', md: 'none' }}
                >
                    <LocalizedClientLink href="/">
                        <Flex width={'172px'} flexShrink={0}>
                            <Image src={HamzaLogo} alt="Hamza" />
                        </Flex>
                    </LocalizedClientLink>
                </Flex>
                <Divider mx="auto" color="#555555" maxWidth={'1014px'} />
                <Flex
                    pt={{ base: '2rem', md: '3rem' }}
                    pb="2rem"
                    flexDirection={{ base: 'column', md: 'row' }}
                    justifyContent={'space-between'}
                    width={'100%'}
                >
                    <Flex flexDir={'column'} color={'white'} gap={'8px'}>
                        <Text className="text-base font-bold">Site</Text>

                        <Link href={'/'}>
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                Home
                            </Text>
                        </Link>

                        <a
                            href="https://blog.hamza.market/about/"
                            target="_blank"
                        >
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                About
                            </Text>
                        </a>

                        <a
                            href="https://blog.hamza.market/blog/"
                            target="_blank"
                        >
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                Blog
                            </Text>
                        </a>

                        <a
                            href="https://blog.hamza.market/contact"
                            target="_blank"
                        >
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                Contact
                            </Text>
                        </a>
                    </Flex>

                    <Divider
                        display={{ base: 'block', md: 'none' }}
                        my="2rem"
                    />

                    <Flex flexDir={'column'} color={'white'} gap={'8px'}>
                        <a
                            href="https://blog.hamza.market/affiliate/"
                            target="_blank"
                        >
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                Affiliate
                            </Text>
                        </a>

                        <a
                            href="https://blog.hamza.market/ambassador/"
                            target="_blank"
                        >
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                Ambassador
                            </Text>
                        </a>

                        <a
                            href="https://blog.hamza.market/careers/"
                            target="_blank"
                        >
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                Careers
                            </Text>
                        </a>
                    </Flex>

                    <Flex
                        mt={{ base: '8px', md: '0px' }}
                        flexDir={'column'}
                        color={'white'}
                        gap={'8px'}
                    >
                        <a
                            href="https://blog.hamza.market/merchant/"
                            target="_blank"
                        >
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                Merchant
                            </Text>
                        </a>

                        <a href="https://support.hamza.market/" target="_blank">
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                Knowledge Base
                            </Text>
                        </a>

                        <a
                            href="https://support.hamza.market/help/1568263160"
                            target="_blank"
                        >
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                Submit a Ticket
                            </Text>
                        </a>

                        <a
                            href="https://blog.hamza.market/request-product/"
                            target="_blank"
                        >
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                Request a Product
                            </Text>
                        </a>

                        <a
                            href="https://blog.hamza.market/tos/"
                            target="_blank"
                        >
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                Terms of Service
                            </Text>
                        </a>
                    </Flex>
                </Flex>

                <Divider />
                {/* Reputation */}

                <Box
                    mb={{ base: '-10rem', md: '0' }}
                    display={{ base: 'none', md: 'block' }}
                >
                    <Reputation />
                </Box>

                <Divider />
                {/* Bottom Content */}

                <Flex
                    pt="2rem"
                    flexDir={{ base: 'column', md: 'row' }}
                    width={'100%'}
                    gap={4}
                >
                    <Flex display={{ base: 'none', md: 'flex' }}>
                        <LocalizedClientLink href="/">
                            <Flex width={'190px'} flexShrink={0}>
                                <Image src={HamzaLogo} alt="Hamza" />
                            </Flex>
                        </LocalizedClientLink>
                    </Flex>
                    <Flex
                        ml={{ base: '0', md: 'auto' }}
                        flexDir={'row'}
                        justifyContent={'center'}
                        alignItems="center"
                        color={'white'}
                        gap={'8px'}
                    >
                        <Text className="text-base font-bold">
                            Follow us on:{' '}
                        </Text>
                        <Tooltip label="Follow us on X (Twitter)" placement="top" hasArrow>
                            <Link href="https://x.com/hamzadecom1" target="_blank">
                                <Box 
                                    color="#1DA1F2" 
                                    borderRadius="lg"
                                    p="8px"
                                    _hover={{ 
                                        color: "#ffffff", 
                                        bg: "#1DA1F2",
                                        transform: "scale(1.2) rotate(5deg)", 
                                        boxShadow: "0 0 20px rgba(29, 161, 242, 0.6)",
                                        borderRadius: "xl"
                                    }}
                                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                    cursor="pointer"
                                >
                                    <FaTwitter size={28} />
                                </Box>
                            </Link>
                        </Tooltip>
                        <Tooltip label="Join our Discord" placement="top" hasArrow>
                            <Link
                                href="https://discord.gg/W7qu9gb3Yz"
                                target="_blank"
                            >
                                <Box 
                                    color="#5865F2" 
                                    borderRadius="lg"
                                    p="8px"
                                    _hover={{ 
                                        color: "#ffffff", 
                                        bg: "#5865F2",
                                        transform: "scale(1.2) rotate(-5deg)", 
                                        boxShadow: "0 0 20px rgba(88, 101, 242, 0.6)",
                                        borderRadius: "xl"
                                    }}
                                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                    cursor="pointer"
                                >
                                    <FaDiscord size={28} />
                                </Box>
                            </Link>
                        </Tooltip>
                        <Tooltip label="English Telegram" placement="top" hasArrow>
                            <Link
                                href="https://t.me/decomnetwork"
                                target="_blank"
                            >
                                <Box 
                                    color="#0088cc" 
                                    borderRadius="lg"
                                    p="8px"
                                    _hover={{ 
                                        color: "#ffffff", 
                                        bg: "#0088cc",
                                        transform: "scale(1.2) rotate(5deg)", 
                                        boxShadow: "0 0 20px rgba(0, 136, 204, 0.6)",
                                        borderRadius: "xl"
                                    }}
                                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                    cursor="pointer"
                                >
                                    <FaTelegram size={28} />
                                </Box>
                            </Link>
                        </Tooltip>
                        <Tooltip label="Spanish Telegram" placement="top" hasArrow>
                            <Link
                                href="https://t.me/hamza_espanol"
                                target="_blank"
                            >
                                <Box 
                                    color="#0088cc" 
                                    borderRadius="lg"
                                    p="8px"
                                    _hover={{ 
                                        color: "#ffffff", 
                                        bg: "#0088cc",
                                        transform: "scale(1.2) rotate(-5deg)", 
                                        boxShadow: "0 0 20px rgba(0, 136, 204, 0.6)",
                                        borderRadius: "xl"
                                    }}
                                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                    cursor="pointer"
                                >
                                    <FaTelegram size={28} />
                                </Box>
                            </Link>
                        </Tooltip>
                        <Tooltip label="Subscribe to our YouTube" placement="top" hasArrow>
                            <Link
                                href="https://www.youtube.com/@HamzaMarket"
                                target="_blank"
                            >
                                <Box 
                                    color="#FF0000" 
                                    borderRadius="lg"
                                    p="8px"
                                    _hover={{ 
                                        color: "#ffffff", 
                                        bg: "#FF0000",
                                        transform: "scale(1.2) rotate(5deg)", 
                                        boxShadow: "0 0 20px rgba(255, 0, 0, 0.6)",
                                        borderRadius: "xl"
                                    }}
                                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                    cursor="pointer"
                                >
                                    <FaYoutube size={28} />
                                </Box>
                            </Link>
                        </Tooltip>
                    </Flex>

                    <Flex
                        justifyContent={'center'}
                        alignItems="center"
                        flexDir={'column'}
                        color={'white'}
                        gap={'8px'}
                    >
                        <Text
                            display={{ base: 'none', md: 'block' }}
                            className="text-base font-bold"
                        ></Text>
                    </Flex>
                </Flex>

                {/* google analytics */}
                {/* {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG === 'true' &&
                    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
                        <Flex
                            dangerouslySetInnerHTML={{
                                __html: `<!-- Google tag (gtag.js) --><script async src="https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}");</script>`,
                            }}
                        ></Flex>
                    )} */}
            </Flex>
        </Flex>
    );
}
