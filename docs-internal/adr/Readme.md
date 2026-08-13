# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for this project.
ADRs are short documents that capture important architectural decisions, along with their context and consequences.

## Purpose

- To document significant architectural decisions.
- To provide context for why decisions were made.
- To help onboard new team members.
- To facilitate future architectural discussions and evolution.
- To provide context to AI-powered development assistants.

## Format

Each ADR should follow the template in `ADR-0000-Title-of-ADR.md`.

## Process

1.  **Propose:** Copy `ADR-0000-Title-of-ADR.md` to a new file named `ADR-NNNN-title-of-adr.md`, where `NNNN` is the next sequential number and the rest is a dash-separated, lowercase version of the title.
2.  **Discuss:** Fill out the ADR and discuss it with the team.
3.  **Decide:** Once a decision is reached, update the status in the ADR (e.g., "Accepted", "Rejected", "Superseded").
4.  **Commit:** Commit the ADR to the repository.

## ADR Log

| ADR Number | Title                                                                  | Status   | Date       |
| :--------- | :--------------------------------------------------------------------- | :------- | :--------- |
| ADR-0000   | Template for ADRs                                                      | Meta     | 2026-07-29 |
| ADR-0001   | Replace JS-forced pixel viewport height with CSS viewport units on iOS | Proposed | 2026-07-29 |
| ADR-0002   | VirtualSelect 1.4.0 upgrade and OSUI validation ownership              | Accepted | 2026-08-11 |
| ADR-0003   | Public-repo readiness for the Storybook harness                        | Accepted | 2026-08-12 |
| ADR-0004   | Chromatic visual testing on a long-living branch                       | Accepted | 2026-08-12 |
| ADR-0005   | Reconciling the new-theme branch with `dev`                            | Accepted | 2026-08-12 |
| ADR-0006   | O11 SCSS bundle and per-platform icon libraries                        | Accepted | 2026-08-12 |
| ADR-0007   | Build and tooling hygiene                                              | Accepted | 2026-08-12 |

> The **"Make Great UI"** initiative (epic ROU-12776) also has a phase-by-phase decision
> history in `specs/plan.md` (D1–D28) and `specs/plan-part-four.md` (D28–D37, theme
> layer). Those `D-n` numbers are per-document and independent of the `ADR-NNNN` series
> here — note that both spec files happen to contain a **D28**, so always cite the source
> document alongside the number. ADR-0003…0007 record the cross-cutting decisions from
> that initiative which do not belong to a single migration phase.
