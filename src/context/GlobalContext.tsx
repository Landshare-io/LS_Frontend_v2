import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface GlobalContextType {
  alertModal: any,
  setAlertModal: (updatedStatus: any) => void;
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  notifyInfo:  (message: string) => void;
  screenLoadingStatus: string;
  setScreenLoadingStatus: Function;
  isAuthenticated: boolean;
  setIsAuthenticated: Function;
}

// Create the context with a default value of undefined
const GlobalContext = createContext<GlobalContextType>({
  alertModal: {},
  setAlertModal: (updatedStatus: any) => {},
  notifySuccess: (message: string) => {},
  notifyError: (message: string) => {},
  notifyInfo: (message: string) => {},
  screenLoadingStatus: '',
  setScreenLoadingStatus: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

// Define the props for the provider
interface GlobalProviderProps {
  children: ReactNode;
}

// Create a provider component
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [alertModal, setAlertModal] = useState({
    show: false,
    type: '',
    message: '',
  });
  const [screenLoadingStatus, setScreenLoadingStatus] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (screenLoadingStatus.includes('fail') || screenLoadingStatus.includes('Failed') || screenLoadingStatus.includes('Complete') || screenLoadingStatus.includes('success') || screenLoadingStatus.includes('Success')) {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 2000);
    }
  }, [screenLoadingStatus])

  const notifySuccess = (message: string) =>
    setAlertModal({ show: true, type: "success", message });
  const notifyError = (message: string) =>
    setAlertModal({ show: true, type: "error", message });
  const notifyInfo = (message: string) =>
    setAlertModal({ show: true, type: "info", message });

  const value = {
    alertModal,
    setAlertModal,
    notifySuccess,
    notifyError,
    notifyInfo,
    screenLoadingStatus,
    setScreenLoadingStatus,
    isAuthenticated,
    setIsAuthenticated
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
