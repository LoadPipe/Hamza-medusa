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
    Box,
    Grid,
    Flex,
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
            <ModalContent
                width="1030px"
                height="883px"
                maxW="1030px"
                maxH="883px"
                px="24px" // Horizontal padding
                py="40px" // Vertical padding at the top
            >
                <ModalCloseButton />
                <ModalBody>
                    {/* Large Image Display */}

                    <Flex
                        flexDir={'column'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        height={'100%'}
                    >
                        <Box mb={4} width="840px" height="598px" mx="auto">
                            <Image
                                src={selectedImage}
                                alt="Selected Image"
                                width="100%"
                                height="100%"
                                borderRadius="md"
                                objectFit="fill"
                            />
                        </Box>

                        {/* Thumbnail Images */}
                        <Grid
                            templateColumns="repeat(5, 145px)"
                            justifyContent="center"
                            justifyItems="center"
                            gap={7}
                        >
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
                                    width="145px"
                                    height="145px" // Ensures the thumbnails are square
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
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ImageGalleryModal;
