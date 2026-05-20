<script setup lang="ts">
import { Zap, School, ArrowRight, ChevronLeft, ChevronRight } from "lucide-vue-next";
import { ref, onMounted, onUnmounted } from "vue";

const events = [
  {
    title: "Pembelajaran Mendalam Kota Malang",
    date: "Selasa, 5 Agustus 2025",
    loc: "Ruang Dr. Sutomo, Kota Malang",
    source: "Dinas Pendidikan & Kebudayaan Kota Malang",
    img: "https://cdn.siap.id/s3/Asvri%20Adaptive%20Learning/Event/dinas.jpg?auto=compress&cs=tinysrgb&v=20260218",
  },
  {
    title: "Pelatihan ASVRI EDU - Charis National Academy",
    date: "5-10 Agustus 2025",
    loc: "Charis National Academy",
    source: "Instagram ASIQ",
    img: "https://cdn.siap.id/s3/Asvri%20Adaptive%20Learning/Event/charis.jpg?auto=compress&cs=tinysrgb&v=20260218",
  },
  {
    title: "Pelatihan ASVRI EDU - SD Plus Al Kautsar Malang",
    date: "5-10 Agustus 2025",
    loc: "SD Plus Al Kautsar Malang",
    source: "Instagram ASIQ",
    img: "https://cdn.siap.id/s3/Asvri%20Adaptive%20Learning/Event/kauman.png?auto=compress&cs=tinysrgb&v=20260218",
  },
];

// State untuk melacak gambar yang sedang aktif
const currentIndex = ref(0);
let autoPlayInterval: ReturnType<typeof setInterval> | null = null;

// Fungsi untuk pindah ke slide berikutnya
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % events.length;
};

// Fungsi untuk mundur ke slide sebelumnya
const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + events.length) % events.length;
};

// Fungsi untuk memulai autoplay (ganti gambar setiap 3 detik)
const startAutoPlay = () => {
  autoPlayInterval = setInterval(nextSlide, 3000);
};

// Fungsi untuk menghentikan autoplay
const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
};

// Jalankan autoplay saat komponen dimuat
onMounted(() => {
  startAutoPlay();
});

// Bersihkan interval saat komponen dihancurkan agar tidak terjadi memory leak
onUnmounted(() => {
  stopAutoPlay();
});
</script>

<template>
  <div class="max-w-5xl mx-auto w-full p-4">
    <div class="relative overflow-hidden rounded-[2rem] shadow-xl group bg-slate-100" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
      <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(event, index) in events" :key="index" class="min-w-full flex-shrink-0 relative h-[400px]">
          <img :src="event.img" :alt="event.title" class="w-full h-full object-cover" />

          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
            <span class="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full w-max mb-3">
              {{ event.date }}
            </span>
            <h3 class="text-2xl font-black text-white mb-2">{{ event.title }}</h3>
            <div class="flex items-center gap-4 text-slate-200 text-sm">
              <span class="flex items-center gap-1">📍 {{ event.loc }}</span>
              <span class="flex items-center gap-1">📝 {{ event.source }}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        @click="prevSlide"
        class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>

      <button
        @click="nextSlide"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
      >
        <ChevronRight class="w-6 h-6" />
      </button>

      <div class="absolute bottom-6 right-8 flex gap-2">
        <button
          v-for="(_, index) in events"
          :key="'dot-' + index"
          @click="currentIndex = index"
          :class="['h-2 rounded-full transition-all duration-300', currentIndex === index ? 'bg-blue-500 w-8' : 'bg-white/50 w-2 hover:bg-white/80']"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
