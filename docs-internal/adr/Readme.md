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
