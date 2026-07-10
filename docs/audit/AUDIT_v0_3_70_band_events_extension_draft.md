# AUDIT v0.3.70-band-events-extension-draft

## 判定

OK。コード欠陥なし。v0.3.70は次版作業へ進行可能。

## 実施確認

### 静的確認

- `node --check game.js`：OK。
- VERSION：`v0.3.70-band-events-extension-draft`。
- SAVE_VERSION：`v0.3.70-band-events-extension-draft`。
- `VERSION.txt`：OK。
- `index.html title`：OK。
- `sw.js cache`：OK。

### DB整合

- `BAND_EVENT_DATABASE` の全イベント `bandId` が `BAND_DATABASE` に存在。
- `BAND_EVENT_STORY_MAP` のイベント参照欠けなし。
- `BAND_EVENT_STORY_MAP` のシーン参照欠けなし。
- `eventSeen` 条件の参照先イベント欠けなし。
- `lastBattleBandId` 条件のバンドID欠けなし。

### v0.3.70追加イベント発火確認

実プレイ相当条件で以下7イベントの発火・ノベル開始・ノベル完走を確認。

- `event_in_bab_fan_pull_talk`
- `event_polaris_afterglow_lesson`
- `event_jack_bomb_blast_check`
- `event_hyper_marmoty_shout_circle`
- `event_ultimate_quokkas_happy_rhythm`
- `event_rumble_sand_stage_video`
- `event_neon_reef_deep_blue_note`

### 回帰確認

`audit70_regression.js` にて確認。

- 名前付きサポート11人維持。
- 汎用 `sup_` サポートなし。
- 特殊楽器サポート3人維持。
- 初期render OK。
- メール本文モーダルHTMLあり。
- 休憩ミニイベント率0維持。
- 練習ミニイベント率補正維持。
- 強制乱数で練習ミニイベント発生維持。
- 打ち上げ選択イベント維持。
- 打ち上げ選択解決維持。
- 打ち上げ交流値増加維持。
- `pendingAfterpartyEvent` 保存除外維持。
- DEV GRAND最低値セット実行OK。

## 監査中に見えた注意点

追加イベントの一部は、既存のSHELTER/KAEDE/LACT系イベントが未消化の場合、そちらに先行される。
これは `priority` と1ターン1件制御による正常挙動。
実プレイ相当条件で前提イベントを消化済みにした場合、v0.3.70追加イベントは正常に発火する。

## fix要否

fix不要。
