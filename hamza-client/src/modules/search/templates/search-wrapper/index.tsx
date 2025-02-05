'use client';

import { useEffect, useState } from 'react';
import SearchModal from '../search-modal';
import { Input } from '@medusajs/ui';
import { usePathname } from 'next/navigation';

export default function SearchModalWrapper() {
    const [searchOpened, setSearchOpened] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        window.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key == 'k') {
                setSearchOpened(true);
            }
        });
    }, []);

    useEffect(() => {
        setSearchOpened(false);
    }, [pathname]);

    return (
        <>
            <Input
                type="search"
                placeholder="Search  "
                className="!bg-black !text-white"
                onClick={() => {
                    setSearchOpened(true);
                }}
            ></Input>
            {searchOpened && (
                <SearchModal
                    closeModal={() => {
                        setSearchOpened(false);
                    }}
                />
            )}
        </>
    );
}
