# CHANGELOG v0.4.0b-live-prep-steps-draft

## 目的

v0.4.0企画準備で定めた「ライブ準備4ステップ化」を、DOM直接読取を壊さない安全方式で実装した。

## 変更内容

- VERSION / SAVE_VERSION / index title / sw cache を `v0.4.0b-live-prep-steps-draft` に更新。
- ライブ準備画面を4ステップ型に整理。
  1. セトリ
  2. 担当
  3. サポート/物販
  4. 最終チェック
- ステップナビと前へ/次へボタンを追加。
- 最終チェックの警告に「直す」ボタンを追加し、該当ステップへ戻れるようにした。
- スマホ向けにステップナビ/下部操作ボタンのCSSを追加。
- v0.4.0aの5タブ入口・ホーム再構成・CSSトークン土台は維持。

## 重要な実装方針

ライブ準備ステップ化はDOMを分割せず、同一DOM内に全ステップを描画し、CSSの `display` 切替だけで見せ方を分割した。

これにより、以下の既存DOM直接読取を維持している。

- `.setlistSelect`
- `.positionSelect`
- `.chorusSelect`
- `.merchQtyInput`
- `.merchDigitSelect`
- `getPositionMapFromDom()`
- `collectMerchOrdersFromDom()`

## 変更していないもの

- GRAND条件
- ターン進行ルール
- performLive本体
- calculateLive本体
- セトリ読取仕様
- 担当読取仕様
- 物販読取仕様
- メール導線
- 打ち上げイベント
- 通常行動ミニイベント
- バンドイベント
- スキル効果
- 旧セーブ正規化
