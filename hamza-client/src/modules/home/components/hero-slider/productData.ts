export interface Product {
    imgSrc: string;
    categoryTitle: string;
    description: string;
    price: string;
}

const products: Product[] = [
    {
        imgSrc: 'https://via.placeholder.com/295/FF5733',
        categoryTitle: 'Electronics',
        description:
            'Discover the latest gadgets and tech innovations at unbeatable prices.',
        price: '299.99',
    },
    {
        imgSrc: 'https://via.placeholder.com/295/33FF57',
        categoryTitle: 'Fashion',
        description:
            'Explore trendy outfits and accessories that redefine your style.',
        price: '79.99',
    },
    {
        imgSrc: 'https://via.placeholder.com/295/3357FF',
        categoryTitle: 'Home Appliances',
        description:
            'Upgrade your home with top-of-the-line appliances for every need.',
        price: '499.99',
    },
    {
        imgSrc: 'https://via.placeholder.com/295/FF33A5',
        categoryTitle: 'Sports',
        description:
            'Gear up with the best equipment and apparel for your favorite sports.',
        price: '129.99',
    },
];

export default products;
