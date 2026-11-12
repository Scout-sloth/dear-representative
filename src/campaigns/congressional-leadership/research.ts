import type {CampaignResearch, ResearchTopic} from '../../types/research';
const verified = '2026-11-11';
const pending = (id: string, title: string, summary: string): ResearchTopic => ({id, title, summary, status:'research-in-progress', entries:[]});

export const research: CampaignResearch = {
  topics: [
    pending('healthcare', 'Universal healthcare and Medicare for All', 'Research scope: distinguish universal-coverage goals from support for specific Medicare for All bills. Verify dated sponsorship, votes, and statements before assessing Schumer or Jeffries.'),
    pending('campaign-finance', 'Campaign finance, corporate donors, AIPAC, and J Street', 'Research scope: identify the exact committee, donor, recipient, election cycle, and transaction type before attributing financial support. No verified contribution totals or organizational classifications are published here yet.'),
    {
      id:'defense', title:'Defense spending and NDAA voting records', status:'evidence-available',
      summary:'These records document two specific Senate votes and their legislative context. Authorization legislation should be examined separately from appropriations and actual spending.',
      limitations:'This is not a complete voting history. These votes do not establish that Schumer supported every NDAA, every provision, or any particular motivation. Jeffries’s House voting record requires separate research.',
      entries:[
        {
          id:'senate-2025-648', title:'2025: Senate concurrence in the FY2026 NDAA text', subjects:['Chuck Schumer'],
          summary:'On December 17, 2025, Schumer voted Yea on the motion to concur in the House amendment to S.1071. The motion passed 77–20. This was Senate approval of the House-amended text resolving the chambers’ differences, not cloture or a vote on an individual policy amendment.',
          limitations:'The roll-call page retains an earlier title about a veterans’ cemetery. The enrolled text identifies S.1071 as the National Defense Authorization Act for Fiscal Year 2026. Congress.gov records enactment as Public Law 119-60 on December 18, 2025. This entry verifies the measure’s identity and vote stage, not every provision or a spending total.',
          sources:[
            {id:'vote-648',title:'Senate roll call 648 — motion to concur',url:'https://www.senate.gov/legislative/LIS/roll_call_votes/vote1191/vote_119_1_00648.htm',publisher:'U.S. Senate',kind:'primary',status:'verified',lastVerified:verified,date:{label:'Vote date',value:'2025-12-17'}},
            {id:'s1071-enrolled',title:'S.1071 enrolled text — FY2026 NDAA',url:'https://www.govinfo.gov/content/pkg/BILLS-119s1071enr/html/BILLS-119s1071enr.htm',publisher:'U.S. Government Publishing Office',kind:'primary',status:'verified',lastVerified:verified,notes:'Final enrolled text; section 1 supplies the short title. No publication date is asserted here.'},
            {id:'s1071-actions',title:'S.1071 legislative actions and enactment',url:'https://www.congress.gov/bill/119th-congress/senate-bill/1071/all-actions',publisher:'Congress.gov',kind:'primary',status:'verified',lastVerified:verified,date:{label:'Enactment date',value:'2025-12-18'}},
          ],
        },
        {
          id:'senate-2023-343',title:'2023: FY2024 NDAA conference report',subjects:['Chuck Schumer'],
          summary:'On December 13, 2023, Schumer voted Yea on the conference report accompanying H.R.2670, the FY2024 NDAA. The Senate agreed to the report 87–13. This approved the negotiated conference text; it was not cloture or a standalone amendment vote.',
          limitations:'A conference-report vote is distinct from initial bill passage. Congress.gov records enactment as Public Law 118-31 on December 22, 2023. A vote on the package does not establish a senator’s view of each provision.',
          sources:[
            {id:'vote-343',title:'Senate roll call 343 — conference report',url:'https://www.senate.gov/legislative/LIS/roll_call_votes/vote1181/vote_118_1_00343.htm',publisher:'U.S. Senate',kind:'primary',status:'verified',lastVerified:verified,date:{label:'Vote date',value:'2023-12-13'}},
            {id:'hr2670',title:'H.R.2670 — FY2024 NDAA and enactment',url:'https://www.congress.gov/bill/118th-congress/house-bill/2670',publisher:'Congress.gov',kind:'primary',status:'verified',lastVerified:verified,date:{label:'Enactment date',value:'2023-12-22'}},
          ],
        },
        {
          id:'senate-2015-reference',title:'2015 Senate reference — pending verification',subjects:['Chuck Schumer'],
          summary:'Research in progress. The supplied GovTrack page could not be retrieved during review. The measure, vote stage, date, and individual voting position have not been confirmed from this reference.',
          sources:[{id:'govtrack-2015',title:'GovTrack: supplied 2015 Senate vote reference',url:'https://www.govtrack.us/congress/votes/114-2015/s301',publisher:'GovTrack',kind:'secondary',status:'pending',lastChecked:verified,notes:'A research lead only; not evidence for a voting claim until its contents are confirmed.'}],
        },
      ],
    },
    pending('immigration', 'Immigration enforcement and ICE', 'Research scope: separate agency funding votes, enforcement legislation, oversight actions, and public statements. Dated evidence for Schumer and Jeffries is still needed.'),
    pending('progressive-candidates', 'Support for progressive candidates', 'Research scope: define the candidate set and election period, then distinguish endorsements, contributions, independent spending, and campaign appearances. Lack of a located endorsement is not proof of opposition.'),
    pending('public-opinion', 'Public approval and favorability', 'Research scope: collect original polls with field dates, population, question wording, and methodology. Approval and favorability are different measures; no current rating is asserted here.'),
    pending('climate', 'Climate policy and leadership', 'Research scope: verify legislation, votes, oversight, and dated statements before assessing leadership. Distinguish enacted provisions from proposals and implementation outcomes.'),
  ],
  methodology:[
    {id:'votes',title:'Recorded votes versus political assessments',description:'Record the exact question, bill version, chamber, and date. Distinguish final passage, concurrence, conference reports, cloture, and amendments. Treat assessments of leadership or motivation as interpretations requiring additional evidence.'},
    {id:'money',title:'Contributions versus independent expenditures',description:'Keep direct campaign contributions separate from independently reported spending supporting or opposing candidates. Identify the reporting entity and cycle; do not combine corporate PAC money, individual employees’ donations, and outside spending into a single unlabeled donor total.'},
    {id:'affiliations',title:'Affiliations versus foreign-agent status',description:'Do not infer foreign-agent status from an endorsement, organizational association, or policy alignment. Any such classification requires separately verified evidence and a precise explanation of what that evidence establishes.'},
    {id:'polls',title:'Dated polling versus current public opinion',description:'Report field dates, question wording, population, pollster, and uncertainty. Do not present a historical poll as a current rating or treat different approval and favorability questions as interchangeable.'},
    {id:'absence',title:'Limits of proving an absence of action',description:'Describe the sources and period searched. “Not found in the reviewed records” does not establish that an action never occurred. Avoid “always” or “never” claims from a selective record.'},
  ],
};
