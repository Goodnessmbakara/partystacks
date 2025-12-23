<script lang="ts">
  import PartyCard from './PartyCard.svelte';
  import { parties } from '../lib/partyStore';
  import type { Party } from '../lib/types';
  
  let partyList: Party[] = [];
  
  parties.subscribe(value => {
    partyList = value;
  });
</script>

<section class="active-parties">
  <h2 class="section-title gradient-text">🌊 Active Parties</h2>
  <p class="section-subtitle text-secondary">
    Join a party and wait for the rain!
  </p>
  
  {#if partyList.length === 0}
    <div class="empty-state glass-card">
      <div class="empty-icon">🎉</div>
      <h3>No active parties yet</h3>
      <p class="text-secondary">Be the first to host a rain party!</p>
    </div>
  {:else}
    <div class="parties-grid">
      {#each partyList as party (party.id)}
        <div class="fade-in">
          <PartyCard {party} />
        </div>
      {/each}
    </div>
  {/if}
</section>

<style>
  .active-parties {
    margin-top: var(--spacing-xl);
  }
  
  .section-title {
    font-size: 2rem;
    margin-bottom: var(--spacing-xs);
  }
  
  .section-subtitle {
    margin-bottom: var(--spacing-lg);
    font-size: 1.1rem;
  }
  
  .parties-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--spacing-md);
  }
  
  .empty-state {
    text-align: center;
    padding: var(--spacing-xl);
  }
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-sm);
  }
  
  .empty-state h3 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-xs);
  }
  
  @media (max-width: 768px) {
    .parties-grid {
      grid-template-columns: 1fr;
    }
    
    .section-title {
      font-size: 1.5rem;
    }
  }
</style>
