import { ProductVariant } from "@medusajs/medusa"
import { Container, Text } from "@medusajs/ui"
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
      <Container
        key={hit.id}
        className="flex w-full p-4 shadow-elevation-card-rest hover:shadow-elevation-card-hover items-center border-b border-gray-200"
      >
        <div className="flex flex-col justify-center w-full">
          <Text className="text-ui-fg-base font-medium">{hit.title}</Text>
        </div>
      </Container>
    </LocalizedClientLink>
  )
}

export default MobileHit