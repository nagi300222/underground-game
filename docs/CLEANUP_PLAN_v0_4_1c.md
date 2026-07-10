# CLEANUP PLAN v0.4.1c-livehouse-draft

## 目的

GitHub Pages のビルド時間を短くするため、公開に必要なファイルだけをリポジトリ直下に残し、監査資料・履歴資料を `docs/` 以下へ移動します。

## ルートに残すファイル

```text
.nojekyll
index.html
game.js
style.css
sw.js
VERSION.txt
manifest.json
README.md
```

## 移動先

```text
docs/changelog/  CHANGELOG_*.md
docs/audit/      AUDIT*.md / AUDIT_PACKET*.md / AUDIT_REPORT*.md / CHATGPT_AUDIT*.md / MOBILE_SMOKE*.md
docs/fable5/     FABLE5_*.md
docs/planning/   ROADMAP_*.md / SIMULATION_*.md / BALANCE_*.md
docs/archive/    旧READMEやZIPなど
tools/audit/     audit*.js
tools/cleanup/   cleanup scripts
```

## 重要

GitHubのWeb画面でZIPをアップロードしても、既存のルート直下ファイルは自動削除されません。  
ビルド軽量化のためには、古い `AUDIT_*.md` や `CHANGELOG_*.md` をルートから消す必要があります。

## 推奨手順：PCでGitを使う場合

```bash
git pull
bash tools/cleanup/cleanup_repo_layout_v041c.sh
git add -A
git commit -m "Organize docs for GitHub Pages"
git push
```

## GitHub Webだけでやる場合

1. この整理版ZIPの中身を確認する
2. ルート直下にある `AUDIT_*.md` / `CHANGELOG_*.md` / `FABLE5_*.md` / `ROADMAP_*.md` / `SIMULATION_*.md` / `BALANCE_*.md` を削除または `docs/` へ移動する
3. ルートに残すのは上記8ファイルだけにする
4. `.nojekyll` は消さない

## ルートから移動・削除対象だったファイル一覧

```text
AUDIT_PACKET_v0_3_67.md
AUDIT_PACKET_v0_3_68.md
AUDIT_PACKET_v0_3_69.md
AUDIT_PACKET_v0_3_70.md
AUDIT_PACKET_v0_3_71.md
AUDIT_PACKET_v0_3_72.md
AUDIT_PACKET_v0_3_73.md
AUDIT_PACKET_v0_3_74.md
AUDIT_PACKET_v0_4_0_rc1.md
AUDIT_PACKET_v0_4_0_rc2.md
AUDIT_PACKET_v0_4_0_rc3.md
AUDIT_PACKET_v0_4_0a.md
AUDIT_PACKET_v0_4_0b.md
AUDIT_PACKET_v0_4_0c.md
AUDIT_PACKET_v0_4_0d.md
AUDIT_PACKET_v0_4_0e.md
AUDIT_PACKET_v0_4_1a.md
AUDIT_PACKET_v0_4_1c.md
AUDIT_REPORT_v0_4_1c.md
AUDIT_v0_3_61_member_draft_fix6.md
AUDIT_v0_3_62_fix2.md
AUDIT_v0_3_62_novel_dev_draft.md
AUDIT_v0_3_63_novel_events_draft.md
AUDIT_v0_3_64_growth_type_draft.md
AUDIT_v0_3_66_balance_draft.md
AUDIT_v0_3_66_balance_draft_fix1.md
AUDIT_v0_3_67_ui_support_growth_tuning_draft.md
AUDIT_v0_3_68_afterparty_events_draft.md
AUDIT_v0_3_69_action_mini_events_draft.md
AUDIT_v0_3_70_band_events_extension_draft.md
AUDIT_v0_4_0_rc1.md
AUDIT_v0_4_0_rc2.md
AUDIT_v0_4_0_rc3.md
AUDIT_v0_4_0a_ui_foundation_draft.md
AUDIT_v0_4_0b_live_prep_steps_draft.md
AUDIT_v0_4_0c_phone_tutorial_draft.md
AUDIT_v0_4_0d_bandbook_lore_draft.md
AUDIT_v0_4_0e_world_reactions_draft.md
AUDIT_v0_4_1a_visual_foundation.md
BALANCE_BASELINE_v0_3_66.md
CHANGELOG_v0_3_60_big_draft.md
CHANGELOG_v0_3_61_member_draft.md
CHANGELOG_v0_3_61_member_draft_fix1.md
CHANGELOG_v0_3_61_member_draft_fix2.md
CHANGELOG_v0_3_61_member_draft_fix3.md
CHANGELOG_v0_3_61_member_draft_fix4.md
CHANGELOG_v0_3_61_member_draft_fix5.md
CHANGELOG_v0_3_61_member_draft_fix6.md
CHANGELOG_v0_3_62_fix2.md
CHANGELOG_v0_3_62_novel_dev_draft.md
CHANGELOG_v0_3_62_novel_dev_draft_fix1.md
CHANGELOG_v0_3_63_novel_events.md
CHANGELOG_v0_3_63_novel_events_draft_fix1.md
CHANGELOG_v0_3_64_growth_type.md
CHANGELOG_v0_3_65_band_events.md
CHANGELOG_v0_3_66_balance_draft.md
CHANGELOG_v0_3_66_balance_draft_fix1.md
CHANGELOG_v0_3_67_ui_support_growth_tuning.md
CHANGELOG_v0_3_68_afterparty_events.md
CHANGELOG_v0_3_69_action_mini_events.md
CHANGELOG_v0_3_70_band_events_extension.md
CHANGELOG_v0_3_71_band_skill_tuning.md
CHANGELOG_v0_3_72_mobile_ui_polish.md
CHANGELOG_v0_3_73_balance_simulation_and_fix.md
CHANGELOG_v0_3_74_release_candidate_audit.md
CHANGELOG_v0_4_0_rc1.md
CHANGELOG_v0_4_0_rc2.md
CHANGELOG_v0_4_0_rc3.md
CHANGELOG_v0_4_0a_ui_foundation.md
CHANGELOG_v0_4_0b_live_prep_steps.md
CHANGELOG_v0_4_0c_phone_tutorial.md
CHANGELOG_v0_4_0d_bandbook_lore.md
CHANGELOG_v0_4_0e_world_reactions.md
CHANGELOG_v0_4_1a_visual_foundation.md
CHANGELOG_v0_4_1c_livehouse_draft.md
CHATGPT_AUDIT_v0_4_1c.md
FABLE5_AUDIT_PROMPT_v0_3_66.md
FABLE5_AUDIT_PROMPT_v0_4_0_rc1.md
FABLE5_EXTERNAL_AUDIT_v0_4_0_rc1.md
FABLE5_FINAL_AUDIT_REPORT_v0_3_74.md
MOBILE_SMOKE_CHECK_v0_3_66_fix1.md
ROADMAP_AFTER_v0_3_61.md
ROADMAP_AFTER_v0_3_62_FIX2.md
SIMULATION_PLAN_v0_3_66.md
```
