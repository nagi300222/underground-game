# CHANGELOG v0.4.0e-world-reactions-draft

## 目的
v0.4.0dまでで整えたUI/携帯/図鑑の器に、世界観演出を薄く追加する版。
進行不能リスクを避けるため、新規オーバーレイや新規進行ブロック状態は追加しない。

## 追加内容

### SNS人格化
- `addSnsPostOnce` を追加し、世界投稿を一度だけ流す仕組みを追加。
- `maybeSeedWorldReactionPosts` を追加。
  - T3以降：地下シーンの初期反応。
  - UNDER前：UNDER FES前のざわめき。
  - UNDER後：シーン側の見られ方変化。
  - GRAND前：LACT/GRANDの話題。
- `bandSnsVoice` を追加し、出会った主要バンドの短い声をSNSに流せるようにした。
- ライブ後に `addLiveWorldReactionPosts` を呼び、評価・対バン・GRAND状況に応じた反応を追加。

### LACT専用演出
- 50T/GRAND時のみ、SNS上にLACTリハ/GRAND袖の空気を出す演出を追加。
- 新規ノベル/新規オーバーレイ/フェス日抑制例外は追加しない。
- `renderOverlays` / `pendingTurnAdvance` / `performLive` の進行順は変更しない。

### メール演出強化
- メール一覧に差出人アイコンを追加。
- メール種別チップを追加。
- メール本文ヘッダーにもアイコンと種別表示を追加。
- 返信/承認/辞退フローは既存のまま。

### 目標カード強化
- ホームに `renderGoalPulseCard` を追加。
- UNDER/GRANDまでの残りT、世界の温度、不足上位3件を表示。
- 予定タブへの導線を追加。

### CSS
- `goal-pulse-card`
- `mail-row-enhanced`
- `mail-sender-icon`
- `mail-kind-chip`
- `sns-spotlight`
- `sns-post.lact/fes/band/reaction`

## 触っていないもの
- ライブ準備DOM読取。
- `performLive` の本番処理。
- `getPositionMapFromDom`。
- `collectMerchOrdersFromDom`。
- GRAND条件。
- ターン進行条件。
- メール返信確定処理。
- 打ち上げイベント。
- 通常行動ミニイベント。
- バンドイベント発火条件。
- 図鑑解放条件。
- スキル効果。

## セーブ互換
- `snsWorldSeen` を通常保存データとして追加。
- 旧セーブでは正規化時に `{}` を補完。
- 新規危険一時状態は追加していない。
