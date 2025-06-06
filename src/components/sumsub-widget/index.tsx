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
      .onMessage(async (type: string, payload) => {
        console.log('onMessage', type, payload)
        if (type === 'onApplicantVerified') {
          await axios.post(`${SUMSUB_VERIFY_URL}/verdict`, { address });
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
