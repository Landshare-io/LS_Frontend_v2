import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface GlobalContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  alertModal: any,
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  notifyInfo:  (message: string) => void;
  screenLoadingStatus: string;
  setScreenLoadingStatus: Function;
}

// Create the context with a default value of undefined
const GlobalContext = createContext<GlobalContextType>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  alertModal: {},
  notifySuccess: (message: string) => {},
  notifyError: (message: string) => {},
  notifyInfo: (message: string) => {},
  screenLoadingStatus: '',
  setScreenLoadingStatus: () => {}
});

// Define the props for the provider
interface GlobalProviderProps {
  children: ReactNode;
}

// Create a provider component
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // UI theme (light or dark)
  const [alertModal, setAlertModal] = useState({
    show: false,
    type: '',
    message: '',
  });
  const [screenLoadingStatus, setScreenLoadingStatus] = useState('')

  useEffect(() => {
    const storedTheme = localStorage.getItem('land-v2-theme') as 'light' | 'dark' || 'light';
    if (storedTheme == 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    setTheme(storedTheme);
  }, []);

  const notifySuccess = (message: string) =>
    setAlertModal({ show: true, type: "success", message });
  const notifyError = (message: string) =>
    setAlertModal({ show: true, type: "error", message });
  const notifyInfo = (message: string) =>
    setAlertModal({ show: true, type: "info", message });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('land-v2-theme', newTheme); // Store theme preference
  };

  const value = {
    theme,
    toggleTheme,
    setTheme,
    alertModal,
    notifySuccess,
    notifyError,
    notifyInfo,
    screenLoadingStatus,
    setScreenLoadingStatus
  };

  return (
    <GlobalContext.Provider
      value={value}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook for using the GlobalContext
export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
