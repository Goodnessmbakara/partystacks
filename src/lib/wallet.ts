import { writable, derived } from 'svelte/store';
import { WalletConnect } from '@stacks/connect';
import { createAppKit } from '@reown/appkit';

// Reown Project ID (Required for AppKit)
const projectId = import.meta.env.VITE_PROJECT_ID || '1c742dab69ae8a9bc34e6c9c59f3ffdc';

// Wallet state stores
export const walletAddress = writable<string>('');
export const isConnected = writable<boolean>(false);
export const status = writable<string>('disconnected');
export const userData = writable<any>(null);

// Initialize AppKit
let modal: any = null;

// Initialize wallet and AppKit
export async function initializeWallet() {
  // Flatten networks from WalletConnect.Default for AppKit compatibility
  const networks = WalletConnect.Default.networks.flatMap(n => 
    n.chains.map(c => ({
      ...c,
      chainNamespace: n.namespace
    }))
  );

  // Initialize AppKit with flattened networks
  modal = createAppKit({
    ...WalletConnect.Default,
    networks: networks as [any, ...any[]],
    projectId,
    metadata: {
      name: 'Party Stacks',
      description: 'Collaborative Rain Parties on Stacks',
      url: window.location.origin,
      icons: [window.location.origin + '/logo.png']
    },
    features: {
      analytics: false,
      email: false,
      socials: []
    },
    themeMode: 'dark',
    themeVariables: {
      '--w3m-z-index': 9999
    }
  });

  // Subscribe to AppKit account changes to update stores
  modal.subscribeAccount((account: any) => {
    walletAddress.set(account.address || '');
    isConnected.set(account.isConnected);
    status.set(account.status);
    
    if (account.isConnected) {
      userData.set({
        address: account.address,
        profile: {
          stxAddress: {
            mainnet: account.address,
            testnet: account.address
          }
        }
      });
    } else {
      userData.set(null);
    }
  });

  return modal;
}

// Connect wallet using Reown AppKit
export async function connectWallet() {
  if (!modal) await initializeWallet();
  await modal.open();
}

// Disconnect wallet
export async function disconnectWallet() {
  if (modal) {
    await modal.disconnect();
    walletAddress.set('');
    isConnected.set(false);
    userData.set(null);
  }
}

// Get current wallet address
export function getAddress(): string {
  let address = '';
  walletAddress.subscribe(value => address = value)();
  return address;
}

// Get current user data
export function getUserData(): any {
  let data = null;
  userData.subscribe(value => data = value)();
  return data;
}

// Shorten address for display
export function shortenAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Check if wallet is connected
export function isWalletConnected(): boolean {
  let connected = false;
  isConnected.subscribe(value => connected = value)();
  return connected;
}
