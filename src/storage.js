// src/storage.js
const KEY = "couple_trip_state_v2";

export const defaultState = {
  appTitle: "沖縄旅行",
  partnerA: "Yasunori",
  partnerB: "Partner",
  tripStartISO: "2025-12-27", // 今回の旅行開始日（必要なら変更）

  // ✅ 旅程（編集可能：App内UIから変更される）
  schedule: [
    // 12/27(土)
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-27",
      time: "08:30",
      category: "移動",
      title: "成田空港 発",
      location: "",
      notes: "フライトNo.を確認",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-27",
      time: "12:05",
      category: "移動",
      title: "那覇空港 着",
      location: "国内線到着ロビー",
      notes: "",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-27",
      time: "12:45",
      category: "タスク",
      title: "ホテルへ送迎依頼の電話",
      location: "098-965-1600",
      notes: "「12:50のバスに乗ります」",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-27",
      time: "12:50",
      category: "移動",
      title: "高速バス乗車 (117系統)",
      location: "那覇空港 2番乗り場",
      notes: "",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-27",
      time: "13:53",
      category: "移動",
      title: "石川IC バス停着",
      location: "",
      notes: "ホテルスタッフがお迎え",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-27",
      time: "14:15",
      category: "宿泊",
      title: "チェックイン",
      location: "HIYORIオーシャンリゾート沖縄",
      notes: "荷物を置く",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-27",
      time: "15:00",
      category: "食事",
      title: "遅めの昼食",
      location: "恩納そば",
      notes: "★ホテルからタクシー移動",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-27",
      time: "16:30",
      category: "買出",
      title: "夕食/翌日ランチの買出し",
      location: "タクシーで",
      notes: "",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-27",
      time: "17:40",
      category: "景色",
      title: "海、サンセット",
      location: "万座ビーチ",
      notes:
        "https://www.google.com/gasearch?q=%E4%B8%87%E5%BA%A7%E3%83%93%E3%83%BC%E3%83%81&source=sh/x/gs/m2/5#ebo=0",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-27",
      time: "20:00",
      category: "夕食",
      title: "ディナー",
      location: "沖縄とんかつ食堂しまぶた屋 前兼久店",
      notes:
        "★予約・タクシー移動\nhttps://tabelog.com/okinawa/A4703/A470303/47011882/\n098-923-1518\n予約完了",
      done: false
    },

    // 12/28(日)
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-28",
      time: "08:00",
      category: "朝食",
      title: "朝食",
      location: "ホテル内",
      notes: "宿泊プランに込み",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-28",
      time: "10:00",
      category: "買出",
      title: "食材買い出し（未済の場合）",
      location: "おんなの駅 / 地元スーパー",
      notes: "お部屋料理用",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-28",
      time: "12:00",
      category: "昼食",
      title: "ランチ、料理",
      location: "部屋",
      notes: "★部屋で料理！",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-28",
      time: "15:00",
      category: "軽食",
      title: "昼食",
      location: "Blue Entrance Kitchen 沖縄総本店",
      notes: "★タクシー移動",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-28",
      time: "17:00",
      category: "休憩",
      title: "ホテル休憩",
      location: "",
      notes: "",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-28",
      time: "20:00",
      category: "夕食",
      title: "ディナー",
      location: "ステーキハウス88 恩納店",
      notes:
        "★予約・タクシー移動\nhttps://tabelog.com/okinawa/A4703/A470303/47023826/\n098-964-2988\n予約完了",
      done: false
    },

    // 12/29(月)
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-29",
      time: "08:00",
      category: "朝食",
      title: "朝食",
      location: "ホテル内",
      notes: "",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-29",
      time: "11:00",
      category: "宿泊",
      title: "チェックアウト",
      location: "HIYORIオーシャンリゾート沖縄",
      notes: "",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-29",
      time: "12:00",
      category: "食事",
      title: "（時間があればランチ）",
      location: "ステーキハウス ジャム / ゆうな / 美ら物語",
      notes: "チェックアウト後の空き時間に",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-29",
      time: "15:50",
      category: "移動",
      title: "ホテル出発（送迎車）",
      location: "フロントへ依頼済",
      notes: "",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-29",
      time: "16:03",
      category: "移動",
      title: "高速バス乗車 (117系統)",
      location: "石川IC バス停",
      notes: "",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-29",
      time: "17:15",
      category: "移動",
      title: "那覇空港 到着",
      location: "",
      notes: "",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-29",
      time: "19:15",
      category: "移動",
      title: "那覇空港 発",
      location: "",
      notes: "",
      done: false
    },
    {
      id: crypto.randomUUID(),
      dateISO: "2025-12-29",
      time: "21:10",
      category: "移動",
      title: "関西国際空港 着",
      location: "",
      notes: "",
      done: false
    }
  ],

  photos: [],
  memories: []
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
