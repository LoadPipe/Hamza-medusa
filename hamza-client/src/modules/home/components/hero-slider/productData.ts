// productsData.ts

export interface Product {
    imgSrc: string;
    categoryTitle: string;
    description: string;
}

const products: Product[] = [
    {
        imgSrc: 'https://via.placeholder.com/295/FF5733',
        categoryTitle: 'Electronics',
        description:
            'Discover the latest gadgets and tech innovations at unbeatable prices.',
    },
    {
        imgSrc: 'https://via.placeholder.com/295/33FF57',
        categoryTitle: 'Fashion',
        description:
            'Explore trendy outfits and accessories that redefine your style.',
    },
    {
        imgSrc: 'https://via.placeholder.com/295/3357FF',
        categoryTitle: 'Home Appliances',
        description:
            'Upgrade your home with top-of-the-line appliances for every need.',
    },
    {
        imgSrc: 'https://via.placeholder.com/295/FF33A5',
        categoryTitle: 'Sports',
        description:
            'Gear up with the best equipment and apparel for your favorite sports.',
    },
];

export default products;
