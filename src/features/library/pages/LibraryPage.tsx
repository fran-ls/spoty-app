import { Navigate, useLocation } from "react-router-dom";
import { routes } from "../../../shared/utils/routes";
import { Library } from "../components/Library";

const LibraryPage = () => {
  const { pathname } = useLocation();

  if (window.innerWidth >= 768) {
    return <Navigate to={routes.home} />
  }

  return (
    <Library
      isPage={true}
      isExpanded={pathname === routes.library}
      isCollapsed={false}
    />
  )
}

export default LibraryPage;