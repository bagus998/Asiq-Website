import { ref } from "vue";
import { generateRPP, checkStatus, getResult } from "../services/rppApi";
import { supabase } from "../lib/supabase";

// Shared state across RPP route pages
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

const isProcessing = ref(false);

export function useRppState() {
  const processRPP = async (formData: any, router: any) => {
    isProcessing.value = true;
    router.push("/dashboard/processing");

    try {
      const job = await generateRPP(
        {
          nama_siswa: formData.namaSiswa,
          kelas: formData.selectedJenjang,
          mata_pelajaran: formData.selectedMataPelajaran,
          gejala: formData.studentProfile || "",
          materi_mentah: formData.rawMaterial || undefined,
        },
        formData.uploadedFile || null
      );
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

            isProcessing.value = false;
            router.push("/dashboard/results");
          } else if (s === "failed" || s === "error") {
            clearInterval(pollingInterval!);
            pollingInterval = null;
            isProcessing.value = false;
            alert("Terjadi kesalahan saat memproses RPP. Coba lagi.");
            router.push("/dashboard/rpp");
          }
        } catch (e: any) {
          clearInterval(pollingInterval!);
          pollingInterval = null;
          isProcessing.value = false;
          alert("Error: " + e.message);
          router.push("/dashboard/rpp");
        }
      }, 2000);
    } catch (e: any) {
      isProcessing.value = false;
      alert("Gagal menghubungi API: " + e.message);
      router.push("/dashboard/rpp");
    }
  };

  const cleanup = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  };

  return {
    currentJobId,
    recentRPP,
    isProcessing,
    processRPP,
    cleanup,
  };
}
