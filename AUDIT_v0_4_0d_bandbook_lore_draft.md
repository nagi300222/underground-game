# AUDIT v0.4.0d-bandbook-lore-draft

## 判定

OK寄り。v0.4.0dの変更は静的データと図鑑表示追加が中心で、進行不能系の危険箇所には触れていない。

## 確認結果

### 静的確認

- `node --check game.js`: OK
- VERSION: OK
- SAVE_VERSION: OK
- index.html title: OK
- sw.js CACHE_NAME: OK
- VERSION.txt: OK

### 図鑑/lore確認

- BAND_DATABASE 22組維持: OK
- BAND_LORE_DATABASE 22組分: OK
- 代表者コメント22組: OK
- 優先8組×裏話2本 = 16本: OK
- lore entry id/title/text欠けなし: OK
- 図鑑詳細3タブ描画: OK
- コメントタブ描画: OK
- 裏話タブ描画: OK
- 交流30で裏話1解放: OK
- 交流60で裏話2解放: OK
- 裏話未実装バンドのプレースホルダー: OK

### 回帰確認

- v0.4.0a 5タブ/ホーム導線: OK
- v0.4.0b ライブ準備4ステップ: OK
- `.setlistSelect` 5枠維持: OK
- `.positionSelect` 維持: OK
- `.chorusSelect` 維持: OK
- `.merchQtyInput` 維持: OK
- `.merchDigitSelect` 維持: OK
- v0.4.0c 携帯/要返信/図鑑入口: OK
- T3宣伝SNS導線: OK
- メール返信後予定タブ遷移: OK
- `pendingMailAction` 保存除外維持: OK

## 注意点

- 代表者コメントと裏話は仮テキスト。正式な文体調整は後続で可能。
- 裏話のないバンドにはプレースホルダーを出している。
- 図鑑タブの見た目は最低限。デザイントーンは後からCSSトークン側で調整する。
- LACT専用演出やSNS人格化はまだ未実装。v0.4.0eで単独実装推奨。

## 結論

v0.4.0dは、v0.4.0a〜cの主要導線を壊さず、図鑑を世界観読み物の受け皿に拡張できている。
次は v0.4.0e-world-reactions-draft に進めてよい。
