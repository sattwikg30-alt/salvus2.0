import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygonAmoy } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'Salvus',
  projectId: '30a7d8617d62d0f7842321c81e2ecb37', 
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(),
  },
});
