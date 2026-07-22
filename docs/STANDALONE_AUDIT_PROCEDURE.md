# スタンドアロン(PWAホーム追加)検証の標準手順

制定: fix8（2026-07-22）／目的: iOS Safariタブ表示とホーム追加後のスタンドアロン表示で
実効値（innerHeight・env(safe-area-inset-*)・display-mode等）が異なりうるレイアウト系変更を、
タブ表示だけで確認して見落とすことを防ぐ。

## 背景

fix8で「ヘッダー・フッターの崩れ／全周黒余白／タイトル見切れ」がホーム追加版でのみ発生する不具合が
報告された。ChromiumベースのPlaywrightでは以下の理由から**完全な再現ができなかった**:

- `display-mode` メディアクエリはstyle.cssに存在しないため、CDPでの`display-mode`エミュレーションは
  無効（分岐が無いので変化しない）。
- CDP `Emulation.setSafeAreaInsetsOverride` で `env(safe-area-inset-*)` の値自体は操作できるが
  （`padding-top:env(safe-area-inset-top)`等で確認可能）、Apple独自の
  `apple-mobile-web-app-status-bar-style` メタタグの有無によるステータスバー合成方式の違いなど、
  WebKit/iOS固有の挙動はChromiumで再現できない領域がある。

## 標準手順（今後のレイアウト系PRの受け入れに適用）

### 1. まずChromiumでの合成再現を試みる
- 対象仮説をCSS強制（クラス付与・`display-mode`相当の値上書き）で再現できないか試す。
- CDP `Emulation.setSafeAreaInsetsOverride({insets:{top,right,bottom,left}})` で
  タブ相当（top≈0）／スタンドアロン相当（top≈notch高さ、例:59px、bottom≈34px）を比較する。
- 再現できた場合はそのまま通常のPlaywright検証フローで修正・確認する。

### 2. 再現できない場合: DEV限定デバッグオーバーレイ＋実機協調
fix8で `v043gUpdateDebugOverlay()`（game.js）として恒久実装済み。`devModeOn()`
（`ENABLE_DEV_MODE`、既存の恒久DEVフラグ）がtrueの間、画面左上に以下を常時表示する:

```
mode:<standalone|browser> iW:<innerWidth> iH:<innerHeight> dvh:<100dvh実効px>
safe T<top> R<right> B<bottom> L<left>
shell T.. B.. L.. R..   （.v043b-shell / .app-shellのrect）
footer T.. B.. L.. R..  （.v042-tabbar / ホームのコマンドタイル / #performLiveBtnのrect）
title <ok|OVERFLOW>     （.section-title h2のオーバーフロー有無）
```

`pointer-events:none`のため操作・ジェスチャには一切干渉しない（fix7で確立したジェスチャ非干渉の
教訓を踏襲）。

**手順**: 発注者に「DEVモードのまま該当画面（ホーム追加版）を開いてスクリーンショット1枚」を
依頼する。左上の数値と実際のレイアウト崩れを1枚で同時に確認できるため、往復を1回に抑えられる。

### 3. 発注者側の実機チェック標準
レイアウト系PRの最終ゲートでは、**Safariタブ表示とホーム追加版（スタンドアロン）の両方**を
確認対象とする。fix8以前は「実機確認＝タブ表示のみ」で見落としが生じていたため、以後はこれを
標準手順とする。

## SW更新規律との関係

PWAのService Workerキャッシュは、`viewport-fit`/`display-mode`とは独立した別軸の問題として、
`tools/audit/check_sw_cache_bump.py`（fix8で新設）で機械検出する。「アセット変更PRは
sw.jsのCACHE_NAMEバンプが必須」という受け入れ標準を、ASSETS対象ファイル
（index.html/style.css/game.js/フォント等）の変更有無とCACHE_NAME文字列の変化有無を比較して
自動判定する。実行方法・判定基準は当該スクリプトのdocstringを正典とする。
