# AUDIT v0.3.69-action-mini-events-draft

## 静的確認

- `node --check game.js`: OK
- VERSION / SAVE_VERSION / index title / sw.js cache: v0.3.69表記OK

## VMスモーク

- VERSION: OK
- 休憩イベント発生率0: OK
- UNDER前・ステータス条件で練習イベント率上昇: OK
- 強制乱数で練習ミニイベント発生: OK
- 練習ミニイベント効果反映: OK
- 休憩は強制乱数でもイベントなし: OK
- 通常行動後、結果モーダルとターン進行予約あり: OK
- v0.3.68打ち上げ選択イベント維持: OK
- 打ち上げ選択解決維持: OK
- `pendingAfterpartyEvent`保存除外維持: OK

## 未確認

- スマホ実機でのイベント頻度体感。
- 50T通しでの数値インフレ。
- 台本文面の最終調整。
