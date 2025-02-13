import { z } from 'zod';

// Define the Zod schema for Product
export const ProductSchema = z.object({
    id: z.string(),
    title: z.string(),
    created_at: z.string().transform((str) => new Date(str)),
    updated_at: z.string().transform((str) => new Date(str)),
    deleted_at: z.string().nullable().transform((str) => (str ? new Date(str) : null)),    subtitle: z.string().optional().nullable(),
    handle: z.string().optional().nullable(),
    description: z.string().optional(),
    thumbnail: z
        .string()
        .url({ message: 'Invalid URL format for thumbnail' })
        .optional(),
    weight: z.number().nullable(),
    length: z.number().nullable(),
    height: z.number().nullable(),
    width: z.number().nullable(),
    metadata: z
        .object({
            shipping_policy: z.string().optional(),
            return_policy: z.string().optional(),
            payment_policy: z.string().optional(),
            ships_from: z.string().optional(),
            shipping_time: z.string().optional(),
        })
        .nullable(),
    images: z
        .array(
            z.object({
                url: z.string().url({ message: 'Invalid image URL' }),
                id: z.string(),
                fileName: z.string(),
            }),
        )
        .optional()
        .default([]),
    categories: z
        .array(
            z.object({
                id: z.string(),
                created_at: z.string(),
                updated_at: z.string(),
                name: z.string(),
                description: z.string().optional().nullable(),
                handle: z.string(),
                is_active: z.boolean(),
                is_internal: z.boolean(),
                parent_category_id: z.string().nullable(),
                rank: z.number(),
                metadata: z
                    .object({
                        icon_url: z.string().optional().nullable(),
                    })
                    .optional()
                    .nullable(),
            }),
        )
        .optional()
        .nullable(), // Ensure categories can be optional and nullable
    variants: z.array(
        z.object({
            id: z.string(),
            product: z.string().optional(),
            product_id: z.string(),
            title: z.string(),
            created_at: z.string().transform((str) => new Date(str)),
            updated_at: z.string().transform((str) => new Date(str)),
            deleted_at: z.string().nullable().transform((str) => (str ? new Date(str) : null)),
            sku: z.string().nullable(),
            inventory_quantity: z.number(),
            variant_rank: z.number(),
            allow_backorder: z.boolean(),
            manage_inventory: z.boolean(),
            inventory_items: z.array(z.any()).optional().default([]),
            purchasable: z.boolean().optional(),
            options: z.array(z.object({
                id: z.string(),
                created_at: z.string().transform((str) => new Date(str)),
                updated_at: z.string().transform((str) => new Date(str)),
                deleted_at: z.string().nullable().transform((str) => (str ? new Date(str) : null)),
                value: z.string(),
                option_id: z.string(),
                variant_id: z.string(),
                metadata: z.any().nullable(),
            })).optional(),
            prices: z
                .array(
                    z.object({
                        id: z.string(),
                        currency_code: z.string(),
                        amount: z.string(), // Assuming it's a string
                        min_quantity: z.number().nullable(),
                        max_quantity: z.number().nullable(),
                        price_list_id: z.string().nullable(),
                        region_id: z.string().nullable(),
                    }),
                )
                .optional()
                .default([]),
            // Optional fields
            external_source: z.string().nullable(),
            external_metadata: z.any().nullable(),
            barcode: z.string().nullable(),
            ean: z.string().nullable(),
            upc: z.string().nullable(),
            hs_code: z.string().nullable(),
            origin_country: z.string().nullable(),
            mid_code: z.string().nullable(),
            material: z.string().nullable(),
            weight: z.number().nullable(),
            length: z.number().nullable(),
            height: z.number().nullable(),
            width: z.number().nullable(),
            metadata: z
                .object({
                    imgUrl: z.string().url().optional(),
                })
                .nullable(),
        }),
    ),
});

// Generate TypeScript type from Zod schema
export type Product = z.infer<typeof ProductSchema>;