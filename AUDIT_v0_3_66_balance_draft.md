# AUDIT v0.3.66-balance-draft

対象：スマホブラウザ向けバンド育成SLG『アンダーグラウンド（仮）』

## 確認環境

- 静的コード確認
- `node --check game.js`
- Node VMによる簡易ロード
- 正規表現によるDB件数/参照欠け確認

実機スマホ手動50T通しではありません。

## 結果

OK寄り。

## 確認内容

### バージョン

- `VERSION.txt`：`v0.3.66-balance-draft`
- `game.js VERSION`：`v0.3.66-balance-draft`
- `SAVE_VERSION`：`v0.3.66-balance-draft`
- `index.html title`：`v0.3.66-balance-draft`
- `sw.js cache`：`underground-v0-3-66-balance-draft`

### 静的構文

- `node --check game.js`：OK

### VM簡易ロード

- `game.js` の簡易ロード：OK

### DB維持

- バンドDB：22組維持
- 加入候補growthType：36件維持
- `BAND_EVENT_STORY_MAP`：参照先イベント欠けなし
- `BAND_EVENT_STORY_MAP`：参照先ノベルシーン欠けなし

## 追加確認ポイント

- v0.3.65相当の追加イベントは、土台として小さく実装。
- v0.3.66相当のバランス補助はDEV専用。
- GRAND条件の本体条件は、既存のA評価/総合80/ファン180/知名度135/業界評価118/オリジナル7/代表定番3/新しめ1から変更していない。
- 作詞/作曲/曲完成/曲強化のターン進行ルールには触れていない。

## 未確認

- スマホ実機でのDEVカード表示
- 追加ノベル10本のスマホ実機表示
- 50T通しバランス
- Fable5総合監査

## Fable5へ回す時の注意

今回の版は「土台」なので、Fable5には以下の観点で投げるのがよい。

- 進行不能・保存破壊・参照欠けがないか
- 成長タイプ補正が強すぎないか
- 追加バンドイベントが発火しない/発火しすぎる状態になっていないか
- DEV補助が既存のチュートリアル/ライブ/ノベル進行を壊していないか

