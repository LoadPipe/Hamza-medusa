import Image from 'next/image';
import Link from 'next/link';
import allCategoryImg from '@/images/categories/all-category.png';
import artCategoryImg from '@/images/categories/art-category.png';
import booksCategoryImg from '@/images/categories/books-category.png';
import electronicsCategoryImg from '@/images/categories/electronics-category.png';
import gamesCategoryImg from '@/images/categories/games-category.png';
import giftCardsCategoryImg from '@/images/categories/gift-cards-category.png';
import merchCategoryImg from '@/images/categories/merch-category.png';

const staticCategories = [
    {
        name: 'Electronics',
        icon: electronicsCategoryImg,
        handle: 'electronics',
    },
    {
        name: 'Gift Cards',
        icon: giftCardsCategoryImg,
        handle: 'gift-cards',
    },
    {
        name: 'Books',
        icon: booksCategoryImg,
        handle: 'books',
    },
    {
        name: 'Merch',
        icon: merchCategoryImg,
        handle: 'merch',
    },
    {
        name: 'Art',
        icon: artCategoryImg,
        handle: 'art',
    },
    {
        name: 'All',
        icon: allCategoryImg,
        handle: 'all',
    },
];

export default function CategoryGrid() {
    return (
        <div className="max-w-[1280px] mx-auto w-full px-4">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-10">
                Shop By Category
            </h2>
            <div
                className="
                        grid 
                        grid-cols-2
                        sm:grid-cols-4
                        md:grid-cols-7
                        gap-6
                        mb-8
                    "
            >
                {staticCategories.map((cat) => (
                    <Link
                        key={cat.name}
                        href={`/category/${cat.handle}`}
                        className="
                                    group
                                    flex 
                                    flex-col 
                                    items-center 
                                    rounded-xl 
                                    px-0 py-6
                                    transition-all
                                    duration-300
                                    ease-in-out
                                    w-full
                                    hover:scale-105
                                    transform
                                    cursor-pointer
                                    hover:bg-[#3A3A3A]
                                "
                        style={{ backgroundColor: '#0B0A0B' }}
                    >
                        <div className="transition-transform duration-300 ease-in-out group-hover:scale-110 mb-3">
                            <Image
                                src={cat.icon}
                                alt={cat.name}
                                width={64}
                                height={64}
                                className="transition-all duration-300"
                                draggable={false}
                            />
                        </div>
                        <span className="text-white text-lg font-medium text-center transition-all duration-300">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
