<script lang="ts">
  interface Props {
    options?: Array<{ value: string; label: string; icon?: string }>;
    value: string;
    placeholder?: string;
    onChange?: (val: string) => void;
  }

  let {
    options = [],
    value = $bindable(),
    placeholder = '',
    onChange = () => {}
  }: Props = $props();

  let isOpen = $state(false);
  let dropdownRef: HTMLDivElement;
  let toggleRef: HTMLButtonElement;

  function handleSelect(val: string) {
    value = val;
    onChange(val);
    isOpen = false;
  }

  function handleToggle() {
    isOpen = !isOpen;
    if (isOpen) {
      updateDropdownPosition();
    }
  }

  function updateDropdownPosition() {
    if (toggleRef) {
      const rect = toggleRef.getBoundingClientRect();
      const dropdown = dropdownRef?.querySelector('.dropdown-list') as HTMLElement;
      if (dropdown) {
        dropdown.style.setProperty('--dropdown-width', `${rect.width}px`);
        dropdown.style.setProperty('--dropdown-left', `${rect.left}px`);
        dropdown.style.setProperty('--dropdown-top', `${rect.bottom + 8}px`);
      }
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      isOpen = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isOpen = false;
    }
  }

  function handleScroll() {
    if (isOpen) {
      updateDropdownPosition();
    }
  }

  function handleResize() {
    if (isOpen) {
      updateDropdownPosition();
    }
  }

  // Get selected option
  let selectedOption = $derived(options.find(opt => opt.value === value));
</script>

<svelte:window
  onclick={handleClickOutside}
  onkeydown={handleKeydown}
  onscroll={handleScroll}
  onresize={handleResize}
/>

<div class="custom-dropdown" bind:this={dropdownRef}>
  <button
    type="button"
    bind:this={toggleRef}
    class="dropdown-toggle"
    class:active={isOpen}
    onclick={handleToggle}
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-label={selectedOption ? selectedOption.label : placeholder}
    title={selectedOption ? selectedOption.label : placeholder}
  >
    <div class="dropdown-content">
      {#if selectedOption}
        {#if selectedOption.icon}
          <span class="dropdown-icon" aria-hidden="true">{@html selectedOption.icon}</span>
        {:else}
          <span class="dropdown-fallback" aria-hidden="true">{selectedOption.label.charAt(0).toUpperCase()}</span>
        {/if}
        <span class="dropdown-label visually-hidden">{selectedOption.label}</span>
      {:else}
        <span class="dropdown-placeholder" aria-hidden="true">?</span>
        <span class="visually-hidden">{placeholder}</span>
      {/if}
    </div>
    <div class="dropdown-arrow" class:rotated={isOpen} aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>
  </button>

  {#if isOpen}
    <div class="dropdown-list" role="listbox">
      {#each options as opt, index}
        <button
          type="button"
          class="dropdown-option"
          class:selected={opt.value === value}
          onclick={() => handleSelect(opt.value)}
          role="option"
          aria-selected={opt.value === value}
          aria-label={opt.label}
          title={opt.label}
        >
          <div class="option-content">
            {#if opt.icon}
              <span class="option-icon" aria-hidden="true">{@html opt.icon}</span>
            {:else}
              <span class="option-fallback" aria-hidden="true">{opt.label.charAt(0).toUpperCase()}</span>
            {/if}
            <span class="option-label visually-hidden">{opt.label}</span>
          </div>
          {#if opt.value === value}
            <div class="selected-indicator" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  @reference "tailwindcss";

  .custom-dropdown {
    @apply relative w-full;
  }

  .dropdown-toggle {
    @apply w-full py-3 px-4 rounded-xl border-2 transition-all duration-300 cursor-pointer text-left;
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 48px;
  }

  .dropdown-toggle:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  .dropdown-toggle:focus {
    @apply outline-none;
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  .dropdown-toggle.active {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-1px);
  }

  .dropdown-content {
    @apply flex items-center flex-1;
  }

  .dropdown-icon {
    @apply flex items-center justify-center;
    width: 24px;
    height: 24px;
    font-size: 1.2rem;
  }

  .dropdown-fallback,
  .option-fallback {
    @apply flex items-center justify-center font-bold text-white;
    width: 24px;
    height: 24px;
    font-size: 1.1rem;
  }

  .dropdown-label,
  .option-label {
    @apply font-medium text-white;
    font-size: 0.95rem;
  }

  .dropdown-placeholder {
    @apply font-medium flex items-center justify-center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.2rem;
    width: 24px;
    height: 24px;
  }

  /* Visually hidden but accessible to screen readers */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .dropdown-arrow {
    @apply ml-2 transition-transform duration-300 flex items-center;
    color: rgba(255, 255, 255, 0.7);
  }

  .dropdown-arrow.rotated {
    transform: rotate(180deg);
  }

  .dropdown-list {
    @apply absolute left-0 w-full mt-2 py-2 rounded-xl border relative overflow-hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
    animation: fadeInScale 0.2s ease-out;
    max-height: 200px;
    overflow-y: auto;
    z-index: 9999;
    position: fixed;
    width: var(--dropdown-width);
    left: var(--dropdown-left);
    top: var(--dropdown-top);
  }

  .dropdown-list::before {
    content: '';
    @apply absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
    z-index: -1;
  }

  .dropdown-list:hover::before {
    @apply opacity-10;
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .dropdown-option {
    @apply w-full px-4 py-3 transition-all duration-200 cursor-pointer border-none text-left;
    background: transparent;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dropdown-option:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .dropdown-option:active {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(0.98);
  }

  .dropdown-option.selected {
    background: rgba(255, 255, 255, 0.15);
  }

  .option-content {
    @apply flex items-center justify-center;
  }

  .option-icon {
    @apply flex items-center justify-center;
    width: 20px;
    height: 20px;
    font-size: 1.1rem;
  }

  .option-label {
    @apply font-medium;
    font-size: 0.9rem;
  }

  .selected-indicator {
    @apply ml-2 flex items-center;
    color: rgba(255, 255, 255, 0.8);
  }

  /* Scrollbar styling for dropdown list */
  .dropdown-list::-webkit-scrollbar {
    width: 4px;
  }

  .dropdown-list::-webkit-scrollbar-track {
    background: transparent;
  }

  .dropdown-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }

  .dropdown-list::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* Mobile optimizations */
  @media (max-width: 480px) {
    .dropdown-toggle {
      @apply py-3 px-3;
    }

    .dropdown-option {
      @apply px-3 py-3;
    }

    .dropdown-icon,
    .option-icon {
      width: 22px;
      height: 22px;
    }

    .dropdown-fallback,
    .option-fallback {
      width: 22px;
      height: 22px;
      font-size: 1rem;
    }
  }
</style>