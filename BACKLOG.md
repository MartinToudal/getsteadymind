# SteadyMind Backlog

## Now

- [ ] Fortsæt daglig brug i den online app, så vi lærer af reel brug over tid.
- [ ] Saml løbende feedback fra mobilbrug: navigation, læsbarhed, tempo og friktion i dagens flow.
- [ ] Fortsæt med at finjustere Daily Pulse, Home og Progress ud fra reel daglig brug, ikke kun designantagelser.

## Next

- [ ] Tilføj mere meningsfuld progress-feedback, så brugeren mærker reel udvikling over tid.
- [ ] Brug pilot-readiness checklisten til at vurdere, hvornår de første 2-3 pilotbrugere kan inviteres ind.

## Later

- [ ] Kobl `getsteadymind.dk` og `getsteadymind.com` på Vercel, og beslut hvilken der skal være primær app-URL.
- [ ] Byg en native app når web-produktets vane og værdi er bevist tydeligt nok til at fortjene det.
- [ ] Undersøg temabaserede fokusspor, hvor brugeren kan arbejde mere i dybden med et område som bekymring, selvtro, mindfulness eller at lægge mere mærke til egne succeser.
- [ ] Tilføj Supabase CLI og et rigtigt migrations-flow.
- [ ] Tilføj enkel testdækning for centrale server actions og page flows ud over de nuværende E2E-tests.
- [ ] Ryd op i data- og UI-laget, så appen er lettere at udvide efter MVP.

## Done

- [x] Slet den gamle kompromitterede secret key i Supabase.
- [x] Rotate Supabase secret key, fordi en nøgle er blevet delt i chatten.
- [x] Omdøb `SUPABASE_SERVICE_ROLE_KEY` til `SUPABASE_SECRET_KEY` i koden, så navngivningen matcher den faktiske key-type.
- [x] Verificer manuelt login i lokal app.
- [x] Tilføj tydelig fejlhåndtering i auth- og submit-flows.
- [x] Tilføj server-side validering af check-in og session inputs.
- [x] Tilføj Playwright E2E-tests for login, Daily Pulse og første guided session.
- [x] Læs sessions fra `sessions`-tabellen i stedet for hardcoded data i [`lib/program.ts`](/Users/martintoudal/Documents/Toudal%20Consulting/Domæner/steadymind/lib/program.ts).
- [x] Tilføj tomme states for Progress, Program og Home.
- [x] Forbedr re-entry flow og edge cases omkring inaktivitet.
- [x] Stram auth-beskyttelse og redirect-logik yderligere.
- [x] Tilføj loading og disabled states på formularer.
- [x] Udvid Playwright-suiten med tests for Progress og re-entry flow.
- [x] Gør projektet klar til Vercel deployment med produktions-env-vars.
- [x] Få appen online på Vercel og verificer login og dataflow i produktion.
- [x] Gør Foundation 30 mere tydelig som en metode, ikke kun en række spørgsmål.
- [x] Indfør soft pacing i Foundation 30: anbefal én session om dagen uden at låse næste session hårdt.
- [x] Gennemgå de første Foundation 30 prompts for at gøre dem mindre tunge eller abstrakte i starten af forløbet.
- [x] Overvej lettere onboarding-copy, så brugeren ikke møder for store spørgsmål for tidligt.
- [x] Gennemgå mobiloplevelsen side for side og stram spacing, hierarki og navigation der hvor telefonen stadig føles klemt.
- [x] Definér hvad der skal være på plads, før de første 2-3 pilotbrugere inviteres ind.

## Notes

- Hold `Now` kort og fokuseret. Kun ting der aktivt bør løses snart.
- Lad `Next` være de næste produktløft efter de aktuelle fokusområder.
- Brug `Later` til større investeringer eller ting der først giver mening efter mere læring.
- Flyt færdige punkter til `Done` i stedet for at lade `Now` og `Next` blive overfyldte.
