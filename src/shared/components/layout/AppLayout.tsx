import { useState } from "react";
import { Playlists } from "../../../features/sidebar/Playlists";
import { QueueList } from "../../../features/sidebar/QueueList";
import { Header } from "../Header";
import { PlayerBar } from "../../../features/player/PlayerBar";
import { PremiumModal } from "../PremiumModal";
import { STYLES } from "../../utils/styles";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  return (
    <div className="h-screen bg-black font-sans text-on-surface antialiased selection:bg-primary selection:text-black">
      <Header onExplorePremiumClick={() => setIsPremiumOpen(true)} />

      <div className="px-2 flex gap-2 select-none rounded-lg">
        <Playlists />

        <main className="w-full rounded-lg bg-[#131313] overflow-hidden">
          <div className={`${STYLES.maxHeightMain} ${STYLES.minHeightMain} flex-1 overflow-y-auto`}>
            {children}
          </div>
        </main>

        <QueueList />
      </div>

      <PlayerBar />

      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
      />
    </div>
  )
}

export default AppLayout;