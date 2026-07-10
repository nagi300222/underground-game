# AUDIT PACKET v0.4.0d-bandbook-lore-draft

## 監査対象

`v0.4.0d-bandbook-lore-draft`

## 今回の変更範囲

- BAND_LORE_DATABASE 追加
- バンド図鑑詳細3タブ化
- 代表者コメント22組
- 優先8組×裏話2本 = 16本
- lore参照整合チェック追加
- 図鑑タブ用CSS追加

## 変更禁止・退行確認対象

- 0.4.0a：5タブ入口 / ホーム主ボタン / 文脈ボタン
- 0.4.0b：ライブ準備4ステップ / DOM直接読取class維持
- 0.4.0c：携帯トップ / 要返信 / メール返信後予定遷移 / チュートリアルカード
- 0.3系：ターン進行 / GRAND条件 / メール導線 / 打ち上げ / 通常行動イベント / バンドイベント / スキル効果

## 実行した確認

- `node --check game.js`
- `audit40a_smoke.js`
- `audit40b_live_prep.js`
- `audit40c_phone_tutorial.js`
- `audit40d_bandbook_lore.js`

## 重点監査ポイント

1. BAND_DATABASE 22組維持。
2. BAND_LORE_DATABASE が全22組分ある。
3. 優先8組×2本の裏話がある。
4. lore entry の id/title/text 欠けなし。
5. 図鑑詳細で3タブが表示される。
6. コメントは遭遇後に表示される。
7. 交流30で裏話1、交流60で裏話2が解放される。
8. 裏話未実装バンドでも表示が壊れない。
9. 0.4.0a〜cの導線が壊れていない。
10. ライブ準備DOM読取classが維持されている。

## 結果

確認範囲では進行不能・保存破壊・ターン進行退行なし。
