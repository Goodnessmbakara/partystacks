<script lang="ts">
  import { walletAddress, isConnected, connectWallet, disconnectWallet, shortenAddress } from '../lib/wallet';
  
  let connected = false;
  let address = '';
  
  isConnected.subscribe(value => connected = value);
  walletAddress.subscribe(value => address = value);
  
  function handleConnect() {
    connectWallet();
  }
  
  function handleDisconnect() {
    disconnectWallet();
  }
</script>

<div class="connect-wallet">
  {#if !connected}
    <button class="btn btn-primary connect-btn" on:click={handleConnect}>
      <img 
        src="https://avatars.githubusercontent.com/u/37784886" 
        alt="WalletConnect" 
        class="walletconnect-logo"
      />
      <span>Connect Wallet</span>
    </button>
  {:else}
    <div class="wallet-info glass">
      <div class="wallet-address font-mono">{shortenAddress(address)}</div>
      <button class="btn-disconnect" on:click={handleDisconnect} title="Disconnect">
        ⏏
      </button>
    </div>
  {/if}
</div>

<style>
  .connect-wallet {
    display: flex;
    align-items: center;
  }
  
  .connect-btn {
    font-size: 1rem;
    padding: 0.875rem 1.75rem;
    box-shadow: 0 4px 20px rgba(255, 140, 0, 0.4);
  }
  
  .connect-btn:hover {
    box-shadow: 0 6px 30px rgba(255, 140, 0, 0.6);
  }
  
  .walletconnect-logo {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  
  .wallet-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-full);
  }
  
  .wallet-address {
    font-size: 0.95rem;
    color: var(--text-primary);
    letter-spacing: 0.5px;
  }
  
  .btn-disconnect {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn-disconnect:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
  
  @media (max-width: 640px) {
    .connect-btn {
      font-size: 0.9rem;
      padding: 0.75rem 1.25rem;
    }
    
    .walletconnect-logo {
      width: 20px;
      height: 20px;
    }
  }
</style>
