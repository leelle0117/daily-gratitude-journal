import { getSupabase } from "./supabase";
import { GratitudeEntry, GratitudeFormData } from "@/types";

export async function saveEntry(
  date: string,
  formData: GratitudeFormData
): Promise<void> {
  const { error } = await getSupabase().from("entries").insert({
    date,
    ...formData,
  });

  if (error) throw error;
}

export async function getEntries(
  pageSize: number = 10,
  offset: number = 0
): Promise<{
  entries: GratitudeEntry[];
  hasMore: boolean;
}> {
  const { data, error } = await getSupabase()
    .from("entries")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) throw error;

  return {
    entries: data || [],
    hasMore: (data?.length || 0) === pageSize,
  };
}

export async function searchEntries(params: {
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<GratitudeEntry[]> {
  let query = getSupabase()
    .from("entries")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (params.dateFrom) {
    query = query.gte("date", params.dateFrom);
  }
  if (params.dateTo) {
    query = query.lte("date", params.dateTo);
  }

  const { data, error } = await query;
  if (error) throw error;

  let results = data || [];

  // 키워드 필터링 (클라이언트 측)
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    results = results.filter(
      (e) =>
        e.line1.toLowerCase().includes(kw) ||
        e.line2.toLowerCase().includes(kw) ||
        e.line3.toLowerCase().includes(kw)
    );
  }

  return results;
}

export async function updateEntry(
  id: number,
  formData: GratitudeFormData
): Promise<void> {
  const { error } = await getSupabase()
    .from("entries")
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteEntry(id: number): Promise<void> {
  const { error } = await getSupabase()
    .from("entries")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
