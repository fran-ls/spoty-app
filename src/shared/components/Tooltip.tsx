interface TooltipProps {
  text: string
}

const Tooltip = ({ text }: TooltipProps) => {
  return (
    <div className="min-w-fit min-h-fit block relative">
      <div className="rotate-45 w-5 h-5 bg-[#262626] absolute top-0 left-1/2 -translate-x-1/2" />

      <div className="py-1 px-2 bg-[#262626] text-sm text-white rounded text-left w-full mt-1 absolute top-0 left-1/2 -translate-x-1/2">
        {text}
      </div>
    </div>
  )
}

export default Tooltip;