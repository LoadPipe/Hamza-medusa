import { clx } from '@medusajs/ui';
import { Flex, Container, Text, Box, Divider } from '@chakra-ui/react';
import { getCategoriesList, getCollectionsList } from '@lib/data';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { FaTwitter } from 'react-icons/fa6';
import { FaDiscord } from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';
import Reputation from '@modules/home/components/reputation';
//import HamzaLogo from '../../../../../public/images/logo/logo_green.svg';
//import HamzaTitle from '../../../../../public/images/logo/hamza-title.svg';
import HamzaLogo from '../../../../../public/images/logo/hamza-beta.png';
import React from 'react';

export default async function Footer() {
    return (
        <Flex
            width="full"
            bgColor={'black'}
            py={{ base: '2rem', md: '4rem' }}
            justifyContent={'center'}
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
                                Knoweledge Base
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
                        <Link href="https://x.com/hamzadecom1" target="_blank">
                            <FaTwitter size={24} />
                        </Link>
                        <Link
                            href="https://discord.gg/W7qu9gb3Yz"
                            target="_blank"
                        >
                            <FaDiscord size={24} />
                        </Link>
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

                {/* Freescout (chat) */}
                <Flex
                    dangerouslySetInnerHTML={{
                        __html: `<script>var FreeScoutW={s:{"color":"#5ab334","position":"br","id":2009307235}};(function(d,e,s){if(d.getElementById("freescout-w"))return;a=d.createElement(e);m=d.getElementsByTagName(e)[0];a.async=1;a.id="freescout-w";a.src=s;m.parentNode.insertBefore(a, m)})(document,"script","[https://support.hamza.market/modules/chat/js/widget.js?v=4239"](https://support.hamza.market/modules/chat/js/widget.js?v=4239%22));</script>`,
                    }}
                ></Flex>

                {/* google analytics */}
                {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG === 'true' && (
                    <Flex
                        dangerouslySetInnerHTML={{
                            __html: '<!-- Google tag (gtag.js) --><script async src="https://www.googletagmanager.com/gtag/js?id=G-EL9E6JGL7S"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "G-EL9E6JGL7S");</script>` ',
                        }}
                    ></Flex>
                )}
            </Flex>
        </Flex>
    );
}
