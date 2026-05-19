<script setup lang="ts">
import { CheckCircle2, FileText, PenTool, BookOpen, Plus, LayoutDashboard, Clock, Zap, FolderOpen, Users } from "lucide-vue-next";

const emit = defineEmits(["start-rpp"]);

const stats = [
  { label: "Projek", value: 0, icon: FolderOpen, color: "bg-[#1e2b4d]" },
  { label: "Berkas", value: 0, icon: FileText, color: "bg-blue-500" },
  { label: "Tim Diklat", value: 0, icon: Users, color: "bg-slate-200" },
];
</script>

<template>
  <div class="space-y-8 max-w-7xl mx-auto">
    <div class="bg-white rounded-3xl p-10 border border-slate-200 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden group shadow-sm">
      <div class="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 opacity-50"></div>
      <div class="relative z-10 space-y-6 flex-grow">
        <div class="space-y-2">
          <h2 class="text-3xl font-black text-slate-900">
            Asisten Guru untuk <br />
            Pembelajaran Adaptif
          </h2>
          <p class="text-slate-500 max-w-md leading-relaxed">Buat RPP, materi dan soal sesuai karakteristik belajar siswa lebih cepat dan berikan instruksi tambahan sesuai kebutuhan.</p>
        </div>
        <p class="text-blue-600 font-bold text-lg">#SolusiBelajarAdaptif</p>

        <div class="flex flex-wrap gap-8 pt-4 border-t border-slate-100">
          <div class="flex items-center gap-2 text-slate-600 text-sm font-medium"><CheckCircle2 class="w-5 h-5 text-blue-500" /> Meaningful Learning</div>
          <div class="flex items-center gap-2 text-slate-600 text-sm font-medium"><CheckCircle2 class="w-5 h-5 text-blue-500" /> Mindful Learning</div>
          <div class="flex items-center gap-2 text-slate-600 text-sm font-medium"><CheckCircle2 class="w-5 h-5 text-blue-500" /> Joyful Learning</div>
        </div>
      </div>
      <div class="relative z-10 w-full lg:w-96 shrink-0 transform group-hover:scale-105 transition-all">
        <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2673&auto=format&fit=crop" class="w-full rounded-2xl shadow-2xl rotate-2" alt="Learning" />
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <button @click="emit('start-rpp')" class="p-8 bg-[#eddef2] rounded-3xl text-left border border-fuchsia-100 hover:shadow-xl hover:shadow-fuchsia-100 transition-all group flex flex-col gap-4">
        <div class="w-12 h-12 bg-white/50 backdrop-blur rounded-2xl flex items-center justify-center p-2.5">
          <FileText class="w-full h-full text-fuchsia-600" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 pr-8">AI Rencana Pembelajaran (RPP)</h3>
      </button>
      <button class="p-8 bg-[#e1daf5] rounded-3xl text-left border border-indigo-100 hover:shadow-xl hover:shadow-indigo-100 transition-all group flex flex-col gap-4">
        <div class="w-12 h-12 bg-white/50 backdrop-blur rounded-2xl flex items-center justify-center p-2.5">
          <PenTool class="w-full h-full text-indigo-600" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 pr-8">AI Soal Latihan</h3>
      </button>
      <button class="p-8 bg-[#fdf2e1] rounded-3xl text-left border border-orange-100 hover:shadow-xl hover:shadow-orange-100 transition-all group flex flex-col gap-4">
        <div class="w-12 h-12 bg-white/50 backdrop-blur rounded-2xl flex items-center justify-center p-2.5">
          <BookOpen class="w-full h-full text-orange-600" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 pr-8">AI Materi Ajar</h3>
      </button>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
        <div class="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div class="w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl">
          <Plus class="w-full h-full text-white" />
        </div>
        <div class="space-y-2">
          <h3 class="text-2xl font-black text-white">Mulailah dengan membuat proyek baru</h3>
          <p class="text-blue-100 text-sm">Kelola semua dokumen ajar dalam satu tempat mudah dan cepat</p>
        </div>
      </div>

      <div class="lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 space-y-8 flex flex-col">
        <div class="flex items-center gap-2">
          <LayoutDashboard class="w-5 h-5 text-slate-400" />
          <h3 class="text-lg font-bold text-slate-900">Rangkuman Aktivitas Anda</h3>
        </div>
        <div class="flex-grow space-y-6 flex flex-col justify-center">
          <div class="flex items-center gap-3">
            <Clock class="w-4 h-4 text-slate-400" />
            <span class="text-sm font-semibold text-slate-900">Resume Kinerja</span>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div v-for="stat in stats" :key="stat.label" class="flex flex-col items-center gap-4">
              <div :class="[stat.color, 'w-full aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-white shadow-lg overflow-hidden relative']">
                <component :is="stat.icon" class="w-6 h-6 opacity-30 absolute -right-2 -bottom-2" />
                <span class="text-2xl font-black relative z-10">{{ stat.value }}</span>
                <span class="text-[10px] font-bold uppercase tracking-widest relative z-10 opacity-70">{{ stat.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 space-y-8">
        <div class="flex items-center gap-2">
          <FolderOpen class="w-5 h-5 text-slate-400" />
          <h3 class="text-lg font-bold text-slate-900">Paket Berlangganan Anda</h3>
        </div>
        <div class="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-6">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md animate-pulse">
              <Zap class="w-8 h-8 text-blue-500" />
            </div>
            <div class="flex flex-col">
              <span class="text-lg font-black text-slate-900">Guru Inspiratif</span>
              <span class="text-xs text-slate-500">Premium Account</span>
            </div>
          </div>
          <button class="w-full py-4 text-sm font-bold text-blue-600 bg-white border border-slate-100 rounded-xl hover:shadow-lg transition-all">Kelola Paket Berlangganan</button>
        </div>
      </div>
    </div>
  </div>
</template>
