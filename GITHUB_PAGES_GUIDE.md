# GitHub Pages 公開手順

## 1. GitHubでリポジトリを作る

1. GitHubにログイン
2. 右上の `+` → `New repository`
3. Repository name に例として `underground-game` を入力
4. Publicを選択
5. `Create repository`

## 2. ファイルをアップロードする

1. 作ったリポジトリを開く
2. `Add file` → `Upload files`
3. v0.2.1フォルダの中身を全部ドラッグ&ドロップ
   - `index.html`
   - `style.css`
   - `game.js`
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
   - `README.md`
   - `VERSION.txt`
4. `Commit changes`

重要：ZIPファイルそのものではなく、解凍した中身をアップロードします。
`index.html` がリポジトリ直下にある状態にしてください。

## 3. GitHub Pagesを有効化する

1. リポジトリ上部の `Settings`
2. 左メニューの `Pages`
3. `Build and deployment` の Source を `Deploy from a branch`
4. Branch を `main`、フォルダを `/root` にする
5. `Save`

数十秒〜数分後にURLが表示されます。
例：

```txt
https://ユーザー名.github.io/underground-game/
```

## 4. スマホで開く

1. 表示されたURLをスマホで開く
2. 横画面にする
3. iPhone: Safariの共有ボタン → `ホーム画面に追加`
4. Android: Chromeのメニュー → `ホーム画面に追加` または `アプリをインストール`

## 5. 更新するとき

1. 新しい版のファイルをアップロード
2. 同名ファイルを上書き
3. `Commit changes`
4. スマホ側で再読み込み

表示が古い場合は、Service Workerのキャッシュが残っている可能性があります。
その場合はブラウザのサイトデータ削除、またはURL末尾に `?v=020` などを付けて確認してください。
