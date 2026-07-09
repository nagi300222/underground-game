# CHANGELOG v0.4.0d-bandbook-lore-draft

対象：スマホブラウザ向けバンド育成SLG『アンダーグラウンド（仮）』
ベース：v0.4.0c-phone-tutorial-draft

## 目的

v0.4.0企画の「図鑑強化」段階として、バンド図鑑を今後の世界観拡張の受け皿にする。
進行不能リスクを避けるため、今回は静的データと表示タブ追加を中心にし、ライブ進行・ターン進行・イベント発火制御には触れない。

## 追加内容

### 1. BAND_LORE_DATABASE 追加

- 全22組に代表者コメント枠を追加。
- 優先8組に裏話を2本ずつ追加。
  - Kiwi
  - Triple Arrows
  - CARBONS
  - magnet wolf
  - Pachi-Pachi
  - SHELTER
  - KAEDE
  - LACT
- 裏話は `needRelation` / `needEvent` で段階解放。
- セーブ拡張なし。既存の交流値・イベント既読・flagsを参照するだけ。

### 2. バンド図鑑詳細を3タブ化

- プロフィール
- コメント
- 裏話

既存の図鑑詳細を壊さず、プロフィールを既存情報の置き場として維持。
コメント/裏話は世界観拡張の読み物枠として追加。

### 3. 解放条件表示

- 未遭遇バンドは従来通り非表示。
- コメントは遭遇後に表示。
- 裏話は交流30 / 交流60 などで段階解放。
- 未解放時は条件だけ表示し、本文は伏せる。
- 裏話未実装のバンドはプレースホルダー表示。

### 4. 図鑑DB整合チェック拡張

`validateBandDatabases()` に lore レコード確認を追加。

- 既存バンドに lore レコードがない場合は警告。
- lore entry の id/title/text 欠けを警告。

## 触っていないもの

- ライブ準備DOM読取
- `performLive()`
- `getPositionMapFromDom()`
- `collectMerchOrdersFromDom()`
- ターン進行
- GRAND条件
- メール返信導線
- 打ち上げイベント
- 通常行動ミニイベント
- バンドイベント発火条件
- スキル効果
- セーブ/ロードの危険一時状態管理

## バージョン更新

- VERSION: `v0.4.0d-bandbook-lore-draft`
- SAVE_VERSION: `v0.4.0d-bandbook-lore-draft`
- index.html title 更新
- sw.js CACHE_NAME 更新
- VERSION.txt 更新
