# AUDIT v0.3.66-balance-draft-fix1

対象：`v0.3.66-balance-draft-fix1`

## 監査目的

v0.3.64成長タイプ、v0.3.65他バンドイベント土台、v0.3.66バランス補助を含む最新版について、スマホ実機確認へ回す前のこちら側デバッグを行った。

## 実施した確認

### 1. ZIP展開・基本ファイル

- ZIP展開：OK。
- `index.html`：存在。
- `game.js`：存在。
- `style.css`：存在。
- `manifest.json`：存在。
- `sw.js`：存在。
- `VERSION.txt`：存在。

### 2. バージョン確認

- `VERSION.txt`：`v0.3.66-balance-draft-fix1`
- `game.js VERSION`：`v0.3.66-balance-draft-fix1`
- `SAVE_VERSION`：`v0.3.66-balance-draft-fix1`
- `index.html title`：fix1表記
- `sw.js cache`：`underground-v0-3-66-balance-draft-fix1`

### 3. 構文確認

- `node --check game.js`：OK。

### 4. DB整合性

- 加入候補：36人。
- 名前付きサポート候補：8人。
- バンドDB：22組。
- 成長タイプ：全加入候補が有効な `growthType` を保持。
- バンドイベント：全イベントの `bandId` が `BAND_DATABASE` に存在。
- バンドイベント：全 `unlockSkillId` が `BAND_SKILL_DATABASE` に存在。
- `BAND_EVENT_STORY_MAP`：イベントID参照欠けなし。
- `BAND_EVENT_STORY_MAP`：ノベルシーンID参照欠けなし。

### 5. ノベル簡易確認

- `STORY_SCENE_DATABASE` 20件を簡易レンダリング。
- `undefined` 表示なし。
- `{memberName}` / `{partLine}` / `{partFlavor}` などの未補完表示なし。
- DEV再生用の加入イベント文脈も確認。

### 6. 進行スモーク

- 新規状態で固定ライブ5T/30T/50T存在：OK。
- 練習実行で `actionResultModal` 生成：OK。
- 結果OK後、ポップ処理を挟んで1T→2Tへ進行：OK。
- 曲作り系によるターン進行の再発は検出なし。

### 7. DEV補助

- `GRAND最低値セット` 後、GRAND条件チェックが全OKになることを確認。
- `主要バンドイベント土台セット` 後、以下8組が図鑑登録されることを確認。
  - Triple Arrows
  - CARBONS
  - Pachi-Pachi
  - SHELTER
  - Kiwi
  - magnet wolf
  - KAEDE
  - LACT

## 重要維持仕様の確認

- 50T制：維持。
- 5T初ライブ：維持。
- 30T UNDER FES：維持。
- 50T GRAND UNDER FES：維持。
- GRAND条件：現行仕様維持。
- 作詞/作曲/曲完成/曲強化ではターン進行しない方針：維持。
- 通常行動/ライブ/打ち上げ/ドタキャンのみターン進行対象：維持。
- 加入候補36人：維持。
- 名前変更：維持。
- Gt/Vo・Ba/Vo：維持。
- 名前付きサポート8人：維持。
- バンド図鑑：維持。
- 交流スキル：維持。
- DEVモード：維持。
- メール返信導線：維持。
- コピー曲ガード：維持。
- エンディング後「このまま続ける」：維持。

## 未確認・実機で見ること

- スマホ実機での初回起動。
- PWA/service worker更新時に旧キャッシュが残らないか。
- DEV画面のカード表示崩れ。
- ノベルUIの次へ/スキップ/OKボタン位置。
- 追加ノベル10本の再生。
- 5T初ライブ、30T UNDER、50T GRAND周辺の画面遷移。

## 判定

大きな参照欠け・構文エラー・即時進行不能は確認されなかった。
`v0.3.66-balance-draft-fix1` はスマホ実機確認へ回してよい。
