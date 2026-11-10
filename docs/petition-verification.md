# Petition verification — 2026-11-10 UTC

## Limitations and flags

- Initial research-tool requests could not retrieve “Remove Chuck Schumer for a younger leader.” A direct request subsequently succeeded; its count is 490. None remained inaccessible at the final check.
- No duplicate destination URLs or redirects to another petition were observed. Similar advocacy topics are not treated as duplicates. No closed-petition notice was observed in the retrieved pages; availability can change, and signing functionality was not tested.
- Cached research-tool results differed from the later direct checks (for example, the House “CHOOSE A NEW SPEAKER” page showed 1,112,361 in cached evidence versus 1,112,820 directly; “Stop Chuck Schumer…” showed 18,036 versus 19,287). Only the direct-check totals below are stored. Totals may change between requests.
- Majority-leader wording in the Senate titles, predictions about future leadership, and claims about election outcomes/control should not be read as independently verified facts. In particular, “Replace Chuck Schumer as Senate Majority Leader,” “Stop Chuck Schumer…,” “Dems Must Fire…,” and “REPLACE SCHUMER AND JEFFERIES…” contain election/majority claims not verified by this metadata review. The Senate “CHOOSE…” page discusses January 2027 leadership selection while the “Replace…” page refers to a possible vote this month; this timing difference needs separate verification if repeated as fact by the application.
- Other allegations in the petition bodies (including employment losses, donations, policy records, and foreign affairs) were not fact-checked. Existing neutral directory descriptions and all political positions are preserved; the application does not reproduce those allegations as factual metadata.
- “Lindsey Graham” is the organizer display name on the “Oppose Hakeem Jeffries for Speaker…” page, not a verified identification of a senator. “Alvin(his daughter works for openAI) Spade(Check those donations)” is also a verbatim display name, not a verified affiliation or factual assertion by this application.
- The House “CHOOSE…” page discloses that Nicole Whitted is a compensated Change Ambassador. This does not establish endorsement by this application.
- The title and URL for “REPLACE SCHUMER AND JEFFERIES AS DEM LEADERSHIP” retain the original spelling. Existing slugs were not corrected or replaced.

## Maintenance

Keep original petition URLs and IDs stable. Record verified titles without rewriting advocacy. `verification` applies to the title/destination and reported organizer name, not the truth of the petition body. Recheck the exact page and distinguish total signatures from comments, goals, and daily signatures. Set `signatures`, `checkedAt` (UTC review date), `signatureSourceUrl`, and `signatureVerification` together. Use `direct`, `cached`, or `third-party` to identify the evidence actually reviewed; a cached review date is not necessarily the date its underlying count was captured. Document that distinction and any conflicting evidence here. Never use a search snippet as a live count. Omit unavailable counts and their count-check dates instead of using zero or inventing a date.

`src/lib/petitions.ts` sorts complete, nonnegative integer count snapshots descending, followed by unavailable/unverified counts. Stable ID ascending breaks ties and orders unknowns independently of array order or browser locale. Zero is a known count. Sorting copies the array and occurs before filtering. Cards display evidence type, date, and source; totals are not fetched or updated at runtime. The existing theme, external-link behavior and privacy model remain unchanged. No new dependencies are required.

## Direct-check inventory

All ten URLs returned HTTP 200 at their original destination during direct HTTPS requests. Titles were read from page headings; organizer display names and displayed signature totals were read from the page response. This is metadata verification, not verification of organizer identity, signers, or advocacy claims. No signatures or other submissions were sent.

Counts below were checked on 2026-11-10 UTC (November 9 in Pacific time). They are static snapshots from directly retrieved Change.org pages, not live totals, search snippets, or third-party estimates. The linked petition is the source for each row.

| Verified title / original URL and source | Organizer display name | Signatures |
|---|---|---:|
| [Remove Chuck Schumer and Hakeem Jeffries from leadership roles](https://www.change.org/p/remove-chuck-schumer-and-hakeem-jeffries-from-leadership-roles) | Igetitgirl Blue | 27,928 |
| [Replace Chuck Schumer as Senate Majority Leader](https://www.change.org/p/replace-chuck-schumer-as-senate-majority-leader) | Laura Ciocia | 192,093 |
| [Remove Chuck Schumer for a younger leader](https://www.change.org/p/remove-chuck-schumer-for-a-younger-leader) | Amber J Bolden | 490 |
| [House Democrats:  CHOOSE A NEW SPEAKER](https://www.change.org/p/house-democrats-choose-a-new-speaker) | Nicole Whitted | 1,112,820 |
| [Oppose Hakeem Jeffries for Speaker of the House](https://www.change.org/p/oppose-hakeem-jeffries-for-speaker-of-the-house) | Lindsey Graham | 160,319 |
| [Dems Must Fire Jeffries and Schumer](https://www.change.org/p/dems-must-fire-jeffries-and-schumer) | Sons Of Liberty | 72,386 |
| [REPLACE SCHUMER AND JEFFERIES AS DEM LEADERSHIP](https://www.change.org/p/replace-schumer-and-jefferies-as-dem-leadership) | Aiden Farley | 12,002 |
| [Oppose Hakeem Jeffries and Chuck Schumer as leaders](https://www.change.org/p/oppose-hakeem-jeffries-and-chuck-schumer-as-leaders) | Stacy Kelly | 6,367 |
| [Senate Democrats: CHOOSE A NEW MAJORITY LEADER](https://www.change.org/p/senate-democrats-choose-a-new-majority-leader) | Chris Sader | 111,499 |
| [Stop Chuck Schumer from becoming Senate Majority Leader](https://www.change.org/p/stop-chuck-schumer-from-becoming-senate-majority-leader) | Alvin(his daughter works for openAI) Spade(Check those donations) | 19,287 |
