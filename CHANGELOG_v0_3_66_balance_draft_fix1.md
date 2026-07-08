# CHANGELOG v0.3.66-balance-draft-fix1

対象：スマホブラウザ向けバンド育成SLG『アンダーグラウンド（仮）』

## 目的

v0.3.66-balance-draft を、スマホ実機確認へ回しやすい最新確認版として整理した版。
今回は大きな仕様追加ではなく、こちら側での再デバッグ、静的確認、VMスモーク、実機確認手順の同梱が主目的。

## 変更内容

- VERSION / SAVE_VERSION / index title / service worker cache を `v0.3.66-balance-draft-fix1` に更新。
- `AUDIT_v0_3_66_balance_draft_fix1.md` を追加。
- `MOBILE_SMOKE_CHECK_v0_3_66_fix1.md` を追加。
- `FABLE5_AUDIT_PROMPT_v0_3_66.md` を追加。
- READMEのバージョン表記をfix1へ更新。

## 実装維持

以下のv0.3.64〜v0.3.66要素は維持。

- v0.3.64：成長タイプの小補正実装。
- v0.3.65相当：優先8組の他バンドイベント土台。
- v0.3.66相当：GRAND条件チェック、バランス基準表、DEV補助。

## 確認済み

- `node --check game.js` OK。
- VERSION / SAVE_VERSION / title / sw.js cache のfix1表記確認。
- 加入候補36人維持。
- 名前付きサポート8人維持。
- バンドDB22組維持。
- 成長タイプ参照欠けなし。
- バンドイベントDBのbandId参照欠けなし。
- バンドイベントのunlockSkillId参照欠けなし。
- `BAND_EVENT_STORY_MAP` のイベントID/ノベルシーンID参照欠けなし。
- ノベルシーン20件の簡易レンダリングで `undefined` / 未補完プレースホルダなし。
- 練習→結果OK→次ターン進行のVMスモークOK。
- DEV GRAND最低値セット後のGRAND条件達成判定OK。
- DEV主要バンドイベント土台セットで優先8組の図鑑登録OK。

## 未確認

- スマホ実機でのタップ感。
- 追加ノベル10本の実機再生。
- 30T/50Tの実機通し。
- Fable5総合監査。

## 判定

現時点では、スマホ実機確認へ回せる最新確認版として扱ってよい。
Fable5が復帰したら、v0.3.64〜v0.3.66まとめて総合監査する。
