<script setup lang="ts">
import { Sparkles, ArrowRight, Play } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-blue-900 via-cyan-800 to-violet-900 pb-24 pt-24 min-h-[85vh] flex items-center">
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -right-24 -top-44 h-[38rem] w-[38rem] rounded-full bg-cyan-300/25 blur-3xl opacity-50"></div>
      <div class="absolute -bottom-56 -left-40 h-[36rem] w-[36rem] rounded-full bg-indigo-400/25 blur-3xl opacity-50"></div>
    </div>
    
    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 items-center gap-16 text-white md:grid-cols-2 lg:grid-cols-2">
        <div class="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/35 bg-amber-300 px-5 py-2 text-sm font-bold text-gray-900 shadow-xl">
            <Sparkles class="h-4 w-4" />
            <span>Mendukung Pembelajaran Mendalam</span>
          </div>
          
          <h1 class="text-4xl font-black leading-tight md:text-6xl tracking-tight">
            <span class="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              AI Support Instructional Quality
            </span>
          </h1>
          
          <div class="space-y-4">
            <p class="text-xl font-light leading-relaxed text-white/90 md:text-2xl">
              Buat RPP, materi ajar, dan soal lebih mudah dengan bantuan ASIQ
            </p>
            <p class="max-w-xl text-lg leading-relaxed text-white/85">
              ASIQ membantu guru Indonesia menyusun RPP terstruktur, materi pembelajaran, dan soal sebagai bagian dari pengembangan kompetensi dan profesionalisme guru sesuai Kurikulum Nasional.
            </p>
          </div>

          <div class="flex flex-col gap-4 sm:flex-row pt-4">
            <button @click="router.push('/login')" class="flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-black text-blue-700 shadow-2xl transition hover:bg-gray-100 hover:scale-105 active:scale-95">
              <span>Coba Gratis</span>
              <ArrowRight class="h-5 w-5" />
            </button>
            <a href="https://youtube.com/@official_asiq" target="_blank" class="flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-md transition hover:bg-white/20 hover:scale-105 active:scale-95">
              <Play class="h-5 w-5 fill-white" />
              <span>Lihat Video</span>
            </a>
          </div>
        </div>

        <div class="relative group animate-in fade-in slide-in-from-right duration-1000">
          <div class="absolute -inset-4 bg-blue-400/20 rounded-[2.5rem] blur-2xl group-hover:opacity-40 transition duration-700"></div>
          <div class="relative aspect-video w-full overflow-hidden rounded-2xl border-4 border-white/10 shadow-2xl">
            <button type="button" aria-label="Putar video demo ASIQ" class="group/btn relative h-full w-full">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670" alt="Thumbnail video demo ASIQ" class="h-full w-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-black/20 group-hover/btn:bg-black/40 transition duration-300"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="flex items-center gap-3 bg-white px-8 py-4 rounded-full font-black text-blue-700 shadow-2xl transform transition group-hover/btn:scale-110">
                  <Play class="h-6 w-6 fill-blue-700" />
                  <span>Putar Demo</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
