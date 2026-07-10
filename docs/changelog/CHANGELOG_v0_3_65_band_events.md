# CHANGELOG v0.3.65-band-events-draft

対象：スマホブラウザ向けバンド育成SLG『アンダーグラウンド（仮）』

## 目的

v0.3.63で追加したノベルイベント導線を土台に、他バンドイベント拡張の入口を作る。
全22組を一気に濃くするのではなく、優先8組に短い追加イベントを置き、今後の本実装・バランス調整・Fable5監査へ渡しやすくした。

## 追加したイベント土台

優先8組：

1. Triple Arrows
2. CARBONS
3. Pachi-Pachi
4. SHELTER
5. Kiwi
6. magnet wolf
7. KAEDE
8. LACT

追加イベントID：

- `event_triple_arrows_after_invite_rematch`
- `event_carbons_return_talk`
- `event_pachi_pachi_floor_sign`
- `event_shelter_backstage_advice`
- `event_kiwi_greenroom_talk`
- `event_magnet_wolf_dirty_riff`
- `event_kaede_one_phrase`
- `event_lact_backstage_shadow`

既存イベントへのノベル接続追加：

- `event_kaede_acoustic_encounter` → `kaede_acoustic_encounter`
- `event_lact_name_drop` → `lact_name_drop`

## 追加したノベルシーン

- `triple_arrows_next_arrow`：次の矢印
- `carbons_polish_talk`：磨くほど尖る
- `pachi_pachi_floor_sign`：フロアの合図
- `shelter_backstage_advice`：崩れない準備
- `kiwi_greenroom_talk`：ゆるい楽屋
- `magnet_wolf_dirty_riff`：汚れたリフ
- `kaede_acoustic_encounter`：一人で立つ音
- `kaede_one_phrase`：一行目の温度
- `lact_name_drop`：遠くのLACT
- `lact_backstage_shadow`：控室の影

## 実装方針

- 追加イベントは原則 `encounter` として実装。
- 交流値は小さく加算。
- 新規スキルや大きな数値補正はまだ追加しない。
- 既存のターン進行、ライブ後フロー、メール導線は触らない。
- 1ターン1件制限、フェス/固定ライブ当日の割り込み抑制は既存ルールを維持。

## 既知の制限

- 複数のイベント条件を同時に満たした場合は、priority順で1件だけ再生される。
- DEVで前提フラグを一括セットした場合、全イベントを一度に自動再生するわけではない。
- 追加イベントは土台のため、専用スキル・専用報酬・細かい選択肢分岐は未実装。

