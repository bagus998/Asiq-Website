<script setup lang="ts">
const testimonials = [
  {
    name: "Ibu A. Suci Rizky Ananda",
    school: "UPTD SMKN 1 Rangas - Kab. Mamuju, Sulawesi Barat",
    text: '"ASIQ membantu saya menyiapkan RPP jauh lebih cepat. Waktu saya lebih banyak untuk mendampingi siswa."',
    img: "https://cdn.siap.id/s3/Asvri%20Adaptive%20Learning/testimoni/suci%20ananda.png?auto=compress&cs=tinysrgb&v=20260218",
  },
  {
    name: "Ibu Anita Octalia S",
    school: "SDI Surya Buana - Kota Malang, Jawa Timur",
    text: '"Dengan ASIQ membantu saya bisa membuat soal latihan siswa lebih cepat dan siap cetak."',
    img: "https://cdn.siap.id/s3/Asvri%20Adaptive%20Learning/testimoni/anita.png?auto=compress&cs=tinysrgb&v=20260218",
  },
  {
    name: "Bapak Hendra Adi Krisna",
    school: "UPT SD NEGERI SIRAMAN 04, Kab. Blitar, Jawa Timur",
    text: '"Hasil ASIQ RPP sesuai format deep learning & praktik pedagogis, latihan soal variatif."',
    img: "https://cdn.siap.id/s3/Asvri%20Adaptive%20Learning/testimoni/hendra.jpg?auto=compress&cs=tinysrgb&v=20260218",
  },
];
</script>

<template>
  <section id="testimoni" class="py-32 bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 text-center mb-20">
      <h2 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Ratusan Guru sudah merasakan manfaat <span class="text-blue-600">ASIQ</span></h2>
    </div>

    <div class="flex overflow-hidden relative">
      <!-- Gradient Masks -->
      <div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
      <div class="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

      <div class="flex gap-10 animate-marquee-ltr py-10 px-4">
        <div
          v-for="(tes, i) in [...testimonials, ...testimonials, ...testimonials]"
          :key="i"
          class="w-[32rem] bg-slate-50 p-12 rounded-[3.5rem] shadow-sm border border-slate-100 shrink-0 hover:bg-blue-50/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
        >
          <div class="flex items-center gap-6 mb-10">
            <div class="relative">
              <div class="absolute inset-0 bg-blue-100 rounded-full scale-110"></div>
              <img :src="tes.img" class="relative w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-xl" />
            </div>
            <div class="text-left">
              <h4 class="text-xl font-black text-slate-900">{{ tes.name }}</h4>
              <p class="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{{ tes.school }}</p>
            </div>
          </div>
          <p class="text-xl text-slate-600 font-medium italic leading-loose tracking-wide">{{ tes.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes marquee-ltr {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}
.animate-marquee-ltr {
  animation: marquee-ltr 80s linear infinite;
}
.animate-marquee-ltr:hover {
  animation-play-state: paused;
}
</style>
