<script setup lang="ts">
import { HelpCircle as HelpIcon } from "lucide-vue-next";
import MainHeader from "../components/landing/MainHeader.vue";
import HeroSection from "../components/landing/HeroSection.vue";
import ChallengeSection from "../components/landing/ChallengeSection.vue";
import FeatureSection from "../components/landing/FeatureSection.vue";
import StatistikSection from "../components/landing/StatistikSection.vue";
import ResultsSection from "../components/landing/ResultsSection.vue";
import TestimonialSection from "../components/landing/TestimonialSection.vue";
import PricingSection from "../components/landing/PricingSection.vue";
import ContactSection from "../components/landing/ContactSection.vue";
import HelpSection from "../components/landing/HelpSection.vue";
import CommunitySection from "../components/landing/CommunitySection.vue";
import MainFooter from "../components/landing/MainFooter.vue";
</script>

<template>
  <div class="landing-page selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
    <!-- Navigation -->
    <MainHeader />

    <main class="relative z-10">
      <!-- Hero -->
      <HeroSection />

      <!-- Challenge / Story -->
      <ChallengeSection />

      <!-- Differences / Features -->
      <FeatureSection />

      <!-- BSE Books / Local Knowledge -->
      <StatistikSection />

      <!-- Sample Results -->
      <ResultsSection />

      <!-- Testimonials -->
      <TestimonialSection />

      <!-- Pricing / Tiers -->
      <PricingSection />

      <!-- CTA / Contact -->
      <ContactSection />

      <!-- FAQ / Help -->
      <HelpSection />

      <!-- Events / Community -->
      <CommunitySection />
    </main>

    <!-- Footer -->
    <MainFooter />

    <!-- Persistent Floating Support Button -->
    <button
      class="fixed bottom-8 right-8 z-50 px-8 py-5 bg-emerald-500 text-white rounded-full font-black flex items-center gap-4 shadow-[0_24px_48px_-10px_rgba(16,185,129,0.5)] transform hover:-translate-y-3 hover:scale-105 active:scale-95 transition-all duration-500 group overflow-hidden"
    >
      <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
      <span class="max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-700 whitespace-nowrap text-sm uppercase tracking-widest relative z-10"> Butuh Bantuan? </span>
      <div class="relative z-10">
        <div class="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
        <HelpIcon class="h-6 w-6 relative z-10" />
      </div>
    </button>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}

/* Base transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for better feel */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #f8fafc;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 5px;
  border: 2px solid #f8fafc;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
