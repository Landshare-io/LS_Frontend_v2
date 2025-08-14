'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';

export default function WalletConnectButton(style: any) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    isConnected,
  } = useAccount();

  const { connectors, isPending, connect } = useConnect()

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <>
      {isConnected ? (
        <></>
      ) : (
        <button
          onClick={() => connect({ connector: connectors[1] })}
          disabled={isPending}
          className={`flex gap-4 px-4 py-2 bg-green text-white rounded-[100px] ${style.class}`}
        >
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </>
  );
}
