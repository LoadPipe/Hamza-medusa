import Spinner from "@modules/common/icons/spinner"

export default function Loading({ style }: { style: React.CSSProperties }) {
  return (
    <div className="flex items-center justify-center w-full h-full text-ui-fg-base" style={style}>
      <Spinner size={36} />
    </div>
  )
}
