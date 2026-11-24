# Vis regnkart for brukerens område

Request: [larsajakobsen/weather-api#1](https://github.com/larsajakobsen/weather-api/issues/1). Plan: [plan.md](plan.md).

Legg til en side med et regnkart som automatisk viser nedbør akkurat nå for brukerens eget område, slik at de kan planlegge når de bør gå hjem.

## Problem

Folk som skal gå hjem vet ikke om det regner eller er på vei til å regne der de er. Uten enkel oversikt over nedbør risikerer de å gå ut i regnvær de kunne unngått ved å vente litt.

## Goal

Brukeren kan åpne en side som viser et kart over nåværende nedbør for sitt eget område, slik at de kan se om det regner og planlegge når de bør gå hjem.

## Users and access

Alle brukere kan se og bruke regnkartet. Det er ingen begrensninger på tilgang.

## Where to find it

Et nytt menypunkt kalt "Regnkart" i hovedmenyen.

## User flow

1. Brukeren velger "Regnkart" i menyen.
2. Siden åpnes og viser automatisk et kart sentrert på brukerens eget område, med nåværende nedbør markert.
3. Brukeren ser med én gang om det regner i området akkurat nå.
4. Hvis brukerens posisjon ikke kan bestemmes, viser siden en melding om dette og eventuelt et kart over et standardområde.
5. Hvis det ikke finnes nedbørsdata for området, viser siden en melding om at data mangler akkurat nå.

## Acceptance criteria

- [ ] Gitt at en bruker åpner "Regnkart" fra menyen, når siden lastes, så vises et kart sentrert på brukerens eget område med nåværende nedbør markert.
- [ ] Gitt at en hvilken som helst bruker besøker produktet, når de ser menyen, så finner de "Regnkart" uten noen tilgangsbegrensning.
- [ ] Gitt at brukerens posisjon ikke kan bestemmes, når siden lastes, så vises en tydelig melding om at posisjon mangler, i stedet for et tomt eller feilaktig kart.
- [ ] Gitt at det ikke finnes nedbørsdata for brukerens område, når siden lastes, så vises en melding om at data ikke er tilgjengelig akkurat nå.

## Out of scope

Prognose for fremtidig nedbør, søk etter andre steder, og historiske regndata er ikke en del av dette.

## UI sketch

An approved sketch of the screens, drawn in the design system. A reference for layout and placement; the acceptance criteria decide.

- **Regnkart**: Regnkart-siden med et større kart, sentrert på brukerens område med nåværende nedbør.

[Open the sketch](http://localhost:5173/mockups/46387006-5c2a-4e11-84cd-f630f5755ad2)

---
Requested by lars.alexander.jakobsen\@novanet.no via Agent Factory chat (policy 0.6).
