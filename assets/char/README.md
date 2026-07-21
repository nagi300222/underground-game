# assets/char/ — キャラ画像配置ディレクトリ

ファイルをこのディレクトリに置くだけで、コード変更なしに自動反映されます（3段フォールバック機構、PR-F）。

## 命名規則

`<portraitId>_avatar.webp`（1:1、256×256推奨）／`<portraitId>_story.webp`（3:4、900×1200推奨）

- メンバー: `portraitId` = `member_xxx`（`MEMBER_DATABASE`の`id`と同一。主人公は`player`）
- NPC: `portraitId` = `sil_xxx`（`STORY_SCENE_DATABASE`内の各シーンの`actors[].id`と同一）

## フォールバック順序

1. 画像あり → 表示
2. 画像なし（404） → ステンシルシルエット（パート/type別ミニ版）
3. 型も不明 → イニシャル（現行の代替表示）

ファイルを配置/差し替えるだけで即座に反映されます。ビルド手順・コード変更は不要です。
