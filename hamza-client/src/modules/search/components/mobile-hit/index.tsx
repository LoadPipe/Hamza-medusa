import { ProductVariant } from "@medusajs/medusa"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type ProductHit = {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  variants: ProductVariant[]
  collection_handle: string | null
  collection_id: string | null
}

type MobileHitProps = {
  hit: ProductHit
}

const MobileHit = ({ hit }: MobileHitProps) => {
  return (
    <LocalizedClientLink href={`/products/${hit.handle}`}>
      <div
        key={hit.id}
        className="bg-gray-900 rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-800 transition-colors"
      >
        <div className="flex flex-col justify-center w-full">
          <span className="text-white text-sm">{hit.title}</span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default MobileHit