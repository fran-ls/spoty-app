import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { Library } from "../../features/library/components/Library";
import { QueueList } from "../../features/player/QueueList";
import { Header } from "../components/Header";
import { PlayerBar } from "../../features/player/PlayerBar";
import { PremiumModal } from "../components/PremiumModal";
import { STYLES } from "../utils/styles";
import { tokenService } from "../../features/auth/services/token.service";
import UserProfile from "../../features/auth/components/UserProfile";
import { UploadPanel } from "../../features/song/components/UploadPanel";
import useAuth from "../../features/auth/hooks/useAuth";
import AdminLayout from "./AdminLayout";
import { routes } from "../utils/routes";
import YTDropAppLayout from "../../yt_drop/components/layout/YTDropAppLayout";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const { isAdmin, isUploadModal } = useAuth();
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const currentPath = pathname;
  const paths: string[] = [routes.upload];

  const YTDropPaths: string[] = [
    routes.YTDrop.auth,
    routes.YTDrop.download,
    routes.YTDrop.history,
    routes.YTDrop.historyStats,
  ];

  useEffect(() => {
    const timeout = 14 * 60 * 1000 + 500; // 14:30 minutes
    setInterval(() => tokenService.refreshAccessToken(), timeout);
  }, []);

  if (isAdmin && YTDropPaths.includes(currentPath)) {
    return (
      <YTDropAppLayout>
        {children}
      </YTDropAppLayout>
    )
  }

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
        {(currentPath !== routes.library) && (
          <Library />
        )}

        <main className="w-full rounded-lg bg-[#131313] overflow-hidden">
          <div className={`${STYLES.maxHeightMain} ${STYLES.minHeightMain} flex-1 overflow-y-auto ${window.innerWidth >= 640 ? '' : 'hide-scrollbar'}`}>
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
        {(isAdmin && isUploadModal) && <UploadPanel />}
      </AnimatePresence>
    </div>
  )
}

export default AppLayout;