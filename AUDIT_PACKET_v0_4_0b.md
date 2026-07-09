# AUDIT PACKET v0.4.0b-live-prep-steps-draft

## 監査対象

v0.4.0a-ui-foundation-draft → v0.4.0b-live-prep-steps-draft

## 主な変更範囲

- `renderLivePrep()`
- `renderLivePrepCheckPanel()`
- ライブ準備ステップ関連ヘルパー追加
  - `livePrepStepMeta()`
  - `currentLivePrepStep()`
  - `renderLivePrepStepNav()`
  - `renderLivePrepStepControls()`
  - `renderLivePrepStepPanel()`
- `bindEvents()` にステップ移動ボタン結線を追加
- `style.css` にライブ準備ステップUI用CSSを追加
- VERSION / SAVE_VERSION / index title / sw cache更新

## 最重要監査観点

ライブ準備ステップ化によって、DOM直接読取が壊れていないか。

特に以下を必ず確認する。

- `.setlistSelect` が5枠DOMに存在する。
- `.positionSelect` がDOMに存在する。
- `.chorusSelect` がDOMに存在する。
- `.merchQtyInput` がDOMに存在する。
- `.merchDigitSelect` がDOMに存在する。
- 非表示ステップの要素もDOMから消えていない。
- `performLive()` は従来通りDOMから値を読める。

## 実装上の安全方針

- ステップ切替はCSS表示切替方式。
- 描画自体をステップごとに分割していない。
- 既存class/idは改名していない。
- ライブ本番処理には触れていない。
- 物販/担当/セトリの読取関数には触れていない。

## 実行確認

- `node --check game.js`
- `node audit40a_smoke.js`
- `node audit40b_live_prep.js`

## 実機確認ポイント

- ステップナビが押しやすいか。
- ①セトリ → ②担当 → ③サポート/物販 → ④最終チェック の流れが自然か。
- 最終チェックの「直す」ボタンで該当ステップへ戻れるか。
- スマホでステップ下部ボタンが邪魔すぎないか。
- ライブ本番へ進んだ時、セトリ/担当/サポート/物販が反映されているか。
