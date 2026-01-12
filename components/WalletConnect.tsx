'use client';

import { useEffect } from 'react';
import { useConnectModal, useAccountModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

interface WalletConnectProps {
  apiEndpoint?: string;
}

export default function WalletConnect({ apiEndpoint = '/api/link-wallet' }: WalletConnectProps) {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  useEffect(() => {
    const linkWallet = async () => {
      if (isConnected && address) {
        try {
          await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ walletAddress: address }),
          });
        } catch (error) {
          console.error('Failed to link wallet:', error);
        }
      }
    };

    linkWallet();
  }, [address, isConnected, apiEndpoint]);

  const displayAddress = (addr?: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <button
      type="button"
      onClick={() => (isConnected ? openAccountModal?.() : openConnectModal?.())}
      className="group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel backdrop-blur-md border border-accent/20 text-accent text-sm font-medium overflow-hidden transition-all hover:bg-accent/10 hover:border-accent/40 hover:shadow-[0_8px_30px_rgba(80,200,255,0.25)] hover:scale-[1.02]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent/20 to-transparent" />
      <span className="relative z-10">
        {isConnected ? `Wallet: ${displayAddress(address)}` : 'Connect Wallet'}
      </span>
    </button>
  );
}
