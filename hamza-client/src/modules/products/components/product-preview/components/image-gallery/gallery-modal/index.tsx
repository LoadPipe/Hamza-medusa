import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    Image,
    Box,
    Grid,
    Flex,
    IconButton,
} from '@chakra-ui/react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { FaCircle } from 'react-icons/fa';

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
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const handlePrevious = () => {
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        setCurrentIndex(newIndex);
        setSelectedImage(images[newIndex]);
    };

    const handleNext = () => {
        const newIndex = (currentIndex + 1) % images.length;
        setCurrentIndex(newIndex);
        setSelectedImage(images[newIndex]);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay />
            <ModalContent
                width="1030px"
                height="883px"
                maxW="1030px"
                maxH="883px"
                px="24px" // Horizontal padding
                py="40px" // Vertical padding
                backgroundColor="#121212"
            >
                <ModalCloseButton color="white" />
                <ModalBody>
                    <Flex
                        flexDir={'column'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        height={'100%'}
                        position="relative"
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

                        {/* Left and Right Navigation Buttons */}
                        <IconButton
                            aria-label="Previous Image"
                            icon={<MdChevronLeft />}
                            position="absolute"
                            top="40%"
                            left="-25px" // Positioned outside the left side of the image
                            transform="translateY(-50%)"
                            size="lg"
                            onClick={handlePrevious}
                            backgroundColor="rgba(0, 0, 0, 0.5)"
                            _hover={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                            color="white"
                            borderRadius="full"
                        />
                        <IconButton
                            aria-label="Next Image"
                            icon={<MdChevronRight />}
                            position="absolute"
                            top="40%"
                            right="-25px" // Positioned outside the right side of the image
                            transform="translateY(-50%)"
                            size="lg"
                            onClick={handleNext}
                            backgroundColor="rgba(0, 0, 0, 0.5)"
                            _hover={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                            color="white"
                            borderRadius="full"
                        />

                        {/* Thumbnail Images */}
                        <Grid
                            templateColumns="repeat(5, 145px)"
                            justifyContent="center"
                            justifyItems="center"
                            gap={7}
                            mt={4}
                        >
                            {images.map((image, index) => (
                                <Box
                                    key={index}
                                    border={
                                        selectedImage === image
                                            ? '2px solid #ffff'
                                            : '2px solid transparent'
                                    }
                                    borderRadius="md"
                                    overflow="hidden"
                                    cursor="pointer"
                                    width="145px"
                                    height="145px"
                                    onClick={() => {
                                        setSelectedImage(image);
                                        setCurrentIndex(index);
                                    }}
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

                        {/* Dots Indicator */}
                        <Flex mt={4} justifyContent="center">
                            {images.map((_, index) => (
                                <Box key={index} mx={1}>
                                    <FaCircle
                                        size={8}
                                        color={
                                            index === currentIndex
                                                ? 'green'
                                                : '#666'
                                        }
                                    />
                                </Box>
                            ))}
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ImageGalleryModal;
