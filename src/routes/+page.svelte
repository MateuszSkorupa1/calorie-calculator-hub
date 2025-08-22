<script lang="ts">
  import Calculator from '$lib/Calculator.svelte';
</script>

<main class="p-6 space-y-6">
  <h1 class="text-3xl font-bold text-center">Calorie & BMI Calculator Hub</h1>

  <section>
    <h2 class="text-xl font-semibold mb-2">BMI Calculator</h2>
    <Calculator type="bmi" />
  </section>

  <section>
    <h2 class="text-xl font-semibold mb-2">TDEE Calculator</h2>
    <Calculator type="tdee" />
  </section>

  <section>
    <h2 class="text-xl font-semibold mb-2">Calorie Goal Calculator</h2>
    <Calculator type="calorie" />
  </section>
</main>

<style lang="postcss">
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>