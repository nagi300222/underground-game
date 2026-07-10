# v0.3.61-member-draft-fix4

## 修正内容

- 1ターン目の作詞作曲後に、通常行動をせず自動で2ターン目へ進んでしまう導線バグを修正。
- 初回チュートリアル中の作詞作曲は通常行動とは別枠として扱い、曲作り後は同じターン内で「今週の行動へ」を選べるようにした。
- 2ターン目の未完成曲チュートリアルと「今週の行動」誘導が衝突して、作詞作曲ボタンしか押せないのに行動誘導ポップが出る操作不能状態を回避。
- VERSION / SAVE_VERSION / index title / sw.js cache を v0.3.61-member-draft-fix4 へ更新。

## 確認

- node --check game.js：OK
- completeSongcraftTutorial 内で、needSong チュートリアル中に作られた songcraft 系 pendingTurnAdvance を破棄することを確認。
