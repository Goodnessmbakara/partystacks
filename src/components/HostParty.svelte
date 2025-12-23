<script lang="ts">
  import { isConnected } from '../lib/wallet';
  import { showSuccess, showError, showSplash } from '../lib/toastStore';
  import { parties } from '../lib/partyStore';
  import type { Party } from '../lib/types';
  
  let stxAmount = 10;
  let numPeople = 5;
  let isCreating = false;
  let connected = false;
  
  isConnected.subscribe(value => connected = value);
  
  async function handleHostParty() {
    if (!connected) {
      showError('Please connect your wallet first!');
      return;
    }
    
    if (stxAmount <= 0) {
      showError('STX amount must be greater than 0');
      return;
    }
    
    if (numPeople < 2) {
      showError('Number of people must be at least 2');
      return;
    }
    
    try {
      isCreating = true;
      
      // TODO: Replace with actual contract call
      await simulateCreateParty();
      
      showSuccess('Party created! Share with friends! 🎉');
      
      // Reset form
      stxAmount = 10;
      numPeople = 5;
      
    } catch (error) {
      console.error('Error creating party:', error);
      showError('Failed to create party. Please try again.');
    } finally {
      isCreating = false;
    }
  }
  
  // Simulate contract call (will be replaced with real implementation)
  async function simulateCreateParty(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newParty: Party = {
          id: Date.now(),
          host: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
          stxAmount,
          maxParticipants: numPeople,
          currentParticipants: 1,
          participants: ['SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7'],
          isActive: true,
          isFull: false,
        };
        
        parties.update(p => [newParty, ...p]);
        resolve();
      }, 1500);
    });
  }
</script>

<section class="host-party glass-card">
  <h2 class="section-title gradient-text">🎉 Host a Party</h2>
  <p class="section-subtitle text-secondary">Create a Rain Party and invite your friends!</p>
  
  <form on:submit|preventDefault={handleHostParty} class="party-form">
    <div class="form-group">
      <label for="stx-amount" class="form-label">
        STX Amount
        <span class="text-muted">(Total pool)</span>
      </label>
      <div class="input-wrapper">
        <input
          id="stx-amount"
          type="number"
          min="1"
          step="1"
          bind:value={stxAmount}
          class="input"
          placeholder="10"
          disabled={isCreating}
        />
        <span class="input-suffix">STX</span>
      </div>
    </div>
    
    <div class="form-group">
      <label for="num-people" class="form-label">
        Number of People
        <span class="text-muted">(Max participants)</span>
      </label>
      <div class="input-wrapper">
        <input
          id="num-people"
          type="number"
          min="2"
          max="100"
          step="1"
          bind:value={numPeople}
          class="input"
          placeholder="5"
          disabled={isCreating}
        />
        <span class="input-suffix">People</span>
      </div>
    </div>
    
    <div class="pool-preview">
      <span class="text-secondary">Each participant receives:</span>
      <span class="pool-amount gradient-text">
        {(stxAmount / numPeople).toFixed(2)} STX
      </span>
    </div>
    
    <button
      type="submit"
      class="btn btn-primary submit-btn"
      disabled={!connected || isCreating}
    >
      {#if isCreating}
        <span class="spinner"></span>
        <span>Creating Party...</span>
      {:else if !connected}
        <span>Connect Wallet First</span>
      {:else}
        <span>🚀 Host Party</span>
      {/if}
    </button>
  </form>
</section>

<style>
  .host-party {
    margin-bottom: var(--spacing-lg);
  }
  
  .section-title {
    font-size: 2rem;
    margin-bottom: var(--spacing-xs);
  }
  
  .section-subtitle {
    margin-bottom: var(--spacing-md);
    font-size: 1.1rem;
  }
  
  .party-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .form-label {
    font-weight: 600;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .input-suffix {
    position: absolute;
    right: 1.25rem;
    color: var(--text-muted);
    font-weight: 600;
    pointer-events: none;
  }
  
  .pool-preview {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm);
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--glass-border);
  }
  
  .pool-amount {
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .submit-btn {
    margin-top: var(--spacing-sm);
    padding: 1rem 2rem;
    font-size: 1.1rem;
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
  
  @media (max-width: 640px) {
    .section-title {
      font-size: 1.5rem;
    }
    
    .pool-amount {
      font-size: 1.25rem;
    }
  }
</style>
