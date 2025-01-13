import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    ModalCloseButton,
    Flex,
} from '@chakra-ui/react';

interface GeneralModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    icon: React.ReactNode;
    leftButton?: {
        text: string;
        function: () => void;
    };
    rightButton?: {
        text: string;
        function: () => void;
    };
		eventStatus?: {
				isLoading: boolean;
				isReleased: boolean;
		};
	
}

const ConfirmModal: React.FC<GeneralModalProps> = ({
    eventStatus,
    isOpen,
    onClose,
    title,
    message,
    icon,
    leftButton,
    rightButton,
}) => {
    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
                bg="#121212"
                p="40px"
                borderRadius={'16px'}
                justifyContent={'center'}
                alignItems={'center'}
                color="white"
                gap={2}
                maxW={'496px'}
                width={'100%'}
            >
                <ModalCloseButton color="white" />
                <ModalBody
                    display="flex"
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDir={'column'}
                >
                    {icon}
                    <ModalHeader
                        fontSize="24px"
                        fontWeight="bold"
                        textAlign={'center'}
                    >
                        {title}
                    </ModalHeader>
                    <Text
                        fontSize="16px"
                        maxW={'332px'}
                        width={'100%'}
                        textAlign={'center'}
                    >
                        {message}
                    </Text>
                </ModalBody>
                <ModalFooter width={'100%'}>
                    <Flex
                        gap="16px"
                        width={'100%'}
                        flexDir={{ base: 'column', md: 'row' }}
                        justifyContent="center"
                    >
                        {leftButton && (
                            <Button
                                borderRadius={'full'}
                                height={'52px'}
                                p="16px"
                                borderColor={'primary.indigo.900'}
                                borderWidth={'1px'}
                                backgroundColor={'transparent'}
                                color={'primary.indigo.900'}
                                onClick={leftButton.function}
                                minWidth={{ base: '100%', md: '200px' }}
                                flexShrink={0}
                            >
                                {leftButton.text}
                            </Button>
                        )}
                        {rightButton && (
                            <Button
                                borderRadius={'full'}
                                height={'52px'}
                                p="16px"
                                backgroundColor={'primary.indigo.900'}
                                minWidth={{ base: '100%', md: '200px' }}
                                flexShrink={0}
                                onClick={rightButton.function}
                                isLoading={eventStatus?.isLoading}
                                isDisabled={eventStatus?.isReleased}
                            >
                                {rightButton.text}
                            </Button>
                        )}
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmModal;
