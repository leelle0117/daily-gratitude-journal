import { getSupabase } from "./supabase";
import { GratitudeEntry, GratitudeFormData } from "@/types";

export async function getEntry(date: string): Promise<GratitudeEntry | null> {
  const { data } = await getSupabase()
    .from("entries")
    .select("*")
    .eq("date", date)
    .single();

  return data;
}

export async function saveEntry(
  date: string,
  formData: GratitudeFormData
): Promise<void> {
  const { error } = await getSupabase().from("entries").upsert(
    {
      date,
      ...formData,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "date" }
  );

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
    .range(offset, offset + pageSize - 1);

  if (error) throw error;

  return {
    entries: data || [],
    hasMore: (data?.length || 0) === pageSize,
  };
}
