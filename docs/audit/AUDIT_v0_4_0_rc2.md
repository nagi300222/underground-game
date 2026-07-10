# AUDIT v0.4.0-rc2

## 結論

v0.4.0-rc2は、Fable5外部監査で検出されたSNS人格投稿のシード経路不発のみを修正した最小RC。
こちらの静的確認・VMスモーク・50T通しでは、進行不能系の退行は検出なし。

## 修正対象

### `maybeSeedWorldReactionPosts()`

旧構造 `state.bandBook.discovered` 参照を、現行構造 `state.bandBook.bands` 参照へ変更。

これにより、遭遇済み/図鑑登録済みバンドの `band_voice_*` 投稿がシード経路でも発火する。

## 確認結果

### 静的確認

- `node --check game.js`：OK
- VERSION：OK
- SAVE_VERSION：OK
- VERSION.txt：OK
- index title：OK
- sw cache：OK

### 回帰確認

- v0.4.0a UI基盤スモーク：OK
- v0.4.0b ライブ準備DOM維持：OK
- v0.4.0c 携帯/チュートリアル：OK
- v0.4.0d 図鑑/裏話：OK
- v0.4.0e 世界観演出：OK
- 旧セーブ欠損正規化：OK
- 3系統50T通し：OK

### 修正確認

- `met` バンドの人格投稿がシードされる：OK
- `discovered` バンドの人格投稿がシードされる：OK
- `unknown` バンドはシードされない：OK
- 二重呼びで重複増殖しない：OK

## 残件

以下はFable5外部監査で「次版提案」とされたもの。rc2では対応しない。

1. T5チュートリアルカードはliveModeで実質表示されない死に分岐。
2. 携帯内図鑑→詳細→戻るの文脈ズレ。
3. band_voice本文がシード経路とライブ反応経路で同文になりうる。

## 判定

v0.4.0-rc2は実機確認へ回してよい。
