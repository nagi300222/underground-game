# CHANGELOG v0.4.0-rc1

対象：スマホブラウザ向けバンド育成SLG『アンダーグラウンド（仮）』
ベース：v0.4.0e-world-reactions-draft
目的：v0.4.0a〜e統合後のRC監査版。新機能追加を止め、進行不能系・旧セーブ互換・50T通し・UI回帰を洗い出す。

---

## 1. 変更内容

### 1.1 バージョン更新

- `VERSION`：`v0.4.0-rc1`
- `SAVE_VERSION`：`v0.4.0-rc1`
- `VERSION.txt`：`v0.4.0-rc1`
- `index.html title`：`v0.4.0-rc1`
- `sw.js CACHE_NAME`：`underground-v0-4-0-rc1`

### 1.2 旧セーブ互換の小修正

RC監査中に、極端に古い/欠損したセーブ状態を直接正規化した場合に、以下の新旧フィールド欠けが残る可能性を検出した。

- `snsWorldSeen` がない旧状態
- `logs` がない旧状態
- `liveResultHistory` がない旧状態

通常のロード経路では多くの場合補われるが、RC版では防御的に `normalizeState()` 側で初期化するようにした。

追加した正規化：

```js
if (!state.snsWorldSeen || typeof state.snsWorldSeen !== "object" || Array.isArray(state.snsWorldSeen)) state.snsWorldSeen = {};
if (!Array.isArray(state.logs)) state.logs = [];
if (!Array.isArray(state.liveResultHistory)) state.liveResultHistory = [];
```

---

## 2. 新機能追加について

RC版では新機能追加なし。

v0.4.0a〜eで入れた以下の内容を維持したうえで、監査に集中した。

- v0.4.0a：5タブUI基盤 / ホーム再構成 / CSSトークン
- v0.4.0b：ライブ準備4ステップ化
- v0.4.0c：携帯統合 / 要返信 / チュートリアルカード
- v0.4.0d：図鑑3タブ / 代表者コメント / 裏話
- v0.4.0e：SNS人格化 / メール演出 / 目標カード強化

---

## 3. 確認追加

以下のRC用監査を追加。

- `audit40rc_oldsave.js`
  - 欠損旧セーブの正規化
  - 汎用サポートID除去
  - fixed UNDER/GRAND復元
  - unsafe ephemeral clear
  - 正規化後レンダリング
- `audit40rc_full.js`
  - 低効率/通常/高効率の3系統50T通し
  - ライブ/打ち上げ/ポップ/ノベル/ターン進行ドレイン
  - GRAND後の終了または安全停止
  - unsafe ephemeral 残存なし

