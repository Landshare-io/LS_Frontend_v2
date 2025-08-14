'use client';

import { useEffect, useState } from 'react';
import clsx from "clsx";
import HistoryCard from "./HistoryCard";
import { useRequests } from '@/hooks/lsrwa/useRequests';
import { connectWallet } from "@/utils/wallet";

import { useAccount } from 'wagmi';


export default function RequestHistory() {

  const { fetchRequests } = useRequests();
  const { address, isConnected } = useAccount();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!isConnected || !address) return;
    fetchRequest();
  }, [address, isConnected]);

  const fetchRequest = async () => {
    setLoading(true);

    const walletConnection = await connectWallet();
    if (walletConnection) {
      const { signer } = walletConnection;
      const { data, total } = await fetchRequests(signer, 0, false, 1, 10, address, false);
      setRequests(data)
    }
    setLoading(false)
  }

  return (
    <div className={clsx('shadow-[1px_3px_4px_1px_rgba(0,0,0,0.12)] p-0 md:p-[24px] text-center h-full', isConnected ? 'rounded-[16px]' : 'rounded-[70px]')}>
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
