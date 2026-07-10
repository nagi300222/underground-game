# AUDIT v0.4.0b-live-prep-steps-draft

## 判定

OK寄り。v0.4.0bはライブ準備4ステップ化のみを対象にした安全実装。

## 確認結果

- `node --check game.js`：OK
- VERSION：OK
- SAVE_VERSION：OK
- VERSION.txt：OK
- index title：OK
- sw cache：OK
- v0.4.0aの5タブ/ホーム導線スモーク：OK
- ライブ準備4ステップ描画：OK
- ステップボタン4個：OK
- 4ステップパネルが同一HTMLに存在：OK
- `.setlistSelect` 5枠存在：OK
- `.positionSelect` 存在：OK
- `.chorusSelect` 存在：OK
- `.merchQtyInput` 存在：OK
- `.merchDigitSelect` 存在：OK
- `performLiveBtn` 存在：OK
- ステップ4で本番ボタン描画：OK

## コード監査メモ

Fable5 docs-only提案で最大リスクとして挙げられていた「ライブ準備DOM分割による静かな事故」を避けるため、全ステップを同一DOMに残した。

CSS上は非表示になるが、DOM上は存在するため、`querySelectorAll()` による既存読取は維持される。

## 触っていない危険領域

- `getPositionMapFromDom()`
- `collectMerchOrdersFromDom()`
- `performLive()`
- `calculateLive()`
- `applyLiveResult()`
- GRAND条件
- ターン進行
- セーブ/ロード正規化

## 既知の実機確認事項

- 非表示ステップのDOM読取はブラウザ仕様上問題ないが、実機で「セトリ/担当/物販が本番結果に反映されるか」は手動確認推奨。
- 下部の前へ/次へボタンはスマホでsticky表示にしているため、画面サイズによっては少し圧迫感がある可能性がある。
- 最終チェックの「直す」ボタンは警告時のみ出るため、正常状態では表示されない。

## 結論

v0.4.0bは次のv0.4.0cへ進行可能。
ただし、v0.4.0cは携帯統合＋チュートリアルでチュートリアルロックとメール/SNS導線に触るため、引き続き単独版として慎重に進めること。
