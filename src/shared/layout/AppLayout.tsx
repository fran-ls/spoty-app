import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { Library } from "../../features/library/components/Library";
import { Player } from "../../features/player/components/Player";
import { Header } from "../components/Header";
import { PlayerBar } from "../../features/player/components/PlayerBar";
import { PremiumModal } from "../components/PremiumModal";
import { STYLES } from "../utils/styles";
import { tokenService } from "../../features/auth/services/token.service";
import UserProfile from "../../features/auth/components/UserProfile";
import { UploadPanel } from "../../features/song/components/UploadPanel";
import useAuth from "../../features/auth/hooks/useAuth";
import AdminLayout from "./AdminLayout";
import { routes } from "../utils/routes";
import YTDropAppLayout from "../../yt_drop/components/layout/YTDropAppLayout";
import MobilePlayer from "../../features/player/components/MobilePlayer";
import { getDeviceType } from "../utils/getDeviceType";
import MobileTabs from "./MobileTabs";
import { CustomScrollbar } from "../components/CustomScrollbar";

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

  const device = getDeviceType();
  const isDesktop = device === 'desktop';

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

      <div className={`${isDesktop ? 'px-2' : ''} flex gap-2 select-none rounded-lg`}>
        {(currentPath !== routes.library) && (
          <Library />
        )}

        <main className={`${isDesktop ? 'rounded-lg' : ''} w-full bg-[#131313] overflow-hidden`}>
          <CustomScrollbar
            scrollbarMode="vertical"
            viewport={{
              className: `${STYLES.maxHeightMain} ${STYLES.minHeightMain} flex-1 ${isDesktop ? '' : 'hide-scrollbar'}`
            }}
          >
            {children}
          </CustomScrollbar>
        </main>

        <Player />
      </div>

      {isDesktop ? <PlayerBar /> : (
        <>
          <MobilePlayer />
          <MobileTabs />
        </>
      )}

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