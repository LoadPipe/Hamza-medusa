import { Flex, Text, Box } from '@chakra-ui/react';
import React from 'react';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

function PaymentStatus() {
    return (
        <Flex
            flexDir={'column'}
            color={'white'}
            bgColor={'#121212'}
            width={'1258px'}
            height={'598px'}
            padding={'40px'}
            gap={4}
        >
            <Text fontSize={'32px'} fontWeight={700}>
                Payment Status
            </Text>

            <Flex justify={'space-between'}>
                <Text>Payment Status</Text>
                <Box>
                    <Text fontSize={'12px'}>In Escrow</Text>
                </Box>
            </Flex>

            <Flex>
                <Flex flexDir={'column'}>
                    <Box
                        width={'216px'}
                        height={'16px'}
                        borderRadius={'360px'}
                        fontSize={'16px'}
                        bgColor={'#94D42A'}
                        mb={'10px'}
                    ></Box>
                    <Flex flexDir={'row'} gap={2}>
                        <Flex alignSelf={'center'}>
                            <IoIosCheckmarkCircleOutline size={'34px'} />
                        </Flex>
                        <Flex flexDir={'column'}>
                            <Text>Initiated</Text>
                            <Text fontSize={'14px'}>
                                Payment Request Created
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex flexDir={'column'} ml={'auto'}>
                    <Box
                        width={'216px'}
                        height={'16px'}
                        borderRadius={'360px'}
                        fontSize={'16px'}
                        bgColor={'#94D42A'}
                        mb={'10px'}
                    ></Box>

                    <Flex flexDir={'row'} gap={2}>
                        <Flex alignSelf={'center'}>
                            <IoIosCheckmarkCircleOutline size={'34px'} />
                        </Flex>
                        <Flex flexDir={'column'}>
                            <Text>Pending</Text>
                            <Text fontSize={'14px'}>Waiting for payment</Text>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex flexDir={'column'} ml={'auto'}>
                    <Box
                        width={'216px'}
                        height={'16px'}
                        borderRadius={'360px'}
                        fontSize={'16px'}
                        bgColor={'#94D42A'}
                        mb={'10px'}
                    ></Box>
                    <Flex flexDir={'row'} gap={2}>
                        <Flex alignSelf={'center'}>
                            <IoIosCheckmarkCircleOutline size={'34px'} />
                        </Flex>
                        <Flex flexDir={'column'}>
                            <Text>Received</Text>
                            <Text fontSize={'14px'}>Full payment received</Text>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex flexDir={'column'} ml={'auto'}>
                    <Box
                        width={'216px'}
                        height={'16px'}
                        borderRadius={'360px'}
                        fontSize={'16px'}
                        bgColor={'#94D42A'}
                        mb={'10px'}
                    ></Box>

                    <Flex flexDir={'row'} gap={2}>
                        <Flex alignSelf={'center'}>
                            <IoIosCheckmarkCircleOutline size={'34px'} />
                        </Flex>
                        <Flex flexDir={'column'}>
                            <Text>In Escrow</Text>
                            <Text fontSize={'14px'}>
                                Funds secured in escrow
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex flexDir={'column'} ml={'auto'}>
                    <Box
                        width={'216px'}
                        height={'16px'}
                        borderRadius={'360px'}
                        fontSize={'16px'}
                        bgColor={'#94D42A'}
                        mb={'10px'}
                    ></Box>

                    <Flex flexDir={'row'} gap={2}>
                        <Flex alignSelf={'center'}>
                            <IoIosCheckmarkCircleOutline size={'34px'} />
                        </Flex>
                        <Flex flexDir={'column'}>
                            <Text>Complete</Text>
                            <Text fontSize={'14px'}>Transaction Finalized</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>

            <hr style={{ height: '1px', color: 'grey' }} />

            <Flex flexDir={'column'}>
                <Text fontSize={'24px'} fontWeight={700}>
                    Funds in Escrow
                </Text>

                <Text>
                    Your funds are secured in escrow. They will be released to
                    the seller once you confirm reeceipt of your order
                </Text>
            </Flex>

            <Flex gap={4}>
                <Text fontSize={'14px'}>Created</Text>
                <Text fontSize={'14px'}>Total Amount:</Text>
                <Text fontSize={'14px'}>Total Orders:</Text>
            </Flex>

            <Flex
                bgColor={'#2424244D'}
                width={'100%'}
                height="88px"
                borderRadius={'16px'}
                padding={'16px 24px 16px 24px'}
            >
                <Text fontWeight={700}>Payment Address</Text>
            </Flex>
        </Flex>
    );
}

export default PaymentStatus;
