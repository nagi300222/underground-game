# AUDIT v0.3.64-growth-type-draft

対象：スマホブラウザ向けバンド育成SLG『アンダーグラウンド（仮）』
土台：v0.3.63-novel-events-draft-fix1

## 確認方法

- ZIP展開後の静的コード確認。
- `node --check game.js`。
- VERSION / SAVE_VERSION / index title / sw.js cache の表記確認。
- growthType関連関数・練習処理・ライブ後成長処理のgrep確認。

## 確認済み

- `node --check game.js`：OK。
- VERSION：`v0.3.64-growth-type-draft`。
- SAVE_VERSION：`v0.3.64-growth-type-draft`。
- `VERSION.txt`：`v0.3.64-growth-type-draft`。
- `index.html` title：`v0.3.64-growth-type-draft`。
- `sw.js` cache：`underground-v0-3-64-growth-type-draft`。
- 成長タイプDBに以下を保持。
  - 技術型 / センス型 / メンタル型 / カリスマ型 / リズム型 / 協調性型 / 体力型 / 知識型 / 万能型 / 安定型 / 序盤型 / 爆発型 / 晩成型。
- 練習処理で `applyMemberStatGrowth` / `maybeApplyFocusedGrowth` を使用。
- ライブ後成長で `applyMemberStatGrowth` / `maybeApplyFocusedGrowth` を使用。
- 旧セーブ安全対応として normalizeState 内で `normalizeMemberGrowthType` を実行。
- メンバーカードの「表示のみ」文言は削除済み。
- DEV画面に成長タイプ確認カードを追加。

## 未確認

- スマホ実機での練習結果表示。
- 実機でのライブ後成長差。
- 50T通しでの成長タイプ別バランス。
- 旧セーブ実ロードからの長時間進行。

## 次に見てほしい点

- 成長タイプ補正が強すぎないか。
- 爆発型の上振れがライブ評価やGRAND条件達成率を壊していないか。
- 晩成型が序盤で弱すぎないか、35T以降に意味が出るか。
- 旧セーブメンバーに `growthType` がない場合でも表示・練習・ライブで落ちないか。
- 練習結果の表示がスマホで詰まらないか。
