const BASE_URL = ""; // use proxy in both local (vite) and prod (vercel)
const API_KEY = import.meta.env.VITE_ASIQ_API_KEY as string;

function apiHeaders(): Record<string, string> {
  return { "X-API-Key": API_KEY };
}

export interface RPPGenerateRequest {
  nama_siswa: string;
  kelas: string;
  mata_pelajaran: string;
  gejala: string;
  materi_mentah?: string;
}

export interface RPPJobResponse {
  job_id: string;
  message: string;
}

export interface RPPStatusResponse {
  job_id: string;
  status: string;
  step: string;
}

export interface RPPResultResponse {
  job_id: string;
  status: string;
  nama_siswa: string;
  kelas: string;
  mata_pelajaran: string;
  readability_score: number;
  wcag_score: number;
  profiling: string;
  adaptive: string;
  insight: string;
  pdf_url: string | null;
  finished_at: string;
}

// multipart/form-data dihapus, kirim JSON sesuai spec backend
export async function generateRPP(data: RPPGenerateRequest, file?: File | null): Promise<RPPJobResponse> {
  let materi_pdf = data.materi_mentah || "";
  
  if (file) {
    const toBase64 = (f: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
    materi_pdf = await toBase64(file);
  }

  const payload = {
    nama_siswa: data.nama_siswa,
    diagnosis: data.gejala, // Backend expects 'diagnosis'
    mata_pelajaran: data.mata_pelajaran,
    kelas: data.kelas,
    gejala: data.gejala,
    materi_pdf: materi_pdf
  };

  const res = await fetch(`${BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      ...apiHeaders(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gagal generate RPP (${res.status}): ${text}`);
  }
  return res.json();
}

export async function checkStatus(jobId: string): Promise<RPPStatusResponse> {
  const res = await fetch(`${BASE_URL}/api/status/${jobId}?t=${Date.now()}`, {
    headers: {
      ...apiHeaders(),
      "Cache-Control": "no-cache",
    },
  });
  if (!res.ok) throw new Error(`Cek status gagal: ${res.status}`);
  return res.json();
}

export async function getScores(jobId: string): Promise<{ readability_score?: number, inclusivity_score?: number } | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/result/${jobId}/scores?t=${Date.now()}`, {
      headers: {
        ...apiHeaders(),
        "Cache-Control": "no-cache",
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn("Gagal mengambil skor, melanjutkan tanpa skor:", e);
    return null;
  }
}

export async function downloadPDF(jobId: string): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/api/result/${jobId}/pdf`, {
    headers: apiHeaders(),
  });
  if (!res.ok) throw new Error(`Download gagal: ${res.status}`);
  return res.blob();
}
