export interface Product {
  id: number
  name: string
  price: number // Changed from string to number
  image: string
  rating: number
  reviews: number
  chains: string[]
  category: string // Added category field
}

export interface Chain {
  name: string
  logo: string
  cryptocurrencies: { name: string; logo: string }[]
}
