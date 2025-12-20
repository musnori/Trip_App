const KEY = "couple_trip_state_v2";

export const defaultState = {
  appTitle: "ふたりの旅",
  partnerA: "Yasunori",
  partnerB: "Partner",
  tripStartISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10), // 30日後(YYYY-MM-DD)
  schedule: [
    { id: crypto.randomUUID(), time: "09:00", text: "空港へ", done: false },
    { id: crypto.randomUUID(), time: "12:00", text: "ランチ", done: false }
  ],
  photos: [
    // { id, dataUrl, caption }
  ],
  memories: [
    // { id, dateISO, title, text }
  ]
};

export function loadState() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return defaultState;
  try {
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function downloadJson(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "couple-trip-data.json";
  a.click();
  URL.revokeObjectURL(url);
}

export async function readJsonFile(file) {
  const text = await file.text();
  return JSON.parse(text);
}
