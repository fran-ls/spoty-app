import { useState, createContext, type ReactElement, useContext } from "react";
import type { LibraryStatus } from "../../features/library/library.types";

interface AppCtx {
  searchQuery: string;
  isSettingsMenu: boolean;
  isSettingsModal: boolean;
  libraryStatus: LibraryStatus;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setIsSettingsMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLibraryStatus: React.Dispatch<React.SetStateAction<LibraryStatus>>;
}

export const AppContext = createContext<AppCtx>({
  libraryStatus: {
    collapsed: false,
    expanded: false
  },
  searchQuery: '',
  isSettingsMenu: false,
  isSettingsModal: false,
  setLibraryStatus: () => { },
  setSearchQuery: () => { },
  setIsSettingsMenu: () => { },
  setIsSettingsModal: () => { },
});

export const AppProvider = ({ children }: { children: ReactElement }) => {
  const [isSettingsMenu, setIsSettingsMenu] = useState(false);
  const [isSettingsModal, setIsSettingsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryStatus, setLibraryStatus] = useState<LibraryStatus>({
    collapsed: false,
    expanded: false
  });

  return (
    <AppContext.Provider value={{
      libraryStatus, setLibraryStatus,
      searchQuery, setSearchQuery,
      isSettingsMenu, setIsSettingsMenu,
      isSettingsModal, setIsSettingsModal
    }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppCtx = () => {
  const ctx = useContext(AppContext);
  return ctx;
}