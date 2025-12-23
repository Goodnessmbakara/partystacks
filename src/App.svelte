<script lang="ts">
  import { onMount } from 'svelte';
  import ConnectWallet from './components/ConnectWallet.svelte';
  import HostParty from './components/HostParty.svelte';
  import ActiveParties from './components/ActiveParties.svelte';
  import Toast from './components/Toast.svelte';
  import { initializeWallet } from './lib/wallet';
  
  onMount(() => {
    // Initialize wallet on app load
    initializeWallet();
  });
</script>

<div class="app">
  <header class="header glass">
    <div class="container header-content">
      <div class="logo-section">
        <h1 class="app-title">
          <span class="party-emoji">🎉</span>
          <span class="gradient-text">Party Stacks</span>
        </h1>
        <p class="tagline text-secondary">Collaborative Rain on Stacks</p>
      </div>
      
      <ConnectWallet />
    </div>
  </header>
  
  <main class="main">
    <div class="container">
      <HostParty />
      <ActiveParties />
    </div>
  </main>
  
  <footer class="footer">
    <div class="container footer-content">
      <p class="text-muted">
        Built with ❤️ on the Stacks blockchain
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
  
  .party-emoji {
    font-size: 2rem;
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
    
    .party-emoji {
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
