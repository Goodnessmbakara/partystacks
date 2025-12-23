<script lang="ts">
  import { isConnected, walletAddress } from '../lib/wallet';
  import { showSuccess, showError, showSplash } from '../lib/toastStore';
  import { parties } from '../lib/partyStore';
  import type { Party } from '../lib/types';
  
  export let party: Party;
  
  let isJoining = false;
  let isClaiming = false;
  let connected = false;
  let currentAddress = '';
  
  isConnected.subscribe(value => connected = value);
  walletAddress.subscribe(value => currentAddress = value);
  
  $: isParticipant = party.participants.includes(currentAddress);
  $: canJoin = !party.isFull && !isParticipant && connected;
  $: canClaim = party.isFull && isParticipant;
  $: progressPercentage = (party.currentParticipants / party.maxParticipants) * 100;
  $: remaining = party.maxParticipants - party.currentParticipants;
  
  async function handleJoin() {
    if (!connected) {
      showError('Please connect your wallet first!');
      return;
    }
    
    if (isParticipant) {
      showError('You are already in this party!');
      return;
    }
    
    try {
      isJoining = true;
      
      // TODO: Replace with actual contract call
      await simulateJoinParty();
      
      if (party.currentParticipants + 1 >= party.maxParticipants) {
        showSuccess('Party is full! You can now claim your rain! 💦');
      } else {
        const remaining = party.maxParticipants - (party.currentParticipants + 1);
        showSplash(`You are in the splash zone! Waiting for ${remaining} more ${remaining === 1 ? 'builder' : 'builders'}...`);
      }
      
    } catch (error) {
      console.error('Error joining party:', error);
      showError('Failed to join party. Please try again.');
    } finally {
      isJoining = false;
    }
  }
  
  async function handleClaim() {
    try {
      isClaiming = true;
      
      // TODO: Replace with actual contract call
      await simulateClaimRain();
      
      const amount = (party.stxAmount / party.maxParticipants).toFixed(2);
      showSuccess(`You claimed ${amount} STX! 💰`);
      
    } catch (error) {
      console.error('Error claiming rain:', error);
      showError('Failed to claim. Please try again.');
    } finally {
      isClaiming = false;
    }
  }
  
  // Simulate contract calls (will be replaced with real implementation)
  async function simulateJoinParty(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        parties.update(allParties => {
          return allParties.map(p => {
            if (p.id === party.id) {
              const newParticipants = [...p.participants, currentAddress];
              const newCount = p.currentParticipants + 1;
              return {
                ...p,
                currentParticipants: newCount,
                participants: newParticipants,
                isFull: newCount >= p.maxParticipants,
              };
            }
            return p;
          });
        });
        resolve();
      }, 1500);
    });
  }
  
  async function simulateClaimRain(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  }
  
  function shortenAddress(addr: string): string {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }
</script>

<div class="party-card glass-card">
  <div class="party-header">
    <div class="party-badge">Party #{party.id}</div>
    <div class="party-amount gradient-text">{party.stxAmount} STX</div>
  </div>
  
  <div class="party-info">
    <div class="info-row">
      <span class="text-secondary">Host:</span>
      <span class="font-mono">{shortenAddress(party.host)}</span>
    </div>
    <div class="info-row">
      <span class="text-secondary">Reward per person:</span>
      <span class="reward">{(party.stxAmount / party.maxParticipants).toFixed(2)} STX</span>
    </div>
  </div>
  
  <div class="progress-section">
    <div class="progress-label">
      <span class="text-secondary">Participants</span>
      <span class="progress-count">
        <span class="current">{party.currentParticipants}</span>
        <span class="separator">/</span>
        <span class="max">{party.maxParticipants}</span>
      </span>
    </div>
    
    <div class="progress-container">
      <div
        class="progress-bar"
        style="width: {progressPercentage}%"
      ></div>
    </div>
    
    {#if !party.isFull}
      <div class="progress-status text-muted">
        {remaining} {remaining === 1 ? 'spot' : 'spots'} remaining
      </div>
    {:else}
      <div class="progress-status" style="color: var(--accent-orange);">
        🎊 Party is full!
      </div>
    {/if}
  </div>
  
  <div class="party-actions">
    {#if canJoin}
      <button
        class="btn btn-primary action-btn"
        on:click={handleJoin}
        disabled={isJoining}
      >
        {#if isJoining}
          <span class="spinner"></span>
          <span>Joining...</span>
        {:else}
          <span>💦 Join Party</span>
        {/if}
      </button>
    {:else if canClaim}
      <button
        class="btn btn-primary action-btn claim-btn"
        on:click={handleClaim}
        disabled={isClaiming}
      >
        {#if isClaiming}
          <span class="spinner"></span>
          <span>Claiming...</span>
        {:else}
          <span>💰 Claim My Rain</span>
        {/if}
      </button>
    {:else if isParticipant && !party.isFull}
      <div class="status-message">
        <span class="pulse">⏳</span>
        <span>Waiting for {remaining} more...</span>
      </div>
    {:else if !connected}
      <button class="btn btn-secondary action-btn" disabled>
        Connect wallet to join
      </button>
    {:else}
      <button class="btn btn-secondary action-btn" disabled>
        Party full
      </button>
    {/if}
  </div>
</div>

<style>
  .party-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .party-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .party-badge {
    padding: 0.5rem 1rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .party-amount {
    font-size: 1.75rem;
    font-weight: 700;
  }
  
  .party-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.95rem;
  }
  
  .reward {
    font-weight: 600;
    color: var(--accent-orange);
  }
  
  .progress-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .progress-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
  }
  
  .progress-count {
    font-weight: 600;
  }
  
  .current {
    color: var(--accent-orange);
    font-size: 1.1rem;
  }
  
  .separator {
    color: var(--text-muted);
    margin: 0 0.25rem;
  }
  
  .max {
    color: var(--text-secondary);
  }
  
  .progress-status {
    font-size: 0.875rem;
    text-align: center;
  }
  
  .party-actions {
    margin-top: var(--spacing-xs);
  }
  
  .action-btn {
    width: 100%;
    padding: 1rem;
    font-size: 1.05rem;
  }
  
  .claim-btn {
    background: linear-gradient(135deg, #10b981 0%, var(--accent-orange) 100%);
    animation: pulse 2s ease-in-out infinite;
  }
  
  .status-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    font-weight: 500;
  }
  
  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.9;
      transform: scale(1.02);
    }
  }
  
  @media (max-width: 640px) {
    .party-amount {
      font-size: 1.5rem;
    }
  }
</style>
