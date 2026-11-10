---
target: critique the mcp (re-run after fixes)
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/Users/quynhchilai/PLG Production/portal2-search/src/pages/McpPage.tsx"
target_fingerprint: "sha256:6aa3667dc86916286b7363bb7382a806c24ff91a706c597ba4715a185f99890f"
target_path: /Users/quynhchilai/PLG Production/portal2-search/src/pages/McpPage.tsx
timestamp: 2026-11-05T06-52-22Z
slug: src-pages-mcppage-tsx
---
Method: dual-agent (A: design-review sub-agent, B: detector + browser-evidence sub-agent)

# Critique: MCP tab (src/pages/McpPage.tsx), third run

## Design Health Score
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | Activation/refresh end in silence; focus drops to body after Activate; key stays masked |
| 2 | Match System / Real World | 3 | Plain framing; subtitle promises a tool-call log that doesn't exist |
| 3 | User Control and Freedom | 3 | Esc/X/scrim/Cancel work, focus returns; Activate dialog starts on Cancel |
| 4 | Consistency and Standards | 2 | Metric order Lite/Search vs Search/Lite elsewhere; three near-identical whites; dead nav buttons |
| 5 | Error Prevention | 3 | Danger dialog clear; confirm on a free action is friction without protection |
| 6 | Recognition Rather Than Recall | 3 | Key/URL always visible with labelled Copy |
| 7 | Flexibility and Efficiency | 2 | ~13 Tab stops to Copy after Activate; two Copy actions |
| 8 | Aesthetic and Minimalist Design | 2 | Each metric stated three ways; dashed chips read as placeholders |
| 9 | Error Recovery | 2 | Limit: "Inactive" badge + green key border, raw quota_exceeded, next step 600px away |
| 10 | Help and Documentation | 2 | Terminal demo teaches; docs button has no target (accepted) |
| **Total** | | **24/40** | Acceptable (60%) |

Previous runs: 14/28 (n/a 2,9,10), 21/40.

## Design Specificity Verdict
Competent but generic (~2/5). Terminal demo is the only product-specific moment; post-activation is stock SaaS. Detector: static scan [] clean; live DOM: 5 findings (10px shell badges, overused-font) on active states, 12 on activate-dialog (9px badge, hero line-length 90/98/55 chars, terminal tracking). No visible overlay (background tab).

## Overall Impression
A11y and responsive engineering is solid (no overflow, 44px targets <=768, dialog/drawer traps, consistent data). Remaining: hierarchy and feedback. Activation lands on nothing; limit state is the quietest thing on the page.

## What's Working
- Terminal demo and hero split.
- Portalled dialog with inert root, drawer trap, live region, two-row key grid on phones.
- Honest data model: used/left/percent/chart all from one series.

## Priority Issues
- [P1] Activation moment silent, loses focus (useMcp.ts:30-41): focus -> heading + status announcement, optionally reveal key once. /impeccable harden, /impeccable delight
- [P1] Limit-reached contradicts itself: "Inactive" badge, green key border, quota_exceeded unstyled, rep line buried. Use existing copy. /impeccable clarify, /impeccable layout
- [P2] Flat type hierarchy (h1 28/40 Open Sans vs 24/30 Roboto titles) and undersized hero CTA (36px, --av-button-lg-h 46px unused). /impeccable typeset
- [P2] Usage card: 3 representations per metric, metric order, flat Lite line on shared axis, colour-only series (purple 3.36:1), 1px sliver bar. /impeccable distill, /impeccable layout
- [P3] Contrast/chrome: "Get help" 3.25-3.42:1 on header gradient, 16% scrim, three near-identical whites, trial header 143px at 375. /impeccable colorize, /impeccable adapt

## Persona Red Flags
- Alex: ~13 Tab stops to Copy after Activate; masked key = two clicks; no Refresh confirmation.
- Sam: "Get help" ~3.3:1; colour-only series; focus lost on activation; 10px badges; two buttons both named "Copy".
- Casey: trial header 143px of 812; eye icon far from the value it toggles; limit support line stranded.

## Minor Observations
- Accepted gaps: no connect-your-client block, no limit action, docs target.
- Terminal decorative contrast: "✓ 3 candidates found" 4.08:1, "·" 1.83:1 (aria-hidden).
- "Al agent" typo in four strings; tool naming inconsistent.
- Paying state shows free-beta subtitle and rep line.
- Dead nav buttons; dev StateSwitcher overlay, not inert with drawer, 3.27:1 label.
- Terminal longest line has 2px spare at 375.

## Questions to Consider
- Why is a free, instant activation a confirm dialog instead of one click landing on a revealed key?
- What is the one thing to do in the first ten seconds after the key appears?
- Does a one-time allowance need a seven-day line chart, or two honest meters?
