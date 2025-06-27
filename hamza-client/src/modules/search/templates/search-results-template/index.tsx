import { Heading, Text } from '@medusajs/ui';
import { Flex, Box } from '@chakra-ui/react';
import RefinementList from '@modules/shop/components/refinement-list';
import { SortOptions } from '@modules/shop/components/refinement-list/sort-products';
import SearchProductCardGroup from '@modules/search/components/search-product-card-group';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

type SearchResultsTemplateProps = {
    query: string;
    ids: string[];
    sortBy?: SortOptions;
    page?: string;
    countryCode: string;
};

const SearchResultsTemplate = ({
    query,
    ids,
    sortBy,
    page,
    countryCode,
}: SearchResultsTemplateProps) => {
    const pageNumber = page ? parseInt(page) : 1;

    return (
        <Flex justifyContent={'center'}>
            <Flex
                maxW="1340px"
                w={'100%'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                mx={{ base: '0', md: '1rem' }}
                my="2rem"
            >
                {/* Search Results Header */}
                <Flex
                    justifyContent={'space-between'}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    w="100%"
                    py={6}
                    px={{ base: 8, md: 14 }}
                    alignItems={'center'}
                >
                    <Flex flexDirection={'column'} alignItems={'flex-start'}>
                        <Text
                            className="text-ui-fg-muted"
                            style={{ color: 'white' }}
                        >
                            Search Results for:
                        </Text>
                        <Heading style={{ color: 'white' }}>
                            {query} ({ids.length})
                        </Heading>
                    </Flex>
                    <LocalizedClientLink
                        href="/shop"
                        className="txt-medium text-ui-fg-subtle hover:text-ui-fg-base"
                    >
                        Clear
                    </LocalizedClientLink>
                </Flex>

                {/* Content Area */}
                <Flex
                    mt={{ base: '-3rem', md: '0' }}
                    mx="1rem"
                    maxW="1307.74px"
                    w="100%"
                    flexDirection={{ base: 'column', md: 'row' }}
                    alignItems={'flex-start'}
                    gap={'20px'}
                    justifyContent={'flex-start'}
                    p={6}
                >
                    {ids.length > 0 ? (
                        <>
                            <Box>
                                <RefinementList
                                    sortBy={sortBy || 'created_at'}
                                    search
                                />
                            </Box>
                            <Flex
                                maxW="941px"
                                w="100%"
                                flexDirection={'column'}
                            >
                                <Box mt={{ base: '0', md: '1rem' }}>
                                    <SearchProductCardGroup
                                        productsIds={ids}
                                        sortBy={sortBy}
                                        page={pageNumber}
                                        countryCode={countryCode}
                                        columns={{ base: 2, lg: 3 }}
                                        gap={{ base: 4, md: '7' }}
                                        skeletonCount={9}
                                        productsPerPage={24}
                                        padding={{ base: '1rem', md: '0' }}
                                    />
                                </Box>
                            </Flex>
                        </>
                    ) : (
                        <Box ml={{ base: 8, md: 14 }} mt={3}>
                            <Text>No results.</Text>
                        </Box>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default SearchResultsTemplate;
