<script setup lang="ts">
// Main entry point for routing
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <Transition :name="route.meta.transition || 'page-fade'" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </router-view>
</template>

<style>
/* === Page Route Transitions === */

/* Fade + Slide Up */
.page-fade-enter-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 1, 1),
              transform 0.25s cubic-bezier(0.4, 0, 1, 1);
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.99);
}

/* Slide Scale (for dashboard entry) */
.page-slide-enter-active {
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-slide-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 1, 1),
              transform 0.3s cubic-bezier(0.4, 0, 1, 1),
              filter 0.3s cubic-bezier(0.4, 0, 1, 1);
}
.page-slide-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(40px);
  filter: blur(4px);
}
.page-slide-leave-to {
  opacity: 0;
  transform: scale(1.04) translateY(-20px);
  filter: blur(2px);
}
</style>
