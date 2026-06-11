<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { supabase } from "../lib/supabase";
import { useRouter, useRoute } from "vue-router";
import { HelpCircle } from "lucide-vue-next";
import { useRppState } from "../composables/useRppState";

import Sidebar from "../components/layout/Sidebar.vue";
import TopHeader from "../components/layout/TopHeader.vue";
import PricingModal from "../components/rpp/PricingModal.vue";

const router = useRouter();
const route = useRoute();
const userEmail = ref("");
const showPricing = ref(false);
const isSidebarOpen = ref(false);
const { cleanup } = useRppState();

// Derive active menu from current route
const activeMenu = computed(() => {
  const path = route.path;
  if (path.startsWith("/dashboard/projects")) return "Semua Proyek";
  if (path.startsWith("/dashboard/library")) return "Perpustakaan";
  return "Dasbor";
});

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    router.push("/");
  } else {
    userEmail.value = data.session.user.email || "";
  }
});

onUnmounted(() => {
  cleanup();
});

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push("/");
};

const handleNavigation = (menuName: string) => {
  isSidebarOpen.value = false;
  if (menuName === "Semua Proyek") {
    router.push("/dashboard/projects");
  } else if (menuName === "Perpustakaan") {
    router.push("/dashboard/library");
  } else {
    router.push("/dashboard");
  }
};
</script>

<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
    <!-- Mobile Sidebar Backdrop -->
    <Transition name="fade">
      <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"></div>
    </Transition>

    <Sidebar :active-menu="activeMenu" :is-sidebar-open="isSidebarOpen" @navigate="handleNavigation" @show-pricing="showPricing = true" />

    <!-- Pricing Modal -->
    <Transition name="modal-pop">
      <PricingModal v-if="showPricing" @close="showPricing = false" />
    </Transition>

    <main class="flex-grow flex flex-col overflow-hidden w-full">
      <TopHeader :user-email="userEmail" @logout="handleLogout" @show-pricing="showPricing = true" @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <div class="flex-grow overflow-y-auto p-4 md:p-8 layout-scroll relative">
        <router-view v-slot="{ Component }">
          <Transition name="tab-slide" mode="out-in">
            <component :is="Component" @show-pricing="showPricing = true" />
          </Transition>
        </router-view>
      </div>

      <button class="fixed bottom-4 right-4 md:bottom-8 md:right-8 px-4 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-full font-bold flex items-center gap-2 md:gap-3 shadow-2xl shadow-blue-200 hover:-translate-y-1 transition-all text-sm md:text-base z-30">
        <HelpCircle class="w-4 h-4 md:w-5 md:h-5" /> Butuh Bantuan?
      </button>
    </main>
  </div>
</template>

<style scoped>
.layout-scroll::-webkit-scrollbar {
  display: none;
}
.layout-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* === Tab Content Transitions === */
.tab-slide-enter-active {
  transition:
    opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.tab-slide-leave-active {
  transition:
    opacity 0.2s cubic-bezier(0.4, 0, 1, 1),
    transform 0.2s cubic-bezier(0.4, 0, 1, 1),
    filter 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.tab-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
  filter: blur(3px);
}
.tab-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.99);
  filter: blur(2px);
}

/* === Modal Pop Transition === */
.modal-pop-enter-active {
  transition:
    opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-pop-leave-active {
  transition:
    opacity 0.2s cubic-bezier(0.4, 0, 1, 1),
    transform 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.modal-pop-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.modal-pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
