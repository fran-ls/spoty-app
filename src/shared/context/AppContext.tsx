import { useState, createContext, type ReactElement, useContext } from "react";

interface AppCtx {
  searchQuery: string;
  isSettingsMenu: boolean;
  isSettingsModal: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setIsSettingsMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppCtx>({
  searchQuery: '',
  isSettingsMenu: false,
  isSettingsModal: false,
  setSearchQuery: () => { },
  setIsSettingsMenu: () => { },
  setIsSettingsModal: () => { }
});

export const AppProvider = ({ children }: { children: ReactElement }) => {
  const [isSettingsMenu, setIsSettingsMenu] = useState(false);
  const [isSettingsModal, setIsSettingsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AppContext.Provider value={{
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