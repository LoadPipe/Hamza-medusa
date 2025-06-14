import {
    Box,
    Flex,
    Grid,
    GridItem,
    Image,
    useDisclosure,
    useBreakpointValue,
    AspectRatio,
    IconButton,
} from '@chakra-ui/react';
import { getObjectFit } from '@modules/get-object-fit';
import useProductPreview from '@/zustand/product-preview/product-preview';
import React, { useEffect, useState } from 'react';
import ImageGalleryModal from '../gallery-modal';
import { FaChevronLeft } from 'react-icons/fa';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useParams, useRouter } from 'next/navigation';
import ProductDetailsMobileMenu from './components/mobile-menu';
import { useQueryClient } from '@tanstack/react-query';
import { Product } from '@lib/schemas/product';

interface PreviewGalleryProps {
    selectedVariantImage: string;
    handle: string;
}
interface ImageType {
    url: string;
}

const PreviewGallery: React.FC<PreviewGalleryProps> = ({
    selectedVariantImage,
    handle,
}) => {
    const queryClient = useQueryClient();
    const product = queryClient.getQueryData<Product>(['product', handle]);
    const [images, setImages] = useState<string[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

    useEffect(() => {
        // Get all product gallery images
        let galleryImages = product?.images?.map((img: ImageType) => img.url) || [];

        let newImages = [...galleryImages]; // Start with all gallery images

        // If we have a selected variant image
        if (selectedVariantImage) {
            // Check if the variant image is already in the gallery
            const variantImageIndex = galleryImages.indexOf(selectedVariantImage);

            if (variantImageIndex === -1) {
                newImages = [selectedVariantImage, ...galleryImages];
            } else if (variantImageIndex > 0) {
                newImages = [
                    selectedVariantImage,
                    ...galleryImages.filter((img, index) => index !== variantImageIndex)
                ];
            }
        }

        // Update the images state
        setImages(newImages);
    }, [product, selectedVariantImage]);

    const openGallery = (index: number) => {
        setSelectedImageIndex(index);
        onOpen();
    };

    const { countryCode } = useParams();
    const router = useRouter();
    const baseURL =
        process.env.NEXT_PUBLIC_MEDUSA_CLIENT_URL || 'http://localhost:8000';
    // Default fallback path to homepage if there is no history to go back to
    const fallbackPath = countryCode ? `${baseURL}/${countryCode}` : baseURL;

    const goBackToShop = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();

        if (window.history.length > 1) {
            router.back();
        } else {
            router.push(fallbackPath);
        }
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
        <Flex
            maxW={'1280px'}
            width={'100%'}
            flexDirection={'column'}
            className="preview-gallery"
        >
            <Grid
                templateColumns={gridTemplateColumns}
                templateRows={gridTemplateRows}
                gap={2}
            >
                {/* Main Square Image on the top (mobile) or left (desktop) */}
                <GridItem position="relative">
                    <Box position="relative" overflow="hidden">
                        {selectedVariantImage.includes('globetopper.com') ||
                        selectedVariantImage.includes(
                            'images.hamza.market/GiftCards/'
                        ) ? (
                            <Flex
                                justifyContent={'center'}
                                alignItems={'center'}
                                width={{ base: '100%', md: '100%' }} // Use full width on mobile, fixed on desktop
                                maxH="600px"
                                minH="312px"
                                height="100%"
                                overflow="hidden"
                                borderRadius={{
                                    base: '16px',
                                    md: '16px 16px 16px 16px',
                                }}
                                onClick={() => openGallery(0)}
                                cursor="pointer"
                                backgroundColor={'black'}
                            >
                                <Image
                                    src={images[0]}
                                    maxWidth={'400px'}
                                    maxHeight={'251px'}
                                    alt="Main Image"
                                    objectFit="cover"
                                />
                            </Flex>
                        ) : (
                            <AspectRatio
                                ratio={1}
                                width={{ base: '100%', md: '100%' }} // Use full width on mobile, fixed on desktop
                                maxH="600px"
                                minH="312px"
                                height="100%"
                                overflow="hidden"
                                borderRadius={{
                                    base: '16px',
                                    md: '16px 0 0 16px',
                                }}
                                onClick={() => openGallery(0)}
                                cursor="pointer"
                            >
                                <Image
                                    src={images[0]}
                                    width={'100%'}
                                    height={'100%'}
                                    alt="Main Image"
                                    objectFit="cover"
                                />
                            </AspectRatio>
                        )}
                        {/* Back Button (Top Left) */}
                        <Flex
                            display={{ base: 'flex', md: 'none' }}
                            flexDir={'row'}
                            flex={1}
                            width={'100%'}
                            height={'32px'}
                            position="absolute"
                            zIndex="1"
                            top="10px"
                        >
                            <Flex
                                height={'32px'}
                                width={'32px'}
                                borderRadius={'full'}
                                justifyContent={'center'}
                                backgroundColor={'#3E3E3E80'}
                                onClick={goBackToShop}
                            >
                                <Flex alignSelf={'center'}>
                                    <FaChevronLeft color="white" />
                                </Flex>
                            </Flex>

                            {/* 3-Dot Menu Button (Top Right) */}
                            <Flex ml="auto">
                                <ProductDetailsMobileMenu />
                            </Flex>
                        </Flex>
                    </Box>
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
