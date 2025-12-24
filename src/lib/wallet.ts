import { writable, derived } from 'svelte/store';
import { AppConfig, UserSession, WalletConnect } from '@stacks/connect';
import { createAppKit } from '@reown/appkit';

// Reown Project ID (Required for AppKit)
const projectId = import.meta.env.VITE_PROJECT_ID || 'dummy-project-id';

// Wallet state stores
export const userSession = writable<UserSession | null>(null);
export const walletAddress = writable<string>('');
export const isConnected = derived(walletAddress, ($addr) => $addr.length > 0);
export const userData = writable<any>(null);

// App configuration
const appConfig = new AppConfig(['store_write', 'publish_data']);
const session = new UserSession({ appConfig });

// Initialize AppKit
let modal: any = null;

// Initialize wallet and AppKit
export async function initializeWallet() {
  userSession.set(session);

  // Merge Stacks configuration with our project details
  const appKitConfig: any = {
    ...WalletConnect.Default,
    projectId,
    metadata: {
      name: 'Party Stacks',
      description: 'Collaborative Rain Parties on Stacks',
      url: window.location.origin,
      icons: [window.location.origin + '/logo.png']
    }
  };

  // Ensure projectId is passed to the nested walletConnect config if it exists
  if (appKitConfig.walletConnect) {
    appKitConfig.walletConnect = {
      ...appKitConfig.walletConnect,
      projectId
    };
  }

  // Initialize AppKit
  modal = createAppKit(appKitConfig);

  try {
    // Check if there's a pending sign-in
    if (session.isSignInPending()) {
      const data = await session.handlePendingSignIn();
      const address = data.profile.stxAddress?.testnet || data.profile.stxAddress?.mainnet || '';
      userData.set(data);
      walletAddress.set(address);
      return session;
    }
    
    // Check if user is already signed in
    if (session.isUserSignedIn()) {
      const data = session.loadUserData();
      const address = data.profile.stxAddress?.testnet || data.profile.stxAddress?.mainnet || '';
      userData.set(data);
      walletAddress.set(address);
    }
  } catch (error) {
    console.error('Error initializing wallet:', error);
  }
  
  return session;
}

// Connect wallet using Reown AppKit
export async function connectWallet() {
  if (!modal) await initializeWallet();
  await modal.open();
}

// Disconnect wallet
export async function disconnectWallet() {
  if (session) {
    session.signUserOut();
    walletAddress.set('');
    userData.set(null);
    if (modal) {
      await modal.disconnect();
    }
    window.location.reload();
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
  return session.isUserSignedIn();
}
