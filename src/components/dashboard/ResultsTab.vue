<script setup lang="ts">
import { CheckCircle2, PenTool, Download, Share2, Clock, BookOpen, Plus } from "lucide-vue-next";
import { downloadPDF } from "../../services/rppApi";

export interface RecentRPP {
  title: string;
  subText: string;
  readability: number;
  accessibility: number;
  strengths: Array<{ title: string; desc: string }>;
  resources: Array<{ name: string; type: string; icon: any }>;
  pdf_url: string | null;
}

const props = defineProps<{
  recentRPP: RecentRPP;
  currentJobId: string | null;
}>();

const emit = defineEmits<{
  (e: "create-new"): void;
}>();

const getConfidenceLabel = (score: number) => {
  if (score <= 20) return "Very Low Confidence";
  if (score <= 40) return "Low Confidence";
  if (score <= 60) return "Moderate Confidence";
  if (score <= 80) return "High Confidence";
  return "Very High Confidence";
};

const getConfidenceColor = (score: number) => {
  if (score <= 20) return "bg-red-50 text-red-600";
  if (score <= 40) return "bg-orange-50 text-orange-600";
  if (score <= 60) return "bg-yellow-50 text-yellow-600";
  if (score <= 80) return "bg-blue-50 text-blue-600";
  return "bg-green-50 text-green-600";
};

const handleDownload = async () => {
  if (props.recentRPP.pdf_url) {
    const a = document.createElement("a");
    a.href = props.recentRPP.pdf_url;
    a.download = "RPP.pdf";
    a.target = "_blank";
    a.click();
    return;
  }
  if (!props.currentJobId) return;
  try {
    const blob = await downloadPDF(props.currentJobId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "RPP.pdf";
    a.click();
    URL.revokeObjectURL(url);
  } catch (e: any) {
    alert("Gagal download: " + e.message);
  }
};
</script>

<template>
  <div class="space-y-10 max-w-7xl mx-auto pb-20">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="p-8 bg-white rounded-[2rem] border-2 border-blue-50 flex-grow shadow-sm relative overflow-hidden">
        <div class="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
        <div class="flex items-center gap-2 text-blue-600 font-bold text-xs mb-4"><CheckCircle2 class="w-4 h-4" /> Analisis Selesai</div>
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <h1 class="text-3xl font-black text-slate-900">{{ recentRPP.title }}</h1>
            <p class="text-slate-500 max-w-xl">{{ recentRPP.subText }}</p>
          </div>
          <div class="flex gap-3">
            <button class="px-5 py-3 border-2 border-blue-100 rounded-xl text-blue-600 font-extrabold flex items-center gap-2 hover:bg-blue-50 transition-all"><PenTool class="w-4 h-4" /> Edit RPP</button>
            <button @click="handleDownload" class="px-5 py-3 bg-blue-600 text-white rounded-xl font-extrabold flex items-center gap-2 hover:shadow-xl hover:shadow-blue-200 transition-all"><Download class="w-4 h-4" /> Unduh PDF</button>
            <button class="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
              <Share2 class="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 text-center space-y-8 flex flex-col items-center justify-center min-h-[350px]">
        <h3 class="text-xl font-bold text-slate-900">Readability Score</h3>
        <div class="relative flex items-center justify-center">
          <svg class="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="12" fill="transparent" class="text-slate-100" />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              stroke-width="12"
              fill="transparent"
              :stroke-dasharray="2 * Math.PI * 80"
              :stroke-dashoffset="2 * Math.PI * 80 * (1 - recentRPP.readability / 100)"
              stroke-linecap="round"
              class="text-blue-600"
            />
          </svg>
          <div class="absolute flex flex-col items-center">
            <span class="text-5xl font-black text-slate-900">{{ recentRPP.readability }}</span>
            <span class="text-xs font-bold text-slate-400">/100</span>
          </div>
        </div>
        <div :class="['px-6 py-2 rounded-full text-xs font-bold', getConfidenceColor(recentRPP.readability)]">{{ getConfidenceLabel(recentRPP.readability) }}</div>
      </div>

      <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 text-center space-y-8 flex flex-col items-center justify-center min-h-[350px]">
        <h3 class="text-xl font-bold text-slate-900">Web Content Accessibility Guidelines</h3>
        <div class="relative flex items-center justify-center">
          <svg class="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="12" fill="transparent" class="text-slate-100" />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              stroke-width="12"
              fill="transparent"
              :stroke-dasharray="2 * Math.PI * 80"
              :stroke-dashoffset="2 * Math.PI * 80 * (1 - recentRPP.accessibility / 100)"
              stroke-linecap="round"
              class="text-blue-600 shadow-xl"
            />
          </svg>
          <div class="absolute flex flex-col items-center">
            <span class="text-5xl font-black text-slate-900">{{ recentRPP.accessibility }}</span>
            <span class="text-xs font-bold text-slate-400">/100</span>
          </div>
        </div>
        <div :class="['px-6 py-2 rounded-full text-xs font-bold', getConfidenceColor(recentRPP.accessibility)]">{{ getConfidenceLabel(recentRPP.accessibility) }}</div>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Kekuatan Utama -->
      <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 space-y-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><CheckCircle2 class="w-6 h-6" /></div>
          <h3 class="text-2xl font-black text-slate-900">Kekuatan Utama</h3>
        </div>
        <div class="space-y-8">
          <div v-for="item in recentRPP.strengths" :key="item.title" class="flex gap-4">
            <div class="w-8 h-8 rounded-full bg-blue-100 shrink-0 flex items-center justify-center text-blue-600 font-bold text-xs shadow-inner">
              <Clock class="w-4 h-4" />
            </div>
            <div class="space-y-1">
              <h4 class="font-bold text-slate-900">{{ item.title }}</h4>
              <p class="text-sm text-slate-500 leading-relaxed">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sumber Belajar Terkait -->
      <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 space-y-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><BookOpen class="w-6 h-6" /></div>
          <h3 class="text-2xl font-black text-slate-900">Sumber Belajar Terkait</h3>
        </div>
        <div class="space-y-4">
          <div v-for="res in recentRPP.resources" :key="res.name" class="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all group cursor-pointer">
            <div class="w-14 h-14 bg-slate-900/5 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <component :is="res.icon" class="w-6 h-6" />
            </div>
            <div class="flex-grow">
              <h4 class="font-bold text-slate-900">{{ res.name }}</h4>
              <p class="text-xs text-slate-400">{{ res.type }}</p>
            </div>
            <div class="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-blue-600">
              <Download class="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Button -->
    <div class="flex justify-start">
      <button @click="emit('create-new')" class="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 shadow-2xl shadow-blue-200"><Plus class="w-5 h-5" /> Buat Baru</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, PenTool, Download, Share2, Clock, BookOpen, Plus } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { downloadPDF } from "../../services/rppApi";
import { useRppState } from "../../composables/useRppState";

const router = useRouter();
const { recentRPP, currentJobId } = useRppState();

const getConfidenceLabel = (score: number) => {
  if (score <= 20) return "Very Low Confidence";
  if (score <= 40) return "Low Confidence";
  if (score <= 60) return "Moderate Confidence";
  if (score <= 80) return "High Confidence";
  return "Very High Confidence";
};

const getConfidenceColor = (score: number) => {
  if (score <= 20) return "bg-red-50 text-red-600";
  if (score <= 40) return "bg-orange-50 text-orange-600";
  if (score <= 60) return "bg-yellow-50 text-yellow-600";
  if (score <= 80) return "bg-blue-50 text-blue-600";
  return "bg-green-50 text-green-600";
};

const handleDownload = async () => {
  if (recentRPP.value.pdf_url) {
    const a = document.createElement("a");
    a.href = recentRPP.value.pdf_url;
    a.download = "RPP.pdf";
    a.target = "_blank";
    a.click();
    return;
  }
  if (!currentJobId.value) return;
  try {
    const blob = await downloadPDF(currentJobId.value);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "RPP.pdf";
    a.click();
    URL.revokeObjectURL(url);
  } catch (e: any) {
    alert("Gagal download: " + e.message);
  }
};
</script>

<template>
  <div class="space-y-10 max-w-7xl mx-auto pb-20">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="p-8 bg-white rounded-[2rem] border-2 border-blue-50 flex-grow shadow-sm relative overflow-hidden">
        <div class="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
        <div class="flex items-center gap-2 text-blue-600 font-bold text-xs mb-4"><CheckCircle2 class="w-4 h-4" /> Analisis Selesai</div>
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <h1 class="text-3xl font-black text-slate-900">{{ recentRPP.title }}</h1>
            <p class="text-slate-500 max-w-xl">{{ recentRPP.subText }}</p>
          </div>
          <div class="flex gap-3">
            <button class="px-5 py-3 border-2 border-blue-100 rounded-xl text-blue-600 font-extrabold flex items-center gap-2 hover:bg-blue-50 transition-all"><PenTool class="w-4 h-4" /> Edit RPP</button>
            <button @click="handleDownload" class="px-5 py-3 bg-blue-600 text-white rounded-xl font-extrabold flex items-center gap-2 hover:shadow-xl hover:shadow-blue-200 transition-all"><Download class="w-4 h-4" /> Unduh PDF</button>
            <button class="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
              <Share2 class="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 text-center space-y-8 flex flex-col items-center justify-center min-h-[350px]">
        <h3 class="text-xl font-bold text-slate-900">Readability Score</h3>
        <div class="relative flex items-center justify-center">
          <svg class="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="12" fill="transparent" class="text-slate-100" />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              stroke-width="12"
              fill="transparent"
              :stroke-dasharray="2 * Math.PI * 80"
              :stroke-dashoffset="2 * Math.PI * 80 * (1 - recentRPP.readability / 100)"
              stroke-linecap="round"
              class="text-blue-600"
            />
          </svg>
          <div class="absolute flex flex-col items-center">
            <span class="text-5xl font-black text-slate-900">{{ recentRPP.readability }}</span>
            <span class="text-xs font-bold text-slate-400">/100</span>
          </div>
        </div>
        <div :class="['px-6 py-2 rounded-full text-xs font-bold', getConfidenceColor(recentRPP.readability)]">{{ getConfidenceLabel(recentRPP.readability) }}</div>
      </div>

      <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 text-center space-y-8 flex flex-col items-center justify-center min-h-[350px]">
        <h3 class="text-xl font-bold text-slate-900">Web Content Accessibility Guidelines</h3>
        <div class="relative flex items-center justify-center">
          <svg class="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="12" fill="transparent" class="text-slate-100" />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              stroke-width="12"
              fill="transparent"
              :stroke-dasharray="2 * Math.PI * 80"
              :stroke-dashoffset="2 * Math.PI * 80 * (1 - recentRPP.accessibility / 100)"
              stroke-linecap="round"
              class="text-blue-600 shadow-xl"
            />
          </svg>
          <div class="absolute flex flex-col items-center">
            <span class="text-5xl font-black text-slate-900">{{ recentRPP.accessibility }}</span>
            <span class="text-xs font-bold text-slate-400">/100</span>
          </div>
        </div>
        <div :class="['px-6 py-2 rounded-full text-xs font-bold', getConfidenceColor(recentRPP.accessibility)]">{{ getConfidenceLabel(recentRPP.accessibility) }}</div>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Kekuatan Utama -->
      <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 space-y-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><CheckCircle2 class="w-6 h-6" /></div>
          <h3 class="text-2xl font-black text-slate-900">Kekuatan Utama</h3>
        </div>
        <div class="space-y-8">
          <div v-for="item in recentRPP.strengths" :key="item.title" class="flex gap-4">
            <div class="w-8 h-8 rounded-full bg-blue-100 shrink-0 flex items-center justify-center text-blue-600 font-bold text-xs shadow-inner">
              <Clock class="w-4 h-4" />
            </div>
            <div class="space-y-1">
              <h4 class="font-bold text-slate-900">{{ item.title }}</h4>
              <p class="text-sm text-slate-500 leading-relaxed">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sumber Belajar Terkait -->
      <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 space-y-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><BookOpen class="w-6 h-6" /></div>
          <h3 class="text-2xl font-black text-slate-900">Sumber Belajar Terkait</h3>
        </div>
        <div class="space-y-4">
          <div v-for="res in recentRPP.resources" :key="res.name" class="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all group cursor-pointer">
            <div class="w-14 h-14 bg-slate-900/5 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <component :is="res.icon" class="w-6 h-6" />
            </div>
            <div class="flex-grow">
              <h4 class="font-bold text-slate-900">{{ res.name }}</h4>
              <p class="text-xs text-slate-400">{{ res.type }}</p>
            </div>
            <div class="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-blue-600">
              <Download class="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Button -->
    <div class="flex justify-start">
      <button @click="router.push('/dashboard')" class="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 shadow-2xl shadow-blue-200"><Plus class="w-5 h-5" /> Buat Baru</button>
    </div>
  </div>
</template>
