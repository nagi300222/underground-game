# ChatGPT 二重監査メモ v0.4.1c-livehouse-draft

## 判定
OK寄り。v0.4.1-RC候補として扱ってよい。ただし、CSS全面テーマ差し替えのため、実機での可読性確認を1周してからRC化推奨。

## 実施確認
- ZIP展開：OK
- VERSION.txt：v0.4.1c-livehouse-draft
- game.js VERSION：OK
- SAVE_VERSION：OK
- index.html title：OK
- sw.js cache：OK
- node --check game.js：OK
- v0.4.1aとの差分確認：game.jsはVERSION/SAVE_VERSIONと文言差し替え中心、主要ロジック変更なし
- VMスモーク：ホーム描画、上部ステータス、週の流れ、右下携帯、携帯トップ、ライブ準備4ステップDOMを確認
- 保護対象関数比較：performLive / calculateLive / getPositionMapFromDom / collectMerchOrdersFromDom / renderOverlays / stripEphemeralState / clearEphemeralStateAfterLoad / hasUnsafeEphemeralStateForSave / normalizeState はv0.4.1aと同一
- ターン進行系比較：schedulePendingTurnAdvance / finishPendingTurnAdvance / runCommandTurn / postTurnMaintenance / processNewTurnNotifications / maybeFinishPendingTurnAdvanceAfterPopups / hasBlockingPopupBeforeTurnAdvance はv0.4.1aと同一
- 保護DOM class/id出現数：setlistSelect / positionSelect / chorusSelect / merchQtyInput / merchDigitSelect はv0.4.1aと一致

## 軽微な指摘
- Fable5提出版ZIPには `CHANGELOG_v0_4_1c...` が見当たらなかったため、本チェック済み版に追加した。
- GitHub Pages対策として `.nojekyll` を同梱した。
- 320px実機の折返し、紙面上の文字色、ライブ結果スタンプ被りは自動確認ではなく目視必須。

## 実機確認優先箇所
1. ホーム：375pxで主ボタン・週の流れ・メニューが読めるか
2. 右下携帯：押しやすいか、邪魔でないか
3. ライブ準備：セトリ紙上のselect/inputが読めるか
4. バンド図鑑：既知/未遭遇/詳細3タブの文字色が読めるか
5. ライブ結果：ランクスタンプが本文やボタンに被らないか
