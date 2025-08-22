<script lang="ts">
  import Calculator from '$lib/Calculator.svelte';
</script>

<main class="main-container">
  <!-- Header -->
  <div class="header-section">
    <div class="header-content">
      <div class="header-icon">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      </div>
      <h1 class="header-title">Calorie & BMI Calculator Hub</h1>
      <p class="header-subtitle">Track your fitness journey with precision</p>
    </div>
  </div>

  <!-- Calculator Grid -->
  <div class="calculator-grid">
    <!-- BMI Calculator -->
    <section class="calculator-section">
      <div class="section-header">
        <div class="section-icon bmi-icon">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <div class="section-info">
          <h2 class="section-title">BMI Calculator</h2>
          <p class="section-description">Calculate your Body Mass Index</p>
        </div>
      </div>
      <Calculator type="bmi" />
    </section>

    <!-- TDEE Calculator -->
    <section class="calculator-section">
      <div class="section-header">
        <div class="section-icon tdee-icon">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <div class="section-info">
          <h2 class="section-title">TDEE Calculator</h2>
          <p class="section-description">Total Daily Energy Expenditure</p>
        </div>
      </div>
      <Calculator type="tdee" />
    </section>

    <!-- Calorie Goal Calculator -->
    <section class="calculator-section">
      <div class="section-header">
        <div class="section-icon calorie-icon">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
          </svg>
        </div>
        <div class="section-info">
          <h2 class="section-title">Calorie Goal Calculator</h2>
          <p class="section-description">Personalized calorie targets</p>
        </div>
      </div>
      <Calculator type="calorie" />
    </section>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p class="footer-text">Made with ❤️ for your health journey</p>
  </div>
</main>

<style lang="postcss">
  @reference "tailwindcss";
  .main-container {
    @apply min-h-screen p-6;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  }

  /* Header Section */
  .header-section {
    @apply mb-12;
  }

  .header-content {
    @apply max-w-4xl mx-auto text-center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    @apply rounded-3xl p-8 border;
    border-color: rgba(255, 255, 255, 0.2);
  }

  .header-icon {
    @apply w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white;
    background: rgba(255, 255, 255, 0.2);
  }

  .header-title {
    @apply text-4xl font-black text-white mb-3;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .header-subtitle {
    @apply text-xl font-medium;
    color: rgba(255, 255, 255, 0.8);
  }

  /* Calculator Grid */
  .calculator-grid {
    @apply max-w-6xl mx-auto space-y-8;
  }

  .calculator-section {
    @apply relative;
  }

  .section-header {
    @apply flex items-center gap-4 mb-6 max-w-md mx-auto;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    @apply rounded-2xl p-4 border;
    border-color: rgba(255, 255, 255, 0.15);
  }

  .section-icon {
    @apply w-14 h-14 rounded-xl flex items-center justify-center text-white transition-all duration-300;
  }

  .bmi-icon {
    background: linear-gradient(135deg, #667eea, #764ba2);
  }

  .tdee-icon {
    background: linear-gradient(135deg, #f093fb, #f5576c);
  }

  .calorie-icon {
    background: linear-gradient(135deg, #4facfe, #00f2fe);
  }

  .section-info {
    @apply flex-1;
  }

  .section-title {
    @apply text-xl font-bold text-white mb-1;
  }

  .section-description {
    @apply text-sm font-medium;
    color: rgba(255, 255, 255, 0.7);
  }

  /* Footer */
  .footer {
    @apply mt-16 text-center;
  }

  .footer-text {
    @apply text-lg font-medium;
    color: rgba(255, 255, 255, 0.8);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .main-container {
      @apply p-4;
    }

    .header-content {
      @apply p-6;
    }

    .header-title {
      @apply text-3xl;
    }

    .header-subtitle {
      @apply text-lg;
    }

    .calculator-grid {
      @apply space-y-6;
    }

    .section-header {
      @apply flex-col text-center gap-3 p-5;
    }

    .section-icon {
      @apply w-12 h-12;
    }

    .section-title {
      @apply text-lg;
    }
  }

  /* Global Styles */
  :global(html) {
    @apply scroll-smooth;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  :global(body) {
    @apply m-0;
    background: transparent;
  }

  /* Add some spacing between calculators */
  :global(.calculator-container) {
    @apply shadow-2xl;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  /* Hover effects for calculator sections */
  .calculator-section:hover .section-header {
    @apply scale-105;
    background: rgba(255, 255, 255, 0.15);
  }
</style>