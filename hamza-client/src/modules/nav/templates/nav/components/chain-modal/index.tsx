'use client';

import {
    Button,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Text,
} from '@chakra-ui/react';
import { useSwitchChain } from 'wagmi';
import { getChainId } from '@wagmi/core';
import { wagmiConfig } from '@/app/components/providers/rainbowkit/wagmi';
import { RxQuestionMarkCircled } from 'react-icons/rx';

const CustomChainModal = () => {
    const { chains, switchChain } = useSwitchChain();
    const chainId = getChainId(wagmiConfig);

    return (
        <Modal isOpen={true} onClose={() => {}} isCentered>
            <ModalOverlay />
            <ModalContent
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'16px'}
                backgroundColor={'#121212'}
                border={'1px'}
                borderColor={'white'}
            >
                <ModalBody width={'100%'} py="1.5rem">
                    <Flex flexDirection={'column'} alignItems={'center'}>
                        <Flex mr={'auto'} alignItems={'center'} gap={2}>
                            <Text
                                fontSize={'18px'}
                                color={'white'}
                                fontWeight={800}
                            >
                                Switch Networks
                            </Text>
                            <RxQuestionMarkCircled color="white" />
                        </Flex>
                        <Text
                            color={'white'}
                            fontSize={'12px'}
                            mr={'auto'}
                            fontWeight={400}
                        >
                            Easily switch blockchain networks to access specific
                            tokens.
                        </Text>

                        {chains.map((chain) => (
                            <Flex
                                mt="1rem"
                                key={chain.id}
                                flex={1}
                                width={'100%'}
                                gap={2}
                            >
                                <Button
                                    width={'100%'}
                                    backgroundColor={
                                        chain.id === chainId
                                            ? 'primary.indigo.900'
                                            : 'transparent'
                                    }
                                    onClick={() =>
                                        switchChain({ chainId: chain.id })
                                    }
                                    cursor={'pointer'}
                                    _hover={{
                                        opacity: 0.5,
                                    }}
                                >
                                    <Text marginRight={'auto'} color={'white'}>
                                        {chain.name}
                                    </Text>
                                    {chain.id === chainId && (
                                        <Text
                                            marginLeft={'auto'}
                                            color={'white'}
                                        >
                                            Connected
                                        </Text>
                                    )}
                                </Button>
                            </Flex>
                        ))}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CustomChainModal;
