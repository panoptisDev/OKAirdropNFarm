import {  init } from '@web3-onboard/react';
import injectedModule, { ProviderLabel } from '@web3-onboard/injected-wallets';



const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
export const INFURA_URL = `https://mainnet.infura.io/v3/${INFURA_KEY}`;

const BLOCKNATIVE_API_KEY = process.env.REACT_APP_BLOCKNATIVE_API_KEY;




const injected = injectedModule({
  displayUnavailable: [ProviderLabel.MetaMask],
});
// const walletConnect = walletConnectModule({
//   projectId: '',
//   dappUrl: ''
// });


const wallets = [
  injected,
//   walletConnect,
];

const chains = [
 
  {
    id: '0x3e9',
    token: 'KAIA',
    label: 'Kaia Testnet Kairos',
    rpcUrl: `https://public-en.kairos.node.kaia.io`
  },
];

export const Web3Onboard = init({
  connect: {
    autoConnectAllPreviousWallet: true,
  },
  accountCenter: {
    desktop: {
      position: 'bottomRight',
      enabled: false,
      minimal: false,
    }
  },
  notify: {
    enabled: false
  },
  apiKey: BLOCKNATIVE_API_KEY,
  wallets,
  chains,
  theme: 'dark',
});