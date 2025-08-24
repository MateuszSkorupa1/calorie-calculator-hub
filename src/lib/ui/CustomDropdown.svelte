<script lang="ts">
  export let options: Array<{ value: string; label: string; icon?: string }> = [];
  export let value: string;
  export let placeholder: string = '';
  export let onChange: (val: string) => void = () => {};

  function handleSelect(val: string) {
    value = val;
    onChange(val);
  }
</script>

<div class="custom-dropdown">
  <button class="dropdown-toggle" aria-haspopup="listbox" aria-expanded="false">
    {#if value}
      {#each options as opt}
        {#if opt.value === value}
          {#if opt.icon}
            <span class="dropdown-icon">{@html opt.icon}</span>
          {/if}
          <span class="dropdown-label">{opt.label}</span>
        {/if}
      {/each}
    {:else}
      <span class="dropdown-placeholder">{placeholder}</span>
    {/if}
    <span class="dropdown-arrow">▼</span>
  </button>
  <ul class="dropdown-list" role="listbox">
    {#each options as opt}
      <li role="option" aria-selected={opt.value === value}>
        <button
          type="button"
          class="dropdown-option {opt.value === value ? 'selected' : ''}"
          on:click={() => handleSelect(opt.value)}
        >
          {#if opt.icon}
            <span class="dropdown-icon">{@html opt.icon}</span>
          {/if}
          <span class="dropdown-label">{opt.label}</span>
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
.custom-dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
}
.dropdown-toggle {
  width: 100%;
  padding: 0.75em 1em;
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 0.75em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 1em;
}
.dropdown-arrow {
  margin-left: 0.5em;
}
.dropdown-list {
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  background: rgba(40,40,60,0.98);
  border-radius: 0.75em;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  margin-top: 0.25em;
  z-index: 10;
  padding: 0.25em 0;
  display: none;
}
.custom-dropdown:focus-within .dropdown-list,
.custom-dropdown:hover .dropdown-list {
  display: block;
}
.dropdown-option {
  padding: 0.75em 1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 1em;
}
.dropdown-option.selected {
  background: rgba(255,255,255,0.15);
}
.dropdown-icon {
  margin-right: 0.5em;
  font-size: 1.2em;
  display: flex;
  align-items: center;
}
.dropdown-placeholder {
  color: rgba(255,255,255,0.5);
}
</style>
