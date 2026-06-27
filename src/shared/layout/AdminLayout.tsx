import UserProfile from "../../features/auth/components/UserProfile";
import { UploadPanel } from "../../features/song/components/UploadPanel";
import useAuth from "../../features/auth/hooks/useAuth";
import { Header } from "../components";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isUploadModal } = useAuth();

  return (
    <div className="h-screen bg-black font-sans text-on-surface antialiased selection:bg-primary selection:text-black">
      <Header />

      <main className={`min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] w-full bg-[#131313] overflow-auto`}>
        {children}
      </main>

      <UserProfile />

      {isUploadModal && <UploadPanel />}
    </div>
  )
}

export default AdminLayout;