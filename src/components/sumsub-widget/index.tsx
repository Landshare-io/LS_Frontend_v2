import { useEffect } from 'react';
import axios from 'axios';
import { useAccount } from "wagmi";
import snsWebSdk from '@sumsub/websdk';
import { SUMSUB_VERIFY_URL } from '../../config/constants/environments';

export default function KYCWidget() {
  const { address } = useAccount();

  async function getNewAccessToken() {
    const { data } = await axios.post(`${SUMSUB_VERIFY_URL}/access-token`, {
      externalUserId: address,
    });
    return data.token;
  }

  async function launchWebSdk() {
    console.log('Launching Sumsub Web SDK for address:', address);

    const tokenResponse = await getNewAccessToken();

    const snsWebSdkInstance = snsWebSdk
      .init(tokenResponse, getNewAccessToken)
      .withConf({
        lang: 'en',
      })
      .on('error', (error: any) => {
        console.error('Sumsub SDK error:', error);
      })
      .onMessage(async (type: string, payload: any) => {
        try {
          const eventType = type.split('.')[1];
          console.log('onMessage', type, eventType, payload);

          if (eventType === 'onStepCompleted' || eventType === 'stepCompleted') {
            await axios.post(`${SUMSUB_VERIFY_URL}/verdict`, { address });
          } else if (
            eventType === 'onApplicantStatusChanged' ||
            payload?.reviewStatus === 'completed'
          ) {
            await axios.post(`${SUMSUB_VERIFY_URL}/verdict`, { address, stepFailed: true });
          }
        } catch (e) {
          console.error('Error in onMessage handler:', e);
        }
      })
      .build();

    snsWebSdkInstance.launch('#sumsub-container');
  }

  useEffect(() => {
    if (address) launchWebSdk();
  }, [address]);

  return <div id="sumsub-container" />;
}
