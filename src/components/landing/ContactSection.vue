<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
</script>

<template>
  <div id="contact" class="bg-white py-16 px-4 md:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-[3.5rem] overflow-hidden shadow-[0_48px_80px_-16px_rgba(37,99,235,0.4)]">
        <div class="absolute top-12 left-12 grid grid-cols-4 gap-3 opacity-20">
          <div v-for="i in 12" :key="i" class="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        <div class="absolute bottom-12 right-12 grid grid-cols-4 gap-3 opacity-20">
          <div v-for="i in 12" :key="i" class="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>

        <div class="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div class="relative h-full flex items-end justify-center pt-16 md:pt-24">
            <img src="https://cdn.siap.id/s3/Asvri%20Adaptive%20Learning/img_login.png" alt="Teacher with laptop" class="w-full max-w-md h-auto object-contain relative z-10 drop-shadow-2xl translate-y-4" />

            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400 rounded-full blur-[100px] opacity-30"></div>
          </div>

          <div class="px-8 py-16 md:py-24 md:pr-24 space-y-10 text-center md:text-left">
            <h2 class="text-4xl md:text-6xl font-black text-white mb-4 leading-[1.1] tracking-tighter">Tingkatkan Pengalaman Mengajar Anda Bersama ASIQ</h2>
            <p class="text-blue-100 text-lg md:text-xl font-light leading-relaxed">Mari coba semua fitur canggih untuk rencana pembelajaran tanpa batas. Lebih cepat, lebih pintar, dan lebih produktif.</p>
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-6">
              <button class="bg-white text-blue-700 px-10 py-5 rounded-[1.5rem] font-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20 uppercase tracking-widest text-xs">Coba Sekarang</button>
              <button class="border-2 border-white/30 text-white px-10 py-5 rounded-[1.5rem] font-black hover:bg-white/10 active:scale-95 transition-all text-xs uppercase tracking-widest">Hubungi Kami</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
