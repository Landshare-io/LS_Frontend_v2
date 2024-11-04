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
  signer : any,
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
  houseItems: any[];
  userActivatedSlots : number;
  setUserActivatedSlots: (userActivatedSlots: number) => void; 
  houseSlots : number;
  buySlotCost : number,
  setUserResource : (userResource: any) => void;
  userResource : any
}

// Create the context with a default value of undefined
const GlobalContext = createContext<GlobalContextType>({
  signer: "",
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
  alertModal: {},
  setAlertModal: (updatedStatus: any) => {},
  notifySuccess: (message: string) => {},
  notifyError: (message: string) => {},
  notifyInfo: (message: string) => {},
  screenLoadingStatus: "",
  setScreenLoadingStatus: (screenLoadingStatus: string) => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  getUserHouses: () => {},
  isLoginLoading : false,
  houseItems : [],
  userActivatedSlots : 2, 
  setUserActivatedSlots : () => (userActivatedSlots: number) => {},
  houseSlots : 5,
  buySlotCost : 5,
  setUserResource : () => (userResource: any) => {},
  userResource : 
  {
    resource: ["0", "0", "0", "0", "0"],
    maxPowerLimit: "0",
    landTokenBalance: "0",
    userReward: ["0", "0", "0", "0", "0"],
    asset: "0"
  },
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
  const { data: signer } = useWalletClient();

  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);

  const [theme, setTheme] = useState<"light" | "dark">("light"); // UI theme (light or dark)
  const [alertModal, setAlertModal] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [oneDayTime, setOneDayTime] = useState<number>(86400);
  const [harvestCost, setHarvestCost] = useState<number>(20);
  const [premiumAbleTime, setPremiumAbleTime] = useState<number>(7776000);
  const [premiumAttachPrice, setPremiumAttachPrice] = useState<number>(5);
  const [houseSlots, setHouseSlots] = useState<number>(5);
  const [buySlotCost, setBuySlotCost] = useState<number>(15);
  const [minAssetAmount, setMinAssetAmount] = useState<number>(200);
  const [withdrawStakedCost, setWithdrawStakedCost] = useState<string>('25,0,0,0,0');

  const [screenLoadingStatus, setScreenLoadingStatus] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { address, connector, isConnected } = useAccount();
  const [houseItems, setHouseItems] = useState([]);
  const [userActivatedSlots, setUserActivatedSlots] = useState<number>(2)


  const [userResource, setUserResource] = useState({
    resource: ["0", "0", "0", "0", "0"],
    maxPowerLimit: "0",
    landTokenBalance: "0",
    userReward: ["0", "0", "0", "0", "0"],
    asset: "0"
  });

  useEffect(() => {
    const storedTheme =
      (localStorage.getItem("land-v2-theme") as "light" | "dark") || "light";
    if (storedTheme == "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    setTheme(storedTheme);
  }, []);


  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("land-v2-theme", newTheme); // Store theme preference
  };


  const  getGameSettingData = async () => {
    try {
      const { data } = await axios.get('/setting/get-one-day')
      const { data: harvestData } = await axios.get('/setting/get-harvest-cost')
      const { data: premiumNftAbleTime } = await axios.get('/setting/get-premium-able-time')
      const { data: premiumNftAttachPrice } = await axios.get('/setting/get-premium-attach-price')
      const { data: getMaxHouseSlots } = await axios.get('/setting/get-max-house-slots');
      const { data: activatedSlots } = await axios.get('/user/activated-slots');
      const { data: getSlotCost } = await axios.get('/setting/get-buy-slot-cost');
      const { data: getMinAssetAmount } = await axios.get('/setting/minium-asset-amount')
      const { data: getWithdrawStakedCost } = await axios.get('/setting/withdraw-asset-token-cost')

      setOneDayTime(data.value)
      setHarvestCost(Number(harvestData))
      setPremiumAbleTime(Number(premiumNftAbleTime))
      setPremiumAttachPrice(Number(premiumNftAttachPrice))
      setHouseSlots(Number(getMaxHouseSlots))
      setUserActivatedSlots(Number(activatedSlots))
      setBuySlotCost(Number(getSlotCost))
      setMinAssetAmount(Number(getMinAssetAmount))
      setWithdrawStakedCost(getWithdrawStakedCost)
    } catch (error) {
      console.log((error as any).response.data.message, error)
    }
  }

  const notifySuccess = (message: string) =>
    setAlertModal({ show: true, type: "success", message });

  const notifyError = (message: string) =>
    setAlertModal({ show: true, type: "error", message });
  
  const notifyInfo = (message: string) =>
    setAlertModal({ show: true, type: "info", message });

  const getUserHouses = async () => {
    if (!address) return;
    try {
      const { data: houseData } = await axios.get("/house/find-by-user");
      let creditsSpent = 0;

      if (houseData.length > 0) {
        creditsSpent = houseData
          .map((house: House) => house.tokenHarvestLimit * 4)
          .reduce((a : number, b : number) => a + b, 0);
        setHouseItems(
          houseData.sort((houseA: House, houseB: House) => houseA.id - houseB.id) 
        );
      } else {
        setHouseItems([]);
      }
    } catch (error: any) {
      console.error(error.response?.data?.message, error); 
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
    signer,
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
    houseItems,
    setUserActivatedSlots,
    userActivatedSlots,
    houseSlots,
    buySlotCost,
    setUserResource,
    userResource,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

// Custom hook for using the GlobalContext
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
