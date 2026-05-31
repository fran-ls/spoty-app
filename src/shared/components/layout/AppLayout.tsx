import { useState } from "react";
import { Sidebar } from "../../../features/sidebar/Sidebar";
import { Header } from "../Header";
import { PlayerBar } from "../../../features/player/PlayerBar";
import { PremiumModal } from "../PremiumModal";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  return (
    <div className="h-screen bg-black overflow-hidden font-sans text-on-surface antialiased selection:bg-primary selection:text-black">
      <Header onExplorePremiumClick={() => setIsPremiumOpen(true)} />

      <div className="mx-2 flex overflow-hidden select-none rounded-lg">
        <Sidebar />

        {/* Dynamic Responsive View stage */}
        <main className="---not-hover:hide-scrollbar ml-2 max-h-[calc(100vh-64px-88px)] rounded-lg flex-1 overflow-y-auto bg-linear-to-b from-[#1c1c1c] via-surface to-black">
          {children}
        </main>
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