#!/usr/bin/env python3
"""
縦到達性監査 (vertical reachability audit) — 恒久監査ツール（SKIN_ORDER_v4 fix3で新設）

目的:
  動的に成長するスクリーン/オーバーレイで、主要アクションボタンが
  375x667ビューポートにおいて (a) 静止状態で可視、または (b) スクロール
  （内部スクロール領域・ページ全体スクロールいずれでも可）のみで到達可能で
  あることを、実ブラウザ描画(Playwright)で検証する。

  fix3の実描画診断で確定した実際の障害パターンは「固定/上限高さのコンテナに
  overflow:hidden が掛かり、かつスクロール手段が一切無いため、はみ出した
  ボタンが不可視のまま到達不能になる」というもの（.live-progress-modal、
  v0.3.6由来のoverflow:hidden上書き）。本監査はこのパターンを一般化し、
  「素朴に可視 → NG時はscrollIntoView()を試す → それでも不可視ならFAIL」
  という判定で、あらゆる対象画面に同一基準を適用する。
  scrollIntoView()はブラウザが最も近いスクロール可能な祖先（内部スクロール
  領域でもbody/documentでも）を自動的に解決するため、「内部スクロール」と
  「ページ全体スクロール」のどちらでも正当な到達手段として扱われる
  （例: セトリ編成画面は#appの通常フローで、body自体がスクロールする形で
  #performLiveBtnに到達可能であることを確認済み — これはバグではない）。

  対象: ライブ進行(idx=0の最小状態／idx=4の最大成長状態)・ライブ結果・
  会話(ストーリーイベント)・携帯メッセージ一覧・セトリ編成(その他の成長画面)。

実行方法:
  python3 tools/audit/audit_vertical_reachability.py
  (要: pip install playwright、および実行可能なChromiumビルド。
   環境変数 AUDIT_CHROMIUM_PATH で実行ファイルパスを明示指定可能。
   未指定時はPlaywright既定のChromiumを試み、失敗時のみ既知の
   サンドボックスパスにフォールバックする。)

終了コード: 全項目PASSで0、いずれかFAILで1。
拡張（fix6 B5・恒久）:
  上記の個別ターゲット到達性に加え、以下2項目を全画面（home/band/songs/schedule/
  bandbook一覧・詳細/phone各サブビュー/dev/log）へ一律適用する。
  (a) 初期表示可視性: スクロール操作なしの初期表示で、フッター/タブバー
      （ホームは専用の下部操作＝コマンドタイル）が100dvh内に完全可視であること。
  (b) ネスト検出: overflow-y:auto/scrollかつ実際にコンテンツが溢れている要素
      （＝実効スクロールオーナー）が、同一画面内で祖先子関係にある組を持たない
      こと（「1画面1スクロールオーナー」規則の機械的検証）。演出オーバーレイ
      （ライブ進行/結果・会話等の一時要素、上記TARGETSで個別検証済み）は対象外。
"""
import json
import os
import subprocess
import sys
import time

from playwright.sync_api import sync_playwright

PORT = 8940
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

SETUP_BASE = """() => {
    startNewGameInSlot(1);
    state.introSeen = true; state.tutorialStage='done'; state.scheduleTutorialStage='done';
    state.band.name='監査バンド'; state.view='home'; state.activePopup=null; state.popupQueue=[];
    state.liveProgressModal = null; state.liveResultModal = null; state.pendingLiveResultModal = null;
    state.activeStoryEvent = null; state.phoneSubView = null;
    state.band.funds=250000; render();
}"""

RESET_OVERLAYS = """() => {
    state.liveProgressModal = null; state.liveResultModal = null; state.pendingLiveResultModal = null;
    state.activeStoryEvent = null; state.view = 'home'; state.phoneSubView = null; state.activeMailId = null;
    /* fix6 B5: setlist_builderターゲットがstate.turnをライブ本番ターンへ書き換えたまま残ると、
       以降の全チェックでliveMode=true（isLiveTurn()）が続き、.v042-tabbarへlive-lockが
       付与されっぱなしになる（意図通りの非表示だが、本監査には無関係な汚染）。turnを安全な初期値へ戻す。 */
    state.turn = 1;
    render();
}"""

LIVE_PROGRESS_STEPS = """Array.from({length:5}, (_,i) => ({
    slot:i+1, songTitle:'デモ曲'+(i+1),
    line: (i+1)+'曲目『デモ曲'+(i+1)+'』が客席に刺さった。かなり長めの結果説明文をここに追加してテストします。',
    icon:'\\u25b2\\ufe0e', event:'盛り上がった。詳細な補足説明もここに追加してテストします。', impact:'good'
}))"""

TARGETS = [
    {
        "name": "live_progress_idx0（進行開始・最小コンテンツ）",
        "setup": f"""() => {{
            state.liveProgressModal = {{ title:'路地裏スタジオ', rank:'B', total:620,
                steps: {LIVE_PROGRESS_STEPS}, index: 0, complete: false,
                venueName:'ライブハウスUNDER', heat: 140 }};
            render();
        }}""",
        "selector": ".liveProgressNextBtn",
    },
    {
        "name": "live_progress_idx4（進行完了・最大成長）",
        "setup": f"""() => {{
            state.liveProgressModal = {{ title:'路地裏スタジオ', rank:'B', total:620,
                steps: {LIVE_PROGRESS_STEPS}, index: 4, complete: true,
                venueName:'ライブハウスUNDER', heat: 140 }};
            render();
        }}""",
        "selector": ".liveProgressNextBtn",
    },
    {
        "name": "live_result（ライブ結果）",
        "setup": """() => {
            state.liveResultModal = { rank:'S', title:'路地裏スタジオ', venue:'UNDER', total:940,
                performance:88, expression:82, heat:91, strategy:75, stability:80,
                attendees:150, ownAudience:90, partnerAudience:60,
                profit:30000, costLabel:'費用', costValue:5000,
                gains:{funds:30000, fans:42, fame:18, industry:9, core:3},
                songs:['曲1','曲2','曲3','曲4','曲5'], adlib:'なし', setlistBonusText:'なし', repeatText:'なし', merchSummary:'なし' };
            render();
        }""",
        "selector": ".liveResultCloseBtn",
    },
    {
        "name": "conversation（会話／ストーリーイベント最深ステップ）",
        "setup": """() => {
            state.activeStoryEvent = { id: "first_afterparty_triple_arrows", step: 5, result: false,
                rewardsApplied: true, context: {fatigueGain: 10}, returnView: "home" };
            render();
        }""",
        "selector": "#storyNextBtn",
    },
    {
        "name": "phone_mail_list（携帯メッセージ一覧・多件数）",
        "setup": """() => {
            state.view = "phone"; state.phoneSubView = "mail"; state.activeMailId = null;
            state.phoneMails = (state.phoneMails||[]).concat(Array.from({length:40}, (_,i) => ({
                id:"auditMail"+i, subject:"件名"+i, body:"本文", sender:"通知", read:false, turn:1
            })));
            render();
        }""",
        "selector": '.phoneModeBtn[data-phone-mode="menu"]',
    },
    {
        "name": "setlist_builder（セトリ編成・最終ステップ／その他の成長画面）",
        "setup": """() => {
            if (typeof refreshLiveSchedule === "function") refreshLiveSchedule();
            const turn = (state.liveSchedule && state.liveSchedule[0]) || state.turn;
            state.turn = turn;
            state.livePrepStep = 5;
            if (typeof ensureLivePrepSetlist === "function") ensureLivePrepSetlist();
            render();
        }""",
        "selector": "#performLiveBtn",
    },
]

# fix6 B5（恒久）: 「1画面1スクロールオーナー」＋「初期表示でフッター常時可視」の全画面監査対象。
# 演出オーバーレイ（TARGETSで個別検証済み）は対象外。
# fix7で"live_prep"（ライブ準備）を追加。renderLivePrep()はTARGETSのsetlist_builderで
# 到達性(scrollIntoView)のみ検証されており、このSCREENS一覧（フッター可視性・ネスト検出、
# および本ファイルで新設したスクロール応答監査）には未登録だった。この登録漏れ自体が、
# fix6 B4の一般化リグレッション（renderLivePrep()だけ内側スクローラを持たないままロックのみ
# 適用され、無音のスクロール不能を招いた）を検出できなかった一因（SKIN_ORDER_v4 fix7）。
SCREENS = [
    {"name": "home", "setup": """() => { state.view='home'; render(); }"""},
    {"name": "band", "setup": """() => { state.view='band'; render(); }"""},
    {"name": "songs", "setup": """() => { state.view='songs'; render(); }"""},
    {"name": "schedule", "setup": """() => { state.view='schedule'; render(); }"""},
    {"name": "bandbook_list", "setup": """() => {
        Object.keys(BAND_DATABASE).forEach(id => promoteBandState(id, 'met'));
        state.view='bandbook'; state.bandBookDetail=null; render();
    }"""},
    {"name": "bandbook_detail", "setup": """() => {
        const id = Object.keys(BAND_DATABASE)[0]; promoteBandState(id, 'met');
        state.view='bandbook'; state.bandBookDetail=id; render();
    }"""},
    {"name": "phone_menu", "setup": """() => { state.view='phone'; state.phoneSubView='menu'; render(); }"""},
    {"name": "phone_mail", "setup": """() => { state.view='phone'; state.phoneSubView='mail'; render(); }"""},
    {"name": "phone_sns", "setup": """() => { state.view='phone'; state.phoneSubView='sns'; render(); }"""},
    {"name": "dev", "setup": """() => { state.devMode=true; state.view='dev'; render(); }"""},
    {"name": "log", "setup": """() => { state.view='log'; render(); }"""},
    {"name": "live_prep", "setup": """() => {
        if (typeof refreshLiveSchedule === "function") refreshLiveSchedule();
        const turn = (state.liveSchedule && state.liveSchedule[0]) || state.turn;
        state.turn = turn;
        state.livePrepStep = 5;
        if (typeof ensureLivePrepSetlist === "function") ensureLivePrepSetlist();
        render();
    }"""},
]

# ホームはタブバーを意図的に非表示にし、コマンドタイル群を下部の主要操作として使う設計。
# 携帯(phone_*)はデバイス風オーバーレイが下部タブバーを完全に置き換え、閉じるボタンが
# 唯一の常設操作となる設計。ライブ準備(live_prep)もliveMode中は.v042-tabbarがlive-lockで
# 非表示になる設計のため、#performLiveBtnを代表操作とする。いずれも意図的な非タブバー画面の
# ため、代表操作セレクタを切り替える。
FOOTER_SELECTOR_BY_SCREEN = {
    "home": ".v043b-action-btn",  # コマンドタイル（下部主要操作）の代表1件
    "phone_menu": ".phoneCloseBtn",
    "phone_mail": ".phoneCloseBtn",
    "phone_sns": ".phoneCloseBtn",
    "live_prep": "#performLiveBtn",
}
DEFAULT_FOOTER_SELECTOR = ".v042-tabbar"

# ライブ準備(live_prep)は他画面と異なり固定ナビ（.v042-tabbarはliveMode中display:none）を
# 持たない設計で、「ライブ本番へ」はステップ5コンテンツ末尾のスクロール到達要素として意図的に
# 配置されている（TARGETSのsetlist_builderが元々この「visible_at_rest or reachable_by_scroll」の
# 二段判定で検証済み）。他画面の「常時可視な固定フッター」という前提には当てはまらないため、
# この画面のみ同じ二段判定にフォールバックする（fix7）。
SCROLL_GATED_FOOTER_SCREENS = {"live_prep"}


def check_footer_visible_at_rest(page, screen):
    page.evaluate(RESET_OVERLAYS)
    page.wait_for_timeout(80)
    page.evaluate(screen["setup"])
    page.wait_for_timeout(200)
    selector = FOOTER_SELECTOR_BY_SCREEN.get(screen["name"], DEFAULT_FOOTER_SELECTOR)
    EPS = 1.5
    info = page.evaluate(
        """(sel) => {
            const els = document.querySelectorAll(sel);
            if (!els.length) return { found: false };
            const el = els[els.length - 1];
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            return { found: true, top: r.top, bottom: r.bottom, vh: window.innerHeight,
                     display: cs.display, visibility: cs.visibility };
        }""",
        selector,
    )
    if not info["found"]:
        return {"name": screen["name"], "pass": False, "reason": "footer selector not found: " + selector}
    if info["display"] == "none" or info["visibility"] == "hidden":
        return {"name": screen["name"], "pass": False, "reason": "footer element hidden (display/visibility)"}
    visible = -EPS <= info["top"] and info["bottom"] <= info["vh"] + EPS
    if visible or screen["name"] not in SCROLL_GATED_FOOTER_SCREENS:
        return {
            "name": screen["name"], "pass": visible, "selector": selector, "mode": "visible_at_rest" if visible else "NOT_VISIBLE_AT_REST",
            "top": info["top"], "bottom": info["bottom"], "vh": info["vh"],
        }
    # スクロール到達要素として設計された画面のみ、scrollIntoView()での到達性にフォールバック
    page.evaluate("(sel) => { const els = document.querySelectorAll(sel); els[els.length-1].scrollIntoView({block:'nearest'}); }", selector)
    page.wait_for_timeout(150)
    after = page.evaluate(
        """(sel) => { const els = document.querySelectorAll(sel); const el = els[els.length-1];
            const r = el.getBoundingClientRect(); return {top:r.top, bottom:r.bottom, vh:window.innerHeight}; }""",
        selector,
    )
    reachable = -EPS <= after["top"] and after["bottom"] <= after["vh"] + EPS
    return {
        "name": screen["name"], "pass": reachable, "selector": selector,
        "mode": "reachable_by_scroll" if reachable else "UNREACHABLE",
        "topAtRest": info["top"], "bottomAtRest": info["bottom"],
        "topAfterScroll": after["top"], "bottomAfterScroll": after["bottom"], "vh": after["vh"],
    }


def check_no_nested_scrollers(page, screen):
    page.evaluate(RESET_OVERLAYS)
    page.wait_for_timeout(80)
    page.evaluate(screen["setup"])
    page.wait_for_timeout(200)
    result = page.evaluate(
        """() => {
            const all = Array.from(document.querySelectorAll('body *'));
            const scrollers = all.filter(el => {
                const cs = getComputedStyle(el);
                const canScrollY = ['auto', 'scroll'].includes(cs.overflowY);
                const overflowsY = el.scrollHeight > el.clientHeight + 1;
                const visible = el.getBoundingClientRect().width > 0;
                return canScrollY && overflowsY && visible;
            });
            const nestedPairs = [];
            scrollers.forEach((a, i) => {
                scrollers.forEach((b, j) => {
                    if (i === j) return;
                    if (a.contains(b) && a !== b) {
                        nestedPairs.push({
                            outer: a.tagName + '.' + (a.className || '').toString().slice(0, 40),
                            inner: b.tagName + '.' + (b.className || '').toString().slice(0, 40),
                        });
                    }
                });
            });
            return {
                scrollerCount: scrollers.length,
                scrollers: scrollers.map(el => el.tagName + '.' + (el.className || '').toString().slice(0, 40)),
                nestedPairs,
            };
        }"""
    )
    return {
        "name": screen["name"],
        "pass": len(result["nestedPairs"]) == 0,
        "scrollerCount": result["scrollerCount"],
        "scrollers": result["scrollers"],
        "nestedPairs": result["nestedPairs"],
    }


def synthetic_touch_drag(cdp, x, y, dy, steps=12, step_delay_ms=20):
    """CDP Input.dispatchTouchEventで実タッチドラッグ(縦方向)を合成する。
    プログラムでscrollTopを直接書き換えるのとは異なり、ブラウザの実ジェスチャ認識・
    スクロール配達経路を通すため、「レイアウト上スクロール可能」と「実際にジェスチャが
    スクロールへ届く」の差（fix7で発見した応答層の盲点）を検出できる（SKIN_ORDER_v4 fix7）。"""
    ts = time.time()
    cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x, "y": y, "id": 1}], "timestamp": ts})
    for i in range(1, steps + 1):
        cur_y = y - (dy * i / steps)
        time.sleep(step_delay_ms / 1000)
        cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x, "y": cur_y, "id": 1}], "timestamp": time.time()})
    cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": [], "timestamp": time.time()})


def check_scroll_response(page, cdp, screen):
    """fix7 C項: 恒久スクロール応答監査。
    既存のcheck_no_nested_scrollers()と同じ基準（overflow-y:auto/scroll かつ実際に
    コンテンツが溢れている可視要素）でその画面の実スクロールオーナーを検出し、各オーナーの
    中心へ合成タッチドラッグを行って実際にscrollTopが動くかを検証する。レイアウト層
    （fix6 B5）は「スクロール可能かどうか」のみを見ており、ジェスチャが実際にスクロールへ
    配達されるかという応答層は別軸であることがfix7で判明したため、二重ゲートとして新設した。"""
    page.evaluate(RESET_OVERLAYS)
    page.wait_for_timeout(80)
    page.evaluate(screen["setup"])
    page.wait_for_timeout(200)

    scrollers = page.evaluate(
        """() => {
            const all = Array.from(document.querySelectorAll('body *'));
            const found = all.filter(el => {
                const cs = getComputedStyle(el);
                const canScrollY = ['auto', 'scroll'].includes(cs.overflowY);
                const overflowsY = el.scrollHeight > el.clientHeight + 1;
                const r = el.getBoundingClientRect();
                if (!(canScrollY && overflowsY && r.width > 0 && r.height > 0)) return false;
                /* 実タッチはそのx,y地点で最前面（hit-test最上位）の要素にしか届かない。
                   携帯オーバーレイの裏に隠れたままの.v042-view-panel（renderHomeScreen()を
                   保持し続けるプレースホルダ）等、レイアウト上はoverflow:auto+溢れていても
                   実際には触れられない要素を、この最前面判定で除外する（fix7で発見） */
                const cx = Math.min(Math.max(r.x + r.width / 2, 0), window.innerWidth - 1);
                const cy = Math.min(Math.max(r.y + r.height / 2, 0), window.innerHeight - 1);
                const top = document.elementFromPoint(cx, cy);
                return !!top && (top === el || el.contains(top));
            });
            return found.map((el, i) => {
                el.setAttribute('data-fix7-audit-id', String(i));
                const r = el.getBoundingClientRect();
                return {
                    id: i, label: el.tagName + '.' + (el.className || '').toString().slice(0, 60),
                    x: r.x + r.width / 2, y: r.y + r.height / 2,
                    scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, scrollTop: el.scrollTop,
                };
            });
        }"""
    )
    if not scrollers:
        return {"name": screen["name"], "pass": True, "scrollers": [], "reason": "no overflowing scroller present (nothing to scroll)"}

    results = []
    for sc in scrollers:
        cx = max(1, min(sc["x"], 373))
        cy = max(1, min(sc["y"], 665))
        drag_dy = min(300, max(20, sc["scrollHeight"] - sc["clientHeight"]))
        synthetic_touch_drag(cdp, cx, cy, drag_dy)
        page.wait_for_timeout(150)
        after = page.evaluate(
            """(id) => {
                const el = document.querySelector(`[data-fix7-audit-id="${id}"]`);
                return el ? el.scrollTop : null;
            }""",
            sc["id"],
        )
        delta = (after if after is not None else 0) - sc["scrollTop"]
        results.append({"target": sc["label"], "scrollTopDelta": delta, "pass": delta > 0})

    return {"name": screen["name"], "pass": all(r["pass"] for r in results), "scrollers": results}


def resolve_executable_path():
    env_path = os.environ.get("AUDIT_CHROMIUM_PATH")
    if env_path and os.path.exists(env_path):
        return env_path
    fallback = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
    if os.path.exists(fallback):
        return fallback
    return None


def check_target(page, target):
    page.evaluate(RESET_OVERLAYS)
    page.wait_for_timeout(80)
    page.evaluate(target["setup"])
    page.wait_for_timeout(150)

    found = page.evaluate(
        "(sel) => !!document.querySelector(sel)", target["selector"]
    )
    if not found:
        return {"name": target["name"], "pass": False, "reason": "selector not found: " + target["selector"]}

    # サブピクセル丸め誤差の偽陰性を避けるための許容誤差(px)
    EPS = 1.5

    rect_before = page.evaluate(
        """(sel) => { const r = document.querySelector(sel).getBoundingClientRect();
            return {top:r.top, bottom:r.bottom, vh:window.innerHeight}; }""",
        target["selector"],
    )
    visible_at_rest = -EPS <= rect_before["top"] and rect_before["bottom"] <= rect_before["vh"] + EPS

    if visible_at_rest:
        return {
            "name": target["name"], "pass": True, "mode": "visible_at_rest",
            "btnTop": rect_before["top"], "btnBottom": rect_before["bottom"],
        }

    # 静止状態で不可視 -> scrollIntoView()でスクロール到達を試みる
    # (内部スクロール領域／ページ全体スクロールのどちらでもブラウザが解決する)
    page.evaluate(
        "(sel) => document.querySelector(sel).scrollIntoView({block:'nearest'})",
        target["selector"],
    )
    page.wait_for_timeout(150)
    rect_after = page.evaluate(
        """(sel) => { const r = document.querySelector(sel).getBoundingClientRect();
            return {top:r.top, bottom:r.bottom, vh:window.innerHeight}; }""",
        target["selector"],
    )
    reachable_by_scroll = -EPS <= rect_after["top"] and rect_after["bottom"] <= rect_after["vh"] + EPS

    return {
        "name": target["name"],
        "pass": reachable_by_scroll,
        "mode": "reachable_by_scroll" if reachable_by_scroll else "UNREACHABLE",
        "btnTopAtRest": rect_before["top"], "btnBottomAtRest": rect_before["bottom"],
        "btnTopAfterScroll": rect_after["top"], "btnBottomAfterScroll": rect_after["bottom"],
    }


def main():
    srv = subprocess.Popen(
        ["python3", "-m", "http.server", str(PORT)],
        cwd=REPO_ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    time.sleep(1.2)
    results = []
    try:
        with sync_playwright() as p:
            exe = resolve_executable_path()
            browser = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
            page = browser.new_page(viewport={"width": 375, "height": 667}, has_touch=True)
            page.goto(f"http://localhost:{PORT}/index.html")
            page.wait_for_timeout(300)
            page.evaluate(SETUP_BASE)
            page.wait_for_timeout(200)
            cdp = page.context.new_cdp_session(page)

            for target in TARGETS:
                results.append(check_target(page, target))

            footer_results = [check_footer_visible_at_rest(page, screen) for screen in SCREENS]
            nested_results = [check_no_nested_scrollers(page, screen) for screen in SCREENS]
            scroll_response_results = [check_scroll_response(page, cdp, screen) for screen in SCREENS]

            browser.close()
    finally:
        srv.terminate()

    print(json.dumps(results, indent=2, ensure_ascii=False))
    print("\n--- fix6 B5 (a) footer/tabbar visible at rest, per screen ---")
    print(json.dumps(footer_results, indent=2, ensure_ascii=False))
    print("\n--- fix6 B5 (b) nested scrollable ancestors, per screen ---")
    print(json.dumps(nested_results, indent=2, ensure_ascii=False))
    print("\n--- fix7 C: synthetic touch-drag scroll-response, per screen ---")
    print(json.dumps(scroll_response_results, indent=2, ensure_ascii=False))

    all_results = results + footer_results + nested_results + scroll_response_results
    failed = [r for r in all_results if not r["pass"]]
    if failed:
        print(f"\n[NG] {len(failed)} check(s) FAILED vertical reachability (incl. fix6 B5 + fix7 C extensions).", file=sys.stderr)
        sys.exit(1)
    print(f"\n[OK] all {len(results)} targets + {len(footer_results)} footer-visibility + "
          f"{len(nested_results)} nested-scroller + {len(scroll_response_results)} scroll-response "
          f"checks PASSED vertical reachability.")
    sys.exit(0)


if __name__ == "__main__":
    main()
