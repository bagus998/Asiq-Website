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

// Server expects multipart/form-data — do NOT send JSON
export async function generateRPP(data: RPPGenerateRequest, file?: File | null): Promise<RPPJobResponse> {
  const form = new FormData();
  form.append("nama_siswa", data.nama_siswa);
  form.append("kelas", data.kelas);
  form.append("mata_pelajaran", data.mata_pelajaran);
  form.append("gejala", data.gejala);
  if (data.materi_mentah) form.append("materi_mentah", data.materi_mentah);
  if (file) form.append("file", file);

  const res = await fetch(`${BASE_URL}/api/rpp/generate`, {
    method: "POST",
    headers: apiHeaders(), // Content-Type omitted — browser sets multipart boundary automatically
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gagal generate RPP (${res.status}): ${text}`);
  }
  return res.json();
}

export async function checkStatus(jobId: string): Promise<RPPStatusResponse> {
  const res = await fetch(`${BASE_URL}/api/rpp/status/${jobId}?t=${Date.now()}`, {
    headers: {
      ...apiHeaders(),
      "Cache-Control": "no-cache",
    },
  });
  if (!res.ok) throw new Error(`Cek status gagal: ${res.status}`);
  return res.json();
}

export async function getResult(jobId: string): Promise<RPPResultResponse> {
  const res = await fetch(`${BASE_URL}/api/rpp/result/${jobId}?t=${Date.now()}`, {
    headers: {
      ...apiHeaders(),
      "Cache-Control": "no-cache",
    },
  });
  if (!res.ok) throw new Error(`Gagal mengambil hasil: ${res.status}`);
  return res.json();
}

export async function downloadPDF(jobId: string): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/api/rpp/download/${jobId}`, {
    headers: apiHeaders(),
  });
  if (!res.ok) throw new Error(`Download gagal: ${res.status}`);
  return res.blob();
}
