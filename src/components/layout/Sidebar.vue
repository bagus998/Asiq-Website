<script setup lang="ts">
import { logoUrl } from "../../constants";
import { LayoutDashboard, FolderOpen, GraduationCap, Users, Library, ChevronDown, Crown } from "lucide-vue-next";

defineProps<{ activeMenu: string; isSidebarOpen?: boolean }>();
const emit = defineEmits(["navigate", "show-pricing"]);

const pricingItems = ["Kursus AI", "Kelola Tim"];

const sidebarItems = [
  { name: "Dasbor", icon: LayoutDashboard, badge: "", badgeColor: "" },
  { name: "Semua Proyek", icon: FolderOpen, badge: "", badgeColor: "" },
  {
    name: "Kursus AI",
    icon: GraduationCap,
    badge: "PRO",
    badgeColor: "bg-blue-100 text-blue-600",
  },
  {
    name: "Kelola Tim",
    icon: Users,
    badge: "TIM",
    badgeColor: "bg-blue-100 text-blue-600",
  },
  { name: "Perpustakaan", icon: Library, badge: "", badgeColor: "" },
];
</script>

<template>
  <aside 
    :class="[
      'w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-300 z-50',
      'fixed inset-y-0 left-0 md:relative md:translate-x-0',
      isSidebarOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full'
    ]"
  >
    <!-- Logo -->
    <div class="p-6 pb-4 flex items-center gap-2">
      <img :src="logoUrl" alt="ASIQ Logo" class="h-9 w-auto" />
    </div>

    <!-- Personal Workspace Selector -->
    <div class="mx-4 px-3 py-2.5 border border-slate-100 rounded-lg flex items-center gap-3 mb-5">
      <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">P</div>
      <span class="text-sm font-semibold text-slate-900">Personal</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-grow px-4 pb-6 space-y-0.5">
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Menu Utama</p>
      <button
        v-for="item in sidebarItems"
        :key="item.name"
        @click="pricingItems.includes(item.name) ? emit('show-pricing') : emit('navigate', item.name)"
        :class="[activeMenu === item.name ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50', 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left']"
      >
        <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" />
        <span class="text-sm font-medium">{{ item.name }}</span>
        <span v-if="item.badge" :class="[item.badgeColor, 'ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1']">
          <Crown v-if="item.badge === 'PRO'" class="w-3 h-3" />
          <Users v-if="item.badge === 'TIM'" class="w-3 h-3" />
          {{ item.badge }}
        </span>
      </button>
    </nav>

    <!-- Upgrade Card -->
    <div class="mx-4 mb-4 p-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 relative overflow-hidden">
      <div class="relative z-10 flex flex-col items-center text-center space-y-3">
        <div class="text-3xl">👑</div>
        <p class="text-xs font-bold text-slate-800 leading-snug">Tingkatkan Pengalaman Anda<br />dengan ASIQ</p>
        <button @click="emit('show-pricing')" class="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all">Upgrade Berlangganan</button>
      </div>
    </div>
  </aside>
</template>
