# AUDIT_PACKET v0.4.0-rc1

対象：v0.4.0-rc1
目的：v0.4.0a〜e統合後のRC監査。新機能追加なし。

---

## 重点確認

1. 進行不能系
   - 1T〜5T初ライブ
   - ライブ準備4ステップ
   - ライブ結果→打ち上げ→次ターン
   - ノベル/ポップ/メール/打ち上げイベントの重なり
   - 50T GRAND後の終了/継続導線

2. 旧セーブ互換
   - `snsWorldSeen` 欠け
   - `logs` 欠け
   - `liveResultHistory` 欠け
   - 旧汎用サポートID `sup_` 残存
   - fixed UNDER/GRAND復元

3. UI回帰
   - 5タブ入口
   - ホーム主ボタン
   - ライブ準備4ステップ
   - 携帯トップ/要返信
   - 図鑑3タブ
   - メール演出
   - 目標カード

4. 変更禁止領域
   - GRAND条件変更なし
   - ターン進行ルール変更なし
   - コピー曲ガード変更なし
   - メール返信確定処理変更なし
   - `performLive()` / `getPositionMapFromDom()` / `collectMerchOrdersFromDom()` 変更なし

---

## 実行済み監査

- `node --check game.js`
- `audit40a_smoke.js`
- `audit40b_live_prep.js`
- `audit40c_phone_tutorial.js`
- `audit40d_bandbook_lore.js`
- `audit40e_world_reactions.js`
- `audit40rc_oldsave.js`
- `audit40rc_full.js`

---

## Fable5へ投げる場合の観点

Fable5には、コード実装ではなく外部RC監査として投げる。

- v0.3.74→v0.4.0-rc1の差分精読
- UI大改修に伴うDOM/class/id破壊がないか
- ライブ準備4ステップのDOM読取が安全か
- チュートリアルカード/携帯/メール導線に進行不能がないか
- 旧セーブ互換で落ちないか
- 50T通しで進行不能がないか
- fix必須のコード欠陥と、次版でよいUX/バランス提案を分ける

