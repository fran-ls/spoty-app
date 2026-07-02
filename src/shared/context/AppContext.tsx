import { useState, createContext, type ReactElement, useContext } from "react";

interface AppCtx {
  isSettingsMenu: boolean;
  isSettingsModal: boolean;
  setIsSettingsMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppCtx>({
  isSettingsMenu: false,
  isSettingsModal: false,
  setIsSettingsMenu: () => { },
  setIsSettingsModal: () => { }
});

export const AppProvider = ({ children }: { children: ReactElement }) => {
  const [isSettingsMenu, setIsSettingsMenu] = useState(false);
  const [isSettingsModal, setIsSettingsModal] = useState(false);

  return (
    <AppContext.Provider value={{
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