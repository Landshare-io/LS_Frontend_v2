import axios from "axios";
import { config } from "../../wagmi";
import { useSignMessage } from 'wagmi'

interface MessageData {
    sign_message: string;
    nonce: string;
  }
  
interface LoginResponse {
access_token?: string;
}

export const loginToBackendWithoutNotify = async (
    singer: any, 
    account: string, 
    setIsLoginLoading: (isLoading: boolean) => void
  ): Promise<boolean> => {
    try {
      const { data: messageData } = await axios.post<MessageData>(`${process.env.NEXT_PUBLIC_NEW_BACKEND_BASE_URL}/auth/get-nonce`);
      const { signMessage } = useSignMessage()

      const signature = signMessage({message : messageData.sign_message});

      const { data } = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_NEW_BACKEND_BASE_URL}/auth/login`, {
        "signature": signature,
        "walletAddress": account,
        "nonce": messageData.nonce
      });
      
      if (data.access_token) {
        localStorage.setItem('jwtToken-v2', data.access_token);
        setIsLoginLoading(false);
        return true;
      }
  
      setIsLoginLoading(false);
      return false;
    } catch (error: any) {
      console.log('login error', error.response?.data?.message || error.message);
      setIsLoginLoading(false);
      return false;
    }
  }