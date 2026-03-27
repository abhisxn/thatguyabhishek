export const AWARD_YEARS = [
  {
    year: '2025',
    awards: [
      { tier: 'Certificate', project: 'AI powered Insights for Excel Charts', festival: 'Microsoft' },
      { tier: 'Certificate', project: 'Successful hosting of UX Day event',    festival: 'Microsoft' },
    ],
  },
  {
    year: '2023',
    awards: [
      { tier: 'Certificate',         project: 'Solving for Gig Interviews with Live Rooms', festival: 'GoodWorker'  },
      { tier: 'Brand Collaboration', project: 'Planty × Microsoft for CXO events',          festival: 'ThinkPlanty' },
    ],
  },
  {
    year: '2020',
    awards: [
      { tier: 'Certificate', project: 'Launch of Airtel Thanks 2.0', festival: 'Airtel HQ' },
      { tier: 'Certificate', project: 'Growth Playbook',              festival: 'Airtel HQ' },
    ],
  },
  {
    year: '2018',
    awards: [
      { tier: 'Certificate', project: 'Benefits Crossroads Portal', festival: 'Avizva' },
    ],
  },
  {
    year: '2016',
    awards: [
      { tier: 'Winner · $40K',    project: 'Watchlyst',                                    festival: 'Facebook Startup Accelerator' },
      { tier: 'Bronze',           project: 'Happy Hours Rewind — Best Use of Merchandising', festival: "Adfest '16"                  },
      { tier: 'Honoree',          project: 'Distruct-o-matic',                              festival: 'Webby Awards'                 },
    ],
  },
  {
    year: '2015',
    awards: [
      { tier: 'Gold · Silver · 2× Bronze', project: 'Happy Hours Rewind',                             festival: "Goafest '15"              },
      { tier: 'Gold',                      project: "Lia's HoHoHo — A Christmas Carol",                festival: 'The Communicator Awards'  },
      { tier: 'Gold',                      project: 'Happy Hours Rewind',                             festival: 'W3 Awards'                },
      { tier: 'Blue Elephant',             project: 'Happy Hours Rewind — Innovative Use of Technology', festival: 'Kyoorius'              },
      { tier: 'WebTV',                     project: 'Happy Hours Rewind',                             festival: 'The FWA'                  },
    ],
  },
  {
    year: '2014',
    awards: [
      { tier: 'Silver',                   project: 'Distruct-o-matic — Best Brand Campaign', festival: "Goafest '14" },
      { tier: 'Gold · Silver · Bronze',   project: 'Distruct-o-matic',                       festival: 'PromaxBDA'   },
    ],
  },
  {
    year: '2013',
    awards: [
      { tier: 'Bronze',           project: 'Peeloo',                                     festival: "Adfest '13"          },
      { tier: 'Mobile of the Day', project: 'Peeloo',                                    festival: 'The FWA'             },
      { tier: 'Shortlist',        project: 'Peeloo — Best Website',                      festival: 'Spikes Asia'         },
      { tier: 'Bronze',           project: 'Interactive Lotus — Best Use of Technology', festival: "Adfest '13"          },
      { tier: 'Gold',             project: 'Harmonium Love Banner',                      festival: 'CI Digital Crest Awards' },
      { tier: 'Gold',             project: 'Harmonium Love — Best Website',              festival: 'WAT Awards'          },
    ],
  },
  {
    year: '2012',
    awards: [
      { tier: 'Gold',      project: 'Agency Hackathon',                    festival: 'Yahoo'        },
      { tier: 'Gold',      project: 'Agency of the Year',                  festival: 'Olive Green'  },
      { tier: 'Gold',      project: 'Young Green Art Director of the Year', festival: 'Olive Crowne' },
      { tier: 'Shortlist', project: 'Harmonium Love',                      festival: 'Spikes Asia'  },
    ],
  },
  {
    year: '2011',
    awards: [
      { tier: 'Silver',      project: 'Project Freedom',              festival: 'Yahoo Big Chair Awards' },
      { tier: 'Merit Award', project: 'HBO Hung Series',              festival: "OneShow '11"             },
      { tier: 'Certificate', project: 'Commonwealth Games — Designer', festival: "CWG '10"               },
    ],
  },
];

export const MENTIONS = [
  { source: 'The FWA',                  headline: 'Peeloo — Interactive Loo Service' },
  { source: 'Campaign India',           headline: "Webchutney's 'Y! Loo' wins Yahoo agency hack contest" },
  { source: 'Adfest',                   headline: 'Taproot India crowned Agency of the Year, brings home 11 metals' },
  { source: 'Exchange4media',           headline: 'Goafest 2015: Webchutney wins only Gold in Digital Abbys' },
  { source: 'Brand Equity',             headline: 'Agency Reckoner 2015–16: Dentsu Webchutney walks away as No. 1 digital agency' },
  { source: 'Promax',                   headline: 'Search Award Winners' },
  { source: 'Spikes Asia',              headline: 'Spikes Asia 2015 — India' },
  { source: 'Campaign India',           headline: "Webchutney powers Anger Management with 'Destruct-O-Matic' App" },
  { source: 'Kyoorius',                 headline: 'Kyoorius Awards 2014 — Digital & Interactive' },
  { source: 'Ads of the World',         headline: "Webchutney: Peeloo — When nature comes calling" },
  { source: 'The Hindu BusinessLine',   headline: "Nokia wins 'Advertiser of the Year' at Olive Crowns" },
  { source: 'ThinkPlanty',              headline: 'Think Planty & Make These Little Potted Plants Your Go-To Gift' },
  { source: 'MxMIndia',                 headline: 'Taproot is Agency of the Year at Adfest 2013' },
  { source: 'Economic Times',           headline: 'BE Agency Reckoner 2014: OgilvyOne tops the Digital chart' },
];

export function getTierStyle(tier) {
  if (tier.startsWith('Gold'))
    return { bg: 'rgba(251,191,36,0.12)',  color: '#ca8a04', border: 'rgba(202,138,4,0.4)'   };
  if (tier.startsWith('Silver'))
    return { bg: 'rgba(148,163,184,0.1)',  color: '#64748b', border: 'rgba(100,116,139,0.35)' };
  if (tier.startsWith('Bronze'))
    return { bg: 'rgba(180,83,9,0.10)',    color: '#b45309', border: 'rgba(180,83,9,0.35)'   };
  if (['Winner · $40K', 'Blue Elephant', 'WebTV', 'Mobile of the Day'].includes(tier))
    return { bg: 'rgba(72,57,202,0.10)',   color: '#4839ca', border: 'rgba(72,57,202,0.35)'  };
  return { bg: 'var(--surface)', color: 'var(--fg-muted)', border: 'var(--border)' };
}
