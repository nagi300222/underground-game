# AUDIT v0.4.0c-phone-tutorial-draft

## 判定
OK寄り。進行不能系の重大な退行は、静的確認・VMスモーク範囲では見つからなかった。

## 確認環境
- 静的コード確認
- `node --check game.js`
- Node VM smoke
  - v0.4.0a UI基盤
  - v0.4.0b ライブ準備ステップ
  - v0.4.0c 携帯/チュートリアル

## 確認結果

### 基本
- VERSION: OK
- SAVE_VERSION: OK
- VERSION.txt: OK
- index.html title: OK
- sw.js cache: OK
- node --check: OK

### v0.4.0a回帰
- 5タブ描画: OK
- ホーム主ボタン: OK
- 予定ミニライン: OK
- 管理メニュー: OK
- 旧viewへの文脈導線: OK
- parentViewForNav: OK

### v0.4.0b回帰
- ライブ準備4ステップ描画: OK
- 4ステップパネルが同一HTMLに存在: OK
- `.setlistSelect` 5枠: OK
- `.positionSelect`: OK
- `.chorusSelect`: OK
- `.merchQtyInput`: OK
- `.merchDigitSelect`: OK
- performLiveBtn: OK

### v0.4.0c確認
- T1チュートリアルカード描画: OK
- T1作詞・作曲導線: OK
- チュートリアルカード自体は危険一時状態ではない: OK
- 携帯トップの要返信固定セクション: OK
- 携帯トップのバンド図鑑入口: OK
- 未読バッジ維持: OK
- バンド図鑑を携帯内で開ける: OK
- T3宣伝時のSNS初期反応: OK
- ライブ招待承認後、予定タブへ遷移: OK
- 承認後 `phoneSubView` / `activeMailId` クリア: OK
- `pendingMailAction` 保存除外維持: OK

## 注意点
- チュートリアルは完全ロックを追加せず、カード表示中心にした。既存の初回曲作り/行動ロックは維持。
- バンド図鑑は携帯内入口から開けるが、詳細行クリック後は既存の `bandbook` view に遷移する。parent tab は携帯扱いなので、旧結線維持を優先した設計。
- 実機では、携帯トップの要返信セクションと3アプリボタンの縦幅を確認すること。

## 次版への申し送り
v0.4.0dでは図鑑3タブ化と代表者コメント/裏話データ追加に進む予定。
ただし、図鑑行クリックや戻る導線は既存結線が多いため、データ追加とUI改修を分けて監査すること。
