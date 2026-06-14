/*
  アンダーグラウンド（仮） v0.3.30 prototype
  - 1ファイル内の DATA を差し替えるだけでキャラ・曲・サポート候補を変更できます。
  - Deferred replacements: 下部の DEFERRED_REPLACEMENTS に、今回簡略化した候補をまとめています。
*/

const VERSION = "v0.3.30";

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
  { name: "トラップ", parent: "ヒップホップ", unlockTurn: 11, rarity: "common" },
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

const THEMES = ["---", "恋愛", "失恋", "友情", "応援", "日常", "青春", "反抗", "孤独", "自分", "居場所"];
const MID_THEMES = ["焦燥感", "劣等感", "怒り", "再出発", "生き方", "個性"];
const LATE_THEMES = ["喪失", "祈り", "破壊", "覚醒", "反権力", "救済"];
function availableThemes() {
  return [
    ...THEMES,
    ...((state?.turn || 1) >= 11 ? MID_THEMES : []),
    ...((state?.turn || 1) >= 21 ? LATE_THEMES : [])
  ];
}

const KEYWORD_SUGGESTIONS = [
  "夜", "夢", "雨", "終電", "屋上", "コンビニ", "街", "高架下", "ノイズ", "blue", "run away", "still alive",
  "午前二時", "改札", "路地裏", "駅前", "踏切", "自転車", "イヤホン", "缶コーヒー", "制服", "放課後", "帰り道", "月明かり",
  "朝焼け", "夕立", "空っぽ", "約束", "透明", "心臓", "叫び", "火花", "サイレン", "ネオン", "地下室", "ガレージ",
  "アンプ", "ピック", "リフ", "BPM", "フィードバック", "割れたスピーカー", "手拍子", "汗", "スポットライト", "ステージ袖", "客席", "アンコール",
  "もう一回", "名前を呼んで", "逃げない", "まだ鳴ってる", "壊して", "抱きしめて", "忘れない", "言えなかった", "誰でもない", "ここにいる",
  "青春", "反抗", "孤独", "居場所", "焦燥", "劣等感", "祈り", "救済", "覚醒", "革命", "ノーフューチャー", "光"
];
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
  { word:"爆音", tags:["爆発力","ライブ","反抗"], themes:["反抗"], add:{performance:3} },
  { word:"夢", tags:["希望","青春","自分"], themes:["応援","青春","自分"], add:{catchy:2} },
  { word:"屋上", tags:["青春","孤独","空"], themes:["青春","孤独"], add:{lyrics:2} },
  { word:"改札", tags:["日常","別れ","焦燥感"], themes:["失恋","日常"], add:{lyrics:2} },
  { word:"路地裏", tags:["反抗","孤独","コア向け"], themes:["反抗","孤独"], add:{performance:2} },
  { word:"踏切", tags:["焦燥感","日常","余韻"], themes:["日常","焦燥感"], add:{lyrics:2} },
  { word:"自転車", tags:["青春","疾走感","日常"], themes:["青春","日常"], add:{tempo:2} },
  { word:"イヤホン", tags:["日常","孤独","音楽"], themes:["日常","孤独"], add:{lyrics:2} },
  { word:"缶コーヒー", tags:["日常","夜","疲労感"], themes:["日常","焦燥感"], add:{lyrics:2} },
  { word:"制服", tags:["青春","劣等感","日常"], themes:["青春","劣等感"], add:{lyrics:2} },
  { word:"放課後", tags:["青春","友情","居場所"], themes:["青春","友情","居場所"], add:{catchy:2} },
  { word:"帰り道", tags:["日常","余韻","友情"], themes:["日常","友情"], add:{lyrics:2} },
  { word:"朝焼け", tags:["希望","再出発","透明感"], themes:["応援","再出発","救済"], add:{lyrics:3} },
  { word:"夕立", tags:["失恋","青春","透明感"], themes:["失恋","青春"], add:{lyrics:2} },
  { word:"空っぽ", tags:["孤独","劣等感","余韻"], themes:["孤独","劣等感"], add:{lyrics:3} },
  { word:"約束", tags:["友情","恋愛","祈り"], themes:["友情","恋愛","祈り"], add:{lyrics:2} },
  { word:"透明", tags:["透明感","孤独","余韻"], themes:["孤独","喪失"], add:{lyrics:3} },
  { word:"心臓", tags:["爆発力","焦燥感","ライブ"], themes:["焦燥感","覚醒"], add:{tempo:2} },
  { word:"叫び", tags:["反抗","爆発力","コア向け"], themes:["反抗","怒り"], add:{performance:3} },
  { word:"火花", tags:["爆発力","覚醒","ライブ"], themes:["覚醒","反抗"], add:{performance:2} },
  { word:"サイレン", tags:["焦燥感","反抗","コア向け"], themes:["焦燥感","怒り"], add:{tempo:2} },
  { word:"ネオン", tags:["夜","街","透明感"], themes:["日常","孤独"], add:{trend:2} },
  { word:"地下室", tags:["バンド感","コア向け","反抗"], themes:["居場所","反抗"], add:{performance:2} },
  { word:"ガレージ", tags:["バンド感","青春","ライブ"], themes:["青春","居場所"], add:{performance:2} },
  { word:"アンプ", tags:["バンド感","爆発力","ライブ"], themes:["反抗","個性"], add:{performance:2} },
  { word:"ピック", tags:["バンド感","日常","青春"], themes:["青春","日常"], add:{performance:1} },
  { word:"リフ", tags:["バンド感","爆発力","疾走感"], themes:["個性","反抗"], add:{performance:3} },
  { word:"BPM", tags:["疾走感","焦燥感","ライブ"], themes:["焦燥感","覚醒"], add:{tempo:3} },
  { word:"フィードバック", tags:["ノイズ","コア向け","反抗"], themes:["反抗","個性"], add:{performance:3} },
  { word:"割れたスピーカー", tags:["爆発力","コア向け","反抗"], themes:["反抗","破壊"], add:{performance:3} },
  { word:"手拍子", tags:["ライブ","客受け","友情"], themes:["応援","友情"], add:{catchy:2} },
  { word:"汗", tags:["ライブ","青春","熱量"], themes:["青春","応援"], add:{performance:2} },
  { word:"スポットライト", tags:["ライブ","覚醒","希望"], themes:["覚醒","自分"], add:{trend:2} },
  { word:"ステージ袖", tags:["ライブ","焦燥感","祈り"], themes:["焦燥感","祈り"], add:{lyrics:2} },
  { word:"客席", tags:["ライブ","居場所","友情"], themes:["居場所","友情"], add:{catchy:2} },
  { word:"アンコール", tags:["ライブ","希望","客受け"], themes:["応援","救済"], add:{catchy:3} },
  { word:"もう一回", tags:["希望","再出発","ライブ"], themes:["応援","再出発"], add:{catchy:2} },
  { word:"名前を呼んで", tags:["恋愛","孤独","祈り"], themes:["恋愛","孤独","祈り"], add:{lyrics:3} },
  { word:"逃げない", tags:["自分","反抗","希望"], themes:["自分","反抗","覚醒"], add:{lyrics:3} },
  { word:"まだ鳴ってる", tags:["余韻","バンド感","希望"], themes:["自分","救済"], add:{lyrics:3} },
  { word:"壊して", tags:["破壊","反抗","爆発力"], themes:["破壊","反抗"], add:{performance:3} },
  { word:"抱きしめて", tags:["恋愛","救済","余韻"], themes:["恋愛","救済"], add:{lyrics:3} },
  { word:"忘れない", tags:["喪失","友情","祈り"], themes:["喪失","友情","祈り"], add:{lyrics:3} },
  { word:"言えなかった", tags:["失恋","孤独","余韻"], themes:["失恋","孤独"], add:{lyrics:3} },
  { word:"誰でもない", tags:["自分","個性","孤独"], themes:["自分","個性"], add:{lyrics:3} },
  { word:"ここにいる", tags:["居場所","救済","希望"], themes:["居場所","救済","自分"], add:{lyrics:3} },
  { word:"青春", tags:["青春","疾走感","友情"], themes:["青春","友情"], add:{catchy:2} },
  { word:"反抗", tags:["反抗","爆発力","コア向け"], themes:["反抗","怒り"], add:{performance:2} },
  { word:"孤独", tags:["孤独","余韻","夜"], themes:["孤独"], add:{lyrics:2} },
  { word:"居場所", tags:["居場所","友情","救済"], themes:["居場所","友情"], add:{lyrics:2} },
  { word:"焦燥", tags:["焦燥感","疾走感","夜"], themes:["焦燥感"], add:{tempo:2} },
  { word:"劣等感", tags:["劣等感","反抗","自分"], themes:["劣等感","自分"], add:{lyrics:3} },
  { word:"祈り", tags:["祈り","救済","余韻"], themes:["祈り","救済"], add:{lyrics:2} },
  { word:"救済", tags:["救済","希望","祈り"], themes:["救済","祈り"], add:{lyrics:3} },
  { word:"覚醒", tags:["覚醒","爆発力","希望"], themes:["覚醒"], add:{performance:2} },
  { word:"革命", tags:["反抗","爆発力","反権力"], themes:["反権力","反抗"], add:{performance:3} },
  { word:"ノーフューチャー", tags:["反抗","破壊","コア向け"], themes:["反抗","破壊"], add:{performance:3} },
  { word:"光", tags:["希望","救済","透明感"], themes:["応援","救済"], add:{lyrics:2} }
];

const ARRANGES = ["疾走ビート", "轟音ギター", "静かなイントロ", "ツインギター", "シンセ厚め", "ベース主導", "ドラム爆発", "DJミックス", "コーラス重視", "ピアノ主導"];
const EQUIPMENT_DATA = [
  { id:"strat", name:"ストラトキャスター", category:"ギター", desc:"バランス型。キャッチー・演奏に少し効く。", effects:{ performance:1.2, catchy:1.2 } },
  { id:"tele", name:"テレキャスター", category:"ギター", desc:"歯切れの良い音。パンク/ポップの輪郭を出す。", effects:{ performance:1.1, tempo:1.0, strategy:0.8 } },
  { id:"lespaul", name:"レスポール", category:"ギター", desc:"太い音。ロック/メタルの熱量に強い。", effects:{ performance:1.4, heat:1.0 } },
  { id:"sg", name:"SG", category:"ギター", desc:"荒く勢いのある音。ハードコア/メタル向き。", effects:{ heat:1.4, tempo:0.8 } },
  { id:"prs", name:"PRS", category:"ギター", desc:"高性能万能型。高額だが演奏と安定に効く。", effects:{ performance:1.3, stability:1.0 } },
  { id:"acoustic", name:"アコースティックギター", category:"ギター", desc:"歌詞・表現寄り。静かな曲や余韻に強い。", effects:{ expression:1.4, lyrics:1.0 } },
  { id:"guitar_amp", name:"ギターアンプ", category:"機材", desc:"ギターの音圧。演奏点と熱量に効く。", effects:{ performance:1.6, heat:1.0 } },
  { id:"bass_amp", name:"ベースアンプ", category:"機材", desc:"低音の支え。安定とグルーヴに効く。", effects:{ stability:1.4, performance:0.8 } },
  { id:"drum_set", name:"ドラムセット", category:"機材", desc:"ライブの土台。テンポ・熱量・安定に効く。", effects:{ tempo:1.2, heat:1.2, stability:0.8 } },
  { id:"microphone", name:"マイク", category:"機材", desc:"歌とMCの抜け。表現点とファン増加に効く。", effects:{ expression:1.4, fans:0.6 } },
  { id:"pa", name:"PA機材", category:"機材", desc:"大きい会場ほど重要。準備不足ペナルティを軽くする。", effects:{ stability:1.6, prep:2.0 } },
  { id:"effecter", name:"エフェクター", category:"機材", desc:"音作り。個性・演奏・表現を底上げする。", effects:{ performance:1.0, expression:1.0, strategy:0.8 } },
  { id:"recording", name:"レコーディング機材", category:"機材", desc:"曲作り向き。曲完成時の認知/流行に少し効く。", effects:{ trend:1.2, recognition:1.0 } },
  { id:"merch_booth", name:"物販ブース", category:"機材", desc:"物販の売れやすさに効く。", effects:{ merch:2.0 } },
  { id:"van", name:"移動車", category:"機材", desc:"大所帯の維持費と疲労を少し抑える。", effects:{ upkeep:-0.05, fatigue:-0.6 } }
];
const SKILL_DATA = [
  { id:"practice_efficiency", name:"効率練習", rarity:"通常", desc:"練習のステータス上昇が20%アップ。", condition:"練習3回" },
  { id:"setlist_sense", name:"セットリスト感覚", rarity:"通常", desc:"セトリボーナスが少し伸び、ライブ準備ヒントが詳しくなる。", condition:"ライブ3回 or セトリボーナス発生" },
  { id:"mc_master", name:"MC上手", rarity:"通常", desc:"ライブの表現点とファン増加が少し上がる。", condition:"ライブ2回＋ファン30人" },
  { id:"saving_master", name:"節約上手", rarity:"通常", desc:"会場費・ショップ・機材費が5%軽くなる。", condition:"バイト2回 or 資金が一度少なくなる" },
  { id:"merch_master", name:"物販の工夫", rarity:"通常", desc:"物販の売れやすさと買い取り条件が少し良くなる。", condition:"物販売上が一定以上" },
  { id:"midnight_inspiration", name:"深夜のひらめき", rarity:"通常", desc:"疲労が高い時、ひらめき獲得率と作詞/作曲の個性が上がる。", condition:"疲労70%以上で曲作り/会話" },
  { id:"dual_songcraft", name:"一気呵成", rarity:"レア", desc:"作詞/作曲の疲労がさらに軽くなり、未完成曲を仕上げやすい。", condition:"作詞Lv・作曲Lvが高い状態で曲完成" },
  { id:"self_management", name:"段取り上手", rarity:"レア", desc:"一通りの行動を経験後、行動・曲作り・ライブ後行動の疲労増加が0.8倍になる。", condition:"練習/休憩/バイト/募集/宣伝/会話/曲作り/ライブを各1回" },
  { id:"sns_master", name:"SNS上手", rarity:"通常", desc:"SNS投稿に慣れ、宣伝コマンドの知名度・招待率効果が上がる。", condition:"SNS投稿10件" },
  { id:"shortcut_command", name:"段取りの鬼", rarity:"レア", desc:"練習・宣伝の疲労が少し減り、後半の作業負担を軽くする。", condition:"35ターン以降に複数行動を積み重ねる" }
];
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
  let subChance = isGoodMainCombo(a,b) ? 0.52 : hasDerived ? 0.34 : 0;
  let rareChance = hasDerived ? 0.06 : 0;
  const st = arrange ? arrangeStatus(arrange) : { multiplier:0 };
  if (arrange && st.multiplier > 0) {
    subChance += 0.16 * st.multiplier;
    rareChance += 0.04 * st.multiplier;
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
    .filter(n => { const sg = unlockedSubGenreByName(n, arrange); return sg && sg.rarity === "rare"; });
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

const LIVE_TYPES = {
  self_one_man: { label:"自主企画：ワンマン", short:"ワンマン", category:"自主企画", desc:"会場費は自己負担。集客は自分たちだけ。成功時の報酬と成長が大きいが、空席が目立つと大きく減点。", feeLabel:"会場費", risk:"最高", growth:1.45, reward:1.22, inviteBoost:0, relation:0, booking:false },
  self_taiban: { label:"自主企画：対バン企画", short:"対バン企画", category:"自主企画", desc:"2〜4バンドを呼ぶ。集客は安定するが、他バンド目当て分の報酬は引かれる。交流が深まる。", feeLabel:"会場費", risk:"中", growth:1.12, reward:0.90, inviteBoost:0.12, relation:8, booking:false },
  booking_house: { label:"ブッキング：ライブハウスイベント", short:"ハウスイベント", category:"ブッキング", desc:"ライブハウスからのイベント通知。会場費なし、参加費あり。様々なバンドと出会える。", feeLabel:"参加費", risk:"低", growth:0.88, reward:0.72, inviteBoost:0.08, relation:5, booking:true },
  booking_band: { label:"ブッキング：他バンド企画", short:"他バンド企画", category:"ブッキング", desc:"認知度や交流で呼ばれる企画。会場費なし、企画参加費あり。交流が伸びやすい。", feeLabel:"企画参加費", risk:"低", growth:0.96, reward:0.78, inviteBoost:0.16, relation:10, booking:true },
  special: { label:"固定ライブ", short:"固定", category:"固定", desc:"物語上の固定ライブ。", feeLabel:"会場費", risk:"特", growth:1.0, reward:1.0, inviteBoost:0, relation:0, booking:false }
};

const RIVAL_BANDS = [
  { id:"paper_moon", name:"Paper Moon Kids", fame:18, audience:18, genre:"青春パンク", level:1, mood:"面倒見がいい若手バンド" },
  { id:"garage_soda", name:"Garage Soda", fame:20, audience:16, genre:"ガレージロック", level:1, mood:"近所の小箱でよく会う荒削りな同期" },
  { id:"mikan_cassette", name:"みかんカセット", fame:22, audience:19, genre:"ギターポップ", level:1, mood:"ゆるいMCと人懐っこさでつながりやすい" },
  { id:"silver_bicycle", name:"Silver Bicycle", fame:25, audience:21, genre:"パワーポップ", level:1, mood:"フットワークが軽い週末バンド" },

  { id:"neon_cider", name:"Neon Cider", fame:28, audience:26, genre:"ポップパンク", level:2, mood:"明るく客を連れてくる対バン常連" },
  { id:"rainy_shortcake", name:"Rainy Shortcake", fame:33, audience:30, genre:"バラードポップ", level:2, mood:"女性客が多く、終演後の評判も丁寧" },
  { id:"lowpass_radio", name:"Lowpass Radio", fame:36, audience:33, genre:"エレクトロロック", level:2, mood:"SNS告知がうまい宅録上がりのユニット" },
  { id:"the_last_bus", name:"The Last Bus", fame:39, audience:35, genre:"メロディックパンク", level:2, mood:"終電ギリギリまで熱量で押すライブバンド" },

  { id:"iron_laundry", name:"Iron Laundry", fame:42, audience:36, genre:"オルタナロック", level:3, mood:"ライブハウス評価が高い中堅" },
  { id:"subway_ghosts", name:"Subway Ghosts", fame:47, audience:42, genre:"シューゲイザー", level:3, mood:"音作りにこだわる浮遊感のあるバンド" },
  { id:"karakuri_beats", name:"カラクリビーツ", fame:50, audience:45, genre:"ミクスチャー", level:3, mood:"DJとラップを混ぜる変化球枠" },
  { id:"north_motel", name:"North Motel", fame:52, audience:46, genre:"エモ", level:3, mood:"地方ツアー帰りで現場慣れしている" },

  { id:"after_school_noise", name:"After School Noise", fame:54, audience:48, genre:"メロディックパンク", level:4, mood:"動員力のある格上バンド" },
  { id:"plastic_riot", name:"Plastic Riot", fame:61, audience:55, genre:"パンク", level:4, mood:"客席を一気に巻き込む攻撃的なステージ" },
  { id:"hollow_apartment", name:"Hollow Apartment", fame:66, audience:60, genre:"ポストロック", level:4, mood:"業界スタッフにも少し名前が届いている" },
  { id:"tokyo_firefly", name:"Tokyo Firefly", fame:69, audience:63, genre:"シティポップ", level:4, mood:"洒落た曲と安定した集客力がある" },

  { id:"blue_terminal", name:"Blue Terminal", fame:72, audience:68, genre:"エモ", level:5, mood:"今かなり呼びにくい有名バンド" },
  { id:"melted_siren", name:"Melted Siren", fame:82, audience:76, genre:"ポストハードコア", level:5, mood:"熱狂的なファンを抱える準強豪" },
  { id:"starless_line", name:"Starless Line", fame:88, audience:84, genre:"プログレ", level:6, mood:"演奏力で黙らせるフェス常連候補" },
  { id:"zero_signal", name:"ZERO SIGNAL", fame:95, audience:92, genre:"ポストハードコア", level:6, mood:"業界評価も高い強豪" }
];

const MERCH_ITEMS = [
  { id:"sticker", name:"ステッカー", cost:250, price:300, best:["友人・身内多め", "地下ライブ常連", "初見客多め"], desc:"安くて手に取りやすい。小箱・初見客・序盤向き。" },
  { id:"badge", name:"缶バッジ", cost:400, price:500, best:["友人・身内多め", "地下ライブ常連"], desc:"常連が買いやすい小物。熱量が高いライブで売れやすい。" },
  { id:"rubberband", name:"ラバーバンド", cost:550, price:700, best:["地下ライブ常連", "フェス審査・外部客"], desc:"ライブキッズ向き。パンク/ハードコア/メタル系の客層と相性○。" },
  { id:"towel", name:"タオル", cost:1600, price:2000, best:["初見客多め", "フェス審査・外部客"], desc:"キャパが大きい会場ほど売れやすい定番グッズ。" },
  { id:"tshirt", name:"Ｔシャツ", cost:2500, price:3000, best:["フェス審査・外部客", "地下ライブ常連"], desc:"高コストだが伸びると強い。中箱以上や人気上昇後向き。" },
  { id:"totebag", name:"トートバッグ", cost:2000, price:2500, best:["初見客多め", "通常客層"], desc:"ポップ/エモ/シティ寄りの客層で売れやすい。" },
  { id:"longt", name:"ロングTシャツ", cost:2500, price:3000, best:["地下ライブ常連", "フェス審査・外部客"], desc:"コアファン向き。秋冬・常連・重めジャンルで強い。" },
  { id:"bucket", name:"バケットハット", cost:3000, price:3500, best:["初見客多め", "フェス審査・外部客"], desc:"流行・フェス客向き。知名度が上がってから強い。" },
  { id:"coach", name:"コーチジャケット", cost:4000, price:5000, best:["フェス審査・外部客", "地下ライブ常連"], desc:"高額グッズ。キャパ大・コア人気・高評価ライブ向き。" },
  { id:"demo", name:"デモ音源", cost:1500, price:2000, best:["地下ライブ常連", "友人・身内多め"], desc:"コア人気や代表曲候補があると売れやすい。" },
  { id:"keyholder", name:"キーホルダー", cost:800, price:1000, best:["友人・身内多め", "初見客多め"], desc:"軽く買いやすい。小箱でも中箱でも安定。" }
];

function venueById(id) {
  return VENUES.find(v => v.id === id) || VENUES[0];
}
function fixedLiveEvent(turn, id, label, fixed=true) {
  const v = venueById(id);
  return { turn, venueId:id, label, fixed, booked:true, cancelled:false, name:label, capacity:v.capacity, fee:v.fee, prepNeed:v.prepNeed, liveType:"special" };
}

function liveTypeMeta(typeOrEvent) {
  const type = typeof typeOrEvent === "string" ? typeOrEvent : (typeOrEvent?.liveType || (typeOrEvent?.fixed ? "special" : "self_one_man"));
  return LIVE_TYPES[type] || LIVE_TYPES.self_one_man;
}
function liveTypeLabel(ev) { return liveTypeMeta(ev).label; }
function rivalById(id) { return RIVAL_BANDS.find(b => b.id === id) || null; }
function relationshipWithBand(id) {
  if (!state.rivalRelations || typeof state.rivalRelations !== "object") state.rivalRelations = {};
  return Number(state.rivalRelations[id] || 0);
}
function setRelationshipWithBand(id, value) {
  if (!id) return;
  if (!state.rivalRelations || typeof state.rivalRelations !== "object") state.rivalRelations = {};
  state.rivalRelations[id] = clamp(Math.round(value), -100, 100);
}
function availableRivalBands(limit=99) {
  const power = popularity() + Number(state.band?.industry || 0) * 0.7 + Number(state.band?.trust || 0);
  const pool = RIVAL_BANDS
    .filter(b => relationshipWithBand(b.id) > -25 && (b.fame <= power + 55 || relationshipWithBand(b.id) >= 20))
    .sort((a,b) => a.level - b.level || a.fame - b.fame);
  return pool.slice(0, limit);
}
function pickRivalBands(count=2) {
  const power = popularity() + Number(state.band?.industry || 0) * 0.7 + Number(state.band?.trust || 0);
  const pool = availableRivalBands(20).filter(b => b.fame <= power + 45 || relationshipWithBand(b.id) >= 12 || b.level <= 2);
  const picked = [];
  const copy = pool.length ? pool.slice() : availableRivalBands(20).slice(0, 6);
  while (copy.length && picked.length < count) {
    const weights = copy.map(b => Math.max(1, 40 - b.level * 4 + relationshipWithBand(b.id) * 0.35 - Math.max(0, b.fame - power) * 0.18));
    const total = sum(weights);
    let roll = Math.random() * total;
    let idx = 0;
    for (; idx < weights.length; idx++) { roll -= weights[idx]; if (roll <= 0) break; }
    picked.push(copy.splice(Math.min(idx, copy.length - 1), 1)[0]);
  }
  return picked;
}
function rivalBandExposureBonus(bands) {
  const list = (bands || []).filter(Boolean);
  if (!list.length) return 0;
  return clamp(Math.round(avg(list.map(b => b.level || 1))), 1, 6);
}
function invitedBandsForEvent(ev) {
  const ids = Array.isArray(ev?.invitedBandIds) ? ev.invitedBandIds : [];
  return ids.map(rivalById).filter(Boolean);
}
function eventPartnerAudience(ev) { return sum(invitedBandsForEvent(ev).map(b => b.audience + Math.round(relationshipWithBand(b.id) / 8))); }
function eventEntryFee(ev, venue) {
  const type = ev?.liveType || "self_one_man";
  if (type === "booking_house") return Math.max(1500, Math.round((venue?.fee || 6000) * 0.35));
  if (type === "booking_band") return Math.max(2000, Math.round((venue?.fee || 6000) * 0.28));
  return 0;
}
function eventBaseCost(ev, venue) {
  const type = ev?.liveType || "self_one_man";
  if (type === "booking_house" || type === "booking_band") return eventEntryFee(ev, venue);
  return venue?.fee || 0;
}
function liveEventTitle(ev) {
  if (!ev) return "ライブ";
  const v = venueById(ev.venueId);
  return `${liveTypeMeta(ev).short} / ${v.name}`;
}
function liveDiagnosticsPush(title, data={}) {
  state.liveDiagnostics = Array.isArray(state.liveDiagnostics) ? state.liveDiagnostics : [];
  state.liveDiagnostics.unshift({ turn: state.turn, title, data, at: new Date().toLocaleString() });
  state.liveDiagnostics = state.liveDiagnostics.slice(0, 20);
}
function addMail(subject, body, kind="info", payload={}) {
  state.phoneMails = Array.isArray(state.phoneMails) ? state.phoneMails : [];
  const id = payload.id || `mail_${Date.now()}_${Math.floor(Math.random()*9999)}`;
  const sender = payload.sender || mailSenderForKind(kind);
  state.phoneMails.unshift({ id, turn: state.turn, subject, sender, body, kind, read:false, payload });
  state.phoneMails = state.phoneMails.slice(0, 60);
  return id;
}
function mailSenderForKind(kind="info") {
  return ({ live_offer:"ライブハウス受付", fan_mail:"ファンメール", member:"連絡先交換相手", info:"携帯通知", warn:"携帯通知" }[kind] || "携帯通知");
}
function addSnsPost(author, body, mood="normal") {
  state.snsPosts = Array.isArray(state.snsPosts) ? state.snsPosts : [];
  state.snsPosts.unshift({ id:`sns_${Date.now()}_${Math.floor(Math.random()*9999)}`, turn: state.turn, author, body, mood });
  state.snsPosts = state.snsPosts.slice(0, 50);
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
    { id: "cover_01", title: "コピー曲：定番ロック", isCover: true, catchy: 24, tempo: 23, mainGenre: "ロック", subGenre: "ギターロック", genre: "ギターロック", recognition: 17, lyrics: 14, performance: 22, trend: 12, tags: ["客受け"] },
    { id: "cover_02", title: "コピー曲：疾走パンク", isCover: true, catchy: 22, tempo: 28, mainGenre: "パンク", subGenre: "青春パンク", genre: "青春パンク", recognition: 15, lyrics: 12, performance: 21, trend: 11, tags: ["疾走感"] },
    { id: "cover_03", title: "コピー曲：夜のオルタナロック", isCover: true, catchy: 17, tempo: 16, mainGenre: "ロック", subGenre: "オルタナロック", genre: "オルタナロック", recognition: 14, lyrics: 23, performance: 19, trend: 10, tags: ["余韻"] },
    { id: "cover_04", title: "コピー曲：フェス向けギターポップ", isCover: true, catchy: 27, tempo: 22, mainGenre: "ポップ", subGenre: "ギターポップ", genre: "ギターポップ", recognition: 18, lyrics: 13, performance: 19, trend: 16, tags: ["客受け"] },
    { id: "cover_05", title: "コピー曲：重低音ラップロック", isCover: true, catchy: 19, tempo: 25, mainGenre: "ヒップホップ", subGenre: "ラップロック", genre: "ラップロック", recognition: 12, lyrics: 11, performance: 22, trend: 13, tags: ["個性"] }
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


// v0.3.10: プレイテスト反映。各パート3人以上を目標に候補メンバーを大幅追加。
// ユーザー指定キャラを優先し、足りないDJ/シンセ枠のみ補完。
DATA.candidateCharacters.push(
  {
    id: "southport",
    name: "サウスポート（仮）",
    part: "Vo/Pf",
    mainInstrument: "vocal",
    mainGenre: "パンク",
    secondMainGenres: ["ポップ", "クラシック"],
    subGenres: ["青春パンク", "ピアノロック", "ポップパンク"],
    weakMainGenres: ["メタル"],
    weakSubGenres: ["メタルコア", "スクリーモ"],
    stats: { stamina: 36, technique: 52, knowledge: 58, sense: 66, mental: 44, teamwork: 48, rhythm: 50, charisma: 60 },
    instruments: {
      vocal: { mark:"◎", lv:64, cap:88, potentialCap:96, growth:1.12 },
      key: { mark:"◎", lv:68, cap:90, potentialCap:98, growth:1.12 },
      chorus: { mark:"○", lv:50, cap:76, potentialCap:90, growth:.95 },
      guitar: { mark:"△", lv:24, cap:52, potentialCap:72, growth:.7 }
    },
    joinDifficulty: "中〜高",
    replaceNote: "ユーザー指定。ボーカル兼ピアノ。パンクに繊細なイントロやピアノロックを混ぜる作曲型。"
  },
  {
    id: "tetra",
    name: "テトラ（仮）",
    part: "Ba",
    mainInstrument: "bass",
    mainGenre: "エモ",
    secondMainGenres: ["オルタナ", "ポップ"],
    subGenres: ["ポストロック", "ギターポップ", "メロディックパンク"],
    weakMainGenres: ["メタル"],
    weakSubGenres: ["スピードメタル", "スクリーモ"],
    stats: { stamina: 48, technique: 56, knowledge: 54, sense: 62, mental: 52, teamwork: 64, rhythm: 66, charisma: 30 },
    instruments: {
      bass: { mark:"◎", lv:70, cap:92, potentialCap:98, growth:1.12 },
      chorus: { mark:"○", lv:42, cap:70, potentialCap:84, growth:.9 },
      guitar: { mark:"△", lv:26, cap:54, potentialCap:78, growth:.72 },
      key: { mark:"△", lv:28, cap:56, potentialCap:82, growth:.75, hiddenUpgrade:true }
    },
    joinDifficulty: "中",
    replaceNote: "ユーザー指定。エモ寄りベース。リズムと協調性が高く、余韻のある曲に強い。"
  },
  {
    id: "jetty",
    name: "ジェッティ（仮）",
    part: "Gt",
    mainInstrument: "guitar",
    mainGenre: "メタル",
    secondMainGenres: ["ロック", "ミクスチャー"],
    subGenres: ["ヘヴィメタル", "スピードメタル", "ニューメタル"],
    weakMainGenres: ["ポップ"],
    weakSubGenres: ["シティポップ", "バラードポップ"],
    stats: { stamina: 60, technique: 74, knowledge: 44, sense: 42, mental: 50, teamwork: 30, rhythm: 54, charisma: 44 },
    instruments: {
      guitar: { mark:"◎", lv:76, cap:94, potentialCap:99, growth:1.16 },
      bass: { mark:"○", lv:44, cap:74, potentialCap:86, growth:.92 },
      chorus: { mark:"△", lv:20, cap:46, potentialCap:60, growth:.65 },
      vocal: { mark:"△", lv:22, cap:50, potentialCap:66, growth:.68 }
    },
    joinDifficulty: "高",
    replaceNote: "ユーザー指定。メタルギター特化。演奏点と難曲化に強いが、協調性は低め。"
  },
  {
    id: "bank",
    name: "バンク（仮）",
    part: "Dr",
    mainInstrument: "drum",
    mainGenre: "パンク",
    secondMainGenres: ["ロック", "メタル"],
    subGenres: ["メロディックパンク", "ハードコア", "メタルコア"],
    weakMainGenres: ["クラシック"],
    weakSubGenres: ["室内楽風", "シティポップ"],
    stats: { stamina: 70, technique: 52, knowledge: 30, sense: 44, mental: 58, teamwork: 46, rhythm: 74, charisma: 42 },
    instruments: {
      drum: { mark:"◎", lv:74, cap:94, potentialCap:99, growth:1.18 },
      chorus: { mark:"△", lv:26, cap:52, potentialCap:66, growth:.7 },
      bass: { mark:"△", lv:30, cap:56, potentialCap:74, growth:.75 },
      guitar: { mark:"△", lv:24, cap:50, potentialCap:64, growth:.68 }
    },
    joinDifficulty: "中",
    replaceNote: "ユーザー指定。メロコア系ドラム。疾走ビートとライブ熱量を安定して支える。"
  },
  {
    id: "clio",
    name: "クリオ（仮）",
    part: "Vo/Gt",
    mainInstrument: "vocal",
    mainGenre: "パンク",
    secondMainGenres: ["ロック", "エモ"],
    subGenres: ["ポップパンク", "青春パンク", "オルタナロック"],
    weakMainGenres: ["ジャズ"],
    weakSubGenres: ["フュージョン", "シンフォニック"],
    stats: { stamina: 54, technique: 42, knowledge: 34, sense: 58, mental: 64, teamwork: 38, rhythm: 46, charisma: 70 },
    instruments: {
      vocal: { mark:"◎", lv:70, cap:92, potentialCap:99, growth:1.15 },
      guitar: { mark:"○", lv:54, cap:80, potentialCap:92, growth:1.0 },
      chorus: { mark:"○", lv:46, cap:74, potentialCap:86, growth:.9 },
      drum: { mark:"△", lv:20, cap:44, potentialCap:60, growth:.65 }
    },
    joinDifficulty: "中",
    replaceNote: "ユーザー指定。ボーカル/ギターのパンク顔役。カリスマが高くMCや熱量に向く。"
  },
  {
    id: "berry",
    name: "ベリー（仮）",
    part: "Gt",
    mainInstrument: "guitar",
    mainGenre: "パンク",
    secondMainGenres: ["メタル", "オルタナ"],
    subGenres: ["ハードコア", "ポストハードコア", "ガレージパンク"],
    weakMainGenres: ["ポップ"],
    weakSubGenres: ["シティポップ", "バラードポップ"],
    stats: { stamina: 62, technique: 60, knowledge: 32, sense: 50, mental: 42, teamwork: 28, rhythm: 58, charisma: 48 },
    instruments: {
      guitar: { mark:"◎", lv:72, cap:94, potentialCap:99, growth:1.14 },
      vocal: { mark:"△", lv:28, cap:56, potentialCap:72, growth:.72 },
      bass: { mark:"△", lv:32, cap:60, potentialCap:78, growth:.75 },
      chorus: { mark:"×", lv:12, cap:36, potentialCap:46, growth:.45 }
    },
    joinDifficulty: "高",
    replaceNote: "ユーザー指定。ハードコアギター。爆発力は高いがチーム運用はやや難しい。"
  },
  {
    id: "carnera",
    name: "カルネラ（仮）",
    part: "Dr/DJ",
    mainInstrument: "drum",
    mainGenre: "ミクスチャー",
    secondMainGenres: ["ヒップホップ", "メタル"],
    subGenres: ["ラップロック", "ニューメタル", "メタルコア"],
    weakMainGenres: ["クラシック"],
    weakSubGenres: ["室内楽風"],
    stats: { stamina: 58, technique: 68, knowledge: 62, sense: 48, mental: 56, teamwork: 40, rhythm: 72, charisma: 34 },
    instruments: {
      drum: { mark:"◎", lv:76, cap:94, potentialCap:99, growth:1.14 },
      dj: { mark:"○", lv:54, cap:82, potentialCap:96, growth:.98, hiddenUpgrade:true },
      key: { mark:"△", lv:34, cap:64, potentialCap:84, growth:.78 },
      chorus: { mark:"×", lv:10, cap:34, potentialCap:44, growth:.45 }
    },
    joinDifficulty: "高",
    replaceNote: "ユーザー指定。ミクスチャー系ドラム。ドラム爆発とDJミックスの橋渡し役。"
  },
  {
    id: "mike",
    name: "ミケ（仮）",
    part: "Gt/Vo",
    mainInstrument: "guitar",
    mainGenre: "ポップ",
    secondMainGenres: ["ロック", "パンク"],
    subGenres: ["ギターポップ", "パワーポップ", "アニソンロック"],
    weakMainGenres: ["メタル"],
    weakSubGenres: ["スクリーモ", "メタルコア"],
    stats: { stamina: 42, technique: 50, knowledge: 40, sense: 60, mental: 46, teamwork: 58, rhythm: 48, charisma: 62 },
    instruments: {
      guitar: { mark:"◎", lv:62, cap:88, potentialCap:96, growth:1.08 },
      vocal: { mark:"○", lv:56, cap:82, potentialCap:94, growth:1.0 },
      chorus: { mark:"◎", lv:62, cap:88, potentialCap:96, growth:1.05 },
      key: { mark:"△", lv:26, cap:56, potentialCap:78, growth:.72 }
    },
    joinDifficulty: "低〜中",
    replaceNote: "ユーザー指定。ポップ寄りギター/ボーカル。キャッチーとコーラスに強い。"
  },
  {
    id: "show",
    name: "ショウ（仮）",
    part: "Ba/Cho",
    mainInstrument: "bass",
    mainGenre: "ポップ",
    secondMainGenres: ["エモ", "ロック"],
    subGenres: ["ギターポップ", "シティポップ", "ポストロック"],
    weakMainGenres: ["ハードコア"],
    weakSubGenres: ["スクリーモ", "メタルコア"],
    stats: { stamina: 50, technique: 46, knowledge: 48, sense: 54, mental: 60, teamwork: 72, rhythm: 60, charisma: 38 },
    instruments: {
      bass: { mark:"◎", lv:64, cap:90, potentialCap:98, growth:1.1 },
      chorus: { mark:"◎", lv:66, cap:90, potentialCap:98, growth:1.08 },
      vocal: { mark:"△", lv:30, cap:60, potentialCap:78, growth:.75 },
      key: { mark:"△", lv:28, cap:58, potentialCap:80, growth:.75 }
    },
    joinDifficulty: "低〜中",
    replaceNote: "ユーザー指定。ベース/コーラス。協調性が高く、ポップとエモの橋渡しに向く。"
  },
  {
    id: "pomic",
    name: "ポミック（仮）",
    part: "Dr",
    mainInstrument: "drum",
    mainGenre: "メタル",
    secondMainGenres: ["パンク", "ハードコア"],
    subGenres: ["ハードコア", "メタルコア", "スクリーモ"],
    weakMainGenres: ["ポップ"],
    weakSubGenres: ["シティポップ", "バラードポップ"],
    stats: { stamina: 76, technique: 58, knowledge: 28, sense: 36, mental: 54, teamwork: 32, rhythm: 78, charisma: 36 },
    instruments: {
      drum: { mark:"◎", lv:78, cap:95, potentialCap:99, growth:1.2 },
      bass: { mark:"△", lv:28, cap:56, potentialCap:72, growth:.72 },
      guitar: { mark:"△", lv:26, cap:54, potentialCap:68, growth:.7 },
      chorus: { mark:"×", lv:8, cap:34, potentialCap:42, growth:.4 }
    },
    joinDifficulty: "高",
    replaceNote: "ユーザー指定。ハードコア/メタル系ドラム。体力とリズム特化の重量級。"
  },
  {
    id: "noise",
    name: "ノイズ（仮）",
    part: "DJ/Syn",
    mainInstrument: "dj",
    mainGenre: "エレクトロ",
    secondMainGenres: ["ミクスチャー", "ヒップホップ"],
    subGenres: ["デジロック", "ダンスロック", "トラップ"],
    weakMainGenres: ["クラシック"],
    weakSubGenres: ["室内楽風", "バラードポップ"],
    stats: { stamina: 38, technique: 58, knowledge: 64, sense: 70, mental: 44, teamwork: 34, rhythm: 68, charisma: 52 },
    instruments: {
      dj: { mark:"◎", lv:76, cap:94, potentialCap:99, growth:1.14 },
      key: { mark:"○", lv:52, cap:82, potentialCap:96, growth:.98 },
      vocal: { mark:"△", lv:28, cap:58, potentialCap:74, growth:.72 },
      chorus: { mark:"△", lv:30, cap:58, potentialCap:72, growth:.72 }
    },
    joinDifficulty: "高",
    replaceNote: "補完追加。DJ不足対策のエレクトロ枠。DJミックス、シンセ厚め、流行曲に強い。"
  }
);


// v0.3.13: ギターボーカル / ベースボーカル補完キャラ。
DATA.candidateCharacters.push(
  {
    id: "asahi_gtvo",
    name: "アサヒ（仮）",
    part: "Gt/Vo",
    mainInstrument: "guitar",
    mainGenre: "オルタナ",
    secondMainGenres: ["ロック", "エモ"],
    subGenres: ["オルタナロック", "ギターロック", "エモロック"],
    weakMainGenres: ["メタル", "クラシック"],
    weakSubGenres: ["スクリーモ", "シンフォニックメタル"],
    stats: { stamina: 48, technique: 56, knowledge: 44, sense: 62, mental: 42, teamwork: 46, rhythm: 50, charisma: 58 },
    instruments: {
      guitar: { mark:"◎", lv:68, cap:90, potentialCap:98, growth:1.12 },
      vocal: { mark:"○", lv:54, cap:82, potentialCap:94, growth:1.0 },
      chorus: { mark:"○", lv:50, cap:78, potentialCap:90, growth:.95 },
      bass: { mark:"△", lv:26, cap:54, potentialCap:72, growth:.72 }
    },
    joinDifficulty: "中",
    replaceNote: "補完追加。ギターボーカル枠。オルタナ/エモ寄りで、表現と曲作りに強い。"
  },
  {
    id: "naki_bavo",
    name: "ナキ（仮）",
    part: "Ba/Vo",
    mainInstrument: "bass",
    mainGenre: "シューゲイザー",
    secondMainGenres: ["エモ", "ポップ"],
    subGenres: ["エモロック", "ポストロック", "ギターポップ"],
    weakMainGenres: ["ハードコア", "メタル"],
    weakSubGenres: ["スピードメタル", "スクリーモ"],
    stats: { stamina: 52, technique: 50, knowledge: 58, sense: 66, mental: 54, teamwork: 62, rhythm: 64, charisma: 46 },
    instruments: {
      bass: { mark:"◎", lv:70, cap:92, potentialCap:99, growth:1.12 },
      vocal: { mark:"○", lv:52, cap:80, potentialCap:92, growth:.98 },
      chorus: { mark:"◎", lv:60, cap:88, potentialCap:96, growth:1.05 },
      key: { mark:"△", lv:30, cap:58, potentialCap:78, growth:.75 }
    },
    joinDifficulty: "中〜高",
    replaceNote: "補完追加。ベースボーカル枠。シューゲイザー/エモ寄りで、余韻と安定感に強い。"
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
function instLabel(inst) { return { vocal:"Vo", guitar:"Gt", bass:"Ba", guitar_vocal:"GtVo", bass_vocal:"BaVo", drum:"Dr", key:"Key", dj:"DJ", chorus:"Cho", other:"Pf等", off:"休" }[inst] || inst; }
function instFullLabel(inst) { return { vocal:"ボーカル", guitar:"ギター", bass:"ベース", guitar_vocal:"ギターボーカル", bass_vocal:"ベースボーカル", drum:"ドラム", key:"キーボード/シンセ", dj:"DJ", chorus:"コーラス", other:"ピアノなど", off:"ステージ外" }[inst] || inst; }
function statLabel(key) { return { stamina:"体力", technique:"技術", knowledge:"知識", sense:"センス", mental:"メンタル", teamwork:"協調性", rhythm:"リズム", charisma:"カリスマ" }[key] || key; }
function skillById(id) { return SKILL_DATA.find(s => s.id === id) || null; }
function hasSkill(id) { return (state.playerSkills || []).includes(id); }
function unlockSkill(id, reason="") {
  if (hasSkill(id)) return false;
  const skill = skillById(id);
  if (!skill) return false;
  state.playerSkills.push(id);
  showEventPopup("SKILL UNLOCKED!!", `${skill.name}を覚えた！\n${skill.desc}${reason ? "\nきっかけ：" + reason : ""}`, skill.rarity === "レア" ? "rare" : "event", skill.rarity === "レア" ? "🌟" : "🧠");
  log(`スキル獲得：${skill.name}。${skill.desc}`);
  return true;
}
function renderPlayerSkillPanel() {
  const owned = new Set(state.playerSkills || []);
  const open = state.skillPanelOpen !== false;
  return `<div class="skill-panel"><div class="section-title"><h2>主人公スキル</h2><span class="badge good">${owned.size ? "効果発動中" : "未習得"}</span></div><button id="toggleSkillPanelBtn" class="ghost-btn wide-cancel">${open ? "主人公スキル一覧を隠す" : "主人公スキル一覧を表示"}</button>${open ? SKILL_DATA.map(sk => `<div class="skill-row ${owned.has(sk.id) ? "owned" : "locked"}"><b>${owned.has(sk.id) ? "習得済" : "未習得"}：${escapeHtml(sk.name)}</b><span class="badge ${sk.rarity === "レア" ? "rare" : "good"}">${escapeHtml(sk.rarity)}</span><small>${escapeHtml(sk.desc)}</small><small>条件：${escapeHtml(sk.condition || "-")}</small></div>`).join("") : `<div class="empty-panel">習得済み：${escapeHtml(skillSummaryShort())}</div>`}</div>`;
}
function equipmentById(id) { return EQUIPMENT_DATA.find(e => e.id === id) || null; }
function equipmentLevel(id) { return clamp(Number(state.equipment?.[id] || 0), 0, 5); }
function equipmentUpgradeCost(id) {
  const eq = equipmentById(id);
  const lv = equipmentLevel(id);
  const base = eq?.id === "prs" || eq?.id === "van" || eq?.id === "pa" ? 90000 : eq?.category === "ギター" ? 45000 : 60000;
  return Math.round(base * Math.pow(1.75, lv));
}
function equipmentEffectSum(key) {
  return EQUIPMENT_DATA.reduce((sum, eq) => sum + (equipmentLevel(eq.id) * Number(eq.effects?.[key] || 0)), 0);
}
function equipmentPrepBonus() { return equipmentEffectSum("prep"); }
function equipmentMerchBonus() { return equipmentEffectSum("merch") + (hasSkill("merch_master") ? 5 : 0); }
function equipmentUpkeepDiscount() { return Math.max(-0.35, EQUIPMENT_DATA.reduce((sum, eq) => sum + equipmentLevel(eq.id) * Number(eq.effects?.upkeep || 0), 0)); }
function equipmentFatigueReduction() { return equipmentEffectSum("fatigue"); }
function skillSummaryShort() {
  const owned = (state.playerSkills || []).map(id => skillById(id)?.name).filter(Boolean);
  return owned.length ? owned.join(" / ") : "未習得";
}
function maybeUnlockProgressSkills(context="") {
  const cc = state.commandCounts || {};
  if ((cc.practice || 0) >= 3) unlockSkill("practice_efficiency", "練習を重ねた");
  if ((state.liveCount || 0) >= 3) unlockSkill("setlist_sense", "ライブ経験が増えた");
  if ((state.liveCount || 0) >= 2 && (state.band?.fans || 0) >= 30) unlockSkill("mc_master", "客前で話す経験を積んだ");
  if ((cc.parttime || 0) >= 2 || (state.band?.funds || 0) < 12000) unlockSkill("saving_master", "資金繰りを覚えた");
  if ((state.totalMerchSales || 0) >= 45000) unlockSkill("merch_master", "物販の反応を掴んだ");
  if ((state.band?.fatigue || 0) >= 70 && ((cc.talk || 0) >= 1 || (state.playerCraft?.lyricsXp || 0) + (state.playerCraft?.musicXp || 0) >= 4)) unlockSkill("midnight_inspiration", "疲れた夜に言葉が降ってきた");
  if (craftLevel("lyrics") >= 6 && craftLevel("music") >= 6 && (state.songs || []).length >= 6) unlockSkill("dual_songcraft", "作詞作曲の型ができてきた");
  const allBasics = ["practice","rest","parttime","recruit","promo","talk"].every(k => (cc[k] || 0) >= 1);
  if (allBasics && (state.playerCraft?.lyricsXp || 0) + (state.playerCraft?.musicXp || 0) >= 1 && (state.liveCount || 0) >= 1) unlockSkill("self_management", "バンド生活の一通りを経験した");
  if ((state.turn || 1) >= 35 && ((cc.practice || 0) + (cc.promo || 0) + (cc.talk || 0)) >= 16) unlockSkill("shortcut_command", "後半の段取りが身についた");
}
function initials(name) { return String(name).replace(/[（(].*?[）)]/g, "").slice(0, 2); }

const DISCOVERY_KEY = "underground_v014_discovered_subgenres"; // v0.2.4でも継続利用
const LEGACY_SAVE_KEY = "underground_v020_save";
const LEGACY_AUTOSAVE_KEY = "underground_v020_autosave";
const SAVE_SLOT_COUNT = 2;
const SAVE_SLOT_PREFIX = "underground_v0310_slot_";
const AUTOSAVE_SLOT_PREFIX = "underground_v0310_autoslot_";
const CURRENT_SLOT_KEY = "underground_v0310_current_slot";
const SAVE_VERSION = "v0.3.30";
let uiMode = "title";
let selectedSaveSlot = readCurrentSaveSlot();

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
function safeStorageRemove(key) {
  try { localStorage.removeItem(key); return true; } catch (e) { return false; }
}
function readCurrentSaveSlot() {
  const raw = safeStorageGet(CURRENT_SLOT_KEY);
  const n = Number(raw || 1);
  return clamp(Number.isFinite(n) ? n : 1, 1, SAVE_SLOT_COUNT);
}
function setCurrentSaveSlot(slot) {
  selectedSaveSlot = clamp(Number(slot || 1), 1, SAVE_SLOT_COUNT);
  safeStorageSet(CURRENT_SLOT_KEY, String(selectedSaveSlot));
}
function saveKeyForSlot(slot) { return `${SAVE_SLOT_PREFIX}${slot}`; }
function autosaveKeyForSlot(slot) { return `${AUTOSAVE_SLOT_PREFIX}${slot}`; }
function slotRawSave(slot) {
  return safeStorageGet(saveKeyForSlot(slot)) || safeStorageGet(autosaveKeyForSlot(slot)) || (Number(slot) === 1 ? (safeStorageGet(LEGACY_SAVE_KEY) || safeStorageGet(LEGACY_AUTOSAVE_KEY)) : null);
}
function savePayloadForSlot(slot) {
  const raw = slotRawSave(slot);
  if (!raw) return null;
  try { const payload = JSON.parse(raw); return payload && payload.state ? payload : null; } catch (e) { return null; }
}
function stripEphemeralState(src) {
  const copy = clone(src);
  delete copy.saveSlotModal;
  delete copy.turnNotice;
  delete copy.pendingPurchase;
  delete copy.pendingBooking;
  delete copy.detailModal;
  delete copy.livePrepPickerSlot;
  return copy;
}
function saveGame(manual=false, slot=selectedSaveSlot) {
  slot = clamp(Number(slot || selectedSaveSlot || 1), 1, SAVE_SLOT_COUNT);
  setCurrentSaveSlot(slot);
  const payload = {
    version: SAVE_VERSION,
    slot,
    savedAt: new Date().toISOString(),
    state: stripEphemeralState(state)
  };
  const ok = safeStorageSet(saveKeyForSlot(slot), JSON.stringify(payload));
  if (manual) {
    state.saveNotice = ok ? `スロット${slot}にセーブしました。` : "セーブに失敗しました。ブラウザの保存容量やプライベートモードを確認してください。";
    state.saveSlotModal = null;
    log(ok ? `スロット${slot}に手動セーブした。` : "手動セーブに失敗した。");
    render();
  }
  return ok;
}
function autoSaveGame() {
  if (!state || uiMode !== "game") return;
  const slot = clamp(Number(selectedSaveSlot || 1), 1, SAVE_SLOT_COUNT);
  const payload = { version: SAVE_VERSION, slot, savedAt: new Date().toISOString(), state: stripEphemeralState(state) };
  safeStorageSet(autosaveKeyForSlot(slot), JSON.stringify(payload));
}
function restoreGame(slot=selectedSaveSlot) {
  slot = clamp(Number(slot || selectedSaveSlot || 1), 1, SAVE_SLOT_COUNT);
  const payload = savePayloadForSlot(slot);
  if (!payload) { log(`スロット${slot}にロードできるセーブデータがありません。`); if (uiMode !== "game") uiMode = "title"; render(); return; }
  try {
    state = payload.state;
    state.saveSlotModal = null;
    setCurrentSaveSlot(slot);
    uiMode = "game";
    state.saveNotice = `${payload.version || "旧版"} / スロット${slot} のセーブをロードしました。`;
    state.logs = state.logs || [];
    state.logs.unshift(`スロット${slot}のセーブデータをロードした。保存日時: ${payload.savedAt ? new Date(payload.savedAt).toLocaleString("ja-JP") : "不明"}`);
    scheduleNextLive();
    render();
  } catch (e) {
    log("セーブデータの読み込みに失敗しました。");
    if (uiMode !== "game") uiMode = "title";
    render();
  }
}
function deleteSave(slot=selectedSaveSlot) {
  slot = clamp(Number(slot || selectedSaveSlot || 1), 1, SAVE_SLOT_COUNT);
  safeStorageRemove(saveKeyForSlot(slot));
  safeStorageRemove(autosaveKeyForSlot(slot));
  if (Number(slot) === 1) { safeStorageRemove(LEGACY_SAVE_KEY); safeStorageRemove(LEGACY_AUTOSAVE_KEY); }
  state.saveNotice = `スロット${slot}のセーブデータを削除しました。現在のプレイは画面上には残っています。`;
  log(`スロット${slot}の保存済みセーブデータを削除した。`);
  render();
}
function saveStatusText(slot=selectedSaveSlot) {
  const payload = savePayloadForSlot(slot);
  if (!payload) return `スロット${slot}: セーブなし`;
  return `スロット${slot}: ${payload.version || "旧版"} / ${payload.savedAt ? new Date(payload.savedAt).toLocaleString("ja-JP") : "保存日時不明"}`;
}
function slotSummaryHtml(slot, mode="load") {
  const payload = savePayloadForSlot(slot);
  if (!payload) {
    return `<div class="slot-card empty"><b>スロット${slot}</b><span>セーブなし</span><small>${mode === "new" ? "新しく始められます。" : "ロードできるデータはありません。"}</small></div>`;
  }
  const st = payload.state || {};
  const band = st.band || {};
  const title = band.name || "名無しの地下バンド";
  return `<div class="slot-card"><b>スロット${slot}</b><span>${escapeHtml(title)}</span><small>${payload.version || "旧版"} / ${payload.savedAt ? new Date(payload.savedAt).toLocaleString("ja-JP") : "保存日時不明"}</small><small>${st.turn || 1}/${st.maxTurn || 50}ターン・ファン${band.fans || 0}人・資金${Number(band.funds || 0).toLocaleString()}円</small></div>`;
}
function hasAnySave() {
  for (let i = 1; i <= SAVE_SLOT_COUNT; i++) if (savePayloadForSlot(i)) return true;
  return false;
}
function startNewGameInSlot(slot) {
  slot = clamp(Number(slot || 1), 1, SAVE_SLOT_COUNT);
  const exists = !!savePayloadForSlot(slot);
  if (exists && !window.confirm(`スロット${slot}にはセーブがあります。新しく始めると、このスロットは次のオートセーブで上書きされます。続けますか？`)) return;
  setCurrentSaveSlot(slot);
  state = createInitialState();
  state.activeSaveSlot = slot;
  state.saveNotice = `スロット${slot}で新しく開始しました。`;
  uiMode = "game";
  render();
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
    title: "はじまりの曲",
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
    representativePoints: 0,
    createdTurn: 0,
    livePlays: 0,
    lastLiveTurn: 0,
    lastLiveSlot: 0,
    consecutiveLiveUses: 0,
    mannerism: 0,
    boostLevel: 0,
    theme: "---",
    keyword: "はじまり / 地下 / ライブ",
    arrange: "疾走ビート"
  };
  const liveEvents = generateInitialLiveEvents();
  return {
    turn: 1,
    maxTurn: 50,
    liveEvents,
    liveSchedule: liveEvents.map(e => e.turn).sort((a,b)=>a-b),
    nextLiveTurn: 5,
    liveCount: 0,
    ended: false,
    player,
    members: [],
    memberCap: 999,
    memberCostExplained: false,
    items: { drink: 0, effecter: 0, usedGear: 0, lightFx: 0 },
    equipment: {},
    totalMerchSales: 0,
    songTitleHistory: [],
    characterEventFlags: {},
    endingRecorded: false,
    candidates: clone(DATA.candidateCharacters),
    songs: [starterSong],
    pendingDrafts: [],
    playerCraft: { lyricsXp: 0, musicXp: 0 },
    freeSongcraftCharge: 0,
    discoveredSubGenres: loadDiscoveredSubGenres(),
    songcraftUsedThisTurn: false,
    songEditor: { step: "closed" },
    introSeen: false,
    tutorialStage: "intro",
    bandNamePrompt: false,
    renameBandNamePrompt: false,
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
    rivalRelations: {},
    liveOffers: [],
    phoneMails: [],
    activeMailId: null,
    phoneSubView: "menu",
    snsPosts: [],
    snsLastPostTurn: 0,
    snsPostCount: 0,
    liveDiagnostics: [],
    liveReservationCandidates: [],
    reservationCandidateTurn: 0,
    notificationTurns: [],
    pendingAfterparty: null,
    hangoverTurn: 0,
    logs: ["地下のスタジオから、最大50ターンの育成が始まった。初ライブは5ターン目固定。初回ライブ後は、自主企画の会場予約と、携帯に届くブッキング通知からライブ予定を組める。"],
    lastApplicant: null,
    applicants: [],
    dismissedApplicantIds: [],
    promoRecruitTurns: 0,
    liveResultHistory: [],
    setlistHistory: [],
    playerSkills: [],
    commandCounts: {},
    saveNotice: "",
    activeSaveSlot: selectedSaveSlot || 1,
    saveSlotModal: null,
    activePopup: null,
    pendingNoSongcraftCommand: null,
    pendingBooking: null,
    pendingBoostSong: null,
    pendingPurchase: null,
    livePrepSetlist: null,
    livePrepPositions: {},
    livePrepChorus: "none",
    livePrepChorusIds: ["none"],
    livePrepSupportIds: [],
    livePrepMerch: "none",
    livePrepMerchOrders: {},
    livePrepPickerSlot: null,
    liveHouseEventCandidates: null,
    liveHouseEventCandidateTurn: 0,
    lastFesGoalPopupTurn: 0,
    detailModal: null,
    lastSongcraftResult: null,
    turnNotice: null,
    actionResultModal: null,
    liveProgressModal: null,
    pendingLiveResultModal: null,
    liveResultModal: null,
    pendingEndingAfterLive: false,
    deferPopupsUntilAfterLive: false,
    popupQueue: [],
    lastNoLivePlanWarnTurn: 0,
    lastLogType: "info",
    telopFlash: 0,
    installHintDismissed: false,
    seenGuidePopups: {},
    quietGuideMode: true,
    skillPanelOpen: true
  };
}

function generateInitialLiveEvents() {
  const firstVenue = venueById("garage");
  return [
    { turn:5, venueId:"garage", label:"初ライブ：ライブハウスイベント", fixed:true, booked:true, cancelled:false, name:"初ライブ：ライブハウスイベント", capacity:firstVenue.capacity, fee:firstVenue.fee, prepNeed:firstVenue.prepNeed, liveType:"booking_house", invitedBandIds:["paper_moon", "neon_cider"] },
    fixedLiveEvent(30, "big_stage", "UNDER FES", true),
    fixedLiveEvent(50, "big_stage", "GRAND UNDER FES", true)
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
  return liveEventForTurn(state.turn) || liveEventForTurn(state.nextLiveTurn) || fixedLiveEvent(state.maxTurn || 50, "big_stage", "GRAND UNDER FES", true);
}
function audienceProfileForVenue(v) {
  if (!v) return { label:"通常客層", detail:"初見客と常連が混ざる。" };
  if (v.id === "garage") return { label:"友人・身内多め", detail:"荒くても熱量が届きやすい。コピー曲も安定しやすい。" };
  if (v.id === "livehouse_s") return { label:"地下ライブ常連", detail:"既存曲の安定感と新曲の新鮮さ、両方を見る客層。" };
  if (v.id === "livehouse_m") return { label:"初見客多め", detail:"キャッチーさ・曲順・新曲の話題性が伸びやすい。" };
  if (v.id === "warehouse") return { label:"イベント客・コア層", detail:"熱量・物販・大きめの音圧が見られる。準備不足時の失敗リスクが上がる。" };
  if (v.id === "big_stage") return { label:"フェス審査・外部客", detail:"コピー曲よりオリジナル、同じセトリより幅のある勝負が評価される。" };
  return { label:"通常客層", detail:v.note || "会場ごとの色がある。" };
}
function venueRankLabel(v) {
  if (!v) return "通常";
  if (v.id === "garage") return "小箱";
  if (v.id === "livehouse_s") return "小箱";
  if (v.id === "livehouse_m") return "中規模ライブハウス";
  if (v.id === "warehouse") return "大箱";
  if (v.id === "big_stage") return (state.turn || 1) >= 50 ? "GRAND UNDER FES" : (state.turn || 1) >= 30 ? "UNDER FES" : "業界関係者イベント";
  return "通常";
}
function venueRequirementText(v) {
  if (!v) return "必要機材：なし";
  const need = [];
  if (["livehouse_m","warehouse","big_stage"].includes(v.id)) need.push(`PA Lv${v.id === "big_stage" ? 3 : 1}+`);
  if (["warehouse","big_stage"].includes(v.id)) need.push(`移動車 Lv${v.id === "big_stage" ? 2 : 1}+`);
  if (v.id === "big_stage") need.push("代表曲/定番曲", "幅のあるセトリ");
  return `${venueRankLabel(v)} / 必要目安：${need.length ? need.join("・") : "基礎準備"} / 失敗時リスク：${v.id === "big_stage" ? "業界評価大" : v.id === "warehouse" ? "費用大" : "小"}`;
}
function canBookSchedules() {
  return !state.ended && (state.turn > 5 || state.liveResultHistory.length > 0);
}
function activeMembers() { return [state.player, ...(state.members || [])]; }
function reserveMembers() { return []; }
function officialMembers() { return state.members; }
function bandSize() { return activeMembers().length; }
function chorusSlotCount() { return clamp(1 + Math.floor((state.turn || 1) / 10), 1, 6); }
function normalizeLivePrepChorusIds() {
  let ids = Array.isArray(state.livePrepChorusIds) ? state.livePrepChorusIds.slice() : [];
  if (!ids.length && state.livePrepChorus && state.livePrepChorus !== "none") ids = [state.livePrepChorus];
  const slots = chorusSlotCount();
  while (ids.length < slots) ids.push("none");
  state.livePrepChorusIds = ids.slice(0, slots);
  state.livePrepChorus = state.livePrepChorusIds.find(id => id && id !== "none") || "none";
  return state.livePrepChorusIds;
}
function memberUpkeepCost() {
  const joined = (state.members || []).length;
  let cost = 0;
  for (let i = 1; i <= joined; i++) {
    const totalBandPeople = i + 1;
    if (totalBandPeople <= 5) cost += 700;
    else cost += 700 * Math.pow(2, Math.min(totalBandPeople - 5, 5));
  }
  return Math.round(cost * (1 + equipmentUpkeepDiscount()));
}
function maybeExplainMemberCost() {
  if (state.memberCostExplained || bandSize() < 4) return;
  state.memberCostExplained = true;
  showEventPopup("メンバーが増えた", "4人目が加わり、バンドとしての形が見えてきた。\n今後は最大人数や控えの制限はなく、加入した仲間は全員ライブ準備に出られる。\nただし人数が増えるほど維持費・交通費が増え、6人以上は1人ごとの出費が重くなる。", "event", "👥");
}
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
  state.nextLiveTurn = next ? next.turn : (state.maxTurn || 50);
}
function nextLiveLabel() {
  const ev = liveEventForTurn(state.nextLiveTurn);
  return `${state.nextLiveTurn}T ${ev?.label || ev?.name || "ライブ"}`;
}
function turnsUntilNextLive() { return Math.max(0, state.nextLiveTurn - state.turn); }
function firstDraftTutorialTargets() {
  if (state.turn !== 2 || state.firstDraftTutorialPending === false) return [];
  if (!Array.isArray(state.pendingDrafts) || !state.pendingDrafts.length) return [];
  let ids = Array.isArray(state.firstDraftTutorialDraftIds) ? state.firstDraftTutorialDraftIds.filter(Boolean) : [];
  if (!ids.length && state.firstDraftTutorialPending !== false) {
    ids = [state.pendingDrafts[0]?.id].filter(Boolean);
    state.firstDraftTutorialDraftIds = ids;
  }
  return ids.map(id => state.pendingDrafts.find(d => d.id === id)).filter(d => d && !(d.lyricsDone && d.musicDone));
}
function mustCompleteFirstDraftTutorial() {
  return firstDraftTutorialTargets().length > 0;
}
function firstDraftTutorialPopup() {
  return {
    title:"2ターン目：未完成曲を完成させよう",
    body:"1ターン目で作った曲はまだ未完成。\nこのターンは未完成曲だけを選び、作っていない作詞/作曲を進めて曲完成まで確認しよう。",
    type:"event",
    icon:"📝"
  };
}
function maybeShowFatigueIncreasePopup(before, after, reason) {
  const inc = Math.round((after || 0) - (before || 0));
  if (inc <= 0) return;
  showEventPopup("疲労が増えた", `${reason}
疲労 +${inc}%（現在 ${Math.round(after)}%）。
疲労が高いと練習・宣伝・曲作りの効率が下がる。ライブ前日は休憩やドリンクも考えよう。`, "warn", "⚠️");
}
function log(msg, type="info") {
  state.logs.unshift(msg);
  state.lastLogType = type;
  state.telopFlash = Date.now();
}
function normalizePopupQueue() {
  state.popupQueue = Array.isArray(state.popupQueue) ? state.popupQueue.filter(Boolean) : [];
  const seen = new Set();
  state.popupQueue = state.popupQueue.filter(p => {
    const key = `${p.title || ""}|${String(p.body || "").slice(0, 42)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 18);
}
function nextPopupFromQueue() {
  normalizePopupQueue();
  if (!state.popupQueue.length) return null;
  const batch = state.popupQueue.splice(0, 3).filter(Boolean);
  if (batch.length === 1) return batch[0];
  return {
    title: "まとめて確認",
    body: batch.map(p => `【${p.title || "通知"}】\n${p.body || ""}`).join("\n\n"),
    type: batch.some(p => p.type === "warn" || p.type === "bad") ? "warn" : (batch.some(p => p.type === "rare") ? "rare" : "event"),
    icon: "📌"
  };
}
function showEventPopup(title, body, type="info", icon="🎸", payload={}) {
  const popup = { title, body, type, icon, ...(payload || {}) };
  if (title === "疲労が増えた" && !(String(body || "").includes("ライブ") || String(body || "").includes("打ち上げ"))) {
    log(`${title}：${String(body || "").split("\n")[0]}`, "warn");
    return;
  }
  if (state.deferPopupsUntilAfterLive || state.liveProgressModal || state.pendingLiveResultModal || state.liveResultModal || state.actionResultModal || state.detailModal || state.pendingBooking || state.pendingBoostSong || state.pendingAfterparty || state.pendingPurchase || state.saveSlotModal || state.pendingCancelLive || state.activePopup) {
    state.popupQueue = state.popupQueue || [];
    state.popupQueue.push(popup);
    normalizePopupQueue();
    return;
  }
  state.activePopup = popup;
}
function closeActivePopup() {
  state.activePopup = null;
  state.activePopup = nextPopupFromQueue();
  if (!state.activePopup && state.pendingEndingAfterLive) {
    state.pendingEndingAfterLive = false;
    state.ended = true;
  }
  render();
}
function closeLiveResultModal() {
  state.liveResultModal = null;
  state.deferPopupsUntilAfterLive = false;
  if (state.pendingAfterparty) { render(); return; }
  if (state.postLiveStory) {
    const ev = state.postLiveStory;
    state.postLiveStory = null;
    state.activePopup = { title:ev.title, body:ev.body, type:"event", icon:ev.icon || "🕴️" };
  } else {
    state.activePopup = nextPopupFromQueue();
  }
  if (!state.activePopup && state.pendingEndingAfterLive) {
    state.pendingEndingAfterLive = false;
    state.ended = true;
  }
  render();
}
function closeActionResultModal() {
  state.actionResultModal = null;
  state.lastSongcraftResult = null;
  if (!state.activePopup) {
    const next = nextPopupFromQueue();
    if (next) { state.activePopup = next; render(); return; }
  }
  if (state.pendingTurnAdvance) {
    const pending = state.pendingTurnAdvance;
    if (pending.nextTurn === 5 && !state.band.name) { state.bandNamePrompt = true; render(); return; }
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
  processNewTurnNotifications("turn");
  state.turnNotice = { turn: state.turn, next: state.nextLiveTurn, label: currentLiveName(), remain: turnsUntilNextLive(), createdAt: Date.now() };
  state.songcraftUsedThisTurn = false;
  if (state.hangoverTurn === state.turn) {
    state.popupQueue = state.popupQueue || [];
    state.popupQueue.push({ title:"二日酔い", body:"昨日の打ち上げが響いている。\nこのターンは休憩しかできない。", type:"warn", icon:"😵" });
  }
  if (state.turn === 2 && Array.isArray(state.pendingDrafts) && state.pendingDrafts.some(d => !(d.lyricsDone && d.musicDone))) {
    state.firstDraftTutorialDraftIds = state.pendingDrafts.filter(d => !(d.lyricsDone && d.musicDone)).map(d => d.id);
    state.firstDraftTutorialPending = state.firstDraftTutorialDraftIds.length > 0;
    state.firstDraftTutorialPopupShown = false;
    if (!state.activePopup) {
      state.activePopup = firstDraftTutorialPopup();
      state.firstDraftTutorialPopupShown = true;
    }
  }
  render();
}
function showLiveResultAfterProgress() {
  if (window.__liveProgressTimer) clearTimeout(window.__liveProgressTimer);
  state.liveProgressModal = null;
  state.liveResultModal = state.pendingLiveResultModal;
  state.pendingLiveResultModal = null;
  render();
}
function scheduleLiveProgressTimer() {
  if (window.__liveProgressTimer) clearTimeout(window.__liveProgressTimer);
  const l = state.liveProgressModal;
  if (!l || l.complete) return;
  window.__liveProgressTimer = setTimeout(() => {
    if (!state.liveProgressModal) return;
    const live = state.liveProgressModal;
    const maxIdx = Math.max(0, (live.steps || []).length - 1);
    const nextIndex = (live.index || 0) + 1;
    if (nextIndex >= maxIdx) {
      // 5曲目を通常表示→完了表示で二重判定しない。
      live.index = maxIdx;
      live.complete = true;
      render();
    } else {
      live.index = nextIndex;
      render();
    }
  }, 1850);
}
function clearTurnNotice() {
  if (window.__turnNoticeTimer) clearTimeout(window.__turnNoticeTimer);
  state.turnNotice = null;
}
function scheduleTurnNoticeTimer() {
  if (window.__turnNoticeTimer) clearTimeout(window.__turnNoticeTimer);
  if (!state.turnNotice) return;
  window.__turnNoticeTimer = setTimeout(() => {
    if (!state.turnNotice) return;
    state.turnNotice = null;
    render();
  }, 2600);
}
function makeLiveProgressModal(result, setlist) {
  const steps = setlist.map((song, i) => {
    const slot = i + 1;
    const repeat = repeatImpactForSlot(result.repeatInfo, slot);
    const mood = liveSongMood(song, slot, result.rank, result);
    return {
      slot,
      line: liveSongLine(song, slot, result.rank, result, repeat),
      icon: repeat ? repeat.icon : mood.icon,
      event: repeat ? repeat.text : mood.text,
      impact: repeat ? "repeat" : mood.kind
    };
  });
  return { title: currentLiveName(), rank: result.rank, total: val(result.total), steps, index:0, complete:false };
}
function repeatImpactForSlot(repeatInfo, slot) {
  const hit = (repeatInfo?.repeats || []).find(r => r.idx === slot - 1);
  if (!hit) return null;
  if (repeatInfo.boom) {
    return { icon:"🎤", text:`${slot}曲目の再演が刺さった`, detail:`同じ曲の${hit.occurrence}回目が、逆に客席の合唱を生んだ。` };
  }
  return { icon:"⚠️", text:`${slot}曲目の再演が裏目`, detail:`同じ曲の${hit.occurrence}回目で、客席の集中が少し切れた。` };
}
function liveSongLine(song, slot, rank, result, repeat) {
  if (repeat) return `${slot}曲目『${song.title}』 ${repeat.detail}`;
  const tagLine = liveTagLine(song, slot);
  if (tagLine) return `${slot}曲目『${song.title}』 ${tagLine}`;
  const lines = {
    1: "幕開け。客席の視線を一気につかみにいく。",
    2: "曲順が良く、前の熱を受けてフロアが少し前に出た。",
    3: "中盤の山場。歌詞と演奏の芯が見え始める。",
    4: "ラスト前の一曲。少し空気を変えて、次の爆発を作る。",
    5: "締めの一曲。最後のサビに今日の全部を乗せた。"
  };
  if (["S","A"].includes(rank) && slot >= 3) return `${slot}曲目『${song.title}』 会場の熱がもう一段上がった。`;
  if (["D","E"].includes(rank) && slot >= 3) return `${slot}曲目『${song.title}』 荒さはあるが、必死さはちゃんと届いている。`;
  return `${slot}曲目『${song.title}』 ${lines[slot] || "バンドの色が見え始めた。"}`;
}
function liveTagLine(song, slot) {
  const tags = song.tags || [];
  if (slot === 1 && tags.includes("初手向き")) return "一発目向きの勢いで、入口の空気を作った。";
  if (slot === 2 && tags.includes("疾走感")) return "疾走感がつながって、二曲目から足元が揺れ始めた。";
  if (slot === 3 && tags.includes("エモさ")) return "中盤で感情が刺さり、静かな拍手が厚くなる。";
  if (slot === 4 && tags.includes("余韻")) return "余韻を残して、最後の曲への期待を作った。";
  if (slot === 5 && (tags.includes("爆発力") || tags.includes("代表曲候補"))) return "ラストに置いたことで、曲の爆発力が一番きれいに出た。";
  if (song.genre?.includes("パンク")) return "荒削りな勢いが、地下のライブハウスに似合っている。";
  if (song.genre?.includes("ポップ")) return "メロディの分かりやすさで、初見の客も少し乗ってきた。";
  if (song.genre?.includes("メタル")) return "重いリフで、前列の空気が一気に濃くなる。";
  return "";
}
function liveSongMood(song, slot, rank, result) {
  const strong = ["S","A"].includes(rank);
  const weak = ["D","E"].includes(rank);
  const pools = {
    1: [
      { icon:"🔥", text:"開幕の熱", kind:"opener" },
      { icon:"⚡", text:"一音目で空気が変わった", kind:"opener" },
      { icon:"👏", text:"手拍子が起き始めた", kind:"opener" }
    ],
    2: [
      { icon:"👏", text:"曲順が良くて盛り上がった", kind:"flow" },
      { icon:"🔥", text:"二曲目でフロアが前に出た", kind:"flow" },
      { icon:"💡", text:"前曲から自然につながった", kind:"flow" }
    ],
    3: [
      { icon:"💡", text:"歌詞が届き始めた", kind:"middle" },
      { icon:"🎤", text:"中盤で声がよく抜けた", kind:"middle" },
      { icon:"⭐", text:"この日最初の山場になった", kind:"middle" }
    ],
    4: [
      { icon:"🌙", text:"空気を変えた", kind:"bridge" },
      { icon:"💧", text:"静かな緊張感が出た", kind:"bridge" },
      { icon:"⚡", text:"ラスト前にもう一段ギアが上がった", kind:"bridge" }
    ],
    5: [
      { icon: result.total >= 70 ? "⭐" : "🔥", text:"ラストで押し切った", kind:"finale" },
      { icon:"🎤", text:"最後のサビで声が重なった", kind:"finale" },
      { icon:"💥", text:"締めで一番大きい反応が来た", kind:"finale" }
    ]
  };
  let pool = pools[slot] || [{ icon:"🔥", text:"客席が温まってきた", kind:"normal" }];
  if (strong) pool = [...pool, { icon:"⭐", text:"客席の反応が明らかに良い", kind:"good" }];
  if (weak) pool = [...pool, { icon:"⚠️", text:"荒さはあるが熱量で押した", kind:"rough" }];
  return pool[rand(0, pool.length - 1)];
}
function firstLine(text) {
  return String(text || "").split("\n").find(Boolean) || "地下から始まる。";
}


function currentApplicantList() {
  const list = [];
  if (state.lastApplicant) list.push(state.lastApplicant);
  (state.applicants || []).forEach(a => { if (a && !list.some(x => x.id === a.id)) list.push(a); });
  return list;
}
function setApplicantList(list) {
  state.applicants = (list || []).filter(Boolean);
  state.lastApplicant = state.applicants[0] || null;
}
function personAlreadyKnown(id) {
  if (!id) return true;
  if (id === "player") return true;
  if ((state.members || []).some(m => m.id === id)) return true;
  if ((state.candidates || []).some(c => c.id === id)) return true;
  if ((state.dismissedApplicantIds || []).includes(id)) return true;
  if (currentApplicantList().some(a => a.id === id)) return true;
  return false;
}
function mergeLatestCandidatesIntoState() {
  if (!state || !Array.isArray(DATA.candidateCharacters)) return;
  if (!Array.isArray(state.candidates)) state.candidates = [];
  DATA.candidateCharacters.forEach(c => {
    if (!personAlreadyKnown(c.id)) state.candidates.push(clone(c));
  });
}
function addApplicantFromCandidates(source="募集") {
  mergeLatestCandidatesIntoState();
  if (!state.candidates.length) return null;
  const idx = pickRecruitCandidateIndex();
  if (idx < 0) return null;
  const applicant = state.candidates.splice(idx, 1)[0];
  const list = currentApplicantList();
  if (!list.some(a => a.id === applicant.id)) list.push(applicant);
  setApplicantList(list);
  log(`${source}：${applicant.name}が連絡してきた。加入させるか選べる。`);
  return applicant;
}
function maybePromoRecruitAfterCommand(command) {
  if ((state.promoRecruitTurns || 0) <= 0) return null;
  if (command === "promo") return null;
  const before = state.promoRecruitTurns;
  state.promoRecruitTurns = Math.max(0, before - 1);
  if (Math.random() >= 0.60) {
    log(`宣伝効果：あと${state.promoRecruitTurns}ターン。今回は新しい連絡はなかった。`);
    return null;
  }
  const applicant = addApplicantFromCandidates("宣伝効果");
  if (applicant) showEventPopup("宣伝から加入希望！", `宣伝を見た ${applicant.name} から連絡が来た。\n募集結果と重複するため、同じターンに複数人が候補に来ることがある。`, "event", "📱");
  return applicant;
}
function joinApplicantById(id) {
  const list = currentApplicantList();
  const idx = list.findIndex(a => a.id === id);
  if (idx < 0) return;
  const applicant = list.splice(idx, 1)[0];
  applicant.joinStatus = Math.random() < 0.45 ? "仮加入" : "本加入";
  state.members.push(applicant);
  setApplicantList(list);
  log(`${applicant.name}が${applicant.joinStatus}として加入した。加入済みメンバーは全員バンド構成に入り、ライブ準備で担当を選べる。`);
  showEventPopup(applicant.joinStatus === "仮加入" ? "仮加入！" : "新メンバー加入！", `${applicant.name} がバンドに加わった！\n担当：${applicant.part}\n得意：${applicant.mainGenre}\n加入済みメンバーは全員ライブ準備に表示される。`, applicant.joinStatus === "仮加入" ? "event" : "rare", applicant.joinStatus === "仮加入" ? "🤝" : "🎉");
  maybeExplainMemberCost();
  render();
}
function skipApplicantById(id) {
  const list = currentApplicantList().filter(a => a.id !== id);
  state.dismissedApplicantIds = [...new Set([...(state.dismissedApplicantIds || []), id])];
  setApplicantList(list);
  log("今回は加入を見送った。");
  render();
}

function normalizeState() {
  if (!state.songEditor) state.songEditor = { step: "closed" };
  if (typeof state.introSeen !== "boolean") state.introSeen = true;
  if (!state.tutorialStage) state.tutorialStage = "done";
  if (typeof state.fesInfoKnown !== "boolean") state.fesInfoKnown = false;
  if (typeof state.pendingNoSongcraftCommand === "undefined") state.pendingNoSongcraftCommand = null;
  if (typeof state.pendingTurnAdvance === "undefined") state.pendingTurnAdvance = null;
  if (typeof state.pendingCancelLive === "undefined") state.pendingCancelLive = null;
  if (!Array.isArray(state.applicants)) state.applicants = state.lastApplicant ? [state.lastApplicant] : [];
  if (!Array.isArray(state.dismissedApplicantIds)) state.dismissedApplicantIds = [];
  if (typeof state.promoRecruitTurns === "undefined") state.promoRecruitTurns = 0;
  if (!state.rivalRelations || typeof state.rivalRelations !== "object") state.rivalRelations = {};
  if (!Array.isArray(state.liveOffers)) state.liveOffers = [];
  if (!Array.isArray(state.phoneMails)) state.phoneMails = [];
  if (!Array.isArray(state.snsPosts)) state.snsPosts = [];
  if (typeof state.activeMailId === "undefined") state.activeMailId = null;
  if (!state.phoneSubView) state.phoneSubView = "menu";
  if (typeof state.snsLastPostTurn === "undefined") state.snsLastPostTurn = 0;
  if (typeof state.snsPostCount === "undefined") state.snsPostCount = 0;
  if (!Array.isArray(state.liveDiagnostics)) state.liveDiagnostics = [];
  if (!Array.isArray(state.liveReservationCandidates)) state.liveReservationCandidates = [];
  if (typeof state.reservationCandidateTurn === "undefined") state.reservationCandidateTurn = 0;
  if (!Array.isArray(state.notificationTurns)) state.notificationTurns = [];
  if (typeof state.bookingInviteBoostTurns === "undefined") state.bookingInviteBoostTurns = 0;
  if (typeof state.pendingAfterparty === "undefined") state.pendingAfterparty = null;
  if (typeof state.hangoverTurn === "undefined") state.hangoverTurn = 0;
  state.liveOffers = state.liveOffers.filter(o => o && !o.accepted && !o.expired && Number(o.turn || 0) > (state.turn || 1) + 1).slice(0, 12);
  state.phoneMails = state.phoneMails.slice(0, 40);
  state.snsPosts = state.snsPosts.slice(0, 50);
  state.maxTurn = 50;
  if (!state.playerCraft) state.playerCraft = { lyricsXp: 0, musicXp: 0 };
  if (typeof state.freeSongcraftCharge === "undefined") state.freeSongcraftCharge = 0;
  if (Array.isArray(state.liveEvents)) {
    // v0.3.16: 30T UNDER FES を中間目標、50T GRAND UNDER FES を最終目標にする。
    // 固定フェスは正規化時に必ず残す。旧版でGRANDを検出後に削除して再追加しない不具合があったため、
    // いったん同名固定イベントを整理してから、30T/50Tを必ず1件ずつ差し戻す。
    state.liveEvents = state.liveEvents.filter(e => !(e.fixed && String(e.label || e.name || "").includes("UNDER FES")));
    state.liveEvents.push(fixedLiveEvent(30, "big_stage", "UNDER FES", true));
    state.liveEvents.push(fixedLiveEvent(50, "big_stage", "GRAND UNDER FES", true));
    state.liveEvents.forEach(e => {
      const v = venueById(e.venueId);
      if (!e.liveType) e.liveType = e.fixed ? "special" : "self_one_man";
      if (!e.label || e.label === "自主予約ライブ") e.label = e.liveType === "self_taiban" ? "自主企画：対バン" : e.liveType === "self_one_man" ? "自主企画：ワンマン" : (e.label || liveTypeMeta(e).short);
      e.capacity = v.capacity; e.fee = v.fee; e.prepNeed = v.prepNeed;
    });
  }
  mergeLatestCandidatesIntoState();
  if (!state.scheduleTutorialStage) state.scheduleTutorialStage = "none";
  if (typeof state.playerExtraInstrumentsUnlocked === "undefined") state.playerExtraInstrumentsUnlocked = false;
  if (typeof state.actionResultModal === "undefined") state.actionResultModal = null;
  if (typeof state.pendingBooking === "undefined") state.pendingBooking = null;
  if (typeof state.pendingBoostSong === "undefined") state.pendingBoostSong = null;
  if (typeof state.pendingPurchase === "undefined") state.pendingPurchase = null;
  if (!Array.isArray(state.setlistHistory)) state.setlistHistory = [];
  if (!Array.isArray(state.playerSkills)) state.playerSkills = [];
  if (!state.commandCounts || typeof state.commandCounts !== "object") state.commandCounts = {};
  if (!state.seenGuidePopups || typeof state.seenGuidePopups !== "object") state.seenGuidePopups = {};
  if (typeof state.quietGuideMode === "undefined") state.quietGuideMode = true;
  if (typeof state.skillPanelOpen === "undefined") state.skillPanelOpen = true;
  if (typeof state.uiPrepNotesSeen === "undefined") state.uiPrepNotesSeen = false;
  (state.songs || []).forEach((song, idx) => {
    if (typeof song.createdTurn === "undefined") song.createdTurn = idx === 0 ? 0 : (state.turn || 1);
    if (typeof song.livePlays === "undefined") song.livePlays = 0;
    if (typeof song.mannerism === "undefined") song.mannerism = 0;
    if (typeof song.standardPoints === "undefined") song.standardPoints = 0;
    if (typeof song.boostLevel === "undefined") song.boostLevel = Math.max(0, Number(song.standardPoints || 0));
  });
  if (typeof state.livePrepSetlist === "undefined") state.livePrepSetlist = null;
  if (!state.livePrepPositions || typeof state.livePrepPositions !== "object") state.livePrepPositions = {};
  if (!Array.isArray(state.livePrepSupportIds)) state.livePrepSupportIds = [];
  if (typeof state.livePrepChorus === "undefined") state.livePrepChorus = "none";
  if (typeof state.livePrepMerch === "undefined") state.livePrepMerch = "none";
  if (!state.livePrepMerchOrders || typeof state.livePrepMerchOrders !== "object") state.livePrepMerchOrders = {};
  if (typeof state.livePrepPickerSlot === "undefined") state.livePrepPickerSlot = null;
  if (typeof state.liveHouseEventCandidates === "undefined") state.liveHouseEventCandidates = null;
  if (typeof state.liveHouseEventCandidateTurn === "undefined") state.liveHouseEventCandidateTurn = 0;
  if (typeof state.lastFesGoalPopupTurn === "undefined") state.lastFesGoalPopupTurn = 0;
  if (typeof state.detailModal === "undefined") state.detailModal = null;
  if (typeof state.lastSongcraftResult === "undefined") state.lastSongcraftResult = null;
  if (typeof state.songSortMode === "undefined") state.songSortMode = "total";
  if (typeof state.turnNotice === "undefined") state.turnNotice = null;
  if (typeof state.liveProgressModal === "undefined") state.liveProgressModal = null;
  if (typeof state.pendingLiveResultModal === "undefined") state.pendingLiveResultModal = null;
  if (typeof state.pendingEndingAfterLive === "undefined") state.pendingEndingAfterLive = false;
  if (typeof state.deferPopupsUntilAfterLive === "undefined") state.deferPopupsUntilAfterLive = false;
  if (!Array.isArray(state.popupQueue)) state.popupQueue = [];
  if (typeof state.lastNoLivePlanWarnTurn === "undefined") state.lastNoLivePlanWarnTurn = 0;
  if (typeof state.firstDraftTutorialPending === "undefined") state.firstDraftTutorialPending = state.turn === 2 && Array.isArray(state.pendingDrafts) && state.pendingDrafts.some(d => !(d.lyricsDone && d.musicDone));
  if (!Array.isArray(state.firstDraftTutorialDraftIds)) state.firstDraftTutorialDraftIds = state.firstDraftTutorialPending && Array.isArray(state.pendingDrafts) ? state.pendingDrafts.filter(d => !(d.lyricsDone && d.musicDone)).slice(0,1).map(d => d.id) : [];
  if (typeof state.firstDraftTutorialPopupShown === "undefined") state.firstDraftTutorialPopupShown = false;
  if (state.turn !== 2 || !firstDraftTutorialTargets().length) state.firstDraftTutorialPending = false;
  if (state.turnNotice && (!state.turnNotice.createdAt || Date.now() - state.turnNotice.createdAt > 3200)) state.turnNotice = null;
  if (!state.discoveredGenres) state.discoveredGenres = {};
  if (!state.band) state.band = {};
  if (typeof state.band.name === "undefined") state.band.name = "";
  if (!state.view) state.view = "home";
  if (typeof state.activeSaveSlot === "undefined") state.activeSaveSlot = selectedSaveSlot || 1;
  if (typeof state.saveSlotModal === "undefined") state.saveSlotModal = null;
  if (!Array.isArray(state.playerSkills)) state.playerSkills = [];
  if (Array.isArray(state.logs) && state.logs.length > 180) state.logs = state.logs.slice(0, 180);
  if (!state.equipment || typeof state.equipment !== "object") state.equipment = {};
  EQUIPMENT_DATA.forEach(eq => { state.equipment[eq.id] = clamp(Number(state.equipment[eq.id] || 0), 0, 5); });
  if (typeof state.totalMerchSales === "undefined") state.totalMerchSales = 0;
  if (!Array.isArray(state.songTitleHistory)) state.songTitleHistory = [];
  if (!state.characterEventFlags || typeof state.characterEventFlags !== "object") state.characterEventFlags = {};
  if (typeof state.endingRecorded === "undefined") state.endingRecorded = false;
  state.memberCap = 999;
  if (typeof state.memberCostExplained === "undefined") state.memberCostExplained = bandSize() >= 4;
  normalizeLivePrepChorusIds();
}



function renderTitleScreen() {
  const canContinue = hasAnySave();
  app.innerHTML = `
    <div class="title-screen">
      <div class="title-card">
        <span class="poster-kicker">INDIE BAND SUCCESS ADV</span>
        <h1>アンダーグラウンド（仮）</h1>
        <p>地下から、名前を鳴らせ。</p>
        <div class="title-actions">
          <button id="titleNewBtn" class="big-action">はじめから</button>
          <button id="titleContinueBtn" class="big-action secondary" ${canContinue ? "" : "disabled"}>つづきから</button>
        </div>
        <small>セーブは2スロット。はじめからを押しても、スロット選択と確認をするまで既存データは消えません。</small>
      </div>
    </div>
  `;
  document.getElementById("titleNewBtn")?.addEventListener("click", () => { uiMode = "slot-new"; render(); });
  document.getElementById("titleContinueBtn")?.addEventListener("click", () => { if (!canContinue) return; uiMode = "slot-load"; render(); });
}
function renderTitleSlotScreen(mode="load") {
  const isNew = mode === "new";
  app.innerHTML = `
    <div class="title-screen slot-select-screen">
      <div class="title-card wide">
        <span class="poster-kicker">SAVE SLOT</span>
        <h1>${isNew ? "どのスロットではじめる？" : "どのスロットから続ける？"}</h1>
        <p>${isNew ? "既存データがあるスロットは、開始後のオートセーブで上書きされます。" : "ロードするセーブスロットを選んでください。"}</p>
        <div class="slot-grid">
          ${Array.from({length:SAVE_SLOT_COUNT}, (_,i)=>i+1).map(slot => {
            const has = !!savePayloadForSlot(slot);
            const disabled = !isNew && !has;
            return `<div class="slot-select-card ${has ? "has-save" : "empty"}">${slotSummaryHtml(slot, isNew ? "new" : "load")}<button class="titleSlotBtn ${isNew ? "" : "primary"}" data-slot="${slot}" ${disabled ? "disabled" : ""}>${isNew ? `スロット${slot}ではじめる` : `スロット${slot}をロード`}</button></div>`;
          }).join("")}
        </div>
        <div class="modal-actions"><button id="titleBackBtn" class="ghost-btn">タイトルに戻る</button></div>
      </div>
    </div>
  `;
  document.querySelectorAll(".titleSlotBtn").forEach(btn => btn.addEventListener("click", () => {
    const slot = Number(btn.dataset.slot || 1);
    if (isNew) startNewGameInSlot(slot);
    else restoreGame(slot);
  }));
  document.getElementById("titleBackBtn")?.addEventListener("click", () => { uiMode = "title"; render(); });
}
function goTitle() {
  uiMode = "title";
  if (state) state.saveSlotModal = null;
  render();
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
          <span>50ターン以内に曲を作り、仲間を集め、ライブで実績を残す。</span>
          <span>30ターン目にUNDER FES、50ターン目に超大型フェス出演を目指そう。</span>
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
  if (state.activePopup || state.actionResultModal || state.liveProgressModal || state.liveResultModal || state.pendingAfterparty || state.bandNamePrompt || state.renameBandNamePrompt) return;
  if (mustCompleteFirstDraftTutorial() && !state.firstDraftTutorialPopupShown) {
    state.firstDraftTutorialPopupShown = true;
    state.activePopup = firstDraftTutorialPopup();
    return;
  }
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
    return;
  }
  if (shouldWarnNoLivePlan()) {
    state.lastNoLivePlanWarnTurn = state.turn;
    state.activePopup = {
      title:"ライブ予定なし",
      body:"ライブの予定をいれないとな……\n7ターン後までに本番がない。スケジュール帳で出演できるライブを探そう。",
      type:"warn",
      icon:"📅"
    };
  }
}

function shouldWarnNoLivePlan() {
  if (!canBookSchedules() || isLiveTurn() || state.turn >= state.maxTurn) return false;
  if (state.scheduleTutorialStage === "needSchedule") return false;
  if (state.lastNoLivePlanWarnTurn === state.turn) return false;
  refreshLiveSchedule();
  const hasNearLive = (state.liveEvents || []).some(e => !e.cancelled && e.turn > state.turn && e.turn <= state.turn + 7);
  return !hasNearLive;
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
  if (state.hangoverTurn === state.turn && kind !== "command") {
    state.activePopup = { title:"二日酔い", body:"このターンは休憩しかできない。\n曲作りやライブ予約は、休んでからにしよう。", type:"warn", icon:"😵" };
    render();
    return true;
  }
  if (mustCompleteFirstDraftTutorial() && kind !== "song") {
    state.activePopup = firstDraftTutorialPopup();
    state.view = "home";
    render();
    return true;
  }
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
  if (uiMode === "title") return renderTitleScreen();
  if (uiMode === "slot-new") return renderTitleSlotScreen("new");
  if (uiMode === "slot-load") return renderTitleSlotScreen("load");
  normalizeState();
  if (!state.introSeen) return renderIntroScreen();
  maybeTriggerStoryEvents();
  if (state.ended) return renderEnding();
  const liveMode = isLiveTurn();
  app.innerHTML = `
    <div class="app-shell">
      <div class="hero">
        <div>
          <h1>アンダーグラウンド（仮） ${VERSION}</h1>
          <p>UI前総合検証版：ライブ/スケジュール/交流/携帯/通知/曲テンポを一括統合。</p>
        </div>
        <div class="hero-actions"><button class="jumpTabBtn ghost-btn schedule-head-btn" data-view="schedule">予定</button><button id="refreshAppBtn" class="ghost-btn update-btn">最新版</button><button id="saveBtn" class="ghost-btn">セーブ</button><button id="loadBtn" class="ghost-btn">ロード</button><button id="titleBtn" class="ghost-btn">タイトルへ</button></div>
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
  alignScheduleScrollToCurrentTurn();
  scheduleLiveProgressTimer();
  scheduleTurnNoticeTimer();
  autoSaveGame();
}

function renderFloatingHomeButton(liveMode=false) {
  return "";
}

function alignScheduleScrollToCurrentTurn() {
  const scrollers = document.querySelectorAll(".schedule-scroll");
  if (!scrollers.length) return;
  const currentTurn = String(state.turn || 1);
  scrollers.forEach(scroller => {
    const cell = scroller.querySelector(`[data-turn="${currentTurn}"]`) || scroller.querySelector(".turn-cell.now");
    if (!cell) return;
    requestAnimationFrame(() => {
      const target = Math.max(0, cell.offsetLeft - Math.round(scroller.clientWidth * 0.32));
      scroller.scrollLeft = target;
    });
  });
}

function renderNav(liveMode=false) {
  const tabs = [
    ["home", "ホーム", "🏠"],
    ["command", "コマンド", "⚡"],
    ["band", "バンド情報", "👥"],
    ["songs", "曲", "🎼"],
    ["schedule", "予定", "📅"],
    ["phone", "携帯", "📱"],
    ["shop", "ショップ", "🛒"],
    ["log", "ログ", "📺"],
    ["library", "図鑑", "📚"]
  ];
  return `<div class="tabbar ${liveMode ? "live-lock" : ""}">
    ${tabs.map(([id,label,icon]) => `<button class="tabBtn ${state.view===id ? "active" : ""}" data-view="${id}" ${liveMode ? "disabled" : ""}><span>${icon}${id === "phone" && unreadMailCount() ? `<em class="nav-badge">${unreadMailCount()}</em>` : ""}</span><b>${label}</b></button>`).join("")}
    ${liveMode ? `<div class="tab-live-note">今日はライブ本番。準備画面に集中。</div>` : ""}
  </div>`;
}

function renderMainContent() {
  let html;
  if (state.view === "command") html = renderCommandDesk();
  else if (state.view === "band") html = renderBandScreen();
  else if (state.view === "songs") html = renderSongsScreen();
  else if (state.view === "schedule") html = renderScheduleScreen();
  else if (state.view === "phone") html = renderPhoneScreen();
  else if (state.view === "shop") html = renderShopScreen();
  else if (state.view === "log") html = renderLogScreen();
  else if (state.view === "library") html = renderLibraryScreen();
  else html = renderHomeScreen();
  const homeBack = (state.view || "home") !== "home" ? `<button class="jumpTabBtn page-home-btn" data-view="home">← ホームに戻る</button>` : "";
  return `<main class="view-panel" data-view="${state.view || "home"}">${homeBack}${html}</main>`;
}


function guideSignals() {
  const signals = [];
  const push = (label, level="info", detail="") => signals.push({ label, level, detail });
  const fatigue = Number(state.band?.fatigue || 0);
  const funds = Number(state.band?.funds || 0);
  const turns = turnsUntilNextLive();
  if (mustCompleteFirstDraftTutorial()) push("未完成曲", "warn", "このターンは曲完成まで誘導中");
  if (isLiveTurn()) push("ライブ本番", "warn", "セトリと疲労だけ確認");
  else if (turns <= 1 && fatigue >= 60) push("疲労高め", fatigue >= 80 ? "bad" : "warn", "ライブ前日は休憩も選択肢");
  if (funds < 0) push("赤字", "bad", "バイト・小箱・仕入れ抑制を検討");
  else if (funds < 10000) push("資金低め", "warn", "大きな支出前だけ注意");
  if (fatigue >= 90) push("疲労限界近い", "bad", "100%超え行動は不可");
  else if (fatigue >= 70) push("疲労注意", "warn", "効率が落ちやすい");
  if (canBookSchedules()) {
    const hasFutureFreeLive = (state.liveEvents || []).some(e => !e.fixed && !e.cancelled && e.turn > state.turn);
    const nextNonFixedFar = (state.nextLiveTurn || 0) > state.turn + 7;
    if (!hasFutureFreeLive && nextNonFixedFar) push("ライブ予定薄め", "warn", "予約候補だけ確認してもよい");
  }
  const draftCount = (state.pendingDrafts || []).filter(d => !(d.lyricsDone && d.musicDone)).length;
  if (draftCount && !mustCompleteFirstDraftTutorial()) push("未完成曲あり", "info", "余力がある時に仕上げられる");
  if ((state.turn || 1) >= 25 && (state.turn || 1) < 30) push("UNDER接近", "warn", "条件と代表曲を確認");
  if ((state.turn || 1) >= 44 && (state.turn || 1) < 50) push("GRAND接近", "warn", "高評価狙いは会場相性も見る");
  const unique = [];
  const seen = new Set();
  signals.forEach(s => { if (!seen.has(s.label)) { seen.add(s.label); unique.push(s); } });
  return unique.slice(0, 3);
}
function renderGuideChips(limit=3) {
  const list = guideSignals().slice(0, limit);
  if (!list.length) return `<span class="guide-muted">大きな警告なし</span>`;
  return list.map(g => `<span class="guide-chip ${escapeHtml(g.level)}" title="${escapeHtml(g.detail)}">${escapeHtml(g.label)}</span>`).join("");
}
function renderQuietGuidePanel() {
  const list = guideSignals();
  return `<div class="card tips-card quiet-guide-card">
    <div class="section-title"><h2>状況メモ</h2></div>
    <div class="quiet-guide-chips">${renderGuideChips(3)}</div>
    ${list.length ? `<small>${escapeHtml(list[0].detail || "色やタグは安全目安。最高値は自分で探す余地があります。")}</small>` : `<small>常時の指南は出しすぎず、危険時だけ色・タグ・確認で知らせます。</small>`}
  </div>`;
}
function renderUiPrepSummaryPanel() {
  const unread = unreadMailCount();
  const next = (state.liveEvents || []).filter(e => !e.cancelled && e.turn >= state.turn).sort((a,b)=>a.turn-b.turn)[0];
  const originals = (state.songs || []).filter(song => !song.isCover).length;
  const pending = (state.pendingDrafts || []).length;
  const offers = (state.liveOffers || []).filter(o => !o.accepted && !o.expired && o.turn > state.turn).length;
  const chips = [next ? `次ライブ:${next.turn}T ${liveTypeMeta(next).short}` : "ライブ予定なし", `オリジナル${originals}曲`, pending ? `未完成${pending}曲` : "未完成なし", unread ? `未読メール${unread}` : "未読なし", offers ? `出演通知${offers}件` : "通知待ち"];
  return `<div class="card tips-card ui-prep-panel"><div class="section-title"><h2>v0.3.30 UI前検証</h2><span class="badge good">総合確認版</span></div><div class="quiet-guide-chips">${chips.map(c=>`<span class="badge">${escapeHtml(c)}</span>`).join("")}</div><small>ライブ/スケジュール/交流/携帯/曲テンポ/通知を一括で通しプレイ確認する版です。</small></div>`;
}

function maybeShowGuidePopupOnce(key, title, body, type="event", icon="💡") {
  if (!state.seenGuidePopups || typeof state.seenGuidePopups !== "object") state.seenGuidePopups = {};
  if (state.seenGuidePopups[key]) return false;
  state.seenGuidePopups[key] = true;
  showEventPopup(title, body, type, icon);
  return true;
}
function quietGuideLine() {
  const top = guideSignals()[0];
  if (top) return `${top.label}：${top.detail}`;
  return "必要な警告だけ表示。安全目安は破綻防止で、最高値はセトリや物販の読みで伸ばせる。";
}

function unreadMailCount() { return (state.phoneMails || []).filter(m => !m.read).length; }
function renderPhoneScreen() {
  const mode = state.phoneSubView || "menu";
  if (mode === "mail") return renderMailScreen();
  if (mode === "sns") return renderSnsScreen();
  const unread = unreadMailCount();
  const nextLive = (state.liveEvents || []).find(e => !e.cancelled && e.turn >= state.turn);
  return `<div class="phone-screen grid phone-menu-screen">
    <div class="card phone-card phone-launch-card">
      <div class="section-title"><h2>携帯</h2><span class="badge ${unread ? "warn" : "good"}">${unread ? unread + "件未読" : "通知なし"}</span></div>
      <p><small>メールとSNSをここから起動します。ライブ招待・連絡先交換・口コミ・イベント告知が流れます。</small></p>
      <div class="phone-app-grid">
        <button class="phoneModeBtn phone-app-btn" data-phone-mode="mail"><span>✉️</span><b>メール</b><small>件名/送信者から確認${unread ? ` / 未読${unread}` : ""}</small></button>
        <button class="phoneModeBtn phone-app-btn" data-phone-mode="sns"><span>💬</span><b>SNS</b><small>口コミ・告知・雑多な投稿</small></button>
      </div>
    </div>
    <div class="card phone-card">
      <div class="section-title"><h2>次の予定</h2><span class="badge">ライブ予定</span></div>
      ${nextLive ? renderPhoneLiveSummary(nextLive) : `<div class="empty-panel">今後のライブ予定なし。スケジュール帳やメールから探そう。</div>`}
      <hr class="soft" />
      <div class="section-title"><h2>過去のライブ結果</h2><span class="badge">最新5件</span></div>
      ${renderLiveHistoryList(5)}
    </div>
  </div>`;
}
function renderPhoneLiveSummary(ev) {
  const v = venueById(ev.venueId);
  const meta = liveTypeMeta(ev);
  const bands = invitedBandsForEvent(ev);
  return `<div class="mail-row"><b>${ev.turn}T ${escapeHtml(ev.label || meta.label)}</b><small>${escapeHtml(v.name)} / ${escapeHtml(meta.label)}</small>${bands.length ? `<p>共演：${bands.map(b=>escapeHtml(b.name)).join(" / ")}</p>` : `<p>出演形式：${escapeHtml(meta.short)}</p>`}</div>`;
}
function renderMailScreen() {
  const mails = state.phoneMails || [];
  const selected = mails.find(m => m.id === state.activeMailId) || null;
  return `<div class="phone-screen grid">
    <div class="card phone-card mail-card">
      <div class="section-title"><h2>メール</h2><span class="badge ${unreadMailCount() ? "warn" : "good"}">${unreadMailCount()}件未読</span></div>
      <button class="phoneModeBtn ghost-btn" data-phone-mode="menu">← 携帯メニュー</button>
      <div class="mail-list subject-only">${mails.length ? mails.map(renderMailRow).join("") : `<div class="empty-panel">メールなし</div>`}</div>
    </div>
    <div class="card phone-card mail-detail-card">
      ${selected ? renderMailDetail(selected) : `<div class="empty-panel">件名を押すと本文を確認できます。既読になります。</div>`}
    </div>
  </div>`;
}
function renderMailRow(m) {
  return `<button class="mail-row mailOpenBtn ${m.kind || "info"} ${m.read ? "read" : "unread"}" data-mail-id="${escapeHtml(m.id)}">
    <b>${m.read ? "" : "● "}${escapeHtml(m.subject || "無題")}</b>
    <small>From: ${escapeHtml(m.sender || mailSenderForKind(m.kind))}</small>
    <em>${m.turn || "?"}T</em>
  </button>`;
}
function renderMailDetail(m) {
  const offerId = m.payload?.offerId;
  const offer = offerId ? (state.liveOffers || []).find(o => o.id === offerId) : null;
  const canAccept = offer && !offer.accepted && !offer.expired && offer.turn > state.turn + 1 && !liveEventForTurn(offer.turn);
  return `<div class="mail-detail">
    <div class="section-title"><h2>${escapeHtml(m.subject || "無題")}</h2><span class="badge ${m.read ? "good" : "warn"}">${m.read ? "既読" : "未読"}</span></div>
    <small>From: ${escapeHtml(m.sender || mailSenderForKind(m.kind))} / ${m.turn || "?"}T</small>
    <p>${escapeHtml(m.body || "").replace(/\n/g,"<br>")}</p>
    ${offer ? renderOfferActionsFromMail(offer, canAccept) : ""}
  </div>`;
}
function renderOfferActionsFromMail(offer, canAccept) {
  const v = venueById(offer.venueId);
  const meta = liveTypeMeta(offer);
  if (offer.accepted) return `<div class="empty-panel">この出演は参加予定に入っています。</div>`;
  if (offer.expired || !canAccept) return `<div class="empty-panel">この出演通知は期限切れ、または同じターンに別予定があります。</div>`;
  return `<div class="mail-offer-actions"><b>${offer.turn}T ${escapeHtml(meta.label)} / ${escapeHtml(v.name)}</b><div class="modal-actions"><button class="acceptOfferBtn big-action" data-offer-id="${escapeHtml(offer.id)}">参加する</button><button class="declineOfferBtn ghost-btn" data-offer-id="${escapeHtml(offer.id)}">見送る</button></div></div>`;
}
function renderSnsScreen() {
  const sns = state.snsPosts || [];
  const postedToday = state.snsLastPostTurn === state.turn;
  const hasUpcomingLive = (state.liveEvents || []).some(e => !e.cancelled && e.turn >= state.turn);
  return `<div class="phone-screen grid">
    <div class="card phone-card sns-card wide-card">
      <div class="section-title"><h2>SNS</h2><span class="badge">旧Twitter風</span></div>
      <button class="phoneModeBtn ghost-btn" data-phone-mode="menu">← 携帯メニュー</button>
      <div class="sns-compose-row">
        <button class="snsPostBtn big-action" data-sns-post="notice" ${postedToday || !hasUpcomingLive ? "disabled" : ""}>告知する</button>
        <button class="snsPostBtn ghost-btn" data-sns-post="chat" ${postedToday ? "disabled" : ""}>雑談する</button>
        <small>${postedToday ? "今日は投稿済み。投稿は1日1回まで。" : "投稿に大きな即時効果はありません。10件でSNS上手。"}</small>
      </div>
      <div class="sns-feed">${sns.length ? sns.map(renderSnsPost).join("") : `<div class="empty-panel">まだ投稿は流れていません。ライブ後やターン開始時に口コミ・流行が増えます。</div>`}</div>
    </div>
    <div class="card phone-card">
      <div class="section-title"><h2>投稿状況</h2><span class="badge ${hasSkill("sns_master") ? "good" : "warn"}">${state.snsPostCount || 0}/10</span></div>
      <p><small>投稿10件で「SNS上手」を習得。宣伝コマンドの知名度・ライブ招待率が少し上がります。</small></p>
    </div>
  </div>`;
}
function renderSnsPost(p) {
  return `<div class="sns-post ${escapeHtml(p.mood || "normal")}"><b>${escapeHtml(p.author || "@unknown")}</b><small>${p.turn || "?"}T</small><p>${escapeHtml(p.body || "")}</p></div>`;
}
function renderLiveHistoryList(limit=8) {
  const rows = (state.liveResultHistory || []).slice().reverse().slice(0, limit);
  if (!rows.length) return `<div class="empty-panel">ライブ結果はまだありません。</div>`;
  return `<div class="live-history-list">${rows.map(r => `<div class="mail-row live-history-row"><b>${escapeHtml(r.title || r.liveTypeLabel || "ライブ")}：${escapeHtml(r.rank || "-")}</b><small>${escapeHtml(r.liveTypeLabel || "ライブ")} / ${escapeHtml(r.venue?.name || r.venue || "会場")}</small><p>総合${val(r.total || 0)} / 集客${Number(r.revenue?.attendees || 0)}人（自分目当て${Number(r.revenue?.ownAudience || 0)} / 他バンド${Number(r.revenue?.partnerAudience || 0)}） / 利益${Number(r.revenue?.finalProfit || 0).toLocaleString()}円</p>${r.mannerWarning ? `<small>交流注意：${escapeHtml(r.mannerWarning)}</small>` : ""}</div>`).join("")}</div>`;
}
function openMail(mailId) {
  const mail = (state.phoneMails || []).find(m => m.id === mailId);
  if (!mail) return;
  mail.read = true;
  state.activeMailId = mailId;
  state.phoneSubView = "mail";
  render();
}
function snsPost(kind="chat") {
  if (state.snsLastPostTurn === state.turn) { log("SNS投稿は1日1回まで。", "warn"); render(); return; }
  const next = (state.liveEvents || []).find(e => !e.cancelled && e.turn >= state.turn);
  if (kind === "notice" && !next) { log("告知できるライブ予定がありません。", "warn"); render(); return; }
  if (kind === "notice") {
    const v = venueById(next.venueId);
    addSnsPost("@our_band", `${next.turn}T ${v.name}でライブあります。よかったら来てください。`, "self");
  } else {
    const samples = ["スタジオ帰りのコンビニ、だいたい何か買ってしまう。", "新しいリフ、まだ名前がないけど悪くない。", "今日の練習、最後の1回だけ妙に合った。", "ライブハウスの床の感じ、ちょっと好き。"];
    addSnsPost("@our_band", samples[rand(0, samples.length - 1)], "self");
  }
  state.snsLastPostTurn = state.turn;
  state.snsPostCount = (state.snsPostCount || 0) + 1;
  if (state.snsPostCount >= 10) unlockSkill("sns_master", "SNS投稿10件");
  log(`SNSに${kind === "notice" ? "ライブ告知" : "雑談"}を投稿した。大きな即時効果はないが、投稿10件でSNS上手に近づく。`);
  if (kind === "notice") addSnsPost("@listener_random", "告知見た。予定合えば行くかも。", "normal");
  render();
}

function renderHomeScreen() {
  const latest = firstLine(state.logs[0]);
  return `
    <div class="home-simple">
      <div class="card home-log-card">
        <div class="section-title"><h2>ログ</h2><span class="badge warn">最新</span></div>
        <div class="home-latest-log">${escapeHtml(latest)}</div>
      </div>
      ${renderQuietGuidePanel()}
      ${renderUiPrepSummaryPanel()}
      <div class="card home-menu-card command-window">
        <div class="success-window-title"><span>MENU</span><b>今週やること</b><small>画面を選ぶ</small></div>
        <div class="home-menu-grid">
          ${homeMenuButton("command", "⚡", "今週の行動へ", "練習・休憩・募集など")}
          ${homeMenuButton("band", "👥", "バンド情報", "自分/他バンド・交流確認")}
          ${homeSongMenuButton()}
          ${homeMenuButton("schedule", "📅", "スケジュール帳", canBookSchedules() ? "自主企画予約・キャンセル" : "初ライブ後に解放", !canBookSchedules())}
          ${homeMenuButton("phone", `📱${unreadMailCount() ? `<em class="nav-badge">${unreadMailCount()}</em>` : ""}`, "携帯", "メール・SNS・ライブ通知", false)}
          ${homeMenuButton("shop", "🛒", "ショップ", "回復・機材・演出アイテム")}
          ${homeMenuButton("log", "📺", "ログ", "イベント履歴を見る")}
          ${homeMenuButton("library", "📚", "図鑑", "発見済みジャンル・スキル・歴代バンド")}
        </div>
      </div>
    </div>
  `;
}


function homeMenuButton(view, icon, label, small, forceLocked=false) {
  const scheduleLock = state.scheduleTutorialStage === "needSchedule" && view !== "schedule";
  const draftLock = mustCompleteFirstDraftTutorial() && view !== "songs";
  const locked = forceLocked || draftLock || state.tutorialStage === "needSong" || (state.tutorialStage === "needCommand" && view !== "command") || scheduleLock;
  const note = draftLock ? "未完成曲を完成" : state.tutorialStage === "needSong" ? "まずは曲作り" : state.tutorialStage === "needCommand" && view !== "command" ? "先に今週の行動" : scheduleLock ? "まず予定を確認" : small;
  return `<button class="jumpTabBtn menu-tile ${locked ? "locked" : ""}" data-view="${view}" ${locked ? "disabled" : ""}><span>${icon}</span><b>${label}</b><small>${note}</small></button>`;
}
function homeSongMenuButton() {
  const forcedDraft = mustCompleteFirstDraftTutorial();
  const locked = !forcedDraft && (state.tutorialStage === "needCommand" || state.scheduleTutorialStage === "needSchedule");
  const note = forcedDraft ? "未完成曲を完成させる" : state.scheduleTutorialStage === "needSchedule" ? "まず予定を確認" : locked ? "次は行動を選ぼう" : "新曲・強化・未完成曲";
  return `<button class="openSongEditorBtn menu-tile ${locked ? "locked" : ""}" ${locked ? "disabled" : ""}><span>🎼</span><b>作詞・作曲</b><small>${note}</small></button>`;
}

function renderSavePanel() {
  return `<div class="save-panel">
    <div><b>SAVE</b><span>${saveStatusText(selectedSaveSlot)}</span></div>
    <div class="mini-actions"><button id="homeSaveBtn">セーブ</button><button id="homeLoadBtn">ロード</button></div>
    ${state.saveNotice ? `<small>${escapeHtml(state.saveNotice)}</small>` : `<small>現在のスロット：${selectedSaveSlot}。セーブ/ロード時にスロットを選べます。</small>`}
  </div>`;
}
function renderPwaPanel() {
  return `<div class="pwa-panel">
    <b>スマホ確認</b>
    <span>GitHub Pagesで開いたら、ブラウザメニューから「ホーム画面に追加」。v0.3.26は縦画面推奨。古い表示なら「最新版を読み込む」。</span><button id="pwaRefreshBtn" class="ghost-btn update-btn">最新版を読み込む</button>
  </div>`;
}

function renderSchedulePanel() {
  const upcoming = (state.liveEvents || []).filter(e => !e.cancelled && e.turn >= state.turn).sort((a,b)=>a.turn-b.turn);
  const reserved = upcoming.filter(e => !["booking_house","booking_band"].includes(e.liveType));
  const participation = upcoming.filter(e => ["booking_house","booking_band"].includes(e.liveType));
  const canBook = canBookSchedules();
  const candidates = canBook ? buildLiveCandidates() : [];
  const houseCandidates = canBook ? buildHouseEventCandidates() : [];
  const offers = (state.liveOffers || []).filter(o => !o.accepted && !o.expired && o.turn > state.turn).slice(0, 4);
  const next = upcoming[0];
  return `<div class="schedule-screen-split extended-schedule ui-prep-schedule">
    <section class="schedule-panel schedule-booked-panel">
      <div class="section-title"><h3>ライブスケジュール</h3><span class="badge good">予約/参加/過去ログを分離</span></div>
      ${next ? renderNextLiveDetail(next) : `<div class="empty-panel">今後のライブ予定なし。ライブハウスイベントか自主企画を入れよう。</div>`}
      <hr class="soft" />
      <div class="section-title"><h3>自主企画・固定予定</h3><span class="badge warn">自主企画は残り2ターン以内変更不可</span></div>
      <div class="schedule-scroll-box"><div class="schedule-list-x booked-list">
        ${reserved.map(e => renderScheduleEvent(e)).join("") || `<div class="schedule-event empty-panel">自主企画/固定予定なし</div>`}
      </div></div>
      <div class="section-title"><h3>参加予定のブッキング</h3><span class="badge good">ライブハウス/他バンド企画</span></div>
      <div class="schedule-scroll-box"><div class="schedule-list-x booked-list">
        ${participation.map(e => renderScheduleEvent(e)).join("") || `<div class="schedule-event empty-panel">参加予定なし</div>`}
      </div></div>
      <hr class="soft" />
      <h3>過去のライブ結果ログ</h3>
      ${renderLiveHistoryList(6)}
    </section>
    <section class="live-candidates-panel">
      <div class="section-title"><h3>出演通知メール</h3><span class="badge ${offers.length ? "good" : "warn"}">${offers.length ? `${offers.length}件` : "未着"}</span></div>
      <div class="live-candidate-list offer-mini-list">
        ${offers.map(renderLiveOfferMini).join("") || `<div class="empty-panel">出演通知はまだありません。宣伝・交流で届きやすくなります。</div>`}
      </div>
      <small>メールから参加可能。ブッキングは会場費ではなく参加費なので、序盤〜中盤の現実的な経験ルートです。</small>
      <hr class="soft" />
      <div class="section-title"><h3>ライブハウスイベント</h3><span class="badge ${canBook ? "good" : "warn"}">${canBook ? "自分から参加可能" : "初ライブ後に解放"}</span></div>
      <div class="live-candidate-list">
        ${canBook ? houseCandidates.map(renderLiveCandidate).join("") || `<div class="empty-panel">今ターン参加申込できるライブハウスイベントはありません。メール通知も確認してみよう。</div>` : `<div class="empty-panel">初ライブ後から、ライブハウスイベントに自分から参加できます。</div>`}
      </div>
      <hr class="soft" />
      <div class="section-title"><h3>自主企画の会場候補</h3><span class="badge ${canBook ? "good" : "warn"}">${canBook ? "ワンマン/対バン" : "初ライブ後に解放"}</span></div>
      <div class="live-candidate-list">
        ${canBook ? candidates.map(renderLiveCandidate).join("") || `<div class="empty-panel">予約可能な自主企画候補がありません。</div>` : `<div class="empty-panel">初ライブ後から、スケジュール帳で自主企画ライブを決定できます。</div>`}
      </div>
      <small>ワンマンは高難度。対バンは交流と集客の助けがある代わりに報酬は分配寄りです。</small>
    </section>
  </div>`;
}
function renderNextLiveDetail(ev) {
  const v = venueById(ev.venueId);
  const meta = liveTypeMeta(ev);
  const prep = estimatePrepScore();
  const bands = invitedBandsForEvent(ev);
  const remaining = Math.max(0, ev.turn - state.turn);
  return `<div class="next-live-detail schedule-event ${prep >= v.prepNeed ? "good" : "risk"}">
    <strong>NEXT LIVE：${ev.turn}T / あと${remaining}T</strong>
    <b>${escapeHtml(meta.label)} / ${escapeHtml(v.name)}</b>
    <span>${escapeHtml(meta.short)}・キャパ${v.capacity}・${escapeHtml(meta.feeLabel)}${eventBaseCost(ev, v).toLocaleString()}円</span>
    <small>準備 ${val(prep)} / 必要 ${v.prepNeed}${prep < v.prepNeed ? `（不足${val(v.prepNeed - prep)}）` : ""}</small>
    ${bands.length ? `<small>共演：${bands.map(b => escapeHtml(b.name)).join(" / ")}</small>` : `<small>単独/固定イベント。自分たちの集客力が重要。</small>`}
  </div>`;
}
function renderLiveOfferMini(offer) {
  const v = venueById(offer.venueId);
  const meta = liveTypeMeta(offer);
  const bands = invitedBandsForEvent(offer);
  const blocked = !!liveEventForTurn(offer.turn);
  return `<div class="schedule-event candidate ${blocked ? "risk" : "good"}">
    <b>${offer.turn}T ${escapeHtml(meta.short)}：${escapeHtml(v.name)}</b>
    <small>${escapeHtml(meta.feeLabel)}${eventBaseCost(offer, v).toLocaleString()}円 / ${bands.length ? `共演：${bands.map(b=>escapeHtml(b.name)).join(" / ")}` : "出演枠"}</small>
    <div class="modal-actions"><button class="acceptOfferBtn big-action" data-offer-id="${escapeHtml(offer.id)}" ${blocked ? "disabled" : ""}>参加</button><button class="declineOfferBtn ghost-btn" data-offer-id="${escapeHtml(offer.id)}">見送る</button></div>
  </div>`;
}

function liveRiskProfile(v) {
  const prep = estimatePrepScore();
  const diff = prep - Number(v?.prepNeed || 0);
  const fatigue = Number(state.band?.fatigue || 0);
  const funds = Number(state.band?.funds || 0);
  let label = "挑戦";
  let cls = "warn";
  if (diff >= 18 && fatigue < 60 && funds >= (v?.fee || 0) * 1.4) { label = "安全寄り"; cls = "good"; }
  else if (diff >= 0 && fatigue < 80) { label = "挑戦圏"; cls = "warn"; }
  else if (diff >= -14 || fatigue >= 80) { label = "背伸び"; cls = "warn"; }
  else { label = "危険"; cls = "bad"; }
  const notes = [];
  if (diff < 0) notes.push(`準備-${val(Math.abs(diff))}`);
  if (fatigue >= 60) notes.push(`疲労${Math.round(fatigue)}%`);
  if (funds < (v?.fee || 0)) notes.push("資金注意");
  return { label, cls, notes, diff, prep };
}
function renderRiskBadges(profile) {
  return `<span class="badge ${profile.cls}">${escapeHtml(profile.label)}</span>${(profile.notes || []).slice(0,2).map(n => `<span class="badge ${profile.cls === "bad" ? "bad" : "warn"}">${escapeHtml(n)}</span>`).join("")}`;
}

function seededPick(arr, salt=0) {
  if (!arr.length) return null;
  const seed = Math.abs(Math.sin(((state.turn || 1) * 999 + salt * 313) * 12.9898) * 43758.5453);
  return arr[Math.floor((seed - Math.floor(seed)) * arr.length) % arr.length];
}
function generateReservationCandidatesForTurn() {
  const availableVenues = VENUES.filter(v => (state.turn >= 30 || !["big_stage"].includes(v.id)) && (state.turn >= 16 || !["warehouse"].includes(v.id)));
  const openTurns = [];
  for (let t = state.turn + 3; t < (state.maxTurn || 50) && openTurns.length < 7; t++) {
    if (!liveEventForTurn(t)) openTurns.push(t);
  }
  const candidates = [];
  const usedCaps = new Set();
  for (let i = 0; i < openTurns.length && candidates.length < 4; i++) {
    const turn = openTurns[i];
    const venuePool = availableVenues.filter(v => !usedCaps.has(v.capacity) || i > 2);
    const v = seededPick(venuePool.length ? venuePool : availableVenues, i + candidates.length);
    if (!v) continue;
    usedCaps.add(v.capacity);
    const type = (i % 2 === 0) ? "self_one_man" : "self_taiban";
    const invitedCount = type === "self_taiban" ? clamp(2 + ((state.turn + i) % 3), 2, 4) : 0;
    candidates.push({ turn, venueId:v.id, liveType:type, invitedBandIds:type === "self_taiban" ? pickRivalBands(invitedCount).map(b=>b.id) : [] });
  }
  return candidates;
}
function buildLiveCandidates() {
  if (!Array.isArray(state.liveReservationCandidates) || state.reservationCandidateTurn !== state.turn) {
    state.reservationCandidateTurn = state.turn;
    state.liveReservationCandidates = generateReservationCandidatesForTurn();
  }
  return state.liveReservationCandidates.filter(c => c.turn > state.turn + 2 && !liveEventForTurn(c.turn));
}

function generateHouseEventCandidatesForTurn() {
  const availableVenues = VENUES.filter(v => v.id !== "big_stage" && (state.turn >= 14 || v.id !== "warehouse"));
  const candidates = [];
  for (let i = 2; i <= 8 && candidates.length < 3; i++) {
    const turn = state.turn + i;
    if (turn >= (state.maxTurn || 50) || liveEventForTurn(turn)) continue;
    const v = seededPick(availableVenues, i + 40);
    if (!v) continue;
    const bandCount = 2 + ((state.turn + i) % 2);
    candidates.push({ turn, venueId:v.id, liveType:"booking_house", invitedBandIds:pickRivalBands(bandCount).map(b=>b.id), houseOpen:true });
  }
  return candidates;
}
function buildHouseEventCandidates() {
  if (!Array.isArray(state.liveHouseEventCandidates) || state.liveHouseEventCandidateTurn !== state.turn) {
    state.liveHouseEventCandidateTurn = state.turn;
    state.liveHouseEventCandidates = generateHouseEventCandidatesForTurn();
  }
  return state.liveHouseEventCandidates.filter(c => c.turn > state.turn + 1 && !liveEventForTurn(c.turn));
}

function renderLiveCandidate(c) {
  const v = venueById(c.venueId);
  const ev = { ...c, fixed:false };
  const profile = liveRiskProfile(v);
  const cls = profile.cls === "good" ? "good" : profile.cls === "bad" ? "risk" : "warn";
  const meta = liveTypeMeta(ev);
  const fee = eventBaseCost(ev, v);
  const bands = invitedBandsForEvent(ev);
  return `<button class="liveCandidateBtn schedule-event candidate ${cls}" data-turn="${c.turn}" data-venue="${v.id}" data-live-type="${escapeHtml(c.liveType || "self_one_man")}" data-bands="${escapeHtml((c.invitedBandIds || []).join(","))}">
    <strong class="candidate-turn">${c.turn}ターン</strong>
    <b>${escapeHtml(meta.short)}：${escapeHtml(v.name)}</b>
    <span class="candidate-meta"><em>キャパ${v.capacity}</em><em class="fee-pill">${escapeHtml(meta.feeLabel)} ¥${fee.toLocaleString()}</em></span>
    <div class="quiet-guide-chips candidate-risk">${renderRiskBadges(profile)}<span class="badge">リスク:${escapeHtml(meta.risk)}</span></div>
    <small>要準備${v.prepNeed} / 現在${val(profile.prep)} / ${escapeHtml(audienceProfileForVenue(v).label)}</small>
    <small>${escapeHtml(meta.desc)}</small>
    ${bands.length ? `<small>候補対バン：${bands.map(b=>escapeHtml(b.name)).join(" / ")}</small>` : ""}
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
  const meta = liveTypeMeta(e);
  const cost = eventBaseCost(e, v);
  const bands = invitedBandsForEvent(e);
  const cancelBtn = canCancel ? `<button class="cancelLiveBtn ghost-btn" data-turn="${e.turn}">キャンセル</button>` : (!e.fixed ? `<small class="deadline-note">残り2ターン以内：変更不可</small>` : "");
  return `<div class="schedule-event ${cls}">
    <b>${e.turn}T ${escapeHtml(e.label || e.name || meta.short)}</b>
    <span><span class="badge good">${escapeHtml(meta.short)}</span> ${escapeHtml(meta.label)} / ${escapeHtml(v.name)}</span>
    <small>キャパ${v.capacity} / ${escapeHtml(meta.feeLabel)}${cost.toLocaleString()}円 / 要準備${v.prepNeed}</small>
    ${bands.length ? `<small>共演：${bands.map(b=>escapeHtml(b.name)).join(" / ")}</small>` : ""}
    <em>${status}：現在準備${val(prep)}</em>
    ${cancelBtn}
  </div>`;
}
function estimatePrepScore() {
  const originals = state.songs.filter(s=>!s.isCover).length;
  const avgRec = avg(state.songs.map(s=>s.recognition));
  return state.band.fame * 0.35 + state.band.fans * 0.20 + state.band.industry * 0.30 + state.band.trust * 0.18 + originals * 4 + avgRec * 0.20 + equipmentPrepBonus();
}

function inviteChanceBonus() {
  const promo = Number(state.bookingInviteBoostTurns || 0) > 0 ? 0.16 : 0;
  const fame = clamp(Number(state.band?.fame || 0) / 700, 0, 0.18);
  const relation = clamp(avg(Object.values(state.rivalRelations || {}).map(Number)) / 250, 0, 0.12);
  return promo + fame + relation;
}
function processNewTurnNotifications(reason="turn") {
  if (!canBookSchedules() || state.turn >= state.maxTurn) return;
  state.notificationTurns = Array.isArray(state.notificationTurns) ? state.notificationTurns : [];
  if (state.notificationTurns.includes(state.turn)) return;
  state.notificationTurns.push(state.turn);
  if ((state.bookingInviteBoostTurns || 0) > 0) state.bookingInviteBoostTurns -= 1;
  const chance = clamp(0.32 + inviteChanceBonus(), 0.18, 0.75);
  if (Math.random() < chance) generateLiveOffer(reason);
  if (Math.random() < 0.42) generateSnsTrendPost();
}
function firstOpenTurn(from=3) {
  for (let i = from; i <= from + 7; i++) {
    const t = state.turn + i;
    if (t < (state.maxTurn || 50) && !liveEventForTurn(t)) return t;
  }
  return 0;
}
function generateLiveOffer(reason="turn") {
  const turn = firstOpenTurn(rand(3, 6));
  if (!turn) return null;
  const venuePool = VENUES.filter(v => v.id !== "big_stage" && (state.turn >= 16 || v.id !== "warehouse"));
  const v = venuePool[rand(0, venuePool.length - 1)] || VENUES[0];
  const type = Math.random() < (0.45 + inviteChanceBonus()) ? "booking_band" : "booking_house";
  const bands = type === "booking_band" ? pickRivalBands(1 + (Math.random() < 0.35 ? 1 : 0)) : pickRivalBands(2 + (Math.random() < 0.35 ? 1 : 0));
  const offer = { id:`offer_${state.turn}_${Date.now()}_${Math.floor(Math.random()*9999)}`, turn, venueId:v.id, liveType:type, invitedBandIds:bands.map(b=>b.id), accepted:false, createdTurn:state.turn };
  state.liveOffers = Array.isArray(state.liveOffers) ? state.liveOffers : [];
  state.liveOffers.unshift(offer);
  state.liveOffers = state.liveOffers.slice(0, 12);
  const meta = liveTypeMeta(type);
  const fee = eventBaseCost(offer, v);
  addMail(`${meta.short}の出演通知`, `${turn}ターン目、${v.name}の${meta.short}に出演できます。
${meta.feeLabel}：${fee.toLocaleString()}円
共演：${bands.map(b=>b.name).join(" / ") || "ライブハウスイベント枠"}
携帯のメールから参加できます。`, "live_offer", { offerId:offer.id, sender: type === "booking_band" ? (bands[0]?.name || "対バン企画担当") : `${v.name} 店長` });
  addSnsPost("@livehouse_info", `${turn}T ${v.name}で${meta.short}あり。若手バンドの出演枠、まだ動いてるっぽい。`, "event");
  log(`携帯にライブ出演通知が届いた：${turn}T ${v.name} / ${meta.short}`, "event");
  return offer;
}
function generateSnsTrendPost() {
  const roll = Math.random();
  if (roll < 0.34) {
    const general = [
      ["@listener_014", "駅裏のライブハウス、名前知らんバンドが急に良かったりするから油断できん。"],
      ["@coffee_after_show", "終演後の缶コーヒーが一番うまい日ある。"],
      ["@noise_walker", "最近、短い曲で一気に持っていくバンド増えた気がする。"],
      ["@ticket_stub", "小箱のスピーカー前、耳終わるけどやめられない。"]
    ];
    const [a,b] = general[rand(0,general.length-1)];
    addSnsPost(a,b,"normal");
    return;
  }
  if (roll < 0.67) {
    const b = RIVAL_BANDS[rand(0, RIVAL_BANDS.length-1)];
    addSnsPost(`@${b.id}`, `${b.name} 次の企画に向けて対バン探し中。${b.genre}寄りの夜にしたい。`, "event");
    return;
  }
  const genres = ["青春パンク", "メロディックパンク", "オルタナロック", "エモ", "ポップパンク", "ガレージロック"];
  const words = ["夜", "焦燥", "帰り道", "ネオン", "叫び", "青春", "革命", "居場所"];
  const g = genres[rand(0, genres.length - 1)];
  const w = words[rand(0, words.length - 1)];
  addSnsPost("@underground_feed", `今週、${g}と「${w}」っぽい歌詞の反応が少し良い。ライブ後の口コミもその辺りに寄ってる。`, "trend");
}
function acceptLiveOffer(offerId) {
  const offer = (state.liveOffers || []).find(o => o.id === offerId);
  if (!offer) { log("対象の出演通知が見つからない。", "warn"); render(); return; }
  if (liveEventForTurn(offer.turn)) { offer.expired = true; log("そのターンは既に別のライブ予定があるため、出演通知を見送った。", "warn"); render(); return; }
  const v = venueById(offer.venueId);
  const meta = liveTypeMeta(offer);
  const ev = { ...makeLiveEventRecord(offer.turn, offer.venueId, offer.liveType, offer.invitedBandIds), offerId:offer.id, accepted:true };
  if (!addLiveEventPreservingSchedule(ev)) { offer.expired = true; log("そのターンは既に別のライブ予定があるため、出演通知を見送った。", "warn"); render(); return; }
  offer.accepted = true;
  log(`${offer.turn}Tの「${meta.label} / ${v.name}」に参加することにした。${meta.feeLabel}${eventBaseCost(ev, v).toLocaleString()}円。`, "event");
  addSnsPost("@our_band", `${offer.turn}T ${v.name}、出演決定。${meta.short}で一本やります。`, "self");
  render();
}
function declineLiveOffer(offerId) {
  const offer = (state.liveOffers || []).find(o => o.id === offerId);
  if (offer) offer.expired = true;
  log("出演通知を見送った。", "info");
  render();
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
        <div class="coach-line quiet"><b>状況</b><span>${quietGuideLine()}</span><div class="quiet-guide-chips inline">${renderGuideChips(2)}</div></div>
        ${renderCommandCards()}
        ${currentApplicantList().length ? renderApplicantList() : ""}
      </div>
      <div class="card">
        <div class="section-title"><h2>作詞・作曲</h2><span class="badge ${state.songcraftUsedThisTurn ? "bad" : "good"}">${state.songcraftUsedThisTurn ? "本日制作済み" : "今ターン未実行"}</span></div>
        <p><small>プルダウンではなく、曲エディタを開いて、メインジャンル2択から曲を作ります。</small></p>
        <button class="openSongEditorBtn big-action">曲エディタを開く</button>
        <hr class="soft" />
        <h2>イベント進行</h2>
        <div class="event-box"><b>NEXT EVENT</b><span>${state.turn < state.nextLiveTurn ? `${state.nextLiveTurn}ターン目：${currentLiveName()}` : "GRAND UNDER FES"}</span></div>
        <p>${state.turn < state.nextLiveTurn ? `あと${turnsUntilNextLive()}ターンでライブ。本番までに仲間・曲・資金・疲労を整える。` : "GRAND UNDER FESに向けて、B評価以上＋条件達成を狙う。"}</p>
      </div>
    </div>
  `;
}

function renderBandScreen() {
  const active = activeMembers();
  const upkeep = memberUpkeepCost();
  return `
    <div class="grid band-grid">
      <div class="card">
        <div class="section-title"><h2>${escapeHtml(state.band.name || "自身のバンド")} 情報</h2><span class="badge good">自分たち</span></div>
        <p><small>バンド編成・主人公スキル・バンド名変更をここで確認します。改名すると認知度がごく少し下がります。UI本格改修時は「自身のバンド情報」「ほかのバンド情報」に分岐予定。</small></p>
        <div class="kv"><b>バンド名</b><span>${escapeHtml(state.band.name || "未定")}</span><b>ファン</b><span>${state.band.fans}</span><b>知名度</b><span>${state.band.fame}</span><b>業界評価</b><span>${state.band.industry}</span><b>維持費目安</b><span>¥${upkeep.toLocaleString()}</span></div>
        <button id="renameBandBtn" class="ghost-btn">バンド名を変更</button>
        <hr class="soft" />
        <div class="section-title"><h3>バンド編成</h3><span class="badge">${active.length}人</span></div>
        <div class="band-stage">${active.map(renderMemberStageSlot).join("")}</div>
        ${renderBandMenu()}
        <hr class="soft" />
        ${renderPlayerSkillPanel()}
      </div>
      <div class="card">
        <div class="section-title"><h2>ほかのバンド情報</h2><span class="badge">交流/予定</span></div>
        ${renderRivalBandDirectory()}
      </div>
      <div class="card">
        <div class="section-title"><h2>加入候補</h2><span class="badge">募集・紹介で出現</span></div>
        ${currentApplicantList().length ? renderApplicantList() : `<p><small>募集・宣伝・他バンド込みの打ち上げで候補が出たら、ここに加入選択が表示されます。</small></p>`}
        <div class="candidate-cloud">${state.candidates.map(c => `<span class="badge">${c.name} / ${c.part}</span>`).join(" ")}</div>
      </div>
    </div>
  `;
}
function renderRivalBandDirectory(limit=99) {
  const groups = [1,2,3,4,5,6].map(lv => {
    const items = RIVAL_BANDS.filter(b => b.level === lv).slice(0, limit).map(b => renderRivalBandCard(b)).join("");
    return items ? `<div class="rival-band-tier"><h3>Lv${lv} ${lv <= 2 ? "地元・常連" : lv <= 4 ? "中堅〜格上" : "有名・強豪"}</h3>${items}</div>` : "";
  }).join("");
  return `<div class="rival-band-list grouped">${groups}</div>`;
}
function rivalBandUpcomingText(id) {
  const ev = (state.liveEvents || []).find(e => !e.cancelled && e.turn >= state.turn && (e.invitedBandIds || []).includes(id));
  if (ev) return `${ev.turn}T ${liveTypeMeta(ev).short}`;
  const offer = (state.liveOffers || []).find(o => !o.accepted && !o.expired && o.turn > state.turn && (o.invitedBandIds || []).includes(id));
  if (offer) return `${offer.turn}T 出演通知あり`;
  return "予定未確認";
}
function rivalInviteReason(b) {
  const rel = relationshipWithBand(b.id);
  const power = popularity() + Number(state.band?.industry || 0) * 0.7 + Number(state.band?.trust || 0);
  if (rel <= -25) return "交流が悪化していて来てくれにくい";
  if (b.fame <= power + 55 + Math.max(0, rel)) return "対バン候補に入る";
  if (rel >= 20) return "交流が深く、格上でも候補に入りうる";
  return `まだ格上。認知度/業界評価/交流がもう少し必要（目安差${Math.max(0, Math.round(b.fame - power))}）`;
}
function renderRivalBandCard(b) {
  const rel = relationshipWithBand(b.id);
  const relCls = rel >= 25 ? "good" : rel < 0 ? "bad" : "warn";
  const canInvite = rel > -25 && b.fame <= popularity() + 55 + Math.max(0, rel);
  const next = rivalBandUpcomingText(b.id);
  return `<div class="rival-band-card dict-row ${canInvite ? "" : "locked"}">
    <b>${escapeHtml(b.name)}</b><span class="badge ${relCls}">交流${rel}</span><span class="badge">知名度${b.fame}</span><span class="badge">集客${b.audience}</span><span class="badge ${canInvite ? "good" : "warn"}">${canInvite ? "候補" : "遠い"}</span>
    <small>${escapeHtml(b.genre)} / ${escapeHtml(b.mood)}</small>
    <small>今後:${escapeHtml(next)} / ${escapeHtml(rivalInviteReason(b))}</small>
  </div>`;
}


function renderMemberStageSlot(m, slotIndex=0) {
  const role = m.id === "player" ? "主人公" : (m.joinStatus || "本加入");
  const active = state.selectedMemberId === m.id ? "selected" : "";
  const memberIndex = slotIndex - 1;
  const actions = m.id === "player" ? `<small>主人公 / 詳細はカード内表示</small>` : `<div class="stage-actions"><button class="moveMemberBtn" data-index="${memberIndex}" data-dir="up">前へ</button><button class="moveMemberBtn" data-index="${memberIndex}" data-dir="down">後へ</button><button class="dismissMemberBtn danger" data-index="${memberIndex}">脱退</button></div>`;
  return `<div class="stage-slot ${active}"><button class="stage-main selectMemberBtn" data-member-id="${m.id}"><div class="avatar">${initials(m.name)}</div><div><b>${m.name}</b><small>${role} / ${m.part}</small><span class="badge warn">${m.mainGenre}</span></div></button>${actions}</div>`;
}

function renderReserveCard(m, memberIndex) {
  return `<div class="reserve-card"><div>${renderCompactMember(m)}<small>控え${m.reserveTurns || 0}T ${m.reserveWarned ? " / 離脱前報告あり" : ""}</small></div><div class="draft-actions"><button class="bringReserveBtn" data-index="${memberIndex}">構成へ入れる</button><button class="moveMemberBtn" data-index="${memberIndex}" data-dir="up">前へ</button><button class="dismissMemberBtn danger" data-index="${memberIndex}">脱退</button></div></div>`;
}

function renderManageMemberCard(m, idx) {
  const isActive = true;
  return `<div class="manage-card active">
    ${renderMemberCard(m)}
    <div class="member-actions"><span class="badge good">構成内</span><span class="badge">${m.joinStatus || "本加入"}</span><button class="moveMemberBtn" data-index="${idx}" data-dir="up">前へ</button><button class="moveMemberBtn" data-index="${idx}" data-dir="down">後へ</button><button class="dismissMemberBtn danger" data-index="${idx}">脱退</button></div>
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
          <div class="song-sort-row"><label>並び替え</label><select id="songSortSelect"><option value="total" ${state.songSortMode === "total" ? "selected" : ""}>総合値順</option><option value="new" ${state.songSortMode === "new" ? "selected" : ""}>新曲順</option><option value="plays" ${state.songSortMode === "plays" ? "selected" : ""}>使用回数順</option><option value="mannerism" ${state.songSortMode === "mannerism" ? "selected" : ""}>マンネリ危険順</option><option value="standard" ${state.songSortMode === "standard" ? "selected" : ""}>定番曲順</option></select></div>
          ${sortSongsForDisplay(state.songs, state.songSortMode || "total").map(renderSongCard).join("")}
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
  const hasB = state.liveResultHistory.some(r => r.rank === "B" || r.rank === "A" || r.rank === "S");
  const hasA = state.liveResultHistory.some(r => r.rank === "A" || r.rank === "S");
  const hasBigSuccess = state.liveResultHistory.some(r => r.venueId === "big_stage" && (r.rank === "A" || r.rank === "S"));
  const repCount = state.songs.filter(s => hasTag(s,"代表曲候補") || hasTag(s,"定番")).length;
  const freshCount = state.songs.filter(s => !s.isCover && (s.livePlays || 0) <= 1 && state.turn - (s.createdTurn || 0) <= 10).length;
  return `<div class="goal-board compact-goals">
    <p><small>30ターン目は中間目標の UNDER FES。50ターン目は、さらに難しい GRAND UNDER FES を目指す。</small></p>
    <h3>30T：UNDER FES 目安</h3>
    <div class="goal-grid">
      ${goalChip("B評価以上", hasB)}
      ${goalChip("ファン60", state.band.fans >= 60, state.band.fans)}
      ${goalChip("知名度60", state.band.fame >= 60, state.band.fame)}
      ${goalChip("業界評価55", state.band.industry >= 55, state.band.industry)}
      ${goalChip("オリジナル5曲", originalCount >= 5, `${originalCount}曲`)}
    </div>
    <h3>50T：GRAND UNDER FES 目安</h3>
    <div class="goal-grid">
      ${goalChip("A評価以上", hasA)}
      ${goalChip("大箱成功", hasBigSuccess)}
      ${goalChip("ファン180", state.band.fans >= 180, state.band.fans)}
      ${goalChip("知名度150", state.band.fame >= 150, state.band.fame)}
      ${goalChip("業界評価135", state.band.industry >= 135, state.band.industry)}
      ${goalChip("代表/定番2曲", repCount >= 2, `${repCount}曲`)}
      ${goalChip("新しめの曲1曲", freshCount >= 1, `${freshCount}曲`)}
    </div>
  </div>`;
}


function openSongEditor(step="menu") {
  state.view = "songs";
  state.songEditor = { step: mustCompleteFirstDraftTutorial() ? "composeMenu" : step };
  render();
}
function resetSongEditor() { state.songEditor = { step: "menu" }; }
function editorData() { if (!state.songEditor) state.songEditor = { step:"menu" }; return state.songEditor; }
function craftLevelSummaryHtml() {
  const lyricsLv = craftLevel("lyrics");
  const musicLv = craftLevel("music");
  const lyricsXp = state.playerCraft?.lyricsXp || 0;
  const musicXp = state.playerCraft?.musicXp || 0;
  const free = state.freeSongcraftCharge || 0;
  const freeText = free ? ` / ひらめき${free}回` : "";
  const lyricFree = lyricsLv >= 2 ? Math.round((lyricsLv - 1) * 2) : 0;
  const musicFree = musicLv >= 2 ? Math.round((musicLv - 1) * 2) : 0;
  return `<div class="songcraft-level-panel"><span class="badge good">作詞Lv${lyricsLv}（${lyricsXp}回）</span><span class="badge good">作曲Lv${musicLv}（${musicXp}回）</span><span class="badge warn">疲労軽減：各Lvぶん</span><span class="badge">疲労なし確率：詞${lyricFree}% / 曲${musicFree}%${freeText}</span></div>`;
}
function memberCraftSmall(m, type, ed={}) {
  const base = type === "lyrics" ? derivedLyrics(m) : derivedMusic(m);
  const fit = genreFit(m, ed.mainGenreA || ed.mainGenre || m.mainGenre || MAIN_GENRES[0], ed.subGenre || "");
  const role = type === "lyrics" ? "作詞" : "作曲";
  const main = type === "lyrics" ? "歌詞/表現" : "演奏/メロディ";
  return `${m.part} / 得意:${m.mainGenre} / ${role}力${val(base)} / 適性${val(fit)} / ${main}`;
}
function songTotalScore(s) { return val(((s.catchy||0)+(s.tempo||0)+(s.recognition||0)+(s.lyrics||0)+(s.performance||0)+(s.trend||0))/6); }
function songRecommendTags(song, context={}) {
  if (!song) return [];
  const tags = [];
  const usage = songUsageInfo(song);
  if (hasTag(song,"定番")) tags.push("定番曲");
  if (hasTag(song,"代表曲候補")) tags.push("代表曲候補");
  if (!song.isCover && songIsNewForSetlist(song)) tags.push("新曲ボーナスあり");
  if ((song.mannerism||0) >= 25 || usage.consecutive >= 3) tags.push("マンネリ注意");
  if (context.audience && audienceGenreFit(song, context.audience) >= 1.12) tags.push("客層に合う");
  if (context.slot && scoreSongSlot(song, context.slot) >= 48) tags.push(`${context.slot}曲目向き`);
  if (songTotalScore(song) >= 65) tags.push("強曲");
  return tags.slice(0,5);
}
function audienceGenreFit(song, audience) {
  const label = typeof audience === "string" ? audience : audience?.label || "";
  const g = `${song.mainGenre||""} ${song.subGenre||""} ${song.genre||""} ${(song.tags||[]).join(" ")}`;
  if (/コア|激し/.test(label) && /(パンク|ハードコア|メタル|ミクスチャー|スクリーモ)/.test(g)) return 1.18;
  if (/初見|外部|フェス/.test(label) && /(ポップ|ロック|ギターポップ|定番|キャッチー)/.test(g)) return 1.16;
  if (/友人|身内/.test(label) && /(新曲|青春|パンク|ロック)/.test(g)) return 1.10;
  if (/業界/.test(label) && /(個性|エモ|オルタナ|ミクスチャー|エレクトロ)/.test(g)) return 1.15;
  return .96;
}
function livePrepAutoHints(setlist, venue, audience) {
  const originals = setlist.filter(s => s && !s.isCover);
  const fresh = originals.filter(songIsNewForSetlist).length;
  const standard = originals.filter(s => hasTag(s,"定番") || hasTag(s,"代表曲候補")).length;
  const man = setlist.filter(s => (s?.mannerism||0) >= 25 || songUsageInfo(s).consecutive >= 3).length;
  const hints = [];
  if (fresh < 1) hints.push("新曲を1曲入れると話題性が出そう。");
  if (standard < 1) hints.push("定番曲か代表曲候補を1曲入れると安定しやすい。");
  if (man) hints.push("マンネリ注意の曲がある。曲順変更か別曲を検討。");
  if (audience) hints.push(`この客層には ${audience.detail || audience.label} を意識したセトリが刺さりやすい。`);
  if (venue?.id === "big_stage" && originals.length < 4) hints.push("大きい会場はコピー曲頼みだと評価が伸びにくい。");
  return hints.slice(0,4);
}
function sortSongsForDisplay(list, mode="total", context={}) {
  const arr = [...list];
  const score = s => {
    if (mode === "new") return (s.createdTurn || 0) + (songIsNewForSetlist(s) ? 1000 : 0);
    if (mode === "plays") return songUsageInfo(s).total;
    if (mode === "mannerism") return (s.mannerism||0) + songUsageInfo(s).consecutive*8;
    if (mode === "standard") return (hasTag(s,"定番")?1000:0) + (hasTag(s,"代表曲候補")?500:0) + (s.standardPoints||0);
    if (mode === "audience") return songTotalScore(s) * audienceGenreFit(s, context.audience) + (context.slot ? scoreSongSlot(s, context.slot) : 0);
    return songTotalScore(s);
  };
  return arr.sort((a,b) => score(b) - score(a));
}
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
  if ((state.band?.fatigue || 0) >= 100) {
    return `<div class="garage-closed"><div class="section-title"><h2>曲エディタ</h2><span class="badge bad">疲労限界</span></div><div class="garage-door">GARAGE CLOSED</div><p><small>疲労が100％です。休憩やドリンクで回復してから曲作りできます。</small></p>${state.lastSongcraftResult ? `<div class="editor-summary mini"><b>直近の制作</b><span>${escapeHtml(state.lastSongcraftResult.title || "曲作り")}</span><span>${escapeHtml(state.lastSongcraftResult.body || "")}</span></div>` : ""}<button class="jumpTabBtn big-action garage-home-btn" data-view="home">ホームに戻る</button></div>`;
  }
  if (ed.step === "closed") {
    return `<div class="section-title"><h2>曲エディタ</h2><span class="badge good">今ターン未実行</span></div><p><small>新曲作成・曲強化・未完成曲の続きはここから進めます。曲作り系は1ターン1回まで。</small></p><button class="songEditorChoiceBtn big-action" data-action="editor:menu">曲エディタを開く</button>`;
  }
  const title = songEditorTitle(ed);
  return `<div class="song-editor">
    <div class="section-title"><h2>${title}</h2><span class="badge ${used ? "bad" : "good"}">${used ? "今ターン実行済み" : "今ターン未実行"}</span></div>
    ${craftLevelSummaryHtml()}
    ${renderSongEditorStep(ed)}
  </div>`;
}
function songEditorTitle(ed) {
  const map = {
    menu:"曲エディタ",
    composeMenu:"曲作成",
    newType:"新曲作成",
    newLyricsMember:"新曲：作詞者",
    newLyricWords:"新曲：作詞",
    newMusicMember:"新曲：作曲者",
    newMain1:"新曲：ジャンル1",
    newMain2:"新曲：ジャンル2",
    newArrange:"新曲：アレンジ",
    newMusicConfirm:"新曲：作曲確認",
    draftSelect:"未完成曲",
    draftType:"未完成曲：続き",
    draftLyricsMember:"未完成曲：作詞者",
    draftLyricWords:"未完成曲：作詞",
    draftMusicMember:"未完成曲：作曲者",
    draftMain1:"未完成曲：ジャンル1",
    draftMain2:"未完成曲：ジャンル2",
    draftMusicArrange:"未完成曲：アレンジ",
    draftMusicConfirm:"未完成曲：作曲確認",
    draftFinalize:"曲完成前確認",
    arrangeMenu:"編曲",
    boostSong:"曲強化：曲選択",
    boostConfirm:"曲強化確認",
    editSong:"曲編集：曲選択",
    editForm:"曲編集"
  };
  return map[ed.step] || "曲エディタ";
}
function editorBackButton() { return `<button class="songEditorChoiceBtn ghost-btn editor-back-btn" data-action="editor:back">← 戻る</button>`; }
function lyricWordsFromText(text="") { return String(text || "").split(/[、,\s/]+/).filter(Boolean).slice(0,3); }
function renderLyricWordInputs(words=[]) {
  return `<div class="lyric-word-grid clear-lyric-grid">${[1,2,3].map(i=>`<div class="lyric-word-row"><label>${i}語目</label><div class="title-input-row"><input id="editorKeywordInput${i}" value="${escapeHtml(words[i-1] || "")}" placeholder="${i===1 ? "例：午前二時" : i===2 ? "例：コンビニ前" : "例：まだ鳴ってる"}" /><button class="keywordDiceBtn" data-target="${i}" type="button">🎲</button></div></div>`).join("")}</div>`;
}
function draftProgressSmall(d) {
  return `${d.lyricsDone ? "作詞済" : "作詞未"} / ${d.musicDone ? "作曲済" : "作曲未"} / ${escapeHtml(genreDisplay(d))}${d.arrange ? " / " + escapeHtml(d.arrange) : ""}`;
}
function provisionalDraftTitle(type, ed) {
  if (type === "lyrics") return makeTitle(ed.keyword || "新しい言葉", ed.theme || "---");
  return `未完成曲${(state.pendingDrafts || []).length + 1}`;
}
function statSliderRows(song) {
  const stats = ["catchy","tempo","recognition","lyrics","performance","trend"];
  return `<div class="pt-slider-list">${stats.map(k=>`<div class="pt-slider-row"><label>${statSongLabel(k)} <small>現在${val(song[k]||0)}</small></label></div>`).join("")}</div>`;
}
function renderSongEditorStep(ed) {
  if (mustCompleteFirstDraftTutorial()) {
    const draftSteps = ["composeMenu","draftSelect","draftType","draftLyricsMember","draftLyricWords","draftMusicMember","draftMain1","draftMain2","draftMusicArrange","draftMusicConfirm","draftFinalize"];
    if (!draftSteps.includes(ed.step)) ed.step = "composeMenu";
  }
  if (ed.step === "menu") {
    return `<div class="choice-grid main-choice-grid">
      ${choiceButton("<span>🎼</span><b>曲作成</b>", "compose:menu", "", "新曲作成・未完成曲の続き")}
      ${choiceButton("<span>🎛️</span><b>編曲</b>", "arrange:menu", state.songs.length ? "" : "disabled", "曲強化・曲編集")}
    </div>`;
  }
  if (ed.step === "composeMenu") {
    const hasDrafts = state.pendingDrafts.length > 0;
    const tutorialTargets = firstDraftTutorialTargets();
    if (tutorialTargets.length) {
      return `<div class="editor-summary tutorial-box"><b>2ターン目：未完成曲を完成させよう</b><span>ホームから作詞・作曲を開き、1ターン目の未完成曲を選ぼう。作っていない作詞/作曲を進めると曲が完成します。</span></div><div class="choice-grid song-choice">${tutorialTargets.map(d=>choiceButton(`<b>${escapeHtml(d.titleHint)}</b>`, `draft:select:${d.id}`, "", draftProgressSmall(d))).join("")}</div>`;
    }
    return `<div class="choice-grid main-choice-grid">
      ${choiceButton("<span>🆕</span><b>新曲作成</b>", "new:start", "", "作詞か作曲から始める")}
      ${state.pendingDrafts.map(d=>choiceButton(`<span>📝</span><b>${escapeHtml(d.titleHint)}</b>`, `draft:select:${d.id}`, "", draftProgressSmall(d))).join("")}
      ${!hasDrafts ? `<div class="empty-panel">未完成曲はありません。</div>` : ""}
    </div>${editorBackButton()}`;
  }
  if (ed.step === "newType") {
    return `<div class="editor-summary mini"><b>新曲作成</b><span>先に作詞か作曲を作る。作詞と作曲が揃うと、曲名とテーマを決めて完成します。</span></div><div class="choice-grid">${choiceButton("<b>作詞</b>", "new:type:lyrics", "", "作詞者と歌詞3語を決める")}${choiceButton("<b>作曲</b>", "new:type:music", "", "作曲者・ジャンル2つ・アレンジを決める")}</div>${editorBackButton()}`;
  }
  if (ed.step === "newLyricsMember") return `<p><small>作詞者を選択。作詞力・得意ジャンルが歌詞完成度に影響します。</small></p><div class="choice-grid member-choice">${activeMembers().map(m=>choiceButton(`<b>${m.name}</b>`, `new:lyricsMember:${m.id}`, "", memberCraftSmall(m, "lyrics", ed))).join("")}</div>${editorBackButton()}`;
  if (ed.step === "newLyricWords") {
    const words = lyricWordsFromText(ed.keyword || "");
    const preview = ed.keyword ? keywordPreview(ed.keyword, ed.theme) : "3つの歌詞ワードを入れてください。未登録ワードも個性として扱います。";
    return `<div class="editor-form keyword-form"><label>歌詞の単語を3つ入力</label>${renderLyricWordInputs(words)}<button class="songEditorNextBtn big-action" data-action="new:lyricsExecute">作詞を完了する</button><div class="keyword-preview">${preview}</div>${editorBackButton()}</div>`;
  }
  if (ed.step === "newMusicMember") return `<p><small>作曲者を選択。作曲力・ジャンル適性が曲の演奏/テンポに影響します。</small></p><div class="choice-grid member-choice">${activeMembers().map(m=>choiceButton(`<b>${m.name}</b>`, `new:musicMember:${m.id}`, "", memberCraftSmall(m, "music", ed))).join("")}</div>${editorBackButton()}`;
  if (ed.step === "newMain1") return `<div class="choice-grid genre-choice">${availableMainGenres().map(g=>choiceButton(`<b>${g}</b>`, `new:main1:${g}`)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "newMain2") return `<div class="editor-summary mini"><b>1つ目</b><span>${ed.mainGenreA || "-"}</span></div><div class="choice-grid genre-choice">${availableMainGenres().map(g=>choiceButton(`<b>${g}</b>`, `new:main2:${g}`)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "newArrange") return `<div class="editor-summary mini"><b>ジャンル狙い</b><span>${ed.mainGenreA || "-"} → ${ed.mainGenreB || "-"}</span><span>${ed.mainGenreA && ed.mainGenreB ? genrePlanLabel(ed.mainGenreA, ed.mainGenreB, ed.arrange || "") : ""}</span></div><div class="choice-grid compact-choice-grid arrange-choice">${ARRANGES.map(x=>choiceButton(`<b>${x}</b>`, `new:arrange:${x}`)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "newMusicConfirm") return `<div class="editor-summary"><b>作曲確認</b><span>作曲者：${escapeHtml(activeMembers().find(m=>m.id===ed.memberId)?.name || "-")}</span><span>ジャンル：${ed.mainGenreA || "-"} → ${ed.mainGenreB || "-"}</span><span>アレンジ：${ed.arrange || "-"}</span><span>派生確率：${ed.mainGenreA && ed.mainGenreB ? genrePlanLabel(ed.mainGenreA, ed.mainGenreB, ed.arrange || "") : "-"}</span></div><button class="songEditorNextBtn big-action" data-action="new:musicExecute">作曲を完了する</button>${editorBackButton()}`;
  if (ed.step === "draftSelect") return `<div class="choice-grid song-choice">${state.pendingDrafts.map(d=>choiceButton(`<b>${escapeHtml(d.titleHint)}</b>`, `draft:select:${d.id}`, "", draftProgressSmall(d))).join("") || `<div class="empty-panel">制作中の曲はありません。</div>`}</div>${editorBackButton()}`;
  if (ed.step === "draftType") {
    const d = state.pendingDrafts.find(x=>x.id===ed.draftId);
    if (!d) return `<div class="empty-panel">制作中の曲が見つかりません。</div>${editorBackButton()}`;
    return `<div class="editor-summary mini"><b>${escapeHtml(d.titleHint)}</b><span>${draftProgressSmall(d)}</span><span>作成済みの項目は押せません。未作成の作詞/作曲だけ進められます。</span></div><div class="choice-grid">${choiceButton("<b>作詞</b>", "draft:type:lyrics", d.lyricsDone ? "disabled" : "", d.lyricsDone ? "作詞済み" : "未作成")}${choiceButton("<b>作曲</b>", "draft:type:music", d.musicDone ? "disabled" : "", d.musicDone ? "作曲済み" : "未作成")}</div>${editorBackButton()}`;
  }
  if (ed.step === "draftLyricsMember") return `<p><small>作詞者を選択。</small></p><div class="choice-grid member-choice">${activeMembers().map(m=>choiceButton(`<b>${m.name}</b>`, `draft:lyricsMember:${m.id}`, "", memberCraftSmall(m, "lyrics", state.pendingDrafts.find(x=>x.id===ed.draftId)||ed))).join("")}</div>${editorBackButton()}`;
  if (ed.step === "draftLyricWords") {
    const d = state.pendingDrafts.find(x=>x.id===ed.draftId) || {};
    const words = lyricWordsFromText(ed.keyword || d.keyword || "");
    return `<div class="editor-form keyword-form"><label>歌詞の単語を3つ入力</label>${renderLyricWordInputs(words)}<button class="songEditorNextBtn big-action" data-action="draft:lyricsExecute">作詞を完了する</button><div class="keyword-preview">${keywordPreview(words.join(" "), d.theme || "")}</div>${editorBackButton()}</div>`;
  }
  if (ed.step === "draftMusicMember") return `<p><small>作曲者を選択。</small></p><div class="choice-grid member-choice">${activeMembers().map(m=>choiceButton(`<b>${m.name}</b>`, `draft:musicMember:${m.id}`, "", memberCraftSmall(m, "music", state.pendingDrafts.find(x=>x.id===ed.draftId)||ed))).join("")}</div>${editorBackButton()}`;
  if (ed.step === "draftMain1") return `<div class="choice-grid genre-choice">${availableMainGenres().map(g=>choiceButton(`<b>${g}</b>`, `draft:main1:${g}`)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "draftMain2") return `<div class="editor-summary mini"><b>1つ目</b><span>${ed.mainGenreA || "-"}</span></div><div class="choice-grid genre-choice">${availableMainGenres().map(g=>choiceButton(`<b>${g}</b>`, `draft:main2:${g}`)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "draftMusicArrange") return `<div class="editor-summary mini"><b>ジャンル狙い</b><span>${ed.mainGenreA || "-"} → ${ed.mainGenreB || "-"}</span></div><div class="choice-grid compact-choice-grid arrange-choice">${ARRANGES.map(x=>choiceButton(`<b>${x}</b>`, `draft:arrange:${x}`)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "draftMusicConfirm") return `<div class="editor-summary"><b>作曲確認</b><span>ジャンル：${ed.mainGenreA || "-"} → ${ed.mainGenreB || "-"}</span><span>アレンジ：${ed.arrange || "-"}</span><span>派生確率：${ed.mainGenreA && ed.mainGenreB ? genrePlanLabel(ed.mainGenreA, ed.mainGenreB, ed.arrange || "") : "-"}</span></div><button class="songEditorNextBtn big-action" data-action="draft:musicExecute">作曲を完了する</button>${editorBackButton()}`;
  if (ed.step === "draftFinalize") {
    const d = state.pendingDrafts.find(x => x.id === ed.draftId);
    if (!d) return `<div class="empty-panel">完成確認中の曲が見つかりません。</div>${editorBackButton()}`;
    const themeOptions = availableThemes().map(t => `<option value="${escapeHtml(t)}" ${t === (ed.theme || d.theme) ? "selected" : ""}>${escapeHtml(t)}</option>`).join("");
    return `<div class="editor-form song-title-final"><div class="editor-summary tutorial-box"><b>曲完成前確認</b><span>作詞と作曲が揃った。ここで曲名とテーマを決めて完成させます。</span></div><label>曲名</label><div class="title-input-row"><input id="draftFinalTitle" value="${escapeHtml(ed.title || d.titleHint || "")}" placeholder="曲名" /><button class="songEditorChoiceBtn dice-title-btn" data-action="draft:titleRandom" title="ランダム生成">🎲</button></div><label>テーマ</label><select id="draftFinalTheme">${themeOptions}</select><div class="editor-summary mini"><b>制作内容</b><span>作詞${val(d.lyricsScore)}% / 作曲${val(d.musicScore)}% / ${escapeHtml(genreDisplay(d))} / ${escapeHtml(d.arrange || "")}</span><span>歌詞：${escapeHtml(d.keyword || "-")}</span></div><button class="songEditorNextBtn big-action" data-action="draft:finalize">この内容で完成させる</button>${editorBackButton()}</div>`;
  }
  if (ed.step === "arrangeMenu") return `<div class="choice-grid main-choice-grid">${choiceButton("<span>📈</span><b>曲強化</b>", "boost:start", "", "完成曲を選んで強化する")}${choiceButton("<span>✏️</span><b>曲編集</b>", "edit:start", "", "曲名・テーマ・ジャンル・アレンジ・歌詞を変更")}</div>${editorBackButton()}`;
  if (ed.step === "boostSong") return `<div class="choice-grid song-choice">${state.songs.map(song=>choiceButton(`<b>${escapeHtml(song.title)}</b>`, `boost:song:${song.id}`, "", `${genreDisplay(song)} / 強化Lv${song.boostLevel || 0}`)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "boostConfirm") {
    const song = state.songs.find(x=>x.id===ed.songId);
    if (!song) return `<div class="empty-panel">曲が見つかりません。</div>${editorBackButton()}`;
    return `<div class="editor-form boost-pt-form"><div class="editor-summary mini"><b>${escapeHtml(song.title)}</b><span>${escapeHtml(genreDisplay(song))} / 強化Lv${song.boostLevel || 0}</span><span>曲を磨くと、演奏・歌詞・キャッチーなどが少し伸びます。疲労+10%。</span></div><button class="songEditorNextBtn big-action" data-action="boost:execute">この曲を強化する</button>${editorBackButton()}</div>`;
  }
  if (ed.step === "editSong") return `<div class="choice-grid song-choice">${state.songs.map(song=>choiceButton(`<b>${escapeHtml(song.title)}</b>`, `edit:song:${song.id}`, "", `${genreDisplay(song)} / ${escapeHtml(song.theme || "テーマ未設定")}`)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "editForm") {
    const song = state.songs.find(x=>x.id===ed.songId);
    if (!song) return `<div class="empty-panel">編集する曲が見つかりません。</div>${editorBackButton()}`;
    const themeOptions = availableThemes().map(t => `<option value="${escapeHtml(t)}" ${t === (song.theme || "") ? "selected" : ""}>${escapeHtml(t)}</option>`).join("");
    const mainOptions = availableMainGenres().map(g => `<option value="${escapeHtml(g)}" ${g === (song.mainGenre || subParent(song.genre)) ? "selected" : ""}>${escapeHtml(g)}</option>`).join("");
    const arrangeOptions = ARRANGES.map(a => `<option value="${escapeHtml(a)}" ${a === (song.arrange || "") ? "selected" : ""}>${escapeHtml(a)}</option>`).join("");
    return `<div class="editor-form arrange-form"><div class="editor-summary mini"><b>${escapeHtml(song.title)}</b><span>${escapeHtml(genreDisplay(song))}</span><span>編集すると疲労+10%。曲の方向性を変えられます。</span></div><label>曲名</label><input id="editSongTitle" value="${escapeHtml(song.title || "")}" /><label>テーマ</label><select id="editTheme">${themeOptions}</select><label>メインジャンル</label><select id="editMainGenre">${mainOptions}</select><label>アレンジ</label><select id="editArrange">${arrangeOptions}</select><label>歌詞</label><input id="editLyricsText" value="${escapeHtml(song.keyword || "")}" placeholder="例：夜 高架下 ノイズ" /><button class="songEditorNextBtn big-action" data-action="edit:execute">この内容で編集する</button>${editorBackButton()}</div>`;
  }
  return editorBackButton();
}
function editorSummary(ed) {
  return `<div class="editor-summary"><b>制作内容</b><span>カテゴリ：${ed.type === "lyrics" ? "作詞" : "作曲"}</span><span>ジャンル狙い：${ed.mainGenreA || "-"} → ${ed.mainGenreB || "-"}</span><span>確率：${ed.mainGenreA && ed.mainGenreB ? genrePlanLabel(ed.mainGenreA, ed.mainGenreB, ed.arrange || "") : "-"}</span><span>歌詞：${ed.keyword || "-"}</span><span>アレンジ：${ed.arrange || "-"}</span></div>`;
}
function stepSongEditorBack(ed) {
  const backMap = {
    composeMenu:"menu",
    newType:"composeMenu",
    newLyricsMember:"newType",
    newLyricWords:"newLyricsMember",
    newMusicMember:"newType",
    newMain1:"newMusicMember",
    newMain2:"newMain1",
    newArrange:"newMain2",
    newMusicConfirm:"newArrange",
    draftSelect:"composeMenu",
    draftType:"draftSelect",
    draftLyricsMember:"draftType",
    draftLyricWords:"draftLyricsMember",
    draftMusicMember:"draftType",
    draftMain1:"draftMusicMember",
    draftMain2:"draftMain1",
    draftMusicArrange:"draftMain2",
    draftMusicConfirm:"draftMusicArrange",
    draftFinalize:"draftType",
    arrangeMenu:"menu",
    boostSong:"arrangeMenu",
    boostConfirm:"boostSong",
    editSong:"arrangeMenu",
    editForm:"editSong"
  };
  ed.step = backMap[ed.step] || "menu";
}
function collectLyricWordsFromInputs() {
  return [1,2,3].map(i => (document.getElementById(`editorKeywordInput${i}`)?.value || "").trim()).filter(Boolean).join(" ");
}
function applyDraftMusicFields(d, mainGenreA, mainGenreB, arrange) {
  if (!d) return;
  const a = mainGenreA || d.mainGenre || MAIN_GENRES[0];
  const b = mainGenreB || a;
  const resolved = resolveSongGenrePair(a, b, arrange || d.arrange || ARRANGES[0]);
  d.mainGenre = resolved.mainGenre;
  d.subGenre = resolved.subGenre || "";
  d.genre = resolved.subGenre || resolved.mainGenre;
  d.sourceMainGenres = resolved.sourceMainGenres;
  d.genreRollType = resolved.rollType;
  d.genreChanceText = resolved.chanceText;
  d.arrange = arrange || d.arrange || ARRANGES[0];
}
function handleSongEditorAction(action) {
  const ed = editorData();
  if (action === "editor:back") {
    if (mustCompleteFirstDraftTutorial()) {
      stepSongEditorBack(ed);
      // 2ターン目は曲エディタ外へは戻さないが、作詞/作曲フロー内の1段階戻る操作は許可する。
      const allowed = ["composeMenu","draftSelect","draftType","draftLyricsMember","draftLyricWords","draftMusicMember","draftMain1","draftMain2","draftMusicArrange","draftMusicConfirm","draftFinalize"];
      if (!allowed.includes(ed.step)) state.songEditor = { step:"composeMenu" };
      render();
      return;
    }
    stepSongEditorBack(ed); render(); return;
  }
  if (action === "editor:menu") { state.songEditor = { step: mustCompleteFirstDraftTutorial() ? "composeMenu" : "menu" }; render(); return; }
  if (action === "compose:menu") { if (!canStartAnySongcraft(["lyrics","music"], 20, "曲作成")) { render(); return; } state.songEditor = { step:"composeMenu" }; render(); return; }
  if (action === "arrange:menu") { if (mustCompleteFirstDraftTutorial()) { state.songEditor = { step:"composeMenu" }; render(); return; } if (!canStartSongcraft("music", 10, "編曲/曲編集")) { render(); return; } state.songEditor = { step:"arrangeMenu" }; render(); return; }
  if (action === "new:start" && mustCompleteFirstDraftTutorial()) { showEventPopup("まず未完成曲を完成", `2ターン目は、1ターン目で作った未完成曲だけを選べる。
作っていない作詞/作曲を選んで、曲が完成する流れを確認しよう。`, "event", "📝"); return; }
  if (action === "new:start") { if (!canStartAnySongcraft(["lyrics","music"], 20, "新曲作成")) { render(); return; } state.songEditor = { step:"newType" }; render(); return; }
  if (action === "draft:start") { state.songEditor = { step:"draftSelect" }; render(); return; }
  if (action === "boost:start") { if (mustCompleteFirstDraftTutorial()) { state.songEditor = { step:"composeMenu" }; render(); return; } if (!canStartSongcraft("music", 10, "曲強化")) { render(); return; } state.songEditor = { step:"boostSong" }; render(); return; }
  if (action === "edit:start") { if (mustCompleteFirstDraftTutorial()) { state.songEditor = { step:"composeMenu" }; render(); return; } if (!canStartSongcraft("music", 10, "曲編集")) { render(); return; } state.songEditor = { step:"editSong" }; render(); return; }
  if (action === "draft:titleRandom") { ed.title = randomSongTitleCandidate(ed); render(); return; }
  let m;
  if ((m = action.match(/^new:type:(lyrics|music)$/))) { if (!canStartSongcraft(m[1], 20, m[1] === "lyrics" ? "作詞" : "作曲")) { render(); return; } ed.type = m[1]; ed.step = m[1] === "lyrics" ? "newLyricsMember" : "newMusicMember"; render(); return; }
  if ((m = action.match(/^new:lyricsMember:(.+)$/))) { ed.memberId = m[1]; ed.step = "newLyricWords"; render(); return; }
  if (action === "new:lyricsExecute") {
    const words = collectLyricWordsFromInputs();
    if (!words) { showEventPopup("歌詞が未入力", "3つの歌詞ワードを1つ以上入力してから完了しよう。", "warn", "✍️"); return; }
    ed.keyword = words;
    const member = activeMembers().find(x=>x.id===ed.memberId) || state.player;
    const ok = createDraftAndAdvance("lyrics", member, null, null, "", words, "", provisionalDraftTitle("lyrics", ed));
    if (ok) {
      completeSongcraftTutorial();
      if (!state.songEditor || state.songEditor.step !== "draftFinalize") state.songEditor = { step:"composeMenu" };
    }
    render(); return;
  }
  if ((m = action.match(/^new:musicMember:(.+)$/))) { ed.memberId = m[1]; ed.step = "newMain1"; render(); return; }
  if ((m = action.match(/^new:main1:(.+)$/))) { ed.mainGenreA = m[1]; ed.step = "newMain2"; render(); return; }
  if ((m = action.match(/^new:main2:(.+)$/))) { ed.mainGenreB = m[1]; ed.step = "newArrange"; render(); return; }
  if ((m = action.match(/^new:arrange:(.+)$/))) { ed.arrange = m[1]; ed.step = "newMusicConfirm"; render(); return; }
  if (action === "new:musicExecute") {
    const member = activeMembers().find(x=>x.id===ed.memberId) || state.player;
    const ok = createDraftAndAdvance("music", member, ed.mainGenreA, ed.mainGenreB, "", "", ed.arrange, provisionalDraftTitle("music", ed));
    if (ok) {
      completeSongcraftTutorial();
      if (!state.songEditor || state.songEditor.step !== "draftFinalize") state.songEditor = { step:"composeMenu" };
    }
    render(); return;
  }
  if ((m = action.match(/^draft:select:(.+)$/))) { ed.draftId = m[1]; ed.step = "draftType"; render(); return; }
  if ((m = action.match(/^draft:type:(lyrics|music)$/))) { if (!canStartSongcraft(m[1], 20, m[1] === "lyrics" ? "作詞" : "作曲")) { render(); return; } ed.type = m[1]; ed.step = m[1] === "lyrics" ? "draftLyricsMember" : "draftMusicMember"; render(); return; }
  if ((m = action.match(/^draft:lyricsMember:(.+)$/))) { ed.memberId = m[1]; ed.step = "draftLyricWords"; render(); return; }
  if (action === "draft:lyricsExecute") {
    const d = state.pendingDrafts.find(x=>x.id===ed.draftId);
    if (!d) { log("制作中の曲が見つかりません。"); render(); return; }
    const words = collectLyricWordsFromInputs();
    if (!words) { showEventPopup("歌詞が未入力", "3つの歌詞ワードを1つ以上入力してから完了しよう。", "warn", "✍️"); return; }
    d.keyword = words;
    const member = activeMembers().find(x=>x.id===ed.memberId) || state.player;
    const ok = advanceDraftById(ed.draftId, "lyrics", member);
    if (ok) {
      completeSongcraftTutorial();
      if (!state.songEditor || state.songEditor.step !== "draftFinalize") state.songEditor = { step:"composeMenu" };
    }
    render(); return;
  }
  if ((m = action.match(/^draft:musicMember:(.+)$/))) { ed.memberId = m[1]; ed.step = "draftMain1"; render(); return; }
  if ((m = action.match(/^draft:main1:(.+)$/))) { ed.mainGenreA = m[1]; ed.step = "draftMain2"; render(); return; }
  if ((m = action.match(/^draft:main2:(.+)$/))) { ed.mainGenreB = m[1]; ed.step = "draftMusicArrange"; render(); return; }
  if ((m = action.match(/^draft:arrange:(.+)$/))) { ed.arrange = m[1]; ed.step = "draftMusicConfirm"; render(); return; }
  if (action === "draft:musicExecute") {
    const d = state.pendingDrafts.find(x=>x.id===ed.draftId);
    if (!d) { log("制作中の曲が見つかりません。"); render(); return; }
    applyDraftMusicFields(d, ed.mainGenreA, ed.mainGenreB, ed.arrange);
    const member = activeMembers().find(x=>x.id===ed.memberId) || state.player;
    const ok = advanceDraftById(ed.draftId, "music", member);
    if (ok) {
      completeSongcraftTutorial();
      if (!state.songEditor || state.songEditor.step !== "draftFinalize") state.songEditor = { step:"composeMenu" };
    }
    render(); return;
  }
  if (action === "draft:finalize") {
    const d = state.pendingDrafts.find(x => x.id === ed.draftId);
    if (!d) { log("完成確認中の曲が見つかりません。"); render(); return; }
    d.titleHint = (document.getElementById("draftFinalTitle")?.value || "").trim() || d.titleHint || randomSongTitleCandidate(ed);
    d.theme = document.getElementById("draftFinalTheme")?.value || d.theme;
    finishDraft(d.id);
    state.songEditor = { step:"composeMenu" };
    render(); return;
  }
  if ((m = action.match(/^boost:song:(.+)$/))) { ed.songId = m[1]; ed.step = "boostConfirm"; render(); return; }
  if (action === "boost:execute") {
    state.pendingBoostSong = ed.songId;
    render(); return;
  }
  if ((m = action.match(/^edit:song:(.+)$/))) { ed.songId = m[1]; ed.step = "editForm"; render(); return; }
  if (action === "edit:execute") {
    editSongMetadataFromEditor(ed.songId);
    completeSongcraftTutorial();
    state.songEditor = { step:"arrangeMenu" };
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
          <button class="buyItemBtn" data-item="effecter">エフェクター<br><small>50,000円 / 装備扱い / 所持上限5</small></button>
          <button class="buyItemBtn" data-item="usedGear">中古楽器<br><small>60,000円 / 演奏+ / 所持上限5</small></button>
          <button class="buyItemBtn" data-item="lightFx">照明エフェクト<br><small>45,000円 / 熱量+ / 所持上限5</small></button>
        </div>
      </div>
      <div class="card">
        <h2>もちもの</h2>
        <p>${itemBadges}</p>
        <button class="useItemBtn big-action" data-item="drink">ドリンクを使う</button>
        <hr class="soft" />
        ${renderEquipmentPanel()}
        <hr class="soft" />
        <h2>資金メモ</h2>
        <div class="kv"><b>現在資金</b><span>${state.band.funds.toLocaleString()}円</span><b>出費</b><span>練習・募集・宣伝・維持費・ライブ参加費・サポート代・機材投資</span><b>収入</b><span>バイト・チケット売上・物販</span></div>
      </div>
    </div>
  `;
}

function renderEquipmentPanel() {
  const rows = EQUIPMENT_DATA.map(eq => {
    const lv = equipmentLevel(eq.id);
    const cost = equipmentUpgradeCost(eq.id);
    const maxed = lv >= 5;
    return `<div class="equipment-row"><div><b>${escapeHtml(eq.name)}</b><small>${escapeHtml(eq.category)} / Lv${lv}/5</small><small>${escapeHtml(eq.desc)}</small></div><button class="buyItemBtn gear-upgrade" data-item="gear:${eq.id}" ${maxed ? "disabled" : ""}>${maxed ? "MAX" : `強化 ${cost.toLocaleString()}円`}</button></div>`;
  }).join("");
  return `<div class="equipment-panel"><div class="section-title"><h2>機材・楽器アップグレード</h2><span class="badge good">Lv制</span></div><p><small>所持数ではなくLv1〜5の導入/強化制。現在はバンド全体に装備され、ライブ・物販・準備に補正が入ります。</small></p>${rows}</div>`;
}
function renderLibraryScreen() {
  const discovered = Object.entries(state.discoveredGenres || {});
  const comboKeys = [...new Set((state.songs || []).map(s => (s.sourceMainGenres || []).length ? genreComboKey(s.sourceMainGenres[0], s.sourceMainGenres[1]) : "").filter(Boolean))];
  const histories = readBandHistory();
  return `<div class="grid library-grid">
    <div class="card"><div class="section-title"><h2>ジャンル図鑑</h2><span class="badge">${discovered.length}件</span></div>${discovered.length ? discovered.map(([g,d])=>`<div class="dict-row ${d.rare ? "rare" : ""}"><b>${escapeHtml(g)}</b><small>${d.rare ? "レア" : "通常"} / ${d.songTitle ? "初出："+escapeHtml(d.songTitle) : ""} / ${d.turn || "?"}T</small></div>`).join("") : `<p><small>曲作りやライブで発見したジャンルが登録されます。</small></p>`}</div>
    <div class="card"><div class="section-title"><h2>コンボ図鑑</h2><span class="badge">仮</span></div><p><small>発見済みの組み合わせと、今後出る可能性のあるサブジャンルを確認します。</small></p>${comboKeys.map(k=>`<div class="dict-row"><b>${escapeHtml(k)}</b><small>${escapeHtml(genrePlanText(...k.split("+")))}</small></div>`).join("") || `<p><small>まだ組み合わせ履歴がありません。</small></p>`}</div>
    <div class="card"><div class="section-title"><h2>スキル図鑑</h2><span class="badge">${(state.playerSkills||[]).length}/${SKILL_DATA.length}</span></div>${renderPlayerSkillPanel()}</div>
    <div class="card"><div class="section-title"><h2>曲名履歴</h2><span class="badge">${(state.songTitleHistory||[]).length}曲</span></div>${(state.songTitleHistory||[]).slice(-30).reverse().map(x=>`<div class="dict-row"><b>${escapeHtml(x.title)}</b><small>${escapeHtml(x.genre || "")} / ${x.turn || "?"}T</small></div>`).join("") || `<p><small>完成した曲名がここに残ります。</small></p>`}</div>
    <div class="card"><div class="section-title"><h2>ほかのバンド図鑑</h2><span class="badge">対バン候補</span></div>${renderRivalBandDirectory()}</div>
    <div class="card"><div class="section-title"><h2>歴代バンド図鑑</h2><span class="badge">${histories.length}組</span></div>${histories.map(h=>`<div class="dict-row"><b>${escapeHtml(h.name || "名無しの地下バンド")}</b><small>${escapeHtml(h.ending || "END")} / ファン${h.fans} / 資金${Number(h.funds||0).toLocaleString()}円</small></div>`).join("") || `<p><small>エンディングを見たバンドだけ記録されます。</small></p>`}</div>
  </div>`;
}
function readBandHistory() { try { return JSON.parse(localStorage.getItem("underground_band_history_v0321") || "[]"); } catch(e) { return []; } }
function saveBandHistory(record) {
  try {
    const list = readBandHistory();
    list.push({ ...record, savedAt:new Date().toISOString() });
    localStorage.setItem("underground_band_history_v0321", JSON.stringify(list.slice(-20)));
  } catch(e) {}
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
    const label = ev ? (i === state.maxTurn ? "FES" : ev.fixed ? "FIX" : "LIVE") : "育成";
    const venue = ev ? venueById(ev.venueId).name : "";
    cells.push(`<div class="turn-cell ${cls}" data-turn="${i}" title="${escapeHtml(venue)}"><b>${i}</b><span>${label}</span></div>`);
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
    { k:"資金", label:`¥${shortMoney(b.funds)}`, meter:null, alert:b.funds < 0 },
    { k:"ファン", label:`${Math.round(b.fans)}人`, meter:null },
    { k:"知名度", label:Math.round(b.fame), meter:b.fame },
    { k:"業界評価", label:Math.round(b.industry), meter:b.industry },
    { k:"疲労", label:`${Math.round(b.fatigue)}%`, meter:b.fatigue, alert:b.fatigue > 80 },
    { k:"編成", label:`${bandSize()}人`, meter:null }
  ];
  return `<div class="success-dashboard compact-dashboard"><div class="compact-stat-strip slim-stats">${stats.map(x=>`<div class="stat success-stat compact-stat ${x.alert ? "danger-stat" : ""}"><span>${x.k}</span><b>${x.label}</b>${x.meter !== null ? renderTinyMeter(x.k, x.meter) : ""}</div>`).join("")}</div></div>`;
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
        <div class="coach-line quiet"><b>状況</b><span>${quietGuideLine()}</span><div class="quiet-guide-chips inline">${renderGuideChips(2)}</div></div>
        ${renderCommandCards()}
        ${currentApplicantList().length ? renderApplicantList() : ""}
      </div>
      <div class="card">
        ${renderSongcraftControls()}
        <hr class="soft" />
        ${renderBandMenu()}
        <hr class="soft" />
        <h2>イベント進行</h2>
        <div class="event-box"><b>NEXT EVENT</b><span>${state.turn < state.nextLiveTurn ? `${state.nextLiveTurn}ターン目：${currentLiveName()}` : "GRAND UNDER FES"}</span></div>
        <p>${state.turn < state.nextLiveTurn ? `あと${turnsUntilNextLive()}ターンでライブ。本番までに仲間・曲・資金・疲労を整える。` : "GRAND UNDER FESに向けて、B評価以上＋条件達成を狙う。"}</p>
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
      <div class="section-title"><h2>作詞作曲</h2><span class="badge ${state.songcraftUsedThisTurn ? "bad" : "good"}">${state.songcraftUsedThisTurn ? "本日制作済み" : "今ターン未実行"}</span></div>
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
      <button id="executeCraftBtn" class="songcraft-action">曲作りを実行</button>
      ${renderDraftList()}
    </div>
  `;
}

function renderDraftList() {
  if (!state.pendingDrafts.length) {
    return `<div class="draft-list empty"><small>制作中の曲はまだありません。曲エディタから新曲を作り始めましょう。</small></div>`;
  }
  return `<div class="draft-list improved-draft-list"><h3>制作中の曲一覧</h3><p><small>未完成曲を選ぶと、残っている作詞/作曲を進められます。</small></p>${state.pendingDrafts.map(d => `
    <div class="draft-card">
      <div>
        <b>${escapeHtml(d.titleHint)}</b>
        <p><span class="badge warn">${escapeHtml(d.mainGenre || subParent(d.genre))}${d.subGenre ? " / " + escapeHtml(d.subGenre) : ""}</span><span class="badge">${escapeHtml(d.theme)}</span><span class="badge">${escapeHtml(d.keyword)}</span><span class="badge">${escapeHtml(d.arrange)}</span></p>
        <small>作詞:${d.lyricsDone ? `完了 ${val(d.lyricsScore)}%` : "未作成"} / 作曲:${d.musicDone ? `完了 ${val(d.musicScore)}%` : "未作成"}</small>
      </div>
      <div class="draft-actions">
        <button class="openSongEditorBtn">曲エディタで進める</button>
      </div>
    </div>`).join("")}</div>`;
}

function renderApplicantList() {
  const list = currentApplicantList();
  return `<div class="applicant-list">${list.map(renderApplicantCard).join("")}</div>`;
}
function renderApplicantCard(a) {
  return `
    <div class="member applicant-card">
      <h4>加入候補：${escapeHtml(a.name)}</h4>
      <div class="member-head"><div class="avatar">${initials(a.name)}</div><div class="kv">
        <b>担当</b><span>${escapeHtml(a.part)}</span>
        <b>一番得意ジャンル</b><span>${escapeHtml(a.mainGenre)}</span>
        <b>二番目得意</b><span>${(a.secondMainGenres||[]).map(escapeHtml).join(" / ") || "なし"}</span>
        <b>加入難度</b><span>${escapeHtml(a.joinDifficulty || "中")}</span>
        <b>メモ</b><span>${escapeHtml(a.replaceNote || "仮キャラ")}</span>
      </div></div>
      <div class="row" style="margin-top:10px;"><button class="joinApplicantBtn" data-applicant-id="${escapeHtml(a.id)}">加入させる</button><button class="skipApplicantBtn" data-applicant-id="${escapeHtml(a.id)}">今回は見送る</button></div>
    </div>
  `;
}
function renderApplicant() { return renderApplicantList(); }


function renderMembers() {
  const memberRows = state.members.map((m, idx) => {
    return `${renderMemberCard(m)}<div class="member-actions"><span class="badge good">構成内</span><span class="badge">${m.joinStatus || "本加入"}</span><button class="moveMemberBtn" data-index="${idx}" data-dir="up">前へ</button><button class="moveMemberBtn" data-index="${idx}" data-dir="down">後へ</button><button class="dismissMemberBtn danger" data-index="${idx}">脱退</button></div>`;
  }).join("");
  return `
    <h2>メンバー</h2>
    <p><small>控えは撤廃。加入済みメンバーは全員バンド構成に入り、ライブ準備で担当/休みを選べます。</small></p>
    <h3>現在のバンド</h3>
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

function songUsageInfo(song) {
  if (!song) return { total:0, consecutive:0, lastSlot:0, lastTurn:0 };
  const history = state.liveResultHistory || [];
  let total = song.livePlays || 0;
  let consecutive = 0;
  let lastSlot = song.lastLiveSlot || 0;
  let lastTurn = song.lastLiveTurn || 0;
  if (history.length) {
    total = 0; consecutive = 0; lastSlot = 0; lastTurn = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      const ids = history[i]?.setlistIds || [];
      const idx = ids.indexOf(song.id);
      if (idx >= 0) {
        total += 1;
        if (!lastSlot) { lastSlot = idx + 1; lastTurn = history[i].turn || 0; }
        if (consecutive === history.length - 1 - i) consecutive += 1;
      } else if (consecutive === history.length - 1 - i) {
        break;
      }
    }
  }
  return { total, consecutive, lastSlot, lastTurn };
}
function renderSongUsageMeta(song) {
  const u = songUsageInfo(song);
  const parts = [`使用${u.total}回`, `強化Lv${song.boostLevel || 0}`];
  if (u.consecutive) parts.push(`${u.consecutive}回連続使用中`);
  if (u.lastSlot) parts.push(`前回${u.lastSlot}曲目`);
  if (song.mannerism) parts.push(`マンネリ${val(song.mannerism)}`);
  return `<p class="song-usage"><small>${parts.map(escapeHtml).join(" / ")}</small></p>`;
}
function renderSongCard(s) {
  return `<div class="song"><h4>${s.title} ${s.isCover ? `<span class="badge bad">コピー</span>` : `<span class="badge good">オリジナル</span>`} ${!s.isCover ? `<span class="badge good">強化Lv${s.boostLevel || 0}</span>` : ""}</h4>
    <p><span class="badge warn">${genreDisplay(s)}</span> ${(s.tags||[]).map(t=>`<span class="badge">${t}</span>`).join(" ")}</p>
    ${renderSongUsageMeta(s)}
    <small>ライブ使用${s.livePlays || 0}回 / マンネリ${s.mannerism || 0} / 最終使用${s.lastLiveTurn ? `${s.lastLiveTurn}T` : "なし"}</small>
    <div class="recommend-tags">${songRecommendTags(s).map(t => `<span class="badge good">${escapeHtml(t)}</span>`).join(" ")}</div>
    ${renderSongBars(s)}
  </div>`;
}
function renderSongBars(s) {
  const items = [["キャッチー",s.catchy],["テンポ",s.tempo],["認知度",s.recognition],["歌詞",s.lyrics],["演奏",s.performance],["流行",s.trend]];
  return `<div class="song-bars">${items.map(([k,v])=>`<div><span>${k} ${val(v)}</span><div class="meter mini"><div class="fill" style="width:${clamp(v,0,99)}%"></div></div></div>`).join("")}</div>`;
}


function renderBandMenu() {
  const size = bandSize();
  const upkeep = memberUpkeepCost();
  const warning = size >= 6 ? "6人以上：出費増" : "5人までは通常維持費";
  return `<div class="band-menu compact-band-menu"><div class="section-title"><h2>バンド編成メモ</h2><span class="badge warn">${warning}</span></div>
    <div class="cols">
      <div><label>現在の構成人数</label><div class="input-like">${size}人</div></div>
      <div><label>今週の維持費目安</label><div class="input-like">¥${upkeep.toLocaleString()}</div></div>
    </div>
    <p><small>控えは撤廃。ライブ準備では全員から担当を選べます。人数が多いほど編成の幅は広がりますが、6人以上は1人ごとの出費が重くなります。</small></p>
    <button class="jumpTabBtn" data-view="shop">ショップ / もちものへ</button>
  </div>`;
}

function renderDeferred() {
  return `<h2>差し替え用メモ</h2><p><small>省いた候補は、あとで本実装に差し替えやすいように明示しています。</small></p>${Object.entries(DEFERRED_REPLACEMENTS).map(([k,v])=>`<p><span class="badge warn">${k}</span> ${v}</p>`).join("")}`;
}

function playableSongs() {
  return [...(state.songs || []), ...(DATA.coverSongs || [])];
}
function autoBuildSetlist() {
  const originals = (state.songs || []).slice();
  const covers = (DATA.coverSongs || []).slice();
  const scoreOriginal = s => {
    const fresh = ((s.livePlays || 0) === 0 || hasTag(s, "新曲")) ? 80 : 0;
    const stalePenalty = (s.livePlays || 0) * 9 + (s.mannerism || 0) * 5 + (s.consecutiveLiveUses || 0) * 6;
    return fresh + songTotalScore(s) + (s.recognition || 0) * .35 - stalePenalty;
  };
  const picked = [];
  originals.sort((a,b)=>scoreOriginal(b)-scoreOriginal(a)).forEach(s => { if (picked.length < 5 && !picked.some(x=>x.id===s.id)) picked.push(s); });
  covers.sort((a,b)=>songTotalScore(b)-songTotalScore(a)).forEach(s => { if (picked.length < 5 && !picked.some(x=>x.id===s.id)) picked.push(s); });
  return picked.slice(0,5).map(s => s.id);
}
function ensureLivePrepSetlist() {
  const songs = playableSongs();
  const valid = new Set(songs.map(s => s.id));
  if (!Array.isArray(state.livePrepSetlist) || state.livePrepSetlist.length < 5) state.livePrepSetlist = autoBuildSetlist();
  const used = new Set();
  let needsAuto = false;
  state.livePrepSetlist = [0,1,2,3,4].map(i => {
    const id = state.livePrepSetlist[i];
    if (!valid.has(id) || used.has(id)) { needsAuto = true; return ""; }
    used.add(id);
    return id;
  });
  if (needsAuto || state.livePrepSetlist.some(id => !id)) state.livePrepSetlist = autoBuildSetlist();
  return state.livePrepSetlist;
}

function songById(id) {
  return playableSongs().find(s => s.id === id) || playableSongs()[0] || null;
}
function renderLivePrepSetlist() {
  const ids = ensureLivePrepSetlist();
  return `<div class="setlist-card-list">${ids.map((id, idx) => renderLivePrepSongSlot(idx + 1, songById(id))).join("")}</div>`;
}
function moveSetlistSlot(slot, dir) {
  const ids = ensureLivePrepSetlist();
  const i = clamp(Number(slot || 1), 1, 5) - 1;
  const j = dir === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  state.livePrepSetlist = ids;
  render();
}
function renderLivePrepSongSlot(slot, song) {
  const safeId = song?.id || "";
  return `<div class="live-song-slot" data-slot="${slot}">
    <input type="hidden" class="setlistSelect" data-slot="${slot}" value="${escapeHtml(safeId)}" />
    <div class="slot-num"><b>${slot}</b><span>曲目</span></div>
    <div class="slot-song-main">
      <b>${escapeHtml(song?.title || "未選択")}${song?.isCover ? "（コピー）" : ""}</b>
      <small>${escapeHtml(song ? genreDisplay(song) : "曲なし")} / キャッチー${val(song?.catchy || 0)}・演奏${val(song?.performance || 0)}・歌詞${val(song?.lyrics || 0)}</small>
      <small>${escapeHtml(song ? songSetlistContext(song, slot) : "")}</small>
      <div class="slot-tags">${(song?.tags || []).slice(0, 4).map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("")}</div>
    </div>
    <div class="slot-actions">
      <div class="slot-move-row"><button class="moveSetlistBtn ghost-btn" data-slot="${slot}" data-dir="up" ${slot === 1 ? "disabled" : ""}>↑</button><button class="moveSetlistBtn ghost-btn" data-slot="${slot}" data-dir="down" ${slot === 5 ? "disabled" : ""}>↓</button></div>
      <button class="openSongPickerBtn ghost-btn" data-slot="${slot}">曲を選ぶ</button>
      <button class="openSongDetailBtn ghost-btn" data-song-id="${escapeHtml(safeId)}">詳細</button>
    </div>
  </div>`;
}
function renderLivePrep() {
  ensureLivePrepSetlist();
  const selectedSupports = new Set(state.livePrepSupportIds || []);
  const supports = DATA.supportOptions.map(s => `<label class="check-card"><input type="checkbox" class="supportCheck" value="${s.id}" ${selectedSupports.has(s.id) ? "checked" : ""} /> ${s.name}<br><small>${s.cost.toLocaleString()}円 / ${s.genres.join("・")}</small></label>`).join("");
  const ev = currentLiveEvent();
  const v = venueById(ev.venueId);
  const liveMeta = liveTypeMeta(ev);
  const prep = estimatePrepScore();
  const riskProfile = liveRiskProfile(v);
  const prepState = riskProfile.label;
  const audience = audienceProfileForVenue(v);
  const mixHint = "セトリボーナスは新曲2＋既存曲3、または新曲1＋既存曲4が狙い目。コピー曲は対象外。";
  return `
    <div class="card live-panel">
      <div class="section-title"><h2>${currentLiveName()}：ライブ準備</h2><span class="badge warn">${escapeHtml(liveMeta.short)} / ${v.name} / ${prepState}</span></div>
      <div class="venue-info"><b>${escapeHtml(liveMeta.label)} / ${v.name}</b><span>キャパ${v.capacity} / ${escapeHtml(liveMeta.feeLabel)}${eventBaseCost(ev, v).toLocaleString()}円 / 要準備${v.prepNeed} / 現在準備${val(prep)}</span><div class="quiet-guide-chips">${renderRiskBadges(riskProfile)}</div><small>${escapeHtml(liveMeta.desc)}</small><small>${escapeHtml(v.note)}</small><small>${escapeHtml(venueRequirementText(v))}</small></div>
      <div class="venue-info audience-info"><b>客層：${escapeHtml(audience.label)}</b><span>${escapeHtml(audience.detail)}</span><small>${mixHint}</small></div>
      <div class="setlist-hint-panel"><b>セトリ自動ヒント</b>${livePrepAutoHints(ensureLivePrepSetlist().map(id=>songById(id)).filter(Boolean), v, audience).map(h=>`<span>${escapeHtml(h)}</span>`).join("")}</div>
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
          <p class="setlist-help"><small>プルダウンではなく、各枠の「曲を選ぶ」から別メニューで選択します。詳細だけ確認して戻ることもできます。</small></p>
          <button id="autoSetlistBtn" class="big-action wide-cancel">セトリ自動セット</button><button id="resetSetlistBtn" class="ghost-btn wide-cancel">セトリをリセット</button>
          ${renderLivePrepSetlist()}
          <h3 style="margin-top:14px;">物販</h3>
          ${renderMerchPrepControls(v, audience)}
          <button id="performLiveBtn" class="big-action">ライブ本番へ</button>
          ${!currentLiveEvent().fixed ? `<button id="noShowLiveBtn" class="ghost-btn danger wide-cancel">ライブをドタキャンする</button>` : ""}
          ${currentApplicantList().length ? renderApplicantList() : ""}
        </div>
      </div>
    </div>
  `;
}

function renderPositionControls() {
  const locked = state.liveCount === 0;
  const members = activeMembers();
  const rows = members.map((m, idx) => {
    const savedInst = state.livePrepPositions?.[m.id];
    const defaultInst = locked && m.id === "player" ? "vocal" : (savedInst || m.mainInstrument || "off");
    const disabled = locked && m.id === "player" ? "disabled" : "";
    return `<div class="position-row" data-member="${m.id}">
      <div class="avatar small">${initials(m.name)}</div>
      <div><b>${m.name}</b><small>${m.part}</small>${renderPositionMiniStats(m, defaultInst)}</div>
      <select class="positionSelect" data-member-id="${m.id}" ${disabled}>
        ${positionOptions(defaultInst)}
      </select>
      <button class="openMemberDetailBtn ghost-btn" data-member-id="${m.id}">詳細</button>
    </div>`;
  }).join("");
  const chorusIds = normalizeLivePrepChorusIds();
  const chorusMembers = members.filter(m => m.instruments.chorus || m.instruments.vocal);
  const chorusRows = chorusIds.map((selected, i) => {
    const options = [`<option value="none" ${selected === "none" ? "selected" : ""}>コーラスなし</option>`, ...chorusMembers.map(m => `<option value="${m.id}" ${selected === m.id ? "selected" : ""}>${m.name}</option>`)].join("");
    return `<div class="position-row chorus-line"><div class="avatar small">Cho${i+1}</div><div><b>コーラス枠${i+1}</b><small>10ターンごとに枠追加 / 最大6人</small></div><select class="chorusSelect" data-slot="${i}">${options}</select></div>`;
  }).join("");
  return `<div class="stage-card">
    ${rows}
    <div class="section-title mini-title"><h3>コーラス</h3><span class="badge">${chorusIds.length}/6枠</span></div>
    ${chorusRows}
  </div>`;
}
function positionOptions(selected) {
  const opts = ["off","vocal","guitar_vocal","bass_vocal","guitar","bass","drum","key","dj","other"];
  return opts.map(o => `<option value="${o}" ${selected===o ? "selected" : ""}>${instFullLabel(o)}</option>`).join("");
}
function renderPositionMiniStats(m, inst="off") {
  if (!m) return "";
  const skill = inst === "off" ? 0 : Math.round(instrumentSkillFor(m, inst));
  const rhythm = val(m.stats?.rhythm || 0);
  const tech = val(m.stats?.technique || 0);
  const sta = val(m.stats?.stamina || 0);
  const team = val(m.stats?.teamwork || 0);
  return `<div class="position-mini-stats"><span>適性${skill}</span><span>技${tech}</span><span>リズム${rhythm}</span><span>体力${sta}</span><span>協調${team}</span></div>`;
}
function normalizeMerchOrders(raw=null) {
  const src = raw && typeof raw === "object" ? raw : (state.livePrepMerchOrders || {});
  const out = {};
  MERCH_ITEMS.forEach(item => { out[item.id] = clamp(Math.floor(Number(src[item.id] || 0)), 0, 999); });
  if (!Object.values(out).some(v => v > 0) && typeof state.livePrepMerch === "string") {
    if (state.livePrepMerch === "low") { out.sticker = 10; out.badge = 8; }
    if (state.livePrepMerch === "standard") { out.sticker = 15; out.badge = 10; out.demo = 5; }
    if (state.livePrepMerch === "premium") { out.towel = 6; out.tshirt = 4; out.demo = 8; }
  }
  return out;
}
function merchDigitsFromValue(value) {
  const n = clamp(Math.floor(Number(value || 0)), 0, 999);
  return {
    hundreds: Math.floor(n / 100) % 10,
    tens: Math.floor(n / 10) % 10,
    ones: n % 10
  };
}
function merchValueFromDigits(id) {
  const pick = place => Number(document.querySelector(`.merchDigitSelect[data-merch-id="${id}"][data-place="${place}"]`)?.value || 0);
  return clamp(pick("hundreds") * 100 + pick("tens") * 10 + pick("ones"), 0, 999);
}
function renderMerchDigitSelect(id, place, digit, label) {
  const opts = Array.from({length:10}, (_, i) => `<option value="${i}" ${i === digit ? "selected" : ""}>${i}</option>`).join("");
  return `<label class="merch-dial-wheel"><span>${label}</span><select class="merchDigitSelect" data-merch-id="${id}" data-place="${place}" aria-label="${label}の位">${opts}</select></label>`;
}
function collectMerchOrdersFromDom() {
  const out = {};
  MERCH_ITEMS.forEach(item => {
    const el = document.querySelector(`.merchQtyInput[data-merch-id="${item.id}"]`);
    const digitEl = document.querySelector(`.merchDigitSelect[data-merch-id="${item.id}"]`);
    out[item.id] = digitEl ? merchValueFromDigits(item.id) : clamp(Math.floor(Number(el?.value ?? 0)), 0, 999);
  });
  return out;
}
function maxMerchOrderForVenue(venue) {
  const cap = Number(venue?.capacity || venueById(currentLiveEvent().venueId).capacity || 80);
  return clamp(Math.ceil(cap * 0.8), 30, 240);
}
function syncMerchQtyDom(id, value) {
  const v = clamp(Math.floor(Number(value || 0)), 0, 999);
  const input = document.querySelector(`.merchQtyInput[data-merch-id="${id}"]`);
  const out = document.querySelector(`.merchQtyValue[data-merch-id="${id}"]`);
  const digits = merchDigitsFromValue(v);
  if (input) input.value = String(v);
  document.querySelectorAll(`.merchDigitSelect[data-merch-id="${id}"]`).forEach(sel => {
    const place = sel.dataset.place;
    if (place === "hundreds") sel.value = String(digits.hundreds);
    if (place === "tens") sel.value = String(digits.tens);
    if (place === "ones") sel.value = String(digits.ones);
  });
  if (out) out.textContent = String(v).padStart(3, "0");
}
function updateMerchPrepSummaryDom() {
  const orders = collectMerchOrdersFromDom();
  state.livePrepMerchOrders = orders;
  const estimatedCost = sum(MERCH_ITEMS.map(item => item.cost * (orders[item.id] || 0)));
  const costEl = document.getElementById("merchEstimatedCost");
  const fundsEl = document.getElementById("merchCurrentFunds");
  const diffEl = document.getElementById("merchFundsDiff");
  if (costEl) costEl.textContent = `仕入れ総額 ${estimatedCost.toLocaleString()}円`;
  if (fundsEl) fundsEl.textContent = `所持金 ${state.band.funds.toLocaleString()}円`;
  if (diffEl) {
    const diff = state.band.funds - estimatedCost;
    diffEl.textContent = `差額 ${diff.toLocaleString()}円`;
    diffEl.classList.toggle("bad", diff < 0);
    diffEl.classList.toggle("good", diff >= 0);
  }
  const ev = currentLiveEvent();
  const venue = venueById(ev.venueId);
  const audience = audienceProfileForVenue(venue);
  MERCH_ITEMS.forEach(item => {
    const badge = document.querySelector(`.merchRiskBadge[data-merch-id="${item.id}"]`);
    if (!badge) return;
    const risk = merchRiskLabel(orders[item.id] || 0, item, venue, audience);
    badge.textContent = risk.label;
    badge.classList.toggle("good", risk.cls === "good");
    badge.classList.toggle("warn", risk.cls === "warn");
    badge.classList.toggle("bad", risk.cls === "bad");
  });
}
function merchAudienceFit(item, audienceLabel) {
  if (!item) return 1;
  const label = audienceLabel || audienceProfileForVenue(venueById(currentLiveEvent().venueId)).label;
  if ((item.best || []).includes(label)) return 1.22;
  if (label === "フェス審査・外部客" && ["towel","tshirt","bucket","coach","rubberband"].includes(item.id)) return 1.18;
  if (label === "友人・身内多め" && ["sticker","badge","keyholder","demo"].includes(item.id)) return 1.16;
  if (label === "初見客多め" && ["sticker","towel","totebag","keyholder","bucket"].includes(item.id)) return 1.14;
  return 0.92;
}
function merchCapacityFit(item, cap) {
  const high = ["tshirt","longt","bucket","coach","towel"];
  const low = ["sticker","badge","keyholder","demo"];
  if (cap >= 200 && high.includes(item.id)) return 1.25;
  if (cap >= 120 && high.includes(item.id)) return 1.12;
  if (cap <= 90 && low.includes(item.id)) return 1.18;
  if (cap <= 90 && item.cost >= 2500) return 0.72;
  return 1;
}
function merchDemandRate(item, attendees, rank, setlist, audienceLabel, cap) {
  const rankFactor = rankMult(rank);
  const hasRep = setlist.some(s => hasTag(s, "代表曲候補") || hasTag(s, "定番"));
  const coreFactor = 1 + state.band.core / 260;
  const recFactor = 1 + avg(setlist.map(s => s.recognition || 0)) / 260;
  const baseByPrice = item.price <= 700 ? 0.22 : item.price <= 1200 ? 0.15 : item.price <= 2200 ? 0.085 : item.price <= 3200 ? 0.052 : 0.032;
  const rep = hasRep ? (item.id === "demo" ? 1.45 : 1.15) : 1;
  const overSupplyRisk = Math.max(0.65, 1 - Math.max(0, state.band.fame - 80) / 900);
  return clamp(baseByPrice * rankFactor * merchAudienceFit(item, audienceLabel) * merchCapacityFit(item, cap) * coreFactor * recFactor * rep * overSupplyRisk * (1 + equipmentMerchBonus()/100), 0.01, 0.58);
}

function merchSafeQtyRange(item, venue, audience) {
  const cap = Number(venue?.capacity || 80);
  const label = audience?.label || "通常客層";
  const fit = merchAudienceFit(item, label) * merchCapacityFit(item, cap);
  const cheapFactor = item.price <= 700 ? 0.28 : item.price <= 1200 ? 0.20 : item.price <= 2200 ? 0.13 : item.price <= 3200 ? 0.08 : 0.045;
  const fanReach = clamp((Number(state.band?.fans || 0) + cap * 0.35 + Number(state.band?.fame || 0) * 1.6) / Math.max(1, cap), 0.18, 1.15);
  const theory = cap * cheapFactor * fit * fanReach * (1 + equipmentMerchBonus()/160);
  // 安全目安は期待値最大ではなく、少し下に置く。攻める余地を残す。
  const mid = clamp(Math.round(theory * 0.68), 0, Math.max(0, Math.floor(cap * 0.55)));
  const low = clamp(Math.floor(mid * 0.82), 0, 999);
  const high = clamp(Math.ceil(mid * 1.18), low, 999);
  return { low, high, mid, theory:Math.round(theory) };
}
function merchRiskLabel(qty, item, venue, audience) {
  const r = merchSafeQtyRange(item, venue, audience);
  if (qty <= 0) return { label:"未仕入", cls:"info" };
  if (qty < r.low) return { label:"控えめ", cls:"info" };
  if (qty <= r.high) return { label:"安全目安", cls:"good" };
  if (qty <= Math.max(r.high + 8, Math.round(r.theory * 0.95))) return { label:"攻め", cls:"warn" };
  return { label:"売残注意", cls:"bad" };
}

function renderMerchPrepControls(venue, audience) {
  const orders = normalizeMerchOrders();
  const label = audience?.label || "通常客層";
  const cap = venue?.capacity || 80;
  const maxOrder = maxMerchOrderForVenue(venue);
  const estimatedCost = sum(MERCH_ITEMS.map(item => item.cost * (orders[item.id] || 0)));
  const diff = state.band.funds - estimatedCost;
  return `<div class="merch-prep-panel">
    <div class="merch-prep-summary"><b>仕入れ数を選択</b><span id="merchEstimatedCost">仕入れ総額 ${estimatedCost.toLocaleString()}円</span><span id="merchCurrentFunds">所持金 ${state.band.funds.toLocaleString()}円</span><span id="merchFundsDiff" class="${diff < 0 ? "bad" : "good"}">差額 ${diff.toLocaleString()}円</span><small>安全目安はあえて低め。破綻しにくい数で、最高利益の最適解ではありません。客層・キャパを読んで増減できます。</small></div>
    <div class="merch-item-grid">${MERCH_ITEMS.map(item => {
      const qty = orders[item.id] || 0;
      const fit = merchAudienceFit(item, label) * merchCapacityFit(item, cap);
      const fitLabel = fit >= 1.25 ? "かなり売れやすい" : fit >= 1.08 ? "売れやすい" : fit >= .9 ? "普通" : "売れにくい";
      const safeRange = merchSafeQtyRange(item, venue, audience);
      const risk = merchRiskLabel(qty, item, venue, audience);
      const digits = merchDigitsFromValue(qty);
      return `<div class="merch-item-card"><div><b>${escapeHtml(item.name)}</b><small>仕入${item.cost.toLocaleString()}円 → 売値${item.price.toLocaleString()}円</small><small>客層：${item.best.join(" / ")}</small><small>${escapeHtml(item.desc)}</small><div class="quiet-guide-chips merch-signal"><span class="badge ${fit >= 1.08 ? "good" : fit < .9 ? "bad" : ""}">${fitLabel}</span><span class="badge merchRiskBadge ${risk.cls === "bad" ? "bad" : risk.cls === "warn" ? "warn" : risk.cls === "good" ? "good" : ""}" data-merch-id="${item.id}">${escapeHtml(risk.label)}</span></div><small class="safe-guide-line">安全目安 ${safeRange.low}〜${safeRange.high}個</small></div><div class="merch-qty-control merch-dial-control"><div class="merch-dial-readout"><span>仕入れ数</span><output class="merchQtyValue" data-merch-id="${item.id}">${String(qty).padStart(3, "0")}</output><span>個</span></div><div class="merch-dial-lock">${renderMerchDigitSelect(item.id, "hundreds", digits.hundreds, "百")}${renderMerchDigitSelect(item.id, "tens", digits.tens, "十")}${renderMerchDigitSelect(item.id, "ones", digits.ones, "一")}</div><div class="merch-dial-step"><button class="merchQtyStepBtn" data-merch-id="${item.id}" data-delta="-1" type="button" aria-label="${escapeHtml(item.name)}を1個減らす">−1</button><button class="merchQtyStepBtn" data-merch-id="${item.id}" data-delta="1" type="button" aria-label="${escapeHtml(item.name)}を1個増やす">＋1</button></div><input class="merchQtyInput" data-merch-id="${item.id}" type="hidden" value="${qty}" /></div></div>`;
    }).join("")}</div>
  </div>`;
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


function songSetlistContext(song, slot) {
  const current = ensureLivePrepSetlist();
  const setSlots = current.map((id, i) => id === song.id ? i + 1 : null).filter(Boolean);
  const last = [...(state.liveResultHistory || [])].reverse().find(r => Array.isArray(r.setlistIds) && r.setlistIds.includes(song.id));
  const lastSlot = last ? (last.setlistIds.indexOf(song.id) + 1) + "曲目" : "前回なし";
  const now = setSlots.length ? `${setSlots.join("・")}曲目セット中` : `${slot}曲目に追加予定`;
  return `前回:${lastSlot} / 現在:${now}`;
}

function renderLiveSongPickerOverlay() {
  const slot = Number(state.livePrepPickerSlot || 1);
  const currentId = ensureLivePrepSetlist()[slot - 1];
  const ev = currentLiveEvent();
  const aud = audienceProfileForVenue(venueById(ev.venueId));
  const songs = sortSongsForDisplay(playableSongs(), "audience", { audience:aud, slot });
  return `<div class="modal-backdrop result-backdrop">
    <div class="live-picker-modal">
      <div class="result-header"><span>SETLIST SELECT</span><b>${slot}曲目を選ぶ</b><em>客層相性順 / ${songs.length}曲</em></div>
      <div class="picker-song-list">${songs.map(s => `
        <div class="picker-song-card ${s.id === currentId ? "selected" : ""}">
          <div>
            <b>${escapeHtml(s.title)}${s.isCover ? "（コピー）" : ""}</b>
            <small>${escapeHtml(genreDisplay(s))} / キャッチー${val(s.catchy)}・テンポ${val(s.tempo)}・歌詞${val(s.lyrics)}・演奏${val(s.performance)}</small>
            <div class="slot-tags">${(s.tags || []).slice(0, 5).map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("")}</div><div class="recommend-tags">${songRecommendTags(s, {audience:aud, slot}).map(t => `<span class="badge good">${escapeHtml(t)}</span>`).join(" ")}</div>
            ${renderSongBars(s)}
            <div class="setlist-song-context"><small>${escapeHtml(songSetlistContext(s, slot))}</small></div>
          </div>
          <div class="picker-actions">
            <button class="chooseSetlistSongBtn big-action" data-slot="${slot}" data-song-id="${escapeHtml(s.id)}">この曲にする</button>
            <button class="openSongDetailBtn ghost-btn" data-song-id="${escapeHtml(s.id)}">詳細</button>
          </div>
        </div>`).join("")}
      </div>
      <button class="closeLivePickerBtn ghost-btn wide-cancel">戻る</button>
    </div>
  </div>`;
}
function renderDetailModalOverlay() {
  const d = state.detailModal || {};
  if (d.type === "member") {
    const m = allBandPeople().find(x => x.id === d.id) || activeMembers().find(x => x.id === d.id);
    return `<div class="modal-backdrop result-backdrop">
      <div class="detail-modal">
        <div class="result-header"><span>MEMBER DETAIL</span><b>${escapeHtml(m?.name || "メンバー")}</b><em>${escapeHtml(m?.part || "")}</em></div>
        ${m ? renderMemberCard(m) : `<p>メンバー情報が見つかりません。</p>`}
        <button class="closeDetailModalBtn big-action">OK</button>
      </div>
    </div>`;
  }
  if (d.type === "song") {
    const song = songById(d.id);
    return `<div class="modal-backdrop result-backdrop">
      <div class="detail-modal">
        <div class="result-header"><span>SONG DETAIL</span><b>${escapeHtml(song?.title || "曲")}</b><em>${escapeHtml(song ? genreDisplay(song) : "")}</em></div>
        ${song ? renderSongCard(song) : `<p>曲情報が見つかりません。</p>`}
        <button class="closeDetailModalBtn big-action">OK</button>
      </div>
    </div>`;
  }
  return "";
}

function renderOverlays() {
  // 進行系の演出を優先し、ポップアップが重なって見えなくなるのを防ぐ。
  if (state.bandNamePrompt || state.renameBandNamePrompt) return renderBandNameOverlay();
  if (state.liveProgressModal) return renderLiveProgressOverlay();
  if (state.liveResultModal) return renderLiveResultOverlay();
  if (state.pendingAfterparty) return renderAfterpartyOverlay();
  if (state.actionResultModal) return renderActionResultOverlay();
  if (state.detailModal) return renderDetailModalOverlay();
  if (state.livePrepPickerSlot) return renderLiveSongPickerOverlay();
  if (state.pendingBooking) return renderBookingConfirmOverlay();
  if (state.pendingBoostSong) return renderBoostSongConfirmOverlay();
  if (state.pendingCancelLive) return renderCancelLiveConfirmOverlay();
  if (state.pendingPurchase) return renderPurchaseConfirmOverlay();
  if (state.saveSlotModal) return renderSaveSlotOverlay();
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
  return `<div class="turn-toast"><b>${n.turn}/${state.maxTurn || 50}ターン</b><span>${escapeHtml(next)}</span></div>`;
}
function renderCancelLiveConfirmOverlay() {
  const p = state.pendingCancelLive || {};
  const ev = liveEventForTurn(Number(p.turn));
  const v = ev ? venueById(ev.venueId) : null;
  const noShow = !!p.noShow;
  const penalty = v ? (noShow ? v.fee + Math.round(v.fee * 0.5) : 0) : 0;
  return `<div class="modal-backdrop"><div class="event-modal warn">
    <div class="modal-icon">${noShow ? "⚠️" : "📅"}</div>
    <div class="modal-copy"><h2>${noShow ? "ライブをドタキャンする？" : "ライブをキャンセルする？"}</h2>
      <p>${ev && v ? `${ev.turn}ターン目「${escapeHtml(v.name)}」を${noShow ? "ドタキャン" : "キャンセル"}します。` : "対象のライブをキャンセルします。"}<br>${noShow ? `会場費＋損料 ${penalty.toLocaleString()}円が発生し、信頼度と知名度が大きく下がります。` : "メリットはなく、信頼度と知名度が少し下がります。"}</p>
    </div>
    <div class="modal-actions confirm-wide"><button id="confirmCancelLiveBtn" class="big-action danger">${noShow ? "ドタキャンする" : "キャンセルする"}</button><button id="cancelCancelLiveBtn" class="ghost-btn">戻る</button></div>
  </div></div>`;
}

function renderPurchaseConfirmOverlay() {
  const item = state.pendingPurchase;
  const isGear = String(item || "").startsWith("gear:");
  const gearId = isGear ? String(item).split(":")[1] : "";
  const gear = equipmentById(gearId);
  const prices = { drink: 5000, effecter: 50000, usedGear: 60000, lightFx: 45000 };
  const names = { drink: "疲労回復ドリンク", effecter: "エフェクター", usedGear: "中古楽器", lightFx: "照明エフェクト" };
  const price = isGear ? equipmentUpgradeCost(gearId) : (prices[item] || 0);
  const title = isGear ? `${gear?.name || "機材"}を強化する？` : `${names[item] || "アイテム"}を購入する？`;
  const desc = isGear ? `現在Lv${equipmentLevel(gearId)} → Lv${Math.min(5, equipmentLevel(gearId)+1)}。${gear?.desc || ""}` : "誤タップ防止のため、購入前に確認しています。";
  return `<div class="modal-backdrop">
    <div class="event-modal event">
      <div class="modal-icon">🛒</div>
      <div class="modal-copy"><h2>${escapeHtml(title)}</h2><p>価格：${price.toLocaleString()}円</p><p>${escapeHtml(desc)}</p></div>
      <div class="modal-actions"><button id="confirmPurchaseBtn" class="big-action">${isGear ? "強化する" : "購入する"}</button><button id="cancelPurchaseBtn" class="ghost-btn">戻る</button></div>
    </div>
  </div>`;
}
function renderSaveSlotOverlay() {
  const mode = state.saveSlotModal;
  const isSave = mode === "save";
  return `<div class="modal-backdrop">
    <div class="event-modal event slot-modal">
      <div class="modal-icon">${isSave ? "💾" : "📂"}</div>
      <div class="modal-copy">
        <h2>${isSave ? "どのスロットにセーブする？" : "どのスロットをロードする？"}</h2>
        <p>${isSave ? "選んだスロットへ現在の進行を保存します。既存データがある場合は上書きされます。" : "ロードすると現在の画面上の進行は、選んだセーブデータに切り替わります。"}</p>
        <div class="slot-grid compact">
          ${Array.from({length:SAVE_SLOT_COUNT}, (_,i)=>i+1).map(slot => {
            const has = !!savePayloadForSlot(slot);
            const disabled = !isSave && !has;
            return `<div class="slot-select-card ${has ? "has-save" : "empty"}">${slotSummaryHtml(slot, isSave ? "save" : "load")}<button class="slotActionBtn ${isSave ? "primary" : ""}" data-slot="${slot}" ${disabled ? "disabled" : ""}>${isSave ? `スロット${slot}にセーブ` : `スロット${slot}をロード`}</button></div>`;
          }).join("")}
        </div>
      </div>
      <div class="modal-actions"><button id="cancelSlotModalBtn" class="ghost-btn">戻る</button></div>
    </div>
  </div>`;
}
function renderBookingConfirmOverlay() {
  const b = state.pendingBooking;
  const v = venueById(b.venueId);
  const ev = { ...b, fixed:false };
  const meta = liveTypeMeta(ev);
  const bands = invitedBandsForEvent(ev);
  const prep = estimatePrepScore();
  const shortage = Math.max(0, v.prepNeed - prep);
  const riskProfile = liveRiskProfile(v);
  return `<div class="modal-backdrop">
    <div class="event-modal event booking-modal">
      <div class="modal-icon">📅</div>
      <div class="modal-copy"><h2>${b.turn}ターン目の${escapeHtml(meta.short)}を入れる？</h2><p>${escapeHtml(v.name)} / キャパ${v.capacity} / ${escapeHtml(meta.feeLabel)}${eventBaseCost(ev, v).toLocaleString()}円</p><p>準備要求：${v.prepNeed} / 現在準備：${val(prep)}${shortage ? ` / 不足${val(shortage)}` : " / 準備OK"}</p><div class="quiet-guide-chips">${renderRiskBadges(riskProfile)}</div>${bands.length ? `<p>呼ぶ/共演候補：${bands.map(x=>escapeHtml(x.name)).join(" / ")}</p>` : ""}<p>${escapeHtml(meta.desc)}</p><p>予約後、残り2ターン以内は通常キャンセル不可。当日ドタキャンは会場費＋損料が必要。</p></div>
      <div class="modal-actions"><button id="confirmBookingBtn" class="big-action">決定する</button><button id="cancelBookingBtn" class="ghost-btn">戻る</button></div>
    </div>
  </div>`;
}
function renderBoostSongConfirmOverlay() {
  const songId = state.pendingBoostSong;
  const song = state.songs.find(s => s.id === songId);
  if (!song) { state.pendingBoostSong = null; return ""; }
  const cost = plannedSongcraftFatigueCost("music", 10);
  const over = (state.band.fatigue || 0) + cost > 100;
  return `<div class="modal-backdrop"><div class="event-modal event">
    <div class="modal-icon">📈</div>
    <div class="modal-copy"><h2>この曲を強化する？</h2><p>「${escapeHtml(song.title)}」 / ${escapeHtml(genreDisplay(song))}<br>現在：強化Lv${song.boostLevel || 0}<br>疲労+${cost}%</p><p>ポイント振り分けは廃止。選ぶだけで曲を磨けます。</p>${over ? `<p class="bad-text">疲労が100％を超えるため、今は強化できません。</p>` : ""}</div>
    <div class="modal-actions"><button id="confirmBoostSongBtn" class="big-action" ${over ? "disabled" : ""}>強化する</button><button id="cancelBoostSongBtn" class="ghost-btn">戻る</button></div>
  </div></div>`;
}

function renderAfterpartyOverlay() {
  const p = state.pendingAfterparty || {};
  const fatigue = Number(state.band?.fatigue || 0);
  const canJoin = fatigue <= 80;
  const bands = (p.invitedBandIds || []).map(rivalById).filter(Boolean);
  return `<div class="modal-backdrop"><div class="event-modal event afterparty-modal">
    <div class="modal-icon">🍻</div>
    <div class="modal-copy"><h2>ライブ後の打ち上げに行く？</h2>
      <p>${escapeHtml(p.title || "ライブ")}が終わった。参加すると、共演バンドとの交流イベント・紹介・メンバー成長のチャンスがあるが、疲労がさらに20%増える。</p>
      <p>現在疲労：${Math.round(fatigue)}% / 参加条件：疲労80%以下${canJoin ? "" : "（疲れすぎて参加不可）"}</p>
      ${bands.length ? `<p>共演：${bands.map(b=>escapeHtml(b.name)).join(" / ")}</p>` : `<p>今回は他バンド込みではないため、交流・紹介イベントは発生しない。</p>`}
      <small>二日酔い発生率は1〜20%。疲労が高いほど上がり、ライブ評価が高いほど下がる。</small>
    </div>
    <div class="modal-actions confirm-wide"><button id="joinAfterpartyBtn" class="big-action" ${canJoin ? "" : "disabled"}>参加する</button><button id="skipAfterpartyBtn" class="ghost-btn">帰る</button></div>
  </div></div>`;
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
      <button class="actionResultCloseBtn big-action">OK（次のターンへ）</button>
    </div>
  </div>`;
}
function renderTrainingGains(training) {
  if (!training) return "";
  const rows = Array.isArray(training) ? training : String(training).split("\n").filter(Boolean).map(line => ({ line }));
  if (!rows.length) return "";
  return `<div class="training-gain-list"><b>練習で伸びたステータス</b>${rows.map(r => {
    if (r.name) return `<div class="training-gain-row"><span>${escapeHtml(r.name)}</span><small>技術 ${r.techBefore}→${r.techAfter} / リズム ${r.rhythmBefore}→${r.rhythmAfter}</small><div class="meter mini"><div class="fill" style="width:${clamp(r.techAfter,0,99)}%"></div></div></div>`;
    return `<span>${escapeHtml(r.line)}</span>`;
  }).join("")}<small>技術・リズムはライブの演奏/安定、次の作曲にも影響します。</small></div>`;
}

function renderLiveProgressOverlay() {
  const l = state.liveProgressModal;
  const steps = l.steps || [];
  const idx = clamp(l.index || 0, 0, Math.max(0, steps.length - 1));
  const current = steps[idx] || { line:"ライブ開始！", icon:"🔥", event:"会場が温まってきた" };
  const pct = steps.length ? Math.round((idx + 1) / steps.length * 100) : 100;
  const prevPct = steps.length ? Math.round(idx / steps.length * 100) : 0;
  const complete = !!l.complete;
  return `<div class="modal-backdrop result-backdrop live-only-backdrop">
    <div class="live-progress-modal realtime-live-modal ${complete ? "live-complete" : ""}">
      <div class="result-header"><span>${complete ? "LIVE COMPLETE" : "LIVE STAGE"}</span><b>${escapeHtml(l.title)}</b><em>${idx + 1}/${steps.length || 5}</em></div>
      <div class="live-progress-bar"><div class="live-progress-fill realtime" style="--from:${prevPct}%;--to:${pct}%;width:${pct}%"></div><span>${pct}%</span></div>
      <div class="live-current-telop"><b>${escapeHtml(current.line)}</b>${complete ? `<small>ライブ完了。結果を見る準備ができた。</small>` : ""}</div>
      <div class="live-icons"><div><b>${escapeHtml(current.icon)}</b><span>${escapeHtml(current.event)}</span></div></div>
      <div class="live-telop-list compact">${steps.slice(0, idx + 1).map((x, i) => `<p class="${i === idx ? "active" : ""} ${x.impact ? "impact-" + escapeHtml(x.impact) : ""}">${escapeHtml(x.line)} / ${escapeHtml(x.icon)} ${escapeHtml(x.event)}</p>`).join("")}</div>
      <button class="liveProgressNextBtn ${complete ? "big-action" : "ghost-btn"} live-skip-btn">${complete ? "結果を見る" : "演出をスキップして結果へ"}</button>
    </div>
  </div>`;
}
function renderLiveResultOverlay() {
  const r = state.liveResultModal || {};
  const gains = r.gains || {};
  return `<div class="modal-backdrop result-backdrop">
    <div class="live-result-modal rank-${escapeHtml(r.rank || "C")}">
      <div class="rank-burst">${escapeHtml(r.rank || "-")}</div>
      <div class="result-header"><span>LIVE RESULT</span><b>${escapeHtml(r.title || "ライブ結果")}</b><em>${escapeHtml(r.venue || "ライブハウス")}</em></div>
      <div class="result-score"><b>${val(r.total || 0)}</b><span>総合評価</span><small>${escapeHtml(r.liveTypeLabel || "ライブ")}</small></div>
      <div class="result-bars">
        ${resultBar("演奏", val(r.performance || 0))}
        ${resultBar("表現", val(r.expression || 0))}
        ${resultBar("熱量", val(r.heat || 0))}
        ${resultBar("戦略", val(r.strategy || 0))}
        ${resultBar("安定", val(r.stability || 0))}
      </div>
      <div class="result-summary-grid">
        <div><b>集客</b><span>${val(r.attendees || 0)}人</span><small>自分${val(r.ownAudience || 0)} / 他${val(r.partnerAudience || 0)}</small></div>
        <div><b>利益</b><span>${Number(gains.funds || r.profit || 0).toLocaleString()}円</span><small>${escapeHtml(r.costLabel || "費用")}${Number(r.costValue || 0).toLocaleString()}円</small></div>
        <div><b>ファン</b><span>+${val(gains.fans || 0)}</span></div>
        <div><b>知名度</b><span>+${val(gains.fame || 0)}</span></div>
        <div><b>業界評価</b><span>+${val(gains.industry || 0)}</span></div>
        <div><b>コア人気</b><span>+${val(gains.core || 0)}</span></div>
      </div>
      <div class="result-setlist"><b>SET LIST</b>${(r.songs || []).map((name, i) => `<span>${i + 1}. ${escapeHtml(name)}</span>`).join("")}</div>
      <div class="result-notes">
        <p>ライブアレンジ：${escapeHtml(r.adlib || "なし")}</p>
        <p>セトリボーナス：${escapeHtml(r.setlistBonusText || "なし")}</p>
        <p>同一曲：${escapeHtml(r.repeatText || "なし")}</p>
        <p>物販：${escapeHtml(r.merchSummary || "なし")}</p>
        ${r.coreEvent ? `<p>完璧ではないが、コアなファンに強く刺さった。</p>` : ""}
        ${r.mannerWarning ? `<p>交流注意：${escapeHtml(r.mannerWarning)}</p>` : ""}
      </div>
      <div class="modal-actions"><button id="downloadSetlistImageBtn" class="ghost-btn">セトリ画像を保存</button><button class="liveResultCloseBtn big-action">OK</button></div>
    </div>
  </div>`;
}
function renderBandNameOverlay() {
  const renaming = !!state.renameBandNamePrompt;
  return `<div class="modal-backdrop">
    <div class="event-modal event band-name-modal">
      <div class="modal-icon">🏷️</div>
      <div class="modal-copy"><h2>${renaming ? "バンド名を変更する" : "バンド名を決めよう"}</h2><p>${renaming ? "改名すると、古い名前で覚えていた人が少し迷う。認知度がごく少し下がります。" : "ライブハウスに名前を出すには、バンド名が必要だ。"}</p><input id="bandNameInput" class="wide-input" placeholder="例：名無しの地下バンド" value="${escapeHtml(state.band.name || "")}" /></div>
      <div class="modal-actions confirm-wide"><button id="confirmBandNameBtn" class="big-action">この名前で行く</button>${renaming ? `<button id="cancelBandNameBtn" class="ghost-btn">戻る</button>` : ""}</div>
    </div>
  </div>`;
}
function resultBar(label, value) {
  const pct = clamp(value / 2.2, 0, 100);
  return `<div class="result-bar"><span>${label}</span><div class="meter mini"><div class="fill" style="width:${pct}%"></div></div><b>${value}</b></div>`;
}

function downloadSetlistImage() {
  const r = state.liveResultModal;
  if (!r) return;
  const canvas = document.createElement("canvas");
  canvas.width = 900; canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#121018"; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#f8f1e8"; ctx.font = "bold 42px sans-serif";
  ctx.fillText(state.band.name || "名無しの地下バンド", 60, 90);
  ctx.font = "26px sans-serif"; ctx.fillStyle = "#d9c7ff";
  ctx.fillText(`${r.title || "LIVE"} / ${state.turn}T / ${r.venue || ""}`, 60, 140);
  ctx.fillStyle = "#fff"; ctx.font = "bold 34px sans-serif";
  ctx.fillText(`RANK ${r.rank || "-"}  SCORE ${val(r.total || 0)}`, 60, 210);
  ctx.font = "30px sans-serif";
  (r.songs || []).forEach((name, i) => {
    ctx.fillStyle = i % 2 ? "#f8f1e8" : "#ffe66d";
    ctx.fillText(`${i+1}. ${name}`, 90, 300 + i*82);
  });
  ctx.fillStyle = "#d9c7ff"; ctx.font = "24px sans-serif";
  ctx.fillText(`Setlist bonus: ${r.setlistBonusText || "-"}`, 60, 780);
  ctx.fillText(`Merch: ${r.merchSummary || "-"}`, 60, 830);
  ctx.fillText(`Profit: ${Number(r.profit || r.gains?.funds || 0).toLocaleString()} yen`, 60, 880);
  const a = document.createElement("a");
  a.download = `setlist_${Date.now()}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
  log("ライブ後セトリ画像を作成した。", "event");
}

function bindEvents() {
  document.querySelectorAll(".command-card").forEach(btn => btn.addEventListener("click", () => handleCommandClick(btn.dataset.command)));
  document.querySelectorAll(".tabBtn:not(:disabled), .jumpTabBtn").forEach(btn => btn.addEventListener("click", () => {
    const v = btn.dataset.view || "home";
    if (state.turnNotice) clearTurnNotice();
    if (v !== "home" && showTutorialBlocked(v === "command" ? "command" : v === "schedule" ? "schedule" : v === "songs" ? "song" : "other")) return;
    state.view = v;
    if (v === "schedule" && state.scheduleTutorialStage === "needSchedule") {
      state.scheduleTutorialStage = "done";
      showEventPopup("スケジュール帳", "今後のライブの予定を組もう。\n出たいライブ候補をタップすると、会場費・キャパ・準備要求を確認して予約できる。", "event", "📅");
    }
    render();
  }));
  document.querySelectorAll(".joinApplicantBtn").forEach(btn => btn.addEventListener("click", () => joinApplicantById(btn.dataset.applicantId)));
  document.querySelectorAll(".skipApplicantBtn").forEach(btn => btn.addEventListener("click", () => skipApplicantById(btn.dataset.applicantId)));
  const craftBtn = document.getElementById("executeCraftBtn");
  if (craftBtn) craftBtn.addEventListener("click", executeSongcraftFromForm);
  document.querySelectorAll(".draftCraftBtn").forEach(btn => btn.addEventListener("click", () => executeDraftCraft(btn.dataset.draftId, btn.dataset.craftType)));
  document.querySelectorAll(".openSongEditorBtn:not(:disabled)").forEach(btn => btn.addEventListener("click", () => { if (showTutorialBlocked("song")) return; openSongEditor("menu"); }));
  document.querySelectorAll(".songEditorChoiceBtn, .songEditorNextBtn").forEach(btn => btn.addEventListener("click", () => handleSongEditorAction(btn.dataset.action || "editor:menu")));
  const toggleSkillPanelBtn = document.getElementById("toggleSkillPanelBtn");
  if (toggleSkillPanelBtn) toggleSkillPanelBtn.addEventListener("click", () => { state.skillPanelOpen = state.skillPanelOpen === false; render(); });
  const confirmBoostSongBtn = document.getElementById("confirmBoostSongBtn");
  if (confirmBoostSongBtn) confirmBoostSongBtn.addEventListener("click", () => { const id = state.pendingBoostSong; state.pendingBoostSong = null; if (boostSongSimple(id)) { completeSongcraftTutorial(); state.songEditor = { step:"arrangeMenu" }; } render(); });
  const cancelBoostSongBtn = document.getElementById("cancelBoostSongBtn");
  if (cancelBoostSongBtn) cancelBoostSongBtn.addEventListener("click", () => { state.pendingBoostSong = null; render(); });
  document.querySelectorAll(".keywordDiceBtn").forEach(btn => btn.addEventListener("click", () => {
    const i = Number(btn.dataset.target || 1);
    const input = document.getElementById(`editorKeywordInput${i}`);
    if (input) input.value = KEYWORD_SUGGESTIONS[rand(0, KEYWORD_SUGGESTIONS.length-1)];
  }));
  const songSortSelect = document.getElementById("songSortSelect");
  if (songSortSelect) songSortSelect.addEventListener("change", () => { state.songSortMode = songSortSelect.value; render(); });
  const liveBtn = document.getElementById("performLiveBtn");
  if (liveBtn) liveBtn.addEventListener("click", performLive);
  document.querySelectorAll(".moveMemberBtn").forEach(btn => btn.addEventListener("click", () => moveMember(Number(btn.dataset.index), btn.dataset.dir)));
  document.querySelectorAll(".bringReserveBtn").forEach(btn => btn.addEventListener("click", () => bringReserveToBand(Number(btn.dataset.index))));
  document.querySelectorAll(".benchMemberBtn").forEach(btn => btn.addEventListener("click", () => benchMember(Number(btn.dataset.index))));
  document.querySelectorAll(".dismissMemberBtn").forEach(btn => btn.addEventListener("click", () => dismissMember(Number(btn.dataset.index))));
  const capBtn = document.getElementById("applyMemberCapBtn");
  if (capBtn) capBtn.addEventListener("click", applyMemberCap);
  document.querySelectorAll(".buyItemBtn").forEach(btn => btn.addEventListener("click", () => { state.pendingPurchase = btn.dataset.item; render(); }));
  const confirmPurchaseBtn = document.getElementById("confirmPurchaseBtn");
  if (confirmPurchaseBtn) confirmPurchaseBtn.addEventListener("click", () => { const item = state.pendingPurchase; state.pendingPurchase = null; if (item) buyItem(item); });
  const cancelPurchaseBtn = document.getElementById("cancelPurchaseBtn");
  if (cancelPurchaseBtn) cancelPurchaseBtn.addEventListener("click", () => { state.pendingPurchase = null; render(); });
  document.querySelectorAll(".useItemBtn").forEach(btn => btn.addEventListener("click", () => useItem(btn.dataset.item)));
  ["saveBtn", "homeSaveBtn"].forEach(id => { const btn = document.getElementById(id); if (btn) btn.addEventListener("click", () => { state.saveSlotModal = "save"; render(); }); });
  ["loadBtn", "homeLoadBtn"].forEach(id => { const btn = document.getElementById(id); if (btn) btn.addEventListener("click", () => { state.saveSlotModal = "load"; render(); }); });
  const titleBtn = document.getElementById("titleBtn");
  if (titleBtn) titleBtn.addEventListener("click", goTitle);
  document.querySelectorAll(".slotActionBtn").forEach(btn => btn.addEventListener("click", () => { const slot = Number(btn.dataset.slot || 1); if (state.saveSlotModal === "save") saveGame(true, slot); else restoreGame(slot); }));
  const cancelSlotModalBtn = document.getElementById("cancelSlotModalBtn");
  if (cancelSlotModalBtn) cancelSlotModalBtn.addEventListener("click", () => { state.saveSlotModal = null; render(); });
  ["refreshAppBtn", "pwaRefreshBtn"].forEach(id => { const btn = document.getElementById(id); if (btn) btn.addEventListener("click", reloadLatestVersion); });
  document.querySelectorAll(".popupCloseBtn").forEach(btn => btn.addEventListener("click", closeActivePopup));
  document.querySelectorAll(".actionResultCloseBtn").forEach(btn => btn.addEventListener("click", closeActionResultModal));
  document.querySelectorAll(".liveProgressNextBtn").forEach(btn => btn.addEventListener("click", showLiveResultAfterProgress));
  document.querySelectorAll(".moveSetlistBtn:not(:disabled)").forEach(btn => btn.addEventListener("click", () => moveSetlistSlot(Number(btn.dataset.slot), btn.dataset.dir)));
  const resetSetlistBtn = document.getElementById("resetSetlistBtn");
  if (resetSetlistBtn) resetSetlistBtn.addEventListener("click", () => { state.livePrepSetlist = null; ensureLivePrepSetlist(); log("セトリを自動初期化した。"); render(); });
  const autoSetlistBtn = document.getElementById("autoSetlistBtn");
  if (autoSetlistBtn) autoSetlistBtn.addEventListener("click", () => { state.livePrepSetlist = autoBuildSetlist(); log("新曲・マンネリ回避を優先してセトリを自動セットした。曲順ボーナスは考慮していない。コピー曲は曲数不足時のみ入ります。", "event"); render(); });
  document.querySelectorAll(".openSongPickerBtn").forEach(btn => btn.addEventListener("click", () => { state.livePrepPickerSlot = Number(btn.dataset.slot || 1); render(); }));
  document.querySelectorAll(".chooseSetlistSongBtn").forEach(btn => btn.addEventListener("click", () => { ensureLivePrepSetlist(); const slot = Number(btn.dataset.slot || state.livePrepPickerSlot || 1); const songId = btn.dataset.songId; const dupSlot = state.livePrepSetlist.findIndex((id, i) => id === songId && i !== slot - 1); if (dupSlot >= 0) { log("同じ曲はセトリに複数入れられません。先に入っている枠と入れ替えました。", "warn"); state.livePrepSetlist[dupSlot] = state.livePrepSetlist[slot - 1]; } state.livePrepSetlist[slot - 1] = songId; state.livePrepPickerSlot = null; render(); }));
  document.querySelectorAll(".closeLivePickerBtn").forEach(btn => btn.addEventListener("click", () => { state.livePrepPickerSlot = null; render(); }));
  document.querySelectorAll(".openSongDetailBtn").forEach(btn => btn.addEventListener("click", () => { state.detailModal = { type:"song", id:btn.dataset.songId }; render(); }));
  document.querySelectorAll(".openMemberDetailBtn").forEach(btn => btn.addEventListener("click", () => { state.detailModal = { type:"member", id:btn.dataset.memberId }; render(); }));
  document.querySelectorAll(".closeDetailModalBtn").forEach(btn => btn.addEventListener("click", () => { state.detailModal = null; render(); }));
  document.querySelectorAll(".merchQtyInput").forEach(inp => {
    const update = () => {
      const id = inp.dataset.merchId;
      syncMerchQtyDom(id, inp.value);
      updateMerchPrepSummaryDom();
    };
    inp.addEventListener("input", update);
    inp.addEventListener("change", update);
  });
  document.querySelectorAll(".merchDigitSelect").forEach(sel => sel.addEventListener("change", () => {
    const id = sel.dataset.merchId;
    syncMerchQtyDom(id, merchValueFromDigits(id));
    updateMerchPrepSummaryDom();
  }));
  document.querySelectorAll(".merchQtyStepBtn").forEach(btn => btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const id = btn.dataset.merchId;
    const current = Number(document.querySelector(`.merchQtyInput[data-merch-id="${id}"]`)?.value || 0);
    const delta = Number(btn.dataset.delta || 0);
    syncMerchQtyDom(id, current + delta);
    updateMerchPrepSummaryDom();
  }));
  const renameBandBtn = document.getElementById("renameBandBtn");
  if (renameBandBtn) renameBandBtn.addEventListener("click", () => { state.renameBandNamePrompt = true; render(); });
  const confirmBandNameBtn = document.getElementById("confirmBandNameBtn");
  if (confirmBandNameBtn) confirmBandNameBtn.addEventListener("click", () => { const name = (document.getElementById("bandNameInput")?.value || "").trim() || "名無しの地下バンド"; const renaming = !!state.renameBandNamePrompt; state.band.name = name; state.bandNamePrompt = false; state.renameBandNamePrompt = false; if (renaming) state.band.fame = clamp(Number(state.band.fame || 0) - 2, 0, 999); log(`バンド名を「${name}」に${renaming ? "変更" : "決定"}した。${renaming ? "認知度が少し下がった。" : ""}`); showEventPopup(renaming ? "バンド名変更" : "バンド名決定", `${renaming ? "新しい名前で活動し直す。" : "今日からこの名前でライブハウスに出る。"}\n${name}${renaming ? "\n認知度-2" : ""}`, "event", "🏷️"); if (state.pendingTurnAdvance) finishPendingTurnAdvance(); else render(); });
  const cancelBandNameBtn = document.getElementById("cancelBandNameBtn");
  if (cancelBandNameBtn) cancelBandNameBtn.addEventListener("click", () => { state.renameBandNamePrompt = false; render(); });
  const confirmNoSongcraftBtn = document.getElementById("confirmNoSongcraftBtn");
  if (confirmNoSongcraftBtn) confirmNoSongcraftBtn.addEventListener("click", confirmNoSongcraftCommand);
  const cancelNoSongcraftBtn = document.getElementById("cancelNoSongcraftBtn");
  if (cancelNoSongcraftBtn) cancelNoSongcraftBtn.addEventListener("click", () => { state.pendingNoSongcraftCommand = null; state.view = "songs"; if (!state.songEditor || state.songEditor.step === "closed") state.songEditor = { step:"menu" }; render(); });
  document.querySelectorAll(".liveResultCloseBtn").forEach(btn => btn.addEventListener("click", closeLiveResultModal));
  const bookLiveBtn = document.getElementById("bookLiveBtn");
  if (bookLiveBtn) bookLiveBtn.addEventListener("click", () => bookLiveFromHome());
  document.querySelectorAll(".liveCandidateBtn").forEach(btn => btn.addEventListener("click", () => { state.pendingBooking = { turn:Number(btn.dataset.turn), venueId:btn.dataset.venue, liveType:btn.dataset.liveType || "self_one_man", invitedBandIds:(btn.dataset.bands || "").split(",").filter(Boolean) }; render(); }));
  document.querySelectorAll(".acceptOfferBtn").forEach(btn => btn.addEventListener("click", () => acceptLiveOffer(btn.dataset.offerId)));
  document.querySelectorAll(".phoneModeBtn").forEach(btn => btn.addEventListener("click", () => { state.phoneSubView = btn.dataset.phoneMode || "menu"; render(); }));
  document.querySelectorAll(".mailOpenBtn").forEach(btn => btn.addEventListener("click", () => openMail(btn.dataset.mailId)));
  document.querySelectorAll(".snsPostBtn").forEach(btn => btn.addEventListener("click", () => snsPost(btn.dataset.snsPost || "chat")));
  document.querySelectorAll(".declineOfferBtn").forEach(btn => btn.addEventListener("click", () => declineLiveOffer(btn.dataset.offerId)));
  document.getElementById("downloadSetlistImageBtn")?.addEventListener("click", downloadSetlistImage);
  const confirmBookingBtn = document.getElementById("confirmBookingBtn");
  if (confirmBookingBtn) confirmBookingBtn.addEventListener("click", () => { const b = state.pendingBooking; state.pendingBooking = null; if (b) bookLiveFromHome(b.turn, b.venueId, true, b.liveType, b.invitedBandIds); });
  const cancelBookingBtn = document.getElementById("cancelBookingBtn");
  if (cancelBookingBtn) cancelBookingBtn.addEventListener("click", () => { state.pendingBooking = null; render(); });
  const joinAfterpartyBtn = document.getElementById("joinAfterpartyBtn");
  if (joinAfterpartyBtn) joinAfterpartyBtn.addEventListener("click", attendAfterparty);
  const skipAfterpartyBtn = document.getElementById("skipAfterpartyBtn");
  if (skipAfterpartyBtn) skipAfterpartyBtn.addEventListener("click", skipAfterparty);
  const cancelCancelLiveBtn = document.getElementById("cancelCancelLiveBtn");
  if (cancelCancelLiveBtn) cancelCancelLiveBtn.addEventListener("click", () => { state.pendingCancelLive = null; render(); });
  const confirmCancelLiveBtn = document.getElementById("confirmCancelLiveBtn");
  if (confirmCancelLiveBtn) confirmCancelLiveBtn.addEventListener("click", () => { const p = state.pendingCancelLive || {}; state.pendingCancelLive = null; cancelBookedLive(Number(p.turn), !!p.noShow); });
  document.querySelectorAll(".cancelLiveBtn").forEach(btn => btn.addEventListener("click", () => { state.pendingCancelLive = { turn:Number(btn.dataset.turn), noShow:false }; render(); }));
  document.querySelectorAll(".selectMemberBtn").forEach(btn => btn.addEventListener("click", () => { state.selectedMemberId = btn.dataset.memberId || "player"; render(); }));
  const noShowBtn = document.getElementById("noShowLiveBtn");
  if (noShowBtn) noShowBtn.addEventListener("click", () => { state.pendingCancelLive = { turn:state.turn, noShow:true }; render(); });
  document.querySelectorAll(".supportCheck").forEach(cb => cb.addEventListener("change", () => { state.livePrepSupportIds = [...document.querySelectorAll(".supportCheck:checked")].map(x => x.value); }));
  const merchSel = document.getElementById("merchSelect");
  if (merchSel) merchSel.addEventListener("change", () => { state.livePrepMerch = merchSel.value; });
  document.querySelectorAll(".positionSelect").forEach(sel => sel.addEventListener("change", handlePositionChange));
  document.querySelectorAll(".chorusSelect").forEach(sel => sel.addEventListener("change", enforceChorusRule));
}

function continuePostLiveFlow() {
  if (state.postLiveStory) {
    const ev = state.postLiveStory;
    state.postLiveStory = null;
    state.activePopup = { title:ev.title, body:ev.body, type:"event", icon:ev.icon || "🕴️" };
    return;
  }
  const next = nextPopupFromQueue();
  if (next) { state.activePopup = next; return; }
  if (state.pendingEndingAfterLive) {
    state.pendingEndingAfterLive = false;
    state.ended = true;
  }
}
function afterpartyEventForBands(bands, rank) {
  const exposure = rivalBandExposureBonus(bands);
  const high = ["S","A"].includes(rank);
  const pool = [
    { key:"contact", title:"連絡先交換", text:`${bands[0]?.name || "共演者"}と連絡先を交換した。次の出演通知が来やすくなる。`, rel:4 + exposure, applicant:0.10, stats:["charisma"] },
    { key:"gear", title:"機材トーク", text:`終演後、音作りや機材の話で盛り上がった。格上の現場感を少し吸収した。`, rel:2 + Math.floor(exposure/2), applicant:0.08, stats:["technique","knowledge"] },
    { key:"song", title:"曲作り相談", text:`新曲の作り方やライブで刺さる構成について話した。表現の引き出しが増えた。`, rel:3 + Math.floor(exposure/2), applicant:0.12, stats:["sense","teamwork"] },
    { key:"intro", title:"紹介の話", text:`別のバンドやサポート候補の話題が出た。連絡先をもらえるかもしれない。`, rel:3 + exposure, applicant:0.38 + exposure * 0.035 + (high ? 0.08 : 0), stats:["teamwork","charisma"] },
    { key:"local", title:"ライブハウス情報", text:`店長や常連の話から、次に出やすいイベントの空気が少し見えてきた。`, rel:3, applicant:0.16, stats:["knowledge","mental"] }
  ];
  if (exposure >= 5) pool.push({ key:"senior", title:"格上からの助言", text:`有名バンドの現場感に触れた。プレッシャーはあるが、伸びしろも大きい。`, rel:5 + exposure, applicant:0.22, stats:["technique","sense","charisma"] });
  return pool[rand(0, pool.length - 1)];
}
function applyAfterpartyStatEvent(event, exposure, rank) {
  const rankBonus = { S:2, A:2, B:1, C:1, D:0, E:0 }[rank] || 0;
  const amount = Math.max(1, Math.floor((exposure + rankBonus) / 3));
  activeMembers().forEach(m => {
    (event.stats || []).forEach(k => { m.stats[k] = clamp((m.stats[k] || 1) + amount, 1, 99); });
  });
  return amount;
}
function hangoverChance(rank, fatigue) {
  const rankReduce = { S:-0.07, A:-0.05, B:-0.03, C:0, D:0.04, E:0.07 }[rank] || 0;
  return clamp(0.01 + fatigue / 520 + rankReduce, 0.01, 0.20);
}
function attendAfterparty() {
  const p = state.pendingAfterparty || {};
  if ((state.band.fatigue || 0) > 80) { log("疲労が高すぎて打ち上げには行けない。", "warn"); state.pendingAfterparty = null; continuePostLiveFlow(); render(); return; }
  const before = state.band.fatigue || 0;
  state.band.fatigue = clamp(before + Math.round(20 * fatigueGainMultiplier()), 0, 100);
  const bands = (p.invitedBandIds || []).map(rivalById).filter(Boolean);
  const hasOtherBands = bands.length > 0;
  const beforeStats = activeMembers().map(m => ({ id:m.id, name:m.name, technique:m.stats.technique, rhythm:m.stats.rhythm, sense:m.stats.sense, mental:m.stats.mental, teamwork:m.stats.teamwork, stamina:m.stats.stamina, charisma:m.stats.charisma, knowledge:m.stats.knowledge }));
  let introText = "";
  let partyEvent = null;
  let partyStatAmount = 0;
  if (hasOtherBands) {
    const exposure = rivalBandExposureBonus(bands);
    partyEvent = afterpartyEventForBands(bands, p.rank);
    bands.forEach(b => setRelationshipWithBand(b.id, relationshipWithBand(b.id) + 8 + (partyEvent.rel || 0)));
    activeMembers().forEach(m => { m.stats.teamwork = clamp(m.stats.teamwork + 1, 1, 99); m.stats.mental = clamp(m.stats.mental + 1, 1, 99); if (["S","A"].includes(p.rank)) m.stats.charisma = clamp(m.stats.charisma + 1, 1, 99); });
    partyStatAmount = applyAfterpartyStatEvent(partyEvent, exposure, p.rank);
    const introChance = clamp(partyEvent.applicant || 0.12, 0.05, 0.75);
    if (Math.random() < introChance) {
      const applicant = addApplicantFromCandidates("打ち上げ紹介");
      if (applicant) {
        addMail("打ち上げで紹介されたメンバー候補", `${bands[0]?.name || "共演者"}から紹介された${applicant.name}です。\nライブ後に連絡先をもらいました。バンド情報から加入を検討できます。`, "member", { sender: bands[0]?.name || "打ち上げで知り合った人" });
        introText = `\n紹介：${applicant.name}の連絡先をもらった。`;
      }
    }
  }
  const chance = hangoverChance(p.rank, state.band.fatigue || 0);
  const hungover = Math.random() < chance;
  if (hungover) {
    state.hangoverTurn = state.turn;
    state.popupQueue = state.popupQueue || [];
    state.popupQueue.push({ title:"二日酔い", body:"打ち上げの疲れが残っている。\nこのターンは休憩しかできない。", type:"warn", icon:"😵" });
  }
  const statLines = hasOtherBands ? activeMembers().slice(0,5).map(m => {
    const b = beforeStats.find(x => x.id === m.id) || {};
    const labels = { technique:"技術", rhythm:"リズム", sense:"感性", mental:"メンタル", teamwork:"協調", stamina:"体力", charisma:"カリスマ", knowledge:"知識" };
    const parts = Object.keys(labels).map(k => {
      const diff = Math.round((m.stats[k] || 0) - (b[k] || 0));
      return diff ? `${labels[k]}+${diff}` : "";
    }).filter(Boolean);
    return parts.length ? `${m.name}：${parts.join(" / ")}` : "";
  }).filter(Boolean) : [];
  const relText = hasOtherBands ? `交流：${bands.map(b=>`${b.name}+${8 + (partyEvent?.rel || 0)}`).join(" / ")}` : "ワンマン/単独後のため、他バンド交流・紹介は発生しなかった。";
  state.popupQueue = state.popupQueue || [];
  state.popupQueue.push({ title:"打ち上げ結果", body:`${relText}${partyEvent ? `\nイベント：${partyEvent.title} - ${partyEvent.text}` : ""}${statLines.length ? "\n" + statLines.join("\n") : ""}${introText}\n疲労+${Math.round(state.band.fatigue-before)}%。二日酔い判定${Math.round(chance*100)}%${hungover ? " → 発生" : " → なし"}。`, type:hungover ? "warn" : "event", icon:"🍻" });
  log(`打ち上げに参加した。${relText}${partyEvent ? " / " + partyEvent.title : ""}${statLines.length ? " / " + statLines.join(" / ") : ""}${introText ? " / " + introText.trim() : ""} 疲労+${Math.round(state.band.fatigue-before)}%。二日酔い判定${Math.round(chance*100)}%${hungover ? " → 発生" : " → なし"}。`, hungover ? "warn" : "event");
  state.pendingAfterparty = null;
  continuePostLiveFlow();
  render();
}
function skipAfterparty() {
  state.pendingAfterparty = null;
  log("打ち上げには行かず、今日は帰ることにした。", "info");
  continuePostLiveFlow();
  render();
}


function makeLiveEventRecord(turn, venueId, liveType, invitedBandIds=[]) {
  const v = venueById(venueId);
  const meta = liveTypeMeta(liveType);
  return { id:`live_${turn}_${venueId}_${liveType}_${Date.now()}_${Math.floor(Math.random()*9999)}`, turn, venueId, liveType, invitedBandIds:[...new Set(invitedBandIds || [])], label:meta.label, fixed:false, booked:true, cancelled:false, name:meta.label, capacity:v.capacity, fee:v.fee, prepNeed:v.prepNeed };
}
function addLiveEventPreservingSchedule(ev) {
  state.liveEvents = Array.isArray(state.liveEvents) ? state.liveEvents : [];
  const exists = state.liveEvents.some(e => !e.cancelled && Number(e.turn) === Number(ev.turn));
  if (exists) return false;
  state.liveEvents.push(ev);
  refreshLiveSchedule();
  scheduleNextLive();
  return true;
}
function bookLiveFromHome(turnArg=null, venueArg=null, confirmed=false, liveTypeArg="self_one_man", invitedBandIdsArg=[]) {
  if (!canBookSchedules()) {
    log("初ライブ後からライブ予約ができるようになります。");
    render();
    return;
  }
  const turn = Number(turnArg || document.getElementById("scheduleTurnSelect")?.value || 0);
  const venueId = venueArg || document.getElementById("scheduleVenueSelect")?.value || VENUES[0].id;
  const liveType = liveTypeArg || "self_one_man";
  const invitedBandIds = Array.isArray(invitedBandIdsArg) ? invitedBandIdsArg : String(invitedBandIdsArg || "").split(",").filter(Boolean);
  if (!turn || turn <= state.turn + 2 || turn >= state.maxTurn) {
    log("ライブ予約は残り2ターン以内になると不可。3ターン以上先の予定から選びます。");
    render();
    return;
  }
  if (liveEventForTurn(turn)) {
    log(`${turn}ターン目はすでにライブ予定があります。`);
    render();
    return;
  }
  if (!confirmed && turnArg && venueArg) { state.pendingBooking = { turn, venueId, liveType, invitedBandIds }; render(); return; }
  const v = venueById(venueId);
  const meta = liveTypeMeta(liveType);
  const finalBandIds = liveType === "self_taiban" ? (invitedBandIds.length ? invitedBandIds : pickRivalBands(2).map(b=>b.id)) : (["booking_house", "booking_band"].includes(liveType) ? (invitedBandIds.length ? invitedBandIds : pickRivalBands(liveType === "booking_house" ? 2 : 1).map(b=>b.id)) : []);
  const ev = makeLiveEventRecord(turn, venueId, liveType, finalBandIds);
  if (!addLiveEventPreservingSchedule(ev)) { log(`${turn}ターン目はすでに別のライブ予定があります。`, "warn"); render(); return; }
  state.liveReservationCandidates = (state.liveReservationCandidates || []).filter(c => !(c.turn === turn && c.venueId === venueId && c.liveType === liveType));
  state.liveHouseEventCandidates = (state.liveHouseEventCandidates || []).filter(c => !(c.turn === turn && c.venueId === venueId && c.liveType === liveType));
  log(`${turn}ターン目に「${meta.label} / ${v.name}」を決定した。キャパ${v.capacity}、${meta.feeLabel}${eventBaseCost({ liveType }, v).toLocaleString()}円。`);
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
  state.livePrepPositions = state.livePrepPositions || {};
  state.livePrepPositions[e.target.dataset.memberId] = e.target.value;
  if (["vocal","guitar_vocal","bass_vocal"].includes(e.target.value)) {
    document.querySelectorAll(".positionSelect").forEach(sel => { if (sel !== e.target && ["vocal","guitar_vocal","bass_vocal"].includes(sel.value)) { sel.value = "off"; state.livePrepPositions[sel.dataset.memberId] = "off"; } });
  }
  enforceChorusRule();
}
function enforceChorusRule() {
  const selects = [...document.querySelectorAll(".chorusSelect")];
  if (!selects.length) { normalizeLivePrepChorusIds(); return; }
  const vocalistId = getPositionMapFromDom().vocalistId;
  const used = new Set();
  let changed = false;
  const ids = selects.map(sel => {
    let value = sel.value || "none";
    if (value !== "none" && value === vocalistId) { value = "none"; changed = true; }
    if (value !== "none" && used.has(value)) { value = "none"; changed = true; }
    if (value !== "none") used.add(value);
    sel.value = value;
    return value;
  });
  if (changed) log("ボーカル兼任や同じ人の重複コーラスは不可のため、コーラス枠を調整した。");
  state.livePrepChorusIds = ids.slice(0, chorusSlotCount());
  state.livePrepChorus = state.livePrepChorusIds.find(id => id && id !== "none") || "none";
}

function handleCommandClick(command) {
  if (showTutorialBlocked("command")) return;
  if (state.hangoverTurn === state.turn && command !== "rest") {
    state.activePopup = { title:"二日酔い", body:"このターンは休憩しかできない。\n休憩を選ぶと通常行動に戻ります。", type:"warn", icon:"😵" };
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
function commandLabel(command) {
  return ({ practice:"練習", rest:"休憩", parttime:"バイト", recruit:"募集", promo:"宣伝", talk:"会話" }[command] || "行動");
}
function runCommandTurn(command) {
  const before = snapshotActionState();
  state.commandCounts = state.commandCounts || {};
  state.commandCounts[command] = (state.commandCounts[command] || 0) + 1;
  executeCommand(command);
  const promoApplicant = maybePromoRecruitAfterCommand(command);
  const event = maybeGenerateCommandEvent(command);
  maybeUnlockProgressSkills(command);
  postTurnMaintenance(command);
  const after = snapshotActionState();
  const tutorialMsg = state.tutorialStage === "needCommand" ? "5ターン目に初ライブだ！\n曲を作り、メンバーを集めよう！" : "";
  if (state.tutorialStage === "needCommand") state.tutorialStage = "done";
  state.actionResultModal = makeActionResultModal(command, before, after, event, tutorialMsg);
  maybeShowFatigueIncreasePopup(before.fatigue, after.fatigue, commandLabel(command) + "で疲労が増えた。");
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
    if (tech || rhythm) rows.push({ name:n.name, tech, rhythm, techBefore:Math.round(p.technique||0), techAfter:Math.round(n.technique||0), rhythmBefore:Math.round(p.rhythm||0), rhythmAfter:Math.round(n.rhythm||0) });
  });
  if ((after.fatigue || 0) >= 60) rows.push({ line:`疲労${Math.round(after.fatigue)}%。疲労が高いほど練習効率は落ちます。` });
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
      ["もう一回だけ", `${member.name}が最後にもう一回合わせようと言った。`, () => { state.band.trust = clamp(state.band.trust + 1,0,100); state.band.fatigue = clamp(state.band.fatigue + 2,0,100); }, "🥁"],
      ["メロディが降ってきた", "練習の合間に、次の曲で使えそうなフレーズが浮かんだ。次の作詞/作曲を1回だけ疲労なしで進められる。", () => { state.freeSongcraftCharge = (state.freeSongcraftCharge || 0) + 1; }, "💡"]
    ],
    rest: [["帰り道", "コンビニ前で少しだけ話して、バンドの空気が軽くなった。", () => { state.band.trust = clamp(state.band.trust + 2,0,100); }, "🌙"]],
    parttime: [["バイト先のBGM", "店内で流れていた曲が妙に耳に残った。", () => { state.band.direction["ポップ"] = (state.band.direction["ポップ"] || 0) + 2; }, "🎧"]],
    recruit: [["貼り紙を見た人", "スタジオの掲示板を見た人から連絡が来た。", () => { state.band.fame = clamp(state.band.fame + 1,0,999); }, "📨"]],
    promo: [["SNSが少し伸びた", "投稿がいつもより少しだけ回った。", () => { state.band.fame = clamp(state.band.fame + 2,0,999); }, "📱"]],
    talk: [["本音の会話", `${member.name}が最近の不安を少し話してくれた。`, () => { state.band.trust = clamp(state.band.trust + 3,0,100); }, "☕"], ["歌詞が降ってきた", "何気ない会話の一言が、次の歌詞の核になった。次の作詞/作曲を1回だけ疲労なしで進められる。", () => { state.freeSongcraftCharge = (state.freeSongcraftCharge || 0) + 1; }, "✍️"]]
  };
  const list = events[command] || events.talk;
  const [title, body, effect, icon] = list[rand(0, list.length - 1)];
  effect();
  log(`イベント発生：${title}。${body}`);
  return { title, body, icon };
}


function candidateInstrumentScore(c, inst) {
  const data = c && c.instruments && c.instruments[inst];
  if (!data) return 0;
  const markScore = data.mark === "◎" ? 4 : data.mark === "○" ? 2.5 : data.mark === "△" ? 1 : 0;
  return markScore + Math.max(0, (data.lv || 0) / 40);
}
function bandInstrumentCoverage(inst) {
  return allBandPeople().reduce((sum, m) => sum + (candidateInstrumentScore(m, inst) >= 2.5 ? 1 : 0), 0);
}
function recruitCandidateWeight(c) {
  const required = ["vocal", "guitar", "bass", "drum"];
  const niceToHave = ["key", "dj"];
  let weight = 1;
  required.forEach(inst => {
    const coverage = bandInstrumentCoverage(inst);
    const score = candidateInstrumentScore(c, inst);
    if (coverage <= 0 && score >= 2.5) weight += 10;
    else if (coverage <= 1 && score >= 2.5) weight += 4;
    else if (score >= 2.5) weight += 1;
  });
  niceToHave.forEach(inst => {
    const coverage = bandInstrumentCoverage(inst);
    const score = candidateInstrumentScore(c, inst);
    if (coverage <= 0 && score >= 2.5) weight += 4;
    else if (score >= 2.5) weight += 1;
  });
  if (c.mainInstrument === "drum" && bandInstrumentCoverage("drum") <= 0) weight += 8;
  return weight;
}
function pickRecruitCandidateIndex() {
  if (!state.candidates.length) return -1;
  const weights = state.candidates.map(recruitCandidateWeight);
  const total = weights.reduce((a,b)=>a+b,0);
  let r = Math.random() * total;
  for (let i=0; i<weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return state.candidates.length - 1;
}


function executeCommand(command) {
  const b = state.band;
  if (command === "practice") {
    const cost = 1500 + activeMembers().length * 500;
    state.band.funds -= cost;
    activeMembers().forEach(m => {
      const practiceBoost = (hasSkill("practice_efficiency") ? 1.2 : 1) * fatigueEffectMultiplier();
      m.stats.technique = clamp(m.stats.technique + Math.ceil(rand(1,3) * practiceBoost), 1, 99);
      m.stats.rhythm = clamp(m.stats.rhythm + Math.ceil(rand(0,2) * practiceBoost), 1, 99);
      const inst = m.instruments[m.mainInstrument];
      if (inst) inst.lv = clamp(inst.lv + rand(2,5) * (inst.growth || 1), 1, inst.potentialCap || inst.cap);
    });
    state.songs.forEach(s => s.performance = clamp(s.performance + Math.max(0, Math.round(rand(1,3) * fatigueEffectMultiplier())), 0, 99));
    addFatigue(14 - (hasSkill("shortcut_command") ? 2 : 0));
    b.trust = clamp(b.trust + 2, 0, 100);
    log(`練習した。技術・リズム・楽器Lv・曲の演奏が少し上がった。費用-${cost.toLocaleString()}円、疲労も増えた。`);
  }
  if (command === "rest") {
    if (state.hangoverTurn === state.turn) state.hangoverTurn = 0;
    b.fatigue = 0;
    b.trust = clamp(b.trust + 4, 0, 100);
    activeMembers().forEach(m => m.stats.mental = clamp(m.stats.mental + rand(1,3), 1, 99));
    log("休憩した。疲労が全快し、メンタルと信頼度が少し戻った。 ");
  }
  if (command === "parttime") {
    b.funds += 18000;
    addFatigue(18);
    b.trust = clamp(b.trust - 1, 0, 100);
    log("バイトした。資金+18,000円。ただし疲労が増えた。 ");
  }
  if (command === "recruit") {
    const cost = 3000;
    b.funds -= cost;
    const applicant = addApplicantFromCandidates("募集");
    if (!applicant) {
      log("募集したが、新しい候補はもう見つからなかった。 ");
    } else {
      b.fame = clamp(b.fame + 1, 0, 999);
      log(`${applicant.name}が募集を見て連絡してきた。募集費-${cost.toLocaleString()}円。加入させるか選べる。`);
    }
  }
  if (command === "promo") {
    const cost = 3000;
    b.funds -= cost;
    const eff = fatigueEffectMultiplier();
    const snsBoost = hasSkill("sns_master") ? 1.35 : 1;
    b.fame = clamp(b.fame + Math.max(1, Math.round(rand(4,8) * eff * snsBoost)), 0, 999);
    state.songs.forEach(s => s.recognition = clamp(s.recognition + Math.max(0, Math.round(rand(1,3) * eff)), 0, 99));
    if (eff < 1) log(`疲労が高く、宣伝効率が${Math.round(eff*100)}%まで落ちている。`, "warn");
    state.promoRecruitTurns = 3;
    state.bookingInviteBoostTurns = hasSkill("sns_master") ? 4 : 3;
    addSnsPost("@our_band", "次のライブに向けて告知中。ブッキングの声もかかりやすくなりそう。", "self");
    log(`宣伝した。知名度と曲の認知度が上がった。宣伝費-${cost.toLocaleString()}円。3ターンの間、加入希望とライブ招待が来やすくなる。`);
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
  log(`${applicant.name}が${applicant.joinStatus}として加入した。加入済みメンバーは全員バンド構成に入り、ライブ準備で担当を選べる。`);
  showEventPopup(applicant.joinStatus === "仮加入" ? "仮加入！" : "新メンバー加入！", `${applicant.name} がバンドに加わった！\n担当：${applicant.part}\n得意：${applicant.mainGenre}\n加入済みメンバーは全員ライブ準備に表示される。`, applicant.joinStatus === "仮加入" ? "event" : "rare", applicant.joinStatus === "仮加入" ? "🤝" : "🎉");
  maybeExplainMemberCost();
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
function bringReserveToBand(index) {
  log("控えは撤廃済みです。加入済みメンバーは全員バンド構成に入っています。");
  render();
}
function benchMember(index) {
  log("控えは撤廃済みです。外したい場合はライブ準備で担当を『ステージ外』にしてください。");
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
  state.memberCap = 999;
  log("最大人数と控えは撤廃済みです。加入済みメンバーは全員ライブ準備に表示されます。");
  render();
}
function buyItem(item) {
  if (String(item || "").startsWith("gear:")) {
    const id = String(item).split(":")[1];
    const gear = equipmentById(id);
    if (!gear) { render(); return; }
    const lv = equipmentLevel(id);
    if (lv >= 5) { log(`${gear.name}はLv5で最大強化済み。`); render(); return; }
    let price = equipmentUpgradeCost(id);
    if (hasSkill("saving_master")) price = Math.round(price * 0.95);
    state.band.funds -= price;
    state.equipment[id] = lv + 1;
    log(`${gear.name}をLv${lv + 1}に強化した。-${price.toLocaleString()}円。ライブ・物販・準備に補正が入る。`, "event");
    maybeUnlockProgressSkills("gear");
    render();
    return;
  }
  const prices = { drink: 5000, effecter: 50000, usedGear: 60000, lightFx: 45000 };
  const names = { drink: "疲労回復ドリンク", effecter: "エフェクター", usedGear: "中古楽器", lightFx: "照明エフェクト" };
  let price = prices[item] || 0;
  if (hasSkill("saving_master") && item !== "drink") price = Math.round(price * 0.95);
  const maxStock = { drink:99, effecter:5, usedGear:5, lightFx:5 };
  if ((state.items[item] || 0) >= (maxStock[item] || 99)) { log(`${names[item]}はこれ以上持てない。`); render(); return; }
  state.band.funds -= price;
  state.items[item] = (state.items[item] || 0) + 1;
  log(`${names[item]}を購入した。-${price.toLocaleString()}円。`);
  maybeUnlockProgressSkills("shop");
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
  const upkeep = memberUpkeepCost();
  if (upkeep) { b.funds -= upkeep; log(`メンバー維持費・交通費で-${upkeep.toLocaleString()}円。${activeCount >= 6 ? "大所帯で出費が重くなっている。" : ""}`); }
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
  // v0.3.13: 控え撤廃。自然脱退処理は停止。
  (state.members || []).forEach(m => {
    m.reserveTurns = 0;
    m.reserveWarned = false;
  });
}

function executeSongcraftFromForm() {
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
  let ok = false;
  if (mode === "new") ok = createDraftAndAdvance(type, member, mainGenre, mainGenre, theme, keyword, arrange, title);
  if (mode === "draft") {
    const draftId = document.getElementById("craftDraft")?.value;
    if (!draftId || draftId === "none") log("進める制作中の曲がありません。");
    else ok = advanceDraftById(draftId, type, member);
  }
  if (mode === "boost") { boostSong(type, member, document.getElementById("craftSong")?.value); ok = true; }
  if (ok) completeSongcraftTutorial();
  render();
}

function executeDraftCraft(draftId, type) {
  const member = activeMembers().find(m => m.id === document.getElementById("craftMember")?.value) || state.player;
  const ok = advanceDraftById(draftId, type, member);
  if (ok) completeSongcraftTutorial();
  render();
}

function craftLevel(type) {
  const xp = type === "lyrics" ? (state.playerCraft?.lyricsXp || 0) : (state.playerCraft?.musicXp || 0);
  if (xp >= 10) return 3;
  if (xp >= 4) return 2;
  return 1;
}
function plannedSongcraftFatigueCost(type, baseCost) {
  if ((state.freeSongcraftCharge || 0) > 0) return 0;
  const lv = craftLevel(type);
  const skillReduce = (hasSkill("dual_songcraft") ? 2 : 0) + (hasSkill("shortcut_command") ? 1 : 0);
  return Math.round(Math.max(0, baseCost - lv - skillReduce) * fatigueGainMultiplier());
}
function canStartSongcraft(type, baseCost, label) {
  if (state.songcraftUsedThisTurn && !mustCompleteFirstDraftTutorial()) {
    showEventPopup("今週の曲作りは完了", "曲作り・曲強化は1ターン1回までにしました。次のターンに続きを進めよう。", "warn", "🎼");
    return false;
  }
  const cost = plannedSongcraftFatigueCost(type, baseCost);
  if ((state.band.fatigue || 0) + cost > 100) {
    showEventPopup("疲労限界", `${label}には疲労${cost}%が必要です。疲労が100％を超えるため、先に休憩かドリンクを使おう。`, "warn", "⚠️");
    return false;
  }
  return true;
}
function canStartAnySongcraft(types, baseCost, label) {
  if (state.songcraftUsedThisTurn && !mustCompleteFirstDraftTutorial()) {
    showEventPopup("今週の曲作りは完了", "曲作り・曲強化は1ターン1回までにしました。次のターンに続きを進めよう。", "warn", "🎼");
    return false;
  }
  const list = Array.isArray(types) ? types : [types];
  const remaining = 100 - (state.band.fatigue || 0);
  const minCost = Math.min(...list.map(t => plannedSongcraftFatigueCost(t, baseCost)));
  if (remaining < minCost) {
    showEventPopup("疲労限界", `${label}には最低でも疲労${minCost}%の余力が必要です。先に休憩かドリンクを使おう。`, "warn", "⚠️");
    return false;
  }
  return true;
}
function songcraftFatigueCost(type, baseCost) {
  const lv = craftLevel(type);
  let freeChance = lv >= 2 ? (lv - 1) * 0.02 : 0;
  if (hasSkill("midnight_inspiration") && (state.band.fatigue || 0) >= 60) freeChance += 0.08;
  if ((state.freeSongcraftCharge || 0) > 0) { state.freeSongcraftCharge -= 1; return { cost:0, free:true, reason:"ひらめきストック" }; }
  if (Math.random() < freeChance) return { cost:0, free:true, reason:"作詞作曲Lv" };
  const skillReduce = (hasSkill("dual_songcraft") ? 2 : 0) + (hasSkill("shortcut_command") ? 1 : 0);
  return { cost:Math.round(Math.max(0, baseCost - lv - skillReduce) * fatigueGainMultiplier()), free:false, reason:"" };
}
function applySongcraftFatigue(type, baseCost, member, label) {
  const r = songcraftFatigueCost(type, baseCost);
  if ((state.band.fatigue || 0) + r.cost > 100) {
    showEventPopup("疲労限界", `${label}には疲労${r.cost}%が必要です。疲労が100％を超えるため、先に休憩かドリンクを使おう。`, "warn", "⚠️");
    return false;
  }
  const fatigueBeforeCraft = state.band.fatigue || 0;
  state.band.fatigue = clamp((state.band.fatigue || 0) + r.cost, 0, 100);
  if (!state.playerCraft) state.playerCraft = { lyricsXp:0, musicXp:0 };
  const beforeLv = craftLevel(type);
  if (type === "lyrics") state.playerCraft.lyricsXp = (state.playerCraft.lyricsXp || 0) + 1;
  if (type === "music") state.playerCraft.musicXp = (state.playerCraft.musicXp || 0) + 1;
  maybeUnlockProgressSkills("songcraft");
  const afterLv = craftLevel(type);
  if (afterLv > beforeLv) {
    showEventPopup(type === "lyrics" ? "作詞Lv UP!!" : "作曲Lv UP!!", `${type === "lyrics" ? "作詞" : "作曲"}Lvが${afterLv}になった！
疲労軽減・疲労なし制作・サブジャンル派生が少し有利になる。`, "rare", "⬆️");
  }
  activeMembers().forEach(m => {
    m.stats.sense = clamp(m.stats.sense + 1, 1, 99);
    if (type === "lyrics") m.stats.knowledge = clamp(m.stats.knowledge + 1, 1, 99);
    if (type === "music") m.stats.rhythm = clamp(m.stats.rhythm + 1, 1, 99);
  });
  if (member) {
    member.stats.sense = clamp(member.stats.sense + 1, 1, 99);
    if (type === "lyrics") member.stats.knowledge = clamp(member.stats.knowledge + 2, 1, 99);
    if (type === "music") member.stats.technique = clamp(member.stats.technique + 2, 1, 99);
  }
  if (r.free) { log(`${label}は${r.reason}で疲労なしで進められた。`, "rare"); showEventPopup("ひらめき制作！", `${label}は${r.reason}で疲労なしで進められた。
今週はまだ余力が残っている。`, "rare", "💡"); }
  else {
    log(`${label}で疲労+${r.cost}%。作詞Lv${craftLevel("lyrics")} / 作曲Lv${craftLevel("music")}。`, "song");
    maybeShowFatigueIncreasePopup(fatigueBeforeCraft, state.band.fatigue, `${label}で疲労がたまった。`);
  }
  return true;
}
function fatigueEffectMultiplier() {
  const f = state.band.fatigue || 0;
  if (f >= 90) return 0.45;
  if (f >= 80) return 0.60;
  if (f >= 70) return 0.75;
  if (f >= 60) return 0.90;
  return 1;
}
function fatigueGainMultiplier() { return hasSkill("self_management") ? 0.8 : 1; }
function addFatigue(amount, reason="") {
  const before = state.band.fatigue || 0;
  const inc = Math.round(Number(amount || 0) * fatigueGainMultiplier());
  state.band.fatigue = clamp(before + inc, 0, 100);
  if (reason) log(`${reason} 疲労+${inc}%${hasSkill("self_management") ? "（段取り上手で軽減）" : ""}。`);
  return { before, after:state.band.fatigue, inc };
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
  if (!canStartSongcraft(type, 20, type === "lyrics" ? "作詞" : "作曲")) return false;
  const titleHint = inputTitle || makeTitle(keyword || "新しい言葉", theme || "---");
  let draft = state.pendingDrafts.find(d => d.titleHint === titleHint);
  if (!draft) {
    const a = mainGenreA || MAIN_GENRES[0];
    const b = mainGenreB || a;
    const resolved = resolveSongGenrePair(a, b, arrange || ARRANGES[0]);
    draft = {
      id: `draft_${Date.now()}_${rand(100,999)}`,
      titleHint,
      mainGenre: resolved.mainGenre,
      subGenre: resolved.subGenre || "",
      genre: resolved.subGenre || resolved.mainGenre,
      sourceMainGenres: resolved.sourceMainGenres,
      genreRollType: resolved.rollType,
      genreChanceText: resolved.chanceText,
      theme: theme || "---",
      keyword: keyword || "",
      arrange: arrange || "",
      lyricsDone: false, musicDone: false, lyricsScore: 0, musicScore: 0, tags: []
    };
    state.pendingDrafts.push(draft);
    const rollLabel = resolved.rollType === "main" ? "メインジャンル生成" : resolved.rollType === "combo-sub" ? "狙い派生成功" : "派生サブジャンル生成";
    log(`新曲「${titleHint}」の種が生まれた。狙い:${a}→${b} / 結果:${genreDisplay(draft)}（${rollLabel}） / ${resolved.chanceText}`);
  } else {
    log(`制作中の「${titleHint}」を続ける。`);
  }
  if (type === "lyrics" && keyword) draft.keyword = keyword;
  if (type === "music") applyDraftMusicFields(draft, mainGenreA, mainGenreB, arrange);
  return advanceDraft(draft, type, member);
}

function advanceDraftById(draftId, type, member) {
  const draft = state.pendingDrafts.find(d => d.id === draftId);
  if (!draft) { log("指定された制作中の曲が見つからなかった。"); return false; }
  return advanceDraft(draft, type, member);
}

function advanceDraft(d, type, member) {
  if (type === "lyrics" && d.lyricsDone) { log(`「${d.titleHint}」の作詞はすでに完了している。未作成の作曲を選んでください。`); return false; }
  if (type === "music" && d.musicDone) { log(`「${d.titleHint}」の作曲はすでに完了している。未作成の作詞を選んでください。`); return false; }
  if (!applySongcraftFatigue(type, 20, member, type === "lyrics" ? "作詞" : "作曲")) return false;
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
    state.songEditor = { step:"draftFinalize", draftId:d.id, title:d.titleHint, theme:d.theme };
    showEventPopup("曲完成前確認", `「${d.titleHint}」の作詞と作曲が揃った。\n曲名とテーマを確認して、完成させよう。`, "song", "💿");
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
  return true;
}

function makeTitle(keyword, theme) {
  const safeTheme = theme && theme !== "---" ? theme : "無題";
  const patterns = safeTheme === "無題" ? [
    `${keyword}`,
    `${keyword} Runaway`,
    `${keyword}はまだ鳴ってる`,
    `Still ${keyword}`,
    `${keyword}の夜`
  ] : [
    `${keyword}の${safeTheme}`,
    `${keyword}, ${safeTheme}`,
    `${keyword} Runaway`,
    `${safeTheme} under light`,
    `${keyword}はまだ鳴ってる`
  ];
  return patterns[rand(0, patterns.length - 1)];
}

function finishDraft(draftId) {
  const idx = state.pendingDrafts.findIndex(d => d.id === draftId);
  if (idx < 0) return;
  const d = state.pendingDrafts[idx];
  const avgScore = (d.lyricsScore + d.musicScore) / 2;
  const liveExperienceBonus = Math.min(12, (state.liveCount || 0) * 2 + Math.floor((state.band.industry || 0) / 20));
  const song = {
    id: `song_${Date.now()}`,
    title: d.titleHint,
    isCover: false,
    catchy: clamp(35 + avgScore * 0.35 + liveExperienceBonus * 0.8 + (analyzeKeywordText(d.keyword,d.theme).tags.includes("青春") ? 3 : 0) + rand(-8, 8), 0, 99),
    tempo: clamp(8 + d.musicScore * 0.45 + (d.arrange.includes("疾走") ? 8 : 0) + (d.arrange.includes("ドラム") ? 4 : 0) + rand(-4, 6), 0, 99),
    mainGenre: d.mainGenre || subParent(d.subGenre || d.genre),
    subGenre: d.subGenre || "",
    genre: d.subGenre || d.mainGenre || d.genre,
    recognition: 0,
    lyrics: clamp(5 + d.lyricsScore * 0.65 + liveExperienceBonus + rand(-4, 6), 0, 99),
    performance: clamp(5 + d.musicScore * 0.65 + liveExperienceBonus + rand(-4, 6), 0, 99),
    trend: clamp(10 + liveExperienceBonus * 1.2 + (d.arrange.includes("シンセ") || d.arrange.includes("DJ") ? 8 : 0) + rand(0, 22), 0, 99),
    tags: [...new Set([...(d.tags.length ? d.tags : []), "新曲"])],
    standardPoints: 0,
    representativePoints: 0,
    createdTurn: state.turn,
    livePlays: 0,
    lastLiveTurn: 0,
    lastLiveSlot: 0,
    consecutiveLiveUses: 0,
    mannerism: 0,
    boostLevel: 0,
    theme: d.theme || "---",
    keyword: d.keyword || "",
    arrange: d.arrange || ""
  };
  const greatSuccess = Math.random() < 0.10;
  if (greatSuccess) {
    ["catchy","tempo","recognition","lyrics","performance","trend"].forEach(k => song[k] = clamp(Math.round((song[k] || 0) * 1.5), 0, 99));
    song.tags = [...new Set([...(song.tags || []), "定番", "大成功"])];
    song.standardPoints = Math.max(song.standardPoints || 0, 5);
    song.mannerism = 0;
    log(`作詞作曲が大成功！「${song.title}」は完成直後から定番曲になった。ステータスが大きく伸びた。`, "rare");
  }
  state.songs.push(song);
  state.songTitleHistory = state.songTitleHistory || [];
  state.songTitleHistory.push({ title:song.title, genre:genreDisplay(song), turn:state.turn });
  maybeUnlockProgressSkills("song");
  updateDirection(song.mainGenre, 5); if (song.subGenre) updateDirection(song.subGenre, 4);
  state.pendingDrafts.splice(idx, 1);
  if (Array.isArray(state.firstDraftTutorialDraftIds) && state.firstDraftTutorialDraftIds.includes(draftId) && !firstDraftTutorialTargets().length) {
    state.firstDraftTutorialPending = false;
    state.firstDraftTutorialCompleted = true;
  }
  const discovery = registerGenreDiscovery(song.subGenre, song.title);
  if (discovery) {
    showEventPopup(discovery.rare ? "RARE GENRE DISCOVERED!!" : "NEW GENRE DISCOVERED!!", `${discovery.rare ? "レア" : "新"}ジャンル「${discovery.genre}」を発見！\n「${song.title}」から生まれた新しい方向性。`, discovery.rare ? "rare" : "song", discovery.rare ? "⭐" : "💡");
  }
  const bonusLines = [];
  if (discovery?.rare) bonusLines.push(`レアジャンル発見：${genreDisplay(song)}`);
  if (song.tags.includes("疾走感")) bonusLines.push("疾走感タグ");
  if (song.tags.includes("エモさ")) bonusLines.push("エモさタグ");
  if (song.tags.includes("大成功")) bonusLines.push("作詞作曲大成功：定番曲化＋ステータス1.5倍");
  const resultBody = `「${song.title}」
ジャンル：${genreDisplay(song)}
${liveExperienceBonus ? `ライブ経験ボーナス：+${val(liveExperienceBonus)}
` : ""}歌詞:${val(song.lyrics)} / 演奏:${val(song.performance)} / テンポ:${val(song.tempo)} / キャッチー:${val(song.catchy)} / 流行:${val(song.trend)}
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
  const sg = SUB_GENRES.find(x => x.name === genre);
  // メインジャンルは最初から知っている扱い。ポップ/図鑑発見は派生・レアジャンルだけに絞る。
  if (!sg) return null;
  if (state.discoveredGenres[genre]) return null;
  const rare = sg?.rarity === "rare";
  state.discoveredGenres[genre] = { turn: state.turn, songTitle, rare: !!rare };
  log(`${rare ? "レア" : "新"}ジャンル発見！『${genre}』${songTitle ? `（${songTitle}）` : ""}`, rare ? "rare" : "song");
  return { genre, rare: !!rare };
}

function boostSongSimple(songId) {
  const s = state.songs.find(x => x.id === songId);
  if (!s) return false;
  if (!applySongcraftFatigue("music", 10, state.player, "曲強化")) return false;
  const levelBefore = Number(s.boostLevel || 0);
  const base = 4 + Math.min(8, Math.floor((state.band.industry || 0) / 35)) + Math.min(5, levelBefore);
  const gain = clamp(base + rand(0, 4) - Math.floor((state.band.fatigue || 0) / 35), 2, 16);
  s.performance = clamp((s.performance || 0) + gain, 0, 99);
  s.lyrics = clamp((s.lyrics || 0) + Math.ceil(gain * 0.45), 0, 99);
  s.catchy = clamp((s.catchy || 0) + Math.ceil(gain * 0.35), 0, 99);
  s.tempo = clamp((s.tempo || 0) + Math.ceil(gain * 0.20), 0, 99);
  s.trend = clamp((s.trend || 0) + rand(0, 2), 0, 99);
  s.recognition = clamp((s.recognition || 0) + 1, 0, 99);
  s.boostLevel = levelBefore + 1;
  s.standardPoints = (s.standardPoints || 0) + 1;
  s.mannerism = Math.max(0, (s.mannerism || 0) - 3);
  if (s.boostLevel >= 3 && !hasTag(s, "磨き込み")) s.tags.push("磨き込み");
  if ((s.standardPoints || 0) >= 5 && !hasTag(s, "定番")) { s.tags.push("定番"); s.mannerism = 0; }
  const bars = ["catchy","tempo","recognition","lyrics","performance","trend"].map(k => ({ label: statSongLabel(k), value: val(s[k]||0) }));
  state.lastSongcraftResult = { title:"曲強化完了", body:`「${s.title}」を強化した。
強化Lv ${levelBefore} → ${s.boostLevel}
演奏+${val(gain)} / 歌詞・キャッチーも少しUP`, bars };
  showEventPopup("曲強化完了", state.lastSongcraftResult.body, "song", "📈", { bars });
  log(`「${s.title}」を曲強化。強化Lv${levelBefore}→${s.boostLevel}、演奏+${val(gain)}。`, "song");
  return true;
}

function editSongMetadataFromEditor(songId) {
  const s = state.songs.find(x => x.id === songId);
  if (!s) return;
  if (!applySongcraftFatigue("music", 10, state.player, "曲編集")) return;
  const oldTitle = s.title;
  const oldGenre = genreDisplay(s);
  const title = (document.getElementById("editSongTitle")?.value || "").trim();
  const main = document.getElementById("editMainGenre")?.value || s.mainGenre || subParent(s.genre);
  const arr = document.getElementById("editArrange")?.value || s.arrange || ARRANGES[0];
  const theme = document.getElementById("editTheme")?.value || s.theme || "---";
  const lyricsText = (document.getElementById("editLyricsText")?.value || s.keyword || "").trim();
  if (title) s.title = title;
  s.mainGenre = main;
  s.subGenre = "";
  s.genre = main;
  s.arrange = arr;
  s.theme = theme;
  s.keyword = lyricsText;
  const kw = analyzeKeywordText(lyricsText, theme);
  if (kw.tags?.length) s.tags = [...new Set([...(s.tags||[]), ...kw.tags.slice(0,2)])];
  s.mannerism = Math.max(0, (s.mannerism || 0) - 3);
  const bars = ["catchy","tempo","recognition","lyrics","performance","trend"].map(k => ({ label: statSongLabel(k), value: val(s[k]||0) }));
  showEventPopup("曲編集完了", `「${oldTitle}」を編集した。\n曲名：${oldTitle} → ${s.title}\nジャンル：${oldGenre} → ${genreDisplay(s)}\nテーマ：${theme}\n歌詞：${lyricsText || "-"}`, "song", "✏️", { bars });
  log(`「${oldTitle}」を曲編集。ジャンル:${oldGenre}→${genreDisplay(s)}。`);
}
function boostSong(type, member, songId) {
  return boostSongSimple(songId);
}

function arrangeSongFromEditor(songId) {
  const s = state.songs.find(x => x.id === songId);
  if (!s) return;
  if (!applySongcraftFatigue("music", 10, state.player, "編曲/編集")) return;
  const old = clone(s);
  const main = document.getElementById("arrangeMainGenre")?.value || s.mainGenre || subParent(s.genre);
  const arr = document.getElementById("arrangeArrange")?.value || s.arrange || ARRANGES[0];
  const theme = document.getElementById("arrangeTheme")?.value || s.theme || "---";
  const keyword = (document.getElementById("arrangeKeyword")?.value || s.keyword || "").trim();
  const param = document.getElementById("arrangeParam")?.value || "performance";
  const baseGain = 4 + rand(0,4);
  s.mainGenre = main;
  s.subGenre = s.subGenre || "";
  s.genre = s.subGenre || main;
  s.arrange = arr;
  s.theme = theme;
  s.keyword = keyword;
  const kw = analyzeKeywordText(keyword, theme);
  if (kw.tags?.length) s.tags = [...new Set([...(s.tags||[]), ...kw.tags.slice(0,2)])];
  s[param] = clamp((s[param] || 0) + baseGain, 0, 99);
  s.mannerism = Math.max(0, (s.mannerism || 0) - 5);
  s.standardPoints = (s.standardPoints || 0) + 1;
  const bars = ["catchy","tempo","recognition","lyrics","performance","trend"].map(k => ({ label: statSongLabel(k), value: val(s[k]||0) }));
  showEventPopup("編曲完了", `「${s.title}」を編曲した。\n${statSongLabel(param)} +${baseGain}\nジャンル:${genreDisplay(old)} → ${genreDisplay(s)}\nアレンジ:${arr}`, "song", "🎛️", { bars });
  log(`「${s.title}」を編曲した。${statSongLabel(param)}+${baseGain}。`);
}
function statSongLabel(k) {
  return { catchy:"キャッチー", tempo:"テンポ", recognition:"認知度", lyrics:"歌詞", performance:"演奏", trend:"流行" }[k] || k;
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
    if (["vocal","guitar_vocal","bass_vocal"].includes(sel.value)) vocalistId = id;
  });
  if (!vocalistId) {
    vocalistId = "player";
    map.player = "vocal";
  }
  return { map, vocalistId };
}

function performLive() {
  const allSongs = playableSongs();
  const domIds = [...document.querySelectorAll(".setlistSelect")].map(x => x.value);
  const ids = domIds.length ? domIds : ensureLivePrepSetlist();
  const setlist = ids.map(id => clone(allSongs.find(s => s.id === id))).filter(Boolean);
  const supportIds = [...document.querySelectorAll(".supportCheck:checked")].map(x => x.value);
  state.livePrepSupportIds = supportIds;
  const supports = supportIds.map(id => DATA.supportOptions.find(s => s.id === id)).filter(Boolean);
  const merch = collectMerchOrdersFromDom();
  state.livePrepMerchOrders = merch;
  state.livePrepMerch = Object.values(merch).some(v => v > 0) ? "custom" : "none";
  const { map: positions, vocalistId } = getPositionMapFromDom();
  enforceChorusRule();
  const chorusIds = (state.livePrepChorusIds || []).filter(id => id && id !== "none" && id !== vocalistId);
  const vocalist = activeMembers().find(m => m.id === vocalistId) || state.player;
  const chorus = chorusIds.map(id => activeMembers().find(m => m.id === id)).filter(Boolean);
  const result = calculateLive(setlist, supports, merch, positions, vocalist, chorus);
  result.setlistIds = setlist.map(s => s.id);
  state.deferPopupsUntilAfterLive = true;
  applyLiveResult(result, setlist, supports, merch);
  state.pendingLiveResultModal = makeLiveResultModal(result, setlist);
  state.liveProgressModal = makeLiveProgressModal(result, setlist);
  state.livePrepPickerSlot = null;
  state.detailModal = null;
  const firstLive = state.liveCount === 0;
  result.title = currentLiveName();
  state.liveResultHistory.push(result);
  state.liveCount += 1;
  if (firstLive) {
    state.playerExtraInstrumentsUnlocked = true;
    state.scheduleTutorialStage = "needSchedule";
    state.popupQueue = state.popupQueue || [];
    state.popupQueue.push({ title:"新しい可能性", body:"主人公「ボーカル以外にも道があるかな……」\n主人公がボーカル以外の楽器も担当可能になった。", type:"event", icon:"🎸" });
    state.popupQueue.push({ title:"スケジュール解放", body:"次からは自分でライブ予定を組む。\nまずはスケジュール帳を開いて、出たいライブを探そう。", type:"event", icon:"📅" });
  }
  else if (state.turn < state.maxTurn && shouldPushFesShortagePopup(result)) {
    state.popupQueue = state.popupQueue || [];
    state.popupQueue.push(buildFesShortagePopup(result));
  }
  if (state.turn === state.maxTurn) {
    state.pendingEndingAfterLive = true;
  } else {
    state.turn += 1;
    state.view = "home";
    scheduleNextLive();
    processNewTurnNotifications("post_live");
  }
  render();
}

function shouldPushFesShortagePopup(lastResult=null) {
  const nextGoal = state.turn < 30 ? 30 : 50;
  const remaining = nextGoal - state.turn;
  const lines = fesShortageLines(lastResult, state.turn >= 30);
  const achieved = lines.length === 0;
  if (remaining === 5) return true;
  if (achieved && state.lastFesGoalPopupTurn !== state.turn) { state.lastFesGoalPopupTurn = state.turn; return true; }
  return false;
}
function buildFesShortagePopup(lastResult=null) {
  const grand = state.turn >= 30;
  const lines = fesShortageLines(lastResult, grand);
  const goalName = grand ? "GRAND UNDER FES" : "UNDER FES";
  const body = lines.length
    ? `${goalName}まで、まだ足りないものがある。\n\n${lines.map(x => `・${x}`).join("\n")}`
    : `${goalName}のラインはかなり近い。\n次はセトリ相性・新曲・定番曲の使い分けで安定を狙おう。`;
  return { title:"目標までの不足", body, type:lines.length ? "warn" : "rare", icon:lines.length ? "📋" : "⭐" };
}
function fesShortageLines(lastResult=null, grand=false) {
  const b = state.band;
  const originalCount = state.songs.filter(song => !song.isCover).length;
  const repCount = state.songs.filter(s => hasTag(s,"代表曲候補") || hasTag(s,"定番")).length;
  const freshCount = state.songs.filter(s => !s.isCover && (s.livePlays || 0) <= 1 && state.turn - (s.createdTurn || 0) <= 10).length;
  const lines = [];
  if (!grand) {
    if (originalCount < 5) lines.push(`オリジナル曲 あと${5 - originalCount}曲`);
    if (b.fans < 60) lines.push(`ファン あと${60 - Math.round(b.fans)}人`);
    if (b.fame < 60) lines.push(`知名度 あと${60 - Math.round(b.fame)}`);
    if (b.industry < 55) lines.push(`業界評価 あと${55 - Math.round(b.industry)}`);
    if (lastResult && !["S","A","B"].includes(lastResult.rank)) lines.push(`直近ライブ評価 B以上が必要（今回は${lastResult.rank}）`);
  } else {
    if (originalCount < 7) lines.push(`オリジナル曲 あと${7 - originalCount}曲`);
    if (repCount < 2) lines.push(`代表曲/定番曲 あと${2 - repCount}曲`);
    if (freshCount < 1) lines.push("後半の新曲評価 1曲以上");
    if (b.fans < 180) lines.push(`ファン あと${180 - Math.round(b.fans)}人`);
    if (b.fame < 150) lines.push(`知名度 あと${150 - Math.round(b.fame)}`);
    if (b.industry < 135) lines.push(`業界評価 あと${135 - Math.round(b.industry)}`);
    if (lastResult && !["S","A"].includes(lastResult.rank)) lines.push(`直近ライブ評価 A以上が必要（今回は${lastResult.rank}）`);
  }
  if (b.fatigue > 80) lines.push(`疲労が高すぎる（${Math.round(b.fatigue)}%。練習/宣伝効率も下がる）`);
  if (b.funds < 0) lines.push("資金がマイナス（バイト・小さめ会場で立て直し）");
  return lines;
}


function setlistKey(setlist) {
  return setlist.map(s => s?.id || s?.title || "unknown").join(">");
}
function setlistSongKey(setlist) {
  return setlist.map(s => s?.id || s?.title || "unknown").sort().join("+");
}
function songIsNewForSetlist(song) {
  if (!song || song.isCover) return false;
  if (hasTag(song, "定番")) return false;
  return (song.livePlays || 0) === 0 || hasTag(song, "新曲");
}
function songIsExistingForSetlist(song) {
  if (!song || song.isCover) return false;
  return !songIsNewForSetlist(song);
}
function setlistHistoryInfo(setlist) {
  const exact = setlistKey(setlist);
  const unordered = setlistSongKey(setlist);
  const history = state.setlistHistory || [];
  let exactStreak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i]?.exactKey === exact) exactStreak += 1;
    else break;
  }
  const sameSongsRecent = history.slice(-3).some(h => h?.songKey === unordered && h?.exactKey !== exact);
  return { exactKey: exact, songKey: unordered, exactStreak, sameSongsRecent };
}
function analyzeSetlistBonus(setlist, liveArrange) {
  const originals = setlist.filter(s => s && !s.isCover);
  const coverCount = setlist.length - originals.length;
  const newCount = originals.filter(songIsNewForSetlist).length;
  const existingCount = originals.filter(songIsExistingForSetlist).length;
  let mixBonus = 0;
  let mixLabel = "セトリボーナスなし";
  if (coverCount === 0) {
    if (newCount === 2 && existingCount === 3) { mixBonus = 18; mixLabel = "理想セトリ：新曲2＋既存曲3"; }
    else if (newCount === 1 && existingCount === 4) { mixBonus = 14; mixLabel = "安定セトリ：新曲1＋既存曲4"; }
    else if (newCount === 3 && existingCount === 2) { mixBonus = 8; mixLabel = "攻めセトリ：新曲3＋既存曲2"; }
    else if (newCount > 0 && existingCount > 0) { mixBonus = 5; mixLabel = `ミックスセトリ：新曲${newCount}＋既存曲${existingCount}`; }
    else { mixLabel = newCount >= 5 ? "新曲のみで荒いセトリ" : "既存曲のみで新鮮味が薄いセトリ"; }
  } else {
    mixBonus = Math.max(-18, (newCount > 0 && existingCount > 0 ? 3 : 0) - coverCount * 7);
    mixLabel = `コピー曲入り：セトリボーナス抑制（コピー${coverCount}曲）`;
  }
  const hist = setlistHistoryInfo(setlist);
  let repeatPenalty = 0;
  let repeatLabel = "初めての並び";
  if (hist.exactStreak === 1) { repeatPenalty = 4; repeatLabel = "同じ並び2回目：評価ボーナス少し低下"; }
  if (hist.exactStreak >= 2) { repeatPenalty = 5 + (hist.exactStreak - 2) * 3; repeatLabel = "同じ並び3回連続以降：マンネリ化抽選あり"; }
  if (!repeatPenalty && hist.sameSongsRecent) { repeatPenalty = 1; repeatLabel = "同じ曲でも並び替えたので減点はごく軽め"; }
  let songPenalty = 0;
  const staleSongs = [];
  const streakBase = hist.exactStreak >= 2 ? 0.30 + Math.max(0, hist.exactStreak - 2) * 0.10 : hist.sameSongsRecent ? 0.10 : 0;
  setlist.forEach(song => {
    if (!song || song.isCover || hasTag(song, "定番")) return;
    const chance = clamp(streakBase + (song.mannerism || 0) * 0.03, 0, 0.75);
    if (chance > 0 && Math.random() < chance) {
      const p = hist.exactStreak >= 2 ? 6 : 3;
      songPenalty += p;
      staleSongs.push(song.title);
    }
  });
  const ignored = !!(liveArrange && liveArrange.text && liveArrange.text !== "なし");
  if (ignored) {
    return { newCount, existingCount, coverCount, mixBonus, repeatPenalty:0, songPenalty:0, total:mixBonus, mixLabel, repeatLabel:"ライブアレンジで同一セトリ/マンネリを突破", staleSongs, ignored:true, history:hist };
  }
  return { newCount, existingCount, coverCount, mixBonus, repeatPenalty, songPenalty, total:mixBonus - repeatPenalty - songPenalty, mixLabel, repeatLabel, staleSongs, ignored:false, history:hist };
}
function setlistBonusText(info) {
  if (!info) return "なし";
  const parts = [info.mixLabel, info.repeatLabel];
  if (info.staleSongs?.length) parts.push(`曲マンネリ：${info.staleSongs.slice(0,3).join(" / ")}`);
  parts.push(`補正 ${info.total >= 0 ? "+" : ""}${val(info.total)}`);
  return parts.join(" / ");
}
function registerSetlistAfterLive(setlist, result) {
  const hist = result?.setlistBonus?.history || setlistHistoryInfo(setlist);
  state.setlistHistory = state.setlistHistory || [];
  state.setlistHistory.push({ turn: state.turn, exactKey: hist.exactKey, songKey: hist.songKey, rank: result?.rank || "-" });
  if (state.setlistHistory.length > 12) state.setlistHistory = state.setlistHistory.slice(-12);
}


function positionInstrumentParts(role) {
  if (role === "guitar_vocal") return ["guitar", "vocal"];
  if (role === "bass_vocal") return ["bass", "vocal"];
  if (!role || role === "off") return [];
  return [role];
}
function vocalistRoleFromPositions(positions, memberId) {
  const role = positions?.[memberId] || "vocal";
  return ["vocal","guitar_vocal","bass_vocal"].includes(role) ? role : "vocal";
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
  const vocalLv = instrumentSkillFor(vocalist, vocalistRoleFromPositions(positions, vocalist.id));
  const chorusList = Array.isArray(chorus) ? chorus : (chorus ? [chorus] : []);
  const chorusBoost = sum(chorusList.map(ch => instrumentSkillFor(ch, "chorus") / 8));
  const instruments = new Set();
  performers.forEach(m => positionInstrumentParts(positions[m.id]).forEach(x => instruments.add(x)));
  supports.forEach(s => instruments.add(s.instrument));
  instruments.add("vocal");
  if (chorusList.length) instruments.add("chorus");

  const tags = setlist.flatMap(s => s.tags || []);
  const supportScore = sum(supports.map(s => s.score));
  const combo = instrumentComboScore(instruments);
  const memberScaleBonus = Math.max(0, performers.length - 3) * 3;
  const memberScaleRisk = Math.max(0, performers.length - 4) * 5;
  const equipmentBonus = { performance:(state.items.usedGear||0)*2 + (state.items.effecter||0) + equipmentEffectSum("performance"), expression:(state.items.effecter||0)*2 + equipmentEffectSum("expression"), heat:(state.items.lightFx||0)*3 + equipmentEffectSum("heat"), strategy:(state.items.lightFx||0) + equipmentEffectSum("strategy"), stability:equipmentEffectSum("stability") };
  const originalityBonus = originalCount === 5 ? 28 : originalCount === 4 ? 8 : originalCount === 3 ? -18 : originalCount === 2 ? -38 : -56;
  const coverStability = coverCount * 1.5;
  const fatigue = state.band.fatigue;
  const liveArrange = adlibResult(avgSense, avgTeam, avgMental, avgRhythm, state.band.trust, fatigue);
  const repeatInfo = resolveRepeatSetlist(analyzeRepeatSetlist(setlist), liveArrange);
  const setlistBonus = analyzeSetlistBonus(setlist, liveArrange);
  const venue = currentLiveEvent();
  const venueData = venueById(venue.venueId);
  const liveMeta = liveTypeMeta(venue);
  const invitedBands = invitedBandsForEvent(venue);
  const prepScore = estimatePrepScore();
  const venueShortage = Math.max(0, venueData.prepNeed - prepScore);
  const venuePenalty = venueShortage * 0.55;

  const slotScores = setlist.map((song, idx) => scoreSongSlot(song, idx + 1) * repeatInfo.multipliers[idx]);
  const baseSongPerformance = avg(setlist.map((s, idx) => s.performance * repeatInfo.multipliers[idx]));
  const baseLyrics = avg(setlist.map((s, idx) => s.lyrics * repeatInfo.multipliers[idx]));
  const baseTempo = avg(setlist.map((s, idx) => s.tempo * repeatInfo.multipliers[idx]));
  const baseCatchy = avg(setlist.map((s, idx) => s.catchy * repeatInfo.multipliers[idx]));
  const baseRecognition = avg(setlist.map((s, idx) => s.recognition * repeatInfo.multipliers[idx]));

  let performance = avgTech * .30 + avgRhythm * .13 + positionScore * .25 + baseSongPerformance * .30 + supportScore + combo.performance + coverStability + memberScaleBonus + equipmentBonus.performance - coverCount * 4 + rand(-8,8);
  let expression = avgSense * .25 + avgKnowledge * .15 + baseLyrics * .35 + vocalLv * .15 + chorusBoost + equipmentBonus.expression + (hasSkill("mc_master") ? 5 : 0) + (tags.includes("エモさ") ? 8 : 0) - coverCount * 3 + rand(-8,8);
  let heat = baseTempo * .23 + baseCatchy * .22 + avgCharisma * .22 + avgRhythm * .15 + avgStamina * .12 + memberScaleBonus + equipmentBonus.heat + venueData.heatBonus + (tags.includes("爆発力") ? 10 : 0) + (tags.includes("疾走感") ? 6 : 0) + rand(-8,8);
  let strategy = avg(slotScores) + combo.strategy + originalityBonus + setlistBonus.total + (hasSkill("setlist_sense") ? Math.max(0, setlistBonus.total) * 0.15 + 3 : 0) + baseRecognition * .12 + avg(setlist.map((s, idx)=>s.trend * repeatInfo.multipliers[idx])) * .10 + (supports.length ? 6 : 0) + equipmentBonus.strategy - venuePenalty * .65 + rand(-8,8);
  let stability = avgMental * .22 + avgStamina * .20 + avgTeam * .24 + state.band.trust * .24 + combo.stability + coverStability - fatigue * .78 - memberScaleRisk + supportScore * .35 - venuePenalty + rand(-10,6);
  if (fatigue > 70) { stability -= (fatigue - 70) * 0.9; heat -= (fatigue - 70) * 0.35; }

  if (repeatInfo.boom) {
    heat += repeatInfo.boomBoost;
    strategy += repeatInfo.boomBoost * 0.85;
    expression += repeatInfo.boomBoost * 0.35;
  }

  if (venue.liveType === "self_one_man") {
    const drawPower = popularity() + state.band.fame * 0.45 + state.band.fans * 0.25;
    const audienceGap = Math.max(0, venueData.capacity * 0.82 - drawPower);
    strategy += state.band.fame * 0.030 + state.band.fans * 0.015 - audienceGap * 0.075;
    stability -= Math.max(0, venueData.capacity * 0.50 - popularity()) * 0.105;
    heat -= audienceGap * 0.040;
  }
  if (venue.liveType === "self_taiban") {
    heat += Math.min(18, eventPartnerAudience(venue) * 0.10);
    stability += 5 + invitedBands.length * 2;
    strategy -= coverCount >= 4 ? 8 : 0;
  }
  if (venue.liveType === "booking_house" || venue.liveType === "booking_band") {
    stability += 8;
    strategy += Math.min(10, eventPartnerAudience(venue) * 0.06);
  }

  performance += liveArrange.performance;
  expression += liveArrange.expression;
  heat += liveArrange.heat;
  strategy += liveArrange.strategy;
  stability += liveArrange.stability;

  const finalPenalty = state.turn === state.maxTurn ? coverCount * 13 : coverCount * 10;
  const venueMatch = venueData.id === "big_stage" ? (setlistBonus.total + (originalCount >= 5 ? 6 : -8) - coverCount * 5) : setlistBonus.total * 0.65;
  const finalGoalPressure = state.turn >= 30 ? Math.max(0, venueShortage * 0.18) : 0;
  const rawTotal = performance + expression + heat + strategy + stability + venueMatch - finalPenalty - finalGoalPressure;
  const total = clamp(rawTotal / 3.1, 0, 100);
  const rank = rankFromScore(total);
  const revenue = calculateRevenue(total, rank, merch, supports, setlist, originalCount, coverCount);
  const coreEvent = shouldCoreFanEvent(rank, expression, heat, tags, coverCount);
  const positionText = performers.map(m => `${m.name}:${instLabel(positions[m.id])}`).join(" / ");
  const diagnostics = {
    liveType: liveMeta.label,
    score: { performance:val(performance), expression:val(expression), heat:val(heat), strategy:val(strategy), stability:val(stability), rawTotal:val(rawTotal), total:val(total) },
    venue: { id:venueData.id, prepNeed:venueData.prepNeed, prepScore:val(prepScore), shortage:val(venueShortage), penalty:val(venuePenalty) },
    songs: { originalCount, coverCount, setlistBonus:val(setlistBonus.total), repeatText:repeatInfo.text },
    audience: { own:revenue.ownAudience, partner:revenue.partnerAudience, total:revenue.attendees },
    money: { ticketRevenue:revenue.ticketRevenue, bonus:revenue.bonus, cost:revenue.baseCost, supportCost:revenue.supportCost, merchCost:revenue.merch.cost, finalProfit:revenue.finalProfit }
  };

  return { performance, expression, heat, strategy, stability, total, rank, revenue, originalCount, coverCount, adlib: liveArrange, liveArrange, repeatInfo, setlistBonus, coreEvent, supports, merch, venue: venueData, liveType:venue.liveType || "self_one_man", liveTypeLabel: liveMeta.label, invitedBands: invitedBands.map(b=>b.name), prepScore, venueShortage, diagnostics, vocalistName: vocalist.name, chorusName: chorusList.length ? chorusList.map(ch => ch.name).join(" / ") : "なし", positions, performers: performers.map(m => m.id), positionText };
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
  if (instrument === "guitar_vocal") return (instrumentSkillFor(member, "guitar") * 0.58 + instrumentSkillFor(member, "vocal") * 0.42);
  if (instrument === "bass_vocal") return (instrumentSkillFor(member, "bass") * 0.58 + instrumentSkillFor(member, "vocal") * 0.42);
  const data = member.instruments?.[instrument];
  if (!data) return instrument === "other" ? 30 : 18;
  const markBonus = { "◎": 12, "○": 5, "△": -6, "×": -18 }[data.mark] || 0;
  const base = clamp((data.lv || 20) + markBonus, 5, 110);
  return member.joinStatus === "仮加入" ? base * 0.9 : base;
}

function scoreSongSlot(song, slot) {
  let score = 0;
  if (slot === 1) score += song.catchy * .35 + song.tempo * .25 + song.recognition * .18 + (hasTag(song,"定番") && !song.isCover ? 15 : 0) + (song.isCover ? 3 : 0) + (hasTag(song,"爆発力") ? 8 : 0);
  if (slot === 2) score += song.performance * .32 + song.lyrics * .18 + song.tempo * .16 + genreDirectionFit(song.genre) + (song.isCover ? 1 : 0);
  if (slot === 3) score += song.lyrics * .34 + song.performance * .24 + (hasTag(song,"エモさ") ? 10 : 0) + (hasTag(song,"個性") ? 10 : 0);
  if (slot === 4) score += song.performance * .22 + (hasTag(song,"余韻") ? 10 : 0) + (song.isCover ? 2 : 0) + (song.tempo < 60 ? 7 : 0);
  if (slot === 5) score += song.recognition * .20 + song.lyrics * .23 + song.tempo * .18 + (hasTag(song,"代表曲候補") ? 20 : 0) + (hasTag(song,"定番") && !song.isCover ? 15 : 0) + (hasTag(song,"爆発力") ? 15 : 0);
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
  if (great) return { performance:8, expression:10, heat:12, strategy:15, stability:5, text:"ライブアレンジ大成功" };
  return { performance:5, expression:5, heat:5, strategy:10, stability:3, text:"ライブアレンジ成功" };
}
function rankFromScore(score) { if (score >= 88) return "S"; if (score >= 74) return "A"; if (score >= 62) return "B"; if (score >= 45) return "C"; if (score >= 30) return "D"; return "E"; }
function rankMult(rank) { return { S:1.6, A:1.35, B:1.15, C:1.0, D:.78, E:.55 }[rank] || 1; }
function venueFee() { return venueById(currentLiveEvent().venueId).fee; }
function capacity() { return venueById(currentLiveEvent().venueId).capacity; }
function calculateRevenue(total, rank, merch, supports, setlist) {
  const ev = currentLiveEvent();
  const venue = venueById(ev.venueId);
  const meta = liveTypeMeta(ev);
  const cap = venue.capacity;
  const selfAudienceBase = Math.round(10 + state.band.fans * .45 + state.band.fame * .55 + total * .45);
  const selfAudienceRaw = ev.liveType === "self_one_man" ? Math.round(selfAudienceBase * 0.74) : selfAudienceBase;
  const partnerAudienceRaw = ["self_taiban", "booking_house", "booking_band"].includes(ev.liveType) ? eventPartnerAudience(ev) : 0;
  const attendees = clamp(selfAudienceRaw + partnerAudienceRaw, 5, cap);
  const partnerAudience = Math.min(partnerAudienceRaw, Math.max(0, attendees - Math.min(selfAudienceRaw, attendees)));
  const ownAudience = Math.max(0, attendees - partnerAudience);
  const ticket = ev.liveType === "big_stage" ? 2200 : 1500;
  const partnerShare = ev.liveType === "self_taiban" ? 0.35 : ev.liveType === "booking_band" ? 0.25 : ev.liveType === "booking_house" ? 0.30 : 1.0;
  const selfShare = ev.liveType === "booking_house" ? 0.55 : ev.liveType === "booking_band" ? 0.62 : 1.0;
  const ticketRevenue = Math.round(ownAudience * ticket * selfShare + partnerAudience * ticket * partnerShare);
  const bonus = Math.max(0, Math.round((total - 45) * 180 * (meta.reward || 1)));
  const merchData = merchRevenue(merch, attendees, rank, setlist);
  const supportCost = sum(supports.map(s => s.cost));
  const baseCost = eventBaseCost(ev, venue);
  const finalProfit = ticketRevenue + bonus + merchData.revenue - baseCost - supportCost - merchData.cost;
  return { attendees, ownAudience, partnerAudience, ticketRevenue, ticket, ticketShare:selfShare, partnerShare, bonus, merch: merchData, supportCost, venueFee: baseCost, baseCost, costLabel: meta.feeLabel, liveTypeLabel: meta.label, finalProfit };
}
function merchRevenue(ordersRaw, attendees, rank, setlist) {
  const orders = normalizeMerchOrders(ordersRaw);
  const totalUnits = sum(Object.values(orders));
  if (!totalUnits) return { cost:0, revenue:0, salesRevenue:0, buybackRevenue:0, label:"なし", demoPrice:0, demoUnits:0, lines:[] };
  const ev = currentLiveEvent();
  const venue = venueById(ev.venueId);
  const audience = audienceProfileForVenue(venue);
  let cost = 0, salesRevenue = 0, buybackRevenue = 0, demoUnits = 0;
  const lines = [];
  MERCH_ITEMS.forEach(item => {
    const qty = orders[item.id] || 0;
    if (!qty) return;
    cost += item.cost * qty;
    const demandRate = merchDemandRate(item, attendees, rank, setlist, audience.label, venue.capacity);
    const demand = Math.round(attendees * demandRate * (item.id === "coach" ? 0.35 : item.id === "bucket" ? 0.55 : 1));
    const sold = Math.min(qty, Math.max(0, demand + rand(-2, 3)));
    const leftover = qty - sold;
    const buyback = Math.round(leftover * item.cost * (hasSkill("merch_master") ? 0.40 : 0.35));
    const sales = sold * item.price;
    salesRevenue += sales;
    buybackRevenue += buyback;
    if (item.id === "demo") demoUnits = sold;
    lines.push({ id:item.id, name:item.name, qty, sold, leftover, cost:item.cost * qty, sales, buyback, fit: demandRate });
  });
  const revenue = salesRevenue + buybackRevenue;
  const label = `仕入れ${totalUnits}点 / 販売${sum(lines.map(x=>x.sold))}点`;
  return { cost, revenue, salesRevenue, buybackRevenue, label, demoPrice: MERCH_ITEMS.find(x=>x.id==="demo")?.price || 0, demoUnits, lines };
}
function shouldCoreFanEvent(rank, expression, heat, tags) { return ["C","D","E"].includes(rank) && (expression > 70 || tags.includes("エモさ") || tags.includes("個性") || heat > 85) && Math.random() < 0.62; }

function analyzeLiveManners(setlist, result) {
  const unique = new Set(setlist.map(s => s.id || s.title)).size;
  const coverCount = setlist.filter(s => s.isCover).length;
  const reasons = [];
  let penalty = 0;
  if (coverCount >= 5) { penalty += 12; reasons.push("全曲コピー曲"); }
  else if (coverCount >= 4) { penalty += 5; reasons.push("コピー曲が多い"); }
  if (unique <= 2) { penalty += 10; reasons.push("同じ曲に偏りすぎ"); }
  if ((result?.setlistBonus?.history?.exactStreak || 0) >= 2) { penalty += 6; reasons.push("同じセトリ連発"); }
  if (["D","E"].includes(result?.rank) && coverCount >= 3) { penalty += 4; reasons.push("手抜きに見えやすい低評価"); }
  return { penalty, reasons };
}

function applyLiveResult(r, setlist, supports) {
  const b = state.band;
  const ev = currentLiveEvent();
  const meta = liveTypeMeta(ev);
  const manners = analyzeLiveManners(setlist, r);
  const fanGainBase = { S:45, A:30, B:18, C:8, D:2, E:0 }[r.rank] || 0;
  const fameGainBase = { S:22, A:14, B:8, C:3, D:1, E:0 }[r.rank] || 0;
  const industryGainBase = { S:24, A:16, B:9, C:2, D:0, E:0 }[r.rank] || 0;
  let fanGain = (fanGainBase + Math.round(r.total / 50) + (r.coreEvent ? 3 : 0) + (hasSkill("mc_master") ? 2 : 0)) * (meta.growth || 1);
  let fameGain = (fameGainBase + (r.revenue.ownAudience > 50 ? 2 : 0)) * (meta.growth || 1);
  let coreGain = ({ S:12, A:8, B:5, C:2, D:1, E:0 }[r.rank] || 0) * (meta.growth || 1);
  let industryGain = (industryGainBase + (r.originalCount >= 4 ? 4 : 0) - (state.turn === state.maxTurn ? r.coverCount * 2 : 0)) * (meta.growth || 1);
  if (ev.liveType === "self_one_man" && ["S","A"].includes(r.rank)) { fanGain += 12; fameGain += 8; industryGain += 6; }
  if (r.coreEvent) { coreGain += 10; fanGain += 2; }
  const relationDeltaBase = (meta.relation || 0) + ({ S:6, A:4, B:2, C:0, D:-3, E:-6 }[r.rank] || 0) - Math.round(manners.penalty / 3);
  invitedBandsForEvent(ev).forEach(band => setRelationshipWithBand(band.id, relationshipWithBand(band.id) + relationDeltaBase));
  if (manners.penalty) {
    b.trust = clamp(b.trust - Math.ceil(manners.penalty / 5), 0, 100);
    r.mannerWarning = manners.reasons.join(" / ");
  }
  r.relationDelta = relationDeltaBase;
  r.gains = { fans: Math.max(0, Math.round(fanGain)), fame: Math.max(0, Math.round(fameGain)), core: Math.max(0, Math.round(coreGain)), industry: Math.max(0, Math.round(industryGain)), funds: r.revenue.finalProfit };
  b.fans += r.gains.fans;
  b.fame += r.gains.fame;
  b.core += r.gains.core;
  b.industry += r.gains.industry;
  b.funds += r.revenue.finalProfit;
  state.totalMerchSales = (state.totalMerchSales || 0) + Number(r.revenue?.merch?.salesRevenue || 0);
  b.trust = clamp(b.trust + ({ S:8, A:5, B:3, C:0, D:-3, E:-6 }[r.rank] || 0), 0, 100);
  const fatigueBeforeLive = b.fatigue;
  const liveFatigue = 18 + Math.round(avg(setlist.map(s => s.tempo)) / 9) + Math.max(0, activeMembers().length - 4) * 5 - avg(activeMembers().map(m=>m.stats.stamina)) / 16;
  b.fatigue = clamp(b.fatigue + Math.round(liveFatigue * fatigueGainMultiplier()), 0, 100);
  maybeShowFatigueIncreasePopup(fatigueBeforeLive, b.fatigue, "ライブ本番で疲労が増えた。");
  setlist.forEach((song, idx) => {
    const prevTurn = song.lastLiveTurn || 0;
    song.consecutiveLiveUses = prevTurn === state.turn - 1 ? (song.consecutiveLiveUses || 0) + 1 : 1;
    song.lastLiveTurn = state.turn;
    song.lastLiveSlot = idx + 1;
    growSongAfterLive(song, r.rank, idx + 1, r.coreEvent);
  });
  registerSetlistAfterLive(setlist, r);
  maybeUnlockProgressSkills("live");
  revealSubGenresAfterLive(r, setlist);
  if (!state.fesInfoKnown && (state.liveCount >= 1 || state.turn >= 12 || b.industry >= 15)) {
    state.fesInfoKnown = true;
    showEventPopup("UNDER FES情報入手", "ライブハウス店長から、選考に必要な最低ラインを聞いた。\nスケジュール帳でフェス条件を確認できるようになった。", "event", "📄");
  }
  activeMembers().filter(m => r.performers.includes(m.id)).forEach(m => growMemberAfterLive(m, r.rank, r.positions[m.id]));
  const exposureBands = invitedBandsForEvent(ev);
  if (exposureBands.length) {
    const exposure = rivalBandExposureBonus(exposureBands);
    const rankPlus = { S:2, A:2, B:1, C:1, D:0, E:0 }[r.rank] || 0;
    activeMembers().filter(m => r.performers.includes(m.id)).forEach(m => {
      m.stats.technique = clamp(m.stats.technique + Math.max(1, Math.floor(exposure / 2)), 1, 99);
      m.stats.sense = clamp(m.stats.sense + Math.max(1, Math.floor((exposure + rankPlus) / 3)), 1, 99);
      if (exposure >= 4 || rankPlus >= 2) m.stats.charisma = clamp(m.stats.charisma + 1, 1, 99);
    });
    r.exposureGrowth = `格上対バン刺激：Lv${exposure}相当`;
  }
  supports.forEach(s => {
    const key = s.id;
    const old = b.direction[s.genres[0]] || 0;
    state.supportAffinity[key] = (state.supportAffinity[key] || 0) + ({ S:15, A:11, B:7, C:3, D:1, E:0 }[r.rank] || 0) + (old > 20 ? 2 : 0);
  });
  if (["self_taiban", "booking_house", "booking_band"].includes(ev.liveType)) {
    addSnsPost("@live_after", `${currentLiveName()}終了。${r.rank}評価、${r.revenue.attendees}人。${r.mannerWarning ? "セトリ面はちょっと気になる声も。" : "対バンの空気は悪くなさそう。"}`, r.rank);
  }
  if (["S","A","B"].includes(r.rank) && Math.random() < 0.60) {
    addMail("ライブの感想が届いています", `昨日のライブ、${setlist[0]?.title || "1曲目"}が特に良かったです。
次も観に行きます。

効果：ファンメールにより表現力/認知度が少し伸びました。`, "fan_mail", { sender:"ライブを見たファン" });
    state.band.fame = clamp(state.band.fame + 1, 0, 999);
    activeMembers().forEach(m => m.stats.charisma = clamp(m.stats.charisma + 1, 1, 99));
  }
  state.pendingAfterparty = { rank:r.rank, total:val(r.total), liveType:ev.liveType || "special", invitedBandIds:Array.isArray(ev.invitedBandIds) ? ev.invitedBandIds.slice() : [], title:currentLiveName(), fatigueAfterLive:Math.round(state.band.fatigue || 0) };
  const summary = [
    `【${currentLiveName()} 結果】評価:${r.rank} / 総合:${val(r.total)}`,
    `ライブ種別:${r.liveTypeLabel || liveTypeMeta(ev).label} / 演奏${val(r.performance)} 表現${val(r.expression)} 熱量${val(r.heat)} 戦略${val(r.strategy)} 安定${val(r.stability)}`,
    `会場:${r.venue.name} / キャパ${r.venue.capacity} / 準備${val(r.prepScore)}${r.venueShortage > 0 ? `（不足${val(r.venueShortage)}）` : ""}`,
    `配置:${r.positionText}`,
    activeMembers().length > 4 ? `大所帯ボーナス：人数で熱量は上がったが、管理コストと事故リスクも増えた。` : "",
    `Vo:${r.vocalistName} / Cho:${r.chorusName} / オリジナル${r.originalCount}曲・コピー${r.coverCount}曲`,
    `セトリボーナス：${setlistBonusText(r.setlistBonus)}`,
    r.adlib.text !== "なし" ? `ライブアレンジ:${r.adlib.text}。マンネリや同一曲の不利を一部無視した。` : `ライブアレンジは起きなかった。`,
    r.repeatInfo?.hasRepeats ? `${r.repeatInfo.boom ? "同一曲再演ボーナス" : "同一曲再演ペナルティ"}：${r.repeatInfo.text}` : "",
    r.coreEvent ? `ライブ全体は完璧ではなかったが、刺さったコアなファンがいた。コア人気が伸びた。` : "",
    r.mannerWarning ? `交流注意:${r.mannerWarning}。対バン/ブッキングでは交流が下がる。` : "",
    invitedBandsForEvent(ev).length ? `交流変動:${invitedBandsForEvent(ev).map(b=>`${b.name}${r.relationDelta>=0?"+":""}${r.relationDelta}`).join(" / ")}` : "",
    r.exposureGrowth ? r.exposureGrowth : "",
    `集客:${r.revenue.attendees}人（自分目当て${r.revenue.ownAudience} / 他バンド目当て${r.revenue.partnerAudience}） / チケット:${r.revenue.ticketRevenue.toLocaleString()}円 / 物販:${r.revenue.merch.salesRevenue.toLocaleString()}円 / 買い取り:${r.revenue.merch.buybackRevenue.toLocaleString()}円`,
    `${r.revenue.costLabel || "会場費"}:${r.revenue.venueFee.toLocaleString()}円 / サポート代:${r.revenue.supportCost.toLocaleString()}円 / 物販仕入れ:${r.revenue.merch.cost.toLocaleString()}円 / 最終利益:${r.revenue.finalProfit.toLocaleString()}円`
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
    liveTypeLabel: r.liveTypeLabel || r.revenue.liveTypeLabel || "ライブ",
    attendees: r.revenue.attendees,
    ownAudience: r.revenue.ownAudience || r.revenue.attendees,
    partnerAudience: r.revenue.partnerAudience || 0,
    costLabel: r.revenue.costLabel || "会場費",
    costValue: r.revenue.venueFee || 0,
    profit: r.revenue.finalProfit,
    originalCount: r.originalCount,
    coverCount: r.coverCount,
    adlib: r.adlib.text,
    setlistBonusText: setlistBonusText(r.setlistBonus),
    repeatText: r.repeatInfo?.hasRepeats ? r.repeatInfo.text : "なし",
    mannerWarning: r.mannerWarning || "",
    merchSummary: `${r.revenue.merch.label} / 売上${Number(r.revenue.merch.salesRevenue || 0).toLocaleString()}円 / 買い取り${Number(r.revenue.merch.buybackRevenue || 0).toLocaleString()}円`,
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
  s.livePlays = (s.livePlays || 0) + 1;
  s.tags = (s.tags || []).filter(t => t !== "新曲");
  // マンネリは同一セトリ連続時の抽選で発生。通常ライブ成功だけでは増えない。
  s.recognition = clamp(s.recognition + ({ S:8,A:6,B:4,C:2,D:1,E:0 }[rank] || 0) + (coreEvent ? 2 : 0), 0, 99);
  s.performance = clamp(s.performance + (rank === "E" ? 0 : 1), 0, 99);
  s.standardPoints = (s.standardPoints || 0) + 1 + (["S","A","B"].includes(rank) ? 1 : 0) + ((slot === 1 || slot === 5) && ["S","A","B"].includes(rank) ? 1 : 0);
  if (s.standardPoints >= 5 && !hasTag(s,"定番")) { s.tags.push("定番"); s.mannerism = 0; log(`${s.title}がライブ定番曲になった。`); showEventPopup("STANDARD SONG!!", `「${s.title}」が定番曲になった！\nライブでの成功が積み重なり、マンネリ化しにくくなる。`, "rare", "⭐"); }
  if (hasTag(s, "定番")) s.mannerism = 0;
  if ((s.recognition >= 50 && s.standardPoints >= 5 && (s.lyrics >= 60 || s.catchy >= 60)) && !hasTag(s,"代表曲候補")) { s.tags.push("代表曲候補"); log(`${s.title}が代表曲候補になった。`); }
}

function growMemberAfterLive(m, rank, role) {
  const gain = { S:3, A:2, B:1, C:1, D:0, E:0 }[rank] || 0;
  m.stats.mental = clamp(m.stats.mental + gain, 1, 99);
  m.stats.charisma = clamp(m.stats.charisma + (rank === "S" ? 2 : rank === "A" ? 1 : 0), 1, 99);
  const roles = positionInstrumentParts(role).filter(x => x !== "vocal" || role === "vocal" || role === "guitar_vocal" || role === "bass_vocal");
  const targets = roles.length ? roles : [m.mainInstrument];
  targets.forEach(r => {
    const inst = m.instruments[r] || m.instruments[m.mainInstrument];
    if (inst) inst.lv = clamp(inst.lv + gain * (inst.growth || 1), 1, inst.potentialCap || inst.cap);
  });
  maybeUnlockHidden(m, "ライブ経験");
}

function continueAfterEnding() {
  const oldMax = state.maxTurn || 50;
  state.ended = false;
  state.maxTurn = oldMax + 20;
  state.turn = Math.min((state.turn || oldMax) + 1, state.maxTurn - 3);
  state.view = "home";
  state.pendingEndingAfterLive = false;
  state.scheduleTutorialStage = "done";
  state.liveEvents = (state.liveEvents || []).filter(e => !e.cancelled);
  if (!(state.liveEvents || []).some(e => !e.cancelled && e.turn >= state.turn)) {
    state.liveEvents.push(fixedLiveEvent(Math.min(state.turn + 4, state.maxTurn - 1), "livehouse_m", "延長ライブ", false));
  }
  refreshLiveSchedule();
  scheduleNextLive();
  log("エンディング後も活動を継続することにした。延長活動が始まり、通常ライブ予約も再開した。", "event");
  saveGame(false);
  render();
}

function renderEnding() {
  const b = state.band;
  const final = state.liveResultHistory[state.liveResultHistory.length - 1];
  const originals = state.songs.filter(s => !s.isCover).length;
  let title = "まだ地下にいる";
  let body = "GRAND UNDER FESの壁はまだ高かった。でも、UNDER FESを越えた経験は消えない。次のライブの誘いはある。";
  let tier = "GRAND条件未達";
  const repCount = state.songs.filter(s => hasTag(s,"代表曲候補") || hasTag(s,"定番")).length;
  const freshCount = state.songs.filter(s => !s.isCover && (s.livePlays || 0) <= 1 && state.turn - (s.createdTurn || 0) <= 10).length;
  const minimum = final && ["A","S"].includes(final.rank) && b.fans >= 180 && b.fame >= 150 && b.industry >= 135 && originals >= 7 && repCount >= 2 && freshCount >= 1;
  const attention = final && final.rank === "S" && final.total >= 82 && b.fans >= 230 && b.fame >= 180 && b.industry >= 165 && repCount >= 3 && final.originalCount === 5;
  const huge = final && final.rank === "S" && final.total >= 90 && b.fans >= 280 && b.fame >= 220 && b.industry >= 200 && repCount >= 4 && final.originalCount === 5;
  if (b.funds < -50000) { title = "赤字解散エンド"; tier = "BAD MONEY"; body = "鳴らしたい音はあった。でも、続けるための資金が尽きた。次は物販と会場選びを見直そう。"; }
  else if (state.members.length >= 8 && b.trust < 15) { title = "メンバー離散エンド"; tier = "BAD BAND"; body = "大所帯になったバンドは、音より先に心がばらけてしまった。"; }
  else if (!state.liveResultHistory.some(r=>r.title?.includes("UNDER") || r.venueId === "big_stage")) { title = "UNDER FES未達成エンド"; tier = "UNDER未達"; body = "大きな舞台には届かなかった。それでも、地下の音は消えていない。"; }
  else if (final && final.rank && !minimum) { title = "UNDER FES達成エンド"; tier = "MIDDLE CLEAR"; body = "UNDER FESには届いた。次は、その先の巨大なステージを目指す。"; }
  if (minimum) { title = "GRAND UNDER FES 出演決定"; tier = "BIGGER STAGE"; body = "UNDER FESの先にある大舞台へ、ついに名前が載った。地下から始まった音が、巨大なステージへ届いた。"; }
  if (attention) { title = "GRAND UNDER FES 注目枠"; tier = "HEADLINER候補"; body = "資料の上の方に、バンド名が載っている。もうただの地下バンドじゃない。"; }
  if (huge) { title = "伝説のインディーズバンドエンド"; tier = "LEGEND END"; body = "ステージ袖から見える客席は、これまでで一番広かった。鳴らせば、夜が明ける。"; }
  if (!state.endingRecorded) { saveBandHistory({ name:b.name || "名無しの地下バンド", ending:tier, fans:b.fans, fame:b.fame, industry:b.industry, funds:b.funds, songs:originals }); state.endingRecorded = true; }
  app.innerHTML = `<div class="app-shell"><div class="hero"><h1>${title}</h1><p>${body}</p></div><div class="grid"><div class="card"><h2>最終結果：${tier}</h2><div class="kv"><b>ファン</b><span>${b.fans}人</span><b>知名度</b><span>${b.fame}</span><b>業界評価</b><span>${b.industry}</span><b>オリジナル曲</b><span>${originals}曲</span><b>資金</b><span>${b.funds.toLocaleString()}円</span><b>最終ライブ</b><span>${final ? final.rank + " / " + val(final.total) : "なし"}</span></div><div class="modal-actions ending-actions"><button id="continueAfterEndingBtn" class="big-action">このまま続ける</button><button id="newAfterEndingBtn" class="ghost-btn">はじめから選ぶ</button></div><small>続ける場合は延長活動として20ターン追加されます。</small></div><div class="card"><h2>ログ</h2><div class="log">${state.logs.slice(0, 90).map(l => `<div class="log-line">${escapeHtml(l)}</div>`).join("")}</div></div></div></div>`;
  document.getElementById("continueAfterEndingBtn")?.addEventListener("click", () => { continueAfterEnding(); });
  document.getElementById("newAfterEndingBtn")?.addEventListener("click", () => { uiMode = "slot-new"; render(); });
}

render();
