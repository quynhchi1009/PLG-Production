---
target: MCP tab responsive, sizes and spacing
total_score: 14
max_score: 28
na_heuristics: 2,9,10
p0_count: 1
p1_count: 3
target_identity: "file:/Users/quynhchilai/PLG Production/portal2-search/src/pages/McpPage.tsx"
target_fingerprint: "sha256:6aa3667dc86916286b7363bb7382a806c24ff91a706c597ba4715a185f99890f"
target_path: /Users/quynhchilai/PLG Production/portal2-search/src/pages/McpPage.tsx
timestamp: 2026-11-05T04-20-07Z
slug: src-pages-mcppage-tsx
---
Method: dual-agent (A: design/responsive reviewer, B: detector + measured browser evidence). Scope: responsive behaviour, sizes and spacing only; no copy/colour/content changes; 1440 desktop comp is fixed.

# Design Health Score: 14/28 (50%), bottom of Acceptable. n/a: heuristics 2, 9, 10.

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | Chart ticks shrink to 7-9px between 1181 and 1024 |
| 2 | Match System / Real World | n/a | Copy only |
| 3 | User Control and Freedom | 1 | "Collapse Sidebar" has no handler |
| 4 | Consistency and Standards | 2 | Button heights vary; paying sidebar 8px low |
| 5 | Error Prevention | 3 | Refresh dialog fine; targets small |
| 6 | Recognition Rather Than Recall | 2 | Key value wraps to 8px columns at 375 |
| 7 | Flexibility and Efficiency | 1 | Same fixed layout at every width |
| 8 | Aesthetic and Minimalist Design | 3 | Desktop calm; tablet/phone undesigned |
| 9 | Error Recovery | n/a | Copy and flow |
| 10 | Help and Documentation | n/a | Out of scope |

Verdict: faithful 1440 transcription, no responsive layer. Only media query is max-width 1180 in UsageCard.module.css. Detector: static scan 0 findings; runtime overlay 17 (4 MCP-owned: 3 tight-leading 16/20, 9 wide-tracking on 11px terminal text likely false positive).

# Priority Issues
- [P0] Page collapses below ~800px: fixed 220px sidebar, 36px gutters, nowrap header; main column 155px at 375; overflow at 768 in 5 of 6 states. Fix in McpShell.module.css: off-canvas sidebar below 960 wired to "Collapse Sidebar", main padding 24/16, header gap 16. Command: adapt
- [P1] Usage card: .metrics fixed 600px overflows 26px each side at 768; chart ticks 7.1px at 1181, 10.1px at 1280, 1px breakpoint cliff at 1180. Fix: fluid metrics, stack at 1360, chartWrap width 100%, column metrics below 560. Command: adapt
- [P1] Hero terminal: .pitch flex 0 0 651px; terminal clipped ~17px at 1024, ~40% of lines at 768; counts row overflows; CTA wraps. Fix: column hero at <=1100, wrap demoHeader, auto-height terminal, ellipsis. Command: layout
- [P1] Trial/paying header: .countdown fixed 360px, header 814px at 768, buttons wrap. Fix: flexible countdown, nowrap buttons, compact header and hidden label below 960, bell+cart only below 600. Command: adapt
- [P2] Touch targets (24x24 eye/close, 36px nav/CTA/dialog buttons) and text under 12px (terminal 9-11px, badges 9-10px). Fix: coarse-pointer / <=960px layer with 44px hit areas, 12px text. Command: polish

# Persona red flags
Casey: unusable at 375, CTA off-screen. Sam: 7-9px chart ticks, 24px targets, key text wraps to 8px columns, Collapse Sidebar does nothing. Jordan: key row and metrics broken at 768, CTA wraps.

# Minor
Paying sidebar top 76 vs header 68; off-grid Figma values (25, 11/15, 8.5/16.5, 41); nowrap on metricHead/pct/note; Logout scrolls out under ~700px height; heading ratio 1.17 (from design); logo crop uses percent offsets.

# Questions
Should this tab claim tablet/phone support at all? One fluid auto-fit grid instead of fixed columns? Why does Collapse Sidebar do nothing?
