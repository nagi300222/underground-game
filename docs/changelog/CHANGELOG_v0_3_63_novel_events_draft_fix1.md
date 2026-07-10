# CHANGELOG v0.3.63-novel-events-draft-fix1

対象：スマホブラウザ向けバンド育成SLG『アンダーグラウンド（仮）』
土台：v0.3.63-novel-events-draft

## 監査サマリ

重点4項目（新ノベルの発火タイミング / popupQueue×activeStoryEvent競合 /
図鑑・交流値・スキル処理の退行 / スマホUI）を、VM上の実挙動テストで監査。
退行なし。実バグ3件を修正した。

## 修正した問題

1. **スキル獲得ノベルとスキル獲得ポップの二重通知**
   BAND_EVENT_STORY_MAPで接続されたスキル獲得イベント（弾ける甘味 / ダイヤの原石 /
   ロック魂）で、ノベルの結果表示に加えて grantBandSkill 由来の「交流スキル獲得」
   ポップアップも後から表示されていた。ノベル再生が確定している場合はスキルポップを
   抑制するよう修正（ログは維持）。ノベルを再生できない場合（別ノベル再生中・ノベルOFF）は
   従来どおりスキルポップにフォールバックすることを検証済み。

2. **UNDER FES前ノベルがライブ当日の準備画面に割り込む**
   28Tにライブを予約していると、当日の準備画面にUNDER FES前夜ノベルが被さっていた。
   ライブ当日は発火せず、28〜29Tの非ライブ日に繰り下げるよう修正
   （フラグは発火時のみ消費。28T・29T両方ライブの場合は再生されない＝仕様として許容）。

3. **DEVノベル任意再生時の空セリフ**
   member_join_generic の担当差分文（{partLine}/{partFlavor}）がDEV再生時に空欄になり、
   主人公の空セリフが1枚表示されていた。DEVのサンプルコンテキストを
   memberJoinStoryContext 再利用で補完。bandName/skillName/rank も追加。

## 問題なしと確認した点

- under_fes_before のフラグ先行消費疑い：maybeTriggerStoryEvents 冒頭の
  activeStoryEvent ガードにより保護されており、別ノベル再生中はフラグ未消費で持ち越し。
- Pachi-Pachi初戦ノベル：recordBandBattlesAfterLive 経由で発火し、図鑑登録・交流値・
  battleCount の適用と共存（二重付与なし）。
- pendingMailAction（fix2のメール返信導線）：確認ポップ中のセーブ拒否・ロード時破棄・
  承諾で予定表追加・キャンセル経路すべて正常。ポップキュー/ノベルとの競合ガードも網羅済み。
- 27Tでは発火しない／29Tへの繰り下げ発火を確認。
- 回帰：3系統（ノベルON/OFF・バンドシステムOFF）50T完走、旧セーブ移行、
  交流スキル獲得・Lv・上限変換、SHELTER接続、全ビュー描画。

## 既知の制限（次版送り）

- CARBONSとPachi-Pachiの「初対バン」が同一ライブで同時発生した場合、ノベルは片方
  （CARBONS優先）のみ再生。もう片方の効果・図鑑登録は適用されるが演出はスキップされる。
- BAND_EVENT_STORY_MAP の event_pachi_pachi_first_battle エントリは現状未使用
  （battle型はrecordBandBattles直結のため）。動作に影響なし。
- スマホ実機での見え方（fix2でボタン位置を58px上げた新レイアウト）は未確認。
