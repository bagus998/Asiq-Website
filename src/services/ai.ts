export async function processAdaptiveLearning(params: { rawMaterial: string; studentProfile: string; jenjang: string; mataPelajaran: string; pertemuan: string; disabilitas: string }) {
  const isProd = import.meta.env.PROD;
  const asiqApiUrl = isProd ? "" : import.meta.env.VITE_ASIQ_API_URL || "http://13.212.231.53:8000";
  const asiqApiKey = import.meta.env.VITE_ASIQ_API_KEY || "asiq-prod-2026-secret";

  const formData = new FormData();
  formData.append("nama_siswa", "Siswa");
  formData.append("kelas", params.jenjang);
  formData.append("mata_pelajaran", params.mataPelajaran);
  formData.append("gejala", params.disabilitas + (params.studentProfile ? ", " + params.studentProfile : ""));
  formData.append("materi_mentah", params.rawMaterial);

  // 1. Generate Request
  const generateRes = await fetch(`${asiqApiUrl}/api/rpp/generate`, {
    method: "POST",
    headers: { "X-API-Key": asiqApiKey },
    body: formData,
  });

  if (!generateRes.ok) {
    throw new Error(`API Error: ${generateRes.status}`);
  }

  const generateData = await generateRes.json();
  const jobId = generateData.job_id;

  if (!jobId) {
    throw new Error(generateData.detail || "Gagal mendapatkan Job ID");
  }

  // 2. Poll Status
  let status = "processing";
  while (status === "processing" || status === "pending") {
    await new Promise((r) => setTimeout(r, 3000));
    const statusRes = await fetch(`${asiqApiUrl}/api/rpp/status/${jobId}`, {
      headers: { "X-API-Key": asiqApiKey },
    });
    const statusData = await statusRes.json();
    status = statusData.status;

    if (status === "failed") {
      let errorMessage = "Proses gagal: " + (statusData.step || "Unknown");
      try {
        const errRes = await fetch(`${asiqApiUrl}/api/rpp/result/${jobId}`, {
          headers: { "X-API-Key": asiqApiKey },
        });
        const errData = await errRes.json();
        if (errData.detail) errorMessage = errData.detail;
      } catch (e) {}
      throw new Error(errorMessage);
    }
  }

  // 3. Get Result
  const resultRes = await fetch(`${asiqApiUrl}/api/rpp/result/${jobId}`, {
    headers: { "X-API-Key": asiqApiKey },
  });
  const resultData = await resultRes.json();

  // Extract from resultData
  const adaptedMaterial = resultData.rpp || resultData.result || resultData.adapted_content || JSON.stringify(resultData);
  const strategy = "RPP berhasil diadaptasi dengan ASIQ AI Multi-Agent";

  return {
    strategy,
    adaptedMaterial,
    readabilityScore: resultData.readability_score || 85,
    accessibilityScore: resultData.accessibility_score || 85,
    strengths: resultData.strengths || [{ title: "Adaptive Pacing", desc: "The material is broken down into manageable chunks." }],
    resources: resultData.resources || [{ name: "Interactive Practice", type: "Worksheet" }],
  };
}
