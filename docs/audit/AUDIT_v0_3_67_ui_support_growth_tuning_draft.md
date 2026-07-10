# AUDIT v0.3.67-ui-support-growth-tuning-draft

## 実施確認

- node --check game.js：OK
- VMスモーク：OK

## VMスモーク内容

確認した内容：

- 名前付きサポートが11人であること。
- `sup_` から始まる汎用サポートが表示対象に残っていないこと。
- Piano/Synth、Sax/Brass、Percussionサポートが存在すること。
- 旧汎用サポートIDが `livePrepSupportIds` に残っていても正規化で破棄されること。
- メール本文モーダルが描画されること。
- ライブ準備チェックと名前付きサポート契約欄が描画されること。
- DEV GRAND最低値セット後、GRAND条件スナップショットがOKのままであること。

## 監査メモ

- GRAND条件式には触れていない。
- ターン進行処理には触れていない。
- メール返信処理の関数は維持し、表示先のみモーダル化。
- サポート契約は `DATA.supportOptions = clone(SUPPORT_MEMBER_DATABASE)` に統一。
- 旧 `supportAffinity` の余剰キーは残っても参照されないため無害想定。

## 未確認

- スマホ実機での押しやすさ。
- サポート11人表示時のスクロール感。
- メールモーダルの高さ/閉じやすさ。
- 成長タイプ調整後の50Tバランス。
