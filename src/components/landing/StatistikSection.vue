<script setup lang="ts">
const books = [
  "https://intechpress.itts.ac.id/wp-content/uploads/2025/08/BUKU-AI-SMP-Kelas-8-Semester-1-Google-Dokumen-212x300.jpg?v=20260218",
  "https://intechpress.itts.ac.id/wp-content/uploads/2025/08/BUKU-AI-SMP-Kelas-9-Semester-2-Google-Dokumen-212x300.jpg?v=20260218",
  "https://cdn.siap.id/s3/Asvri%20Adaptive%20Learning/BSE/Pengembangan_Diri_BG_Cover.png?auto=compress&cs=tinysrgb&v=20260218",
  "https://cdn.siap.id/s3/Asvri%20Adaptive%20Learning/BSE/Pembelajaran_Orientasi_Mobilitas_BG_Cover.png?auto=compress&cs=tinysrgb&v=20260218",
  "https://cdn.siap.id/s3/Asvri%20Adaptive%20Learning/BSE/Dasar-Dasar_Teknika_Kapal_Niaga_BS_Kelas_X_Cover.png?auto=compress&cs=tinysrgb&v=20260218",
  "https://cdn.siap.id/s3/Asvri%20Adaptive%20Learning/BSE/Dasar_Teknika_Kapal_Penangkap_Ikan_BG_Kelas_X_Cover.png?auto=compress&cs=tinysrgb&v=20260218",
];
</script>

<template>
  <section id="statistik" class="py-32 bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 text-center mb-24 space-y-6">
      <span class="bg-blue-50 text-blue-800 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest ring-1 ring-blue-100">BSE & Buku AI</span>
      <h2 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Dukungan Pengetahuan Lokal</h2>
      <p class="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed font-medium">
        Terintegrasi langsung dengan ratusan Buku Sekolah Elektronik (BSE) dan Buku AI resmi, mendukung kompetensi melalui pemanfaatan sumber belajar resmi, relevan, dan sesuai kurikulum.
      </p>
    </div>

    <div class="relative flex flex-col gap-12">
      <!-- Line 1: RTL -->
      <div class="flex overflow-hidden">
        <div class="flex gap-8 animate-marquee-rtl py-4 hover:[animation-play-state:paused] pointer-events-none">
          <div
            v-for="(img, i) in [...books, ...books, ...books]"
            :key="i"
            class="w-48 h-[18rem] shrink-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 pointer-events-auto transform transition duration-500 hover:scale-110 hover:-rotate-2 rotate-2"
          >
            <img :src="img" class="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>

      <!-- Line 2: LTR -->
      <div class="flex overflow-hidden">
        <div class="flex gap-8 animate-marquee-ltr py-4 hover:[animation-play-state:paused] pointer-events-none">
          <div
            v-for="(img, i) in [...books.reverse(), ...books, ...books]"
            :key="i"
            class="w-48 h-[18rem] shrink-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 pointer-events-auto transform transition duration-500 hover:scale-110 hover:rotate-2 -rotate-2"
          >
            <img :src="img" class="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes marquee-rtl {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes marquee-ltr {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}

.animate-marquee-rtl {
  animation: marquee-rtl 60s linear infinite;
}

.animate-marquee-ltr {
  animation: marquee-ltr 60s linear infinite;
}
</style>
