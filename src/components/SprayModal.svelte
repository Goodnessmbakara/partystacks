<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { walletAddress } from '../lib/wallet';
  import { toasts } from '../lib/toastStore';
  import { spraySTX } from '../lib/contract';
  
  export let partyId: number;
  export let lockedStx: number;
  export let sprayedStx: number;
  export let participantCount: number;
  
  const dispatch = createEventDispatcher();
  
  let sprayAmount: number = 0;
  let distributionMode: 'equal' | 'random' = 'equal';
  let spraying = false;
  
  $: remainingStx = lockedStx - sprayedStx;
  $: amountPerParticipant = participantCount > 0 ? sprayAmount / participantCount : 0;
  $: minRandomAmount = amountPerParticipant * 0.1;
  $: maxRandomAmount = amountPerParticipant * 3;
  $: isValid = sprayAmount > 0 && sprayAmount <= remainingStx && participantCount > 0;
  
  function handleClose() {
    dispatch('close');
  }
  
  async function handleSpray() {
    if (!$walletAddress || !isValid) return;
    
    spraying = true;
    try {
      await spraySTX(partyId, sprayAmount, distributionMode === 'random');
      
      toasts.add(
        `Spraying ${sprayAmount} STX to ${participantCount} participants...`,
        'success'
      );
      
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('Spray error:', error);
      toasts.add('Failed to spray STX', 'error');
    } finally {
      spraying = false;
    }
  }
  
  function setMaxAmount() {
    sprayAmount = remainingStx;
  }
</script>

<div class="modal-backdrop" on:click={handleClose}>
  <div class="modal-content glass" on:click|stopPropagation>
    <div class="modal-header">
      <h2 class="gradient-text">💦 Spray to Party #{partyId}</h2>
      <button class="close-btn" on:click={handleClose}>✕</button>
    </div>
    
    <div class="party-stats">
      <div class="stat">
        <span class="label text-secondary">Locked STX:</span>
        <span class="value">{lockedStx.toFixed(2)} STX</span>
      </div>
      <div class="stat">
        <span class="label text-secondary">Already sprayed:</span>
        <span class="value text-secondary">{sprayedStx.toFixed(2)} STX</span>
      </div>
      <div class="stat highlight">
        <span class="label">Remaining:</span>
        <span class="value accent-orange">{remainingStx.toFixed(2)} STX</span>
      </div>
      <div class="stat">
        <span class="label text-secondary">Participants:</span>
        <span class="value">{participantCount}</span>
      </div>
    </div>
    
    <div class="distribution-mode">
      <h3>Distribution Mode</h3>
      <div class="mode-options">
        <label class="mode-option" class:selected={distributionMode === 'equal'}>
          <input type="radio" bind:group={distributionMode} value="equal" />
          <div class="mode-info">
            <span class="mode-name">⚖️ Equal Sharing</span>
            <span class="mode-desc">Everyone gets same amount</span>
          </div>
        </label>
        
        <label class="mode-option" class:selected={distributionMode === 'random'}>
          <input type="radio" bind:group={distributionMode} value="random" />
          <div class="mode-info">
            <span class="mode-name">🎲 Random (Party Mode!)</span>
            <span class="mode-desc">Variable amounts - simulate real spray!</span>
          </div>
        </label>
      </div>
    </div>
    
    <div class="amount-input">
      <label for="spray-amount">Amount to Spray</label>
      <div class="input-wrapper">
        <input
          id="spray-amount"
          type="number"
          bind:value={sprayAmount}
          min="0"
          max={remainingStx}
          step="0.1"
          placeholder="Enter amount"
        />
        <span class="unit">STX</span>
        <button class="max-btn" on:click={setMaxAmount}>MAX</button>
      </div>
    </div>
    
    {#if sprayAmount > 0 && participantCount > 0}
      <div class="preview glass">
        <h4>Preview</h4>
        {#if distributionMode === 'equal'}
          <p class="preview-text">
            Each participant receives: 
            <span class="accent-orange">{amountPerParticipant.toFixed(4)} STX</span>
          </p>
        {:else}
          <p class="preview-text">
            Random distribution range: 
            <span class="accent-purple">{minRandomAmount.toFixed(4)}</span> - 
            <span class="accent-orange">{maxRandomAmount.toFixed(4)} STX</span>
          </p>
          <p class="preview-subtext text-muted">
            Creates excitement - who catches the most?<br/>
            Everyone guaranteed to get something!
          </p>
        {/if}
        <p class="remaining-text text-secondary">
          Remaining after spray: {(remainingStx - sprayAmount).toFixed(2)} STX
        </p>
      </div>
    {/if}
    
    <div class="modal-actions">
      <button class="btn-secondary" on:click={handleClose} disabled={spraying}>
        Cancel
      </button>
      <button 
        class="btn-primary"
        on:click={handleSpray}
        disabled={!isValid || spraying}
      >
        {spraying ? 'Spraying...' : `Spray Now 💦 ${sprayAmount || 0} STX`}
      </button>
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .modal-content {
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
    animation: slideUp 0.3s ease;
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.75rem;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-xs);
    line-height: 1;
    transition: color 0.2s ease;
  }
  
  .close-btn:hover {
    color: var(--text-primary);
  }
  
  .party-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
    padding: var(--spacing-md);
    background: rgba(255, 255, 255, 0.02);
    border-radius: var(--radius-md);
  }
  
  .stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .stat.highlight {
    grid-column: 1 / -1;
    padding: var(--spacing-sm);
    background: rgba(255, 140, 0, 0.05);
    border-radius: var(--radius-sm);
    border: 1px solid rgba(255, 140, 0, 0.1);
  }
  
  .stat .label {
    font-size: 0.875rem;
  }
  
  .stat .value {
    font-size: 1.125rem;
    font-weight: 600;
  }
  
  .distribution-mode {
    margin-bottom: var(--spacing-lg);
  }
  
  .distribution-mode h3 {
    font-size: 1rem;
    margin-bottom: var(--spacing-sm);
  }
  
  .mode-options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .mode-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    border: 2px solid var(--glass-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .mode-option:hover {
    border-color: var(--accent-orange);
    background: rgba(255, 140, 0, 0.05);
  }
  
  .mode-option.selected {
    border-color: var(--accent-orange);
    background: rgba(255, 140, 0, 0.1);
  }
  
  .mode-option input[type="radio"] {
    width: 20px;
    height: 20px;
  }
  
  .mode-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .mode-name {
    font-weight: 600;
    font-size: 1rem;
  }
  
  .mode-desc {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .amount-input {
    margin-bottom: var(--spacing-lg);
  }
  
  .amount-input label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-weight: 500;
  }
  
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .input-wrapper input {
    flex: 1;
    padding: var(--spacing-sm) var(--spacing-md);
    padding-right: 120px;
    font-size: 1.125rem;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid var(--glass-border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    transition: border-color 0.2s ease;
  }
  
  .input-wrapper input:focus {
    outline: none;
    border-color: var(--accent-orange);
  }
  
  .input-wrapper .unit {
    position: absolute;
    right: 80px;
    color: var(--text-secondary);
    font-weight: 500;
  }
  
  .max-btn {
    position: absolute;
    right: 8px;
    padding: 6px 12px;
    background: var(--accent-orange);
    border: none;
    border-radius: 6px;
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .max-btn:hover {
    transform: scale(1.05);
  }
  
  .preview {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    border-radius: var(--radius-md);
  }
  
  .preview h4 {
    margin: 0 0 var(--spacing-sm) 0;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-secondary);
  }
  
  .preview-text {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
  }
  
  .preview-subtext {
    margin: var(--spacing-xs) 0 0 0;
    font-size: 0.875rem;
    line-height: 1.4;
  }
  
  .remaining-text {
    margin: var(--spacing-sm) 0 0 0;
    font-size: 0.875rem;
  }
  
  .modal-actions {
    display: flex;
    gap: var(--spacing-sm);
  }
  
  .modal-actions button {
    flex: 1;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--glass-border);
    color: var(--text-primary);
  }
  
  .btn-secondary:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .btn-primary {
    background: linear-gradient(135deg, var(--accent-orange), var(--accent-purple));
    border: none;
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(255, 140, 0, 0.3);
  }
  
  .btn-primary:disabled,
  .btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    .modal-content {
      width: 95%;
      padding: var(--spacing-lg);
    }
    
    .party-stats {
      grid-template-columns: 1fr;
    }
    
    .stat.highlight {
      grid-column: 1;
    }
  }
</style>
