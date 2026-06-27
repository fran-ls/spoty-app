import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Playlists } from "../../features/sidebar/Playlists";
import { QueueList } from "../../features/sidebar/QueueList";
import { Header } from "../components/Header";
import { PlayerBar } from "../../features/player/PlayerBar";
import { PremiumModal } from "../components/PremiumModal";
import { STYLES } from "../utils/styles";
import { tokenService } from "../../features/auth/services/token.service";
import UserProfile from "../../features/auth/components/UserProfile";
import useAuth from "../../features/auth/hooks/useAuth";
import { UploadView } from "../../features/song/views/UploadView";
import AdminLayout from "./AdminLayout";
import { routes } from "../utils/routes";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isUploadModal } = useAuth();
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const currentPath = window.location.pathname;
  const paths: string[] = [routes.upload];

  useEffect(() => {
    const timeout = 14 * 60 * 1000 + 500; // 14:30 minutes
    setInterval(() => tokenService.refreshAccessToken(), timeout);
  }, []);

  if (isAdmin && paths.includes(currentPath)) {
    return (
      <AdminLayout>
        {children}
      </AdminLayout>
    )
  }

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

      <UserProfile />

      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
      />

      <AnimatePresence>
        {(isAdmin && isUploadModal) && <UploadView />}
      </AnimatePresence>
    </div>
  )
}

export default AppLayout;