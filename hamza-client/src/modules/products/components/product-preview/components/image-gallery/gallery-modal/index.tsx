import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Image,
    Flex,
    Box,
    Grid,
} from '@chakra-ui/react';

interface ImageGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[]; // Array of image URLs
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
    isOpen,
    onClose,
    images,
}) => {
    const [selectedImage, setSelectedImage] = useState<string>(images[0]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Image Gallery</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {/* Large Image Display */}
                    <Box mb={4}>
                        <Image
                            src={selectedImage}
                            alt="Selected Image"
                            width="100%"
                            height="auto"
                            borderRadius="md"
                        />
                    </Box>

                    {/* Thumbnail Images */}
                    <Grid templateColumns="repeat(5, 1fr)" gap={4}>
                        {images.map((image, index) => (
                            <Box
                                key={index}
                                border={
                                    selectedImage === image
                                        ? '2px solid #3182ce'
                                        : '2px solid transparent'
                                }
                                borderRadius="md"
                                overflow="hidden"
                                cursor="pointer"
                                onClick={() => setSelectedImage(image)}
                            >
                                <Image
                                    src={image}
                                    alt={`Image ${index + 1}`}
                                    width="100%"
                                    height="100%"
                                    objectFit="cover"
                                />
                            </Box>
                        ))}
                    </Grid>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ImageGalleryModal;
