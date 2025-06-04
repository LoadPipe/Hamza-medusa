import { getStores, getAllProducts, listCategories } from '@/lib/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://hamza.market'

    const countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'

    try {
        // Fetch all data 
        const [stores, productsData, categories] = await Promise.all([
            getStores(),
            getAllProducts(['all'], 5000000, 0, 'usdc', 1000, 0), 
            listCategories()
        ])

        // Static pages (using dynamic country code)
        const staticPages: MetadataRoute.Sitemap = [
            {
                url: `${baseUrl}/${countryCode}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: `${baseUrl}/${countryCode}/shop`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/${countryCode}/cart`,
                lastModified: new Date(),
                changeFrequency: 'always',
                priority: 0.3,
            }
        ]

        // Dynamic store pages
        const storePages: MetadataRoute.Sitemap = stores?.map((store: any) => ({
            url: `${baseUrl}/${countryCode}/store/${store.handle}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        })) || []

        // Dynamic product pages
        const products = productsData?.products || []
        const productPages: MetadataRoute.Sitemap = products.map((product: any) => ({
            url: `${baseUrl}/${countryCode}/products/${product.handle}`,
            lastModified: new Date(product.updated_at),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }))

        // Dynamic category pages
        const categoryPages: MetadataRoute.Sitemap = categories?.map((category: any) => ({
            url: `${baseUrl}/${countryCode}/category/${category.handle}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        })) || []

        // Combine all pages
        return [
            ...staticPages,
            ...storePages,
            ...productPages,
            ...categoryPages
        ]

    } catch (error) {
        console.error('Error generating sitemap:', error)

        return [
            {
                url: `${baseUrl}/${countryCode}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: `${baseUrl}/${countryCode}/shop`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            }
        ]
    }
}