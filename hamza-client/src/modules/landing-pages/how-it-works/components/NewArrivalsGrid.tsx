"use client"

import type React from "react"
import type { Product } from "../types"
import ProductCard from "./ProductCard"
import { translate as defaultTranslate } from "../translations" // Using defaultTranslate if translate prop is not passed
import { chains } from "../data"
import { ArrowRight } from "lucide-react"

interface NewArrivalsGridProps {
  products: Product[]
  translate?: (key: string, lang?: string) => string
  selectedLanguage?: string
  selectedCurrency?: string
  selectedShipping?: string
  selectedChain?: string
}

const NewArrivalsGrid: React.FC<NewArrivalsGridProps> = ({
  products,
  translate = defaultTranslate,
  selectedLanguage = "EN",
  selectedCurrency = "USD",
  selectedShipping = "US",
  selectedChain = chains.length > 0 ? chains[0].name : "",
}) => {
  const selectedChainData = chains.find((chain) => chain.name === selectedChain)

  return (
    <div className="mt-16 max-w-[1200px] mx-auto px-4 relative z-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">{translate("New Arrivals", selectedLanguage)}</h2>
        <button className="flex items-center text-green-400 hover:text-green-300 transition-colors">
          {translate("View All", selectedLanguage)}
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.slice(0, 4).map(
          (
            product, // Displaying only first 4 for brevity, can be made dynamic
          ) => (
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
          ),
        )}
      </div>
    </div>
  )
}

export default NewArrivalsGrid
