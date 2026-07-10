# v0.3.60-big-draft-fix1 変更履歴・実装メモ

## 変更ファイル
- game.js（バンドシステム一式を統合、既存フローへ約20箇所のフック）
- style.css（図鑑用の最小CSS追加）
- index.html / sw.js / VERSION.txt / README.md（バージョン表記・キャッシュ名）

## フィーチャーフラグ
- `ENABLE_BAND_SYSTEM = true`（game.js内、バンドシステムブロック先頭）
- false にすると：旧RIVAL_BANDS 20組・Paper Moon Kids導線・旧ほかのバンド図鑑表示に戻る

## 仮数値（BAND_TUNING / スキルparams）
- 交流値：内部は既存 rivalRelations（-100〜100）を継続利用。図鑑表示は0〜100クランプ
- 交流段階：1顔見知り / 15知り合い / 30仲間 / 60盟友
- 初対バンボーナス：+10（DBのrelationAdd優先、Pachi等は+15）／2回目以降は既存のライブ交流変動のみ
- 固定イベント：TA初回打ち上げ+20、TA招待メール+10、TAスキル+20、CARBONS大成功+25
- 汎用スキル獲得：対象バンドと交流30以上。別供給源で再達成するとLv+1、上限超過は交流+5に変換
- 効果：3本の基礎=打ち上げ紹介率+5% / 癒しキャラ=+2%×Lv(最大+5%) / 合算上限+10%
  ライバル意識=S/A対バン時の格上刺激成長にLv分加算(最大+3) / インフルエンサー=宣伝+2%×Lv(最大+5%)
  余韻残響=疲労増加-1%×Lv(最大-3%、全疲労増加に簡易適用)
- 代表キャラ開示：交流30以上

## DBパックからの意図的変更
- 招待メールイベント：startTurn 8→6、条件 hasFlag(met)→firstLiveDone
  （v0.3.50の「打ち上げをスキップしても8Tに招待が届く」挙動を維持するため）
- 招待オファーは発生ターン+2開催・storyInvite扱い（期限切れなし、既存予定と衝突時は見送り）

## 旧セーブ互換
- normalizeState内で bandBook / ownedBandSkills を??=初期化
- paper_moon交流値→triple_arrowsへmax統合、予定・オファーのinvitedBandIdsを読み替え
- 旧paperMoonInvite8フラグ→招待イベント既読化、交流15以上なら初回打ち上げも既読化

## fix1確認時の追加修正

- `processBandStoryEvents()` のフェス/固定ライブ抑制を、ターン開始時とライブ後/打ち上げ後で分岐。
  - ターン開始時：固定ライブ/フェス前の割り込みを抑制。
  - ライブ後/打ち上げ後：通常対バンの交流イベントは許可し、フェス系のみ抑制。
- `minLastLiveScore` 条件が、ライブ結果履歴にpushされる前でも直前ライブ総合値を参照できるように、`bandBook.lastBattle.total` を保存。
- `postLive` イベント発火を、ファン/知名度/業界評価のライブ後増加を反映した後に移動。
- `event_triple_arrows_first_after_party` は初回ライブ後の専用打ち上げ処理だけで消化し、通常打ち上げイベント候補から除外。
  - 後日のCARBONS after_partyイベントをTriple Arrows初回打ち上げが食う問題を防止。
