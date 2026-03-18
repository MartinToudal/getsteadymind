# SteadyMind Backlog

## Now

- [x] Rotate Supabase secret key, fordi en nøgle er blevet delt i chatten.
- [x] Omdøb `SUPABASE_SERVICE_ROLE_KEY` til `SUPABASE_SECRET_KEY` i koden, så navngivningen matcher den faktiske key-type.
- [ ] Slet den gamle kompromitterede secret key i Supabase, hvis den ikke allerede er fjernet.
- [ ] Fortsæt daglig brug i den online app, så vi kan evaluere programforløbet på reel oplevelse over tid.
- [ ] Saml løbende feedback fra mobilbrug: navigation, læsbarhed, tempo og friktion i dagens flow.
- [ ] Finpuds Progress, så udviklingen føles tydelig uden at graferne bliver visuelt tunge.
- [ ] Beslut om Home skal være endnu mere fokuseret som daglig indgang til morgenrutinen.
- [x] Verificer manuelt login i lokal app.
- [x] Tilføj tydelig fejlhåndtering i auth- og submit-flows.
- [x] Tilføj server-side validering af check-in og session inputs.
- [x] Tilføj Playwright E2E-tests for login, Daily Pulse og første guided session.

## Next

- [ ] Indfør soft pacing i Foundation 30: anbefal én session om dagen uden at låse næste session hårdt.
- [ ] Gennemgå de første Foundation 30 prompts for at gøre dem mindre tunge eller abstrakte i starten af forløbet.
- [ ] Overvej lettere onboarding-copy, så brugeren ikke møder for store spørgsmål for tidligt.
- [ ] Gennemgå mobiloplevelsen side for side og stram spacing, hierarki og navigation der hvor telefonen stadig føles klemt.
- [ ] Gør Progress mere forklarende med enkel tekstlig feedback, uden at konkurrere med selve grafen.
- [ ] Afklar hvilke ting der skal være robuste, før 2-3 pilotbrugere inviteres ind.
- [x] Læs sessions fra `sessions`-tabellen i stedet for hardcoded data i [`lib/program.ts`](/Users/martintoudal/Documents/Toudal%20Consulting/Domæner/steadymind/lib/program.ts).
- [x] Tilføj tomme states for Progress, Program og Home.
- [x] Forbedr re-entry flow og edge cases omkring inaktivitet.
- [x] Stram auth-beskyttelse og redirect-logik yderligere.
- [x] Tilføj loading og disabled states på formularer.
- [x] Udvid Playwright-suiten med tests for Progress og re-entry flow.

## Later

- [x] Gør projektet klar til Vercel deployment med produktions-env-vars.
- [x] Få appen online på Vercel og verificer login og dataflow i produktion.
- [ ] Kobl `getsteadymind.dk` og `getsteadymind.com` på Vercel, og beslut hvilken der skal være primær app-URL.
- [ ] Tilføj Supabase CLI og et rigtigt migrations-flow.
- [ ] Tilføj enkel testdækning for centrale server actions og page flows ud over de nuværende E2E-tests.
- [ ] Ryd op i data- og UI-laget, så appen er lettere at udvide efter MVP.

## Notes

- Hold `Now` kort og fokuseret. Kun ting der aktivt bør løses snart.
- Flyt punkter ned eller op mellem sektionerne i stedet for at lade listen vokse ukontrolleret.
- Når en opgave er færdig, sæt den til `[x]` i stedet for at slette den med det samme.
