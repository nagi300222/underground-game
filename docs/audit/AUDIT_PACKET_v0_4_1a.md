# AUDIT PACKET v0.4.1a-visual-foundation-draft

## 監査目的

v0.4.0-rc3から、見た目・導線だけを変更したv0.4.1aで、既存機能や進行不能系が壊れていないか確認する。

## 重点確認

1. 右下固定携帯ボタン
   - どの通常画面でも表示されるか
   - 押すと携帯トップへ戻るか
   - 未読バッジが出るか
   - SNS/メール詳細の途中状態から始まらないか

2. 上部ステータス
   - ターン、資金、ファン、疲労がスマホ幅で読めるか
   - 1〜2文字だけの不自然な改行が出ないか
   - 次予定、知名度、業界評価、未読が破綻しないか

3. 一列スケジュール
   - 現在ターンが見えるか
   - 近いライブ、UNDER、GRANDが見えるか
   - 予定画面への導線が壊れていないか

4. ホーム圧縮
   - 主ボタンが押せると分かるか
   - よく使うメニューから主要機能へ移動できるか
   - ほかのメニューからshop/library/log/phone/bandbookへ到達できるか
   - DEV導線が消えていないか

5. 回帰確認
   - ライブ準備DOM維持
   - 携帯/メール/チュートリアル維持
   - 図鑑/裏話維持
   - SNS世界反応維持
   - 旧セーブ欠損正規化維持
   - 3系統50T通し

## 実行した確認

- `node --check game.js`
- `node audit40a_smoke.js`
- `node audit40b_live_prep.js`
- `node audit40c_phone_tutorial.js`
- `node audit40d_bandbook_lore.js`
- `node audit40e_world_reactions.js`
- `node audit40rc_oldsave.js`
- `node audit40rc_full.js`
- `node audit41a_visual_foundation.js`

## Fable5投入タイミング

この段階では、Fable5へ即投入するより、まず実機で以下を確認するのが効率的。

- 右下携帯ボタンが邪魔でないか
- スマホ幅で資金/ファン/疲労が読めるか
- 1〜2文字改行が出ていないか
- ホーム圧縮で導線が分かりにくくなっていないか

Fable5は、v0.4.1a実機確認後、v0.4.1bへ進む前の「導線・可読性監査」か、v0.4.1-RC前の総合監査に使うのがよい。
