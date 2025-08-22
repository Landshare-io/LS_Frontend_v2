'use client';

import { useEffect, useState } from 'react';
import clsx from "clsx";
import HistoryCard from "./HistoryCard";
import { useAccount, useChainId } from 'wagmi';
import useGetRequest from '@/hooks/contract/LSRWAEpoch/useGetRequest';
import { Address } from 'viem';
import { formatUnits } from "ethers";

export default function RequestHistory() {

  const { address, isConnected } = useAccount();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const chainId = useChainId()
  const { data: getReqeustData, refetch } = useGetRequest(chainId, 0, false, 1, 10, address, false, address as Address);

  useEffect(() => {
    fetchRequest()
  }, [getReqeustData])

  const fetchRequest = async () => {
    await refetch()
    if (getReqeustData) {
      const [data, ids, total]: any = getReqeustData;
      let requests = [];
      requests = data.map((item: any, index: number) => ({
        requestId: parseInt(ids[index]),
        user: item['user'],
        amount: formatUnits(item['amount'], 6),
        timestamp: parseInt(item['timestamp']),
        isWithdraw: item['isWithdraw'],
        processed: item['processed'],
        executed: item['executed']
      }));
      setRequests(requests)
    }
  }

  return (
    <div className={clsx('shadow-[1px_3px_4px_1px_rgba(0,0,0,0.12)] p-0 md:p-[24px] text-center h-full', isConnected ? 'rounded-[16px]' : 'rounded-[70px]')}>
      <p className='text-text-primary font-bold text-[24px] md:text-[24px] lg:text-[24px] text-start'>Previous Requests</p>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 && isConnected ? (
        <p>No active requests found.</p>
      ) :
        requests.map((history: any) => (
          <HistoryCard fetchRequests={fetchRequest} key={history.requestId} isWithdraw={history.isWithdraw} timestamp={history.timestamp} id={history.requestId} amount={history.amount} processed={history.processed} executed={history.executed} />
        ))
      }
    </div>
  );
}
