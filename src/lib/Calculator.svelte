<script lang="ts">
  import { bmi, tdee, calorieGoal } from '$lib/utils/calculators';
  import type { Gender } from '$lib/utils/calculators';

  // Type for defaultValues — do NOT export in regular script
  type CalculatorDefaults = {
    weight?: number;
    height?: number;
    age?: number;
    gender?: Gender;
    activityLevel?: number;
    goal?: 'lose' | 'maintain' | 'gain';
  };

  export let type: 'bmi' | 'tdee' | 'calorie' = 'bmi';
  export let defaultValues: CalculatorDefaults = {};

  let weight: number = defaultValues.weight ?? 70;
  let height: number = defaultValues.height ?? 170;
  let age: number = defaultValues.age ?? 25;
  let gender: Gender = defaultValues.gender ?? 'male';
  let activityLevel: number = defaultValues.activityLevel ?? 1.55;
  let goal: 'lose' | 'maintain' | 'gain' = defaultValues.goal ?? 'maintain';

  let result: number | null = null;

  const calculate = (): void => {
    if (type === 'bmi') result = bmi(weight, height);
    if (type === 'tdee') result = tdee(weight, height, age, gender, activityLevel);
    if (type === 'calorie') {
      const t: number = tdee(weight, height, age, gender, activityLevel);
      result = calorieGoal(t, goal);
    }
  };
</script>


<div class="calculator space-y-4 max-w-md mx-auto p-4 bg-white shadow rounded">
  <input type="number" bind:value={weight} placeholder="Weight (kg)" class="input" />
  <input type="number" bind:value={height} placeholder="Height (cm)" class="input" />

  {#if type !== 'bmi'}
    <input type="number" bind:value={age} placeholder="Age" class="input" />
    <select bind:value={gender} class="input">
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>
    {#if type === 'calorie'}
      <select bind:value={goal} class="input">
        <option value="lose">Lose Weight</option>
        <option value="maintain">Maintain</option>
        <option value="gain">Gain Muscle</option>
      </select>
    {/if}
    <select bind:value={activityLevel} class="input">
      <option value={1.2}>Sedentary</option>
      <option value={1.375}>Light</option>
      <option value={1.55}>Moderate</option>
      <option value={1.725}>Active</option>
      <option value={1.9}>Very Active</option>
    </select>
  {/if}

  <button on:click={calculate} class="btn bg-blue-600 text-white px-4 py-2 rounded">Calculate</button>

  {#if result !== null}
    <div class="result p-2 mt-2 bg-gray-100 rounded text-center font-semibold">
      Result: {result.toFixed(1)}
    </div>
  {/if}
</div>

<style lang="postcss">
  @reference "tailwindcss";
  .input {
    @apply w-full p-2 border border-gray-300 rounded;
  }
</style>
