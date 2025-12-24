import { writable, derived } from 'svelte/store';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

// Wallet state stores
export const userSession = writable<UserSession | null>(null);
export const walletAddress = writable<string>('');
export const isConnected = derived(walletAddress, ($addr) => $addr.length > 0);
export const userData = writable<any>(null);

// App configuration - request store_write and publish_data permissions
const appConfig = new AppConfig(['store_write', 'publish_data']);

// Create a singleton user session
const session = new UserSession({ appConfig });

// Initialize wallet and check for existing/pending auth
export async function initializeWallet() {
  userSession.set(session);
  
  try {
    // Check if there's a pending sign-in (user just authenticated and was redirected back)
    if (session.isSignInPending()) {
      console.log('Processing pending sign-in...');
      const data = await session.handlePendingSignIn();
      console.log('Sign-in complete:', data);
      
      // Extract Stacks address (prefer testnet for development)
      const address = data.profile.stxAddress?.testnet || data.profile.stxAddress?.mainnet || '';
      
      userData.set(data);
      walletAddress.set(address);
      
      return session;
    }
    
    // Check if user is already signed in
    if (session.isUserSignedIn()) {
      console.log('User already signed in');
      const data = session.loadUserData();
      
      // Extract Stacks address
      const address = data.profile.stxAddress?.testnet || data.profile.stxAddress?.mainnet || '';
      
      userData.set(data);
      walletAddress.set(address);
    }
  } catch (error) {
    console.error('Error initializing wallet:', error);
  }
  
  return session;
}

// Connect wallet using Stacks Connect
export function connectWallet() {
  const appDetails = {
    name: 'Party Stacks',
    icon: window.location.origin + '/logo.png',
  };
  
  showConnect({
    appDetails,
    onFinish: () => {
      // Reload to trigger handlePendingSignIn in initializeWallet
      window.location.reload();
    },
    userSession: session,
  });
}

// Disconnect wallet
export function disconnectWallet() {
  if (session) {
    session.signUserOut();
    walletAddress.set('');
    userData.set(null);
    
    // Optionally reload to clear state
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
