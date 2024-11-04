import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useMemo
} from "react";
import axios from "../hooks/nft-game/axios/nft-game-axios";
import { useWalletClient, useAccount } from "wagmi";
import { loginToBackendWithoutNotify } from "../utils/helpers/login";

interface GlobalContextType {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  alertModal: any;
  setAlertModal: (updatedStatus: any) => void;
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  notifyInfo: (message: string) => void;
  screenLoadingStatus: string;
  setScreenLoadingStatus: Function;
  isAuthenticated: boolean;
  setIsAuthenticated: Function;
  getUserHouses: Function;
  isLoginLoading: boolean;
}

// Create the context with a default value of undefined
const GlobalContext = createContext<GlobalContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
  alertModal: {},
  setAlertModal: (updatedStatus: any) => {},
  notifySuccess: (message: string) => {},
  notifyError: (message: string) => {},
  notifyInfo: (message: string) => {},
  screenLoadingStatus: "",
  setScreenLoadingStatus: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  getUserHouses: () => {},
  isLoginLoading : false
});

interface House {
  id: number;
  tokenHarvestLimit: number;
}

// Define the props for the provider
interface GlobalProviderProps {
  children: ReactNode;
}

// Create a provider component
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);

  const [theme, setTheme] = useState<"light" | "dark">("light"); // UI theme (light or dark)
  const [alertModal, setAlertModal] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [screenLoadingStatus, setScreenLoadingStatus] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { address, connector, isConnected } = useAccount();
  const [houseItems, setHouseItems] = useState([]);

  const { data: signer } = useWalletClient();

  useEffect(() => {
    const storedTheme =
      (localStorage.getItem("land-v2-theme") as "light" | "dark") || "light";
    if (storedTheme == "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    setTheme(storedTheme);
  }, []);

  const notifySuccess = (message: string) =>
    setAlertModal({ show: true, type: "success", message });
  const notifyError = (message: string) =>
    setAlertModal({ show: true, type: "error", message });
  const notifyInfo = (message: string) =>
    setAlertModal({ show: true, type: "info", message });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("land-v2-theme", newTheme); // Store theme preference
  };

  const getUserHouses = async () => {
    if (!address) return;
    try {
      const { data: houseData } = await axios.get("/house/find-by-user");
      let creditsSpent = 0;
  
      if (houseData.length > 0) {
        creditsSpent = houseData
          .map((house) => house.tokenHarvestLimit * 4)
          .reduce((a, b) => a + b, 0);
        setHouseItems(
          houseData.sort((houseA, houseB) => houseA.id - houseB.id)
        );
      } else {
        setHouseItems([]);
      }
    } catch (error: any) {
      console.log(error.response?.data?.message, error);
      checkIsAuthenticated();
    }
  };
  

  const checkIsAuthenticated = async () => {
    if (!signer) return;
    if (!address) return;
    if (isLoginLoading) return;

    setIsLoginLoading(true);
    if (localStorage.getItem("jwtToken-v2")) {
      try {
        const { data } = await axios.get("/user/is-loggedin");

        if (data.success) {
          setIsAuthenticated(true);
          setIsLoginLoading(false);
        } else {
          if (
            await loginToBackendWithoutNotify(
              signer,
              address,
              setIsLoginLoading
            )
          ) {
            setIsAuthenticated(true);
            setIsLoginLoading(false);
          }
        }
      } catch (error) {
        if (
          await loginToBackendWithoutNotify(signer, address, setIsLoginLoading)
        ) {
          setIsAuthenticated(true);
          setIsLoginLoading(false);
        }
      }
    } else {
      if (
        await loginToBackendWithoutNotify(signer, address, setIsLoginLoading)
      ) {
        setIsAuthenticated(true);
        setIsLoginLoading(false);
      }
    }
  };

  useMemo(() => {
    if (!signer) return;
    if (isAuthenticated) return;
    const pathName = location.pathname

    if (pathName.includes('/nft')) {
      checkIsAuthenticated()
    }
  }, [signer, isAuthenticated])

  const value = {
    theme,
    toggleTheme,
    setTheme,
    alertModal,
    setAlertModal,
    notifySuccess,
    notifyError,
    notifyInfo,
    screenLoadingStatus,
    setScreenLoadingStatus,
    isAuthenticated,
    setIsAuthenticated,
    getUserHouses,
    isLoginLoading,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

// Custom hook for using the GlobalContext
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
