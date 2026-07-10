# CHANGELOG v0.4.0-rc2

対象：スマホブラウザ向けバンド育成SLG『アンダーグラウンド（仮）』
ベース：v0.4.0-rc1

## 目的

Fable5外部RC監査で検出された、SNS人格投稿のシード経路不発を最小修正するRC2。
新機能追加は行わない。

## 修正内容

### SNS人格投稿のシード経路修正

`maybeSeedWorldReactionPosts()` が旧構造の `state.bandBook.discovered` を参照していたため、現行構造 `state.bandBook.bands[id].state` から遭遇済みバンドを取得するように修正。

修正前：

```js
const discovered = Object.keys((state.bandBook || {}).discovered || {}).filter(id => (state.bandBook.discovered || {})[id]);
```

修正後：

```js
const discovered = Object.entries((state.bandBook || {}).bands || {}).filter(([id, e]) => e && e.state && e.state !== "unknown").map(([id]) => id);
```

これにより、図鑑登録/遭遇済みバンドの `band_voice_*` SNS投稿がシード経路でも出るようになる。

## 変更しないもの

- ターン進行
- GRAND条件
- ライブ準備4ステップDOM
- メール返信導線
- チュートリアル導線
- 図鑑解放条件
- バンドイベント発火条件
- 打ち上げイベント
- 通常行動ミニイベント
- スキル効果
- セーブ構造

## バージョン更新

- VERSION：v0.4.0-rc2
- SAVE_VERSION：v0.4.0-rc2
- VERSION.txt：v0.4.0-rc2
- index title：v0.4.0-rc2
- sw cache：underground-v0-4-0-rc2
