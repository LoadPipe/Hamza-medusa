import {
    Box,
    Flex,
    Grid,
    GridItem,
    Image,
    useDisclosure,
    useBreakpointValue,
    AspectRatio,
} from '@chakra-ui/react';
import { getObjectFit } from '@modules/get-object-fit';
import useProductPreview from '@store/product-preview/product-preview';
import React, { useEffect, useState } from 'react';
import ImageGalleryModal from '../gallery-modal';

interface PreviewGalleryProps {
    selectedVariantImage: string;
}
interface ImageType {
    url: string;
}

const PreviewGallery: React.FC<PreviewGalleryProps> = ({
    selectedVariantImage,
}) => {
    const { productData } = useProductPreview();
    const [images, setImages] = useState<string[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

    useEffect(() => {
        // Construct the initial images array from product data
        let newImages =
            productData?.images?.map((img: ImageType) => img.url) || [];

        // Check if a selected variant image is provided and is different from the main image
        if (selectedVariantImage && selectedVariantImage !== newImages[0]) {
            // Place the selected variant image at the start of the array
            newImages = [
                selectedVariantImage,
                ...newImages.filter((img: string, index: number) => index > 0),
            ];
        }

        // Update the images state
        setImages(newImages);
    }, [productData, selectedVariantImage]);

    const openGallery = (index: number) => {
        setSelectedImageIndex(index);
        onOpen();
    };

    // Responsive layout adjustment for the grid
    const gridTemplateColumns = useBreakpointValue({
        base: '1fr', // On mobile, only 1 column
        md: '1fr 1fr', // On medium screens and up, 2 columns
    });

    const gridTemplateRows = useBreakpointValue({
        base: 'auto auto', // On mobile, stack the big image on top of the small images
        md: '1fr', // On medium screens and up, 1 row for side-by-side layout
    });

    return (
        <Flex maxW={'1280px'} width={'100%'} flexDirection={'column'}>
            <Grid
                templateColumns={gridTemplateColumns}
                templateRows={gridTemplateRows}
                gap={2}
            >
                {/* Main Square Image on the top (mobile) or left (desktop) */}
                <GridItem>
                    <AspectRatio
                        ratio={1}
                        width={{ base: '100%', md: '100%' }} // Use full width on mobile, fixed on desktop
                        maxH="600px"
                        minH="312px"
                        height="100%"
                        overflow="hidden"
                        onClick={() => openGallery(0)}
                        cursor="pointer"
                        borderRadius={{ base: '16px', md: '16px 0 0 16px' }}
                    >
                        <Image
                            src={images[0]}
                            width={'100%'}
                            height={'100%'}
                            alt="Main Image"
                            objectFit="cover"
                        />
                    </AspectRatio>
                </GridItem>

                {/* 4 Square Images below (mobile) or to the right (desktop) */}
                <GridItem>
                    <Grid
                        templateColumns={{
                            base: 'repeat(4, 1fr)', // 4 columns on mobile
                            md: 'repeat(2, 1fr)', // 2 columns on desktop
                        }}
                        templateRows={{
                            base: 'repeat(1, 1fr)', // 1 row on mobile
                            md: 'repeat(2, 1fr)', // 2 rows on desktop
                        }}
                        gap={2}
                    >
                        {images.slice(1, 5).map((image, index) => (
                            <GridItem key={index}>
                                <Box
                                    width={{ base: '100%', md: '100%' }} // Full width on mobile, fixed on desktop
                                    maxH={'296px'}
                                    minH={'80px'}
                                    height="100%"
                                    aspectRatio="1"
                                    overflow="hidden"
                                    borderRadius={{
                                        base: '16px',
                                        md: 'none',
                                    }}
                                    borderTopRightRadius={{
                                        md: index === 1 ? '16px' : 'none',
                                    }}
                                    borderBottomRightRadius={{
                                        md: index === 3 ? '16px' : 'none',
                                    }}
                                    onClick={() => openGallery(index + 1)}
                                    cursor="pointer"
                                >
                                    <Image
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        width="100%"
                                        height="100%"
                                        objectFit={'cover'}
                                    />
                                </Box>
                            </GridItem>
                        ))}
                    </Grid>
                </GridItem>
            </Grid>

            {/* Image Gallery Modal */}
            {images.length > 0 && (
                <ImageGalleryModal
                    isOpen={isOpen}
                    onClose={onClose}
                    images={images}
                    selectedImageIndex={selectedImageIndex}
                />
            )}
        </Flex>
    );
};

export default PreviewGallery;
