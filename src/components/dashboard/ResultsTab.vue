<script setup lang="ts">
import { ref } from "vue";
import { CheckCircle2, PenTool, Download, Share2, Clock, BookOpen, Plus, ThumbsUp, ThumbsDown, Send } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { marked } from "marked";
import { downloadPDF } from "../../services/rppApi";
import { useRppState } from "../../composables/useRppState";
import { supabase } from "../../lib/supabase";

const router = useRouter();
const { recentRPP, currentJobId } = useRppState();

const currentRating = ref<"up" | "down" | null>(null);
const ratingReason = ref("");
const ratingSubmitted = ref(false);
const showReasonInput = ref(false);

const submitRating = async (isPositive: boolean, reason: string) => {
  try {
    if (!recentRPP.value.material_id) return;
    const { error } = await supabase
      .from("materials")
      .update({ rating: isPositive, rating_reason: reason })
      .eq("id", recentRPP.value.material_id);
    if (error) throw error;
  } catch (e: any) {
    console.error("Gagal mengirim rating:", e.message);
  }
};

const handleRating = async (type: "up" | "down") => {
  if (!recentRPP.value.material_id) {
    alert("Material ID belum tersedia, tidak dapat memberikan rating.");
    return;
  }
  
  if (type === "up") {
    currentRating.value = "up";
    await submitRating(true, "");
    ratingSubmitted.value = true;
  } else {
    currentRating.value = "down";
    showReasonInput.value = true;
  }
};

const submitNegativeRating = async () => {
  if (!ratingReason.value) return;
  await submitRating(false, ratingReason.value);
  ratingSubmitted.value = true;
  showReasonInput.value = false;
};

marked.setOptions({ breaks: true, gfm: true });

const md = (text: string) => {
  if (!text) return "";
  // Remove stray '**' alone on a line or at the beginning of the text
  let cleanText = text.replace(/(^|\n)\s*\*\*\s*(?=\n|$)/g, '\n');
  // Also clean up any leading newlines that might be left
  cleanText = cleanText.trimStart();
  return marked.parse(cleanText) as string;
};

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
    <!-- Header -->
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
            <button @click="router.push('/dashboard/rpp')" class="px-5 py-3 border-2 border-blue-100 rounded-xl text-blue-600 font-extrabold flex items-center gap-2 hover:bg-blue-50 transition-all"><PenTool class="w-4 h-4" /> Edit RPP</button>
            <button @click="handleDownload" class="px-5 py-3 bg-blue-600 text-white rounded-xl font-extrabold flex items-center gap-2 hover:shadow-xl hover:shadow-blue-200 transition-all"><Download class="w-4 h-4" /> Unduh PDF</button>
            <button class="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
              <Share2 class="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Score Cards -->
    <div class="grid lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 text-center space-y-8 flex flex-col items-center justify-center min-h-[350px]">
        <h3 class="text-xl font-bold text-slate-900">Readability Score</h3>
        <div class="relative flex items-center justify-center">
          <svg class="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="12" fill="transparent" class="text-slate-100" />
            <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="12" fill="transparent" :stroke-dasharray="2 * Math.PI * 80" :stroke-dashoffset="2 * Math.PI * 80 * (1 - recentRPP.readability / 100)" stroke-linecap="round" class="text-blue-600" />
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
            <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="12" fill="transparent" :stroke-dasharray="2 * Math.PI * 80" :stroke-dashoffset="2 * Math.PI * 80 * (1 - recentRPP.accessibility / 100)" stroke-linecap="round" class="text-blue-600 shadow-xl" />
          </svg>
          <div class="absolute flex flex-col items-center">
            <span class="text-5xl font-black text-slate-900">{{ recentRPP.accessibility }}</span>
            <span class="text-xs font-bold text-slate-400">/100</span>
          </div>
        </div>
        <div :class="['px-6 py-2 rounded-full text-xs font-bold', getConfidenceColor(recentRPP.accessibility)]">{{ getConfidenceLabel(recentRPP.accessibility) }}</div>
      </div>
    </div>

    <!-- Kekuatan Utama & Sumber Belajar -->
    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Kekuatan Utama -->
      <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 space-y-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><CheckCircle2 class="w-6 h-6" /></div>
          <h3 class="text-2xl font-black text-slate-900">Kekuatan Utama</h3>
        </div>
        <div class="space-y-8">
          <div v-for="item in recentRPP.strengths" :key="item.title">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 shrink-0 flex items-center justify-center text-blue-600">
                <Clock class="w-4 h-4" />
              </div>
              <h4 class="font-bold text-slate-900">{{ item.title }}</h4>
            </div>
            <div class="prose-content" v-html="md(item.desc)"></div>
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
          <div v-for="res in recentRPP.resources" :key="res.name">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <BookOpen class="w-4 h-4" />
              </div>
              <h4 class="font-bold text-slate-900">{{ res.name }}</h4>
            </div>
            <div class="prose-content" v-html="md(res.type)"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Evaluasi & Bottom Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 bg-white border border-slate-200 rounded-3xl mt-8">
      <div v-if="!ratingSubmitted && !showReasonInput" class="flex items-center gap-4">
        <span class="font-bold text-slate-700">Bagaimana hasil adaptasi materi ini?</span>
        <button @click="handleRating('up')" class="p-3 bg-white border border-slate-200 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all group"><ThumbsUp class="w-5 h-5 text-slate-400 group-hover:text-emerald-500" /></button>
        <button @click="handleRating('down')" class="p-3 bg-white border border-slate-200 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all group"><ThumbsDown class="w-5 h-5 text-slate-400 group-hover:text-red-500" /></button>
      </div>

      <div v-else-if="showReasonInput && !ratingSubmitted" class="flex-grow w-full max-w-xl flex flex-col gap-3">
        <span class="font-bold text-slate-700">Mohon beritahu kami bagian mana yang perlu diperbaiki:</span>
        <div class="flex gap-2">
          <input v-model="ratingReason" type="text" placeholder="Alasan (contoh: RPP terlalu panjang)..." class="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" />
          <button @click="submitNegativeRating" class="px-5 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700"><Send class="w-4 h-4" /> Kirim</button>
        </div>
      </div>

      <div v-else-if="ratingSubmitted" class="flex items-center gap-3 text-emerald-600 font-bold bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-100">
        <CheckCircle2 class="w-5 h-5" /> Terima kasih atas penilaian Anda!
      </div>

      <div class="ml-auto flex items-center">
        <button @click="router.push('/dashboard')" class="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 shadow-2xl shadow-blue-200"><Plus class="w-5 h-5" /> Buat Baru</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose-content {
  font-size: 0.875rem;
  line-height: 1.75;
  color: #475569;
}

.prose-content :deep(h1) {
  font-size: 1.125rem;
  font-weight: 800;
  color: #0f172a;
  margin: 1.25rem 0 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}
.prose-content :deep(h2) {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 1rem 0 0.4rem;
}
.prose-content :deep(h3) {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #334155;
  margin: 0.75rem 0 0.35rem;
}

.prose-content :deep(p) {
  margin-bottom: 0.5rem;
}
.prose-content :deep(strong) {
  color: #1e293b;
  font-weight: 600;
}

.prose-content :deep(ul),
.prose-content :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.625rem;
}
.prose-content :deep(ul) { list-style: disc; }
.prose-content :deep(ol) { list-style: decimal; }
.prose-content :deep(li) {
  margin-bottom: 0.25rem;
}

.prose-content :deep(hr) {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 0.75rem 0;
}

.prose-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.prose-content :deep(blockquote) {
  border-left: 3px solid #3b82f6;
  padding-left: 0.75rem;
  margin: 0.5rem 0;
  font-style: italic;
  color: #64748b;
}

.prose-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
  margin: 0.75rem 0;
}
.prose-content :deep(thead) {
  background: #f1f5f9;
}
.prose-content :deep(th) {
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #334155;
  border-bottom: 2px solid #e2e8f0;
}
.prose-content :deep(td) {
  padding: 0.4rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
}
.prose-content :deep(tr:hover) {
  background: #f8fafc;
}

.prose-content :deep(code) {
  background: #f1f5f9;
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
  font-size: 0.8125rem;
  color: #2563eb;
}
.prose-content :deep(pre) {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.75rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}
.prose-content :deep(pre code) {
  background: transparent;
  padding: 0;
  color: #334155;
}
</style>
