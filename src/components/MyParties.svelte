<script lang="ts">
  import { onMount } from 'svelte';
  import { walletAddress } from '../lib/wallet';
  import { toasts } from '../lib/toastStore';
  import { claimBalance } from '../lib/contract';
  
  interface ParticipantBalance {
    partyId: number;
    host: string;
    unclaimedBalance: number;
    totalClaimed: number;
    isActive: boolean;
  }
  
  let joinedParties: ParticipantBalance[] = [];
  let showUnclaimedOnly = false;
  let loading = true;
  let claiming: number | null = null;
  
  $: filteredParties = showUnclaimedOnly
    ? joinedParties.filter(p => p.unclaimedBalance > 0)
    : joinedParties;
  
  onMount(async () => {
    await loadMyParties();
  });
  
  async function loadMyParties() {
    loading = true;
    try {
      // TODO: Fetch user's joined parties from contract
      // For now, using mock data
      joinedParties = [
        {
          partyId: 1,
          host: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR',
          unclaimedBalance: 3.5,
          totalClaimed: 12.8,
          isActive: true
        },
        {
          partyId: 2,
          host: 'SP3FBR2JRE5TWBGJD4G92FJ56EJTFRQ9C5HEJJ8PP',
          unclaimedBalance: 0,
          totalClaimed: 20.0,
          isActive: false
        }
      ];
    } catch (error) {
      console.error('Error loading parties:', error);
      toasts.add('Failed to load your parties', 'error');
    } finally {
      loading = false;
    }
  }
  
  async function handleClaim(partyId: number) {
    if (!$walletAddress) {
      toasts.add('Please connect your wallet', 'error');
      return;
    }
    
    claiming = partyId;
    try {
      await claimBalance(partyId, $walletAddress);
      toasts.add(`Claiming STX from Party #${partyId}...`, 'success');
      
      // Refresh after claim
      setTimeout(async () => {
        await loadMyParties();
        claiming = null;
      }, 3000);
    } catch (error) {
      console.error('Claim error:', error);
      toasts.add('Failed to claim balance', 'error');
      claiming = null;
    }
  }
  
  function shortenAddress(address: string): string {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  }
</script>

<section class="my-parties">
  <div class="header">
    <h2 class="gradient-text">💰 My Spray Parties</h2>
    <label class="filter-toggle">
      <input type="checkbox" bind:checked={showUnclaimedOnly} />
      <span>Has unclaimed balance</span>
    </label>
  </div>
  
  {#if loading}
    <div class="loading">Loading your parties...</div>
  {:else if filteredParties.length === 0}
    <div class="empty-state">
      <p>🎈 No parties {showUnclaimedOnly ? 'with unclaimed balance' : 'joined yet'}</p>
      <p class="text-muted">Join an active party to start earning STX!</p>
    </div>
  {:else}
    <div class="parties-grid">
      {#each filteredParties as party}
        <div class="party-card glass">
          <div class="party-header">
            <h3>Party #{party.partyId}</h3>
            <span class="status" class:active={party.isActive}>
              {party.isActive ? '● Active' : '○ Closed'}
            </span>
          </div>
          
          <div class="party-details">
            <div class="detail-row">
              <span class="label text-secondary">Host:</span>
              <span class="value">{shortenAddress(party.host)}</span>
            </div>
            
            <div class="detail-row highlight">
              <span class="label">Unclaimed:</span>
              <span class="value accent-orange">{party.unclaimedBalance.toFixed(2)} STX</span>
            </div>
            
            <div class="detail-row">
              <span class="label text-secondary">Total claimed:</span>
              <span class="value text-secondary">{party.totalClaimed.toFixed(2)} STX</span>
            </div>
          </div>
          
          {#if party.unclaimedBalance > 0}
            <button 
              class="claim-btn"
              on:click={() => handleClaim(party.partyId)}
              disabled={claiming === party.partyId}
            >
              {claiming === party.partyId ? 'Claiming...' : `Claim ${party.unclaimedBalance.toFixed(2)} STX`}
            </button>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</section>

<style>
  .my-parties {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-lg);
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
  
  .header h2 {
    margin: 0;
    font-size: 2rem;
  }
  
  .filter-toggle {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    user-select: none;
  }
  
  .filter-toggle input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  
  .filter-toggle span {
    color: var(--text-secondary);
    transition: color 0.2s ease;
  }
  
  .filter-toggle:hover span {
    color: var(--text-primary);
  }
  
  .loading,
  .empty-state {
    text-align: center;
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
  }
  
  .empty-state p:first-child {
    font-size: 1.2rem;
    margin-bottom: var(--spacing-sm);
  }
  
  .parties-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--spacing-md);
  }
  
  .party-card {
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    transition: transform 0.2s ease;
  }
  
  .party-card:hover {
    transform: translateY(-2px);
  }
  
  .party-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--glass-border);
  }
  
  .party-header h3 {
    margin: 0;
    font-size: 1.25rem;
  }
  
  .status {
    font-size: 0.875rem;
    padding: 4px 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
  }
  
  .status.active {
    color: var(--accent-orange);
  }
  
  .party-details {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }
  
  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-xs) 0;
  }
  
  .detail-row.highlight {
    padding: var(--spacing-sm);
    background: rgba(255, 140, 0, 0.05);
    border-radius: var(--radius-md);
    border: 1px solid rgba(255, 140, 0, 0.1);
  }
  
  .detail-row .label {
    font-size: 0.875rem;
  }
  
  .detail-row .value {
    font-weight: 600;
  }
  
  .claim-btn {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    background: linear-gradient(135deg, var(--accent-orange), var(--accent-purple));
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .claim-btn:hover:not(:disabled) {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(255, 140, 0, 0.3);
  }
  
  .claim-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    .parties-grid {
      grid-template-columns: 1fr;
    }
    
    .header h2 {
      font-size: 1.5rem;
    }
  }
</style>
