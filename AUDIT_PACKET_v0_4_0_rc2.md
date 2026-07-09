# AUDIT PACKET v0.4.0-rc2

## 対象

v0.4.0-rc2

## 目的

Fable5外部監査で検出された `maybeSeedWorldReactionPosts()` の `band_voice_*` シード経路不発を最小修正したRC2の確認。

## 重点確認

- `state.bandBook.bands[id].state !== "unknown"` のバンドだけがSNS人格投稿のシード対象になること。
- `unknown` バンドの人格投稿が出ないこと。
- `band_voice_${id}` のdedupにより重複増殖しないこと。
- v0.4.0a〜eの回帰が壊れていないこと。
- 旧セーブ正規化が維持されていること。
- 3系統50T通しが完走すること。

## 実行済み確認

- node --check game.js
- audit40a_smoke.js
- audit40b_live_prep.js
- audit40c_phone_tutorial.js
- audit40d_bandbook_lore.js
- audit40e_world_reactions.js
- audit40rc_oldsave.js
- audit40rc_full.js
- audit40rc2_band_voice_fix.js

## 判定

こちらの確認では進行不能・保存破壊・ターン進行退行・GRAND条件退行は検出なし。
実機確認へ回してよい候補。
