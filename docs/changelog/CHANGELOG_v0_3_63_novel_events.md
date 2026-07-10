# CHANGELOG v0.3.63-novel-events-draft

対象：スマホブラウザ向けバンド育成SLG『アンダーグラウンド（仮）』
ベース：v0.3.62-fix2

## 目的

v0.3.62で追加した簡易ノベルUIを使い、主要導線に短いサクセス風イベントを追加する。

## 追加・変更

- Pachi-Pachi初対バン後ノベル `pachi_pachi_first_live` を追加。
- Pachi-Pachi 2戦後 / 交流スキル「弾ける甘味」獲得ノベル `pachi_pachi_sweetness_unlock` を追加。
- CARBONS大成功後 / 交流スキル「ダイヤの原石」獲得ノベル `carbons_diamond_rough` を追加。
- UNDER FES前の短いノベル `under_fes_before` を追加。
- SHELTER「ロック魂」獲得ノベル `shelter_rock_spirit` を追加。
- メンバー加入ノベルに、担当パート別の差分文を追加。
- `BAND_EVENT_STORY_MAP` を拡張し、交流スキル獲得イベントの一部をノベル表示に接続。
- Pachi-Pachi初対バンの記録処理からノベル表示へ接続。
- `maybeTriggerStoryEvents()` に `activeStoryEvent` ガードを追加。
- 28〜29TでUNDER FES前ノベルを一度だけ再生する導線を追加。

## 維持

- 50T制 / 5T初ライブ / 30T UNDER FES / 50T GRAND UNDER FES。
- GRAND条件。
- 作詞/作曲/曲完成/曲強化ではターン進行しない仕様。
- 通常行動 / ライブ / 打ち上げ / ドタキャンのみターン進行対象。
- 加入候補36人、名前付きサポート8人、バンドDB22組、交流スキルDB。
- DEVモード。
- メールからライブ参加返信、メンバー候補返信導線。

## 注意

- ノベル内容は短い仮台本。
- 画像素材はまだ使わずCSS背景・影シルエットのまま。
- スマホ実機の見え方は未確認。
