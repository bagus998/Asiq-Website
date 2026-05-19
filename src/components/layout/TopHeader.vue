<script setup lang="ts">
import { LayoutDashboard, Search, Bell, LogOut } from "lucide-vue-next";

defineProps<{ userEmail: string }>();
const emit = defineEmits(["logout"]);
</script>

<template>
  <header class="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
    <div class="flex items-center gap-4 w-full max-w-xl">
      <div class="md:hidden p-2 text-slate-600"><LayoutDashboard class="w-6 h-6" /></div>
      <div class="relative flex-grow">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Cari di sini..." class="w-full pl-12 pr-4 py-2 bg-slate-50 border-2 border-transparent rounded-xl focus:border-blue-600 focus:bg-white outline-none transition-all text-sm" />
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 p-1 bg-slate-50 rounded-xl">
        <button class="px-4 py-2 border-2 border-blue-600 rounded-lg text-xs font-bold text-blue-600 flex items-center gap-2 hover:bg-blue-50 transition-all">Gunakan Voucher</button>
        <div class="h-8 w-px bg-slate-200 mx-2"></div>
        <div class="flex items-center gap-4 px-4 py-1">
          <div class="flex flex-col items-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase">Gratis</span>
            <span class="text-sm font-bold text-slate-900">15</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase">Premium</span>
            <span class="text-sm font-bold text-slate-900">0</span>
          </div>
        </div>
      </div>

      <button class="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 relative">
        <Bell class="w-5 h-5" />
        <span class="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
      </button>

      <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
        <div class="flex flex-col items-end">
          <span class="text-sm font-bold text-slate-900 whitespace-nowrap">
            {{ userEmail ? userEmail.split("@")[0].toUpperCase() : "USER" }}
          </span>
          <span class="text-[10px] font-bold text-green-500 uppercase">Online</span>
        </div>
        <button @click="emit('logout')" class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm overflow-hidden hover:bg-orange-200 transition-all">
          <LogOut class="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
</template>
