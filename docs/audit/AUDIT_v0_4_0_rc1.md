# AUDIT v0.4.0-rc1

対象：v0.4.0-rc1
ベース：v0.4.0e-world-reactions-draft
確認方法：ZIP展開 / 静的確認 / VMスモーク / 旧セーブ欠損テスト / 3系統50T通し

---

## 1. 総合判定

**判定：RCとしてFable5外部監査へ進めてよい。**

こちらの監査では、進行不能・保存破壊・ターン進行退行・GRAND条件退行は検出されなかった。

RC監査中に、極端に欠損した旧セーブ相当状態で `snsWorldSeen` / `logs` / `liveResultHistory` の初期化が不足する可能性を検出したため、`normalizeState()` に防御正規化を追加して修正済み。

---

## 2. バージョン確認

- `VERSION.txt`：v0.4.0-rc1
- `game.js VERSION`：v0.4.0-rc1
- `SAVE_VERSION`：v0.4.0-rc1
- `index.html title`：v0.4.0-rc1
- `sw.js CACHE_NAME`：underground-v0-4-0-rc1
- `node --check game.js`：OK

---

## 3. 実行済みスモーク

### v0.4.0a UI基盤

- 5タブ描画 OK
- ホーム主ボタン OK
- 予定ミニライン OK
- 管理メニュー OK
- 旧viewへの文脈導線 OK

### v0.4.0b ライブ準備4ステップ

- ステップナビ OK
- 4ステップパネル同一DOM OK
- `.setlistSelect` 5枠 OK
- `.positionSelect` OK
- `.chorusSelect` OK
- `.merchQtyInput` OK
- `.merchDigitSelect` OK
- 本番ボタン OK

### v0.4.0c 携帯/チュートリアル

- T1チュートリアルカード OK
- 携帯トップ要返信 OK
- 携帯内バンド図鑑 OK
- T3宣伝SNS導線 OK
- ライブ招待承認→予定タブ遷移 OK
- `pendingMailAction` 保存除外 OK

### v0.4.0d 図鑑強化

- BAND_DATABASE 22組 OK
- BAND_LORE_DATABASE 22組 OK
- 優先8組×裏話2本 OK
- 図鑑3タブ OK
- 交流30/60境界 OK

### v0.4.0e 世界観演出

- 目標カード OK
- メール差出人アイコン/種別チップ OK
- GRAND/LACT SNS 一度だけ追加 OK
- ライブ後SNS反応 OK
- 新規危険一時状態なし OK

---

## 4. RC追加監査

### 旧セーブ欠損テスト

`audit40rc_oldsave.js`：PASS

確認内容：

- `phoneMails` 正規化 OK
- `snsPosts` 正規化 OK
- `snsWorldSeen` 正規化 OK
- `bandBookDetailTab` 正規化 OK
- 旧汎用サポートID除去 OK
- fixed UNDER/GRAND復元 OK
- unsafe ephemeral clear OK
- 正規化後レンダリング OK

### 3系統50T通し

`audit40rc_full.js`：PASS

確認内容：

- 低効率系：T50到達 / GRAND後安全終了 / unsafe ephemeralなし
- 通常系：T50到達 / GRAND後安全終了 / unsafe ephemeralなし
- 高効率系：T50到達 / GRAND後安全終了 / unsafe ephemeralなし

※このVM通しは進行不能検出用であり、到達率や数値バランスの統計評価ではない。

---

## 5. バグ洗い出し結果

### 修正済み

1. `snsWorldSeen` 欠損旧セーブの防御正規化不足
   - 影響：極端に欠損した旧セーブ/外部テスト状態で、世界SNS既読管理が未初期化のまま残る可能性。
   - 修正：`normalizeState()` で `{}` 初期化。

2. `logs` 欠損旧セーブの防御正規化不足
   - 影響：極端に欠損した旧セーブ/外部テスト状態でホーム描画時に `state.logs[0]` 参照が落ちる可能性。
   - 修正：`normalizeState()` で `[]` 初期化。

3. `liveResultHistory` 欠損旧セーブの防御正規化不足
   - 影響：極端に欠損した旧セーブ/外部テスト状態で目標カード描画時に `.length` 参照が落ちる可能性。
   - 修正：`normalizeState()` で `[]` 初期化。

### 未修正の既知注意点 / Fable5で見てほしい点

1. 実機スマホでの5タブ＋ホーム主ボタンの視認性
2. ライブ準備4ステップで、非表示ステップの入力が実機ブラウザで保持されるか
3. メール承認後の予定タブ遷移が体感として自然か
4. SNS投稿が増えた場合のスクロール量
5. 図鑑3タブの文字量と押しやすさ
6. LACT演出はSNS表示のみ。ノベル例外フックは未実装で正しいか

---

## 6. Fable5投入タイミング

**推奨：この v0.4.0-rc1 をFable5に外部監査として投げる。**

理由：

- v0.4.0a〜eの段階実装が揃った
- こちら側で発見した旧セーブ欠損系は修正済み
- 新機能追加は止めたRC状態
- Fable5には「実装」ではなく「差分精読＋進行不能系監査＋fix要否判断」を頼める

Fable5後に必要なら `v0.4.0-rc1-fix1` を作る。

