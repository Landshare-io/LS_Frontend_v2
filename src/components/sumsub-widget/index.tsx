import { useEffect } from 'react';
import axios from 'axios';
import { useAccount, useChainId } from "wagmi";
import snsWebSdk from '@sumsub/websdk';
import { SUMSUB_VERIFY_URL } from '../../config/constants/environments';
import { useGlobalContext } from "../../context/GlobalContext";
import useIsWhitelisted from "../../hooks/contract/WhitelistContract/useIsWhitelisted";

const axiosInstance = axios.create();

export default function KYCWidget() {
  const { notifyError, notifySuccess } = useGlobalContext();
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: isWhitelisted, refetch } = useIsWhitelisted(chainId, address);

  async function getNewAccessToken() {
    try {
      const { data } = await axiosInstance.post(`${SUMSUB_VERIFY_URL}/access-token`, {
        externalUserId: address,
      });
      return data.token;
    } catch (error) {
      console.log('e', error)
    }
  }

  async function launchWebSdk() {
    if (!address) return;

    console.log('Launching Sumsub Web SDK for address:', address);
    const token = await getNewAccessToken();

    if (!token) return;

    const sdk = snsWebSdk.init(token, getNewAccessToken);

    // @ts-expect-error - Sumsub SDK does not expose 'onError' in typings
    sdk.on('onError', (error: any) => {
      console.error('Sumsub SDK error:', error);
    });

    sdk
      .withConf({ lang: 'en' })
      .onMessage(async (type: string, payload: any) => {
        const event = type.split('.')[1];

        try {
          if (isWhitelisted) {
            return;
          }

          // Process KYC completion events
          if (event === 'onStepCompleted' || event === 'stepCompleted' || 
              event === 'onApplicantStatusChanged' || payload?.reviewStatus === 'completed') {
            
            // Call verdict endpoint (now secured with Sumsub API verification)
            try {
              const response = await axiosInstance.post(`${SUMSUB_VERIFY_URL}/verdict`, { address });
              
              if (response.data.verified) {
                await refetch();
                notifySuccess('KYC completed successfully!');
              } else {
                notifyError(response.data.error || 'KYC verification failed.');
              }
            } catch (error: any) {
              console.error('Verdict error:', error);
              
              if (error.response?.status === 429) {
                notifyError('Too many requests. Please wait a moment and try again.');
              } else if (error.response?.status === 403) {
                notifyError(error.response?.data?.error || 'KYC not approved or you are not eligible.');
              } else {
                // Start polling as fallback
                let pollAttempts = 0;
                const maxPollAttempts = 10;
                
                const pollInterval = setInterval(async () => {
                  pollAttempts++;
                  const result = await refetch();
                  
                  if (result.data === true) {
                    clearInterval(pollInterval);
                    notifySuccess('KYC completed successfully!');
                  } else if (pollAttempts >= maxPollAttempts) {
                    clearInterval(pollInterval);
                    notifyError('KYC verification is processing. Please check back in a few minutes.');
                  }
                }, 6000);
              }
            }
          }
        } catch (error: any) {
          console.error('KYC widget error:', error);
          notifyError('Error checking KYC status. Please try again later.');
        }
      })
      .build()
      .launch('#sumsub-container');
  }

  useEffect(() => {
    if (address) {
      launchWebSdk();
    }
  }, [address]);

  return <div id="sumsub-container" />;
}
