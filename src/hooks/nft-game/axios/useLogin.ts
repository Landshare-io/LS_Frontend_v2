import { useState, useEffect } from "react";
import axios from "axios";
import { useSignMessage } from "wagmi";
import { Address } from "viem";
import { useGlobalContext } from "../../../context/GlobalContext";
import { NFT_GAME_BACKEND_URL } from "../../../config/constants/environments";

export default function useLogin(address: Address | undefined) {
  const { notifyError, notifySuccess, setIsAuthenticated } = useGlobalContext()
  const [isLoading, setIsLoading] = useState(false)
  const [signNonce, setSignNonce] = useState(0)
  const [showNotify, setShowNotify] = useState(false)
  const { signMessage, data: signMessageData } = useSignMessage()

  useEffect(() => {
    (async () => {
      if (signMessageData) {
        const { data } = await axios.post(`${NFT_GAME_BACKEND_URL}/auth/login`, {
          "signature": signMessageData,
          "walletAddress": address,
          "nonce": signNonce
        });
      
        if (data.access_token) {
          localStorage.setItem('jwtToken-v2', data.access_token);
          setIsAuthenticated(true);
          setIsLoading(false);
          if (showNotify) return notifySuccess("Login successfully")
          return true
        }

        setIsLoading(false)
        setIsAuthenticated(false)
        if (showNotify) return notifyError("Login Error. Please try again later.")
        return false
      }
    })()
  }, [signMessageData])

  const loginToBackend = async (needNotify: boolean) => {
    try {
      setIsLoading(true)
      setShowNotify(needNotify)
      const { data: messageData } = await axios.post(`${NFT_GAME_BACKEND_URL}/auth/get-nonce`);
  
      setSignNonce(messageData.nonce)
      signMessage(messageData.sign_message)
    } catch (error) {
      setIsLoading(false)
      setIsAuthenticated(false)
      if (needNotify) return notifyError("Login Error. Please try again later.")
      return false
    }
  }

  const checkIsAuthenticated = async () => {
    try {
      if (localStorage.getItem("jwtToken-v2")) {
        const { data } = await axios.get(`${NFT_GAME_BACKEND_URL}/user/is-loggedin`)
        if (data.success) {
          setIsAuthenticated(true)
          return true
        }

        setIsAuthenticated(false)
        return false
      }
    } catch (error) {
      return false
    }
  }

  return {
    isLoading,
    loginToBackend,
    checkIsAuthenticated
  }
}
