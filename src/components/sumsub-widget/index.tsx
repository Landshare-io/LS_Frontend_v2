import { useEffect } from 'react';
import axios from 'axios';
import { useAccount, useChainId } from "wagmi";
import snsWebSdk from '@sumsub/websdk';
import { SUMSUB_VERIFY_URL } from '../../config/constants/environments';
import { useGlobalContext } from "../../context/GlobalContext";
import useIsWhitelisted from "../../hooks/contract/WhitelistContract/useIsWhitelisted";

const axiosInstance = axios.create();
const recentRequests = new Map<string, number>();
const TTL = 60 * 1000; // 1 minute

function getRequestKey(config: any) {
  const method = config.method.toUpperCase();
  const url = config.url;
  return `${method}:${url}`;
}

axiosInstance.interceptors.request.use(config => {
  const key = getRequestKey(config);
  const now = Date.now();

  if (recentRequests.has(key) && now - recentRequests.get(key)! < TTL) {
    console.warn(`Duplicate request blocked within 1 min: ${key}`);

    // 👇 Don't actually send the request — return a fake success response
    config.adapter = () => {
      return Promise.resolve({
        data: null,
        status: 204,
        statusText: 'Duplicate Skipped',
        headers: {},
        config,
      });
    };

    return config;
  }

  recentRequests.set(key, now);
  return config;
});

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

          let res;
          if (event === 'onStepCompleted' || event === 'stepCompleted') {
            res = await axiosInstance.post(`${SUMSUB_VERIFY_URL}/verdict`, { address });
            await refetch();
          } else if (event === 'onApplicantStatusChanged' || payload?.reviewStatus === 'completed') {
            res = await axiosInstance.post(`${SUMSUB_VERIFY_URL}/verdict`, { address, stepFailed: true });
            await refetch();
          }

          if (res) {
            await refetch();
            if (res.data.verdict == false) {
              notifyError('You are under 18 or located in a restricted region.');
            } else if (res.data?.message == true) {
              notifySuccess('KYC completed successfully!');
            }
          }
        } catch (error: any) {
          await refetch();
          if (error.status == 500) {
            notifySuccess('KYC completed successfully!');
          } else if (error.status == 400) {
            notifyError('Error updating KYC status. Please try again.');
          }
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
