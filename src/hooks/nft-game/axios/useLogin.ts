import { useState, useEffect } from "react";
import axios from "axios";
import backendAxios from "./nft-game-axios";
import { useSignMessage } from "wagmi";
import { Address } from "viem";
import { useGlobalContext } from "../../../context/GlobalContext";
import { NFT_GAME_BACKEND_URL } from "../../../config/constants/environments";
import useGetUserData from "./useGetUserData";

let isLoadingState = true

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export default function useLogin() {
  const { notifyError, notifySuccess, setIsAuthenticated } = useGlobalContext()
  const [isLoading, setIsLoading] = useState(true)
  const [signNonce, setSignNonce] = useState(0)
  const [showNotify, setShowNotify] = useState(false)
  const { signMessage, data: signMessageData, isError: isSignError } = useSignMessage()
  const [walletAddress, setWalletAddress] = useState<Address | string | undefined>()
  const { getUserData } = useGetUserData()

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setIsLoading(isLoadingState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateIsLoading = (newLoading: any) => {
    isLoadingState = newLoading;
    notifySubscribers();
  };

  useEffect(() => {
    (async () => {
      if (isSignError) {
        updateIsLoading(false);
        setIsAuthenticated(false);
        return false;
      }

      if (signMessageData) {
        try {
          const { data } = await axios.post(`${NFT_GAME_BACKEND_URL}/auth/login`, {
            "signature": signMessageData,
            "walletAddress": walletAddress,
            "nonce": signNonce
          });
        
          if (data.access_token) {
            localStorage.setItem('jwtToken-v2', data.access_token);
            await getUserData();
            setIsAuthenticated(true);
            updateIsLoading(false);
            if (showNotify) return notifySuccess("Login successfully")
            return true
          }
  
          updateIsLoading(false)
          setIsAuthenticated(false)
          if (showNotify) return notifyError("Login Error. Please try again later.")
          return false
        } catch (error) {
          updateIsLoading(false)
          setIsAuthenticated(false)
          if (showNotify) return notifyError("Login Error. Please try again later.")
          return false
        }
      }
    })()
  }, [signMessageData, isSignError])

  const logout = (address: string) => {
    const jwtToken = localStorage.getItem('jwtToken-v2')
    if (jwtToken) {
      const payloadJwtToken = parseJwt(jwtToken)

      if (address != payloadJwtToken.walletAddress) {
        localStorage.removeItem('jwtToken-v2')
        setIsAuthenticated(false)
      }
    }
  }

  const loginToBackend = async (needNotify: boolean, address: Address | string | undefined) => {
    try {
      if (typeof address == 'undefined') {
        updateIsLoading(false);
        return false
      }
      updateIsLoading(true)
      setWalletAddress(address)
      setShowNotify(needNotify)
      const { data: messageData } = await axios.post(`${NFT_GAME_BACKEND_URL}/auth/get-nonce`);
  
      setSignNonce(messageData.nonce)
      signMessage({ message: messageData.sign_message})
    } catch (error) {
      updateIsLoading(false)
      setIsAuthenticated(false)
      if (needNotify) return notifyError("Login Error. Please try again later.")
      return false
    }
  }

  const checkIsAuthenticated = async (address: Address | string | undefined) => {
    try {
      if (typeof address == 'undefined') {
        updateIsLoading(false);
        return false
      }
      if (localStorage.getItem("jwtToken-v2")) {
        const { data } = await backendAxios.get('/user/is-loggedin')
        if (data.success) {
          await getUserData()
          setIsAuthenticated(true)
          updateIsLoading(false)
          return true
        } else {
          loginToBackend(false, address)
        }

        setIsAuthenticated(false)
        updateIsLoading(false)
        return false
      } else {
        loginToBackend(false, address)
      }
    } catch (error) {
      loginToBackend(false, address)
    }
  }

  return {
    logout,
    isLoading,
    loginToBackend,
    checkIsAuthenticated
  }
}
