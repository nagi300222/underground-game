/*
  アンダーグラウンド（仮） v0.3.66-balance-draft-fix1
  - v0.3.64-growth-type-draftを土台に、v0.3.65相当の他バンドイベント土台とv0.3.66相当のバランス基準/DEV補助を追加。
  - 旧「（仮）」候補ブロックとPaper Moon Kids系コードは、旧セーブ互換/退避用に残すが、有効候補はMEMBER_DATABASEで上書きする。
*/

const VERSION = "v0.4.3";

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
  return ({ guitar:"ギター", bass:"ベース", drum:"ドラム", key:"キーボード/ピアノ", dj:"DJ", vocal:"ボーカル", chorus:"コーラス", piano:"ピアノ/シンセ", brass:"サックス/ブラス", percussion:"パーカッション" })[inst] || inst;
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
    ? `${a}→︎${b}：${a} ${pct(chance.mainA)} / サブ ${pct(chance.sub)} / レア ${pct(chance.rare)}${arr}`
    : `${a}→︎${b}：${a} ${pct(chance.mainA)} / ${b} ${pct(chance.mainB)} / サブ ${pct(chance.sub)} / レア ${pct(chance.rare)}${arr}`;
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
  { id: "garage", name: "ライブハウスUNDER", capacity: 55, fee: 4500, prepNeed: 12, heatBonus: 2, note: "小箱。序盤でも成功しやすい。Paper Moon Kids（仮）のホーム" },
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
  special: { label:"固定ライブ", short:"固定", category:"固定", desc:"物語上の固定ライブ。", feeLabel:"会場費", risk:"特", growth:1.0, reward:1.0, inviteBoost:0, relation:0, booking:false },
  band_fes: { label:"フェス：バンド主催", short:"バンド主催フェス", category:"フェス", desc:"実力派バンドが主催する高難度フェス。交流とライブ評価が重要。", feeLabel:"参加費", risk:"高", growth:1.18, reward:0.95, inviteBoost:0.22, relation:12, booking:true },
  corp_fes: { label:"フェス：企業主催", short:"企業主催フェス", category:"フェス", desc:"企業・媒体が絡む高難度フェス。知名度と業界評価が重要。", feeLabel:"参加費", risk:"高", growth:1.08, reward:1.08, inviteBoost:0.18, relation:6, booking:true }
};

const RIVAL_BANDS = [
  { id:"paper_moon", name:"Paper Moon Kids（仮）", fame:18, audience:18, genre:"青春パンク / メロコア", level:1, mood:"ライブハウスUNDERがホーム。地元ではそこそこ経験があり、フェスを目指している" },
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

/* ==================================================================
 * v0.3.60-big-draft-fix1 バンド図鑑・交流スキル・他バンドイベント システム
 * ==================================================================
 * - ENABLE_BAND_SYSTEM を false にすると、v0.3.50相当の挙動へ戻る。
 * - DATABASE 3種は underground_v0_3_60_DATABASE_pack_reviewed 由来。
 *   ブラウザ直読みのため game.js 内へ統合している。
 * - 交流値は既存 state.rivalRelations を単一の真実として使う。
 *   図鑑側は表示用に 0〜100 へクランプして読む。
 * - セーブ追加キー: state.bandBook / state.ownedBandSkills / state.saveSchemaVersion
 * ================================================================== */

const ENABLE_BAND_SYSTEM = true;
const ENABLE_NOVEL_EVENTS = true;
const ENABLE_DEV_MODE = true;
function bandSystemOn() { return ENABLE_BAND_SYSTEM; }
function novelEventsOn() { return ENABLE_NOVEL_EVENTS; }
function devModeOn() { return ENABLE_DEV_MODE; }

// 仮数値（v0.3.60-big-draft-fix1）。バランス調整時はここだけ触ればよい。
const BAND_TUNING = {
  relationCapMin: 0,
  relationCapMax: 100,
  commonSkillRelationNeed: 30,   // 汎用スキル獲得：対象バンドとの交流値30以上
  firstBattleRelationDefault: 10,// 初対バン時のイベント交流ボーナス（DB側 relationAdd が優先）
  repNameRelationNeed: 30,       // 代表キャラ名・担当の表示解禁
  afterPartyBonusCapPct: 10,     // 打ち上げ系スキル補正の合算上限
  overflowRelationGain: 5        // 汎用スキル上限超過時の交流値変換
};

/* ------------------------------------------------------------------
 * BAND_DATABASE（全22組）
 * internalLv は内部処理用。図鑑UIには表示しない。
 * fame / audience は既存の対バン選出・集客計算（RIVAL_BANDS互換）用に付与。
 * ------------------------------------------------------------------ */
const BAND_DATABASE = Object.freeze({
  kiwi: {
    id: "kiwi", name: "Kiwi", kana: "キーウィ", internalLv: 1, color: "#B5E04C", markStyle: "B",
    genres: ["ポップロック", "インディーロック", "ゆるいオルタナ"],
    description: "ゆるく明るい空気でライブハウスを和ませるポップロックバンド。",
    representativeSong: "グリムポップ", representativeName: "モズ", representativePart: null,
    skillIds: ["healing_character"],
    tags: ["early", "random_battle", "soft", "friendly"],
    fame: 20, audience: 16
  },
  kodama: {
    id: "kodama", name: "コダマ", kana: "こだま", internalLv: 1, color: "#8FD6C7", markStyle: "B",
    genres: ["ギターロック", "和風ロック", "インディーロック"],
    description: "静かで少し不思議な余韻を残す和風インディーロックバンド。",
    representativeSong: "木漏れ日", representativeName: "ヒノカワ", representativePart: null,
    skillIds: ["lingering_echo"],
    tags: ["early", "random_battle", "quiet", "emotional"],
    fame: 22, audience: 18
  },
  melt: {
    id: "melt", name: "めると", kana: "めると", internalLv: 1, color: "#9FB8FF", markStyle: "B",
    genres: ["ドリームポップ", "ミクスチャー"],
    description: "ボカロP文脈も持つ、ネット発の少し病んだドリームポップ系アーティスト。",
    representativeSong: "マグマカップ", representativeName: "ロク", representativePart: null,
    skillIds: ["lingering_echo", "influencer"],
    tags: ["early", "sns", "random_battle", "internet"],
    fame: 24, audience: 19
  },
  koharugiku: {
    id: "koharugiku", name: "コハルギク", kana: "こはるぎく", internalLv: 1, color: "#FFB27A", markStyle: "A",
    genres: ["歌ものロック", "メロコア"],
    description: "エモい歌詞と疾走感のあるメロディーで駆け抜ける地下に風をもたらすメロコアバンド。",
    representativeSong: "Rain", representativeName: "シュンカ", representativePart: null,
    skillIds: ["healing_character", "lingering_echo"],
    tags: ["early", "random_battle", "melocore", "emotional"],
    fame: 25, audience: 21
  },
  triple_arrows: {
    id: "triple_arrows", name: "Triple Arrows", kana: "トリプルアローズ", internalLv: 2, color: "#3D8BFF", markStyle: "A",
    genres: ["青春パンク", "メロコア"],
    description: "UNDERを拠点にする、荒削りで熱い青春パンクバンド。",
    representativeSong: "run throw", representativeName: "タカナシ", representativePart: "Vo/Gt",
    skillIds: ["three_basics"],
    tags: ["under", "early", "rival", "friendly", "fixed_event"],
    fame: 26, audience: 20
  },
  carbons: {
    id: "carbons", name: "CARBONS", kana: "カーボンズ", internalLv: 2, color: "#6C7CE0", markStyle: "C",
    genres: ["オルタナロック"],
    description: "尖ったオルタナロックで序盤に立ちはだかるライバルバンド。",
    representativeSong: null, representativeName: "ナキリ", representativePart: "Ba/Vo",
    skillIds: ["diamond_rough"],
    tags: ["early", "rival", "sharp", "fixed_event"],
    fame: 30, audience: 26
  },
  magnet_wolf: {
    id: "magnet_wolf", name: "magnet wolf", kana: "マグネットウルフ", internalLv: 2, color: "#8FA0B8", markStyle: "A",
    genres: ["ハードロック"],
    description: "少しダサくて味がある、荒いハードロックバンド。",
    representativeSong: "ICEBOX", representativeName: "ダイドウジ", representativePart: null,
    skillIds: ["rivalry_spirit"],
    tags: ["early_middle", "random_battle", "hard_rock", "rough"],
    fame: 33, audience: 29
  },
  patriot_sunshine: {
    id: "patriot_sunshine", name: "Patriot Sunshine", kana: "パトリオットサンシャイン", internalLv: 2, color: "#E64524", markStyle: "A",
    genres: ["パンクロック", "スカパンク"],
    description: "明るく熱い、青春パンク寄りのスカパンクバンド。",
    representativeSong: "メタルレイ", representativeName: "アズマル", representativePart: null,
    skillIds: ["rivalry_spirit"],
    tags: ["early_middle", "random_battle", "punk", "ska", "bright"],
    fame: 36, audience: 32
  },
  d_lion: {
    id: "d_lion", name: "D-Lion", kana: "ディーライオン", internalLv: 2, color: "#FF8C1A", markStyle: "A",
    genres: ["ミクスチャー", "パンクロック"],
    description: "陽気なミクスチャー/パンクでフロアを揺らす常連バンド。",
    representativeSong: "LifeTechno", representativeName: "TAMANO", representativePart: null,
    skillIds: ["rivalry_spirit"],
    tags: ["early_middle", "random_battle", "mixture", "party"],
    fame: 39, audience: 35
  },
  pachi_pachi: {
    id: "pachi_pachi", name: "Pachi-Pachi", kana: "パチパチ", internalLv: 3, color: "#FF7E8F", markStyle: "A",
    genres: ["青春ロック", "歌ものロック"],
    description: "共感できる歌詞と客席を巻き込む力で人気を集める青春ロックバンド。",
    representativeSong: "わたあめ", representativeName: "ミケ", representativePart: "Gt/Vo",
    skillIds: ["popping_sweetness"],
    tags: ["middle", "rival", "fes_shadow", "catchy", "fixed_event", "rematch_available"],
    fame: 46, audience: 42
  },
  in_bab: {
    id: "in_bab", name: "IN-BAB", kana: "インバブ", internalLv: 3, color: "#5F49D6", markStyle: "C",
    genres: ["変化球ロック", "初期BiSH系"],
    description: "メンバーの圧倒的な魅力によって、ライブファンを根こそぎ連れていくロックバンド。",
    representativeSong: null, representativeName: "Nasu", representativePart: "Vo",
    skillIds: ["heart_inside", "influencer"],
    tags: ["middle", "sns", "idol_rock", "fan_pull", "event_candidate"],
    fame: 50, audience: 47
  },
  nova_biscuit: {
    id: "nova_biscuit", name: "Nova Biscuit", kana: "ノヴァビスケット", internalLv: 3, color: "#E5C296", markStyle: "B",
    genres: ["エモ", "パワーポップ", "インディーロック"],
    description: "宇宙っぽい名前に反して、ライブでは意外と激しいエモ/パワーポップバンド。",
    representativeSong: "冥王星", representativeName: "ドウセイ", representativePart: null,
    skillIds: ["lingering_echo"],
    tags: ["middle", "random_battle", "emo", "space"],
    fame: 48, audience: 41
  },
  polaris: {
    id: "polaris", name: "POLARIS", kana: "ポラリス", internalLv: 3, color: "#8FD9F5", markStyle: "B",
    genres: ["幻想演出系ロック"],
    description: "ぶっちぎりの個性で虜にさせる歌と演奏。冷たくも温かいロックバンド。",
    representativeSong: null, representativeName: "ヘイル", representativePart: "Vo",
    skillIds: ["emotional_fantasy"],
    tags: ["middle", "fantasy", "emotional", "event_candidate"],
    fame: 52, audience: 44
  },
  shelter: {
    id: "shelter", name: "SHELTER", kana: "シェルター", internalLv: 4, color: "#F0E23C", markStyle: "A",
    genres: ["ポップパンク", "ハードコア", "青春パンク"],
    description: "高い技術とライブパフォーマンスで、ひとつ上のステージを見せる実力派ロックバンド。",
    representativeSong: "RED MOON", representativeName: "クリオ", representativePart: "Vo",
    skillIds: ["rock_spirit"],
    tags: ["middle_late", "fes_candidate", "technical", "performance", "fixed_event"],
    fame: 58, audience: 52
  },
  luminescence: {
    id: "luminescence", name: "LUMINESCENCE", kana: "ルミナスセンス", internalLv: 4, color: "#3B7CD1", markStyle: "C",
    genres: ["メロディックハードコア", "スケートパンク", "エモパンク"],
    description: "雨、深海、発光をテーマにした、冷たく速いシアトル系メロディックハードコア。",
    representativeSong: null, representativeName: "ヘルツ", representativePart: "Vo/Gt",
    skillIds: ["deep_sea_rain"],
    tags: ["late", "foreign", "seattle", "melodic_hardcore", "special_event"],
    fame: 62, audience: 55
  },
  jack_bomb: {
    id: "jack_bomb", name: "JACK BOMB", kana: "ジャックボム", internalLv: 4, color: "#D2222A", markStyle: "A",
    genres: ["ラウド寄りミクスチャーロック"],
    description: "ラウド寄りのミクスチャーロックでフロアを盛り上げる爆発力のあるロックバンド。",
    representativeSong: "TNT", representativeName: "アラカ", representativePart: "Vo/Ba",
    skillIds: ["art_is_loud"],
    tags: ["middle_late", "fes_candidate", "mixture", "loud", "hype"],
    fame: 60, audience: 56
  },
  hyper_marmoty: {
    id: "hyper_marmoty", name: "HYPER MARMOTY", kana: "ハイパーマルモッティ", internalLv: 4, color: "#C97A2F", markStyle: "A",
    genres: ["青春パンク"],
    description: "まっすぐ熱い青春パンクで突っ走るシャウト系パンクロックバンド。",
    representativeSong: "シャウト!!", representativeName: "ヤマモト", representativePart: "Vo",
    skillIds: ["youth_shout"],
    tags: ["middle_late", "fes_candidate", "punk", "shout", "bright"],
    fame: 55, audience: 50
  },
  ultimate_quokkas: {
    id: "ultimate_quokkas", name: "ultimate quokkas", kana: "アルティメットクオッカズ", internalLv: 4, color: "#77DD4E", markStyle: "A",
    genres: ["スカパンク"],
    description: "明るいスカパンクで客席を笑顔にし、幸せを振りまくスカバンド。",
    representativeSong: "ジャグリング", representativeName: "ワラジ", representativePart: "Ba/Vo",
    skillIds: ["four_leaf_clover"],
    tags: ["middle_late", "fes_candidate", "ska", "happy", "rare_event"],
    fame: 57, audience: 51
  },
  rumble_sand: {
    id: "rumble_sand", name: "RUMBLE SAND", kana: "ランブルサンド", internalLv: 5, color: "#0F7D74", markStyle: "A",
    genres: ["パンクロック", "ラウドロック", "ハードロック"],
    description: "イギリスのパンクロックバンド。重く荒い音で巨大ステージを揺らす。",
    representativeSong: "arrive at the beach", representativeName: "サウスポート", representativePart: "Vo",
    skillIds: ["sea_roar"],
    tags: ["late", "fes_regular", "uk", "large_stage", "powerful"],
    fame: 78, audience: 72
  },
  neon_reef: {
    id: "neon_reef", name: "Neon Reef", kana: "ネオンリーフ", internalLv: 5, color: "#2B3FCC", markStyle: "B",
    genres: ["アート寄りロック", "都会的混沌"],
    description: "深海を思わす美しく存在感がある。名実ともに完成されたロックバンド。",
    representativeSong: "深青", representativeName: "ミノア", representativePart: "Vo",
    skillIds: ["deep_sea_tree"],
    tags: ["late", "major", "art_rock", "deep_sea", "complete"],
    fame: 84, audience: 78
  },
  kaede: {
    id: "kaede", name: "KAEDE", kana: "カエデ", internalLv: 5, color: "#A8322B", markStyle: "B",
    genres: ["ギターロック", "歌ものロック"],
    description: "弾き語りでもバンド編成でも、言葉と歌で空気を変えるシンガーソングライター。",
    representativeSong: "Dragonfly", representativeName: "カエデ", representativePart: "Vo/Gt",
    skillIds: ["kotodama"],
    tags: ["middle_late", "singer_songwriter", "lyrics", "industry_rep"],
    fame: 74, audience: 66
  },
  lact: {
    id: "lact", name: "LACT", kana: "ラクト", internalLv: 6, color: "#AB3B57", markStyle: "A",
    genres: ["ハードコア", "ラウドロック", "パンク"],
    description: "全てのバンドが憧れる伝説のロックバンド。重く激しいがキャッチーな音で全てを取り込む。",
    representativeSong: "a lact of heart", representativeName: "ラルゴ", representativePart: "Vo",
    skillIds: ["great_rock_hits"],
    tags: ["final", "grand", "legend", "last_goal", "special_event"],
    fame: 96, audience: 92
  }
});


/* ------------------------------------------------------------------
 * v0.4.0d BAND_LORE_DATABASE（図鑑コメント・裏話）
 * - セーブ拡張なし。交流値/遭遇状態/既読イベントを読むだけ。
 * - comments: 出会い後に表示する代表者コメント。
 * - lore: 交流値やイベント既読で段階解放する裏話。
 * ------------------------------------------------------------------ */
const BAND_LORE_DATABASE = Object.freeze({
  kiwi: { comment: "モズ『肩に力を入れすぎると、いいメロディーも逃げるよ。ゆるくやって、ちゃんと残そう。』", lore: [
    { id:"kiwi_lore_1", needRelation:30, title:"ゆるい円陣", text:"Kiwiの円陣は気合いを入れるというより、全員で深呼吸するためのもの。モズは“空気を合わせる”と言っている。" },
    { id:"kiwi_lore_2", needRelation:60, title:"グリムポップの温度", text:"“グリムポップ”は明るい曲だが、歌詞には少しだけ寂しさが混じる。その温度差が、Kiwiらしい余韻になっている。" }
  ] },
  kodama: { comment: "ヒノカワ『音が消えたあとに残るものまで、曲だと思っているんです。』", lore: [] },
  melt: { comment: "ロク『ライブハウスって、ネットの海より狭いのに、たまにずっと遠くまで届くよね。』", lore: [] },
  koharugiku: { comment: "シュンカ『速い曲でも、置いていきたい言葉は雑にしたくないんだ。』", lore: [] },
  triple_arrows: { comment: "タカナシ『下手でも、今しか出せない音はある。まずは一本、矢を飛ばそうぜ。』", lore: [
    { id:"triple_arrows_lore_1", needRelation:30, title:"UNDERの常連席", text:"Triple ArrowsはUNDERの端のテーブルを勝手に“作戦会議席”と呼んでいる。ライブ前はそこでセトリを何度も並べ替える。" },
    { id:"triple_arrows_lore_2", needRelation:60, title:"3本の矢の意味", text:"バンド名の“三本”は、技術・勢い・続ける根性のこと。タカナシは最後の一本が一番折れにくいと言う。" }
  ] },
  carbons: { comment: "ナキリ『原石って言葉、好きじゃない。磨く手間まで含めて自分の音でしょ。』", lore: [
    { id:"carbons_lore_1", needRelation:30, title:"尖ったリハ", text:"CARBONSのリハは短い。ナキリは音を出した瞬間の違和感だけ拾い、余計な確認をほとんどしない。" },
    { id:"carbons_lore_2", needRelation:60, title:"削らない理由", text:"CARBONSは聴きやすく整えるより、引っかかりを残すことを選ぶ。その棘が、次のライブへの記憶になる。" }
  ] },
  magnet_wolf: { comment: "ダイドウジ『荒い？ いいんだよ。噛み跡が残るくらいじゃないと、狼って名乗れねえ。』", lore: [
    { id:"magnet_wolf_lore_1", needRelation:30, title:"古いアンプ", text:"magnet wolfのアンプはいつも少しノイズが乗る。ダイドウジはそのノイズまで“うちの音”だと言い張る。" },
    { id:"magnet_wolf_lore_2", needRelation:60, title:"ICEBOXの由来", text:"代表曲“ICEBOX”は、寒い倉庫ライブで指が動かなかった夜にできた。荒いリフには、その日の悔しさが残っている。" }
  ] },
  patriot_sunshine: { comment: "アズマル『暗い場所で明るい音を鳴らすの、けっこう反則だと思わない？』", lore: [] },
  d_lion: { comment: "TAMANO『踊れるかどうかはジャンルじゃなくて、最初の一音で決まるんだよ。』", lore: [] },
  pachi_pachi: { comment: "ミケ『お客さんを巻き込むんじゃなくて、一緒に落ちていく感じ。そこが一番楽しい。』", lore: [
    { id:"pachi_pachi_lore_1", needRelation:30, title:"手拍子の研究", text:"Pachi-Pachiは曲中の手拍子位置をかなり細かく決めている。自然に見える一体感ほど、実は準備されている。" },
    { id:"pachi_pachi_lore_2", needRelation:60, title:"わたあめの間奏", text:"“わたあめ”の間奏は、客席の声が入って完成するように作られている。ミケは録音音源よりライブ版を本番だと思っている。" }
  ] },
  in_bab: { comment: "Nasu『かわいいだけじゃ連れていけない。目が合った瞬間に、こっちの熱を渡すんだよ。』", lore: [] },
  nova_biscuit: { comment: "ドウセイ『宇宙って遠いけど、ライブハウスの天井もだいたい同じくらい遠い日がある。』", lore: [] },
  polaris: { comment: "ヘイル『冷たい音でも、誰かの帰り道を照らせるなら、それでいい。』", lore: [] },
  shelter: { comment: "クリオ『上手いだけなら練習で足りる。守りたい場所があるから、音は強くなる。』", lore: [
    { id:"shelter_lore_1", needRelation:30, title:"楽屋の静けさ", text:"SHELTERの楽屋は意外なほど静かだ。本番前のクリオは、誰よりも早く会場の空気だけを聴いている。" },
    { id:"shelter_lore_2", needRelation:60, title:"RED MOONの赤", text:"“RED MOON”は派手な曲に見えて、ライブハウスを守るための曲でもある。照明の赤は、帰る場所の印だという。" }
  ] },
  luminescence: { comment: "ヘルツ『雨の日の低音は沈む。でも沈んだ音だけが、底で光ることもある。』", lore: [] },
  jack_bomb: { comment: "アラカ『爆発って一瞬だろ？ だからその前の静けさをサボると、ただの大きい音になる。』", lore: [] },
  hyper_marmoty: { comment: "ヤマモト『まっすぐって、簡単そうで一番ごまかせないんだよな！』", lore: [] },
  ultimate_quokkas: { comment: "ワラジ『笑ってるだけじゃないよ。笑ってるから、転んでもすぐ立てるんだ。』", lore: [] },
  rumble_sand: { comment: "サウスポート『砂嵐の中でも、前にいる奴の背中だけは見える。それがバンドだ。』", lore: [] },
  neon_reef: { comment: "ミノア『深く潜るほど、音は静かになる。静かな音ほど、逃げ場がなくなる。』", lore: [] },
  kaede: { comment: "カエデ『言葉は、届いたあとに曲になることがある。だから最後の一文字まで置きにいく。』", lore: [
    { id:"kaede_lore_1", needRelation:30, title:"一人のリハ", text:"KAEDEはバンド編成の日でも、一度だけ一人でステージに立つ。会場の返事を先に聞くためらしい。" },
    { id:"kaede_lore_2", needRelation:60, title:"Dragonflyの余白", text:"“Dragonfly”の最後の余白は、歌詞を書かなかった部分ではなく、客席が自分のことを思い出すための時間。" }
  ] },
  lact: { comment: "ラルゴ『憧れは遠くに置くな。届かない場所に置いた瞬間、言い訳になる。』", lore: [
    { id:"lact_lore_1", needRelation:30, needEvent:"flag_lact_name_dropped", title:"名前だけの圧", text:"LACTの名前が出るだけで、ライブハウスの空気が少し変わる。誰もが一度は、その背中を見ている。" },
    { id:"lact_lore_2", needRelation:60, title:"a lact of heart", text:"“a lact of heart”は重く激しい曲なのに、サビだけは誰でも口ずさめる。LACTが伝説扱いされる理由は、その矛盾を成立させる強さにある。" }
  ] }
});

function bandLoreRecord(id) { return BAND_LORE_DATABASE[id] || { comment:"", lore:[] }; }
function bandLoreUnlocked(item, bandId) {
  if (!item) return false;
  const rel = bandRelation(bandId);
  const needRel = Number(item.needRelation || 0);
  if (needRel && rel < needRel) return false;
  if (item.needEvent && !bandFlags()[item.needEvent] && !bandSeenEvents()[item.needEvent]) return false;
  return true;
}
function renderBandBookTabs(active) {
  const tabs = [
    ["profile", "プロフィール"],
    ["comment", "コメント"],
    ["lore", "裏話"]
  ];
  return `<div class="bandbook-tabs">${tabs.map(([key,label]) => `<button class="bandBookTabBtn ${active === key ? "active" : ""}" data-bandbook-tab="${key}">${label}</button>`).join("")}</div>`;
}

/* ------------------------------------------------------------------
 * BAND_SKILL_DATABASE（交流スキル）
 * effectImplemented: v0.3.60で効果コードを動かすか
 * obtainableIn: 入手可能になる想定バージョン
 * ------------------------------------------------------------------ */
const BAND_SKILL_DATABASE = Object.freeze({
  three_basics: {
    id: "three_basics", name: "3本の基礎", type: "unique",
    sourceBandIds: ["triple_arrows"],
    description: "打ち上げでの交流成功率（紹介率）が+5%上がる。",
    effectCategories: ["after_party"],
    params: { afterPartySuccessAddPct: 5 },
    maxLevel: 1, effectImplemented: true, obtainableIn: "0.3.60"
  },
  diamond_rough: {
    id: "diamond_rough", name: "ダイヤの原石", type: "unique",
    sourceBandIds: ["carbons"],
    description: "CARBONSに認められた原石の証。CARBONS再登場に関わる。現バージョンでは所持記録のみで、数値効果や変化抽選はない。",
    effectCategories: ["unlock_event"],
    params: {},
    maxLevel: 1, effectImplemented: false, obtainableIn: "0.3.60"
  },
  diamond_shine: {
    id: "diamond_shine", name: "ダイヤモンドの輝き", type: "rare",
    acquisition: "transform", transformFrom: "diamond_rough",
    sourceBandIds: ["carbons"],
    description: "ダイヤの原石から変化するとされるレアスキル。現バージョンでは入手・効果ともに存在しない（データのみ）。",
    effectCategories: ["growth_boost"],
    params: {},
    maxLevel: 1, effectImplemented: false, obtainableIn: "later"
  },
  popping_sweetness: {
    id: "popping_sweetness", name: "弾ける甘味", type: "unique",
    sourceBandIds: ["pachi_pachi"],
    description: "Pachi-Pachiに認められた証。現バージョンでは獲得記録のみで、数値効果はない。",
    effectCategories: ["audience_reaction", "fan_gain"],
    params: { audienceReactionAddPct: 3, fanGainAddPct: 3 },
    maxLevel: 1, effectImplemented: false, obtainableIn: "0.3.60"
  },
  rock_spirit: {
    id: "rock_spirit", name: "ロック魂", type: "unique",
    sourceBandIds: ["shelter"],
    description: "SHELTERに認められた証。現バージョンでは獲得記録のみで、数値効果はない。",
    effectCategories: ["live_score"],
    params: { liveScoreAddPct: 3 },
    maxLevel: 1, effectImplemented: false, obtainableIn: "0.3.60"
  },
  kotodama: {
    id: "kotodama", name: "言霊", type: "unique",
    sourceBandIds: ["kaede"],
    description: "KAEDEに認められた言葉の証。現バージョンでは獲得記録のみで、数値効果はない。",
    effectCategories: ["songwriting", "industry_rep"],
    params: { songwritingAddPct: 3, industryRepAddPct: 2 },
    maxLevel: 1, effectImplemented: false, obtainableIn: "later"
  },
  art_is_loud: {
    id: "art_is_loud", name: "芸術は爆音", type: "unique",
    sourceBandIds: ["jack_bomb"],
    description: "JACK BOMBに認められた爆音の証。現バージョンでは獲得記録のみで、数値効果はない。",
    effectCategories: ["live_hype", "composition"],
    params: { liveHypeAddPct: 3 },
    maxLevel: 1, effectImplemented: false, obtainableIn: "later"
  },
  youth_shout: {
    id: "youth_shout", name: "青春シャウト", type: "unique",
    sourceBandIds: ["hyper_marmoty"],
    description: "HYPER MARMOTYに認められた熱の証。現バージョンでは獲得記録のみで、数値効果はない。",
    effectCategories: ["live_hype", "composition"],
    params: { liveHypeAddPct: 3 },
    maxLevel: 1, effectImplemented: false, obtainableIn: "later"
  },
  four_leaf_clover: {
    id: "four_leaf_clover", name: "四つ葉のクローバー", type: "unique",
    sourceBandIds: ["ultimate_quokkas"],
    description: "ultimate quokkasに認められた幸運の証。現バージョンでは獲得記録のみで、数値効果はない。",
    effectCategories: ["audience_reaction", "money_gain", "rare_event"],
    params: { audienceReactionAddPct: 3, moneyGainAddPct: 3, rareEventAddPct: 1 },
    maxLevel: 1, effectImplemented: false, obtainableIn: "later"
  },
  sea_roar: {
    id: "sea_roar", name: "海鳴らし", type: "unique",
    sourceBandIds: ["rumble_sand"],
    description: "RUMBLE SANDに認められた轟音の証。現バージョンでは獲得記録のみで、数値効果はない。",
    effectCategories: ["sns_boost", "final_fes_support"],
    params: { snsBoostAddPct: 3, finalFesSupportAddPct: 2 },
    maxLevel: 1, effectImplemented: false, obtainableIn: "later"
  },
  deep_sea_tree: {
    id: "deep_sea_tree", name: "深海樹", type: "unique",
    sourceBandIds: ["neon_reef"],
    description: "Neon Reefに認められた深海の証。現バージョンでは獲得記録のみで、数値効果はない。",
    effectCategories: ["industry_rep", "final_fes_support"],
    params: { industryRepAddPct: 3, finalFesSupportAddPct: 2 },
    maxLevel: 1, effectImplemented: false, obtainableIn: "later"
  },
  heart_inside: {
    id: "heart_inside", name: "heart inside", type: "unique",
    sourceBandIds: ["in_bab"],
    description: "IN-BABに認められた絆の証。現バージョンでは獲得記録のみで、数値効果はない。",
    effectCategories: ["sns_boost", "audience_reaction"],
    params: { snsBoostAddPct: 3, audienceReactionAddPct: 2 },
    maxLevel: 1, effectImplemented: false, obtainableIn: "later"
  },
  deep_sea_rain: {
    id: "deep_sea_rain", name: "深海雨", type: "unique",
    sourceBandIds: ["luminescence"],
    description: "LUMINESCENCEに認められた深海雨の証。現バージョンでは獲得記録のみで、数値効果はない。",
    effectCategories: ["equipment", "song_upgrade", "industry_rep"],
    params: { songUpgradeAddPct: 3, industryRepAddPct: 1 },
    maxLevel: 1, effectImplemented: false, obtainableIn: "later"
  },
  emotional_fantasy: {
    id: "emotional_fantasy", name: "エモーショナルファンタジー", type: "unique",
    sourceBandIds: ["polaris"],
    description: "POLARISに認められた幻想の証。現バージョンでは獲得記録のみで、数値効果はない。",
    effectCategories: ["live_score", "fatigue_reduce"],
    params: { liveScoreAddPct: 2, fatigueReducePct: 2 },
    maxLevel: 1, effectImplemented: false, obtainableIn: "later"
  },
  great_rock_hits: {
    id: "great_rock_hits", name: "GREAT ROCK HITS", type: "special",
    sourceBandIds: ["lact"],
    description: "LACTに認められた伝説の証。現バージョンでは獲得記録のみで、数値効果はない。",
    effectCategories: ["final_fes_support", "special_effect"],
    params: { finalFesSupportAddPct: 3 },
    maxLevel: 1, effectImplemented: false, obtainableIn: "later"
  },
  healing_character: {
    id: "healing_character", name: "癒しキャラ", type: "common",
    sourceBandIds: ["kiwi", "koharugiku"],
    description: "打ち上げの交流成功率がLv×2%（最大+5%）上がる。供給源が2組のため、現在はLv2まで。",
    effectCategories: ["after_party"],
    params: { afterPartySuccessAddPctPerLevel: 2, maxTotalAddPct: 5 },
    maxLevel: 3, effectiveMaxLevelInCurrentData: 2,
    effectImplemented: true, obtainableIn: "0.3.60"
  },
  rivalry_spirit: {
    id: "rivalry_spirit", name: "ライバル意識", type: "common",
    sourceBandIds: ["magnet_wolf", "patriot_sunshine", "d_lion"],
    description: "対バンでS/A評価を取った時、格上刺激の成長にLv分（最大+3）加算される。",
    effectCategories: ["rival_growth"],
    params: { rivalGrowthAddPctPerLevel: 1, maxTotalAddPct: 3 },
    maxLevel: 3, effectImplemented: true, obtainableIn: "0.3.60"
  },
  lingering_echo: {
    id: "lingering_echo", name: "余韻残響", type: "common",
    sourceBandIds: ["kodama", "melt", "koharugiku", "nova_biscuit"],
    description: "疲労の増え方がLv×1%（最大3%）下がる。",
    effectCategories: ["fatigue_reduce"],
    params: { fatigueReducePctPerLevel: 1, maxTotalReducePct: 3 },
    maxLevel: 3, effectImplemented: true, obtainableIn: "0.3.60"
  },
  influencer: {
    id: "influencer", name: "インフルエンサー", type: "common",
    sourceBandIds: ["melt", "in_bab"],
    description: "宣伝コマンドの効果がLv×2%（最大+5%）上がる。供給源が2組のため、現在はLv2まで。",
    effectCategories: ["sns_boost"],
    params: { snsBoostAddPctPerLevel: 2, maxTotalAddPct: 5 },
    maxLevel: 3, effectiveMaxLevelInCurrentData: 2,
    effectImplemented: true, obtainableIn: "0.3.60"
  }
});

/* ------------------------------------------------------------------
 * BAND_EVENT_DATABASE（主要イベント）
 * 発火ルール：
 * - ストーリー系（battle以外）は1ターン1件まで。priority降順で1件。
 * - フェス種ライブ・固定ライブがあるターンは発火抑制（持ち越し）。
 * - repeatable:false の管理はエンジン側 seenEvents。
 * - lastBattleResult対応：S=great_success / A=success / B以下=normal。
 *   条件判定は「以上」（great_successはsuccess条件も満たす）。
 * - battle型はイベントというより「対バン候補プールの出現窓＋初回演出」。
 * フラグ一覧：
 * - flag_triple_arrows_met: 初回打ち上げイベントが set
 * - flag_triple_arrows_invite_available: 招待メールイベントが set
 * - flag_triple_arrows_invite_done: 招待ライブ完了時に applyLiveResult が set
 * - flag_carbons_return: CARBONS大成功イベントが set（v0.3.65用）
 * - flag_lact_name_dropped: LACT名前出しイベントが set
 * ※ 招待メールは v0.3.50 の「打ち上げスキップでも8T招待が届く」挙動を維持するため、
 *   条件を firstLiveDone に緩和し startTurn を 6 にしている（DBパックからの意図的変更）。
 * ------------------------------------------------------------------ */
const BAND_EVENT_DATABASE = Object.freeze({
  event_triple_arrows_first_after_party: {
    id: "event_triple_arrows_first_after_party",
    bandId: "triple_arrows", type: "after_party",
    startTurn: 5, endTurn: 14, repeatable: false, priority: 100,
    conditions: { firstLiveDone: true },
    effects: {
      discoverBandId: "triple_arrows", relationAdd: 20,
      addLog: "Triple Arrowsと打ち上げをした。タカナシたちと連絡先を交換した。",
      setFlags: ["flag_triple_arrows_met"]
    },
    unlockSkillId: null
  },
  event_triple_arrows_invite_live: {
    id: "event_triple_arrows_invite_live",
    bandId: "triple_arrows", type: "mail_invite",
    startTurn: 6, endTurn: 20, repeatable: false, priority: 95,
    conditions: { firstLiveDone: true },
    effects: {
      discoverBandId: "triple_arrows", relationAdd: 10,
      addLog: "Triple Arrowsから招待ライブのメールが届いた。",
      setFlags: ["flag_triple_arrows_invite_available"]
    },
    unlockSkillId: null
  },
  event_triple_arrows_skill_unlock: {
    id: "event_triple_arrows_skill_unlock",
    bandId: "triple_arrows", type: "skill_unlock",
    startTurn: 8, endTurn: 30, repeatable: false, priority: 90,
    conditions: { hasFlag: "flag_triple_arrows_invite_done", skillNotOwned: "three_basics" },
    effects: {
      relationAdd: 20,
      addLog: "Triple Arrowsとの交流が深まり、3本の基礎を学んだ。"
    },
    unlockSkillId: "three_basics"
  },
  event_carbons_first_battle: {
    id: "event_carbons_first_battle",
    bandId: "carbons", type: "battle",
    startTurn: 6, endTurn: 20, repeatable: false, priority: 85,
    conditions: { firstLiveDone: true },
    effects: {
      discoverBandId: "carbons", relationAdd: 10,
      addLog: "CARBONSと初めて対バンした。"
    },
    unlockSkillId: null
  },
  event_carbons_after_party_success: {
    id: "event_carbons_after_party_success",
    bandId: "carbons", type: "after_party",
    startTurn: 6, endTurn: 24, repeatable: false, priority: 80,
    conditions: {
      eventSeen: "event_carbons_first_battle",
      lastBattleBandId: "carbons",
      lastBattleResult: "great_success",
      skillNotOwned: "diamond_rough"
    },
    effects: {
      relationAdd: 25,
      addLog: "CARBONSとの対バン後、ナキリから声をかけられた。",
      setFlags: ["flag_carbons_return"]
    },
    unlockSkillId: "diamond_rough"
  },
  event_kiwi_random_battle: {
    id: "event_kiwi_random_battle", bandId: "kiwi", type: "battle",
    startTurn: 3, endTurn: 24, repeatable: true, priority: 30,
    conditions: { firstLiveDone: true },
    effects: { discoverBandId: "kiwi", relationAdd: 10, addLog: "Kiwiと対バンした。" },
    unlockSkillId: null
  },
  event_kodama_random_battle: {
    id: "event_kodama_random_battle", bandId: "kodama", type: "battle",
    startTurn: 3, endTurn: 24, repeatable: true, priority: 30,
    conditions: { firstLiveDone: true },
    effects: { discoverBandId: "kodama", relationAdd: 10, addLog: "コダマと対バンした。" },
    unlockSkillId: null
  },
  event_koharugiku_random_battle: {
    id: "event_koharugiku_random_battle", bandId: "koharugiku", type: "battle",
    startTurn: 5, endTurn: 28, repeatable: true, priority: 30,
    conditions: { firstLiveDone: true },
    effects: { discoverBandId: "koharugiku", relationAdd: 10, addLog: "コハルギクと対バンした。" },
    unlockSkillId: null
  },
  event_melt_random_battle: {
    id: "event_melt_random_battle", bandId: "melt", type: "battle",
    startTurn: 5, endTurn: 28, repeatable: true, priority: 30,
    conditions: { firstLiveDone: true },
    effects: { discoverBandId: "melt", relationAdd: 10, addLog: "めるとと対バンした。" },
    unlockSkillId: null
  },
  event_magnet_wolf_battle: {
    id: "event_magnet_wolf_battle", bandId: "magnet_wolf", type: "battle",
    startTurn: 8, endTurn: 32, repeatable: true, priority: 30,
    conditions: { firstLiveDone: true },
    effects: { discoverBandId: "magnet_wolf", relationAdd: 10, addLog: "magnet wolfと対バンした。" },
    unlockSkillId: null
  },
  event_patriot_sunshine_battle: {
    id: "event_patriot_sunshine_battle", bandId: "patriot_sunshine", type: "battle",
    startTurn: 8, endTurn: 32, repeatable: true, priority: 30,
    conditions: { firstLiveDone: true },
    effects: { discoverBandId: "patriot_sunshine", relationAdd: 10, addLog: "Patriot Sunshineと対バンした。" },
    unlockSkillId: null
  },
  event_d_lion_battle: {
    id: "event_d_lion_battle", bandId: "d_lion", type: "battle",
    startTurn: 8, endTurn: 32, repeatable: true, priority: 30,
    conditions: { firstLiveDone: true },
    effects: { discoverBandId: "d_lion", relationAdd: 10, addLog: "D-Lionと対バンした。" },
    unlockSkillId: null
  },
  event_pachi_pachi_first_battle: {
    id: "event_pachi_pachi_first_battle", bandId: "pachi_pachi", type: "battle",
    startTurn: 15, endTurn: 25, repeatable: false, priority: 75,
    conditions: { firstLiveDone: true, minFans: 40 },
    effects: {
      discoverBandId: "pachi_pachi", relationAdd: 15,
      addLog: "Pachi-Pachiと対バンした。フェスに近いバンドの熱量を感じた。"
    },
    unlockSkillId: null
  },
  event_pachi_pachi_rematch: {
    id: "event_pachi_pachi_rematch", bandId: "pachi_pachi", type: "battle",
    startTurn: 16, endTurn: 35, repeatable: true, priority: 30,
    conditions: { eventSeen: "event_pachi_pachi_first_battle" },
    effects: { relationAdd: 5, addLog: "Pachi-Pachiと再び対バンした。" },
    unlockSkillId: null
  },
  event_pachi_pachi_second_success: {
    id: "event_pachi_pachi_second_success", bandId: "pachi_pachi", type: "skill_unlock",
    startTurn: 20, endTurn: 35, repeatable: false, priority: 70,
    conditions: {
      minBattleCountWithBand: { bandId: "pachi_pachi", count: 2 },
      lastBattleBandId: "pachi_pachi",
      lastBattleResult: "success",
      skillNotOwned: "popping_sweetness"
    },
    effects: {
      relationAdd: 25,
      addLog: "Pachi-Pachiとの対バン後、ミケたちに認められた。"
    },
    unlockSkillId: "popping_sweetness"
  },
  event_shelter_watched_live: {
    id: "event_shelter_watched_live", bandId: "shelter", type: "encounter",
    startTurn: 25, endTurn: 35, repeatable: false, priority: 75,
    conditions: { minLastLiveScore: 70, minIndustryRep: 60 },
    effects: {
      discoverBandId: "shelter", relationAdd: 10,
      addLog: "ライブハウスのスタッフから、SHELTERがライブを見ていたと聞いた。"
    },
    unlockSkillId: null
  },
  event_shelter_after_live_talk: {
    id: "event_shelter_after_live_talk", bandId: "shelter", type: "skill_unlock",
    startTurn: 26, endTurn: 40, repeatable: false, priority: 70,
    conditions: {
      eventSeen: "event_shelter_watched_live",
      minLastLiveScore: 75,
      minTotalStatus: 60,
      skillNotOwned: "rock_spirit"
    },
    effects: {
      relationAdd: 25,
      addLog: "SHELTERのクリオから声をかけられた。ひとつ上のステージの空気を知った。"
    },
    unlockSkillId: "rock_spirit"
  },
  event_in_bab_first_battle: {
    id: "event_in_bab_first_battle", bandId: "in_bab", type: "battle",
    startTurn: 18, endTurn: 35, repeatable: false, priority: 55,
    conditions: { minFans: 60 },
    effects: {
      discoverBandId: "in_bab", relationAdd: 15,
      addLog: "IN-BABと対バンした。メンバーの魅力でフロアの空気が一気に変わった。"
    },
    unlockSkillId: null
  },
  event_polaris_first_battle: {
    id: "event_polaris_first_battle", bandId: "polaris", type: "battle",
    startTurn: 18, endTurn: 35, repeatable: false, priority: 55,
    conditions: { minOriginalSongs: 3 },
    effects: {
      discoverBandId: "polaris", relationAdd: 15,
      addLog: "POLARISと対バンした。冷たくも温かいライブ演出に圧倒された。"
    },
    unlockSkillId: null
  },
  event_kaede_acoustic_encounter: {
    id: "event_kaede_acoustic_encounter", bandId: "kaede", type: "encounter",
    startTurn: 25, endTurn: 40, repeatable: false, priority: 55,
    conditions: { minIndustryRep: 55 },
    effects: {
      discoverBandId: "kaede", relationAdd: 10,
      addLog: "弾き語りイベントでKAEDEのステージを見た。"
    },
    unlockSkillId: null
  },
  event_jack_bomb_battle: {
    id: "event_jack_bomb_battle", bandId: "jack_bomb", type: "battle",
    startTurn: 28, endTurn: 42, repeatable: false, priority: 50,
    conditions: { minFans: 90 },
    effects: {
      discoverBandId: "jack_bomb", relationAdd: 15,
      addLog: "JACK BOMBと対バンした。爆発力のあるライブでフロアが揺れた。"
    },
    unlockSkillId: null
  },
  event_hyper_marmoty_battle: {
    id: "event_hyper_marmoty_battle", bandId: "hyper_marmoty", type: "battle",
    startTurn: 28, endTurn: 42, repeatable: false, priority: 45,
    conditions: { minFans: 80 },
    effects: {
      discoverBandId: "hyper_marmoty", relationAdd: 15,
      addLog: "HYPER MARMOTYと対バンした。まっすぐなシャウトが客席を引っ張った。"
    },
    unlockSkillId: null
  },
  event_ultimate_quokkas_battle: {
    id: "event_ultimate_quokkas_battle", bandId: "ultimate_quokkas", type: "battle",
    startTurn: 28, endTurn: 42, repeatable: false, priority: 45,
    conditions: { minFans: 80 },
    effects: {
      discoverBandId: "ultimate_quokkas", relationAdd: 15,
      addLog: "ultimate quokkasと対バンした。明るいスカパンクで会場中が笑顔になった。"
    },
    unlockSkillId: null
  },
  event_rumble_sand_sns_discover: {
    id: "event_rumble_sand_sns_discover", bandId: "rumble_sand", type: "sns_discover",
    startTurn: 30, endTurn: 45, repeatable: false, priority: 40,
    conditions: { minIndustryRep: 70 },
    effects: {
      discoverBandId: "rumble_sand", relationAdd: 0,
      addLog: "大型フェス情報でRUMBLE SANDの名前を見かけた。"
    },
    unlockSkillId: null
  },
  event_neon_reef_news_discover: {
    id: "event_neon_reef_news_discover", bandId: "neon_reef", type: "sns_discover",
    startTurn: 30, endTurn: 45, repeatable: false, priority: 40,
    conditions: { minIndustryRep: 75 },
    effects: {
      discoverBandId: "neon_reef", relationAdd: 0,
      addLog: "音楽ニュースでNeon Reefのライブ映像を見た。"
    },
    unlockSkillId: null
  },
  event_lact_name_drop: {
    id: "event_lact_name_drop", bandId: "lact", type: "sns_discover",
    startTurn: 38, endTurn: 50, repeatable: false, priority: 50,
    conditions: { minFans: 120, minIndustryRep: 90 },
    effects: {
      discoverBandId: "lact", relationAdd: 0,
      addLog: "GRAND UNDER FESの情報で、LACTの名前が大きく取り上げられていた。",
      setFlags: ["flag_lact_name_dropped"]
    },
    unlockSkillId: null
  },
  event_triple_arrows_after_invite_rematch: {
    id: "event_triple_arrows_after_invite_rematch", bandId: "triple_arrows", type: "encounter",
    startTurn: 10, endTurn: 32, repeatable: false, priority: 64,
    conditions: {
      hasFlag: "flag_triple_arrows_invite_done",
      minBattleCountWithBand: { bandId: "triple_arrows", count: 2 },
      lastBattleBandId: "triple_arrows"
    },
    effects: {
      relationAdd: 12,
      addLog: "Triple Arrowsとの再戦後、タカナシたちと次のステージについて話した。"
    },
    unlockSkillId: null
  },
  event_carbons_return_talk: {
    id: "event_carbons_return_talk", bandId: "carbons", type: "encounter",
    startTurn: 12, endTurn: 34, repeatable: false, priority: 63,
    conditions: {
      hasFlag: "flag_carbons_return",
      minBattleCountWithBand: { bandId: "carbons", count: 1 }
    },
    effects: {
      relationAdd: 10,
      addLog: "CARBONSのナキリから、尖りを磨くための課題をもらった。"
    },
    unlockSkillId: null
  },
  event_pachi_pachi_floor_sign: {
    id: "event_pachi_pachi_floor_sign", bandId: "pachi_pachi", type: "encounter",
    startTurn: 22, endTurn: 40, repeatable: false, priority: 62,
    conditions: {
      eventSeen: "event_pachi_pachi_second_success",
      minBattleCountWithBand: { bandId: "pachi_pachi", count: 2 }
    },
    effects: {
      relationAdd: 10,
      addLog: "Pachi-Pachiのミケから、客席との合図の作り方を聞いた。"
    },
    unlockSkillId: null
  },
  event_shelter_backstage_advice: {
    id: "event_shelter_backstage_advice", bandId: "shelter", type: "encounter",
    startTurn: 28, endTurn: 46, repeatable: false, priority: 62,
    conditions: {
      eventSeen: "event_shelter_after_live_talk",
      minLastLiveScore: 75
    },
    effects: {
      relationAdd: 10,
      addLog: "SHELTERのクリオから、大きなステージで崩れない準備について助言を受けた。"
    },
    unlockSkillId: null
  },
  event_kiwi_greenroom_talk: {
    id: "event_kiwi_greenroom_talk", bandId: "kiwi", type: "encounter",
    startTurn: 6, endTurn: 28, repeatable: false, priority: 48,
    conditions: {
      eventSeen: "event_kiwi_random_battle",
      lastBattleBandId: "kiwi"
    },
    effects: {
      relationAdd: 8,
      addLog: "Kiwiとの対バン後、楽屋で肩の力を抜くライブの作り方を聞いた。"
    },
    unlockSkillId: null
  },
  event_magnet_wolf_dirty_riff: {
    id: "event_magnet_wolf_dirty_riff", bandId: "magnet_wolf", type: "encounter",
    startTurn: 10, endTurn: 36, repeatable: false, priority: 48,
    conditions: {
      eventSeen: "event_magnet_wolf_battle",
      lastBattleBandId: "magnet_wolf",
      lastBattleResult: "success"
    },
    effects: {
      relationAdd: 8,
      addLog: "magnet wolfのダイドウジから、荒いリフのまま客席に刺す感覚を教わった。"
    },
    unlockSkillId: null
  },
  event_kaede_one_phrase: {
    id: "event_kaede_one_phrase", bandId: "kaede", type: "encounter",
    startTurn: 26, endTurn: 46, repeatable: false, priority: 52,
    conditions: {
      eventSeen: "event_kaede_acoustic_encounter",
      minIndustryRep: 65
    },
    effects: {
      relationAdd: 10,
      addLog: "KAEDEから、歌詞の一行で空気を変えるステージングについて聞いた。"
    },
    unlockSkillId: null
  },
  event_lact_backstage_shadow: {
    id: "event_lact_backstage_shadow", bandId: "lact", type: "encounter",
    startTurn: 44, endTurn: 50, repeatable: false, priority: 58,
    conditions: {
      eventSeen: "event_lact_name_drop",
      minFans: 150,
      minIndustryRep: 110
    },
    effects: {
      relationAdd: 5,
      addLog: "GRAND UNDER FESの控室導線で、LACTの存在感を遠くに感じた。"
    },
    unlockSkillId: null
  },
  event_in_bab_fan_pull_talk: {
    id: "event_in_bab_fan_pull_talk", bandId: "in_bab", type: "encounter",
    startTurn: 20, endTurn: 42, repeatable: false, priority: 51,
    conditions: {
      eventSeen: "event_in_bab_first_battle",
      lastBattleBandId: "in_bab",
      minFans: 70
    },
    effects: {
      relationAdd: 10,
      addLog: "IN-BABのNasuから、客席を連れていく立ち方について聞いた。"
    },
    unlockSkillId: null
  },
  event_polaris_afterglow_lesson: {
    id: "event_polaris_afterglow_lesson", bandId: "polaris", type: "encounter",
    startTurn: 20, endTurn: 42, repeatable: false, priority: 51,
    conditions: {
      eventSeen: "event_polaris_first_battle",
      lastBattleBandId: "polaris",
      minOriginalSongs: 4
    },
    effects: {
      relationAdd: 10,
      addLog: "POLARISのヘイルから、余韻を残す曲順について短い助言を受けた。"
    },
    unlockSkillId: null
  },
  event_jack_bomb_blast_check: {
    id: "event_jack_bomb_blast_check", bandId: "jack_bomb", type: "encounter",
    startTurn: 30, endTurn: 46, repeatable: false, priority: 49,
    conditions: {
      eventSeen: "event_jack_bomb_battle",
      lastBattleBandId: "jack_bomb",
      lastBattleResult: "success"
    },
    effects: {
      relationAdd: 10,
      addLog: "JACK BOMBのアラカに、爆発力を最後まで保つライブ運びを聞いた。"
    },
    unlockSkillId: null
  },
  event_hyper_marmoty_shout_circle: {
    id: "event_hyper_marmoty_shout_circle", bandId: "hyper_marmoty", type: "encounter",
    startTurn: 30, endTurn: 46, repeatable: false, priority: 48,
    conditions: {
      eventSeen: "event_hyper_marmoty_battle",
      lastBattleBandId: "hyper_marmoty"
    },
    effects: {
      relationAdd: 8,
      addLog: "HYPER MARMOTYのヤマモトと、まっすぐなシャウトの届かせ方を話した。"
    },
    unlockSkillId: null
  },
  event_ultimate_quokkas_happy_rhythm: {
    id: "event_ultimate_quokkas_happy_rhythm", bandId: "ultimate_quokkas", type: "encounter",
    startTurn: 30, endTurn: 46, repeatable: false, priority: 48,
    conditions: {
      eventSeen: "event_ultimate_quokkas_battle",
      lastBattleBandId: "ultimate_quokkas"
    },
    effects: {
      relationAdd: 8,
      addLog: "ultimate quokkasのワラジから、笑顔のまま走るリズムの作り方を聞いた。"
    },
    unlockSkillId: null
  },
  event_rumble_sand_stage_video: {
    id: "event_rumble_sand_stage_video", bandId: "rumble_sand", type: "encounter",
    startTurn: 32, endTurn: 48, repeatable: false, priority: 45,
    conditions: {
      eventSeen: "event_rumble_sand_sns_discover",
      minIndustryRep: 85
    },
    effects: {
      relationAdd: 3,
      addLog: "RUMBLE SANDの大型ステージ映像を見て、巨大な音圧のイメージを掴んだ。"
    },
    unlockSkillId: null
  },
  event_neon_reef_deep_blue_note: {
    id: "event_neon_reef_deep_blue_note", bandId: "neon_reef", type: "encounter",
    startTurn: 34, endTurn: 49, repeatable: false, priority: 45,
    conditions: {
      eventSeen: "event_neon_reef_news_discover",
      minIndustryRep: 90
    },
    effects: {
      relationAdd: 3,
      addLog: "Neon Reefのライブ評から、完成された演出の奥にある静けさを知った。"
    },
    unlockSkillId: null
  }
});

// 既存の対バン選出・集客計算（fame/audience/level/genre/mood）互換の一覧を派生。
const BAND_ROSTER = Object.freeze(Object.values(BAND_DATABASE).map(b => Object.freeze({
  ...b,
  level: b.internalLv,
  genre: (b.genres || []).join(" / "),
  mood: b.description
})));

function rosterBands() { return bandSystemOn() ? BAND_ROSTER : RIVAL_BANDS; }
function bandById(id) { return BAND_DATABASE[id] || null; }
function initialPartnerBandId() { return bandSystemOn() ? "triple_arrows" : "paper_moon"; }

// ライブハウスUNDERの注記をTriple Arrows表記へ（フラグONのときだけ）。
if (bandSystemOn()) {
  const underVenue = VENUES.find(v => v.id === "garage");
  if (underVenue) underVenue.note = "小箱。序盤でも成功しやすい。Triple Arrowsのホーム";
}

/* ------------------------------------------------------------------
 * セーブ状態（bandBook / ownedBandSkills）と正規化
 * ------------------------------------------------------------------ */
function normalizeBandSystemState() {
  if (!state) return;
  if (!state.bandBook || typeof state.bandBook !== "object") state.bandBook = {};
  const bb = state.bandBook;
  if (!bb.bands || typeof bb.bands !== "object") bb.bands = {};
  if (!bb.seenEvents || typeof bb.seenEvents !== "object") bb.seenEvents = {};
  if (!bb.flags || typeof bb.flags !== "object") bb.flags = {};
  if (typeof bb.lastBattle === "undefined") bb.lastBattle = null;
  if (typeof bb.lastStoryEventTurn === "undefined") bb.lastStoryEventTurn = 0;
  if (!state.ownedBandSkills || typeof state.ownedBandSkills !== "object") state.ownedBandSkills = {};
  Object.entries(state.ownedBandSkills).forEach(([id, rec]) => {
    if (!rec || typeof rec !== "object") { state.ownedBandSkills[id] = { level: 1, sources: [], obtainedTurn: state.turn || 1 }; return; }
    if (!Number.isFinite(Number(rec.level)) || rec.level < 1) rec.level = 1;
    if (!Array.isArray(rec.sources)) rec.sources = [];
  });
  state.saveSchemaVersion = Math.max(Number(state.saveSchemaVersion || 1), 2);
  if (typeof state.bandBookDetail === "undefined") state.bandBookDetail = null;
  if (typeof state.bandBookDetailTab === "undefined") state.bandBookDetailTab = "profile";
  if (bandSystemOn()) migrateLegacyPaperMoonState();
}

// 旧セーブのPaper Moon Kids痕跡をTriple Arrowsへ読み替える（削除ではなく統合）。
function migrateLegacyPaperMoonState() {
  const bb = state.bandBook;
  if (bb.pmkMigrated) return;
  const rel = state.rivalRelations || {};
  if (typeof rel.paper_moon === "number") {
    rel.triple_arrows = Math.max(Number(rel.triple_arrows || 0), Number(rel.paper_moon || 0));
    delete rel.paper_moon;
  }
  const remap = list => (list || []).forEach(e => {
    if (Array.isArray(e?.invitedBandIds) && e.invitedBandIds.includes("paper_moon")) {
      e.invitedBandIds = [...new Set(e.invitedBandIds.map(id => id === "paper_moon" ? "triple_arrows" : id))];
    }
  });
  remap(state.liveEvents);
  remap(state.liveOffers);
  // 旧8T招待フラグが立っていれば、招待メールイベントは発火済み扱いにする。
  if (state.storyFlags?.paperMoonInvite8 && !bb.seenEvents.event_triple_arrows_invite_live) {
    bb.seenEvents.event_triple_arrows_invite_live = state.turn || 1;
    bb.flags.flag_triple_arrows_invite_available = true;
  }
  // 旧セーブで既にPMKと交流済み（初回打ち上げ相当+18）なら、初回打ち上げイベントも発火済み扱い。
  if (Number(rel.triple_arrows || 0) >= 15) {
    bb.seenEvents.event_triple_arrows_first_after_party = bb.seenEvents.event_triple_arrows_first_after_party || (state.turn || 1);
    bb.flags.flag_triple_arrows_met = true;
    const entry = bandEntry("triple_arrows");
    if (entry.state === "unknown" || entry.state === "discovered") entry.state = "met";
    if (!entry.firstMetTurn) entry.firstMetTurn = state.turn || 1;
  }
  bb.pmkMigrated = true;
}

const BAND_STATE_ORDER = { unknown: 0, discovered: 1, met: 2, skill_unlocked: 3 };
function bandBookRef() {
  if (!state.bandBook || typeof state.bandBook !== "object") normalizeBandSystemState();
  return state.bandBook;
}
function bandEntry(id) {
  const bb = bandBookRef();
  if (!bb.bands[id] || typeof bb.bands[id] !== "object") {
    bb.bands[id] = { state: "unknown", battleCount: 0, firstMetTurn: null };
  }
  const e = bb.bands[id];
  if (!BAND_STATE_ORDER.hasOwnProperty(e.state)) e.state = "unknown";
  if (typeof e.battleCount !== "number") e.battleCount = 0;
  return e;
}
function promoteBandState(id, next) {
  const e = bandEntry(id);
  if ((BAND_STATE_ORDER[next] || 0) > (BAND_STATE_ORDER[e.state] || 0)) e.state = next;
  return e;
}
function bandSeenEvents() { return bandBookRef().seenEvents; }
function bandFlags() { return bandBookRef().flags; }
function bandRelation(id) {
  return clamp(Math.round(relationshipWithBand(id)), BAND_TUNING.relationCapMin, BAND_TUNING.relationCapMax);
}
function bandRelationStage(rel) {
  if (rel >= 60) return { key: "best", label: "盟友", cls: "good" };
  if (rel >= 30) return { key: "friend", label: "仲間", cls: "good" };
  if (rel >= 15) return { key: "known", label: "知り合い", cls: "warn" };
  if (rel >= 1) return { key: "faced", label: "顔見知り", cls: "warn" };
  return { key: "none", label: "未交流", cls: "" };
}
function bandStateLabel(stateKey) {
  return ({ unknown: "未遭遇", discovered: "図鑑登録", met: "交流中", skill_unlocked: "スキル獲得" }[stateKey] || "未遭遇");
}
function discoverBand(id) {
  if (!bandById(id)) return null;
  const e = bandEntry(id);
  if (e.state === "unknown") e.state = "discovered";
  return e;
}
function touchBandMet(id) {
  if (!bandById(id)) return null;
  const e = bandEntry(id);
  discoverBand(id);
  promoteBandState(id, "met");
  if (!e.firstMetTurn) e.firstMetTurn = state.turn || 1;
  return e;
}
function bandDiscoveredCount() {
  return Object.keys(BAND_DATABASE).filter(id => bandEntry(id).state !== "unknown").length;
}

/* ------------------------------------------------------------------
 * 交流スキル：獲得・レベル・効果
 * ------------------------------------------------------------------ */
function bandSkillById(id) { return BAND_SKILL_DATABASE[id] || null; }
function ownedBandSkillRec(id) { return (state.ownedBandSkills || {})[id] || null; }
function bandSkillLevel(id) { return Number(ownedBandSkillRec(id)?.level || 0); }

// v0.3.71: 交流スキルの統合一覧（効果あり/記録のみを分けて表示）
function renderBandSkillList() {
  const owned = state.ownedBandSkills || {};
  const all = Object.values(BAND_SKILL_DATABASE).filter(sk => sk.id !== "diamond_shine");
  const row = sk => {
    const rec = owned[sk.id];
    const lvMax = sk.effectiveMaxLevelInCurrentData || sk.maxLevel || 1;
    const lv = rec ? (sk.type === "common" ? ` Lv${rec.level}/${lvMax}` : "") : "";
    const src = rec && Array.isArray(rec.sources) ? rec.sources.map(id => bandById(id)?.name || id).join("・") : "";
    if (!rec) return `<div class="skill-row locked"><b>？？？</b><span class="badge">${sk.type === "common" ? "汎用" : "固有"}</span><small>未獲得の交流スキル。対バンや打ち上げで交流を深めると手に入る。</small></div>`;
    return `<div class="skill-row owned"><b>${escapeHtml(sk.name)}${lv}</b><span class="badge ${sk.effectImplemented ? "good" : ""}">${sk.effectImplemented ? "効果あり" : "記録のみ"}</span><small>${escapeHtml(sk.description)}</small><small>入手元：${escapeHtml(src || "-")}</small></div>`;
  };
  const impl = all.filter(sk => sk.effectImplemented);
  const rest = all.filter(sk => !sk.effectImplemented);
  const ownedCount = Object.keys(owned).length;
  return `<div class="skill-panel"><div class="section-title"><h2>交流スキル</h2><span class="badge good">${ownedCount}件所持</span></div>
    <small>他バンドとの交流で獲得。汎用スキルは別の供給バンドと交流30以上でLvが上がる（上限到達後は交流+5に変換）。</small>
    <h3>効果あり</h3>${impl.map(row).join("")}
    <h3>記録のみ（現バージョンでは数値効果なし）</h3>${rest.map(row).join("")}
  </div>`;
}
function grantBandSkill(skillId, sourceBandId, reason = "", opts = {}) {
  if (!bandSystemOn()) return false;
  const sk = bandSkillById(skillId);
  if (!sk) return false;
  if (!state.ownedBandSkills || typeof state.ownedBandSkills !== "object") state.ownedBandSkills = {};
  const owned = state.ownedBandSkills;
  let rec = owned[skillId];
  let levelText = "";
  if (sk.type === "common") {
    if (!rec) {
      rec = owned[skillId] = { level: 1, sources: [sourceBandId], obtainedTurn: state.turn || 1 };
      levelText = " Lv1";
    } else {
      if (!Array.isArray(rec.sources)) rec.sources = [];
      if (rec.sources.includes(sourceBandId)) return false;
      if (rec.level >= (sk.maxLevel || 1)) {
        // 上限超過：交流値へ変換
        setRelationshipWithBand(sourceBandId, relationshipWithBand(sourceBandId) + BAND_TUNING.overflowRelationGain);
        rec.sources.push(sourceBandId);
        log(`${sk.name}はすでに上限Lv。${bandById(sourceBandId)?.name || ""}との交流値+${BAND_TUNING.overflowRelationGain}に変換された。`, "info");
        return false;
      }
      rec.level += 1;
      rec.sources.push(sourceBandId);
      levelText = ` Lv${rec.level}`;
    }
  } else {
    if (rec) return false;
    rec = owned[skillId] = { level: 1, sources: [sourceBandId], obtainedTurn: state.turn || 1 };
  }
  promoteBandState(sourceBandId, "skill_unlocked");
  const notImpl = sk.effectImplemented ? "" : "\n※現バージョンでは獲得記録のみ（数値効果なし）。";
  log(`交流スキル獲得：${sk.name}${levelText}${reason ? `（${reason}）` : ""}`, "event");
  if (!opts.silentPopup) showEventPopup("交流スキル獲得", `${sk.name}${levelText}\n${sk.description}${notImpl}`, "rare", v043eIcon("spark"));
  return true;
}

// 汎用スキル：供給源バンドとの交流値がしきい値以上で獲得/レベルアップ。
function checkCommonSkillAcquisition() {
  if (!bandSystemOn()) return;
  Object.values(BAND_SKILL_DATABASE).forEach(sk => {
    if (sk.type !== "common" || sk.obtainableIn !== "0.3.60") return;
    (sk.sourceBandIds || []).forEach(src => {
      const entry = bandEntry(src);
      if (entry.state === "unknown" || entry.state === "discovered") return;
      if (bandRelation(src) < BAND_TUNING.commonSkillRelationNeed) return;
      const rec = ownedBandSkillRec(sk.id);
      if (rec && Array.isArray(rec.sources) && rec.sources.includes(src)) return;
      grantBandSkill(sk.id, src, `${bandById(src)?.name || src}との交流${BAND_TUNING.commonSkillRelationNeed}以上`);
    });
  });
}

// 効果ヘルパー（v0.3.60でONの分だけ）
function bandSkillAfterPartyBonusPct() {
  if (!bandSystemOn()) return 0;
  let pct = 0;
  if (bandSkillLevel("three_basics") >= 1 && bandSkillById("three_basics").effectImplemented) {
    pct += Number(bandSkillById("three_basics").params?.afterPartySuccessAddPct || 5);
  }
  const heal = bandSkillById("healing_character");
  if (heal?.effectImplemented && bandSkillLevel("healing_character") >= 1) {
    pct += Math.min(bandSkillLevel("healing_character") * Number(heal.params?.afterPartySuccessAddPctPerLevel || 2), Number(heal.params?.maxTotalAddPct || 5));
  }
  return Math.min(pct, BAND_TUNING.afterPartyBonusCapPct);
}
function bandSkillInfluencerPct() {
  if (!bandSystemOn()) return 0;
  const sk = bandSkillById("influencer");
  if (!sk?.effectImplemented) return 0;
  return Math.min(bandSkillLevel("influencer") * Number(sk.params?.snsBoostAddPctPerLevel || 2), Number(sk.params?.maxTotalAddPct || 5));
}
function bandSkillRivalryExposureBonus(rank) {
  if (!bandSystemOn()) return 0;
  const sk = bandSkillById("rivalry_spirit");
  if (!sk?.effectImplemented) return 0;
  if (!["S", "A"].includes(rank)) return 0;
  return Math.min(bandSkillLevel("rivalry_spirit"), 3);
}
function bandSkillFatigueReducePct() {
  if (!bandSystemOn()) return 0;
  const sk = bandSkillById("lingering_echo");
  if (!sk?.effectImplemented) return 0;
  return Math.min(bandSkillLevel("lingering_echo") * Number(sk.params?.fatigueReducePctPerLevel || 1), Number(sk.params?.maxTotalReducePct || 3));
}

/* ------------------------------------------------------------------
 * イベント条件評価・発火
 * ------------------------------------------------------------------ */
function rankToBattleResult(rank) {
  if (rank === "S") return "great_success";
  if (rank === "A") return "success";
  return "normal";
}
const BATTLE_RESULT_ORDER = { normal: 0, success: 1, great_success: 2 };

const BALANCE_BASELINE_PROFILES = Object.freeze({
  under_border: {
    label: "30T UNDER目安", turn: 30, fans: 70, fame: 70, industry: 60, trust: 42, fatigue: 28,
    songs: 5, representative: 1, fresh: 1, lastRank: "B", lastTotal: 72
  },
  grand_border: {
    label: "50T GRAND最低条件", turn: 50, fans: 180, fame: 135, industry: 118, trust: 55, fatigue: 25,
    songs: 7, representative: 3, fresh: 1, lastRank: "A", lastTotal: 80
  },
  grand_strong: {
    label: "50T GRAND注目枠目安", turn: 50, fans: 230, fame: 180, industry: 165, trust: 68, fatigue: 18,
    songs: 8, representative: 4, fresh: 1, lastRank: "S", lastTotal: 84
  }
});

function originalSongCountForBalance() {
  return (state.songs || []).filter(s => !s.isCover).length;
}
function representativeSongCountForBalance() {
  return (state.songs || []).filter(s => hasTag(s, "代表曲候補") || hasTag(s, "定番")).length;
}
function freshSongCountForBalance() {
  return (state.songs || []).filter(s => !s.isCover && (s.livePlays || 0) <= 1 && (state.turn || 1) - (s.createdTurn || 0) <= 10).length;
}
function grandConditionSnapshot() {
  const last = (state.liveResultHistory || [])[state.liveResultHistory.length - 1] || null;
  const rows = [
    { label:"直近A評価以上", ok:!!last && ["A","S"].includes(last.rank), value:last ? last.rank : "なし", target:"A以上" },
    { label:"直近総合80以上", ok:!!last && Number(last.total || 0) >= 80, value:last ? val(last.total || 0) : "なし", target:"80" },
    { label:"ファン180以上", ok:Number(state.band?.fans || 0) >= 180, value:Number(state.band?.fans || 0), target:"180" },
    { label:"知名度135以上", ok:Number(state.band?.fame || 0) >= 135, value:Number(state.band?.fame || 0), target:"135" },
    { label:"業界評価118以上", ok:Number(state.band?.industry || 0) >= 118, value:Number(state.band?.industry || 0), target:"118" },
    { label:"オリジナル7曲以上", ok:originalSongCountForBalance() >= 7, value:`${originalSongCountForBalance()}曲`, target:"7曲" },
    { label:"代表/定番3曲以上", ok:representativeSongCountForBalance() >= 3, value:`${representativeSongCountForBalance()}曲`, target:"3曲" },
    { label:"新しめ1曲以上", ok:freshSongCountForBalance() >= 1, value:`${freshSongCountForBalance()}曲`, target:"1曲" }
  ];
  return { rows, ok: rows.every(r => r.ok), last };
}
function formatGrandConditionSnapshot() {
  const snap = grandConditionSnapshot();
  const lines = snap.rows.map(r => `${r.ok ? "OK" : "NG"} ${r.label}：${r.value} / 目標${r.target}`);
  return `${snap.ok ? "GRAND最低条件：達成" : "GRAND最低条件：未達"}\n${lines.join("\n")}`;
}

function bandTotalStatusForEvents() {
  const members = (typeof activeMembers === "function" ? activeMembers() : []) || [];
  if (!members.length) return 0;
  return Math.round(avg(members.map(m => avg(Object.values(m.stats || {}).map(Number)))));
}

function evaluateBandEventConditions(ev, opts = {}) {
  const c = ev.conditions || {};
  const bb = bandBookRef();
  if (c.firstLiveDone && (state.liveCount || 0) <= 0) return false;
  if (c.eventSeen && !bb.seenEvents[c.eventSeen]) return false;
  if (c.eventNotSeen && bb.seenEvents[c.eventNotSeen]) return false;
  if (c.hasFlag && !bb.flags[c.hasFlag]) return false;
  if (c.skillNotOwned && ownedBandSkillRec(c.skillNotOwned)) return false;
  if (typeof c.minFans === "number" && Number(state.band?.fans || 0) < c.minFans) return false;
  if (typeof c.minIndustryRep === "number" && Number(state.band?.industry || 0) < c.minIndustryRep) return false;
  if (typeof c.minLastLiveScore === "number") {
    const last = (state.liveResultHistory || [])[state.liveResultHistory.length - 1];
    const liveTotal = Number(state.bandBook?.lastBattle?.total || last?.total || 0);
    if (liveTotal < c.minLastLiveScore) return false;
  }
  if (typeof c.minTotalStatus === "number" && bandTotalStatusForEvents() < c.minTotalStatus) return false;
  if (typeof c.minOriginalSongs === "number" && (state.songs || []).filter(s => !s.isCover).length < c.minOriginalSongs) return false;
  if (c.minBattleCountWithBand) {
    const need = c.minBattleCountWithBand;
    if (bandEntry(need.bandId).battleCount < Number(need.count || 1)) return false;
  }
  if (c.lastBattleBandId) {
    const lb = bb.lastBattle;
    const ids = lb ? (Array.isArray(lb.bandIds) ? lb.bandIds : [lb.bandId]) : [];
    if (!ids.includes(c.lastBattleBandId)) return false;
  }
  if (c.lastBattleResult) {
    const lb = bb.lastBattle;
    if (!lb) return false;
    if ((BATTLE_RESULT_ORDER[lb.result] || 0) < (BATTLE_RESULT_ORDER[c.lastBattleResult] || 0)) return false;
  }
  return true;
}

function bandEventWindowOk(ev, turn = state.turn) {
  return turn >= (ev.startTurn || 1) && turn <= (ev.endTurn || 999);
}

// フェス種・固定ライブがあるターンは、ストーリー系バンドイベントを抑制する。
function isBandEventSuppressedTurn(turn = state.turn, phase = "turnStart") {
  const ev = liveEventForTurn(turn);
  if (!ev) return false;
  const isFesLike = ["band_fes", "corp_fes"].includes(ev.liveType) || /FES|フェス/.test(String(ev.label || ev.name || ""));
  // ターン開始時は固定ライブ/フェスの前に割り込まない。ライブ後・打ち上げ後は通常対バンなら許可し、フェス系だけ抑制する。
  if (phase === "turnStart") return !!(ev.fixed || isFesLike);
  return !!isFesLike;
}

const BAND_EVENT_PHASE_TYPES = {
  turnStart: ["mail_invite", "sns_discover", "encounter", "skill_unlock"],
  postLive: ["encounter", "skill_unlock"],
  afterParty: ["after_party"]
};

function processBandStoryEvents(phase) {
  if (!bandSystemOn() || !state || state.ended) return null;
  const bb = bandBookRef();
  if (bb.lastStoryEventTurn === state.turn) return null; // 1ターン1件まで
  if (isBandEventSuppressedTurn(state.turn, phase)) return null;
  const types = BAND_EVENT_PHASE_TYPES[phase] || [];
  const candidates = Object.values(BAND_EVENT_DATABASE).filter(ev => {
    if (!types.includes(ev.type)) return false;
    if (!bandEventWindowOk(ev)) return false;
    if (!ev.repeatable && bb.seenEvents[ev.id]) return false;
    // 初回打ち上げイベントは初回ライブ直後の専用打ち上げ処理側でのみ消化する。
    // ここで後日の通常打ち上げ候補に混ぜると、CARBONS等のafter_partyイベントを食うため常に除外する。
    if (ev.id === "event_triple_arrows_first_after_party") return false;
    return evaluateBandEventConditions(ev);
  }).sort((a, b) => (b.priority || 0) - (a.priority || 0));
  if (!candidates.length) return null;
  const picked = candidates[0];
  applyBandEventEffects(picked);
  return picked;
}

const BAND_EVENT_TYPE_META = {
  after_party: { title: "打ち上げ交流", icon: "band" },
  mail_invite: { title: "招待メール", icon: "mail" },
  skill_unlock: { title: "交流イベント", icon: "band" },
  encounter: { title: "遭遇", icon: "band" },
  sns_discover: { title: "バンド情報", icon: "book" },
  battle: { title: "対バン", icon: "song" }
};

// バンドイベント→︎ノベルシーンの対応。ここにあるイベントは通常ポップアップの代わりに会話イベントで見せる。
const BAND_EVENT_STORY_MAP = {
  event_triple_arrows_invite_live: "triple_arrows_invite",
  event_shelter_watched_live: "shelter_encounter",
  event_pachi_pachi_first_battle: "pachi_pachi_first_live",
  event_pachi_pachi_second_success: "pachi_pachi_sweetness_unlock",
  event_carbons_after_party_success: "carbons_diamond_rough",
  event_shelter_after_live_talk: "shelter_rock_spirit",
  event_triple_arrows_after_invite_rematch: "triple_arrows_next_arrow",
  event_carbons_return_talk: "carbons_polish_talk",
  event_pachi_pachi_floor_sign: "pachi_pachi_floor_sign",
  event_shelter_backstage_advice: "shelter_backstage_advice",
  event_kiwi_greenroom_talk: "kiwi_greenroom_talk",
  event_magnet_wolf_dirty_riff: "magnet_wolf_dirty_riff",
  event_kaede_acoustic_encounter: "kaede_acoustic_encounter",
  event_kaede_one_phrase: "kaede_one_phrase",
  event_lact_name_drop: "lact_name_drop",
  event_lact_backstage_shadow: "lact_backstage_shadow",
  event_in_bab_fan_pull_talk: "in_bab_fan_pull_talk",
  event_polaris_afterglow_lesson: "polaris_afterglow_lesson",
  event_jack_bomb_blast_check: "jack_bomb_blast_check",
  event_hyper_marmoty_shout_circle: "hyper_marmoty_shout_circle",
  event_ultimate_quokkas_happy_rhythm: "ultimate_quokkas_happy_rhythm",
  event_rumble_sand_stage_video: "rumble_sand_stage_video",
  event_neon_reef_deep_blue_note: "neon_reef_deep_blue_note"
};

function applyBandEventEffects(ev, opts = {}) {
  const bb = bandBookRef();
  bb.seenEvents[ev.id] = state.turn || 1;
  bb.lastStoryEventTurn = state.turn || 1;
  const fx = ev.effects || {};
  if (fx.discoverBandId) discoverBand(fx.discoverBandId);
  if (Number(fx.relationAdd || 0) > 0) {
    setRelationshipWithBand(ev.bandId, relationshipWithBand(ev.bandId) + Number(fx.relationAdd));
    touchBandMet(ev.bandId);
  }
  (fx.setFlags || []).forEach(f => { bb.flags[f] = true; });
  if (fx.addLog) log(fx.addLog, "event");
  let inviteOffer = null;
  if (ev.id === "event_triple_arrows_invite_live") inviteOffer = createTripleArrowsInviteOffer();
  const sceneId = BAND_EVENT_STORY_MAP[ev.id];
  const storyWillPlay = !opts.silentPopup && !!sceneId && novelEventsOn() && !state.activeStoryEvent;
  if (ev.unlockSkillId) grantBandSkill(ev.unlockSkillId, ev.bandId, "交流イベント", { silentPopup: storyWillPlay });
  if (!opts.silentPopup) {
    const storyContext = {
      offerTurn: inviteOffer?.turn || Math.min((state.turn || 1) + 2, (state.maxTurn || 50) - 1),
      bandName: bandById(ev.bandId)?.name || "共演者",
      skillName: ev.unlockSkillId ? (BAND_SKILL_DATABASE[ev.unlockSkillId]?.name || ev.unlockSkillId) : "",
      rank: bandBookRef().lastBattle?.rank || "-"
    };
    const played = storyWillPlay ? startStoryEvent(sceneId, { silent: true, context: storyContext }) : false;
    if (!played) {
      const meta = BAND_EVENT_TYPE_META[ev.type] || { title: "バンドイベント", icon: "song" };
      const bandName = bandById(ev.bandId)?.name || "";
      showEventPopup(meta.title, `${fx.addLog || bandName}\n（バンド図鑑が更新された）`, ev.unlockSkillId ? "rare" : "event", v043eIcon(meta.icon));
    }
  }
  checkCommonSkillAcquisition();
}

// Triple Arrows招待ライブ：メール＋出演オファー（2ターン後開催・storyInvite扱い）。
function createTripleArrowsInviteOffer() {
  state.storyFlags = state.storyFlags || {};
  state.storyFlags.paperMoonInvite8 = true; // 旧導線の二重発火防止も兼ねる
  const offerTurn = Math.min((state.turn || 1) + 2, (state.maxTurn || 50) - 1);
  state.liveOffers = Array.isArray(state.liveOffers) ? state.liveOffers : [];
  const existing = state.liveOffers.find(o => o.id === "story_triple_arrows_invite");
  if (existing) return existing;
  const offer = {
    id: "story_triple_arrows_invite", turn: offerTurn, venueId: "garage",
    liveType: "booking_band", invitedBandIds: ["triple_arrows"],
    accepted: false, expired: false, status: "open",
    createdTurn: state.turn, storyInvite: true
  };
  state.liveOffers.unshift(offer);
  const mailId = addMail("俺たちの企画　参加依頼", `この前のライブ、お疲れ！\nまだ荒削りだけど、お前らきっとすごくなるぜ。\nこの前言ってた企画ライブ、よかったら出てくれよ。\n\nTriple Arrows　タカナシ`, "live_offer", { offerId: offer.id, offerTurn, status: "open", sender: "Triple Arrows　タカナシ", senderBandId: "triple_arrows" });
  offer.mailId = mailId;
  return offer;
}

/* ------------------------------------------------------------------
 * 対バン記録（ライブ結果適用時に呼ぶ）
 * ------------------------------------------------------------------ */
function recordBandBattlesAfterLive(ev, r) {
  if (!bandSystemOn() || !ev) return;
  const ids = (ev.invitedBandIds || []).filter(id => !!bandById(id));
  if (!ids.length) return;
  const bb = bandBookRef();
  const newlyRegistered = [];
  let carbonsFirstBattleNow = false;
  let pachiPachiFirstBattleNow = false;
  ids.forEach(id => {
    const entry = bandEntry(id);
    const firstTime = entry.battleCount === 0;
    if (firstTime && id === "carbons") carbonsFirstBattleNow = true;
    if (firstTime && id === "pachi_pachi") pachiPachiFirstBattleNow = true;
    entry.battleCount += 1;
    const wasUnknown = entry.state === "unknown";
    touchBandMet(id);
    if (firstTime) {
      const be = Object.values(BAND_EVENT_DATABASE).find(e => e.type === "battle" && e.bandId === id && (!e.conditions?.eventSeen || bb.seenEvents[e.conditions.eventSeen]));
      if (be && bandEventWindowOk(be) && !bb.seenEvents[be.id] && evaluateBandEventConditions(be)) {
        bb.seenEvents[be.id] = state.turn;
        const add = Number(be.effects?.relationAdd ?? BAND_TUNING.firstBattleRelationDefault);
        if (add > 0) setRelationshipWithBand(id, relationshipWithBand(id) + add);
        if (be.effects?.addLog) log(be.effects.addLog, "event");
        (be.effects?.setFlags || []).forEach(f => { bb.flags[f] = true; });
      } else {
        setRelationshipWithBand(id, relationshipWithBand(id) + BAND_TUNING.firstBattleRelationDefault);
        log(`${bandById(id).name}と初めて対バンした。`, "event");
      }
      if (wasUnknown || firstTime) newlyRegistered.push(bandById(id).name);
    } else {
      // 2回目以降：リマッチイベントの記録だけ（交流は既存のライブ交流変動に任せる）
      const rematch = Object.values(BAND_EVENT_DATABASE).find(e => e.type === "battle" && e.bandId === id && e.repeatable && e.conditions?.eventSeen);
      if (rematch && bandEventWindowOk(rematch) && evaluateBandEventConditions(rematch) && !bb.seenEvents[rematch.id]) {
        bb.seenEvents[rematch.id] = state.turn;
        if (rematch.effects?.addLog) log(rematch.effects.addLog, "event");
      }
    }
  });
  bb.lastBattle = {
    bandIds: ids.slice(),
    bandId: ids[0],
    result: rankToBattleResult(r.rank),
    rank: r.rank,
    total: Number(r.total || 0),
    turn: state.turn
  };
  // 招待ライブ完了フラグ（Triple Arrowsスキル導線）
  if (ids.includes("triple_arrows") && (ev.storyInvite || ev.offerId === "story_triple_arrows_invite" || ev.offerId === "story_paper_moon_8")) {
    bb.flags.flag_triple_arrows_invite_done = true;
  }
  if (carbonsFirstBattleNow && novelEventsOn()) {
    startStoryEvent("carbons_after_live", { silent: true, context: { rank: r.rank } });
  }
  if (pachiPachiFirstBattleNow && novelEventsOn() && !state.activeStoryEvent) {
    startStoryEvent("pachi_pachi_first_live", { silent: true, context: { rank: r.rank } });
  }
  if (newlyRegistered.length) {
    showEventPopup("バンド図鑑 更新", `図鑑に登録：${newlyRegistered.join(" / ")}\n交流値も少し上がった。詳細は携帯の「図鑑」から。`, "event", v043eIcon("book"));
  }
  checkCommonSkillAcquisition();
}

// 対バン候補として出せるか（フラグON時のみ絞り込み）。
// 交流済み（met以上）は常時候補。未交流はbattle型イベントの出現窓＋条件を満たす間だけ候補。
function bandBookableNow(band) {
  if (!bandSystemOn()) return true;
  if (!bandById(band.id)) return true; // 旧ローステッド予定などの後方互換
  const entry = bandEntry(band.id);
  if (BAND_STATE_ORDER[entry.state] >= BAND_STATE_ORDER.met) return true;
  return Object.values(BAND_EVENT_DATABASE).some(e => {
    if (e.type !== "battle" || e.bandId !== band.id) return false;
    if (!bandEventWindowOk(e)) return false;
    if (e.conditions?.eventSeen && !bandSeenEvents()[e.conditions.eventSeen]) return false;
    return evaluateBandEventConditions(e);
  });
}

/* ------------------------------------------------------------------
 * 図鑑UI
 * ------------------------------------------------------------------ */
function renderBandBookScreen() {
  if (!bandSystemOn()) {
    return `<div class="card"><div class="section-title"><h2>バンド図鑑</h2></div><p><small>この機能は現在オフになっています（ENABLE_BAND_SYSTEM）。</small></p></div>`;
  }
  if (state.bandBookDetail && bandById(state.bandBookDetail)) return renderBandBookDetail(state.bandBookDetail);
  const total = Object.keys(BAND_DATABASE).length;
  const found = bandDiscoveredCount();
  const skills = Object.entries(state.ownedBandSkills || {});
  const skillChips = skills.length
    ? skills.map(([id, rec]) => {
        const sk = bandSkillById(id);
        if (!sk) return "";
        const lv = sk.type === "common" && rec.level > 0 ? ` Lv${rec.level}` : "";
        return `<span class="badge ${sk.effectImplemented ? "good" : ""}">${escapeHtml(sk.name)}${lv}</span>`;
      }).join(" ")
    : `<small>まだ交流スキルはない。他バンドと対バンや打ち上げで交流を深めよう。</small>`;
  const rows = Object.values(BAND_DATABASE).map((b, idx) => renderBandBookRow(b, idx + 1)).join("");
  return `<div class="grid bandbook-grid">
    <div class="card">
      <div class="section-title"><h2>バンド図鑑</h2><span class="badge good">${found}/${total}組</span></div>
      <p><small>対バンや打ち上げで出会った顔ぶれ。仲良くなるほど読める。</small></p>
      <div class="section-title"><h3>獲得した交流スキル</h3><span class="badge">${skills.length}件</span></div>
      <div class="candidate-cloud">${skillChips}</div>
    </div>
    <div class="card">
      <div class="section-title"><h3>登録リスト</h3><span class="badge">タップで詳細</span></div>
      <div class="bandbook-list">${rows}</div>
    </div>
  </div>`;
}

function renderBandBookRow(b, no) {
  const entry = bandEntry(b.id);
  const unknown = entry.state === "unknown";
  const rel = bandRelation(b.id);
  const stage = bandRelationStage(rel);
  const stateBadge = `<span class="badge ${entry.state === "skill_unlocked" ? "good" : entry.state === "met" ? "warn" : ""}">${bandStateLabel(entry.state)}</span>`;
  if (unknown) {
    return `<button class="bandBookRowBtn dict-row bandbook-row unknown" data-band-id="${b.id}">
      <b>No.${no}　？？？</b>${stateBadge}
      <small>まだ出会っていないバンド。</small>
    </button>`;
  }
  return `<button class="bandBookRowBtn dict-row bandbook-row" data-band-id="${b.id}">
    <b>No.${no}　${escapeHtml(b.name)}</b>${stateBadge}${BAND_STATE_ORDER[entry.state] >= 2 ? `<span class="badge ${stage.cls}">${stage.label}</span>` : ""}
    ${renderBandWordmark(b, "sm")}
    <small>${escapeHtml(b.kana)} / ${escapeHtml((b.genres || []).join("・"))}</small>
  </button>`;
}

function renderBandBookDetail(id) {
  const b = bandById(id);
  const entry = bandEntry(id);
  const unknown = entry.state === "unknown";
  const rel = bandRelation(id);
  const stage = bandRelationStage(rel);
  const met = BAND_STATE_ORDER[entry.state] >= BAND_STATE_ORDER.met;
  const activeTab = ["profile", "comment", "lore"].includes(state.bandBookDetailTab) ? state.bandBookDetailTab : "profile";
  const backBtn = `<button id="bandBookBackBtn" class="ghost-btn">←︎ 図鑑一覧へ</button>`;
  if (unknown) {
    return `<div class="card bandbook-detail">
      <div class="section-title"><h2>？？？</h2><span class="badge">未遭遇</span></div>
      <p><small>まだ会っていない。対バンか、ライブハウスの噂待ち。</small></p>
      <div class="modal-actions">${backBtn}</div>
    </div>`;
  }
  const song = b.representativeSong ? escapeHtml(b.representativeSong) : "？？？";
  const repVisible = met && rel >= BAND_TUNING.repNameRelationNeed;
  const repText = repVisible
    ? `${escapeHtml(b.representativeName || "？？？")}（${escapeHtml(b.representativePart || "担当不明")}）`
    : "？？？（交流を深めると分かる）";
  const bandSkillRows = (b.skillIds || []).map(sid => {
    const sk = bandSkillById(sid);
    if (!sk) return "";
    const rec = ownedBandSkillRec(sid);
    if (rec) {
      const lv = sk.type === "common" ? ` Lv${rec.level}` : "";
      return `<div class="dict-row"><b>${escapeHtml(sk.name)}${lv}</b><small>${escapeHtml(sk.description)}${sk.effectImplemented ? "" : "（記録のみ）"}</small></div>`;
    }
    return `<div class="dict-row"><b>？？？</b><small>未獲得の交流スキル。</small></div>`;
  }).join("");
  const metRows = met ? `
    <div class="kv">
      <b>交流状態</b><span>${stage.label}</span>
      <b>対バン回数</b><span>${entry.battleCount}回</span>
      <b>初遭遇</b><span>${entry.firstMetTurn ? `${entry.firstMetTurn}T` : "-"}</span>
      <b>代表</b><span>${repText}</span>
    </div>` : `<p><small>まだ挨拶だけ。対バンか打ち上げで距離が縮まる。</small></p>`;
  const profilePanel = `<div class="bandbook-tab-panel">
    <div class="kv">
      <b>読み</b><span>${escapeHtml(b.kana)}</span>
      <b>ジャンル</b><span>${escapeHtml((b.genres || []).join(" / "))}</span>
      <b>代表曲</b><span>${song}</span>
    </div>
    <p>${escapeHtml(b.description)}</p>
    ${metRows}
    <div class="section-title"><h3>交流スキル</h3><span class="badge">${(b.skillIds || []).length}種</span></div>
    ${bandSkillRows || `<p><small>このバンドの交流スキル情報はまだない。</small></p>`}
  </div>`;
  const lore = bandLoreRecord(id);
  const commentPanel = `<div class="bandbook-tab-panel">
    <div class="section-title"><h3>代表者コメント</h3><span class="badge ${met ? "good" : ""}">${met ? "解放" : "未解放"}</span></div>
    ${met ? `<div class="lore-quote">${escapeHtml(lore.comment || "まだコメントは準備中。")}</div>` : `<div class="empty-panel">出会うと、代表者の一言コメントが読めるようになる。</div>`}
  </div>`;
  const loreItems = Array.isArray(lore.lore) ? lore.lore : [];
  const loreRows = loreItems.length ? loreItems.map((item, idx) => {
    const ok = met && bandLoreUnlocked(item, id);
    const need = item.needRelation ? `交流${item.needRelation}+` : "遭遇";
    const needEvent = item.needEvent ? " / 特定イベント" : "";
    return `<div class="dict-row lore-row ${ok ? "unlocked" : "locked"}"><b>${ok ? escapeHtml(item.title) : `裏話${idx + 1}`}</b><small>${ok ? escapeHtml(item.text) : `未解放：${need}${needEvent}で読める。`}</small></div>`;
  }).join("") : `<div class="empty-panel">このバンドの裏話は今後追加予定。まずはライブやSNSで存在感を見せていく。</div>`;
  const lorePanel = `<div class="bandbook-tab-panel">
    <div class="section-title"><h3>裏話</h3><span class="badge">${loreItems.filter(item => met && bandLoreUnlocked(item, id)).length}/${loreItems.length}</span></div>
    ${loreRows}
  </div>`;
  const panel = activeTab === "comment" ? commentPanel : activeTab === "lore" ? lorePanel : profilePanel;
  return `<div class="card bandbook-detail">
    <div class="section-title"><h2>${escapeHtml(b.name)}</h2><span class="badge ${entry.state === "skill_unlocked" ? "good" : ""}">${bandStateLabel(entry.state)}</span></div>
    ${renderBandWordmark(b, "md")}
    ${renderBandBookTabs(activeTab)}
    ${panel}
    <div class="modal-actions">${backBtn}</div>
  </div>`;
}

// ライブラリ画面用のミニまとめ
function renderBandBookSummaryForLibrary() {
  const total = Object.keys(BAND_DATABASE).length;
  const found = bandDiscoveredCount();
  const recent = Object.values(BAND_DATABASE).filter(b => bandEntry(b.id).state !== "unknown").slice(0, 6)
    .map(b => `<span class="badge">${escapeHtml(b.name)}</span>`).join(" ");
  return `<p><small>出会ったバンド：${found}/${total}組</small></p>
    <div class="candidate-cloud">${recent || `<small>まだ登録なし。対バンで出会おう。</small>`}</div>
    <button class="jumpTabBtn" data-view="bandbook">バンド図鑑を開く</button>`;
}

// Band directory flag-on view: Lv/rank/raw values stay hidden.
function renderBandDirectoryV060() {
  const metBands = BAND_ROSTER.filter(b => BAND_STATE_ORDER[bandEntry(b.id).state] >= BAND_STATE_ORDER.met);
  const discovered = BAND_ROSTER.filter(b => bandEntry(b.id).state === "discovered");
  const unknownCount = BAND_ROSTER.length - metBands.length - discovered.length;
  const row = b => {
    const rel = bandRelation(b.id);
    const stage = bandRelationStage(rel);
    const power = popularity() + Number(state.band?.industry || 0) * 0.7 + Number(state.band?.trust || 0);
    const canInvite = bandBookableNow(b) && relationshipWithBand(b.id) > -25 && (b.fame <= power + 55 + Math.max(0, rel));
    const next = rivalBandUpcomingText(b.id);
    return `<div class="rival-band-card dict-row ${canInvite ? "" : "locked"}">
      <b>${escapeHtml(b.name)}</b><span class="badge ${stage.cls}">${stage.label}</span><span class="badge ${canInvite ? "good" : "warn"}">${canInvite ? "対バン候補" : "今は遠い"}</span>
      <small>${escapeHtml(b.genre)}</small>
      <small>今後:${escapeHtml(next)}</small>
    </div>`;
  };
  return `<div class="rival-band-list grouped">
    <div class="rival-band-tier"><h3>交流のあるバンド</h3>${metBands.map(row).join("") || `<p><small>まだ交流したバンドはいない。対バンや打ち上げで出会おう。</small></p>`}</div>
    ${discovered.length ? `<div class="rival-band-tier"><h3>名前だけ知っているバンド</h3>${discovered.map(row).join("")}</div>` : ""}
    ${unknownCount > 0 ? `<p><small>未遭遇のバンド：？？？ ×${unknownCount}</small></p>` : ""}
    <button class="jumpTabBtn" data-view="bandbook">バンド図鑑を開く</button>
  </div>`;
}

/* ------------------------------------------------------------------
 * 開発用：DB参照整合チェック（consoleのみ、ゲーム進行に影響なし）
 * ------------------------------------------------------------------ */
function validateBandDatabases() {
  try {
    const issues = [];
    Object.values(BAND_DATABASE).forEach(b => (b.skillIds || []).forEach(sid => {
      if (!BAND_SKILL_DATABASE[sid]) issues.push(`band ${b.id} -> missing skill ${sid}`);
    }));
    Object.values(BAND_SKILL_DATABASE).forEach(sk => (sk.sourceBandIds || []).forEach(bid => {
      if (!BAND_DATABASE[bid]) issues.push(`skill ${sk.id} -> missing band ${bid}`);
    }));
    Object.values(BAND_EVENT_DATABASE).forEach(e => {
      if (!BAND_DATABASE[e.bandId]) issues.push(`event ${e.id} -> missing band ${e.bandId}`);
      if (e.unlockSkillId && !BAND_SKILL_DATABASE[e.unlockSkillId]) issues.push(`event ${e.id} -> missing skill ${e.unlockSkillId}`);
      if (e.startTurn > e.endTurn) issues.push(`event ${e.id} -> bad window`);
    });
    Object.keys(BAND_DATABASE).forEach(id => {
      const lore = BAND_LORE_DATABASE[id];
      if (!lore) issues.push(`band ${id} -> missing lore record`);
      (lore?.lore || []).forEach(item => { if (!item.id || !item.title || !item.text) issues.push(`lore ${id} -> incomplete entry`); });
    });
    if (issues.length) console.warn("[BAND_DB VALIDATION]", issues);
  } catch (e) { /* 検証失敗はゲームに影響させない */ }
}
if (bandSystemOn()) validateBandDatabases();

/* ================== バンドシステムここまで ================== */

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
function rivalById(id) { return rosterBands().find(b => b.id === id) || RIVAL_BANDS.find(b => b.id === id) || BAND_ROSTER.find(b => b.id === id) || null; }
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
  const pool = rosterBands()
    .filter(b => relationshipWithBand(b.id) > -25 && (b.fame <= power + 55 || relationshipWithBand(b.id) >= 20))
    .filter(b => bandBookableNow(b))
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
function addSnsPost(author, body, mood="normal", bandId=null) {
  state.snsPosts = Array.isArray(state.snsPosts) ? state.snsPosts : [];
  state.snsPosts.unshift({ id:`sns_${Date.now()}_${Math.floor(Math.random()*9999)}`, turn: state.turn, author, body, mood, bandId });
  state.snsPosts = state.snsPosts.slice(0, 50);
}

function addSnsPostOnce(key, author, body, mood="world", bandId=null) {
  state.snsWorldSeen = state.snsWorldSeen && typeof state.snsWorldSeen === "object" ? state.snsWorldSeen : {};
  if (!key || state.snsWorldSeen[key]) return false;
  state.snsWorldSeen[key] = state.turn || 1;
  addSnsPost(author, body, mood, bandId);
  return true;
}
function bandSnsVoice(bandId) {
  return ({
    triple_arrows: { author:"@triple_arrows", body:"ライブハウスの床って、下手でも本気ならちゃんと鳴るんだよな。" },
    carbons: { author:"@carbons_noise", body:"音作りは逃げ道じゃない。伝えたいものを削って残す作業だ。" },
    pachi_pachi: { author:"@pachi_pachi", body:"客席が一回でも手を上げたら、その夜は少し勝ち。" },
    shelter: { author:"@shelter_staff", body:"今日も、知らないバンドがひとつ名前を置いていった。" },
    kiwi: { author:"@kiwi_room", body:"楽屋の空気って、演奏より先にバンドの形が出る気がする。" },
    magnet_wolf: { author:"@magnet_wolf", body:"綺麗に鳴らすより、刺さる音を鳴らせ。" },
    kaede: { author:"@kaede_note", body:"伸びてるバンドは、反省の言葉が具体的。そこが面白い。" },
    lact: { author:"@lact_info", body:"GRANDの名前が近づくほど、地下の音はごまかせなくなる。" }
  }[bandId] || null);
}
function maybeSeedWorldReactionPosts() {
  if (!state || !Array.isArray(state.snsPosts)) return;
  const t = state.turn || 1;
  if (t >= 3 && !state.snsWorldSeen?.first_scene) addSnsPostOnce("first_scene", "@livehouse_staff", "最近、ガレージ周りで新しいバンドが動き出してるらしい。", "world");
  if (t >= 28 && t < 30) addSnsPostOnce("under_countdown", "@under_fes_watch", "UNDER FES前、ライブハウスの掲示板が少しだけ騒がしくなってきた。", "fes");
  if (t >= 31) addSnsPostOnce("after_under_scene", "@scene_report", "UNDERを越えたバンドの名前は、次のブッキングで少しだけ見られ方が変わる。", "world");
  if (t >= 44 && t < 50) {
    addSnsPostOnce("grand_lact_shadow", "@fes_watch", "GRAND UNDER FESの話題に、今年もLACTの名前が出ている。遠いけど、同じタイムラインにいる。", "lact");
    addSnsPostOnce("grand_countdown", "@underground_digest", "GRAND前のこの時期、定番曲を持っているバンドはやっぱり強い。", "fes");
  }
  const discovered = Object.entries((state.bandBook || {}).bands || {}).filter(([id, e]) => e && e.state && e.state !== "unknown").map(([id]) => id);
  discovered.slice(0, 3).forEach(id => {
    const voice = bandSnsVoice(id);
    if (voice) addSnsPostOnce(`band_voice_${id}`, voice.author, voice.body, "band", id);
  });
}
function addLiveWorldReactionPosts(result, setlist, ev) {
  const rank = result?.rank || "-";
  const bandName = state.band?.name || "名無しの地下バンド";
  const firstSong = setlist?.[0]?.title || "1曲目";
  const keyBase = `live_${state.turn}_${rank}_${result?.liveEventId || ev?.id || "live"}`;
  if (["S","A"].includes(rank)) addSnsPostOnce(`${keyBase}_good`, "@listener_random", `${bandName}、${firstSong}から空気変わった。次も見たい。`, "reaction");
  if (["D","E"].includes(rank)) addSnsPostOnce(`${keyBase}_rough`, "@livehouse_note", `${bandName}、まだ荒い。でも荒さの中に残るフレーズはあった。`, "reaction");
  invitedBandsForEvent(ev).slice(0, 2).forEach(b => {
    const voice = bandSnsVoice(b.id);
    if (voice) addSnsPostOnce(`${keyBase}_band_${b.id}`, voice.author, voice.body, "band", b.id);
  });
  const label = String(ev?.label || currentLiveName() || "");
  if (state.turn === 50 || label.includes("GRAND")) {
    addSnsPostOnce(`${keyBase}_lact`, "@fes_watch", "GRANDの袖、LACTのリハ音が一瞬だけ漏れた。あの圧の横で鳴らす夜が来た。", "lact");
    addSnsPostOnce(`${keyBase}_grand`, "@underground_digest", `${bandName}、GRAND UNDER FES本番。地下から上がってきた音が、どこまで届くか。`, "fes");
  }
}
function mailSenderIcon(kind="info") {
  return ({ live_offer:"◆︎", fan_mail:"✉︎", member:"●︎", info:"▪︎", warn:"⚠︎" }[kind] || "▪︎");
}
function mailKindLabel(kind="info") {
  return ({ live_offer:"出演依頼", fan_mail:"ファン", member:"候補者", info:"通知", warn:"注意" }[kind] || "通知");
}

const DATA = {
  player: {
    id: "player",
    portraitId: "player",
    name: "あなた",
    part: "Vo/Gt",
    mainInstrument: "vocal",
    subInstrument: "guitar",
    mainGenre: "パンク",
    secondMainGenres: ["ロック", "ポップ"],
    subGenres: ["青春パンク", "メロディックパンク", "オルタナロック"],
    growthType: "安定型",
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
  supportOptions: []};

// 旧v0.2.1: 仮キャラ退避ブロック。
// v0.3.61以降は下部の MEMBER_DATABASE で DATA.candidateCharacters を上書きするため、
// このブロックの「（仮）」候補や他バンド代表キャラは通常募集には出ない。
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



// v0.3.61-member-draft: 正式加入候補データ草案。
// 旧「（仮）」候補や他バンド代表キャラ混入を避けるため、ここで候補プールを上書きする。
// defaultName/name は苗字のみ・名前のみの汎用カタカナ。加入時にプレイヤーが表示名を変更できる。
const MEMBER_GROWTH_TYPE_DATABASE = Object.freeze({
  "技術型": { focus: ["technique"], curve: "normal", note: "練習で演奏技術が伸びやすい" },
  "センス型": { focus: ["sense", "charisma"], curve: "normal", note: "曲の個性・表現が伸びやすい" },
  "メンタル型": { focus: ["mental", "stamina"], curve: "stable", note: "疲労や本番のブレに強い" },
  "カリスマ型": { focus: ["charisma", "sense"], curve: "burst", note: "ファン反応とフロント性能が伸びやすい" },
  "リズム型": { focus: ["rhythm", "technique"], curve: "normal", note: "テンポ・安定感を支えやすい" },
  "協調性型": { focus: ["teamwork", "mental"], curve: "stable", note: "打ち上げ・バンド安定に寄与しやすい" },
  "体力型": { focus: ["stamina", "rhythm"], curve: "early", note: "疲労に強く序盤から扱いやすい" },
  "知識型": { focus: ["knowledge", "technique"], curve: "normal", note: "作曲・アレンジ寄り" },
  "万能型": { focus: ["stamina", "technique", "knowledge", "sense", "mental", "teamwork", "rhythm", "charisma"], curve: "normal", note: "全体的に少しずつ伸びる" },
  "安定型": { focus: ["teamwork", "mental", "rhythm"], curve: "stable", note: "突出しないが崩れにくい" },
  "序盤型": { focus: ["technique", "rhythm", "stamina"], curve: "early", note: "序盤に伸びやすく、後半は控えめ" },
  "爆発型": { focus: ["sense", "charisma", "rhythm"], curve: "burst", note: "ライブで伸びやすいがムラがある" },
  "晩成型": { focus: ["sense", "technique"], curve: "late", note: "加入直後より育成後に強い" }
});

const MEMBER_STAT_KEYS = Object.freeze(["stamina", "technique", "knowledge", "sense", "mental", "teamwork", "rhythm", "charisma"]);
const DEFAULT_MEMBER_GROWTH_TYPE = "安定型";

function memberGrowthTypeKey(member) {
  const key = String(member?.growthType || "").trim();
  return MEMBER_GROWTH_TYPE_DATABASE[key] ? key : DEFAULT_MEMBER_GROWTH_TYPE;
}
function memberGrowthTypeInfo(member) {
  return MEMBER_GROWTH_TYPE_DATABASE[memberGrowthTypeKey(member)] || MEMBER_GROWTH_TYPE_DATABASE[DEFAULT_MEMBER_GROWTH_TYPE];
}
function memberGrowthFocusStats(member) {
  const info = memberGrowthTypeInfo(member);
  return (info.focus || []).filter(k => MEMBER_STAT_KEYS.includes(k));
}
function memberGrowthCurveMultiplier(member, source="practice") {
  const curve = memberGrowthTypeInfo(member).curve || "normal";
  const turn = Number(state?.turn || 1);
  if (curve === "early") {
    if (turn <= 15) return 1.12;
    if (turn <= 30) return 1.04;
    return 0.90;
  }
  if (curve === "late") {
    if (turn < 20) return 0.92;
    if (turn < 35) return 1.04;
    return 1.20;
  }
  if (curve === "stable") return source === "fatigue" ? 0.96 : 1.04;
  return 1.0;
}
function memberGrowthStatMultiplier(member, stat, source="practice") {
  const type = memberGrowthTypeKey(member);
  const focus = memberGrowthFocusStats(member);
  let mult = memberGrowthCurveMultiplier(member, source);
  if (focus.includes(stat)) mult += type === "万能型" ? 0.05 : 0.14;
  if (type === "爆発型") {
    if (Math.random() < (source === "live" ? 0.22 : 0.14)) mult += 0.45;
    else if (Math.random() < 0.10) mult -= 0.18;
  }
  return clamp(mult, 0.65, 1.75);
}
function scaledMemberStatGain(baseGain, member, stat, source="practice") {
  const base = Number(baseGain || 0);
  if (base <= 0) return 0;
  const exact = base * memberGrowthStatMultiplier(member, stat, source);
  let gain = Math.floor(exact);
  if (Math.random() < (exact - gain)) gain += 1;
  return Math.max(1, gain);
}
function applyMemberStatGrowth(member, stat, baseGain, source="practice") {
  if (!member || !member.stats || !MEMBER_STAT_KEYS.includes(stat)) return 0;
  const before = Number(member.stats[stat] || 1);
  const gain = scaledMemberStatGain(baseGain, member, stat, source);
  member.stats[stat] = clamp(before + gain, 1, 99);
  return Math.round(member.stats[stat] - before);
}
function maybeApplyFocusedGrowth(member, source="practice", baseGain=1, chance=0.35) {
  const focus = memberGrowthFocusStats(member);
  if (!focus.length || Math.random() >= chance) return null;
  const stat = focus[rand(0, focus.length - 1)];
  // v0.3.73: 練習/ライブのベース成長に含まれないステ（センス・知識・協調・体力）は
  // focused成長でしか伸びないため量を+1し、重点タイプ間の非対称を緩和する。
  const BASE_GROWTH_STATS = ["technique", "rhythm", "mental", "charisma"];
  const adjusted = BASE_GROWTH_STATS.includes(stat) ? baseGain : baseGain + 1;
  const gain = applyMemberStatGrowth(member, stat, adjusted, source);
  return gain > 0 ? { stat, gain } : null;
}
function normalizeMemberGrowthType(member) {
  if (!member) return;
  if (!member.stats || typeof member.stats !== "object") member.stats = {};
  MEMBER_STAT_KEYS.forEach(k => { member.stats[k] = clamp(Number(member.stats[k] || 1), 1, 99); });
  if (MEMBER_GROWTH_TYPE_DATABASE[member.growthType]) return;
  const latest = (DATA?.candidateCharacters || []).find(c => c.id === member.id);
  member.growthType = latest?.growthType || (member.id === "player" ? "安定型" : DEFAULT_MEMBER_GROWTH_TYPE);
}
function growthTypeSummary(member) {
  const key = memberGrowthTypeKey(member);
  const info = memberGrowthTypeInfo(member);
  const focus = memberGrowthFocusStats(member).map(statLabel).join("・") || "全体";
  return `${key}：${info.note} / 重点 ${focus}`;
}

const MEMBER_DATABASE = Object.freeze([
  {
    "id": "member_mizuno",
    "defaultName": "ミズノ",
    "name": "ミズノ",
    "canRename": true,
    "part": "Vo",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "vocal",
    "mainGenre": "ロック",
    "secondMainGenres": [
      "ポップ",
      "パンク"
    ],
    "subGenres": [
      "ギターロック",
      "バラードロック",
      "ポップパンク"
    ],
    "weakMainGenres": [
      "メタル"
    ],
    "weakSubGenres": [
      "スクリーモ"
    ],
    "stats": {
      "stamina": 40,
      "technique": 38,
      "knowledge": 36,
      "sense": 54,
      "mental": 52,
      "teamwork": 42,
      "rhythm": 40,
      "charisma": 62
    },
    "instruments": {
      "vocal": {
        "mark": "◎",
        "lv": 58,
        "cap": 84,
        "potentialCap": 92,
        "growth": 1.12
      },
      "chorus": {
        "mark": "○",
        "lv": 44,
        "cap": 72,
        "potentialCap": 84,
        "growth": 0.95
      },
      "guitar": {
        "mark": "△",
        "lv": 20,
        "cap": 48,
        "potentialCap": 70,
        "growth": 0.7,
        "hiddenUpgrade": true
      }
    },
    "growthType": "カリスマ型",
    "joinDifficulty": "低",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "王道ボーカル候補。歌声とカリスマで序盤ライブを支える。",
    "replaceNote": "王道ボーカル候補。歌声とカリスマで序盤ライブを支える。"
  },
  {
    "id": "member_yuto",
    "defaultName": "ユウト",
    "name": "ユウト",
    "canRename": true,
    "part": "Vo",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "male",
    "mainInstrument": "vocal",
    "mainGenre": "パンク",
    "secondMainGenres": [
      "ロック",
      "メタル"
    ],
    "subGenres": [
      "青春パンク",
      "メロディックパンク",
      "ハードロック"
    ],
    "weakMainGenres": [
      "クラシック"
    ],
    "weakSubGenres": [
      "シンフォニックメタル"
    ],
    "stats": {
      "stamina": 48,
      "technique": 40,
      "knowledge": 32,
      "sense": 44,
      "mental": 60,
      "teamwork": 42,
      "rhythm": 44,
      "charisma": 52
    },
    "instruments": {
      "vocal": {
        "mark": "◎",
        "lv": 56,
        "cap": 82,
        "potentialCap": 90,
        "growth": 1.08
      },
      "chorus": {
        "mark": "○",
        "lv": 40,
        "cap": 70,
        "potentialCap": 82,
        "growth": 0.9
      },
      "drum": {
        "mark": "△",
        "lv": 24,
        "cap": 52,
        "potentialCap": 74,
        "growth": 0.72,
        "hiddenUpgrade": true
      }
    },
    "growthType": "メンタル型",
    "joinDifficulty": "低",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "熱いライブ向きのボーカル。メンタルが強く崩れにくい。",
    "replaceNote": "熱いライブ向きのボーカル。メンタルが強く崩れにくい。"
  },
  {
    "id": "member_sana",
    "defaultName": "サナ",
    "name": "サナ",
    "canRename": true,
    "part": "Gt/Vo",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "guitar",
    "mainGenre": "パンク",
    "secondMainGenres": [
      "ロック",
      "エモ"
    ],
    "subGenres": [
      "青春パンク",
      "メロディックパンク",
      "エモロック"
    ],
    "weakMainGenres": [
      "クラシック"
    ],
    "weakSubGenres": [
      "シンフォニックメタル"
    ],
    "stats": {
      "stamina": 42,
      "technique": 46,
      "knowledge": 30,
      "sense": 62,
      "mental": 42,
      "teamwork": 34,
      "rhythm": 42,
      "charisma": 56
    },
    "instruments": {
      "guitar": {
        "mark": "◎",
        "lv": 58,
        "cap": 84,
        "potentialCap": 94,
        "growth": 1.12
      },
      "vocal": {
        "mark": "○",
        "lv": 48,
        "cap": 76,
        "potentialCap": 90,
        "growth": 0.98
      },
      "chorus": {
        "mark": "○",
        "lv": 42,
        "cap": 70,
        "potentialCap": 82,
        "growth": 0.9
      },
      "bass": {
        "mark": "△",
        "lv": 22,
        "cap": 50,
        "potentialCap": 70,
        "growth": 0.7,
        "hiddenUpgrade": true
      }
    },
    "growthType": "センス型",
    "joinDifficulty": "中",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "荒いが曲の芯を作れるギターボーカル。",
    "replaceNote": "荒いが曲の芯を作れるギターボーカル。"
  },
  {
    "id": "member_naoto",
    "defaultName": "ナオト",
    "name": "ナオト",
    "canRename": true,
    "part": "Gt/Vo",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "male",
    "mainInstrument": "guitar",
    "mainGenre": "ロック",
    "secondMainGenres": [
      "ポップ",
      "パンク"
    ],
    "subGenres": [
      "ギターロック",
      "オルタナロック",
      "ポップパンク"
    ],
    "weakMainGenres": [
      "ヒップホップ"
    ],
    "weakSubGenres": [
      "トラップ"
    ],
    "stats": {
      "stamina": 44,
      "technique": 54,
      "knowledge": 42,
      "sense": 48,
      "mental": 48,
      "teamwork": 48,
      "rhythm": 46,
      "charisma": 42
    },
    "instruments": {
      "guitar": {
        "mark": "◎",
        "lv": 60,
        "cap": 86,
        "potentialCap": 92,
        "growth": 1.08
      },
      "vocal": {
        "mark": "○",
        "lv": 42,
        "cap": 72,
        "potentialCap": 84,
        "growth": 0.92
      },
      "chorus": {
        "mark": "△",
        "lv": 30,
        "cap": 58,
        "potentialCap": 72,
        "growth": 0.75
      }
    },
    "growthType": "安定型",
    "joinDifficulty": "低",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "技術と安定感寄り。扱いやすいギターボーカル。",
    "replaceNote": "技術と安定感寄り。扱いやすいギターボーカル。"
  },
  {
    "id": "member_hirose",
    "defaultName": "ヒロセ",
    "name": "ヒロセ",
    "canRename": true,
    "part": "Gt",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "guitar",
    "mainGenre": "ロック",
    "secondMainGenres": [
      "ポップ"
    ],
    "subGenres": [
      "ギターロック",
      "オルタナロック",
      "グランジ"
    ],
    "weakMainGenres": [
      "ヒップホップ"
    ],
    "weakSubGenres": [
      "トラップ"
    ],
    "stats": {
      "stamina": 42,
      "technique": 60,
      "knowledge": 48,
      "sense": 42,
      "mental": 44,
      "teamwork": 44,
      "rhythm": 48,
      "charisma": 32
    },
    "instruments": {
      "guitar": {
        "mark": "◎",
        "lv": 62,
        "cap": 88,
        "potentialCap": 94,
        "growth": 1.12
      },
      "key": {
        "mark": "△",
        "lv": 28,
        "cap": 56,
        "potentialCap": 76,
        "growth": 0.72,
        "hiddenUpgrade": true
      },
      "chorus": {
        "mark": "△",
        "lv": 24,
        "cap": 52,
        "potentialCap": 66,
        "growth": 0.7
      }
    },
    "growthType": "技術型",
    "joinDifficulty": "低",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "堅実に演奏力を支える技術型ギター。",
    "replaceNote": "堅実に演奏力を支える技術型ギター。"
  },
  {
    "id": "member_toma",
    "defaultName": "トウマ",
    "name": "トウマ",
    "canRename": true,
    "part": "Gt",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "male",
    "mainInstrument": "guitar",
    "mainGenre": "メタル",
    "secondMainGenres": [
      "ロック",
      "パンク"
    ],
    "subGenres": [
      "ハードロック",
      "ヘヴィメタル",
      "ガレージロック"
    ],
    "weakMainGenres": [
      "ポップ"
    ],
    "weakSubGenres": [
      "シティポップ"
    ],
    "stats": {
      "stamina": 56,
      "technique": 52,
      "knowledge": 30,
      "sense": 42,
      "mental": 46,
      "teamwork": 34,
      "rhythm": 50,
      "charisma": 46
    },
    "instruments": {
      "guitar": {
        "mark": "◎",
        "lv": 60,
        "cap": 86,
        "potentialCap": 96,
        "growth": 1.1
      },
      "bass": {
        "mark": "○",
        "lv": 38,
        "cap": 68,
        "potentialCap": 82,
        "growth": 0.9
      },
      "chorus": {
        "mark": "△",
        "lv": 20,
        "cap": 46,
        "potentialCap": 60,
        "growth": 0.65
      }
    },
    "growthType": "体力型",
    "joinDifficulty": "中",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "音圧とライブ映え重視のギター。協調性はやや低め。",
    "replaceNote": "音圧とライブ映え重視のギター。協調性はやや低め。"
  },
  {
    "id": "member_rui",
    "defaultName": "ルイ",
    "name": "ルイ",
    "canRename": true,
    "part": "Gt",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "neutral",
    "mainInstrument": "guitar",
    "mainGenre": "オルタナ",
    "secondMainGenres": [
      "ロック",
      "エモ"
    ],
    "subGenres": [
      "オルタナロック",
      "エモロック",
      "ギターポップ"
    ],
    "weakMainGenres": [
      "メタル"
    ],
    "weakSubGenres": [
      "スピードメタル"
    ],
    "stats": {
      "stamina": 38,
      "technique": 48,
      "knowledge": 42,
      "sense": 60,
      "mental": 44,
      "teamwork": 42,
      "rhythm": 46,
      "charisma": 44
    },
    "instruments": {
      "guitar": {
        "mark": "◎",
        "lv": 56,
        "cap": 84,
        "potentialCap": 96,
        "growth": 1.08
      },
      "key": {
        "mark": "○",
        "lv": 38,
        "cap": 68,
        "potentialCap": 84,
        "growth": 0.9
      },
      "chorus": {
        "mark": "○",
        "lv": 36,
        "cap": 66,
        "potentialCap": 80,
        "growth": 0.88
      }
    },
    "growthType": "センス型",
    "joinDifficulty": "中",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "ジャンル適応が広いセンス型ギター。",
    "replaceNote": "ジャンル適応が広いセンス型ギター。"
  },
  {
    "id": "member_rina",
    "defaultName": "リナ",
    "name": "リナ",
    "canRename": true,
    "part": "Ba/Vo",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "bass",
    "mainGenre": "ポップ",
    "secondMainGenres": [
      "ロック",
      "パンク"
    ],
    "subGenres": [
      "ギターポップ",
      "シティポップ",
      "メロディックパンク"
    ],
    "weakMainGenres": [
      "メタル"
    ],
    "weakSubGenres": [
      "メタルコア"
    ],
    "stats": {
      "stamina": 46,
      "technique": 44,
      "knowledge": 42,
      "sense": 46,
      "mental": 52,
      "teamwork": 62,
      "rhythm": 58,
      "charisma": 42
    },
    "instruments": {
      "bass": {
        "mark": "◎",
        "lv": 58,
        "cap": 84,
        "potentialCap": 92,
        "growth": 1.08
      },
      "vocal": {
        "mark": "○",
        "lv": 42,
        "cap": 72,
        "potentialCap": 86,
        "growth": 0.9
      },
      "chorus": {
        "mark": "◎",
        "lv": 48,
        "cap": 78,
        "potentialCap": 90,
        "growth": 0.98
      },
      "guitar": {
        "mark": "△",
        "lv": 22,
        "cap": 50,
        "potentialCap": 70,
        "growth": 0.7,
        "hiddenUpgrade": true
      }
    },
    "growthType": "協調性型",
    "joinDifficulty": "低",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "協調性高め。バンドの土台を整えるベースボーカル。",
    "replaceNote": "協調性高め。バンドの土台を整えるベースボーカル。"
  },
  {
    "id": "member_keita",
    "defaultName": "ケイタ",
    "name": "ケイタ",
    "canRename": true,
    "part": "Ba/Vo",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "male",
    "mainInstrument": "bass",
    "mainGenre": "パンク",
    "secondMainGenres": [
      "ロック",
      "ポップ"
    ],
    "subGenres": [
      "ポップパンク",
      "スカパンク",
      "ギターロック"
    ],
    "weakMainGenres": [
      "クラシック"
    ],
    "weakSubGenres": [
      "シンフォニックメタル"
    ],
    "stats": {
      "stamina": 50,
      "technique": 42,
      "knowledge": 32,
      "sense": 46,
      "mental": 52,
      "teamwork": 40,
      "rhythm": 54,
      "charisma": 58
    },
    "instruments": {
      "bass": {
        "mark": "◎",
        "lv": 56,
        "cap": 82,
        "potentialCap": 94,
        "growth": 1.05
      },
      "vocal": {
        "mark": "○",
        "lv": 48,
        "cap": 76,
        "potentialCap": 88,
        "growth": 0.95
      },
      "chorus": {
        "mark": "○",
        "lv": 36,
        "cap": 66,
        "potentialCap": 78,
        "growth": 0.85
      }
    },
    "growthType": "カリスマ型",
    "joinDifficulty": "中",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "前に出るベースボーカル。ファン反応を作りやすい。",
    "replaceNote": "前に出るベースボーカル。ファン反応を作りやすい。"
  },
  {
    "id": "member_minami",
    "defaultName": "ミナミ",
    "name": "ミナミ",
    "canRename": true,
    "part": "Ba",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "bass",
    "mainGenre": "ポップ",
    "secondMainGenres": [
      "ロック"
    ],
    "subGenres": [
      "ギターポップ",
      "バラードポップ",
      "メロディックパンク"
    ],
    "weakMainGenres": [
      "メタル"
    ],
    "weakSubGenres": [
      "スクリーモ"
    ],
    "stats": {
      "stamina": 52,
      "technique": 44,
      "knowledge": 44,
      "sense": 40,
      "mental": 56,
      "teamwork": 62,
      "rhythm": 56,
      "charisma": 30
    },
    "instruments": {
      "bass": {
        "mark": "◎",
        "lv": 58,
        "cap": 86,
        "potentialCap": 92,
        "growth": 1.05
      },
      "chorus": {
        "mark": "○",
        "lv": 38,
        "cap": 68,
        "potentialCap": 78,
        "growth": 0.88
      },
      "drum": {
        "mark": "△",
        "lv": 24,
        "cap": 52,
        "potentialCap": 72,
        "growth": 0.72,
        "hiddenUpgrade": true
      }
    },
    "growthType": "安定型",
    "joinDifficulty": "低",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "低リスクで扱いやすい安定型ベース。",
    "replaceNote": "低リスクで扱いやすい安定型ベース。"
  },
  {
    "id": "member_shion",
    "defaultName": "シオン",
    "name": "シオン",
    "canRename": true,
    "part": "Ba",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "male",
    "mainInstrument": "bass",
    "mainGenre": "ロック",
    "secondMainGenres": [
      "パンク",
      "エモ"
    ],
    "subGenres": [
      "ギターロック",
      "メロディックパンク",
      "エモロック"
    ],
    "weakMainGenres": [
      "クラシック"
    ],
    "weakSubGenres": [
      "クラシカルロック"
    ],
    "stats": {
      "stamina": 48,
      "technique": 46,
      "knowledge": 38,
      "sense": 42,
      "mental": 48,
      "teamwork": 46,
      "rhythm": 64,
      "charisma": 36
    },
    "instruments": {
      "bass": {
        "mark": "◎",
        "lv": 60,
        "cap": 86,
        "potentialCap": 94,
        "growth": 1.08
      },
      "drum": {
        "mark": "○",
        "lv": 36,
        "cap": 66,
        "potentialCap": 78,
        "growth": 0.88
      },
      "chorus": {
        "mark": "△",
        "lv": 24,
        "cap": 52,
        "potentialCap": 66,
        "growth": 0.7
      }
    },
    "growthType": "リズム型",
    "joinDifficulty": "低",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "ライブ評価を支えやすいリズム重視ベース。",
    "replaceNote": "ライブ評価を支えやすいリズム重視ベース。"
  },
  {
    "id": "member_ayane",
    "defaultName": "アヤネ",
    "name": "アヤネ",
    "canRename": true,
    "part": "Dr",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "drum",
    "mainGenre": "パンク",
    "secondMainGenres": [
      "ポップ",
      "ロック"
    ],
    "subGenres": [
      "青春パンク",
      "メロディックパンク",
      "ダンスロック"
    ],
    "weakMainGenres": [
      "クラシック"
    ],
    "weakSubGenres": [
      "シンフォニックメタル"
    ],
    "stats": {
      "stamina": 54,
      "technique": 44,
      "knowledge": 30,
      "sense": 46,
      "mental": 46,
      "teamwork": 44,
      "rhythm": 66,
      "charisma": 42
    },
    "instruments": {
      "drum": {
        "mark": "◎",
        "lv": 62,
        "cap": 88,
        "potentialCap": 96,
        "growth": 1.14
      },
      "chorus": {
        "mark": "△",
        "lv": 24,
        "cap": 52,
        "potentialCap": 66,
        "growth": 0.7
      },
      "dj": {
        "mark": "△",
        "lv": 20,
        "cap": 48,
        "potentialCap": 76,
        "growth": 0.7,
        "hiddenUpgrade": true
      }
    },
    "growthType": "リズム型",
    "joinDifficulty": "低",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "テンポの良い曲に強いドラム。",
    "replaceNote": "テンポの良い曲に強いドラム。"
  },
  {
    "id": "member_hayate",
    "defaultName": "ハヤテ",
    "name": "ハヤテ",
    "canRename": true,
    "part": "Dr",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "male",
    "mainInstrument": "drum",
    "mainGenre": "メタル",
    "secondMainGenres": [
      "パンク",
      "ロック"
    ],
    "subGenres": [
      "ハードコア",
      "メタルコア",
      "ハードロック"
    ],
    "weakMainGenres": [
      "ポップ"
    ],
    "weakSubGenres": [
      "バラードポップ"
    ],
    "stats": {
      "stamina": 66,
      "technique": 42,
      "knowledge": 28,
      "sense": 38,
      "mental": 50,
      "teamwork": 38,
      "rhythm": 62,
      "charisma": 36
    },
    "instruments": {
      "drum": {
        "mark": "◎",
        "lv": 64,
        "cap": 90,
        "potentialCap": 98,
        "growth": 1.16
      },
      "bass": {
        "mark": "△",
        "lv": 26,
        "cap": 54,
        "potentialCap": 72,
        "growth": 0.72
      },
      "chorus": {
        "mark": "×",
        "lv": 12,
        "cap": 36,
        "potentialCap": 44,
        "growth": 0.5
      }
    },
    "growthType": "体力型",
    "joinDifficulty": "中",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "疲労に強い体力型ドラム。",
    "replaceNote": "疲労に強い体力型ドラム。"
  },
  {
    "id": "member_mio",
    "defaultName": "ミオ",
    "name": "ミオ",
    "canRename": true,
    "part": "Key",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "key",
    "mainGenre": "ポップ",
    "secondMainGenres": [
      "ジャズ",
      "ロック"
    ],
    "subGenres": [
      "シティポップ",
      "ピアノロック",
      "ジャズロック"
    ],
    "weakMainGenres": [
      "メタル"
    ],
    "weakSubGenres": [
      "ハードコア"
    ],
    "stats": {
      "stamina": 34,
      "technique": 46,
      "knowledge": 62,
      "sense": 58,
      "mental": 40,
      "teamwork": 48,
      "rhythm": 42,
      "charisma": 34
    },
    "instruments": {
      "key": {
        "mark": "◎",
        "lv": 60,
        "cap": 86,
        "potentialCap": 96,
        "growth": 1.12
      },
      "chorus": {
        "mark": "○",
        "lv": 48,
        "cap": 76,
        "potentialCap": 88,
        "growth": 0.95
      },
      "vocal": {
        "mark": "△",
        "lv": 24,
        "cap": 52,
        "potentialCap": 70,
        "growth": 0.7
      }
    },
    "growthType": "知識型",
    "joinDifficulty": "中",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "作曲やアレンジに向くキーボード。",
    "replaceNote": "作曲やアレンジに向くキーボード。"
  },
  {
    "id": "member_yu",
    "defaultName": "ユウ",
    "name": "ユウ",
    "canRename": true,
    "part": "DJ",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "neutral",
    "mainInstrument": "dj",
    "mainGenre": "ミクスチャー",
    "secondMainGenres": [
      "ヒップホップ",
      "ポップ"
    ],
    "subGenres": [
      "ミクスチャーロック",
      "ラップロック",
      "ダンスロック"
    ],
    "weakMainGenres": [
      "クラシック"
    ],
    "weakSubGenres": [
      "クラシカルロック"
    ],
    "stats": {
      "stamina": 40,
      "technique": 48,
      "knowledge": 50,
      "sense": 58,
      "mental": 42,
      "teamwork": 34,
      "rhythm": 62,
      "charisma": 50
    },
    "instruments": {
      "dj": {
        "mark": "◎",
        "lv": 62,
        "cap": 88,
        "potentialCap": 96,
        "growth": 1.1
      },
      "vocal": {
        "mark": "△",
        "lv": 28,
        "cap": 58,
        "potentialCap": 74,
        "growth": 0.72
      },
      "chorus": {
        "mark": "○",
        "lv": 36,
        "cap": 66,
        "potentialCap": 78,
        "growth": 0.85
      },
      "bass": {
        "mark": "△",
        "lv": 22,
        "cap": 50,
        "potentialCap": 70,
        "growth": 0.7,
        "hiddenUpgrade": true
      }
    },
    "growthType": "センス型",
    "joinDifficulty": "中",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "SNS・ミクスチャー寄りの特殊枠。",
    "replaceNote": "SNS・ミクスチャー寄りの特殊枠。"
  },
  {
    "id": "member_koto",
    "defaultName": "コト",
    "name": "コト",
    "canRename": true,
    "part": "Cho",
    "joinPhase": "early",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "chorus",
    "mainGenre": "ポップ",
    "secondMainGenres": [
      "ロック",
      "エモ"
    ],
    "subGenres": [
      "ギターポップ",
      "バラードポップ",
      "エモロック"
    ],
    "weakMainGenres": [
      "メタル"
    ],
    "weakSubGenres": [
      "メタルコア"
    ],
    "stats": {
      "stamina": 36,
      "technique": 40,
      "knowledge": 46,
      "sense": 50,
      "mental": 56,
      "teamwork": 64,
      "rhythm": 42,
      "charisma": 40
    },
    "instruments": {
      "chorus": {
        "mark": "◎",
        "lv": 60,
        "cap": 86,
        "potentialCap": 96,
        "growth": 1.1
      },
      "vocal": {
        "mark": "○",
        "lv": 44,
        "cap": 74,
        "potentialCap": 86,
        "growth": 0.92
      },
      "key": {
        "mark": "△",
        "lv": 26,
        "cap": 54,
        "potentialCap": 74,
        "growth": 0.72,
        "hiddenUpgrade": true
      }
    },
    "growthType": "協調性型",
    "joinDifficulty": "低",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 1
    },
    "roleHint": "歌もの補助に強いコーラス。正式メンバーだが補助寄り。",
    "replaceNote": "歌もの補助に強いコーラス。正式メンバーだが補助寄り。"
  },
  {
    "id": "member_haruka",
    "defaultName": "ハルカ",
    "name": "ハルカ",
    "canRename": true,
    "part": "Vo",
    "joinPhase": "middle",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "vocal",
    "mainGenre": "エモ",
    "secondMainGenres": [
      "ロック",
      "ポップ"
    ],
    "subGenres": [
      "エモロック",
      "バラードロック",
      "ギターポップ"
    ],
    "weakMainGenres": [
      "メタル"
    ],
    "weakSubGenres": [
      "スピードメタル"
    ],
    "stats": {
      "stamina": 44,
      "technique": 48,
      "knowledge": 50,
      "sense": 66,
      "mental": 54,
      "teamwork": 48,
      "rhythm": 44,
      "charisma": 62
    },
    "instruments": {
      "vocal": {
        "mark": "◎",
        "lv": 66,
        "cap": 90,
        "potentialCap": 98,
        "growth": 1.12
      },
      "chorus": {
        "mark": "◎",
        "lv": 56,
        "cap": 84,
        "potentialCap": 94,
        "growth": 1.02
      },
      "key": {
        "mark": "△",
        "lv": 30,
        "cap": 60,
        "potentialCap": 82,
        "growth": 0.75
      }
    },
    "growthType": "センス型",
    "joinDifficulty": "中",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 12,
      "minFans": 40,
      "minFame": 15
    },
    "roleHint": "歌詞・表現力寄り。エモ系に強い。",
    "replaceNote": "歌詞・表現力寄り。エモ系に強い。"
  },
  {
    "id": "member_kagura",
    "defaultName": "カグラ",
    "name": "カグラ",
    "canRename": true,
    "part": "Gt/Vo",
    "joinPhase": "middle",
    "joinType": "recruit",
    "genderHint": "male",
    "mainInstrument": "guitar",
    "mainGenre": "ロック",
    "secondMainGenres": [
      "パンク",
      "メタル"
    ],
    "subGenres": [
      "ギターロック",
      "ハードロック",
      "ポストハードコア"
    ],
    "weakMainGenres": [
      "ポップ"
    ],
    "weakSubGenres": [
      "シティポップ"
    ],
    "stats": {
      "stamina": 52,
      "technique": 58,
      "knowledge": 38,
      "sense": 54,
      "mental": 36,
      "teamwork": 30,
      "rhythm": 50,
      "charisma": 70
    },
    "instruments": {
      "guitar": {
        "mark": "◎",
        "lv": 70,
        "cap": 92,
        "potentialCap": 99,
        "growth": 1.12
      },
      "vocal": {
        "mark": "○",
        "lv": 56,
        "cap": 82,
        "potentialCap": 94,
        "growth": 0.98
      },
      "chorus": {
        "mark": "△",
        "lv": 28,
        "cap": 56,
        "potentialCap": 70,
        "growth": 0.7
      }
    },
    "growthType": "爆発型",
    "joinDifficulty": "高",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 12,
      "minFans": 50,
      "minFame": 20
    },
    "roleHint": "人気は出やすいが安定感に難があるカリスマ型Gt/Vo。",
    "replaceNote": "人気は出やすいが安定感に難があるカリスマ型Gt/Vo。"
  },
  {
    "id": "member_yuzuha",
    "defaultName": "ユズハ",
    "name": "ユズハ",
    "canRename": true,
    "part": "Ba/Vo",
    "joinPhase": "middle",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "bass",
    "mainGenre": "ポップ",
    "secondMainGenres": [
      "エモ",
      "ロック"
    ],
    "subGenres": [
      "パワーポップ",
      "ギターポップ",
      "エモロック"
    ],
    "weakMainGenres": [
      "メタル"
    ],
    "weakSubGenres": [
      "スクリーモ"
    ],
    "stats": {
      "stamina": 46,
      "technique": 50,
      "knowledge": 46,
      "sense": 64,
      "mental": 50,
      "teamwork": 56,
      "rhythm": 58,
      "charisma": 54
    },
    "instruments": {
      "bass": {
        "mark": "◎",
        "lv": 66,
        "cap": 90,
        "potentialCap": 98,
        "growth": 1.1
      },
      "vocal": {
        "mark": "○",
        "lv": 54,
        "cap": 80,
        "potentialCap": 92,
        "growth": 0.98
      },
      "chorus": {
        "mark": "◎",
        "lv": 58,
        "cap": 86,
        "potentialCap": 96,
        "growth": 1.02
      }
    },
    "growthType": "センス型",
    "joinDifficulty": "中",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 12,
      "minFans": 45,
      "minFame": 18
    },
    "roleHint": "ポップ・歌もの寄りのベースボーカル。",
    "replaceNote": "ポップ・歌もの寄りのベースボーカル。"
  },
  {
    "id": "member_kanna",
    "defaultName": "カンナ",
    "name": "カンナ",
    "canRename": true,
    "part": "Gt",
    "joinPhase": "middle",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "guitar",
    "mainGenre": "メタル",
    "secondMainGenres": [
      "ロック",
      "ミクスチャー"
    ],
    "subGenres": [
      "ヘヴィメタル",
      "スピードメタル",
      "ニューメタル"
    ],
    "weakMainGenres": [
      "ポップ"
    ],
    "weakSubGenres": [
      "バラードポップ"
    ],
    "stats": {
      "stamina": 48,
      "technique": 72,
      "knowledge": 52,
      "sense": 46,
      "mental": 48,
      "teamwork": 28,
      "rhythm": 52,
      "charisma": 36
    },
    "instruments": {
      "guitar": {
        "mark": "◎",
        "lv": 74,
        "cap": 94,
        "potentialCap": 99,
        "growth": 1.16
      },
      "bass": {
        "mark": "○",
        "lv": 42,
        "cap": 72,
        "potentialCap": 84,
        "growth": 0.9
      },
      "chorus": {
        "mark": "×",
        "lv": 12,
        "cap": 36,
        "potentialCap": 48,
        "growth": 0.5
      }
    },
    "growthType": "技術型",
    "joinDifficulty": "高",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 13,
      "minFans": 45,
      "minFame": 15,
      "minIndustry": 10
    },
    "roleHint": "技術特化。協調性は低めだが難曲に強い。",
    "replaceNote": "技術特化。協調性は低めだが難曲に強い。"
  },
  {
    "id": "member_rikuto",
    "defaultName": "リクト",
    "name": "リクト",
    "canRename": true,
    "part": "Dr",
    "joinPhase": "middle",
    "joinType": "recruit",
    "genderHint": "male",
    "mainInstrument": "drum",
    "mainGenre": "パンク",
    "secondMainGenres": [
      "メタル",
      "ロック"
    ],
    "subGenres": [
      "ハードコア",
      "メタルコア",
      "メロディックパンク"
    ],
    "weakMainGenres": [
      "クラシック"
    ],
    "weakSubGenres": [
      "クラシカルロック"
    ],
    "stats": {
      "stamina": 74,
      "technique": 50,
      "knowledge": 34,
      "sense": 42,
      "mental": 52,
      "teamwork": 38,
      "rhythm": 72,
      "charisma": 42
    },
    "instruments": {
      "drum": {
        "mark": "◎",
        "lv": 74,
        "cap": 94,
        "potentialCap": 99,
        "growth": 1.18
      },
      "bass": {
        "mark": "△",
        "lv": 30,
        "cap": 60,
        "potentialCap": 78,
        "growth": 0.72
      },
      "dj": {
        "mark": "△",
        "lv": 24,
        "cap": 54,
        "potentialCap": 80,
        "growth": 0.7,
        "hiddenUpgrade": true
      }
    },
    "growthType": "体力型",
    "joinDifficulty": "中",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 14,
      "minFans": 55,
      "minFame": 18
    },
    "roleHint": "体力・リズム型。ラウド系に向く。",
    "replaceNote": "体力・リズム型。ラウド系に向く。"
  },
  {
    "id": "member_sena",
    "defaultName": "セナ",
    "name": "セナ",
    "canRename": true,
    "part": "Key",
    "joinPhase": "middle",
    "joinType": "recruit",
    "genderHint": "neutral",
    "mainInstrument": "key",
    "mainGenre": "エレクトロ",
    "secondMainGenres": [
      "ジャズ",
      "ポップ"
    ],
    "subGenres": [
      "エレクトロロック",
      "シティポップ",
      "ジャズロック"
    ],
    "weakMainGenres": [
      "パンク"
    ],
    "weakSubGenres": [
      "ハードコア"
    ],
    "stats": {
      "stamina": 36,
      "technique": 58,
      "knowledge": 72,
      "sense": 62,
      "mental": 46,
      "teamwork": 50,
      "rhythm": 48,
      "charisma": 34
    },
    "instruments": {
      "key": {
        "mark": "◎",
        "lv": 72,
        "cap": 94,
        "potentialCap": 99,
        "growth": 1.15
      },
      "dj": {
        "mark": "○",
        "lv": 44,
        "cap": 74,
        "potentialCap": 90,
        "growth": 0.92
      },
      "chorus": {
        "mark": "○",
        "lv": 46,
        "cap": 76,
        "potentialCap": 88,
        "growth": 0.9
      }
    },
    "growthType": "知識型",
    "joinDifficulty": "中",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 14,
      "minFans": 45,
      "minFame": 15,
      "minIndustry": 10
    },
    "roleHint": "曲作り補助に向く知識型Key。",
    "replaceNote": "曲作り補助に向く知識型Key。"
  },
  {
    "id": "member_aoba",
    "defaultName": "アオバ",
    "name": "アオバ",
    "canRename": true,
    "part": "Gt",
    "joinPhase": "middle",
    "joinType": "recruit",
    "genderHint": "male",
    "mainInstrument": "guitar",
    "mainGenre": "オルタナ",
    "secondMainGenres": [
      "エモ",
      "ロック"
    ],
    "subGenres": [
      "オルタナロック",
      "エモロック",
      "ポストロック"
    ],
    "weakMainGenres": [
      "ポップ"
    ],
    "weakSubGenres": [
      "バラードポップ"
    ],
    "stats": {
      "stamina": 44,
      "technique": 50,
      "knowledge": 48,
      "sense": 68,
      "mental": 44,
      "teamwork": 34,
      "rhythm": 46,
      "charisma": 48
    },
    "instruments": {
      "guitar": {
        "mark": "◎",
        "lv": 64,
        "cap": 88,
        "potentialCap": 99,
        "growth": 1.08
      },
      "key": {
        "mark": "△",
        "lv": 32,
        "cap": 62,
        "potentialCap": 84,
        "growth": 0.75,
        "hiddenUpgrade": true
      },
      "chorus": {
        "mark": "○",
        "lv": 36,
        "cap": 68,
        "potentialCap": 82,
        "growth": 0.86
      }
    },
    "growthType": "晩成型",
    "joinDifficulty": "中〜高",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 15,
      "minFans": 60,
      "minFame": 25,
      "minIndustry": 10
    },
    "roleHint": "癖のあるオリジナル性寄りギター。育つと強い。",
    "replaceNote": "癖のあるオリジナル性寄りギター。育つと強い。"
  },
  {
    "id": "member_sora",
    "defaultName": "ソラ",
    "name": "ソラ",
    "canRename": true,
    "part": "DJ",
    "joinPhase": "middle",
    "joinType": "recruit",
    "genderHint": "neutral",
    "mainInstrument": "dj",
    "mainGenre": "ミクスチャー",
    "secondMainGenres": [
      "ヒップホップ",
      "エレクトロ"
    ],
    "subGenres": [
      "ミクスチャーロック",
      "ラップロック",
      "エレクトロロック"
    ],
    "weakMainGenres": [
      "クラシック"
    ],
    "weakSubGenres": [
      "クラシカルロック"
    ],
    "stats": {
      "stamina": 42,
      "technique": 60,
      "knowledge": 64,
      "sense": 66,
      "mental": 46,
      "teamwork": 34,
      "rhythm": 66,
      "charisma": 58
    },
    "instruments": {
      "dj": {
        "mark": "◎",
        "lv": 72,
        "cap": 94,
        "potentialCap": 99,
        "growth": 1.12
      },
      "key": {
        "mark": "○",
        "lv": 50,
        "cap": 80,
        "potentialCap": 94,
        "growth": 0.95
      },
      "vocal": {
        "mark": "△",
        "lv": 30,
        "cap": 60,
        "potentialCap": 76,
        "growth": 0.72
      },
      "bass": {
        "mark": "△",
        "lv": 28,
        "cap": 58,
        "potentialCap": 82,
        "growth": 0.72,
        "hiddenUpgrade": true
      }
    },
    "growthType": "センス型",
    "joinDifficulty": "高",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 15,
      "minFans": 65,
      "minFame": 25,
      "minIndustry": 10
    },
    "roleHint": "ミクスチャー、SNS、演出寄りのDJ。",
    "replaceNote": "ミクスチャー、SNS、演出寄りのDJ。"
  },
  {
    "id": "member_matsuri",
    "defaultName": "マツリ",
    "name": "マツリ",
    "canRename": true,
    "part": "Dr",
    "joinPhase": "middle",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "drum",
    "mainGenre": "パンク",
    "secondMainGenres": [
      "ポップ",
      "ロック"
    ],
    "subGenres": [
      "青春パンク",
      "スカパンク",
      "ダンスロック"
    ],
    "weakMainGenres": [
      "クラシック"
    ],
    "weakSubGenres": [
      "シンフォニックメタル"
    ],
    "stats": {
      "stamina": 58,
      "technique": 48,
      "knowledge": 34,
      "sense": 52,
      "mental": 48,
      "teamwork": 46,
      "rhythm": 70,
      "charisma": 58
    },
    "instruments": {
      "drum": {
        "mark": "◎",
        "lv": 70,
        "cap": 92,
        "potentialCap": 98,
        "growth": 1.14
      },
      "chorus": {
        "mark": "○",
        "lv": 34,
        "cap": 64,
        "potentialCap": 76,
        "growth": 0.85
      },
      "dj": {
        "mark": "△",
        "lv": 26,
        "cap": 56,
        "potentialCap": 82,
        "growth": 0.72,
        "hiddenUpgrade": true
      }
    },
    "growthType": "爆発型",
    "joinDifficulty": "中",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 16,
      "minFans": 60,
      "minFame": 22
    },
    "roleHint": "ライブの盛り上げ役。勢い重視のドラム。",
    "replaceNote": "ライブの盛り上げ役。勢い重視のドラム。"
  },
  {
    "id": "member_kengo",
    "defaultName": "ケンゴ",
    "name": "ケンゴ",
    "canRename": true,
    "part": "Ba",
    "joinPhase": "middle",
    "joinType": "recruit",
    "genderHint": "male",
    "mainInstrument": "bass",
    "mainGenre": "ロック",
    "secondMainGenres": [
      "パンク",
      "エモ"
    ],
    "subGenres": [
      "ギターロック",
      "メロディックパンク",
      "エモロック"
    ],
    "weakMainGenres": [
      "クラシック"
    ],
    "weakSubGenres": [
      "クラシカルロック"
    ],
    "stats": {
      "stamina": 58,
      "technique": 50,
      "knowledge": 44,
      "sense": 42,
      "mental": 68,
      "teamwork": 58,
      "rhythm": 64,
      "charisma": 34
    },
    "instruments": {
      "bass": {
        "mark": "◎",
        "lv": 68,
        "cap": 90,
        "potentialCap": 96,
        "growth": 1.1
      },
      "chorus": {
        "mark": "○",
        "lv": 36,
        "cap": 66,
        "potentialCap": 78,
        "growth": 0.85
      },
      "drum": {
        "mark": "△",
        "lv": 30,
        "cap": 60,
        "potentialCap": 78,
        "growth": 0.75,
        "hiddenUpgrade": true
      }
    },
    "growthType": "メンタル型",
    "joinDifficulty": "中",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 16,
      "minFans": 65,
      "minFame": 20,
      "minIndustry": 10
    },
    "roleHint": "安定したライブに強いメンタル型ベース。",
    "replaceNote": "安定したライブに強いメンタル型ベース。"
  },
  {
    "id": "member_noel",
    "defaultName": "ノエル",
    "name": "ノエル",
    "canRename": true,
    "part": "Cho",
    "joinPhase": "middle",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "chorus",
    "mainGenre": "ポップ",
    "secondMainGenres": [
      "エモ",
      "クラシック"
    ],
    "subGenres": [
      "バラードポップ",
      "シティポップ",
      "クラシカルロック"
    ],
    "weakMainGenres": [
      "メタル"
    ],
    "weakSubGenres": [
      "メタルコア"
    ],
    "stats": {
      "stamina": 38,
      "technique": 46,
      "knowledge": 58,
      "sense": 62,
      "mental": 58,
      "teamwork": 70,
      "rhythm": 44,
      "charisma": 46
    },
    "instruments": {
      "chorus": {
        "mark": "◎",
        "lv": 72,
        "cap": 94,
        "potentialCap": 99,
        "growth": 1.12
      },
      "vocal": {
        "mark": "○",
        "lv": 50,
        "cap": 78,
        "potentialCap": 90,
        "growth": 0.92
      },
      "key": {
        "mark": "○",
        "lv": 40,
        "cap": 72,
        "potentialCap": 88,
        "growth": 0.9
      }
    },
    "growthType": "協調性型",
    "joinDifficulty": "中",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 17,
      "minFans": 60,
      "minFame": 20,
      "minIndustry": 10
    },
    "roleHint": "コーラス・世界観補助。ポップ系に強い。",
    "replaceNote": "コーラス・世界観補助。ポップ系に強い。"
  },
  {
    "id": "member_hibiki",
    "defaultName": "ヒビキ",
    "name": "ヒビキ",
    "canRename": true,
    "part": "Gt",
    "joinPhase": "middle",
    "joinType": "recruit",
    "genderHint": "male",
    "mainInstrument": "guitar",
    "mainGenre": "パンク",
    "secondMainGenres": [
      "ロック",
      "メタル"
    ],
    "subGenres": [
      "ポストハードコア",
      "ハードロック",
      "メタルコア"
    ],
    "weakMainGenres": [
      "ポップ"
    ],
    "weakSubGenres": [
      "シティポップ"
    ],
    "stats": {
      "stamina": 60,
      "technique": 62,
      "knowledge": 34,
      "sense": 48,
      "mental": 46,
      "teamwork": 32,
      "rhythm": 56,
      "charisma": 50
    },
    "instruments": {
      "guitar": {
        "mark": "◎",
        "lv": 72,
        "cap": 94,
        "potentialCap": 99,
        "growth": 1.14
      },
      "bass": {
        "mark": "△",
        "lv": 32,
        "cap": 62,
        "potentialCap": 78,
        "growth": 0.75
      },
      "chorus": {
        "mark": "×",
        "lv": 14,
        "cap": 38,
        "potentialCap": 50,
        "growth": 0.5
      }
    },
    "growthType": "爆発型",
    "joinDifficulty": "高",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 18,
      "minFans": 70,
      "minFame": 25,
      "minIndustry": 10
    },
    "roleHint": "音圧重視。パンク・ラウド寄りのギター。",
    "replaceNote": "音圧重視。パンク・ラウド寄りのギター。"
  },
  {
    "id": "member_tsukino",
    "defaultName": "ツキノ",
    "name": "ツキノ",
    "canRename": true,
    "part": "Vo",
    "joinPhase": "late",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "vocal",
    "mainGenre": "ロック",
    "secondMainGenres": [
      "ポップ",
      "エモ"
    ],
    "subGenres": [
      "バラードロック",
      "ギターポップ",
      "エモロック"
    ],
    "weakMainGenres": [
      "メタル"
    ],
    "weakSubGenres": [
      "スクリーモ"
    ],
    "stats": {
      "stamina": 52,
      "technique": 58,
      "knowledge": 54,
      "sense": 70,
      "mental": 64,
      "teamwork": 54,
      "rhythm": 50,
      "charisma": 78
    },
    "instruments": {
      "vocal": {
        "mark": "◎",
        "lv": 78,
        "cap": 96,
        "potentialCap": 99,
        "growth": 1.16
      },
      "chorus": {
        "mark": "◎",
        "lv": 66,
        "cap": 92,
        "potentialCap": 99,
        "growth": 1.05
      },
      "key": {
        "mark": "△",
        "lv": 34,
        "cap": 64,
        "potentialCap": 86,
        "growth": 0.75
      }
    },
    "growthType": "カリスマ型",
    "joinDifficulty": "高",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 24,
      "minFans": 110,
      "minFame": 50,
      "minIndustry": 45
    },
    "roleHint": "大きいステージに強い後半ボーカル。",
    "replaceNote": "大きいステージに強い後半ボーカル。"
  },
  {
    "id": "member_makishi",
    "defaultName": "マキシ",
    "name": "マキシ",
    "canRename": true,
    "part": "Gt",
    "joinPhase": "late",
    "joinType": "recruit",
    "genderHint": "male",
    "mainInstrument": "guitar",
    "mainGenre": "メタル",
    "secondMainGenres": [
      "ロック",
      "プログレ"
    ],
    "subGenres": [
      "スピードメタル",
      "プログレ",
      "ニューメタル"
    ],
    "weakMainGenres": [
      "ポップ"
    ],
    "weakSubGenres": [
      "バラードポップ"
    ],
    "stats": {
      "stamina": 58,
      "technique": 82,
      "knowledge": 62,
      "sense": 56,
      "mental": 50,
      "teamwork": 24,
      "rhythm": 62,
      "charisma": 46
    },
    "instruments": {
      "guitar": {
        "mark": "◎",
        "lv": 82,
        "cap": 98,
        "potentialCap": 100,
        "growth": 1.18
      },
      "bass": {
        "mark": "○",
        "lv": 48,
        "cap": 78,
        "potentialCap": 90,
        "growth": 0.92
      },
      "chorus": {
        "mark": "×",
        "lv": 10,
        "cap": 34,
        "potentialCap": 42,
        "growth": 0.45
      }
    },
    "growthType": "技術型",
    "joinDifficulty": "非常に高い",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 25,
      "minFans": 120,
      "minFame": 55,
      "minIndustry": 55
    },
    "roleHint": "扱いは難しいが爆発力のある技術特化ギター。",
    "replaceNote": "扱いは難しいが爆発力のある技術特化ギター。"
  },
  {
    "id": "member_rindo",
    "defaultName": "リンドウ",
    "name": "リンドウ",
    "canRename": true,
    "part": "Gt/Vo",
    "joinPhase": "late",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "guitar",
    "mainGenre": "エモ",
    "secondMainGenres": [
      "ロック",
      "シューゲイザー"
    ],
    "subGenres": [
      "エモロック",
      "ポストロック",
      "オルタナロック"
    ],
    "weakMainGenres": [
      "メタル"
    ],
    "weakSubGenres": [
      "スピードメタル"
    ],
    "stats": {
      "stamina": 50,
      "technique": 62,
      "knowledge": 58,
      "sense": 74,
      "mental": 54,
      "teamwork": 46,
      "rhythm": 52,
      "charisma": 66
    },
    "instruments": {
      "guitar": {
        "mark": "◎",
        "lv": 74,
        "cap": 96,
        "potentialCap": 100,
        "growth": 1.1
      },
      "vocal": {
        "mark": "○",
        "lv": 60,
        "cap": 88,
        "potentialCap": 99,
        "growth": 1.0
      },
      "chorus": {
        "mark": "◎",
        "lv": 62,
        "cap": 90,
        "potentialCap": 99,
        "growth": 1.02
      },
      "key": {
        "mark": "△",
        "lv": 36,
        "cap": 66,
        "potentialCap": 88,
        "growth": 0.75,
        "hiddenUpgrade": true
      }
    },
    "growthType": "晩成型",
    "joinDifficulty": "高",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 26,
      "minFans": 120,
      "minFame": 55,
      "minIndustry": 50
    },
    "roleHint": "育つと強い中心人物候補のGt/Vo。",
    "replaceNote": "育つと強い中心人物候補のGt/Vo。"
  },
  {
    "id": "member_leon",
    "defaultName": "レオン",
    "name": "レオン",
    "canRename": true,
    "part": "Ba/Vo",
    "joinPhase": "late",
    "joinType": "recruit",
    "genderHint": "male",
    "mainInstrument": "bass",
    "mainGenre": "パンク",
    "secondMainGenres": [
      "ロック",
      "ミクスチャー"
    ],
    "subGenres": [
      "ポップパンク",
      "ミクスチャーロック",
      "ハードコア"
    ],
    "weakMainGenres": [
      "クラシック"
    ],
    "weakSubGenres": [
      "クラシカルロック"
    ],
    "stats": {
      "stamina": 64,
      "technique": 58,
      "knowledge": 42,
      "sense": 54,
      "mental": 72,
      "teamwork": 46,
      "rhythm": 70,
      "charisma": 70
    },
    "instruments": {
      "bass": {
        "mark": "◎",
        "lv": 76,
        "cap": 96,
        "potentialCap": 100,
        "growth": 1.12
      },
      "vocal": {
        "mark": "○",
        "lv": 62,
        "cap": 88,
        "potentialCap": 99,
        "growth": 0.98
      },
      "chorus": {
        "mark": "○",
        "lv": 44,
        "cap": 76,
        "potentialCap": 88,
        "growth": 0.88
      }
    },
    "growthType": "メンタル型",
    "joinDifficulty": "高",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 27,
      "minFans": 130,
      "minFame": 60,
      "minIndustry": 55
    },
    "roleHint": "カリスマ＋メンタル型。前線向きのBa/Vo。",
    "replaceNote": "カリスマ＋メンタル型。前線向きのBa/Vo。"
  },
  {
    "id": "member_mira",
    "defaultName": "ミラ",
    "name": "ミラ",
    "canRename": true,
    "part": "Key",
    "joinPhase": "late",
    "joinType": "recruit",
    "genderHint": "neutral",
    "mainInstrument": "key",
    "mainGenre": "プログレ",
    "secondMainGenres": [
      "クラシック",
      "ジャズ"
    ],
    "subGenres": [
      "プログレ",
      "クラシカルロック",
      "ジャズロック"
    ],
    "weakMainGenres": [
      "パンク"
    ],
    "weakSubGenres": [
      "青春パンク"
    ],
    "stats": {
      "stamina": 40,
      "technique": 68,
      "knowledge": 82,
      "sense": 76,
      "mental": 56,
      "teamwork": 48,
      "rhythm": 56,
      "charisma": 42
    },
    "instruments": {
      "key": {
        "mark": "◎",
        "lv": 82,
        "cap": 98,
        "potentialCap": 100,
        "growth": 1.18
      },
      "other": {
        "mark": "○",
        "lv": 54,
        "cap": 84,
        "potentialCap": 96,
        "growth": 0.95
      },
      "chorus": {
        "mark": "○",
        "lv": 50,
        "cap": 80,
        "potentialCap": 92,
        "growth": 0.9
      },
      "dj": {
        "mark": "△",
        "lv": 36,
        "cap": 68,
        "potentialCap": 90,
        "growth": 0.75,
        "hiddenUpgrade": true
      }
    },
    "growthType": "知識型",
    "joinDifficulty": "高",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 28,
      "minFans": 130,
      "minFame": 60,
      "minIndustry": 60
    },
    "roleHint": "世界観・知識型。後半ジャンルに強いKey。",
    "replaceNote": "世界観・知識型。後半ジャンルに強いKey。"
  },
  {
    "id": "member_saeki",
    "defaultName": "サエキ",
    "name": "サエキ",
    "canRename": true,
    "part": "Dr",
    "joinPhase": "late",
    "joinType": "recruit",
    "genderHint": "male",
    "mainInstrument": "drum",
    "mainGenre": "ロック",
    "secondMainGenres": [
      "ジャズ",
      "メタル"
    ],
    "subGenres": [
      "ジャズロック",
      "ハードロック",
      "メタルコア"
    ],
    "weakMainGenres": [
      "ポップ"
    ],
    "weakSubGenres": [
      "シティポップ"
    ],
    "stats": {
      "stamina": 70,
      "technique": 72,
      "knowledge": 48,
      "sense": 50,
      "mental": 60,
      "teamwork": 50,
      "rhythm": 82,
      "charisma": 40
    },
    "instruments": {
      "drum": {
        "mark": "◎",
        "lv": 82,
        "cap": 98,
        "potentialCap": 100,
        "growth": 1.2
      },
      "bass": {
        "mark": "△",
        "lv": 34,
        "cap": 64,
        "potentialCap": 84,
        "growth": 0.75
      },
      "chorus": {
        "mark": "△",
        "lv": 20,
        "cap": 46,
        "potentialCap": 60,
        "growth": 0.65
      }
    },
    "growthType": "リズム型",
    "joinDifficulty": "高",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 28,
      "minFans": 135,
      "minFame": 65,
      "minIndustry": 60
    },
    "roleHint": "フェス向けの技術＋リズム型ドラム。",
    "replaceNote": "フェス向けの技術＋リズム型ドラム。"
  },
  {
    "id": "member_mei",
    "defaultName": "メイ",
    "name": "メイ",
    "canRename": true,
    "part": "Ba",
    "joinPhase": "late",
    "joinType": "recruit",
    "genderHint": "female",
    "mainInstrument": "bass",
    "mainGenre": "ポストロック",
    "secondMainGenres": [
      "エモ",
      "ポップ"
    ],
    "subGenres": [
      "ポストロック",
      "エモロック",
      "シティポップ"
    ],
    "weakMainGenres": [
      "メタル"
    ],
    "weakSubGenres": [
      "メタルコア"
    ],
    "stats": {
      "stamina": 58,
      "technique": 60,
      "knowledge": 62,
      "sense": 64,
      "mental": 74,
      "teamwork": 78,
      "rhythm": 72,
      "charisma": 36
    },
    "instruments": {
      "bass": {
        "mark": "◎",
        "lv": 78,
        "cap": 96,
        "potentialCap": 100,
        "growth": 1.14
      },
      "chorus": {
        "mark": "◎",
        "lv": 52,
        "cap": 82,
        "potentialCap": 94,
        "growth": 0.95
      },
      "key": {
        "mark": "△",
        "lv": 34,
        "cap": 64,
        "potentialCap": 86,
        "growth": 0.75,
        "hiddenUpgrade": true
      }
    },
    "growthType": "安定型",
    "joinDifficulty": "高",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 29,
      "minFans": 140,
      "minFame": 65,
      "minIndustry": 65
    },
    "roleHint": "高難度ライブの土台になる後半ベース。",
    "replaceNote": "高難度ライブの土台になる後半ベース。"
  },
  {
    "id": "member_kuon",
    "defaultName": "クオン",
    "name": "クオン",
    "canRename": true,
    "part": "Cho",
    "joinPhase": "late",
    "joinType": "recruit",
    "genderHint": "neutral",
    "mainInstrument": "chorus",
    "mainGenre": "シューゲイザー",
    "secondMainGenres": [
      "エモ",
      "クラシック"
    ],
    "subGenres": [
      "ポストロック",
      "エモロック",
      "クラシカルロック"
    ],
    "weakMainGenres": [
      "パンク"
    ],
    "weakSubGenres": [
      "ハードコア"
    ],
    "stats": {
      "stamina": 42,
      "technique": 54,
      "knowledge": 70,
      "sense": 72,
      "mental": 78,
      "teamwork": 76,
      "rhythm": 48,
      "charisma": 50
    },
    "instruments": {
      "chorus": {
        "mark": "◎",
        "lv": 80,
        "cap": 98,
        "potentialCap": 100,
        "growth": 1.16
      },
      "vocal": {
        "mark": "○",
        "lv": 54,
        "cap": 84,
        "potentialCap": 96,
        "growth": 0.95
      },
      "key": {
        "mark": "○",
        "lv": 52,
        "cap": 82,
        "potentialCap": 96,
        "growth": 0.92
      }
    },
    "growthType": "メンタル型",
    "joinDifficulty": "高",
    "joinCondition": {
      "type": "recruit",
      "minTurn": 30,
      "minFans": 140,
      "minFame": 65,
      "minIndustry": 70
    },
    "roleHint": "メンタル・世界観補助。特殊曲に強い後半Cho。",
    "replaceNote": "メンタル・世界観補助。特殊曲に強い後半Cho。"
  }
]);
/* PR-F 器: portraitIdをidから機械的に付与（既存のmember_xxx命名をそのまま踏襲、内側オブジェクトは非frozenのため代入可） */
MEMBER_DATABASE.forEach(m => { if (!m.portraitId) m.portraitId = m.id; });
DATA.candidateCharacters = clone(MEMBER_DATABASE);

const SUPPORT_MEMBER_DATABASE = Object.freeze([
  {
    "id": "support_yurika",
    "name": "ユリカ",
    "instrument": "chorus",
    "cost": 4500,
    "score": 7,
    "genres": [
      "ポップ",
      "ギターポップ",
      "バラードポップ",
      "エモロック"
    ],
    "note": "歌もの・ポップ系ライブ補助"
  },
  {
    "id": "support_kazuma",
    "name": "カズマ",
    "instrument": "bass",
    "cost": 5500,
    "score": 8,
    "genres": [
      "ロック",
      "ギターロック",
      "メロディックパンク",
      "ミクスチャーロック"
    ],
    "note": "低音補強。Ba不在時の穴埋め"
  },
  {
    "id": "support_iori",
    "name": "イオリ",
    "instrument": "guitar",
    "cost": 5200,
    "score": 8,
    "genres": [
      "ロック",
      "オルタナロック",
      "ポップパンク",
      "エモロック"
    ],
    "note": "小規模ライブ向けGt/Vo補助。実処理はギターサポート"
  },
  {
    "id": "support_momoka",
    "name": "モモカ",
    "instrument": "guitar",
    "cost": 5000,
    "score": 7,
    "genres": [
      "ポップ",
      "ギターポップ",
      "パワーポップ",
      "シティポップ"
    ],
    "note": "キャッチー系ギター補助"
  },
  {
    "id": "support_shigeru",
    "name": "シゲル",
    "instrument": "drum",
    "cost": 7800,
    "score": 11,
    "genres": [
      "パンク",
      "青春パンク",
      "ハードコア",
      "メタルコア"
    ],
    "note": "安定ドラム補助"
  },
  {
    "id": "support_yume",
    "name": "ユメ",
    "instrument": "dj",
    "cost": 9000,
    "score": 12,
    "genres": [
      "ヒップホップ",
      "ラップロック",
      "トラップ",
      "ミクスチャーロック"
    ],
    "note": "ミクスチャー・SNS映え補助"
  },
  {
    "id": "support_taki",
    "name": "タキ",
    "instrument": "key",
    "cost": 7200,
    "score": 10,
    "genres": [
      "ポップ",
      "ピアノロック",
      "ジャズロック",
      "クラシカルロック"
    ],
    "note": "アレンジ・ピアノロック補助"
  },
  {
    "id": "support_arisa",
    "name": "アリサ",
    "instrument": "vocal",
    "cost": 6500,
    "score": 9,
    "genres": [
      "ポップ",
      "ロック",
      "バラードポップ",
      "エモロック"
    ],
    "note": "仮歌・コーラス補助。実処理はボーカルサポート"
  },
  {
    "id": "support_rio",
    "name": "リオ",
    "instrument": "piano",
    "cost": 7600,
    "score": 10,
    "genres": [
      "ピアノロック",
      "ポップ",
      "エモロック",
      "クラシカルロック"
    ],
    "note": "Piano/Synth補助。余韻・鍵盤アレンジに強い"
  },
  {
    "id": "support_natsume",
    "name": "ナツメ",
    "instrument": "brass",
    "cost": 8200,
    "score": 10,
    "genres": [
      "ジャズ",
      "フュージョン",
      "ミクスチャー",
      "フェスロック"
    ],
    "note": "Sax/Brass補助。フェス映え・華やかさに強い"
  },
  {
    "id": "support_mitsuki",
    "name": "ミツキ",
    "instrument": "percussion",
    "cost": 6800,
    "score": 8,
    "genres": [
      "パンク",
      "ミクスチャー",
      "ダンスロック",
      "ラップロック"
    ],
    "note": "Percussion補助。リズムとライブ感を足す"
  }
]);
DATA.supportOptions = clone(SUPPORT_MEMBER_DATABASE);
const LEGACY_GENERIC_SUPPORT_IDS = Object.freeze(["sup_guitar", "sup_bass", "sup_drum", "sup_key", "sup_dj", "sup_other"]);

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
function instLabel(inst) { return { vocal:"Vo", guitar:"Gt", bass:"Ba", guitar_vocal:"GtVo", bass_vocal:"BaVo", drum:"Dr", key:"Key", dj:"DJ", chorus:"Cho", other:"Pf等", piano:"Pf/Syn", brass:"Sax/Br", percussion:"Perc", off:"休" }[inst] || inst; }
function instFullLabel(inst) { return { vocal:"ボーカル", guitar:"ギター", bass:"ベース", guitar_vocal:"ギターボーカル", bass_vocal:"ベースボーカル", drum:"ドラム", key:"キーボード/シンセ", dj:"DJ", chorus:"コーラス", other:"ピアノなど", piano:"ピアノ/シンセ", brass:"サックス/ブラス", percussion:"パーカッション", off:"ステージ外" }[inst] || inst; }
function statLabel(key) { return { stamina:"体力", technique:"技術", knowledge:"知識", sense:"センス", mental:"メンタル", teamwork:"協調性", rhythm:"リズム", charisma:"カリスマ" }[key] || key; }
function skillById(id) { return SKILL_DATA.find(s => s.id === id) || null; }
function hasSkill(id) { return (state.playerSkills || []).includes(id); }
function unlockSkill(id, reason="") {
  if (hasSkill(id)) return false;
  const skill = skillById(id);
  if (!skill) return false;
  state.playerSkills.push(id);
  showEventPopup("SKILL UNLOCKED!!", `${skill.name}を覚えた！\n${skill.desc}${reason ? "\nきっかけ：" + reason : ""}`, skill.rarity === "レア" ? "rare" : "event", v043eIcon("spark"));
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
/* PR-F 器: パート→ステンシル型（story-typeの語彙を再利用したミニ版）。未知パートはmemberへフォールバック */
function memberPortraitTypeClass(part) {
  const p = String(part || "");
  if (p === "player") return "player";
  if (/Gt/.test(p)) return "gtvo";
  if (/Ba\/Vo/.test(p)) return "bavo";
  if (/Ba/.test(p)) return "bass";
  if (/Vo/.test(p)) return "vocal";
  if (p === "Dr") return "short";
  if (p === "Key") return "long";
  return "member";
}
/* PR-F 器: 3段フォールバック（画像→ステンシルシルエット→イニシャル）の共通レンダラ。
   portraitIdが未指定/画像が404の場合はimgタグをJS側で除去し、下層のステンシル/イニシャルへ委譲する。 */
function renderAvatarPortrait(portraitId, name, part, extraClass="") {
  const typeClass = memberPortraitTypeClass(part);
  const id = portraitId || "";
  const initialsHtml = escapeHtml(initials(name));
  const imgHtml = id ? `<img src="assets/char/${escapeHtml(id)}_avatar.webp" alt="" loading="lazy" onerror="this.remove()">` : "";
  return `<div class="avatar portrait-slot has-stencil pt-${typeClass} ${extraClass}"><b class="portrait-initials">${initialsHtml}</b><i class="portrait-stencil" aria-hidden="true"></i>${imgHtml}</div>`;
}

const DISCOVERY_KEY = "underground_v014_discovered_subgenres"; // v0.2.4でも継続利用
const LEGACY_SAVE_KEY = "underground_v020_save";
const LEGACY_AUTOSAVE_KEY = "underground_v020_autosave";
const SAVE_SLOT_COUNT = 2;
const SAVE_SLOT_PREFIX = "underground_v0310_slot_";
const AUTOSAVE_SLOT_PREFIX = "underground_v0310_autoslot_";
const CURRENT_SLOT_KEY = "underground_v0310_current_slot";


/* ------------------------------------------------------------------
 * v0.3.62: 簡易ノベルイベント / 開発用モード
 * ------------------------------------------------------------------ */
const STORY_SCENE_DATABASE = {
  first_afterparty_triple_arrows: {
    id: "first_afterparty_triple_arrows",
    title: "はじめての打ち上げ",
    background: "izakaya",
    actors: [
      { id:"sil_takanashi", name:"タカナシ", position:"left", type:"gtvo" },
      { id:"sil_subaru", name:"スバル", position:"center", type:"bass" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"タカナシ", portrait:"sil_takanashi", text:"お前ら、荒いけどなんか残るんだよな。" },
      { speaker:"スバル", portrait:"sil_subaru", text:"初ライブであれだけやれたら十分だろ。ちゃんと客、見てたぞ。" },
      { speaker:"主人公", portrait:"sil_player", text:"ありがとうございます。まだ必死で……。" },
      { speaker:"タカナシ", portrait:"sil_takanashi", text:"今度、うちの企画あるんだよ。よかったら来いよ。" },
      { speaker:"主人公", portrait:"sil_player", text:"ぜひ！また、ライブハウスで会いましょう。" },
      { speaker:"スバル", portrait:"sil_subaru", text:"じゃ、連絡先交換な。ここからが始まりだぜ。" }
    ],
    rewards: [
      { label:"Triple Arrowsとの交流が深まった" },
      { label:"メンタル・協調性・カリスマが少し上がった" },
      { label:"Triple Arrowsと連絡先を交換した" },
      { label:"疲労 +{fatigueGain}%" }
    ],
    afterLog: "ノベルイベント：はじめての打ち上げを見た。"
  },
  triple_arrows_invite: {
    id: "triple_arrows_invite",
    title: "Triple Arrowsからの誘い",
    background: "phone_room",
    actors: [
      { id:"sil_player", name:"主人公", position:"right", type:"player" },
      { id:"sil_takanashi", name:"タカナシ", position:"left", type:"gtvo" }
    ],
    scenes: [
      { speaker:"主人公", portrait:"sil_player", text:"……タカナシさんからメールだ。" },
      { speaker:"タカナシ", portrait:"sil_takanashi", text:"この前のライブ、お疲れ。まだ荒いけど、お前らきっとすごくなるぜ。" },
      { speaker:"タカナシ", portrait:"sil_takanashi", text:"この前言ってた企画ライブ、よかったら出てくれよ。" },
      { speaker:"主人公", portrait:"sil_player", text:"次のライブ……。よし、受ける準備をしよう。" }
    ],
    rewards: [
      { label:"携帯にライブ招待メールが届いた" },
      { label:"{offerTurn}T のTriple Arrows企画ライブに参加できる。携帯メールで「ライブ参加の返信」を送ると予定表に追加される" }
    ],
    afterLog: "ノベルイベント：Triple Arrowsからの誘いを見た。"
  },
  carbons_after_live: {
    id: "carbons_after_live",
    title: "尖った音のあとで",
    background: "backstage",
    actors: [
      { id:"sil_nakiri", name:"ナキリ", position:"left", type:"short" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"ナキリ", portrait:"sil_nakiri", text:"今日のライブ、悪くなかった。……でも、まだ丸い。" },
      { speaker:"主人公", portrait:"sil_player", text:"丸い？" },
      { speaker:"ナキリ", portrait:"sil_nakiri", text:"削れよ。傷つくくらい尖った音の方が、残る時もある。" },
      { speaker:"主人公", portrait:"sil_player", text:"……覚えておきます。" }
    ],
    rewards: [
      { label:"CARBONSと初めて対バンした" },
      { label:"CARBONSとの交流が少し深まった" },
      { label:"バンド図鑑に CARBONS が登録された" }
    ],
    afterLog: "ノベルイベント：CARBONS初対バンイベントを見た。"
  },
  shelter_encounter: {
    id: "shelter_encounter",
    title: "ひとつ上のステージ",
    background: "fes_backstage",
    actors: [
      { id:"sil_clio", name:"クリオ", position:"left", type:"long" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"クリオ", portrait:"sil_clio", text:"地下で鳴らしてる音って、ちゃんと上まで届くんだよ。" },
      { speaker:"主人公", portrait:"sil_player", text:"上……フェスとか、もっと大きい場所ですか。" },
      { speaker:"クリオ", portrait:"sil_clio", text:"そう。けど、背伸びじゃ届かない。足元のライブを、毎回ちゃんと燃やすんだ。" },
      { speaker:"主人公", portrait:"sil_player", text:"俺たちも、そこまで行きたいです。" }
    ],
    rewards: [
      { label:"SHELTERがライブを見ていた" },
      { label:"バンド図鑑に SHELTER が登録された" },
      { label:"SHELTERとの交流が少し深まった" }
    ],
    afterLog: "ノベルイベント：SHELTER遭遇イベントを見た。"
  },
  member_join_generic: {
    id: "member_join_generic",
    title: "新メンバー加入",
    background: "studio",
    actors: [
      { id:"sil_new_member", name:"加入メンバー", position:"left", type:"member" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"{memberName}", portrait:"sil_new_member", text:"募集見ました。まだメンバー、探してますか？" },
      { speaker:"主人公", portrait:"sil_player", text:"もちろん。担当は？" },
      { speaker:"{memberName}", portrait:"sil_new_member", text:"{part}です。{partLine}" },
      { speaker:"主人公", portrait:"sil_player", text:"じゃあ、一回合わせてみよう。よろしく、{memberName}。" },
      { speaker:"主人公", portrait:"sil_player", text:"{partFlavor}" }
    ],
    rewards: [
      { label:"{memberName} が{joinStatus}した" },
      { label:"担当：{part} / 得意：{mainGenre}" },
      { label:"{partFlavor}" }
    ],
    afterLog: "ノベルイベント：新メンバー加入イベントを見た。"
  }
  ,pachi_pachi_first_live: {
    id: "pachi_pachi_first_live",
    title: "客席を巻き込む音",
    background: "livehouse",
    actors: [
      { id:"sil_mike", name:"ミケ", position:"left", type:"gtvo" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"ミケ", portrait:"sil_mike", text:"今日、客席の手拍子ちょっと聞こえた？" },
      { speaker:"主人公", portrait:"sil_player", text:"はい。Pachi-Pachiの時、一気に空気が変わってました。" },
      { speaker:"ミケ", portrait:"sil_mike", text:"うちら、曲だけじゃなくて、フロアごと鳴らしたいんだよね。" },
      { speaker:"主人公", portrait:"sil_player", text:"客席も演奏の一部……。すごいライブでした。" }
    ],
    rewards: [
      { label:"Pachi-Pachiと初めて対バンした" },
      { label:"Pachi-Pachiとの交流が少し深まった" },
      { label:"客席を巻き込むライブのヒントを得た" }
    ],
    afterLog: "ノベルイベント：Pachi-Pachi初対バンイベントを見た。"
  },
  pachi_pachi_sweetness_unlock: {
    id: "pachi_pachi_sweetness_unlock",
    title: "弾ける甘味",
    background: "backstage",
    actors: [
      { id:"sil_mike", name:"ミケ", position:"left", type:"gtvo" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"ミケ", portrait:"sil_mike", text:"2回目、ちゃんと変わってた。前より客席を見てたでしょ。" },
      { speaker:"主人公", portrait:"sil_player", text:"Pachi-Pachiのライブを見て、客席との距離を意識しました。" },
      { speaker:"ミケ", portrait:"sil_mike", text:"甘いだけじゃ残らない。でも、弾ける瞬間があると忘れられないんだよ。" },
      { speaker:"主人公", portrait:"sil_player", text:"その感覚、少し分かった気がします。" }
    ],
    rewards: [
      { label:"交流スキル「弾ける甘味」を獲得" },
      { label:"Pachi-Pachiとの交流が深まった" },
      { label:"客席巻き込み評価のヒントを得た" }
    ],
    afterLog: "ノベルイベント：弾ける甘味獲得イベントを見た。"
  },
  carbons_diamond_rough: {
    id: "carbons_diamond_rough",
    title: "ダイヤの原石",
    background: "backstage",
    actors: [
      { id:"sil_nakiri", name:"ナキリ", position:"left", type:"short" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"ナキリ", portrait:"sil_nakiri", text:"今日のは、少しだけ刺さった。" },
      { speaker:"主人公", portrait:"sil_player", text:"少しだけ、ですか。" },
      { speaker:"ナキリ", portrait:"sil_nakiri", text:"まだ石ころだよ。でも、磨く価値はある。" },
      { speaker:"主人公", portrait:"sil_player", text:"次は、もっと尖らせてきます。" }
    ],
    rewards: [
      { label:"交流スキル「ダイヤの原石」を獲得" },
      { label:"CARBONSとの交流が深まった" },
      { label:"再登場フラグが立った" }
    ],
    afterLog: "ノベルイベント：ダイヤの原石獲得イベントを見た。"
  },
  under_fes_before: {
    id: "under_fes_before",
    title: "UNDER FES前夜",
    background: "livehouse",
    actors: [
      { id:"sil_player", name:"主人公", position:"right", type:"player" },
      { id:"sil_staff", name:"ライブハウス店長", position:"left", type:"short" }
    ],
    scenes: [
      { speaker:"ライブハウス店長", portrait:"sil_staff", text:"いよいよUNDER FESだな。ここから先は、ただ出るだけじゃ残らない。" },
      { speaker:"主人公", portrait:"sil_player", text:"オリジナル曲、ライブ評価、ファン……全部、今までの積み重ねですね。" },
      { speaker:"ライブハウス店長", portrait:"sil_staff", text:"そうだ。地下で鳴らした音を、ちゃんと持っていけ。" },
      { speaker:"主人公", portrait:"sil_player", text:"行ってきます。" }
    ],
    rewards: [
      { label:"30T UNDER FESが近い" },
      { label:"フェス条件と疲労を確認しよう" },
      { label:"セトリと代表曲を見直すタイミング" }
    ],
    afterLog: "ノベルイベント：UNDER FES前夜を見た。"
  },
  shelter_rock_spirit: {
    id: "shelter_rock_spirit",
    title: "ロック魂",
    background: "fes_backstage",
    actors: [
      { id:"sil_clio", name:"クリオ", position:"left", type:"long" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"クリオ", portrait:"sil_clio", text:"技術だけで上に行けるなら、みんなもう行ってる。" },
      { speaker:"主人公", portrait:"sil_player", text:"じゃあ、何が必要なんですか。" },
      { speaker:"クリオ", portrait:"sil_clio", text:"最後に残るのは、ステージから逃げない音だよ。" },
      { speaker:"主人公", portrait:"sil_player", text:"……ロック魂、ってやつですか。" }
    ],
    rewards: [
      { label:"交流スキル「ロック魂」を獲得" },
      { label:"SHELTERとの交流が深まった" }
    ],
    afterLog: "ノベルイベント：ロック魂獲得イベントを見た。"
  },
  triple_arrows_next_arrow: {
    id: "triple_arrows_next_arrow",
    title: "次の矢印",
    background: "backstage",
    actors: [
      { id:"sil_takanashi", name:"タカナシ", position:"left", type:"gtvo" },
      { id:"sil_subaru", name:"スバル", position:"center", type:"bass" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"タカナシ", portrait:"sil_takanashi", text:"最初に会った時より、音が前に飛ぶようになったな。" },
      { speaker:"スバル", portrait:"sil_subaru", text:"でも、まだ矢印は一本だ。次は客席にも、対バンにも向けろ。" },
      { speaker:"主人公", portrait:"sil_player", text:"自分たちだけじゃなく、場ごと前に進める感じですね。" }
    ],
    rewards: [
      { label:"Triple Arrowsとの追加交流" },
      { label:"再戦後の短編イベント土台" }
    ],
    afterLog: "ノベルイベント：Triple Arrows追加交流を見た。"
  },
  carbons_polish_talk: {
    id: "carbons_polish_talk",
    title: "磨くほど尖る",
    background: "backstage",
    actors: [
      { id:"sil_nakiri", name:"ナキリ", position:"left", type:"short" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"ナキリ", portrait:"sil_nakiri", text:"尖るって、雑に暴れることじゃない。" },
      { speaker:"主人公", portrait:"sil_player", text:"削って、残すものを決めるってことですか。" },
      { speaker:"ナキリ", portrait:"sil_nakiri", text:"そう。いらない優しさを削れ。残った音だけが刺さる。" }
    ],
    rewards: [
      { label:"CARBONSとの追加交流" },
      { label:"尖り・オリジナル性イベント土台" }
    ],
    afterLog: "ノベルイベント：CARBONS追加交流を見た。"
  },
  pachi_pachi_floor_sign: {
    id: "pachi_pachi_floor_sign",
    title: "フロアの合図",
    background: "livehouse",
    actors: [
      { id:"sil_mike", name:"ミケ", position:"left", type:"gtvo" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"ミケ", portrait:"sil_mike", text:"手拍子って、お願いするより先にこっちが楽しく鳴ってないと返ってこないよ。" },
      { speaker:"主人公", portrait:"sil_player", text:"合図はステージから出すけど、完成させるのは客席なんですね。" },
      { speaker:"ミケ", portrait:"sil_mike", text:"そうそう。ライブって、ちょっとした共犯だから。" }
    ],
    rewards: [
      { label:"Pachi-Pachiとの追加交流" },
      { label:"客席巻き込みイベント土台" }
    ],
    afterLog: "ノベルイベント：Pachi-Pachi追加交流を見た。"
  },
  shelter_backstage_advice: {
    id: "shelter_backstage_advice",
    title: "崩れない準備",
    background: "fes_backstage",
    actors: [
      { id:"sil_clio", name:"クリオ", position:"left", type:"long" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"クリオ", portrait:"sil_clio", text:"大きいステージほど、派手なことより普通のことが崩れる。" },
      { speaker:"主人公", portrait:"sil_player", text:"チューニング、入り、曲順……基本の精度ですか。" },
      { speaker:"クリオ", portrait:"sil_clio", text:"うん。ロック魂って、準備を軽く見る言い訳じゃないから。" }
    ],
    rewards: [
      { label:"SHELTERとの追加交流" },
      { label:"GRAND前の安定感イベント土台" }
    ],
    afterLog: "ノベルイベント：SHELTER追加交流を見た。"
  },
  kiwi_greenroom_talk: {
    id: "kiwi_greenroom_talk",
    title: "ゆるい楽屋",
    background: "backstage",
    actors: [
      { id:"sil_mozu", name:"モズ", position:"left", type:"short" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"モズ", portrait:"sil_mozu", text:"力を抜いた音って、手を抜いた音とは違うんだよね。" },
      { speaker:"主人公", portrait:"sil_player", text:"余白があるから、聴く側が入ってこられる……みたいな。" },
      { speaker:"モズ", portrait:"sil_mozu", text:"それそれ。地下でも、息できる場所は作れるよ。" }
    ],
    rewards: [
      { label:"Kiwiとの交流イベント土台" },
      { label:"序盤バンドの短編ノベル追加" }
    ],
    afterLog: "ノベルイベント：Kiwi楽屋交流を見た。"
  },
  magnet_wolf_dirty_riff: {
    id: "magnet_wolf_dirty_riff",
    title: "汚れたリフ",
    background: "studio",
    actors: [
      { id:"sil_daidoji", name:"ダイドウジ", position:"left", type:"gtvo" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"ダイドウジ", portrait:"sil_daidoji", text:"うまいリフより、忘れられないリフだ。多少ヨレても、顔が見える方がいい。" },
      { speaker:"主人公", portrait:"sil_player", text:"整えるだけじゃなく、あえて残す荒さもあるんですね。" },
      { speaker:"ダイドウジ", portrait:"sil_daidoji", text:"そういうこと。泥ついたまま鳴らせ。" }
    ],
    rewards: [
      { label:"magnet wolfとの交流イベント土台" },
      { label:"荒さ・ライブ熱量イベント追加" }
    ],
    afterLog: "ノベルイベント：magnet wolf追加交流を見た。"
  },
  kaede_acoustic_encounter: {
    id: "kaede_acoustic_encounter",
    title: "一人で立つ音",
    background: "livehouse",
    actors: [
      { id:"sil_kaede", name:"カエデ", position:"left", type:"gtvo" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"カエデ", portrait:"sil_kaede", text:"バンドの音は強い。でも、一人で立つ音を知らないと、言葉が埋もれる。" },
      { speaker:"主人公", portrait:"sil_player", text:"弾き語りなのに、会場の奥まで届いてました。" },
      { speaker:"カエデ", portrait:"sil_kaede", text:"届かせるのは音量じゃないよ。一行目で空気を変えるんだ。" }
    ],
    rewards: [
      { label:"KAEDEをバンド図鑑に登録" },
      { label:"弾き語りイベント土台" }
    ],
    afterLog: "ノベルイベント：KAEDE遭遇イベントを見た。"
  },
  kaede_one_phrase: {
    id: "kaede_one_phrase",
    title: "一行目の温度",
    background: "phone_room",
    actors: [
      { id:"sil_kaede", name:"カエデ", position:"left", type:"gtvo" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"カエデ", portrait:"sil_kaede", text:"歌詞の一行目は、挨拶じゃない。火をつける場所。" },
      { speaker:"主人公", portrait:"sil_player", text:"最初の一文で、曲の居場所を決める……。" },
      { speaker:"カエデ", portrait:"sil_kaede", text:"そう。優しくても鋭くてもいい。温度だけは嘘をつかない。" }
    ],
    rewards: [
      { label:"KAEDEとの追加交流" },
      { label:"歌詞・表現イベント土台" }
    ],
    afterLog: "ノベルイベント：KAEDE追加交流を見た。"
  },
  lact_name_drop: {
    id: "lact_name_drop",
    title: "遠くのLACT",
    background: "phone_room",
    actors: [
      { id:"sil_player", name:"主人公", position:"right", type:"player" },
      { id:"sil_news", name:"音楽ニュース", position:"left", type:"short" }
    ],
    scenes: [
      { speaker:"音楽ニュース", portrait:"sil_news", text:"GRAND UNDER FES出演候補の筆頭として、LACTの名前が大きく取り上げられている。" },
      { speaker:"主人公", portrait:"sil_player", text:"同じフェスの情報欄に、いつか自分たちの名前も載せたい。" },
      { speaker:"音楽ニュース", portrait:"sil_news", text:"地下から上がってくる新しい名前にも注目が集まっている。" }
    ],
    rewards: [
      { label:"LACTをバンド図鑑に登録" },
      { label:"GRAND前の目標演出土台" }
    ],
    afterLog: "ノベルイベント：LACT名前出しイベントを見た。"
  },
  lact_backstage_shadow: {
    id: "lact_backstage_shadow",
    title: "控室の影",
    background: "fes_backstage",
    actors: [
      { id:"sil_largo", name:"ラルゴ", position:"left", type:"long" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"主人公", portrait:"sil_player", text:"今、廊下の奥にいたのって……LACT？" },
      { speaker:"ラルゴ", portrait:"sil_largo", text:"……ステージで会えたら、その時に。" },
      { speaker:"主人公", portrait:"sil_player", text:"遠い。でも、もう見えない距離じゃない。" }
    ],
    rewards: [
      { label:"LACTとの接近演出土台" },
      { label:"GRAND直前の短編イベント追加" }
    ],
    afterLog: "ノベルイベント：LACT控室イベントを見た。"
  },
  in_bab_fan_pull_talk: {
    id: "in_bab_fan_pull_talk",
    title: "連れていく立ち方",
    background: "backstage",
    actors: [
      { id:"sil_nasu", name:"Nasu", position:"left", type:"vocal" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"Nasu", portrait:"sil_nasu", text:"客席を奪うって、強く歌うだけじゃないんだよね。" },
      { speaker:"主人公", portrait:"sil_player", text:"目線とか、間の取り方ですか。" },
      { speaker:"Nasu", portrait:"sil_nasu", text:"そう。最初の一歩で、ついてきたいと思わせる。" }
    ],
    rewards: [
      { label:"IN-BABとの追加交流" },
      { label:"ファンを引っ張るライブ感のヒント" }
    ],
    afterLog: "ノベルイベント：IN-BAB追加交流を見た。"
  },
  polaris_afterglow_lesson: {
    id: "polaris_afterglow_lesson",
    title: "余韻の置き場所",
    background: "livehouse",
    actors: [
      { id:"sil_hail", name:"ヘイル", position:"left", type:"vocal" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"ヘイル", portrait:"sil_hail", text:"強い曲を並べるだけだと、光が全部同じになる。" },
      { speaker:"主人公", portrait:"sil_player", text:"曲順で、暗い場所や余白を作るんですね。" },
      { speaker:"ヘイル", portrait:"sil_hail", text:"うん。客席が息を吸う場所まで、セットリストに入れて。" }
    ],
    rewards: [
      { label:"POLARISとの追加交流" },
      { label:"セトリと余韻のヒント" }
    ],
    afterLog: "ノベルイベント：POLARIS追加交流を見た。"
  },
  jack_bomb_blast_check: {
    id: "jack_bomb_blast_check",
    title: "爆発のあと",
    background: "backstage",
    actors: [
      { id:"sil_araka", name:"アラカ", position:"left", type:"bavo" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"アラカ", portrait:"sil_araka", text:"最初に爆発するのは簡単だ。問題は、最後まで火を残すことだな。" },
      { speaker:"主人公", portrait:"sil_player", text:"盛り上げきって、崩さず終わる……。" },
      { speaker:"アラカ", portrait:"sil_araka", text:"そう。爆弾にも導火線の長さがある。" }
    ],
    rewards: [
      { label:"JACK BOMBとの追加交流" },
      { label:"ライブ後半の熱量維持のヒント" }
    ],
    afterLog: "ノベルイベント：JACK BOMB追加交流を見た。"
  },
  hyper_marmoty_shout_circle: {
    id: "hyper_marmoty_shout_circle",
    title: "まっすぐな円陣",
    background: "backstage",
    actors: [
      { id:"sil_yamamoto", name:"ヤマモト", position:"left", type:"vocal" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"ヤマモト", portrait:"sil_yamamoto", text:"うまく言えない時ほど、腹から言えば届く時がある！" },
      { speaker:"主人公", portrait:"sil_player", text:"技術より先に、逃げない声ですね。" },
      { speaker:"ヤマモト", portrait:"sil_yamamoto", text:"そう！　真っ直ぐは、ちゃんと鍛えれば武器になる！" }
    ],
    rewards: [
      { label:"HYPER MARMOTYとの追加交流" },
      { label:"シャウトとメンタルのヒント" }
    ],
    afterLog: "ノベルイベント：HYPER MARMOTY追加交流を見た。"
  },
  ultimate_quokkas_happy_rhythm: {
    id: "ultimate_quokkas_happy_rhythm",
    title: "笑顔の裏拍",
    background: "backstage",
    actors: [
      { id:"sil_waraji", name:"ワラジ", position:"left", type:"bavo" },
      { id:"sil_player", name:"主人公", position:"right", type:"player" }
    ],
    scenes: [
      { speaker:"ワラジ", portrait:"sil_waraji", text:"楽しい曲ほど、足元のリズムはまじめに刻むんだ。" },
      { speaker:"主人公", portrait:"sil_player", text:"笑ってるのに、演奏はすごくタイトでした。" },
      { speaker:"ワラジ", portrait:"sil_waraji", text:"笑顔を崩さないために、裏でめちゃくちゃ支えてる。" }
    ],
    rewards: [
      { label:"ultimate quokkasとの追加交流" },
      { label:"明るいライブとリズムのヒント" }
    ],
    afterLog: "ノベルイベント：ultimate quokkas追加交流を見た。"
  },
  rumble_sand_stage_video: {
    id: "rumble_sand_stage_video",
    title: "砂嵐の映像",
    background: "phone_room",
    actors: [
      { id:"sil_player", name:"主人公", position:"right", type:"player" },
      { id:"sil_news", name:"ライブ映像", position:"left", type:"short" }
    ],
    scenes: [
      { speaker:"ライブ映像", portrait:"sil_news", text:"RUMBLE SANDの大型ステージ映像が流れている。低音が画面越しでも重い。" },
      { speaker:"主人公", portrait:"sil_player", text:"同じ曲でも、広い場所で鳴らすには別の強さがいる。" },
      { speaker:"ライブ映像", portrait:"sil_news", text:"客席の奥まで、砂嵐みたいな音圧が届いている。" }
    ],
    rewards: [
      { label:"RUMBLE SANDのステージ研究" },
      { label:"大型ステージ演出のヒント" }
    ],
    afterLog: "ノベルイベント：RUMBLE SAND研究イベントを見た。"
  },
  neon_reef_deep_blue_note: {
    id: "neon_reef_deep_blue_note",
    title: "深青の評",
    background: "phone_room",
    actors: [
      { id:"sil_player", name:"主人公", position:"right", type:"player" },
      { id:"sil_news", name:"音楽評", position:"left", type:"short" }
    ],
    scenes: [
      { speaker:"音楽評", portrait:"sil_news", text:"Neon Reefのライブは、完成されすぎていて逆に静けさが残る。" },
      { speaker:"主人公", portrait:"sil_player", text:"派手さだけじゃなくて、引き算まで設計されてる……。" },
      { speaker:"音楽評", portrait:"sil_news", text:"深い青の底に、音の輪郭だけが光っていた。" }
    ],
    rewards: [
      { label:"Neon Reefのステージ研究" },
      { label:"完成度と演出のヒント" }
    ],
    afterLog: "ノベルイベント：Neon Reef研究イベントを見た。"
  }

};

function storyEventOptions() {
  return Object.values(STORY_SCENE_DATABASE).map(ev => ({ id:ev.id, title:ev.title }));
}
function currentStoryEventDef() {
  const active = state && state.activeStoryEvent;
  return active ? STORY_SCENE_DATABASE[active.id] : null;
}
function formatStoryText(text, context={}) {
  return String(text || "").replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => {
    const v = context && Object.prototype.hasOwnProperty.call(context, key) ? context[key] : "";
    return String(v);
  });
}
function startStoryEvent(id, opts={}) {
  if (!novelEventsOn()) return false;
  if (state.activeStoryEvent) return false; // 再生中の上書き防止。呼び出し側はポップアップへフォールバックする。
  const ev = STORY_SCENE_DATABASE[id];
  if (!ev) return false;
  v043dResetConversationLog(v043dConversationLogContextKey("story", id));
  state.activeStoryEvent = { id, step:0, result:false, rewardsApplied:false, context:opts.context || {}, returnView:state.view || "home" };
  if (!opts.silent) render();
  return true;
}
function applyStoryRewardsOnce() {
  const active = state.activeStoryEvent;
  const ev = currentStoryEventDef();
  if (!active || !ev || active.rewardsApplied) return;
  active.rewardsApplied = true;
  if (ev.afterLog) log(ev.afterLog, "event");
}
let progressionButtonGateGeneration = 0;
let progressionButtonGateTimer = null;
function armProgressionButtonGate(selector) {
  const buttons = Array.from(document.querySelectorAll(selector || "") || []);
  if (!buttons.length) return;
  const generation = ++progressionButtonGateGeneration;
  if (progressionButtonGateTimer) clearTimeout(progressionButtonGateTimer);
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.dataset.progressGateGeneration = String(generation);
    btn.classList.add("progress-gate-pending");
    btn.classList.remove("progress-gate-ready", "progress-gate-consumed");
    btn.setAttribute("aria-disabled", "true");
  });
  progressionButtonGateTimer = setTimeout(() => {
    buttons.forEach(btn => {
      if (btn.isConnected === false) return;
      if (btn.dataset.progressGateGeneration !== String(generation)) return;
      btn.disabled = false;
      btn.classList.remove("progress-gate-pending");
      btn.classList.add("progress-gate-ready");
      btn.removeAttribute("aria-disabled");
    });
  }, 300);
}
function runProgressionButtonAction(btn, action) {
  if (!btn || btn.disabled || btn.classList.contains("progress-gate-pending")) return;
  btn.disabled = true;
  btn.classList.add("progress-gate-consumed");
  action();
}
function advanceStoryEvent() {
  const active = state.activeStoryEvent;
  const ev = currentStoryEventDef();
  if (!active || !ev) { state.activeStoryEvent = null; v043dResetConversationLog(); render(); return; }
  if (active.result) { finishStoryEvent(); return; }
  const scenes = Array.isArray(ev.scenes) ? ev.scenes : [];
  if (active.step < scenes.length - 1) active.step += 1;
  else {
    applyStoryRewardsOnce();
    if (Array.isArray(ev.rewards) && ev.rewards.length) active.result = true;
    else { finishStoryEvent(); return; }
  }
  render();
}
function skipStoryEvent() {
  applyStoryRewardsOnce();
  finishStoryEvent();
}
function finishStoryEvent() {
  state.activeStoryEvent = null;
  v043dResetConversationLog();
  if (maybeFinishPendingTurnAdvanceAfterPopups()) return;
  render();
}
function renderStoryEventOverlay() {
  const active = state.activeStoryEvent || {};
  const ev = currentStoryEventDef();
  if (!ev) return "";
  const ctx = active.context || {};
  const contextKey = v043dConversationLogContextKey("story", ev.id || active.id || "event");
  const logEntries = v043dStoryLogEntries(ev, active);
  const logButton = v043dRenderConversationLogButton(contextKey);
  const logPanel = v043dRenderConversationLogPanel(logEntries, contextKey);
  if (active.result) {
    return `<div class="story-backdrop"><div class="story-stage story-bg-${escapeHtml(ev.background || "livehouse")}">
      <div class="story-result-card"><h2>イベント結果</h2><h3>${escapeHtml(ev.title || "イベント")}</h3>
        <div class="story-result-list">${(ev.rewards || []).map(r => `<div>＋ ${escapeHtml(formatStoryText(r.label || "結果", ctx))}</div>`).join("")}</div>
        <div class="story-result-actions"><button id="storyNextBtn" class="big-action">OK</button>${logButton}</div>
      </div>
      ${logPanel}
    </div></div>`;
  }
  const scenes = Array.isArray(ev.scenes) ? ev.scenes : [];
  const scene = scenes[active.step || 0] || {};
  const actors = Array.isArray(scene.actors) && scene.actors.length ? scene.actors : (ev.actors || []);
  const activePortrait = scene.portrait || "";
  const speaker = formatStoryText(scene.speaker || "", ctx);
  const speakerActor = actors.find(a => a.name === speaker);
  const speakerBandId = speakerActor ? NPC_BAND_MAP[speakerActor.id] : null;
  const speakerAttrs = bandColorAttrs(speakerBandId, speaker || "？？？");
  const body = formatStoryText(scene.text || "", ctx);
  return `<div class="story-backdrop"><div class="story-stage story-bg-${escapeHtml(ev.background || "livehouse")}">
    <div class="story-title-chip">${escapeHtml(ev.title || "イベント")}</div>
    <div class="story-actors">${actors.map(a => `<div class="story-silhouette story-pos-${escapeHtml(a.position || "center")} story-type-${escapeHtml(a.type || "member")} ${a.id === activePortrait ? "active" : ""}" title="${escapeHtml(a.name || "")}"><span></span>${a.id ? `<img src="assets/char/${escapeHtml(a.id)}_story.webp" alt="" loading="lazy" onerror="this.remove()">` : ""}</div>`).join("")}</div>
    <div class="story-dialogue ${scene.bubble ? "bubble" : ""}">
      <div class="story-name ${speakerAttrs.cls}"${speakerAttrs.style}>${escapeHtml(speaker || "？？？")}</div>
      <div class="story-text">${escapeHtml(body).replace(/\n/g,"<br>")}</div>
      <div class="story-actions"><button id="storySkipBtn" class="ghost-btn">スキップ</button><button id="storyNextBtn" class="big-action">${(active.step || 0) >= scenes.length - 1 ? "結果へ" : "次へ"}</button>${logButton}</div>
    </div>
    ${logPanel}
  </div></div>`;
}

function devClearTutorialLocks(reason="DEV") {
  if (!devModeOn()) return;
  state.tutorialStage = "done";
  state.scheduleTutorialStage = "none";
  state.pendingNoSongcraftCommand = null;
  state.songEditor = state.songEditor || { step:"closed" };
  if (state.songEditor.step !== "closed") state.songEditor = { step:"closed" };
  state.activePopup = null;
  state.popupQueue = [];
  state.bandNamePrompt = false;
  state.renameBandNamePrompt = false;
  state.turnNotice = null;
  log(`${reason}：チュートリアル制限を解除した。`, "warn");
}

function devJumpToTurn(turn) {
  if (!devModeOn()) return;
  clearEphemeralStateAfterLoad();
  devClearTutorialLocks("DEVターン移動");
  state.turn = clamp(Number(turn || 1), 1, Math.max(70, state.maxTurn || 50));
  state.maxTurn = Math.max(state.maxTurn || 50, state.turn > 50 ? 70 : 50);
  state.view = "home";
  state.songcraftUsedThisTurn = false;
  state.songcraftUsedCountThisTurn = 0;
  scheduleNextLive();
  log(`DEV：${state.turn}Tへ移動した。`, "event");
  render();
}
function makeDevSong(i) {
  const main = ["ロック","パンク","ポップ","エモ","ミクスチャー","オルタナ","ジャズ","メタル"][i % 8];
  const sub = ["ギターロック","メロディックパンク","パワーポップ","エモロック","ミクスチャーロック","オルタナロック","ジャズロック","メタルコア"][i % 8];
  return {
    id:`dev_song_${Date.now()}_${i}_${rand(100,999)}`,
    title:`DEV曲${i+1}`,
    isCover:false,
    catchy:clamp(45 + i*3, 1, 99), tempo:clamp(45 + i*2, 1, 99), recognition:clamp(25 + i*2, 1, 99),
    lyrics:clamp(45 + i*3, 1, 99), performance:clamp(45 + i*3, 1, 99), trend:clamp(35 + i*2, 1, 99),
    mainGenre:main, subGenre:sub, genre:sub, tags:["DEV","確認用"], standardPoints:i >= 2 ? 3 : 0, representativePoints:i >= 4 ? 3 : 0,
    createdTurn:Math.max(1, (state.turn || 1) - i), livePlays:0, lastLiveTurn:0, lastLiveSlot:0, consecutiveLiveUses:0, mannerism:0, boostLevel:i >= 2 ? 3 : 0,
    theme:"確認", keyword:"DEV / 動作確認", arrange:"通常"
  };
}
function devEnsureSongs(count=7) {
  state.songs = Array.isArray(state.songs) ? state.songs : [];
  while (state.songs.filter(s => !s.isCover).length < count) state.songs.push(makeDevSong(state.songs.length));
  log(`DEV：オリジナル曲を${state.songs.filter(s=>!s.isCover).length}曲まで補充した。`, "event");
}
function devMarkBalanceSongs(profile) {
  const originals = (state.songs || []).filter(s => !s.isCover);
  originals.forEach((song, idx) => {
    song.tags = Array.isArray(song.tags) ? song.tags : [];
    if (idx < Number(profile.representative || 0)) {
      if (!song.tags.includes("定番")) song.tags.push("定番");
      if (!song.tags.includes("代表曲候補")) song.tags.push("代表曲候補");
      song.standardPoints = Math.max(Number(song.standardPoints || 0), 5);
      song.representativePoints = Math.max(Number(song.representativePoints || 0), 3);
      song.recognition = Math.max(Number(song.recognition || 0), 55);
      song.livePlays = Math.max(Number(song.livePlays || 0), 2);
    }
  });
  const fresh = originals[originals.length - 1];
  if (fresh && Number(profile.fresh || 0) > 0) {
    fresh.createdTurn = Math.max(1, (state.turn || 1) - 2);
    fresh.livePlays = Math.min(Number(fresh.livePlays || 0), 1);
    fresh.lastLiveTurn = Math.max(0, (state.turn || 1) - 1);
    fresh.tags = Array.isArray(fresh.tags) ? fresh.tags : [];
    if (!fresh.tags.includes("新しめ")) fresh.tags.push("新しめ");
  }
}
function devApplyBalanceProfile(profileId="grand_border") {
  if (!devModeOn()) return;
  const profile = BALANCE_BASELINE_PROFILES[profileId] || BALANCE_BASELINE_PROFILES.grand_border;
  clearEphemeralStateAfterLoad();
  devClearTutorialLocks("DEVバランス値セット");
  state.turn = profile.turn;
  state.maxTurn = Math.max(state.maxTurn || 50, profile.turn > 50 ? 70 : 50);
  state.liveCount = Math.max(Number(state.liveCount || 0), profile.turn >= 30 ? 4 : 1);
  state.band.fans = profile.fans;
  state.band.fame = profile.fame;
  state.band.industry = profile.industry;
  state.band.trust = profile.trust;
  state.band.fatigue = profile.fatigue;
  devEnsureSongs(profile.songs);
  devMarkBalanceSongs(profile);
  state.liveResultHistory = Array.isArray(state.liveResultHistory) ? state.liveResultHistory : [];
  state.liveResultHistory.push({
    title: profile.turn >= 50 ? "DEV GRAND直前確認ライブ" : "DEV UNDER確認ライブ",
    rank: profile.lastRank,
    total: profile.lastTotal,
    originalCount: Math.min(5, originalSongCountForBalance()),
    venueId: profile.turn >= 50 ? "big_stage" : "warehouse",
    liveTypeLabel: "DEV確認",
    setlistIds: (state.songs || []).filter(s => !s.isCover).slice(0, 5).map(s => s.id),
    revenue: { attendees: 0, ownAudience: 0, partnerAudience: 0, finalProfit: 0 }
  });
  scheduleNextLive();
  state.view = "dev";
  state.activePopup = { title:`DEV：${profile.label}`, body:formatGrandConditionSnapshot(), type:"event", icon:v043eIcon("chart") };
  log(`DEV：${profile.label}の仮数値を反映した。`, "event");
  render();
}
function devShowGrandCheck() {
  if (!devModeOn()) return;
  state.activePopup = { title:"DEV：GRAND条件チェック", body:formatGrandConditionSnapshot(), type:grandConditionSnapshot().ok ? "rare" : "warn", icon:v043eIcon("check") };
  render();
}
function devPrepareBandEventSeed() {
  if (!devModeOn()) return;
  clearEphemeralStateAfterLoad();
  devClearTutorialLocks("DEVバンドイベント確認");
  state.turn = 28;
  state.liveCount = Math.max(Number(state.liveCount || 0), 3);
  state.band.fans = Math.max(Number(state.band.fans || 0), 155);
  state.band.fame = Math.max(Number(state.band.fame || 0), 110);
  state.band.industry = Math.max(Number(state.band.industry || 0), 95);
  devEnsureSongs(7);
  normalizeBandSystemState();
  const bb = bandBookRef();
  ["triple_arrows","carbons","pachi_pachi","shelter","kiwi","magnet_wolf","kaede","lact"].forEach(id => discoverBand(id));
  bandEntry("triple_arrows").battleCount = Math.max(bandEntry("triple_arrows").battleCount || 0, 2);
  bandEntry("carbons").battleCount = Math.max(bandEntry("carbons").battleCount || 0, 1);
  bandEntry("pachi_pachi").battleCount = Math.max(bandEntry("pachi_pachi").battleCount || 0, 2);
  bandEntry("kiwi").battleCount = Math.max(bandEntry("kiwi").battleCount || 0, 1);
  bandEntry("magnet_wolf").battleCount = Math.max(bandEntry("magnet_wolf").battleCount || 0, 1);
  bb.flags.flag_triple_arrows_invite_done = true;
  bb.flags.flag_carbons_return = true;
  bb.seenEvents.event_triple_arrows_invite_live = bb.seenEvents.event_triple_arrows_invite_live || 8;
  bb.seenEvents.event_carbons_first_battle = bb.seenEvents.event_carbons_first_battle || 10;
  bb.seenEvents.event_pachi_pachi_first_battle = bb.seenEvents.event_pachi_pachi_first_battle || 18;
  bb.seenEvents.event_pachi_pachi_second_success = bb.seenEvents.event_pachi_pachi_second_success || 22;
  bb.seenEvents.event_shelter_watched_live = bb.seenEvents.event_shelter_watched_live || 25;
  bb.seenEvents.event_shelter_after_live_talk = bb.seenEvents.event_shelter_after_live_talk || 26;
  bb.seenEvents.event_kiwi_random_battle = bb.seenEvents.event_kiwi_random_battle || 7;
  bb.seenEvents.event_magnet_wolf_battle = bb.seenEvents.event_magnet_wolf_battle || 12;
  bb.seenEvents.event_kaede_acoustic_encounter = bb.seenEvents.event_kaede_acoustic_encounter || 27;
  bb.seenEvents.event_lact_name_drop = bb.seenEvents.event_lact_name_drop || 40;
  bb.lastBattle = { bandIds:["magnet_wolf"], bandId:"magnet_wolf", result:"success", rank:"A", total:78, turn:state.turn };
  state.activePopup = { title:"DEV：主要バンドイベント土台", body:"優先8組の図鑑登録・前提フラグ・対バン回数を仮セットしました。\nDEVのノベルイベント再生、またはターン開始/ライブ後イベントの発火確認に使えます。", type:"event", icon:v043eIcon("spark") };
  log("DEV：主要バンドイベント確認用の前提値をセットした。", "event");
  render();
}
function devApplyStatsFromForm() {
  const num = id => Number(document.getElementById(id)?.value || 0);
  state.band.funds = num("devFunds");
  state.band.fans = num("devFans");
  state.band.fame = num("devFame");
  state.band.industry = num("devIndustry");
  state.band.trust = num("devTrust");
  state.band.fatigue = clamp(num("devFatigue"), 0, 100);
  log("DEV：バンドステータスを反映した。", "event");
  render();
}
function devAddApplicantById(id="") {
  mergeLatestCandidatesIntoState();
  const all = [...(state.candidates || []), ...Object.values(MEMBER_DATABASE || {})];
  const found = all.find(c => c.id === id) || state.candidates?.[0] || Object.values(MEMBER_DATABASE || {})[0];
  if (!found) return;
  const applicant = clone(found);
  applicant.devForced = true; // DEV提示：加入条件ゲートを免除して確認できるようにする
  state.candidates = (state.candidates || []).filter(c => c.id !== applicant.id);
  const list = currentApplicantList();
  if (!list.some(a => a.id === applicant.id)) list.push(applicant);
  setApplicantList(list);
  log(`DEV：加入候補 ${applicant.name} を表示した。`, "event");
  render();
}
function devPrepareStage(stage) {
  if (!devModeOn()) return;
  clearEphemeralStateAfterLoad();
  devClearTutorialLocks("DEVステージ移動");
  if (stage === "initial_live") {
    state.turn = 5; devEnsureSongs(5); state.band.fatigue = 20; state.view = "schedule";
  } else if (stage === "middle_recruit") {
    state.turn = 12; state.band.fans = Math.max(state.band.fans || 0, 90); state.band.fame = Math.max(state.band.fame || 0, 45); state.band.industry = Math.max(state.band.industry || 0, 38); state.view = "command"; mergeLatestCandidatesIntoState();
  } else if (stage === "late_recruit") {
    state.turn = 24; state.band.fans = Math.max(state.band.fans || 0, 170); state.band.fame = Math.max(state.band.fame || 0, 95); state.band.industry = Math.max(state.band.industry || 0, 75); state.view = "command"; mergeLatestCandidatesIntoState();
  } else if (stage === "under_fes") {
    state.turn = 30; devEnsureSongs(5); state.band.fans = Math.max(state.band.fans || 0, 80); state.band.fame = Math.max(state.band.fame || 0, 70); state.band.industry = Math.max(state.band.industry || 0, 60); state.view = "schedule";
  } else if (stage === "grand_fes") {
    state.turn = 50; devEnsureSongs(7); state.band.fans = Math.max(state.band.fans || 0, 190); state.band.fame = Math.max(state.band.fame || 0, 140); state.band.industry = Math.max(state.band.industry || 0, 125); state.view = "schedule";
  }
  scheduleNextLive();
  log(`DEV：${stage} 状態を準備した。`, "event");
  render();
}

function devGroupIsOpen(id, fallback=false) {
  const rec = state.devOpenGroups || {};
  return typeof rec[id] === "boolean" ? rec[id] : !!fallback;
}
function devDetailsAttr(id, fallback=false) {
  return devGroupIsOpen(id, fallback) ? " open" : "";
}

function renderDevScreen() {
  if (!devModeOn()) return `<div class="card"><h2>開発用モードOFF</h2></div>`;
  const storyOptions = storyEventOptions().map(o => `<option value="${escapeHtml(o.id)}">${escapeHtml(o.title)}</option>`).join("");
  const applicantOptions = Object.values(MEMBER_DATABASE || {}).map(m => `<option value="${escapeHtml(m.id)}">${escapeHtml(m.name)} / ${escapeHtml(m.part)}</option>`).join("");
  return `<div class="dev-panel">
    <div class="card dev-card"><div class="section-title"><h2>DEV MODE</h2><span class="badge warn">開発用</span></div>
      <p><small>本番までの動作確認用。ターン移動、ステータス変更、イベント再生、加入候補追加をここから行えます。</small></p>
      <div class="dev-quick-grid">
        <button class="devStageBtn" data-stage="initial_live">5T 初ライブへ</button>
        <button class="devStageBtn" data-stage="middle_recruit">12T 中盤募集へ</button>
        <button class="devStageBtn" data-stage="late_recruit">24T 後半募集へ</button>
        <button class="devStageBtn" data-stage="under_fes">30T UNDERへ</button>
        <button class="devStageBtn" data-stage="grand_fes">50T GRANDへ</button>
      </div>
    </div>
    <div class="card dev-card"><h3>ターン移動</h3><div class="cols"><div><label>指定ターン</label><input id="devTurnInput" type="number" min="1" max="70" value="${state.turn || 1}" /></div></div><button id="devJumpTurnBtn" class="big-action">指定ターンへ移動</button></div>
    <details class="dev-group" data-dev-group="progress"${devDetailsAttr("progress", true)}><summary>▲︎ 進行・数値</summary><div class="card dev-card"><h3>バンドステータス</h3><div class="cols">
      <div><label>資金</label><input id="devFunds" type="number" value="${Number(state.band.funds || 0)}" /></div>
      <div><label>ファン</label><input id="devFans" type="number" value="${Number(state.band.fans || 0)}" /></div>
      <div><label>知名度</label><input id="devFame" type="number" value="${Number(state.band.fame || 0)}" /></div>
      <div><label>業界評価</label><input id="devIndustry" type="number" value="${Number(state.band.industry || 0)}" /></div>
      <div><label>信頼度</label><input id="devTrust" type="number" value="${Number(state.band.trust || 0)}" /></div>
      <div><label>疲労</label><input id="devFatigue" type="number" min="0" max="100" value="${Number(state.band.fatigue || 0)}" /></div>
    </div><button id="devApplyStatsBtn" class="big-action">ステータス反映</button></div>
    </details><details class="dev-group" data-dev-group="events"${devDetailsAttr("events", false)}><summary>♪︎ イベント・候補</summary><div class="card dev-card"><h3>ノベルイベント再生</h3><div class="cols"><div><label>イベント</label><select id="devStorySelect">${storyOptions}</select></div></div><button id="devStartStoryBtn" class="big-action">イベント再生</button></div>
    <div class="card dev-card"><h3>加入候補追加</h3><div class="cols"><div><label>候補</label><select id="devApplicantSelect">${applicantOptions}</select></div></div><button id="devAddApplicantBtn" class="big-action">候補に出す</button><button id="devRecruitBtn" class="ghost-btn">通常募集を1回実行</button></div>
    </details><details class="dev-group" data-dev-group="skills"${devDetailsAttr("skills", false)}><summary>◆︎ スキル・成長</summary><div class="card dev-card"><h3>スキル確認</h3><p><small>主人公：${(state.playerSkills||[]).map(id=>skillById(id)?.name).filter(Boolean).join("・")||"なし"}<br>交流：${Object.entries(state.ownedBandSkills||{}).map(([id,rec])=>{const sk=bandSkillById(id);return sk?`${sk.name}${sk.type==="common"?`Lv${rec.level}`:""}`:"";}).filter(Boolean).join("・")||"なし"}</small></p><div class="cols"><div><label>主人公スキル付与</label><select id="devPlayerSkillSelect">${SKILL_DATA.map(sk=>`<option value="${sk.id}">${escapeHtml(sk.name)}</option>`).join("")}</select></div><div><label>交流スキル付与</label><select id="devBandSkillSelect">${Object.values(BAND_SKILL_DATABASE).filter(sk=>sk.id!=="diamond_shine").map(sk=>`<option value="${sk.id}">${escapeHtml(sk.name)}</option>`).join("")}</select></div></div><button id="devGrantPlayerSkillBtn" class="ghost-btn">主人公スキルを付与</button><button id="devGrantBandSkillBtn" class="ghost-btn">交流スキルを付与</button></div>
    <div class="card dev-card"><h3>成長タイプ確認</h3><p><small>${activeMembers().map(m => escapeHtml(`${m.name}：${growthTypeSummary(m)}`)).join("<br>") || "メンバーなし"}</small></p></div>
    </details><details class="dev-group" data-dev-group="balance"${devDetailsAttr("balance", false)}><summary>▪︎ バランス・補助</summary><div class="card dev-card"><h3>v0.3.66 バランス確認</h3><p><small>${escapeHtml(formatGrandConditionSnapshot()).replace(/\n/g,"<br>")}</small></p><div class="dev-quick-grid"><button id="devGrandCheckBtn" class="ghost-btn">GRAND条件チェック</button><button class="devBalanceProfileBtn" data-profile="under_border">UNDER目安セット</button><button class="devBalanceProfileBtn" data-profile="grand_border">GRAND最低値セット</button><button class="devBalanceProfileBtn" data-profile="grand_strong">GRAND注目枠セット</button><button id="devBandEventSeedBtn" class="ghost-btn">主要バンドイベント土台セット</button></div></div>
    <div class="card dev-card"><h3>補助</h3><button id="devEnsureSongsBtn" class="ghost-btn">オリジナル7曲を補充</button><button id="devClearTutorialBtn" class="ghost-btn">チュートリアル解除</button><button id="devClearEphemeralBtn" class="ghost-btn">一時モーダル状態を破棄</button></div></details>
  </div>`;
}

const SAVE_VERSION = "v0.4.3";
let uiMode = "title";
let selectedSaveSlot = readCurrentSaveSlot();
let v043cUiRuntime = { scheduleTab: "planned", stateRef: null };
let v043dUiRuntime = {
  conversationLogOpen: false,
  contextKey: ""
};

const v043eIconPaths = {
  /* SKIN_ORDER_v2 付録B 確定9種（そのまま使用） */
  home: `<path d="M4.5 12 L12 4.5 L19.5 12"></path><path d="M6.8 12.8 V19.5 H17.2 V12.8"></path><path d="M9.6 19.5 V14.8 H14.4 V19.5 M9.6 16.4 H14.4 M9.6 18 H14.4"></path>`,
  practice: `<path d="M10 6 H20 V19 H4 V6 H8"></path><path d="M4 9.5 H20"></path><circle cx="7" cy="7.8" r="1" fill="currentColor" stroke="none"></circle><circle cx="10.5" cy="7.8" r="1" fill="currentColor" stroke="none"></circle><circle cx="17" cy="7.8" r="1" fill="currentColor" stroke="none"></circle><circle cx="12" cy="14.2" r="3.6"></circle><path d="M9.9 12.1 L14.1 16.3 M14.1 12.1 L9.9 16.3"></path>`,
  song: `<path d="M8.5 6.5 V15.5 M16.5 6.5 V14 M8.5 6.5 H16.5 M8.5 8.7 H16.5"></path><rect x="5.8" y="14.3" width="2.8" height="2.8" transform="rotate(45 7.2 15.7)" fill="currentColor" stroke="none"></rect><rect x="13.8" y="12.8" width="2.8" height="2.8" transform="rotate(45 15.2 14.2)" fill="currentColor" stroke="none"></rect>`,
  audience: `<circle cx="6.5" cy="10.2" r="1.9"></circle><circle cx="12" cy="8.8" r="1.9"></circle><circle cx="17.5" cy="10.2" r="1.9"></circle><path d="M5 12.4 L2.9 10.3 M19 12.4 L21.1 10.3 M10.6 10.6 L8.9 8.9 M13.4 10.6 L15.1 8.9 M6.5 12.4 V17 M12 11 V17 M17.5 12.4 V17 M3.5 17 H20.5"></path>`,
  money: `<circle cx="12" cy="12" r="8" stroke-dasharray="43 7.3" transform="rotate(-60 12 12)"></circle><path d="M8.7 8.2 L12 12.2 M15.3 8.2 L12 12.2 M12 12.2 V16.8 M9.2 14.4 H14.8"></path>`,
  fatigue: `<path d="M9 7.5 H18.5 V16.5 H4.5 V7.5 H7"></path><path d="M20.5 10.5 V13.5"></path><rect x="6.6" y="10" width="2.6" height="4" fill="currentColor" stroke="none"></rect>`,
  mail: `<path d="M10 7 H20 V18 H4 V7 H8"></path><path d="M4 7 L12 15 L20 7"></path>`,
  log: `<path d="M9.5 5.5 H20 V18.5 H4 V5.5 H7.5"></path><path d="M6 8.8 H18"></path><circle cx="9" cy="12.8" r="2.1"></circle><circle cx="15" cy="12.8" r="2.1"></circle><path d="M11.1 12.8 H12.9"></path><path d="M8 18.5 L9.4 16.2 H14.6 L16 18.5"></path>`,
  live: `<circle cx="15.5" cy="8" r="4" stroke-dasharray="21.5 3.6" transform="rotate(-45 15.5 8)"></circle><path d="M13.3 5.8 L17.7 10.2 M17.7 5.8 L13.3 10.2"></path><path d="M12.4 10.4 L6.6 16.2 M14.9 12.9 L9.1 18.7 M6.6 16.2 L9.1 18.7"></path>`,
  /* 付録Aの作図規則で新規追加（発注者判定対象） */
  calendar: `<rect x="4" y="5" width="16" height="15"></rect><path d="M8 3 V7 M16 3 V7 M4 10 H20"></path>`,
  band: `<circle cx="8" cy="8" r="3"></circle><circle cx="16" cy="9" r="2.5"></circle><path d="M3.5 20 L4.5 16 H11.5 L12.5 20"></path><path d="M13 19 L13.8 16 H19.2 L20 19"></path>`,
  more: `<circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none"></circle><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"></circle><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none"></circle>`,
  rest: `<circle cx="12" cy="12" r="8"></circle><circle cx="16" cy="9" r="7.5" fill="var(--bg)" stroke="none"></circle>`,
  parttime: `<rect x="4" y="7" width="16" height="11"></rect><path d="M8 7 V5 H16 V7 M4 12 H20 M12 10 V15"></path>`,
  recruit: `<circle cx="9" cy="8" r="3"></circle><path d="M3.5 20 L4.5 16 H13.5 L14.5 20"></path><path d="M17 8 V14 M14 11 H20"></path>`,
  promo: `<path d="M4 13 H7 L16 17 V7 L7 11 H4 V13 Z"></path><path d="M7 13 L8.5 18"></path><path d="M18.5 9.5 L21 8 M18.5 14.5 L21 16"></path>`,
  talk: `<path d="M5 6 H19 V15 H9 L5 19 V6 Z"></path><path d="M8 9.5 H16 M8 12.5 H13"></path>`,
  shop: `<path d="M6 9 H18 L17 20 H7 L6 9 Z"></path><path d="M9 9 V6 H15 V9"></path>`,
  sns: `<path d="M5 5 H19 V15 H8 L5 19 V5 Z"></path><path d="M9 9 H15 M9 12 H13"></path>`,
  book: `<path d="M5 4 H15 V16 H9 V20 L5 16 Z"></path><path d="M5 4 L15 4"></path>`,
  settings: `<circle cx="12" cy="12" r="3"></circle><path d="M12 3 V6 M12 18 V21 M3 12 H6 M18 12 H21 M5.6 5.6 L7.7 7.7 M16.3 16.3 L18.4 18.4 M18.4 5.6 L16.3 7.7 M7.7 16.3 L5.6 18.4"></path>`,
  clock: `<circle cx="12" cy="12" r="8"></circle><path d="M12 7 V12 L15 14"></path>`,
  ticket: `<rect x="4" y="5" width="16" height="14"></rect><circle cx="4" cy="9" r="2" fill="var(--bg)" stroke="none"></circle><circle cx="4" cy="16" r="2" fill="var(--bg)" stroke="none"></circle><path d="M9 5 V19"></path>`,
  fame: `<path d="M12 3 L14.7 8.5 L20.7 9.4 L16.3 13.6 L17.3 19.6 L12 16.8 L6.7 19.6 L7.7 13.6 L3.3 9.4 L9.3 8.5 Z"></path>`,
  industry: `<rect x="4" y="8" width="16" height="11"></rect><path d="M9 8 V5 H15 V8 M4 13 H20 M12 11 V15"></path>`,
  back: `<path d="M15 6 L9 12 L15 18"></path>`,
  close: `<path d="M6 6 L18 18 M18 6 L6 18"></path>`,
  check: `<path d="M5 12 L9 16 L19 6"></path>`,
  warning: `<path d="M12 4 L3.5 19 H20.5 Z"></path><path d="M12 9 V13 M12 16 H12.01"></path>`,
  chat: `<path d="M5 5 H19 V15 H9 L5 19 V5 Z"></path><path d="M9 9 H15 M9 12 H13"></path>`,
  spark: `<circle cx="12" cy="12" r="3.5"></circle><path d="M12 3 V6 M12 18 V21 M3 12 H6 M18 12 H21 M5.6 5.6 L7.7 7.7 M16.3 16.3 L18.4 18.4 M18.4 5.6 L16.3 7.7 M7.7 16.3 L5.6 18.4"></path>`,
  chart: `<path d="M4 20 H20"></path><rect x="6" y="13" width="3" height="7"></rect><rect x="11" y="9" width="3" height="11"></rect><rect x="16" y="5" width="3" height="15"></rect>`,
  tool: `<rect x="6" y="6" width="12" height="12"></rect><path d="M6 6 L11 11 M18 6 L13 11 M6 18 L11 13 M18 18 L13 13"></path>`,
  point: `<path d="M6 12 H17 M12 6 L18 12 L12 18"></path>`,
  moon: `<circle cx="12" cy="12" r="8"></circle><circle cx="16" cy="9" r="7.5" fill="var(--bg)" stroke="none"></circle>`,
  cross: `<path d="M6 6 L18 18 M18 6 L6 18"></path>`,
  drop: `<circle cx="12" cy="15" r="5"></circle><path d="M12 4 L16 11 M12 4 L8 11"></path>`,
  /* PR-I: 携帯アイコン新版（発注者指定図形）。従来はキー未定義でプレースホルダーへフォールバックしていた（SKIN_ORDER v2.1 PR-I） */
  phone: `<path d="M13 3.5 H17 V20.5 H7 V3.5 H11"></path><path d="M10 6.5 H14"></path><path d="M10.5 17.8 H13.5"></path>`
};

function v043eIcon(name, className="") {
  const body = v043eIconPaths[name] || `<rect x="9" y="9" width="6" height="6"></rect>`;
  const cls = className ? ` ${escapeHtml(className)}` : "";
  return `<svg class="v043e-icon${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false">${body}</svg>`;
}

function v043dConversationLogContextKey(kind, id="") {
  return `${kind}:${id || ""}`;
}
function v043dResetConversationLog(contextKey="") {
  v043dUiRuntime.conversationLogOpen = false;
  v043dUiRuntime.contextKey = contextKey || "";
}
function v043dConversationLogIsOpen(contextKey="") {
  return !!(v043dUiRuntime.conversationLogOpen && v043dUiRuntime.contextKey === contextKey);
}
function v043dSetConversationLogOpen(open, contextKey="") {
  if (contextKey) v043dUiRuntime.contextKey = contextKey;
  v043dUiRuntime.conversationLogOpen = !!open;
}
function v043dStoryLogEntries(ev, active={}) {
  const ctx = active.context || {};
  const scenes = Array.isArray(ev?.scenes) ? ev.scenes : [];
  const currentStep = active.result ? scenes.length - 1 : clamp(Number(active.step || 0), 0, Math.max(0, scenes.length - 1));
  const visibleCount = active.result ? scenes.length : currentStep + 1;
  return scenes.slice(0, visibleCount).map((scene, index) => ({
    speaker: formatStoryText(scene.speaker || "？？？", ctx),
    text: formatStoryText(scene.text || "", ctx),
    current: index === currentStep
  })).filter(line => line.text);
}
function v043dOpeningLogEntries(scenes, step) {
  const entries = [];
  const visibleStep = clamp(Number(step || 0), 0, Math.max(0, scenes.length - 1));
  scenes.forEach((scene, sourceIndex) => {
    if (sourceIndex > visibleStep) return;
    if (scene.thought || scene.bandPrompt) return;
    if (scene.poster) {
      entries.push({ speaker: "地の文", text: "フェスのポスターが壁に貼られている。", sourceIndex });
      return;
    }
    if (scene.text) entries.push({ speaker: scene.speaker || "？？？", text: scene.text, sourceIndex });
  });
  const currentScene = scenes[visibleStep] || {};
  const currentIndex = currentScene.thought || currentScene.bandPrompt
    ? -1
    : entries.reduce((last, entry, index) => entry.sourceIndex <= visibleStep ? index : last, -1);
  return entries.map((entry, index) => ({ ...entry, current: index === currentIndex }));
}
function v043dRenderConversationLogButton(contextKey) {
  const expanded = v043dConversationLogIsOpen(contextKey) ? "true" : "false";
  return `<button type="button" class="v043d-conversation-log-btn" data-v043d-log-context="${escapeHtml(contextKey)}" aria-haspopup="dialog" aria-expanded="${expanded}">${v043eIcon("log")}<span>ログ</span></button>`;
}
function v043dRenderConversationLogPanel(entries, contextKey) {
  const open = v043dConversationLogIsOpen(contextKey);
  const rows = entries.length ? entries.map(line => `<article class="v043d-conversation-log-line ${line.current ? "current" : ""}">
    <b>${escapeHtml(line.speaker || "？？？")}</b>
    <p>${escapeHtml(line.text || "").replace(/\n/g, "<br>")}</p>
  </article>`).join("") : `<div class="v043d-conversation-log-empty">まだ表示済みの台詞はありません。</div>`;
  return `<div class="v043d-conversation-log" data-v043d-log-context="${escapeHtml(contextKey)}" role="dialog" aria-modal="true" aria-label="会話ログ" ${open ? "" : "hidden"} aria-hidden="${open ? "false" : "true"}">
    <div class="v043d-conversation-log-card">
      <header><b>会話ログ</b></header>
      <div class="v043d-conversation-log-list">${rows}</div>
      <button type="button" class="v043d-conversation-log-close" data-v043d-log-context="${escapeHtml(contextKey)}">閉じる</button>
    </div>
  </div>`;
}
function v043dRefreshConversationLogDom() {
  document.querySelectorAll(".v043d-conversation-log").forEach(panel => {
    const key = panel.dataset.v043dLogContext || "";
    const open = v043dConversationLogIsOpen(key);
    panel.hidden = !open;
    panel.setAttribute("aria-hidden", open ? "false" : "true");
  });
  document.querySelectorAll(".v043d-conversation-log-btn").forEach(btn => {
    const key = btn.dataset.v043dLogContext || "";
    btn.setAttribute("aria-expanded", v043dConversationLogIsOpen(key) ? "true" : "false");
  });
}
function v043dBindConversationLogControls() {
  document.querySelectorAll(".v043d-conversation-log-btn").forEach(btn => {
    if (btn.dataset.v043dLogBound === "1") return;
    btn.dataset.v043dLogBound = "1";
    btn.addEventListener("click", ev => {
      ev.preventDefault();
      ev.stopPropagation();
      v043dSetConversationLogOpen(true, btn.dataset.v043dLogContext || "");
      v043dRefreshConversationLogDom();
      const panel = Array.from(document.querySelectorAll(".v043d-conversation-log")).find(el => (el.dataset.v043dLogContext || "") === v043dUiRuntime.contextKey);
      panel?.querySelector(".v043d-conversation-log-close")?.focus({ preventScroll: true });
    });
  });
  document.querySelectorAll(".v043d-conversation-log-close").forEach(btn => {
    if (btn.dataset.v043dLogBound === "1") return;
    btn.dataset.v043dLogBound = "1";
    btn.addEventListener("click", ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const contextKey = btn.dataset.v043dLogContext || v043dUiRuntime.contextKey;
      v043dSetConversationLogOpen(false, contextKey);
      v043dRefreshConversationLogDom();
      Array.from(document.querySelectorAll(".v043d-conversation-log-btn")).find(el => (el.dataset.v043dLogContext || "") === contextKey)?.focus({ preventScroll: true });
    });
  });

}

function v043dIsQuietTutorialPopup(popup) {
  const title = String(popup?.title || "");
  return new Set([
    "活動開始",
    "今週は何しよう……",
    "2ターン目：未完成曲を完成させよう",
    "まずは曲作り",
    "今週の行動を選ぼう"
  ]).has(title);
}

function v043dQuietTutorialPopup() {
  if (!state) return false;
  if (v043dIsQuietTutorialPopup(state.activePopup)) {
    state.activePopup = null;
    return true;
  }
  return false;
}

function v043dTutorialHomeMessage() {
  if (!state || state.tutorialSkipHints || (state.liveCount || 0) > 0) return "";
  const turn = Number(state.turn || 1);
  if (state.tutorialStage === "needSong") return "T1：まず作詞・作曲。曲作りのあとも同じターンで行動できます";
  if (state.tutorialStage === "needCommand") return "T1：募集を選び、同じボタンをもう一度タップして実行";
  if (turn === 2) return "T2：前ターンの曲を完成させてから、練習へ";
  if (turn === 3) return "T3：初ライブを宣伝。届いた出演依頼にはメールで返事";
  if (turn === 4) return "T4：初ライブ前日。出演返信を確認して、休憩";
  if (turn === 5) return "T5：初ライブ。予定から準備を確認して本番へ";
  return "";
}

function v043dTrustStage(value) {
  const trust = clamp(Math.round(Number(value || 0)), 0, 100);
  if (trust < 20) return "まだぎこちない";
  if (trust < 40) return "少しずつ慣れてきた";
  if (trust < 60) return "まとまり始めた";
  if (trust < 80) return "信頼が育っている";
  return "強く結束している";
}

function v043dLatestTrustReason() {
  const row = (state?.logs || []).find(line => /信頼度|信頼/.test(String(line || "")));
  if (row) return String(row).split("\n")[0].slice(0, 120);
  const latestLive = Array.isArray(state?.liveResultHistory) ? state.liveResultHistory[state.liveResultHistory.length - 1] : null;
  const rank = latestLive?.rank || "";
  if (["S", "A", "B"].includes(rank)) return `最近のライブ評価${rank}で、バンドの信頼が深まった。`;
  if (rank === "C") return "最近のライブでは、信頼度に大きな変化はなかった。";
  if (["D", "E"].includes(rank)) return `最近のライブ評価${rank}で、バンドの空気が少し重くなった。`;
  return "まだ信頼度の変化は記録されていません。";
}

function v043dFanGainBreakdown(result, event=null) {
  const rank = String(result?.rank || "E");
  const rankBase = ({ S:45, A:30, B:18, C:8, D:2, E:0 }[rank] || 0);
  const scoreBonus = Math.round(Number(result?.total || 0) / 50);
  const coreBefore = result?.coreEvent ? 3 : 0;
  const mcBonus = hasSkill("mc_master") ? 2 : 0;
  const meta = liveTypeMeta(event || currentLiveEvent() || { liveType: result?.liveType || "special" });
  const growth = Number(meta?.growth || 1);
  const selfOneManBonus = result?.liveType === "self_one_man" && ["S", "A"].includes(rank) ? 12 : 0;
  const coreAfter = result?.coreEvent ? 2 : 0;
  return { rankBase, scoreBonus, coreBefore, mcBonus, growth, selfOneManBonus, coreAfter };
}

function v043dRenderFanGainFactors(result={}) {
  const factors = result.fanGainBreakdown || {};
  const rows = [
    `評価${escapeHtml(result.rank || "-")}：基礎 +${Number(factors.rankBase || 0)}（補正前）`,
    `総合点${Number(result.total || 0)}：+${Number(factors.scoreBonus || 0)}（補正前）`
  ];
  if (Number(factors.coreBefore || 0) || Number(factors.coreAfter || 0)) rows.push("コア反応：ファン増加へ加点");
  if (Number(factors.mcBonus || 0)) rows.push(`MCスキル：+${Number(factors.mcBonus)}（補正前）`);
  if (Math.abs(Number(factors.growth || 1) - 1) > 0.001) rows.push(`公演種別補正：×${Number(factors.growth).toFixed(2).replace(/0+$/,"").replace(/\.$/,"")}`);
  if (Number(factors.selfOneManBonus || 0)) rows.push(`ワンマン成功：+${Number(factors.selfOneManBonus)}`);
  rows.push(`今回の最終増加：+${Number(result.gains?.fans || 0)}`);
  return `<section class="v043d-fan-factors"><b>ファン増加の主な理由</b><div>${rows.map(row => `<span>${row}</span>`).join("")}</div><small>評価・総合点・コア反応・スキル・公演種別から算出。計算値そのものは変更していません。</small></section>`;
}

function v043dRenderInitialLiveExplanation(result={}) {
  if (!result.isFirstLive) return "";
  const gains = result.gains || {};
  const low = Number(result.total || 0) <= 0 || String(result.rank || "") === "E";
  const lead = low
    ? "総合点が低くても、ライブ自体が無効になったわけではありません。"
    : "初ライブの評価と、ライブで得た成果は別々に記録されます。";
  return `<section class="v043d-first-live-explanation">
    <b>初ライブの結果について</b>
    <p>${lead} 総合点・評価は演奏など5軸の結果で、動員・ファン・コア人気・利益は下の数値どおり別に反映されます。</p>
    <small>動員 ${Number(result.attendees || 0)}人 / ファン +${Number(gains.fans || 0)} / コア人気 +${Number(gains.core || 0)} / 利益 ${Number(gains.funds || result.profit || 0).toLocaleString()}円</small>
  </section>`;
}

function v043dPopupKey(popup={}) {
  const title = String(popup.title || "").trim().replace(/\s+/g, " ");
  const body = String(popup.body || "").trim().replace(/\s+/g, " ");
  return `${title}|${body}`;
}

function v043dPopupDuplicatesVisibleLiveResult(popup={}) {
  const result = state?.liveResultModal || state?.pendingLiveResultModal;
  if (!result) return false;
  const title = String(popup.title || "").trim();
  return title === "ライブ結果" || title === String(result.title || "").trim();
}

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
  delete copy.pendingTurnAdvance;
  delete copy.pendingNoSongcraftCommand;
  delete copy.saveSlotModal;
  delete copy.turnNotice;
  delete copy.pendingPurchase;
  delete copy.pendingBooking;
  delete copy.pendingMailAction;
  delete copy.detailModal;
  delete copy.livePrepPickerSlot;
  delete copy.actionResultModal;
  delete copy.activePopup;
  delete copy.popupQueue;
  delete copy.liveProgressModal;
  delete copy.pendingLiveResultModal;
  delete copy.liveResultModal;
  delete copy.pendingAfterparty;
  delete copy.pendingAfterpartyEvent;
  delete copy.pendingCancelLive;
  delete copy.pendingBoostSong;
  delete copy.bandNamePrompt;
  delete copy.renameBandNamePrompt;
  delete copy.activeStoryEvent;
  return copy;
}
function clearEphemeralStateAfterLoad() {
  v043aClearAllSelections();
  if (!state) return;
  state.pendingTurnAdvance = null;
  state.pendingNoSongcraftCommand = null;
  state.actionResultModal = null;
  state.activePopup = null;
  state.popupQueue = [];
  state.liveProgressModal = null;
  state.pendingLiveResultModal = null;
  state.liveResultModal = null;
  state.pendingAfterparty = null;
  state.pendingAfterpartyEvent = null;
  state.pendingCancelLive = null;
  state.pendingBoostSong = null;
  state.pendingBooking = null;
  state.pendingMailAction = null;
  state.bandNamePrompt = false;
  state.renameBandNamePrompt = false;
  state.activeStoryEvent = null;
  state.pendingPurchase = null;
  state.detailModal = null;
  state.saveSlotModal = null;
}
function hasUnsafeEphemeralStateForSave(manual=false) {
  if (!state) return false;
  const queue = Array.isArray(state.popupQueue) && state.popupQueue.length > 0;
  return !!(
    state.pendingTurnAdvance ||
    state.pendingNoSongcraftCommand ||
    state.bandNamePrompt ||
    state.renameBandNamePrompt ||
    state.actionResultModal ||
    state.activePopup ||
    queue ||
    state.liveProgressModal ||
    state.pendingLiveResultModal ||
    state.liveResultModal ||
    state.pendingAfterparty ||
    state.pendingAfterpartyEvent ||
    state.pendingCancelLive ||
    state.pendingBoostSong ||
    state.pendingBooking ||
    state.pendingMailAction ||
    state.pendingPurchase ||
    state.activeStoryEvent ||
    (!manual && state.saveSlotModal) ||
    state.detailModal
  );
}
function saveGame(manual=false, slot=selectedSaveSlot) {
  slot = clamp(Number(slot || selectedSaveSlot || 1), 1, SAVE_SLOT_COUNT);
  if (hasUnsafeEphemeralStateForSave(!!manual)) {
    if (manual) {
      state.saveNotice = "結果確認やポップ表示が終わってからセーブしてください。";
      log("一時画面の途中なので手動セーブを見送りました。", "warn");
      render();
    }
    return false;
  }
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
  if (hasUnsafeEphemeralStateForSave(false)) return;
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
    clearEphemeralStateAfterLoad();
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
/* --- セーブ/ロード演出: saveGame/restoreGameを再代入でラップ（前後呼び出し）。演出は事後の装飾のみで、
   実際のセーブ/ロード処理自体は元の同期処理のまま完全に不変。autoSaveGame()は別関数でsaveGame()を
   呼ばないため、manual===trueガードにより自動セーブでは発火しない（SKIN_ORDER_v4 PR-E #4） --- */
function dgShowSaveLoadOverlay(label) {
  if (dgPrefersReducedMotion()) return;
  const el = dgGetOrCreateOverlayEl("dgSaveLoadOverlay", "dg-saveload");
  if (!el) return;
  el.innerHTML = `<div class="dg-saveload-label">${label}</div><div class="dg-saveload-stripe"></div>`;
  el.classList.remove("run", "flash");
  void el.offsetWidth;
  el.classList.add("run");
  window.setTimeout(() => {
    el.classList.add("flash");
    window.setTimeout(() => { el.classList.remove("run", "flash"); }, 160);
  }, 420);
}
const dgSaveGameOriginal = saveGame;
saveGame = function (manual, slot) {
  const isManual = manual === true;
  const result = dgSaveGameOriginal.apply(this, arguments);
  if (isManual) dgShowSaveLoadOverlay("SAVING");
  return result;
};
const dgRestoreGameOriginal = restoreGame;
restoreGame = function (slot) {
  const result = dgRestoreGameOriginal.apply(this, arguments);
  dgShowSaveLoadOverlay("NOW LOADING");
  return result;
};

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
  v043dResetConversationLog();
  v043aClearAllSelections();
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
    firstLiveReplied: false,
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
    candidates: [],
    songs: [starterSong],
    pendingDrafts: [],
    playerCraft: { lyricsXp: 0, musicXp: 0 },
    freeSongcraftCharge: 0,
    discoveredSubGenres: loadDiscoveredSubGenres(),
    songcraftUsedThisTurn: false,
    songcraftUsedCountThisTurn: 0,
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
    phoneAccountEdit: null,
    bandNameFinalized: false,
    account: { email: "bandname@under-mail.jp", snsDisplayName: "", snsUserName: "@bandname" },
    openingStep: 0,
    snsPosts: [],
    snsWorldSeen: {},
    snsLastSeenCount: 0,
    snsLastPostTurn: 0,
    snsPostCount: 0,
    liveDiagnostics: [],
    liveReservationCandidates: [],
    reservationCandidateTurn: 0,
    notificationTurns: [],
    pendingAfterparty: null,
    pendingAfterpartyEvent: null,
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
    activePopup: { title:"はじめてのバンド活動", body:"曲を作って、メンバーを集めよう！\nまずは新しい曲のアイデアを作ろう。", type:"event", icon:v043eIcon("song") },
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
    skillPanelOpen: true,
    tutorialSkipHints: false,
    tutorialLastPhonePromptTurn: 0,
    tutorialFirstLiveGoalSeen: false,
    bandBookDetailTab: "profile",
    devOpenGroups: { progress: true, events: false, skills: false, balance: false }
  };
}

function generateInitialLiveEvents() {
  const firstVenue = venueById("garage");
  return [
    { turn:5, venueId:"garage", label:"初ライブ：ライブハウスイベント", fixed:true, booked:true, cancelled:false, name:"初ライブ：ライブハウスイベント", capacity:firstVenue.capacity, fee:firstVenue.fee, prepNeed:firstVenue.prepNeed, liveType:"booking_house", invitedBandIds:[initialPartnerBandId()], initialLive:true },
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
function minBookableLiveTurn() {
  return (state.turn || 1) + 3;
}
function canBookLiveTurn(turn) {
  const t = Number(turn || 0);
  return !!t && t >= minBookableLiveTurn() && t < (state.maxTurn || 50);
}
function liveBookingDeadlineText() {
  return `ライブ予約は${minBookableLiveTurn()}T以降（3ターン以上先）から可能です。`;
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
  showEventPopup("メンバーが増えた", "4人目が加わり、バンドとしての形が見えてきた。\n今後は最大人数や控えの制限はなく、加入した仲間は全員ライブ準備に出られる。\nただし人数が増えるほど維持費・交通費が増え、6人以上は1人ごとの出費が重くなる。", "event", v043eIcon("band"));
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
  // v0.3.50: 作詞＋作曲が揃っただけの未確定ドラフトも、完成確認が終わるまではチュートリアル対象として扱う。
  return ids.map(id => state.pendingDrafts.find(d => d.id === id)).filter(Boolean);
}
function mustCompleteFirstDraftTutorial() {
  return firstDraftTutorialTargets().length > 0;
}
function firstDraftTutorialPopup() {
  return {
    title:"2ターン目：未完成曲を完成させよう",
    body:"1ターン目で作った曲はまだ未完成。\nこのターンは未完成曲だけを選び、作っていない作詞/作曲を進めて曲完成まで確認しよう。",
    type:"event",
    icon:v043eIcon("book")
  };
}
function maybeShowFatigueIncreasePopup(before, after, reason) {
  const inc = Math.round((after || 0) - (before || 0));
  if (inc <= 0) return;
  showEventPopup("疲労が増えた", `${reason}
疲労 +${inc}%（現在 ${Math.round(after)}%）。
疲労が高いと練習・宣伝・曲作りの効率が下がる。ライブ前日は休憩やドリンクも考えよう。`, "warn", "⚠︎");
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
    if (v043dIsQuietTutorialPopup(p)) return false;
    const key = v043dPopupKey(p);
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
  const scrollSafe = batch.some(p => p && (p.layout === "scroll-safe" || p.scrollSafe));
  return {
    title: "まとめて確認",
    body: batch.map(p => `【${p.title || "通知"}】\n${p.body || ""}`).join("\n\n"),
    type: batch.some(p => p.type === "warn" || p.type === "bad") ? "warn" : (batch.some(p => p.type === "rare") ? "rare" : "event"),
    icon: v043eIcon("log"),
    ...(scrollSafe ? { layout:"scroll-safe", modalClass:"afterparty-result-safe-modal", scrollSafe:true } : {})
  };
}
function showEventPopup(title, body, type="info", icon="♪︎", payload={}) {
  const popup = { title, body, type, icon, ...(payload || {}) };
  if (v043dIsQuietTutorialPopup(popup)) return;
  if (v043dPopupDuplicatesVisibleLiveResult(popup)) return;
  const popupKey = v043dPopupKey(popup);
  if (state.activePopup && v043dPopupKey(state.activePopup) === popupKey) return;
  if (Array.isArray(state.popupQueue) && state.popupQueue.some(item => v043dPopupKey(item) === popupKey)) return;
  if (title === "疲労が増えた" && !(String(body || "").includes("ライブ") || String(body || "").includes("打ち上げ"))) {
    log(`${title}：${String(body || "").split("\n")[0]}`, "warn");
    return;
  }
  if (state.deferPopupsUntilAfterLive || state.liveProgressModal || state.pendingLiveResultModal || state.liveResultModal || state.actionResultModal || state.detailModal || state.livePrepPickerSlot || state.pendingBooking || state.pendingMailAction || state.pendingBoostSong || state.pendingAfterparty || state.pendingAfterpartyEvent || state.pendingPurchase || state.saveSlotModal || state.pendingCancelLive || state.pendingNoSongcraftCommand || state.bandNamePrompt || state.renameBandNamePrompt || state.activeStoryEvent || state.activePopup) {
    state.popupQueue = state.popupQueue || [];
    state.popupQueue.push(popup);
    normalizePopupQueue();
    return;
  }
  state.activePopup = popup;
}
function hasBlockingPopupBeforeTurnAdvance() {
  const queueHasItems = Array.isArray(state.popupQueue) && state.popupQueue.length > 0;
  return !!(state.activePopup || queueHasItems || state.activeStoryEvent);
}
function maybeFinishPendingTurnAdvanceAfterPopups() {
  if (!state.pendingTurnAdvance || hasBlockingPopupBeforeTurnAdvance()) return false;
  const pending = state.pendingTurnAdvance;
  if (pending.nextTurn === 5 && !v042BandNameReady()) {
    state.bandNamePrompt = true;
    render();
    return true;
  }
  finishPendingTurnAdvance();
  return true;
}
function pendingSongFinalizeDraft() {
  return Array.isArray(state.pendingDrafts) ? state.pendingDrafts.find(d => d && d.lyricsDone && d.musicDone) : null;
}
function hasPendingSongFinalize() {
  return !!pendingSongFinalizeDraft();
}
function focusPendingSongFinalize(showPopup=true) {
  const d = pendingSongFinalizeDraft();
  if (!d) return false;
  state.view = "songs";
  state.songEditor = { step:"draftFinalize", draftId:d.id, title:d.titleHint, theme:d.theme || "---" };
  if (showPopup) {
    state.activePopup = {
      title:"曲完成前確認",
      body:`「${d.titleHint}」の作詞と作曲が揃っている。
先に曲名とテーマを確認して、完成させよう。`,
      type:"song",
      icon:v043eIcon("song")
    };
  }
  render();
  return true;
}
function schedulePendingTurnAdvance(source="action") {
  if (state.pendingTurnAdvance) return;
  const nextTurn = Math.min((state.turn || 1) + 1, state.maxTurn || 50);
  if (nextTurn <= (state.turn || 1)) return;
  state.pendingTurnAdvance = { nextTurn, source };
}
function hasFlowModalOpen() {
  return !!(
    state.activePopup ||
    state.actionResultModal ||
    state.liveProgressModal ||
    state.pendingLiveResultModal ||
    state.liveResultModal ||
    state.pendingAfterparty ||
    state.pendingAfterpartyEvent ||
    state.detailModal ||
    state.livePrepPickerSlot ||
    state.pendingBooking ||
    state.pendingMailAction ||
    state.pendingBoostSong ||
    state.pendingCancelLive ||
    state.pendingPurchase ||
    state.saveSlotModal ||
    state.pendingNoSongcraftCommand ||
    state.bandNamePrompt ||
    state.renameBandNamePrompt ||
    state.activeStoryEvent
  );
}
function surfaceQueuedPopupIfIdle() {
  if (!state || state.activeStoryEvent || state.activePopup || !Array.isArray(state.popupQueue) || !state.popupQueue.length) return false;
  if (state.liveProgressModal || state.pendingLiveResultModal || state.liveResultModal || state.actionResultModal || state.pendingAfterparty || state.pendingAfterpartyEvent || state.detailModal || state.livePrepPickerSlot || state.pendingBooking || state.pendingMailAction || state.pendingBoostSong || state.pendingCancelLive || state.pendingPurchase || state.saveSlotModal || state.pendingNoSongcraftCommand || state.bandNamePrompt || state.renameBandNamePrompt || state.activeStoryEvent) return false;
  state.activePopup = nextPopupFromQueue();
  return !!state.activePopup;
}
function renderFlowRecoveryOverlay() {
  const p = state.pendingTurnAdvance || {};
  return `<div class="modal-backdrop"><div class="event-modal warn">
    <div class="modal-icon">▪︎</div>
    <div class="modal-copy"><h2>進行を再開します</h2><p>確認待ちの進行が残っています。
OKを押すと次のターンへ進みます。
source: ${escapeHtml(p.source || "unknown")}</p></div>
    <button id="flowRecoveryBtn" class="big-action">次へ進む</button>
  </div></div>`;
}
function closeActivePopup() {
  state.activePopup = null;
  state.activePopup = nextPopupFromQueue();
  if (!state.activePopup && state.pendingEndingAfterLive) {
    state.pendingEndingAfterLive = false;
    state.ended = true;
  }
  if (maybeFinishPendingTurnAdvanceAfterPopups()) return;
  render();
}
function closeLiveResultModal() {
  state.liveResultModal = null;
  state.deferPopupsUntilAfterLive = false;
  if (state.pendingAfterparty) { render(); return; }
  // 念のため、打ち上げ情報が欠けた旧セーブ/例外状態でもライブ後フローを必ず完走させる。
  continuePostLiveFlow();
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
    if (maybeFinishPendingTurnAdvanceAfterPopups()) return;
    render();
    return;
  }
  state.turnNotice = null;
  render();
}


// 旧セーブ互換用：関数名とofferIdはPaper Moonのまま残し、内部ではinitialPartnerBandId()でTriple Arrowsへ読み替える。
function addStoryLiveOfferPaperMoon() { state.storyFlags = state.storyFlags || {}; if (state.storyFlags.paperMoonInvite8) return; state.storyFlags.paperMoonInvite8 = true; const offer = { id:"story_paper_moon_8", turn:8, venueId:"garage", liveType:"booking_band", invitedBandIds:["paper_moon"], accepted:false, expired:false, status:"open", createdTurn:state.turn, storyInvite:true }; state.liveOffers = Array.isArray(state.liveOffers) ? state.liveOffers : []; state.liveOffers.unshift(offer); const mailId = addMail("俺たちの企画　参加依頼", `この前のライブ、お疲れ！
まだ荒削りだけど、お前らきっとすごくなるぜ。
この前言ってた企画ライブ、よかったら出てくれよ。

Paper Moon Kids　タカナシ`, "live_offer", { offerId:offer.id, offerTurn:8, status:"open", sender:"Paper Moon Kids　タカナシ" }); offer.mailId = mailId; }
function addInitialFlowMail(key, subject, body, sender="携帯通知") {
  state.storyFlags = state.storyFlags || {};
  if (state.storyFlags[key]) return;
  state.storyFlags[key] = true;
  const isLive = key.includes("under");
  const payload = { sender };
  if (key === "underInviteMail") {
    payload.firstLiveInvite = true;
    payload.status = state.firstLiveReplied ? "accepted" : "pending";
    payload.targetTurn = 5;
    payload.venueId = "garage";
  }
  if (!isLive) payload.mailAction = "meet_applicant";
  addMail(subject, body, isLive ? "live_offer" : "member", payload);
}
function v043cIsFirstLiveEvent(ev) {
  if (!ev) return false;
  const label = String(ev.label || ev.name || "");
  return !!ev.initialLive || (Number(ev.turn || 0) === 5 && (ev.fixed || label.includes("初ライブ")));
}
function v043cFirstLiveEvent() {
  return (state.liveEvents || []).find(v043cIsFirstLiveEvent) || null;
}
function v043cIsFirstLiveInviteMail(m) {
  if (!m) return false;
  const payload = m.payload || {};
  const subject = String(m.subject || "");
  const sender = String(m.sender || payload.sender || "");
  return !!payload.firstLiveInvite || (subject === "ライブイベントのお誘い" && ((m.kind || "") === "live_offer") && (sender.includes("UNDER") || !payload.offerId));
}
function v043cFirstLiveInviteMail() {
  return (state.phoneMails || []).find(v043cIsFirstLiveInviteMail) || null;
}
function v043cHasInitialLiveHistory() {
  return (state.liveResultHistory || []).some(r => {
    const text = String(r.title || r.liveTypeLabel || r.name || "");
    return Number(r.turn || 0) === 5 || text.includes("初ライブ");
  });
}
function v043cNormalizeFirstLiveState() {
  const mail = v043cFirstLiveInviteMail();
  const acceptedByMail = mail?.payload?.status === "accepted";
  if (typeof state.firstLiveReplied !== "boolean") {
    state.firstLiveReplied = !!(Number(state.turn || 1) >= 5 || Number(state.liveCount || 0) > 0 || v043cHasInitialLiveHistory() || acceptedByMail);
  }
  if (acceptedByMail) state.firstLiveReplied = true;
  if (mail) {
    mail.payload = mail.payload || {};
    mail.payload.firstLiveInvite = true;
    mail.payload.targetTurn = 5;
    mail.payload.venueId = mail.payload.venueId || v043cFirstLiveEvent()?.venueId || "garage";
    mail.payload.status = state.firstLiveReplied ? "accepted" : (mail.payload.status || "pending");
  }
}
function v043cFirstLiveReplyStatus() {
  const mail = v043cFirstLiveInviteMail();
  const accepted = !!state.firstLiveReplied || mail?.payload?.status === "accepted";
  return {
    accepted,
    mail,
    mailText: accepted ? "✓︎ 返事済み：出演" : "仮押さえ・返事待ち",
    scheduleText: accepted ? "出演確定" : "仮押さえ・返事待ち",
    homeText: accepted ? "出演確定" : "仮押さえ・返事待ち",
    cls: accepted ? "good" : "warn"
  };
}
function v043cT4FirstLiveReplyGate() {
  const mail = v043cFirstLiveInviteMail();
  return Number(state.turn || 1) === 4 && !!mail && !v043cFirstLiveReplyStatus().accepted;
}
function v043cImportantMailTarget() {
  const firstLive = v043cFirstLiveInviteMail();
  if (firstLive && !v043cFirstLiveReplyStatus().accepted) return firstLive;
  return null;
}
function v043cOpenMailDirect(mailId) {
  const targetId = mailId || v043cImportantMailTarget()?.id;
  const mail = (state.phoneMails || []).find(m => m.id === targetId);
  if (!mail) return;
  if (typeof v043bClearHomeCommandSelection === "function") v043bClearHomeCommandSelection();
  mail.read = true;
  state.view = "phone";
  state.phoneSubView = "mail";
  state.phoneAccountEdit = null;
  state.activeMailId = mail.id;
  render();
}
function v043cRequestFirstLiveReply(mailId) {
  const mail = (state.phoneMails || []).find(m => m.id === mailId) || v043cFirstLiveInviteMail();
  if (!mail) return;
  if (v043cFirstLiveReplyStatus().accepted) { v043cOpenMailDirect(mail.id); return; }
  mail.read = true;
  state.view = "phone";
  state.phoneSubView = "mail";
  state.activeMailId = mail.id;
  state.pendingMailAction = { type:"first_live_reply", mailId:mail.id, turn:5 };
  render();
}
function v043cConfirmFirstLiveReply(mailId) {
  const mail = (state.phoneMails || []).find(m => m.id === mailId) || v043cFirstLiveInviteMail();
  state.firstLiveReplied = true;
  if (mail) {
    mail.read = true;
    mail.payload = mail.payload || {};
    mail.payload.firstLiveInvite = true;
    mail.payload.status = "accepted";
    mail.payload.targetTurn = 5;
    mail.payload.venueId = mail.payload.venueId || v043cFirstLiveEvent()?.venueId || "garage";
    state.activeMailId = mail.id;
  }
  state.view = "phone";
  state.phoneSubView = "mail";
  render();
}
function v043cScheduleTab() {
  if (!v043cUiRuntime || v043cUiRuntime.stateRef !== state) {
    v043cUiRuntime = { scheduleTab: "planned", stateRef: state };
  }
  if (!["planned", "discover"].includes(v043cUiRuntime.scheduleTab)) v043cUiRuntime.scheduleTab = "planned";
  return v043cUiRuntime.scheduleTab;
}
function v043cSetScheduleTab(tab) {
  v043cScheduleTab();
  v043cUiRuntime.scheduleTab = tab === "discover" ? "discover" : "planned";
  render();
}
function applyInitialFlowTurnEvents() {
  if ((state.liveCount || 0) > 0 && state.turn === 6 && !bandSystemOn()) { addStoryLiveOfferPaperMoon(); }
  if ((state.liveCount || 0) > 0) return;
  if (state.turn === 2) addInitialFlowMail("t2RecruitMail", "メンバー募集の反応", `受信BOXにメンバー募集の情報が届いている。
バンドメンバーに迎え入れるか考えよう。`, "メンバー募集掲示板");
  if (state.turn === 3) addInitialFlowMail("underInviteMail", "ライブイベントのお誘い", `はじめまして。
ライブハウスUNDERの運営です。
最近活動を始めたバンド向けのイベントがあります。
よければ、出演しませんか？

出演日：5ターン目 18:00～
形式：ライブハウスイベント
参加費：4500円`, "ライブハウスUNDER");
  if (state.turn === 4 && (state.commandCounts?.promo || 0) > 0) addInitialFlowMail("t4PromoRecruitMail", "宣伝を見たメンバー候補", `宣伝でも、メンバー加入の連絡が来ることがある。
バンドメンバーに迎え入れるか考えよう。`, "メンバー募集掲示板");
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
  state.songcraftUsedCountThisTurn = 0;
  applyInitialFlowTurnEvents();
  if (bandSystemOn()) processBandStoryEvents("turnStart");
  if (state.hangoverTurn === state.turn) {
    state.popupQueue = state.popupQueue || [];
    state.popupQueue.push({ title:"二日酔い", body:"昨日の打ち上げが響いている。\nこのターンは休憩しかできない。", type:"warn", icon:v043eIcon("cross") });
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
/* --- ライブ結果コレオグラフィ: showLiveResultAfterProgress()を再代入でラップ（前後呼び出し）。
   render()で描画済みの最終値をDOMから読み取り、演出専用にJSで巻き戻してから数値アニメーションで
   再生する方式のため、renderLiveResultOverlay()自体の出力（最終値のマークアップ）は無変更。
   STUDY 10正典のタイムライン・イージング値に準拠（SKIN_ORDER_v4 PR-E #2） --- */
function dgDiamondBurst(container, colorVar, wave1Count, wave2Count, wave2DelayMs) {
  if (dgPrefersReducedMotion() || !container || typeof container.animate !== "function") return;
  const cs = window.getComputedStyle ? window.getComputedStyle(container) : null;
  if (cs && cs.position === "static") container.style.position = "relative";
  function fireWave(count) {
    for (let i = 0; i < count; i++) {
      const angleDeg = (360 / 8) * (i % 8);
      const angleRad = angleDeg * Math.PI / 180;
      /* STUDY 10b: 粒子寿命620-860ms・飛距離60-120px・サイズ7-13px・後半減速イージング（SKIN_ORDER_v4 fix4） */
      const distance = 60 + Math.random() * 60;
      const size = 7 + Math.random() * 6;
      const duration = 620 + Math.random() * 240;
      const dx = Math.cos(angleRad) * distance;
      const dy = Math.sin(angleRad) * distance;
      const p = document.createElement("div");
      p.className = "dg-burst-particle";
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.background = `var(${colorVar})`;
      container.appendChild(p);
      const anim = p.animate([
        { transform: "translate(-50%,-50%) rotate(45deg) scale(1)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(45deg) scale(.4)`, opacity: 0 }
      ], { duration, easing: "cubic-bezier(.15,.8,.25,1)", fill: "forwards" });
      anim.onfinish = () => p.remove();
    }
  }
  fireWave(wave1Count);
  if (wave2Count > 0) window.setTimeout(() => fireWave(wave2Count), wave2DelayMs);
}
function dgParseNumberText(raw) {
  const m = String(raw || "").match(/^([+-]?)(¥?)([\d,]+)(.*)$/);
  if (!m) return null;
  const numStr = m[3].replace(/,/g, "");
  let target = parseInt(numStr, 10);
  if (!Number.isFinite(target)) return null;
  if (m[1] === "-") target = -target;
  return { target, plus: m[1] === "+", currency: m[2], suffix: m[4] };
}
function dgFormatNumber(v, plus, suffix, currency) {
  const rounded = Math.round(v);
  const sign = rounded < 0 ? "-" : (plus ? "+" : "");
  return `${sign}${currency || ""}${Math.abs(rounded).toLocaleString("ja-JP")}${suffix || ""}`;
}
/* 数値カウントアップ準備: 表示は即座に0へ巻き戻す（「最終値が一瞬見えてから0に戻る」ちらつき防止）。
   開始タイミング・所要時間は呼び出し側が.start(durationMs)で指定し、タップ早送り時は.jumpToEnd()で
   アニメーションを介さず直接最終値へ設定する（SKIN_ORDER_v4 PR-E #2、fix4でstart/jumpToEndへ再構成） */
function dgPrepareNumberCountUp(el) {
  if (!el) return null;
  const parsed = dgParseNumberText(el.textContent);
  if (!parsed) return null;
  el.style.fontVariantNumeric = "tabular-nums";
  el.textContent = dgFormatNumber(0, parsed.plus, parsed.suffix, parsed.currency);
  let token = null;
  return {
    start(durationMs) { token = dgCountUp(0, parsed.target, durationMs, (v) => { el.textContent = dgFormatNumber(v, parsed.plus, parsed.suffix, parsed.currency); }); },
    /* start()済みで既にrAFループが走っている場合、先にcancelledを立てて次フレームでの
       中間値上書きを止めてから最終値を書く（fix4で発見した不具合の対策） */
    jumpToEnd() { if (token) token.cancelled = true; el.textContent = dgFormatNumber(parsed.target, parsed.plus, parsed.suffix, parsed.currency); }
  };
}
/* --- ホーム帰還時のゲージ差分伸長: applyLiveResult()呼び出し直前に旧値を1行スナップショットし
   （前後呼び出し）、render()側で「view=home への到達を初めて検知した回」にのみ消費・クリアする
   ことで、打ち上げ/ポップアップ連鎖のどの経路を辿っても確実に一度だけ発火する。対象カードには
   ゲージ（帯グラフ）が存在しないため、演出は数値のカウントアップで代替（SKIN_ORDER_v4 PR-E #3） */
function dgAnimateHomeGaugeGrowth(snapshot) {
  if (dgPrefersReducedMotion() || typeof document === "undefined" || !snapshot) return;
  const grid = document.querySelector(".v042-status-grid");
  if (!grid) return;
  const valueEls = grid.querySelectorAll(".v042-status b");
  const froms = [snapshot.funds, snapshot.fans, snapshot.fatigue, snapshot.fame, snapshot.audiencePower, snapshot.industry];
  valueEls.forEach((el, i) => {
    const fromVal = froms[i];
    if (typeof fromVal !== "number" || !Number.isFinite(fromVal)) return;
    const parsed = dgParseNumberText(el.textContent);
    if (!parsed) return;
    el.style.fontVariantNumeric = "tabular-nums";
    el.textContent = dgFormatNumber(fromVal, parsed.plus, parsed.suffix, parsed.currency);
    /* STUDY 10b: 結果画面の演出倍率(約1.3倍)にホーム帰還ゲージも揃える。700ms→910ms（SKIN_ORDER_v4 fix4） */
    dgCountUp(fromVal, parsed.target, 910, (v) => { el.textContent = dgFormatNumber(v, parsed.plus, parsed.suffix, parsed.currency); });
  });
}
/* --- コレオグラフィ再構成（新タイムライン、fix4）: 0-1000ms総合点カウントアップ→1120msスタンプ
   叩き込み開始(260ms)→1270msひし形バースト(S/Aのみ)→1670ms残り全要素カウントアップ(1170ms)＋
   全ゲージ伸長(1300ms)。総合点の算出ロジックは不変、表示演出のみ（値は事前確定→演出で開示）。
   スタンプは新規に特大版を生成し結果ヘッダ右の空きスペースへ絶対配置、粒子原点もここ。
   旧来の小型ランク表示(.rank-burst)はCSSで恒常的にdisplay:none化（DOM削除はしない）。
   演出レイヤー内に透明なタップキャッチャーを重ね、タップで全要素を最終状態へ短絡する
   （stopPropagationによりゲーム入力へは伝播しない。300msゲート等の他画面機構とは無関係）（SKIN_ORDER_v4 fix4） */
function dgAnimateLiveResultReveal() {
  if (typeof document === "undefined" || typeof document.querySelector !== "function") return;
  const modal = document.querySelector(".live-result-modal");
  if (!modal) return;
  const rankMatch = modal.className.match(/rank-(\S)/);
  const rank = rankMatch ? rankMatch[1] : "C";
  const v043fReveal = v043fScheduleLiveResultAudio(rank); /* PR-J: 本書タイムラインの絶対スケジューリング。reduced-motion判定より前に評価し、視覚短絡とは独立に発音する */

  const stamp = document.createElement("div");
  stamp.className = "dg-rank-stamp-lg";
  stamp.textContent = rank;
  stamp.setAttribute("aria-hidden", "true");
  modal.appendChild(stamp);

  const scoreHandle = dgPrepareNumberCountUp(modal.querySelector(".result-score b"));
  const remainingHandles = Array.prototype.slice.call(
    modal.querySelectorAll(".result-primary-gains span, .result-secondary-gains span, .result-bar b")
  ).map(el => dgPrepareNumberCountUp(el)).filter(Boolean);

  const fillEls = modal.querySelectorAll(".result-bars .fill");
  const fillTargets = [];
  fillEls.forEach(fillEl => {
    fillTargets.push(fillEl.style.width);
    fillEl.style.transition = "none";
    fillEl.style.width = "0%";
  });

  function jumpAllToFinal() {
    stamp.style.animation = "none";
    stamp.style.opacity = "1";
    stamp.style.transform = "rotate(-8deg) scale(1)";
    if (scoreHandle) scoreHandle.jumpToEnd();
    remainingHandles.forEach(h => h.jumpToEnd());
    fillEls.forEach((fillEl, i) => { fillEl.style.transition = "none"; fillEl.style.width = fillTargets[i]; });
  }

  if (dgPrefersReducedMotion()) {
    jumpAllToFinal();
    return;
  }

  const catcher = document.createElement("div");
  catcher.className = "dg-choreo-tap-catcher";
  modal.appendChild(catcher);

  const timers = [];
  let settled = false;
  function settle() {
    if (settled) return;
    settled = true;
    timers.forEach(t => window.clearTimeout(t));
    catcher.remove();
  }
  function skipToFinal() {
    if (settled) return;
    v043fStopScheduledNodes(v043fReveal.nodes); /* PR-J: タップ早送り時は予約済みSEを全停止 */
    v043fPlayD6(v043fNow()); /* PR-J: D6のみ1回鳴らして終了 */
    jumpAllToFinal();
    settle();
  }
  catcher.addEventListener("click", (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    skipToFinal();
  });

  if (scoreHandle) scoreHandle.start(1000);
  timers.push(window.setTimeout(() => {
    if (rank === "S") dgDiamondBurst(stamp, "--fame", 10, 6, 155);
    else if (rank === "A") dgDiamondBurst(stamp, "--vio", 6, 0, 0);
  }, 1270));
  timers.push(window.setTimeout(() => {
    remainingHandles.forEach(h => h.start(1170));
    fillEls.forEach((fillEl, i) => {
      fillEl.style.transition = "width 1300ms cubic-bezier(.2,.9,.1,1)";
      requestAnimationFrame(() => { fillEl.style.width = fillTargets[i]; });
    });
  }, 1670));
  timers.push(window.setTimeout(settle, 2970));
}
const dgShowLiveResultAfterProgressOriginal = showLiveResultAfterProgress;
showLiveResultAfterProgress = function () {
  dgShowLiveResultAfterProgressOriginal();
  dgAnimateLiveResultReveal();
};
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
      // 5曲目を通常表示→︎完了表示で二重判定しない。
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
      songTitle: song.title || "",
      line: liveSongLine(song, slot, result.rank, result, repeat),
      icon: repeat ? repeat.icon : mood.icon,
      event: repeat ? repeat.text : mood.text,
      impact: repeat ? "repeat" : mood.kind
    };
  });
  return { title: currentLiveName(), rank: result.rank, total: val(result.total), steps, index:0, complete:false, venueName: result.venue?.name || "", heat: val(result.heat || 0) };
}
function repeatImpactForSlot(repeatInfo, slot) {
  const hit = (repeatInfo?.repeats || []).find(r => r.idx === slot - 1);
  if (!hit) return null;
  if (repeatInfo.boom) {
    return { icon:"♪︎", text:`${slot}曲目の再演が刺さった`, detail:`同じ曲の${hit.occurrence}回目が、逆に客席の合唱を生んだ。` };
  }
  return { icon:"⚠︎", text:`${slot}曲目の再演が裏目`, detail:`同じ曲の${hit.occurrence}回目で、客席の集中が少し切れた。` };
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
      { icon:"▲︎", text:"開幕の熱", kind:"opener" },
      { icon:"⚡︎", text:"一音目で空気が変わった", kind:"opener" },
      { icon:"●︎", text:"手拍子が起き始めた", kind:"opener" }
    ],
    2: [
      { icon:"●︎", text:"曲順が良くて盛り上がった", kind:"flow" },
      { icon:"▲︎", text:"二曲目でフロアが前に出た", kind:"flow" },
      { icon:"☆︎", text:"前曲から自然につながった", kind:"flow" }
    ],
    3: [
      { icon:"☆︎", text:"歌詞が届き始めた", kind:"middle" },
      { icon:"♪︎", text:"中盤で声がよく抜けた", kind:"middle" },
      { icon:"★︎", text:"この日最初の山場になった", kind:"middle" }
    ],
    4: [
      { icon:"☆︎", text:"空気を変えた", kind:"bridge" },
      { icon:"○︎", text:"静かな緊張感が出た", kind:"bridge" },
      { icon:"⚡︎", text:"ラスト前にもう一段ギアが上がった", kind:"bridge" }
    ],
    5: [
      { icon: result.total >= 70 ? "★︎" : "▲︎", text:"ラストで押し切った", kind:"finale" },
      { icon:"♪︎", text:"最後のサビで声が重なった", kind:"finale" },
      { icon:"★︎", text:"締めで一番大きい反応が来た", kind:"finale" }
    ]
  };
  let pool = pools[slot] || [{ icon:"▲︎", text:"客席が温まってきた", kind:"normal" }];
  if (strong) pool = [...pool, { icon:"★︎", text:"客席の反応が明らかに良い", kind:"good" }];
  if (weak) pool = [...pool, { icon:"⚠︎", text:"荒さはあるが熱量で押した", kind:"rough" }];
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
function candidateJoinConditionMet(c) {
  const cond = c?.joinCondition || {};
  const minTurn = Number(cond.minTurn || 1);
  if ((state.turn || 1) < minTurn) return false;
  if (typeof cond.minFans === "number" && Number(state.band?.fans || 0) < cond.minFans) return false;
  if (typeof cond.minFame === "number" && Number(state.band?.fame || 0) < cond.minFame) return false;
  if (typeof cond.minIndustry === "number" && Number(state.band?.industry || 0) < cond.minIndustry) return false;
  return true;
}
function validCandidateIdSet() {
  return new Set((DATA.candidateCharacters || []).map(c => c.id));
}
function normalizeCandidatePoolsForCurrentData() {
  const valid = validCandidateIdSet();
  state.candidates = (state.candidates || []).filter(c => c && valid.has(c.id) && candidateJoinConditionMet(c));
  state.applicants = (state.applicants || []).filter(c => c && valid.has(c.id) && (c.devForced || candidateJoinConditionMet(c)));
  if (state.lastApplicant && (!valid.has(state.lastApplicant.id) || !(state.lastApplicant.devForced || candidateJoinConditionMet(state.lastApplicant)))) state.lastApplicant = null;
}
function mergeLatestCandidatesIntoState() {
  if (!state || !Array.isArray(DATA.candidateCharacters)) return;
  if (!Array.isArray(state.candidates)) state.candidates = [];
  DATA.candidateCharacters.forEach(c => {
    if (!candidateJoinConditionMet(c)) return;
    if (!personAlreadyKnown(c.id)) state.candidates.push(clone(c));
  });
}
function candidateConditionMetWithRescue(c) {
  const cond = c?.joinCondition || {};
  const minTurn = Number(cond.minTurn || 1);
  if ((state.turn || 1) < Math.min(minTurn, 18)) return false;
  // 候補枯渇救済ではファン/知名度/業界評価条件を少しだけ緩める。
  // ただし後半候補の早出しは避けるため、lateは通常条件に任せる。
  if (c?.joinPhase === "late") return candidateJoinConditionMet(c);
  if (typeof cond.minFans === "number" && Number(state.band?.fans || 0) < Math.ceil(cond.minFans * 0.55)) return false;
  if (typeof cond.minFame === "number" && Number(state.band?.fame || 0) < Math.ceil(cond.minFame * 0.55)) return false;
  if (typeof cond.minIndustry === "number" && Number(state.band?.industry || 0) < Math.ceil(cond.minIndustry * 0.55)) return false;
  return true;
}
function missingCoreInstruments() {
  return ["vocal", "guitar", "bass", "drum"].filter(inst => bandInstrumentCoverage(inst) <= 0);
}
function personAlreadyKnownForRescue(id) {
  if (!id || id === "player") return true;
  if ((state.members || []).some(m => m.id === id)) return true;
  if ((state.candidates || []).some(c => c.id === id)) return true;
  if (currentApplicantList().some(a => a.id === id)) return true;
  return false;
}
function tryRescueApplicantFromCoreShortage(source="募集") {
  if ((state.turn || 1) < 15) return null;
  const missing = missingCoreInstruments();
  if (!missing.length) return null;
  const pool = (DATA.candidateCharacters || []).filter(c => {
    if (!c || personAlreadyKnownForRescue(c.id)) return false;
    if (!candidateConditionMetWithRescue(c)) return false;
    return missing.some(inst => candidateInstrumentScore(c, inst) >= 2.5);
  });
  if (!pool.length) return null;
  pool.sort((a,b) => {
    const score = c => missing.reduce((sum, inst) => sum + candidateInstrumentScore(c, inst), 0);
    const phase = c => c.joinPhase === "early" ? 3 : c.joinPhase === "middle" ? 2 : 1;
    return (score(b) + phase(b)) - (score(a) + phase(a));
  });
  const applicant = clone(pool[0]);
  state.dismissedApplicantIds = (state.dismissedApplicantIds || []).filter(id => id !== applicant.id);
  const list = currentApplicantList();
  if (!list.some(a => a.id === applicant.id)) list.push(applicant);
  setApplicantList(list);
  log(`${source}救済：基本パート不足を補う候補として${applicant.name}が再連絡してきた。`);
  return applicant;
}
function addApplicantFromCandidates(source="募集") {
  mergeLatestCandidatesIntoState();
  if (!state.candidates.length) {
    const rescued = tryRescueApplicantFromCoreShortage(source);
    if (rescued) return rescued;
    log("募集候補が見つからなかった。ライブ評価・知名度・業界評価が上がると、新しい候補が増えそうだ。", "warn");
    return null;
  }
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
  if (applicant) showEventPopup("宣伝から加入希望！", `宣伝を見た ${applicant.name} から連絡が来た。\n募集結果と重複するため、同じターンに複数人が候補に来ることがある。`, "event", v043eIcon("recruit"));
  return applicant;
}

function chooseApplicantDisplayName(applicant) {
  if (!applicant) return applicant;
  if (!applicant.defaultName) applicant.defaultName = applicant.name || "メンバー";
  if (applicant.canRename !== true) return applicant;
  let nextName = applicant.defaultName;
  try {
    if (typeof window !== "undefined" && typeof window.prompt === "function") {
      const input = window.prompt("加入時の名前を変更できます。空欄ならデフォルト名のまま加入します。", applicant.defaultName);
      if (input !== null) {
        const trimmed = String(input).trim();
        if (trimmed) nextName = trimmed.slice(0, 12);
      }
    }
  } catch (e) {}
  applicant.displayName = nextName;
  applicant.name = nextName;
  return applicant;
}

function memberJoinStoryContext(applicant) {
  const part = String(applicant?.part || "担当未定");
  const normalized = part.replace(/\s/g, "");
  let partFlavor = "まずはスタジオで音を合わせて、バンドの空気を作っていく。";
  let partLine = "ライブで逃げるつもりはないです。";
  if (normalized.includes("Vo") && !normalized.includes("Gt") && !normalized.includes("Ba")) {
    partFlavor = "歌の芯ができると、バンド全体の印象が変わる。";
    partLine = "歌で、ちゃんと客席の空気を変えたいです。";
  } else if (normalized.includes("Gt")) {
    partFlavor = "ギターと歌の熱量が増えて、曲の輪郭が見えやすくなる。";
    partLine = "リフでも歌でも、前に出るところは出ます。";
  } else if (normalized.includes("Ba")) {
    partFlavor = "低音が入ると、バンドの足元が一気に太くなる。";
    partLine = "派手じゃなくても、曲を支える音を出したいです。";
  } else if (normalized.includes("Dr")) {
    partFlavor = "ドラムが入ると、ライブのテンポと熱量が安定しはじめる。";
    partLine = "テンポは任せてください。ちゃんと前に進めます。";
  } else if (normalized.includes("Key") || normalized.includes("DJ") || normalized.includes("Cho")) {
    partFlavor = "補助パートが入ることで、曲の色とステージの見え方が広がる。";
    partLine = "主役を支えながら、曲の景色を広げたいです。";
  }
  return {
    memberName: applicant?.name || "メンバー",
    part,
    joinStatus: applicant?.joinStatus || "加入",
    mainGenre: applicant?.mainGenre || "ロック",
    partFlavor,
    partLine
  };
}

function joinApplicantById(id) {
  const list = currentApplicantList();
  const idx = list.findIndex(a => a.id === id);
  if (idx < 0) return;
  let applicant = list.splice(idx, 1)[0];
  applicant = chooseApplicantDisplayName(applicant);
  applicant.joinStatus = Math.random() < 0.45 ? "仮加入" : "本加入";
  state.members.push(applicant);
  setApplicantList(list);
  log(`${applicant.name}が${applicant.joinStatus}として加入した。加入済みメンバーは全員バンド構成に入り、ライブ準備で担当を選べる。`);
  const joinStoryPlayed = novelEventsOn() && startStoryEvent("member_join_generic", { silent: true, context: memberJoinStoryContext(applicant) });
  if (!joinStoryPlayed) {
    showEventPopup(applicant.joinStatus === "仮加入" ? "仮加入！" : "新メンバー加入！", `${applicant.name} がバンドに加わった！\n担当：${applicant.part}\n得意：${applicant.mainGenre}\n加入済みメンバーは全員ライブ準備に表示される。`, applicant.joinStatus === "仮加入" ? "event" : "rare", applicant.joinStatus === "仮加入" ? v043eIcon("band") : v043eIcon("fame"));
  }
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
  if (typeof state.activeStoryEvent === "undefined") state.activeStoryEvent = null;
  if (typeof state.pendingTurnAdvance === "undefined") state.pendingTurnAdvance = null;
  if (typeof state.pendingCancelLive === "undefined") state.pendingCancelLive = null;
  if (!Array.isArray(state.applicants)) state.applicants = state.lastApplicant ? [state.lastApplicant] : [];
  if (!Array.isArray(state.dismissedApplicantIds)) state.dismissedApplicantIds = [];
  [state.player, ...(state.members || []), ...(state.applicants || []), ...(state.candidates || []), state.lastApplicant].filter(Boolean).forEach(normalizeMemberGrowthType);
  normalizeCandidatePoolsForCurrentData();
  if (typeof state.promoRecruitTurns === "undefined") state.promoRecruitTurns = 0;
  if (!state.rivalRelations || typeof state.rivalRelations !== "object") state.rivalRelations = {};
  normalizeBandSystemState();
  if (!Array.isArray(state.liveOffers)) state.liveOffers = [];
  if (!Array.isArray(state.phoneMails)) state.phoneMails = [];
  if (!Array.isArray(state.snsPosts)) state.snsPosts = [];
  if (typeof state.activeMailId === "undefined") state.activeMailId = null;
  if (!state.phoneSubView) state.phoneSubView = "menu";
  if (typeof state.phoneAccountEdit === "undefined") state.phoneAccountEdit = null;
  if (typeof state.bandNameFinalized === "undefined") state.bandNameFinalized = !!(state.band?.name && String(state.band.name).trim());
  if (!state.account || typeof state.account !== "object" || Array.isArray(state.account)) state.account = {};
  if (!state.account.email) state.account.email = `${safeProfileSlug(state.band?.name || "bandname")}@under-mail.jp`;
  if (!state.account.snsDisplayName) state.account.snsDisplayName = state.band?.name || "";
  if (!state.account.snsUserName) state.account.snsUserName = `@${safeProfileSlug(state.band?.name || "bandname")}`;
  v043cNormalizeFirstLiveState();
  if (typeof state.openingStep === "undefined") state.openingStep = state.introSeen ? 7 : 0;
  if (typeof state.snsLastSeenCount === "undefined") state.snsLastSeenCount = 0;
  if (!state.snsWorldSeen || typeof state.snsWorldSeen !== "object" || Array.isArray(state.snsWorldSeen)) state.snsWorldSeen = {};
  if (typeof state.snsLastPostTurn === "undefined") state.snsLastPostTurn = 0;
  if (typeof state.snsPostCount === "undefined") state.snsPostCount = 0;
  if (!Array.isArray(state.liveDiagnostics)) state.liveDiagnostics = [];
  if (!Array.isArray(state.liveReservationCandidates)) state.liveReservationCandidates = [];
  if (typeof state.reservationCandidateTurn === "undefined") state.reservationCandidateTurn = 0;
  if (!Array.isArray(state.notificationTurns)) state.notificationTurns = [];
  if (typeof state.bookingInviteBoostTurns === "undefined") state.bookingInviteBoostTurns = 0;
  if (typeof state.pendingAfterparty === "undefined") state.pendingAfterparty = null;
  if (typeof state.pendingAfterpartyEvent === "undefined") state.pendingAfterpartyEvent = null;
  if (typeof state.hangoverTurn === "undefined") state.hangoverTurn = 0;
  state.liveOffers = state.liveOffers.filter(o => o && Number(o.turn || 0) < (state.maxTurn || 50)).slice(0, 20);
  updateLiveOfferStatuses();
  state.phoneMails = state.phoneMails.slice(0, 40);
  state.snsPosts = state.snsPosts.slice(0, 50);
  state.maxTurn = Math.max(50, Number(state.maxTurn || 50));
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
  if (typeof state.pendingMailAction === "undefined") state.pendingMailAction = null;
  if (typeof state.pendingBoostSong === "undefined") state.pendingBoostSong = null;
  if (typeof state.pendingPurchase === "undefined") state.pendingPurchase = null;
  if (!Array.isArray(state.setlistHistory)) state.setlistHistory = [];
  if (!Array.isArray(state.playerSkills)) state.playerSkills = [];
  if (!state.commandCounts || typeof state.commandCounts !== "object") state.commandCounts = {};
  if (!state.seenGuidePopups || typeof state.seenGuidePopups !== "object") state.seenGuidePopups = {};
  if (typeof state.quietGuideMode === "undefined") state.quietGuideMode = true;
  if (typeof state.tutorialSkipHints === "undefined") state.tutorialSkipHints = false;
  if (typeof state.tutorialLastPhonePromptTurn === "undefined") state.tutorialLastPhonePromptTurn = 0;
  if (typeof state.tutorialFirstLiveGoalSeen === "undefined") state.tutorialFirstLiveGoalSeen = false;
  if (typeof state.skillPanelOpen === "undefined") state.skillPanelOpen = true;
  if (!state.devOpenGroups || typeof state.devOpenGroups !== "object" || Array.isArray(state.devOpenGroups)) state.devOpenGroups = { progress: true, events: false, skills: false, balance: false };
  ["progress","events","skills","balance"].forEach((id, idx) => { if (typeof state.devOpenGroups[id] !== "boolean") state.devOpenGroups[id] = idx === 0; });
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
  state.livePrepSupportIds = state.livePrepSupportIds.filter(id => DATA.supportOptions.some(s => s.id === id));
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
  if (!Array.isArray(state.logs)) state.logs = [];
  if (!Array.isArray(state.liveResultHistory)) state.liveResultHistory = [];
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
    else { v043dResetConversationLog(); restoreGame(slot); }
  }));
  document.getElementById("titleBackBtn")?.addEventListener("click", () => { uiMode = "title"; render(); });
}
function goTitle() {
  uiMode = "title";
  v043dResetConversationLog();
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
    state.activePopup = { title:"活動開始", body:"まずは、曲でも作るか……\n作詞・作曲から新曲制作を始めよう。", type:"event", icon:v043eIcon("song") };
    saveGame(false);
    render();
  });
}

function maybeTriggerStoryEvents() {
  if (state.activeStoryEvent || state.activePopup || state.actionResultModal || state.liveProgressModal || state.pendingLiveResultModal || state.liveResultModal || state.pendingAfterparty || state.pendingAfterpartyEvent || state.detailModal || state.livePrepPickerSlot || state.pendingBooking || state.pendingBoostSong || state.pendingCancelLive || state.pendingPurchase || state.saveSlotModal || state.pendingNoSongcraftCommand || state.bandNamePrompt || state.renameBandNamePrompt) return;
  maybeSeedWorldReactionPosts();
  if (mustCompleteFirstDraftTutorial() && !state.firstDraftTutorialPopupShown) {
    state.firstDraftTutorialPopupShown = true;
    state.activePopup = firstDraftTutorialPopup();
    return;
  }
  if (state.turn >= 4 && !v042BandNameReady() && !isLiveTurn()) {
    state.bandNamePrompt = true;
    return;
  }
  if (novelEventsOn() && (state.turn || 1) >= 28 && (state.turn || 1) < 30 && !state.storyFlags?.underFesBeforeNovelSeen && !isLiveTurn()) {
    state.storyFlags = state.storyFlags || {};
    state.storyFlags.underFesBeforeNovelSeen = true;
    startStoryEvent("under_fes_before", { silent:true, context:{} });
    return;
  }
  if (state.pendingFesReveal) {
    state.pendingFesReveal = false;
    state.fesInfoKnown = true;
    state.activePopup = {
      title:"UNDER FES情報入手",
      body:"あの人は、UNDERフェスの主催関係者だったらしい。\nフェス参加条件の目安が分かった。スケジュール帳で確認できるようになった。",
      type:"rare",
      icon:v043eIcon("book")
    };
    return;
  }
  if (shouldWarnNoLivePlan()) {
    state.lastNoLivePlanWarnTurn = state.turn;
    state.activePopup = {
      title:"ライブ予定なし",
      body:"ライブの予定をいれないとな……\n7ターン後までに本番がない。スケジュール帳で出演できるライブを探そう。",
      type:"warn",
      icon:v043eIcon("calendar")
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


function songcraftMaxPerTurn() { let max = 1; if ((state.liveCount || 0) >= 1) max += 1; if (Math.max(craftLevel("lyrics"), craftLevel("music")) >= 3) max += 1; if ((state.playerCraft?.lyricsXp || 0) >= 20 || (state.playerCraft?.musicXp || 0) >= 20) max += 1; if ((state.liveCount || 0) >= 5) max += 1; return clamp(max, 1, 5); }
function songcraftRemainingThisTurn() { state.songcraftUsedCountThisTurn = Number(state.songcraftUsedCountThisTurn || 0); return Math.max(0, songcraftMaxPerTurn() - state.songcraftUsedCountThisTurn); }
function songcraftCountLabel() { return `曲作り ${songcraftRemainingThisTurn()}/${songcraftMaxPerTurn()}`; }
function tutorialRequiredCommandForTurn() { if ((state.liveCount || 0) > 0) return null; if (state.turn === 1) return "recruit"; if (state.turn === 2) return "practice"; if (state.turn === 3) return "promo"; if (state.turn === 4) return "rest"; return null; }
function tutorialCommandMessage(command) { const need = tutorialRequiredCommandForTurn(); if (!need || need === command) return null; const labels = { recruit:"メンバー募集", practice:"練習", promo:"宣伝", rest:"休憩" }; const bodies = { recruit:"待ってるだけじゃメンバーは集まらない。まずは募集をしてみよう。", practice:"曲を演奏する力もライブ評価に影響する。今日は練習してみよう。", promo:"ライブに出るなら、少しでも名前を知ってもらおう。今日は宣伝してみよう。", rest:"疲労が高いとライブで力を出し切れない。ライブに備えて休もう。" }; return { title:`今は${labels[need]}を試そう`, body:bodies[need], type:"guide", icon:v043eIcon("book") }; }
function completeSongcraftTutorial() {
  const wasNeedSongTutorial = state.tutorialStage === "needSong";
  state.songcraftUsedCountThisTurn = Number(state.songcraftUsedCountThisTurn || 0) + 1;
  state.songcraftUsedThisTurn = songcraftRemainingThisTurn() <= 0;
  if (wasNeedSongTutorial) {
    // 初回チュートリアルの作詞作曲は「通常行動とは別枠」。
    // 念のため、旧版セーブ/古い処理で songcraft 由来のターン進行予約が残っていた場合は破棄する。
    if (state.pendingTurnAdvance && String(state.pendingTurnAdvance.source || "").startsWith("songcraft")) {
      state.pendingTurnAdvance = null;
    }
    state.tutorialStage = "needCommand";
    state.view = "home";
    state.activePopup = { title:"今週は何しよう……", body:"曲作りの手応えはあった。\n次は今週の行動を選ぼう。練習・募集・バイトなどでバンドを動かせる。", type:"event", icon:"⚡︎" };
  }
}

function showTutorialBlocked(kind) {
  if (state.hangoverTurn === state.turn && kind !== "command") {
    state.activePopup = { title:"二日酔い", body:"このターンは休憩しかできない。\n曲作りやライブ予約は、休んでからにしよう。", type:"warn", icon:v043eIcon("cross") };
    render();
    return true;
  }
  if (hasPendingSongFinalize() && kind !== "song") {
    focusPendingSongFinalize(true);
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
    state.activePopup = { title:"まずは曲作り", body:"最初は作詞・作曲から始めよう。\nホームの「作詞・作曲」だけが使える。", type:"event", icon:v043eIcon("song") };
    render();
    return true;
  }
  if (state.tutorialStage === "needCommand" && kind !== "command") {
    state.activePopup = { title:"今週の行動を選ぼう", body:"曲作りは進んだ。\n次は「今週の行動へ」から1ターン進めよう。", type:"event", icon:"⚡︎" };
    render();
    return true;
  }
  return false;
}

function render() {
  v043aClearUiRoots();
  if (uiMode === "title") return renderTitleScreen();
  if (uiMode === "slot-new") return renderTitleSlotScreen("new");
  if (uiMode === "slot-load") return renderTitleSlotScreen("load");
  normalizeState();
  v043bNormalizeNavigationState();
  if (!state.introSeen) return renderIntroScreen();
  maybeTriggerStoryEvents();
  v043dQuietTutorialPopup();
  surfaceQueuedPopupIfIdle();
  if (state.ended) return renderEnding();
  const liveMode = isLiveTurn();
  const phoneDuringLive = liveMode && state.view === "phone";
  v043bSyncHomeCommandSelection(liveMode, phoneDuringLive);
  const shellClass = v043bShellClass(liveMode, phoneDuringLive);
  app.innerHTML = `
    <div class="${shellClass}">
      ${renderTopStats()}
      ${v043aRenderBaseContent(liveMode, phoneDuringLive)}
      ${renderNav(liveMode)}
      ${renderGlobalPhoneButton(liveMode)}
      ${renderFloatingHomeButton(liveMode)}
    </div>
  `;
  v043aRenderDetachedRoots();
  bindEvents();
  alignScheduleScrollToCurrentTurn();
  scheduleLiveProgressTimer();
  scheduleTurnNoticeTimer();
  autoSaveGame();
}

/* ===== SKIN_ORDER_v4 PR-E: 演出フック（Sol級・動的レイヤー） =====
   フックはすべて既存関数への「前後呼び出し」またはラップによる再代入で実現し、
   render()等の本体は書き換えない（内部の状態処理・popupQueue drain・autoSave等の
   同期的副作用を一切遅延させない設計。詳細はPR本文の罠手順証跡を参照）。 */
function dgPrefersReducedMotion() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function dgEaseOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function dgNow() {
  return (typeof performance !== "undefined" && typeof performance.now === "function") ? performance.now() : Date.now();
}
/* 戻り値のtoken.cancelled=trueをセットすると次フレーム以降のonUpdateを停止する。
   タップ早送りで値を最終値へ直接セットした直後も、既に開始済みのrAFループが次フレームで
   中間値を上書きしてしまう不具合を防止するため（fix4で発見・dgCountUp全利用箇所に影響） */
function dgCountUp(from, to, durationMs, onUpdate, onDone) {
  const token = { cancelled: false };
  if (dgPrefersReducedMotion() || typeof requestAnimationFrame !== "function") {
    onUpdate(to);
    if (onDone) onDone();
    return token;
  }
  const start = dgNow();
  function step(now) {
    if (token.cancelled) return;
    if (typeof now !== "number") now = dgNow();
    /* rAFのnowはdgNow()呼び出し時点よりわずかに早い値を返すことがあり、tが一瞬負になり
       イージング後に負の中間値が出る不具合を防止（fix4で発見、dgCountUp全利用箇所に影響） */
    const t = Math.min(1, Math.max(0, (now - start) / durationMs));
    const eased = dgEaseOutCubic(t);
    onUpdate(from + (to - from) * eased);
    if (t < 1) requestAnimationFrame(step);
    else if (onDone) onDone();
  }
  requestAnimationFrame(step);
  return token;
}
function dgGetOrCreateOverlayEl(id, className) {
  if (typeof document === "undefined" || !document.body) return null;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.className = className;
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
  }
  return el;
}

/* ===== PR-J: AudioManager（v043f・Web Audio自作合成SE基盤） =====
   命名規約: 関数・変数はv043fプレフィックス、グローバルはv043fAudioの1個のみ。外部素材・
   外部ライブラリは一切使用しない自己完結セクション。解錠（AudioContext生成/resume）は
   最初のユーザー操作まで行わず、解錠前のSE呼び出しは例外を出さず無音でスキップする。
   合成レシピは委託文PR-J付録A（se-console v2.1正典）をそのまま移植した（SKIN_ORDER_PRJ）。
   付録Aのosc(type,f0,f1,...)はf1に0を渡すとピッチスライドなし（f0固定）を表す規約として実装
   （E1の3和音・A3の余韻2本がいずれも単一ピッチのチャイムである実際の音を優先した解釈）。 */
const V043F_SE_MUTE_KEY = "underground_v043_se_muted";
const v043fAudio = {
  ctx: null,
  master: null,
  unlocked: false,
  muted: typeof safeStorageGet === "function" && safeStorageGet(V043F_SE_MUTE_KEY) === "1",
  maxNodes: 16,
  noiseBuffer: null
};
function v043fSetMuted(muted) {
  v043fAudio.muted = !!muted;
  if (typeof safeStorageSet === "function") safeStorageSet(V043F_SE_MUTE_KEY, v043fAudio.muted ? "1" : "0");
}
function v043fEnsureContext() {
  if (v043fAudio.ctx) return v043fAudio.ctx;
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  try {
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    v043fAudio.ctx = ctx;
    v043fAudio.master = master;
    return ctx;
  } catch (e) {
    return null;
  }
}
function v043fUnlock() {
  const ctx = v043fEnsureContext();
  if (!ctx) return;
  v043fAudio.unlocked = true;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
}
function v043fHandleVisibilityResume() {
  if (!v043fAudio.unlocked || !v043fAudio.ctx) return;
  if (typeof document !== "undefined" && document.visibilityState === "visible" && v043fAudio.ctx.state === "suspended") {
    v043fAudio.ctx.resume().catch(() => {});
  }
}
if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
  document.addEventListener("visibilitychange", v043fHandleVisibilityResume);
}
/* 最初期タップ解錠フック: 既存の最初期タップ画面renderTitleScreen()を再代入でラップ
   （wrap-by-reassignment、方針v2.0.2標準）。個別ボタンではなくdocument捕捉フェーズの
   最速の1回（pointerdown/keydown）で解錠する。AudioContextの生成/resumeはユーザー操作の
   コールスタック内で行う必要があるため（PR-J）。 */
let v043fUnlockListenerAttached = false;
function v043fAttachUnlockListenerOnce() {
  if (v043fUnlockListenerAttached || typeof document === "undefined" || typeof document.addEventListener !== "function") return;
  v043fUnlockListenerAttached = true;
  const handler = () => { v043fUnlock(); };
  document.addEventListener("pointerdown", handler, { capture: true, once: true });
  document.addEventListener("keydown", handler, { capture: true, once: true });
}
const dgRenderTitleScreenOriginal = renderTitleScreen;
renderTitleScreen = function () {
  dgRenderTitleScreenOriginal();
  v043fAttachUnlockListenerOnce();
};
function v043fCanPlay() {
  if (v043fAudio.muted) return false;
  const ctx = v043fAudio.ctx;
  if (!ctx || !v043fAudio.unlocked) return false;
  if (ctx.state !== "running") return false;
  return true;
}
function v043fNow() {
  return v043fAudio.ctx ? v043fAudio.ctx.currentTime : 0;
}
function v043fEnv(gainNode, t, peak, dur) {
  const g = gainNode.gain;
  const safePeak = Math.max(peak, 0.0001);
  g.cancelScheduledValues(t);
  g.setValueAtTime(0.0001, t);
  g.exponentialRampToValueAtTime(safePeak, t + 0.005);
  g.exponentialRampToValueAtTime(0.0001, t + 0.005 + Math.max(dur, 0.001));
}
function v043fSpawnGain() {
  const g = v043fAudio.ctx.createGain();
  g.gain.value = 0.0001;
  g.connect(v043fAudio.master);
  return g;
}
/* 簡易上限（既定16ノード）は「その瞬間に同時発音しているノード数」で判定する（区間重なり方式）。
   結果コレオは全SEを先読みで一括スケジュールするため、単純に「予約された累計ノード数」で数えると
   1回の通常再生だけで即座に上限へ達し、後半のC1刻みやD6が無音落ちしてしまう不具合があった。
   区間[開始, 終了)の重なりで数えることで、実際に同時に鳴っているノード数のみを上限判定に使う（PR-J） */
v043fAudio.activeRanges = [];
function v043fPruneRanges(now) {
  v043fAudio.activeRanges = v043fAudio.activeRanges.filter(r => r.end > now);
}
function v043fCountOverlapping(t, end) {
  return v043fAudio.activeRanges.filter(r => r.start < end && r.end > t).length;
}
function v043fRegisterRange(node, t, end) {
  v043fAudio.activeRanges.push({ start: t, end });
  node.onended = () => {
    v043fAudio.activeRanges = v043fAudio.activeRanges.filter(r => !(r.start === t && r.end === end));
  };
}
function v043fOsc(type, f0, f1, t, dur, peak) {
  if (!v043fCanPlay()) return null;
  const ctx = v043fAudio.ctx;
  const end = t + dur + 0.08;
  v043fPruneRanges(ctx.currentTime);
  if (v043fCountOverlapping(t, end) >= v043fAudio.maxNodes) return null;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, t);
  if (f1) osc.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
  const g = v043fSpawnGain();
  v043fEnv(g, t, peak, dur);
  osc.connect(g);
  osc.start(t);
  osc.stop(end);
  v043fRegisterRange(osc, t, end);
  return osc;
}
function v043fGetNoiseBuffer(ctx) {
  if (v043fAudio.noiseBuffer && v043fAudio.noiseBuffer.sampleRate === ctx.sampleRate) return v043fAudio.noiseBuffer;
  const length = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  v043fAudio.noiseBuffer = buffer;
  return buffer;
}
function v043fNoise(t, dur, peak, lpFreq, hpFreq) {
  if (!v043fCanPlay()) return null;
  const ctx = v043fAudio.ctx;
  const end = t + dur + 0.08;
  v043fPruneRanges(ctx.currentTime);
  if (v043fCountOverlapping(t, end) >= v043fAudio.maxNodes) return null;
  const src = ctx.createBufferSource();
  src.buffer = v043fGetNoiseBuffer(ctx);
  let node = src;
  if (lpFreq) {
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = lpFreq;
    node.connect(lp);
    node = lp;
  }
  if (hpFreq) {
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = hpFreq;
    node.connect(hp);
    node = hp;
  }
  const g = v043fSpawnGain();
  v043fEnv(g, t, peak, dur);
  node.connect(g);
  src.start(t);
  src.stop(end);
  v043fRegisterRange(src, t, end);
  return src;
}
/* ===== SE関数（付録A・se-console v2.1正典の合成レシピをそのまま移植） ===== */
function v043fPlayA3(t) {
  return [
    v043fOsc("square", 900, 0, t, .012, .5),
    v043fNoise(t, .16, .9, 900),
    v043fOsc("sine", 150, 50, t, .15, 1.0),
    v043fOsc("sine", 880, 0, t + .02, .45, .12),
    v043fOsc("sine", 1320, 0, t + .02, .35, .07)
  ].filter(Boolean);
}
function v043fPlayB2(t) {
  return [v043fOsc("sine", 1000, 580, t, .05, .4)].filter(Boolean);
}
function v043fPlayC1(t, volume) {
  return [v043fOsc("sine", 2000, 0, t, .015, volume)].filter(Boolean);
}
function v043fPlayD6(t) {
  return [
    v043fOsc("sine", 220, 170, t, .06, .4),
    v043fNoise(t, .05, .3, 900)
  ].filter(Boolean);
}
function v043fPlayE1(t) {
  return [
    v043fOsc("sine", 1500, 0, t, .1, .3),
    v043fOsc("sine", 2000, 0, t + .05, .1, .28),
    v043fOsc("sine", 2600, 0, t + .1, .12, .25)
  ].filter(Boolean);
}
function v043fPlayF1(t) {
  return [v043fOsc("square", 170, 120, t, .09, .35)].filter(Boolean);
}
function v043fPlaySeNow(name) {
  const t = v043fNow();
  if (name === "b2") v043fPlayB2(t);
  else if (name === "f1") v043fPlayF1(t);
  else if (name === "a3") v043fPlayA3(t);
  else if (name === "d6") v043fPlayD6(t);
  else if (name === "e1") v043fPlayE1(t);
}
function v043fStopScheduledNodes(nodes) {
  if (!nodes || !nodes.length || !v043fAudio.ctx) return;
  const now = v043fAudio.ctx.currentTime;
  nodes.forEach(node => { try { node.stop(now); } catch (e) {} });
}
/* --- 結果コレオグラフィのSE配線: 委託文タイムラインどおりの絶対スケジューリング（Web Audioの
   自クロックで事前予約するため、setTimeoutのジッタに影響されない）。呼び出し元でreduced-motion
   判定より前に評価することで、視覚短絡（jumpAllToFinal）とは独立に発音する（PR-J仕様） --- */
function v043fScheduleLiveResultAudio(rank) {
  if (!v043fCanPlay()) return { nodes: [] };
  const t0 = v043fAudio.ctx.currentTime;
  const nodes = [];
  const collect = arr => { if (arr) nodes.push(...arr); };
  for (let ms = 0; ms < 1000; ms += 70) collect(v043fPlayC1(t0 + ms / 1000, 0.16));
  collect(v043fPlayA3(t0 + 1.12));
  if (rank === "S" || rank === "A") {
    collect(v043fPlayE1(t0 + 1.27));
    if (rank === "S") collect(v043fPlayE1(t0 + 1.27 + 0.155));
  }
  for (let ms = 1670; ms < 1670 + 1170; ms += 90) collect(v043fPlayC1(t0 + ms / 1000, 0.10));
  collect(v043fPlayD6(t0 + 2.97));
  return { nodes };
}

/* --- 斜めワイプ: render()を再代入でラップし、state.view変化のみ検知（他の208箇所のrender()呼び出しには無反応） --- */
let dgLastRenderedView;
function dgTriggerWipe() {
  if (dgPrefersReducedMotion()) return;
  const el = dgGetOrCreateOverlayEl("dgWipeOverlay", "dg-wipe");
  if (!el) return;
  el.classList.remove("run");
  void el.offsetWidth;
  el.classList.add("run");
  window.setTimeout(() => { el.classList.remove("run"); }, 430);
}
const dgRenderOriginal = render;
render = function () {
  const prevView = dgLastRenderedView;
  const nextView = state.view;
  const isRealTransition = prevView !== undefined && prevView !== nextView && uiMode === "game" && state.introSeen && !state.ended;
  dgRenderOriginal();
  dgLastRenderedView = state.view;
  if (isRealTransition) dgTriggerWipe();
  if (state.__dgGaugeGrowthSnapshot && state.view === "home" && uiMode === "game" && state.introSeen && !state.ended && !v043aHasPriorityOverlay()) {
    const snapshot = state.__dgGaugeGrowthSnapshot;
    state.__dgGaugeGrowthSnapshot = null;
    dgAnimateHomeGaugeGrowth(snapshot);
  }
};

let v043aUiRuntime = createV043aUiRuntimeState();

function v043aGetUiRoots() {
  return {
    app: document.getElementById("app"),
    phoneRoot: document.getElementById("phoneRoot"),
    toastRoot: document.getElementById("toastRoot"),
    overlayRoot: document.getElementById("overlayRoot")
  };
}

function v043aClearUiRoots() {
  const roots = v043aGetUiRoots();
  [roots.phoneRoot, roots.toastRoot, roots.overlayRoot].forEach(root => {
    if (root) root.innerHTML = "";
  });
  if (uiMode !== "game" || !state?.introSeen || state?.ended) {
    v043aClearAllSelections();
  }
}

function v043aRenderBaseContent(liveMode=false, phoneDuringLive=false) {
  if ((state.view || "home") === "phone") {
    return `<main class="view-panel v042-view-panel phone-open" data-view="phone">${renderHomeScreen()}</main>`;
  }
  return liveMode && !phoneDuringLive ? renderLivePrep() : renderMainContent();
}

function v043aHasPriorityOverlay() {
  return !!(
    state.bandNamePrompt ||
    state.renameBandNamePrompt ||
    state.liveProgressModal ||
    state.liveResultModal ||
    state.pendingAfterparty ||
    state.pendingAfterpartyEvent ||
    state.activeStoryEvent ||
    state.actionResultModal ||
    state.detailModal ||
    state.livePrepPickerSlot ||
    state.pendingMailAction ||
    state.pendingBooking ||
    state.pendingBoostSong ||
    state.pendingCancelLive ||
    state.pendingPurchase ||
    state.saveSlotModal ||
    state.pendingNoSongcraftCommand ||
    state.activePopup ||
    (state.pendingTurnAdvance && !hasFlowModalOpen())
  );
}

function v043aRenderDetachedRoots() {
  const roots = v043aGetUiRoots();
  const priorityOverlay = v043aHasPriorityOverlay();
  if (roots.phoneRoot) roots.phoneRoot.innerHTML = (state.view || "home") === "phone" ? renderPhoneScreen() : "";
  if (roots.overlayRoot) roots.overlayRoot.innerHTML = priorityOverlay ? renderOverlays() : "";
  if (roots.toastRoot) roots.toastRoot.innerHTML = !priorityOverlay && state.turnNotice ? renderTurnNoticeOverlay() : "";
}

function createV043aUiRuntimeState() {
  return { selections: Object.create(null) };
}

function v043aSelectionKey(group) {
  return String(group || "");
}

function v043aSelectionValue(value) {
  if (value == null) return "";
  if (["string", "number", "boolean"].includes(typeof value)) return String(value);
  return "";
}

function v043aGetSelection(group) {
  const key = v043aSelectionKey(group);
  return key ? v043aUiRuntime.selections[key] ?? null : null;
}

function v043aSetSelection(group, value) {
  const key = v043aSelectionKey(group);
  if (!key) return null;
  const next = v043aSelectionValue(value);
  v043aUiRuntime.selections[key] = next;
  return next;
}

function v043aSelectOrConfirm(group, value) {
  const key = v043aSelectionKey(group);
  const next = v043aSelectionValue(value);
  if (!key) return { confirmed: false, changed: false };
  const current = v043aGetSelection(key);
  if (current === next) return { confirmed: true, changed: false };
  v043aSetSelection(key, next);
  return { confirmed: false, changed: true };
}

function v043aClearSelection(group) {
  const key = v043aSelectionKey(group);
  if (key) delete v043aUiRuntime.selections[key];
}

function v043aClearAllSelections() {
  v043aUiRuntime = createV043aUiRuntimeState();
}

function v043aRenderConfirmationSheet(config={}) {
  const tone = config.tone || "event";
  const modalClass = ["confirmation-sheet", config.extraClass || ""].filter(Boolean).join(" ");
  const actionsClass = ["modal-actions", config.actionsClass || ""].filter(Boolean).join(" ");
  const confirmClass = config.confirmClass || "big-action";
  const cancelClass = config.cancelClass || "ghost-btn";
  const confirmAttrs = config.confirmAttrs ? ` ${config.confirmAttrs}` : "";
  const cancelAttrs = config.cancelAttrs ? ` ${config.cancelAttrs}` : "";
  return `<div class="modal-backdrop">
    <div class="event-modal ${escapeHtml(tone)} ${escapeHtml(modalClass)}">
      <div class="modal-icon">${config.icon || "?"}</div>
      <div class="modal-copy"><h2>${escapeHtml(config.title || "確認")}</h2>${config.bodyHtml || ""}</div>
      <div class="${escapeHtml(actionsClass)}"><button id="${escapeHtml(config.confirmId || "confirmSheetBtn")}" class="${escapeHtml(confirmClass)}" data-se="b2"${confirmAttrs}>${escapeHtml(config.confirmLabel || "決定")}</button><button id="${escapeHtml(config.cancelId || "cancelSheetBtn")}" class="${escapeHtml(cancelClass)}" data-se="f1"${cancelAttrs}>${escapeHtml(config.cancelLabel || "戻る")}</button></div>
    </div>
  </div>`;
}

function renderGlobalPhoneButton(liveMode=false) {
  const unread = unreadMailCount();
  const active = state.view === "phone";
  return `<button class="globalPhoneBtn global-phone-btn ${active ? "active" : ""}" title="携帯を開く"><span class="global-phone-icon">▪︎</span><b>携帯</b>${unread ? `<em>${unread}</em>` : ""}</button>`;
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

function parentViewForNav(view) {
  const v = view || "home";
  if (["songs"].includes(v)) return "command";
  if (["fes"].includes(v)) return "schedule";
  if (["shop", "library", "dev"].includes(v)) return "band";
  if (["bandbook"].includes(v)) return "phone";
  if (["log"].includes(v)) return "home";
  return v;
}

function renderNav(liveMode=false) {
  // v0.4.1d: 下部は4タブ。携帯トップは右下の固定ボタンに一本化。
  const tabs = [
    ["home", "ホーム", "■︎", "状況"],
    ["command", "活動", "⚡︎", "行動/曲"],
    ["schedule", "予定", "■︎", "ライブ"],
    ["band", "バンド", "●︎", "管理/図鑑"]
  ];
  const activeParent = parentViewForNav(state.view);
  return `<div class="tabbar tabbar-v040a ${liveMode ? "live-lock" : ""}">
    ${liveMode ? `<div class="tab-live-note">今日はライブ本番。準備画面に集中。</div>` : ""}
    ${tabs.map(([id,label,icon,note]) => `<button class="tabBtn ${activeParent===id ? "active" : ""}" data-view="${id}" ${liveMode ? "disabled" : ""}><span>${icon}</span><b>${label}</b><small>${note}</small></button>`).join("")}
  </div>`;
}

function renderMainContent() {
  let html;
  if (state.view === "command") html = renderCommandDesk();
  else if (state.view === "band") html = renderBandScreen();
  else if (state.view === "songs") html = renderSongsScreen();
  else if (state.view === "schedule") html = renderScheduleScreen();
  else if (state.view === "fes") html = renderFesDetailScreen();
  else if (state.view === "phone") html = renderPhoneScreen();
  else if (state.view === "shop") html = renderShopScreen();
  else if (state.view === "log") html = renderLogScreen();
  else if (state.view === "library") html = renderLibraryScreen();
  else if (state.view === "bandbook") html = renderBandBookScreen();
  else if (state.view === "dev") html = renderDevScreen();
  else html = renderHomeScreen();
  const homeBack = (state.view || "home") !== "home" ? `<button class="jumpTabBtn page-home-btn" data-view="home">←︎ ホームに戻る</button>` : "";
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
  return `<div class="card tips-card ui-prep-panel"><div class="section-title"><h2>v0.3.50 仮実装</h2><span class="badge good">方向性確認</span></div><div class="quiet-guide-chips">${chips.map(c=>`<span class="badge">${escapeHtml(c)}</span>`).join("")}</div><small>50ターン制・初ライブ導線・フェス候補・曲作り回数・コピー曲キャップを確認する仮実装版です。</small></div>`;
}

function maybeShowGuidePopupOnce(key, title, body, type="event", icon="☆︎") {
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

function tutorialPhaseInfo() {
  if ((state.liveCount || 0) > 0) {
    return { title:"初ライブ後", badge:"UNDERへ", body:"初ライブは完了。次は30T UNDER FESに向けて、曲数・代表曲・ライブ実績を積もう。", actionView:"schedule", actionLabel:"UNDER目標を見る" };
  }
  const t = Number(state.turn || 1);
  if (state.tutorialStage === "needSong") return { title:"T1：曲の種", badge:"曲作り", body:"まずは作詞・作曲。曲作りは通常行動とは別枠なので、このあと同じターンで募集や練習もできる。", actionView:"songs", actionLabel:"作詞・作曲へ" };
  if (state.tutorialStage === "needCommand") return { title:"T1：今週の行動", badge:"募集", body:"曲の手応えはできた。次は今週の行動でメンバー募集を試そう。", actionView:"command", actionLabel:"今週の行動へ" };
  if (t === 2) return { title:"T2：完成と練習", badge:"練習", body:"未完成曲を仕上げて、バンドの演奏力を上げよう。疲労も増えるので結果カードで確認。", actionView:"command", actionLabel:"練習へ" };
  if (t === 3) return { title:"T3：宣伝とSNS", badge:"携帯", body:"宣伝すると知名度と曲の認知度が伸びる。携帯のSNSにも反応が流れ始める。", actionView:"command", actionLabel:"宣伝へ" };
  if (t === 4) return { title:"T4：本番前日", badge:"準備", body:"明日は初ライブ。予定から準備チェックを見て、疲労が高ければ休憩も選択肢。", actionView:"schedule", actionLabel:"予定を見る" };
  if (t === 5) return { title:"T5：初ライブ", badge:"本番", body:"今日は初ライブ。セトリ、担当、サポート、最終チェックを見て本番へ進もう。", actionView:"schedule", actionLabel:"ライブ準備へ" };
  return null;
}
function renderTutorialProgressCard() {
  if (state.tutorialSkipHints) return "";
  const info = tutorialPhaseInfo();
  if (!info) return "";
  const skip = (state.liveCount || 0) > 0 ? "" : `<button class="tutorialSkipHintsBtn ghost-btn">説明を少なくする</button>`;
  return `<div class="card tutorial-flow-card"><div class="section-title"><h2>${escapeHtml(info.title)}</h2><span class="badge warn">${escapeHtml(info.badge)}</span></div><p>${escapeHtml(info.body)}</p><div class="modal-actions"><button class="jumpTabBtn big-action" data-view="${escapeHtml(info.actionView)}">${escapeHtml(info.actionLabel)}</button>${skip}</div></div>`;
}
function maybeAddTutorialSnsSeed(command) {
  if (command !== "promo" || (state.liveCount || 0) > 0) return;
  if (state.tutorialLastPhonePromptTurn === state.turn) return;
  state.tutorialLastPhonePromptTurn = state.turn;
  addSnsPost("@livehouse_staff", "初ライブ前の告知を見かけた。地下の新しいバンド、ちょっと気になる。", "event");
}

function unreadMailCount() { return (state.phoneMails || []).filter(m => !m.read).length; }
function isActionableMail(m) {
  if (!m) return false;
  if (v043cIsFirstLiveInviteMail(m)) return !v043cFirstLiveReplyStatus().accepted;
  if ((m.kind || "") === "member") {
    const applicantId = m.payload?.applicantId || "";
    const alreadyMet = m.payload?.status === "met";
    const exists = applicantId ? !!currentApplicantList().find(a => a.id === applicantId) : true;
    return !alreadyMet && exists;
  }
  if ((m.kind || "") === "live_offer") {
    const offerId = m.payload?.offerId;
    const offer = offerId ? (state.liveOffers || []).find(o => o.id === offerId) : null;
    if (!offer) return false;
    updateLiveOfferStatuses();
    return !offer.accepted && !offer.expired && (offer.storyInvite || canBookLiveTurn(offer.turn)) && !liveEventForTurn(offer.turn);
  }
  return false;
}
function actionableMails() {
  return (state.phoneMails || []).filter(isActionableMail).slice(0, 5);
}
function renderPhoneActionRequiredSection() {
  const rows = actionableMails();
  if (!rows.length) {
    return `<div class="card phone-card phone-action-required ok"><div class="section-title"><h2>要返信</h2><span class="badge good">なし</span></div><p><small>返信待ちなし。未読やSNSは下のアプリから。</small></p></div>`;
  }
  return `<div class="card phone-card phone-action-required"><div class="section-title"><h2>要返信</h2><span class="badge warn">${rows.length}件</span></div><p><small>返信待ちの連絡。ここから返せる。</small></p><div class="mail-list pinned-mail-list">${rows.map(renderMailRow).join("")}</div></div>`;
}
function renderPhoneBandBookScreen() {
  const previousDetail = state.bandBookDetail;
  const content = renderBandBookScreen();
  state.bandBookDetail = previousDetail;
  return `<div class="phone-screen grid phone-bandbook-screen"><div class="card phone-card wide-card"><div class="section-title"><h2>バンド図鑑</h2><span class="badge">携帯内</span></div><button class="phoneModeBtn ghost-btn" data-phone-mode="menu">←︎ 携帯メニュー</button><p><small>出会ったバンドの記録。交流が深いほど読める話が増える。</small></p></div>${content}</div>`;
}
function renderPhoneScreen() {
  const mode = state.phoneSubView || "menu";
  if (mode === "mail") return renderMailScreen();
  if (mode === "sns") return renderSnsScreen();
  if (mode === "bandbook") return renderPhoneBandBookScreen();
  const unread = unreadMailCount();
  const nextLive = (state.liveEvents || []).find(e => !e.cancelled && e.turn >= state.turn);
  return `<div class="phone-screen grid phone-menu-screen">
    ${renderPhoneActionRequiredSection()}
    <div class="card phone-card phone-launch-card">
      <div class="section-title"><h2>携帯</h2><span class="badge ${unread ? "warn" : "good"}">${unread ? unread + "件未読" : "通知なし"}</span></div>
      <p><small>返信待ちは上。読み物は下のアプリから。</small></p>
      <div class="phone-app-grid">
        <button class="phoneModeBtn phone-app-btn" data-phone-mode="mail"><span>✉︎</span><b>メール</b><small>件名/送信者から確認${unread ? ` / 未読${unread}` : ""}</small></button>
        <button class="phoneModeBtn phone-app-btn" data-phone-mode="sns"><span>◆︎</span><b>SNS</b><small>口コミ・告知・雑多な投稿</small></button>
        <button class="phoneModeBtn phone-app-btn" data-phone-mode="bandbook"><span>♪︎</span><b>バンド図鑑</b><small>出会ったバンド・交流・スキル</small></button>
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
function mailForLiveOffer(offerId) {
  if (!offerId) return null;
  return (state.phoneMails || []).find(m => m?.payload?.offerId === offerId) || null;
}
function setLiveOfferStatus(offer, status) {
  if (!offer) return;
  offer.status = status;
  offer.accepted = status === "accepted";
  offer.expired = ["expired", "declined", "conflict"].includes(status);
  const mail = mailForLiveOffer(offer.id);
  if (mail) {
    mail.payload = mail.payload || {};
    mail.payload.status = status;
    mail.payload.offerTurn = offer.turn;
    mail.payload.offerId = offer.id;
  }
}
function liveOfferStatusLabel(offer, fallback="open") {
  const status = offer?.status || fallback;
  if (status === "accepted") return { text:"参加済み", cls:"good" };
  if (status === "declined") return { text:"見送り済み", cls:"warn" };
  if (status === "conflict") return { text:"別予定あり", cls:"bad" };
  if (status === "expired") return { text:"期限切れ", cls:"bad" };
  return { text:"未対応", cls:"warn" };
}
function updateLiveOfferStatuses() {
  (state.liveOffers || []).forEach(offer => {
    if (!offer || offer.accepted || offer.expired) return;
    if (!offer.storyInvite && !canBookLiveTurn(offer.turn)) setLiveOfferStatus(offer, "expired");
    else if (liveEventForTurn(offer.turn)) setLiveOfferStatus(offer, "conflict");
    else if (!offer.status) setLiveOfferStatus(offer, "open");
  });
}
function renderMailScreen() {
  updateLiveOfferStatuses();
  const mails = state.phoneMails || [];
  const selected = mails.find(m => m.id === state.activeMailId) || null;
  return `<div class="phone-screen grid mail-modal-screen">
    <div class="card phone-card mail-card wide-card">
      <div class="section-title"><h2>メール</h2><span class="badge ${unreadMailCount() ? "warn" : "good"}">${unreadMailCount()}件未読</span></div>
      <button class="phoneModeBtn ghost-btn" data-phone-mode="menu">←︎ 携帯メニュー</button>
      <p><small>件名を押すと、本文をメール窓で開きます。返信や予定確認も本文内からできます。</small></p>
      ${actionableMails().length ? `<div class="pinned-section"><b>要返信</b><div class="mail-list pinned-mail-list">${actionableMails().map(renderMailRow).join("")}</div></div>` : ""}
      <div class="mail-list subject-only">${mails.length ? mails.map(renderMailRow).join("") : `<div class="empty-panel">メールなし</div>`}</div>
    </div>
    ${selected ? renderMailModal(selected) : ""}
  </div>`;
}
function renderMailModal(m) {
  return `<div class="modal-backdrop mail-modal-backdrop"><div class="event-modal event mail-reader-modal"><div class="modal-icon">✉︎</div><div class="modal-copy">${renderMailDetail(m)}</div><div class="modal-actions confirm-wide"><button class="closeMailDetailBtn ghost-btn">閉じる</button></div></div></div>`;
}
function closeMailDetail() {
  state.activeMailId = null;
  render();
}
function renderMailRow(m) {
  const kind = m.kind || "info";
  return `<button class="mail-row mailOpenBtn mail-row-enhanced ${kind} ${m.read ? "read" : "unread"}" data-mail-id="${escapeHtml(m.id)}">
    <span class="mail-sender-icon">${mailSenderIcon(kind)}</span>
    <span class="mail-row-main"><b>${m.read ? "" : "● "}${escapeHtml(m.subject || "無題")}</b><small>From: ${escapeHtml(m.sender || mailSenderForKind(kind))}</small></span>
    <span class="mail-kind-chip">${escapeHtml(mailKindLabel(kind))}</span>
    <em>${m.turn || "?"}T</em>
  </button>`;
}
function renderMailDetail(m) {
  const offerId = m.payload?.offerId;
  const offer = offerId ? (state.liveOffers || []).find(o => o.id === offerId) : null;
  if (offer) updateLiveOfferStatuses();
  const canAccept = offer && !offer.accepted && !offer.expired && (offer.storyInvite || canBookLiveTurn(offer.turn)) && !liveEventForTurn(offer.turn);
  return `<div class="mail-detail">
    <div class="section-title"><h2><span class="mail-sender-icon detail-icon">${mailSenderIcon(m.kind || "info")}</span>${escapeHtml(m.subject || "無題")}</h2><span class="badge ${m.read ? "good" : "warn"}">${m.read ? "既読" : "未読"}</span></div>
    <small>From: ${escapeHtml(m.sender || mailSenderForKind(m.kind))} / ${escapeHtml(mailKindLabel(m.kind || "info"))} / ${m.turn || "?"}T</small>
    <p>${escapeHtml(m.body || "").replace(/\n/g,"<br>")}</p>
    ${offer ? renderOfferActionsFromMail(offer, canAccept) : renderMailActionsWithoutOffer(m)}
  </div>`;
}
function renderMailActionsWithoutOffer(m) {
  if (v043cIsFirstLiveInviteMail(m)) {
    const status = v043cFirstLiveReplyStatus();
    const action = status.accepted
      ? `<span class="badge good">${escapeHtml(status.mailText)}</span>`
      : `<button class="v043cFirstLiveReplyBtn big-action" data-mail-id="${escapeHtml(m.id)}">「出る」と返事する</button>`;
    return `<div class="mail-offer-actions v043c-first-live-actions"><b>初ライブへの返事</b><small>5ターン目のライブハウスUNDER出演依頼です。返事をすると予定表・ホームの状態が出演確定になります。</small><div class="modal-actions">${action}<button class="openScheduleFromMailBtn ghost-btn">予定表を確認する</button></div></div>`;
  }
  if ((m.kind || "") === "live_offer") {
    return `<div class="mail-offer-actions"><b>ライブ予定の案内</b><small>このライブは固定予定または案内メールです。予定表で開催ターンと準備状況を確認できます。</small><div class="modal-actions"><button class="openScheduleFromMailBtn big-action">予定表を確認する</button></div></div>`;
  }
  return renderMemberActionsFromMail(m);
}
function renderMemberActionsFromMail(m) {
  if ((m.kind || "") !== "member") return "";
  const payload = m.payload || {};
  const applicantId = payload.applicantId || "";
  const known = applicantId ? currentApplicantList().find(a => a.id === applicantId) : null;
  if (payload.status === "met") {
    if (payload.metFound === false) {
      return `<div class="mail-member-actions replied"><b>メンバー候補の連絡</b><small>今回は条件に合う候補が見つかりませんでした。返信処理は完了しています。</small><div class="modal-actions"><span class="badge good">返信済み</span></div></div>`;
    }
    const name = payload.metName || payload.applicantName || known?.name || "メンバー候補";
    return `<div class="mail-member-actions replied"><b>メンバー候補の連絡</b><small>${escapeHtml(name)}と会いました。バンド管理の加入候補から確認できます。</small><div class="modal-actions"><span class="badge good">返信済み</span><button class="openBandFromMailBtn ghost-btn">バンド管理で確認</button></div></div>`;
  }
  const label = known ? `${known.name}と会う` : "返信して会う";
  return `<div class="mail-member-actions"><b>メンバー候補の連絡</b><small>返信すると候補者と会い、加入候補として確認できます。</small><div class="modal-actions"><button class="meetApplicantMailBtn big-action" data-mail-id="${escapeHtml(m.id)}">${escapeHtml(label)}</button><button class="openBandFromMailBtn ghost-btn">候補一覧を見る</button></div></div>`;
}
function renderOfferActionsFromMail(offer, canAccept) {
  const v = venueById(offer.venueId);
  const meta = liveTypeMeta(offer);
  const status = liveOfferStatusLabel(offer);
  if (!canAccept) return `<div class="empty-panel"><b>${escapeHtml(status.text)}</b><br>${offer.turn}T ${escapeHtml(meta.label)} / ${escapeHtml(v.name)}<br>${escapeHtml(liveBookingDeadlineText())}</div>`;
  return `<div class="mail-offer-actions"><b>${offer.turn}T ${escapeHtml(meta.label)} / ${escapeHtml(v.name)}</b><small>${escapeHtml(liveBookingDeadlineText())}</small><div class="modal-actions"><button class="acceptOfferBtn big-action" data-offer-id="${escapeHtml(offer.id)}">ライブ参加の返信をする</button><button class="declineOfferBtn ghost-btn" data-offer-id="${escapeHtml(offer.id)}">見送る</button></div></div>`;
}
function renderSnsScreen() {
  const sns = state.snsPosts || [];
  const postedToday = state.snsLastPostTurn === state.turn;
  const hasUpcomingLive = (state.liveEvents || []).some(e => !e.cancelled && e.turn >= state.turn);
  return `<div class="phone-screen grid">
    <div class="card phone-card sns-card wide-card">
      <div class="section-title"><h2>SNS</h2><span class="badge">旧Twitter風</span></div>
      <button class="phoneModeBtn ghost-btn" data-phone-mode="menu">←︎ 携帯メニュー</button>
      <div class="sns-compose-row">
        <button class="snsPostBtn big-action" data-sns-post="notice" ${postedToday || !hasUpcomingLive ? "disabled" : ""}>告知する</button>
        <button class="snsPostBtn ghost-btn" data-sns-post="chat" ${postedToday ? "disabled" : ""}>雑談する</button>
        <small>${postedToday ? "今日は投稿済み。投稿は1日1回まで。" : "投稿に大きな即時効果はありません。10件でSNS上手。"}</small>
      </div>
      ${renderSnsSpotlight()}
      <div class="sns-feed">${sns.length ? sns.map(renderSnsPost).join("") : `<div class="empty-panel">まだ投稿は流れていません。ライブ後やターン開始時に口コミ・流行が増えます。</div>`}</div>
    </div>
    <div class="card phone-card">
      <div class="section-title"><h2>投稿状況</h2><span class="badge ${hasSkill("sns_master") ? "good" : "warn"}">${state.snsPostCount || 0}/10</span></div>
      <p><small>投稿10件で「SNS上手」を習得。宣伝コマンドの知名度・ライブ招待率が少し上がります。</small></p>
    </div>
  </div>`;
}
function renderSnsSpotlight() {
  const t = state.turn || 1;
  if (t >= 44 && t < 50) return `<div class="sns-spotlight lact"><b>GRAND前の空気</b><small>LACTの名前が近づくほど、タイムラインの温度も変わっていく。</small></div>`;
  if (t >= 28 && t < 30) return `<div class="sns-spotlight fes"><b>UNDER前のざわめき</b><small>ブッキング、告知、対バンの投稿が少し増えている。</small></div>`;
  if ((state.liveCount || 0) > 0) return `<div class="sns-spotlight world"><b>ライブ後の反応</b><small>自分宛てではない投稿にも、世界の動きが混ざっている。</small></div>`;
  return `<div class="sns-spotlight world"><b>地下のタイムライン</b><small>投稿やライブ後の反応で、少しずつ外の世界が見えてくる。</small></div>`;
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

// v0.4.0e: 目標カード強化。UNDER/GRANDまでの「世界の温度」と不足上位をホームで先出しする。
function renderGoalPulseCard() {
  const t = state.turn || 1;
  const grand = t >= 30;
  const goalTurn = grand ? 50 : 30;
  const goalName = grand ? "GRAND UNDER FES" : "UNDER FES";
  const lastResult = (state.liveResultHistory || [])[state.liveResultHistory.length - 1] || null;
  const lines = fesShortageLines(lastResult, grand).slice(0, 3);
  const remain = Math.max(0, goalTurn - t);
  const tone = remain <= 3 ? "bad" : remain <= 7 ? "warn" : "good";
  const world = grand ? (t >= 44 ? "SNSでもLACTとGRANDの名前が流れ始めている。" : "UNDER後の反応を、次の大舞台につなげる時期。") : (t >= 25 ? "UNDER前のライブハウスが少し騒がしくなってきた。" : "まずは初ライブとUNDERへ向けて名前を置いていく。");
  return `<div class="card goal-pulse-card ${tone}"><div class="section-title"><h2>${escapeHtml(goalName)}</h2><span class="badge ${tone}">あと${remain}T</span></div><p><small>${escapeHtml(world)}</small></p><div class="goal-pulse-list">${lines.length ? lines.map(x=>`<span class="goal-pulse-item warn">${escapeHtml(x)}</span>`).join("") : `<span class="goal-pulse-item good">主要ラインは近い。セトリと疲労を整えよう。</span>`}</div><button class="jumpTabBtn ghost-btn" data-view="schedule">条件を見る</button></div>`;
}

// v0.3.72: ホーム上部「次にやること」ガイド
function nextActionSuggestion() {
  const t = state.turn || 1;
  if (isLiveTurn()) return { icon:v043eIcon("live"), text:"今日はライブ本番。準備チェックを確認して本番へ。", view:null };
  if (typeof hasPendingSongFinalize === "function" && hasPendingSongFinalize()) return { icon:v043eIcon("song"), text:"未完成の曲がある。曲作りから仕上げよう（ターンは進まない）。", view:"songs" };
  if ((state.band.fatigue || 0) >= 70) return { icon:v043eIcon("fatigue"), text:`疲労${Math.round(state.band.fatigue)}%。休憩で整えるのが安全。`, view:"command" };
  if (t >= 47 && !grandConditionSnapshot().ok) {
    const ng = grandConditionSnapshot().rows.find(r => !r.ok);
    return { icon:v043eIcon("calendar"), text:`GRANDまであと少し。未達：${ng ? ng.label : "条件"}を優先。`, view:"schedule" };
  }
  if (t >= 26 && t < 30) return { icon:v043eIcon("chart"), text:"30T UNDER FESが近い。条件と疲労、セトリを確認。", view:"schedule" };
  if (typeof shouldWarnNoLivePlan === "function" && shouldWarnNoLivePlan()) return { icon:v043eIcon("calendar"), text:"7ターン先まで本番がない。予定表でライブを入れよう。", view:"schedule" };
  if ((state.songs || []).filter(s => !s.isCover).length < 7 && t >= 20) return { icon:"✍︎", text:`オリジナル曲${(state.songs||[]).filter(s=>!s.isCover).length}/7。GRANDに向けて曲を増やそう。`, view:"songs" };
  return { icon:v043eIcon("spark"), text:"今週どうする？ 練習・宣伝・募集は下のメニューから。", view:"command" };
}
function renderNextActionPanel() {
  const s = nextActionSuggestion();
  const btn = s.view ? `<button class="jumpTabBtn ghost-btn next-action-jump" data-view="${s.view}">開く</button>` : "";
  return `<div class="card next-action-card next-action-card-v040a"><div class="next-action-row"><span class="next-action-icon">${s.icon}</span><div class="next-action-text"><b>次にやること</b><small>${escapeHtml(s.text)}</small></div>${btn}</div></div>`;
}

function renderHomeGuidePanel() {
  const tutorial = !state.tutorialSkipHints && (state.liveCount || 0) === 0 ? tutorialPhaseInfo() : null;
  const suggestion = tutorial || nextActionSuggestion();
  if (!suggestion) return "";
  const title = tutorial ? suggestion.title : "今週のメモ";
  const badge = tutorial ? suggestion.badge : "ガイド";
  const body = tutorial ? suggestion.body : suggestion.text;
  const icon = tutorial ? "☆︎" : (suggestion.icon || "♪︎");
  const actionView = suggestion.actionView || suggestion.view || "";
  const actionLabel = suggestion.actionLabel || "開く";
  const action = actionView ? `<button class="jumpTabBtn ghost-btn home-guide-link" data-view="${escapeHtml(actionView)}">${escapeHtml(actionLabel)}</button>` : "";
  const skip = tutorial ? `<button class="tutorialSkipHintsBtn ghost-btn home-guide-skip">説明を少なく</button>` : "";
  return `<section class="card home-guide-card" aria-label="今週のガイド">
    <div class="home-guide-main"><span>${icon}</span><div><b>${escapeHtml(title)}</b><small>${escapeHtml(body)}</small></div><em>${escapeHtml(badge)}</em></div>
    ${action || skip ? `<div class="home-guide-actions">${action}${skip}</div>` : ""}
  </section>`;
}

function songcraftHomeStatus() {
  const drafts = (state.pendingDrafts || []).filter(d => !(d.lyricsDone && d.musicDone)).length;
  if (mustCompleteFirstDraftTutorial()) return { badge:"未完成", note:"初ライブ用の曲を完成" };
  if (state.songcraftUsedThisTurn) return { badge:"済", note:"今ターンの制作は完了" };
  if (drafts) return { badge:`未${drafts}`, note:"制作中の曲を進める" };
  return { badge:"未", note:"新曲・強化を選べる" };
}

function renderHomePrimaryActions() {
  const commandLocked = state.tutorialStage === "needSong" || mustCompleteFirstDraftTutorial();
  const commandNote = commandLocked ? "先に曲を用意" : "選ぶと1週すすむ";
  const songLocked = !mustCompleteFirstDraftTutorial() && (state.tutorialStage === "needCommand" || state.scheduleTutorialStage === "needSchedule");
  const song = songcraftHomeStatus();
  const songNote = songLocked ? (state.scheduleTutorialStage === "needSchedule" ? "先に予定を確認" : "次は行動を選ぶ") : song.note;
  return `<section class="home-primary-grid" aria-label="主操作">
    <button class="jumpTabBtn home-main-action home-main-command big-action ${commandLocked ? "locked" : ""}" data-view="command" ${commandLocked ? "disabled" : ""}>
      <span>⚡︎</span><b>今週の行動</b><small>${escapeHtml(commandNote)}</small><em>${commandLocked ? "ロック" : "進む"}</em>
    </button>
    <button class="openSongEditorBtn home-main-action home-main-song big-action ${songLocked ? "locked" : ""}" ${songLocked ? "disabled" : ""}>
      <span>♪︎</span><b>作詞・作曲</b><small>${escapeHtml(songNote)}</small><em>${escapeHtml(song.badge)}</em>
    </button>
  </section>`;
}

function renderHomeScheduleStrip() {
  const max = state.maxTurn || 50;
  const base = Number(state.turn || 1);
  const turns = new Set();
  for (let i=0; i<5; i++) { if (base + i <= max) turns.add(base + i); }
  (state.liveEvents || []).filter(e => !e.cancelled && e.turn >= base && e.turn <= base + 8).forEach(e => turns.add(e.turn));
  if (base <= 30) turns.add(30);
  if (base <= 50) turns.add(50);
  const items = [...turns].sort((a,b)=>a-b).slice(0, 8).map(turn => {
    const live = (state.liveEvents || []).find(e => !e.cancelled && e.turn === turn);
    const isNow = turn === base;
    const isFes = turn === 30 || turn === 50;
    let label = isNow ? "今" : `T${turn}`;
    let note = live ? (live.fixed ? "固定" : liveTypeMeta(live).short) : (turn === 30 ? "UNDER" : turn === 50 ? "GRAND" : "準備");
    let icon = live ? "♪︎" : isFes ? "▲︎" : "·";
    return `<button class="jumpTabBtn mini-turn-chip ${isNow ? "now" : ""} ${live ? "live" : ""} ${isFes ? "fes" : ""}" data-view="schedule"><b>${icon} ${escapeHtml(label)}</b><small>${escapeHtml(note)}</small></button>`;
  });
  return `<div class="card home-schedule-strip v041-home-schedule" aria-label="予定ミニライン"><div class="section-title"><h2>週の流れ</h2><span class="badge">予定</span></div><div class="mini-turn-row">${items.join("")}</div></div>`;
}

function renderHomeUtilityTiles() {
  const tiles = [
    homeMenuButton("schedule", "■︎", "予定", canBookSchedules() ? "予約・確認" : "初ライブ後", !canBookSchedules()),
    homeMenuButton("band", "●︎", "バンド", "メンバー"),
    bandSystemOn() ? homeMenuButton("bandbook", "♪︎", "バンド図鑑", `${bandDiscoveredCount()}/${Object.keys(BAND_DATABASE).length}組`) : homeMenuButton("bandbook", "♪︎", "バンド図鑑", "交流記録"),
    homeMenuButton("library", "▶︎", "記録", "歴代・ログ"),
    homeMenuButton("shop", "▼︎", "ショップ", "機材・回復"),
    homeMenuButton("log", "▶︎", "ログ", "履歴")
  ].join("");
  const dev = devModeOn() ? `<div class="home-dev-row">${homeMenuButton("dev", "▪︎", "DEV", "確認")}</div>` : "";
  return `<section class="card home-utility-card v041-home-menu" aria-label="管理メニュー"><div class="section-title"><h2>メニュー</h2><span class="badge">常時</span></div><div class="home-utility-grid v041-core-menu">${tiles}</div>${dev}</section>`;
}

function renderHomeScreen() {
  const latest = firstLine(state.logs[0]);
  const actionable = actionableMails().length;
  return `
    <div class="home-simple home-v040a home-v041a">
      ${renderHomeGuidePanel()}
      ${renderHomePrimaryActions()}
      ${renderHomeScheduleStrip()}
      ${actionable ? `<div class="home-reply-bar"><b>要返信 ${actionable}件</b><span>右下の携帯から確認</span></div>` : ""}
      ${renderHomeUtilityTiles()}
      <div class="card home-log-card home-latest-card"><b>最近のできごと</b><small>${escapeHtml(latest || "地下から始まる。")}</small></div>
      ${renderSavePanel()}
    </div>
  `;
}

function homeMenuButton(view, icon, label, small, forceLocked=false) {
  const scheduleLock = state.scheduleTutorialStage === "needSchedule" && view !== "schedule";
  const draftLock = mustCompleteFirstDraftTutorial() && view !== "songs";
  const locked = view === "dev" ? false : (forceLocked || draftLock || state.tutorialStage === "needSong" || (state.tutorialStage === "needCommand" && view !== "command") || scheduleLock);
  const note = draftLock ? "未完成曲を完成" : state.tutorialStage === "needSong" ? "まずは曲作り" : state.tutorialStage === "needCommand" && view !== "command" ? "先に今週の行動" : scheduleLock ? "まず予定を確認" : small;
  return `<button class="jumpTabBtn menu-tile ${locked ? "locked" : ""}" data-view="${view}" ${locked ? "disabled" : ""}><span>${icon}</span><b>${label}</b><small>${note}</small></button>`;
}
function homeSongMenuButton() {
  const forcedDraft = mustCompleteFirstDraftTutorial();
  const locked = !forcedDraft && (state.tutorialStage === "needCommand" || state.scheduleTutorialStage === "needSchedule");
  const note = forcedDraft ? "未完成曲を完成させる" : state.scheduleTutorialStage === "needSchedule" ? "まず予定を確認" : locked ? "次は行動を選ぼう" : "新曲・強化・未完成曲";
  return `<button class="openSongEditorBtn menu-tile ${locked ? "locked" : ""}" ${locked ? "disabled" : ""}><span>♪︎</span><b>作詞・作曲</b><small>${note}</small></button>`;
}

function renderSavePanel() {
  return `<section class="save-panel home-save-panel">
    <div><b>SAVE</b><span>${saveStatusText(selectedSaveSlot)}</span></div>
    <div class="mini-actions home-save-actions"><button id="saveBtn" class="ghost-btn">セーブ</button><button id="loadBtn" class="ghost-btn">ロード</button><button id="titleBtn" class="ghost-btn">タイトルへ</button><button id="refreshAppBtn" class="ghost-btn update-btn">最新版</button></div>
    ${state.saveNotice ? `<small>${escapeHtml(state.saveNotice)}</small>` : `<small>現在のスロット：${selectedSaveSlot}。セーブ/ロード時にスロットを選べます。</small>`}
  </section>`;
}
function renderPwaPanel() {
  return `<div class="pwa-panel">
    <b>スマホ確認</b>
    <span>GitHub Pagesで開いたら、ブラウザメニューから「ホーム画面に追加」。v0.3.26は縦画面推奨。古い表示なら「最新版を読み込む」。</span><button id="pwaRefreshBtn" class="ghost-btn update-btn">最新版を読み込む</button>
  </div>`;
}

function renderScheduleFesSummary() {
  const grand = (state.turn || 1) >= 30;
  const goalTurn = grand ? 50 : 30;
  const goalName = grand ? "GRAND UNDER FES" : "UNDER FES";
  const remain = Math.max(0, goalTurn - (state.turn || 1));
  if (!state.fesInfoKnown) {
    return `<section class="schedule-fes-summary"><div class="section-title"><h3>フェス進捗</h3><span class="badge warn">未判明</span></div><div class="empty-panel">条件はまだ不明。ライブ後のイベントや業界評価が上がったタイミングで情報が入る。</div><button class="jumpTabBtn ghost-btn" data-view="fes">条件をすべて見る</button></section>`;
  }
  const lastResult = (state.liveResultHistory || [])[state.liveResultHistory.length - 1] || null;
  const grandSnap = grand ? grandConditionSnapshot() : null;
  const shortage = fesShortageLines(lastResult, grand).slice(0, 1);
  const progress = grandSnap ? `達成${grandSnap.rows.filter(r => r.ok).length}/${grandSnap.rows.length}` : underFesProgressText(lastResult);
  return `<section class="schedule-fes-summary">
    <div class="section-title"><h3>${goalName}</h3><span class="badge ${remain <= 3 ? "bad" : remain <= 7 ? "warn" : "good"}">あと${remain}T</span></div>
    <div class="fes-summary-line"><b>${escapeHtml(progress)}</b><span>${shortage[0] ? escapeHtml(shortage[0]) : "主要ラインは近い。疲労とセトリを整えよう。"}</span></div>
    <button class="jumpTabBtn ghost-btn" data-view="fes">条件をすべて見る</button>
  </section>`;
}

function underFesConditionRows(lastResult=null) {
  const originalCount = state.songs.filter(s => !s.isCover).length;
  const hasB = !!lastResult && ["B","A","S"].includes(lastResult.rank);
  return [
    { label:"直近B評価以上", ok:hasB, value:lastResult ? lastResult.rank : "なし" },
    { label:"ファン60", ok:state.band.fans >= 60, value:state.band.fans },
    { label:"知名度60", ok:state.band.fame >= 60, value:state.band.fame },
    { label:"業界評価55", ok:state.band.industry >= 55, value:state.band.industry },
    { label:"オリジナル5曲", ok:originalCount >= 5, value:`${originalCount}曲` },
  ];
}
function underFesProgressText(lastResult=null) {
  const rows = underFesConditionRows(lastResult);
  return `達成${rows.filter(r => r.ok).length}/${rows.length}`;
}
function fesNextStepText(lastResult=null, grand=false) {
  const shortage = fesShortageLines(lastResult, grand);
  if (shortage.length) return shortage[0];
  return grand ? "GRAND主要ラインは近い。直近ライブ評価と疲労を整えよう。" : "UNDER主要ラインは近い。セトリと疲労を整えよう。";
}

function renderSchedulePanel() {
  updateLiveOfferStatuses();
  const upcoming = (state.liveEvents || []).filter(e => !e.cancelled && e.turn >= state.turn).sort((a,b)=>a.turn-b.turn);
  const planned = upcoming.slice(0, 8);
  const canBook = canBookSchedules();
  const candidates = canBook ? buildLiveCandidates() : [];
  const houseCandidates = canBook ? buildHouseEventCandidates() : [];
  const festivalCandidates = canBook ? buildFestivalCandidates() : [];
  const offers = (state.liveOffers || [])
    .filter(o => !o.accepted && !o.expired && o.status !== "declined" && (o.storyInvite || canBookLiveTurn(o.turn)) && o.turn > state.turn && !liveEventForTurn(o.turn))
    .slice(0, 4);
  const next = upcoming[0];
  const tab = v043cScheduleTab();
  const tabs = `<div class="v043c-schedule-tabs" role="tablist" aria-label="予定タブ">
    <button class="v043cScheduleTabBtn ${tab === "planned" ? "active" : ""}" data-schedule-tab="planned" role="tab" aria-selected="${tab === "planned" ? "true" : "false"}">${v043eIcon("calendar")}予定</button>
    <button class="v043cScheduleTabBtn ${tab === "discover" ? "active" : ""}" data-schedule-tab="discover" role="tab" aria-selected="${tab === "discover" ? "true" : "false"}">${v043eIcon("ticket")}出演先を探す</button>
  </div>`;
  const plannedPane = `<section class="schedule-panel schedule-booked-panel v043c-schedule-pane">
    <div class="section-title"><h3>${v043eIcon("clock")}次のライブ</h3><span class="badge good">${v043eIcon("check")}最優先</span></div>
    ${next ? renderNextLiveDetail(next) : `<div class="empty-panel">今後のライブ予定なし。出演先を探すタブからライブを入れよう。</div>`}
    <hr class="soft" />
    <div class="section-title"><h3>${v043eIcon("calendar")}今後の予定</h3><span class="badge">${v043eIcon("ticket")}自主/固定/参加</span></div>
    <div class="schedule-vertical-list booked-list">
      ${planned.map(e => renderScheduleEvent(e)).join("") || `<div class="schedule-event empty-panel">今後の予定なし</div>`}
    </div>
    <hr class="soft" />
    ${renderScheduleFesSummary()}
    <hr class="soft" />
    <details class="v043c-past-live-details"><summary>${v043eIcon("log")}過去のライブ結果ログ</summary>${renderLiveHistoryList(6)}</details>
  </section>`;
  const discoverPane = `<section class="live-candidates-panel v043c-schedule-pane">
    <div class="section-title"><h3>${v043eIcon("mail")}出演通知メール</h3><span class="badge ${offers.length ? "good" : "warn"}">${offers.length ? `${offers.length}件` : "未着"}</span></div>
    <div class="live-candidate-list offer-mini-list">
      ${offers.map(renderLiveOfferMini).join("") || `<div class="empty-panel">出演通知はまだありません。宣伝・交流で届きやすくなります。</div>`}
    </div>
    <small>メールから参加可能。ブッキングは会場費ではなく参加費なので、序盤〜中盤の現実的な経験ルートです。</small>
    <hr class="soft" />
    <div class="section-title"><h3>${v043eIcon("warning")}フェス候補</h3><span class="badge warn">高難度</span></div>
    <div class="live-candidate-list">
      ${festivalCandidates.map(renderLiveCandidate).join("") || `<div class="empty-panel">今ターン申込できる追加フェスはありません。20/25/35/40T付近に出現します。</div>`}
    </div>
    <hr class="soft" />
    <div class="section-title"><h3>${v043eIcon("ticket")}ライブハウスイベント</h3><span class="badge ${canBook ? "good" : "warn"}">${canBook ? "自分から参加可能" : "初ライブ後に解放"}</span></div>
    <div class="live-candidate-list">
      ${canBook ? houseCandidates.map(renderLiveCandidate).join("") || `<div class="empty-panel">今ターン参加申込できるライブハウスイベントはありません。メール通知も確認してみよう。</div>` : `<div class="empty-panel">初ライブ後から、ライブハウスイベントに自分から参加できます。</div>`}
    </div>
    <hr class="soft" />
    <div class="section-title"><h3>${v043eIcon("calendar")}自主企画の会場候補</h3><span class="badge ${canBook ? "good" : "warn"}">${canBook ? "ワンマン/対バン" : "初ライブ後に解放"}</span></div>
    <div class="live-candidate-list">
      ${canBook ? candidates.map(renderLiveCandidate).join("") || `<div class="empty-panel">予約可能な自主企画候補がありません。</div>` : `<div class="empty-panel">初ライブ後から、スケジュール帳で自主企画ライブを決定できます。</div>`}
    </div>
    <small>ワンマンは高難度。対バンは交流と集客の助けがある代わりに報酬は分配寄りです。</small>
  </section>`;
  return `<div class="schedule-screen-split extended-schedule ui-prep-schedule v043c-schedule-tabs-screen">${tabs}${tab === "discover" ? discoverPane : plannedPane}</div>`;
}
function renderNextLiveDetail(ev) {
  const v = venueById(ev.venueId);
  const meta = liveTypeMeta(ev);
  const prep = estimatePrepScore();
  const bands = invitedBandsForEvent(ev);
  const remaining = Math.max(0, ev.turn - state.turn);
  const firstLiveStatus = v043cIsFirstLiveEvent(ev) ? v043cFirstLiveReplyStatus() : null;
  return `<div class="next-live-detail schedule-event ${prep >= v.prepNeed ? "good" : "risk"}">
    <strong>${v043eIcon("clock")}NEXT LIVE：${ev.turn}T / あと${remaining}T</strong>
    <b>${escapeHtml(meta.label)} / ${escapeHtml(v.name)}</b>
    <span>${escapeHtml(meta.short)}・キャパ${v.capacity}・${escapeHtml(meta.feeLabel)}${eventBaseCost(ev, v).toLocaleString()}円</span>
    ${firstLiveStatus ? `<span class="badge ${firstLiveStatus.cls}">${v043eIcon(firstLiveStatus.accepted ? "check" : "warning")}${escapeHtml(firstLiveStatus.scheduleText)}</span>` : ""}
    <small>準備 ${val(prep)} / 必要 ${v.prepNeed}${prep < v.prepNeed ? `（不足${val(v.prepNeed - prep)}）` : ""}</small>
    ${bands.length ? `<small>共演：${bands.map(b => escapeHtml(b.name)).join(" / ")}</small>` : `<small>単独/固定イベント。自分たちの集客力が重要。</small>`}
  </div>`;
}
function renderLiveOfferMini(offer) {
  const v = venueById(offer.venueId);
  const meta = liveTypeMeta(offer);
  const bands = invitedBandsForEvent(offer);
  const blocked = !!liveEventForTurn(offer.turn) || (!offer.storyInvite && !canBookLiveTurn(offer.turn)) || offer.expired || offer.status === "conflict";
  return `<div class="schedule-event candidate ${blocked ? "risk" : "good"}">
    <b>${v043eIcon(blocked ? "warning" : "ticket")}${offer.turn}T ${escapeHtml(meta.short)}：${escapeHtml(v.name)}</b>
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
function scheduleCandidateMixForTurn(turn=state.turn) {
  if (turn < 18) return { self:1, house:2 };
  if (turn < 36) return (turn % 2 === 0) ? { self:1, house:2 } : { self:2, house:1 };
  return { self:2, house:1 };
}
function generateReservationCandidatesForTurn() {
  const target = scheduleCandidateMixForTurn().self;
  const availableVenues = VENUES.filter(v => (state.turn >= 30 || !["big_stage"].includes(v.id)) && (state.turn >= 16 || !["warehouse"].includes(v.id)));
  const openTurns = [];
  for (let t = state.turn + 3; t < (state.maxTurn || 50) && openTurns.length < 7; t++) { if (!liveEventForTurn(t)) openTurns.push(t); }
  const candidates = [];
  const usedCaps = new Set();
  for (let i = 0; i < openTurns.length && candidates.length < target; i++) {
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
  return state.liveReservationCandidates.filter(c => canBookLiveTurn(c.turn) && !liveEventForTurn(c.turn));
}

function generateHouseEventCandidatesForTurn() {
  const target = scheduleCandidateMixForTurn().house;
  const availableVenues = VENUES.filter(v => v.id !== "big_stage" && (state.turn >= 14 || v.id !== "warehouse"));
  const candidates = [];
  for (let i = 2; i <= 8 && candidates.length < target; i++) {
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
  return state.liveHouseEventCandidates.filter(c => canBookLiveTurn(c.turn) && !liveEventForTurn(c.turn));
}

function generateFestivalCandidatesForTurn() {
  const specs = bandSystemOn() ? [
    { turn:20, type:"band_fes", venueId:"warehouse", bands:["pachi_pachi", "hyper_marmoty"], label:"バンド主催フェス" },
    { turn:25, type:"corp_fes", venueId:"big_stage", bands:["jack_bomb", "ultimate_quokkas"], label:"企業主催フェス" },
    { turn:35, type:"corp_fes", venueId:"big_stage", bands:["shelter", "neon_reef"], label:"企業主催フェス" },
    { turn:40, type:"band_fes", venueId:"big_stage", bands:["rumble_sand", "kaede"], label:"バンド主催フェス" }
  ] : [
    { turn:20, type:"band_fes", venueId:"warehouse", bands:["paper_moon", "after_school_noise"], label:"バンド主催フェス" },
    { turn:25, type:"corp_fes", venueId:"big_stage", bands:["iron_laundry", "tokyo_firefly"], label:"企業主催フェス" },
    { turn:35, type:"corp_fes", venueId:"big_stage", bands:["blue_terminal", "melted_siren"], label:"企業主催フェス" },
    { turn:40, type:"band_fes", venueId:"big_stage", bands:["starless_line", "zero_signal"], label:"バンド主催フェス" }
  ];
  return specs.filter(sp => sp.turn > state.turn && canBookLiveTurn(sp.turn) && !liveEventForTurn(sp.turn)).map(sp => ({ turn:sp.turn, venueId:sp.venueId, liveType:sp.type, invitedBandIds:sp.bands, festival:true, label:sp.label }));
}
function buildFestivalCandidates() { return generateFestivalCandidatesForTurn(); }

function renderLiveCandidate(c) {
  const v = venueById(c.venueId);
  const ev = { ...c, fixed:false };
  const profile = liveRiskProfile(v);
  const cls = profile.cls === "good" ? "good" : profile.cls === "bad" ? "risk" : "warn";
  const meta = liveTypeMeta(ev);
  const fee = eventBaseCost(ev, v);
  const bands = invitedBandsForEvent(ev);
  return `<button class="liveCandidateBtn schedule-event candidate ${cls}" data-turn="${c.turn}" data-venue="${v.id}" data-live-type="${escapeHtml(c.liveType || "self_one_man")}" data-bands="${escapeHtml((c.invitedBandIds || []).join(","))}">
    <strong class="candidate-turn">${v043eIcon("clock")}${c.turn}ターン</strong>
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
  const firstLiveStatus = v043cIsFirstLiveEvent(e) ? v043cFirstLiveReplyStatus() : null;
  const cancelBtn = canCancel ? `<button class="cancelLiveBtn ghost-btn" data-turn="${e.turn}">キャンセル</button>` : (!e.fixed ? `<small class="deadline-note">残り2ターン以内：変更不可</small>` : "");
  return `<div class="schedule-event ${cls}">
    <b>${v043eIcon(e.fixed ? "calendar" : "ticket")}${e.turn}T ${escapeHtml(e.label || e.name || meta.short)}</b>
    <span><span class="badge good">${v043eIcon("ticket")}${escapeHtml(meta.short)}</span> ${escapeHtml(meta.label)} / ${escapeHtml(v.name)}</span>
    ${firstLiveStatus ? `<span class="badge ${firstLiveStatus.cls}">${v043eIcon(firstLiveStatus.accepted ? "check" : "warning")}${escapeHtml(firstLiveStatus.scheduleText)}</span>` : ""}
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
  const offer = { id:`offer_${state.turn}_${Date.now()}_${Math.floor(Math.random()*9999)}`, turn, venueId:v.id, liveType:type, invitedBandIds:bands.map(b=>b.id), accepted:false, expired:false, status:"open", createdTurn:state.turn };
  state.liveOffers = Array.isArray(state.liveOffers) ? state.liveOffers : [];
  state.liveOffers.unshift(offer);
  state.liveOffers = state.liveOffers.slice(0, 12);
  const meta = liveTypeMeta(type);
  const fee = eventBaseCost(offer, v);
  const mailId = addMail(`${meta.short}の出演通知`, `${turn}ターン目、${v.name}の${meta.short}に出演できます。
${meta.feeLabel}：${fee.toLocaleString()}円
共演：${bands.map(b=>b.name).join(" / ") || "ライブハウスイベント枠"}
携帯のメールから参加できます。`, "live_offer", { offerId:offer.id, offerTurn:turn, status:"open", sender: type === "booking_band" ? (bands[0]?.name || "対バン企画担当") : `${v.name} 店長`, senderBandId: type === "booking_band" ? (bands[0]?.id || null) : null });
  offer.mailId = mailId;
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
    const roster = rosterBands();
    const b = roster[rand(0, roster.length-1)];
    addSnsPost(`@${b.id}`, `${b.name} 次の企画に向けて対バン探し中。${b.genre}寄りの夜にしたい。`, "event", b.id);
    return;
  }
  const genres = ["青春パンク", "メロディックパンク", "オルタナロック", "エモ", "ポップパンク", "ガレージロック"];
  const words = ["夜", "焦燥", "帰り道", "ネオン", "叫び", "青春", "革命", "居場所"];
  const g = genres[rand(0, genres.length - 1)];
  const w = words[rand(0, words.length - 1)];
  addSnsPost("@underground_feed", `今週、${g}と「${w}」っぽい歌詞の反応が少し良い。ライブ後の口コミもその辺りに寄ってる。`, "trend");
}
function requestLiveOfferAccept(offerId) {
  const offer = (state.liveOffers || []).find(o => o.id === offerId);
  if (!offer) { log("対象の出演通知が見つからない。", "warn"); render(); return; }
  updateLiveOfferStatuses();
  state.pendingMailAction = { type:"live_offer", offerId };
  render();
}
function requestMeetApplicantFromMail(mailId) {
  const mail = (state.phoneMails || []).find(m => m.id === mailId);
  if (!mail) { log("対象のメールが見つからない。", "warn"); render(); return; }
  mail.read = true;
  state.pendingMailAction = { type:"member", mailId, applicantId:mail.payload?.applicantId || "" };
  render();
}
function confirmMailAction() {
  const a = state.pendingMailAction || {};
  state.pendingMailAction = null;
  if (a.type === "first_live_reply") { v043cConfirmFirstLiveReply(a.mailId); return; }
  if (a.type === "live_offer") { acceptLiveOffer(a.offerId); return; }
  if (a.type === "member") {
    const mail = (state.phoneMails || []).find(m => m.id === a.mailId);
    let applicant = a.applicantId ? currentApplicantList().find(x => x.id === a.applicantId) : null;
    if (!applicant) applicant = addApplicantFromCandidates("メール返信");
    if (mail) {
      mail.read = true;
      mail.payload = mail.payload || {};
      mail.payload.status = "met";
      mail.payload.metFound = !!applicant;
      mail.payload.metName = applicant?.name || "";
    }
    if (applicant) {
      showEventPopup("メンバー候補と会った", `${applicant.name}と会った。\nバンド情報の加入候補から、加入させるか選べます。`, "event", v043eIcon("band"));
    } else {
      showEventPopup("今回は会えなかった", "条件に合う候補が見つからなかった。\nライブや宣伝で知名度を上げると、新しい候補が来やすくなります。", "warn", v043eIcon("recruit"));
    }
    render();
    return;
  }
  render();
}
function cancelMailAction() { state.pendingMailAction = null; render(); }
function renderMailActionConfirmOverlay() {
  const a = state.pendingMailAction || {};
  if (a.type === "first_live_reply") {
    return v043aRenderConfirmationSheet({ icon:v043eIcon("mail"), tone:"event", extraClass:"mail-action-modal", title:"T5 初ライブへの返事", bodyHtml:"<p>ライブハウスUNDERへ、初ライブに出演すると返事します。</p>", actionsClass:"confirm-wide", confirmId:"confirmMailActionBtn", confirmLabel:"出演すると返事する", cancelId:"cancelMailActionBtn", cancelLabel:"まだ返事しない" });
  }
  if (a.type === "live_offer") {
    const offer = (state.liveOffers || []).find(o => o.id === a.offerId);
    if (!offer) { state.pendingMailAction = null; return ""; }
    const v = venueById(offer.venueId);
    const meta = liveTypeMeta(offer);
    return v043aRenderConfirmationSheet({ icon:v043eIcon("mail"), tone:"event", extraClass:"mail-action-modal", title:"ライブ参加の返信を送る？", bodyHtml:`<p>${offer.turn}T ${escapeHtml(meta.label)} / ${escapeHtml(v.name)}に参加します。\n予定表に追加しますか？</p><p>${escapeHtml(meta.feeLabel)}${eventBaseCost(offer, v).toLocaleString()}円</p>`, actionsClass:"confirm-wide", confirmId:"confirmMailActionBtn", confirmLabel:"返信して予定に追加", cancelId:"cancelMailActionBtn", cancelLabel:"戻る" });
  }
  if (a.type === "member") {
    const mail = (state.phoneMails || []).find(m => m.id === a.mailId);
    const who = mail?.payload?.applicantName || mail?.sender || "メンバー候補";
    return v043aRenderConfirmationSheet({ icon:v043eIcon("band"), tone:"event", extraClass:"mail-action-modal", title:"メンバー候補に返信する？", bodyHtml:`<p>メールを送ってきた${escapeHtml(who)}と会いますか？\n会うと加入候補として表示されます。</p>`, actionsClass:"confirm-wide", confirmId:"confirmMailActionBtn", confirmLabel:"返信して会う", cancelId:"cancelMailActionBtn", cancelLabel:"戻る" });
  }
  state.pendingMailAction = null;
  return "";
}

function acceptLiveOffer(offerId) {
  const offer = (state.liveOffers || []).find(o => o.id === offerId);
  if (!offer) { log("対象の出演通知が見つからない。", "warn"); render(); return; }
  updateLiveOfferStatuses();
  if (offer.accepted) { log("この出演通知は参加済みです。", "info"); render(); return; }
  if (!offer.storyInvite && !canBookLiveTurn(offer.turn)) { setLiveOfferStatus(offer, "expired"); log("この出演通知は期限切れです。", "warn"); render(); return; }
  if (liveEventForTurn(offer.turn)) { setLiveOfferStatus(offer, "conflict"); log("そのターンは既に別のライブ予定があるため、出演通知を見送った。", "warn"); render(); return; }
  const v = venueById(offer.venueId);
  const meta = liveTypeMeta(offer);
  const ev = { ...makeLiveEventRecord(offer.turn, offer.venueId, offer.liveType, offer.invitedBandIds), offerId:offer.id, accepted:true };
  if (!addLiveEventPreservingSchedule(ev)) { setLiveOfferStatus(offer, "conflict"); log("そのターンは既に別のライブ予定があるため、出演通知を見送った。", "warn"); render(); return; }
  setLiveOfferStatus(offer, "accepted");
  log(`${offer.turn}Tの「${meta.label} / ${v.name}」に参加することにした。${meta.feeLabel}${eventBaseCost(ev, v).toLocaleString()}円。`, "event");
  addSnsPost("@our_band", `${offer.turn}T ${v.name}、出演決定。${meta.short}で一本やります。`, "self");
  render();
}
function declineLiveOffer(offerId) {
  const offer = (state.liveOffers || []).find(o => o.id === offerId);
  if (offer) setLiveOfferStatus(offer, "declined");
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
    <div class="command-desk-screen">
      <section class="card success-panel command-window">
        <div class="success-window-title"><span>COMMAND</span><b>今週の行動</b><small>行動カードを押すと1ターン進行</small></div>
        <div class="coach-line quiet"><b>状況</b><span>${quietGuideLine()}</span><div class="quiet-guide-chips inline">${renderGuideChips(2)}</div></div>
        <p class="one-turn-note"><small>選ぶと1週すすむ。曲作りはホームの「作詞・作曲」から別枠で行えます。</small></p>
        ${renderCommandCards()}
        ${currentApplicantList().length ? renderApplicantList() : ""}
      </section>
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
        <p><small>バンド編成・主人公スキル・バンド名変更をここで確認します。改名すると認知度がごく少し下がります。</small></p>
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
        <div class="section-title"><h2>外部バンド記録</h2><span class="badge">交流/予定</span></div>
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
  if (bandSystemOn()) return renderBandDirectoryV060();
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
  return `<div class="stage-slot ${active}"><button class="stage-main selectMemberBtn" data-member-id="${m.id}">${renderAvatarPortrait(m.portraitId || m.id, m.name, m.part)}<div><b>${m.name}</b><small>${role} / ${m.part}</small><span class="badge warn">${m.mainGenre}</span></div></button>${actions}</div>`;
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
    <div class="schedule-screen">
      <div class="card full-card">${renderSchedulePanel()}</div>
    </div>
  `;
}

function renderFesDetailScreen() {
  const t = state.turn || 1;
  const lastResult = (state.liveResultHistory || [])[state.liveResultHistory.length - 1] || null;
  const grand = t >= 30;
  const goalTurn = grand ? 50 : 30;
  const goalName = grand ? "GRAND UNDER FES" : "UNDER FES";
  const currentRemain = Math.max(0, goalTurn - t);
  const underRemain = Math.max(0, 30 - t);
  const grandRemain = Math.max(0, 50 - t);
  const currentProgress = grand ? (() => { const snap = grandConditionSnapshot(); return `達成${snap.rows.filter(r => r.ok).length}/${snap.rows.length}`; })() : underFesProgressText(lastResult);
  const step = fesNextStepText(lastResult, grand);
  return `<div class="fes-detail-screen">
    <section class="card full-card fes-detail-card">
      <div class="section-title"><h2>フェス条件</h2><span class="badge ${state.fesInfoKnown ? "good" : "warn"}">${state.fesInfoKnown ? "全文" : "未判明"}</span></div>
      <div class="fes-detail-brief">
        <div class="fes-detail-current"><b>${goalName}</b><span class="badge ${currentRemain <= 3 ? "bad" : currentRemain <= 7 ? "warn" : "good"}">あと${currentRemain}T</span><small>${escapeHtml(currentProgress)}</small></div>
        <div class="fes-detail-step"><b>今できる一歩</b><span>${escapeHtml(step)}</span></div>
        <div class="fes-detail-countdown"><span>UNDER あと${underRemain}T</span><span>GRAND あと${grandRemain}T</span></div>
      </div>
      ${renderFesInfoPanel()}
    </section>
  </div>`;
}

function renderFesInfoPanel() {
  if (!state.fesInfoKnown) {
    return `<div class="empty-panel">フェス条件はまだ不明。ライブ後のイベントや業界評価が上がったタイミングで情報が入る。</div>`;
  }
  const originalCount = state.songs.filter(s=>!s.isCover).length;
  const lastResult = state.liveResultHistory[state.liveResultHistory.length - 1] || null;
  const hasB = !!lastResult && ["B","A","S"].includes(lastResult.rank);
  const hasA = !!lastResult && ["A","S"].includes(lastResult.rank);
  const hasGrandScore80 = !!lastResult && (Number(lastResult.total) || 0) >= 80;
  const repCount = state.songs.filter(s => hasTag(s,"代表曲候補") || hasTag(s,"定番")).length;
  const freshCount = state.songs.filter(s => !s.isCover && (s.livePlays || 0) <= 1 && state.turn - (s.createdTurn || 0) <= 10).length;
  return `<div class="goal-board compact-goals">
    <p><small>30ターン目は中間目標の UNDER FES。50ターン目は、さらに難しい GRAND UNDER FES を目指す。</small></p>
    <h3>30T：UNDER FES 目安</h3>
    <div class="goal-grid">
      ${goalChip("直近B評価以上", hasB, lastResult ? lastResult.rank : "なし")}
      ${goalChip("ファン60", state.band.fans >= 60, state.band.fans)}
      ${goalChip("知名度60", state.band.fame >= 60, state.band.fame)}
      ${goalChip("業界評価55", state.band.industry >= 55, state.band.industry)}
      ${goalChip("オリジナル5曲", originalCount >= 5, `${originalCount}曲`)}
    </div>
    <h3>50T：GRAND UNDER FES 目安</h3>
    <div class="goal-grid">
      ${goalChip("直近A評価以上", hasA, lastResult ? lastResult.rank : "なし")}
      ${goalChip("直近総合80以上", hasGrandScore80, lastResult ? val(lastResult.total) : "なし")}
      ${goalChip("ファン180", state.band.fans >= 180, state.band.fans)}
      ${goalChip("知名度135", state.band.fame >= 135, state.band.fame)}
      ${goalChip("業界評価118", state.band.industry >= 118, state.band.industry)}
      ${goalChip("オリジナル7曲", originalCount >= 7, `${originalCount}曲`)}
      ${goalChip("代表/定番3曲", repCount >= 3, `${repCount}曲`)}
      ${goalChip("新しめの曲1曲", freshCount >= 1, `${freshCount}曲`)}
    </div>
  </div>`;
}


function openSongEditor(step="menu") {
  if (hasPendingSongFinalize()) { focusPendingSongFinalize(false); return; }
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
    return `<div class="section-title"><h2>曲エディタ</h2><span class="badge good">今ターン未実行</span></div><p><small>新曲作成・曲強化・未完成曲の続きはここから進めます。曲作り系は成長に応じて1ターン内で複数回進められます。</small></p><button class="songEditorChoiceBtn big-action" data-action="editor:menu">曲エディタを開く</button>`;
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
function editorBackButton() { return `<button class="songEditorChoiceBtn ghost-btn editor-back-btn" data-action="editor:back">←︎ 戻る</button>`; }
function lyricWordsFromText(text="") { return String(text || "").split(/[、,\s/]+/).filter(Boolean).slice(0,3); }
function renderLyricWordInputs(words=[]) {
  return `<div class="lyric-word-grid clear-lyric-grid">${[1,2,3].map(i=>`<div class="lyric-word-row"><label>${i}語目</label><div class="title-input-row"><input id="editorKeywordInput${i}" value="${escapeHtml(words[i-1] || "")}" placeholder="${i===1 ? "例：午前二時" : i===2 ? "例：コンビニ前" : "例：まだ鳴ってる"}" /><button class="keywordDiceBtn" data-target="${i}" type="button">●︎</button></div></div>`).join("")}</div>`;
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
      ${choiceButton(`<span>${v043eIcon("song")}</span><b>曲作成</b>`, "compose:menu", "", "新曲作成・未完成曲の続き")}
      ${choiceButton(`<span>${v043eIcon("song")}</span><b>編曲</b>`, "arrange:menu", state.songs.length ? "" : "disabled", "曲強化・曲編集")}
    </div>`;
  }
  if (ed.step === "composeMenu") {
    const hasDrafts = state.pendingDrafts.length > 0;
    const tutorialTargets = firstDraftTutorialTargets();
    if (tutorialTargets.length) {
      return `<div class="editor-summary tutorial-box"><b>2ターン目：未完成曲を完成させよう</b><span>ホームから作詞・作曲を開き、1ターン目の未完成曲を選ぼう。作っていない作詞/作曲を進めると曲が完成します。</span></div><div class="choice-grid song-choice">${tutorialTargets.map(d=>choiceButton(`<b>${escapeHtml(d.titleHint)}</b>`, `draft:select:${d.id}`, "", draftProgressSmall(d))).join("")}</div>`;
    }
    return `<div class="choice-grid main-choice-grid">
      ${choiceButton(`<span>${v043eIcon("song")}</span><b>新曲作成</b>`, "new:start", "", "作詞か作曲から始める")}
      ${state.pendingDrafts.map(d=>choiceButton(`<span>${v043eIcon("log")}</span><b>${escapeHtml(d.titleHint)}</b>`, `draft:select:${d.id}`, "", draftProgressSmall(d))).join("")}
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
  if (ed.step === "newArrange") return `<div class="editor-summary mini"><b>ジャンル狙い</b><span>${ed.mainGenreA || "-"} →︎ ${ed.mainGenreB || "-"}</span><span>${ed.mainGenreA && ed.mainGenreB ? genrePlanLabel(ed.mainGenreA, ed.mainGenreB, ed.arrange || "") : ""}</span></div><div class="choice-grid compact-choice-grid arrange-choice">${ARRANGES.map(x=>choiceButton(`<b>${x}</b>`, `new:arrange:${x}`)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "newMusicConfirm") return `<div class="editor-summary"><b>作曲確認</b><span>作曲者：${escapeHtml(activeMembers().find(m=>m.id===ed.memberId)?.name || "-")}</span><span>ジャンル：${ed.mainGenreA || "-"} →︎ ${ed.mainGenreB || "-"}</span><span>アレンジ：${ed.arrange || "-"}</span><span>派生確率：${ed.mainGenreA && ed.mainGenreB ? genrePlanLabel(ed.mainGenreA, ed.mainGenreB, ed.arrange || "") : "-"}</span></div><button class="songEditorNextBtn big-action" data-action="new:musicExecute">作曲を完了する</button>${editorBackButton()}`;
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
  if (ed.step === "draftMusicArrange") return `<div class="editor-summary mini"><b>ジャンル狙い</b><span>${ed.mainGenreA || "-"} →︎ ${ed.mainGenreB || "-"}</span></div><div class="choice-grid compact-choice-grid arrange-choice">${ARRANGES.map(x=>choiceButton(`<b>${x}</b>`, `draft:arrange:${x}`)).join("")}</div>${editorBackButton()}`;
  if (ed.step === "draftMusicConfirm") return `<div class="editor-summary"><b>作曲確認</b><span>ジャンル：${ed.mainGenreA || "-"} →︎ ${ed.mainGenreB || "-"}</span><span>アレンジ：${ed.arrange || "-"}</span><span>派生確率：${ed.mainGenreA && ed.mainGenreB ? genrePlanLabel(ed.mainGenreA, ed.mainGenreB, ed.arrange || "") : "-"}</span></div><button class="songEditorNextBtn big-action" data-action="draft:musicExecute">作曲を完了する</button>${editorBackButton()}`;
  if (ed.step === "draftFinalize") {
    const d = state.pendingDrafts.find(x => x.id === ed.draftId);
    if (!d) return `<div class="empty-panel">完成確認中の曲が見つかりません。</div>${editorBackButton()}`;
    const themeOptions = availableThemes().map(t => `<option value="${escapeHtml(t)}" ${t === (ed.theme || d.theme) ? "selected" : ""}>${escapeHtml(t)}</option>`).join("");
    return `<div class="editor-form song-title-final"><div class="editor-summary tutorial-box"><b>曲完成前確認</b><span>作詞と作曲が揃った。ここで曲名とテーマを決めて完成させます。</span></div><label>曲名</label><div class="title-input-row"><input id="draftFinalTitle" value="${escapeHtml(ed.title || d.titleHint || "")}" placeholder="曲名" /><button class="songEditorChoiceBtn dice-title-btn" data-action="draft:titleRandom" title="ランダム生成">●︎</button></div><label>テーマ</label><select id="draftFinalTheme">${themeOptions}</select><div class="editor-summary mini"><b>制作内容</b><span>作詞${val(d.lyricsScore)}% / 作曲${val(d.musicScore)}% / ${escapeHtml(genreDisplay(d))} / ${escapeHtml(d.arrange || "")}</span><span>歌詞：${escapeHtml(d.keyword || "-")}</span></div><button class="songEditorNextBtn big-action" data-action="draft:finalize">この内容で完成させる</button>${editorBackButton()}</div>`;
  }
  if (ed.step === "arrangeMenu") return `<div class="choice-grid main-choice-grid">${choiceButton(`<span>${v043eIcon("chart")}</span><b>曲強化</b>`, "boost:start", "", "完成曲を選んで強化する")}${choiceButton("<span>✏︎</span><b>曲編集</b>", "edit:start", "", "曲名・テーマ・ジャンル・アレンジ・歌詞を変更")}</div>${editorBackButton()}`;
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
  return `<div class="editor-summary"><b>制作内容</b><span>カテゴリ：${ed.type === "lyrics" ? "作詞" : "作曲"}</span><span>ジャンル狙い：${ed.mainGenreA || "-"} →︎ ${ed.mainGenreB || "-"}</span><span>確率：${ed.mainGenreA && ed.mainGenreB ? genrePlanLabel(ed.mainGenreA, ed.mainGenreB, ed.arrange || "") : "-"}</span><span>歌詞：${ed.keyword || "-"}</span><span>アレンジ：${ed.arrange || "-"}</span></div>`;
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
  if (hasPendingSongFinalize() && !["draft:finalize", "draft:titleRandom"].includes(action)) {
    focusPendingSongFinalize(false);
    return;
  }
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
作っていない作詞/作曲を選んで、曲が完成する流れを確認しよう。`, "event", v043eIcon("book")); return; }
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
    if (!words) { showEventPopup("歌詞が未入力", "3つの歌詞ワードを1つ以上入力してから完了しよう。", "warn", "✍︎"); return; }
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
    if (!words) { showEventPopup("歌詞が未入力", "3つの歌詞ワードを1つ以上入力してから完了しよう。", "warn", "✍︎"); return; }
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
    <div class="card"><div class="section-title"><h2>スキル図鑑</h2><span class="badge">主人公 ${(state.playerSkills||[]).length}/${SKILL_DATA.length}</span></div>${renderPlayerSkillPanel()}${bandSystemOn() ? renderBandSkillList() : ""}</div>
    <div class="card"><div class="section-title"><h2>曲名履歴</h2><span class="badge">${(state.songTitleHistory||[]).length}曲</span></div>${(state.songTitleHistory||[]).slice(-30).reverse().map(x=>`<div class="dict-row"><b>${escapeHtml(x.title)}</b><small>${escapeHtml(x.genre || "")} / ${x.turn || "?"}T</small></div>`).join("") || `<p><small>完成した曲名がここに残ります。</small></p>`}</div>
    <div class="card"><div class="section-title"><h2>ほかのバンド図鑑</h2><span class="badge">${bandSystemOn() ? `${bandDiscoveredCount()}/${Object.keys(BAND_DATABASE).length}組` : "対バン候補"}</span></div>${bandSystemOn() ? renderBandBookSummaryForLibrary() : renderRivalBandDirectory()}</div>
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
  const cur = Number(state.turn || 1);
  const max = Number(state.maxTurn || 50);
  const turns = new Set();
  for (let i = Math.max(1, cur - 1); i <= Math.min(max, cur + 4); i++) turns.add(i);
  (state.liveEvents || []).filter(e => !e.cancelled && e.turn >= cur && e.turn <= cur + 8).forEach(e => turns.add(e.turn));
  if (cur <= 30) turns.add(30);
  if (cur <= 50) turns.add(50);
  const cells = [...turns].filter(t => t >= 1 && t <= max).sort((a,b)=>a-b).slice(0, 10);
  const parts = cells.map(i => {
    const ev = liveEventForTurn(i);
    const isNow = i === cur;
    const isPast = i < cur;
    const isFes = i === 30 || i === 50;
    const cls = isNow ? "now" : isPast ? "done" : ev ? (ev.fixed ? "live fixed" : "live booked") : isFes ? "fes" : "";
    const label = isNow ? "今" : ev ? (i === max ? "GRAND" : ev.fixed ? "固定" : "LIVE") : i === 30 ? "UNDER" : i === 50 ? "GRAND" : "準備";
    const venue = ev ? venueById(ev.venueId).name : label;
    return `<button class="jumpTabBtn turn-cell rail-cell ${cls}" data-view="schedule" data-turn="${i}" title="${escapeHtml(venue)}"><b>T${i}</b><span>${escapeHtml(label)}</span></button>`;
  });
  const next = state.nextLiveTurn ? `${currentLiveName()} あと${turnsUntilNextLive()}T` : "予定なし";
  return `<div class="timeline-wrap schedule-board v041-turn-rail"><div class="schedule-title compact-title"><b>週の流れ</b><span>${escapeHtml(next)}</span></div><div class="timeline long schedule-scroll one-line v041-rail-scroll">${parts.join("")}</div></div>`;
}

function renderTelop() {
  const latest = state.logs[0] || "地下から始まる。";
  return `<div class="telop"><span>${escapeHtml(latest).replace(/\n/g, "　/　")}</span></div>`;
}

function fatigueFace(v) {
  const n = Number(v) || 0;
  if (n >= 90) return "✕︎";
  if (n >= 70) return "▼︎";
  if (n >= 45) return "●︎";
  return "★︎";
}
function nextMilestoneLabel() {
  const t = state.turn || 1;
  if (isLiveTurn()) return "本番";
  if (t < 30) return `UNDERまで${Math.max(0,30-t)}T`;
  if (t < 50) return `GRANDまで${Math.max(0,50-t)}T`;
  return "延長戦";
}
function renderTopStats() {
  const b = state.band;
  const unread = unreadMailCount();
  const next = state.nextLiveTurn ? `${currentLiveName()}まで${turnsUntilNextLive()}T` : nextMilestoneLabel();
  const main = [
    { k:"ターン", label:`T${state.turn || 1}/${state.maxTurn || 50}` },
    { k:"資金", label:`¥${shortMoney(b.funds)}`, alert:b.funds < 0 },
    { k:"ファン", label:`${Math.round(b.fans)}人` },
    { k:"疲労", label:`${Math.round(b.fatigue)}%`, alert:b.fatigue > 80 }
  ];
  const sub = [
    `次：${next}`,
    `知名度 ${Math.round(b.fame)}`,
    `業界 ${Math.round(b.industry)}`,
    unread ? `未読 ${unread}` : "未読なし"
  ];
  return `<div class="success-dashboard compact-dashboard l0-dashboard v041-status-board"><div class="compact-stat-strip slim-stats l0-stat-strip v041-status-main">${main.map(x=>`<div class="stat success-stat compact-stat ${x.alert ? "danger-stat" : ""}"><span>${x.k}</span><b>${x.label}</b></div>`).join("")}</div><div class="v041-status-sub">${sub.map(x=>`<span>${escapeHtml(x)}</span>`).join("")}</div></div>`;
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
        <p>${state.turn < state.nextLiveTurn ? `あと${turnsUntilNextLive()}ターンでライブ。本番までに仲間・曲・資金・疲労を整える。` : "GRAND UNDER FESに向けて、A評価＋総合80＋条件達成を狙う。"}</p>
        <div class="kv">
          <b>最低クリア条件</b><span>UNDER：直近B評価以上 / ファン60 / 知名度60 / 業界評価55 / オリジナル曲5曲</span>
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
    ["practice", "練習", "技術・楽器Lv・演奏UP", "費用・疲労+", "♪︎"],
    ["rest", "休憩", "疲労DOWN・信頼UP", "成長なし", "☕︎"],
    ["parttime", "バイト", "資金+15,000円", "疲労+", "○︎"],
    ["recruit", "募集", "仲間候補を探す", "費用・成果ランダム", "▲︎"],
    ["promo", "宣伝", "知名度・認知度UP", "資金-", "▪︎"],
    ["talk", "会話", "信頼UP・適性開花候補", "直接成長少", "◆︎"]
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
      <button id="executeCraftBtn" class="songcraft-action" data-se="b2">曲作りを実行</button>
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
function joinConditionLabel(cond) {
  if (!cond) return "通常募集";
  const parts = [];
  if (cond.minTurn && cond.minTurn > 1) parts.push(`${cond.minTurn}T以降`);
  if (cond.minFans) parts.push(`ファン${cond.minFans}+`);
  if (cond.minFame) parts.push(`知名度${cond.minFame}+`);
  if (cond.minIndustry) parts.push(`業界評価${cond.minIndustry}+`);
  return parts.length ? parts.join(" / ") : "初期募集";
}

function renderApplicantCard(a) {
  return `
    <div class="member applicant-card">
      <h4>加入候補：${escapeHtml(a.name)}</h4>${a.canRename ? `<small>加入時に名前変更可 / 成長:${escapeHtml(a.growthType || "未設定")}</small>` : ""}
      <div class="member-head">${renderAvatarPortrait(a.portraitId || a.id, a.name, a.part)}<div class="kv">
        <b>担当</b><span>${escapeHtml(a.part)}</span>
        <b>一番得意ジャンル</b><span>${escapeHtml(a.mainGenre)}</span>
        <b>二番目得意</b><span>${(a.secondMainGenres||[]).map(escapeHtml).join(" / ") || "なし"}</span>
        <b>加入難度</b><span>${escapeHtml(a.joinDifficulty || "中")}</span>
        <b>加入条件</b><span>${escapeHtml(joinConditionLabel(a.joinCondition))}</span>
        <b>メモ</b><span>${escapeHtml(a.replaceNote || a.roleHint || "加入候補")}</span>
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
  const growthLine = `<p><span class="badge">成長タイプ:${escapeHtml(memberGrowthTypeKey(m))}</span><small>${escapeHtml(memberGrowthTypeInfo(m).note || "小補正あり")}</small></p>`;
  const genreLine = `
    <p><span class="badge warn">一番得意:${m.mainGenre}</span> ${(m.secondMainGenres||[]).map(g=>`<span class="badge good">二番目:${g}</span>`).join(" ")}</p>
    <p>${discovered.map(g=>`<span class="badge">判明サブ:${g}</span>`).join(" ")} ${hiddenCount ? `<span class="badge bad">未判明サブ ${hiddenCount}</span>` : `<span class="badge good">サブ全判明</span>`}</p>${growthLine}`;
  return `<div class="member"><div class="member-head">${renderAvatarPortrait(m.portraitId || m.id, m.name, m.part)}<div><h4>${m.name} <span class="badge good">${m.part}</span></h4><p>${stats}</p>${genreLine}</div></div>${insts}<small>${m.replaceNote || ""}</small></div>`;
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
  const usage = songUsageInfo(s);
  return `<div class="song"><h4>${s.title} ${s.isCover ? `<span class="badge bad">コピー</span>` : `<span class="badge good">オリジナル</span>`} ${!s.isCover ? `<span class="badge good">強化Lv${s.boostLevel || 0}</span>` : ""}</h4>
    <p><span class="badge warn">${genreDisplay(s)}</span> ${(s.tags||[]).map(t=>`<span class="badge">${t}</span>`).join(" ")}</p>
    ${renderSongUsageMeta(s)}
    <small>ライブ使用${usage.total || 0}回 / マンネリ${s.mannerism || 0} / 最終使用${usage.lastTurn ? `${usage.lastTurn}T` : "なし"}</small>
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
      <div class="slot-move-row"><button class="moveSetlistBtn ghost-btn" data-slot="${slot}" data-dir="up" ${slot === 1 ? "disabled" : ""}>↑︎</button><button class="moveSetlistBtn ghost-btn" data-slot="${slot}" data-dir="down" ${slot === 5 ? "disabled" : ""}>↓︎</button></div>
      <button class="openSongPickerBtn ghost-btn" data-slot="${slot}">曲を選ぶ</button>
      <button class="openSongDetailBtn ghost-btn" data-song-id="${escapeHtml(safeId)}">詳細</button>
    </div>
  </div>`;
}
function livePrepSelectedSupportSet() {
  const valid = new Set(DATA.supportOptions.map(s => s.id));
  state.livePrepSupportIds = (state.livePrepSupportIds || []).filter(id => valid.has(id));
  return new Set(state.livePrepSupportIds || []);
}
function livePrepInstrumentCountsFromState() {
  const counts = { vocal:0, guitar:0, bass:0, drum:0, key:0, dj:0, chorus:0, other:0, piano:0, brass:0, percussion:0 };
  activeMembers().forEach(m => {
    const role = state.livePrepPositions?.[m.id] || (state.liveCount === 0 && m.id === "player" ? "vocal" : m.mainInstrument || "off");
    positionInstrumentParts(role).forEach(inst => { counts[inst] = (counts[inst] || 0) + 1; });
  });
  normalizeLivePrepChorusIds().filter(id => id && id !== "none").forEach(() => { counts.chorus = (counts.chorus || 0) + 1; });
  (state.livePrepSupportIds || []).map(id => DATA.supportOptions.find(s => s.id === id)).filter(Boolean).forEach(s => { counts[s.instrument] = (counts[s.instrument] || 0) + 1; });
  return counts;
}
function livePrepCheckItems(v, setlistIds=ensureLivePrepSetlist()) {
  const counts = livePrepInstrumentCountsFromState();
  const songs = setlistIds.map(songById).filter(Boolean);
  const coverCount = songs.filter(s => s.isCover).length;
  const ev = currentLiveEvent();
  const supportCost = sum((state.livePrepSupportIds || []).map(id => DATA.supportOptions.find(s => s.id === id)?.cost || 0));
  const merchCost = sum(MERCH_ITEMS.map(item => item.cost * ((state.livePrepMerchOrders || {})[item.id] || 0)));
  const liveCost = eventBaseCost(ev, v) + supportCost + merchCost;
  const missing = [];
  if ((counts.vocal || 0) < 1) missing.push("Vo");
  if ((counts.guitar || 0) < 1) missing.push("Gt");
  if ((counts.bass || 0) < 1) missing.push("Ba");
  if ((counts.drum || 0) < 1) missing.push("Dr");
  const items = [];
  items.push({ ok:missing.length === 0, warn:missing.length > 0, step:2, label:missing.length ? `不足:${missing.join("/")}` : "基本パートOK" });
  items.push({ ok:songs.length >= 5, warn:songs.length < 5, step:1, label:songs.length >= 5 ? "セトリ5曲OK" : `セトリ${songs.length}/5曲` });
  items.push({ ok:coverCount <= 2, warn:coverCount >= 3, step:1, label:coverCount >= 3 ? `コピー曲多め:${coverCount}曲` : `コピー曲${coverCount}曲` });
  items.push({ ok:state.band.fatigue < 65, warn:state.band.fatigue >= 65, step:4, label:state.band.fatigue >= 65 ? `疲労高め:${val(state.band.fatigue)}` : `疲労${val(state.band.fatigue)}` });
  items.push({ ok:state.band.funds >= liveCost, warn:state.band.funds < liveCost, step:3, label:state.band.funds >= liveCost ? `資金OK:${liveCost.toLocaleString()}円` : `資金注意:${liveCost.toLocaleString()}円` });
  items.push({ ok:true, warn:false, step:3, label:`サポート${(state.livePrepSupportIds || []).length}人` });
  return items;
}
function renderLivePrepCheckPanel(v, { showStepLinks=false }={}) {
  const items = livePrepCheckItems(v);
  const rows = items.map(it => `<span class="badge ${it.warn ? "warn" : "good"}">${v043eIcon(it.warn ? "warning" : "check")} ${escapeHtml(it.label)}${showStepLinks && it.warn ? ` <button type="button" class="prepStepJumpBtn inline-step-link" data-step="${it.step}">直す</button>` : ""}</span>`).join("");
  return `<div class="prep-check-panel"><b>ライブ準備チェック</b><div class="prep-check-grid">${rows}</div><small>警告があっても本番には出られる。楽屋の確認メモ。</small></div>`;
}
function livePrepStepMeta() {
  return [
    { step:1, icon:"♪︎", title:"セトリ", desc:"5曲と曲順" },
    { step:2, icon:"♪︎", title:"担当", desc:"Vo/Gt/Ba/Dr/Cho" },
    { step:3, icon:"▪︎", title:"サポート/物販", desc:"契約と仕入れ" },
    { step:4, icon:"✓︎", title:"最終チェック", desc:"本番前確認" }
  ];
}
function currentLivePrepStep() {
  const n = clamp(Math.floor(Number(state.livePrepStep || 1)), 1, 4);
  state.livePrepStep = n;
  return n;
}
function renderLivePrepStepNav(step) {
  return `<div class="live-prep-step-nav" role="tablist" aria-label="ライブ準備ステップ">${livePrepStepMeta().map(m => `<button type="button" class="prepStepBtn ${step === m.step ? "active" : ""}" data-step="${m.step}" aria-selected="${step === m.step ? "true" : "false"}"><span>${v043eIcon(m.icon)}</span><b>${m.step}. ${escapeHtml(m.title)}</b><small>${escapeHtml(m.desc)}</small></button>`).join("")}</div>`;
}
function renderLivePrepStepControls(step) {
  const prev = step > 1 ? `<button type="button" class="prepStepPrevBtn ghost-btn" data-step="${step - 1}">←︎ 前へ</button>` : `<span></span>`;
  const next = step < 4 ? `<button type="button" class="prepStepNextBtn big-action" data-step="${step + 1}">次へ →︎</button>` : "";
  return `<div class="live-prep-step-controls">${prev}${next}</div>`;
}
function renderLivePrepStepPanel(step, panelStep, inner) {
  return `<section class="live-prep-step-panel ${step === panelStep ? "active" : ""}" data-step-panel="${panelStep}">${inner}</section>`;
}
function supportInstrumentPriorityScore(s) {
  const counts = livePrepInstrumentCountsFromState();
  const core = ["vocal", "guitar", "bass", "drum"];
  let score = 0;
  if (core.includes(s.instrument) && (counts[s.instrument] || 0) < 1) score += 100;
  if (["piano", "brass", "percussion", "key", "dj", "chorus"].includes(s.instrument)) score += 10;
  return score;
}
function renderSupportOptionCard(s, selectedSupports) {
  const checked = selectedSupports.has(s.id) ? "checked" : "";
  const affinity = state.supportAffinity?.[s.id] || 0;
  return `<label class="check-card named-support-card"><input type="checkbox" class="supportCheck" value="${escapeHtml(s.id)}" ${checked} /> <b>${escapeHtml(s.name)}</b><span class="badge">${escapeHtml(instFullLabel(s.instrument))}</span><br><small>${Number(s.cost || 0).toLocaleString()}円 / 効果${Number(s.score || 0)} / 相性${affinity}</small><small>${escapeHtml((s.genres || []).join("・"))}</small><small>${escapeHtml(s.note || "")}</small></label>`;
}
function renderLivePrep() {
  ensureLivePrepSetlist();
  const step = currentLivePrepStep();
  const selectedSupports = livePrepSelectedSupportSet();
  const supportList = DATA.supportOptions.slice().sort((a,b) => supportInstrumentPriorityScore(b) - supportInstrumentPriorityScore(a) || (a.cost || 0) - (b.cost || 0));
  const supports = supportList.map(s => renderSupportOptionCard(s, selectedSupports)).join("");
  const ev = currentLiveEvent();
  const v = venueById(ev.venueId);
  const liveMeta = liveTypeMeta(ev);
  const prep = estimatePrepScore();
  const riskProfile = liveRiskProfile(v);
  const prepState = riskProfile.label;
  const audience = audienceProfileForVenue(v);
  const mixHint = "セトリボーナスは新曲2＋既存曲3、または新曲1＋既存曲4が狙い目。コピー曲は対象外。";
  const selectedSongs = ensureLivePrepSetlist().map(id=>songById(id)).filter(Boolean);
  return `
    <div class="card live-panel live-prep-steps-card">
      <div class="section-title"><h2>${currentLiveName()}：ライブ準備</h2><span class="badge warn">${escapeHtml(liveMeta.short)} / ${v.name} / ${prepState}</span></div>
      <div class="venue-info live-prep-venue-summary"><b>${escapeHtml(liveMeta.label)} / ${v.name}</b><span>キャパ${v.capacity} / ${escapeHtml(liveMeta.feeLabel)}${eventBaseCost(ev, v).toLocaleString()}円 / 要準備${v.prepNeed} / 現在準備${val(prep)}</span><div class="quiet-guide-chips">${renderRiskBadges(riskProfile)}</div><small>${escapeHtml(liveMeta.desc)}</small><small>${escapeHtml(v.note)}</small><small>${escapeHtml(venueRequirementText(v))}</small></div>
      ${renderLivePrepStepNav(step)}
      <div class="live-prep-step-stack">
        ${renderLivePrepStepPanel(step, 1, `
          <div class="prep-step-heading"><h3>① セトリ</h3><small>5曲と順番を決める。コピー多めは最終確認で注意が出る。</small></div>
          <div class="venue-info audience-info"><b>客層：${escapeHtml(audience.label)}</b><span>${escapeHtml(audience.detail)}</span><small>${mixHint}</small></div>
          <div class="setlist-hint-panel"><b>セトリ自動ヒント</b>${livePrepAutoHints(selectedSongs, v, audience).map(h=>`<span>${escapeHtml(h)}</span>`).join("")}</div>
          <p class="setlist-help"><small>各枠の「曲を選ぶ」から選ぶ。詳細だけ見て戻ってもいい。</small></p>
          <div class="prep-step-actions"><button id="autoSetlistBtn" class="big-action wide-cancel">セトリ自動セット</button><button id="resetSetlistBtn" class="ghost-btn wide-cancel">セトリをリセット</button></div>
          ${renderLivePrepSetlist()}
          ${renderLivePrepStepControls(step)}
        `)}
        ${renderLivePrepStepPanel(step, 2, `
          <div class="prep-step-heading"><h3>② 担当</h3><small>Vo/Gt/Ba/Drとコーラスを決める。Voはコーラス兼任不可。初ライブは主人公Vo固定。</small></div>
          ${renderPositionControls()}
          ${renderLivePrepStepControls(step)}
        `)}
        ${renderLivePrepStepPanel(step, 3, `
          <div class="prep-step-heading"><h3>③ サポート/物販</h3><small>足りないパートはサポートで埋める。物販は仕入れすぎ注意。</small></div>
          <div class="prep-subsection"><h3>名前付きサポート契約</h3><p><small>誰に頼むかを選ぶ。鍵盤・管・パーカッションも呼べる。</small></p><div class="checkbox-grid support-grid">${supports}</div></div>
          <div class="prep-subsection"><h3>物販</h3>${renderMerchPrepControls(v, audience)}</div>
          ${renderLivePrepStepControls(step)}
        `)}
        ${renderLivePrepStepPanel(step, 4, `
          <div class="prep-step-heading"><h3>④ 最終チェック</h3><small>気になる所は「直す」で戻れる。よければ本番へ。</small></div>
          ${renderLivePrepCheckPanel(v, { showStepLinks:true })}
          <div class="live-prep-final-actions"><button id="performLiveBtn" class="big-action" data-se="b2">ライブ本番へ</button>${!currentLiveEvent().fixed ? `<button id="noShowLiveBtn" class="ghost-btn danger wide-cancel">ライブをドタキャンする</button>` : ""}</div>
          ${currentApplicantList().length ? renderApplicantList() : ""}
          ${renderLivePrepStepControls(step)}
        `)}
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
      return `<div class="merch-item-card"><div><b>${escapeHtml(item.name)}</b><small>仕入${item.cost.toLocaleString()}円 →︎ 売値${item.price.toLocaleString()}円</small><small>客層：${item.best.join(" / ")}</small><small>${escapeHtml(item.desc)}</small><div class="quiet-guide-chips merch-signal"><span class="badge ${fit >= 1.08 ? "good" : fit < .9 ? "bad" : ""}">${fitLabel}</span><span class="badge merchRiskBadge ${risk.cls === "bad" ? "bad" : risk.cls === "warn" ? "warn" : risk.cls === "good" ? "good" : ""}" data-merch-id="${item.id}">${escapeHtml(risk.label)}</span></div><small class="safe-guide-line">安全目安 ${safeRange.low}〜${safeRange.high}個</small></div><div class="merch-qty-control merch-dial-control"><div class="merch-dial-readout"><span>仕入れ数</span><output class="merchQtyValue" data-merch-id="${item.id}">${String(qty).padStart(3, "0")}</output><span>個</span></div><div class="merch-dial-lock">${renderMerchDigitSelect(item.id, "hundreds", digits.hundreds, "百")}${renderMerchDigitSelect(item.id, "tens", digits.tens, "十")}${renderMerchDigitSelect(item.id, "ones", digits.ones, "一")}</div><div class="merch-dial-step"><button class="merchQtyStepBtn" data-merch-id="${item.id}" data-delta="-1" type="button" aria-label="${escapeHtml(item.name)}を1個減らす">−1</button><button class="merchQtyStepBtn" data-merch-id="${item.id}" data-delta="1" type="button" aria-label="${escapeHtml(item.name)}を1個増やす">＋1</button></div><input class="merchQtyInput" data-merch-id="${item.id}" type="hidden" value="${qty}" /></div></div>`;
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
      ["練習後の一言", `${member.name}が最後にもう一回だけ合わせようと言った。\n信頼度が少し上がり、疲労も少しだけ増えた。`, () => { state.band.trust = clamp(state.band.trust + 1,0,100); state.band.fatigue = clamp(state.band.fatigue + 2,0,100); }, "♪︎"],
      ["小さな成長", `${member.name}が自分の音を掴みかけている。\nメンタル+1。`, () => { member.stats.mental = clamp(member.stats.mental + 1,1,99); }, "▲︎"]
    ],
    rest: [
      ["帰り道", `今日は早めに切り上げた。\nコンビニ前で少しだけ話して、バンドの空気が軽くなった。`, () => { state.band.trust = clamp(state.band.trust + 2,0,100); }, "☆︎"]
    ],
    work: [
      ["バイト先のBGM", `バイト中、店内で流れていた曲が妙に耳に残った。\n次の作曲に使えそうな気がする。`, () => { state.band.direction["ポップ"] = (state.band.direction["ポップ"] || 0) + 2; }, "♪︎"]
    ],
    recruit: [
      ["貼り紙を見た人", `スタジオの掲示板を見た人から連絡が来た。\n次の募集結果が少し良くなりそう。`, () => { state.band.fame = clamp(state.band.fame + 1,0,999); }, "✉︎"]
    ],
    promote: [
      ["SNSが少し伸びた", `投稿がいつもより少しだけ回った。\nまだ小さいが、知らない誰かに届いている。`, () => { state.band.fame = clamp(state.band.fame + 2,0,999); }, "▪︎"]
    ],
    talk: [
      ["本音の会話", `${member.name}が最近の不安を少し話してくれた。\n信頼度+3。`, () => { state.band.trust = clamp(state.band.trust + 3,0,100); }, "☕︎"]
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
  if (state.pendingAfterpartyEvent) return renderAfterpartyEventOverlay();
  if (state.activeStoryEvent) return renderStoryEventOverlay();
  if (state.actionResultModal) return renderActionResultOverlay();
  if (state.detailModal) return renderDetailModalOverlay();
  if (state.livePrepPickerSlot) return renderLiveSongPickerOverlay();
  if (state.pendingMailAction) return renderMailActionConfirmOverlay();
  if (state.pendingBooking) return renderBookingConfirmOverlay();
  if (state.pendingBoostSong) return renderBoostSongConfirmOverlay();
  if (state.pendingCancelLive) return renderCancelLiveConfirmOverlay();
  if (state.pendingPurchase) return renderPurchaseConfirmOverlay();
  if (state.saveSlotModal) return renderSaveSlotOverlay();
  if (state.pendingNoSongcraftCommand) return renderNoSongcraftConfirmOverlay();
  if (state.activePopup) return renderActivePopupOverlay();
  if (state.pendingTurnAdvance && !hasFlowModalOpen()) return renderFlowRecoveryOverlay();
  return state.turnNotice ? renderTurnNoticeOverlay() : "";
}

function renderActivePopupOverlay() {
  const p = state.activePopup;
  const scrollSafe = p && (p.layout === "scroll-safe" || p.scrollSafe);
  const modalClass = p?.modalClass ? String(p.modalClass).replace(/[^\w -]/g, "").trim() : "";
  return `<div class="modal-backdrop ${scrollSafe ? "active-popup-scroll-safe-backdrop" : ""}">
    <div class="event-modal ${p.type || "info"} ${scrollSafe ? "active-popup-scroll-safe-modal" : ""} ${escapeHtml(modalClass)}">
      <div class="modal-icon">${p.icon || "♪︎"}</div>
      <div class="modal-copy"><h2>${escapeHtml(p.title)}</h2><p>${escapeHtml(p.body).replace(/\n/g,"<br>")}</p>${renderPopupBars(p.bars)}</div>
      <button class="popupCloseBtn big-action">OK</button>
    </div>
  </div>`;
}

function renderNoSongcraftConfirmOverlay() {
  return v043aRenderConfirmationSheet({ icon:v043eIcon("song"), tone:"warn", title:"作詞作曲せずに進める？", bodyHtml:"<p>このターンは曲を作らずに終わります。よければ行動を実行します。</p>", actionsClass:"confirm-wide", confirmId:"confirmNoSongcraftBtn", confirmLabel:"このまま行動する", cancelId:"cancelNoSongcraftBtn", cancelLabel:"曲作りへ戻る" });
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
  const base = ev && v ? eventBaseCost(ev, v) : 0;
  const penalty = noShow ? base + Math.round(base * 0.5) : 0;
  const feeLabel = ev ? liveTypeMeta(ev).feeLabel : "費用";
  return v043aRenderConfirmationSheet({ icon:noShow ? "⚠︎" : "■︎", tone:"warn", title:noShow ? "ライブをドタキャンする？" : "ライブをキャンセルする？", bodyHtml:`<p>${ev && v ? `${ev.turn}ターン目「${escapeHtml(v.name)}」を${noShow ? "ドタキャン" : "キャンセル"}します。` : "対象のライブをキャンセルします。"}<br>${noShow ? `${escapeHtml(feeLabel)}＋損料 ${penalty.toLocaleString()}円が発生し、信頼度と知名度が大きく下がります。` : "メリットはなく、信頼度と知名度が少し下がります。"}</p>`, actionsClass:"confirm-wide", confirmId:"confirmCancelLiveBtn", confirmLabel:noShow ? "ドタキャンする" : "キャンセルする", confirmClass:"big-action danger", cancelId:"cancelCancelLiveBtn", cancelLabel:"戻る" });
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
  const desc = isGear ? `現在Lv${equipmentLevel(gearId)} →︎ Lv${Math.min(5, equipmentLevel(gearId)+1)}。${gear?.desc || ""}` : "誤タップ防止のため、購入前に確認しています。";
  return v043aRenderConfirmationSheet({ icon:v043eIcon("money"), tone:"event", title, bodyHtml:`<p>価格：${price.toLocaleString()}円</p><p>${escapeHtml(desc)}</p>`, confirmId:"confirmPurchaseBtn", confirmLabel:isGear ? "強化する" : "購入する", cancelId:"cancelPurchaseBtn", cancelLabel:"戻る" });
}
function renderSaveSlotOverlay() {
  const mode = state.saveSlotModal;
  const isSave = mode === "save";
  return `<div class="modal-backdrop">
    <div class="event-modal event slot-modal">
      <div class="modal-icon">${isSave ? "▪︎" : "▪︎"}</div>
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
  return v043aRenderConfirmationSheet({ icon:v043eIcon("calendar"), tone:"event", extraClass:"booking-modal", title:`${b.turn}ターン目の${meta.short}を入れる？`, bodyHtml:`<p>${escapeHtml(v.name)} / キャパ${v.capacity} / ${escapeHtml(meta.feeLabel)}${eventBaseCost(ev, v).toLocaleString()}円</p><p>準備要求：${v.prepNeed} / 現在準備：${val(prep)}${shortage ? ` / 不足${val(shortage)}` : " / 準備OK"}</p><div class="quiet-guide-chips">${renderRiskBadges(riskProfile)}</div>${bands.length ? `<p>呼ぶ/共演候補：${bands.map(x=>escapeHtml(x.name)).join(" / ")}</p>` : ""}<p>${escapeHtml(meta.desc)}</p><p>予約後、残り2ターン以内は通常キャンセル不可。当日ドタキャンは各ライブ種別の表示費用＋損料が必要。</p>`, confirmId:"confirmBookingBtn", confirmLabel:"決定する", cancelId:"cancelBookingBtn", cancelLabel:"戻る" });
}
function renderBoostSongConfirmOverlay() {
  const songId = state.pendingBoostSong;
  const song = state.songs.find(s => s.id === songId);
  if (!song) { state.pendingBoostSong = null; return ""; }
  const cost = plannedSongcraftFatigueCost("music", 10);
  const over = (state.band.fatigue || 0) + cost > 100;
  return v043aRenderConfirmationSheet({ icon:v043eIcon("chart"), tone:"event", title:"この曲を強化する？", bodyHtml:`<p>「${escapeHtml(song.title)}」 / ${escapeHtml(genreDisplay(song))}<br>現在：強化Lv${song.boostLevel || 0}<br>疲労+${cost}%</p><p>疲労を消費して、曲の強化Lvと演奏力を少し上げます。</p>${over ? `<p class="bad-text">疲労が100％を超えるため、今は強化できません。</p>` : ""}`, confirmId:"confirmBoostSongBtn", confirmLabel:"強化する", confirmAttrs:over ? "disabled" : "", cancelId:"cancelBoostSongBtn", cancelLabel:"戻る" });
}

function renderAfterpartyOverlay() {
  const p = state.pendingAfterparty || {};
  const fatigue = Number(state.band?.fatigue || 0);
  const canJoin = fatigue <= 80;
  const bands = (p.invitedBandIds || []).map(rivalById).filter(Boolean);
  return `<div class="modal-backdrop"><div class="event-modal event afterparty-modal">
    <div class="modal-icon">○︎</div>
    <div class="modal-copy"><h2>ライブ後の打ち上げに行く？</h2>
      <p>${escapeHtml(p.title || "ライブ")}が終わった。参加すると、短い打ち上げイベントが発生する。共演バンドとの交流・紹介・メンバー成長のチャンスがあるが、疲労も増える。</p>
      <p>現在疲労：${Math.round(fatigue)}% / 参加条件：疲労80%以下${canJoin ? "" : "（疲れすぎて参加不可）"}</p>
      ${bands.length ? `<p>共演：${bands.map(b=>escapeHtml(b.name)).join(" / ")}</p>` : `<p>今回は他バンド込みではないため、交流・紹介イベントは控えめ。</p>`}
      <small>二日酔い発生率は1〜20%。疲労が高いほど上がり、ライブ評価が高いほど下がる。</small>
    </div>
    <div class="modal-actions confirm-wide"><button id="joinAfterpartyBtn" class="big-action" ${canJoin ? "" : "disabled"}>参加する</button><button id="skipAfterpartyBtn" class="ghost-btn">帰る</button></div>
  </div></div>`;
}
function renderAfterpartyEventOverlay() {
  const ev = state.pendingAfterpartyEvent || {};
  const scene = ev.scene || {};
  const choices = Array.isArray(scene.choices) ? scene.choices : [];
  const bandLine = (ev.invitedBandIds || []).map(rivalById).filter(Boolean).map(b => escapeHtml(b.name)).join(" / ");
  return `<div class="modal-backdrop"><div class="event-modal event afterparty-modal afterparty-choice-modal">
    <div class="modal-icon">${escapeHtml(scene.icon || "○︎")}</div>
    <div class="modal-copy"><h2>${escapeHtml(scene.title || "打ち上げイベント")}</h2>
      <p>${escapeHtml(scene.body || "ライブ後の空気が、まだ残っている。").replace(/\n/g,"<br>")}</p>
      ${bandLine ? `<p><small>共演：${bandLine}</small></p>` : `<p><small>今回は自分たち中心の打ち上げ。</small></p>`}
      <small>選択肢によって、交流・成長・疲労の増え方が少し変わります。</small>
    </div>
    <div class="modal-actions afterparty-choice-actions">
      ${choices.map(ch => `<button class="afterpartyChoiceBtn ${ch.key === "leave" ? "ghost-btn" : "big-action"}" data-choice-key="${escapeHtml(ch.key)}"><b>${escapeHtml(ch.label)}</b><small>${escapeHtml(ch.desc || "")}</small></button>`).join("")}
    </div>
  </div></div>`;
}

function renderActionResultOverlay() {
  const r = state.actionResultModal;
  return `<div class="modal-backdrop result-backdrop">
    <div class="action-result-modal">
      <div class="result-header"><span>WEEK RESULT</span><b>${escapeHtml(r.title)}</b><em>${r.icon || "⚡︎"}</em></div>
      <p>${escapeHtml(r.body || "今週の行動を終えた。").replace(/\n/g,"<br>")}</p>
      <div class="gain-grid">${(r.diffs || []).map(([k,v,u]) => `<div><span>${k}</span><b class="${v>=0 ? "plus" : "minus"}">${v>=0 ? "+" : ""}${u === "円" ? v.toLocaleString() : v}${u}</b></div>`).join("") || `<div><span>変化</span><b>なし</b></div>`}</div>
      ${r.event ? `<div class="inline-event"><b>${escapeHtml(r.event.icon || "☆︎")} ${escapeHtml(r.event.title)}</b><span>${escapeHtml(r.event.body)}</span></div>` : ""}
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
    if (r.name) {
      const diffText = (r.diffs || []).map(d => `${statLabel(d.key)} ${d.before}→︎${d.after}`).join(" / ");
      const maxAfter = Math.max(...(r.diffs || []).map(d => d.after), 0);
      return `<div class="training-gain-row"><span>${escapeHtml(r.name)} <em>${escapeHtml(r.growthType || DEFAULT_MEMBER_GROWTH_TYPE)}</em></span><small>${escapeHtml(diffText || "変化なし")}</small><div class="meter mini"><div class="fill" style="width:${clamp(maxAfter,0,99)}%"></div></div></div>`;
    }
    return `<span>${escapeHtml(r.line)}</span>`;
  }).join("")}<small>v0.3.64から成長タイプが練習後の小補正に反映されます。v0.3.66では基準表とDEV確認を追加しています。</small></div>`;
}

function renderLiveProgressOverlay() {
  const l = state.liveProgressModal;
  const steps = l.steps || [];
  const idx = clamp(l.index || 0, 0, Math.max(0, steps.length - 1));
  const current = steps[idx] || { line:"ライブ開始！", icon:"▲︎", event:"会場が温まってきた" };
  const pct = steps.length ? Math.round((idx + 1) / steps.length * 100) : 100;
  const prevPct = steps.length ? Math.round(idx / steps.length * 100) : 0;
  const complete = !!l.complete;
  // 盛り上がり表示: heatは終演後にのみ確定する値のため、進行度(pct)でスケールした表示専用派生値（既存のresultBar正規化定数2.2を流用。SKIN_ORDER_v4 PR-G #2）
  const heatPct = clamp((l.heat || 0) / 2.2, 0, 100);
  const heatDisplay = Math.round(heatPct * pct / 100);
  const litAudience = Math.min(5, Math.ceil(heatDisplay / 20));
  return `<div class="modal-backdrop result-backdrop live-only-backdrop">
    <div class="live-progress-modal realtime-live-modal ${complete ? "live-complete" : ""}">
      <div class="live-onstage-bar"><span class="live-onstage-dot" aria-hidden="true"></span><b>ON STAGE</b><em class="live-venue-plate">${escapeHtml(l.venueName || "ライブハウス")}</em></div>
      <div class="result-header"><span>${complete ? "LIVE COMPLETE" : "LIVE STAGE"}</span><b>${escapeHtml(l.title)}</b><em>${idx + 1}/${steps.length || 5}</em></div>
      <div class="live-progress-bar"><div class="live-progress-fill realtime" style="--from:${prevPct}%;--to:${pct}%;width:${pct}%"></div><span>${pct}%</span></div>
      <div class="live-heat-block">
        <div class="live-heat-vu"><div class="live-heat-vu-fill" style="width:${heatPct * pct / 100}%"></div></div>
        <div class="live-heat-number">${heatDisplay}</div>
        <div class="live-heat-audience">${Array.from({ length:5 }, (_, i) => `<span class="live-audience-pict ${i < litAudience ? "lit" : ""}">${v043eIcon("audience")}</span>`).join("")}</div>
      </div>
      <div class="live-current-telop"><b>${escapeHtml(current.line)}</b>${complete ? `<small>ライブ完了。結果を見る準備ができた。</small>` : ""}</div>
      <div class="live-icons"><div><b>${escapeHtml(current.icon)}</b><span>${escapeHtml(current.event)}</span></div></div>
      <div class="live-telop-list compact">${steps.map((x, i) => {
        if (i > idx) return `<p class="setlist-step upcoming">${x.slot}曲目『${escapeHtml(x.songTitle)}』</p>`;
        const stepState = i === idx ? "current" : "played";
        return `<p class="setlist-step ${stepState} ${i === idx ? "active" : ""} ${x.impact ? "impact-" + escapeHtml(x.impact) : ""}">${escapeHtml(x.line)} / ${escapeHtml(x.icon)} ${escapeHtml(x.event)}</p>`;
      }).join("")}</div>
      <button class="liveProgressNextBtn ${complete ? "big-action" : "ghost-btn"} live-skip-btn">${complete ? "結果を見る" : "演出をスキップして結果へ"}</button>
    </div>
  </div>`;
}
function renderLiveResultOverlay() {
  const r = state.liveResultModal || {};
  const gains = r.gains || {};
  const attendees = Number(r.attendees || r.revenue?.attendees || 0);
  const profit = Number(gains.funds || r.profit || r.revenue?.finalProfit || 0);
  const axes = [
    ["演奏", val(r.performance || 0)],
    ["表現", val(r.expression || 0)],
    ["熱量", val(r.heat || 0)],
    ["戦略", val(r.strategy || 0)],
    ["安定", val(r.stability || 0)]
  ];
  const weakest = axes.slice().sort((a,b)=>a[1]-b[1])[0]?.[0] || "準備";
  const lowRankNote = ["C", "D", "E"].includes(r.rank || "") ? `<div class="result-low-note">収穫はある。次は${escapeHtml(weakest)}を上げれば、もっと届く。</div>` : "";
  const closeLabel = state.pendingAfterparty ? "打ち上げの相談へ" : "結果を受け取って進む";
  const opponentBand = (r.invitedBandIds || []).map(id => BAND_DATABASE[id]).find(Boolean);
  const opponentLine = opponentBand ? `<div class="result-opponent">${renderBandWordmark(opponentBand, "sm")}</div>` : "";
  return `<div class="modal-backdrop result-backdrop">
    <div class="live-result-modal rank-${escapeHtml(r.rank || "C")}">
      <div class="result-header"><span>LIVE RESULT</span><b>${escapeHtml(r.title || "ライブ結果")}</b><em>${escapeHtml(r.venue || "ライブハウス")}</em>${opponentLine}</div>
      <div class="result-rank-line"><div class="rank-burst">${escapeHtml(r.rank || "-")}</div><div class="result-score"><b>${val(r.total || 0)}</b><span>総合点</span><small>${escapeHtml(r.liveTypeLabel || "ライブ")}</small></div></div>
      <div class="result-summary-grid result-primary-gains">
        <div><b>動員</b><span>${val(attendees)}人</span><small>自分${val(r.ownAudience || r.revenue?.ownAudience || 0)} / 他${val(r.partnerAudience || r.revenue?.partnerAudience || 0)}</small></div>
        <div><b>利益</b><span>${profit.toLocaleString()}円</span><small>${escapeHtml(r.costLabel || "費用")}${Number(r.costValue || 0).toLocaleString()}円</small></div>
        <div><b>ファン</b><span>+${val(gains.fans || 0)}</span><small>次の集客の土台</small></div>
      </div>
      ${v043dRenderInitialLiveExplanation(r)}
      <div class="result-bars">
        ${axes.map(([label, value]) => resultBar(label, value)).join("")}
      </div>
      <div class="result-secondary-gains">
        <div><b>知名度</b><span>+${val(gains.fame || 0)}</span></div>
        <div><b>業界評価</b><span>+${val(gains.industry || 0)}</span></div>
        <div><b>コア人気</b><span>+${val(gains.core || 0)}</span></div>
      </div>
      ${v043dRenderFanGainFactors(r)}
      <div class="result-setlist"><b>SET LIST</b>${(r.songs || []).map((name, i) => `<span>${i + 1}. ${escapeHtml(name)}</span>`).join("")}</div>
      <div class="result-notes">
        <p>ライブアレンジ：${escapeHtml(r.adlib || r.adlibDisabledReason || "なし")}</p>
        <p>セトリボーナス：${escapeHtml(r.setlistBonusText || "なし")}</p>
        <p>同一曲：${escapeHtml(r.repeatText || "なし")}</p>
        <p>物販：${escapeHtml(r.merchSummary || "なし")}</p>
        ${r.coreEvent ? `<p>完璧ではないが、コアなファンに強く刺さった。</p>` : ""}
        ${r.mannerWarning ? `<p>交流注意：${escapeHtml(r.mannerWarning)}</p>` : ""}
      </div>
      ${lowRankNote}
      <div class="modal-actions result-actions"><button id="downloadSetlistImageBtn" class="ghost-btn">セトリ画像を保存</button><button class="liveResultCloseBtn big-action">${escapeHtml(closeLabel)}</button></div>
    </div>
  </div>`;
}
function renderBandNameOverlay() {
  const renaming = !!state.renameBandNamePrompt;
  return `<div class="modal-backdrop">
    <div class="event-modal event band-name-modal">
      <div class="modal-icon">◆︎</div>
      <div class="modal-copy"><h2>${renaming ? "バンド名を変更する" : "バンド名を決めよう"}</h2><p>${renaming ? "改名すると、古い名前で覚えていた人が少し迷う。認知度がごく少し下がります。" : "ライブハウスに名前を出すには、バンド名が必要だ。"}</p><input id="bandNameInput" class="wide-input" placeholder="例：名無しの地下バンド" value="${escapeHtml(state.band.name || "")}" /></div>
      <div class="modal-actions confirm-wide"><button id="confirmBandNameBtn" class="big-action" data-se="b2">この名前で行く</button>${renaming ? `<button id="cancelBandNameBtn" class="ghost-btn" data-se="f1">戻る</button>` : ""}</div>
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
  ctx.fillText(`${r.title || "LIVE"} / ${r.turn || state.turn}T / ${r.venue || ""}`, 60, 140);
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
  document.querySelectorAll(".globalPhoneBtn").forEach(btn => btn.addEventListener("click", () => {
    if (state.turnNotice) clearTurnNotice();
    state.phoneSubView = "menu";
    state.activeMailId = null;
    state.view = "phone";
    render();
  }));
  document.querySelectorAll(".tabBtn:not(:disabled), .jumpTabBtn").forEach(btn => btn.addEventListener("click", () => {
    const v = btn.dataset.view || "home";
    if (state.turnNotice) clearTurnNotice();
    if (v !== "home" && v !== "dev" && showTutorialBlocked(v === "command" ? "command" : v === "schedule" ? "schedule" : v === "songs" ? "song" : "other")) return;
    if (v === "songs" && hasPendingSongFinalize()) { focusPendingSongFinalize(false); return; }
    if (v !== "songs" && hasPendingSongFinalize()) { focusPendingSongFinalize(true); return; }
    if (v === "phone") {
      state.phoneSubView = "menu";
      state.activeMailId = null;
    }
    /* fix5 #7: 図鑑への直接遷移（携帯を介さない data-view="bandbook" リンク）も常に一覧から開始させる */
    if (v === "bandbook") { state.bandBookDetail = null; state.bandBookDetailTab = "profile"; }
    state.view = v;
    if (v === "schedule" && state.scheduleTutorialStage === "needSchedule") {
      state.scheduleTutorialStage = "done";
      showEventPopup("スケジュール帳", "今後のライブの予定を組もう。\n出たいライブ候補をタップすると、会場費・キャパ・準備要求を確認して予約できる。", "event", v043eIcon("calendar"));
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
  bindLivePrepStepControls();
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
  document.querySelectorAll(".slotActionBtn").forEach(btn => btn.addEventListener("click", () => { const slot = Number(btn.dataset.slot || 1); if (state.saveSlotModal === "save") saveGame(true, slot); else { v043dResetConversationLog(); restoreGame(slot); } }));
  const cancelSlotModalBtn = document.getElementById("cancelSlotModalBtn");
  if (cancelSlotModalBtn) cancelSlotModalBtn.addEventListener("click", () => { state.saveSlotModal = null; render(); });
  ["refreshAppBtn", "pwaRefreshBtn"].forEach(id => { const btn = document.getElementById(id); if (btn) btn.addEventListener("click", reloadLatestVersion); });
  const flowRecoveryBtn = document.getElementById("flowRecoveryBtn");
  if (flowRecoveryBtn) flowRecoveryBtn.addEventListener("click", () => { if (!maybeFinishPendingTurnAdvanceAfterPopups()) { finishPendingTurnAdvance(); } });
  document.querySelectorAll(".popupCloseBtn").forEach(btn => btn.addEventListener("click", closeActivePopup));
  document.querySelectorAll("#storyNextBtn").forEach(btn => btn.addEventListener("click", () => runProgressionButtonAction(btn, advanceStoryEvent)));
  armProgressionButtonGate("#storyNextBtn");
  document.querySelectorAll("#storySkipBtn").forEach(btn => btn.addEventListener("click", skipStoryEvent));
  v043dBindConversationLogControls();
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
  if (confirmBandNameBtn) confirmBandNameBtn.addEventListener("click", () => { const name = (document.getElementById("bandNameInput")?.value || "").trim() || "名無しの地下バンド"; const renaming = !!state.renameBandNamePrompt; state.band.name = name; state.bandNamePrompt = false; state.renameBandNamePrompt = false; if (renaming) state.band.fame = clamp(Number(state.band.fame || 0) - 2, 0, 999); log(`バンド名を「${name}」に${renaming ? "変更" : "決定"}した。${renaming ? "認知度が少し下がった。" : ""}`); showEventPopup(renaming ? "バンド名変更" : "バンド名決定", `${renaming ? "新しい名前で活動し直す。" : "今日からこの名前でライブハウスに出る。"}\n${name}${renaming ? "\n認知度-2" : ""}`, "event", v043eIcon("band")); if (state.pendingTurnAdvance) { if (!maybeFinishPendingTurnAdvanceAfterPopups()) render(); } else render(); });
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
  document.querySelectorAll(".acceptOfferBtn").forEach(btn => btn.addEventListener("click", () => requestLiveOfferAccept(btn.dataset.offerId)));
  document.querySelectorAll(".phoneModeBtn").forEach(btn => btn.addEventListener("click", () => {
    state.phoneSubView = btn.dataset.phoneMode || "menu";
    if (state.phoneSubView !== "mail") state.activeMailId = null;
    /* fix5 #7: 図鑑アプリへの入口（トップメニュー遷移）は常に一覧から開始させる。
       行内からの詳細遷移(.bandBookRowBtn)はこのハンドラを経由しないため無影響。 */
    if (state.phoneSubView === "bandbook") { state.bandBookDetail = null; state.bandBookDetailTab = "profile"; }
    render();
  }));
  document.querySelectorAll(".tutorialSkipHintsBtn").forEach(btn => btn.addEventListener("click", () => { state.tutorialSkipHints = true; log("チュートリアルの案内表示を少なめにした。", "event"); render(); }));
  document.querySelectorAll(".mailOpenBtn").forEach(btn => btn.addEventListener("click", () => openMail(btn.dataset.mailId)));
  document.querySelectorAll(".closeMailDetailBtn").forEach(btn => btn.addEventListener("click", closeMailDetail));
  document.querySelectorAll(".v043cFirstLiveReplyBtn").forEach(btn => btn.addEventListener("click", () => v043cRequestFirstLiveReply(btn.dataset.mailId)));
  document.querySelectorAll(".v043cOpenFirstLiveMailBtn").forEach(btn => btn.addEventListener("click", () => v043cOpenMailDirect(btn.dataset.mailId)));
  document.querySelectorAll(".v043cScheduleTabBtn").forEach(btn => btn.addEventListener("click", () => v043cSetScheduleTab(btn.dataset.scheduleTab)));
  document.querySelectorAll(".snsPostBtn").forEach(btn => btn.addEventListener("click", () => snsPost(btn.dataset.snsPost || "chat")));
  document.querySelectorAll(".declineOfferBtn").forEach(btn => btn.addEventListener("click", () => declineLiveOffer(btn.dataset.offerId)));
  document.querySelectorAll(".meetApplicantMailBtn").forEach(btn => btn.addEventListener("click", () => requestMeetApplicantFromMail(btn.dataset.mailId)));
  document.querySelectorAll(".openBandFromMailBtn").forEach(btn => btn.addEventListener("click", () => { state.activeMailId = null; state.view = "band"; state.phoneSubView = "menu"; render(); }));
  document.querySelectorAll(".openScheduleFromMailBtn").forEach(btn => btn.addEventListener("click", () => { v043cUiRuntime.scheduleTab = "planned"; state.activeMailId = null; state.view = "schedule"; state.phoneSubView = "menu"; render(); }));
  const confirmMailActionBtn = document.getElementById("confirmMailActionBtn");
  if (confirmMailActionBtn) confirmMailActionBtn.addEventListener("click", confirmMailAction);
  const cancelMailActionBtn = document.getElementById("cancelMailActionBtn");
  if (cancelMailActionBtn) cancelMailActionBtn.addEventListener("click", cancelMailAction);
  document.getElementById("downloadSetlistImageBtn")?.addEventListener("click", downloadSetlistImage);
  const confirmBookingBtn = document.getElementById("confirmBookingBtn");
  if (confirmBookingBtn) confirmBookingBtn.addEventListener("click", () => { const b = state.pendingBooking; state.pendingBooking = null; if (b) bookLiveFromHome(b.turn, b.venueId, true, b.liveType, b.invitedBandIds); });
  const cancelBookingBtn = document.getElementById("cancelBookingBtn");
  if (cancelBookingBtn) cancelBookingBtn.addEventListener("click", () => { state.pendingBooking = null; render(); });
  const joinAfterpartyBtn = document.getElementById("joinAfterpartyBtn");
  if (joinAfterpartyBtn) joinAfterpartyBtn.addEventListener("click", attendAfterparty);
  const skipAfterpartyBtn = document.getElementById("skipAfterpartyBtn");
  if (skipAfterpartyBtn) skipAfterpartyBtn.addEventListener("click", skipAfterparty);
  document.querySelectorAll(".afterpartyChoiceBtn").forEach(btn => btn.addEventListener("click", () => resolveAfterpartyChoice(btn.dataset.choiceKey || "listen")));
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
  document.querySelectorAll(".bandBookRowBtn").forEach(btn => btn.addEventListener("click", () => {
    state.bandBookDetail = btn.dataset.bandId || null;
    state.bandBookDetailTab = "profile";
    if (state.view === "phone") state.phoneSubView = "bandbook";
    else state.view = "bandbook";
    render();
  }));
  document.querySelectorAll(".bandBookTabBtn").forEach(btn => btn.addEventListener("click", () => { state.bandBookDetailTab = btn.dataset.bandbookTab || "profile"; render(); }));

  document.querySelectorAll(".dev-group[data-dev-group]").forEach(el => el.addEventListener("toggle", () => {
    state.devOpenGroups = state.devOpenGroups || {};
    state.devOpenGroups[el.dataset.devGroup] = el.open;
  }));
  const devJumpTurnBtn = document.getElementById("devJumpTurnBtn");
  if (devJumpTurnBtn) devJumpTurnBtn.addEventListener("click", () => devJumpToTurn(document.getElementById("devTurnInput")?.value || state.turn));
  document.querySelectorAll(".devStageBtn").forEach(btn => btn.addEventListener("click", () => devPrepareStage(btn.dataset.stage)));
  const devApplyStatsBtn = document.getElementById("devApplyStatsBtn");
  if (devApplyStatsBtn) devApplyStatsBtn.addEventListener("click", devApplyStatsFromForm);
  const devStartStoryBtn = document.getElementById("devStartStoryBtn");
  if (devStartStoryBtn) devStartStoryBtn.addEventListener("click", () => startStoryEvent(document.getElementById("devStorySelect")?.value || "first_afterparty_triple_arrows", { context: {
    ...memberJoinStoryContext({ name: "テスト候補", part: "Gt/Vo", joinStatus: "仮加入", mainGenre: "ロック" }),
    offerTurn: Math.min((state.turn || 1) + 2, (state.maxTurn || 50) - 1),
    originalTitle: (state.songs || []).find(s => !s.isCover)?.title || "オリジナル曲", fatigueGain: 20,
    bandName: "Triple Arrows", skillName: "サンプルスキル", rank: "A"
  } }));
  const devAddApplicantBtn = document.getElementById("devAddApplicantBtn");
  if (devAddApplicantBtn) devAddApplicantBtn.addEventListener("click", () => devAddApplicantById(document.getElementById("devApplicantSelect")?.value || ""));
  const devRecruitBtn = document.getElementById("devRecruitBtn");
  if (devRecruitBtn) devRecruitBtn.addEventListener("click", () => { addApplicantFromCandidates("DEV募集"); render(); });
  const devEnsureSongsBtn = document.getElementById("devEnsureSongsBtn");
  if (devEnsureSongsBtn) devEnsureSongsBtn.addEventListener("click", () => { devEnsureSongs(7); render(); });
  const devClearTutorialBtn = document.getElementById("devClearTutorialBtn");
  if (devClearTutorialBtn) devClearTutorialBtn.addEventListener("click", () => { devClearTutorialLocks("DEV手動"); render(); });
  const devClearEphemeralBtn = document.getElementById("devClearEphemeralBtn");
  if (devClearEphemeralBtn) devClearEphemeralBtn.addEventListener("click", () => { clearEphemeralStateAfterLoad(); devClearTutorialLocks("DEV一時状態破棄"); log("DEV：一時モーダル状態を破棄した。", "warn"); render(); });
  const devGrandCheckBtn = document.getElementById("devGrandCheckBtn");
  if (devGrandCheckBtn) devGrandCheckBtn.addEventListener("click", devShowGrandCheck);
  document.querySelectorAll(".devBalanceProfileBtn").forEach(btn => btn.addEventListener("click", () => devApplyBalanceProfile(btn.dataset.profile || "grand_border")));
  const devBandEventSeedBtn = document.getElementById("devBandEventSeedBtn");
  if (devBandEventSeedBtn) devBandEventSeedBtn.addEventListener("click", devPrepareBandEventSeed);
  const devGrantPlayerSkillBtn = document.getElementById("devGrantPlayerSkillBtn");
  if (devGrantPlayerSkillBtn) devGrantPlayerSkillBtn.addEventListener("click", () => { const id = document.getElementById("devPlayerSkillSelect")?.value; if (id && !hasSkill(id)) unlockSkill(id, "DEV付与"); render(); });
  const devGrantBandSkillBtn = document.getElementById("devGrantBandSkillBtn");
  if (devGrantBandSkillBtn) devGrantBandSkillBtn.addEventListener("click", () => { const id = document.getElementById("devBandSkillSelect")?.value; const sk = id ? bandSkillById(id) : null; if (sk) grantBandSkill(id, (sk.sourceBandIds||[])[0] || "triple_arrows", "DEV付与"); render(); });
  const bandBookBackBtn = document.getElementById("bandBookBackBtn");
  if (bandBookBackBtn) bandBookBackBtn.addEventListener("click", () => { state.bandBookDetail = null; render(); });
}

function continuePostLiveFlow() {
  if (state.postLiveStory) {
    const ev = state.postLiveStory;
    state.postLiveStory = null;
    state.activePopup = { title:ev.title, body:ev.body, type:"event", icon:ev.icon || "●︎" };
    return;
  }
  const next = nextPopupFromQueue();
  if (next) { state.activePopup = next; return; }
  if (state.pendingEndingAfterLive) {
    state.pendingEndingAfterLive = false;
    state.ended = true;
    return;
  }
  // ライブ結果・打ち上げ・通知をすべて確認したあと、ここで初めて次ターンへ進める。
  maybeFinishPendingTurnAdvanceAfterPopups();
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
function genericAfterpartyEvent(rank) {
  const high = ["S", "A"].includes(rank);
  const pool = [
    { key:"reflection", title:"終演後の反省会", text:"今日の良かったところと、次に直したいところを短く話した。", rel:0, applicant:0.03, stats:["mental","teamwork"] },
    { key:"customer", title:"客席の感想", text:"出口で聞こえた感想が、次のライブのヒントになった。", rel:0, applicant:0.04, stats:["charisma","sense"] },
    { key:"manager", title:"店長の一言", text:"ライブハウスの人から、次につながる小さな助言をもらった。", rel:0, applicant:0.06 + (high ? 0.03 : 0), stats:["knowledge","mental"] }
  ];
  return pool[rand(0, pool.length - 1)];
}
function buildAfterpartyEventScene(p) {
  const bands = (p.invitedBandIds || []).map(rivalById).filter(Boolean);
  const hasOtherBands = bands.length > 0;
  const baseEvent = hasOtherBands ? afterpartyEventForBands(bands, p.rank) : genericAfterpartyEvent(p.rank);
  const subject = hasOtherBands ? `${bands[0]?.name || "共演者"}との打ち上げ` : "ライブ後の小さな反省会";
  const body = `${baseEvent.text}\n\nどう過ごす？`;
  const choices = [
    { key:"listen", label:"詳しく聞いてみる", desc:"交流・ステータス重視 / 疲労ふつう", fatigue:18, relMod:2, statMod:1, applicantMod:-0.02, fame:0, industry:0, funds:0, songBoost:0 },
    { key:"pitch", label:"自分たちの曲を聴いてもらう", desc:"曲強化・知名度重視 / 疲労やや多め", fatigue:21, relMod:1, statMod:0, applicantMod:0.03, fame:1, industry:1, funds:0, songBoost:2 },
    { key:"leave", label:"早めに切り上げる", desc:"効果控えめ / 疲労少なめ", fatigue:9, relMod:-2, statMod:0, applicantMod:-0.12, fame:0, industry:0, funds:0, songBoost:0 }
  ];
  if (!hasOtherBands) {
    choices[0] = { key:"review", label:"メンバーで反省会する", desc:"協調性・メンタル重視 / 疲労ふつう", fatigue:15, relMod:0, statMod:1, applicantMod:-0.10, fame:0, industry:0, funds:0, songBoost:0 };
    choices[1] = { key:"staff", label:"店長に挨拶する", desc:"業界評価・資金少し / 疲労ふつう", fatigue:16, relMod:0, statMod:0, applicantMod:0.02, fame:1, industry:1, funds:2000, songBoost:1 };
  }
  return { rank:p.rank, total:p.total, liveType:p.liveType, invitedBandIds:[...(p.invitedBandIds || [])], title:p.title, baseEvent, scene:{ title:subject, body, icon:"○︎", choices } };
}
function applyAfterpartyChoiceStats(payload, choice, exposure) {
  const event = payload.baseEvent || genericAfterpartyEvent(payload.rank);
  const rankBonus = { S:2, A:2, B:1, C:1, D:0, E:0 }[payload.rank] || 0;
  const baseAmount = Math.max(1, Math.floor((exposure + rankBonus) / 3));
  const amount = Math.max(1, baseAmount + Number(choice.statMod || 0));
  const stats = new Set(event.stats || []);
  if (choice.key === "review") { stats.add("teamwork"); stats.add("mental"); }
  if (choice.key === "pitch") { stats.add("sense"); stats.add("charisma"); }
  if (choice.key === "staff") { stats.add("knowledge"); stats.add("mental"); }
  if (choice.key === "leave") { stats.clear(); stats.add("mental"); }
  activeMembers().forEach(m => {
    stats.forEach(k => { m.stats[k] = clamp((m.stats[k] || 1) + (choice.key === "leave" ? 1 : amount), 1, 99); });
  });
  return { amount, stats:[...stats] };
}
function applyAfterpartySongBoost(choice) {
  const gain = Number(choice.songBoost || 0);
  if (gain <= 0) return null;
  const originals = (state.songs || []).filter(s => !s.isCover);
  if (!originals.length) return null;
  const target = originals.slice().sort((a,b) => (b.createdTurn || 0) - (a.createdTurn || 0))[0];
  target.performance = clamp((target.performance || 0) + gain, 0, 99);
  target.lyrics = clamp((target.lyrics || 0) + Math.max(1, Math.floor(gain / 2)), 0, 99);
  target.catchy = clamp((target.catchy || 0) + Math.max(1, Math.floor(gain / 2)), 0, 99);
  target.standardPoints = (target.standardPoints || 0) + 1;
  return { title:target.title, gain };
}
function startAfterpartyChoiceEvent(p) {
  state.pendingAfterpartyEvent = buildAfterpartyEventScene(p);
  state.pendingAfterparty = null;
  render();
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
  if (p.initialAfterparty) {
    const fatigueBefore = state.band.fatigue || 0;
    state.pendingAfterparty = null;
    addFatigue(20);
    const original = (state.livePrepSetlist || []).map(id => state.songs.find(song => song.id === id)).find(song => song && !song.isCover) || state.songs.find(song => !song.isCover);
    activeMembers().forEach(m => { m.stats.teamwork = clamp((m.stats.teamwork || 0) + 2, 1, 99); m.stats.mental = clamp((m.stats.mental || 0) + 1, 1, 99); m.stats.charisma = clamp((m.stats.charisma || 0) + 1, 1, 99); });
    if (bandSystemOn()) {
      // Triple Arrows初回打ち上げ：DBイベントの効果を直接適用（ポップはこの専用演出で代替）
      const ta = BAND_EVENT_DATABASE.event_triple_arrows_first_after_party;
      applyBandEventEffects(ta, { silentPopup: true });
      const fatigueGainNow = Math.max(0, Math.round((state.band.fatigue || 0) - fatigueBefore));
      const storyPlayed = startStoryEvent("first_afterparty_triple_arrows", { silent:true, context:{ originalTitle: original?.title || "オリジナル曲", fatigueGain: fatigueGainNow } });
      if (!storyPlayed) {
        state.activePopup = { title:"はじめての打ち上げ", body:`Triple Arrowsのスバル：
「え、あれで初ライブかよ。${original?.title || "オリジナル曲"}って曲、よかったぜ」

Triple Arrowsのタカナシ：
「連絡先、交換しとこう。今度やる俺たちの企画にも来てくれよ」

主人公：
「ぜひ！また、ライブハウスで会いましょう」

Triple Arrowsと連絡先を交換した。
交流が深まった。バンド図鑑にTriple Arrowsが登録された。
Triple Arrowsの刺激を受け、ステータスが上がった。

主人公：
「ふう、疲れが溜まってたら二日酔いだったな…」
疲労+${fatigueGainNow}%`, type:"event", icon:v043eIcon("band") };
      }
    } else {
      setRelationshipWithBand("paper_moon", relationshipWithBand("paper_moon") + 18);
      state.activePopup = { title:"はじめての打ち上げ", body:`Paper Moon Kids（仮）のスバル：
「え、あれで初ライブかよ。${original?.title || "オリジナル曲"}って曲、よかったぜ」

Paper Moon Kids（仮）のタカナシ：
「連絡先、交換しとこう。今度やる俺たちの企画にも来てくれよ」

主人公：
「ぜひ！また、ライブハウスで会いましょう」

Paper Moon Kids（仮）と連絡先を交換した。
交流が少し深まった。
Paper Moon Kids（仮）の刺激を受け、ステータスが上がった。

主人公：
「ふう、疲れが溜まってたら二日酔いだったな…」
疲労+${Math.max(0, Math.round((state.band.fatigue || 0) - fatigueBefore))}%`, type:"event", icon:v043eIcon("band") };
    }
    schedulePendingTurnAdvance("afterparty");
    render();
    return;
  }
  if ((state.band.fatigue || 0) > 80) { log("疲労が高すぎて打ち上げには行けない。", "warn"); state.pendingAfterparty = null; continuePostLiveFlow(); render(); return; }
  startAfterpartyChoiceEvent(p);
}
function resolveAfterpartyChoice(choiceKey="listen") {
  const payload = state.pendingAfterpartyEvent || null;
  if (!payload) { render(); return; }
  const scene = payload.scene || {};
  const choice = (scene.choices || []).find(ch => ch.key === choiceKey) || (scene.choices || [])[0];
  if (!choice) { state.pendingAfterpartyEvent = null; continuePostLiveFlow(); render(); return; }
  const before = state.band.fatigue || 0;
  state.band.fatigue = clamp(before + Math.round(Number(choice.fatigue || 18) * fatigueGainMultiplier()), 0, 100);
  const bands = (payload.invitedBandIds || []).map(rivalById).filter(Boolean);
  const hasOtherBands = bands.length > 0;
  const exposure = hasOtherBands ? rivalBandExposureBonus(bands) : 1;
  const beforeStats = activeMembers().map(m => ({ id:m.id, name:m.name, technique:m.stats.technique, rhythm:m.stats.rhythm, sense:m.stats.sense, mental:m.stats.mental, teamwork:m.stats.teamwork, stamina:m.stats.stamina, charisma:m.stats.charisma, knowledge:m.stats.knowledge }));
  applyAfterpartyChoiceStats(payload, choice, exposure);
  const songBoost = applyAfterpartySongBoost(choice);
  if (Number(choice.funds || 0)) state.band.funds += Number(choice.funds || 0);
  if (Number(choice.fame || 0)) state.band.fame = clamp((state.band.fame || 0) + Number(choice.fame || 0), 0, 999);
  if (Number(choice.industry || 0)) state.band.industry = clamp((state.band.industry || 0) + Number(choice.industry || 0), 0, 999);
  let introText = "";
  let relGain = 0;
  if (hasOtherBands) {
    const baseRel = 6 + Number(payload.baseEvent?.rel || 0) + Number(choice.relMod || 0);
    relGain = Math.max(1, baseRel);
    bands.forEach(b => setRelationshipWithBand(b.id, relationshipWithBand(b.id) + relGain));
    activeMembers().forEach(m => { m.stats.teamwork = clamp(m.stats.teamwork + 1, 1, 99); m.stats.mental = clamp(m.stats.mental + 1, 1, 99); if (["S","A"].includes(payload.rank) && choice.key !== "leave") m.stats.charisma = clamp(m.stats.charisma + 1, 1, 99); });
    const introChance = clamp(Number(payload.baseEvent?.applicant || 0.10) + Number(choice.applicantMod || 0) + bandSkillAfterPartyBonusPct() / 100, 0.02, 0.80);
    if (Math.random() < introChance) {
      const applicant = addApplicantFromCandidates("打ち上げ紹介");
      if (applicant) {
        addMail("打ち上げで紹介されたメンバー候補", `${bands[0]?.name || "共演者"}から紹介された${applicant.name}です。\nライブ後に連絡先をもらいました。バンド情報から加入を検討できます。`, "member", { sender: bands[0]?.name || "打ち上げで知り合った人", senderBandId: bands[0]?.id || null });
        introText = `\n紹介：${applicant.name}の連絡先をもらった。`;
      }
    }
  }
  const chance = hangoverChance(payload.rank, state.band.fatigue || 0);
  const hungover = Math.random() < chance;
  if (hungover) {
    const pending = state.pendingTurnAdvance;
    state.hangoverTurn = pending?.nextTurn || Math.min((state.turn || 1) + 1, state.maxTurn || 50);
  }
  const labels = { technique:"技術", rhythm:"リズム", sense:"センス", mental:"メンタル", teamwork:"協調", stamina:"体力", charisma:"カリスマ", knowledge:"知識" };
  const statLines = activeMembers().slice(0,5).map(m => {
    const b = beforeStats.find(x => x.id === m.id) || {};
    const parts = Object.keys(labels).map(k => {
      const diff = Math.round((m.stats[k] || 0) - (b[k] || 0));
      return diff ? `${labels[k]}+${diff}` : "";
    }).filter(Boolean);
    return parts.length ? `${m.name}：${parts.join(" / ")}` : "";
  }).filter(Boolean);
  const relText = hasOtherBands ? `交流：${bands.map(b=>`${b.name}+${relGain}`).join(" / ")}` : "メンバー内の打ち上げ。外部交流・紹介は控えめ。";
  const extraLines = [];
  if (Number(choice.funds || 0)) extraLines.push(`資金+${Number(choice.funds || 0).toLocaleString()}円`);
  if (Number(choice.fame || 0)) extraLines.push(`知名度+${choice.fame}`);
  if (Number(choice.industry || 0)) extraLines.push(`業界評価+${choice.industry}`);
  if (songBoost) extraLines.push(`曲強化：「${songBoost.title}」演奏+${songBoost.gain}`);
  const resultBody = `${relText}\n選択：${choice.label}\nイベント：${payload.baseEvent?.title || scene.title} - ${payload.baseEvent?.text || "短い反省会をした。"}${statLines.length ? "\n" + statLines.join("\n") : ""}${extraLines.length ? "\n" + extraLines.join(" / ") : ""}${introText}\n疲労+${Math.round(state.band.fatigue-before)}%。二日酔い判定${Math.round(chance*100)}%${hungover ? " →︎ 発生" : " →︎ なし"}。`;
  state.popupQueue = state.popupQueue || [];
  state.popupQueue.push({ title:"打ち上げ結果", body:resultBody, type:hungover ? "warn" : "event", icon:v043eIcon("band"), layout:"scroll-safe", modalClass:"afterparty-result-safe-modal", scrollSafe:true });
  log(`打ち上げイベント：${payload.baseEvent?.title || scene.title} / ${choice.label}。${relText}${extraLines.length ? " / " + extraLines.join(" / ") : ""}${introText ? " / " + introText.trim() : ""} 疲労+${Math.round(state.band.fatigue-before)}%。`, hungover ? "warn" : "event");
  if (bandSystemOn()) {
    processBandStoryEvents("afterParty");
    checkCommonSkillAcquisition();
  }
  state.pendingAfterpartyEvent = null;
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
  if (!canBookLiveTurn(turn)) {
    log(liveBookingDeadlineText());
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
  const finalBandIds = liveType === "self_taiban" ? (invitedBandIds.length ? invitedBandIds : pickRivalBands(2).map(b=>b.id)) : (["booking_house", "booking_band", "band_fes", "corp_fes"].includes(liveType) ? (invitedBandIds.length ? invitedBandIds : pickRivalBands(liveType === "booking_band" ? 1 : 2).map(b=>b.id)) : []);
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
  const idx = state.liveEvents.findIndex(e => e === ev);
  if (idx >= 0) state.liveEvents.splice(idx, 1);
  else state.liveEvents = state.liveEvents.filter(e => !(Number(e.turn) === Number(turn) && e.venueId === ev.venueId && e.liveType === ev.liveType));
  refreshLiveSchedule();
  state.band.trust = clamp(state.band.trust - (noShow ? 10 : 3), 0, 100);
  state.band.fame = clamp(state.band.fame - (noShow ? 4 : 1), 0, 999);
  if (noShow) {
    const base = eventBaseCost(ev, v);
    const penalty = base + Math.round(base * 0.5);
    state.band.funds -= penalty;
    log(`${turn}Tの「${v.name}」をドタキャンした。${liveTypeMeta(ev).feeLabel}＋損料 ${penalty.toLocaleString()}円を支払い、信頼度と知名度が下がった。`);
    schedulePendingTurnAdvance("cancel_live");
    if (!maybeFinishPendingTurnAdvanceAfterPopups()) render();
    return;
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
  const guide = tutorialCommandMessage(command);
  if (guide) { state.activePopup = guide; render(); return; }
  if (state.hangoverTurn === state.turn && command !== "rest") {
    state.activePopup = { title:"二日酔い", body:"このターンは休憩しかできない。\n休憩を選ぶと通常行動に戻ります。", type:"warn", icon:v043eIcon("cross") };
    render();
    return;
  }
  runCommandTurn(command);
}
function confirmNoSongcraftCommand() {
  const command = state.pendingNoSongcraftCommand;
  state.pendingNoSongcraftCommand = null;
  if (hasPendingSongFinalize()) { focusPendingSongFinalize(true); return; }
  if (command) runCommandTurn(command);
}
function commandLabel(command) {
  return ({ practice:"練習", rest:"休憩", parttime:"バイト", recruit:"募集", promo:"宣伝", talk:"会話" }[command] || "行動");
}
function runCommandTurn(command) {
  if (hasPendingSongFinalize()) { focusPendingSongFinalize(true); return; }
  const before = snapshotActionState();
  state.commandCounts = state.commandCounts || {};
  state.commandCounts[command] = (state.commandCounts[command] || 0) + 1;
  executeCommand(command);
  maybeAddTutorialSnsSeed(command);
  const promoApplicant = maybePromoRecruitAfterCommand(command);
  const event = maybeGenerateCommandEvent(command);
  maybeUnlockProgressSkills(command);
  postTurnMaintenance(command);
  const after = snapshotActionState();
  const tutorialMsg = state.tutorialStage === "needCommand" ? "5ターン目に初ライブだ！\n曲を作り、メンバーを集めよう！" : "";
  if (state.tutorialStage === "needCommand") state.tutorialStage = "done";
  state.actionResultModal = makeActionResultModal(command, before, after, event, tutorialMsg);
  maybeShowFatigueIncreasePopup(before.fatigue, after.fatigue, commandLabel(command) + "で疲労が増えた。");
  schedulePendingTurnAdvance(command);
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
    memberStats: activeMembers().map(m => ({ id:m.id, name:m.name, growthType:memberGrowthTypeKey(m), stats:{ ...(m.stats || {}) } }))
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
    const diffs = MEMBER_STAT_KEYS.map(k => {
      const beforeVal = Math.round(Number(p.stats?.[k] || 0));
      const afterVal = Math.round(Number(n.stats?.[k] || 0));
      return { key:k, before:beforeVal, after:afterVal, diff:afterVal - beforeVal };
    }).filter(x => x.diff !== 0);
    if (diffs.length) rows.push({ name:n.name, growthType:n.growthType || DEFAULT_MEMBER_GROWTH_TYPE, diffs });
  });
  if ((after.fatigue || 0) >= 60) rows.push({ line:`疲労${Math.round(after.fatigue)}%。疲労が高いほど練習効率は落ちます。` });
  return rows;
}
function commandMeta(command) {
  return {
    practice:{ label:"練習", icon:v043eIcon("practice"), body:"スタジオに音が鳴った。少しだけバンドが前に進んだ。" },
    rest:{ label:"休憩", icon:v043eIcon("rest"), body:"今日は休むことにした。身体が軽くなった。" },
    parttime:{ label:"バイト", icon:v043eIcon("parttime"), body:"音楽のために、今日は働いた。" },
    recruit:{ label:"募集", icon:v043eIcon("recruit"), body:"掲示板とSNSにメンバー募集を出した。" },
    promo:{ label:"宣伝", icon:v043eIcon("promo"), body:"まだ小さいが、知らない誰かに届いている。" },
    talk:{ label:"会話", icon:v043eIcon("talk"), body:"少しだけ本音を話した。バンドの空気が変わった。" }
  }[command] || { label:"行動", icon:v043eIcon("spark"), body:"今週の行動を終えた。" };
}
function avgActiveMemberStat(key) {
  const list = activeMembers();
  return list.length ? avg(list.map(m => Number(m.stats?.[key] || 0))) : Number(state.player?.stats?.[key] || 0);
}
function commandMiniEventPhase() {
  const t = Number(state.turn || 1);
  if (t <= 29) return "pre_under";
  if (t <= 40) return "post_under";
  return "grand_pressure";
}
function commandMiniEventChance(command) {
  if (command === "rest") return 0;
  const phase = commandMiniEventPhase();
  const b = state.band || {};
  let chance = 0.15;
  if (phase === "pre_under" && (state.turn || 1) >= 25) chance += 0.08;
  if (phase === "post_under") chance += 0.05;
  if (phase === "grand_pressure") chance += 0.04;
  if (command === "practice") {
    if (avgActiveMemberStat("technique") >= 55) chance += 0.05;
    if (avgActiveMemberStat("teamwork") >= 55) chance += 0.05;
    if ((b.fatigue || 0) >= 70) chance -= 0.08;
  }
  if (command === "promo") {
    if ((b.fame || 0) >= 30) chance += 0.05;
    if (avgActiveMemberStat("charisma") >= 55) chance += 0.05;
    if ((state.bookingInviteBoostTurns || 0) > 0) chance += 0.04;
  }
  if (command === "recruit") {
    if ((b.fame || 0) >= 25) chance += 0.05;
    if ((b.industry || 0) >= 25) chance += 0.05;
    const coverage = bandInstrumentCounts();
    if (["vocal","guitar","bass","drum"].some(k => (coverage[k] || 0) <= 0)) chance += 0.08;
  }
  if (command === "parttime") {
    if ((b.funds || 0) < 20000) chance += 0.10;
    if (avgActiveMemberStat("knowledge") >= 55) chance += 0.04;
  }
  if (command === "talk") {
    if ((b.trust || 0) < 50) chance += 0.08;
    if (avgActiveMemberStat("mental") >= 55) chance += 0.04;
    if (avgActiveMemberStat("teamwork") >= 55) chance += 0.04;
  }
  if (state.activeStoryEvent || state.activePopup || state.pendingAfterparty || state.pendingAfterpartyEvent || state.liveProgressModal || state.liveResultModal) chance = 0;
  return clamp(chance, 0, 0.34);
}
function boostRecentOriginalSongTiny(reason="行動イベント") {
  const originals = (state.songs || []).filter(s => !s.isCover);
  if (!originals.length) return null;
  const target = originals.slice().sort((a,b) => (b.createdTurn || 0) - (a.createdTurn || 0))[0];
  target.performance = clamp((target.performance || 0) + 1, 0, 99);
  target.catchy = clamp((target.catchy || 0) + 1, 0, 99);
  target.standardPoints = (target.standardPoints || 0) + 1;
  log(`${reason}：「${target.title}」の曲強化が少し進んだ。`, "song");
  return target.title;
}
function commandMiniEventPool(command, phase, member) {
  const pre = phase === "pre_under";
  const post = phase !== "pre_under";
  const pools = {
    practice: [
      { title:pre ? "フェス前の合わせ" : "GRANDを意識した通し練習", body:pre ? `${member.name}が「この曲、もう一回だけ合わせよう」と言った。UNDER FES前の空気が少し締まる。` : `${member.name}が本番を想定して、曲間まで含めた通し練習を提案した。`, icon:"♪︎", effect:()=>{ member.stats.teamwork=clamp(member.stats.teamwork+1,1,99); member.stats.rhythm=clamp(member.stats.rhythm+1,1,99); state.band.fatigue=clamp((state.band.fatigue||0)+2,0,100); } },
      { title:"手応えのある一音", body:`${member.name}が、自分の音の芯を少し掴んだ。`, icon:"▲︎", effect:()=>{ member.stats.technique=clamp(member.stats.technique+1,1,99); member.stats.mental=clamp(member.stats.mental+1,1,99); } }
    ],
    promo: [
      { title:pre ? "フライヤーの一言" : "フェス後の反応", body:pre ? "配ったフライヤーに、通りすがりの人が少し足を止めた。" : "UNDER FES後、名前を覚えている客が少し増えていた。", icon:"▪︎", effect:()=>{ state.band.fame=clamp((state.band.fame||0)+2,0,999); state.band.fans=clamp((state.band.fans||0)+rand(1,3),0,99999); } },
      { title:"投稿の伸び", body:"SNSの投稿がいつもより少しだけ回った。", icon:"▲︎", effect:()=>{ state.band.fame=clamp((state.band.fame||0)+1,0,999); state.bookingInviteBoostTurns=Math.max(state.bookingInviteBoostTurns||0,2); } }
    ],
    recruit: [
      { title:pre ? "掲示板の反応" : "噂を聞いた候補", body:pre ? "スタジオの掲示板を見た人から、短い返信が来た。" : "最近のライブを見ていた人が、加入に少し興味を持っているらしい。", icon:"✉︎", effect:()=>{ state.band.fame=clamp((state.band.fame||0)+1,0,999); state.promoRecruitTurns=Math.max(state.promoRecruitTurns||0,2); } },
      { title:"サポート経由の紹介", body:"知り合いサポートから、メンバー候補の話を少し聞いた。", icon:"●︎", effect:()=>{ state.band.industry=clamp((state.band.industry||0)+1,0,999); } }
    ],
    parttime: [
      { title:"臨時の追加シフト", body:"バイト先で少しだけ多く入って、機材代の足しにした。", icon:"○︎", effect:()=>{ state.band.funds += 3000; state.band.fatigue=clamp((state.band.fatigue||0)+2,0,100); } },
      { title:"店内BGM", body:"店内で流れていた曲が妙に耳に残った。次の曲作りのヒントになりそうだ。", icon:"♪︎", effect:()=>{ state.freeSongcraftCharge=(state.freeSongcraftCharge||0)+1; } }
    ],
    talk: [
      { title:pre ? "フェス前の本音" : "次の目標", body:pre ? `${member.name}が、UNDER FESへの不安を少し話してくれた。` : `${member.name}が、GRANDへ向けて今足りないものを言葉にした。`, icon:"☕︎", effect:()=>{ state.band.trust=clamp((state.band.trust||0)+2,0,100); member.stats.mental=clamp(member.stats.mental+1,1,99); } },
      { title:"何気ない一言", body:"雑談の中の一言が、次の曲の核になった。", icon:"✍︎", effect:()=>{ const title=boostRecentOriginalSongTiny("会話イベント"); if(!title) state.freeSongcraftCharge=(state.freeSongcraftCharge||0)+1; } }
    ]
  };
  return pools[command] || [];
}
function maybeGenerateCommandEvent(command) {
  const chance = commandMiniEventChance(command);
  if (chance <= 0 || Math.random() > chance) return null;
  const active = activeMembers();
  const member = active[rand(0, active.length - 1)] || state.player;
  const phase = commandMiniEventPhase();
  const list = commandMiniEventPool(command, phase, member);
  if (!list.length) return null;
  const ev = list[rand(0, list.length - 1)];
  ev.effect();
  log(`ミニイベント発生：${ev.title}。${ev.body}`, "event");
  return { title:ev.title, body:`${ev.body}\n発生率：${Math.round(chance*100)}% / ${phase === "pre_under" ? "UNDER FES前" : phase === "post_under" ? "UNDER FES後" : "GRAND準備期"}`, icon:ev.icon || "☆︎" };
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
      normalizeMemberGrowthType(m);
      const practiceBoost = (hasSkill("practice_efficiency") ? 1.2 : 1) * fatigueEffectMultiplier();
      applyMemberStatGrowth(m, "technique", rand(1,3) * practiceBoost, "practice");
      applyMemberStatGrowth(m, "rhythm", rand(0,2) * practiceBoost, "practice");
      maybeApplyFocusedGrowth(m, "practice", 1, 0.45);
      const inst = m.instruments[m.mainInstrument];
      if (inst) inst.lv = clamp(inst.lv + rand(2,5) * (inst.growth || 1) * memberGrowthCurveMultiplier(m, "practice"), 1, inst.potentialCap || inst.cap);
    });
    state.songs.forEach(s => s.performance = clamp(s.performance + Math.max(0, Math.round(rand(1,3) * fatigueEffectMultiplier())), 0, 99));
    addFatigue(14 - (hasSkill("shortcut_command") ? 2 : 0));
    b.trust = clamp(b.trust + 2, 0, 100);
    log(`練習した。技術・リズム・楽器Lv・曲の演奏が少し上がった。費用-${cost.toLocaleString()}円、疲労も増えた。`);
  }
  if (command === "rest") {
    if (state.hangoverTurn === state.turn) state.hangoverTurn = 0;
    const beforeFatigue = Number(b.fatigue || 0);
    const roll = Math.random();
    const rate = roll < 0.20 ? 0.60 : (roll < 0.80 ? 0.80 : 1.00);
    const label = rate >= 1 ? "ぐっすり休めた" : (rate >= 0.8 ? "よく休めた" : "少し眠りが浅かった");
    const recovered = Math.round(beforeFatigue * rate);
    b.fatigue = clamp(beforeFatigue - recovered, 0, 100);
    b.trust = clamp(b.trust + 4, 0, 100);
    activeMembers().forEach(m => m.stats.mental = clamp(m.stats.mental + rand(1,3), 1, 99));
    log(`休憩した。${label}。疲労-${recovered}%（${Math.round(rate*100)}%回復）、メンタルと信頼度が少し戻った。`);
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
    const snsBoost = (hasSkill("sns_master") ? 1.35 : 1) * (1 + bandSkillInfluencerPct() / 100);
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
  let applicant = state.lastApplicant;
  applicant = chooseApplicantDisplayName(applicant);
  applicant.joinStatus = Math.random() < 0.45 ? "仮加入" : "本加入";
  state.members.push(applicant);
  log(`${applicant.name}が${applicant.joinStatus}として加入した。加入済みメンバーは全員バンド構成に入り、ライブ準備で担当を選べる。`);
  showEventPopup(applicant.joinStatus === "仮加入" ? "仮加入！" : "新メンバー加入！", `${applicant.name} がバンドに加わった！\n担当：${applicant.part}\n得意：${applicant.mainGenre}\n加入済みメンバーは全員ライブ準備に表示される。`, applicant.joinStatus === "仮加入" ? "event" : "rare", applicant.joinStatus === "仮加入" ? "●︎" : "★︎");
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
  if (xp >= 20) return 4;
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
  if (songcraftRemainingThisTurn() <= 0 && !mustCompleteFirstDraftTutorial()) {
    showEventPopup("今週の曲作りは完了", `今日はもう曲作りを進めきった。\n${songcraftCountLabel()}。次のターンに続きを進めよう。`, "warn", v043eIcon("song"));
    return false;
  }
  const cost = plannedSongcraftFatigueCost(type, baseCost);
  if ((state.band.fatigue || 0) + cost > 100) {
    showEventPopup("疲労限界", `${label}には疲労${cost}%が必要です。疲労が100％を超えるため、先に休憩かドリンクを使おう。`, "warn", "⚠︎");
    return false;
  }
  return true;
}
function canStartAnySongcraft(types, baseCost, label) {
  if (songcraftRemainingThisTurn() <= 0 && !mustCompleteFirstDraftTutorial()) {
    showEventPopup("今週の曲作りは完了", `今日はもう曲作りを進めきった。\n${songcraftCountLabel()}。次のターンに続きを進めよう。`, "warn", v043eIcon("song"));
    return false;
  }
  const list = Array.isArray(types) ? types : [types];
  const remaining = 100 - (state.band.fatigue || 0);
  const minCost = Math.min(...list.map(t => plannedSongcraftFatigueCost(t, baseCost)));
  if (remaining < minCost) {
    showEventPopup("疲労限界", `${label}には最低でも疲労${minCost}%の余力が必要です。先に休憩かドリンクを使おう。`, "warn", "⚠︎");
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
    showEventPopup("疲労限界", `${label}には疲労${r.cost}%が必要です。疲労が100％を超えるため、先に休憩かドリンクを使おう。`, "warn", "⚠︎");
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
疲労軽減・疲労なし制作・サブジャンル派生が少し有利になる。`, "rare", "⬆︎");
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
今週はまだ余力が残っている。`, "rare", v043eIcon("spark")); }
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
function fatigueGainMultiplier() { return (hasSkill("self_management") ? 0.8 : 1) * (1 - bandSkillFatigueReducePct() / 100); }
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
    log(`新曲「${titleHint}」の種が生まれた。狙い:${a}→︎${b} / 結果:${genreDisplay(draft)}（${rollLabel}） / ${resolved.chanceText}`);
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
「${d.titleHint}」の歌詞完成度 ${val(score)}%。`, "song", "✍︎");
  } else {
    d.musicDone = true;
    d.musicScore = Math.max(d.musicScore, score);
    if ((d.arrange.includes("疾走") || score > 75) && !d.tags.includes("疾走感")) d.tags.push("疾走感");
    if ((d.arrange.includes("ドラム") || d.arrange.includes("DJ")) && !d.tags.includes("爆発力")) d.tags.push("爆発力");
    log(`${member.name}が「${d.titleHint}」の作曲を完成させた。完成度 ${val(score)}%。`, "song");
    if (score >= 75) showEventPopup("リフがハマった", `${member.name}が鳴らしたフレーズに、全員が少し前のめりになった。
「${d.titleHint}」の作曲完成度 ${val(score)}%。`, "song", v043eIcon("song"));
  }
  if (d.lyricsDone && d.musicDone) {
    state.songEditor = { step:"draftFinalize", draftId:d.id, title:d.titleHint, theme:d.theme };
    showEventPopup("曲完成前確認", `「${d.titleHint}」の作詞と作曲が揃った。\n曲名とテーマを確認して、完成させよう。`, "song", v043eIcon("song"));
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
    showEventPopup(`${done} 50％完成！`, halfBody, "song", d.lyricsDone ? "✍︎" : v043eIcon("song"), { bars });
    // 曲作り枠は通常行動枠と別。50%完成ではターン進行しない。
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
    showEventPopup(discovery.rare ? "RARE GENRE DISCOVERED!!" : "NEW GENRE DISCOVERED!!", `${discovery.rare ? "レア" : "新"}ジャンル「${discovery.genre}」を発見！\n「${song.title}」から生まれた新しい方向性。`, discovery.rare ? "rare" : "song", discovery.rare ? v043eIcon("fame") : v043eIcon("spark"));
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
  showEventPopup("新曲完成！", resultBody, discovery?.rare ? "rare" : "song", discovery?.rare ? "★︎" : "♪︎", { bars:[
    { label:"歌詞", value:val(song.lyrics) },
    { label:"演奏", value:val(song.performance) },
    { label:"テンポ", value:val(song.tempo) },
    { label:"キャッチー", value:val(song.catchy) },
    { label:"流行", value:val(song.trend) }
  ] });
  // 曲作り枠は通常行動枠と別。100%完成でもターン進行しない。
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
強化Lv ${levelBefore} →︎ ${s.boostLevel}
演奏+${val(gain)} / 歌詞・キャッチーも少しUP`, bars };
  showEventPopup("曲強化完了", state.lastSongcraftResult.body, "song", v043eIcon("chart"), { bars });
  log(`「${s.title}」を曲強化。強化Lv${levelBefore}→︎${s.boostLevel}、演奏+${val(gain)}。`, "song");
  // 曲強化も曲作り枠。通常行動とは別なのでターン進行しない。
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
  showEventPopup("曲編集完了", `「${oldTitle}」を編集した。\n曲名：${oldTitle} →︎ ${s.title}\nジャンル：${oldGenre} →︎ ${genreDisplay(s)}\nテーマ：${theme}\n歌詞：${lyricsText || "-"}`, "song", "✏︎", { bars });
  log(`「${oldTitle}」を曲編集。ジャンル:${oldGenre}→︎${genreDisplay(s)}。`);
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
  showEventPopup("編曲完了", `「${s.title}」を編曲した。\n${statSongLabel(param)} +${baseGain}\nジャンル:${genreDisplay(old)} →︎ ${genreDisplay(s)}\nアレンジ:${arr}`, "song", v043eIcon("song"), { bars });
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
  const supportIds = [...document.querySelectorAll(".supportCheck:checked")].map(x => x.value).filter(id => DATA.supportOptions.some(s => s.id === id));
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
  const liveTurn = state.turn;
  const ev = currentLiveEvent();
  if (!ev) {
    state.activePopup = { title:"ライブ予定が見つからない", body:"このターンのライブ予定が見つからなかった。\nスケジュールを再確認します。", type:"warn", icon:v043eIcon("calendar") };
    refreshLiveSchedule();
    render();
    return;
  }
  if (setlist.length < 5) {
    state.activePopup = { title:"セトリ不足", body:"ライブには5曲必要です。\n曲数が足りない場合はコピー曲で補充します。", type:"warn", icon:v043eIcon("song") };
    state.livePrepSetlist = autoBuildSetlist();
    render();
    return;
  }
  const result = calculateLive(setlist, supports, merch, positions, vocalist, chorus);
  result.turn = liveTurn;
  result.venueId = ev?.venueId || result.venue?.id || "";
  result.liveEventId = ev?.id || "";
  result.setlistIds = setlist.map(s => s.id);
  state.deferPopupsUntilAfterLive = true;
  state.__dgGaugeGrowthSnapshot = { funds: state.band.funds, fans: state.band.fans, fatigue: state.band.fatigue, fame: state.band.fame, audiencePower: displayAudiencePower(state.band), industry: state.band.industry };
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
    state.scheduleTutorialStage = "none";
    state.popupQueue = state.popupQueue || [];
    state.popupQueue.push({ title:"新しい可能性", body:"主人公「ボーカル以外にも道があるかな……」\n主人公がボーカル以外の楽器も担当可能になった。", type:"event", icon:v043eIcon("band") });
    state.popupQueue.push({ title:"スケジュール解放", body:"次からは自分でライブ予定を組む。\nまずはスケジュール帳を開いて、出たいライブを探そう。", type:"event", icon:v043eIcon("calendar") });
  }
  else if (state.turn < state.maxTurn && shouldPushFesShortagePopup(result)) {
    state.popupQueue = state.popupQueue || [];
    state.popupQueue.push(buildFesShortagePopup(result));
  }
  if (state.turn === state.maxTurn) {
    state.pendingEndingAfterLive = true;
  } else {
    schedulePendingTurnAdvance("live");
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
  return { title:"目標までの不足", body, type:lines.length ? "warn" : "rare", icon:lines.length ? "▶︎" : "★︎" };
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
    if (repCount < 3) lines.push(`代表曲/定番曲 あと${3 - repCount}曲`);
    if (freshCount < 1) lines.push("後半の新曲評価 1曲以上");
    if (b.fans < 180) lines.push(`ファン あと${180 - Math.round(b.fans)}人`);
    if (b.fame < 135) lines.push(`知名度 あと${135 - Math.round(b.fame)}`);
    if (b.industry < 118) lines.push(`業界評価 あと${118 - Math.round(b.industry)}`);
    if (lastResult && !["S","A"].includes(lastResult.rank)) lines.push(`直近ライブ評価 A以上が必要（今回は${lastResult.rank}）`);
    if (lastResult && (Number(lastResult.total) || 0) < 80) lines.push(`直近ライブ総合80以上が必要（今回は${val(lastResult.total)}）`);
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
  const ignored = !!(liveArrange && !liveArrange.disabled && liveArrange.text && liveArrange.text !== "なし");
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
  let liveArrange = adlibResult(avgSense, avgTeam, avgMental, avgRhythm, state.band.trust, fatigue);
  if (coverCount > 0) liveArrange = { performance:0, expression:0, heat:0, strategy:0, stability:0, text:"なし", disabled:true, disabledReason:"コピー曲入りのためアレンジ/アドリブなし" };
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
  let rank = rankFromScore(total);
  let rankGuardNote = "";
  if (coverCount >= 4 && ["S","A","B"].includes(rank)) {
    rank = "C";
    rankGuardNote = "コピー曲4曲以上のため評価上限C";
  } else if (coverCount >= 1 && ["S","A"].includes(rank)) {
    rank = "B";
    rankGuardNote = "コピー曲入りのため評価上限B";
  } else if (rank === "S" && originalCount < 2) {
    rank = "A";
    rankGuardNote = "S評価には自作曲2曲以上が必要";
  }
  const revenue = calculateRevenue(total, rank, merch, supports, setlist, originalCount, coverCount);
  const coreEvent = shouldCoreFanEvent(rank, expression, heat, tags, coverCount);
  const positionText = performers.map(m => `${m.name}:${instLabel(positions[m.id])}`).join(" / ");
  const diagnostics = {
    liveType: liveMeta.label,
    score: { performance:val(performance), expression:val(expression), heat:val(heat), strategy:val(strategy), stability:val(stability), rawTotal:val(rawTotal), total:val(total) },
    venue: { id:venueData.id, prepNeed:venueData.prepNeed, prepScore:val(prepScore), shortage:val(venueShortage), penalty:val(venuePenalty) },
    songs: { originalCount, coverCount, setlistBonus:val(setlistBonus.total), repeatText:repeatInfo.text, rankGuard:rankGuardNote },
    audience: { own:revenue.ownAudience, partner:revenue.partnerAudience, total:revenue.attendees },
    money: { ticketRevenue:revenue.ticketRevenue, bonus:revenue.bonus, cost:revenue.baseCost, supportCost:revenue.supportCost, merchCost:revenue.merch.cost, finalProfit:revenue.finalProfit }
  };

  return { performance, expression, heat, strategy, stability, total, rank, revenue, originalCount, coverCount, adlib: liveArrange, liveArrange, repeatInfo, setlistBonus, coreEvent, supports, merch, venue: venueData, liveType:venue.liveType || "self_one_man", liveTypeLabel: liveMeta.label, invitedBands: invitedBands.map(b=>b.name), invitedBandIds: invitedBands.map(b=>b.id), prepScore, venueShortage, diagnostics, vocalistName: vocalist.name, chorusName: chorusList.length ? chorusList.map(ch => ch.name).join(" / ") : "なし", positions, performers: performers.map(m => m.id), positionText };
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
  if (adlib && !adlib.disabled && adlib.text !== "なし") {
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
  if (instruments.has("piano") || instruments.has("key")) { strategy += 4; }
  if (instruments.has("brass")) { strategy += 5; performance += 2; }
  if (instruments.has("percussion")) { stability += 3; performance += 3; }
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
  const ticket = venue.id === "big_stage" ? 2200 : 1500;
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
  if (bandSystemOn()) {
    recordBandBattlesAfterLive(ev, r);
  }
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
    if (!song) return;
    const slot = idx + 1;
    const baseSong = !song.isCover ? state.songs.find(x => x.id === song.id) : null;
    if (baseSong) {
      const prevTurn = baseSong.lastLiveTurn || 0;
      baseSong.consecutiveLiveUses = prevTurn === state.turn - 1 ? (baseSong.consecutiveLiveUses || 0) + 1 : 1;
      baseSong.lastLiveTurn = state.turn;
      baseSong.lastLiveSlot = slot;
    }
    growSongAfterLive(baseSong || song, r.rank, slot, r.coreEvent);
  });
  registerSetlistAfterLive(setlist, r);
  maybeUnlockProgressSkills("live");
  revealSubGenresAfterLive(r, setlist);
  if (!state.fesInfoKnown && (state.liveCount >= 1 || state.turn >= 12 || b.industry >= 15)) {
    state.fesInfoKnown = true;
    showEventPopup("UNDER FES情報入手", "ライブハウス店長から、選考に必要な最低ラインを聞いた。\nスケジュール帳でフェス条件を確認できるようになった。", "event", v043eIcon("book"));
  }
  activeMembers().filter(m => r.performers.includes(m.id)).forEach(m => growMemberAfterLive(m, r.rank, r.positions[m.id]));
  const exposureBands = invitedBandsForEvent(ev);
  if (exposureBands.length) {
    const exposure = rivalBandExposureBonus(exposureBands) + bandSkillRivalryExposureBonus(r.rank);
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
  addLiveWorldReactionPosts(r, setlist, ev);
  if (["S","A","B"].includes(r.rank) && Math.random() < 0.60) {
    addMail("ライブの感想が届いています", `昨日のライブ、${setlist[0]?.title || "1曲目"}が特に良かったです。
次も観に行きます。

効果：ファンメールにより表現力/認知度が少し伸びました。`, "fan_mail", { sender:"ライブを見たファン" });
    state.band.fame = clamp(state.band.fame + 1, 0, 999);
    activeMembers().forEach(m => m.stats.charisma = clamp(m.stats.charisma + 1, 1, 99));
  }
  if (bandSystemOn()) {
    processBandStoryEvents("postLive");
  }
  state.pendingAfterparty = { rank:r.rank, total:val(r.total), liveType:ev.liveType || "special", invitedBandIds:Array.isArray(ev.invitedBandIds) ? ev.invitedBandIds.slice() : [], title:currentLiveName(), fatigueAfterLive:Math.round(state.band.fatigue || 0), initialAfterparty: (state.liveCount || 0) === 0 };
  const summary = [
    `【${currentLiveName()} 結果】評価:${r.rank} / 総合:${val(r.total)}`,
    `ライブ種別:${r.liveTypeLabel || liveTypeMeta(ev).label} / 演奏${val(r.performance)} 表現${val(r.expression)} 熱量${val(r.heat)} 戦略${val(r.strategy)} 安定${val(r.stability)}`,
    `会場:${r.venue.name} / キャパ${r.venue.capacity} / 準備${val(r.prepScore)}${r.venueShortage > 0 ? `（不足${val(r.venueShortage)}）` : ""}`,
    `配置:${r.positionText}`,
    activeMembers().length > 4 ? `大所帯ボーナス：人数で熱量は上がったが、管理コストと事故リスクも増えた。` : "",
    `Vo:${r.vocalistName} / Cho:${r.chorusName} / オリジナル${r.originalCount}曲・コピー${r.coverCount}曲`,
    `セトリボーナス：${setlistBonusText(r.setlistBonus)}`,
    r.adlib.disabled ? `ライブアレンジ:${r.adlib.disabledReason || "なし"}。` : (r.adlib.text !== "なし" ? `ライブアレンジ:${r.adlib.text}。マンネリや同一曲の不利を一部無視した。` : `ライブアレンジは起きなかった。`),
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
    turn: r.turn || state.turn,
    venueId: r.venueId || "",
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
    adlibDisabledReason: r.adlib.disabledReason || "",
    setlistBonusText: setlistBonusText(r.setlistBonus),
    repeatText: r.repeatInfo?.hasRepeats ? r.repeatInfo.text : "なし",
    mannerWarning: r.mannerWarning || "",
    merchSummary: `${r.revenue.merch.label} / 売上${Number(r.revenue.merch.salesRevenue || 0).toLocaleString()}円 / 買い取り${Number(r.revenue.merch.buybackRevenue || 0).toLocaleString()}円`,
    coreEvent: !!r.coreEvent,
    isFirstLive: (state.liveCount || 0) === 0,
    fanGainBreakdown: v043dFanGainBreakdown(r, currentLiveEvent()),
    gains: r.gains || {},
    songs: setlist.map(s => s.title),
    invitedBandIds: r.invitedBandIds || []
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
  if (s.standardPoints >= 5 && !hasTag(s,"定番")) { s.tags.push("定番"); s.mannerism = 0; log(`${s.title}がライブ定番曲になった。`); showEventPopup("STANDARD SONG!!", `「${s.title}」が定番曲になった！\nライブでの成功が積み重なり、マンネリ化しにくくなる。`, "rare", v043eIcon("fame")); }
  if (hasTag(s, "定番")) s.mannerism = 0;
  if ((s.recognition >= 50 && s.standardPoints >= 5 && (s.lyrics >= 60 || s.catchy >= 60)) && !hasTag(s,"代表曲候補")) { s.tags.push("代表曲候補"); log(`${s.title}が代表曲候補になった。`); }
}

function growMemberAfterLive(m, rank, role) {
  normalizeMemberGrowthType(m);
  const gain = { S:3, A:2, B:1, C:1, D:0, E:0 }[rank] || 0;
  applyMemberStatGrowth(m, "mental", gain, "live");
  applyMemberStatGrowth(m, "charisma", (rank === "S" ? 2 : rank === "A" ? 1 : 0), "live");
  if (["S", "A", "B"].includes(rank)) maybeApplyFocusedGrowth(m, "live", rank === "S" ? 2 : 1, rank === "S" ? 0.70 : 0.55);
  const roles = positionInstrumentParts(role).filter(x => x !== "vocal" || role === "vocal" || role === "guitar_vocal" || role === "bass_vocal");
  const targets = roles.length ? roles : [m.mainInstrument];
  targets.forEach(r => {
    const inst = m.instruments[r] || m.instruments[m.mainInstrument];
    if (inst) inst.lv = clamp(inst.lv + gain * (inst.growth || 1) * memberGrowthCurveMultiplier(m, "live"), 1, inst.potentialCap || inst.cap);
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
  const minimum = final && ["A","S"].includes(final.rank) && (Number(final.total) || 0) >= 80 && b.fans >= 180 && b.fame >= 135 && b.industry >= 118 && originals >= 7 && repCount >= 3 && freshCount >= 1;
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

// v0.4.1e Phase 1: mobile profile shell and compact home timeline overrides.
function renderGlobalPhoneButton(liveMode=false) {
  if (liveMode || state.view === "home") return "";
  const unread = unreadMailCount();
  const active = state.view === "phone";
  return `<button class="globalPhoneBtn global-phone-btn ${active ? "active" : ""}" title="携帯を開く"><span class="global-phone-icon">▪︎</span><b>携帯</b>${unread ? `<em>${unread}</em>` : ""}</button>`;
}

function renderHomeScheduleStrip() {
  const max = Number(state.maxTurn || 50);
  const base = Number(state.turn || 1);
  const items = Array.from({ length: max }, (_, i) => i + 1).map(turn => {
    const live = (state.liveEvents || []).find(e => !e.cancelled && Number(e.turn) === turn);
    const isNow = turn === base;
    const isFes = turn === 30 || turn === 50;
    const note = live ? (live.fixed ? "固定" : liveTypeMeta(live).short) : (turn === 30 ? "UNDER" : turn === 50 ? "GRAND" : "準備");
    const icon = live ? "♪︎" : isFes ? "★︎" : "・";
    const cls = `${turn < base ? "done" : ""} ${isNow ? "now" : ""} ${live ? "live" : ""} ${isFes ? "fes" : ""}`;
    return `<button class="jumpTabBtn mini-turn-chip turn-cell ${cls}" data-view="schedule" data-turn="${turn}"><b>${icon} T${turn}</b><small>${escapeHtml(note)}</small></button>`;
  });
  return `<div class="card home-schedule-strip v041-home-schedule" aria-label="週の流れ"><div class="section-title"><h2>週の流れ</h2><span class="badge">${base}ターン / ${max}ターン</span></div><div class="mini-turn-row schedule-scroll">${items.join("")}</div></div>`;
}

function renderTopStats() {
  const b = state.band || {};
  const unread = unreadMailCount();
  const next = state.nextLiveTurn ? `${currentLiveName()}まで${turnsUntilNextLive()}T` : nextMilestoneLabel();
  const main = [
    { k:"ターン", label:`T${state.turn || 1}/${state.maxTurn || 50}` },
    { k:"資金", label:`¥${shortMoney(b.funds)}`, alert:b.funds < 0 },
    { k:"ファン", label:`${Math.round(b.fans || 0)}人` },
    { k:"疲労", label:`${Math.round(b.fatigue || 0)}%`, alert:b.fatigue > 80 }
  ];
  const sub = [
    `次：${next}`,
    `知名度 ${Math.round(b.fame || 0)}`,
    `集客力 ${displayAudiencePower(b)}`,
    `業界評価 ${Math.round(b.industry || 0)}`
  ];
  return `<div class="success-dashboard compact-dashboard l0-dashboard v041-status-board"><div class="v041-top-row"><div class="v041-profile-names"><b>${escapeHtml(b.name || "名無しの地下バンド")}</b><small>${escapeHtml(state.player?.name || "主人公")}</small></div><button class="globalPhoneBtn global-phone-btn home-phone-btn ${state.view === "phone" ? "active" : ""}" title="携帯を開く"><span class="global-phone-icon">▪︎</span>${unread ? `<em>${unread}</em>` : ""}</button></div><div class="compact-stat-strip slim-stats l0-stat-strip v041-status-main">${main.map(x=>`<div class="stat success-stat compact-stat ${x.alert ? "danger-stat" : ""}"><span>${x.k}</span><b>${x.label}</b></div>`).join("")}</div><div class="v041-status-sub">${sub.map(x=>`<span>${escapeHtml(x)}</span>`).join("")}</div></div>`;
}

function profileAccount() {
  if (!state.account || typeof state.account !== "object") state.account = {};
  const band = state.band?.name || "名無しの地下バンド";
  const slug = safeProfileSlug(band || "bandname");
  state.account.email = state.account.email || `${slug}@under-mail.jp`;
  state.account.snsDisplayName = state.account.snsDisplayName || band;
  state.account.snsUserName = state.account.snsUserName || `@${slug}`;
  return state.account;
}

function safeProfileSlug(text) {
  const raw = String(text || "bandname").normalize("NFKD").replace(/[^\w]+/g, "").toLowerCase();
  return (raw || "bandname").slice(0, 20);
}

function cleanProfileInput(value, fallback="", max=24) {
  return String(value || "").trim().replace(/[\r\n\t<>]/g, "").slice(0, max) || fallback;
}

function snsUnreadCount() {
  const seen = Number(state.snsLastSeenCount || 0);
  return Math.max(0, (state.snsPosts || []).length - seen);
}

function phoneNotificationCounts() {
  const mail = unreadMailCount();
  const sns = snsUnreadCount();
  return { mail, sns, contacts: 0, total: mail + sns };
}

function renderPhoneScreen() {
  const mode = state.phoneSubView || "menu";
  if (mode === "mail") return renderMailScreen();
  if (mode === "sns") { state.snsLastSeenCount = (state.snsPosts || []).length; return renderSnsScreen(); }
  if (mode === "account") return renderAccountSettingsScreen();
  if (mode === "bandbook") return renderPhoneBandBookScreen();
  const counts = phoneNotificationCounts();
  const badge = n => n ? `<em class="nav-badge">${n}</em>` : "";
  return `<div class="phone-screen grid phone-menu-screen">
    ${renderPhoneActionRequiredSection()}
    <div class="card phone-card phone-launch-card">
      <div class="section-title"><h2>携帯</h2><span class="badge ${counts.total ? "warn" : "good"}">${counts.total ? counts.total + "件" : "通知なし"}</span></div>
      <div class="phone-app-grid">
        <button class="phoneModeBtn phone-app-btn" data-phone-mode="mail"><span>✉︎</span><b>メール</b>${badge(counts.mail)}<small>出演依頼と連絡</small></button>
        <button class="phoneModeBtn phone-app-btn" data-phone-mode="sns"><span>#</span><b>SNS</b>${badge(counts.sns)}<small>タイムライン</small></button>
        <button class="phoneModeBtn phone-app-btn" data-phone-mode="bandbook"><span>☰︎</span><b>バンド図鑑</b><small>交流記録</small></button>
        <button class="phoneModeBtn phone-app-btn" data-phone-mode="account"><span>⚙︎</span><b>アカウント設定</b><small>名前と表示</small></button>
      </div>
    </div>
    <div class="card phone-card">
      <div class="section-title"><h2>次の予定</h2><span class="badge">ライブ予定</span></div>
      ${(state.liveEvents || []).find(e => !e.cancelled && e.turn >= state.turn) ? renderPhoneLiveSummary((state.liveEvents || []).find(e => !e.cancelled && e.turn >= state.turn)) : `<div class="empty-panel">今後のライブ予定なし。</div>`}
    </div>
  </div>`;
}

/* PR-F: バンド文脈のハッシュ振り分けを廃止するための直接色参照。非バンド差出人（店長・機材レンタル等）専用として
   bandColorIndexFromName()自体は存置（全廃しない）。sil_xxxのNPCはBAND_DATABASEのrepresentativeNameと一致する
   ものだけをバンドに紐付ける（既存データ棚卸しで確認済みの13名。スバル/店長/主人公等はバンド非紐付けのまま） */
const NPC_BAND_MAP = Object.freeze({
  sil_takanashi: "triple_arrows", sil_nakiri: "carbons", sil_clio: "shelter",
  sil_mike: "pachi_pachi", sil_mozu: "kiwi", sil_daidoji: "magnet_wolf",
  sil_hail: "polaris", sil_kaede: "kaede", sil_largo: "lact", sil_nasu: "in_bab",
  sil_araka: "jack_bomb", sil_waraji: "ultimate_quokkas", sil_yamamoto: "hyper_marmoty"
});
function bandColorIndexFromName(name) {
  const s = String(name || "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 22;
}
/* バンド色が解決できればtag-color-band（実色）を、できなければ従来のハッシュtag-color-cNを返す */
function bandColorAttrs(bandId, fallbackLabel) {
  const band = bandId ? BAND_DATABASE[bandId] : null;
  if (band && band.color) return { style: ` style="--band-tag-color:${band.color};"`, cls: "tag-color-band" };
  return { style: "", cls: `tag-color-c${bandColorIndexFromName(fallbackLabel)}` };
}
/* fix5 #8: メール差出人→バンドID解決の一本化。payload.senderBandIdが無い場合（PR-F以前に作られた
   旧セーブのメール等）でも、差出人文字列をバンド名・kana・representativeName・「バンド名＋代表者名」の
   複合署名まで網羅照合して解決する。非バンド差出人（運営・機材・ファン等）はnullを返し従来ハッシュへ委ねる。 */
function resolveSenderBandId(mail) {
  const explicit = mail?.payload?.senderBandId;
  if (explicit && BAND_DATABASE[explicit]) return explicit;
  const sender = String(mail?.sender || mail?.payload?.sender || "").trim();
  if (!sender) return null;
  for (const band of Object.values(BAND_DATABASE)) {
    if (sender === band.name || sender === band.kana) return band.id;
    if (band.representativeName && sender === band.representativeName) return band.id;
    const boundary = sender.slice(band.name.length, band.name.length + 1);
    if (sender.startsWith(band.name) && (boundary === "" || /[\s　]/.test(boundary))) return band.id;
  }
  return null;
}
/* PR-F: 22ロゴのワードマークをCSS作字で共通レンダリング（BAND_IDENTITY_v1.md準拠、画像アセット不要） */
function renderBandWordmark(bandOrId, size="md") {
  const band = typeof bandOrId === "string" ? BAND_DATABASE[bandOrId] : bandOrId;
  if (!band) return "";
  const style = band.markStyle && ["A","B","C"].includes(band.markStyle) ? band.markStyle : "B";
  return `<span class="band-wordmark wm-style-${style} wm-${size}" style="--band-tag-color:${escapeHtml(band.color || "var(--dim)")};">${escapeHtml(band.name)}</span>`;
}
function renderMailRow(m) {
  const kind = m.kind || "info";
  const needsReply = isActionableMail(m);
  const preview = firstLine(m.body || "").slice(0, 58);
  const senderLabel = m.sender || mailSenderForKind(kind);
  const bandAttrs = bandColorAttrs(resolveSenderBandId(m), senderLabel);
  return `<button class="mail-row mailOpenBtn mail-row-enhanced gmail-row ${kind} ${m.read ? "read" : "unread"} ${bandAttrs.cls}" data-mail-id="${escapeHtml(m.id)}"${bandAttrs.style}>
    <span class="mail-sender-icon">${mailSenderIcon(kind)}</span>
    <span class="mail-row-main"><b>${escapeHtml(senderLabel)}</b><strong>${m.read ? "" : "● "}${escapeHtml(m.subject || "無題")}</strong><small>${escapeHtml(preview)}</small></span>
    <span class="mail-kind-chip">${needsReply ? "要返信" : mailKindLabel(kind)}</span>
    <em>${m.turn || "?"}T</em>
  </button>`;
}

function renderMailDetail(m) {
  const acc = profileAccount();
  const offerId = m.payload?.offerId;
  const offer = offerId ? (state.liveOffers || []).find(o => o.id === offerId) : null;
  if (offer) updateLiveOfferStatuses();
  const canAccept = offer && !offer.accepted && !offer.expired && (offer.storyInvite || canBookLiveTurn(offer.turn)) && !liveEventForTurn(offer.turn);
  const senderBandId = resolveSenderBandId(m);
  const senderBand = senderBandId ? BAND_DATABASE[senderBandId] : null;
  return `<div class="mail-detail gmail-detail">
    <div class="section-title"><h2>${escapeHtml(m.subject || "無題")}</h2><span class="badge ${m.read ? "good" : "warn"}">${m.read ? "既読" : "未読"}</span></div>
    <div class="mail-meta"><b>差出人</b><span>${escapeHtml(m.sender || mailSenderForKind(m.kind))}</span><b>宛先</b><span>${escapeHtml(acc.email)}</span><b>時刻</b><span>${m.turn || "?"}T</span>${senderBand ? `<b>バンド</b><span>${renderBandWordmark(senderBand, "sm")}</span>` : ""}</div>
    <p>${escapeHtml(m.body || "").replace(/\n/g,"<br>")}</p>
    ${offer ? renderOfferActionsFromMail(offer, canAccept) : renderMailActionsWithoutOffer(m)}
  </div>`;
}

function renderSnsPost(p) {
  const acc = profileAccount();
  const self = (p.author || "") === "@our_band";
  const author = self ? acc.snsUserName : (p.author || "@unknown");
  const display = self ? acc.snsDisplayName : author.replace(/^@/, "");
  const reactions = Math.max(0, Math.round((p.reactions || 0) + (p.turn || 1) % 7 + (p.mood === "reaction" ? 12 : 3)));
  const avatarBand = !self && p.bandId ? BAND_DATABASE[p.bandId] : null;
  const avatarAttrs = avatarBand && avatarBand.color ? ` style="--band-tag-color:${avatarBand.color};"` : "";
  return `<article class="sns-post tweet-card ${escapeHtml(p.mood || "normal")}"><div class="sns-avatar ${avatarBand ? "tag-color-band" : ""}"${avatarAttrs}>${escapeHtml(display.slice(0, 1).toUpperCase())}</div><div class="sns-body"><header><b>${escapeHtml(display)}</b><span>${escapeHtml(author)}</span><em>${p.turn || "?"}T</em></header><p>${escapeHtml(p.body || "")}</p><footer><span>#underground</span><span>↻︎ ${Math.floor(reactions / 3)}</span><span>♡︎ ${reactions}</span></footer></div></article>`;
}

function renderAccountSettingsScreen() {
  const acc = profileAccount();
  return `<div class="phone-screen grid account-screen">
    <div class="card phone-card wide-card">
      <div class="section-title"><h2>アカウント設定</h2><span class="badge">表示用</span></div>
      <button class="phoneModeBtn ghost-btn" data-phone-mode="menu">←︎ 携帯メニュー</button>
      <div class="account-form">
        <label>主人公名<input id="accountPlayerName" maxlength="24" value="${escapeHtml(state.player?.name || "")}" /></label>
        <label>バンド名<input id="accountBandName" maxlength="28" value="${escapeHtml(state.band?.name || "")}" /></label>
        <label>メールアドレス<input id="accountEmail" maxlength="40" value="${escapeHtml(acc.email)}" /></label>
        <label>SNS表示名<input id="accountSnsDisplayName" maxlength="28" value="${escapeHtml(acc.snsDisplayName)}" /></label>
        <label>SNSユーザー名<input id="accountSnsUserName" maxlength="24" value="${escapeHtml(acc.snsUserName)}" /></label>
      </div>
      <div class="modal-actions"><button id="saveAccountSettingsBtn" class="big-action">保存</button></div>
      <small>ゲーム計算には影響しません。メール、SNS、ホーム表示に使います。</small>
    </div>
  </div>`;
}

const bindEvents_v041e_base = bindEvents;
bindEvents = function bindEvents_v041e() {
  bindEvents_v041e_base();
  const saveAccountBtn = document.getElementById("saveAccountSettingsBtn");
  if (saveAccountBtn) saveAccountBtn.addEventListener("click", () => {
    const playerName = cleanProfileInput(document.getElementById("accountPlayerName")?.value, "", 24);
    const bandName = cleanProfileInput(document.getElementById("accountBandName")?.value, "", 28);
    const email = cleanProfileInput(document.getElementById("accountEmail")?.value, "", 40);
    const snsDisplayName = cleanProfileInput(document.getElementById("accountSnsDisplayName")?.value, "", 28);
    let snsUserName = cleanProfileInput(document.getElementById("accountSnsUserName")?.value, "", 24);
    if (!playerName || !bandName || !email || !snsDisplayName || !snsUserName) { alert("空欄は保存できません。"); return; }
    snsUserName = "@" + snsUserName.replace(/^@+/, "").replace(/[^\w_]/g, "").slice(0, 20);
    if (snsUserName === "@") snsUserName = `@${safeProfileSlug(bandName)}`;
    state.player.name = playerName;
    state.band.name = bandName;
    state.account = { email, snsDisplayName, snsUserName };
    state.saveNotice = "アカウント設定を保存しました。";
    log("アカウント設定を更新した。", "event");
    render();
  });
};

// Compatibility helpers carried forward from the previous fix release.
function displayAudiencePower(b=state.band || {}) {
  const fans = Number(b.fans || 0);
  const fame = Number(b.fame || 0);
  const last = (state.liveResultHistory || [])[state.liveResultHistory.length - 1] || null;
  const recentAudience = Number(last?.revenue?.attendees || last?.attendees || 0);
  return Math.max(0, Math.round(fans * 0.35 + fame * 0.5 + recentAudience * 0.15));
}

function renderTopStats() {
  const b = state.band || {};
  const unread = unreadMailCount();
  const next = state.nextLiveTurn ? `${currentLiveName()}まで${turnsUntilNextLive()}T` : nextMilestoneLabel();
  const main = [
    { k:"ターン", label:`T${state.turn || 1}/${state.maxTurn || 50}` },
    { k:"資金", label:`¥${shortMoney(b.funds)}`, alert:b.funds < 0 },
    { k:"ファン", label:`${Math.round(b.fans || 0)}人` },
    { k:"疲労", label:`${Math.round(b.fatigue || 0)}%`, alert:b.fatigue > 80 }
  ];
  const sub = [
    `次：${next}`,
    `知名度 ${Math.round(b.fame || 0)}`,
    `集客力 ${displayAudiencePower(b)}`,
    `業界評価 ${Math.round(b.industry || 0)}`
  ];
  return `<div class="success-dashboard compact-dashboard l0-dashboard v041-status-board"><div class="v041-top-row"><div class="v041-profile-names"><b>${escapeHtml(b.name || "名無しの地下バンド")}</b><small>${escapeHtml(state.player?.name || "主人公")}</small></div><button class="globalPhoneBtn global-phone-btn home-phone-btn ${state.view === "phone" ? "active" : ""}" title="携帯を開く"><span class="global-phone-icon">▪︎</span>${unread ? `<em>${unread}</em>` : ""}</button></div><div class="compact-stat-strip slim-stats l0-stat-strip v041-status-main">${main.map(x=>`<div class="stat success-stat compact-stat ${x.alert ? "danger-stat" : ""}"><span>${x.k}</span><b>${x.label}</b></div>`).join("")}</div><div class="v041-status-sub">${sub.map(x=>`<span>${escapeHtml(x)}</span>`).join("")}</div></div>`;
}

function renderIntroScreen() {
  const step = clamp(Number(state.openingStep || 0), 0, 7);
  const storedHeroName = state.player?.name || "";
  const heroName = state.pendingPlayerName || (storedHeroName === "あなた" ? "" : storedHeroName);
  const bandName = state.pendingBandName || state.band?.name || "";
  const lines = [
    { speaker:"タカナシ", text:"「見慣れない顔だな。バンドに興味あるの？」" },
    { speaker:"主人公", text:"「あ、はい！バンドがしたくて」" },
    { speaker:"タカナシ", text:"「ふーん、ここのライブハウスはいいところなんだ。バンド始めるならここからスタートするのがいいと思うぜ。」" },
    { speaker:"主人公", text:"「そうなんですか、ここから…」" }
  ];
  const visibleLines = step <= 3 ? lines.slice(0, step + 1) : lines;
  const poster = step >= 4 ? `<div class="poster-card opening-poster">
        <div class="poster-noise"></div>
        <span class="poster-kicker">UNDER FES POSTER</span>
        <h1>UNDER<br>FES</h1>
        <p>地下から、名前を鳴らせ。</p>
        <b>ENTRY WANTED</b>
      </div>` : "";
  const afterPoster = step >= 5 && step <= 5 ? `<p><b>タカナシ：</b>${escapeHtml("「ま、がんばれよ。えっと……」")}</p>` : "";
  const input = step <= 5
    ? `<button id="openingNextBtn" class="big-action">${step === 3 ? "ポスターを見る" : "次へ"}</button>`
    : step === 6
      ? `<div class="opening-input"><b>タカナシ（名前はなんていうんだ…？）</b><input id="openingPlayerNameInput" class="wide-input" maxlength="24" placeholder="主人公名" value="${escapeHtml(heroName)}" /><button id="openingPlayerNameBtn" class="big-action">決定</button></div>`
      : `<div class="opening-input"><p><b>タカナシ：</b>${escapeHtml(`「${heroName || "○○"}か、バンド名は決めてんのか？」`)}</p><b>バンド名は？</b><input id="openingBandNameInput" class="wide-input" maxlength="28" placeholder="バンド名" value="${escapeHtml(bandName)}" /><button id="openingBandNameBtn" class="big-action">決定</button></div>`;
  app.innerHTML = `
    <div class="intro-screen opening-v041e opening-v041e-fix1">
      ${poster}
      <div class="intro-copy opening-dialogue">
        ${visibleLines.map(l => `<p><b>${l.speaker}：</b>${escapeHtml(l.text)}</p>`).join("")}
        ${afterPoster}
        ${input}
      </div>
    </div>
  `;
  document.getElementById("openingNextBtn")?.addEventListener("click", () => { state.openingStep = Math.min(6, step + 1); render(); });
  document.getElementById("openingPlayerNameBtn")?.addEventListener("click", () => {
    const name = cleanProfileInput(document.getElementById("openingPlayerNameInput")?.value, "", 24);
    if (!name) { alert("主人公名を入力してください。"); return; }
    state.pendingPlayerName = name;
    if (state.player) state.player.name = name;
    state.openingStep = 7;
    render();
  });
  document.getElementById("openingBandNameBtn")?.addEventListener("click", () => {
    const name = cleanProfileInput(document.getElementById("openingBandNameInput")?.value, "", 28);
    if (!name) { alert("バンド名を入力してください。"); return; }
    state.pendingBandName = name;
    if (state.band) state.band.name = name;
    const acc = profileAccount();
    acc.snsDisplayName = acc.snsDisplayName || name;
    acc.snsUserName = acc.snsUserName || `@${safeProfileSlug(name)}`;
    acc.email = acc.email || `${safeProfileSlug(name)}@under-mail.jp`;
    state.introSeen = true;
    state.openingStep = 8;
    state.tutorialStage = "needSong";
    state.activePopup = { title:"活動開始", body:`タカナシ：\n「${name}か、覚えとくよ。」`, type:"event", icon:v043eIcon("band") };
    saveGame(false);
    render();
  });
}

// v0.4.3a-ux-foundation-draft: root separation and UX foundation layer.
function v042BandNameReady() {
  const name = String(state?.band?.name || "").trim();
  return !!(name && name !== "未定") || !!state.bandNameFinalized;
}

function v042NotificationCounts() {
  const counts = phoneNotificationCounts ? phoneNotificationCounts() : { mail: unreadMailCount(), sns: snsUnreadCount ? snsUnreadCount() : 0, total: unreadMailCount() };
  counts.shop = 0;
  counts.bandbook = 0;
  counts.option = 0;
  counts.total = (counts.mail || 0) + (counts.sns || 0);
  return counts;
}

function v042FormatMoney(n) {
  const value = Number(n || 0);
  const sign = value < 0 ? "-" : "";
  return `${sign}¥${Math.abs(Math.round(value)).toLocaleString()}`;
}

function renderTopStats() {
  return "";
}

function renderGlobalPhoneButton() {
  return "";
}

function v043bHomeCommandItems() {
  return [
    ["practice", "練習", "演奏を上げる", "practice"],
    ["rest", "休憩", "疲労を下げる", "rest"],
    ["parttime", "バイト", "資金を稼ぐ", "parttime"],
    ["recruit", "募集", "仲間候補", "recruit"],
    ["promo", "宣伝", "知名度を上げる", "promo"],
    ["talk", "会話", "信頼と気づき", "talk"]
  ];
}

function v043bHomeParentViews() {
  return ["home", "songs", "log", "command"];
}

function v043bNormalizeNavigationState() {
  if (!state) return;
  if (state.view === "command") state.view = "home";
}

function v043bShellClass(liveMode=false, phoneDuringLive=false) {
  const parent = parentViewForNav(state?.view || "home");
  const parts = ["app-shell", "app-shell-v041a", "v043b-shell", `v043b-shell-${parent}`];
  if ((state?.view || "home") === "home" && !liveMode) parts.push("v043b-shell-compact-home");
  if (liveMode) parts.push("v043b-shell-live");
  if (phoneDuringLive || state?.view === "phone") parts.push("v043b-shell-phone");
  return parts.join(" ");
}

function v043bClearHomeCommandSelection() {
  v043aClearSelection("home-command");
}

function v043bSyncHomeCommandSelection(liveMode=false, phoneDuringLive=false) {
  if (!state) return;
  const view = state.view || "home";
  const keep = uiMode === "game" && view === "home" && !liveMode && !phoneDuringLive && !v043aHasPriorityOverlay();
  if (!keep) v043bClearHomeCommandSelection();
}

function v043bSelectedHomeCommand() {
  return v043aGetSelection("home-command");
}

function v043bCommandPreview(command) {
  const label = commandLabel(command);
  const previews = {
    practice: "演奏力が伸びる。疲労は少し増える",
    rest: "疲労を回復する。ターンは進む",
    parttime: "資金を稼ぐ。疲労は少し増える",
    recruit: "加入候補を探す。費用がかかる",
    promo: "知名度と反応を伸ばす",
    talk: "信頼と気づきを得る"
  };
  return `${label}: ${previews[command] || "この行動を実行"}。もう一度タップで実行`;
}

function v043bNextEventSummary() {
  const next = (state.liveEvents || []).filter(e => !e.cancelled && e.turn >= state.turn).sort((a,b)=>a.turn-b.turn)[0];
  if (!next) return { title:"次のライブなし", note:"予定でライブを探す", badge:"予定なし", turn:null, event:null };
  const remain = Math.max(0, Number(next.turn) - Number(state.turn || 1));
  const meta = liveTypeMeta(next);
  const eventName = String(next.label || next.name || meta.label || meta.short || "ライブ").trim();
  const replyNote = v043cIsFirstLiveEvent(next) ? ` / ${v043cFirstLiveReplyStatus().homeText}` : "";
  return { title:`T${next.turn} ${eventName}`, note:`${remain <= 0 ? "今日のライブ" : `あと${remain}ターン`}${replyNote}`, badge:remain <= 1 ? "直前" : `${remain}T`, turn:next.turn, event:next };
}

function v043bHomeContextMessage() {
  const importantMail = v043cImportantMailTarget();
  if (importantMail) {
    if (v043cT4FirstLiveReplyGate()) return "初ライブへの返事がまだです。メールを確認してください。";
    return "初ライブへの出演依頼が届いています。メールを確認してください。";
  }
  const selected = v043bSelectedHomeCommand();
  if (selected) return v043bCommandPreview(selected);
  const tutorialMessage = v043dTutorialHomeMessage();
  if (tutorialMessage) return tutorialMessage;
  if (typeof hasPendingSongFinalize === "function" && hasPendingSongFinalize()) return "未完成の曲がある。作詞・作曲から仕上げよう";
  if (isLiveTurn()) return "今日はライブ本番。予定から準備を確認しよう";
  const next = v043bNextEventSummary();
  if (next.turn) return `${next.title}まで ${next.badge}${v043cIsFirstLiveEvent(next.event) ? ` / ${v043cFirstLiveReplyStatus().homeText}` : ""}`;
  return "行動を選ぶと詳細を確認。同じ行動をもう一度タップで実行";
}

function v043bHandleHomeCommandTap(command) {
  if (!command || v042CommandDisabledReason(command)) return;
  const result = v043aSelectOrConfirm("home-command", command);
  if (result.confirmed) {
    v043bClearHomeCommandSelection();
    handleCommandClick(command);
    return;
  }
  render();
}

function parentViewForNav(view) {
  const v = view || "home";
  if (v043bHomeParentViews().includes(v)) return "home";
  if (["fes"].includes(v)) return "schedule";
  if (["shop", "library", "dev", "playerSkills"].includes(v)) return "band";
  if (["bandbook"].includes(v)) return "band";
  if (["log"].includes(v)) return "home";
  if (["phone"].includes(v)) return "home";
  return v;
}

function renderNav(liveMode=false) {
  if (!liveMode && ["home", "phone"].includes(state.view || "home")) return "";
  const tabs = [
    ["home", "ホーム", "home"],
    ["schedule", "予定", "calendar"],
    ["band", "バンド", "band"]
  ];
  const activeParent = parentViewForNav(state.view);
  return `<nav class="tabbar v042-tabbar ${liveMode ? "live-lock" : ""}" aria-label="下部メニュー">
    ${tabs.map(([id,label,icon]) => `<button class="tabBtn v042-tab ${activeParent === id ? "active" : ""}" data-view="${id}" ${liveMode ? "disabled" : ""}><span>${v043eIcon(icon)}</span><b>${label}</b></button>`).join("")}
  </nav>`;
}

function renderMainContent() {
  if ((state.view || "home") === "phone") {
    return `<main class="view-panel v042-view-panel phone-open" data-view="phone">${renderHomeScreen()}</main>${renderPhoneScreen()}`;
  }
  if (state.view === "command") state.view = "home";
  let html;
  if (state.view === "band") html = renderBandScreen();
  else if (state.view === "playerSkills") html = renderPlayerSkillListScreen();
  else if (state.view === "songs") html = renderSongsScreen();
  else if (state.view === "schedule") html = renderScheduleScreen();
  else if (state.view === "fes") html = renderFesDetailScreen();
  else if (state.view === "shop") html = renderShopScreen();
  else if (state.view === "log") html = renderLogScreen();
  else if (state.view === "library") html = renderLibraryScreen();
  else if (state.view === "bandbook") html = renderBandBookScreen();
  else if (state.view === "dev") html = renderDevScreen();
  else html = renderHomeScreen();
  const homeBack = (state.view || "home") !== "home" ? `<button class="jumpTabBtn page-home-btn v042-page-home" data-view="home">←︎ ホームへ</button>` : "";
  return `<main class="view-panel v042-view-panel" data-view="${state.view || "home"}">${homeBack}${html}</main>`;
}

function renderHomeScreen() {
  return `<div class="v042-home v043b-home" aria-label="ホーム">
    ${renderHomeTopBarV042()}
    ${renderTurnRailV042()}
    ${renderHomeContextBarV043b()}
    <section class="v042-home-grid">
      <aside class="v042-action-column" aria-label="行動">${renderHomeActionButtonsV042()}</aside>
      <section class="v042-info-column" aria-label="主要情報">
        ${renderSongcraftBlockV042()}
        ${renderHomeIllustrationV042()}
        ${renderHomeStatusGridV042()}
        <button class="jumpTabBtn v042-band-manage" data-view="band"><span>${v043eIcon("band")}</span><b>バンド管理</b><small>主人公・メンバー・スキル</small></button>
      </section>
    </section>
  </div>`;
}

function renderHomeTopBarV042() {
  const b = state.band || {};
  const counts = v042NotificationCounts();
  const dev = devModeOn() ? `<button class="jumpTabBtn v042-admin-btn dev" data-view="dev">DEV</button>` : "";
  return `<header class="v042-home-top">
    <div class="v042-profile-block"><b>${escapeHtml(b.name || "未定のバンド")}</b><span>${escapeHtml(state.player?.name || "主人公")}</span></div>
    <details class="v043b-utility-menu"><summary aria-label="ユーティリティ">${v043eIcon("more")}</summary><div class="v043b-utility-popover">
      <button id="saveBtn" class="v042-admin-btn">セーブ</button>
      <button id="loadBtn" class="v042-admin-btn">ロード</button>
      <button id="refreshAppBtn" class="v042-admin-btn">最新版</button>
      <button id="titleBtn" class="v042-admin-btn">タイトルへ</button>
      ${dev}
    </div></details>
    <button class="globalPhoneBtn v042-home-phone" title="携帯を開く"><span>${v043eIcon("phone")}</span>${counts.total ? `<em>${counts.total}</em>` : ""}</button>
  </header>`;
}

function renderHomeContextBarV043b() {
  const target = v043cImportantMailTarget();
  if (v043cT4FirstLiveReplyGate()) v043bClearHomeCommandSelection();
  const selected = v043bSelectedHomeCommand();
  const cls = target ? "important" : (selected ? "selected" : "idle");
  const mailAction = target ? `<em class="v043c-context-action-label">メールを開く</em><button class="v043cOpenFirstLiveMailBtn v043c-context-hit" data-mail-id="${escapeHtml(target.id)}" aria-label="メールを開く"></button>` : "";
  return `<section class="v043b-context-bar ${cls}" aria-live="polite"><span>${target ? "要返信" : (selected ? "選択中" : "ガイド")}</span><b>${escapeHtml(v043bHomeContextMessage())}</b>${mailAction}</section>`;
}

function renderTurnRailV042() {
  const max = Number(state.maxTurn || 50);
  const now = Number(state.turn || 1);
  const cells = Array.from({ length: max }, (_, i) => i + 1).map(turn => {
    const ev = (state.liveEvents || []).find(e => !e.cancelled && Number(e.turn) === turn);
    const isFes = turn === 30 || turn === 50;
    const cls = `${turn < now ? "done" : ""} ${turn === now ? "now" : ""} ${ev ? "live" : ""} ${isFes ? "fes" : ""}`;
    const note = ev ? (isFes ? (turn === 30 ? "UNDER" : "GRAND") : liveTypeMeta(ev).short) : (isFes ? (turn === 30 ? "UNDER" : "GRAND") : "準備");
    return `<button class="jumpTabBtn turn-cell v042-turn ${cls}" data-view="schedule" data-turn="${turn}"><b>T${turn}</b><small>${escapeHtml(note)}</small></button>`;
  }).join("");
  return `<section class="v042-turn-board" aria-label="ターン表示">
    <div class="v042-turn-head"><b>ターン</b><span>${now}ターン / ${max}ターン</span></div>
    <div class="schedule-scroll v042-turn-scroll">${cells}</div>
  </section>`;
}

function v042CommandDisabledReason(id) {
  if (v043cT4FirstLiveReplyGate()) return "初ライブへの返事がまだ";
  if (mustCompleteFirstDraftTutorial()) return "未完成曲を先に完成";
  if (state.tutorialStage === "needSong") return "先に作詞・作曲";
  const need = tutorialRequiredCommandForTurn();
  if (need && need !== id) return `${commandLabel(need)}を試す流れ`;
  if (state.hangoverTurn === state.turn && id !== "rest") return "二日酔い中は休憩のみ";
  if ((state.band?.fatigue || 0) >= 100 && id !== "rest") return "疲労限界。休憩が必要";
  return "";
}

function renderHomeActionButtonsV042() {
  const selected = v043bSelectedHomeCommand();
  return v043bHomeCommandItems().map(([id,label,note,icon]) => {
    const reason = v042CommandDisabledReason(id);
    const active = selected === id;
    const hint = reason || (active ? "もう一度タップで実行" : note);
    return `<button class="v043b-action-btn v042-action-btn ${active ? "selected" : ""} ${reason ? "disabled" : ""}" data-command="${id}" aria-pressed="${active ? "true" : "false"}" ${reason ? "disabled" : ""} title="${escapeHtml(hint)}"><span>${v043eIcon(icon)}</span><b>${label}</b><small>${escapeHtml(hint)}</small>${active ? `<em>${v043eIcon("check")}</em>` : ""}</button>`;
  }).join("");
}

function renderSongcraftBlockV042() {
  const s = songcraftHomeStatus();
  const locked = !mustCompleteFirstDraftTutorial() && (state.tutorialStage === "needCommand" || state.scheduleTutorialStage === "needSchedule");
  const note = locked ? (state.scheduleTutorialStage === "needSchedule" ? "先に予定を確認" : "次は行動を選ぶ") : s.note;
  return `<button class="openSongEditorBtn v042-songcraft ${locked ? "disabled" : ""}" ${locked ? "disabled" : ""}><span>${v043eIcon("song")}</span><b>作詞・作曲</b><small>${escapeHtml(note)}</small><em>${escapeHtml(s.badge)}</em></button>`;
}

function renderPlanBlockV042() {
  const next = (state.liveEvents || []).filter(e => !e.cancelled && e.turn >= state.turn).sort((a,b)=>a.turn-b.turn)[0];
  const remain = next ? Math.max(0, Number(next.turn) - Number(state.turn || 1)) : 0;
  return `<button class="jumpTabBtn v042-plan" data-view="schedule"><span>■︎</span><b>予定</b><small>${next ? `${next.turn}T / あと${remain}T` : "予定なし"}</small></button>`;
}

function renderHomeIllustrationV042() {
  const recent = (state.members || [])[state.members.length - 1] || state.player;
  const memberNames = activeMembers().map(m => m.name).filter(Boolean).slice(0, 4).join(" / ");
  const bandbookCount = bandDiscoveredCount ? bandDiscoveredCount() : 0;
  const next = v043bNextEventSummary();
  return `<article class="v042-illustration v043b-visual-card" aria-label="挿絵と次予定">
    <button class="v043b-visual-member openMemberDetailBtn" data-member-id="${escapeHtml(recent?.id || "player")}">
      <div class="v042-stage-visual portrait-slot has-stencil pt-${memberPortraitTypeClass(recent?.part)}"><span class="portrait-initials">${escapeHtml(initials(recent?.name || "主人公"))}</span><em class="portrait-stencil" aria-hidden="true"></em><i></i>${(recent?.portraitId || recent?.id) ? `<img src="assets/char/${escapeHtml(recent.portraitId || recent.id)}_story.webp" alt="" loading="lazy" onerror="this.remove()">` : ""}</div>
      <div><b>${escapeHtml(recent?.name || "主人公")}</b><small>${escapeHtml(recent?.part || "主人公")} / ${escapeHtml(memberNames || "ソロ")}</small><small>図鑑登録 ${bandbookCount} 組</small></div>
    </button>
    <button class="jumpTabBtn v043b-next-chip" data-view="schedule" ${next.turn ? `data-turn="${next.turn}"` : ""}>
      <span>${escapeHtml(next.badge)}</span><b>${escapeHtml(next.title)}</b><small>${escapeHtml(next.note)}</small>
    </button>
  </article>`;
}

function renderHomeStatusGridV042() {
  const b = state.band || {};
  const rows = [
    ["資金", v042FormatMoney(b.funds), Number(b.funds || 0) < 0 ? "bad" : Number(b.funds || 0) < 10000 ? "warn" : "good", "○︎"],
    ["ファン", `${Math.round(b.fans || 0)}人`, "good", "●︎"],
    ["疲労", `${Math.round(b.fatigue || 0)}%`, Number(b.fatigue || 0) >= 80 ? "bad" : Number(b.fatigue || 0) >= 60 ? "warn" : "good", "⚡︎"],
    ["知名度", Math.round(b.fame || 0), "info", "▲︎"],
    ["集客力", displayAudiencePower(b), "info", "◆︎"],
    ["業界評価", Math.round(b.industry || 0), "info", "■︎"]
  ];
  const icons = ["money", "audience", "fatigue", "fame", "ticket", "industry"];
  return `<section class="v042-status-card"><div class="v042-status-grid">${rows.map(([k,v,cls,icon], idx) => `<div class="v042-status ${cls}"><span>${v043eIcon(icons[idx] || icon)} ${k}</span><b>${escapeHtml(String(v))}</b></div>`).join("")}</div></section>`;
}

function renderPhoneScreen() {
  const mode = state.phoneSubView || "menu";
  return `<div class="v042-phone-backdrop">
    <section class="v042-phone-shell" role="dialog" aria-label="携帯">
      <div class="v042-phone-speaker"></div>
      <button class="phoneCloseBtn v042-phone-close" title="閉じる" aria-label="閉じる">${v043eIcon("close")}</button>
      <div class="v042-phone-screen">
        ${renderPhoneModeContentV042(mode)}
      </div>
    </section>
  </div>`;
}

function renderPhoneModeContentV042(mode) {
  if (mode === "shop") return renderPhoneAppFrameV042("ショップ", "shop", renderShopScreen());
  if (mode === "mail") return renderMailScreen();
  if (mode === "sns") { state.snsLastSeenCount = (state.snsPosts || []).length; return renderSnsScreen(); }
  if (mode === "bandbook") return renderPhoneBandBookScreen();
  if (mode === "account") return renderAccountSettingsScreen();
  return renderPhoneAppMenuV042();
}

function renderPhoneAppFrameV042(title, icon, body) {
  const frameIcon = v043eIconPaths[icon] ? v043eIcon(icon) : icon;
  return `<div class="v042-phone-app-view"><div class="v042-phone-app-top"><button class="phoneModeBtn ghost-btn" data-phone-mode="menu">${v043eIcon("back")}</button><b>${frameIcon} ${escapeHtml(title)}</b></div><div class="v042-phone-app-body">${body}</div></div>`;
}

function renderPhoneAppMenuV042() {
  const counts = v042NotificationCounts();
  const badge = n => n ? `<em class="nav-badge">${n}</em>` : "";
  const important = v043cImportantMailTarget();
  const importantBlock = important ? `<button class="v043cOpenFirstLiveMailBtn v043c-important-mail" data-mail-id="${escapeHtml(important.id)}"><b>要返信：ライブイベントのお誘い</b><small>メール詳細を開いて返事する</small></button>` : "";
  const apps = [
    ["shop", "shop", "ショップ", counts.shop, "機材・回復"],
    ["mail", "mail", "メール", counts.mail, "受信トレイ"],
    ["sns", "sns", "SNS", counts.sns, "タイムライン"],
    ["bandbook", "book", "図鑑", counts.bandbook, "他バンド"],
    ["account", "settings", "オプション", counts.option, "名前と表示"]
  ];
  return `<div class="v042-phone-menu"><div class="v042-phone-title"><b>携帯</b><span>${counts.total ? `通知 ${counts.total}` : "通知なし"}</span></div>${importantBlock}<div class="v042-app-list">${apps.map(([mode,icon,label,noteCount,note]) => `<button class="phoneModeBtn v042-app-icon" data-phone-mode="${mode}"><span>${v043eIcon(icon)}</span><b>${label}</b>${badge(noteCount)}<small>${note}</small></button>`).join("")}</div></div>`;
}

function renderMailScreen() {
  const acc = profileAccount();
  const active = state.activeMailId ? (state.phoneMails || []).find(m => m.id === state.activeMailId) : null;
  const edit = state.phoneAccountEdit === "mail";
  const body = active ? `<button class="closeMailDetailBtn ghost-btn">←︎ 受信トレイ</button>${renderMailDetail(active)}` : `<div class="v042-mail-list">${(state.phoneMails || []).map(renderMailRow).join("") || `<div class="empty-panel">メールはまだありません。</div>`}</div>`;
  const form = edit ? `<div class="v042-inline-edit"><label>メールアドレス<input id="mailInlineEmail" maxlength="40" value="${escapeHtml(acc.email)}"></label><button id="saveMailAddressBtn" class="big-action">保存</button></div>` : "";
  return `<div class="v042-mail-app"><div class="v042-phone-app-top"><button class="phoneModeBtn ghost-btn" data-phone-mode="menu">${v043eIcon("back")}</button><b>${v043eIcon("mail")} メール</b><button class="phoneInlineEditBtn ghost-btn" data-edit="mail">${v043eIcon("settings")} 設定</button></div><div class="v042-mail-account"><span>${escapeHtml(acc.email)}</span></div>${form}${body}</div>`;
}

function renderSnsScreen() {
  const acc = profileAccount();
  const edit = state.phoneAccountEdit === "sns";
  const form = edit ? `<div class="v042-inline-edit two"><label>表示名<input id="snsInlineDisplayName" maxlength="28" value="${escapeHtml(acc.snsDisplayName)}"></label><label>ユーザー名<input id="snsInlineUserName" maxlength="24" value="${escapeHtml(acc.snsUserName)}"></label><button id="saveSnsProfileBtn" class="big-action">保存</button></div>` : "";
  return `<div class="v042-sns-app"><div class="v042-phone-app-top"><button class="phoneModeBtn ghost-btn" data-phone-mode="menu">${v043eIcon("back")}</button><b>${v043eIcon("sns")} SNS</b><button class="phoneInlineEditBtn ghost-btn" data-edit="sns">${v043eIcon("settings")} 編集</button></div><header class="v042-sns-profile"><div class="sns-avatar">${escapeHtml((acc.snsDisplayName || state.band?.name || "B").slice(0,1).toUpperCase())}</div><div><b>${escapeHtml(acc.snsDisplayName || state.band?.name || "バンド")}</b><span>${escapeHtml(acc.snsUserName || "@bandname")}</span></div></header>${form}<div class="v042-sns-timeline">${(state.snsPosts || []).map(renderSnsPost).join("") || `<div class="empty-panel">まだ投稿はありません。</div>`}</div></div>`;
}

function renderPhoneBandBookScreen() {
  const previousDetail = state.bandBookDetail;
  const content = renderBandBookScreen();
  state.bandBookDetail = previousDetail;
  return renderPhoneAppFrameV042("図鑑", "book", `<p class="v042-phone-note">他バンド情報はここに集約しています。</p>${content}`);
}

function renderAccountSettingsScreen() {
  const acc = profileAccount();
  return renderPhoneAppFrameV042("オプション", "settings", `<div class="account-form v042-option-form">
    <label>主人公名<input id="accountPlayerName" maxlength="24" value="${escapeHtml(state.player?.name || "")}" /></label>
    <label>バンド名<input id="accountBandName" maxlength="28" value="${escapeHtml(state.band?.name || "")}" /></label>
    <label>メールアドレス<input id="accountEmail" maxlength="40" value="${escapeHtml(acc.email)}" /></label>
    <label>SNS表示名<input id="accountSnsDisplayName" maxlength="28" value="${escapeHtml(acc.snsDisplayName)}" /></label>
    <label>SNSユーザー名<input id="accountSnsUserName" maxlength="24" value="${escapeHtml(acc.snsUserName)}" /></label>
    <label class="v043f-se-toggle"><input type="checkbox" id="accountSeToggle" ${v043fAudio.muted ? "" : "checked"} /> 効果音（SE）</label>
    <button id="saveAccountSettingsBtn" class="big-action" data-se="b2">保存</button>
  </div>`);
}

function renderBandScreen() {
  const active = activeMembers();
  const upkeep = memberUpkeepCost();
  const trust = clamp(Math.round(Number(state.band?.trust || 0)), 0, 100);
  const trustStage = v043dTrustStage(trust);
  const trustReason = v043dLatestTrustReason();
  return `<div class="v042-band-page">
    <section class="card v042-band-self"><div class="section-title"><h2>${escapeHtml(state.band.name || "自分たちのバンド")}</h2><span class="badge good">自バンド管理</span></div>
      <div class="kv"><b>主人公</b><span>${escapeHtml(state.player?.name || "主人公")}</span><b>構成人数</b><span>${active.length}人</span><b>維持費目安</b><span>${v042FormatMoney(upkeep)}</span><b>ファン</b><span>${Math.round(state.band.fans || 0)}人</span><b>信頼度</b><span>${trust}/100・${escapeHtml(trustStage)}</span></div>
      <div class="v043d-trust-note"><b>最近の変化</b><span>${escapeHtml(trustReason)}</span><div class="meter mini"><div class="fill" style="width:${trust}%"></div></div></div>
      <button id="renameBandBtn" class="ghost-btn">バンド名を変更</button>
    </section>
    <section class="card"><div class="section-title"><h2>所属メンバー</h2><span class="badge">${active.length}人</span></div><div class="band-stage v042-member-stage">${active.map(renderMemberStageSlot).join("")}</div>${currentApplicantList().length ? renderApplicantList() : ""}</section>
    <section class="card"><div class="section-title"><h2>主人公スキル</h2><button class="jumpTabBtn ghost-btn" data-view="playerSkills">一覧表示</button></div>${renderPlayerSkillSummaryV042()}</section>
  </div>`;
}

function renderPlayerSkillSummaryV042() {
  const owned = (state.playerSkills || []).map(id => skillById(id)).filter(Boolean);
  if (!owned.length) return `<div class="empty-panel">まだ獲得していません。</div>`;
  return `<div class="v042-skill-chip-list">${owned.map(sk => `<span class="badge ${sk.rarity === "レア" ? "rare" : "good"}">${escapeHtml(sk.name)}</span>`).join("")}</div>`;
}

function renderPlayerSkillListScreen() {
  const owned = new Set(state.playerSkills || []);
  return `<div class="v042-skill-page"><section class="card"><div class="section-title"><h2>主人公スキル一覧</h2><button class="jumpTabBtn ghost-btn" data-view="band">バンド管理へ戻る</button></div><div class="v042-skill-list">${SKILL_DATA.map(sk => `<article class="v042-skill-row ${owned.has(sk.id) ? "owned" : "locked"}"><div><b>${owned.has(sk.id) ? "習得済" : "未習得"}：${escapeHtml(sk.name)}</b><span class="badge ${sk.rarity === "レア" ? "rare" : "good"}">${escapeHtml(sk.rarity)}</span></div><p>${escapeHtml(sk.desc || "")}</p>${sk.condition ? `<small>条件：${escapeHtml(sk.condition)}</small>` : ""}</article>`).join("")}</div></section></div>`;
}

function livePrepStepMeta() {
  return [
    { step:1, icon:"song", title:"セトリ", desc:"5曲と曲順" },
    { step:2, icon:"microphone", title:"担当・サポート", desc:"担当の下に契約" },
    { step:3, icon:"talk", title:"コーラス", desc:"別枠で確認" },
    { step:4, icon:"shop", title:"物販", desc:"仕入れ" },
    { step:5, icon:"check", title:"最終確認", desc:"ライブ開始" }
  ];
}

function currentLivePrepStep() {
  const n = clamp(Math.floor(Number(state.livePrepStep || 1)), 1, 5);
  state.livePrepStep = n;
  return n;
}

function renderLivePrepStepControls(step) {
  const prev = step > 1 ? `<button type="button" class="prepStepPrevBtn ghost-btn" data-step="${step - 1}">${v043eIcon("back")}前へ</button>` : `<span></span>`;
  const next = step < 5 ? `<button type="button" class="prepStepNextBtn big-action" data-step="${step + 1}">次へ ${v043eIcon("back", "v043e-icon-next")}</button>` : "";
  return `<div class="live-prep-step-controls">${prev}${next}</div>`;
}

function setLivePrepStepFromControl(step) {
  state.livePrepStep = clamp(Math.floor(Number(step || 1)), 1, 5);
  render();
}

function bindLivePrepStepControls() {
  document.querySelectorAll(".prepStepBtn, .prepStepNextBtn, .prepStepPrevBtn, .prepStepJumpBtn").forEach(btn => {
    if (btn.dataset.livePrepStepBound === "1") return;
    btn.dataset.livePrepStepBound = "1";
    btn.addEventListener("click", () => setLivePrepStepFromControl(btn.dataset.step));
  });
}

function renderPositionOnlyControlsV042() {
  const locked = state.liveCount === 0;
  const rows = activeMembers().map(m => {
    const savedInst = state.livePrepPositions?.[m.id];
    const defaultInst = locked && m.id === "player" ? "vocal" : (savedInst || m.mainInstrument || "off");
    const disabled = locked && m.id === "player" ? "disabled" : "";
    return `<div class="position-row" data-member="${m.id}">${renderAvatarPortrait(m.portraitId || m.id, m.name, m.part, "small")}<div><b>${escapeHtml(m.name)}</b><small>${escapeHtml(m.part || "")}</small>${renderPositionMiniStats(m, defaultInst)}</div><select class="positionSelect" data-member-id="${m.id}" ${disabled}>${positionOptions(defaultInst)}</select><button class="openMemberDetailBtn ghost-btn" data-member-id="${m.id}">詳細</button></div>`;
  }).join("");
  return `<div class="stage-card v042-position-card">${rows}</div>`;
}

function renderChorusOnlyControlsV042() {
  const ids = normalizeLivePrepChorusIds();
  const members = activeMembers().filter(m => m.instruments.chorus || m.instruments.vocal);
  return `<div class="stage-card v042-chorus-card">${ids.map((selected, i) => {
    const options = [`<option value="none" ${selected === "none" ? "selected" : ""}>コーラスなし</option>`, ...members.map(m => `<option value="${m.id}" ${selected === m.id ? "selected" : ""}>${escapeHtml(m.name)}</option>`)].join("");
    return `<div class="position-row chorus-line"><div class="avatar small">Cho${i+1}</div><div><b>コーラス枠${i+1}</b><small>最大6人</small></div><select class="chorusSelect" data-slot="${i}">${options}</select></div>`;
  }).join("")}</div>`;
}

function renderSupportOnlyControlsV042(selectedSupports) {
  const supportList = DATA.supportOptions.slice().sort((a,b) => supportInstrumentPriorityScore(b) - supportInstrumentPriorityScore(a) || (a.cost || 0) - (b.cost || 0));
  return `<div class="prep-subsection v042-support-section"><h3>サポート契約</h3><p><small>担当の不足をこの下で補います。</small></p><div class="checkbox-grid support-grid">${supportList.map(s => renderSupportOptionCard(s, selectedSupports)).join("")}</div></div>`;
}

function renderLivePrep() {
  ensureLivePrepSetlist();
  const step = currentLivePrepStep();
  const selectedSupports = livePrepSelectedSupportSet();
  const ev = currentLiveEvent();
  const v = venueById(ev.venueId);
  const liveMeta = liveTypeMeta(ev);
  const audience = audienceProfileForVenue(v);
  const selectedSongs = ensureLivePrepSetlist().map(id=>songById(id)).filter(Boolean);
  return `<div class="card live-panel live-prep-steps-card v042-live-prep">
    <div class="section-title"><h2>${currentLiveName()}：ライブ準備</h2><span class="badge warn">${escapeHtml(liveMeta.short)} / ${escapeHtml(v.name)}</span></div>
    <div class="venue-info live-prep-venue-summary"><b>${escapeHtml(liveMeta.label)} / ${escapeHtml(v.name)}</b><span>キャパ${v.capacity} / ${escapeHtml(liveMeta.feeLabel)}${eventBaseCost(ev, v).toLocaleString()}円 / 要準備${v.prepNeed}</span><small>${escapeHtml(venueRequirementText(v))}</small></div>
    ${renderLivePrepStepNav(step)}
    <div class="live-prep-step-stack">
      ${renderLivePrepStepPanel(step, 1, `<div class="prep-step-heading"><h3>① セトリ</h3><small>5曲と曲順。</small></div><div class="venue-info audience-info"><b>客層：${escapeHtml(audience.label)}</b><span>${escapeHtml(audience.detail)}</span></div><div class="setlist-hint-panel">${livePrepAutoHints(selectedSongs, v, audience).map(h=>`<span>${escapeHtml(h)}</span>`).join("")}</div><div class="prep-step-actions"><button id="autoSetlistBtn" class="big-action wide-cancel">セトリ自動セット</button><button id="resetSetlistBtn" class="ghost-btn wide-cancel">リセット</button></div>${renderLivePrepSetlist()}${renderLivePrepStepControls(step)}`)}
      ${renderLivePrepStepPanel(step, 2, `<div class="prep-step-heading"><h3>② 担当・サポート</h3><small>担当を決め、その下で足りないパートをサポート契約。</small></div>${renderPositionOnlyControlsV042()}${renderSupportOnlyControlsV042(selectedSupports)}${renderLivePrepStepControls(step)}`)}
      ${renderLivePrepStepPanel(step, 3, `<div class="prep-step-heading"><h3>③ コーラス</h3><small>担当とは別にコーラス枠を確認。</small></div>${renderChorusOnlyControlsV042()}${renderLivePrepStepControls(step)}`)}
      ${renderLivePrepStepPanel(step, 4, `<div class="prep-step-heading"><h3>④ 物販</h3><small>担当・サポートとは分けて仕入れを調整。</small></div>${renderMerchPrepControls(v, audience)}${renderLivePrepStepControls(step)}`)}
      ${renderLivePrepStepPanel(step, 5, `<div class="prep-step-heading"><h3>⑤ 最終確認・ライブ開始</h3><small>設定を確認して本番へ。</small></div>${renderLivePrepCheckPanel(v, { showStepLinks:true })}<div class="live-prep-final-actions"><button id="performLiveBtn" class="big-action">ライブ本番へ</button>${!currentLiveEvent().fixed ? `<button id="noShowLiveBtn" class="ghost-btn danger wide-cancel">ライブをドタキャンする</button>` : ""}</div>${currentApplicantList().length ? renderApplicantList() : ""}${renderLivePrepStepControls(step)}`)}
    </div>
  </div>`;
}

function renderIntroScreen() {
  const step = clamp(Number(state.openingStep || 0), 0, 9);
  const storedHeroName = state.player?.name || "";
  const heroName = state.pendingPlayerName || (storedHeroName === "あなた" ? "" : storedHeroName);
  const bandName = state.pendingBandName || state.band?.name || "";
  const openingScenes = [
    { speaker:"タカナシ", text:"「見慣れない顔だな。バンドに興味あるの？」", note:"ライブハウス前に立つ主人公。後ろからタカナシが聞いてくる。" },
    { speaker:"主人公", text:"「あ、はい！バンドがしたくて」" },
    { speaker:"タカナシ", text:"「ふーん、ここのライブハウスはいいところなんだ。バンド始めるならここからスタートするのがいいと思うぜ。」" },
    { speaker:"主人公", text:"「そうなんですか、ここから…」" },
    { poster:true },
    { speaker:"タカナシ", text:"「ま、がんばれよ。えっと……」" },
    { thought:true },
    { speaker:"タカナシ", text:`「${heroName || "○○"}か、バンド名は決めてんのか？」` },
    { bandPrompt:true },
    { speaker:"タカナシ", text:`「${bandName || "○○"}か、覚えとくよ。」`, final:true }
  ];
  const scene = openingScenes[step] || {};
  const contextKey = v043dConversationLogContextKey("opening", "intro");
  const logEntries = v043dOpeningLogEntries(openingScenes, step);
  const logButton = v043dRenderConversationLogButton(contextKey);
  const logPanel = v043dRenderConversationLogPanel(logEntries, contextKey);
  const visual = scene.poster || step >= 4 ? `<div class="v042-novel-poster opening-poster"><span>UNDER FES POSTER</span><b>UNDER<br>FES</b><small>地下から、名前を鳴らせ。</small></div>` : `<div class="v042-livehouse-bg"><span>LIVE HOUSE</span><b>UNDER GARAGE</b></div>`;
  const body = scene.poster
    ? `<div class="v042-novel-box poster-scene"><b>フェスのポスターが壁に貼られている。</b><button id="openingNextBtn" class="big-action">次へ</button></div>`
    : scene.thought
      ? `<div class="v042-thought-pop opening-input"><b>タカナシ（名前はなんていうんだ…？）</b><input id="openingPlayerNameInput" class="wide-input" maxlength="24" placeholder="主人公名" value="${escapeHtml(heroName)}" /><button id="openingPlayerNameBtn" class="big-action">決定</button></div>`
      : scene.bandPrompt
        ? `<div class="v042-thought-pop opening-input"><b>バンド名は？</b><input id="openingBandNameInput" class="wide-input" maxlength="28" placeholder="バンド名" value="${escapeHtml(bandName)}" /><button id="openingBandNameBtn" class="big-action">決定</button></div>`
        : `<div class="v042-novel-box"><span>${escapeHtml(scene.speaker || "")}</span>${scene.note ? `<small>${escapeHtml(scene.note)}</small>` : ""}<p>${escapeHtml(scene.text || "")}</p><button id="${scene.final ? "openingFinishBtn" : "openingNextBtn"}" class="big-action">${scene.final ? "ホームへ" : "次へ"}</button></div>`;
  app.innerHTML = `<div class="v042-novel-opening">${visual}<div class="v043d-opening-body">${body}<div class="v043d-opening-log-actions">${logButton}</div></div>${logPanel}</div>`;
  document.getElementById("openingNextBtn")?.addEventListener("click", (ev) => runProgressionButtonAction(ev.currentTarget, () => { state.openingStep = Math.min(9, step + 1); render(); }));
  document.getElementById("openingPlayerNameBtn")?.addEventListener("click", () => {
    const name = cleanProfileInput(document.getElementById("openingPlayerNameInput")?.value, "", 24);
    if (!name) { alert("主人公名を入力してください。"); return; }
    state.pendingPlayerName = name;
    if (state.player) state.player.name = name;
    state.openingStep = 7;
    render();
  });
  document.getElementById("openingBandNameBtn")?.addEventListener("click", () => {
    const name = cleanProfileInput(document.getElementById("openingBandNameInput")?.value, "", 28);
    if (!name) { alert("バンド名を入力してください。"); return; }
    state.pendingBandName = name;
    if (state.band) state.band.name = name;
    state.bandNameFinalized = true;
    const acc = profileAccount();
    acc.snsDisplayName = acc.snsDisplayName || name;
    acc.snsUserName = acc.snsUserName || `@${safeProfileSlug(name)}`;
    acc.email = acc.email || `${safeProfileSlug(name)}@under-mail.jp`;
    state.openingStep = 9;
    render();
  });
  document.getElementById("openingFinishBtn")?.addEventListener("click", (ev) => runProgressionButtonAction(ev.currentTarget, () => {
    state.introSeen = true;
    state.bandNameFinalized = true;
    state.bandNamePrompt = false;
    state.openingStep = 10;
    state.tutorialStage = "needSong";
    state.activePopup = { title:"活動開始", body:"まずは、曲でも作るか……\n作詞・作曲から新曲制作を始めよう。", type:"event", icon:v043eIcon("song") };
    v043dResetConversationLog();
    saveGame(false);
    render();
  }));
  v043dBindConversationLogControls();
  armProgressionButtonGate("#openingNextBtn, #openingFinishBtn");
}

const bindEvents_v042_base = bindEvents;
bindEvents = function bindEvents_v042() {
  bindEvents_v042_base();
  bindLivePrepStepControls();
  document.querySelectorAll(".v043b-action-btn:not(:disabled)").forEach(btn => {
    if (btn.dataset.v043bBound === "1") return;
    btn.dataset.v043bBound = "1";
    btn.addEventListener("click", () => v043bHandleHomeCommandTap(btn.dataset.command));
  });
  document.querySelectorAll(".phoneCloseBtn").forEach(btn => btn.addEventListener("click", () => { state.view = "home"; state.phoneSubView = "menu"; state.phoneAccountEdit = null; state.activeMailId = null; render(); }));
  document.querySelectorAll(".phoneInlineEditBtn").forEach(btn => btn.addEventListener("click", () => { state.phoneAccountEdit = btn.dataset.edit || null; render(); }));
  document.getElementById("saveMailAddressBtn")?.addEventListener("click", () => {
    const email = cleanProfileInput(document.getElementById("mailInlineEmail")?.value, "", 40);
    if (!email) { alert("メールアドレスを入力してください。"); return; }
    profileAccount().email = email;
    state.phoneAccountEdit = null;
    state.saveNotice = "メールアドレスを保存しました。";
    render();
  });
  document.getElementById("saveSnsProfileBtn")?.addEventListener("click", () => {
    const display = cleanProfileInput(document.getElementById("snsInlineDisplayName")?.value, "", 28);
    let user = cleanProfileInput(document.getElementById("snsInlineUserName")?.value, "", 24);
    if (!display || !user) { alert("SNS表示名とユーザー名を入力してください。"); return; }
    user = "@" + user.replace(/^@+/, "").replace(/[^\w_]/g, "").slice(0, 20);
    if (user === "@") user = `@${safeProfileSlug(display)}`;
    state.account = { ...profileAccount(), snsDisplayName: display, snsUserName: user };
    state.phoneAccountEdit = null;
    state.saveNotice = "SNSプロフィールを保存しました。";
    render();
  });
  document.querySelectorAll(".phoneModeBtn").forEach(btn => btn.addEventListener("click", () => { state.phoneAccountEdit = null; }));
  /* PR-J: B2/F1 SE配線。既存ハンドラには一切触れず、data-se属性を持つ要素へ追加でリスナーを張るのみ
     （実行確定系の主要タップ＝b2、戻る/キャンセル＝f1。適用範囲はPR本文の候補一覧で報告・発注者が取捨） */
  document.querySelectorAll("[data-se]").forEach(btn => {
    if (btn.dataset.v043fSeBound === "1") return;
    btn.dataset.v043fSeBound = "1";
    btn.addEventListener("click", () => v043fPlaySeNow(btn.dataset.se));
  });
  document.getElementById("accountSeToggle")?.addEventListener("change", (ev) => { v043fSetMuted(!ev.target.checked); });
};

/* --- fix2 (P0): ライブ結果オーバーレイの背面スクロールロック ---
   この時点で`render`は既にPR-Eの演出フックにより一度再代入済み（同名関数罠は既に解消済みの状態）。
   ここでその現在の束縛をさらに再代入でラップする（wrap-by-reassignment、方針v2.0.2標準）。
   render本体・PR-Eの演出フック本体のどちらにも一切触れない。state.liveResultModalの有無のみで
   html/bodyへロック用classを着脱し、結果ロジック・コレオグラフィのタイムラインには無接触
   （SKIN_ORDER_v4 fix2）
   --- fix3（P0継続）: 同ラップ内でshouldLockにliveProgressModalを追加（新規ラップ層は作らず、
   既存body-lockヘルパの適用範囲を拡張）。加えてライブ進行画面の内部スクロール領域（.live-telop-list）を
   現在ステップへ自動追従させる処理を追加。どちらも進行ロジック・スキップ機能・タイムラインには無接触
   （SKIN_ORDER_v4 fix3） */
const dgRenderBeforeFix2 = render;
render = function () {
  dgRenderBeforeFix2();
  if (typeof document !== "undefined" && document.documentElement) {
    const shouldLock = !!state.liveResultModal || !!state.liveProgressModal;
    document.documentElement.classList.toggle("dg-scroll-lock", shouldLock);
    if (document.body) document.body.classList.toggle("dg-scroll-lock", shouldLock);
    if (state.liveProgressModal) {
      const currentStep = document.querySelector(".live-progress-modal .live-telop-list .setlist-step.current");
      if (currentStep && typeof currentStep.scrollIntoView === "function") {
        currentStep.scrollIntoView({ block: "nearest" });
      }
    }
  }
};

render();
