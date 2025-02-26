'use client';
import React, { useState, useEffect } from 'react';
import { SimpleGrid, Box, Button, Flex } from '@chakra-ui/react';
import fire from '../../../../../public/images/product_filters/fire.png';
import gift from '../../../../../public/images/product_filters/gift.png';
import game from '../../../../../public/images/product_filters/games.png';
import coinbase from '../../../../../public/images/wallet_connect/coinbase.png';
import metamask from '../../../../../public/images/wallet_connect/metamask.png';
import rainbow from '../../../../../public/images/wallet_connect/rainbow.jpeg';
import wallet from '../../../../../public/images/wallet_connect/wallet.png';
import Image from 'next/image';
import ProductCollections from '@modules/collections/product_collection_filter';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const RecommendedItems = () => {
    const [storeName, setStoreName] = useState('Legendary Light Design');
    const { openConnectModal } = useConnectModal();
    const { connector: activeConnector, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });

    //connects wallet if necessary
    const connectWallet = () => {
        console.log('isConnected:', isConnected);
        if (!isConnected) {
            if (openConnectModal) openConnectModal();
        }
    };

    // Dynamic button color change
    //TODO: get these from database
    const STORE_NAMES = {
        lighting: 'Legendary Light Design',
        quality: 'Echo Rift',
        medusa: 'Medusa Merch',
        headphones: 'Dauntless',
    } as const;

    return (
        <Flex className="font-sora" maxW="100%" bg="black" p={5}>
            <Box
                p={5}
                mx={12}
                bgGradient="linear(to-l, #53594A 70%, #2C272D 100%)" // This creates a gradient from right to left
                borderRadius="2xl"
                boxShadow="lg"
                marginLeft={{ lg: 4 }}
                marginRight={{ lg: 4 }}
                flex="1"
                width="70%"
            >
                <Flex
                    justifyItems={'center'}
                    justifyContent={'center'}
                    className="my-4"
                >
                    <Flex>
                        <Box
                            color="whitesmoke"
                            fontWeight="bold"
                            fontSize="2xl"
                            textAlign="center"
                        >
                            CONNECT YOUR <br />
                            FAVORITE WALLET
                        </Box>
                    </Flex>
                    <Flex className="ml-4">
                        <SimpleGrid
                            columns={{ base: 1, md: 2, lg: 4 }}
                            justifyContent="space-around"
                            spacing={5}
                        >
                            <Box>
                                <Button
                                    fontWeight="italic"
                                    size="lg"
                                    bg="transparent"
                                    color="white"
                                    width="full"
                                    borderRadius="full"
                                    border="1px" // Sets the border width
                                    borderColor="whiteAlpha.600"
                                    onClick={connectWallet}
                                >
                                    <Image
                                        className="mr-2"
                                        src={coinbase}
                                        alt={'Img of coinbase'}
                                        width={22}
                                        height={22}
                                    />
                                    Coinbase
                                </Button>
                            </Box>
                            <Box>
                                <Button
                                    fontWeight="italic"
                                    size="lg"
                                    width="full"
                                    bg="transparent"
                                    color="white"
                                    borderRadius="full"
                                    border="1px" // Sets the border width
                                    borderColor="whiteAlpha.600"
                                    onClick={connectWallet}
                                >
                                    <Image
                                        className="mr-2"
                                        src={metamask}
                                        alt={'Img of a game'}
                                        width={22}
                                        height={22}
                                    />
                                    Metamask
                                </Button>
                            </Box>
                            <Box>
                                <Button
                                    fontWeight="italic"
                                    size="lg"
                                    width="full"
                                    bg="transparent"
                                    color="white"
                                    borderRadius="full"
                                    border="1px" // Sets the border width
                                    borderColor="whiteAlpha.600"
                                    onClick={connectWallet}
                                >
                                    <Image
                                        className="mr-2"
                                        src={rainbow}
                                        alt={'Img of a laptop'}
                                        width={22}
                                        height={22}
                                    />
                                    Rainbowkit
                                </Button>
                            </Box>
                            <Box>
                                <Button
                                    fontWeight="italic"
                                    size="lg"
                                    bg="transparent"
                                    color="white"
                                    borderRadius="full"
                                    border="1px" // Sets the border width
                                    borderColor="whiteAlpha.600"
                                    onClick={connectWallet}
                                >
                                    <Image
                                        className="mr-2"
                                        src={wallet}
                                        alt={'Img of a collections'}
                                        width={22}
                                        height={22}
                                    />
                                    Wallet Connect
                                </Button>
                            </Box>
                        </SimpleGrid>
                    </Flex>
                </Flex>

                <Box
                    height="1px"
                    bg="whiteAlpha.600"
                    opacity="0.5"
                    width="full"
                    borderRadius="full"
                />
                <SimpleGrid
                    spacing={10}
                    columns={{ base: 1, md: 2, xl: 3 }} // Adjusted to your requirements
                    justifyContent="space-around"
                    justifyItems="center"
                    mx={12}
                    my={6}
                >
                    <Button
                        fontWeight="italic"
                        name="Legendary Light & Design"
                        bg={
                            STORE_NAMES.lighting === storeName
                                ? 'white'
                                : 'black'
                        }
                        color={
                            STORE_NAMES.lighting === storeName
                                ? 'black'
                                : 'white'
                        }
                        size="lg"
                        width="250px"
                        borderRadius="full"
                        onClick={() => {
                            setStoreName('Legendary Light Design');
                        }}
                    >
                        <Image
                            className="mr-2"
                            src={game}
                            alt={'Img of a game'}
                            height={22}
                        />
                        Headphone Vendor
                    </Button>
                    <Button
                        fontWeight="italic"
                        bg={
                            STORE_NAMES.medusa === storeName ? 'white' : 'black'
                        }
                        color={
                            STORE_NAMES.medusa === storeName ? 'black' : 'white'
                        }
                        size="lg"
                        name={'Medusa Merch'}
                        width="250px"
                        borderRadius="full"
                        onClick={() => {
                            setStoreName('Medusa Merch');
                        }}
                    >
                        <Image
                            className="mr-2"
                            src={fire}
                            alt={'Img of a fire'}
                            width={22}
                            height={22}
                        />
                        medusa Vendor
                    </Button>

                    <Button
                        fontWeight="italic"
                        bg={
                            STORE_NAMES.quality === storeName
                                ? 'white'
                                : 'black'
                        }
                        color={
                            STORE_NAMES.quality === storeName
                                ? 'black'
                                : 'white'
                        }
                        size="lg"
                        name={'Echo Rift'}
                        width="250px"
                        borderRadius="full"
                        onClick={() => {
                            setStoreName('Echo Rift');
                        }}
                    >
                        <Image
                            className="mr-2"
                            src={gift}
                            alt={'Img of a gift'}
                            width={22}
                            height={22}
                        />
                        Quality Vendor
                    </Button>
                    <Button
                        fontWeight="italic"
                        name="Dauntless"
                        bg={
                            STORE_NAMES.headphones === storeName
                                ? 'white'
                                : 'black'
                        }
                        color={
                            STORE_NAMES.headphones === storeName
                                ? 'black'
                                : 'white'
                        }
                        size="lg"
                        width="250px"
                        borderRadius="full"
                        onClick={() => {
                            setStoreName('Dauntless');
                        }}
                    >
                        <Image
                            className="mr-2"
                            src={game}
                            alt={'Img of a game'}
                            height={22}
                        />
                        Headphone Vendor
                    </Button>
                    {/*<Button*/}
                    {/*    fontWeight="italic"*/}
                    {/*    bg="black"*/}
                    {/*    width="250px"*/}
                    {/*    size="lg"*/}
                    {/*    color="white"*/}
                    {/*    borderRadius="full"*/}
                    {/*>*/}
                    {/*    <Image*/}
                    {/*        className="mr-2"*/}
                    {/*        src={laptop}*/}
                    {/*        alt={'Img of a laptop'}*/}
                    {/*        width={22}*/}
                    {/*        height={22}*/}
                    {/*    />*/}
                    {/*    Electronics*/}
                    {/*</Button>*/}
                    {/*<Button*/}
                    {/*    fontWeight="italic"*/}
                    {/*    bg="black"*/}
                    {/*    width="250px"*/}
                    {/*    size="lg"*/}
                    {/*    color="white"*/}
                    {/*    borderRadius="full"*/}
                    {/*>*/}
                    {/*    <Image*/}
                    {/*        className="mr-2"*/}
                    {/*        src={collections}*/}
                    {/*        alt={'Img of a collections'}*/}
                    {/*        width={22}*/}
                    {/*        height={22}*/}
                    {/*    />*/}
                    {/*    Collectible*/}
                    {/*</Button>*/}
                </SimpleGrid>
                <ProductCollections storeName={storeName} />
            </Box>
        </Flex>
    );
};

export default RecommendedItems;
