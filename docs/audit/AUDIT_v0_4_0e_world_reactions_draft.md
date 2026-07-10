# AUDIT v0.4.0e-world-reactions-draft

## 結論
OK寄り。進行不能系の新規リスクは低い。

今回の世界観演出は、SNS/メール/ホームカードの表示・軽い保存データ追加に限定しており、新規オーバーレイ状態、ターン進行ブロック、ライブ本番処理の変更は行っていない。

## 静的確認
- `node --check game.js`：OK
- `VERSION.txt`：`v0.4.0e-world-reactions-draft`
- `game.js VERSION`：OK
- `SAVE_VERSION`：OK
- `index.html title`：OK
- `sw.js CACHE_NAME`：OK

## 回帰確認

### v0.4.0a UI基盤
- 5タブ描画：OK
- ホーム主ボタン：OK
- 予定ミニライン：OK
- 管理メニュー：OK
- 文脈ボタン：OK

### v0.4.0b ライブ準備
- ステップナビ：OK
- `.setlistSelect` 5枠：OK
- `.positionSelect`：OK
- `.chorusSelect`：OK
- `.merchQtyInput`：OK
- `.merchDigitSelect`：OK
- 本番ボタン：OK

### v0.4.0c 携帯/チュートリアル
- T1チュートリアルカード：OK
- 携帯要返信：OK
- 携帯内図鑑入口：OK
- T3宣伝SNS導線：OK
- メール返信後予定タブ遷移：OK
- `pendingMailAction` 保存除外：OK

### v0.4.0d 図鑑
- BAND_DATABASE 22組維持：OK
- BAND_LORE_DATABASE 22組：OK
- 優先8組×2本：OK
- コメント/裏話タブ：OK
- 交流30/60境界：OK

## v0.4.0e新規確認
- ホームに `goal-pulse-card` 描画：OK
- メール一覧の `mail-row-enhanced`：OK
- 差出人アイコン：OK
- メール種別チップ：OK
- GRAND前SNS投稿が一度だけ追加：OK
- SNS spotlight がLACT/GRANDトーンへ変化：OK
- ライブ後の高評価反応SNS：OK
- 対バン声SNS：OK
- GRANDライブ時のLACT袖反応SNS：OK
- `snsWorldSeen` は通常保存データ：OK
- 新規危険一時状態なし：OK

## 注意
- LACT専用演出はSNS演出に限定。ノベルや50T固定ライブ例外フックはまだ追加していない。
- 0.4.0-RC前に、50T GRAND本番→結果→打ち上げ→エンディングの通しを再確認すること。
