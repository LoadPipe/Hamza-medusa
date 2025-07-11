"use client"

import { useState, useEffect } from "react"
import type { Product } from "../types"
import ProductCard from "./ProductCard"
import { translate } from "../translations"
import { chains } from "../data"
import { Filter } from "lucide-react"

interface ProductGridProps {
  selectedChain: string
  selectedCurrency: string
  selectedLanguage: string
  selectedShipping: string
}

const categories = [
  { name: "Filter", icon: Filter },
  { name: "All", emoji: "⭐" },
  { name: "Clothes", emoji: "👕" },
  { name: "Games", emoji: "🎮" },
  { name: "Books", emoji: "📚" },
  { name: "Electronics", emoji: "🖥️" },
  { name: "Jewelry", emoji: "💍" },
  { name: "Shoes", emoji: "👟" },
]

const dummyProducts: Product[] = [
  // Electronics
  {
    id: 1,
    name: "Premium Headphones",
    price: 299.99,
    image: "🎧",
    rating: 4.8,
    reviews: 128,
    chains: ["ETH", "MATIC", "BNB"],
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smartwatch Pro",
    price: 199.99,
    image: "⌚",
    rating: 4.5,
    reviews: 96,
    chains: ["ETH", "BNB"],
    category: "Electronics",
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    price: 129.99,
    image: "🎵",
    rating: 4.7,
    reviews: 215,
    chains: ["ETH", "MATIC"],
    category: "Electronics",
  },
  {
    id: 4,
    name: "4K Action Camera",
    price: 249.99,
    image: "📷",
    rating: 4.6,
    reviews: 172,
    chains: ["ETH", "MATIC", "BNB"],
    category: "Electronics",
  },
  {
    id: 5,
    name: "Smart Home Hub",
    price: 149.99,
    image: "🏠",
    rating: 4.4,
    reviews: 89,
    chains: ["ETH", "BNB"],
    category: "Electronics",
  },
  {
    id: 6,
    name: "Portable SSD",
    price: 89.99,
    image: "💾",
    rating: 4.7,
    reviews: 154,
    chains: ["ETH", "MATIC"],
    category: "Electronics",
  },
  // Clothes
  {
    id: 7,
    name: "Designer T-Shirt",
    price: 49.99,
    image: "👕",
    rating: 4.3,
    reviews: 89,
    chains: ["ETH", "BNB"],
    category: "Clothes",
  },
  {
    id: 8,
    name: "Leather Jacket",
    price: 199.99,
    image: "🧥",
    rating: 4.7,
    reviews: 154,
    chains: ["ETH", "MATIC"],
    category: "Clothes",
  },
  {
    id: 9,
    name: "Denim Jeans",
    price: 79.99,
    image: "👖",
    rating: 4.5,
    reviews: 210,
    chains: ["ETH", "MATIC", "BNB"],
    category: "Clothes",
  },
  {
    id: 10,
    name: "Summer Dress",
    price: 69.99,
    image: "👗",
    rating: 4.6,
    reviews: 178,
    chains: ["ETH", "BNB"],
    category: "Clothes",
  },
  {
    id: 11,
    name: "Winter Coat",
    price: 149.99,
    image: "🧥",
    rating: 4.8,
    reviews: 95,
    chains: ["ETH", "MATIC"],
    category: "Clothes",
  },
  {
    id: 12,
    name: "Formal Suit",
    price: 299.99,
    image: "🕴️",
    rating: 4.9,
    reviews: 67,
    chains: ["ETH", "BNB"],
    category: "Clothes",
  },
  // Games
  {
    id: 13,
    name: "VR Headset",
    price: 399.99,
    image: "🥽",
    rating: 4.9,
    reviews: 203,
    chains: ["ETH", "MATIC", "BNB"],
    category: "Games",
  },
  {
    id: 14,
    name: "Gaming Console",
    price: 499.99,
    image: "🎮",
    rating: 4.8,
    reviews: 187,
    chains: ["ETH", "BNB"],
    category: "Games",
  },
  {
    id: 15,
    name: "Racing Wheel",
    price: 249.99,
    image: "🏎️",
    rating: 4.7,
    reviews: 156,
    chains: ["ETH", "MATIC"],
    category: "Games",
  },
  {
    id: 16,
    name: "Gaming Mouse",
    price: 79.99,
    image: "🖱️",
    rating: 4.6,
    reviews: 231,
    chains: ["ETH", "BNB"],
    category: "Games",
  },
  {
    id: 17,
    name: "Gaming Keyboard",
    price: 129.99,
    image: "⌨️",
    rating: 4.7,
    reviews: 198,
    chains: ["ETH", "MATIC", "BNB"],
    category: "Games",
  },
  {
    id: 18,
    name: "Gaming Headset",
    price: 149.99,
    image: "🎧",
    rating: 4.8,
    reviews: 175,
    chains: ["ETH", "BNB"],
    category: "Games",
  },
  // Books
  {
    id: 19,
    name: "Bestseller Novel",
    price: 14.99,
    image: "📚",
    rating: 4.5,
    reviews: 320,
    chains: ["ETH", "MATIC"],
    category: "Books",
  },
  {
    id: 20,
    name: "Cookbook Collection",
    price: 39.99,
    image: "🍳",
    rating: 4.6,
    reviews: 95,
    chains: ["ETH", "BNB"],
    category: "Books",
  },
  {
    id: 21,
    name: "Science Fiction Trilogy",
    price: 29.99,
    image: "🚀",
    rating: 4.7,
    reviews: 287,
    chains: ["ETH", "MATIC", "BNB"],
    category: "Books",
  },
  {
    id: 22,
    name: "History Encyclopedia",
    price: 54.99,
    image: "🏛️",
    rating: 4.8,
    reviews: 142,
    chains: ["ETH", "BNB"],
    category: "Books",
  },
  {
    id: 23,
    name: "Poetry Collection",
    price: 19.99,
    image: "🖋️",
    rating: 4.4,
    reviews: 76,
    chains: ["ETH", "MATIC"],
    category: "Books",
  },
  {
    id: 24,
    name: "Self-Help Bestseller",
    price: 24.99,
    image: "🧘",
    rating: 4.6,
    reviews: 213,
    chains: ["ETH", "BNB"],
    category: "Books",
  },
  // Jewelry
  {
    id: 25,
    name: "Diamond Necklace",
    price: 999.99,
    image: "💎",
    rating: 4.9,
    reviews: 67,
    chains: ["ETH", "MATIC", "BNB"],
    category: "Jewelry",
  },
  {
    id: 26,
    name: "Gold Watch",
    price: 599.99,
    image: "⌚",
    rating: 4.7,
    reviews: 112,
    chains: ["ETH", "BNB"],
    category: "Jewelry",
  },
  {
    id: 27,
    name: "Pearl Earrings",
    price: 249.99,
    image: "👂",
    rating: 4.6,
    reviews: 89,
    chains: ["ETH", "MATIC"],
    category: "Jewelry",
  },
  {
    id: 28,
    name: "Silver Bracelet",
    price: 129.99,
    image: "🖐️",
    rating: 4.5,
    reviews: 156,
    chains: ["ETH", "BNB"],
    category: "Jewelry",
  },
  {
    id: 29,
    name: "Emerald Ring",
    price: 799.99,
    image: "💍",
    rating: 4.8,
    reviews: 78,
    chains: ["ETH", "MATIC", "BNB"],
    category: "Jewelry",
  },
  {
    id: 30,
    name: "Sapphire Pendant",
    price: 449.99,
    image: "🔷",
    rating: 4.7,
    reviews: 94,
    chains: ["ETH", "BNB"],
    category: "Jewelry",
  },
  // Shoes
  {
    id: 31,
    name: "Running Sneakers",
    price: 89.99,
    image: "👟",
    rating: 4.4,
    reviews: 230,
    chains: ["ETH", "MATIC"],
    category: "Shoes",
  },
  {
    id: 32,
    name: "Leather Boots",
    price: 149.99,
    image: "👢",
    rating: 4.6,
    reviews: 185,
    chains: ["ETH", "BNB"],
    category: "Shoes",
  },
  {
    id: 33,
    name: "High Heels",
    price: 129.99,
    image: "👠",
    rating: 4.5,
    reviews: 167,
    chains: ["ETH", "MATIC", "BNB"],
    category: "Shoes",
  },
  {
    id: 34,
    name: "Comfortable Slippers",
    price: 29.99,
    image: "🥿",
    rating: 4.3,
    reviews: 201,
    chains: ["ETH", "BNB"],
    category: "Shoes",
  },
  {
    id: 35,
    name: "Hiking Boots",
    price: 179.99,
    image: "🥾",
    rating: 4.7,
    reviews: 143,
    chains: ["ETH", "MATIC"],
    category: "Shoes",
  },
  {
    id: 36,
    name: "Dress Shoes",
    price: 159.99,
    image: "👞",
    rating: 4.6,
    reviews: 176,
    chains: ["ETH", "BNB"],
    category: "Shoes",
  },
]

export default function ProductGrid({
  selectedChain,
  selectedCurrency,
  selectedLanguage,
  selectedShipping,
}: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState(dummyProducts)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [visibleProducts, setVisibleProducts] = useState(8)

  useEffect(() => {
    if (selectedCategory === "All" || selectedCategory === "Filter") {
      setFilteredProducts(dummyProducts)
    } else {
      setFilteredProducts(dummyProducts.filter((product) => product.category === selectedCategory))
    }
    setVisibleProducts(8)
  }, [selectedCategory])

  const selectedChainData = chains.find((chain) => chain.name === selectedChain)

  return (
    <div className="mt-8 max-w-[1200px] mx-auto px-4 relative z-10">
      <div className="mb-8 flex items-center gap-2 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide relative z-20">
        {categories.map((category) => (
          <button
            key={category.name}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-sm sm:text-lg whitespace-nowrap ${
              category.name === "Filter"
                ? "border border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                : category.name === selectedCategory
                  ? "bg-green-400 text-black"
                  : "bg-gray-900 text-white hover:bg-green-400 hover:text-black"
            } transition-colors`}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name === "Filter" ? (
              <>
                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{category.name}</span>
              </>
            ) : (
              <>
                <span className="text-lg sm:text-xl">{category.emoji}</span>
                <span>{category.name}</span>
              </>
            )}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.slice(0, visibleProducts).map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              name: translate(product.name, selectedLanguage),
            }}
            currency={selectedCurrency}
            language={selectedLanguage}
            shipping={selectedShipping}
            chainCryptocurrencies={selectedChainData?.cryptocurrencies || []}
            selectedChain={selectedChain}
          />
        ))}
      </div>
      {visibleProducts < filteredProducts.length && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setVisibleProducts((prev) => prev + 8)}
            className="px-8 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-400 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}
