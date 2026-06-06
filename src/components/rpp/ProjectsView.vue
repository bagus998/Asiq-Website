<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Plus, LayoutGrid, List, FolderOpen } from "lucide-vue-next";

const router = useRouter();
const viewMode = ref<"grid" | "list">("grid");
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header Row -->
    <div class="flex items-start justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-bold text-slate-900">Proyek Yang Anda Miliki</h1>
        <p class="text-sm text-slate-500">Kelola semua dokumen ajar dalam satu tempat mudah dan cepat.</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- View Toggle -->
        <div class="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
          <button @click="viewMode = 'grid'" :class="['p-2 transition-colors', viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600']">
            <LayoutGrid class="w-4 h-4" />
          </button>
          <button @click="viewMode = 'list'" :class="['p-2 transition-colors', viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600']">
            <List class="w-4 h-4" />
          </button>
        </div>

        <!-- Create Project Button -->
        <button @click="router.push('/dashboard/rpp')" class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus class="w-4 h-4" />
          Buat Proyek Baru
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div class="flex flex-col items-center justify-center py-24 space-y-5">
      <!-- Folder Icon -->
      <div class="w-20 h-20 flex items-center justify-center">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="20" width="64" height="44" rx="4" fill="#E2E8F0" />
          <path d="M4 24C4 21.7909 5.79086 20 8 20H28L34 12H64C66.2091 12 68 13.7909 68 16V20H4V24Z" fill="#CBD5E1" />
          <rect x="16" y="32" width="20" height="3" rx="1.5" fill="#94A3B8" />
          <rect x="16" y="40" width="14" height="3" rx="1.5" fill="#94A3B8" opacity="0.5" />
        </svg>
      </div>

      <div class="text-center space-y-2">
        <h2 class="text-lg font-bold text-slate-900">Belum Ada Proyek</h2>
        <p class="text-sm text-slate-500 max-w-md">Anda belum memiliki proyek. Buat proyek pertama Anda untuk mulai bekerja.</p>
      </div>

      <!-- Package Info Badge -->
      <div class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 border border-blue-100 rounded-full">
        <span class="text-sm text-slate-600">Paket</span>
        <span class="text-sm font-bold text-blue-600">Guru Inspiratif</span>
        <span class="text-sm text-slate-600">- Maksimal Pembuatan</span>
        <span class="text-sm font-bold text-slate-900">1000 Proyek</span>
      </div>

      <!-- Create First Project Button -->
      <button @click="router.push('/dashboard/rpp')" class="flex items-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:border-blue-600 hover:text-blue-600 transition-all">
        <Plus class="w-4 h-4" />
        Buat Proyek Pertama
      </button>
    </div>
  </div>
</template>
