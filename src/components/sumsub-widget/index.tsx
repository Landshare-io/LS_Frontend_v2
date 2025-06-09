import { useEffect } from 'react';
import axios from 'axios';
import { useAccount } from "wagmi";
import snsWebSdk from '@sumsub/websdk';
import { SUMSUB_VERIFY_URL } from '../../config/constants/environments';

export default function KYCWidget() {
  const { address } = useAccount();

  async function launchWebSdk() {
    console.log('Launching Sumsub Web SDK for address:', address);
    const { data } = await axios.post(`${SUMSUB_VERIFY_URL}/access-token`, {
      externalUserId: address,
    })

    let snsWebSdkInstance = snsWebSdk.init(
        data.token,
        () => (this as any).getNewAccessToken()
      )
      .withConf({
        lang: 'en',
      })
      .on('onError', (error) => {
        console.log('onError', error)
      })
      .onMessage(async (type: string, payload: any) => {
        try {
          console.log('onMessage', type, type.split('.')[1], payload)
          if (type.split('.')[1] === 'onStepCompleted' || type.split('.')[1] === 'stepCompleted') {
            console.log('Step completed for address:', address);
            await axios.post(`${SUMSUB_VERIFY_URL}/verdict`, { address });
          } else if (type.split('.')[1] === 'onApplicantStatusChanged' || payload?.reviewStatus === 'completed') {
            console.log('Step failed for address:', address);
            await axios.post(`${SUMSUB_VERIFY_URL}/verdict`, { address, stepFailed: true });
          }
        } catch (e) {
          console.log('Error in onMessage handler:', e);
        }
      })
      .build();
  
    snsWebSdkInstance.launch('#sumsub-container')
  }

  useEffect(() => {
    launchWebSdk();
  }, []);

  return <div id="sumsub-container" />;
}
