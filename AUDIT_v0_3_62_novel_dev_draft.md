# AUDIT v0.3.62-novel-dev-draft

## 静的確認

- VERSION：v0.3.62-novel-dev-draft
- SAVE_VERSION：v0.3.62-novel-dev-draft
- Service Worker cache：underground-v0-3-62-novel-dev-draft
- node --check game.js：OK

## ノベルイベント確認

- `STORY_SCENE_DATABASE` 追加：OK
- `startStoryEvent()`：OK
- `advanceStoryEvent()`：OK
- `skipStoryEvent()`：OK
- `renderStoryEventOverlay()`：OK
- `activeStoryEvent` はセーブ対象から除外：OK
- ロード時に `activeStoryEvent` 破棄：OK
- `showEventPopup()` はノベルイベント中にpopupQueueへ退避：OK

## 開発用モード確認

- ホームからDEVへ遷移：OK
- チュートリアル制限中でもDEVへ遷移できるよう調整：OK
- 指定ターン移動：OK
- ステータス編集：OK
- イベント再生：OK
- 加入候補追加：OK
- 通常募集実行：OK
- 7曲補充：OK
- 一時モーダル破棄：OK

## 注意点

- DEVは制作中アプリ用。正式公開前は `ENABLE_DEV_MODE = false` にする。
- ノベルイベントはまだ5本の雛形。全既存イベントの置き換えではない。
- シルエットはCSS生成の仮素材。キャラ固有差分は後続版で追加。
