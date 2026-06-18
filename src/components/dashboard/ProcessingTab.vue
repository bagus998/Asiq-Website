<script setup lang="ts">
import { Zap, GraduationCap, Search, FileText, Check } from 'lucide-vue-next'
import { useRppState } from '../../composables/useRppState'

const { currentStep } = useRppState()
</script>

<template>
  <div class="h-full flex items-center justify-center p-8">
    <div class="max-w-2xl w-full bg-white rounded-[2.5rem] p-16 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-12">
      <!-- Processing Animation Icons -->
      <div class="relative">
         <div class="w-48 h-48 rounded-full border-[12px] border-blue-50 border-t-blue-600 animate-spin"></div>
         <div class="absolute inset-0 flex items-center justify-center">
           <div class="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-400 animate-pulse">
              <Zap class="w-12 h-12 text-white" />
           </div>
         </div>
         <!-- Random Floating Icons -->
         <div class="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500 animate-bounce">
           <GraduationCap class="w-6 h-6" />
         </div>
         <div class="absolute top-1/2 -right-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500 translate-y-10 animate-pulse">
           <Search class="w-5 h-5" />
         </div>
         <div class="absolute -bottom-4 left-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500 animate-bounce [animation-delay:0.5s]">
           <FileText class="w-6 h-6" />
         </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-4xl font-black text-slate-900 leading-tight">Multi-Agent sedang menganalisis RPP Anda...</h2>
        <p class="text-slate-500 max-w-sm mx-auto">Mohon tunggu sebentar sementara sistem kami yang cerdas memecah dan mengevaluasi dokumen Anda.</p>
        <!-- Tampilkan currentStep asli dari backend jika ada -->
        <p v-if="currentStep" class="text-blue-600 font-bold mt-2 animate-pulse">{{ currentStep }}</p>
      </div>

      <div class="w-full max-w-xs space-y-4">
        <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-blue-600 w-2/3 rounded-full"></div>
        </div>
        <div class="space-y-3">
          <div class="flex items-center gap-3 text-slate-400 text-sm">
             <div class="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center"><Check class="w-3 h-3" /></div>
             <span>Membaca dokumen RPP...</span>
          </div>
          <div class="flex items-center gap-3 text-blue-600 text-sm font-bold">
             <div class="w-5 h-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
             <span>Menyusun strategi pengajaran...</span>
          </div>
          <div class="flex items-center gap-3 text-slate-300 text-sm">
             <div class="w-5 h-5 rounded-full border border-slate-100"></div>
             <span>Mengevaluasi standar kurikulum...</span>
          </div>
        </div>
      </div>

      <p class="text-[10px] text-slate-400 italic">Proses ini mungkin memakan waktu beberapa saat tergantung pada kompleksitas RPP Anda. Jangan tutup halaman ini.</p>
    </div>
  </div>
</template>
