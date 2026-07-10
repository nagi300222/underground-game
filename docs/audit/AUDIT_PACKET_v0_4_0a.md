# AUDIT PACKET v0.4.0a-ui-foundation-draft

## 監査対象
v0.3.74-release-candidate-audit → v0.4.0a-ui-foundation-draft

## 重点
- 旧viewキーを消していないか。
- `.tabBtn` / `.jumpTabBtn` / `data-view` 結線が生きているか。
- tutorialStageロックがホーム内ボタンで維持されているか。
- メール未読バッジが5タブでも表示されるか。
- ホームから `songs` / `shop` / `library` / `bandbook` / `log` / `dev` に到達できるか。
- ライブ準備、GRAND条件、ターン進行、メール返信、打ち上げイベント、通常行動イベントに差分がないか。

## 実機確認
- iPhone幅でホーム主ボタンが上部に見えるか。
- 5タブが押しやすいか。
- ホームの小タイルが多すぎないか。
- L0ステータスが邪魔ではないか。
- 予定ミニラインが横幅で破綻しないか。
