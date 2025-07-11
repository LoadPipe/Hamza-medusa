"use client"

import type React from "react"
import { useState, useEffect } from "react"

const products = [
  {
    name: "Magsafe Magnetic Power Bank 10000mAh",
    price: 26.38,
    category: "Electronics",
    image: "🔋",
  },
  {
    name: "Wireless Earbuds Pro",
    price: 79.99,
    category: "Audio",
    image: "🎧",
  },
  {
    name: "Smart Security Camera",
    price: 49.99,
    category: "Smart Home",
    image: "📹",
  },
  {
    name: "Electric Scooter",
    price: 299.99,
    category: "Transportation",
    image: "🛴",
  },
  {
    name: "Solar Generator",
    price: 199.99,
    category: "Outdoor",
    image: "🔆",
  },
]

const HeroSection: React.FC = () => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleDotClick = (index: number) => {
    if (index !== currentProductIndex) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentProductIndex(index)
        setIsTransitioning(false)
      }, 300)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentProductIndex((prev) => (prev + 1) % products.length)
        setIsTransitioning(false)
      }, 300)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const currentProduct = products[currentProductIndex]

  return (
    <div className="relative w-full pt-16 sm:pt-24 pb-16 bg-gradient-to-b from-black to-transparent">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 lg:gap-16">
          <div className="flex flex-col items-center lg:items-start gap-6 lg:gap-8 max-w-xl text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight leading-tight text-white">
              The World's 1st Decentralized E-Commerce
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed text-white">
              Discover the world's first decentralized commerce marketplace. Buy and sell directly, securely, powered by
              blockchain.
            </p>
          </div>
          <div className="w-full max-w-[400px] lg:w-[600px] relative">
            <div
              className={`flex flex-col sm:flex-row bg-black rounded-3xl overflow-hidden transition-opacity duration-300 border border-gray-800 ${
                isTransitioning ? "opacity-50" : "opacity-100"
              }`}
            >
              <div className="w-full sm:w-1/2 bg-white p-8 flex items-center justify-center">
                <span className="text-[100px] sm:text-[120px]">{currentProduct.image}</span>
              </div>
              <div className="w-full sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">{currentProduct.name}</h3>
                <div className="flex items-center mb-4">
                  <div className="bg-[#242424] rounded-full p-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#4F46E5" />
                      <path
                        d="M12 6v12M16 12H8"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-3xl sm:text-4xl font-bold text-white ml-2">
                    {currentProduct.price.toFixed(2)}
                  </span>
                </div>
                <div className="inline-flex">
                  <span className="px-4 py-2 bg-[#181818] text-white text-sm rounded-full">
                    {currentProduct.category}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-3">
              {products.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full border-2 border-gray-600 transition-colors duration-300 hover:bg-green-400 ${
                    index === currentProductIndex ? "bg-green-400" : "bg-black"
                  }`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
