import { ref } from "vue";
import { generateRPP, checkStatus, getResult } from "../services/rppApi";
import { insertMaterial } from "../services/materialsService";

export interface RppCard {
  title: string;
  desc: string;
}

interface RecentRPP {
  title: string;
  subText: string;
  readability: number;
  accessibility: number;
  strengths: RppCard[];
  resources: RppCard[];
  pdf_url: string | null;
  material_id: string | null;
}

// Shared state across RPP route pages
const currentJobId = ref<string | null>(null);
const currentStep = ref<string>("");
let pollingInterval: ReturnType<typeof setInterval> | undefined;

const recentRPP = ref<RecentRPP>({
  title: "",
  subText: "",
  readability: 0,
  accessibility: 0,
  strengths: [],
  resources: [],
  pdf_url: null,
  material_id: null,
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

          currentStep.value = status.step || "";

          if (s === "completed" || s === "done" || s === "finished") {
            clearInterval(pollingInterval);
            pollingInterval = undefined;
            currentStep.value = "";

            const result = await getResult(job.job_id);

            recentRPP.value = {
              title: `RPP Inklusif — ${result.nama_siswa}`,
              subText: `${result.mata_pelajaran} · ${result.kelas}`,
              readability: result.readability_score ?? 0,
              accessibility: result.wcag_score ?? 0,
              strengths: [{ title: "Profil Siswa", desc: result.profiling }],
              resources: [{ title: "Insight AI", desc: result.insight }],
              pdf_url: result.pdf_url ?? job.job_id,
              material_id: null,
            };

            const materialId = await insertMaterial(result, formData.rawMaterial ?? '');
            if (materialId) {
              recentRPP.value.material_id = materialId;
            }

            isProcessing.value = false;
            router.push("/dashboard/results");
          } else if (s === "failed" || s === "error") {
            clearInterval(pollingInterval);
            pollingInterval = undefined;
            isProcessing.value = false;
            alert("Terjadi kesalahan saat memproses RPP.");
            router.push("/dashboard/rpp");
          }
        } catch (e: any) {
          clearInterval(pollingInterval);
          pollingInterval = undefined;
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
    if (pollingInterval !== undefined) {
      clearInterval(pollingInterval);
      pollingInterval = undefined;
    }
  };

  return {
    currentJobId,
    currentStep,
    recentRPP,
    isProcessing,
    savedFormData,
    processRPP,
    loadFromHistory,
    cleanup,
  };
}
