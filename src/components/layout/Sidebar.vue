<script setup lang="ts">
import { logoUrl } from "../../constants";
import { LayoutDashboard, FolderOpen, GraduationCap, Users, Library, ChevronDown, Star } from "lucide-vue-next";

defineProps<{ activeMenu: string }>();
const emit = defineEmits(["navigate"]);

const sidebarItems = [
  { name: "Dasbor", icon: LayoutDashboard, badge: "" },
  { name: "Semua Proyek", icon: FolderOpen, badge: "" },
  { name: "Kursus AI", icon: GraduationCap, badge: "PRO" },
  { name: "Kelola Tim", icon: Users, badge: "TIM" },
  { name: "Perpustakaan", icon: Library, badge: "" },
];
</script>

<template>
  <aside class="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
    <div class="p-6 flex items-center gap-2">
      <img :src="logoUrl" alt="ASIQ Logo" class="h-8 w-auto" />
    </div>

    <div class="px-4 py-2 border-b border-slate-50 flex items-center gap-3 mb-6">
      <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">P</div>
      <div class="flex flex-col">
        <span class="text-sm font-bold text-slate-900">Personal</span>
        <span class="text-xs text-slate-400">Account</span>
      </div>
      <ChevronDown class="w-4 h-4 ml-auto text-slate-400" />
    </div>

    <nav class="flex-grow px-4 pb-6 space-y-1">
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Menu Utama</p>
      <button
        v-for="item in sidebarItems"
        :key="item.name"
        @click="emit('navigate', item.name)"
        :class="[activeMenu === item.name ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50', 'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group']"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        <span class="text-sm font-semibold">{{ item.name }}</span>
        <span v-if="item.badge" class="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-600">
          {{ item.badge }}
        </span>
      </button>
    </nav>

    <div class="p-4 mx-4 mb-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 relative overflow-hidden group">
      <div class="relative z-10 space-y-4 text-center">
        <div class="flex justify-center -mt-8">
          <div class="w-16 h-16 bg-white rounded-full p-3 shadow-xl transform group-hover:scale-110 transition-all">
            <Star class="w-full h-full text-yellow-500 fill-yellow-500" />
          </div>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-bold text-slate-900">Tingkatkan Pengalaman Anda dengan ASIQ</p>
          <button class="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-blue-200 transition-all">Upgrade Berlangganan</button>
        </div>
      </div>
    </div>
  </aside>
</template>
