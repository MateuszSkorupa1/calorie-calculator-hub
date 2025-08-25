<script lang="ts">
  import CustomDropdown from '$lib/ui/CustomDropdown.svelte';
  import { bmi, tdee, calorieGoal } from '$lib/utils/calculators';
  import type { Gender } from '$lib/utils/calculators';

  interface Props {
    type?: 'bmi' | 'tdee' | 'calorie';
    defaultValues?: {
      weight?: number;
      height?: number;
      age?: number;
      gender?: Gender;
      activityLevel?: number;
      goal?: 'lose' | 'maintain' | 'gain';
    };
    isMetric?: boolean;
  }

  let { type = 'bmi', defaultValues = {}, isMetric = $bindable(true) }: Props = $props();

  // Internal storage - always keep values in metric for consistency
  let weightKg = $state(defaultValues.weight ?? 70);
  let heightCm = $state(defaultValues.height ?? 170);
  let age = $state(defaultValues.age ?? 25);
  let gender = $state<Gender>(defaultValues.gender ?? 'male');
  let formula = $state<'male' | 'female'>('male');

  const genderOptions = [
    { value: 'male', label: 'Male', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="14" r="6" /><path d="M17 3h4v4" /><path d="M21 3l-7.5 7.5" /></svg>' },
    { value: 'female', label: 'Female', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6" /><line x1="12" y1="14" x2="12" y2="22" /><line x1="9" y1="19" x2="15" y2="19" /></svg>' },
    { value: 'non-binary', label: 'Non-binary', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" /><path d="M8 8l8 8" /><path d="M16 8l-8 8" /><path d="M9 3h6" /><path d="M9 21h6" /><path d="M3 9v6" /><path d="M21 9v6" /></svg>' },
    { value: 'other', label: 'Other', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" /></svg>' }
  ];

  const formulaOptions = [
    { value: 'male', label: 'Use Male Formula', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="14" r="6" /><path d="M17 3h4v4" /><path d="M21 3l-7.5 7.5" /></svg>' },
    { value: 'female', label: 'Use Female Formula', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6" /><line x1="12" y1="14" x2="12" y2="22" /><line x1="9" y1="19" x2="15" y2="19" /></svg>' }
  ];

  let activityLevel = $state(defaultValues.activityLevel ?? 1.55);
  let goal = $state<'lose' | 'maintain' | 'gain'>(defaultValues.goal ?? 'maintain');

  // Display values - these are what the user sees and edits
  let weight = $derived(isMetric ? weightKg : Math.round(weightKg * 2.20462 * 10) / 10);
  let height = $derived(isMetric ? heightCm : Math.round(heightCm * 0.393701 * 10) / 10);

  // Animation states
  let isCalculated = $state(false);

  // Update internal metric values when user changes display values
  function updateWeight(value: number) {
    weightKg = isMetric ? value : value * 0.453592;
  }

  function updateHeight(value: number) {
    heightCm = isMetric ? value : value * 2.54;
  }

  // Reactive result: automatically updates whenever inputs change
  let result = $derived.by(() => {
    // Validate inputs using internal metric values
    if (!weightKg || weightKg <= 0 || !heightCm || heightCm <= 0) return null;
    if (type !== 'bmi' && (!age || age <= 0)) return null;

    try {
      switch (type) {
        case 'bmi':
          return bmi(weightKg, heightCm);
        case 'tdee':
          // For non-binary/other, use formula selection
          return tdee(weightKg, heightCm, age, gender, activityLevel, (gender === 'male' || gender === 'female') ? gender : formula);
        case 'calorie':
          const tdeeValue = tdee(weightKg, heightCm, age, gender, activityLevel, (gender === 'male' || gender === 'female') ? gender : formula);
          return calorieGoal(tdeeValue, goal);
        default:
          return null;
      }
    } catch (error) {
      console.error('Calculation error:', error);
      return null;
    }
  });

  $effect(() => {
    if (result !== null) {
      isCalculated = true;
    }
  });

  // Get result unit and description
  let resultInfo = $derived.by(() => {
    if (result === null) return { unit: '', description: '', color: '' };

    switch (type) {
      case 'bmi':
        let bmiCategory = 'Unknown';
        let bmiColor = 'text-gray-400';

        if (result < 18.5) {
          bmiCategory = 'Underweight';
          bmiColor = 'text-blue-400';
        } else if (result < 25) {
          bmiCategory = 'Normal Weight';
          bmiColor = 'text-green-400';
        } else if (result < 30) {
          bmiCategory = 'Overweight';
          bmiColor = 'text-yellow-400';
        } else {
          bmiCategory = 'Obese';
          bmiColor = 'text-red-400';
        }

        return { unit: 'BMI', description: bmiCategory, color: bmiColor };

      case 'tdee':
        return {
          unit: 'kcal/day',
          description: 'Total Daily Energy Expenditure',
          color: 'text-green-400'
        };

      case 'calorie':
        const goalText = goal === 'lose' ? 'Weight Loss Goal' :
                        goal === 'gain' ? 'Muscle Gain Goal' : 'Maintenance Calories';
        const goalColor = goal === 'lose' ? 'text-red-400' :
                         goal === 'gain' ? 'text-blue-400' : 'text-green-400';
        return {
          unit: 'kcal/day',
          description: goalText,
          color: goalColor
        };

      default:
        return { unit: '', description: '', color: 'text-gray-400' };
    }
  });

  // Activity level labels
  const activityLabels = {
    1.2: 'Sedentary',
    1.375: 'Light Activity',
    1.55: 'Moderate Activity',
    1.725: 'Active',
    1.9: 'Very Active'
  };
</script>

<div class="calculator-container">
  <!-- Overlay for hover effect -->
  <div class="hover-overlay"></div>

  <!-- Header -->
  <div class="header">
    <div class="header-pills">
      <div class="pill pill-primary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      </div>
      <button
        class="pill unit-toggle"
        class:pill-primary={!isMetric}
        class:pill-secondary={isMetric}
        onclick={() => isMetric = !isMetric}
        title="Switch between Metric and Imperial units"
      >
        <span class="unit-text">{isMetric ? 'KG' : 'LB'}</span>
      </button>
      <div class="pill pill-secondary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </div>
    </div>
  </div>

  <!-- Main Result Display -->
  <div class="result-display" class:calculated={isCalculated}>
    {#if result !== null}
      <div class="result-value">{result.toFixed(type === 'bmi' ? 1 : 0)}</div>
      <div class="result-unit">{resultInfo.unit}</div>
      <div class="result-description">{resultInfo.description}</div>
    {:else}
      <div class="result-placeholder">Enter your details</div>
    {/if}
  </div>

  <!-- Input Grid -->
  <div class="input-grid">
    <!-- Weight -->
      <div class="input-card">
        <label class="input-label" for="weight-input">Weight</label>
        <input
          id="weight-input"
          type="number"
          value={weight}
          oninput={(e) => updateWeight(parseFloat((e.target as HTMLInputElement).value) || 0)}
          class="input-field"
          placeholder={isMetric ? "70" : "154"}
          step={isMetric ? "0.5" : "0.1"}
          min="1"
          max={isMetric ? "300" : "660"}
        />
        <span class="input-unit">{isMetric ? 'kg' : 'lbs'}</span>
      </div>

    <!-- Height -->
      <div class="input-card">
        <label class="input-label" for="height-input">Height</label>
        <input
          id="height-input"
          type="number"
          value={height}
          oninput={(e) => updateHeight(parseFloat((e.target as HTMLInputElement).value) || 0)}
          class="input-field"
          placeholder={isMetric ? "170" : "67"}
          step={isMetric ? "1" : "0.1"}
          min={isMetric ? "100" : "36"}
          max={isMetric ? "250" : "96"}
        />
        <span class="input-unit">{isMetric ? 'cm' : 'in'}</span>
      </div>

    <!-- Age (if needed) -->
    {#if type !== 'bmi'}
        <div class="input-card">
          <label class="input-label" for="age-input">Age</label>
          <input
            id="age-input"
            type="number"
            bind:value={age}
            class="input-field"
            placeholder="25"
            step="1"
            min="10"
            max="120"
          />
          <span class="input-unit">years</span>
        </div>

      <!-- Gender -->
        <div class="input-card">
          <span class="input-label">Gender</span>
          <CustomDropdown
            options={genderOptions}
            value={gender}
            placeholder="Select gender"
            onChange={(val) => gender = val as Gender}
          />
          {#if gender === 'non-binary' || gender === 'other' || gender === 'prefer-not-to-say'}
            <div class="formula-select" style="margin-top: 1rem;">
              <span class="input-label">Calculation Formula</span>
              <CustomDropdown
                options={formulaOptions}
                value={formula}
                placeholder="Select formula"
                onChange={(val) => formula = val as 'male' | 'female'}
              />
              <span class="input-unit" style="right:unset;left:1rem;bottom:unset;top:100%;font-size:0.9em;color:rgba(255,255,255,0.5);">Choose the formula that best matches your physiology</span>
            </div>
          {/if}
        </div>

      <!-- Activity Level -->
        <div class="input-card full-width">
          <span class="input-label">Activity Level</span>
          <div class="activity-grid">
            {#each Object.entries(activityLabels) as [value, label]}
              <button
                class="activity-btn"
                class:active={activityLevel === parseFloat(value)}
                onclick={() => activityLevel = parseFloat(value)}
              >
                {label}
              </button>
            {/each}
          </div>
        </div>
    {/if}

    <!-- Goal (if calorie calculator) -->
    {#if type === 'calorie'}
        <div class="input-card full-width">
          <span class="input-label">Goal</span>
          <div class="goal-grid">
            <button
              class="goal-btn"
              class:active={goal === 'lose'}
              onclick={() => goal = 'lose'}
            >
              <div class="goal-icon">📉</div>
              <div class="goal-text">Lose Weight</div>
            </button>
            <button
              class="goal-btn"
              class:active={goal === 'maintain'}
              onclick={() => goal = 'maintain'}
            >
              <div class="goal-icon">⚖️</div>
              <div class="goal-text">Maintain</div>
            </button>
            <button
              class="goal-btn"
              class:active={goal === 'gain'}
              onclick={() => goal = 'gain'}
            >
              <div class="goal-icon">💪</div>
              <div class="goal-text">Gain Muscle</div>
            </button>
          </div>
        </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  .calculator-container {
    @apply max-w-md mx-auto rounded-3xl p-6 min-h-[600px] relative overflow-hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .hover-overlay {
    @apply absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
  }

  .calculator-container:hover .hover-overlay {
    @apply opacity-10;
  }

  /* Header */
  .header {
    @apply flex justify-center mb-8 relative z-10;
  }

  .header-pills {
    @apply flex gap-3;
  }

  .pill {
    @apply w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all duration-300 cursor-pointer;
  }

  .unit-toggle {
    @apply hover:scale-110 active:scale-95;
  }

  .unit-text {
    @apply text-xs font-bold tracking-wider;
  }

  .pill-primary {
    background: rgba(255, 255, 255, 0.2);
  }

  .pill-secondary {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Result Display */
  .result-display {
    @apply text-center mb-10 py-10 px-5 rounded-3xl border transition-all duration-500 ease-out relative z-10 scale-95 opacity-70;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .result-display.calculated {
    @apply scale-100 opacity-100;
    background: rgba(255, 255, 255, 0.15);
  }

  .result-value {
    @apply text-6xl font-black text-white mb-2 transition-all duration-300;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .result-unit {
    @apply text-xl mb-1;
    color: rgba(255, 255, 255, 0.8);
  }

  .result-description {
    @apply text-base uppercase tracking-wide;
    color: rgba(255, 255, 255, 0.7);
  }

  .result-placeholder {
    @apply text-2xl;
    color: rgba(255, 255, 255, 0.6);
  }

  /* Input Grid */
  .input-grid {
    @apply grid grid-cols-2 gap-4 relative z-10;
  }

  .input-card {
    @apply rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-0.5 relative;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .input-card:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .input-card.full-width {
    @apply col-span-2;
  }

  .input-label {
    @apply block text-sm font-semibold mb-3 uppercase tracking-wide;
    color: rgba(255, 255, 255, 0.9);
  }

  .input-field {
    @apply w-full border-2 rounded-xl py-3 px-4 text-white text-xl font-semibold text-center transition-all duration-300;
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .input-field:focus {
    @apply outline-none scale-105;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.2);
  }

  .input-field::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .input-unit {
    @apply absolute right-4 bottom-5 text-sm font-medium;
    color: rgba(255, 255, 255, 0.6);
  }

  /* Activity Grid */
  .activity-grid {
    @apply grid grid-cols-3 gap-2;
  }

  .activity-btn {
    @apply py-3 px-2 transition-all duration-300 rounded-xl border-2 text-xs font-semibold text-center;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    border-color: transparent;
  }

  .activity-btn:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .activity-btn.active {
    @apply text-white scale-105;
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  /* Goal Grid */
  .goal-grid {
    @apply grid grid-cols-3 gap-3;
  }

  .goal-btn {
    @apply flex flex-col items-center gap-2 py-4 px-2 transition-all duration-300 rounded-2xl border-2;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    border-color: transparent;
  }

  .goal-btn:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .goal-btn.active {
    @apply text-white scale-105;
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .goal-icon {
    @apply text-2xl;
  }

  .goal-text {
    @apply text-xs font-semibold text-center;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .calculator-container {
      @apply mx-3 p-5;
    }

    .result-value {
      @apply text-5xl;
    }

    .input-grid {
      @apply gap-3;
    }

    .activity-grid {
      @apply grid-cols-2;
    }
  }
</style>