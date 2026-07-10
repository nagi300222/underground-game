# AUDIT v0.3.68-afterparty-events-draft

## 静的確認

- `node --check game.js`: OK
- VERSION / SAVE_VERSION / index title / sw.js cache: v0.3.68表記OK

## VMスモーク

- 初期render: OK
- 通常打ち上げ参加 → 選択イベントへ移行: OK
- 打ち上げ選択UI render: OK
- 選択後 `pendingAfterpartyEvent` 解除: OK
- 結果通知生成: OK
- 対バン交流値増加: OK
- 疲労増加: OK
- 結果確認後ターン進行可能: OK
- 帰る後ターン進行可能: OK
- `stripEphemeralState` で `pendingAfterpartyEvent` 除外: OK
- 初回打ち上げは選択イベント化せず既存演出維持: OK
- 高疲労時もpending解除: OK
- 打ち上げ選択中のポップはキュー退避: OK

## 未確認

- スマホ実機での選択肢ボタンの押しやすさ。
- 打ち上げイベントの文面体感。
- 効果量の50Tバランス影響。
