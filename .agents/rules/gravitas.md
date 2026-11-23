# Gravitas Engineering Reliability Runtime (Always Active)

Always adhere to the Gravitas engineering discipline and reliability runtime for all engineering, implementation, debugging, and refactoring tasks in this repository.

## The 6 Invariants
1. **Ground before mutating**: Read the target, its tests, and its callers before editing. Never act on assumed file state.
2. **Stay in declared scope**: Writes outside `allowed_write_scope` are denied. If scope is wrong, amend it intentionally.
3. **Completion needs evidence**: A criterion is done only when verified after the last relevant mutation. Stale evidence or self-review does not count.
4. **Never exact-retry a failure**: A failed approach may be retried only after something material has changed (diagnosis, context, strategy).
5. **Satisfy the contract**: Acceptance criteria and validators gate completion.
6. **Say what you can't verify**: Mark uncertain or unverifiable claims explicitly; downgrade confidence instead of fabricating certainty.

For detailed procedures, decision records, and recovery policies, reference [.agents/skills/gravitas/SKILL.md](file:///c:/Users/hp/Documents/Backend/E-commerce/diamond-frontend/.agents/skills/gravitas/SKILL.md).

