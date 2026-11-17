# Evaluating the coaching

## Player feedback

Six players reviewed AI-generated coaching: five found it helpful, while one advanced player—high Diamond / low Master—described it as “a little too generic and unhelpful.” These are owner-reported formative findings, not a UI usability study, an end-to-end workflow acceptance test, or a representative measurement of accuracy.

## Two separate quality questions

**Gameplay recognition:** Is the correct player identified? Are the selected moments useful? Are the events, chronology, attribution, and screenshot references supported? Which moves, inputs, timing, or causes remain unclear?

**Coaching:** Does the explanation identify a useful decision and consequence? Is the adjustment supported? Is the language natural, understandable, and actionable? Is a suggested drill executable and measurable?

For the next controlled quality evaluation, naturalness, understandability, and actionability each require at least 4/5 from human review, plus mandatory factual checks. A serious invented move, event, player attribution, or guaranteed outcome blocks acceptance regardless of fluency.

Correction, reinforcement, and abstention are all permitted. A justified abstention passes a safety check but does not demonstrate useful coaching. Reinforcement is not penalized for omitting a corrective drill.

## What automated checks do

Checks cover image identity, timestamps, ordering, evidence references, response limits, request ceilings, interruption recovery, and saved-result reopening. They screen some unsupported claims, but do not certify factual accuracy or reconstruct exact inputs from screenshots.

Responses over 2,000 output tokens, including reasoning tokens, are not accepted. That is a response-acceptance rule, not a guarantee that generation or consumption stops at that number.

## Keep the evidence categories distinct

- **Alex–Cammy interface:** accepted human-written coaching examples in the actual frontend.
- **Alex–Terry archived AI example:** genuine model output from a person-selected 4:00–4:08 window. Human naturalness, understandability, and actionability scores were 4/5, conditionally at review; the owner later confirmed the practice setup. It did not test autonomous whole-match selection.
- **Alex–Cammy live failure:** the workflow completed, but the coaching missed the quality standard. The original failed verdict is preserved.
- **Revised two-window design:** offline implementation and regression coverage, not yet proof of live coaching quality.

Cases used to improve the product are development regressions, not independent unseen tests. Earlier failed evaluations remain failed; newer examples do not overwrite them.

[Back to FG Coach](../README.md)
