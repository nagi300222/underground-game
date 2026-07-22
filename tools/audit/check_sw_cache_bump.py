#!/usr/bin/env python3
"""
SW更新規律ゲート (SW cache-name bump discipline gate) — 恒久監査ツール（SKIN_ORDER_v4 fix8で新設）

目的:
  「アセット変更PRはsw.jsのCACHE_NAMEバンプが必須」という受け入れ標準を機械検出する。
  fix8の原因調査で、直近20コミット（PR-D以降のfix5/fix6/fix7/PR-F/PR-H/PR-I/PR-J/TEXT-1等）が
  ASSETS対象ファイル（index.html/style.css/game.js/フォント等）を変更していながら、
  一度もCACHE_NAMEをバンプしていなかったことが判明した。インストール済みPWAが古いキャッシュを
  参照し続け、fix7で直したはずのスクロール不能が再発して見える等の実害があったため、
  以後は本スクリプトで機械的に検出する。

判定基準:
  ベース参照（既定: origin/main、無ければmain）との差分で、sw.jsのASSETS配列に列挙された
  ファイルのいずれかが変更されているにもかかわらず、sw.js自体のCACHE_NAME文字列が
  変更されていない場合はFAIL。

実行方法:
  python3 tools/audit/check_sw_cache_bump.py [--base <ref>]
  （リポジトリルートで実行。gitが必要。ベース参照は省略時 origin/main → main の順に試行）

終了コード: バンプ規律を満たしていれば0、違反していれば1。
"""
import argparse
import os
import re
import subprocess
import sys

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


def run(cmd, text=True):
    return subprocess.run(cmd, cwd=REPO_ROOT, capture_output=True, text=text)


def resolve_base(explicit):
    candidates = [explicit] if explicit else ["origin/main", "main"]
    for ref in candidates:
        if ref is None:
            continue
        r = run(["git", "rev-parse", "--verify", ref])
        if r.returncode == 0:
            return ref
    return None


def show_file(ref, path):
    r = run(["git", "show", f"{ref}:{path}"])
    return r.stdout if r.returncode == 0 else None


def extract_assets(sw_js_text):
    if not sw_js_text:
        return []
    m = re.search(r"const\s+ASSETS\s*=\s*\[(.*?)\]", sw_js_text, re.S)
    if not m:
        return []
    items = re.findall(r'"([^"]+)"', m.group(1))
    # "./" はディレクトリ指定でファイル差分比較の対象外
    return [i.lstrip("./") for i in items if i not in ("./", "")]


def extract_cache_name(sw_js_text):
    if not sw_js_text:
        return None
    m = re.search(r'const\s+CACHE_NAME\s*=\s*"([^"]+)"', sw_js_text)
    return m.group(1) if m else None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default=None, help="比較元の参照（既定: origin/main → main）")
    args = parser.parse_args()

    base = resolve_base(args.base)
    if not base:
        print("[SKIP] ベース参照(origin/main / main)が見つからないため判定不能。", file=sys.stderr)
        sys.exit(0)

    base_sw = show_file(base, "sw.js")
    head_sw_path = os.path.join(REPO_ROOT, "sw.js")
    with open(head_sw_path, encoding="utf-8") as f:
        head_sw = f.read()

    base_cache_name = extract_cache_name(base_sw)
    head_cache_name = extract_cache_name(head_sw)
    assets = extract_assets(head_sw) or extract_assets(base_sw)

    changed_assets = []
    for path in assets:
        full_path = os.path.join(REPO_ROOT, path)
        if not os.path.exists(full_path):
            continue
        # バイナリ資産(フォント等)も安全に扱えるよう、テキスト比較ではなくgit diffの終了コードで判定
        r = run(["git", "diff", "--quiet", base, "--", path], text=False)
        if r.returncode != 0:
            changed_assets.append(path)

    cache_bumped = base_cache_name != head_cache_name

    result = {
        "base": base,
        "baseCacheName": base_cache_name,
        "headCacheName": head_cache_name,
        "cacheBumped": cache_bumped,
        "changedAssets": changed_assets,
    }

    if changed_assets and not cache_bumped:
        print("[NG] ASSETS対象ファイルが変更されているのに sw.js の CACHE_NAME がバンプされていません。")
        print(f"  変更ファイル: {changed_assets}")
        print(f"  CACHE_NAME: {base_cache_name!r} (変化なし)")
        print("  → sw.js の CACHE_NAME を更新してください（アセット変更PRの受け入れ標準）。")
        sys.exit(1)

    if changed_assets:
        print(f"[OK] ASSETS変更あり（{changed_assets}）、CACHE_NAMEも正しくバンプ済み: "
              f"{base_cache_name!r} -> {head_cache_name!r}")
    else:
        print("[OK] ASSETS対象ファイルの変更なし（バンプ不要）。")
    sys.exit(0)


if __name__ == "__main__":
    main()
