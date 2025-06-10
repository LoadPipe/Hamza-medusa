'use client';

import { InstantSearch } from 'react-instantsearch-hooks-web';
import { MagnifyingGlassMini } from '@medusajs/icons';
import { SEARCH_INDEX_NAME, searchClient } from '@/lib/config/search-client';
import MobileHit from '@modules/search/components/mobile-hit';
import MobileHits from '@modules/search/components/mobile-hits';
import SearchBox from '@modules/search/components/search-box';
import { useEffect, useRef, useCallback } from 'react';
import { IoMdClose } from 'react-icons/io';

export default function MobileSearchModal({
    closeModal,
}: {
    closeModal: () => void;
}) {
    const searchRef = useRef(null);

    const handleOutsideClick = useCallback((event: MouseEvent) => {
        if (event.target === searchRef.current) {
            closeModal();
        }
    }, [closeModal]);

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
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" ref={searchRef} />
            <div className="fixed top-0 left-0 right-0 bg-[#020202] shadow-lg">
                <div className="flex flex-col p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white text-lg font-medium">Search Products</h3>
                        <IoMdClose
                            onClick={closeModal}
                            className="text-white text-2xl cursor-pointer hover:text-gray-300"
                        />
                    </div>
                    
                    <InstantSearch
                        indexName={SEARCH_INDEX_NAME}
                        searchClient={searchClient}
                    >
                        <div className="flex flex-col w-full">
                            <div className="flex items-center gap-x-2 p-3 bg-[rgba(3,7,18,0.5)] text-white backdrop-blur-2xl rounded-lg mb-4">
                                <MagnifyingGlassMini />
                                <SearchBox />
                            </div>
                            <div className="search-results bg-white rounded-lg">
                                <MobileHits hitComponent={MobileHit} />
                            </div>
                        </div>
                    </InstantSearch>
                </div>
            </div>
        </div>
    );
}