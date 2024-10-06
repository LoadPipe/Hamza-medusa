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

const fetchCollections = async () => {
    const { collections } = await getCollectionsList();
    return collections;
};

const fetchCategories = async () => {
    const { product_categories } = await getCategoriesList();
    return product_categories;
};

export default async function Footer() {
    const productCollections = await fetchCollections().then(
        (collections) => collections
    );
    const productCategories = await fetchCategories().then(
        (categories) => categories
    );
    return (
        <Flex
            width="full"
            bgColor={'black'}
            py="4rem"
            justifyContent={'center'}
        >
            <Flex
                maxWidth={'1280px'}
                px="1rem"
                flexDirection={'column'}
                width={'100%'}
            >
                {/* links */}
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

                        <a href="https://blog.hamza.market/about/" target="_blank">
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                About
                            </Text>
                        </a>

                        <a href="https://blog.hamza.market/blog/" target="_blank">
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

                    <Flex flexDir={'column'} color={'white'} gap={'8px'}>
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

                        <a href="https://support.hamza.biz/" target="_blank">
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                Knoweledge Base
                            </Text>
                        </a>

                        <a
                            href="https://support.hamza.biz/help/1568263160"
                            target="_blank"
                        >
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                className="text-base font-bold"
                            >
                                Submit a Ticket
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

                <Flex pt="2rem" justifyContent={'space-between'} width={'100%'}>
                    <Flex justifyContent={'center'} alignItems="center">
                        <LocalizedClientLink href="/">
                            <Flex width={'190px'} flexShrink={0}>
                                {/*
                                <Image
                                    src={HamzaLogo}
                                    style={{ width: '100%', height: '67px' }}
                                    alt="Hamza"
                                />

                                <Image
                                    src={HamzaTitle}
                                    style={{
                                        width: '100%',
                                        height: '23.07px',
                                        alignSelf: 'center',
                                        marginLeft: '1rem',
                                    }}
                                    alt="Hamza"
                                />
                                */}

                                <Image
                                    style={{
                                        alignSelf: 'left',
                                    }}
                                    src={HamzaLogo}
                                    alt="Hamza"
                                />
                            </Flex>
                        </LocalizedClientLink>
                    </Flex>
                    <Flex
                        mr={{ base: 'auto', md: '0' }}
                        flexDir={'row'}
                        justifyContent={'center'}
                        alignItems="center"
                        color={'white'}
                        gap={'8px'}
                    >
                        <Text className="text-base font-bold">
                            Follow us on:{' '}
                        </Text>
                        <Link
                            href="https://x.com/loadpipe?t=mrR1xycvffxf-4MoBAhFJA&s=09"
                            target="_blank"
                        >
                            <FaTwitter size={24} />
                        </Link>
                        <Link
                            href="https://discord.gg/kNGx38WZ"
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
                        >
                            Certificate of Authenticity
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
