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
  material_id: null as string | null,
});

const savedFormData = ref<any>(null);

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
            
            const scores = await getScores(job.job_id);

            recentRPP.value = {
              title: `RPP Inklusif — ${formData.namaSiswa}`,
              subText: `${formData.selectedMataPelajaran} · ${formData.selectedJenjang}`,
              readability: scores?.readability_score || 0,
              accessibility: scores?.inclusivity_score || 0,
              strengths: [],
              resources: [],
              pdf_url: job.job_id, // we save job_id here so we can download it later
              material_id: null,
            };

            // Simpan ke Supabase
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) {
              const { data } = await supabase.from("materials").insert({
                user_id: sessionData.session.user.id,
                raw_content: formData.rawMaterial,
                student_profile: formData.studentProfile,
                readability_score: recentRPP.value.readability,
                accessibility_score: recentRPP.value.accessibility,
                nama_siswa: formData.namaSiswa,
                kelas: formData.selectedJenjang,
                mata_pelajaran: formData.selectedMataPelajaran,
                pdf_url: job.job_id, // Save job_id into pdf_url column to identify PDF
                strengths: [],
                resources: [],
              }).select();

              if (data && data.length > 0) {
                recentRPP.value.material_id = data[0].id;
              }
            }

            isProcessing.value = false;
            router.push("/dashboard/results");
          } else if (s === "failed" || s === "error") {
            clearInterval(pollingInterval!);
            pollingInterval = null;
            isProcessing.value = false;
            alert("Terjadi kesalahan saat memproses RPP.");
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

  const loadFromHistory = (project: any, router: any) => {
    recentRPP.value = {
      title: `RPP Inklusif — ${project.nama_siswa || 'Siswa'}`,
      subText: `${project.mata_pelajaran || 'Mata Pelajaran'} · ${project.kelas || 'Kelas'}`,
      readability: project.readability_score || 0,
      accessibility: project.accessibility_score || 0,
      strengths: project.strengths || [],
      resources: project.resources || [],
      pdf_url: project.pdf_url || null,
      material_id: project.id,
    };
    router.push("/dashboard/results");
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
    savedFormData,
    processRPP,
    loadFromHistory,
    cleanup,
  };
}
