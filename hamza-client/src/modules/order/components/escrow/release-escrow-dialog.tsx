import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
		useToast
} from '@chakra-ui/react';
import { useState } from 'react';

export const ReleaseEscrowDialog = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
		const [isLoading, setIsLoading] = useState(false);
		const [isReleased, setIsReleased] = useState(false);
		const toast = useToast();

    const handleReleaseEscrow = () => {
				setIsLoading(true);
				// setup some loader
        // do something to release escrow.
				// close the modal
				// redirect back to previous page or homepage
				
				setTimeout(() => {
					onClose();
					setIsLoading(false);
					setIsReleased(true);
					toast({
						title: "Escrow released successfully.",
						status: "success",
						duration: 5000,
						isClosable: true,
						position: "top",
						containerStyle: {
							marginTop: '70px',
						},
					});
				}, 5000);
    }

    return (
        <>
            <Button mt="2rem" colorScheme="teal" onClick={onOpen}>
                Release Escrow
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
										<ModalHeader>Are you sure?</ModalHeader>
										<ModalBody>
												Check your items before releasing the escrow.
										</ModalBody>
										<ModalFooter>
												<Button variant="ghost" onClick={onClose}>
														Cancel
												</Button>
												<Button
														colorScheme="teal"
														ml={3}
														onClick={() => {
																handleReleaseEscrow();
														}}
														isLoading={isLoading}
												>
														Release
												</Button>
										</ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
