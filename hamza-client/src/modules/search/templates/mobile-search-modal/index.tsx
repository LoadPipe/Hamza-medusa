'use client';

import { InstantSearch } from 'react-instantsearch-hooks-web';
import { MagnifyingGlassMini } from '@medusajs/icons';
import { SEARCH_INDEX_NAME, searchClient } from '@/lib/config/search-client';
import MobileHit from '@modules/search/components/mobile-hit';
import MobileHits from '@modules/search/components/mobile-hits';
import SearchBoxWrapper from '@modules/search/components/search-box-wrapper';
import { useEffect, useRef, useCallback, useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';

export default function MobileSearchModal({
    closeModal,
}: {
    closeModal: () => void;
}) {
    const searchRef = useRef(null);
    const [searchValue, setSearchValue] = useState('');

    const handleOutsideClick = useCallback(
        (event: MouseEvent) => {
            if (event.target === searchRef.current) {
                closeModal();
            }
        },
        [closeModal]
    );

    useEffect(() => {
        window.addEventListener('click', handleOutsideClick);
        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, [handleOutsideClick]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [closeModal]);

    return (
        <div className="relative z-[75]">
            <div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                ref={searchRef}
            />
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black">
                <InstantSearch
                    indexName={SEARCH_INDEX_NAME}
                    searchClient={searchClient}
                >
                    <div className="flex flex-col h-full">
                        {/* Header with back arrow and search input */}
                        <div className="flex items-center gap-4 p-4 bg-black border-b border-gray-800">
                            <IoMdArrowBack
                                onClick={closeModal}
                                className="text-white text-2xl cursor-pointer hover:text-gray-300"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-x-2 text-white">
                                    <div className="flex-1">
                                        <SearchBoxWrapper placeholder="Search for product name, product...">
                                            {({
                                                inputRef,
                                                onChange,
                                                placeholder,
                                                value,
                                            }) => (
                                                <div className="w-full">
                                                    <input
                                                        ref={inputRef}
                                                        autoComplete="off"
                                                        autoCorrect="off"
                                                        autoCapitalize="off"
                                                        placeholder={
                                                            placeholder
                                                        }
                                                        spellCheck={false}
                                                        type="search"
                                                        value={value}
                                                        onChange={(e) => {
                                                            onChange(e);
                                                            setSearchValue(
                                                                e.target.value
                                                            );
                                                        }}
                                                        className="w-full bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none"
                                                    />
                                                </div>
                                            )}
                                        </SearchBoxWrapper>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content area */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {searchValue.trim() === '' ? (
                                // Show "Recent Search" when no search query
                                <div className="mb-6">
                                    <h3 className="text-green-400 text-sm font-medium mb-4">
                                        Recent Search
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="bg-gray-900 rounded-lg p-3">
                                            <span className="text-white text-sm">
                                                Start typing to search
                                                products...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Show search results when there's a query
                                <div>
                                    <h3 className="text-green-400 text-sm font-medium mb-4">
                                        Search Results
                                    </h3>
                                    <div className="search-results">
                                        <MobileHits
                                            hitComponent={MobileHit}
                                            query={searchValue}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </InstantSearch>
            </div>
        </div>
    );
}
