import React, { useState, useEffect } from 'react';
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
    selectedImageIndex: number; // Selected image index passed from PreviewGallery
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
    isOpen,
    onClose,
    images,
    selectedImageIndex, // Use this index to initialize the selected image
}) => {
    const [selectedImage, setSelectedImage] = useState<string>(
        images[selectedImageIndex]
    );
    const [currentIndex, setCurrentIndex] =
        useState<number>(selectedImageIndex);

    useEffect(() => {
        setSelectedImage(images[selectedImageIndex]);
        setCurrentIndex(selectedImageIndex);
    }, [selectedImageIndex, images]);

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
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                width="100%"
                height="100%"
                maxW={{ base: '338px', md: '1030px' }}
                maxH={{ base: '409px', md: '883px' }}
                px={{ base: '29.63px', md: '40px' }}
                py={{ base: '29.63px', md: '24px' }}
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
                        <Box
                            mb={4}
                            maxH={'592px'}
                            minH={'242px'}
                            maxWidth="840px"
                            width={'100%'}
                            aspectRatio={'1 / 1'}
                            mx="auto"
                        >
                            <Image
                                src={selectedImage}
                                alt="Selected Image"
                                height="100%"
                                margin="auto"
                                borderRadius="md"
                                objectFit="contain"
                            />
                        </Box>

                        {/* Left and Right Navigation Buttons */}

                        <IconButton
                            aria-label="Previous Image"
                            icon={
                                <MdChevronLeft className="w-[15px] h-[15px] md:w-[50px] md:h-[50px]" />
                            }
                            position="absolute"
                            top="40%"
                            left={{ base: '-50px', md: '-40px' }} // Adjust button position for mobile
                            transform="translateY(-50%)"
                            size="lg"
                            onClick={handlePrevious}
                            backgroundColor="transparent"
                            _hover={{
                                backgroundColor: 'rgba(85, 85, 85, 0.7)',
                            }}
                            color="white"
                            borderRadius="full"
                        />
                        <IconButton
                            aria-label="Next Image"
                            icon={
                                <MdChevronRight className="w-[15px] h-[15px] md:w-[50px] md:h-[50px]" />
                            }
                            position="absolute"
                            top="40%"
                            right={{ base: '-50px', md: '-40px' }} // Adjust button position for mobile
                            transform="translateY(-50%)"
                            size="lg"
                            onClick={handleNext}
                            backgroundColor="transparent"
                            _hover={{
                                backgroundColor: 'rgba(85, 85, 85, 0.7)',
                            }}
                            color="white"
                            borderRadius="full"
                        />

                        {/* Thumbnail Images */}
                        <Grid
                            templateColumns="repeat(5, 1fr)"
                            justifyContent="center"
                            justifyItems="center"
                            gap={{ base: 3, md: 7 }} // Adjust gap for mobile and larger screens
                            width="100%"
                            maxWidth="840px"
                        >
                            {images.map((image, index) => (
                                <Box
                                    key={index}
                                    border={
                                        selectedImage === image
                                            ? '2px solid primary.indigo.900'
                                            : '2px solid transparent'
                                    }
                                    borderRadius="md"
                                    overflow="hidden"
                                    cursor="pointer"
                                    aspectRatio={'1 / 1'}
                                    width="100%"
                                    maxW={'145px'}
                                    maxH={'138px'}
                                    onClick={() => {
                                        setSelectedImage(image);
                                        setCurrentIndex(index);
                                    }}
                                >
                                    <Image
                                        src={image}
                                        alt={`Image ${index + 1}`}
                                        // width="100%"
                                        // height="100%"
                                        // objectFit="contain"
                                        height="100%"
                                        margin="auto"
                                        objectFit="contain"
                                    />
                                </Box>
                            ))}
                        </Grid>

                        {/* Dots Indicator */}
                        <Flex
                            justifyContent="center"
                            position="absolute"
                            bottom={{ base: '-17px', md: '-17px' }}
                        >
                            {images.map((_, index) => (
                                <Box key={index} mx={1.5}>
                                    <FaCircle
                                        size={9}
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
