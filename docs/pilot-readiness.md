# SteadyMind Pilot Readiness

This document defines what should be true before the first 2-3 external pilot users are invited into SteadyMind.

The goal is not to make the product perfect.
The goal is to make it trustworthy enough that pilot feedback reflects the product itself, not avoidable rough edges.

## Pilot Goal

The first pilot should answer these questions:

- Can a new user understand what SteadyMind is for without extra explanation?
- Can they complete the core loop on phone without friction?
- Do they feel enough value to return after the first few days?
- Do they describe the product as useful mental fitness, not just another journaling app?

## Pilot Scope

The first pilot should stay deliberately small:

- 2-3 users
- mobile-first usage
- people who are already somewhat open to reflection and self-development
- users who can give thoughtful qualitative feedback

This is not the stage for scale, growth, or broad acquisition.

## Ready For Pilot When

### 1. Core flows are stable

The following should work reliably in production:

- signup
- login/logout
- Daily Pulse completion
- Foundation 30 session completion
- Progress page loading correctly
- re-entry flow after inactivity

### 2. Mobile usage feels good enough

The product does not need to be perfect on phone, but it should feel calm and usable:

- navigation is easy to understand
- primary actions are easy to tap
- reading flow does not feel cramped
- no key screen feels broken or awkward on a normal phone viewport

### 3. The product explains itself

A pilot user should not need a personal walkthrough to understand the basics:

- login and signup copy feel welcoming and clear
- Home makes the next step obvious
- Today makes the difference between check-in and guided session understandable
- Foundation 30 feels like a method, not a random list of prompts

### 4. The value is noticeable

The product should create enough felt value to justify repeated use:

- Daily Pulse feels easy enough to repeat
- Progress gives at least some useful interpretation, not only charts
- a user can describe what the product is helping them with after a few uses

### 5. Operational trust is in place

The product should be safe enough to share without avoidable concern:

- production env vars are set correctly
- compromised keys have been removed
- database schema and content changes are tracked through SQL files
- the team knows how to recover if a deployment breaks

## Not Required Yet

These things are useful later, but they are not required for the first pilot:

- native app
- custom domain
- advanced analytics
- broad automated test coverage
- multiple programs beyond Foundation 30
- deep personalization or focus paths

## Pilot Readiness Checklist

- [ ] Production auth flow works cleanly for a brand-new user.
- [ ] A user can complete Daily Pulse on phone without confusion.
- [ ] A user can complete a guided session on phone without confusion.
- [ ] Progress feels understandable enough after a few entries.
- [ ] Home makes the recommended next step clear.
- [ ] No known high-friction mobile layout issues remain in core flows.
- [ ] The product feels calm and trustworthy enough to share without apology.
- [ ] We know who the first 2-3 pilot users should be.
- [ ] We know what feedback we want from them.
- [ ] We know how we will capture that feedback.

Current status:

- see [`docs/pilot-readiness-status.md`](/Users/martintoudal/Documents/Toudal%20Consulting/Domæner/steadymind/docs/pilot-readiness-status.md) for the live assessment against this checklist

## What We Want To Learn In The Pilot

We should ask pilot users about:

- what felt immediately clear or unclear
- whether the product fit naturally into their day
- whether Daily Pulse felt useful or repetitive
- whether Foundation 30 felt meaningful or too abstract
- whether Progress helped them notice anything important
- whether they wanted to come back the next day

## Exit Criteria

SteadyMind is pilot-ready for now when:

- we can share it with 2-3 real users without needing to warn them about core instability
- we believe their feedback will mostly be about product value and method, not basic usability
- we are comfortable learning from their usage rather than manually compensating for missing product clarity
