"use client"

import { useState, useEffect } from "react"

interface SubSelectorOption {
  name: string
  options: { name: string; code: string; flag?: string; symbol?: string }[]
}

interface SelectorOption {
  name: string
  icon: string
  subSelectors: SubSelectorOption[]
}

const selectorOptions: SelectorOption[] = [
  {
    name: "Options",
    icon: "⚙️",
    subSelectors: [
      {
        name: "Shipping",
        options: [
          { name: "USA", code: "US", flag: "🇺🇸" },
          { name: "Canada", code: "CA", flag: "🇨🇦" },
          { name: "UK", code: "UK", flag: "🇬🇧" },
          { name: "Australia", code: "AU", flag: "🇦🇺" },
        ],
      },
      {
        name: "Language",
        options: [
          { name: "English", code: "EN" },
          { name: "French", code: "FR" },
          { name: "Spanish", code: "ES" },
          { name: "German", code: "DE" },
        ],
      },
      {
        name: "Currency",
        options: [
          { name: "USD", code: "USD", symbol: "$" },
          { name: "EUR", code: "EUR", symbol: "€" },
          { name: "GBP", code: "GBP", symbol: "£" },
          { name: "CAD", code: "CAD", symbol: "C$" },
        ],
      },
    ],
  },
]

const subSelectorIcons: { [key: string]: string } = {
  Shipping: "🚚",
  Language: "🌐",
  Currency: "💱",
}

interface AdditionalSelectorProps {
  onOpen: () => void
  isOtherOpen: boolean
  onSelectCurrency: (currency: string) => void
  onSelectLanguage: (language: string) => void
  onSelectShipping: (shipping: string) => void
  translate: (key: string, lang?: string) => string
  selectedCurrency: string
  selectedLanguage: string
  selectedShipping: string
}

export function AdditionalSelector({
  onOpen,
  isOtherOpen,
  onSelectCurrency,
  onSelectLanguage,
  onSelectShipping,
  translate,
  selectedCurrency,
  selectedLanguage,
  selectedShipping,
}: AdditionalSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState({
    Shipping:
      selectorOptions[0].subSelectors[0].options.find((o) => o.code === selectedShipping) ||
      selectorOptions[0].subSelectors[0].options[0],
    Language:
      selectorOptions[0].subSelectors[1].options.find((o) => o.code === selectedLanguage) ||
      selectorOptions[0].subSelectors[1].options[0],
    Currency:
      selectorOptions[0].subSelectors[2].options.find((o) => o.code === selectedCurrency) ||
      selectorOptions[0].subSelectors[2].options[0],
  })

  const handleToggle = () => {
    if (!isOpen) {
      onOpen()
    }
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (isOtherOpen) {
      setIsOpen(false)
    }
  }, [isOtherOpen])

  const handleOptionSelect = (
    subSelectorName: string,
    option: { name: string; code: string; flag?: string; symbol?: string },
  ) => {
    setSelectedOptions((prev) => ({ ...prev, [subSelectorName]: option }))
    if (subSelectorName === "Currency") {
      onSelectCurrency(option.code)
    } else if (subSelectorName === "Language") {
      onSelectLanguage(option.code)
    } else if (subSelectorName === "Shipping") {
      onSelectShipping(option.code)
    }
  }

  return (
    <div className="relative">
      <div
        className="bg-[#121212] rounded-full shadow-sm border border-gray-800 cursor-pointer w-24 sm:w-32 py-2 px-3 sm:px-4"
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-sm font-medium text-white">{selectedOptions.Shipping.flag}</span>
            <span className="text-sm font-medium text-white">{selectedOptions.Currency.symbol}</span>
            <span className="text-sm font-medium text-white">{selectedOptions.Language.code}</span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="white"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-0">
          <div className="bg-[#121212] rounded-lg shadow-lg w-full max-w-md sm:w-64 max-h-[80vh] overflow-y-auto">
            {selectorOptions[0].subSelectors.map((subSelector) => (
              <div key={subSelector.name} className="p-3 border-b border-gray-800 last:border-b-0">
                <div className="flex items-center gap-2 font-medium mb-2 text-white">
                  <span className="text-lg">{subSelectorIcons[subSelector.name]}</span>
                  {translate(subSelector.name, selectedLanguage)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {subSelector.options.map((option) => (
                    <button
                      key={option.code}
                      className={`px-3 py-1 rounded-full text-sm flex items-center ${
                        selectedOptions[subSelector.name as keyof typeof selectedOptions].code === option.code
                          ? "bg-purple-600 text-gray-100"
                          : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                      }`}
                      onClick={() => handleOptionSelect(subSelector.name, option)}
                    >
                      {option.flag && <span className="mr-2 text-base">{option.flag}</span>}
                      {option.symbol && <span className="mr-2">{option.symbol}</span>}
                      {subSelector.name === "Language" ? option.code : option.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
