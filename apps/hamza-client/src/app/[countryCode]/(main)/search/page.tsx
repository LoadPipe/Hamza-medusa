'use client';
import SearchModal from '@modules/search/templates/search-modal';
import { useRouter } from 'next/navigation';

export default function SearchModalRoute() {
    const router = useRouter();
    return (
        <SearchModal
            closeModal={() => {
                router.back();
            }}
        />
    );
}
