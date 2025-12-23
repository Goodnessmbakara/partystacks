<script lang="ts">
  import { toasts, type Toast } from '../lib/toastStore';
  import { fly, fade } from 'svelte/transition';
  
  let toastList: Toast[] = [];
  
  toasts.subscribe(value => {
    toastList = value;
  });
  
  function getIcon(type: Toast['type']): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'splash': return '💦';
      default: return 'ℹ️';
    }
  }
  
  function getClass(type: Toast['type']): string {
    switch (type) {
      case 'success': return 'toast-success';
      case 'error': return 'toast-error';
      case 'splash': return 'toast-splash';
      default: return 'toast-info';
    }
  }
</script>

<div class="toast-container">
  {#each toastList as toast (toast.id)}
    <div
      class="toast glass {getClass(toast.type)}"
      in:fly={{ x: 300, duration: 400 }}
      out:fade={{ duration: 200 }}
    >
      <span class="toast-icon">{getIcon(toast.type)}</span>
      <span class="toast-message">{toast.message}</span>
      <button
        class="toast-close"
        on:click={() => toasts.remove(toast.id)}
      >
        ×
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 400px;
  }
  
  .toast {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-radius: var(--radius-md);
    color: var(--text-primary);
    min-width: 300px;
    animation: slideIn 0.4s ease;
  }
  
  .toast-success {
    border-left: 4px solid #10b981;
  }
  
  .toast-error {
    border-left: 4px solid #ef4444;
  }
  
  .toast-info {
    border-left: 4px solid var(--accent-purple);
  }
  
  .toast-splash {
    border-left: 4px solid var(--accent-orange);
    background: linear-gradient(
      135deg,
      rgba(255, 140, 0, 0.1) 0%,
      rgba(155, 77, 255, 0.1) 100%
    );
  }
  
  .toast-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  
  .toast-message {
    flex: 1;
    font-size: 0.95rem;
    line-height: 1.4;
  }
  
  .toast-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
  
  .toast-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @media (max-width: 640px) {
    .toast-container {
      left: 1rem;
      right: 1rem;
    }
    
    .toast {
      min-width: auto;
    }
  }
</style>
