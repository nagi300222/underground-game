# AUDIT v0.4.0a-ui-foundation-draft

## 確認結果
- `node --check game.js`：OK。
- VERSION / SAVE_VERSION / index title / sw cache：v0.4.0a 表記。
- 旧viewキーは維持。
- renderMainContent分岐は維持。
- 5タブ入口は `home` / `command` / `schedule` / `phone` / `band` のみ。
- 文脈ボタンから `songs` / `shop` / `library` / `bandbook` / `log` / `dev` に到達可能。
- ライブ準備DOM読取系には未着手。
- 新規一時状態なし。
- セーブ互換に影響するstate追加なし。

## 注意
- v0.4.0aはUI入口再配置とホーム導線整理のみ。
- ライブ準備4ステップ化はv0.4.0bで、CSS表示切替方式を厳守する。
