import { useState, useEffect } from "react";
import axios from "axios";
import backendAxios from "./nft-game-axios";
import { signMessage } from '@wagmi/core'
import { config } from "../../../wagmi";
import { Address } from "viem";
import { useGlobalContext } from "../../../context/GlobalContext";
import { NFT_GAME_BACKEND_URL } from "../../../config/constants/environments";

export default function useLogin() {
  const { notifyError, notifySuccess, setIsAuthenticated } = useGlobalContext()
  const [isLoading, setIsLoading] = useState(false)
  const [signNonce, setSignNonce] = useState(0)
  const [showNotify, setShowNotify] = useState(false)
  const [signatureData, setSignatureData] = useState<string>("")
  
  const [walletAddress, setWalletAddress] = useState<Address | string | undefined>()

  useEffect(() => {
    (async () => {
      if (signatureData) {
        const { data } = await axios.post(`${NFT_GAME_BACKEND_URL}/auth/login`, {
          "signature": signatureData,
          "walletAddress": walletAddress,
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
  }, [signatureData])

  const loginToBackend = async (needNotify: boolean, address: Address | string | undefined) => {
    try {
      setWalletAddress(address)
      setIsLoading(true)
      setShowNotify(needNotify)
      const { data: messageData } = await axios.post(`${NFT_GAME_BACKEND_URL}/auth/get-nonce`);
  
      setSignNonce(messageData.nonce)
      const signature = await signMessage(config, { message: messageData.sign_message });
      setSignatureData(signature);
    } catch (error) {
      setIsLoading(false)
      setIsAuthenticated(false)
      if (needNotify) return notifyError("Login Error. Please try again later.")
      return false
    }
  }

  const checkIsAuthenticated = async (address: Address | string | undefined) => {
    try {
      if (localStorage.getItem("jwtToken-v2")) {
        const { data } = await backendAxios.get('/user/is-loggedin')
        if (data.success) {
          setIsAuthenticated(true)
          return true
        } else {
          loginToBackend(false, address)
        }

        setIsAuthenticated(false)
        return false
      } else {
        loginToBackend(false, address)
      }
    } catch (error) {
      loginToBackend(false, address)
    }
  }

  return {
    isLoading,
    loginToBackend,
    checkIsAuthenticated
  }
}
