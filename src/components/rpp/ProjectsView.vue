<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Plus, LayoutGrid, List, FileText, Download, Clock, BookOpen, User, Eye } from "lucide-vue-next";
import { supabase } from "../../lib/supabase";
import { useRppState } from "../../composables/useRppState";

const router = useRouter();
const { loadFromHistory } = useRppState();
const viewMode = ref<"grid" | "list">("grid");
const projects = ref<any[]>([]);
const isLoading = ref(true);

const fetchProjects = async () => {
  isLoading.value = true;
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return;

    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .eq("user_id", sessionData.session.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    projects.value = data || [];
  } catch (e: any) {
    console.error("Error fetching projects", e);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
};

import { downloadPDF } from "../../services/rppApi";

const isValidJobId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const openPdf = async (e: Event, pdfUrl: string) => {
  e.stopPropagation();
  if (!pdfUrl) {
    alert("PDF belum tersedia untuk RPP ini.");
    return;
  }

  if (pdfUrl.startsWith("http")) {
    window.open(pdfUrl, "_blank");
    return;
  }

  if (!isValidJobId(pdfUrl)) {
    alert("PDF belum tersedia untuk RPP ini.");
    return;
  }

  try {
    const blob = await downloadPDF(pdfUrl);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "RPP.pdf";
    a.click();
    URL.revokeObjectURL(url);
  } catch (err: any) {
    alert("Gagal mengunduh PDF: " + err.message);
  }
};

const openProjectDetail = (project: any) => {
  loadFromHistory(project, router);
};

onMounted(() => {
  fetchProjects();
});
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

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-24">
      <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Data State -->
    <div v-else-if="projects.length > 0">
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in projects" :key="project.id" @click="openProjectDetail(project)" class="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col h-full cursor-pointer group">
          <div class="flex items-start justify-between mb-4">
            <div class="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
              <FileText class="w-6 h-6" />
            </div>
            <div class="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Clock class="w-3.5 h-3.5" />
              {{ formatDate(project.created_at) }}
            </div>
          </div>
          
          <div class="flex-grow space-y-1">
            <h3 class="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-blue-700 transition-colors">
              RPP Inklusif — {{ project.nama_siswa || 'Siswa' }}
            </h3>
            <p class="text-sm text-slate-500 flex items-center gap-1.5">
              <BookOpen class="w-4 h-4" /> {{ project.mata_pelajaran || 'Mata Pelajaran' }} · {{ project.kelas || 'Kelas' }}
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div class="flex gap-3">
              <div class="flex flex-col">
                <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Readability</span>
                <span class="text-sm font-bold text-slate-700">{{ project.readability_score || 0 }}/100</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Aksesibilitas</span>
                <span class="text-sm font-bold text-slate-700">{{ project.accessibility_score || 0 }}/100</span>
              </div>
            </div>
            
            <button @click="openPdf($event, project.pdf_url)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors z-10" title="Download PDF">
              <Download class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Dokumen</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mata Pelajaran</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Skor</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal Dibuat</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="project in projects" :key="project.id" @click="openProjectDetail(project)" class="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 group-hover:bg-blue-100">
                      <FileText class="w-5 h-5" />
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900 group-hover:text-blue-700">RPP Inklusif — {{ project.nama_siswa || 'Siswa' }}</p>
                      <p class="text-xs text-slate-500">Kelas {{ project.kelas || '-' }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 text-sm text-slate-700">
                  {{ project.mata_pelajaran || '-' }}
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-4">
                    <div class="text-xs">
                      <span class="text-slate-500">Baca:</span> <span class="font-bold text-slate-700">{{ project.readability_score || 0 }}</span>
                    </div>
                    <div class="text-xs">
                      <span class="text-slate-500">Akses:</span> <span class="font-bold text-slate-700">{{ project.accessibility_score || 0 }}</span>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 text-sm text-slate-600">
                  {{ formatDate(project.created_at) }}
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click.stop="openProjectDetail(project)" class="inline-flex items-center justify-center p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Lihat Detail">
                      <Eye class="w-4 h-4" />
                    </button>
                    <button @click="openPdf($event, project.pdf_url)" class="inline-flex items-center justify-center p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download PDF">
                      <Download class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-24 space-y-5">
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
