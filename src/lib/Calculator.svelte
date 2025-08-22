<script lang="ts">
  import { bmi, tdee, calorieGoal } from '$lib/utils/calculators';
  import type { Gender } from '$lib/utils/calculators';

  export let type: 'bmi' | 'tdee' | 'calorie' = 'bmi';
  export let defaultValues: {
    weight?: number;
    height?: number;
    age?: number;
    gender?: Gender;
    activityLevel?: number;
    goal?: 'lose' | 'maintain' | 'gain';
  } = {};

  // Inputs
  let weight = defaultValues.weight ?? 70;
  let height = defaultValues.height ?? 170;
  let age = defaultValues.age ?? 25;
  let gender: Gender = defaultValues.gender ?? 'male';
  let activityLevel = defaultValues.activityLevel ?? 1.55;
  let goal: 'lose' | 'maintain' | 'gain' = defaultValues.goal ?? 'maintain';

  // Reactive result: automatically updates whenever inputs change
  $: result = (() => {
    switch (type) {
      case 'bmi':
        return bmi(weight, height);
      case 'tdee':
        return tdee(weight, height, age, gender, activityLevel);
      case 'calorie':
        const t = tdee(weight, height, age, gender, activityLevel);
        return calorieGoal(t, goal);
      default:
        return null;
    }
  })();
</script>

<div class="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
  <h2 class="text-2xl font-semibold text-center">Calculate Your {type.toUpperCase()}</h2>

  <div class="space-y-4">
    <input type="number" bind:value={weight} placeholder="Weight (kg)" class="input" />
    <input type="number" bind:value={height} placeholder="Height (cm)" class="input" />

    {#if type !== 'bmi'}
      <input type="number" bind:value={age} placeholder="Age" class="input" />
      <select bind:value={gender} class="input">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <select bind:value={activityLevel} class="input">
        <option value={1.2}>Sedentary</option>
        <option value={1.375}>Light</option>
        <option value={1.55}>Moderate</option>
        <option value={1.725}>Active</option>
        <option value={1.9}>Very Active</option>
      </select>
    {/if}

    {#if type === 'calorie'}
      <select bind:value={goal} class="input">
        <option value="lose">Lose Weight</option>
        <option value="maintain">Maintain</option>
        <option value="gain">Gain Muscle</option>
      </select>
    {/if}
  </div>

  <div class="mt-4 text-center text-xl font-semibold">
    {#if result !== null}
      Result: {result.toFixed(1)}
    {/if}
  </div>
</div>

<style>
  .input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
  }
</style>
