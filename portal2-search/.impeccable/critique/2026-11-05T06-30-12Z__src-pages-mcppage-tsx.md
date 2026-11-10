---
target: critique the mcp again
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/Users/quynhchilai/PLG Production/portal2-search/src/pages/McpPage.tsx"
target_fingerprint: "sha256:6aa3667dc86916286b7363bb7382a806c24ff91a706c597ba4715a185f99890f"
target_path: /Users/quynhchilai/PLG Production/portal2-search/src/pages/McpPage.tsx
timestamp: 2026-11-05T06-30-12Z
slug: src-pages-mcppage-tsx
---
Method: dual-agent (A: design-review sub-agent, B: detector + browser-evidence sub-agent)

# Critique: MCP tab (src/pages/McpPage.tsx), second run

## Design Health Score
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | Masked key after activation, no "active / no calls yet" signal; header says "View Report" on MCP |
| 2 | Match System / Real World | 3 | Terminal demo fits; `quota_exceeded` and "Lite report" unglossed |
| 3 | User Control and Freedom | 2 | Refresh is cancellable; no grace period for old key; Copy works while masked |
| 4 | Consistency and Standards | 2 | Mixed heading fonts/radii; paying state still says "Free beta allowance. One-time." |
| 5 | Error Prevention | 3 | Destructive dialog names consequence; no in-use warning |
| 6 | Recognition Rather Than Recall | 2 | No paste-ready config; docs button has no target |
| 7 | Flexibility and Efficiency | 1 | No copy-config, no call log (promised in subtitle) |
| 8 | Aesthetic and Minimalist Design | 3 | Calm; chips read as usage data |
| 9 | Error Recovery | 2 | Limit alert has no action; rep line is a footnote below the chart |
| 10 | Help and Documentation | 1 | Dead docs button, no inline guidance |
| **Total** | | **21/40** | Acceptable (52%) |

Previous run: 14/28 with heuristics 2, 9, 10 n/a. Not like-for-like.

## Design Specificity Verdict
Partly specific. The pre-activation terminal demo is product-specific; post-activation is a generic API-key + usage page.
Deterministic scan: detect on McpPage.tsx + src/components/mcp = [] (clean). Browser scan: 10px bell badge and 9-10px "New" badges (shell), 1.25 line-height on 16px paragraphs (hero body, subtitle, credentials description), 0.08em tracking on terminal lines (intentional), overused-font Open Sans (site-wide, accepted). Detector ran in a background tab; no user-visible overlay.

## Overall Impression
Responsive pass held (0 overflow at 1440/768/375, targets >=44px at <=768). Biggest opportunity: the moment after activation; weakest moment: limit-reached.

## What's Working
- Terminal demo is the one distinctive moment; aria-hidden while the pitch carries the meaning.
- Refresh dialog: Cancel focused first, consequence stated, Esc and scrim close, focus returns.
- Responsive layer: chart ticks ~12px, capability table stacks via data-label, drawer respects reduced motion.

## Priority Issues
- [P1] Post-activation is a dead end (no paste-ready config, dead docs button). Fix: "Connect your client" block + real href. Needs a design decision (adds content). /impeccable onboard
- [P1] Limit-reached has no action (14px strip, rep line is grey footnote at UsageCard.tsx:65). Fix: card-weight alert with action. /impeccable clarify, /impeccable harden
- [P1] Numbers can't be trusted or read: "2 used" vs "28% consumed"; chart sums 14 and 9 vs "2 used"; hero "200"/"20" are rgb(28,28,27) on dark gradient (1.01:1). Fix: one source of truth, readable colour. /impeccable harden
- [P2] Modal/drawer a11y: aria-modal without inert/focus trap (Tab leaves dialog, confirmed), drawer focus not moved, toggle label stays "Open navigation", no live region for "Copied", 24px eye toggle, "Refresh key" text 4.30:1. /impeccable audit
- [P2] Narrow credentials layout: eye orphaned, Copy on third line, revealed key breaks mid-token, 120px usage bars on faint track, dangling metric border at 768, "Upgrade" truncated in trial header at 768. /impeccable adapt

## Persona Red Flags
- Jordan: masked key + URL + dead docs button, no snippet, subtitle promises a log that doesn't exist.
- Sam: Tab leaves both dialogs, drawer never takes focus, 24px eye toggle, "Copied" not announced, "Refresh key" under AA.
- Casey: key takes three lines, recovery text ~3 screens below the alert in limit state, usage bars shrink to dashes.

## Minor Observations
- Standard header reads "View Report" on MCP page; paying usage subtitle still says free beta.
- Colours bypass tokens (#111827, #6b7280, #f0f2f7, #ffefef, #95231e, #e6efff, #0043ce).
- "Inactive" badge on limit-reached is a misnomer.
- 1.25 leading on 16px body text in three places.
- Hyphen where a dash is meant in subtitle ("beta - 200").
- Dev state switcher: 24px links, 3.27:1 "States" text (not product UI).

## Questions to Consider
- If someone had to connect Claude in 60 seconds after Activate, why land on asterisks and a chart of zeros?
- What does a user do on this page on day 5?
- When the allowance runs out, should the loudest element be a 14px red strip?
