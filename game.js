/*
  アンダーグラウンド（仮） v0.3.4 prototype
  - 1ファイル内の DATA を差し替えるだけでキャラ・曲・サポート候補を変更できます。
  - Deferred replacements: 下部の DEFERRED_REPLACEMENTS に、今回簡略化した候補をまとめています。
*/

const VERSION = "v0.3.4";

const MAIN_GENRE_DATA = [
  { name: "ロック", stage: "early", unlockTurn: 1 },
  { name: "ポップ", stage: "early", unlockTurn: 1 },
  { name: "パンク", stage: "early", unlockTurn: 1 },
  { name: "メタル", stage: "early", unlockTurn: 1 },
  { name: "ヒップホップ", stage: "middle", unlockTurn: 11 },
  { name: "ミクスチャー", stage: "middle", unlockTurn: 11 },
  { name: "エモ", stage: "middle", unlockTurn: 11 },
  { name: "オルタナ", stage: "middle", unlockTurn: 11 },
  { name: "エレクトロ", stage: "middle", unlockTurn: 11 },
  { name: "ジャズ", stage: "late", unlockTurn: 21 },
  { name: "クラシック", stage: "late", unlockTurn: 21 },
  { name: "プログレ", stage: "late", unlockTurn: 21 },
  { name: "シューゲイザー", stage: "late", unlockTurn: 21 },
  { name: "ポストロック", stage: "late", unlockTurn: 21 }
];
const MAIN_GENRES = MAIN_GENRE_DATA.map(g => g.name);

const SUB_GENRES = [
  // 前半：ロック / ポップ / パンク / メタルの派生
  { name: "ギターロック", parent: "ロック", unlockTurn: 1, rarity: "common" },
  { name: "ハードロック", parent: "ロック", unlockTurn: 1, rarity: "common" },
  { name: "ガレージロック", parent: "ロック", unlockTurn: 1, rarity: "common" },
  { name: "オルタナロック", parent: "ロック", unlockTurn: 1, rarity: "common" },
  { name: "バラードロック", parent: "ロック", unlockTurn: 1, rarity: "common" },
  { name: "ギターポップ", parent: "ポップ", unlockTurn: 1, rarity: "common" },
  { name: "パワーポップ", parent: "ポップ", unlockTurn: 1, rarity: "common" },
  { name: "アニソンロック", parent: "ポップ", unlockTurn: 1, rarity: "common" },
  { name: "シティポップ", parent: "ポップ", unlockTurn: 1, rarity: "common" },
  { name: "バラードポップ", parent: "ポップ", unlockTurn: 1, rarity: "common" },
  { name: "ポップパンク", parent: "パンク", unlockTurn: 1, rarity: "common" },
  { name: "メロディックパンク", parent: "パンク", unlockTurn: 1, rarity: "common" },
  { name: "青春パンク", parent: "パンク", unlockTurn: 1, rarity: "common" },
  { name: "スカパンク", parent: "パンク", unlockTurn: 1, rarity: "common" },
  { name: "ハードコア", parent: "パンク", unlockTurn: 1, rarity: "common" },
  { name: "ガレージパンク", parent: "パンク", unlockTurn: 1, rarity: "common" },
  { name: "ヘヴィメタル", parent: "メタル", unlockTurn: 1, rarity: "common" },
  { name: "スピードメタル", parent: "メタル", unlockTurn: 1, rarity: "common" },
  { name: "メロディックメタル", parent: "メタル", unlockTurn: 1, rarity: "common" },
  { name: "メタルコア", parent: "メタル", unlockTurn: 1, rarity: "common" },
  { name: "スクリーモ", parent: "メタル", unlockTurn: 1, rarity: "common" },
  // 前半レア
  { name: "デジロック", parent: "ロック", unlockTurn: 1, rarity: "rare" },
  { name: "ダンスロック", parent: "ポップ", unlockTurn: 1, rarity: "rare" },
  { name: "グランジ", parent: "ロック", unlockTurn: 1, rarity: "rare" },
  { name: "ポストハードコア", parent: "パンク", unlockTurn: 1, rarity: "rare" },
  { name: "ニューメタル", parent: "メタル", unlockTurn: 1, rarity: "rare" },
  // アレンジ限定レア
  { name: "ピアノロック", parent: "ロック", unlockTurn: 1, rarity: "rare", arrangeOnly: "ピアノ主導" },
  // 中盤以降の仮枠
  { name: "ラップロック", parent: "ヒップホップ", unlockTurn: 11, rarity: "common" },
  { name: "ミクスチャーロック", parent: "ミクスチャー", unlockTurn: 11, rarity: "common" },
  { name: "エモロック", parent: "エモ", unlockTurn: 11, rarity: "common" },
  { name: "エレクトロロック", parent: "エレクトロ", unlockTurn: 11, rarity: "common" },
  { name: "ジャズロック", parent: "ジャズ", unlockTurn: 21, rarity: "common" },
  { name: "シンフォニックメタル", parent: "クラシック", unlockTurn: 21, rarity: "rare" },
  { name: "クラシカルロック", parent: "クラシック", unlockTurn: 21, rarity: "common" }
];

const GOOD_MAIN_COMBOS = [
  "ポップ+ロック", "パンク+ロック", "パンク+ポップ", "パンク+メタル"
];

const GENRE_COMBO_TABLE = {
  "ロック+ロック": { favored:["ギターロック","ハードロック","ガレージロック","オルタナロック"], rare:["グランジ"] },
  "ポップ+ポップ": { favored:["ギターポップ","パワーポップ","バラードポップ","シティポップ"], rare:["ダンスロック"] },
  "パンク+パンク": { favored:["メロディックパンク","ハードコア","ガレージパンク","青春パンク"], rare:["スカパンク"] },
  "メタル+メタル": { favored:["ヘヴィメタル","スピードメタル","メロディックメタル","メタルコア"], rare:["スクリーモ"] },
  "ポップ+ロック": { favored:["ギターポップ","パワーポップ","アニソンロック","バラードロック"], rare:["シティポップ","デジロック"] },
  "パンク+ロック": { favored:["ガレージロック","オルタナロック","ハードコア","青春パンク"], rare:["グランジ"] },
  "メタル+ロック": { favored:["ハードロック","ヘヴィメタル","メロディックメタル","スピードメタル"], rare:["ニューメタル"] },
  "パンク+ポップ": { favored:["ポップパンク","メロディックパンク","青春パンク","スカパンク"], rare:["アニソンロック"] },
  "メタル+ポップ": { favored:["アニソンロック","メロディックメタル","パワーポップ","ハードロック"], rare:["デジロック"] },
  "パンク+メタル": { favored:["ハードコア","メタルコア","スクリーモ","スピードメタル"], rare:["ポストハードコア","ニューメタル"] }
};

const THEMES = ["恋愛", "失恋", "友情", "応援", "日常", "青春", "反抗", "孤独", "自分", "居場所"];
const MID_THEMES = ["焦燥感", "劣等感", "怒り", "再出発", "生き方", "個性"];
const LATE_THEMES = ["喪失", "祈り", "破壊", "覚醒", "反権力", "救済"];
function availableThemes() {
  return [
    ...THEMES,
    ...((state?.turn || 1) >= 11 ? MID_THEMES : []),
    ...((state?.turn || 1) >= 21 ? LATE_THEMES : [])
  ];
}

const KEYWORD_SUGGESTIONS = ["夜", "夢", "雨", "終電", "屋上", "コンビニ", "街", "高架下", "ノイズ", "blue", "run away", "still alive"];
const KEYWORDS = KEYWORD_SUGGESTIONS;

const SONG_TITLE_CANDIDATES = [
  "Balaclove", "バカとトラ", "My Galaction", "1998", "OSAKA CALLING", "You, You, Nobody", "全然前夜", "空振りの一撃", "ノーベンバー君", "トリル", "九乃歌", "カナタサキ", "Scarlet", "Jitter Heart", "Fire Dragon", "Berry Peparoni", "Mission Blue", "雨の日", "Mt. Top", "No.15",
  "A Lack of Youth", "Send Me the End", "エラーコード青春", "LAの帰り道", "Revolver", "Strong My Noise", "Long Breath, Short Night", "呼び名のない日", "らしさの残骸", "切望回路",
  "Basement Anthem", "Shout My Name", "Carry My Pain", "Inside the Noise", "Into the Crowd", "Still Loud, Still Young", "Trust Yourself", "Da-Da-Dawn", "One More Anthem", "Stop The Silence",
  "Welcome to the Broken Stage", "Dear Elena", "I'm Not Dead Yet", "Nameless Last Words", "Young and Dangerous", "The Ghost of Youth", "I Loved You Wrong", "No No Noize", "Mother Radio", "Dead Radio",
  "Anthem for Nobody", "Lifestyles of the Broke & Nameless", "I Don't Wanna Grow Up", "Kids & Noise", "Little Riots", "River of Noise", "I Just Wanna Be Loud", "Wondering Youth", "Birthday on the Floor", "The Teenage Declaration"
];
function randomSongTitleCandidate(ed={}) {
  const pool = [...SONG_TITLE_CANDIDATES];
  if (ed?.theme === "青春") pool.push("青春アンセム", "Still Young, Still Wrong", "放課後CALLING");
  if (ed?.theme === "孤独") pool.push("The Ghost of Youth", "ひとりのノイズ", "夜のエラーコード");
  if (ed?.theme === "反抗") pool.push("Stop The Silence", "Riot in the Basement", "バカとノイズ");
  if (ed?.arrange === "ピアノ主導") pool.push("Piano Riot", "ピアノロック前夜", "鍵盤とRevolver");
  return pool[rand(0, pool.length - 1)];
}
const KEYWORD_DICTIONARY = [
  { word:"夜", tags:["夜","孤独","余韻"], themes:["失恋","孤独"], add:{lyrics:3} },
  { word:"午前二時", tags:["夜","焦燥感","孤独"], themes:["孤独","焦燥感"], add:{lyrics:4} },
  { word:"終電", tags:["日常","別れ","余韻"], themes:["失恋","日常"], add:{lyrics:3} },
  { word:"街", tags:["日常","孤独","居場所"], themes:["日常","居場所","反抗"], add:{lyrics:2} },
  { word:"コンビニ", tags:["日常","青春"], themes:["日常","青春"], add:{catchy:2} },
  { word:"高架下", tags:["反抗","青春","バンド感"], themes:["反抗","青春"], add:{performance:2} },
  { word:"ノイズ", tags:["反抗","爆発力","コア向け"], themes:["反抗","個性"], add:{performance:3} },
  { word:"雨", tags:["失恋","余韻","透明感"], themes:["失恋","孤独"], add:{lyrics:3} },
  { word:"blue", tags:["失恋","透明感","夜"], themes:["失恋","孤独"], add:{lyrics:3} },
  { word:"run away", tags:["逃避","反抗","疾走感"], themes:["反抗","焦燥感"], add:{tempo:3} },
  { word:"still alive", tags:["希望","自分","救済"], themes:["自分","希望","救済"], add:{lyrics:3} },
  { word:"爆音", tags:["爆発力","ライブ","反抗"], themes:["反抗"], add:{performance:3} }
];

const ARRANGES = ["疾走ビート", "轟音ギター", "静かなイントロ", "ツインギター", "シンセ厚め", "ベース主導", "ドラム爆発", "DJミックス", "コーラス重視", "ピアノ主導"];
const ARRANGE_DATA = {
  "疾走ビート": { need:{ drum:1 }, boost:["メロディックパンク","青春パンク","ポップパンク","スピードメタル"], rare:["ダンスロック"], effects:"テンポ+ / 疾走感 / 1曲目向き" },
  "轟音ギター": { need:{ guitar:1 }, boost:["ハードロック","ガレージロック","オルタナロック","ハードコア"], rare:["グランジ"], effects:"演奏+ / 爆発力 / コア人気+" },
  "静かなイントロ": { need:{}, boost:["バラードロック","バラードポップ","オルタナロック","ギターポップ"], rare:["シティポップ"], effects:"歌詞+ / 余韻 / 3〜5曲目向き" },
  "ツインギター": { need:{ guitar:2 }, boost:["ギターロック","ハードロック","メロディックメタル","スピードメタル"], rare:["ニューメタル"], effects:"演奏+ / 爆発力+ / 難曲化" },
  "シンセ厚め": { need:{ key:1 }, boost:["アニソンロック","シティポップ","パワーポップ","バラードポップ"], rare:["デジロック","ダンスロック"], effects:"流行+ / 透明感 / キャッチー+" },
  "ベース主導": { need:{ bass:1 }, boost:["ガレージロック","オルタナロック","ハードコア","メタルコア"], rare:["グランジ","ニューメタル"], effects:"安定+ / グルーヴ / 戦略点+" },
  "ドラム爆発": { need:{ drum:1 }, boost:["ハードコア","メタルコア","スクリーモ","スピードメタル"], rare:["ポストハードコア"], effects:"熱量+ / 爆発力 / 疲労+" },
  "DJミックス": { need:{ dj:1 }, boost:["アニソンロック","パワーポップ","メタルコア","スクリーモ"], rare:["デジロック","ダンスロック","ニューメタル"], effects:"個性+ / 流行+ / ブレやすい" },
  "コーラス重視": { need:{ chorusSeparate:1 }, boost:["ポップパンク","青春パンク","アニソンロック","バラードポップ"], rare:["スカパンク"], effects:"歌詞+ / キャッチー+ / ラスト向き" },
  "ピアノ主導": { need:{ key:1 }, boost:["バラードロック","バラードポップ","アニソンロック","メロディックメタル"], rare:["ピアノロック"], effects:"表現点+ / 余韻 / ラスト向き" }
};

function availableMainGenres() {
  const turn = state?.turn || 1;
  return MAIN_GENRE_DATA.filter(g => g.unlockTurn <= turn).map(g => g.name);
}
function availableSubGenres(arrange="") {
  const turn = state?.turn || 1;
  return SUB_GENRES.filter(g => g.unlockTurn <= turn && (!g.arrangeOnly || g.arrangeOnly === arrange));
}
function subParent(subGenre) {
  return (SUB_GENRES.find(g => g.name === subGenre) || {}).parent || "ロック";
}
function genreComboKey(a, b) { return [a, b].sort().join("+"); }
function comboData(a, b) { return GENRE_COMBO_TABLE[genreComboKey(a, b)] || null; }
function isGoodMainCombo(a, b) { return a !== b && GOOD_MAIN_COMBOS.includes(genreComboKey(a, b)); }
function unlockedSubGenreByName(name, arrange="") { return availableSubGenres(arrange).find(sg => sg.name === name) || null; }
function arrangementData(arrange) { return ARRANGE_DATA[arrange] || { need:{}, boost:[], rare:[], effects:"" }; }
function memberHasInstrument(member, inst) {
  if (member.mainInstrument === inst || member.subInstrument === inst) return true;
  const entry = member.instruments?.[inst];
  return !!entry && entry.mark !== "×";
}
function bandInstrumentCounts() {
  const counts = { guitar:0, bass:0, drum:0, key:0, dj:0, vocal:0, chorus:0 };
  activeMembers().forEach(m => {
    Object.keys(counts).forEach(k => { if (memberHasInstrument(m, k)) counts[k] += 1; });
  });
  return counts;
}
function arrangeStatus(arrange) {
  const data = arrangementData(arrange);
  const counts = bandInstrumentCounts();
  const missing = [];
  let partial = false;
  for (const [inst, need] of Object.entries(data.need || {})) {
    if (inst === "chorusSeparate") {
      if (counts.vocal >= 1 && counts.chorus >= 2) continue;
      missing.push("ボーカル以外のコーラス");
      partial = counts.chorus >= 1;
      continue;
    }
    if ((counts[inst] || 0) >= need) continue;
    missing.push(`${instrumentLabel(inst)}${need > 1 ? need + "人" : ""}`);
    if ((counts[inst] || 0) > 0) partial = true;
  }
  const status = missing.length === 0 ? "有効" : partial ? "不完全" : "無効";
  const multiplier = status === "有効" ? 1 : status === "不完全" ? 0.5 : 0;
  return { status, multiplier, missing, effects:data.effects, boost:data.boost || [], rare:data.rare || [] };
}
function instrumentLabel(inst) {
  return ({ guitar:"ギター", bass:"ベース", drum:"ドラム", key:"キーボード/ピアノ", dj:"DJ", vocal:"ボーカル", chorus:"コーラス" })[inst] || inst;
}
function possibleDerivedSubGenres(a, b, arrange="") {
  const parents = [...new Set([a, b])];
  const pool = availableSubGenres(arrange).filter(sg => parents.includes(sg.parent) && sg.rarity !== "rare");
  const combo = comboData(a, b);
  const names = [...pool.map(x => x.name), ...(combo?.favored || []), ...arrangementData(arrange).boost || []];
  return [...new Set(names)].map(n => unlockedSubGenreByName(n, arrange)).filter(Boolean);
}
function genrePlanChance(a, b, arrange="") {
  const hasDerived = possibleDerivedSubGenres(a, b, arrange).length > 0;
  let subChance = isGoodMainCombo(a,b) ? 0.45 : hasDerived ? 0.25 : 0;
  let rareChance = hasDerived ? 0.05 : 0;
  const st = arrange ? arrangeStatus(arrange) : { multiplier:0 };
  if (arrange && st.multiplier > 0) {
    subChance += 0.12 * st.multiplier;
    rareChance += 0.03 * st.multiplier;
  }
  const totalDerived = Math.min(0.70, subChance + rareChance);
  if (subChance + rareChance > totalDerived) {
    const scale = totalDerived / (subChance + rareChance);
    subChance *= scale; rareChance *= scale;
  }
  const mainChance = Math.max(0, 1 - subChance - rareChance);
  if (a === b) return { mainA: mainChance, mainB:0, sub:subChance, rare:rareChance, combo:comboData(a,b) };
  return { mainA: mainChance/2, mainB: mainChance/2, sub:subChance, rare:rareChance, combo:comboData(a,b) };
}
function genrePlanLabel(a, b, arrange="") {
  if (!a || !b) return "ジャンル未選択";
  const chance = genrePlanChance(a, b, arrange);
  const pct = n => `${Math.round(n * 100)}%`;
  const arr = arrange ? ` / ${arrangeStatus(arrange).status}` : "";
  return a === b
    ? `${a}→${b}：${a} ${pct(chance.mainA)} / サブ ${pct(chance.sub)} / レア ${pct(chance.rare)}${arr}`
    : `${a}→${b}：${a} ${pct(chance.mainA)} / ${b} ${pct(chance.mainB)} / サブ ${pct(chance.sub)} / レア ${pct(chance.rare)}${arr}`;
}
function weightedPick(names, arrange="") {
  const weights = names.map(n => {
    const st = arrange ? arrangeStatus(arrange) : { boost:[], rare:[], multiplier:0 };
    let w = 1;
    if (st.boost.includes(n)) w += 3 * st.multiplier;
    if (st.rare.includes(n)) w += 5 * st.multiplier;
    return Math.max(0.1, w);
  });
  const total = weights.reduce((a,b)=>a+b,0);
  let roll = Math.random() * total;
  for (let i=0;i<names.length;i++) { roll -= weights[i]; if (roll <= 0) return names[i]; }
  return names[0];
}
function resolveSongGenrePair(a, b, arrange="") {
  const chance = genrePlanChance(a, b, arrange);
  const roll = Math.random();
  const combo = comboData(a, b);
  const arr = arrangementData(arrange);
  const commonNames = [...new Set([...(combo?.favored || []), ...possibleDerivedSubGenres(a,b,arrange).map(x=>x.name), ...(arr.boost || [])])]
    .filter(n => unlockedSubGenreByName(n, arrange) && unlockedSubGenreByName(n, arrange).rarity !== "rare");
  const rareNames = [...new Set([...(combo?.rare || []), ...(arr.rare || [])])]
    .filter(n => unlockedSubGenreByName(n, arrange));
  if (roll < chance.rare && rareNames.length) {
    const picked = weightedPick(rareNames, arrange);
    const chosen = unlockedSubGenreByName(picked, arrange);
    return { mainGenre: chosen.parent, subGenre: chosen.name, sourceMainGenres:[a,b], rollType:"rare-sub", chanceText:genrePlanLabel(a,b,arrange) };
  }
  if (roll < chance.rare + chance.sub && commonNames.length) {
    const picked = weightedPick(commonNames, arrange);
    const chosen = unlockedSubGenreByName(picked, arrange);
    return { mainGenre: chosen.parent, subGenre: chosen.name, sourceMainGenres:[a,b], rollType:"derived-sub", chanceText:genrePlanLabel(a,b,arrange) };
  }
  let mainGenre = a;
  if (a !== b) mainGenre = Math.random() < 0.5 ? a : b;
  return { mainGenre, subGenre:"", sourceMainGenres:[a,b], rollType:"main", chanceText:genrePlanLabel(a,b,arrange) };
}
function genreDisplay(song) {
  const main = song.mainGenre || subParent(song.subGenre || song.genre);
  const sub = song.subGenre || "";
  return sub && sub !== main ? `${main} / ${sub}` : main;
}
function analyzeKeywordText(text, theme="") {
  const raw = String(text || "").trim();
  const lower = raw.toLowerCase();
  const hits = KEYWORD_DICTIONARY.filter(k => lower.includes(k.word.toLowerCase()));
  const tags = [...new Set(hits.flatMap(h => h.tags || []))];
  const matchedTheme = hits.some(h => (h.themes || []).includes(theme));
  const unknown = raw && hits.length === 0;
  if (unknown) tags.push("個性", "コア向け");
  return { raw, hits, tags, matchedTheme, unknown };
}




const VENUES = [
  { id: "garage", name: "地下ガレージ", capacity: 55, fee: 4500, prepNeed: 12, heatBonus: 2, note: "小箱。序盤でも成功しやすい" },
  { id: "livehouse_s", name: "駅裏ライブハウス", capacity: 90, fee: 8000, prepNeed: 24, heatBonus: 4, note: "標準的な小箱" },
  { id: "livehouse_m", name: "ネオンホール", capacity: 150, fee: 14000, prepNeed: 42, heatBonus: 7, note: "中箱。準備不足だと空席が目立つ" },
  { id: "warehouse", name: "倉庫イベント", capacity: 230, fee: 22000, prepNeed: 58, heatBonus: 10, note: "大きめ。知名度と曲の認知が欲しい" },
  { id: "big_stage", name: "プレフェス野外ステージ", capacity: 340, fee: 32000, prepNeed: 76, heatBonus: 14, note: "格上会場。誰でも出られるが成功率は低い" }
];

function venueById(id) {
  return VENUES.find(v => v.id === id) || VENUES[0];
}
function fixedLiveEvent(turn, id, label, fixed=true) {
  const v = venueById(id);
  return { turn, venueId:id, label, fixed, booked:true, cancelled:false, name:label, capacity:v.capacity, fee:v.fee, prepNeed:v.prepNeed };
}

const DATA = {
  player: {
    id: "player",
    name: "あなた",
    part: "Vo/Gt",
    mainInstrument: "vocal",
    subInstrument: "guitar",
    mainGenre: "パンク",
    secondMainGenres: ["ロック", "ポップ"],
    subGenres: ["青春パンク", "メロディックパンク", "オルタナロック"],
    stats: { stamina: 40, technique: 35, knowledge: 35, sense: 50, mental: 45, teamwork: 40, rhythm: 35, charisma: 45 },
    instruments: {
      vocal: { mark: "◎", lv: 45, cap: 80, potentialCap: 90, growth: 1.1 },
      guitar: { mark: "○", lv: 35, cap: 70, potentialCap: 82, growth: 1.0 },
      chorus: { mark: "○", lv: 35, cap: 70, potentialCap: 80, growth: 1.0 }
    },
    replaceNote: "主人公仮データ。将来は初期タイプ選択に差し替え可能。"
  },
  candidateCharacters: [
    {
      id: "kaede",
      name: "カエデ（仮）",
      part: "Vo/Gt",
      mainInstrument: "guitar",
      mainGenre: "パンク",
      secondMainGenres: ["ロック", "ポップ"],
      subGenres: ["青春パンク", "メロディックパンク", "オルタナロック"],
      weakMainGenres: ["ヒップホップ", "クラシック"],
      weakSubGenres: ["ミクスチャー", "シンフォニック"],
      stats: { stamina: 42, technique: 34, knowledge: 30, sense: 60, mental: 44, teamwork: 34, rhythm: 38, charisma: 62 },
      instruments: {
        vocal: { mark: "◎", lv: 58, cap: 85, potentialCap: 92, growth: 1.15 },
        guitar: { mark: "○", lv: 42, cap: 75, potentialCap: 84, growth: 1.0 },
        drum: { mark: "△", lv: 18, cap: 40, potentialCap: 78, growth: 0.7, hiddenUpgrade: true },
        chorus: { mark: "○", lv: 46, cap: 75, potentialCap: 86, growth: 1.0 }
      },
      joinDifficulty: "低",
      replaceNote: "初期衝動・表現力枠。名前や設定は差し替え可。"
    },
    {
      id: "ritsu",
      name: "リツ（仮）",
      part: "Gt",
      mainInstrument: "guitar",
      mainGenre: "ロック",
      secondMainGenres: ["パンク"],
      subGenres: ["ギターロック", "オルタナロック", "グランジ"],
      weakMainGenres: ["ポップ"],
      weakSubGenres: ["ダンスロック"],
      stats: { stamina: 42, technique: 64, knowledge: 58, sense: 52, mental: 45, teamwork: 38, rhythm: 46, charisma: 30 },
      instruments: {
        guitar: { mark: "◎", lv: 65, cap: 90, potentialCap: 95, growth: 1.15 },
        key: { mark: "○", lv: 42, cap: 72, potentialCap: 84, growth: 0.95 },
        bass: { mark: "△", lv: 28, cap: 55, potentialCap: 82, growth: 0.75, hiddenUpgrade: true },
        chorus: { mark: "△", lv: 24, cap: 48, potentialCap: 60, growth: 0.7 }
      },
      joinDifficulty: "中",
      replaceNote: "曲完成度・ギター職人枠。"
    },
    {
      id: "mio",
      name: "ミオ（仮）",
      part: "Ba",
      mainInstrument: "bass",
      mainGenre: "ポップ",
      secondMainGenres: ["ロック", "ヒップホップ"],
      subGenres: ["ギターポップ", "シティポップ", "メロディックパンク"],
      weakMainGenres: ["メタル"],
      weakSubGenres: ["ハードコア", "メタルコア"],
      stats: { stamina: 62, technique: 48, knowledge: 44, sense: 42, mental: 64, teamwork: 68, rhythm: 58, charisma: 32 },
      instruments: {
        bass: { mark: "◎", lv: 60, cap: 88, potentialCap: 94, growth: 1.1 },
        drum: { mark: "○", lv: 42, cap: 72, potentialCap: 82, growth: 0.95 },
        guitar: { mark: "△", lv: 22, cap: 50, potentialCap: 78, growth: 0.7, hiddenUpgrade: true },
        chorus: { mark: "○", lv: 40, cap: 68, potentialCap: 78, growth: 0.95 }
      },
      joinDifficulty: "低〜中",
      replaceNote: "安定・協調性枠。初心者救済の軸。"
    },
    {
      id: "sena",
      name: "セナ（仮）",
      part: "Dr",
      mainInstrument: "drum",
      mainGenre: "パンク",
      secondMainGenres: ["ロック", "メタル"],
      subGenres: ["青春パンク", "メロディックパンク", "ハードコア"],
      weakMainGenres: ["クラシック"],
      weakSubGenres: ["室内楽風", "シティポップ"],
      stats: { stamina: 66, technique: 46, knowledge: 28, sense: 44, mental: 46, teamwork: 42, rhythm: 68, charisma: 48 },
      instruments: {
        drum: { mark: "◎", lv: 66, cap: 90, potentialCap: 96, growth: 1.18 },
        vocal: { mark: "△", lv: 25, cap: 55, potentialCap: 68, growth: 0.75 },
        guitar: { mark: "△", lv: 24, cap: 55, potentialCap: 66, growth: 0.7 },
        dj: { mark: "△", lv: 18, cap: 42, potentialCap: 82, growth: 0.7, hiddenUpgrade: true },
        chorus: { mark: "△", lv: 24, cap: 48, potentialCap: 62, growth: 0.7 }
      },
      joinDifficulty: "中",
      replaceNote: "ライブ熱量・ドラム枠。"
    },
    {
      id: "yuuri",
      name: "ユウリ（仮）",
      part: "Key/Syn",
      mainInstrument: "key",
      mainGenre: "ポップ",
      secondMainGenres: ["ジャズ", "ロック"],
      subGenres: ["シティポップ", "ジャズロック", "オルタナロック"],
      weakMainGenres: ["メタル"],
      weakSubGenres: ["ハードコア", "メタルコア"],
      stats: { stamina: 32, technique: 44, knowledge: 60, sense: 65, mental: 38, teamwork: 46, rhythm: 42, charisma: 40 },
      instruments: {
        key: { mark: "◎", lv: 62, cap: 88, potentialCap: 95, growth: 1.1 },
        vocal: { mark: "○", lv: 45, cap: 72, potentialCap: 85, growth: 0.95 },
        chorus: { mark: "◎", lv: 60, cap: 88, potentialCap: 95, growth: 1.1 },
        guitar: { mark: "△", lv: 20, cap: 45, potentialCap: 80, growth: 0.7, hiddenUpgrade: true }
      },
      joinDifficulty: "中〜高",
      replaceNote: "エモ・余韻・コーラス枠。"
    },
    {
      id: "inahiko",
      name: "イナヒコ（仮）",
      part: "DJ/Ba",
      mainInstrument: "dj",
      mainGenre: "ヒップホップ",
      secondMainGenres: ["ロック", "ポップ"],
      subGenres: ["ラップロック", "トラップ", "ミクスチャー"],
      weakMainGenres: ["クラシック"],
      weakSubGenres: ["青春パンク"],
      stats: { stamina: 46, technique: 62, knowledge: 58, sense: 57, mental: 44, teamwork: 28, rhythm: 66, charisma: 58 },
      instruments: {
        dj: { mark: "◎", lv: 72, cap: 90, potentialCap: 95, growth: 1.1 },
        bass: { mark: "○", lv: 45, cap: 70, potentialCap: 96, growth: 0.9, hiddenUpgrade: true },
        guitar: { mark: "△", lv: 24, cap: 48, potentialCap: 60, growth: 0.7 },
        vocal: { mark: "△", lv: 34, cap: 62, potentialCap: 78, growth: 0.75 },
        chorus: { mark: "○", lv: 42, cap: 68, potentialCap: 78, growth: 0.95 }
      },
      joinDifficulty: "高",
      replaceNote: "尖り・SNS・DJ枠。ベース伸びしろのサンプル。"
    }
  ],
  coverSongs: [
    { id: "cover_01", title: "コピー曲：定番ロック", isCover: true, catchy: 42, tempo: 40, mainGenre: "ロック", subGenre: "ギターロック", genre: "ギターロック", recognition: 42, lyrics: 30, performance: 42, trend: 32, tags: ["定番", "客受け"] },
    { id: "cover_02", title: "コピー曲：疾走パンク", isCover: true, catchy: 38, tempo: 48, mainGenre: "パンク", subGenre: "青春パンク", genre: "青春パンク", recognition: 36, lyrics: 26, performance: 39, trend: 30, tags: ["疾走感", "爆発力"] },
    { id: "cover_03", title: "コピー曲：夜のオルタナロック", isCover: true, catchy: 30, tempo: 25, mainGenre: "ロック", subGenre: "オルタナロック", genre: "オルタナロック", recognition: 34, lyrics: 42, performance: 35, trend: 30, tags: ["エモさ", "余韻"] },
    { id: "cover_04", title: "コピー曲：フェス向けギターポップ", isCover: true, catchy: 48, tempo: 38, mainGenre: "ポップ", subGenre: "ギターポップ", genre: "ギターポップ", recognition: 46, lyrics: 28, performance: 36, trend: 45, tags: ["定番", "客受け"] },
    { id: "cover_05", title: "コピー曲：重低音ラップロック", isCover: true, catchy: 34, tempo: 43, mainGenre: "ヒップホップ", subGenre: "ラップロック", genre: "ラップロック", recognition: 32, lyrics: 24, performance: 40, trend: 38, tags: ["個性", "爆発力"] }
  ],
  supportOptions: [
    { id: "sup_guitar", name: "サポートギター", instrument: "guitar", cost: 5000, score: 8, genres: ["ロック", "ギターロック", "オルタナロック", "メロディックパンク"] },
    { id: "sup_bass", name: "サポートベース", instrument: "bass", cost: 5000, score: 8, genres: ["ポップ", "ギターポップ", "メロディックパンク", "ミクスチャー"] },
    { id: "sup_drum", name: "サポートドラム", instrument: "drum", cost: 8000, score: 11, genres: ["パンク", "青春パンク", "メロディックパンク", "ハードコア"] },
    { id: "sup_key", name: "サポートキーボード", instrument: "key", cost: 7000, score: 10, genres: ["ポップ", "シティポップ", "ジャズロック", "クラシック"] },
    { id: "sup_dj", name: "サポートDJ", instrument: "dj", cost: 9000, score: 12, genres: ["ヒップホップ", "ラップロック", "トラップ", "ミクスチャー"] },
    { id: "sup_other", name: "その他楽器サポート", instrument: "other", cost: 6000, score: 7, genres: ["ジャズ", "クラシック", "ポップ", "ロック"] }
  ]};

// v0.2.1: 仮キャラ追加。ここは本キャラに差し替え前提。
DATA.candidateCharacters.push(
  {
    id: "ranka", name: "ランカ（仮）", part: "Vo", mainInstrument: "vocal", mainGenre: "ポップ", secondMainGenres: ["ジャズ", "ロック"],
    subGenres: ["シティポップ", "ジャズロック", "ギターポップ"], weakMainGenres: ["メタル"], weakSubGenres: ["ハードコア", "メタルコア"],
    stats: { stamina: 38, technique: 36, knowledge: 44, sense: 62, mental: 42, teamwork: 48, rhythm: 38, charisma: 68 },
    instruments: { vocal:{mark:"◎",lv:64,cap:88,potentialCap:96,growth:1.15}, chorus:{mark:"◎",lv:62,cap:88,potentialCap:96,growth:1.1}, key:{mark:"△",lv:24,cap:52,potentialCap:72,growth:.75} },
    joinDifficulty: "中", replaceNote: "ポップ寄りボーカル枠。仮キャラ。"
  },
  {
    id: "gaku", name: "ガク（仮）", part: "Gt/Vo", mainInstrument: "guitar", mainGenre: "メタル", secondMainGenres: ["ロック", "パンク"],
    subGenres: ["ヘヴィメタル", "メタルコア", "ハードコア"], weakMainGenres: ["ポップ"], weakSubGenres: ["シティポップ", "ダンスロック"],
    stats: { stamina: 58, technique: 66, knowledge: 46, sense: 42, mental: 48, teamwork: 32, rhythm: 54, charisma: 42 },
    instruments: { guitar:{mark:"◎",lv:70,cap:92,potentialCap:98,growth:1.15}, vocal:{mark:"△",lv:32,cap:58,potentialCap:75,growth:.8}, bass:{mark:"○",lv:44,cap:76,potentialCap:88,growth:.95}, chorus:{mark:"△",lv:28,cap:54,potentialCap:66,growth:.7} },
    joinDifficulty: "中〜高", replaceNote: "メタル・技巧派ギター枠。仮キャラ。"
  },
  {
    id: "toma", name: "トーマ（仮）", part: "Ba", mainInstrument: "bass", mainGenre: "ジャズ", secondMainGenres: ["ポップ", "ヒップホップ"],
    subGenres: ["フュージョン", "ジャズロック", "ミクスチャー"], weakMainGenres: ["メタル"], weakSubGenres: ["メタルコア"],
    stats: { stamina: 50, technique: 60, knowledge: 66, sense: 54, mental: 55, teamwork: 56, rhythm: 64, charisma: 28 },
    instruments: { bass:{mark:"◎",lv:68,cap:92,potentialCap:98,growth:1.12}, key:{mark:"○",lv:42,cap:72,potentialCap:84,growth:.95}, guitar:{mark:"△",lv:24,cap:52,potentialCap:70,growth:.7}, chorus:{mark:"△",lv:24,cap:50,potentialCap:62,growth:.7} },
    joinDifficulty: "中", replaceNote: "ジャズ・理論派ベース枠。仮キャラ。"
  },
  {
    id: "naru", name: "ナル（仮）", part: "Dr", mainInstrument: "drum", mainGenre: "メタル", secondMainGenres: ["パンク", "ヒップホップ"],
    subGenres: ["メタルコア", "ハードコア", "ラップロック"], weakMainGenres: ["クラシック"], weakSubGenres: ["室内楽風"],
    stats: { stamina: 74, technique: 54, knowledge: 30, sense: 38, mental: 46, teamwork: 35, rhythm: 72, charisma: 40 },
    instruments: { drum:{mark:"◎",lv:72,cap:94,potentialCap:99,growth:1.2}, dj:{mark:"△",lv:22,cap:48,potentialCap:80,growth:.7, hiddenUpgrade:true}, bass:{mark:"△",lv:28,cap:56,potentialCap:74,growth:.75}, chorus:{mark:"×",lv:10,cap:35,potentialCap:40,growth:.5} },
    joinDifficulty: "高", replaceNote: "重いドラム・体力枠。仮キャラ。"
  },
  {
    id: "suzu", name: "スズ（仮）", part: "Key/Other", mainInstrument: "key", mainGenre: "クラシック", secondMainGenres: ["ジャズ", "ポップ"],
    subGenres: ["シンフォニック", "室内楽風", "フュージョン"], weakMainGenres: ["パンク"], weakSubGenres: ["ハードコア"],
    stats: { stamina: 34, technique: 58, knowledge: 72, sense: 62, mental: 50, teamwork: 54, rhythm: 44, charisma: 26 },
    instruments: { key:{mark:"◎",lv:70,cap:94,potentialCap:99,growth:1.15}, other:{mark:"○",lv:48,cap:78,potentialCap:92,growth:1.0}, vocal:{mark:"△",lv:26,cap:56,potentialCap:70,growth:.7}, chorus:{mark:"○",lv:48,cap:76,potentialCap:88,growth:.95} },
    joinDifficulty: "中〜高", replaceNote: "クラシック・編曲/その他楽器枠。仮キャラ。"
  },
  {
    id: "ren", name: "レン（仮）", part: "MC/DJ", mainInstrument: "dj", mainGenre: "ヒップホップ", secondMainGenres: ["ポップ", "ロック"],
    subGenres: ["トラップ", "ラップロック", "ダンスロック"], weakMainGenres: ["クラシック"], weakSubGenres: ["室内楽風"],
    stats: { stamina: 44, technique: 48, knowledge: 46, sense: 64, mental: 52, teamwork: 30, rhythm: 70, charisma: 72 },
    instruments: { dj:{mark:"◎",lv:74,cap:92,potentialCap:99,growth:1.12}, vocal:{mark:"○",lv:50,cap:76,potentialCap:90,growth:.95}, chorus:{mark:"○",lv:44,cap:72,potentialCap:84,growth:.9}, bass:{mark:"△",lv:24,cap:52,potentialCap:78,growth:.72, hiddenUpgrade:true} },
    joinDifficulty: "高", replaceNote: "ヒップホップ・MC/DJ枠。仮キャラ。"
  }
);


normalizeInitialData();

function normalizeInitialData() {
  const allChars = [DATA.player, ...DATA.candidateCharacters];
  allChars.forEach(ch => {
    Object.keys(ch.stats || {}).forEach(k => {
      ch.stats[k] = Math.max(6, Math.round(ch.stats[k] * 0.18 + 2));
    });
    Object.values(ch.instruments || {}).forEach(ins => {
      ins.lv = Math.max(5, Math.round((ins.lv || 20) * 0.18 + 2));
      ins.cap = Math.max(58, Math.round((ins.cap || 70) * 0.78));
      ins.potentialCap = Math.max(ins.cap + 8, Math.round((ins.potentialCap || ins.cap || 80) * 0.88));
    });
  });
}

// 今回は簡易実装にしてある差し替え候補。READMEにも同じ内容を載せています.
const DEFERRED_REPLACEMENTS = {
  characterArt: "現在は文字カードのみ。後で立ち絵・表情差分・ライブ用差分に差し替え可能。",
  dropoutSystem: "v0.1.9で控え自然脱退の事前報告/離脱リスクを追加。正式版では不満ゲージ/警告/個別脱退イベントへ差し替え。",
  hiddenAptitude: "楽器のhiddenUpgradeに加え、サブジャンルは隠し表示。ライブで演奏すると判明し、localStorageで次周回以降も保持。",
  supportRecruit: "好感度を蓄積。正式版では80以上で正規加入イベントに差し替え。",
  adlibSystem: "ライブ評価内で自動判定。正式版では曲順入れ替え演出へ差し替え。",
  merchInventory: "在庫は簡略化。正式版では在庫持ち越し・限定盤・デザイン更新へ差し替え。",
  shopSystem: "v0.1.9で簡易ショップ/もちものを継続。正式版では楽器・エフェクター・消耗品・機材グレードに差し替え。",
  memberRoster: "v0.1.9でバンド構成/控え/入替/脱退/控え自然離脱を簡易追加。正式版では契約形態・活動方針・固定イベントに差し替え。",
  vocalistChange: "初ライブ後からボーカル選択あり。正式版では曲ごとのボーカル選択へ拡張可能。"
};

const app = document.getElementById("app");

function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function avg(arr) { return arr.length ? arr.reduce((a,b)=>a+b,0) / arr.length : 0; }
function sum(arr) { return arr.reduce((a,b)=>a+b,0); }
function hasTag(song, tag) { return (song.tags || []).includes(tag); }
function val(n) { return Math.round(n); }
function escapeHtml(str) { return String(str).replace(/[&<>\"]/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[s])); }
function instLabel(inst) { return { vocal:"Vo", guitar:"Gt", bass:"Ba", drum:"Dr", key:"Key", dj:"DJ", chorus:"Cho", other:"Other", off:"休" }[inst] || inst; }
function instFullLabel(inst) { return { vocal:"ボーカル", guitar:"ギター", bass:"ベース", drum:"ドラム", key:"キーボード/シンセ", dj:"DJ", chorus:"コーラス", other:"その他楽器", off:"ステージ外" }[inst] || inst; }
function statLabel(key) { return { stamina:"体力", technique:"技術", knowledge:"知識", sense:"センス", mental:"メンタル", teamwork:"協調性", rhythm:"リズム", charisma:"カリスマ" }[key] || key; }
function initials(name) { return String(name).replace(/[（(].*?[）)]/g, "").slice(0, 2); }

const DISCOVERY_KEY = "underground_v014_discovered_subgenres"; // v0.2.4でも継続利用
const SAVE_KEY = "underground_v020_save";
const AUTOSAVE_KEY = "underground_v020_autosave";
const SAVE_VERSION = "v0.3.4";
function loadDiscoveredSubGenres() {
  try { return JSON.parse(localStorage.getItem(DISCOVERY_KEY) || "{}"); } catch (e) { return {}; }
}
function saveDiscoveredSubGenres() {
  try { localStorage.setItem(DISCOVERY_KEY, JSON.stringify(state.discoveredSubGenres || {})); } catch (e) {}
}

function safeStorageSet(key, value) {
  try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
}
function safeStorageGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function saveGame(manual=false) {
  const payload = {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    state
  };
  const ok = safeStorageSet(SAVE_KEY, JSON.stringify(payload));
  if (manual) {
    state.saveNotice = ok ? "セーブしました。スマホでも同じブラウザなら続きから遊べます。" : "セーブに失敗しました。ブラウザの保存容量やプライベートモードを確認してください。";
    log(ok ? "手動セーブした。" : "手動セーブに失敗した。");
    render();
  }
  return ok;
}
function autoSaveGame() {
  if (!state) return;
  const payload = { version: SAVE_VERSION, savedAt: new Date().toISOString(), state };
  safeStorageSet(AUTOSAVE_KEY, JSON.stringify(payload));
}
function restoreGame() {
  const raw = safeStorageGet(SAVE_KEY) || safeStorageGet(AUTOSAVE_KEY);
  if (!raw) { log("ロードできるセーブデータがありません。"); render(); return; }
  try {
    const payload = JSON.parse(raw);
    if (!payload || !payload.state) throw new Error("invalid save");
    state = payload.state;
    state.saveNotice = `${payload.version || "旧版"} のセーブをロードしました。`;
    state.logs = state.logs || [];
    state.logs.unshift(`セーブデータをロードした。保存日時: ${payload.savedAt ? new Date(payload.savedAt).toLocaleString("ja-JP") : "不明"}`);
    scheduleNextLive();
    render();
  } catch (e) {
    log("セーブデータの読み込みに失敗しました。");
    render();
  }
}
function deleteSave() {
  try { localStorage.removeItem(SAVE_KEY); localStorage.removeItem(AUTOSAVE_KEY); } catch (e) {}
  state.saveNotice = "セーブデータを削除しました。現在のプレイは画面上には残っています。";
  log("保存済みセーブデータを削除した。");
  render();
}
function saveStatusText() {
  const raw = safeStorageGet(SAVE_KEY) || safeStorageGet(AUTOSAVE_KEY);
  if (!raw) return "セーブなし";
  try {
    const payload = JSON.parse(raw);
    return `${payload.version || "旧版"} / ${payload.savedAt ? new Date(payload.savedAt).toLocaleString("ja-JP") : "保存日時不明"}`;
  } catch (e) { return "セーブあり（詳細不明）"; }
}
function isSubGenreDiscovered(memberId, subGenre) {
  return !!(state?.discoveredSubGenres?.[memberId] || []).includes(subGenre);
}
function discoveredSubGenresFor(member) {
  return (member.subGenres || []).filter(sg => isSubGenreDiscovered(member.id, sg));
}
function hiddenSubGenreCount(member) {
  return Math.max(0, (member.subGenres || []).length - discoveredSubGenresFor(member).length);
}
function revealSubGenre(member, subGenre, reason) {
  if (!member?.id || !(member.subGenres || []).includes(subGenre)) return false;
  state.discoveredSubGenres[member.id] = state.discoveredSubGenres[member.id] || [];
  if (!state.discoveredSubGenres[member.id].includes(subGenre)) {
    state.discoveredSubGenres[member.id].push(subGenre);
    saveDiscoveredSubGenres();
    log(`${reason}で、${member.name}の隠しサブジャンル「${subGenre}」が判明した。次周回以降も表示される。`);
    return true;
  }
  return false;
}

let state = createInitialState();

function createInitialState() {
  const player = clone(DATA.player);
  const starterSong = {
    id: "song_001",
    title: "夜明け前のチューニング",
    isCover: false,
    catchy: 16,
    tempo: 18,
    mainGenre: "パンク",
    subGenre: "青春パンク",
    genre: "青春パンク",
    recognition: 2,
    lyrics: 18,
    performance: 14,
    trend: 12,
    tags: ["エモさ", "初手向き"],
    standardPoints: 0,
    representativePoints: 0
  };
  const liveEvents = generateInitialLiveEvents();
  return {
    turn: 1,
    maxTurn: 30,
    liveEvents,
    liveSchedule: liveEvents.map(e => e.turn).sort((a,b)=>a-b),
    nextLiveTurn: 5,
    liveCount: 0,
    ended: false,
    player,
    members: [],
    memberCap: 4,
    items: { drink: 0, effecter: 0, usedGear: 0, lightFx: 0 },
    candidates: clone(DATA.candidateCharacters),
    songs: [starterSong],
    pendingDrafts: [],
    discoveredSubGenres: loadDiscoveredSubGenres(),
    songcraftUsedThisTurn: false,
    songEditor: { step: "closed" },
    introSeen: false,
    tutorialStage: "intro",
    bandNamePrompt: false,
    pendingFesReveal: false,
    pendingTurnAdvance: null,
    scheduleTutorialStage: "none",
    playerExtraInstrumentsUnlocked: false,
    postLiveStory: null,
    discoveredGenres: {},
    fesInfoKnown: false,
    view: "home",
    selectedMemberId: "player",
    band: {
      funds: 45000,
      fans: 0,
      fame: 0,
      core: 0,
      industry: 0,
      trust: 12,
      fatigue: 8,
      name: "",
      direction: { "パンク": 18, "青春パンク": 12, "ロック": 8 }
    },
    supportAffinity: {},
    logs: ["地下のスタジオから、最大30ターンの育成が始まった。初ライブは5ターン目固定。初回ライブ後は、自分でライブスケジュールを予約する方式。予約・キャンセルは残り2ターン以内になると不可。"],
    lastApplicant: null,
    liveResultHistory: [],
    saveNotice: "",
    activePopup: null,
    pendingNoSongcraftCommand: null,
    pendingBooking: null,
    lastSongcraftResult: null,
    turnNotice: null,
    actionResultModal: null,
    liveProgressModal: null,
    pendingLiveResultModal: null,
    liveResultModal: null,
    lastLogType: "info",
    telopFlash: 0,
    installHintDismissed: false
  };
}

function generateInitialLiveEvents() {
  return [
    fixedLiveEvent(5, "garage", "初ライブ", true),
    fixedLiveEvent(30, "big_stage", "UNDER FES選考ライブ", true)
  ];
}
function refreshLiveSchedule() {
  state.liveEvents = (state.liveEvents || []).filter(e => !e.cancelled).sort((a,b)=>a.turn-b.turn);
  state.liveSchedule = state.liveEvents.map(e => e.turn);
}
function liveEventForTurn(turn) {
  return (state.liveEvents || []).find(e => e.turn === turn && !e.cancelled) || null;
}
function currentLiveEvent() {
  return liveEventForTurn(state.turn) || liveEventForTurn(state.nextLiveTurn) || fixedLiveEvent(30, "big_stage", "UNDER FES選考ライブ", true);
}
function canBookSchedules() {
  return state.turn > 5 || state.liveResultHistory.length > 0;
}
function activeMembers() { return [state.player, ...state.members.slice(0, Math.max(0, (state.memberCap || 4) - 1))]; }
function reserveMembers() { return state.members.slice(Math.max(0, (state.memberCap || 4) - 1)); }
function officialMembers() { return state.members; }
function allBandPeople() { return [state.player, ...state.members]; }
function selectedMember() { return allBandPeople().find(m => m.id === state.selectedMemberId) || state.player; }
function isLiveTurn() { refreshLiveSchedule(); return state.liveSchedule.includes(state.turn); }
function popularity() { return state.band.fans + state.band.fame; }
function liveIndexForTurn(turn) { return state.liveSchedule.indexOf(turn); }
function liveNameByIndex(index) {
  const ev = state.liveEvents?.[index];
  return ev?.label || ev?.name || "通常ライブ";
}
function currentLiveName() {
  const ev = liveEventForTurn(state.turn) || liveEventForTurn(state.nextLiveTurn);
  return ev?.label || ev?.name || "通常ライブ";
}
function scheduleNextLive() {
  refreshLiveSchedule();
  const next = state.liveEvents.find(e => e.turn >= state.turn && !e.cancelled);
  state.nextLiveTurn = next ? next.turn : 30;
}
function nextLiveLabel() {
  const ev = liveEventForTurn(state.nextLiveTurn);
  return `${state.nextLiveTurn}T ${ev?.label || ev?.name || "ライブ"}`;
}
function turnsUntilNextLive() { return Math.max(0, state.nextLiveTurn - state.turn); }
function log(msg, type="info") {
  state.logs.unshift(msg);
  state.lastLogType = type;
  state.telopFlash = Date.now();
}
function showEventPopup(title, body, type="info", icon="🎸", payload={}) {
  state.activePopup = { title, body, type, icon, ...(payload || {}) };
}
function closeActivePopup() {
  state.activePopup = null;
  render();
}
function closeLiveResultModal() {
  state.liveResultModal = null;
  if (state.postLiveStory) {
    const ev = state.postLiveStory;
    state.postLiveStory = null;
    state.activePopup = { title:ev.title, body:ev.body, type:"event", icon:ev.icon || "🕴️" };
  } else if (Array.isArray(state.popupQueue) && state.popupQueue.length) {
    state.activePopup = state.popupQueue.shift();
  }
  render();
}
function closeActionResultModal() {
  state.actionResultModal = null;
  state.lastSongcraftResult = null;
  // 行動結果を確認してからターンを進める。
  if (state.pendingTurnAdvance) {
    const pending = state.pendingTurnAdvance;
    if (pending.nextTurn === 5 && !state.band.name) {
      state.bandNamePrompt = true;
      render();
      return;
    }
    finishPendingTurnAdvance();
    return;
  }
  state.turnNotice = null;
  render();
}

function finishPendingTurnAdvance() {
  const pending = state.pendingTurnAdvance;
  if (!pending) { render(); return; }
  state.pendingTurnAdvance = null;
  state.turn = pending.nextTurn;
  state.view = "home";
  scheduleNextLive();
  state.turnNotice = { turn: state.turn, next: state.nextLiveTurn, label: currentLiveName(), remain: turnsUntilNextLive() };
  state.songcraftUsedThisTurn = false;
  render();
}
function showLiveResultAfterProgress() {
  state.liveProgressModal = null;
  state.liveResultModal = state.pendingLiveResultModal;
  state.pendingLiveResultModal = null;
  render();
}
function scheduleLiveProgressTimer() {
  if (window.__liveProgressTimer) clearTimeout(window.__liveProgressTimer);
  if (!state.liveProgressModal) return;
  window.__liveProgressTimer = setTimeout(() => {
    if (!state.liveProgressModal) return;
    state.liveProgressModal.index = (state.liveProgressModal.index || 0) + 1;
    if (state.liveProgressModal.index >= (state.liveProgressModal.steps || []).length) {
      showLiveResultAfterProgress();
    } else {
      render();
    }
  }, 2000);
}
function makeLiveProgressModal(result, setlist) {
  const baseIcons = [];
  if (result.adlib?.text && result.adlib.text !== "なし") baseIcons.push({ icon:"⚡", text:`アドリブ${result.adlib.text}` });
  if (result.repeatInfo?.hasRepeats) baseIcons.push({ icon: result.repeatInfo.boom ? "🎤" : "⚠️", text: result.repeatInfo.boom ? "再演が刺さった" : "再演が裏目" });
  if (result.total >= 80) baseIcons.push({ icon:"⭐", text:"奇跡の一体感" });
  if (state.band.fatigue > 60) baseIcons.push({ icon:"💧", text:"疲労が見える" });
  if (!baseIcons.length) baseIcons.push({ icon:"🔥", text:"客席が温まってきた" });
  const steps = setlist.map((s, i) => {
    const icon = baseIcons[i % baseIcons.length];
    return {
      slot: i + 1,
      line: liveSongLine(s, i + 1, result.rank),
      icon: icon.icon,
      event: icon.text
    };
  });
  return { title: currentLiveName(), rank: result.rank, total: val(result.total), steps, index:0 };
}
function liveSongLine(song, slot, rank) {
  if (slot === 1) return `1曲目『${song.title}』 客席の視線をつかみにいく。`;
  if (slot === 5) return `5曲目『${song.title}』 最後のサビに今日の全部を乗せた。`;
  if (["S","A"].includes(rank)) return `${slot}曲目『${song.title}』 会場の熱が少しずつ上がっていく。`;
  if (["D","E"].includes(rank)) return `${slot}曲目『${song.title}』 荒さもあるが、前へ進もうとしている。`;
  return `${slot}曲目『${song.title}』 バンドの色が見え始めた。`;
}
function firstLine(text) {
  return String(text || "").split("\n").find(Boolean) || "地下から始まる。";
}

function normalizeState() {
  if (!state.songEditor) state.songEditor = { step: "closed" };
  if (typeof state.introSeen !== "boolean") state.introSeen = true;
  if (!state.tutorialStage) state.tutorialStage = "done";
  if (typeof state.fesInfoKnown !== "boolean") state.fesInfoKnown = false;
  if (typeof state.pendingNoSongcraftCommand === "undefined") state.pendingNoSongcraftCommand = null;
  if (typeof state.pendingTurnAdvance === "undefined") state.pendingTurnAdvance = null;
  if (!state.scheduleTutorialStage) state.scheduleTutorialStage = "none";
  if (typeof state.playerExtraInstrumentsUnlocked === "undefined") state.playerExtraInstrumentsUnlocked = false;
  if (typeof state.actionResultModal === "undefined") state.actionResultModal = null;
  if (typeof state.pendingBooking === "undefined") state.pendingBooking = null;
  if (typeof state.lastSongcraftResult === "undefined") state.lastSongcraftResult = null;
  if (typeof state.turnNotice === "undefined") state.turnNotice = null;
  if (typeof state.liveProgressModal === "undefined") state.liveProgressModal = null;
  if (typeof state.pendingLiveResultModal === "undefined") state.pendingLiveResultModal = null;
  if (!state.discoveredGenres) state.discoveredGenres = {};
  if (!state.band) state.band = {};
  if (typeof state.band.name === "undefined") state.band.name = "";
  if (!state.view) state.view = "home";
}


function renderIntroScreen() {
  app.innerHTML = `
    <div class="intro-screen">
      <div class="poster-card">
        <div class="poster-noise"></div>
        <span class="poster-kicker">NEXT GENERATION AUDITION</span>
        <h1>UNDER<br>FES</h1>
        <p>地下から、名前を鳴らせ。</p>
        <b>ENTRY WANTED</b>
      </div>
      <div class="intro-copy">
        <p class="intro-quote">「必ず、UNDERフェスに出てやる！」</p>
        <div class="intro-goal">
          <b>目標</b>
          <span>30ターン以内に曲を作り、仲間を集め、ライブで実績を残す。</span>
          <span>最終的にUNDER FES出演を目指そう。</span>
        </div>
        <button id="startIntroBtn" class="big-action">活動を始める</button>
      </div>
    </div>
  `;
  const btn = document.getElementById("startIntroBtn");
  if (btn) btn.addEventListener("click", () => {
    state.introSeen = true;
    state.tutorialStage = "needSong";
    state.activePopup = { title:"活動開始", body:"まずは、曲でも作るか……\n作詞・作曲から新曲制作を始めよう。", type:"event", icon:"🎼" };
    saveGame(false);
    render();
  });
}

function maybeTriggerStoryEvents() {
  if (state.activePopup || state.actionResultModal || state.liveProgressModal || state.liveResultModal || state.bandNamePrompt) return;
  if (state.turn >= 4 && !state.band.name && !isLiveTurn()) {
    state.bandNamePrompt = true;
    return;
  }
  if (state.pendingFesReveal) {
    state.pendingFesReveal = false;
    state.fesInfoKnown = true;
    state.activePopup = {
      title:"UNDER FES情報入手",
      body:"あの人は、UNDERフェスの主催関係者だったらしい。\nフェス参加条件の目安が分かった。スケジュール帳で確認できるようになった。",
      type:"rare",
      icon:"📄"
    };
  }
}

function completeSongcraftTutorial() {
  state.songcraftUsedThisTurn = true;
  if (state.tutorialStage === "needSong") {
    state.tutorialStage = "needCommand";
    state.view = "home";
    state.activePopup = { title:"今週は何しよう……", body:"曲作りの手応えはあった。\n次は今週の行動を選ぼう。練習・募集・バイトなどでバンドを動かせる。", type:"event", icon:"⚡" };
  }
}

function showTutorialBlocked(kind) {
  if (state.tutorialStage === "needSong") {
    // 初回チュートリアル中は「作詞・作曲」だけ通す。
    // v0.3.0ではここで song もブロックしてしまい、
    // 曲作りポップアップ後に先へ進めない状態になっていた。
    if (kind === "song") return false;
    state.activePopup = { title:"まずは曲作り", body:"最初は作詞・作曲から始めよう。\nホームの「作詞・作曲」だけが使える。", type:"event", icon:"🎼" };
    render();
    return true;
  }
  if (state.tutorialStage === "needCommand" && kind !== "command") {
    state.activePopup = { title:"今週の行動を選ぼう", body:"曲作りは進んだ。\n次は「今週の行動へ」から1ターン進めよう。", type:"event", icon:"⚡" };
    render();
    return true;
  }
  return false;
}

function render() {
  normalizeState();
  if (!state.introSeen) return renderIntroScreen();
  maybeTriggerStoryEvents();
  if (state.ended) return renderEnding();
  const liveMode = isLiveTurn();
  app.innerHTML = `
    <div class="app-shell">
      <div class="hero">
        <div>
          <h1>アンダーグラウンド（仮） v0.3.4</h1>
          <p>イントロ・チュートリアル・イベント/ライブ演出強化版。</p>
        </div>
        <div class="hero-actions"><button class="jumpTabBtn ghost-btn schedule-head-btn" data-view="schedule">予定</button><button id="refreshAppBtn" class="ghost-btn update-btn">最新版</button><button id="saveBtn" class="ghost-btn">セーブ</button><button id="loadBtn" class="ghost-btn">ロード</button><button id="deleteSaveBtn" class="ghost-btn danger">セーブ削除</button><button id="restartMiniBtn" class="ghost-btn">最初から</button></div>
      </div>
      ${renderTimeline()}
      ${renderTopStats()}
      ${renderTelop()}
      ${renderNav(liveMode)}
      ${liveMode ? renderLivePrep() : renderMainContent()}
      ${renderFloatingHomeButton(liveMode)}
      ${renderOverlays()}
    </div>
  `;
  bindEvents();
  scheduleLiveProgressTimer();
  autoSaveGame();
}

function renderFloatingHomeButton(liveMode=false) {
  if ((state.view || "home") === "home" || liveMode) return "";
  return `<button class="floatingHomeBtn jumpTabBtn" data-view="home" aria-label="ホームへ戻る">🏠</button>`;
}

function renderNav(liveMode=false) {
  const tabs = [
    ["home", "ホーム", "🏠"],
    ["command", "コマンド", "⚡"],
    ["band", "バンド編成", "👥"],
    ["songs", "曲", "🎼"],
    ["schedule", "予定", "📅"],
    ["shop", "ショップ", "🛒"],
    ["log", "ログ", "📺"]
  ];
  return `<div class="tabbar ${liveMode ? "live-lock" : ""}">
    ${tabs.map(([id,label,icon]) => `<button class="tabBtn ${state.view===id ? "active" : ""}" data-view="${id}" ${liveMode ? "disabled" : ""}><span>${icon}</span><b>${label}</b></button>`).join("")}
    ${liveMode ? `<div class="tab-live-note">今日はライブ本番。準備画面に集中。</div>` : ""}
  </div>`;
}

function renderMainContent() {
  let html;
  if (state.view === "command") html = renderCommandDesk();
  else if (state.view === "band") html = renderBandScreen();
  else if (state.view === "songs") html = renderSongsScreen();
  else if (state.view === "schedule") html = renderScheduleScreen();
  else if (state.view === "shop") html = renderShopScreen();
  else if (state.view === "log") html = renderLogScreen();
  else html = renderHomeScreen();
  return `<main class="view-panel" data-view="${state.view || "home"}">${html}</main>`;
}

function renderHomeScreen() {
  const latest = firstLine(state.logs[0]);
  return `
    <div class="home-simple">
      <div class="card home-log-card">
        <div class="section-title"><h2>ログ</h2><span class="badge warn">最新</span></div>
        <div class="home-latest-log">${escapeHtml(latest)}</div>
      </div>
      <div class="card tips-card">
        <div class="section-title"><h2>おすすめ行動 / Tips</h2><span class="badge">今週</span></div>
        <p>${successAdvice()}</p>
      </div>
      <div class="card home-menu-card command-window">
        <div class="success-window-title"><span>MENU</span><b>今週やること</b><small>画面を選ぶ</small></div>
        <div class="home-menu-grid">
          ${homeMenuButton("command", "⚡", "今週の行動へ", "練習・休憩・募集など")}
          ${homeMenuButton("band", "👥", "バンドの編成", "主人公・仲間・控え確認")}
          ${homeSongMenuButton()}
          ${homeMenuButton("schedule", "📅", "スケジュール帳", canBookSchedules() ? "ライブ予約・キャンセル" : "初ライブ後に解放", !canBookSchedules())}
          ${homeMenuButton("shop", "🛒", "ショップ", "回復・機材・演出アイテム")}
          ${homeMenuButton("log", "📺", "ログ", "イベント履歴を見る")}
        </div>
      </div>
    </div>
  `;
}


function homeMenuButton(view, icon, label, small, forceLocked=false) {
  const scheduleLock = state.scheduleTutorialStage === "needSchedule" && view !== "schedule";
  const locked = forceLocked || state.tutorialStage === "needSong" || (state.tutorialStage === "needCommand" && view !== "command") || scheduleLock;
  const note = state.tutorialStage === "needSong" ? "まずは曲作り" : state.tutorialStage === "needCommand" && view !== "command" ? "先に今週の行動" : scheduleLock ? "まず予定を確認" : small;
  return `<button class="jumpTabBtn menu-tile ${locked ? "locked" : ""}" data-view="${view}" ${locked ? "disabled" : ""}><span>${icon}</span><b>${label}</b><small>${note}</small></button>`;
}
function homeSongMenuButton() {
  const locked = state.tutorialStage === "needCommand" || state.scheduleTutorialStage === "needSchedule";
  const note = state.scheduleTutorialStage === "needSchedule" ? "まず予定を確認" : locked ? "次は行動を選ぼう" : "新曲・強化・未完成曲";
  return `<button class="openSongEditorBtn menu-tile ${locked ? "locked" : ""}" ${locked ? "disabled" : ""}><span>🎼</span><b>作詞・作曲</b><small>${note}</small></button>`;
}

function renderSavePanel() {
  return `<div class="save-panel">
    <div><b>SAVE</b><span>${saveStatusText()}</span></div>
    <div class="mini-actions"><button id="homeSaveBtn">セーブ</button><button id="homeLoadBtn">ロード</button></div>
    ${state.saveNotice ? `<small>${escapeHtml(state.saveNotice)}</small>` : `<small>行動・曲作り・ライブ後にオートセーブも入ります。</small>`}
  </div>`;
}
function renderPwaPanel() {
  return `<div class="pwa-panel">
    <b>スマホ確認</b>
    <span>GitHub Pagesで開いたら、ブラウザメニューから「ホーム画面に追加」。v0.3.4は縦画面推奨。古い表示なら「最新版を読み込む」。</span><button id="pwaRefreshBtn" class="ghost-btn update-btn">最新版を読み込む</button>
  </div>`;
}

function renderSchedulePanel() {
  refreshLiveSchedule();
  const events = state.liveEvents.filter(e => e.turn >= state.turn).sort((a,b)=>a.turn-b.turn);
  const canBook = canBookSchedules();
  const candidates = canBook ? buildLiveCandidates() : [];
  return `<div class="schedule-panel">
    <div class="section-title"><h3>スケジュール帳</h3><span class="badge warn">残り2ターン以内は予約・キャンセル不可</span></div>
    <div class="schedule-list-x booked-list">
      ${events.map(e => renderScheduleEvent(e)).join("") || `<div class="schedule-event empty-panel">予定なし</div>`}
    </div>
    <hr class="soft" />
    <div class="section-title"><h3>出演できるライブ候補</h3><span class="badge ${canBook ? "good" : "warn"}">${canBook ? "選択して予約" : "初ライブ後に解放"}</span></div>
    <div class="live-candidate-list">
      ${canBook ? candidates.map(renderLiveCandidate).join("") || `<div class="empty-panel">予約可能なライブ候補がありません。</div>` : `<div class="empty-panel">初ライブ後から、スケジュール帳で出たいライブを選んで予約できます。</div>`}
    </div>
    <small>${canBook ? "候補カードを押すと予約。大きい会場ほど準備不足時の評価ペナルティが強いです。" : "まずは5ターン目の初ライブを目標に準備しましょう。"}</small>
  </div>`;
}
function buildLiveCandidates() {
  const turns = [];
  for (let t = state.turn + 3; t < 30 && turns.length < 6; t++) {
    if (!liveEventForTurn(t)) turns.push(t);
  }
  const list = [];
  turns.forEach(t => VENUES.forEach(v => list.push({ turn:t, venueId:v.id })));
  return list;
}
function renderLiveCandidate(c) {
  const v = venueById(c.venueId);
  const prep = estimatePrepScore();
  const diff = prep - v.prepNeed;
  const status = diff >= 12 ? "準備十分" : diff >= 0 ? "挑戦圏" : "準備不足";
  const cls = diff >= 0 ? "good" : "risk";
  return `<button class="liveCandidateBtn schedule-event candidate ${cls}" data-turn="${c.turn}" data-venue="${v.id}">
    <strong class="candidate-turn">${c.turn}ターン</strong>
    <b>${v.name}</b>
    <span>キャパ${v.capacity} / 会場費${v.fee.toLocaleString()}円</span>
    <small>要準備${v.prepNeed} / 現在${val(prep)}</small>
    <em>${status}</em>
  </button>`;
}
function renderScheduleEvent(e) {
  const v = venueById(e.venueId);
  const prep = estimatePrepScore();
  const diff = prep - v.prepNeed;
  const status = diff >= 12 ? "準備十分" : diff >= 0 ? "挑戦圏" : "準備不足";
  const cls = e.fixed ? "fixed" : diff >= 0 ? "good" : "risk";
  const remaining = e.turn - state.turn;
  const canCancel = !e.fixed && remaining > 2;
  const cancelBtn = canCancel ? `<button class="cancelLiveBtn ghost-btn" data-turn="${e.turn}">キャンセル</button>` : (!e.fixed ? `<small class="deadline-note">残り2ターン以内：変更不可</small>` : "");
  return `<div class="schedule-event ${cls}">
    <b>${e.turn}T ${e.label || e.name}</b>
    <span>${v.name}</span>
    <small>キャパ${v.capacity} / 会場費${v.fee.toLocaleString()}円 / 要準備${v.prepNeed}</small>
    <em>${status}：現在準備${val(prep)}</em>
    ${cancelBtn}
  </div>`;
}
function estimatePrepScore() {
  const originals = state.songs.filter(s=>!s.isCover).length;
  const avgRec = avg(state.songs.map(s=>s.recognition));
  return state.band.fame * 0.35 + state.band.fans * 0.20 + state.band.industry * 0.30 + state.band.trust * 0.18 + originals * 4 + avgRec * 0.20;
}

function goalChip(label, ok, value="") {
  return `<div class="goal-chip ${ok ? "clear" : "todo"}"><b>${ok ? "CLEAR" : "TODO"}</b><span>${label}</span><em>${value}</em></div>`;
}

function renderCompactMember(m) {
  return `<div class="compact-member"><div class="avatar small">${initials(m.name)}</div><div><b>${m.name}</b><small>${m.part} / 得意:${m.mainGenre}</small></div></div>`;
}

function renderCompactSongs() {
  const latest = state.songs.slice(-5).reverse();
  return `<div class="compact-song-list">${latest.map(s => `<div class="compact-song"><b>${s.title}</b><span>${genreDisplay(s)}</span><div class="meter mini"><div class="fill" style="width:${clamp((s.catchy+s.lyrics+s.performance)/3,0,99)}%"></div></div></div>`).join("")}</div>`;
}

function renderCommandDesk() {
  return `
    <div class="grid main-grid">
      <div class="card success-panel command-window">
        <div class="success-window-title"><span>COMMAND</span><b>今週の行動</b><small>行動カードを押すと1ターン進行</small></div>
        <div class="coach-line"><b>今週のひとこと</b><span>${successAdvice()}</span></div>
        ${renderCommandCards()}
        ${state.lastApplicant ? renderApplicant() : ""}
      </div>
      <div class="card">
        <div class="section-title"><h2>作詞・作曲</h2><span class="badge ${state.songcraftUsedThisTurn ? "bad" : "good"}">${state.songcraftUsedThisTurn ? "今ターン実行済み" : "今ターン未実行"}</span></div>
        <p><small>プルダウンではなく、曲エディタを開いて、メインジャンル2択から曲を作ります。</small></p>
        <button class="openSongEditorBtn big-action">曲エディタを開く</button>
        <hr class="soft" />
        <h2>イベント進行</h2>
        <div class="event-box"><b>NEXT EVENT</b><span>${state.turn < state.nextLiveTurn ? `${state.nextLiveTurn}ターン目：${currentLiveName()}` : "UNDER FES選考ライブ"}</span></div>
        <p>${state.turn < state.nextLiveTurn ? `あと${turnsUntilNextLive()}ターンでライブ。本番までに仲間・曲・資金・疲労を整える。` : "UNDER FES選考ライブに向けて、B評価以上＋条件達成を狙う。"}</p>
      </div>
    </div>
  `;
}

function renderBandScreen() {
  const active = activeMembers();
  const reserves = reserveMembers();
  return `
    <div class="grid band-grid">
      <div class="card">
        <div class="section-title"><h2>バンド編成</h2><span class="badge good">ライブ反映</span></div>
        <p><small>ここに入っているメンバーだけが画面・ライブ評価・成長に反映されます。</small></p>
        <div class="band-stage">${active.map(renderMemberStageSlot).join("")}</div>
        ${renderBandMenu()}
      </div>
      <div class="card">
        <div class="section-title"><h2>控え</h2><span class="badge warn">長期放置で離脱</span></div>
        <p><small>控えは数ターン後に報告が入り、そのままだと自然脱退します。前へ/後へで構成へ戻せます。</small></p>
        ${reserves.length ? reserves.map((m, i) => renderReserveCard(m, i + active.length - 1)).join("") : `<div class="empty-panel">控えメンバーはいません。</div>`}
        <hr class="soft" />
        <div class="section-title"><h2>加入候補</h2><span class="badge">募集で出現</span></div>
        ${state.lastApplicant ? renderApplicant() : `<p><small>募集コマンドで候補が出たら、ここにも加入選択が表示されます。</small></p>`}
        <div class="candidate-cloud">${state.candidates.slice(0, 18).map(c => `<span class="badge">${c.name} / ${c.part}</span>`).join(" ")}</div>
      </div>
    </div>
  `;
}

function renderMemberStageSlot(m, slotIndex=0) {
  const role = m.id === "player" ? "主人公" : (m.joinStatus || "本加入");
  const active = state.selectedMemberId === m.id ? "selected" : "";
  const memberIndex = slotIndex - 1;
  const actions = m.id === "player" ? `<small>主人公 / 詳細はカード内表示</small>` : `<div class="stage-actions"><button class="moveMemberBtn" data-index="${memberIndex}" data-dir="up">前へ</button><button class="moveMemberBtn" data-index="${memberIndex}" data-dir="down">後へ</button><button class="dismissMemberBtn danger" data-index="${memberIndex}">脱退</button></div>`;
  return `<div class="stage-slot ${active}"><button class="stage-main selectMemberBtn" data-member-id="${m.id}"><div class="avatar">${initials(m.name)}</div><div><b>${m.name}</b><small>${role} / ${m.part}</small><span class="badge warn">${m.mainGenre}</span></div></button>${actions}</div>`;
}

function renderReserveCard(m, memberIndex) {
  return `<div class="reserve-card"><div>${renderCompactMember(m)}<small>控え${m.reserveTurns || 0}T ${m.reserveWarned ? " / 離脱前報告あり" : ""}</small></div><div class="draft-actions"><button class="moveMemberBtn" data-index="${memberIndex}" data-dir="up">構成へ近づける</button><button class="dismissMemberBtn danger" data-index="${memberIndex}">脱退</button></div></div>`;
}

function renderManageMemberCard(m, idx) {
  const isActive = activeMembers().some(x => x.id === m.id);
  return `<div class="manage-card ${isActive ? "active" : "reserve"}">
    ${renderMemberCard(m)}
    <div class="member-actions"><span class="badge ${isActive ? "good" : "warn"}">${isActive ? "構成内" : "控え：未反映"}</span><span class="badge">${m.joinStatus || "本加入"}</span><button class="moveMemberBtn" data-index="${idx}" data-dir="up">前へ</button><button class="moveMemberBtn" data-index="${idx}" data-dir="down">後へ</button><button class="dismissMemberBtn danger" data-index="${idx}">脱退</button></div>
  </div>`;
}

function renderSongsScreen() {
  return `
    <div class="songs-workbench">
      <div class="card song-editor-shell">
        ${renderSongEditor()}
      </div>
      <div class="grid songs-grid">
        <div class="card">
          <div class="section-title"><h2>完成曲</h2><span class="badge good">${state.songs.length}曲</span></div>
          ${state.songs.map(renderSongCard).join("")}
        </div>
        <div class="card">
          <div class="section-title"><h2>制作中の曲</h2><span class="badge warn">詞/曲を揃える</span></div>
          ${renderDraftList()}
          <hr class="soft" />
          <h2>コピー曲候補</h2>
          <div class="cover-list">${DATA.coverSongs.map(renderSongCard).join("")}</div>
        </div>
      </div>
    </div>
  `;
}

function renderScheduleScreen() {
  return `
    <div class="grid schedule-screen">
      <div class="card full-card">${renderSchedulePanel()}</div>
      <div class="card full-card">
        <div class="section-title"><h2>UNDER FES情報</h2><span class="badge ${state.fesInfoKnown ? "good" : "warn"}">${state.fesInfoKnown ? "入手済み" : "未判明"}</span></div>
        ${renderFesInfoPanel()}
      </div>
    </div>
  `;
}

function renderFesInfoPanel() {
  if (!state.fesInfoKnown) {
    return `<div class="empty-panel">フェス条件はまだ不明。ライブ後のイベントや業界評価が上がったタイミングで情報が入る。</div>`;
  }
  const originalCount = state.songs.filter(s=>!s.isCover).length;
  return `<div class="goal-board compact-goals">
    <p><small>ライブハウス店長から、UNDER FES選考の最低ラインを聞いた。</small></p>
    <div class="goal-grid">
      ${goalChip("B評価以上", state.liveResultHistory.some(r => r.rank === "B" || r.rank === "A" || r.rank === "S"))}
      ${goalChip("ファン60", state.band.fans >= 60, state.band.fans)}
      ${goalChip("知名度60", state.band.fame >= 60, state.band.fame)}
      ${goalChip("業界評価55", state.band.industry >= 55, state.band.industry)}
      ${goalChip("オリジナル5曲", originalCount >= 5, `${originalCount}曲`)}
    </div>
  </div>`;
}


function openSongEditor(step="menu") {
  state.view = "songs";
  state.songEditor = { step };
  render();
}
function resetSongEditor() { state.songEditor = { step: "menu" }; }
function editorData() { if (!state.songEditor) state.songEditor = { step:"menu" }; return state.songEditor; }
function choiceButton(label, action, extra="", small="") {
  return `<button class="songEditorChoiceBtn choice-card" data-action="${action}" ${extra}>${label}${small ? `<small>${small}</small>` : ""}</button>`;
}

function keywordPlainSummary(text, theme="") {
  const a = analyzeKeywordText(text, theme);
  const tags = a.tags.length ? a.tags.slice(0,4).join("・") : "個性";
  const hit = a.hits.length ? `検出:${a.hits.map(h=>h.word).join("/")}` : "未登録";
  return `${hit} / ${tags}${a.matchedTheme ? " / テーマ相性○" : ""}`;
}
function keywordPreview(text, theme="") {
  const a = analyzeKeywordText(text, theme);
  return `<div class="editor-summary mini"><b>キーワード判定</b><span>${escapeHtml(keywordPlainSummary(text, theme))}</span>${a.unknown ? `<span>未登録ワードは「個性」「コア向け」に寄ります。</span>` : ""}</div>`;
}
function arrangeChoiceButton(name) {
  return choiceButton(`<b>${name}</b>`, `new:arrange:${name}`);
}
function renderSongEditor() {
  const ed = editorData();
  const used = state.songcraftUsedThisTurn;
  if (used) {
    return `<div class="garage-closed"><div class="section-title"><h2>曲エディタ</h2><span class="badge bad">本日閉鎖</span></div><div class="garage-door">GARAGE CLOSED</div><p><small>このターンの作詞・作曲は終了。次ターンにまたガレージを開けられます。</small></p>${state.lastSongcraftResult ? `<div class="editor-summary mini"><b>直近の制作</b><span>${escapeHtml(state.lastSongcraftResult.title || "曲作り")}</span><span>${escapeHtml(state.lastSongcraftResult.body || "")}</span></div>` : ""}</div>`;
  }
  if (ed.step === "closed") {
    return `<div class="section-title"><h2>曲エディタ</h2><span class="badge good">今ターン未実行</span></div><p><small>新曲作成・曲強化・未完成曲の続きはここから進めます。</small></p><button class="songEditorChoiceBtn big-action" data-action="editor:menu">曲エディタを開く</button>`;
  }
  const title = songEditorTitle(ed);
  return `<div class="song-editor">
    <div class="section-title"><h2>${title}</h2><span class="badge ${used ? "bad" : "good"}">${used ? "今ターン実行済み" : "今ターン未実行"}</span></div>
    ${renderSongEditorStep(ed)}
  </div>`;
}
function songEditorTitle(ed) {
  const map = { menu:"曲エディタ", newType:"新曲：作詞/作曲", newMain1:"新曲：メインジャンル1", newMain2:"新曲：メインジャンル2", newTheme:"新曲：テーマ", newKeyword:"新曲：キーワード", newArrange:"新曲：アレンジ", newMember:"新曲：担当メンバー", newTitle:"新曲：曲名", boostSong:"強化：曲選択", boostType:"強化：カテゴリ", boostMember:"強化：担当メンバー", draftSelect:"未完成曲", draftType:"未完成曲：作詞/作曲", draftMember:"未完成曲：担当メンバー" };
  return map[ed.step] || "曲エディタ";
}
function editorBackButton() { return `<button class="songEditorChoiceBtn ghost-btn editor-back-btn" data-action="editor:back">← 戻る</button>`; }
function renderSongEditorStep(ed) {
  if (state.songcraftUsedThisTurn && !["menu","closed"].includes(ed.step)) return `<div class="empty-panel">今ターンの作詞作曲は実行済み。次ターンにまた進められます。</div>${editorBackButton()}`;
  if (ed.step === "menu") {
    const hasDrafts = state.pendingDrafts.length > 0;
    return `<div class="choice-grid main-choice-grid">
      ${choiceButton("<span>🆕</span><b>新曲を作る</b>", "new:start", "", "ジャンル・テーマを決めて、最後に曲名を決める")}
      ${choiceButton("<span>🔧</span><b>曲を強化する</b>", "boost:start", "", "完成曲の歌詞・演奏を伸ばす")}
      ${choiceButton("<span>📝</span><b>未完成曲を進める</b>", "draft:start", hasDrafts ? "" : "disabled", hasDrafts ? "作っていない詞/曲を完成させる" : "制作中の曲がありません")}
    </div>`;
  }
  if (ed.step === "newTitle") {
    return `<div class="editor-form song-title-final"><label>最後に曲名を決める</label><div class="title-input-row"><input id="editorSongTitle" value="${escapeHtml(ed.title || "")}" placeholder="例：Basement Anthem" /><button class="songEditorChoiceBtn dice-title-btn" data-action="new:titleRandom" title="ランダム生成">🎲</button></div><div class="editor-summary mini"><b>制作内容</b><span>${ed.type === "lyrics" ? "作詞" : "作曲"} / ${ed.mainGenreA || "-"}→${ed.mainGenreB || "-"} / ${ed.theme || "-"} / ${ed.arrange || "-"}</span></div><button class="songEditorNextBtn big-action" data-action="new:titleExecute">この曲名で制作する</button>${editorBackButton()}</div>`;
  }
  if (ed.step === "newType") return `<div class="choice-grid">${choiceButton("<b>作詞から作る</b>", "new:type:lyrics")}${choiceButton("<b>作曲から作る</b>", "new:type:music")}</div>${editorBackButton()}`;
  if (ed.step === "newMain1") return `<div class="choice-grid genre-choice">${availableMainGenres().map(g=>choiceButton(`<b>${g}</b>`, `new:main1:${g}`)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "newMain2") return `<div class="editor-summary mini"><b>1つ目</b><span>${ed.mainGenreA || "-"}</span></div><div class="choice-grid genre-choice">${availableMainGenres().map(g=>choiceButton(`<b>${g}</b>`, `new:main2:${g}`)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "newTheme") return `<div class="choice-grid compact-choice-grid">${availableThemes().map(x=>choiceButton(`<b>${x}</b>`, `new:theme:${x}`)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "newKeyword") {
    const preview = ed.keyword ? keywordPreview(ed.keyword, ed.theme) : "単語を入力するか、候補を押してください。未登録ワードも個性として扱われます。";
    return `<div class="editor-form keyword-form"><label>キーワード自由入力</label><input id="editorKeywordInput" value="${escapeHtml(ed.keyword || "")}" placeholder="例：午前二時のコンビニ前" /><button class="songEditorNextBtn big-action" data-action="new:keywordInputNext">このキーワードで進む</button><div class="keyword-preview">${preview}</div><p><small>候補</small></p><div class="choice-grid compact-choice-grid">${KEYWORD_SUGGESTIONS.map(x=>choiceButton(`<b>${x}</b>`, `new:keyword:${x}`)).join("")}</div>${editorBackButton()}</div>`;
  }
  if (ed.step === "newArrange") return `<div class="choice-grid compact-choice-grid arrange-choice">${ARRANGES.map(x=>arrangeChoiceButton(x)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "newMember") return `<div class="choice-grid member-choice">${activeMembers().map(m=>choiceButton(`<b>${m.name}</b>`, `new:member:${m.id}`, "", `${m.part} / 得意:${m.mainGenre}`)).join("")}</div>${editorSummary(ed)}${editorBackButton()}`;
  if (ed.step === "boostSong") return `<div class="choice-grid song-choice">${state.songs.map(song=>choiceButton(`<b>${escapeHtml(song.title)}</b>`, `boost:song:${song.id}`, "", genreDisplay(song))).join("")}</div>${editorBackButton()}`;
  if (ed.step === "boostType") return `<div class="choice-grid">${choiceButton("<b>歌詞を強化</b>", "boost:type:lyrics", "", "歌詞・キャッチー・認知度")}${choiceButton("<b>作曲を強化</b>", "boost:type:music", "", "演奏・テンポ・流行")}</div>${editorBackButton()}`;
  if (ed.step === "boostMember") return `<p><small>担当メンバーを選ぶと強化を実行します。</small></p><div class="choice-grid member-choice">${activeMembers().map(m=>choiceButton(`<b>${m.name}</b>`, `boost:member:${m.id}`, "", `${m.part} / 得意:${m.mainGenre}`)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "draftSelect") return `<div class="choice-grid song-choice">${state.pendingDrafts.map(d=>choiceButton(`<b>${escapeHtml(d.titleHint)}</b>`, `draft:select:${d.id}`, "", `${d.lyricsDone ? "詞済" : "詞未"} / ${d.musicDone ? "曲済" : "曲未"} / ${genreDisplay(d)}${d.sourceMainGenres ? " / 狙い:" + d.sourceMainGenres.join("→") : ""}`)).join("") || `<div class="empty-panel">制作中の曲はありません。</div>`}</div>${editorBackButton()}`;
  if (ed.step === "draftType") {
    const d = state.pendingDrafts.find(x=>x.id===ed.draftId);
    if (!d) return `<div class="empty-panel">制作中の曲が見つかりません。</div>${editorBackButton()}`;
    return `<p><small>「${escapeHtml(d.titleHint)}」の未作成カテゴリを選択。</small></p><div class="choice-grid">${choiceButton("<b>作詞する</b>", "draft:type:lyrics", d.lyricsDone ? "disabled" : "", d.lyricsDone ? "作詞済み" : "未作成")}${choiceButton("<b>作曲する</b>", "draft:type:music", d.musicDone ? "disabled" : "", d.musicDone ? "作曲済み" : "未作成")}</div>${editorBackButton()}`;
  }
  if (ed.step === "draftMember") return `<p><small>担当メンバーを選ぶと未完成曲を進めます。</small></p><div class="choice-grid member-choice">${activeMembers().map(m=>choiceButton(`<b>${m.name}</b>`, `draft:member:${m.id}`, "", `${m.part} / 得意:${m.mainGenre}`)).join("")}</div>${editorBackButton()}`;
  return editorBackButton();
}
function editorSummary(ed) {
  return `<div class="editor-summary"><b>制作内容</b><span>曲名：${escapeHtml(ed.title || "最後に決定")}</span><span>カテゴリ：${ed.type === "lyrics" ? "作詞" : "作曲"}</span><span>ジャンル狙い：${ed.mainGenreA || "-"} → ${ed.mainGenreB || "-"}</span><span>確率：${ed.mainGenreA && ed.mainGenreB ? genrePlanLabel(ed.mainGenreA, ed.mainGenreB, ed.arrange || "") : "-"}</span><span>テーマ：${ed.theme || "-"}</span><span>キーワード：${ed.keyword || "-"}</span><span>判定：${ed.keyword ? keywordPlainSummary(ed.keyword, ed.theme) : "-"}</span><span>アレンジ：${ed.arrange || "-"}</span></div>`;
}
function stepSongEditorBack(ed) {
  const backMap = {
    newType: "menu",
    newMain1: "newType",
    newMain2: "newMain1",
    newTheme: "newMain2",
    newKeyword: "newTheme",
    newArrange: "newKeyword",
    newMember: "newArrange",
    newTitle: "newMember",
    boostSong: "menu",
    boostType: "boostSong",
    boostMember: "boostType",
    draftSelect: "menu",
    draftType: "draftSelect",
    draftMember: "draftType"
  };
  ed.step = backMap[ed.step] || "menu";
}

function handleSongEditorAction(action) {
  const ed = editorData();
  if (action === "editor:back") { stepSongEditorBack(ed); render(); return; }
  if (action === "editor:menu") { state.songEditor = { step:"menu" }; render(); return; }
  if (action === "new:start") { state.songEditor = { step:"newType", title:"" }; render(); return; }
  if (action === "boost:start") { state.songEditor = { step:"boostSong" }; render(); return; }
  if (action === "draft:start") { state.songEditor = { step:"draftSelect" }; render(); return; }
  if (action === "new:titleRandom") { ed.title = randomSongTitleCandidate(ed); render(); return; }
  if (action === "new:titleExecute") {
    const title = (document.getElementById("editorSongTitle")?.value || "").trim();
    ed.title = title || randomSongTitleCandidate(ed);
    const member = activeMembers().find(x=>x.id===ed.memberId) || state.player;
    createDraftAndAdvance(ed.type || "lyrics", member, ed.mainGenreA, ed.mainGenreB, ed.theme, ed.keyword, ed.arrange, ed.title);
    completeSongcraftTutorial();
    state.songEditor = { step:"garageClosed" };
    render(); return;
  }
  let m;
  if ((m = action.match(/^new:type:(lyrics|music)$/))) { ed.type = m[1]; ed.step = "newMain1"; render(); return; }
  if ((m = action.match(/^new:main1:(.+)$/))) { ed.mainGenreA = m[1]; ed.step = "newMain2"; render(); return; }
  if ((m = action.match(/^new:main2:(.+)$/))) { ed.mainGenreB = m[1]; ed.step = "newTheme"; render(); return; }
  if ((m = action.match(/^new:theme:(.+)$/))) { ed.theme = m[1]; ed.step = "newKeyword"; render(); return; }
  if (action === "new:keywordInputNext") { ed.keyword = (document.getElementById("editorKeywordInput")?.value || "").trim() || KEYWORD_SUGGESTIONS[rand(0, KEYWORD_SUGGESTIONS.length-1)]; ed.step = "newArrange"; render(); return; }
  if ((m = action.match(/^new:keyword:(.+)$/))) { ed.keyword = m[1]; ed.step = "newArrange"; render(); return; }
  if ((m = action.match(/^new:arrange:(.+)$/))) { ed.arrange = m[1]; ed.step = "newMember"; render(); return; }
  if ((m = action.match(/^new:member:(.+)$/))) { ed.memberId = m[1]; ed.title = ed.title || randomSongTitleCandidate(ed); ed.step = "newTitle"; render(); return; }
  if ((m = action.match(/^boost:song:(.+)$/))) { ed.songId = m[1]; ed.step = "boostType"; render(); return; }
  if ((m = action.match(/^boost:type:(lyrics|music)$/))) { ed.type = m[1]; ed.step = "boostMember"; render(); return; }
  if ((m = action.match(/^boost:member:(.+)$/))) {
    const member = activeMembers().find(x=>x.id===m[1]) || state.player;
    boostSong(ed.type || "lyrics", member, ed.songId);
    completeSongcraftTutorial();
    state.songEditor = { step:"garageClosed" };
    render(); return;
  }
  if ((m = action.match(/^draft:select:(.+)$/))) { ed.draftId = m[1]; ed.step = "draftType"; render(); return; }
  if ((m = action.match(/^draft:type:(lyrics|music)$/))) { ed.type = m[1]; ed.step = "draftMember"; render(); return; }
  if ((m = action.match(/^draft:member:(.+)$/))) {
    const member = activeMembers().find(x=>x.id===m[1]) || state.player;
    advanceDraftById(ed.draftId, ed.type || "lyrics", member);
    completeSongcraftTutorial();
    state.songEditor = { step:"garageClosed" };
    render(); return;
  }
}

function renderShopScreen() {
  const itemBadges = [
    ["drink", "疲労回復ドリンク"], ["effecter", "エフェクター"], ["usedGear", "中古楽器"], ["lightFx", "照明エフェクト"]
  ].map(([k,n]) => `<span class="badge">${n} ${state.items[k] || 0}</span>`).join(" ");
  return `
    <div class="grid shop-screen">
      <div class="card">
        <div class="section-title"><h2>ショップ</h2><span class="badge warn">資金の使い道</span></div>
        <p><small>今は仮ショップ。将来は楽器・エフェクター・機材・回復アイテム・ライブ演出に拡張予定。</small></p>
        <div class="shop-grid shop-large">
          <button class="buyItemBtn" data-item="drink">疲労回復ドリンク<br><small>5,000円 / 使用で疲労-25</small></button>
          <button class="buyItemBtn" data-item="effecter">エフェクター<br><small>12,000円 / ライブ表現+少</small></button>
          <button class="buyItemBtn" data-item="usedGear">中古楽器<br><small>15,000円 / 演奏+少</small></button>
          <button class="buyItemBtn" data-item="lightFx">照明エフェクト<br><small>10,000円 / 熱量+少</small></button>
        </div>
      </div>
      <div class="card">
        <h2>もちもの</h2>
        <p>${itemBadges}</p>
        <button class="useItemBtn big-action" data-item="drink">ドリンクを使う</button>
        <hr class="soft" />
        <h2>資金メモ</h2>
        <div class="kv"><b>現在資金</b><span>${state.band.funds.toLocaleString()}円</span><b>出費</b><span>練習・募集・宣伝・維持費・ライブ参加費・サポート代</span><b>収入</b><span>バイト・チケット売上・物販</span></div>
      </div>
    </div>
  `;
}

function renderLogScreen() {
  return `<div class="card full-card"><div class="section-title"><h2>ログ履歴</h2><span class="badge warn">テロップ＋詳細</span></div><div class="log big-log">${state.logs.slice(0, 140).map(l => `<div class="log-line">${escapeHtml(l)}</div>`).join("")}</div></div>`;
}

function renderTimeline() {
  refreshLiveSchedule();
  const cells = [];
  for (let i = 1; i <= state.maxTurn; i++) {
    const ev = liveEventForTurn(i);
    const live = !!ev;
    const cls = i === state.turn ? "now" : i < state.turn ? "done" : live ? (ev.fixed ? "live fixed" : "live booked") : "";
    const label = ev ? (i === 30 ? "FES" : ev.fixed ? "FIX" : "LIVE") : "育成";
    const venue = ev ? venueById(ev.venueId).name : "";
    cells.push(`<div class="turn-cell ${cls}" title="${escapeHtml(venue)}"><b>${i}</b><span>${label}</span></div>`);
  }
  const next = state.nextLiveTurn ? `${currentLiveName()} あと${turnsUntilNextLive()}T` : "予定なし";
  return `<div class="timeline-wrap schedule-board"><div class="schedule-title compact-title"><b>${state.turn}/${state.maxTurn}ターン</b><span>NEXT：${escapeHtml(next)}</span></div><div class="timeline long schedule-scroll one-line">${cells.join("")}</div></div>`;
}

function renderTelop() {
  const latest = state.logs[0] || "地下から始まる。";
  return `<div class="telop"><span>${escapeHtml(latest).replace(/\n/g, "　/　")}</span></div>`;
}

function renderTopStats() {
  const b = state.band;
  const stats = [
    { k:"資金", label:`¥${shortMoney(b.funds)}`, meter:null },
    { k:"ファン", label:`${Math.round(b.fans)}人`, meter:null },
    { k:"知名度", label:Math.round(b.fame), meter:b.fame },
    { k:"業界評価", label:Math.round(b.industry), meter:b.industry },
    { k:"疲労", label:`${Math.round(b.fatigue)}%`, meter:b.fatigue },
    { k:"編成", label:`${activeMembers().length}/${state.memberCap}人`, meter:null }
  ];
  return `<div class="success-dashboard compact-dashboard"><div class="compact-stat-strip slim-stats">${stats.map(x=>`<div class="stat success-stat compact-stat"><span>${x.k}</span><b>${x.label}</b>${x.meter !== null ? renderTinyMeter(x.k, x.meter) : ""}</div>`).join("")}</div></div>`;
}
function shortMoney(n) {
  const num = Number(n) || 0;
  if (Math.abs(num) >= 10000) return `${(num/10000).toFixed(num % 10000 ? 1 : 0)}万`;
  return num.toLocaleString();
}
function renderTinyMeter(k, v) {
  if (!["知名度","コア人気","業界評価","信頼度","疲労"].includes(k)) return "";
  const max = k === "疲労" || k === "信頼度" ? 100 : 80;
  const pct = clamp(Number(v) / max * 100, 0, 100);
  return `<div class="meter mini"><div class="fill ${k === "疲労" ? "red" : ""}" style="width:${pct}%"></div></div>`;
}

function renderNormalTurn() {
  return `
    <div class="grid main-grid">
      <div class="card success-panel command-window">
        <div class="success-window-title"><span>COMMAND</span><b>今週の行動</b><small>行動カードを押すと1ターン進行</small></div>
        <div class="coach-line"><b>今週のひとこと</b><span>${successAdvice()}</span></div>
        ${renderCommandCards()}
        ${state.lastApplicant ? renderApplicant() : ""}
      </div>
      <div class="card">
        ${renderSongcraftControls()}
        <hr class="soft" />
        ${renderBandMenu()}
        <hr class="soft" />
        <h2>イベント進行</h2>
        <div class="event-box"><b>NEXT EVENT</b><span>${state.turn < state.nextLiveTurn ? `${state.nextLiveTurn}ターン目：${currentLiveName()}` : "UNDER FES選考ライブ"}</span></div>
        <p>${state.turn < state.nextLiveTurn ? `あと${turnsUntilNextLive()}ターンでライブ。本番までに仲間・曲・資金・疲労を整える。` : "UNDER FES選考ライブに向けて、B評価以上＋条件達成を狙う。"}</p>
        <div class="kv">
          <b>最低クリア条件</b><span>B評価以上 / ファン60 / 知名度60 / 業界評価55 / オリジナル曲5曲</span>
          <b>現在</b><span>ファン${state.band.fans} / 知名度${state.band.fame} / 業界評価${state.band.industry} / オリジナル${state.songs.filter(s=>!s.isCover).length}曲</span>
        </div>
      </div>
    </div>
  `;
}

function successAdvice() {
  if (isLiveTurn()) return "今日はライブ本番。ポジションとセトリで勝ち筋を作れ。";
  if (turnsUntilNextLive() <= 1) return "ライブ直前。疲労が高いなら休憩、曲が弱いなら最後の調整。";
  if (state.songs.filter(s=>!s.isCover).length < 5) return "オリジナル5曲が目標。曲作りを進めてコピー曲依存を減らそう。";
  if (state.band.fame < 45) return "知名度が不足気味。宣伝でフェス条件に近づける。";
  if (state.band.fatigue > 60) return "疲労が危険域。休憩しないと本番で失速する。";
  return "育成は順調。次ライブに向けて弱点を一つ潰そう。";
}

function renderCommandCards() {
  const commands = [
    ["practice", "練習", "技術・楽器Lv・演奏UP", "費用・疲労+", "🎸"],
    ["rest", "休憩", "疲労DOWN・信頼UP", "成長なし", "☕"],
    ["parttime", "バイト", "資金+15,000円", "疲労+", "💸"],
    ["recruit", "募集", "仲間候補を探す", "費用・成果ランダム", "📣"],
    ["promo", "宣伝", "知名度・認知度UP", "資金-", "📱"],
    ["talk", "会話", "信頼UP・適性開花候補", "直接成長少", "💬"]
  ];
  return `<div class="command-grid">${commands.map(([id,name,main,sub,icon]) => `
    <button class="command-card success-command" data-command="${id}">
      <span class="command-icon">${icon}</span>
      <b>${name}</b>
      <small>${main}<br>${sub}</small>
    </button>`).join("")}</div>`;
}

function renderSongcraftControls() {
  const memberOptions = activeMembers().map(m => `<option value="${m.id}">${m.name}</option>`).join("");
  const songOptions = state.songs.map(s => `<option value="${s.id}">${s.title}</option>`).join("");
  const draftOptions = state.pendingDrafts.length
    ? state.pendingDrafts.map(d => `<option value="${d.id}">${d.titleHint}（詞:${d.lyricsDone ? "済" : "未"} / 曲:${d.musicDone ? "済" : "未"}）</option>`).join("")
    : `<option value="none">制作中の曲なし</option>`;
  return `
    <div class="songcraft-box">
      <div class="section-title"><h2>作詞作曲</h2><span class="badge ${state.songcraftUsedThisTurn ? "bad" : "good"}">${state.songcraftUsedThisTurn ? "今ターン実行済み" : "今ターン未実行"}</span></div>
      <p><small>作詞作曲は通常行動とは別ボタン。制作中の曲一覧から、まだ作っていない詞/曲を選んで進められます。</small></p>
      <div class="cols">
        <div><label>対象</label><select id="craftMode"><option value="new">新しい曲の種を作る</option><option value="draft">制作中の曲を進める</option><option value="boost">完成済みの曲を強化</option></select></div>
        <div><label>作業</label><select id="craftType"><option value="lyrics">作詞</option><option value="music">作曲</option></select></div>
        <div class="wide"><label>曲名 / 仮タイトル</label><input id="craftTitle" placeholder="例：No Reason Runaway" value="" /></div>
        <div><label>制作中の曲</label><select id="craftDraft">${draftOptions}</select></div>
        <div><label>強化する曲</label><select id="craftSong">${songOptions}</select></div>
        <div><label>中心メンバー</label><select id="craftMember">${memberOptions}</select></div>
        <div><label>メインジャンル</label><select id="craftMainGenre">${MAIN_GENRES.map(g=>`<option value="${g}">${g}</option>`).join("")}</select></div>
        <div><label>派生サブジャンル</label><select id="craftSubGenre"><option value="">メインジャンルのみ</option>${availableSubGenres().map(g=>`<option value="${g.name}">${g.name}（${g.parent}）</option>`).join("")}</select></div>
        <div><label>テーマ</label><select id="craftTheme">${THEMES.map(g=>`<option value="${g}">${g}</option>`).join("")}</select></div>
        <div><label>キーワード</label><select id="craftKeyword">${KEYWORDS.map(g=>`<option value="${g}">${g}</option>`).join("")}</select></div>
        <div><label>アレンジ</label><select id="craftArrange">${ARRANGES.map(g=>`<option value="${g}">${g}</option>`).join("")}</select></div>
      </div>
      <button id="executeCraftBtn" class="songcraft-action" ${state.songcraftUsedThisTurn ? "disabled" : ""}>曲作りを実行</button>
      ${renderDraftList()}
    </div>
  `;
}

function renderDraftList() {
  if (!state.pendingDrafts.length) {
    return `<div class="draft-list empty"><small>制作中の曲はまだありません。曲エディタから新曲を作り始めましょう。</small></div>`;
  }
  return `<div class="draft-list"><h3>制作中の曲一覧</h3>${state.pendingDrafts.map(d => `
    <div class="draft-card">
      <div>
        <b>${escapeHtml(d.titleHint)}</b>
        <p><span class="badge warn">${escapeHtml(d.mainGenre || subParent(d.genre))}${d.subGenre ? " / " + escapeHtml(d.subGenre) : ""}</span><span class="badge">${escapeHtml(d.theme)}</span><span class="badge">${escapeHtml(d.keyword)}</span><span class="badge">${escapeHtml(d.arrange)}</span></p>
        <small>作詞:${d.lyricsDone ? `完了 ${val(d.lyricsScore)}%` : "未作成"} / 作曲:${d.musicDone ? `完了 ${val(d.musicScore)}%` : "未作成"}</small>
      </div>
      <div class="draft-actions">
        <button class="openSongEditorBtn" ${state.songcraftUsedThisTurn ? "disabled" : ""}>曲エディタで進める</button>
      </div>
    </div>`).join("")}</div>`;
}

function renderApplicant() {
  const a = state.lastApplicant;
  return `
    <div class="member applicant-card">
      <h4>募集結果：${a.name}</h4>
      <div class="member-head"><div class="avatar">${initials(a.name)}</div><div class="kv">
        <b>担当</b><span>${a.part}</span>
        <b>一番得意ジャンル</b><span>${a.mainGenre}</span>
        <b>二番目得意</b><span>${(a.secondMainGenres||[]).join(" / ") || "なし"}</span>
        <b>加入難度</b><span>${a.joinDifficulty}</span>
        <b>差し替えメモ</b><span>${a.replaceNote}</span>
      </div></div>
      <div class="row" style="margin-top:10px;"><button id="joinApplicantBtn">加入させる</button><button id="skipApplicantBtn">今回は見送る</button></div>
    </div>
  `;
}

function renderMembers() {
  const activeIds = new Set(activeMembers().map(m => m.id));
  const memberRows = state.members.map((m, idx) => {
    const isActive = activeIds.has(m.id);
    const reserveInfo = !isActive ? ` / 控え${m.reserveTurns || 0}T${m.reserveWarned ? "・離脱警告" : ""}` : "";
    return `${renderMemberCard(m)}<div class="member-actions"><span class="badge ${isActive ? "good" : "warn"}">${isActive ? "構成内" : "控え：未反映"}</span><span class="badge">${m.joinStatus || "本加入"}${reserveInfo}</span><button class="moveMemberBtn" data-index="${idx}" data-dir="up">前へ</button><button class="moveMemberBtn" data-index="${idx}" data-dir="down">後へ</button><button class="dismissMemberBtn danger" data-index="${idx}">脱退</button></div>`;
  }).join("");
  return `
    <h2>メンバー</h2>
    <p><small>ライブに反映されるのは「バンド構成」に入っているメンバーのみ。控えは数ターン後に離脱の事前報告が出て、そのままだと自然脱退することがあります。</small></p>
    <h3>現在反映中</h3>
    ${activeMembers().map(renderMemberCard).join("")}
    <h3>メンバー管理</h3>
    ${state.members.length ? memberRows : "<small>まだ仲間はいません。</small>"}
    <h3>未加入候補</h3>
    ${state.candidates.length ? state.candidates.map(c => `<span class="badge">${c.name} / ${c.part}</span>`).join(" ") : "<small>全員確認済み。</small>"}
  `;
}

function renderMemberCard(m) {
  const insts = Object.entries(m.instruments || {}).map(([k,v]) => {
    const totalCap = Math.max(v.potentialCap || v.cap, 1);
    const pct = clamp((v.lv / totalCap) * 100, 0, 100);
    const basePct = clamp((Math.min(v.lv, v.cap) / Math.max(v.cap, 1)) * 100, 0, 100);
    return `<div class="instrument-row"><b>${instLabel(k)} ${v.mark}</b><span>Lv.${val(v.lv)} / ${v.cap}${v.potentialCap && v.potentialCap > v.cap ? ` <em>伸びしろ${v.potentialCap}</em>` : ""}</span><div class="meter"><div class="fill" style="width:${basePct}%"></div></div>${v.potentialCap && v.potentialCap > v.cap ? `<div class="meter"><div class="fill blue" style="width:${pct}%"></div></div>` : ""}</div>`;
  }).join("");
  const stats = Object.entries(m.stats).map(([k,v]) => `<span class="badge">${statLabel(k)} ${v}</span>`).join(" ");
  const discovered = discoveredSubGenresFor(m);
  const hiddenCount = hiddenSubGenreCount(m);
  const genreLine = `
    <p><span class="badge warn">一番得意:${m.mainGenre}</span> ${(m.secondMainGenres||[]).map(g=>`<span class="badge good">二番目:${g}</span>`).join(" ")}</p>
    <p>${discovered.map(g=>`<span class="badge">判明サブ:${g}</span>`).join(" ")} ${hiddenCount ? `<span class="badge bad">未判明サブ ${hiddenCount}</span>` : `<span class="badge good">サブ全判明</span>`}</p>`;
  return `<div class="member"><div class="member-head"><div class="avatar">${initials(m.name)}</div><div><h4>${m.name} <span class="badge good">${m.part}</span></h4><p>${stats}</p>${genreLine}</div></div>${insts}<small>${m.replaceNote || ""}</small></div>`;
}

function renderSongs() {
  return `
    <h2>曲</h2>
    ${state.songs.map(renderSongCard).join("")}
    <h3>コピー曲候補</h3>
    ${DATA.coverSongs.map(s => `<span class="badge">${s.title}</span>`).join(" ")}
  `;
}

function renderSongCard(s) {
  return `<div class="song"><h4>${s.title} ${s.isCover ? `<span class="badge bad">コピー</span>` : `<span class="badge good">オリジナル</span>`}</h4>
    <p><span class="badge warn">${genreDisplay(s)}</span> ${(s.tags||[]).map(t=>`<span class="badge">${t}</span>`).join(" ")}</p>
    ${renderSongBars(s)}
  </div>`;
}
function renderSongBars(s) {
  const items = [["キャッチー",s.catchy],["テンポ",s.tempo],["認知度",s.recognition],["歌詞",s.lyrics],["演奏",s.performance],["流行",s.trend]];
  return `<div class="song-bars">${items.map(([k,v])=>`<div><span>${k} ${val(v)}</span><div class="meter mini"><div class="fill" style="width:${clamp(v,0,99)}%"></div></div></div>`).join("")}</div>`;
}


function renderBandMenu() {
  const reserves = reserveMembers().length;
  return `<div class="band-menu compact-band-menu"><div class="section-title"><h2>バンドの構成</h2><span class="badge warn">反映人数を決める</span></div>
    <div class="cols">
      <div><label>バンドの構成</label><select id="memberCapSelect">${[3,4,5,6].map(n=>`<option value="${n}" ${state.memberCap===n?"selected":""}>${n}人</option>`).join("")}</select></div>
      <div><label>現在の控え</label><div class="input-like">${reserves}人</div></div>
    </div>
    <button id="applyMemberCapBtn">構成を反映</button>
    <p><small>人数が多いほどライブやイベントは強くなりますが、維持費・疲労・悪いイベントも増えます。アイテム購入はショップ画面に分離しました。</small></p>
    <button class="jumpTabBtn" data-view="shop">ショップ / もちものへ</button>
  </div>`;
}

function renderDeferred() {
  return `<h2>差し替え用メモ</h2><p><small>省いた候補は、あとで本実装に差し替えやすいように明示しています。</small></p>${Object.entries(DEFERRED_REPLACEMENTS).map(([k,v])=>`<p><span class="badge warn">${k}</span> ${v}</p>`).join("")}`;
}

function renderLivePrep() {
  const allSongs = [...state.songs, ...DATA.coverSongs];
  const songOpts = allSongs.map(s => `<option value="${s.id}">${s.title}${s.isCover ? "（コピー）" : ""}</option>`).join("");
  const supports = DATA.supportOptions.map(s => `<label class="check-card"><input type="checkbox" class="supportCheck" value="${s.id}" /> ${s.name}<br><small>${s.cost.toLocaleString()}円 / ${s.genres.join("・")}</small></label>`).join("");
  const ev = currentLiveEvent();
  const v = venueById(ev.venueId);
  const prep = estimatePrepScore();
  const prepState = prep >= v.prepNeed ? "挑戦圏" : "準備不足";
  return `
    <div class="card live-panel">
      <div class="section-title"><h2>${currentLiveName()}：ライブ準備</h2><span class="badge warn">${v.name} / ${prepState}</span></div>
      <div class="venue-info"><b>${v.name}</b><span>キャパ${v.capacity} / 会場費${v.fee.toLocaleString()}円 / 要準備${v.prepNeed} / 現在準備${val(prep)}</span><small>${v.note}</small></div>
      <p><small>ボーカルはコーラス不可。初ライブだけ主人公Vo固定。その他メンバーの担当楽器をライブごとに決められます。</small></p>
      <div class="grid live-grid">
        <div>
          <h3>バンドポジション</h3>
          ${renderPositionControls()}
          <h3>サポート契約</h3>
          <div class="checkbox-grid">${supports}</div>
        </div>
        <div>
          <h3>5曲セトリ</h3>
          ${[1,2,3,4,5].map(i => `<div class="live-slot"><b>${i}曲目</b><select class="setlistSelect" data-slot="${i}">${songOpts}</select></div>`).join("")}
          <h3 style="margin-top:14px;">物販</h3>
          <select id="merchSelect">
            <option value="none">なし：0円</option>
            <option value="low">低コスト：3,000円 / ステッカー・缶バッジ</option>
            <option value="standard">標準：8,000円 / ステッカー・缶バッジ・デモ音源</option>
            <option value="premium">勝負：15,000円 / タオル・Tシャツ・デモ音源</option>
          </select>
          <p><small>デモ音源は人気が上がるほど単価が大きく上がります。歌詞カード単体はなし。</small></p>
          <button id="performLiveBtn" class="big-action">ライブ本番へ</button>
          ${!currentLiveEvent().fixed ? `<button id="noShowLiveBtn" class="ghost-btn danger wide-cancel">ライブをドタキャンする</button>` : ""}
          ${state.lastApplicant ? renderApplicant() : ""}
        </div>
      </div>
    </div>
  `;
}

function renderPositionControls() {
  const locked = state.liveCount === 0;
  const members = activeMembers();
  const rows = members.map((m, idx) => {
    const defaultInst = locked && m.id === "player" ? "vocal" : (m.mainInstrument || "off");
    const disabled = locked && m.id === "player" ? "disabled" : "";
    return `<div class="position-row" data-member="${m.id}">
      <div class="avatar small">${initials(m.name)}</div>
      <div><b>${m.name}</b><small>${m.part}</small></div>
      <select class="positionSelect" data-member-id="${m.id}" ${disabled}>
        ${positionOptions(defaultInst)}
      </select>
    </div>`;
  }).join("");
  const chorusOptions = [`<option value="none">コーラスなし</option>`, ...members.filter(m => m.instruments.chorus || m.instruments.vocal).map(m => `<option value="${m.id}">${m.name}</option>`)].join("");
  return `<div class="stage-card">
    ${rows}
    <div class="position-row chorus-line"><div class="avatar small">Cho</div><div><b>コーラス枠</b><small>ボーカルと同じ人は不可</small></div><select id="chorusSelect">${chorusOptions}</select></div>
  </div>`;
}
function positionOptions(selected) {
  const opts = ["off","vocal","guitar","bass","drum","key","dj","other"];
  return opts.map(o => `<option value="${o}" ${selected===o ? "selected" : ""}>${instFullLabel(o)}</option>`).join("");
}


async function reloadLatestVersion() {
  try {
    state.saveNotice = "最新版を読み込み中。セーブは残したまま、アプリのキャッシュだけ更新します。";
    const registrations = navigator.serviceWorker ? await navigator.serviceWorker.getRegistrations() : [];
    await Promise.all(registrations.map(reg => reg.unregister()));
    if (window.caches) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    }
    const url = new URL(window.location.href);
    url.searchParams.set("fresh", Date.now().toString());
    window.location.replace(url.toString());
  } catch (err) {
    state.saveNotice = "自動更新に失敗しました。ブラウザの再読み込みかサイトデータ削除を試してください。";
    render();
  }
}


function maybeTriggerCommandEvent(command) {
  if (state.activePopup || Math.random() > 0.34) return;
  const active = activeMembers();
  const member = active[rand(0, active.length - 1)] || state.player;
  const events = {
    practice: [
      ["練習後の一言", `${member.name}が最後にもう一回だけ合わせようと言った。\n信頼度が少し上がり、疲労も少しだけ増えた。`, () => { state.band.trust = clamp(state.band.trust + 1,0,100); state.band.fatigue = clamp(state.band.fatigue + 2,0,100); }, "🥁"],
      ["小さな成長", `${member.name}が自分の音を掴みかけている。\nメンタル+1。`, () => { member.stats.mental = clamp(member.stats.mental + 1,1,99); }, "📈"]
    ],
    rest: [
      ["帰り道", `今日は早めに切り上げた。\nコンビニ前で少しだけ話して、バンドの空気が軽くなった。`, () => { state.band.trust = clamp(state.band.trust + 2,0,100); }, "🌙"]
    ],
    work: [
      ["バイト先のBGM", `バイト中、店内で流れていた曲が妙に耳に残った。\n次の作曲に使えそうな気がする。`, () => { state.band.direction["ポップ"] = (state.band.direction["ポップ"] || 0) + 2; }, "🎧"]
    ],
    recruit: [
      ["貼り紙を見た人", `スタジオの掲示板を見た人から連絡が来た。\n次の募集結果が少し良くなりそう。`, () => { state.band.fame = clamp(state.band.fame + 1,0,999); }, "📨"]
    ],
    promote: [
      ["SNSが少し伸びた", `投稿がいつもより少しだけ回った。\nまだ小さいが、知らない誰かに届いている。`, () => { state.band.fame = clamp(state.band.fame + 2,0,999); }, "📱"]
    ],
    talk: [
      ["本音の会話", `${member.name}が最近の不安を少し話してくれた。\n信頼度+3。`, () => { state.band.trust = clamp(state.band.trust + 3,0,100); }, "☕"]
    ]
  };
  const list = events[command] || events.talk;
  const [title, body, effect, icon] = list[rand(0, list.length - 1)];
  effect();
  showEventPopup(title, body, "event", icon);
}

function renderOverlays() {
  // 進行系の演出を優先し、ポップアップが重なって見えなくなるのを防ぐ。
  if (state.bandNamePrompt) return renderBandNameOverlay();
  if (state.liveProgressModal) return renderLiveProgressOverlay();
  if (state.liveResultModal) return renderLiveResultOverlay();
  if (state.actionResultModal) return renderActionResultOverlay();
  if (state.pendingBooking) return renderBookingConfirmOverlay();
  if (state.pendingNoSongcraftCommand) return renderNoSongcraftConfirmOverlay();
  if (state.activePopup) return renderActivePopupOverlay();
  return state.turnNotice ? renderTurnNoticeOverlay() : "";
}

function renderActivePopupOverlay() {
  const p = state.activePopup;
  return `<div class="modal-backdrop">
    <div class="event-modal ${p.type || "info"}">
      <div class="modal-icon">${p.icon || "🎸"}</div>
      <div class="modal-copy"><h2>${escapeHtml(p.title)}</h2><p>${escapeHtml(p.body).replace(/\n/g,"<br>")}</p>${renderPopupBars(p.bars)}</div>
      <button class="popupCloseBtn big-action">OK</button>
    </div>
  </div>`;
}

function renderNoSongcraftConfirmOverlay() {
  return `<div class="modal-backdrop">
    <div class="event-modal warn">
      <div class="modal-icon">🎼</div>
      <div class="modal-copy"><h2>作詞作曲せずに進める？</h2><p>このターンは曲を作らずに終わります。よければ行動を実行します。</p></div>
      <div class="modal-actions confirm-wide"><button id="confirmNoSongcraftBtn" class="big-action">このまま行動する</button><button id="cancelNoSongcraftBtn" class="ghost-btn">曲作りへ戻る</button></div>
    </div>
  </div>`;
}

function renderPopupBars(bars=[]) {
  if (!Array.isArray(bars) || !bars.length) return "";
  return `<div class="popup-bars">${bars.map(b => resultBar(b.label, val(b.value || 0))).join("")}</div>`;
}

function renderTurnNoticeOverlay() {
  const n = state.turnNotice;
  if (!n) return "";
  const next = n.next ? `NEXT ${n.remain}ターン後 ${n.label}` : "NEXT 予定なし";
  return `<div class="turn-toast"><b>${n.turn}/30ターン</b><span>${escapeHtml(next)}</span></div>`;
}
function renderBookingConfirmOverlay() {
  const b = state.pendingBooking;
  const v = venueById(b.venueId);
  const prep = estimatePrepScore();
  const shortage = Math.max(0, v.prepNeed - prep);
  return `<div class="modal-backdrop">
    <div class="event-modal event booking-modal">
      <div class="modal-icon">📅</div>
      <div class="modal-copy"><h2>${b.turn}ターン目のライブを予約する？</h2><p>${escapeHtml(v.name)} / キャパ${v.capacity} / 会場費${v.fee.toLocaleString()}円</p><p>準備要求：${v.prepNeed} / 現在準備：${val(prep)}${shortage ? ` / 不足${val(shortage)}` : " / 準備OK"}</p><p>予約後、残り2ターン以内は通常キャンセル不可。当日ドタキャンは会場費＋損料が必要。</p></div>
      <div class="modal-actions"><button id="confirmBookingBtn" class="big-action">予約する</button><button id="cancelBookingBtn" class="ghost-btn">戻る</button></div>
    </div>
  </div>`;
}
function renderActionResultOverlay() {
  const r = state.actionResultModal;
  return `<div class="modal-backdrop result-backdrop">
    <div class="action-result-modal">
      <div class="result-header"><span>WEEK RESULT</span><b>${escapeHtml(r.title)}</b><em>${r.icon || "⚡"}</em></div>
      <p>${escapeHtml(r.body || "今週の行動を終えた。").replace(/\n/g,"<br>")}</p>
      <div class="gain-grid">${(r.diffs || []).map(([k,v,u]) => `<div><span>${k}</span><b class="${v>=0 ? "plus" : "minus"}">${v>=0 ? "+" : ""}${u === "円" ? v.toLocaleString() : v}${u}</b></div>`).join("") || `<div><span>変化</span><b>なし</b></div>`}</div>
      ${r.event ? `<div class="inline-event"><b>${escapeHtml(r.event.icon || "✨")} ${escapeHtml(r.event.title)}</b><span>${escapeHtml(r.event.body)}</span></div>` : ""}
      ${r.training ? renderTrainingGains(r.training) : ""}
      ${r.songcraftResult ? `<div class="inline-event songcraft-summary"><b>${escapeHtml(r.songcraftResult.title || "曲作り")}</b><span>${escapeHtml(r.songcraftResult.body || "").replace(/\n/g,"<br>")}</span>${renderPopupBars(r.songcraftResult.bars)}</div>` : ""}
      ${r.tutorialMsg ? `<div class="tutorial-message">${escapeHtml(r.tutorialMsg).replace(/\n/g,"<br>")}</div>` : ""}
      <button class="actionResultCloseBtn big-action">OK</button>
    </div>
  </div>`;
}
function renderTrainingGains(training) {
  if (!training) return "";
  const rows = Array.isArray(training) ? training : String(training).split("\n").filter(Boolean).map(line => ({ line }));
  if (!rows.length) return "";
  return `<div class="training-gain-list"><b>練習で伸びたステータス</b>${rows.map(r => {
    if (r.name) return `<span>${escapeHtml(r.name)}：技術+${r.tech || 0} / リズム+${r.rhythm || 0}</span>`;
    return `<span>${escapeHtml(r.line)}</span>`;
  }).join("")}</div>`;
}

function renderLiveProgressOverlay() {
  const l = state.liveProgressModal;
  const steps = l.steps || [];
  const idx = clamp(l.index || 0, 0, Math.max(0, steps.length - 1));
  const current = steps[idx] || { line:"ライブ開始！", icon:"🔥", event:"会場が温まってきた" };
  const pct = steps.length ? Math.round((idx + 1) / steps.length * 100) : 100;
  return `<div class="modal-backdrop result-backdrop live-only-backdrop">
    <div class="live-progress-modal realtime-live-modal">
      <div class="result-header"><span>LIVE STAGE</span><b>${escapeHtml(l.title)}</b><em>${idx + 1}/${steps.length || 5}</em></div>
      <div class="live-progress-bar"><div class="live-progress-fill realtime" style="width:${pct}%"></div><span>${pct}%</span></div>
      <div class="live-current-telop"><b>${escapeHtml(current.line)}</b></div>
      <div class="live-icons"><div><b>${escapeHtml(current.icon)}</b><span>${escapeHtml(current.event)}</span></div></div>
      <div class="live-telop-list compact">${steps.slice(0, idx + 1).map((x, i) => `<p class="${i === idx ? "active" : ""}">${escapeHtml(x.line)} / ${escapeHtml(x.icon)} ${escapeHtml(x.event)}</p>`).join("")}</div>
    </div>
  </div>`;
}
function renderBandNameOverlay() {
  return `<div class="modal-backdrop">
    <div class="event-modal event band-name-modal">
      <div class="modal-icon">🏷️</div>
      <div class="modal-copy"><h2>バンド名を決めよう</h2><p>ライブハウスに名前を出すには、バンド名が必要だ。</p><input id="bandNameInput" class="wide-input" placeholder="例：名無しの地下バンド" value="${escapeHtml(state.band.name || "")}" /></div>
      <button id="confirmBandNameBtn" class="big-action">この名前で行く</button>
    </div>
  </div>`;
}
function resultBar(label, value) {
  const pct = clamp(value / 2.2, 0, 100);
  return `<div class="result-bar"><span>${label}</span><div class="meter mini"><div class="fill" style="width:${pct}%"></div></div><b>${value}</b></div>`;
}

function bindEvents() {
  document.querySelectorAll(".command-card").forEach(btn => btn.addEventListener("click", () => handleCommandClick(btn.dataset.command)));
  document.querySelectorAll(".tabBtn:not(:disabled), .jumpTabBtn").forEach(btn => btn.addEventListener("click", () => {
    const v = btn.dataset.view || "home";
    if (v !== "home" && showTutorialBlocked(v === "command" ? "command" : v === "schedule" ? "schedule" : v === "songs" ? "song" : "other")) return;
    state.view = v;
    if (v === "schedule" && state.scheduleTutorialStage === "needSchedule") {
      state.scheduleTutorialStage = "done";
      showEventPopup("スケジュール帳", "今後のライブの予定を組もう。\n出たいライブ候補をタップすると、会場費・キャパ・準備要求を確認して予約できる。", "event", "📅");
    }
    render();
  }));
  const joinBtn = document.getElementById("joinApplicantBtn");
  if (joinBtn) joinBtn.addEventListener("click", joinApplicant);
  const skipBtn = document.getElementById("skipApplicantBtn");
  if (skipBtn) skipBtn.addEventListener("click", () => { state.lastApplicant = null; log("今回は加入を見送った。"); render(); });
  const craftBtn = document.getElementById("executeCraftBtn");
  if (craftBtn) craftBtn.addEventListener("click", executeSongcraftFromForm);
  document.querySelectorAll(".draftCraftBtn").forEach(btn => btn.addEventListener("click", () => executeDraftCraft(btn.dataset.draftId, btn.dataset.craftType)));
  document.querySelectorAll(".openSongEditorBtn:not(:disabled)").forEach(btn => btn.addEventListener("click", () => { if (showTutorialBlocked("song")) return; openSongEditor("menu"); }));
  document.querySelectorAll(".songEditorChoiceBtn, .songEditorNextBtn").forEach(btn => btn.addEventListener("click", () => handleSongEditorAction(btn.dataset.action || "editor:menu")));
  const liveBtn = document.getElementById("performLiveBtn");
  if (liveBtn) liveBtn.addEventListener("click", performLive);
  document.querySelectorAll(".moveMemberBtn").forEach(btn => btn.addEventListener("click", () => moveMember(Number(btn.dataset.index), btn.dataset.dir)));
  document.querySelectorAll(".dismissMemberBtn").forEach(btn => btn.addEventListener("click", () => dismissMember(Number(btn.dataset.index))));
  const capBtn = document.getElementById("applyMemberCapBtn");
  if (capBtn) capBtn.addEventListener("click", applyMemberCap);
  document.querySelectorAll(".buyItemBtn").forEach(btn => btn.addEventListener("click", () => buyItem(btn.dataset.item)));
  document.querySelectorAll(".useItemBtn").forEach(btn => btn.addEventListener("click", () => useItem(btn.dataset.item)));
  const restartMiniBtn = document.getElementById("restartMiniBtn");
  if (restartMiniBtn) restartMiniBtn.addEventListener("click", () => { state = createInitialState(); saveGame(false); render(); });
  ["saveBtn", "homeSaveBtn"].forEach(id => { const btn = document.getElementById(id); if (btn) btn.addEventListener("click", () => saveGame(true)); });
  ["loadBtn", "homeLoadBtn"].forEach(id => { const btn = document.getElementById(id); if (btn) btn.addEventListener("click", restoreGame); });
  const deleteSaveBtn = document.getElementById("deleteSaveBtn");
  if (deleteSaveBtn) deleteSaveBtn.addEventListener("click", deleteSave);
  ["refreshAppBtn", "pwaRefreshBtn"].forEach(id => { const btn = document.getElementById(id); if (btn) btn.addEventListener("click", reloadLatestVersion); });
  document.querySelectorAll(".popupCloseBtn").forEach(btn => btn.addEventListener("click", closeActivePopup));
  document.querySelectorAll(".actionResultCloseBtn").forEach(btn => btn.addEventListener("click", closeActionResultModal));
  document.querySelectorAll(".liveProgressNextBtn").forEach(btn => btn.addEventListener("click", showLiveResultAfterProgress));
  const confirmBandNameBtn = document.getElementById("confirmBandNameBtn");
  if (confirmBandNameBtn) confirmBandNameBtn.addEventListener("click", () => { const name = (document.getElementById("bandNameInput")?.value || "").trim() || "名無しの地下バンド"; state.band.name = name; state.bandNamePrompt = false; log(`バンド名を「${name}」に決めた。`); showEventPopup("バンド名決定", `今日からこの名前でライブハウスに出る。\n${name}`, "event", "🏷️"); if (state.pendingTurnAdvance) finishPendingTurnAdvance(); else render(); });
  const confirmNoSongcraftBtn = document.getElementById("confirmNoSongcraftBtn");
  if (confirmNoSongcraftBtn) confirmNoSongcraftBtn.addEventListener("click", confirmNoSongcraftCommand);
  const cancelNoSongcraftBtn = document.getElementById("cancelNoSongcraftBtn");
  if (cancelNoSongcraftBtn) cancelNoSongcraftBtn.addEventListener("click", () => { state.pendingNoSongcraftCommand = null; state.view = "songs"; if (!state.songEditor || state.songEditor.step === "closed") state.songEditor = { step:"menu" }; render(); });
  document.querySelectorAll(".liveResultCloseBtn").forEach(btn => btn.addEventListener("click", closeLiveResultModal));
  const bookLiveBtn = document.getElementById("bookLiveBtn");
  if (bookLiveBtn) bookLiveBtn.addEventListener("click", () => bookLiveFromHome());
  document.querySelectorAll(".liveCandidateBtn").forEach(btn => btn.addEventListener("click", () => { state.pendingBooking = { turn:Number(btn.dataset.turn), venueId:btn.dataset.venue }; render(); }));
  const confirmBookingBtn = document.getElementById("confirmBookingBtn");
  if (confirmBookingBtn) confirmBookingBtn.addEventListener("click", () => { const b = state.pendingBooking; state.pendingBooking = null; if (b) bookLiveFromHome(b.turn, b.venueId, true); });
  const cancelBookingBtn = document.getElementById("cancelBookingBtn");
  if (cancelBookingBtn) cancelBookingBtn.addEventListener("click", () => { state.pendingBooking = null; render(); });
  document.querySelectorAll(".cancelLiveBtn").forEach(btn => btn.addEventListener("click", () => cancelBookedLive(Number(btn.dataset.turn), false)));
  document.querySelectorAll(".selectMemberBtn").forEach(btn => btn.addEventListener("click", () => { state.selectedMemberId = btn.dataset.memberId || "player"; render(); }));
  const noShowBtn = document.getElementById("noShowLiveBtn");
  if (noShowBtn) noShowBtn.addEventListener("click", () => cancelBookedLive(state.turn, true));
  document.querySelectorAll(".positionSelect").forEach(sel => sel.addEventListener("change", handlePositionChange));
  const chorusSel = document.getElementById("chorusSelect");
  if (chorusSel) chorusSel.addEventListener("change", enforceChorusRule);
}

function bookLiveFromHome(turnArg=null, venueArg=null, confirmed=false) {
  if (!canBookSchedules()) {
    log("初ライブ後からライブ予約ができるようになります。");
    render();
    return;
  }
  const turn = Number(turnArg || document.getElementById("scheduleTurnSelect")?.value || 0);
  const venueId = venueArg || document.getElementById("scheduleVenueSelect")?.value || VENUES[0].id;
  if (!turn || turn <= state.turn + 2 || turn >= 30) {
    log("ライブ予約は残り2ターン以内になると不可。3ターン以上先の予定から選びます。");
    render();
    return;
  }
  if (liveEventForTurn(turn)) {
    log(`${turn}ターン目はすでにライブ予定があります。`);
    render();
    return;
  }
  if (!confirmed && turnArg && venueArg) { state.pendingBooking = { turn, venueId }; render(); return; }
  const v = venueById(venueId);
  state.liveEvents.push({ turn, venueId, label:"自主予約ライブ", fixed:false, booked:true, cancelled:false, name:"自主予約ライブ", capacity:v.capacity, fee:v.fee, prepNeed:v.prepNeed });
  refreshLiveSchedule();
  scheduleNextLive();
  log(`${turn}ターン目に「${v.name}」を予約した。キャパ${v.capacity}、会場費${v.fee.toLocaleString()}円。`);
  render();
}
function cancelBookedLive(turn, noShow=false) {
  const ev = liveEventForTurn(turn);
  if (!ev) { log("キャンセルできるライブ予定が見つからない。"); render(); return; }
  if (ev.fixed) { log("初ライブとUNDER FESは固定予定なのでキャンセルできない。"); render(); return; }
  const remaining = ev.turn - state.turn;
  if (!noShow && remaining <= 2) { log("残り2ターン以内のライブは、通常キャンセルできない。当日ならドタキャン扱いになる。"); render(); return; }
  const v = venueById(ev.venueId);
  state.liveEvents = state.liveEvents.filter(e => e.turn !== turn);
  refreshLiveSchedule();
  state.band.trust = clamp(state.band.trust - (noShow ? 10 : 3), 0, 100);
  state.band.fame = clamp(state.band.fame - (noShow ? 4 : 1), 0, 999);
  if (noShow) {
    const penalty = v.fee + Math.round(v.fee * 0.5);
    state.band.funds -= penalty;
    log(`${turn}Tの「${v.name}」をドタキャンした。会場費＋損料 ${penalty.toLocaleString()}円を支払い、信頼度と知名度が下がった。`);
    state.turn += 1;
    state.songcraftUsedThisTurn = false;
  } else {
    log(`${turn}Tの「${v.name}」をキャンセルした。メリットはなし。信頼度と知名度が少し下がった。`);
  }
  scheduleNextLive();
  render();
}

function handlePositionChange(e) {
  if (e.target.value === "vocal") {
    document.querySelectorAll(".positionSelect").forEach(sel => { if (sel !== e.target && sel.value === "vocal") sel.value = "off"; });
  }
  enforceChorusRule();
}
function enforceChorusRule() {
  const chorusSel = document.getElementById("chorusSelect");
  if (!chorusSel) return;
  const vocalistId = getPositionMapFromDom().vocalistId;
  if (chorusSel.value !== "none" && chorusSel.value === vocalistId) {
    chorusSel.value = "none";
    log("ボーカルはコーラスを兼任できないため、コーラスをなしにした。");
  }
}

function handleCommandClick(command) {
  if (showTutorialBlocked("command")) return;
  if (!state.songcraftUsedThisTurn) {
    state.pendingNoSongcraftCommand = command;
    render();
    return;
  }
  runCommandTurn(command);
}
function confirmNoSongcraftCommand() {
  const command = state.pendingNoSongcraftCommand;
  state.pendingNoSongcraftCommand = null;
  if (command) runCommandTurn(command);
}
function runCommandTurn(command) {
  const before = snapshotActionState();
  executeCommand(command);
  const event = maybeGenerateCommandEvent(command);
  postTurnMaintenance(command);
  const after = snapshotActionState();
  const tutorialMsg = state.tutorialStage === "needCommand" ? "5ターン目に初ライブだ！\n曲を作り、メンバーを集めよう！" : "";
  if (state.tutorialStage === "needCommand") state.tutorialStage = "done";
  state.actionResultModal = makeActionResultModal(command, before, after, event, tutorialMsg);
  state.pendingTurnAdvance = { nextTurn: state.turn + 1 };
  render();
}

function snapshotActionState() {
  return {
    funds: state.band.funds,
    fans: state.band.fans,
    fame: state.band.fame,
    industry: state.band.industry,
    fatigue: state.band.fatigue,
    trust: state.band.trust,
    members: state.members.length,
    songs: state.songs.length,
    drafts: state.pendingDrafts.length,
    memberStats: activeMembers().map(m => ({ id:m.id, name:m.name, technique:m.stats.technique, rhythm:m.stats.rhythm, mental:m.stats.mental, teamwork:m.stats.teamwork }))
  };
}
function makeActionResultModal(command, before, after, event, tutorialMsg="") {
  const meta = commandMeta(command);
  const diffs = [
    ["資金", Math.round(after.funds - before.funds), "円"],
    ["ファン", Math.round(after.fans - before.fans), "人"],
    ["知名度", Math.round(after.fame - before.fame), ""],
    ["業界評価", Math.round(after.industry - before.industry), ""],
    ["疲労", Math.round(after.fatigue - before.fatigue), "%"],
    ["信頼度", Math.round(after.trust - before.trust), ""]
  ].filter(x => x[1] !== 0);
  return { title: meta.label + " 結果", icon: meta.icon, body: meta.body, diffs, event, tutorialMsg, songcraftResult: state.lastSongcraftResult, training: command === "practice" ? trainingSummary(before, after) : "" };
}
function trainingSummary(before, after) {
  const prev = before.memberStats || [];
  const now = after.memberStats || [];
  const rows = [];
  now.slice(0, 5).forEach(n => {
    const p = prev.find(x => x.id === n.id);
    if (!p) return;
    const tech = Math.round((n.technique || 0) - (p.technique || 0));
    const rhythm = Math.round((n.rhythm || 0) - (p.rhythm || 0));
    if (tech || rhythm) rows.push({ name:n.name, tech, rhythm });
  });
  return rows;
}
function commandMeta(command) {
  return {
    practice:{ label:"練習", icon:"🥁", body:"スタジオに音が鳴った。少しだけバンドが前に進んだ。" },
    rest:{ label:"休憩", icon:"☕", body:"今日は休むことにした。身体が軽くなった。" },
    parttime:{ label:"バイト", icon:"💴", body:"音楽のために、今日は働いた。" },
    recruit:{ label:"募集", icon:"📣", body:"掲示板とSNSにメンバー募集を出した。" },
    promo:{ label:"宣伝", icon:"📱", body:"まだ小さいが、知らない誰かに届いている。" },
    talk:{ label:"会話", icon:"💬", body:"少しだけ本音を話した。バンドの空気が変わった。" }
  }[command] || { label:"行動", icon:"⚡", body:"今週の行動を終えた。" };
}
function maybeGenerateCommandEvent(command) {
  if (Math.random() > 0.42) return null;
  const active = activeMembers();
  const member = active[rand(0, active.length - 1)] || state.player;
  const events = {
    practice: [
      ["小さな成長", `${member.name}が自分の音を掴みかけている。`, () => { member.stats.mental = clamp(member.stats.mental + 1,1,99); }, "📈"],
      ["もう一回だけ", `${member.name}が最後にもう一回合わせようと言った。`, () => { state.band.trust = clamp(state.band.trust + 1,0,100); state.band.fatigue = clamp(state.band.fatigue + 2,0,100); }, "🥁"]
    ],
    rest: [["帰り道", "コンビニ前で少しだけ話して、バンドの空気が軽くなった。", () => { state.band.trust = clamp(state.band.trust + 2,0,100); }, "🌙"]],
    parttime: [["バイト先のBGM", "店内で流れていた曲が妙に耳に残った。", () => { state.band.direction["ポップ"] = (state.band.direction["ポップ"] || 0) + 2; }, "🎧"]],
    recruit: [["貼り紙を見た人", "スタジオの掲示板を見た人から連絡が来た。", () => { state.band.fame = clamp(state.band.fame + 1,0,999); }, "📨"]],
    promo: [["SNSが少し伸びた", "投稿がいつもより少しだけ回った。", () => { state.band.fame = clamp(state.band.fame + 2,0,999); }, "📱"]],
    talk: [["本音の会話", `${member.name}が最近の不安を少し話してくれた。`, () => { state.band.trust = clamp(state.band.trust + 3,0,100); }, "☕"]]
  };
  const list = events[command] || events.talk;
  const [title, body, effect, icon] = list[rand(0, list.length - 1)];
  effect();
  log(`イベント発生：${title}。${body}`);
  return { title, body, icon };
}


function executeCommand(command) {
  const b = state.band;
  if (command === "practice") {
    const cost = 1500 + activeMembers().length * 500;
    state.band.funds -= cost;
    activeMembers().forEach(m => {
      m.stats.technique = clamp(m.stats.technique + rand(1,3), 1, 99);
      m.stats.rhythm = clamp(m.stats.rhythm + rand(0,2), 1, 99);
      const inst = m.instruments[m.mainInstrument];
      if (inst) inst.lv = clamp(inst.lv + rand(2,5) * (inst.growth || 1), 1, inst.potentialCap || inst.cap);
    });
    state.songs.forEach(s => s.performance = clamp(s.performance + rand(1,3), 0, 99));
    b.fatigue = clamp(b.fatigue + 14, 0, 100);
    b.trust = clamp(b.trust + 2, 0, 100);
    log(`練習した。技術・リズム・楽器Lv・曲の演奏が少し上がった。費用-${cost.toLocaleString()}円、疲労も増えた。`);
  }
  if (command === "rest") {
    b.fatigue = 0;
    b.trust = clamp(b.trust + 4, 0, 100);
    activeMembers().forEach(m => m.stats.mental = clamp(m.stats.mental + rand(1,3), 1, 99));
    log("休憩した。疲労が全快し、メンタルと信頼度が少し戻った。 ");
  }
  if (command === "parttime") {
    b.funds += 18000;
    b.fatigue = clamp(b.fatigue + 18, 0, 100);
    b.trust = clamp(b.trust - 1, 0, 100);
    log("バイトした。資金+18,000円。ただし疲労が増えた。 ");
  }
  if (command === "recruit") {
    const cost = 3000;
    b.funds -= cost;
    if (!state.candidates.length) {
      log("募集したが、新しい候補はもう見つからなかった。 ");
    } else {
      const idx = rand(0, state.candidates.length - 1);
      state.lastApplicant = state.candidates.splice(idx, 1)[0];
      b.fame = clamp(b.fame + 1, 0, 999);
      log(`${state.lastApplicant.name}が募集を見て連絡してきた。募集費-${cost.toLocaleString()}円。加入させるか選べる。`);
    }
  }
  if (command === "promo") {
    const cost = 3000;
    b.funds -= cost;
    b.fame = clamp(b.fame + rand(4,8), 0, 999);
    state.songs.forEach(s => s.recognition = clamp(s.recognition + rand(1,3), 0, 99));
    log(`宣伝した。知名度と曲の認知度が上がった。宣伝費-${cost.toLocaleString()}円。`);
  }
  if (command === "talk") {
    b.trust = clamp(b.trust + rand(7,12), 0, 100);
    b.fatigue = clamp(b.fatigue - 4, 0, 100);
    const target = activeMembers()[rand(0, activeMembers().length - 1)];
    target.stats.teamwork = clamp(target.stats.teamwork + rand(1,3), 1, 99);
    maybeUnlockHidden(target, "会話");
    log(`${target.name}と話した。信頼度が上がり、隠れ適性の条件が少し進んだ。`);
  }
}

function joinApplicant() {
  if (!state.lastApplicant) return;
  const applicant = state.lastApplicant;
  applicant.joinStatus = Math.random() < 0.45 ? "仮加入" : "本加入";
  state.members.push(applicant);
  const active = activeMembers().some(m => m.id === applicant.id);
  log(`${applicant.name}が${applicant.joinStatus}として加入した。${active ? "バンド構成内なので画面とライブに反映される。" : "構成外なので控え扱い。画面・ライブにはまだ反映されない。"}`);
  showEventPopup(applicant.joinStatus === "仮加入" ? "仮加入！" : "新メンバー加入！", `${applicant.name} がバンドに加わった！\n担当：${applicant.part}\n得意：${applicant.mainGenre}${active ? "\nバンド構成内に入り、ライブに反映される。" : "\n控え扱い。構成に入れるとライブに反映される。"}`, applicant.joinStatus === "仮加入" ? "event" : "rare", applicant.joinStatus === "仮加入" ? "🤝" : "🎉");
  state.lastApplicant = null;
  render();
}


function moveMember(index, dir) {
  const target = dir === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= state.members.length) return;
  const tmp = state.members[index];
  state.members[index] = state.members[target];
  state.members[target] = tmp;
  log("メンバー順を入れ替えた。バンド構成内に入ったメンバーだけが画面・ライブに反映される。");
  render();
}
function dismissMember(index) {
  const m = state.members[index];
  if (!m) return;
  const cost = m.joinStatus === "仮加入" ? 5000 : 12000;
  state.band.funds -= cost;
  state.band.trust = clamp(state.band.trust - (m.joinStatus === "仮加入" ? 4 : 10), 0, 100);
  activeMembers().forEach(mem => {
    mem.stats.mental = clamp(mem.stats.mental - 1, 1, 99);
    mem.stats.teamwork = clamp(mem.stats.teamwork - 1, 1, 99);
  });
  state.members.splice(index, 1);
  log(`${m.name}を脱退させた。精算費-${cost.toLocaleString()}円。信頼度と一部ステータスが下がった。`);
  render();
}
function applyMemberCap() {
  const newCap = Number(document.getElementById("memberCapSelect")?.value || state.memberCap);
  const old = state.memberCap;
  if (newCap > old) {
    const cost = (newCap - old) * 6000;
    state.band.funds -= cost;
    log(`バンド構成を${newCap}人に増やした。追加管理費-${cost.toLocaleString()}円。`);
  } else if (newCap < old) {
    log(`バンド構成を${newCap}人に下げた。構成外の仲間は控え扱いになり、画面・ライブには反映されない。`);
  }
  state.memberCap = newCap;
  render();
}
function buyItem(item) {
  const prices = { drink: 5000, effecter: 12000, usedGear: 15000, lightFx: 10000 };
  const names = { drink: "疲労回復ドリンク", effecter: "エフェクター", usedGear: "中古楽器", lightFx: "照明エフェクト" };
  const price = prices[item] || 0;
  state.band.funds -= price;
  state.items[item] = (state.items[item] || 0) + 1;
  log(`${names[item]}を購入した。-${price.toLocaleString()}円。`);
  render();
}
function useItem(item) {
  if ((state.items[item] || 0) <= 0) { log("使えるアイテムがない。"); render(); return; }
  if (item === "drink") {
    state.items.drink -= 1;
    state.band.fatigue = clamp(state.band.fatigue - 25, 0, 100);
    log("疲労回復ドリンクを使った。疲労-25。");
  }
  render();
}
function postTurnMaintenance(command) {
  const b = state.band;
  const activeCount = activeMembers().length;
  const reserveCount = reserveMembers().length;
  const upkeep = Math.max(0, activeCount - 1) * 700 + reserveCount * 250;
  if (upkeep) { b.funds -= upkeep; log(`メンバー維持費・交通費で-${upkeep.toLocaleString()}円。`); }
  processReserveMembers();
  if (b.funds < 0) {
    b.trust = clamp(b.trust - 3, 0, 100);
    b.fatigue = clamp(b.fatigue + 4, 0, 100);
    log("資金がマイナスになった。空気が重くなり、信頼度低下・疲労増加。");
  }
  const badChance = clamp((state.members.length - 3) * 0.025 + b.fatigue / 320, 0, 0.35);
  if (Math.random() < badChance) {
    const roll = rand(1, 3);
    if (roll === 1) { b.fatigue = clamp(b.fatigue + 8, 0, 100); log("人数が増えて連絡・移動で消耗した。疲労+8。"); }
    if (roll === 2) { b.trust = clamp(b.trust - 5, 0, 100); log("音楽性の小さなズレが出た。信頼度-5。"); }
    if (roll === 3 && state.members.some(m => m.joinStatus === "仮加入")) {
      const temp = state.members.find(m => m.joinStatus === "仮加入");
      if (b.trust < 25 || b.fatigue > 85) {
        state.members = state.members.filter(m => m.id !== temp.id);
        log(`${temp.name}が仮加入のまま離れた。疲労や信頼度の低さが原因。`);
      } else {
        log(`${temp.name}がバンドの様子を見ている。仮加入のまま続行。`);
      }
    }
  }
}


function processReserveMembers() {
  const activeIds = new Set(activeMembers().map(m => m.id));
  // 構成内に戻ったメンバーは控え待機カウントをリセット。
  state.members.forEach(m => {
    if (activeIds.has(m.id)) {
      m.reserveTurns = 0;
      m.reserveWarned = false;
    }
  });

  const reserves = state.members.filter(m => !activeIds.has(m.id));
  for (const m of reserves) {
    m.reserveTurns = (m.reserveTurns || 0) + 1;
    if (m.reserveTurns >= 3 && !m.reserveWarned) {
      m.reserveWarned = true;
      log(`${m.name}から「このまま控えなら、別のバンドも考えたい」と報告があった。構成に戻すか、話す必要がありそう。`);
      continue;
    }
    if (m.reserveTurns >= 5) {
      state.members = state.members.filter(x => x.id !== m.id);
      state.band.trust = clamp(state.band.trust - 5, 0, 100);
      state.band.fame = clamp(state.band.fame - 1, 0, 999);
      activeMembers().forEach(mem => {
        mem.stats.mental = clamp(mem.stats.mental - 1, 1, 99);
        mem.stats.teamwork = clamp(mem.stats.teamwork - 1, 1, 99);
      });
      log(`${m.name}が控えのまま離脱した。信頼度が下がり、バンドの空気も少し重くなった。`);
      break;
    }
  }
}

function executeSongcraftFromForm() {
  if (state.songcraftUsedThisTurn) {
    log("今ターンの作詞作曲はすでに実行済み。");
    render();
    return;
  }
  const mode = document.getElementById("craftMode")?.value || "new";
  const type = document.getElementById("craftType")?.value || "lyrics";
  const member = activeMembers().find(m => m.id === document.getElementById("craftMember")?.value) || state.player;
  const mainGenre = document.getElementById("craftMainGenre")?.value || MAIN_GENRES[0];
  const subGenre = document.getElementById("craftSubGenre")?.value || "";
  const genre = subGenre || mainGenre;
  const theme = document.getElementById("craftTheme")?.value || THEMES[0];
  const keyword = document.getElementById("craftKeyword")?.value || KEYWORDS[0];
  const arrange = document.getElementById("craftArrange")?.value || ARRANGES[0];
  const title = (document.getElementById("craftTitle")?.value || "").trim();
  if (mode === "new") createDraftAndAdvance(type, member, mainGenre, mainGenre, theme, keyword, arrange, title);
  if (mode === "draft") {
    const draftId = document.getElementById("craftDraft")?.value;
    if (!draftId || draftId === "none") log("進める制作中の曲がありません。");
    else advanceDraftById(draftId, type, member);
  }
  if (mode === "boost") boostSong(type, member, document.getElementById("craftSong")?.value);
  completeSongcraftTutorial();
  render();
}

function executeDraftCraft(draftId, type) {
  if (state.songcraftUsedThisTurn) {
    log("今ターンの作詞作曲はすでに実行済み。");
    render();
    return;
  }
  const member = activeMembers().find(m => m.id === document.getElementById("craftMember")?.value) || state.player;
  advanceDraftById(draftId, type, member);
  completeSongcraftTutorial();
  render();
}

function derivedLyrics(m) { return (m.stats.knowledge + m.stats.sense + m.stats.mental + m.stats.charisma) / 4; }
function derivedMusic(m) { return (m.stats.rhythm + m.stats.sense + m.stats.knowledge + m.stats.technique) / 4; }
function genreFit(m, mainGenre, subGenre) {
  let score = 0;
  if (m.mainGenre === mainGenre) score += 12;
  if ((m.secondMainGenres || []).includes(mainGenre)) score += 6;

  // サブジャンルは「任意の派生・味付け」。未選択ならメインジャンルだけで自然に評価する。
  if (subGenre) {
    if ((m.subGenres || []).includes(subGenre)) score += isSubGenreDiscovered(m.id, subGenre) ? 10 : 4;

    // サブジャンルの親ジャンルがキャラの一番得意/二番目得意と合う場合、メイン側にも適性あり。
    if (m.mainGenre === subParent(subGenre)) score += 5;
    if ((m.secondMainGenres || []).includes(subParent(subGenre))) score += 3;
    if ((m.weakSubGenres || []).includes(subGenre)) score -= 9;
  } else {
    // 王道のメインジャンル曲。派生補正はないが、迷いが少ないぶん少し安定する。
    score += 2;
  }

  // キャラが得意な隠しサブジャンルの親なら、メイン適性にも薄く反映。
  if ((m.subGenres || []).some(sg => subParent(sg) === mainGenre)) score += 3;

  if ((m.weakMainGenres || []).includes(mainGenre)) score -= 9;
  return score;
}

function createDraftAndAdvance(type, member, mainGenreA, mainGenreB, theme, keyword, arrange, inputTitle) {
  const titleHint = inputTitle || makeTitle(keyword, theme);
  let draft = state.pendingDrafts.find(d => d.titleHint === titleHint);
  if (!draft) {
    const a = mainGenreA || MAIN_GENRES[0];
    const b = mainGenreB || a;
    const resolved = resolveSongGenrePair(a, b, arrange);
    draft = {
      id: `draft_${Date.now()}_${rand(100,999)}`,
      titleHint,
      mainGenre: resolved.mainGenre,
      subGenre: resolved.subGenre || "",
      genre: resolved.subGenre || resolved.mainGenre,
      sourceMainGenres: resolved.sourceMainGenres,
      genreRollType: resolved.rollType,
      genreChanceText: resolved.chanceText,
      theme, keyword, arrange,
      lyricsDone: false, musicDone: false, lyricsScore: 0, musicScore: 0, tags: []
    };
    state.pendingDrafts.push(draft);
    const rollLabel = resolved.rollType === "main" ? "メインジャンル生成" : resolved.rollType === "combo-sub" ? "狙い派生成功" : "派生サブジャンル生成";
    log(`新曲「${titleHint}」の種が生まれた。狙い:${a}→${b} / 結果:${genreDisplay(draft)}（${rollLabel}） / ${resolved.chanceText}`);
  } else {
    log(`制作中の「${titleHint}」を続ける。`);
  }
  advanceDraft(draft, type, member);
}

function advanceDraftById(draftId, type, member) {
  const draft = state.pendingDrafts.find(d => d.id === draftId);
  if (!draft) { log("指定された制作中の曲が見つからなかった。"); return; }
  advanceDraft(draft, type, member);
}

function advanceDraft(d, type, member) {
  if (type === "lyrics" && d.lyricsDone) { log(`「${d.titleHint}」の作詞はすでに完了している。未作成の作曲を選んでください。`); return; }
  if (type === "music" && d.musicDone) { log(`「${d.titleHint}」の作曲はすでに完了している。未作成の作詞を選んでください。`); return; }
  const base = type === "lyrics" ? derivedLyrics(member) : derivedMusic(member);
  const kw = analyzeKeywordText(d.keyword, d.theme);
  const arrState = arrangeStatus(d.arrange || "");
  const arrangeBonus = (arrState.status === "有効" ? 5 : arrState.status === "不完全" ? 2 : -4);
  const keywordBonus = (kw.matchedTheme ? 4 : 0) + (kw.unknown ? 1 : Math.min(4, kw.hits.length * 2));
  const score = clamp(base + genreFit(member, d.mainGenre || subParent(d.genre), d.subGenre || d.genre) + arrangeBonus + keywordBonus + rand(-12, 18) - state.band.fatigue * 0.08, 10, 99);
  if (kw.tags?.length) d.tags.push(...kw.tags.slice(0, 3));
  if (arrState.status === "無効" && !d.tags.includes("未完成感")) d.tags.push("未完成感");
  if (type === "lyrics") {
    d.lyricsDone = true;
    d.lyricsScore = Math.max(d.lyricsScore, score);
    if (score > 70 && !d.tags.includes("エモさ")) d.tags.push("エモさ");
    log(`${member.name}が「${d.titleHint}」の作詞を完成させた。完成度 ${val(score)}%。`, "song");
    if (score >= 75) showEventPopup("歌詞が刺さった", `${member.name}の言葉が、スタジオの空気を一瞬止めた。
「${d.titleHint}」の歌詞完成度 ${val(score)}%。`, "song", "✍️");
  } else {
    d.musicDone = true;
    d.musicScore = Math.max(d.musicScore, score);
    if ((d.arrange.includes("疾走") || score > 75) && !d.tags.includes("疾走感")) d.tags.push("疾走感");
    if ((d.arrange.includes("ドラム") || d.arrange.includes("DJ")) && !d.tags.includes("爆発力")) d.tags.push("爆発力");
    log(`${member.name}が「${d.titleHint}」の作曲を完成させた。完成度 ${val(score)}%。`, "song");
    if (score >= 75) showEventPopup("リフがハマった", `${member.name}が鳴らしたフレーズに、全員が少し前のめりになった。
「${d.titleHint}」の作曲完成度 ${val(score)}%。`, "song", "🎼");
  }
  if (d.lyricsDone && d.musicDone) {
    finishDraft(d.id);
  } else {
    const next = d.lyricsDone ? "作曲" : "作詞";
    const done = d.lyricsDone ? "作詞" : "作曲";
    const bars = [{ label: done, value: val(score) }];
    const bonus = [];
    if (kw.matchedTheme) bonus.push("テーマ相性○");
    if (kw.tags?.length) bonus.push(`キーワード:${kw.tags.slice(0,2).join("・")}`);
    if (arrState.status === "有効") bonus.push(`アレンジ有効:${d.arrange}`);
    if (arrState.status === "不完全") bonus.push(`アレンジ不完全:${d.arrange}`);
    const halfBody = `「${d.titleHint}」
${done}完成度：${val(score)}%
ジャンル：${genreDisplay(d)}
${bonus.length ? "ボーナス：" + bonus.join(" / ") + "\n" : ""}次は${next}をしよう！`;
    state.lastSongcraftResult = { title:`${done} 50％完成！`, body:halfBody, bars };
    showEventPopup(`${done} 50％完成！`, halfBody, "song", d.lyricsDone ? "✍️" : "🎼", { bars });
  }
}

function makeTitle(keyword, theme) {
  const patterns = [
    `${keyword}の${theme}`,
    `${keyword}, ${theme}`,
    `${keyword} Runaway`,
    `${theme} under light`,
    `${keyword}はまだ鳴ってる`
  ];
  return patterns[rand(0, patterns.length - 1)];
}

function finishDraft(draftId) {
  const idx = state.pendingDrafts.findIndex(d => d.id === draftId);
  if (idx < 0) return;
  const d = state.pendingDrafts[idx];
  const avgScore = (d.lyricsScore + d.musicScore) / 2;
  const song = {
    id: `song_${Date.now()}`,
    title: d.titleHint,
    isCover: false,
    catchy: clamp(35 + avgScore * 0.35 + (analyzeKeywordText(d.keyword,d.theme).tags.includes("青春") ? 3 : 0) + rand(-8, 8), 0, 99),
    tempo: clamp(8 + d.musicScore * 0.45 + (d.arrange.includes("疾走") ? 8 : 0) + (d.arrange.includes("ドラム") ? 4 : 0) + rand(-4, 6), 0, 99),
    mainGenre: d.mainGenre || subParent(d.subGenre || d.genre),
    subGenre: d.subGenre || "",
    genre: d.subGenre || d.mainGenre || d.genre,
    recognition: 0,
    lyrics: clamp(5 + d.lyricsScore * 0.65 + rand(-4, 6), 0, 99),
    performance: clamp(5 + d.musicScore * 0.65 + rand(-4, 6), 0, 99),
    trend: clamp(10 + (d.arrange.includes("シンセ") || d.arrange.includes("DJ") ? 8 : 0) + rand(0, 22), 0, 99),
    tags: [...new Set(d.tags.length ? d.tags : ["新曲"])],
    standardPoints: 0,
    representativePoints: 0
  };
  state.songs.push(song);
  updateDirection(song.mainGenre, 5); if (song.subGenre) updateDirection(song.subGenre, 4);
  state.pendingDrafts.splice(idx, 1);
  const discovery = registerGenreDiscovery(song.subGenre || song.mainGenre, song.title);
  const bonusLines = [];
  if (discovery?.rare) bonusLines.push(`レアジャンル発見：${genreDisplay(song)}`);
  if (song.tags.includes("疾走感")) bonusLines.push("疾走感タグ");
  if (song.tags.includes("エモさ")) bonusLines.push("エモさタグ");
  const resultBody = `「${song.title}」
ジャンル：${genreDisplay(song)}
歌詞:${val(song.lyrics)} / 演奏:${val(song.performance)} / テンポ:${val(song.tempo)} / キャッチー:${val(song.catchy)} / 流行:${val(song.trend)}
ボーナス：${bonusLines.length ? bonusLines.join(" / ") : "なし"}`;
  state.lastSongcraftResult = { title:"新曲100％完成！", body:resultBody, bars:[
    { label:"歌詞", value:val(song.lyrics) },
    { label:"演奏", value:val(song.performance) },
    { label:"テンポ", value:val(song.tempo) },
    { label:"キャッチー", value:val(song.catchy) },
    { label:"流行", value:val(song.trend) }
  ] };
  log(`新曲「${song.title}」が完成！ ジャンル:${genreDisplay(song)} / タグ:${song.tags.join("・")}`, "song");
  showEventPopup("新曲完成！", resultBody, discovery?.rare ? "rare" : "song", discovery?.rare ? "⭐" : "💿", { bars:[
    { label:"歌詞", value:val(song.lyrics) },
    { label:"演奏", value:val(song.performance) },
    { label:"テンポ", value:val(song.tempo) },
    { label:"キャッチー", value:val(song.catchy) },
    { label:"流行", value:val(song.trend) }
  ] });
}

function registerGenreDiscovery(genre, songTitle="") {
  if (!genre) return null;
  if (state.discoveredGenres[genre]) return null;
  const sg = SUB_GENRES.find(x => x.name === genre);
  const rare = sg?.rarity === "rare";
  state.discoveredGenres[genre] = { turn: state.turn, songTitle, rare: !!rare };
  log(`${rare ? "レア" : "新"}ジャンル発見！『${genre}』${songTitle ? `（${songTitle}）` : ""}`, rare ? "rare" : "song");
  return { genre, rare: !!rare };
}

function boostSong(type, member, songId) {
  const s = state.songs.find(x => x.id === songId);
  if (!s) return;
  const base = type === "lyrics" ? derivedLyrics(member) : derivedMusic(member);
  const amount = clamp(base / 10 + rand(-2, 8) - state.band.fatigue * 0.03, 1, 15);
  if (type === "lyrics") {
    s.lyrics = clamp(s.lyrics + amount, 0, 99);
    s.catchy = clamp(s.catchy + amount * 0.25, 0, 99);
    s.recognition = clamp(s.recognition + 1, 0, 99);
    if (s.lyrics > 72 && !hasTag(s,"エモさ")) s.tags.push("エモさ");
    state.lastSongcraftResult = { title:"曲強化：歌詞", body:`「${s.title}」
歌詞+${val(amount)} / キャッチー少しUP / 認知度+1`, bars:[{label:"歌詞", value:val(s.lyrics)}, {label:"キャッチー", value:val(s.catchy)}, {label:"認知度", value:val(s.recognition)}] };
    log(`${s.title}の歌詞を磨いた。歌詞+${val(amount)}。`);
    showEventPopup("曲強化完了", state.lastSongcraftResult.body, "song", "🔧", { bars:[{label:"歌詞", value:val(s.lyrics)}, {label:"キャッチー", value:val(s.catchy)}, {label:"認知度", value:val(s.recognition)}] });
  } else {
    s.performance = clamp(s.performance + amount, 0, 99);
    s.tempo = clamp(s.tempo + amount * 0.25, 0, 99);
    s.trend = clamp(s.trend + rand(0,2), 0, 99);
    if (s.tempo > 76 && !hasTag(s,"疾走感")) s.tags.push("疾走感");
    state.lastSongcraftResult = { title:"曲強化：作曲", body:`「${s.title}」
演奏+${val(amount)} / テンポ少しUP / 流行微増`, bars:[{label:"演奏", value:val(s.performance)}, {label:"テンポ", value:val(s.tempo)}, {label:"流行", value:val(s.trend)}] };
    log(`${s.title}の作曲・アレンジを磨いた。演奏+${val(amount)}。`);
    showEventPopup("曲強化完了", state.lastSongcraftResult.body, "song", "🔧", { bars:[{label:"演奏", value:val(s.performance)}, {label:"テンポ", value:val(s.tempo)}, {label:"流行", value:val(s.trend)}] });
  }
}

function updateDirection(genre, amount) { state.band.direction[genre] = (state.band.direction[genre] || 0) + amount; }

function maybeUnlockHidden(member, reason) {
  for (const [inst, data] of Object.entries(member.instruments || {})) {
    if (data.hiddenUpgrade && Math.random() < 0.18) {
      data.mark = "◎";
      data.cap = Math.max(data.cap, data.potentialCap || data.cap);
      data.hiddenUpgrade = false;
      log(`${reason}をきっかけに、${member.name}の${instLabel(inst)}適性が開花した。適性が◎になった。`);
      break;
    }
  }
}

function getPositionMapFromDom() {
  const map = {};
  let vocalistId = null;
  document.querySelectorAll(".positionSelect").forEach(sel => {
    const id = sel.dataset.memberId;
    map[id] = sel.value;
    if (sel.value === "vocal") vocalistId = id;
  });
  if (!vocalistId) {
    vocalistId = "player";
    map.player = "vocal";
  }
  return { map, vocalistId };
}

function performLive() {
  const allSongs = [...state.songs, ...DATA.coverSongs];
  const ids = [...document.querySelectorAll(".setlistSelect")].map(x => x.value);
  const setlist = ids.map(id => clone(allSongs.find(s => s.id === id))).filter(Boolean);
  const supportIds = [...document.querySelectorAll(".supportCheck:checked")].map(x => x.value);
  const supports = supportIds.map(id => DATA.supportOptions.find(s => s.id === id)).filter(Boolean);
  const merch = document.getElementById("merchSelect").value;
  const { map: positions, vocalistId } = getPositionMapFromDom();
  let chorusId = document.getElementById("chorusSelect")?.value || "none";
  if (chorusId === vocalistId) chorusId = "none";
  const vocalist = activeMembers().find(m => m.id === vocalistId) || state.player;
  const chorus = activeMembers().find(m => m.id === chorusId) || null;
  const result = calculateLive(setlist, supports, merch, positions, vocalist, chorus);
  state.deferPopupsUntilAfterLive = true;
  applyLiveResult(result, setlist, supports, merch);
  state.pendingLiveResultModal = makeLiveResultModal(result, setlist);
  state.liveProgressModal = makeLiveProgressModal(result, setlist);
  const firstLive = state.liveCount === 0;
  state.liveResultHistory.push(result);
  state.liveCount += 1;
  if (firstLive) {
    state.playerExtraInstrumentsUnlocked = true;
    state.scheduleTutorialStage = "needSchedule";
    state.popupQueue = state.popupQueue || [];
    state.popupQueue.push({ title:"新しい可能性", body:"主人公「ボーカル以外にも道があるかな……」\n主人公がボーカル以外の楽器も担当可能になった。", type:"event", icon:"🎸" });
    state.popupQueue.push({ title:"スケジュール解放", body:"次からは自分でライブ予定を組む。\nまずはスケジュール帳を開いて、出たいライブを探そう。", type:"event", icon:"📅" });
  }
  if (state.turn === 30) {
    state.ended = true;
  } else {
    state.turn += 1;
    state.view = "home";
    scheduleNextLive();
  }
  render();
}

function calculateLive(setlist, supports, merch, positions, vocalist, chorus) {
  const all = activeMembers();
  const performers = all.filter(m => (positions[m.id] || "off") !== "off");
  const originalCount = setlist.filter(s => !s.isCover).length;
  const coverCount = 5 - originalCount;
  const avgTech = avg(performers.map(m => m.stats.technique));
  const avgRhythm = avg(performers.map(m => m.stats.rhythm));
  const avgSense = avg(performers.map(m => m.stats.sense));
  const avgMental = avg(performers.map(m => m.stats.mental));
  const avgTeam = avg(performers.map(m => m.stats.teamwork));
  const avgStamina = avg(performers.map(m => m.stats.stamina));
  const avgCharisma = avg(performers.map(m => m.stats.charisma));
  const avgKnowledge = avg(performers.map(m => m.stats.knowledge));
  const positionScore = avg(performers.map(m => instrumentSkillFor(m, positions[m.id])));
  const vocalLv = instrumentSkillFor(vocalist, "vocal");
  const chorusBoost = chorus ? instrumentSkillFor(chorus, "chorus") / 8 : 0;
  const instruments = new Set(performers.map(m => positions[m.id]).filter(x => x && x !== "off"));
  supports.forEach(s => instruments.add(s.instrument));
  instruments.add("vocal");
  if (chorus) instruments.add("chorus");

  const tags = setlist.flatMap(s => s.tags || []);
  const supportScore = sum(supports.map(s => s.score));
  const combo = instrumentComboScore(instruments);
  const memberScaleBonus = Math.max(0, performers.length - 3) * 3;
  const memberScaleRisk = Math.max(0, performers.length - 4) * 5;
  const equipmentBonus = { performance:(state.items.usedGear||0)*2 + (state.items.effecter||0), expression:(state.items.effecter||0)*2, heat:(state.items.lightFx||0)*3, strategy:(state.items.lightFx||0), stability:0 };
  const originalityBonus = originalCount === 5 ? 25 : originalCount === 4 ? 15 : originalCount === 3 ? 0 : -18;
  const coverStability = coverCount * 7;
  const fatigue = state.band.fatigue;
  const adlib = adlibResult(avgSense, avgTeam, avgMental, avgRhythm, state.band.trust, fatigue);
  const repeatInfo = resolveRepeatSetlist(analyzeRepeatSetlist(setlist), adlib);
  const venue = currentLiveEvent();
  const venueData = venueById(venue.venueId);
  const prepScore = estimatePrepScore();
  const venueShortage = Math.max(0, venueData.prepNeed - prepScore);
  const venuePenalty = venueShortage * 0.55;

  const slotScores = setlist.map((song, idx) => scoreSongSlot(song, idx + 1) * repeatInfo.multipliers[idx]);
  const baseSongPerformance = avg(setlist.map((s, idx) => s.performance * repeatInfo.multipliers[idx]));
  const baseLyrics = avg(setlist.map((s, idx) => s.lyrics * repeatInfo.multipliers[idx]));
  const baseTempo = avg(setlist.map((s, idx) => s.tempo * repeatInfo.multipliers[idx]));
  const baseCatchy = avg(setlist.map((s, idx) => s.catchy * repeatInfo.multipliers[idx]));
  const baseRecognition = avg(setlist.map((s, idx) => s.recognition * repeatInfo.multipliers[idx]));

  let performance = avgTech * .30 + avgRhythm * .13 + positionScore * .25 + baseSongPerformance * .30 + supportScore + combo.performance + coverStability + memberScaleBonus + equipmentBonus.performance - coverCount * 2 + rand(-8,8);
  let expression = avgSense * .25 + avgKnowledge * .15 + baseLyrics * .35 + vocalLv * .15 + chorusBoost + equipmentBonus.expression + (tags.includes("エモさ") ? 8 : 0) + rand(-8,8);
  let heat = baseTempo * .23 + baseCatchy * .22 + avgCharisma * .22 + avgRhythm * .15 + avgStamina * .12 + memberScaleBonus + equipmentBonus.heat + venueData.heatBonus + (tags.includes("爆発力") ? 10 : 0) + (tags.includes("疾走感") ? 6 : 0) + rand(-8,8);
  let strategy = avg(slotScores) + combo.strategy + originalityBonus + baseRecognition * .12 + avg(setlist.map((s, idx)=>s.trend * repeatInfo.multipliers[idx])) * .10 + (supports.length ? 6 : 0) + equipmentBonus.strategy - venuePenalty * .65 + rand(-8,8);
  let stability = avgMental * .22 + avgStamina * .20 + avgTeam * .24 + state.band.trust * .24 + combo.stability + coverStability - fatigue * .78 - memberScaleRisk + supportScore * .35 - venuePenalty + rand(-10,6);
  if (fatigue > 70) { stability -= (fatigue - 70) * 0.9; heat -= (fatigue - 70) * 0.35; }

  if (repeatInfo.boom) {
    heat += repeatInfo.boomBoost;
    strategy += repeatInfo.boomBoost * 0.85;
    expression += repeatInfo.boomBoost * 0.35;
  }

  performance += adlib.performance;
  expression += adlib.expression;
  heat += adlib.heat;
  strategy += adlib.strategy;
  stability += adlib.stability;

  const finalPenalty = state.turn === 30 ? coverCount * 5 : coverCount * 2;
  const rawTotal = performance + expression + heat + strategy + stability - finalPenalty;
  const total = clamp(rawTotal / 3.1, 0, 100);
  const rank = rankFromScore(total);
  const revenue = calculateRevenue(total, rank, merch, supports, setlist, originalCount, coverCount);
  const coreEvent = shouldCoreFanEvent(rank, expression, heat, tags, coverCount);
  const positionText = performers.map(m => `${m.name}:${instLabel(positions[m.id])}`).join(" / ");

  return { performance, expression, heat, strategy, stability, total, rank, revenue, originalCount, coverCount, adlib, repeatInfo, coreEvent, supports, merch, venue: venueData, prepScore, venueShortage, vocalistName: vocalist.name, chorusName: chorus ? chorus.name : "なし", positions, performers: performers.map(m => m.id), positionText };
}

function analyzeRepeatSetlist(setlist) {
  const seen = {};
  const multipliers = [];
  const repeats = [];
  setlist.forEach((song, idx) => {
    const key = song.id || song.title;
    seen[key] = (seen[key] || 0) + 1;
    const occurrence = seen[key];
    const multiplier = occurrence <= 1 ? 1 : Math.pow(0.5, occurrence - 1);
    multipliers[idx] = multiplier;
    if (occurrence > 1) repeats.push({ idx, title: song.title, occurrence, multiplier });
  });
  return { hasRepeats: repeats.length > 0, repeats, multipliers };
}

function resolveRepeatSetlist(info, adlib) {
  if (!info.hasRepeats) return { ...info, boom:false, boomBoost:0, text:"同一曲なし" };
  if (adlib && adlib.text !== "なし") {
    return {
      ...info,
      boom:true,
      boomBoost:18 + info.repeats.length * 6,
      text:"アドリブで同じ曲の再演が刺さり、評価爆上げ確定",
      multipliers: info.multipliers.map(m => m < 1 ? 1.45 : 1)
    };
  }
  // 同じ曲の再演は毎回成功率が半減。どこかで失敗した場合、それまでの成功分も帳消しになる。
  let allSuccess = true;
  for (const r of info.repeats) {
    const successProb = r.multiplier; // 2回目0.5、3回目0.25、4回目0.125...
    if (Math.random() > successProb) { allSuccess = false; break; }
  }
  if (allSuccess) {
    return {
      ...info,
      boom:true,
      boomBoost:12 + info.repeats.length * 5,
      text:"同一曲再演ギャンブルがすべて成功し、客席が異様に盛り上がった",
      multipliers: info.multipliers.map(m => m < 1 ? 1.35 : 1)
    };
  }
  return {
    ...info,
    boom:false,
    boomBoost:0,
    text:"同一曲再演ギャンブルに失敗。成功分も帳消しになり、2回目以降は大きく減点",
    multipliers: info.multipliers.map((m, idx) => m < 1 ? 0.25 : 0.75)
  };
}

function instrumentSkillFor(member, instrument) {
  if (!member || !instrument || instrument === "off") return 0;
  const data = member.instruments?.[instrument];
  if (!data) return instrument === "other" ? 30 : 18;
  const markBonus = { "◎": 12, "○": 5, "△": -6, "×": -18 }[data.mark] || 0;
  const base = clamp((data.lv || 20) + markBonus, 5, 110);
  return member.joinStatus === "仮加入" ? base * 0.9 : base;
}

function scoreSongSlot(song, slot) {
  let score = 0;
  if (slot === 1) score += song.catchy * .35 + song.tempo * .25 + song.recognition * .18 + (hasTag(song,"定番") ? 15 : 0) + (song.isCover ? 10 : 0) + (hasTag(song,"爆発力") ? 8 : 0);
  if (slot === 2) score += song.performance * .32 + song.lyrics * .18 + song.tempo * .16 + genreDirectionFit(song.genre) + (song.isCover ? 3 : 0);
  if (slot === 3) score += song.lyrics * .34 + song.performance * .24 + (hasTag(song,"エモさ") ? 10 : 0) + (hasTag(song,"個性") ? 10 : 0);
  if (slot === 4) score += song.performance * .22 + (hasTag(song,"余韻") ? 10 : 0) + (song.isCover ? 8 : 0) + (song.tempo < 60 ? 7 : 0);
  if (slot === 5) score += song.recognition * .20 + song.lyrics * .23 + song.tempo * .18 + (hasTag(song,"代表曲候補") ? 20 : 0) + (hasTag(song,"定番") ? 15 : 0) + (hasTag(song,"爆発力") ? 15 : 0);
  return score;
}
function genreDirectionFit(genre) { return Math.min(16, (state.band.direction[genre] || 0) / 4); }
function instrumentComboScore(instruments) {
  let performance = 0, strategy = 0, stability = 0;
  if (instruments.has("guitar") && instruments.has("bass") && instruments.has("drum")) { performance += 15; stability += 10; }
  if (instruments.has("bass") && instruments.has("drum")) { stability += 12; }
  if (instruments.has("vocal") && instruments.has("chorus")) { strategy += 8; }
  if (instruments.has("guitar") && instruments.has("bass") && instruments.has("drum") && instruments.has("key")) { strategy += 12; }
  if (instruments.has("bass") && instruments.has("drum") && instruments.has("dj")) { strategy += 14; performance += 6; }
  return { performance, strategy, stability };
}
function adlibResult(sense, teamwork, mental, rhythm, trust, fatigue) {
  const chance = clamp((sense + teamwork + mental + rhythm + trust - fatigue) / 420, 0.05, 0.65);
  if (Math.random() > chance) return { performance:0, expression:0, heat:0, strategy:0, stability:0, text:"なし" };
  const great = Math.random() < 0.22;
  if (great) return { performance:8, expression:10, heat:12, strategy:15, stability:5, text:"大成功" };
  return { performance:5, expression:5, heat:5, strategy:10, stability:3, text:"成功" };
}
function rankFromScore(score) { if (score >= 80) return "S"; if (score >= 70) return "A"; if (score >= 60) return "B"; if (score >= 45) return "C"; if (score >= 30) return "D"; return "E"; }
function rankMult(rank) { return { S:1.6, A:1.35, B:1.15, C:1.0, D:.78, E:.55 }[rank] || 1; }
function venueFee() { return venueById(currentLiveEvent().venueId).fee; }
function capacity() { return venueById(currentLiveEvent().venueId).capacity; }
function calculateRevenue(total, rank, merch, supports, setlist) {
  const cap = capacity();
  const attendees = clamp(Math.round(10 + state.band.fans * .45 + state.band.fame * .55 + total * .45), 5, cap);
  const ticket = 1500;
  const ticketRevenue = attendees * ticket;
  const bonus = Math.max(0, Math.round((total - 45) * 180));
  const merchData = merchRevenue(merch, attendees, rank, setlist);
  const supportCost = sum(supports.map(s => s.cost));
  const finalProfit = ticketRevenue + bonus + merchData.revenue - venueFee() - supportCost - merchData.cost;
  return { attendees, ticketRevenue, bonus, merch: merchData, supportCost, venueFee: venueFee(), finalProfit };
}
function merchRevenue(level, attendees, rank, setlist) {
  const levels = { none: { cost:0, base:0, demo:false, label:"なし" }, low: { cost:3000, base:180, demo:false, label:"低コスト" }, standard: { cost:8000, base:260, demo:true, label:"標準" }, premium: { cost:15000, base:420, demo:true, label:"勝負" } };
  const m = levels[level] || levels.none;
  if (level === "none") return { cost:0, revenue:0, label:m.label, demoPrice:0, demoUnits:0 };
  const pop = popularity();
  const hasRep = setlist.some(s => hasTag(s,"代表曲候補"));
  const avgRec = avg(setlist.map(s => s.recognition));
  const demoPrice = m.demo ? Math.round(clamp(500 + pop * 24 + state.band.core * 18 + avgRec * 10 + (hasRep ? 900 : 0), 500, 6000)) : 0;
  const baseSales = attendees * m.base * rankMult(rank) * (1 + state.band.core / 180);
  const demoUnits = m.demo ? Math.round(attendees * clamp(0.08 + state.band.core / 250 + avgRec / 500, .06, .45) * rankMult(rank)) : 0;
  const revenue = Math.round(baseSales + demoUnits * demoPrice);
  return { cost:m.cost, revenue, label:m.label, demoPrice, demoUnits };
}
function shouldCoreFanEvent(rank, expression, heat, tags) { return ["C","D","E"].includes(rank) && (expression > 70 || tags.includes("エモさ") || tags.includes("個性") || heat > 85) && Math.random() < 0.62; }

function applyLiveResult(r, setlist, supports) {
  const b = state.band;
  const fanGainBase = { S:45, A:30, B:18, C:8, D:2, E:0 }[r.rank] || 0;
  const fameGainBase = { S:22, A:14, B:8, C:3, D:1, E:0 }[r.rank] || 0;
  const industryGainBase = { S:24, A:16, B:9, C:2, D:0, E:0 }[r.rank] || 0;
  let fanGain = fanGainBase + Math.round(r.total / 50) + (r.coreEvent ? 3 : 0);
  let fameGain = fameGainBase + (r.revenue.attendees > 50 ? 2 : 0);
  let coreGain = { S:12, A:8, B:5, C:2, D:1, E:0 }[r.rank] || 0;
  let industryGain = industryGainBase + (r.originalCount >= 4 ? 4 : 0) - (state.turn === 30 ? r.coverCount * 2 : 0);
  if (r.coreEvent) { coreGain += 10; fanGain += 2; }
  r.gains = { fans: Math.max(0, fanGain), fame: Math.max(0, fameGain), core: Math.max(0, coreGain), industry: Math.max(0, industryGain), funds: r.revenue.finalProfit };
  b.fans += Math.max(0, fanGain);
  b.fame += Math.max(0, fameGain);
  b.core += Math.max(0, coreGain);
  b.industry += Math.max(0, industryGain);
  b.funds += r.revenue.finalProfit;
  b.trust = clamp(b.trust + ({ S:8, A:5, B:3, C:0, D:-3, E:-6 }[r.rank] || 0), 0, 100);
  b.fatigue = clamp(b.fatigue + 18 + Math.round(avg(setlist.map(s => s.tempo)) / 9) + Math.max(0, activeMembers().length - 4) * 5 - avg(activeMembers().map(m=>m.stats.stamina)) / 16, 0, 100);
  setlist.forEach((song, idx) => growSongAfterLive(song, r.rank, idx + 1, r.coreEvent));
  revealSubGenresAfterLive(r, setlist);
  if (!state.fesInfoKnown && (state.liveCount >= 1 || state.turn >= 12 || b.industry >= 15)) {
    state.fesInfoKnown = true;
    showEventPopup("UNDER FES情報入手", "ライブハウス店長から、選考に必要な最低ラインを聞いた。\nスケジュール帳でフェス条件を確認できるようになった。", "event", "📄");
  }
  activeMembers().filter(m => r.performers.includes(m.id)).forEach(m => growMemberAfterLive(m, r.rank, r.positions[m.id]));
  supports.forEach(s => {
    const key = s.id;
    const old = b.direction[s.genres[0]] || 0;
    state.supportAffinity[key] = (state.supportAffinity[key] || 0) + ({ S:15, A:11, B:7, C:3, D:1, E:0 }[r.rank] || 0) + (old > 20 ? 2 : 0);
  });
  const summary = [
    `【${currentLiveName()} 結果】評価:${r.rank} / 総合:${val(r.total)}`,
    `演奏${val(r.performance)} 表現${val(r.expression)} 熱量${val(r.heat)} 戦略${val(r.strategy)} 安定${val(r.stability)}`,
    `会場:${r.venue.name} / キャパ${r.venue.capacity} / 準備${val(r.prepScore)}${r.venueShortage > 0 ? `（不足${val(r.venueShortage)}）` : ""}`,
    `配置:${r.positionText}`,
    activeMembers().length > 4 ? `大所帯ボーナス：人数で熱量は上がったが、管理コストと事故リスクも増えた。` : "",
    `Vo:${r.vocalistName} / Cho:${r.chorusName} / オリジナル${r.originalCount}曲・コピー${r.coverCount}曲`,
    r.adlib.text !== "なし" ? `センスによるアドリブ:${r.adlib.text}。全体に補正が入った。` : `アドリブ変更は起きなかった。`,
    r.repeatInfo?.hasRepeats ? `${r.repeatInfo.boom ? "同一曲再演ボーナス" : "同一曲再演ペナルティ"}：${r.repeatInfo.text}` : "",
    r.coreEvent ? `ライブ全体は完璧ではなかったが、刺さったコアなファンがいた。コア人気が伸びた。` : "",
    `集客:${r.revenue.attendees}人 / チケット:${r.revenue.ticketRevenue.toLocaleString()}円 / 物販:${r.revenue.merch.revenue.toLocaleString()}円 / デモ単価:${r.revenue.merch.demoPrice ? r.revenue.merch.demoPrice.toLocaleString()+"円" : "なし"}`,
    `会場費:${r.revenue.venueFee.toLocaleString()}円 / サポート代:${r.revenue.supportCost.toLocaleString()}円 / 物販準備:${r.revenue.merch.cost.toLocaleString()}円 / 最終利益:${r.revenue.finalProfit.toLocaleString()}円`
  ].filter(Boolean).join("\n");
  log(summary, "live");
}

function makeLiveResultModal(r, setlist) {
  const title = `${currentLiveName()} 結果`;
  return {
    title,
    rank: r.rank,
    total: val(r.total),
    performance: val(r.performance),
    expression: val(r.expression),
    heat: val(r.heat),
    strategy: val(r.strategy),
    stability: val(r.stability),
    venue: r.venue.name,
    attendees: r.revenue.attendees,
    profit: r.revenue.finalProfit,
    originalCount: r.originalCount,
    coverCount: r.coverCount,
    adlib: r.adlib.text,
    repeatText: r.repeatInfo?.hasRepeats ? r.repeatInfo.text : "なし",
    coreEvent: !!r.coreEvent,
    gains: r.gains || {},
    songs: setlist.map(s => s.title)
  };
}

function revealSubGenresAfterLive(result, setlist) {
  const performers = activeMembers().filter(m => result.performers.includes(m.id));
  performers.forEach(m => {
    setlist.forEach(song => {
      if (song.subGenre) revealSubGenre(m, song.subGenre, "ライブ経験");
    });
  });
}

function growSongAfterLive(liveSong, rank, slot, coreEvent) {
  const s = state.songs.find(x => x.id === liveSong.id);
  if (!s) return;
  s.recognition = clamp(s.recognition + ({ S:8,A:6,B:4,C:2,D:1,E:0 }[rank] || 0) + (coreEvent ? 2 : 0), 0, 99);
  s.performance = clamp(s.performance + (rank === "E" ? 0 : 1), 0, 99);
  s.standardPoints = (s.standardPoints || 0) + 1 + (["S","A","B"].includes(rank) ? 1 : 0) + ((slot === 1 || slot === 5) && ["S","A","B"].includes(rank) ? 1 : 0);
  if (s.standardPoints >= 5 && !hasTag(s,"定番")) { s.tags.push("定番"); log(`${s.title}がライブ定番曲になった。`); }
  if ((s.recognition >= 50 && s.standardPoints >= 5 && (s.lyrics >= 60 || s.catchy >= 60)) && !hasTag(s,"代表曲候補")) { s.tags.push("代表曲候補"); log(`${s.title}が代表曲候補になった。`); }
}

function growMemberAfterLive(m, rank, role) {
  const gain = { S:3, A:2, B:1, C:1, D:0, E:0 }[rank] || 0;
  m.stats.mental = clamp(m.stats.mental + gain, 1, 99);
  m.stats.charisma = clamp(m.stats.charisma + (rank === "S" ? 2 : rank === "A" ? 1 : 0), 1, 99);
  const inst = m.instruments[role] || m.instruments[m.mainInstrument];
  if (inst) inst.lv = clamp(inst.lv + gain * (inst.growth || 1), 1, inst.potentialCap || inst.cap);
  maybeUnlockHidden(m, "ライブ経験");
}

function renderEnding() {
  const b = state.band;
  const final = state.liveResultHistory[state.liveResultHistory.length - 1];
  const originals = state.songs.filter(s => !s.isCover).length;
  let title = "まだ地下にいる";
  let body = "UNDER FES出演オファーは届かなかった。でも、次のライブの誘いはある。ここで終わりではない。";
  let tier = "条件未達";
  const minimum = final && ["B","A","S"].includes(final.rank) && b.fans >= 60 && b.fame >= 60 && b.industry >= 55 && originals >= 5;
  const attention = final && ["A","S"].includes(final.rank) && b.fans >= 75 && b.fame >= 75 && b.industry >= 70 && state.songs.some(s=>hasTag(s,"代表曲候補")) && originals >= 6;
  const huge = final && final.rank === "S" && final.total >= 80 && b.fans >= 85 && b.fame >= 85 && b.industry >= 80 && state.songs.some(s=>hasTag(s,"代表曲候補")) && final.originalCount === 5;
  if (minimum) { title = "UNDER FES 小ステージ出演"; tier = "Bオファー"; body = "タイムテーブルの端に、自分たちの名前が載った。小さなステージでも、地下から外へ出る最初の一歩だ。"; }
  if (attention) { title = "UNDER FES 注目枠オファー"; tier = "Aオファー"; body = "資料の端に「注目枠」と書かれていた。まだ誰も知らない。でも、誰かが見つけようとしている。"; }
  if (huge) { title = "UNDER FES 大抜擢オファー"; tier = "Sオファー"; body = "出演決定。それだけじゃない。想定より大きいステージで、と連絡が来た。地下から、少しだけ朝が見えた。"; }
  app.innerHTML = `<div class="app-shell"><div class="hero"><h1>${title}</h1><p>${body}</p></div><div class="grid"><div class="card"><h2>最終結果：${tier}</h2><div class="kv"><b>ファン</b><span>${b.fans}人</span><b>知名度</b><span>${b.fame}</span><b>業界評価</b><span>${b.industry}</span><b>オリジナル曲</b><span>${originals}曲</span><b>資金</b><span>${b.funds.toLocaleString()}円</span><b>最終ライブ</b><span>${final ? final.rank + " / " + val(final.total) : "なし"}</span></div><button id="restartBtn" style="margin-top:14px;">もう一度はじめる</button></div><div class="card"><h2>ログ</h2><div class="log">${state.logs.slice(0, 90).map(l => `<div class="log-line">${escapeHtml(l)}</div>`).join("")}</div></div></div></div>`;
  document.getElementById("restartBtn").addEventListener("click", () => { state = createInitialState(); saveGame(false); render(); });
}

render();
