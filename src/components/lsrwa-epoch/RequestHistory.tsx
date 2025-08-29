'use client';

import { useEffect, useState } from 'react';
import clsx from "clsx";
import HistoryCard from "./HistoryCard";
import { useAccount, useChainId } from 'wagmi';
import useGetRequest from '@/hooks/contract/LSRWAEpoch/useGetRequest';
import { Address } from 'viem';
import { formatUnits } from "ethers";

interface RequestHistoryProps {
  fetchHistoryData: boolean,
  setFetchHistoryData: any
}


export default function RequestHistory({ fetchHistoryData, setFetchHistoryData }: RequestHistoryProps) {

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


  useEffect(() => {
     fetchRequest()
  }, [fetchHistoryData])

  return (
    <div className={clsx('bg-third px-[20px] pr-[8px] py-[25px] xl:pl-[36px] xl:pr-[22px] xl:py-[31px] text-center xl:h-[606px] rounded-[20px] ', requests.length > 6 ? 'h-[606px]' : '')}>
      <p className='text-text-primary font-bold text-[20px] xl:text-[24px] lg:text-[24px] text-start mb-[15px] xl:mb-[11px]'>Previous Requests</p>
      <div className={`${requests.length > 6 ? 'h-[497px] overflow-y-scroll' : ''}`}>
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
    </div>
  );
}
