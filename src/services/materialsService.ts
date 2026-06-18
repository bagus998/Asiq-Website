import { supabase } from "../lib/supabase";
import type { RPPResultResponse } from "./rppApi";

export async function insertMaterial(
  result: RPPResultResponse,
  rawContent: string
): Promise<string | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    console.warn("insertMaterial: tidak ada sesi login aktif");
    return null;
  }

  const strengths = [{ title: "Profil Siswa", desc: result.profiling }];
  const resources = [{ title: "Insight AI", desc: result.insight }];

  const { data, error } = await supabase
    .from("materials")
    .insert({
      user_id: sessionData.session.user.id,
      raw_content: rawContent,
      nama_siswa: result.nama_siswa,
      kelas: result.kelas,
      mata_pelajaran: result.mata_pelajaran,
      student_profile: result.profiling,
      strategy: result.profiling,
      adapted_content: result.adaptive,
      readability_score: result.readability_score,
      accessibility_score: result.wcag_score,
      strengths,
      resources,
      pdf_url: result.pdf_url ?? null,
      created_at: result.finished_at,
    })
    .select("id");

  if (error) {
    console.error("Gagal simpan material ke Supabase:", error);
    return null;
  }

  return data?.[0]?.id ?? null;
}
