import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface GlobalContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

// Create the context with a default value of undefined
const GlobalContext = createContext<GlobalContextType>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {}
});

// Define the props for the provider
interface GlobalProviderProps {
  children: ReactNode;
}

// Create a provider component
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {

  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // UI theme (light or dark)

  useEffect(() => {
    const storedTheme = localStorage.getItem('land-v2-theme') as 'light' | 'dark' || 'light';
    if (storedTheme == 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    setTheme(storedTheme);
  }, []);

  const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('land-v2-theme', newTheme); // Store theme preference
  };

    return (
      <GlobalContext.Provider
        value={{
          theme,
          toggleTheme,
          setTheme
        }}
      >
          {children}
      </GlobalContext.Provider>
    );
};

// Custom hook for using the GlobalContext
export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
