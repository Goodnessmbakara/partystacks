import { writable, derived } from 'svelte/store';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

// Wallet state stores
export const userSession = writable<UserSession | null>(null);
export const walletAddress = writable<string>('');
export const isConnected = derived(walletAddress, ($addr) => $addr.length > 0);

// App configuration
const appConfig = new AppConfig(['store_write', 'publish_data']);

// Initialize user session
export function initializeWallet() {
  const session = new UserSession({ appConfig });
  userSession.set(session);
  
  // Check if user is already signed in
  if (session.isUserSignedIn()) {
    const userData = session.loadUserData();
    const address = userData.profile.stxAddress.testnet;
    walletAddress.set(address);
  }
  
  return session;
}

// Connect wallet with WalletConnect
export function connectWallet() {
  showConnect({
    appDetails: {
      name: 'Party Stacks',
      icon: window.location.origin + '/party-icon.png',
    },
    redirectTo: '/',
    onFinish: () => {
      const session = new UserSession({ appConfig });
      userSession.set(session);
      
      if (session.isUserSignedIn()) {
        const userData = session.loadUserData();
        const address = userData.profile.stxAddress.testnet;
        walletAddress.set(address);
      }
    },
    userSession: new UserSession({ appConfig }),
  });
}

// Disconnect wallet
export function disconnectWallet() {
  let session: UserSession | null = null;
  userSession.subscribe(value => session = value)();
  
  if (session) {
    session.signUserOut();
    walletAddress.set('');
  }
}

// Get current wallet address
export function getAddress(): string {
  let address = '';
  walletAddress.subscribe(value => address = value)();
  return address;
}

// Shorten address for display
export function shortenAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
