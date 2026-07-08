# AUDIT v0.3.63-novel-events-draft

## 確認方法

- ZIP展開後の静的コード確認
- `node --check game.js`
- 主要IDの簡易grep確認

## 確認済み

- VERSION / SAVE_VERSION：v0.3.63-novel-events-draft
- index title：v0.3.63-novel-events-draft
- sw.js cache：underground-v0-3-63-novel-events-draft
- `node --check game.js`：OK
- 追加ノベルID：
  - pachi_pachi_first_live
  - pachi_pachi_sweetness_unlock
  - carbons_diamond_rough
  - under_fes_before
  - shelter_rock_spirit
- 既存ノベルID維持：
  - first_afterparty_triple_arrows
  - triple_arrows_invite
  - carbons_after_live
  - shelter_encounter
  - member_join_generic

## 未確認

- スマホ実機でのノベル表示。
- 実機でのPachi-Pachi 2戦後スキル獲得導線。
- 実機でのCARBONS大成功後スキル獲得導線。
- 28〜29TのUNDER FES前ノベル発火タイミング。

## Fable5監査で見てほしい点

- ノベルイベント追加による `popupQueue` / `activeStoryEvent` 競合。
- `processBandStoryEvents()` と `recordBandBattlesAfterLive()` の重複発火。
- Pachi-Pachi / CARBONS / SHELTER のスキル獲得時ノベルと既存ポップアップの優先順。
- UNDER FES前ノベルがチュートリアルやライブ本番に割り込まないか。
