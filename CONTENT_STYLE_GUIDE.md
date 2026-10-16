# CONTENT_STYLE_GUIDE — DhanPedia

Voice: intellectually rigorous, analytical, neutral, transparent about
uncertainty, and understandable to a motivated Indian reader. Beginners are
served without oversimplifying for advanced readers.

## Every article answers (use only the sections the topic needs)

1. What is it? 2. How does it work? 3. Why does it matter?
4. Underlying mechanics 5. How is the return generated?
6. What risks destroy/reduce returns? 7. Costs, fees, taxes?
8. Who is eligible? 9. How liquid is it? 10. What evidence supports the conclusion?
11. Which alternatives to compare? 12. Common misconceptions?
13. When is it inappropriate? 14. Practical due-diligence checklist?
15. Limitations / unsuitable cases. 16. Advanced considerations.
17. Further reading + related DhanPedia articles. 18. Sources & citations.
19. Last verified date. 20. Editorial/review status.

Do **not** force every section into every article. Preserve substance.

## Depth

- Standard comprehensive articles: ~1,500–3,500 words.
- Reference entries: shorter. Textbook chapters: longer.
- Objective is complete explanation, **not padding or word-count targets.**

## Article frontmatter (MDX)

```
---
title: "..."
description: "A concise description."
id: "kebab-case-id"            # must match articles.json
category: "mutual-funds"
tags: ["sip", "equity"]
difficulty: "beginner"         # beginner | intermediate | advanced | all
status: "published"
author: "Chirag Singhal"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
lastVerified: "YYYY-MM-DD"
reviewAfter: "YYYY-MM-DD"      # for time-sensitive topics
sources: ["src-sebi-elss"]     # must exist in sources.json
relatedArticles: ["mf-sip-explained"]
books: ["book-mutual-funds"]
---
```

## Non-negotiables

- **Distinguish** verified fact, estimate, assumption, historical, and opinion.
- Never promise returns or guarantee capital.
- Never present a yield as a total return without explaining the difference.
- Never compare incompatible periods/tax/risk/cash-flow conventions without saying so.
- Clearly separate **educational content** from individualized advice.
- No "peer-reviewed/expert-reviewed" claims unless a review actually happened.
- Cross-link related articles; avoid near-duplicate copies (differentiate by purpose).

## Formatting

- KaTeX for equations; Mermaid for process/relationship diagrams; ECharts for
  quantitative comparisons.
- Every chart/diagram has a **textual explanation and alt text**, and a table
  alternative where data matters for screen readers/printing.
- No false precision; never imply historical returns guarantee the future.
