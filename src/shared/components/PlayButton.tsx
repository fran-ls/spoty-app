import { PauseIcon, PlayIcon } from "lucide-react";
import { cn } from "../utils/tailwindCn";

type Props = React.HTMLAttributes<HTMLButtonElement> & {
  isPlayingNow: boolean;
  classMerge?: boolean;
}

const PlayButton = ({ isPlayingNow, classMerge = true, className, ...props }: Props) => {
  return (
    <button
      {...props}
      type="button"
      className={classMerge ? cn(`shadow-[0_8px_8px_rgba(0,0,0,0.3)] absolute bottom-3 right-3 bg-primary text-black p-3 rounded-full opacity-0 ${isPlayingNow ? 'translate-y-0 opacity-100' : 'translate-y-3'} group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105`, className) : className}
    >
      {isPlayingNow ? (
        <PauseIcon
          size={24}
          fill="currentColor"
          stroke="none"
        />
      ) : (
        <PlayIcon
          size={24}
          fill="currentColor"
          stroke="none"
        />
      )}
    </button>
  )
}

export default PlayButton;