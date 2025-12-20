import { supabase } from "./supabaseClient";

export async function fetchTrip(tripId) {
  const { data, error } = await supabase
    .from("trips")
    .select("data")
    .eq("id", tripId)
    .maybeSingle();

  if (error) throw error;
  return data?.data ?? null;
}

export async function upsertTrip(tripId, state) {
  const { error } = await supabase
    .from("trips")
    .upsert({ id: tripId, data: state }, { onConflict: "id" });

  if (error) throw error;
}

/**
 * リアルタイム購読（他端末で更新されたら反映）
 */
export function subscribeTrip(tripId, onChange) {
  const channel = supabase
    .channel(`trip:${tripId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "trips", filter: `id=eq.${tripId}` },
      (payload) => {
        const next = payload?.new?.data;
        if (next) onChange(next);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
