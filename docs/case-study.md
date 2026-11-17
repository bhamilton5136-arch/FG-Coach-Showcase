# FG Coach — product case study

**Focus:** AI product strategy, evaluation, and player trust
**Stage:** Local MVP under evaluation; not a public beta

## The problem

A replay shows a fighting-game player what happened, not what to practice. A list of detected moves is not a coaching outcome. I wanted a player to finish a review with a few understandable decisions and one thing to try next.

## The product bet

**Connect once → select a replay → approve once → get coaching.** The player reviews coaching beside the original recording, jumps to timestamped moments, and rates or corrects each piece of advice. The recording stays on the device, while approved screenshots may be sent for AI analysis. Local-first does not mean everything runs locally.

## The decisions that mattered

**Recognition serves coaching.** My early prototype focused on detecting more game events. It helped, but more detected events did not produce better advice. I moved the roadmap to the player's outcome: a supported decision, why it mattered, a useful adjustment, and a drill when one fits. Reinforcement counts as an outcome too. In the Alex versus Terry example, the AI recognizes that the player returned to defense after successful offense and says so, instead of inventing a mistake to correct.

**Natural language still needs factual review.** Plain prompting gave more natural coaching than my earlier structured approach, but it also misidentified moves. I now give the model independently generated recognition findings alongside the screenshots. Evidence checks are guardrails, not proof. A plausible explanation can still misread a move or assume intent.

**Technical completion is not product acceptance.** The first Alex versus Cammy run finished every stage, but its coaching failed human review. It narrated a closing exchange, missed an earlier decision, and said too much. I kept the original result and its failing verdict, then redesigned the product around the failure. Gameplay events and coaching decisions are now separate, and each coaching card has its own timestamp, explanation, adjustment, and rating.

**Broader coverage without a bigger budget.** The current design surveys the whole match in one request of 30 images, inspects up to two short windows in detail, and makes at most one coaching request. The ceiling is three requests per replay, with no automatic retries. Three coaching cards is a limit, not a target, and if no window has qualifying evidence, the workflow stops.

**Consent players can understand.** One informed approval covers the bounded stages of a replay. Saved-run protections prevent duplicate requests after an interruption, and reopening a report never triggers a new analysis. The app warns players about possible credit use and does not claim to enforce included-only funding.

## What the evaluation showed

Six fighting-game community members shared their own replays, and I shared the AI's coaching with each of them.

| Players | Skill level | Feedback |
| --- | --- | --- |
| 5 | Bronze to low Diamond | Helpful for spotting gaps in their play and learning from them |
| 1 | High Diamond to low Master | A little too generic and unhelpful |

They reviewed the advice only and did not use the app. This was an informal study. It did not measure accuracy or improvement, so I treat it as direction, not proof. My hypothesis is that the coaching helps beginner and intermediate players more, and that advanced players need more specific detail.

The accepted coaching cards in the UI are human-written. They show the experience I'm aiming for, not that AI delivers it reliably yet.

## What I owned

- Defined the player problem, MVP scope, and acceptance criteria.
- Directed the shift from detection coverage to coaching usefulness.
- Reviewed real gameplay output for accuracy, naturalness, and whether a player could act on it.
- Chose one replay approval, capped requests, saved records, and honest failure states.
- Guided Codex-assisted implementation and testing, without treating generated code or passing tests as product acceptance.

## What I learned

The question was never whether the model could produce polished language. It was whether a player could trust the explanation and use it. Keeping a failed evaluation and changing the product around it was worth more than calling a technical success a launch.

## What's next

1. Run a supervised test in which the AI picks the useful moments itself and produces evidence-backed coaching comparable to the human-written cards.
2. Test with more players, especially higher-ranked ones, on replays beyond my development cases.
3. Review factual accuracy independently of whether players found the advice useful.

[Evaluation approach](evaluation.md) · [Back to overview](../README.md)
