# CHANGELOG v0.3.66-balance-draft

対象：スマホブラウザ向けバンド育成SLG『アンダーグラウンド（仮）』

## 目的

v0.3.64の成長タイプ実効果と、v0.3.65相当の他バンドイベント土台を含めて、Fable5総合監査に出せる状態へ整える。
この版では本格的なバランス決定ではなく、基準表・シミュレーション計画・DEV補助を先に作る。

## 追加内容

### 1. バージョン更新

- `VERSION.txt`：`v0.3.66-balance-draft`
- `game.js VERSION`：`v0.3.66-balance-draft`
- `SAVE_VERSION`：`v0.3.66-balance-draft`
- `index.html title`：`v0.3.66-balance-draft`
- `sw.js cache`：`underground-v0-3-66-balance-draft`

### 2. GRAND条件チェック補助

`grandConditionSnapshot()` と `formatGrandConditionSnapshot()` を追加。

チェック対象：

- 直近A評価以上
- 直近総合80以上
- ファン180以上
- 知名度135以上
- 業界評価118以上
- オリジナル7曲以上
- 代表/定番3曲以上
- 新しめ1曲以上

### 3. DEV補助追加

DEV画面に `v0.3.66 バランス確認` カードを追加。

追加ボタン：

- `GRAND条件チェック`
- `UNDER目安セット`
- `GRAND最低値セット`
- `GRAND注目枠セット`
- `主要バンドイベント土台セット`

### 4. 仮バランスプロファイル

`BALANCE_BASELINE_PROFILES` を追加。

- `under_border`：30T UNDER目安
- `grand_border`：50T GRAND最低条件
- `grand_strong`：50T GRAND注目枠目安

### 5. 主要バンドイベント確認補助

`devPrepareBandEventSeed()` を追加。

優先8組の図鑑登録、前提フラグ、対バン回数を仮セットし、ノベルイベント再生やイベント発火確認をしやすくした。

## 維持仕様

- 50T制
- 5T初ライブ
- 30T UNDER FES
- 50T GRAND UNDER FES
- GRAND条件：A評価、総合80、ファン180、知名度135、業界評価118、オリジナル7、代表/定番3、新しめ1
- 作詞/作曲/曲完成/曲強化ではターン進行しない
- 通常行動 / ライブ / 打ち上げ / ドタキャンのみターン進行対象
- 加入候補36人
- 名前変更
- Gt/Vo・Ba/Vo
- 名前付きサポート候補8人
- バンド図鑑22組
- 交流スキル
- DEVモード
- コピー曲ガード
- エンディング後「このまま続ける」

## 確認

- `node --check game.js` OK
- VM簡易ロード OK
- バンドDB22組維持
- 加入候補growthType 36件維持
- `BAND_EVENT_STORY_MAP` の参照先イベント/シーン欠けなし

