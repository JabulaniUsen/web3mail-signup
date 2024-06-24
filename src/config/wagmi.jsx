import React from 'react';
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const WagmiConfigComponent = () => {
  return (
    <div>
      {/* The rest of your JSX code here */}
    </div>
  );
};

export default WagmiConfigComponent;
