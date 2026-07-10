# アンダーグラウンド（仮） v0.4.1a-visual-foundation-draft

## v0.4.1a 追加内容

- 右下固定の「📱 携帯」ボタンを追加。
- 上部ステータスでターン/資金/ファン/疲労を見やすく調整。
- 一列の「週の流れ」を追加。
- ホームを圧縮し、主ボタンと予定導線を強化。
- ボタンが押せると分かるように影/枠/文言を調整。
- スマホ幅で1〜2文字だけの不自然な改行が出にくいようCSS補強。
- GitHub Pages用 `.nojekyll` を同梱。

## 確認

- node --check game.js：OK
- audit40a/b/c/d/e：OK
- audit40rc_oldsave：OK
- audit40rc_full：OK
- audit41a_visual_foundation：OK

---

# アンダーグラウンド（仮） v0.4.0-rc3

## v0.4.0-rc3 追加内容

実機確認で報告されたUX不具合2件を最小修正したRC3です。

- DEV画面の折りたたみカテゴリが操作後に毎回閉じる問題を修正。
- 下部タブの「携帯」を押した時、前回のSNS/メール/図鑑ではなく携帯トップから始まるよう修正。
- v0.4.1本格デザイン前の安全パッチとして、スマホ幅の文字/余白/ボタン高さを最小補強。

## 同梱資料

- CHANGELOG_v0_4_0_rc3.md
- AUDIT_PACKET_v0_4_0_rc3.md
- AUDIT_v0_4_0_rc3.md
- audit40rc3_ux_regression.js

## コード確認

- `node --check game.js`：OK。
- `node audit40a_smoke.js`：OK。
- `node audit40b_live_prep.js`：OK。
- `node audit40c_phone_tutorial.js`：OK。
- `node audit40d_bandbook_lore.js`：OK。
- `node audit40e_world_reactions.js`：OK。
- `node audit40rc_oldsave.js`：OK。
- `node audit40rc_full.js`：OK。
- `node audit40rc2_band_voice_fix.js`：OK。
- `node audit40rc3_ux_regression.js`：OK。

---


# アンダーグラウンド（仮） v0.4.0b-live-prep-steps-draft

## v0.4.0b 追加内容

- ライブ準備画面を4ステップ型へ整理。
  1. セトリ
  2. 担当
  3. サポート/物販
  4. 最終チェック
- ステップ切替はCSS表示切替方式。
- `.setlistSelect` / `.positionSelect` / `.chorusSelect` / 物販入力DOMは同一DOM内に維持。
- `performLive()` / `getPositionMapFromDom()` / `collectMerchOrdersFromDom()` は変更なし。
- v0.4.0aの5タブ入口・ホーム再構成は維持。

## 同梱資料

- CHANGELOG_v0_4_0b_live_prep_steps.md
- AUDIT_PACKET_v0_4_0b.md
- AUDIT_v0_4_0b_live_prep_steps_draft.md
- audit40a_smoke.js
- audit40b_live_prep.js

## コード確認

- `node --check game.js`：OK。
- `node audit40a_smoke.js`：OK。
- `node audit40b_live_prep.js`：OK。

---

# アンダーグラウンド（仮） v0.3.70-band-events-extension-draft

## v0.3.70-band-events-extension-draft 追加内容

- 他バンド短編イベントを7本追加。
  - IN-BAB / POLARIS / JACK BOMB / HYPER MARMOTY / ultimate quokkas / RUMBLE SAND / Neon Reef。
- 追加7イベントを `BAND_EVENT_DATABASE` に登録。
- 追加7イベントを `BAND_EVENT_STORY_MAP` と `STORY_SCENE_DATABASE` へ接続。
- 既存の1ターン1件制御、フェス日抑制、優先度制御に従う形で実装。
- v0.3.67のサポート整理・メールモーダル・ライブ準備チェックを維持。
- v0.3.68の打ち上げイベントを維持。
- v0.3.69の通常行動ミニイベントを維持。
- GRAND条件、ターン進行ルール、コピー曲ガード、DEV補助は変更なし。

## 同梱資料

- CHANGELOG_v0_3_70_band_events_extension.md
- AUDIT_PACKET_v0_3_70.md
- AUDIT_v0_3_70_band_events_extension_draft.md
- audit70_smoke.js
- audit70_regression.js

## コード確認

- `node --check game.js`：OK。
- `node audit70_smoke.js`：OK。
- `node audit70_regression.js`：OK。

## 注意

追加イベントの一部は、既存のSHELTER/KAEDE/LACT系イベントが未消化の場合、そちらが先に発火する。
これは優先度制御と1ターン1件制御による正常挙動で、持ち越し後に発火する。

---

# アンダーグラウンド（仮） v0.3.66-balance-draft-fix1

v0.3.50 を土台に、バンド図鑑・交流スキル・他バンドイベントの骨格を一括で載せた「大きめドラフト」版です。
`game.js` 冒頭付近の `ENABLE_BAND_SYSTEM` を `false` にすると v0.3.50 相当の挙動へ戻せます。


## v0.3.66-balance-draft-fix1 確認整理

- こちら側で再デバッグしたスマホ実機確認向け版。
- コード本体はv0.3.66-balance-draftの仕様を維持し、バージョン/cacheをfix1へ更新。
- `AUDIT_v0_3_66_balance_draft_fix1.md` を追加。
- `MOBILE_SMOKE_CHECK_v0_3_66_fix1.md` を追加。
- `FABLE5_AUDIT_PROMPT_v0_3_66.md` を追加。
- Fable5復帰後は、このZIPをv0.3.64〜v0.3.66総合監査対象にする。


## v0.3.66-balance-draft-fix1 追加内容

- v0.3.65相当として、優先8組の他バンド追加イベント土台を追加。
  - Triple Arrows / CARBONS / Pachi-Pachi / SHELTER / Kiwi / magnet wolf / KAEDE / LACT。
- KAEDE遭遇、LACT名前出しなど、既存イベントのノベル接続を追加。
- v0.3.66相当として、GRAND条件チェック補助を追加。
- DEV画面に「v0.3.66 バランス確認」カードを追加。
  - GRAND条件チェック
  - UNDER目安セット
  - GRAND最低値セット
  - GRAND注目枠セット
  - 主要バンドイベント土台セット
- バランス基準資料 `BALANCE_BASELINE_v0_3_66.md` を追加。
- シミュレーション計画資料 `SIMULATION_PLAN_v0_3_66.md` を追加。
- 監査メモ `AUDIT_v0_3_66_balance_draft.md` を追加。

## v0.3.65-band-events-draft 相当の追加内容

- 他バンドイベント拡張の土台を追加。
- 追加イベントは小さな `encounter` 中心で、既存のライブ/ターン進行を極力触らない。
- 新規スキルや大きな報酬はまだ追加しない。
- Fable5総合監査で発火条件・参照欠け・進行不能を確認する想定。

## v0.3.64-growth-type-draft 追加内容

- 加入候補の `growthType` を、表示だけでなく実成長へ小補正として反映。
- 練習時の技術・リズム上昇に成長タイプ倍率を適用。
- 練習時、各成長タイプの重点ステータスが低確率で追加成長。
- ライブ後成長のメンタル・カリスマ・楽器Lvに成長タイプ倍率を適用。
- S/A/B評価ライブでは、成長タイプの重点ステータスが追加成長することがある。
- 旧セーブや主人公など `growthType` 未設定メンバーは安全に「安定型」へ正規化。
- メンバーカードとDEV画面で、成長タイプの効果メモを確認可能。


## v0.3.63-novel-events-draft 追加内容

- バンド図鑑（ホームのタイル / 図鑑ページ内カードから）
  - 全22組。未遭遇は「？？？」表示、Lv・格・内部数値は非表示
  - 交流段階（顔見知り/知り合い/仲間/盟友）、対バン回数、代表キャラ（交流30以上で開示）
- 交流スキル（獲得＋一部効果ON）
  - 効果ON：3本の基礎 / 癒しキャラ / ライバル意識 / インフルエンサー / 余韻残響（簡易）
  - 獲得のみ：ダイヤの原石 / 弾ける甘味 / ロック魂
- 他バンドイベント
  - Triple Arrows 3連鎖（初回打ち上げ→招待メール→スキル獲得）※旧Paper Moon Kids導線を統合
  - CARBONS 初戦＋大成功時のダイヤの原石
  - Lv1〜2ランダム対バン枠7組、Pachi-Pachi初戦＋リマッチ、SHELTER遭遇＋声かけ
  - IN-BAB / POLARIS / KAEDE / JACK BOMB / HYPER MARMOTY / ultimate quokkas / RUMBLE SAND / Neon Reef / LACT は図鑑登録・名前出しレベル
- セーブ拡張：`bandBook` / `ownedBandSkills` / `saveSchemaVersion`（旧セーブは自動マイグレーション）

## 注意

数値・イベント窓・スキル補正はすべて仮です。詳細は `CHANGELOG_v0_3_60_big_draft.md` を参照。


## v0.3.63-novel-events-draft メンバー加入候補追加

- 加入候補36人を新規データに差し替えました。
- デフォルト名は苗字のみ・名前のみで、加入時に変更できます。
- Gt/Vo・Ba/Vo候補を追加し、既存のライブ準備ロールで扱えます。
- 数値と成長タイプはたたき台です。

## v0.3.63-novel-events-draft 安全補強

- 候補0人時に説明ログを出すようにしました。
- T15以降、候補0人かつ基本パート不足時に、基本パート候補を1人だけ軽救済で再提示します。
- 加入後メンバーカードにも成長タイプを表示します。現時点では表示のみで、実成長倍率にはまだ反映しません。
- 旧「（仮）」候補ブロックとPaper Moon Kids系コードには、旧互換/退避用であることをコメント整理しました。

今後の進行は `ROADMAP_AFTER_v0_3_61.md` を参照してください。

## v0.3.63-novel-events-draft 進行不能リスク追加対策

イベント・ライブ周辺の進行不能を防ぐため、ライブ後フロー、ポップアップキュー、進行予約、予約/購入/キャンセル系モーダルの割り込み条件を安全側へ補強しました。

- ライブ後フローの安全弁
- ポップアップキュー復旧
- pendingTurnAdvance復旧ボタン
- ライブ予定欠損時のクラッシュ防止
- セトリ不足時のクラッシュ防止
- 一時状態のセーブ/ロード整理

## v0.3.63-novel-events-draft ノベルイベント / DEVモード

- 簡易ノベルイベントUIを追加しました。
- 背景・影シルエット・セリフボックス・結果表示で、パワプロサクセス風の短いイベントを表示できます。
- 初ライブ後の「はじめての打ち上げ」をノベルイベント化しました。
- ホームにDEVモードを追加しました。
- DEVでは、指定ターン移動、ステータス変更、ノベルイベント再生、加入候補追加、オリジナル曲補充ができます。
- 正式版では `ENABLE_DEV_MODE = false` にして非表示化する想定です。

## v0.3.63-novel-events-draft 実機導線修正

- DEVモードでターン移動・ステージ移動した際、チュートリアル制限が残らないよう修正。
- DEV補助に「チュートリアル解除」を追加。
- 携帯メール本文から、ライブ出演通知への返信・予定表追加確認へ進めるよう修正。
- 携帯メール本文から、メンバー候補へ返信して会う導線を追加。
- Triple Arrows招待ノベル後のライブ参加導線が分かるよう結果文言を調整。
- ノベルイベントの次へ/スキップ/結果OKボタン位置をスマホ向けに少し上へ調整。

次の確認は、DEV移動後のチュートリアル残り、携帯メールからのライブ予定追加、メンバー候補返信、ノベルボタンの押しやすさを優先してください。

## v0.4.0c-phone-tutorial-draft
- 携帯トップに要返信固定セクションを追加。
- 携帯アプリとしてメール/SNS/バンド図鑑を整理。
- ホームに初ライブまでのチュートリアル進行カードを追加。
- T3宣伝時にSNS初期反応を1件追加。
- ライブ招待承認後、予定タブへ移動して予定を確認しやすくした。
- 新しい進行ブロック/一時オーバーレイ状態は追加せず、進行不能リスクを抑制。


## v0.4.0d-bandbook-lore-draft

- バンド図鑑を「プロフィール / コメント / 裏話」の3タブへ拡張。
- 全22組に代表者コメント枠を追加。
- 優先8組に裏話を2本ずつ追加。
- セーブ拡張なし。交流値・イベント既読・flagsを参照する静的読み物拡張。
- v0.4.0a〜cのUI/ライブ準備/携帯チュートリアル回帰スモーク通過。


## v0.4.0e-world-reactions-draft

- SNS人格化：世界の投稿、バンド別の短い声、UNDER/GRAND前のタイムライン演出を追加。
- メール演出強化：差出人アイコン、種別チップ、本文ヘッダーの視認性を改善。
- 目標カード強化：ホームにUNDER/GRANDまでの残りT、世界の温度、不足上位を表示。
- LACT専用演出：50T/GRAND周辺のSNS投稿として追加。新規オーバーレイや進行ブロックは追加しない。
- v0.4.0a〜dの回帰確認を継続。

## v0.4.0-rc1

v0.4.0a〜e統合後のRC監査版。
新機能追加を止め、進行不能・旧セーブ互換・50T通しを確認。

RCでの小修正：
- `snsWorldSeen` 欠損旧セーブの正規化
- `logs` 欠損旧セーブの正規化
- `liveResultHistory` 欠損旧セーブの正規化

追加監査：
- `audit40rc_oldsave.js`
- `audit40rc_full.js`

次：Fable5外部RC監査、または実機スマホ確認。
