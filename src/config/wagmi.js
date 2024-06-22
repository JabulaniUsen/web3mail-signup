import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { walletConnect, injected, metaMask } from 'wagmi/connectors';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const projectId = 'bc19f516affc6bf7f6a1f4029500705e';

const metadata = {
  name: 'BUSD Portal',
  // description: 'Send BUSD to any address',
  // url: 'https://localhost:3000', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http()
  },
  connectors: [
    metaMask(),
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true })
  ]
});

export const wagmiConfig2 = getDefaultConfig({
  appName: 'Web3 Mail',
  projectId: 'YOUR_PROJECT_ID', // todo: replace with your project id
  chains: [mainnet, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
  connectors: [
    metaMask(),
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true })
  ]
});
