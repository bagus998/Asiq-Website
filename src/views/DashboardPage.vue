<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { supabase } from "../lib/supabase";
import { useRouter } from "vue-router";
import { generateRPP, checkStatus, getResult, downloadPDF } from "../services/rppApi";
import { HelpCircle } from "lucide-vue-next";

import Sidebar from "../components/layout/Sidebar.vue";
import TopHeader from "../components/layout/TopHeader.vue";
import DashboardHome from "../components/rpp/DashboardHome.vue";
import RppForm from "../components/rpp/RppForm.vue";
import ProcessingState from "../components/rpp/ProcessingState.vue";
import RppResult from "../components/rpp/RppResult.vue";

const router = useRouter();
const activeTab = ref("dashboard"); // 'dashboard', 'rpp-form', 'processing', 'results'
const activeMenu = ref("Dasbor");
const userEmail = ref("");

const currentJobId = ref<string | null>(null);
let pollingInterval: ReturnType<typeof setInterval> | null = null;

const recentRPP = ref({
  title: "",
  subText: "",
  readability: 0,
  accessibility: 0,
  strengths: [] as Array<{ title: string; desc: string }>,
  resources: [] as Array<{ name: string; type: string; icon: any }>,
  pdf_url: null as string | null,
});

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    router.push("/");
  } else {
    userEmail.value = data.session.user.email || "";
  }
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push("/");
};

const handleNavigation = (menuName: string) => {
  activeMenu.value = menuName;
  activeTab.value = "dashboard";
};

// Menerima data dari RppForm
const processRPP = async (formData: any) => {
  activeTab.value = "processing";

  try {
    const job = await generateRPP({
      nama_siswa: formData.namaSiswa,
      kelas: formData.selectedJenjang,
      mata_pelajaran: formData.selectedMataPelajaran,
      gejala: formData.selectedDisabilitas + (formData.studentProfile ? ": " + formData.studentProfile : ""),
      materi_mentah: formData.rawMaterial || undefined,
    });
    currentJobId.value = job.job_id;

    pollingInterval = setInterval(async () => {
      try {
        const status = await checkStatus(job.job_id);
        const s = status.status.toLowerCase();

        if (s === "completed" || s === "done" || s === "finished") {
          clearInterval(pollingInterval!);
          pollingInterval = null;
          const r = await getResult(job.job_id);

          recentRPP.value = {
            title: `RPP Inklusif — ${r.nama_siswa}`,
            subText: `${r.mata_pelajaran} · ${r.kelas}`,
            readability: r.readability_score,
            accessibility: r.wcag_score,
            strengths: [
              { title: "Profil Siswa", desc: r.profiling },
              { title: "Strategi Adaptif", desc: r.adaptive },
            ],
            resources: [{ name: "Insight AI", type: r.insight, icon: "FileText" }],
            pdf_url: r.pdf_url,
          };

          // Simpan ke Supabase
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session) {
            await supabase.from("materials").insert({
              user_id: sessionData.session.user.id,
              raw_content: formData.rawMaterial,
              student_profile: formData.studentProfile,
              readability_score: r.readability_score,
              accessibility_score: r.wcag_score,
            });
          }

          activeTab.value = "results";
        } else if (s === "failed" || s === "error") {
          clearInterval(pollingInterval!);
          pollingInterval = null;
          alert("Terjadi kesalahan saat memproses RPP. Coba lagi.");
          activeTab.value = "rpp-form";
        }
      } catch (e: any) {
        clearInterval(pollingInterval!);
        pollingInterval = null;
        alert("Error: " + e.message);
        activeTab.value = "rpp-form";
      }
    }, 2000);
  } catch (e: any) {
    alert("Gagal menghubungi API: " + e.message);
    activeTab.value = "rpp-form";
  }
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
  <div class="flex h-screen bg-slate-50 overflow-hidden font-sans">
    <Sidebar :active-menu="activeMenu" @navigate="handleNavigation" />

    <main class="flex-grow flex flex-col overflow-hidden">
      <TopHeader :user-email="userEmail" @logout="handleLogout" />

      <div class="flex-grow overflow-y-auto p-8 layout-scroll">
        <DashboardHome v-if="activeTab === 'dashboard'" @start-rpp="activeTab = 'rpp-form'" />

        <RppForm v-else-if="activeTab === 'rpp-form'" @submit-rpp="processRPP" />

        <ProcessingState v-else-if="activeTab === 'processing'" />

        <RppResult v-else-if="activeTab === 'results'" :result-data="recentRPP" @create-new="activeTab = 'dashboard'" @download="handleDownload" />
      </div>

      <button class="fixed bottom-8 right-8 px-6 py-3 bg-blue-600 text-white rounded-full font-bold flex items-center gap-3 shadow-2xl shadow-blue-200 hover:-translate-y-1 transition-all">
        <HelpCircle class="w-5 h-5" /> Butuh Bantuan?
      </button>
    </main>
  </div>
</template>

<style scoped>
.layout-scroll::-webkit-scrollbar {
  display: none;
}
.layout-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
