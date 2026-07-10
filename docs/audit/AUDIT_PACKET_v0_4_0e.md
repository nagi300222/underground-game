# AUDIT_PACKET v0.4.0e-world-reactions-draft

## 対象
`v0.4.0e-world-reactions-draft`

## 主な確認対象
- SNS人格化。
- メール演出強化。
- 目標カード強化。
- LACT/GRAND周辺のSNS演出。
- v0.4.0a〜d回帰。

## 重点リスク
1. 新規SNS投稿が毎ターン無限増殖しないか。
2. LACT演出が50Tライブ/エンディング/打ち上げ導線を止めないか。
3. メール演出強化で返信ボタンや予定遷移が壊れていないか。
4. ホーム目標カードがチュートリアル/5タブ導線を邪魔しないか。
5. `snsWorldSeen` が危険一時状態扱いになっていないか。

## 確認項目
- `node --check game.js`
- VERSION / SAVE_VERSION / title / sw cache
- v0.4.0a UI基盤スモーク
- v0.4.0b ライブ準備DOM維持スモーク
- v0.4.0c 携帯/チュートリアルスモーク
- v0.4.0d 図鑑/裏話スモーク
- v0.4.0e 世界観演出スモーク

## 変更禁止領域
- GRAND条件。
- ターン進行ルール。
- ライブ準備DOM class/id。
- メール返信確定処理。
- 打ち上げイベント進行。
- 旧セーブ破壊。
