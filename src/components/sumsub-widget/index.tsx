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
    if (!address) return;

    console.log('Launching Sumsub Web SDK for address:', address);
    const token = await getNewAccessToken();

    const sdk = snsWebSdk.init(token, getNewAccessToken);

    // @ts-expect-error - Sumsub SDK does not expose 'onError' in typings
    sdk.on('onError', (error: any) => {
      console.error('Sumsub SDK error:', error);
    });

    sdk
      .withConf({ lang: 'en' })
      .onMessage(async (type: string, payload: any) => {
        const event = type.split('.')[1];
        console.log('onMessage', type, event, payload);

        if (event === 'onStepCompleted' || event === 'stepCompleted') {
          await axios.post(`${SUMSUB_VERIFY_URL}/verdict`, { address });
        } else if (event === 'onApplicantStatusChanged' || payload?.reviewStatus === 'completed') {
          await axios.post(`${SUMSUB_VERIFY_URL}/verdict`, { address, stepFailed: true });
        }
      })
      .build()
      .launch('#sumsub-container');
  }

  useEffect(() => {
    launchWebSdk();
  }, [address]);

  return <div id="sumsub-container" />;
}
