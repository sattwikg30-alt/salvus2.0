'use client';

import { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const linkWallet = async () => {
      if (isConnected && address) {
        try {
          await fetch('/api/link-wallet', {
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
  }, [address, isConnected]);

  return (
    <div className="wallet-connect-wrapper">
      <ConnectButton 
        showBalance={false}
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
      />
    </div>
  );
}
