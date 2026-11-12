export type ResearchSource = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  kind: 'primary' | 'secondary';
  date?: {value: string; label: string};
  notes?: string;
} & ({status: 'verified'; lastVerified: string} | {status: 'pending'; lastVerified?: never; lastChecked?: string});

export interface ResearchEntry {
  id: string;
  title: string;
  subjects: string[];
  summary: string;
  sources: ResearchSource[];
  limitations?: string;
}
export interface ResearchTopic {
  id: string;
  title: string;
  summary: string;
  status: 'research-in-progress' | 'evidence-available';
  entries: ResearchEntry[];
  limitations?: string;
}
export interface CampaignResearch {
  topics: ResearchTopic[];
  methodology: {id: string; title: string; description: string}[];
}
