<script lang="ts">
  import { onMount } from 'svelte';
  import ConnectWallet from './components/ConnectWallet.svelte';
  import HostParty from './components/HostParty.svelte';
  import ActiveParties from './components/ActiveParties.svelte';
  import MyParties from './components/MyParties.svelte';
  import Toast from './components/Toast.svelte';
  import { initializeWallet } from './lib/wallet';
  
  type View = 'host' | 'active' | 'myParties';
  let currentView: View = 'host';
  
  onMount(async () => {
    //  Initialize wallet on app load and handle any pending sign-in
    await initializeWallet();
  });
</script>

<div class="app">
  <header class="header glass">
    <div class="container header-content">
      <div class="logo-section">
        <h1 class="app-title">
          <span class="gradient-text">Party Stacks</span>
        </h1>
        <p class="tagline text-secondary">Collaborative Rain on Stacks</p>
      </div>
      
      <ConnectWallet />
    </div>
  </header>
  
  <main class="main">
    <div class="container">
      <nav class="view-nav">
        <button 
          class="nav-btn"
          class:active={currentView === 'host'}
          on:click={() => currentView = 'host'}
        >
          🎉 Host Party
        </button>
        <button 
          class="nav-btn"
          class:active={currentView === 'active'}
          on:click={() => currentView = 'active'}
        >
          🔥 Active Parties
        </button>
        <button 
          class="nav-btn"
          class:active={currentView === 'myParties'}
          on:click={() => currentView = 'myParties'}
        >
          💰 My Parties
        </button>
      </nav>
      
      {#if currentView === 'host'}
        <HostParty />
      {:else if currentView === 'active'}
        <ActiveParties />
      {:else}
        <MyParties />
      {/if}
    </div>
  </main>
  
  <footer class="footer">
    <div class="container footer-content">
      <p class="text-muted">
        Built by <a href="https://twitter.com/goodnesmbakara" target="_blank" rel="noopener noreferrer" class="footer-link">@goodnesmbakara</a>
      </p>
      <div class="footer-links">
        <a 
          href="https://github.com/Goodnessmbakara/partystacks" 
          target="_blank" 
          rel="noopener noreferrer"
          class="footer-link"
        >
          GitHub
        </a>
        <span class="separator">•</span>
        <a 
          href="https://stacks.co" 
          target="_blank" 
          rel="noopener noreferrer"
          class="footer-link"
        >
          Stacks.co
        </a>
      </div>
    </div>
  </footer>
  
  <Toast />
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid var(--glass-border);
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-md);
  }
  
  .logo-section {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .app-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 2rem;
    margin: 0;
  }
  
  
  .tagline {
    font-size: 0.9rem;
    margin: 0;
    margin-left: 2.5rem;
  }
  
  .main {
    flex: 1;
    padding: var(--spacing-xl) 0;
  }
  
  .view-nav {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-xs);
    background: var(--glass-bg);
    border-radius: var(--radius-lg);
    border: 1px solid var(--glass-border);
  }
  
  .nav-btn {
    flex: 1;
    padding: var(--spacing-sm) var(--spacing-md);
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .nav-btn:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.05);
  }
  
  .nav-btn.active {
    background: linear-gradient(135deg, var(--accent-orange), var(--accent-purple));
    color: white;
  }
  
  .footer {
    border-top: 1px solid var(--glass-border);
    padding: var(--spacing-lg) 0;
    margin-top: var(--spacing-xl);
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .footer-links {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
  
  .footer-link {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  .footer-link:hover {
    color: var(--accent-orange);
  }
  
  .separator {
    color: var(--text-muted);
  }
  
  @media (max-width: 768px) {
    .app-title {
      font-size: 1.5rem;
    }
    
    
    .tagline {
      font-size: 0.8rem;
    }
    
    .header-content {
      flex-direction: column;
      gap: var(--spacing-sm);
      align-items: flex-start;
    }
    
    .footer-content {
      flex-direction: column;
      gap: var(--spacing-sm);
      text-align: center;
    }
  }
</style>
