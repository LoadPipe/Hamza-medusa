'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Badge,
    Icon,
    Divider,
    Select,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Collapse,
    Button,
    Spinner,
} from '@chakra-ui/react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';
import useUnifiedFilterStore from '@/zustand/products/filter/use-unified-filter-store';

interface CategorySidebarProps {
    category: string;
    categoryData?: CategoryData | null;
    isLoading?: boolean;
    error?: any;
    isMobile?: boolean;
}

interface CategoryData {
    subcategories: SubCategory[];
    totalProducts: number;
    products: any[];
    count: number;
}

interface SubCategory {
    id: string;
    name: string;
    handle: string;
    products?: any[];
    metadata?: {
        icon_url?: string;
    };
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
    category,
    categoryData,
    isLoading = false,
    error = null,
    isMobile = false
}) => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { countryCode } = params as { countryCode: string };

    const {
        selectedCategories,
        setSelectedCategories,
        rangeUpper,
        setRangeUpper,
        hasHydrated,
        sortBy,
        rangeLower,
        setSortBy,
        setRange
    } = useUnifiedFilterStore();

    const [showFilters, setShowFilters] = useState(!isMobile);
    const [showCategories, setShowCategories] = useState(true);

    const capitalizeCategory = (categoryName: string) => {
        return categoryName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const subcategories: SubCategory[] = categoryData?.subcategories || [];
    const totalProducts = categoryData?.totalProducts || 0;

    // Initialize from URL parameters
    useEffect(() => {
        if (!hasHydrated) return;

        const subcategoryParam = searchParams.get('subcategory');
        const targetCategory = subcategoryParam || category;
        const normalizedTarget = targetCategory.toLowerCase();

        const currentSelection = selectedCategories;
        const needsUpdate = !currentSelection.includes(normalizedTarget) &&
            !currentSelection.includes('all');

        if (needsUpdate || (subcategoryParam && currentSelection.includes('all'))) {
            setSelectedCategories([normalizedTarget]);
        }
    }, [category, searchParams, setSelectedCategories, selectedCategories, hasHydrated]);

    // Transform subcategories for UI
    const transformedSubcategories = React.useMemo(() => {
        if (!subcategories || subcategories.length === 0) return [];

        const hasAllSelected = selectedCategories.includes('all');
        const currentSelection = hasAllSelected ? 'all' : selectedCategories[0];

        return [
            {
                name: `All ${capitalizeCategory(category)}`,
                slug: category.toLowerCase(),
                count: totalProducts,
                isActive: hasAllSelected || currentSelection === category.toLowerCase()
            },
            ...subcategories.map((subcat: SubCategory) => ({
                name: subcat.name,
                slug: subcat.handle.toLowerCase(),
                count: subcat.products?.length || 0,
                isActive: !hasAllSelected && selectedCategories.includes(subcat.handle.toLowerCase())
            }))
        ];
    }, [subcategories, selectedCategories, category, totalProducts]);

    const sortOptions = [
        { value: 'featured', label: 'Featured' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'newest', label: 'Newest' },
        { value: 'highest-rated', label: 'Highest Rated' },
    ];

    const handleSubcategoryClick = (subcategorySlug: string) => {
        if (subcategorySlug === category.toLowerCase()) {
            setSelectedCategories(['all']);
        } else {
            setSelectedCategories([subcategorySlug]);
        }

        const currentUrl = `/${countryCode}/category/${category}`;

        if (subcategorySlug === category.toLowerCase()) {
            router.replace(currentUrl, { scroll: false });
        } else {
            const originalSubcat = subcategories.find(s => s.handle.toLowerCase() === subcategorySlug);
            const urlSlug = originalSubcat?.handle || subcategorySlug;
            router.replace(`${currentUrl}?subcategory=${urlSlug}`, { scroll: false });
        }
    };

    const handleSortChange = (value: string) => {
        setSortBy?.(value);
    };

    const handlePriceChange = (value: number) => {
        setRangeUpper(value);
        setRange([rangeLower, value]);
    };

    // Mobile and Desktop styling
    const containerStyles = isMobile ? {
        w: "calc(100% - 16px)",
        bg: "gray.900",
        borderRadius: "12px",
        p: 4,
        mx: 2,
        position: "relative" as const,
    } : {
        width: { base: "280px", lg: "300px" },
        bg: "gray.900",
        borderRadius: "16px",
        p: 6,
        height: "fit-content",
        position: "sticky" as const,
        top: "6rem",
        flexShrink: 0,
    };

    // Loading state
    if (!hasHydrated || isLoading) {
        return (
            <Box {...containerStyles}>
                <VStack spacing={3}>
                    <Spinner color="white" size="lg" />
                    {isLoading && (
                        <Text color="gray.400" fontSize="sm" textAlign="center">
                            Loading category data...
                        </Text>
                    )}
                </VStack>
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box {...containerStyles}>
                <Text color="red.400" textAlign="center">
                    Error loading categories
                </Text>
            </Box>
        );
    }

    // Empty state - hide sidebar if no subcategories
    if (!subcategories || subcategories.length === 0) {
        return null;
    }

    return (
        <Box {...containerStyles}>
            <VStack spacing={4} align="stretch">
                {/* Categories Section Header */}
                <Box>
                    <Button
                        variant="ghost"
                        width="100%"
                        justifyContent="space-between"
                        color="white"
                        fontWeight="bold"
                        fontSize="lg"
                        p={0}
                        h="auto"
                        _hover={{ bg: "transparent" }}
                        onClick={() => setShowCategories(!showCategories)}
                        rightIcon={
                            <Icon
                                as={showCategories ? FiChevronUp : FiChevronDown}
                                color="gray.400"
                            />
                        }
                    >
                        Sub Categories
                    </Button>

                    <Collapse in={showCategories} animateOpacity>
                        <VStack spacing={2} mt={3} align="stretch">
                            {/* Categories List */}
                            {transformedSubcategories.map((item, index) => (
                                <Box
                                    key={`${item.slug}-${index}`}
                                    as="button"
                                    bg={item.isActive ? "primary.green.900" : "transparent"}
                                    borderRadius="12px"
                                    p={3}
                                    width="100%"
                                    transition="all 0.2s"
                                    _hover={{
                                        bg: item.isActive ? "primary.green.800" : "whiteAlpha.100",
                                        transform: "translateY(-1px)",
                                    }}
                                    onClick={() => handleSubcategoryClick(item.slug)}
                                >
                                    <HStack justify="space-between">
                                        <Text
                                            color={item.isActive ? "white" : "gray.300"}
                                            fontWeight="medium"
                                            fontSize={isMobile ? "sm" : "md"}
                                        >
                                            {item.name}
                                        </Text>
                                        <Badge
                                            bg={item.isActive ? "white" : "gray.700"}
                                            color={item.isActive ? "primary.green.900" : "gray.300"}
                                            borderRadius="full"
                                            px={2}
                                            py={1}
                                            fontSize="xs"
                                            fontWeight={item.isActive ? "bold" : "normal"}
                                        >
                                            {item.count}
                                        </Badge>
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>
                    </Collapse>
                </Box>

                <Divider borderColor="gray.700" my={2} />

                {/* Filters Section */}
                <Box>
                    <Button
                        variant="ghost"
                        width="100%"
                        justifyContent="space-between"
                        color="white"
                        fontWeight="bold"
                        fontSize="lg"
                        p={0}
                        h="auto"
                        _hover={{ bg: "transparent" }}
                        onClick={() => setShowFilters(!showFilters)}
                        rightIcon={
                            <Icon
                                as={showFilters ? FiChevronUp : FiChevronDown}
                                color="gray.400"
                            />
                        }
                    >
                        <HStack spacing={2}>
                            <Icon as={FiFilter} color="gray.400" size="18px" />
                            <Text>Filters</Text>
                        </HStack>
                    </Button>

                    <Collapse in={showFilters} animateOpacity>
                        <VStack spacing={4} mt={4} align="stretch">
                            {/* Sort Filter */}
                            <Box>
                                <Text color="gray.300" fontSize="sm" mb={2} fontWeight="medium">
                                    Sort by
                                </Text>
                                <Select
                                    value={sortBy || 'featured'}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    bg="gray.800"
                                    border="1px solid"
                                    borderColor="gray.700"
                                    color="white"
                                    size="sm"
                                    _hover={{ borderColor: "gray.600" }}
                                    _focus={{ borderColor: "primary.green.900" }}
                                >
                                    {sortOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                            style={{ backgroundColor: '#2D3748', color: 'white' }}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                            </Box>

                            {/* Price Range Filter */}
                            <Box>
                                <HStack justify="space-between" mb={2}>
                                    <Text color="gray.300" fontSize="sm" fontWeight="medium">
                                        Max Price
                                    </Text>
                                    <Text color="primary.green.900" fontSize="sm" fontWeight="bold">
                                        ${rangeUpper}
                                    </Text>
                                </HStack>
                                <Box px={3}>
                                    <Slider
                                        value={rangeUpper}
                                        onChange={handlePriceChange}
                                        min={0}
                                        max={30000}
                                        step={1}
                                        colorScheme="green"
                                    >
                                        <SliderTrack bg="gray.700" h={1}>
                                            <SliderFilledTrack bg="primary.green.900" />
                                        </SliderTrack>
                                        <SliderThumb
                                            boxSize={4}
                                            bg="primary.green.900"
                                            border="2px solid white"
                                            _focus={{ boxShadow: "0 0 0 3px rgba(72, 187, 120, 0.3)" }}
                                        />
                                    </Slider>
                                </Box>
                            </Box>
                        </VStack>
                    </Collapse>
                </Box>

                {(!isMobile || showFilters) && (
                    <>
                        <Divider borderColor="gray.700" my={2} />
                        <VStack spacing={2} align="stretch">
                            <HStack justify="space-between">
                                <Text fontSize="sm" color="gray.400">
                                    Total Products:
                                </Text>
                                <Text fontSize="sm" color="white" fontWeight="medium">
                                    {totalProducts}
                                </Text>
                            </HStack>
                            <HStack justify="space-between">
                                <Text fontSize="sm" color="gray.400">
                                    Categories:
                                </Text>
                                <Text fontSize="sm" color="white" fontWeight="medium">
                                    {subcategories?.length || 0}
                                </Text>
                            </HStack>
                            <HStack justify="space-between">
                                <Text fontSize="sm" color="gray.400">
                                    Selected:
                                </Text>
                                <Text fontSize="sm" color="primary.green.900" fontWeight="medium">
                                    {transformedSubcategories.find(item => item.isActive)?.name || `All ${capitalizeCategory(category)}`}
                                </Text>
                            </HStack>
                            <HStack justify="space-between">
                                <Text fontSize="sm" color="gray.400">
                                    Max Price:
                                </Text>
                                <Text fontSize="sm" color="primary.green.900" fontWeight="medium">
                                    ${rangeUpper}
                                </Text>
                            </HStack>
                            <HStack justify="space-between">
                                <Text fontSize="sm" color="gray.400">
                                    Sort:
                                </Text>
                                <Text fontSize="sm" color="primary.green.900" fontWeight="medium">
                                    {sortOptions.find(opt => opt.value === sortBy)?.label || 'Featured'}
                                </Text>
                            </HStack>
                        </VStack>
                    </>
                )}
            </VStack>
        </Box>
    );
};

export default CategorySidebar;