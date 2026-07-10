# CHANGELOG v0.3.70-band-events-extension-draft

対象：スマホブラウザ向けバンド育成SLG『アンダーグラウンド（仮）』
比較元：v0.3.69-action-mini-events-draft

## 目的

v0.3.65〜0.3.66で作った他バンドイベント土台を、v0.4.0の世界観拡張前に少し広げる。
全22組の本格イベント化ではなく、優先候補の短編イベントを追加し、図鑑・対バン・ノベル接続の密度を上げる。

## 追加イベント

以下7本の短編 encounter イベントを追加。

- `event_in_bab_fan_pull_talk`
  - IN-BAB / Nasu。
  - 初対バン後、ファン70以上、直近対バンがIN-BABで発火。
- `event_polaris_afterglow_lesson`
  - POLARIS / ヘイル。
  - 初対バン後、オリジナル4曲以上、直近対バンがPOLARISで発火。
- `event_jack_bomb_blast_check`
  - JACK BOMB / アラカ。
  - 初対バン後、A相当以上の直近対バンで発火。
- `event_hyper_marmoty_shout_circle`
  - HYPER MARMOTY / ヤマモト。
  - 初対バン後、直近対バンがHYPER MARMOTYで発火。
- `event_ultimate_quokkas_happy_rhythm`
  - ultimate quokkas / ワラジ。
  - 初対バン後、直近対バンがultimate quokkasで発火。
- `event_rumble_sand_stage_video`
  - RUMBLE SAND。
  - SNS発見後、業界評価85以上で発火。
- `event_neon_reef_deep_blue_note`
  - Neon Reef。
  - ニュース発見後、業界評価90以上で発火。

## 追加ノベルシーン

以下7本を `STORY_SCENE_DATABASE` に追加し、`BAND_EVENT_STORY_MAP` へ接続。

- `in_bab_fan_pull_talk`：連れていく立ち方
- `polaris_afterglow_lesson`：余韻の置き場所
- `jack_bomb_blast_check`：爆発のあと
- `hyper_marmoty_shout_circle`：まっすぐな円陣
- `ultimate_quokkas_happy_rhythm`：笑顔の裏拍
- `rumble_sand_stage_video`：砂嵐の映像
- `neon_reef_deep_blue_note`：深青の評

## 維持仕様

- 50T制維持。
- 5T初ライブ維持。
- 30T UNDER FES維持。
- 50T GRAND UNDER FES維持。
- GRAND条件変更なし。
- 作詞/作曲/曲完成/曲強化ではターン進行しない仕様を維持。
- 通常行動 / ライブ / 打ち上げ / ドタキャンのみターン進行対象を維持。
- v0.3.67の名前付きサポート11人、メールモーダル、ライブ準備チェック維持。
- v0.3.68の打ち上げイベント維持。
- v0.3.69の通常行動ミニイベント維持。

## 注意点

- 追加イベントは既存の1ターン1件制御、優先度制御、フェス日抑制に従う。
- 既存のSHELTER/KAEDE/LACT系イベントが未消化の場合、そちらが先に発火し、v0.3.70追加イベントは次ターン以降へ持ち越されることがある。
- これは進行不能ではなく、既存仕様どおりの優先度制御。
