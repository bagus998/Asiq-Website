const BASE_URL = import.meta.env.VITE_API_BASE_URL as string
const API_KEY = import.meta.env.VITE_API_KEY as string

function apiHeaders(): Record<string, string> {
  return { 'X-API-Key': API_KEY }
}

export interface RPPGenerateRequest {
  nama_siswa: string
  kelas: string
  mata_pelajaran: string
  gejala: string
  materi_mentah?: string
}

export interface RPPJobResponse {
  job_id: string
  message: string
}

export interface RPPStatusResponse {
  job_id: string
  status: string
  step: string
}

export interface RPPResultResponse {
  job_id: string
  status: string
  nama_siswa: string
  kelas: string
  mata_pelajaran: string
  readability_score: number
  wcag_score: number
  profiling: string
  adaptive: string
  insight: string
  pdf_url: string | null
  finished_at: string
}

// multipart/form-data — jangan set Content-Type manual, browser yang set boundary
export async function generateRPP(data: RPPGenerateRequest, file?: File | null): Promise<RPPJobResponse> {
  const body = new FormData()
  body.append('nama_siswa', data.nama_siswa)
  body.append('kelas', data.kelas)
  body.append('mata_pelajaran', data.mata_pelajaran)
  body.append('gejala', data.gejala)
  if (data.materi_mentah) body.append('materi_mentah', data.materi_mentah)
  if (file) body.append('file', file)

  const res = await fetch(`${BASE_URL}/api/rpp/generate`, {
    method: 'POST',
    headers: apiHeaders(),
    body,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gagal generate RPP (${res.status}): ${text}`)
  }
  return res.json()
}

export async function checkStatus(jobId: string): Promise<RPPStatusResponse> {
  const res = await fetch(`${BASE_URL}/api/rpp/status/${jobId}`, {
    headers: apiHeaders(),
  })
  if (!res.ok) throw new Error(`Cek status gagal: ${res.status}`)
  return res.json()
}

export async function getResult(jobId: string): Promise<RPPResultResponse> {
  const res = await fetch(`${BASE_URL}/api/rpp/result/${jobId}`, {
    headers: apiHeaders(),
  })
  if (!res.ok) throw new Error(`Ambil hasil gagal: ${res.status}`)
  return res.json()
}

export async function downloadPDF(jobId: string): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/api/rpp/download/${jobId}`, {
    headers: apiHeaders(),
  })
  if (!res.ok) throw new Error(`Download gagal: ${res.status}`)
  return res.blob()
}
