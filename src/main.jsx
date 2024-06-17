import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
    mainnet,
} from 'wagmi/chains';


const config = getDefaultConfig({
    appName: 'Web3 Mail',
    projectId: 'YOUR_PROJECT_ID', // todo: replace with your project id
    chains: [mainnet],
    ssr: true, // If your dApp uses server side rendering (SSR)
});


const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
              <RainbowKitProvider>
              <App />
              </RainbowKitProvider>
          </QueryClientProvider>
      </WagmiProvider>
  </React.StrictMode>,
)
