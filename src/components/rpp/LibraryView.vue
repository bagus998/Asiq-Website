<script setup lang="ts">
import { ref } from "vue";
import { Search, Filter, RefreshCw, Plus } from "lucide-vue-next";

const searchQuery = ref("");
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header Row -->
    <div class="flex items-start justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-bold text-slate-900">Perpustakaan</h1>
        <p class="text-sm text-slate-500">Kelola sumber data organisasi dengan alur cepat dan sederhana.</p>
      </div>

      <div class="flex items-center gap-2">
        <button class="p-2.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
          <Filter class="w-4 h-4" />
        </button>
        <button class="p-2.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
          <RefreshCw class="w-4 h-4" />
        </button>
        <button class="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
          <Plus class="w-4 h-4" />
          Tambah Sumber
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="relative">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari judul atau mata pelajaran disini"
        class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400"
      />
    </div>

    <!-- Empty State -->
    <div class="flex flex-col items-center justify-center py-20 space-y-4">
      <div class="w-16 h-16 flex items-center justify-center">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="16" width="48" height="38" rx="3" fill="#E2E8F0" />
          <path d="M8 19C8 17.3431 9.34315 16 11 16H25L29 10H53C54.6569 10 56 11.3431 56 13V16H8V19Z" fill="#CBD5E1" />
          <rect x="18" y="26" width="16" height="2.5" rx="1.25" fill="#94A3B8" />
          <rect x="18" y="32" width="11" height="2.5" rx="1.25" fill="#94A3B8" opacity="0.5" />
        </svg>
      </div>

      <div class="text-center space-y-2">
        <h2 class="text-base font-bold text-slate-900">Belum ada data Perpustakaan</h2>
        <p class="text-sm text-slate-500 max-w-md">Tambahkan sumber data untuk mulai diproses oleh backend/service AI.</p>
      </div>
    </div>
  </div>
</template>
